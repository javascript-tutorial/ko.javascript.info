importance: 5

---

# this 잃어버리는것을 물어보기

다음 코드의 `askPassword()`를 호출하면 패스워드를 체크하고 답에 따라 `user.loginOk/loginFail`를 호출 해야합니다.

그러나 여기서 에러가 발생할것 입니다. 왜일까요?

강조된 부분만 수정해서 모든게 제대로 작동하도록 수정해보세요 (다른 라인들이 수정되면 안됩니다).

```js run
function askPassword(ok, fail) {
  let password = prompt("Password?", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  loginOk() {
    alert(`${this.name} logged in`);
  },

  loginFail() {
    alert(`${this.name} failed to log in`);
  },

};

*!*
askPassword(user.loginOk, user.loginFail);
*/!*
```


