브라우저는 `onclick` 같은 `on*` 속성을 읽을 때, 속성값을 그대로 가져와 핸들러를 생성합니다.

따라서 `onclick="handler()"`의 경우 생성되는 핸들러 함수는 다음과 같습니다.

```js
function(event) {
  handler() // onclick 속성에 할당된 값이 그대로 핸들러 함수 본문이 됩니다.  
}
```

그런데 여기서 보면 함수 `handler`를 괄호를 붙여서 호출하기만 했지, 호출시 반환된 값은 그 어디에서도 사용하지 않고 있습니다. 따라서 아무런 변화가 없습니다.

우리가 원하는 대로 링크로 이동하지 않게 하려면 다음과 같이 코드를 수정하면 됩니다.

```html run
<script>
  function handler() {
    alert("...");
    return false;
  }
</script>

<a href="https://w3.org" onclick="*!*return handler()*/!*">w3.org</a>
```

이 외에도 `event.preventDefault()`를 사용할 수 있습니다.

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
