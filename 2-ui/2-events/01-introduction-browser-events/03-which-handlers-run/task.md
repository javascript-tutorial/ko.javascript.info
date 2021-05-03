중요도: 5

---

# 어떤 핸들러가 실행될까요?

변수에 버튼이 들어있습니다. 아직 핸들러는 없습니다.

아래 코드 다음에 클릭 시 어떤 핸들러가 실행될까요? 어떤 alert창이 표시될까요?

```js no-beautify
button.addEventListener("click", () => alert("1"));

button.removeEventListener("click", () => alert("1"));

button.onclick = () => alert(2);
```
