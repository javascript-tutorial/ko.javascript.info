The solution has two parts.

1. 트리에 있는 모든 텍스트를 `<span>`이 감싸도록 합니다. 이렇게 하면 CSS `:hover`를 사용해 마우스 오버 시 글씨를 굴게 해주는 효과를 줄 수 있고 `<span>`이 차지하는 너비가 텍스트의 너비와 정확히 일치하기 때문에 텍스트에만 클릭 이벤트가 동작하도록 할 수 있습니다.
2. Set a handler to the `tree` root node and handle clicks on that `<span>` titles.
