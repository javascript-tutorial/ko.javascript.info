
# if문 안의 함수

코드를 보세요. 마지막 줄의 호출 결과는 무엇일까요?

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
