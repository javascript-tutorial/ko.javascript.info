
fetch를 통해 사용자 정보를 가져오려면 `fetch('https://api.github.com/users/사용자명')`를 사용해야 합니다.

응답 상태 코드가 `200`이면 `.json()`을 호출해 객체를 읽습니다.

반면 `fetch`가 실패하거나 응답 상태 코드가 200이 아니라면 `null`을 리턴하고 배열에 담아야 합니다.

답안은 아래와 같습니다.

```js demo
async function getUsers(names) {
  let jobs = [];

  for(let name of names) {
    let job = fetch(`https://api.github.com/users/${name}`).then(
      successResponse => {
        if (successResponse.status != 200) {
          return null;
        } else {
          return successResponse.json();
        }
      },
      failResponse => {
        return null;
      }
    );
    jobs.push(job);
  }

  let results = await Promise.all(jobs);

  return results;
}
```

`.then`은 `fetch` 직후 호출되므로 응답이 도착하면 다른 fetch를 기다리는 대신 곧바로 `.json()`으로 응답을 읽기 시작한다는 것을 기억하세요.

`await Promise.all(names.map(name => fetch(...)))`의 반환값을 대상으로 `.json()`을 호출한다면 모든 fetch 응답이 완료되기 전까지 기다려야 합니다. 대신 각 `fetch`마다 `.json()`을 호출하면 다른 fetch 응답을 기다리지 않으면서 JSON 형식으로 데이터를 읽을 수 있습니다.

이 예제를 통해 비록 `async-await`을 주로 사용하더라도 여전히 하위 수준의 프라미스(Promise) API가 유용하게 사용될 수 있음을 알 수 있습니다.