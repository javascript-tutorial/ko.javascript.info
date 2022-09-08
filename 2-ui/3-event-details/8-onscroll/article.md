# 스크롤

`Scroll` 이벤트는 페이지 또는 요소 스크롤에 응답할 수 있습니다. 이 페이지에서 할 수 있는 좋은 예시가 꽤 많이 있습니다.

예시:
- 문서의 위치에 따라 추가 컨트롤 또는 정보를 표시하거나 숨깁니다.
- 사용자가 페이지 끝까지 스크롤 할 때 더 많은 데이터를 로드합니다.

다음은 현재 스크롤을 표시하는 작은 함수입니다.

```js autorun
window.addEventListener('scroll', function() {
  document.getElementById('showScroll').innerHTML = window.pageYOffset + 'px';
});
```

```online
동작 중:

현재 스크롤 = <b id="showScroll">scroll the window</b>
```

`scroll` 이벤트는 `window` 와 스크롤이 가능한 요소 모두에서 작동합니다.

## 스크롤 방지

어떻게 통제할 수 없는 것을 만들 수 있을까요?

스크롤이 이미 실행된 *후*에 트리거 되므로 `onscroll` Listener에서 `event.preventDefault()`를 사용하여 스크롤을 방지할 수 없습니다.

그러나 스크롤을 유발하는 이벤트(예시: `key:pageUp` 및 `key:pageDown`에 대한 `keydown` 이벤트)에 대해 `event.preventDefault()`로 스크롤 하지 않도록 할 수 있습니다.

이벤트 핸들러를 이러한 이벤트와 이벤트 핸들러의 `event.preventDefault()`에 추가하면 스크롤이 시작되지 않습니다.

스크롤을 시작하는 방법은 여러 가지가 있으므로 CSS, `overflow` 프로퍼티를 사용하는 것이 더 안정적입니다.

다음은 `onscroll`의 애플리케이션을 보기 위해 해결하거나 살펴볼 수 있는 몇 가지 과제입니다.
