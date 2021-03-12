importance: 5

---

# SyntaxError 상속

내장된 `SyntaxError` 클래스를 상속하는 `FormatError` 클래스를 만들어 봅시다.

만들어진 클래스에서 `message`, `name`, `stack`를 참조할 수 있어야 합니다.

참고 예시입니다.

```js
let err = new FormatError("formatting error");

alert( err.message ); // formatting error
alert( err.name ); // FormatError
alert( err.stack ); // stack

alert( err instanceof FormatError ); // true
alert( err instanceof SyntaxError ); // true (SyntaxError 클래스를 상속받았기 때문입니다.)
```
