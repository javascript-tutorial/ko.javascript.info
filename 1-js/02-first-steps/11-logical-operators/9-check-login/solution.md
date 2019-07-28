

```js run demo
let userName = prompt("사용자 이름을 입력해주세요.", '');

if (userName == 'Admin') {

  let pass = prompt('비밀번호:', '');

  if (pass == 'TheMaster') {
    alert( '환영합니다!' );
  } else if (pass == '' || pass == null) {
    alert( '취소되었습니다.' );
  } else {
    alert( '인증에 실패하였습니다.' );
  }

} else if (userName == '' || userName == null) {
  alert( '취소되었습니다.' );
} else {
  alert( "인증되지 않은 사용자입니다." );
}
```

`if` 블록 안쪽의 들여쓰기를 주의 깊게 봐주세요. 들여쓰기는 필수가 아니지만, 코드 가독성을 높이는 데 도움을 줍니다.