**`BODY`**가 출력됩니다.

```html run
<script>
  let body = document.body;

  body.innerHTML = "<!--" + body.tagName + "-->";

  alert( body.firstChild.data ); // BODY
</script>
```

차근차근 설명해보겠습니다.

1. `<body>`의 콘텐츠가 `<!--BODY-->`로 대체됩니다. `body.tagName`은  `"BODY"`이기 때문입니다. `tagName`은 항상 대문자라는 점을 잊지 마세요.
2. `<body>`의 콘텐츠가  교체되면서 주석이 유일한 자식 노드가 됩니다. 따라서 `body.firstChild`을 사용해 주석을 얻을 수 있게 됩니다.
3. 주석 노드의 `data` 프로퍼티엔 주석 내용(`<!--...-->` 안쪽의 내용)이 저장됩니다. 따라서 `data` 프로퍼티의 값은 `"BODY"`입니다.
