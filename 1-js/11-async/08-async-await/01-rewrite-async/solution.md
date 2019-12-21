
자세한 설명은 아래에서 확인할 수 있습니다.

```js run
async function loadJson(url) { // (1)
  let response = await fetch(url); // (2)

  if (response.status == 200) {
    let json = await response.json(); // (3)
    return json;
  }

  throw new Error(response.status);
}

loadJson('no-such-user.json')
  .catch(alert); // Error: 404 (4)
```

설명:

1. 함수 `loadJson`은 `async` 함수가 됩니다.
2. 함수 안의 `.then`을 전부 `await`로 바꿉니다.
3. 위 답안처럼 `await`를 사용해도 되지만, 아래처럼 `return response.json()`를 사용해도 됩니다.

    ```js
    if (response.status == 200) {
      return response.json(); // (3)
    }
    ```

    대신, 이렇게 작성하면 프라미스가 이행되는걸 `await`를 사용해 바깥 코드에서 기다려야 합니다. 위 예시는 해당 사항이 없지만 말이죠.
4. `loadJson`에서 던져진 에러는 `.catch`에서 처리됩니다. `loadJson`을 호출하는 코드는 `async` 함수 내부가 아니기 때문에 `await loadJson(…)`을 사용할 수 없습니다.
