importance: 5

---

# 어떤 핸들러가 실행될까요

변수 안에 버튼이 있지만 버튼 처리를 담당하는 핸들러는 없다고 가정해봅시다. 

이런 코드가 있는 경우에, 버튼 클릭시 실행되는 핸들러는 무엇일까요? 어떤 얼럿 창이 보일까요?

```js no-beautify
button.addEventListener("click", () => alert("1"));

button.removeEventListener("click", () => alert("1"));

button.onclick = () => alert(2);
```
