모달 창은 다음과 같이 전체 창을 덮는 반투명 `<div id="cover-div">`를 사용하여 구현할 수 있습니다.

```css
#cover-div {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9000;
  width: 100%;
  height: 100%;
  background-color: gray;
  opacity: 0.3;
}
```

`<div>`가 창 전체를 덮기 때문에 아래에 있는 페이지가 아닌 `<div>`가 클릭 됩니다.

또한 `body.style.overflowY='hidden'`을 설정하여 페이지 스크롤을 방지할 수 있습니다.

폼이 투명해지는 것을 원치 않기 때문에 `<div>`의 내부가 아닌 옆에 위치해야 합니다.
