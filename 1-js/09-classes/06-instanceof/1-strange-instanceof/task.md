importance: 5

---

# 이상한 instanceof

아래 예시에서 `a`는 `B()`를 통해 생성하지 않았습니다. 그런데도 `instanceof`는 왜 `true`를 반환할까요? 

```js run
function A() {}
function B() {}

A.prototype = B.prototype = {};

let a = new A();

*!*
alert( a instanceof B ); // true
*/!*
```
