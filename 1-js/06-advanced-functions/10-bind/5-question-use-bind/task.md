importance: 5

---

# this 값이 undefined인 함수 고치기

아래 함수 `askPassword()`는 비밀번호를 먼저 확인하고 그 결과에 따라 `user.loginOk`나 `user.loginFail`을 호출해야 합니다.

그런데 함수를 호출하면 에러가 발생합니다. 에러는 왜 발생했을까요?

에러가 발생하지 않도록 색칠된 줄을 고쳐보세요. 다른 줄은 바꾸지 않아야 합니다.

```js run
function askPassword(ok, fail) {
  let password = prompt("비밀번호를 입력해주세요.", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  loginOk() {
    alert(`${this.name}님이 로그인하였습니다.`);
  },

  loginFail() {
    alert(`${this.name}님이 로그인에 실패하였습니다.`);
  },

};

*!*
askPassword(user.loginOk, user.loginFail);
*/!*
```
