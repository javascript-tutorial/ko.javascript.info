# HTML 주석들을 찾아보세요.

문자열에서 모든 HTML 주석들을 찾아보세요.

```js
let regexp = /your regexp/g;

let str = `... <!-- My -- comment
 test --> ..  <!----> .. 
`;

alert( str.match(regexp) ); // '<!-- My -- comment \n test -->', '<!---->'
```
