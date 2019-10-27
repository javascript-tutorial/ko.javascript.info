importance: 5

---

# 이상한 instanceof

아래의 `instanceof`는 왜 `true`를 반환하나요? `a`가 `B()`에 의해 만들어지지 않았다는 걸 쉽게 확인할 수 있습니다.

```js run
function A() {}
function B() {}

A.prototype = B.prototype = {};

let a = new A();

*!*
alert( a instanceof B ); // true
*/!*
```
