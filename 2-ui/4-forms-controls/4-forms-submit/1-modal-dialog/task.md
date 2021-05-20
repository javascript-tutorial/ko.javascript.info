importance: 5

---

# 모달 폼

함수 `showPrompt(html, callback)`를 생성하세요. 함수 showPrompt는 메시지 `html`, 입력 필드 및 `OK·CANCEL`버튼이 있는 폼을 표시하는 함수입니다.

- 사용자가 텍스트 필드에 무언가를 입력하고 `key:Enter` 혹은 OK 버튼을 누르면 입력한 값으로 `callback(value)`이 호출됩니다.
- 그렇지 않으면 사용자가 `key:Esc`혹은 CANCEL 버튼을 누르면 `callback(null)`이 호출됩니다.

두 경우 모두 입력 프로세스가 종료하고 양식을 제거합니다.

요구 사항:

- 폼은 창 중앙에 있어야 합니다.
- 폼은 '모달'입니다. 즉, 사용자가 페이지를 닫을 때까지 페이지의 나머지 부분과 상호 작용이 불가능합니다.
- 폼이 표시될 때 사용자의 `<input>` 내부에 포커스가 있어야 합니다.
- `key:Tab`·`key:Shift+Tab`은 폼 필드 간에 포커스를 이동해야 하며, 다른 페이지 요소로 이동하지 않도록 합니다.
사용 예:

```js
showPrompt("Enter something<br>...smart :)", function(value) {
  alert(value);
});
```

iframe 데모입니다.

[iframe src="solution" height=160 border=1]

참고: 원본 문서에는 고정된 위치를 가진 폼에 대한 HTML·CSS가 있지만 모달로 만드는 것은 사용자의 몫입니다.
