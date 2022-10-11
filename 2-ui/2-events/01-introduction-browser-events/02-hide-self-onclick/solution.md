핸들러 내부에 `this`를 사용해 '요소 자체'를 참조할 수 있습니다.

```html run height=50
<input type="button" onclick="this.hidden=true" value="Click to hide">
```
