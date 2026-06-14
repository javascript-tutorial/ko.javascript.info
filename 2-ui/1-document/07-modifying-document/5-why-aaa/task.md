importance: 1

---

# 왜 'aaa' 가 남아 있을까요

아래 예시에서는 `table.remove()` 가 호출되었으니 문서에서 표를 삭제해야만 합니다.

그러나 이 코드를 실행해보면, 텍스트 `'aaa'` 가 여전히 나타나는 것을 확인할 수 있습니다.

왜 이런 일이 일어나는 걸까요?

```html height=100 run
<table id="table">
  aaa
  <tr>
    <td>Test</td>
  </tr>
</table>

<script>
  alert(table); // table 은 삭제할 표의 id 입니다.

  table.remove();
  // 왜 문서 안에 aaa가 남아 있을까요?
</script>
```
