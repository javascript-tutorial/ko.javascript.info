**에러**가 발생합니다!

코드를 직접 실행해봅시다.

```js run
let user = {
  name: "John",
  go: function() { alert(this.name) }
}

(user.go)() // error!
```

The error message in most browsers does not give us much of a clue about what went wrong.

**에러는 `user = {...}`뒤에 세미콜론이 없어서 발생했습니다.**

자바스크립트는 괄호(`(us...` ) 앞엔 세미콜론을 자동으로 넣어주지 않습니다. 따라서 코드는 아래와 같아집니다.

```js no-beautify
let user = { go:... }(user.go)()
```

Then we can also see that such a joint expression is syntactically a call of the object `{ go: ... }` as a function with the argument `(user.go)`. And that also happens on the same line with `let user`, so the `user` object has not yet even been defined, hence the error.

`user = {...}`뒤에 세미콜론을 붙여서 에러를 해결해봅시다.

```js run
let user = {
  name: "John",
  go: function() { alert(this.name) }
}*!*;*/!*

(user.go)() // John
```

참고로, `(user.go)` 에서 주위를 감싸고 있는 괄호는 아무런 역할을 하지 않습니다. 괄호는 대게 연산자 우선순위를 바꾸는 데 사용되는데, `(user.go)`에선 점 `.` 연산자가 먼저 동작하기 때문에 의미가 없습니다. 문제 출제 의도는 세미콜론 여부였습니다.
