<info:task/animate-ball> 과제에서는 애니메이션 효과를 주는 프로퍼티가 오직 한개 존재했습니다. 이제 `elem.style.left`라는 하나의 프로퍼티가 더 필요합니다.

튀어 오르지 않지만 공이 서서히 오른쪽으로 이동하는 또 다른 규칙에 의해 수평좌표가 바뀝니다.

오른쪽으로 움직이는 것을 위한 `animate`를 하나 더 사용할 수 있습니다.

time function으로 `linear`을 사용할 수 있지만 `makeEaseOut(quad)`같은 것을 사용하는게 더 좋을 것 같습니다.

코드는 다음과 같습니다.

```js
let height = field.clientHeight - ball.clientHeight;
let width = 100;

// animate top (bouncing)
animate({
  duration: 2000,
  timing: makeEaseOut(bounce),
  draw: function(progress) {
    ball.style.top = height * progress + 'px'
  }
});

// animate left (moving to the right)
animate({
  duration: 2000,
  timing: makeEaseOut(quad),
  draw: function(progress) {
    ball.style.left = width * progress + "px"
  }
});
```
