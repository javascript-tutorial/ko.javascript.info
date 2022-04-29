importance: 5

---

# Tooltip behavior

Create JS-code for the tooltip behavior.

When a mouse comes over an element with `data-tooltip`, the tooltip should appear over it, and when it's gone then hide.

An example of annotated HTML:
```html
<button data-tooltip="the tooltip is longer than the element">Short button</button>
<button data-tooltip="HTML<br>tooltip">One more button</button>
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

Please use event delegation: set up two handlers on `document` to track all "overs" and "outs" from elements with `data-tooltip` and manage tooltips from there.

After the behavior is implemented, even people unfamiliar with JavaScript can add annotated elements.

P.S. Only one tooltip may show up at a time.
