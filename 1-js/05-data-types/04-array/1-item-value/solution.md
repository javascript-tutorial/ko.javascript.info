정답은 `4`입니다.


```js run
let fruits = ["사과", "배", "오렌지"];

let shoppingCart = fruits;

shoppingCart.push("바나나");

*!*
alert( fruits.length ); // 4
*/!*
```

배열은 객체이기 때문에 `shoppingCart`와 `fruits`는 모두 같은 배열을 참조합니다.
