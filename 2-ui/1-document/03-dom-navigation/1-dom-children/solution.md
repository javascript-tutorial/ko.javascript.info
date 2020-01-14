방법은 다양합니다.


`<div>` DOM 노드:

```js
document.body.firstElementChild
// 또는
document.body.children[0]
// 또는 (첫 번째 노드는 공백이므로 두 번째 노드를 가져옴)
document.body.childNodes[1]
```

`<ul>` DOM 노드:

```js
document.body.lastElementChild
// 또는
document.body.children[1]
```

두 번째 `<li>` (Pete):

```js
// <ul>을 가져오고, <ul>의 마지막 자식 요소를 가져옴
document.body.lastElementChild.lastElementChild
```
