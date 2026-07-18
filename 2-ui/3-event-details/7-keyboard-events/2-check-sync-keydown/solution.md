
`document.onkeydown`과 `document.onkeyup` 두 핸들러를 사용해야 합니다.

현재 눌려 있는 키를 담아 둘 셋 `pressed = new Set()`을 만듭니다.

첫 번째 핸들러는 셋에 키를 추가하고 두 번째 핸들러는 셋에서 키를 제거합니다. `keydown`이 발생할 때마다 필요한 키가 전부 눌렸는지 확인하고 전부 눌렸다면 함수를 실행합니다.
