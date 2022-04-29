The solution has two parts.

1. Wrap every tree node title into `<span>`. Then we can CSS-style them on `:hover` and handle clicks exactly on text, because `<span>` width is exactly the text width (unlike without it).
2. 루트 노드인 `tree`에 핸들러를 추가하고 클릭 이벤트가 `<span>`으로 감싼 텍스트에만 동작하도록 합니다.
