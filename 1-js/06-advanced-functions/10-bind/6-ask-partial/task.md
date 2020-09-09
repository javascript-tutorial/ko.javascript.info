importance: 5

---

# 로그인에 부분 적용하기

이 과제는 <info:task/question-use-bind>를 변형한 좀 더 복잡한 과제입니다. 

여기서는 `user` 객체를 수정해 user가 `loginOk`, `loginFail` 대신에 오직 하나의 함수 `user.login(true·false)`만 가질 수 있게 해놓았습니다.

`user.login(true)`는 `ok`, `user.login(false)`은 `fail`을 호출하게 하려면 `askPassword`에 무엇을 넘겨줘야 할까요?

```js
function askPassword(ok, fail) {
  let password = prompt("비밀번호를 입력해주세요.", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  login(result) {
    alert( this.name + (result ? ' 로그인 성공' : ' 로그인 실패') );
  }
};

*!*
askPassword(?, ?); // ?
*/!*
```

색칠된 줄의 물음표 부분만 수정해야 합니다.

