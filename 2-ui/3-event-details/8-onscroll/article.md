# 스크롤

`scroll` 이벤트는 페이지나 요소에서 스크롤 했을 경우 반응할 수 있게 해줍니다. 해볼 수 있는 몇 가지 좋은 사례들이 있습니다.

예시:
- 문서에서 사용자가 위치한 곳에 따라 추가 제어 요소 또는 정보를 표시하거나 숨긴다.
- 사용자가 페이지 끝까지 스크롤을 내릴 경우 더 많은 데이터를 불러온다.

다음은 현재 스크롤 위치를 출력하는 간단한 함수입니다.

```js autorun
window.addEventListener('scroll', function() {
  document.getElementById('showScroll').innerHTML = window.pageYOffset + 'px';
});
```

```online
작동 중:

현재 스크롤 위치 = <b id="showScroll">scroll the window</b>
```

`scroll` 이벤트는 `window`와 스크롤 가능한 요소에서 동작합니다.

## 스크롤 방지

어떻게 스크롤이 불가능하도록 만들 수 있을까요?

`onscroll` 리스너에서 `event.preventDefault()`로 스크롤을 막는 것은 onscroll 리스너가 스크롤이 이미 발생한 뒤에 동작하기 때문에 불가능합니다.

하지만 `key:pageUp`이나 `key:pageDown`과 같은 `keydown` 이벤트처럼 스크롤을 일으키는 이벤트의 경우에는 `event.preventDefault()`로 스크롤이 동작하는 것을 방지할 수 있습니다.

이와 같은 이벤트에 이벤트 핸들러와 `event.preventDefault()`를 추가한다면 스크롤은 시작되지 않습니다.

스크롤을 일으키는 방법은 많습니다. 그렇기 때문에 CSS의 `overflow` 프로퍼티를 사용하는 것이 더 안전합니다.

다음은 `onscroll`이 적용된 애플리케이션을 이해하기 위해 해결하거나 살펴볼 수 있는 몇 가지 과제입니다.