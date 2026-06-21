importance: 5

---

# 확장 단축키

함수 `runOnKeys(func, code1, code2, ... code_n)`를 만듭니다. 함수 runOnKeys는 `code1`, `code2`, ..., `code_n`이 있는 키를 동시에 누를 때 `func`를 실행하는 함수입니다.

예를 들어 아래 코드는 `"Q"` 와 `"W"` 를 함께 누르면 `alert` 창이 표시됩니다(CapsLock 사용 여부에 관계없이 모든 언어에서 표시됨).

```js no-beautify
runOnKeys(
  () => alert("Hello!"),
  "KeyQ",
  "KeyW"
);
```

[demo src="solution"]
