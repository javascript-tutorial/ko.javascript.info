
# if 문 안의 함수

아래 예시의 실행 결과를 예측해보세요.

```js run
let phrase = "Hello";

if (true) {
  let user = "John";

  function sayHi() {
    alert(`${phrase}, ${user}`);
  }
}

*!*
sayHi();
*/!*
```
