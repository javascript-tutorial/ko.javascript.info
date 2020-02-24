
# async와 await를 사용하여 코드 변경하기

<<<<<<< HEAD
<info:promise-chaining> 챕터의 예시 중 하나를 `.then/catch` 대신 `async/await`를 사용해 다시 작성해봅시다.
=======
Rewrite this example code from the chapter <info:promise-chaining> using `async/await` instead of `.then/catch`:
>>>>>>> 405150f1f286db19a3c1ed913fa3e905fcefbe46

```js run
function loadJson(url) {
  return fetch(url)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
}

loadJson('no-such-user.json')
  .catch(alert); // Error: 404
```
