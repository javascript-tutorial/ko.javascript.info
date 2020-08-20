브라우저는 `onclick` 같은 `on*` 속성을 읽을 때, 해당 내용으로부터 자체 핸들러를 생성합니다.

`onclick="handler()"`의 경우 함수는 다음과 같습니다.

```js
function(event) {
  handler() // onclick에 해당하는 내용  
}
```

`handler()`에 의해 반환된 값은 사용되지 않고 결과에 영향을 미치지 않는다는 것을 볼 수 있습니다.

고치는 법은 간단합니다.

```html run
<script>
  function handler() {
    alert("...");
    return false;
  }
</script>

<a href="https://w3.org" onclick="*!*return handler()*/!*">w3.org</a>
```

다음과 같이 `event.preventDefault()`를 사용할 수도 있습니다.

```html run
<script>
*!*
  function handler(event) {
    alert("...");
    event.preventDefault();
  }
*/!*
</script>

<a href="https://w3.org" onclick="*!*handler(event)*/!*">w3.org</a>
```
