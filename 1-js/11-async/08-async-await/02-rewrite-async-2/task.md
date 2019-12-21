
# async와 await를 사용해서 '다시 던지기' 예시 재작성하기

<info:promise-chaining> 챕터에서 다뤘던 '다시 던지기(rethrow)' 관련 예시를 기억하실 겁니다. 이 예시를 `.then/catch` 대신 `async/await`를 사용해 다시 작성해 봅시다.

그리고 `demoGithubUser` 안의 반복(recursion)은 반복문(loop)을 사용해 작성하도록 합시다. `async/await`를 사용하면 쉽게 작성할 수 있습니다.

```js run
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

function loadJson(url) {
  return fetch(url)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new HttpError(response);
      }
    })
}

// 유효한 사용자를 찾을 때까지 반복해서 username을 물어봄
function demoGithubUser() {
  let name = prompt("GitHub username을 입력하세요.", "iliakan");

  return loadJson(`https://api.github.com/users/${name}`)
    .then(user => {
      alert(`이름: ${user.name}.`);
      return user;
    })
    .catch(err => {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("일치하는 사용자가 없습니다. 다시 입력해 주세요.");
        return demoGithubUser();
      } else {
        throw err;
      }
    });
}

demoGithubUser();
```
