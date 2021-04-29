
`mouse.onclick`으로 클릭 이벤트를 핸들링하고 `position:fixed`로 쥐가 이동할 수 있도록 준비합니다. 이 상태에서 `mouse.onkeydown`로 화살표 키를 핸들링합니다.

문제의 핵심은 `keydown`은 오직 포커스된 요소에서만 트리거 된다는 점입니다. 따라서 원하는 요구사항을 구현하려면 요소에 `tabindex`를 추가해줘야 합니다. 그런데 문제에서 HTML을 수정하지 말라고 했으므로 속성값 추가 말고 `mouse.tabIndex` 프로퍼티를 사용해야 합니다.

참고: 해답에서 `mouse.onclick`을 `mouse.onfocus`로 바꿔도 잘 동작합니다.
