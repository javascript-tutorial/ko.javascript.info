
에러는 `ask`가 함수 `loginOk`, `loginFail`을 객체 없이 가지고 오기 때문에 발생합니다.

ask는 `loginOk`, `loginFail`을 호출할 때 `this=undefined`라고 자연스레 가정합니다.

`bind` 함수를 사용해 컨텍스트를 고정시켜 봅시다.

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
askPassword(user.loginOk.bind(user), user.loginFail.bind(user));
*/!*
```

이제 잘 동작합니다.

이 외에도 다른 답이 있는데, 아래에서 확인 가능합니다.
```js
//...
askPassword(() => user.loginOk(), () => user.loginFail());
```

이렇게 화살표 함수를 사용하는 방법 또한 대개 잘 동작하며 가독성도 좋습니다.

다만 이 방법은 `askPassword`가 호출*됐으나* 사용자가 프롬프트 대화상자에 값을 제출하고 `() => user.loginOk()`를 호출하기 *전*에 `user` 변수가 바뀌는 등의 복잡한 상황에서는 오작동할 가능성이 있습니다.
