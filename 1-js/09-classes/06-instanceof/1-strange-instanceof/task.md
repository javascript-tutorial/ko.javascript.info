importance: 5
중요도 : 5

---

# Strange instanceof
# instanceof의 이상함

왜 `instanceof`는 `true`를 반환 할까요? 우리는 `a`가 `B()`에 의해 만들어지지 않은 값임을 쉽게 확인 할 수 있습니다.
```js 실행
function A() {}
function B() {}

A.prototype = B.prototype = {};

let a = new A();

*!*
alert( a instanceof B ); // true
*/!*
```
