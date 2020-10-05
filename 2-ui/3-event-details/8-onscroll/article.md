# 스크롤 하기

`scroll` 이벤트는 페이지나 엘리먼트 상의 스크롤에 반응할 수 있도록 합니다. 여기서 해볼 수 있는 꽤 좋은 것들이 많이 있습니다.

예를 들어:

- 사용자가 문서에 어디 있는지에 따라서 추가적인 컨트롤이나 정보를 보여주거나/가릴 수 있습니다.
- 사용자가 문서의 아래까지 스크롤을 내릴 때 많은 정보를 불러올 수 있습니다.

이것이 현재의 스크롤을 보여주는 간단한 함수입니다:

```js autorun
window.addEventListener("scroll", function () {
  document.getElementById("showScroll").innerHTML = window.pageYOffset + "px";
});
```

```online
In action:

Current scroll = <b id="showScroll">scroll the window</b>
```

`scroll` 이벤트는 `window`와 스크롤 할 수 있는 구성요소 모두에서 작동합니다.

## Prevent scrolling

How do we make something unscrollable?

We can't prevent scrolling by using `event.preventDefault()` in `onscroll` listener, because it triggers _after_ the scroll has already happened.

But we can prevent scrolling by `event.preventDefault()` on an event that causes the scroll, for instance `keydown` event for `key:pageUp` and `key:pageDown`.

If we add an event handler to these events and `event.preventDefault()` in it, then the scroll won't start.

There are many ways to initiate a scroll, so it's more reliable to use CSS, `overflow` property.

Here are few tasks that you can solve or look through to see the applications on `onscroll`.
