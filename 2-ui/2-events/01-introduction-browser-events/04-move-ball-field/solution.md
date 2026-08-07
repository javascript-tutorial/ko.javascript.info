
우선 공을 배치하는 방법을 선택해야 합니다. 

페이지를 스크롤 하면 공이 필드에서 이동하므로 `position:fixed`를 사용할 수 없습니다.

따라서 `position:absolute`를 사용해야 하고 위치 잡기를 정말 견고하게 하기 위해서는 `field` 자체를 위치 잡기 해야 합니다. 

그러면 공은 필드에 상대적으로 배치됩니다. 

```css
#field {
  width: 200px;
  height: 150px;
  position: relative;
}

#ball {
  position: absolute;
  left: 0; /* 가장 가깝게 배치된 조상(field)에 상대적으로 위치하기 */
  top: 0;
  transition: 1s all; /* CSS 애니메이션으로 왼쪽·위쪽으로 공이 날아가는 효과를 구현합니다 */
}
```

그런 다음 올바른 `ball.style.left/top`을 할당해야 합니다. 이제 상대적인 필드 기준 좌표가 포함됩니다.

사진은 다음과 같습니다. 

![](move-ball-coords.svg)

클릭한 위치의 창 기준 좌표를 표시하는 `event.clientX/clientY`가 있습니다.

클릭 시 필드에 상대적인 `left` 좌표를 구하려면 필드의 왼쪽 가장자리와 테두리의 너비를 빼면 됩니다. 

```js
let left = event.clientX - fieldCoords.left - field.clientLeft;
```

일반적으로 `ball.style.left`는 '요소(공)의 왼쪽 가장자리'를 의미합니다. 따라서 `left`를 할당하면 공의 중앙이 아닌 가장자리가 마우스 커서 아래로 오게 됩니다.

중앙으로 가게 만들려면 공을 왼쪽으로 반너비, 위쪽으로 반 높이 이동해야 합니다.

따라서 `left`는 최종적으로 다음과 같습니다. 

```js
let left = event.clientX - fieldCoords.left - field.clientLeft - ball.offsetWidth/2;
```

수직 좌표는 같은 논리를 사용하여 계산됩니다.

공의 너비·높이는 `ball.offsetWidth`에 접근할 때 알아야 한다는 점을 주의해 주세요. HTML 또는 CSS로 지정해야 합니다.
