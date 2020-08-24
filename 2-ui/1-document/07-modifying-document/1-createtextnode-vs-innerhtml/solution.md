정답: **1 과 3**.

두 명령어는 `text`를 '텍스트로' `elem` 안에 추가합니다.

예시:

```html run height=80
<div id="elem1"></div>
<div id="elem2"></div>
<div id="elem3"></div>
<script>
  let text = '<b>text</b>';

  elem1.append(document.createTextNode(text));
  elem2.innerHTML = text;
  elem3.textContent = text;
</script>
```
