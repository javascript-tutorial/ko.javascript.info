해답:

```js
let scrollBottom = elem.scrollHeight - elem.scrollTop - elem.clientHeight;
```

다른 말로 '(최대 높이) 빼기 (스크롤바에 가려진 윗부분) 빼기 (보이는 부분)'이 바로 스크롤바에 가려진 바닥 부분이겠죠.
