당연히 에러 없이 실행됩니다.

`const`는 한 번이라도 값을 할당한 변수가 변경되는 걸 막습니다.

변수 `user`는 객체 참조 값을 저장하고 있는데, `const`는 이 값이 변경되는걸 막는 것이지, 객체의 내용(프로퍼티)을 변경하는 건 막지 않습니다.

```js run
const user = {
  name: "John"
};
*!*
// works
user.name = "Pete";
*/!*
// error
user = 123;
```
