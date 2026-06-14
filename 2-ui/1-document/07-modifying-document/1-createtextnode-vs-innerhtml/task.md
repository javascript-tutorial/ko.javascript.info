importance: 5

---

# createTextNode vs innerHTML vs textContent

빈 DOM 요소 `elem`과 `text`라는 문자열이 있습니다.

셋 중에서 같은 동작을 수행하는 명령어는 무엇일까요?

1. `elem.append(document.createTextNode(text))`
2. `elem.innerHTML = text`
3. `elem.textContent = text`
