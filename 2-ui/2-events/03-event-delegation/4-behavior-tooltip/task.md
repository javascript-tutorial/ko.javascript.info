importance: 5

---

# 툴팁(Tool-tip) 동작

툴팁 동작에 대한 자바스크립트 코드를 만듭니다.

마우스가 `data-tooltip`이 있는 요소 위에 오면 그 위에 툴팁이 나타나야 하고 사라지면 숨어야 합니다.

주석 달린 HTML 예시:
```html
<button data-tooltip="the tooltip is longer than the element">Short button</button>
<button data-tooltip="HTML<br>tooltip">One more button</button>
```

다음과 같이 작동해야 합니다.

[iframe src="solution" height=200 border=1]

이 작업에서는 `data-tooltip`이 있는 모든 요소에 텍스트만 있다고 가정합니다. 중첩 태그는 없습니다.

세부 사항:

- 요소와 툴팁 사이 거리는 `5px`입니다.
- 가능한 경우 툴팁은 요소를 기준으로 중앙에 위치해야 합니다.
- 툴팁은 창 가장자리를 넘지 않아야 합니다. 일반적으로 툴팁은 요소 위에 있어야 하지만, 요소가 페이지 상단에 있고 도구 설명을 위한 공간이 없는 경우 그 아래에 있어야 합니다.
- 툴팁 내용은 `data-tooltip` 속성으로 제공됩니다. 임의의 HTML 일 수도 있습니다.

여기에는 두 가지 이벤트가 필요합니다.
- `mouseover`는 포인터가 요소 위에 올 때 트리거 됩니다.
- `mouseout`은 포인터가 요소를 벗어날 때 트리거 됩니다.

이벤트 위임을 사용하세요. `document`에 두 개의 핸들러를 설정하여 `data-tooltip`이 있는 요소의 모든 'overs' 와 'outs'를 추적하고 거기에서 툴팁을 관리하세요.

동작이 구현된 후에는 자바스크립트에 익숙하지 않은 사람도 주석이 달린 요소를 추가할 수 있습니다.

참고: 한 번에 하나의 툴팁만 표시될 수 있습니다.
