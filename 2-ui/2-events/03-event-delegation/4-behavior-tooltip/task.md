importance: 5

---

# Tooltip behavior

툴팁(tooltip)을 보여주는 JS 코드를 작성해봅시다.

`data-tooltip` 속성이 있는 요소에 마우스를 가져다 대면 툴팁이 보여야 하고, 마우스 커서가 요소에서 떠나면 툴팁이 사라져야 합니다.

An example of annotated HTML:
```html
<button data-tooltip="the tooltip is longer than the element">Short button</button>
<button data-tooltip="두 줄짜리<br>툴팁">...또 다른 버튼...</button>
```

Should work like this:

[iframe src="solution" height=200 border=1]

`data-tooltip`이 있는 요소엔 텍스트만 있다고 가정하겠습니다. 요소 안에 다른 태그가 있는 경우는 생각하지 않기로 합시다.

Details:

- 툴팁과 요소의 간격은 `5px`입니다.
- 가능하면 툴팁은 요소를 기준으로 중앙에 있도록 합시다.
- The tooltip should not cross window edges. Normally it should be above the element, but if the element is at the page top and there's no space for the tooltip, then below it.
- 툴팁안에 띄울 콘텐츠는 `data-tooltip` 속성에서 가져옵니다. 속성값은 HTML일 수 있습니다.

You'll need two events here:
- `mouseover` -- 요소 안으로 포인터가 이동할 때 발생하는 이벤트
- `mouseout`-- 요소 밖으로 포인터가 이동할 때 발생하는 이벤트

이벤트 위임을 사용해서 두 개의 핸들러만으로 원하는 기능을 구현하세요. `document`에 핸들러를 추가해 `data-tooltip` 속성이 있는 요소 안이나 밖으로 마우스 포인터가 이동하는 경우를 모두 감지하고 두 핸들러를 통해 툴팁을 보여주거나 감추시면 됩니다. 

After the behavior is implemented, even people unfamiliar with JavaScript can add annotated elements.

P.S. Only one tooltip may show up at a time.
