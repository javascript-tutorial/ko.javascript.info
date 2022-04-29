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

- The distance between the element and the tooltip should be `5px`.
- The tooltip should be centered relative to the element, if possible.
- 툴팁은 창 크기보다 커질 수 없습니다. 일반적인 경우라면 툴팁은 요소 위에 있을 텐데, 요소가 창 맨 위에 있어서 툴팁을 보여줄 공간이 없다면 툴팁은 요소 아래에 나타납니다.
- The tooltip content is given in the `data-tooltip` attribute. It can be arbitrary HTML.

You'll need two events here:
- `mouseover` triggers when a pointer comes over an element.
- `mouseout` triggers when a pointer leaves an element.

Please use event delegation: set up two handlers on `document` to track all "overs" and "outs" from elements with `data-tooltip` and manage tooltips from there.

After the behavior is implemented, even people unfamiliar with JavaScript can add annotated elements.

P.S. Only one tooltip may show up at a time.
