스크롤바의 너비를 구하기 위해서는 스크롤이 포함됐지만 테두리와 패딩이 없는 요소를 만들어야 합니다.

콘텐츠의 전체 너비 `offsetWidth`와 콘텐츠 내의 공간 너비 `clientWidth`의 차이값은 스크롤바의 크기가 됩니다.

```js run
// scroll이 포함된 div 생성하기
let div = document.createElement('div');

div.style.overflowY = 'scroll';
div.style.width = '50px';
div.style.height = '50px';

// document 안에 div를 꼭 넣어야 하며, 그렇지 않으면 div의 크기는 0이 됩니다.
document.body.append(div);
let scrollWidth = div.offsetWidth - div.clientWidth;

div.remove();

alert(scrollWidth);
```
