함정이 있는 문제였습니다.

`<script>`가 실행되는 시점엔 브라우저가 `<script>` 아래에 있는 문서를 처리하지 못했기 때문에 가장 마지막 DOM 노드는 `<script>` 자기 자신입니다.

따라서 얼럿창엔 `1`(요소 노드)이 출력됩니다.

```html run height=60
<html>

<body>
  <script>
    alert(document.body.lastChild.nodeType);
  </script>
</body>

</html>
```
