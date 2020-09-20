스크롤바의 너비를 구하기 위해서는 스크롤이 포함된 요소를 만들 수 있어야 하지만 border와 padding은 필요가 없습니다.

그렇다면 콘텐츠의 전체 너비 `offsetWidth`와 콘텐츠 내의 공간 너비 `clientWidth` 사이의 차이점은 분명 스크롤바가 될 것입니다.

```js run
// scroll이 포함된 div 생성하기
let div = document.createElement('div');

div.style.overflowY = 'scroll';
div.style.width = '50px';
div.style.height = '50px';

// document 안에 div를 꼭 넣어야 하며, 그렇지 않으면 div의 크기는 0이 될 것입니다.
document.body.append(div);
let scrollWidth = div.offsetWidth - div.clientWidth;

div.remove();

alert(scrollWidth);
```
