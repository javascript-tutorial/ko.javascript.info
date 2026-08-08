importance: 5

---

# 모달 폼 (Modal Form)

메시지 `html`, 입력 필드(input field), 확인(OK) 및 취소(Cancel) 버튼을 갖춘 폼을 나타내는 함수 `showPrompt(html, callback)`을 생성하세요.

- 사용자가 텍스트 필드에 무언가를 입력하고 `key:Enter` 혹은 OK 버튼을 누르면 입력한 값으로 `callback(value)`이 호출됩니다.
- 반면에 사용자가 `ESC`키나 취소(Cancel) 버튼을 누르면 `callback(null)`이 호출됩니다.

두 경우 모두 입력 프로세스가 종료하고 양식을 제거합니다.

요구 사항:

- 폼은 창 중앙에 있어야 합니다.
- 폼은 '모달'이므로 사용자가 폼을 닫을 때까지 페이지의 나머지 부분과 상호 작용이 불가능합니다.
- 폼이 표시될 때 사용자의 `<input>` 내부에 포커스가 있어야 합니다.
- `Tab`키, `Shift+Tab`키는 폼 필드 내에서만 포커스를 이동할 수 있어야 하며, 페이지의 다른 요소로는 이동하지 않아야 합니다.

사용 예:

```js
showPrompt("Enter something<br>...smart :)", function(value) {
  alert(value);
});
```

iframe 데모입니다.

[iframe src="solution" height=160 border=1]

참고: 원본 문서에는 `position: fixed;`로 정의한 폼에 대한 HTML·CSS가 있지만 모달을 만드는 것은 사용자의 몫입니다.
