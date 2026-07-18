importance: 5

---

# 단축키 확장하기

`code1`, `code2`, ..., `code_n` 코드에 해당하는 키를 동시에 누르면 `func`를 실행하는 함수 `runOnKeys(func, code1, code2, ... code_n)`를 만들어 보세요.

예를 들어 아래 코드는 `"Q"`와 `"W"`를 동시에 누르면 `alert` 창을 띄웁니다(언어 설정과 CapsLock 여부와 관계없이 동작합니다)

```js no-beautify
runOnKeys(
  () => alert("안녕하세요!"),
  "KeyQ",
  "KeyW"
);
```

[demo src="solution"]
