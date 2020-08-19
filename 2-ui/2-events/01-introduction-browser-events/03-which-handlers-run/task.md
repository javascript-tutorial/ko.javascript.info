중요도: 5

---

# 어떤 핸들러가 실행될까요?

변수에 버튼이 있습니다. 여기에 핸들러는 없습니다.

다음 코드 클릭 후 어떤 핸들러가 실행되나요? 어떤 경고가 출력 되나요?

```js no-beautify
button.addEventListener("클릭해 주세요.", () => alert("1"));

button.removeEventListener("클릭해 주세요.", () => alert("1"));

button.onclick = () => alert(2);
```
