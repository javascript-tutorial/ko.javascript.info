importance: 5

---

# Tooltip behavior

Create JS-code for the tooltip behavior.

When a mouse comes over an element with `data-tooltip`, the tooltip should appear over it, and when it's gone then hide.

An example of annotated HTML:

```html
<button data-tooltip="the tooltip is longer than the element">
    Short button
</button>
<button data-tooltip="HTML<br>tooltip">One more button</button>
```

Should work like this:

[iframe src="solution" height=200 border=1]

In this task we assume that all elements with `data-tooltip` have only text inside. No nested tags (yet).

Details:

-   The distance between the element and the tooltip should be `5px`.
-   The tooltip should be centered relative to the element, if possible.
-   The tooltip should not cross window edges. Normally it should be above the element, but if the element is at the page top and there's no space for the tooltip, then below it.
-   The tooltip content is given in the `data-tooltip` attribute. It can be arbitrary HTML.

You'll need two events here:

-   `mouseover` triggers when a pointer comes over an element.
-   `mouseout` triggers when a pointer leaves an element.

이벤트 위임을 사용해서 두 개의 핸들러만으로 원하는 기능을 구현하세요. `document`에 핸들러를 추가해 `data-tooltip` 속성이 있는 요소 안이나 밖으로 마우스 포인터가 이동하는 경우를 모두 감지하고 두 핸들러를 통해 툴팁을 보여주거나 감추시면 됩니다.

After the behavior is implemented, even people unfamiliar with JavaScript can add annotated elements.

P.S. Only one tooltip may show up at a time.
