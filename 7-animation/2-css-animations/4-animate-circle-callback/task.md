
# 콜백을 이용한 움직이는 원

앞서 과제 <info:task/animate-circle> 에서 점점 커지는 원을 만들어 보았습니다.

이젠 점점 커지는 원뿐만 아니라 원 안에 메시지를 보여줘야 한다고 가정해봅시다. 이때 메시지는 애니메이션이 다 끝나고 난 *후*, 즉 원이 완전히 커지고 난 후에 나타나야 합니다. 그렇지 않으면 뭔가 이상해 보이기 때문입니다.

과제 <info:task/animate-circle>의 해답에 있는 함수 `showCircle(cx, cy, radius)`은 원을 그려주긴 하지만, 애니메이션이 다 끝났는지 아닌지를 알려주는 기능은 없습니다.

함수 `showCircle`에 `showCircle(cx, cy, radius, callback)`처럼 콜백 인수를 추가해 애니메이션이 종료되면 이 콜백이 실행되도록 해봅시다. 단, 이때 `callback`은 원에 대응하는 `<div>`를 반드시 인수로 받아야 합니다. 

완성된 함수는 다음과 같이 사용할 수 있어야 합니다.

```js
showCircle(150, 150, 100, div => {
  div.classList.add('message-ball');
  div.append("안녕하세요!");
});
```

데모:

[iframe src="solution" height=260]

<info:task/animate-circle>의 해답을 기초 삼아 새로운 함수를 만들어보세요.
