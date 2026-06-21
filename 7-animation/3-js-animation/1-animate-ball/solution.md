공을 튀어 오르게 하기 위해서는 공에는 CSS 프로퍼티인 `top`과 `position:absolute`를, 공이 들어있는 필드에는`position:relative`를 사용할 수 있습니다.

필드의 아래쪽 좌표는 `field.clientHeight`입니다. `top` 프로퍼티는 공의 위쪽 모서리를 의미합니다. 그러므로 공의 위쪽 모서리는 `0`부터 그 위치의 최솟값인 `field.clientHeight - ball.clientHeight`까지 움직입니다.

튀어 오르는 애니메이션 효과를 적용하기 위해 `easeOut`모드에서 timing 함수 `bounce`를 사용합니다.

다음은 애니메이션 효과를 적용한 최종 코드입니다.

```js
let to = field.clientHeight - ball.clientHeight;

animate({
  duration: 2000,
  timing: makeEaseOut(bounce),
  draw(progress) {
    ball.style.top = to * progress + 'px'
  }
});
```
