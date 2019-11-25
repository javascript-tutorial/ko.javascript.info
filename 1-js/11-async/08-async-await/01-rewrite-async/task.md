
# async와 await를 사용하여 코드 변경하기

<<<<<<< HEAD
<info:promise-chaining> 챕터의 예시 중 하나를 `.then/catch` 대신 `async/await`를 사용해 다시 작성해봅시다.
=======
Rewrite this example code from the chapter <info:promise-chaining> using `async/await` instead of `.then/catch`:
>>>>>>> 79417c6e73645d37f184f0cc7e4bc3353e85224f

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

loadJson('no-such-user.json') // (3)
  .catch(alert); // Error: 404
```
