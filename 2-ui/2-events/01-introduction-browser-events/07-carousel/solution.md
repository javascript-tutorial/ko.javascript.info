이미지 슬라이드는 이미지 `<img>`의 `ul/li` 목록으로 나타낼 수 있습니다. 

일반적으로 이런 이미지 슬라이드는 폭이 넓지만, 슬라이드 일부만 보이도록 고정 크기의 `<div>`로 감쌌습니다.

![](carousel1.svg)

이미지 목록을 가로로 표시하려면 `<li>`에 `display: inline-block`과 같은 올바른 CSS 프로퍼티를 적용해야 합니다. 

`<img>`는 `display`가 기본적으로 `inline`이므로 조정해야 합니다. '문자의 끝(letter tails)'을 위한 `inline` 요소 아래에 여분의 공간이 확보되어 있으므로 `display:block`을 사용해 삭제하겠습니다.

스크롤 하려면 `<ul>`을 이동하면 됩니다. `margin-left`를 바꾸거나 `transform: translateX()`(더 나은 기능 구현을 위해)를 사용하는 등 여러 가지 방법이 있습니다.

![](carousel2.svg)

외부 `<div>`는 고정된 너비를 가지고 있으므로 '여분' 이미지는 잘립니다. 

캐러셀 전체는 페이지에 독립된 '그래픽 구성 요소(graphical component)'이므로 단일 `<div class="carousel">`로 감싸서 그 안에서 스타일링 하는 것이 좋습니다.
