importance: 3

---

# 주석 안의 태그

스크립트를 실행 결과를 예측해보세요.

```html
<script>
  let body = document.body;

  body.innerHTML = "<!--" + body.tagName + "-->";

  alert( body.firstChild.data ); // 얼럿 창엔 어떤 내용이 출력될까요?
</script>
```
