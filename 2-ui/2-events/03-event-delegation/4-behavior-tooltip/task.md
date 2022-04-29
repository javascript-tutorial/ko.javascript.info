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

In this task we assume that all elements with `data-tooltip` have only text inside. No nested tags (yet).

Details:

- 툴팁과 요소의 간격은 `5px`입니다.
- The tooltip should be centered relative to the element, if possible.
- The tooltip should not cross window edges. Normally it should be above the element, but if the element is at the page top and there's no space for the tooltip, then below it.
- 툴팁안에 띄울 콘텐츠는 `data-tooltip` 속성에서 가져옵니다. 속성값은 HTML일 수 있습니다.

You'll need two events here:
- `mouseover` -- 요소 안으로 포인터가 이동할 때 발생하는 이벤트
- `mouseout` triggers when a pointer leaves an element.

Please use event delegation: set up two handlers on `document` to track all "overs" and "outs" from elements with `data-tooltip` and manage tooltips from there.

이렇게 툴팁 기능을 구현해 놓으면 자바스크립트에 익숙하지 않은 사람도 원하는 요소에 쉽게 툴팁을 보여줄 수 있을 겁니다.

P.S. Only one tooltip may show up at a time.
