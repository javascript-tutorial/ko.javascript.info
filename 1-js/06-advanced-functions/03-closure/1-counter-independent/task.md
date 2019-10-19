importance: 5

---

# counter는 독립적일까요?

`makeCounter`를 사용해 두 개의 conuter `counter`와 `counter2`를 만들었습니다.

두 counter는 독립적일까요? 두 번째 카운터는 `0, 1`이나 `2, 3`중 어떤 숫자를 얼럿창에 띄워줄까요? 다른 결과가 출력될까요?

```js
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();
let counter2 = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1

*!*
alert( counter2() ); // ?
alert( counter2() ); // ?
*/!*
```

