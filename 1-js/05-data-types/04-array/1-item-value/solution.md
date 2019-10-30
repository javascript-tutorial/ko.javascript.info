정답은 `4`입니다.


```js run
let fruits = ["Apples", "Pear", "Orange"];

let shoppingCart = fruits;

shoppingCart.push("Banana");

*!*
alert( fruits.length ); // 4
*/!*
```

배열은 객체이기 때문입니다. 따라서 `shoppingCart`와 `fruits`는 모두 같은 배열을 참조합니다.

