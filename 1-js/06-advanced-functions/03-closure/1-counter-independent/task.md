importance: 5

---

# 카운터는 독립적입니까?

여기서 우리는 두 개의 카운터를 만듭니다 :`counter '와`counter2`는 같은`makeCounter` 함수를 사용합니다.

그들은 독립적입니까? 두 번째 카운터는 무엇을 보여줄 것입니까? `0,1` 또는`2,3` 또는 다른 것?

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

