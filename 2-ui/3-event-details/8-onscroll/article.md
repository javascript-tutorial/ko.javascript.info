# 스크롤

`scroll` 이벤트는 페이지나 요소의 스크롤에 반응하는 이벤트입니다. 이를 통해 할 수 있는 몇가지 유용한 일들이 있습니다.

예시로 : 
- 추가적인 제어나 정보등을 문서상 유저의 위치에 따라 숨기거나 보여줄 수 있습니다.
- 유저가 스크롤하여 페이지의 끝에 도달할 때 까지 추가적인 데이터를 불러옵니다.

현재 스크롤을 보여주는 간단한 함수입니다.

```js autorun
window.addEventListener('scroll', function() {
  document.getElementById('showScroll').innerHTML = window.pageYOffset + 'px';
});
```

```online
In action:

Current scroll = <b id="showScroll">scroll the window</b>
```

`scroll` 이벤트는 `window` 와 스크롤 가능한 요소 둘 다에 발생합니다.

## 스크롤 막기

무언가를 스크롤 불가능하게 만드려면 어떻게 해야 할까요?

`onscroll` 리스너 안의 `event.preventDefault()`를 통해 스크롤을 막는 건 불가능합니다. 왜냐하면 리스너가 트리거 될 땐 이미 스크롤이 발생한 뒤기 때문입니다.

하지만 `key:pageUp` 이나 `key:pageDown` 버튼의 `keydown` 이벤트엔 위와 같은 방법이 유효합니다. 

이러한 키보드 이벤트에 `event.preventDefault()` 코드로 스크롤이 발생하지 않게 할 수 있습니다.

스크롤을 발생시키는데에는 위 두가지 방법 외에도 다양한 방법들이 있습니다.
그러므로 CSS의 `overflow` 속성을 이용하는 방법이 좀 더 안전할 수 있습니다.
