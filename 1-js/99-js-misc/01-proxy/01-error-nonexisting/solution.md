# 존재하지 않는 프로퍼티를 읽으려고 할 때 에러 던지기

존재하지 않는 프로퍼티 값을 읽으려고 하면 보통은 `undefined`가 반환됩니다.

`undefined` 대신 에러를 던지는 프락시를 만들어봅시다.

이렇게 해 놓으면 프로그래밍 중에 저지르는 실수를 미연에 방지할 수 있을 겁니다.

객체 `target`을 받는 함수 `wrap(target)`를 만들고 위에서 언급한 기능을 구현하여 함수 `wrap(target)`이 프락시를 반환하도록 해보세요.

함수는 아래와 같이 동작해야 합니다.

```js
let user = {
  name: "John"
};

function wrap(target) {
  return new Proxy(target, {
*!*
      /* 여기에 코드를 작성하세요. */
*/!*
  });
}

user = wrap(user);

alert(user.name); // John
*!*
alert(user.age); // Error: Property doesn't exist
*/!*
```
