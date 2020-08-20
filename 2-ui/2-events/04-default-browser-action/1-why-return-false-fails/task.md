importance: 3

---

# 왜 'return false'가 작동하지 않을까요

아래의 코드에서 `return false`는 왜 전혀 작동하지 않을까요?

```html autorun run
<script>
  function handler() {
    alert( "..." );
    return false;
  }
</script>

<a href="https://w3.org" onclick="handler()">브라우저가 w3.org로 이동합니다.</a>
```

브라우저에서 링크를 클릭하면 해당 URL로 이동하는데, 이 기본동작을 취소하고 싶다고 해봅시다.

어떻게 코드를 수정하면 될까요?
