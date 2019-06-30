importance: 5

---

# Partial 로그인 애플리케이션

이번 과제는 <info:task/question-use-bind>를 조금 더 복잡하게 변형한 것입니다.

`user` 객체는 수정되었습니다. 이제 두 개의 `loginOk / loginFail`함수 대신 `user.login (true / false)` 라는 단일 함수를 가지고 있습니다.

아래 코드에서 `askPassword` 를 어떻게 넘겨주면 `user.login (true)`를 `ok`로 호출하고 `user.login (false)`로 `fail`을 호출할 수 있을까요?

```js
function askPassword(ok, fail) {
  let password = prompt("Password?", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  login(result) {
    alert( this.name + (result ? ' logged in' : ' failed to log in') );
  }
};

*!*
askPassword(?, ?); // ?
*/!*
```

오직 강조된 부분만 변경해서 풀어보세요.

