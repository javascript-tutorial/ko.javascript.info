
# 프라미스로 애니메이션이 적용된 원 만들기

<info:task/animate-circle-callback>에서 작성한 함수 `showCircle`를 다시 작성해봅시다. 이번엔 콜백을 받는 대신 프라미스를 반환하도록 해 봅시다.

함수는 다음처럼 사용할 수 있어야 합니다.

```js
showCircle(150, 150, 100).then(div => {
  div.classList.add('message-ball');
  div.append("Hello, world!");
});
```

콜백 기반으로 만든 답안인 <info:task/animate-circle-callback>를 참고하시기 바랍니다.
