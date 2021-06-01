
우리는 `document.onkeydown` 과 `document.onkeyup`의 두 가지 핸들러를 사용해야 합니다.

현재 누른 키를 유지할 수 있도록 `pressed = new Set()` 세트를 만듭니다.

첫 번째 핸들러가 추가되고 두 번째 핸들러는 제거됩니다. `keydown`을 할 때마다 충분한 키를 눌렀는지 확인하고, 그 경우에 함수를 실행합니다.
