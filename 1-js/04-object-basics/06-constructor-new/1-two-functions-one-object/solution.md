네, 가능합니다.

두 함수 모두 `this` 대신에 객체를 반환하게 하면 됩니다.

아래 예시에선 함수 외부에서 정의한 객체 `obj`를 반환하도록 했습니다.

```js run no-beautify
let obj = {};

function A() { return obj; }
function B() { return obj; }

alert( new A() == new B() ); // true
```
