
# 두 번 resolve 하기?


아래 코드의 실행 결과를 예측해보세요.

```js
let promise = new Promise(function(resolve, reject) {
  resolve(1);

  setTimeout(() => resolve(2), 1000);
});

promise.then(alert);
```
