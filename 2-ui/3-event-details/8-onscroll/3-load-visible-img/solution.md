`onscroll` 핸들러는 어떤 이미지가 노출 가능한지 확인하고 보여주어야 합니다.

또한 페이지를 로드할 때 보일 수 있는 이미지를 바로 감지하고 불러오기 위해 onscroll 핸들러를 실행시키고 싶습니다.

코드는 문서를 불러올 때 실행되어야 하고, 이 코드는 문서 콘텐츠에 접근할 수 있어야 합니다.

또는 `<body>` 에 아래 코드를 삽입하세요.

```js
// ...페이지 콘텐츠는 위에 있습니다...

function isVisible(elem) {

  let coords = elem.getBoundingClientRect();

  let windowHeight = document.documentElement.clientHeight;

  // 요소의 상단 모서리가 보이는지?
  let topVisible = coords.top > 0 && coords.top < windowHeight;

  // 요소의 하단 모서리가 보이는지?
  let bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;

  return topVisible || bottomVisible;
}
```

함수 `showVisible()` 은 `isVisible()` 에서 구현한 가시성 검사를 사용해서 화면에 노출 가능한 이미지를 로드합니다.

```js
function showVisible() {
  for (let img of document.querySelectorAll('img')) {
    let realSrc = img.dataset.src;
    if (!realSrc) continue;

    if (isVisible(img)) {
      img.src = realSrc;
      img.dataset.src = '';
    }
  }
}

*!*
showVisible();
window.onscroll = showVisible;
*/!*
```

참고: 해답에는 현재 문서 스크롤의 위·아래에 있는 이미지를 '미리 로드'하는 변형 `isVisible`도 있습니다.