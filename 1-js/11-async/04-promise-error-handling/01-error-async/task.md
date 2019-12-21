# setTimeout에서의 에러

아래 예시에서 `.catch`가 트리거 될까요? 이유와 함께 `.catch`가 트리거 될지 안 될지를 맞춰보세요.

```js
new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("에러 발생!");
  }, 1000);
}).catch(alert);
```
