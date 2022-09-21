`<li>`를 이용한 반복문을 만들어 봅시다.

```js
for (let li of document.querySelectorAll('li')) {
  ...
}
```

반복문 안에서 각각의 `li` 안에 있는 텍스트를 가져와야 합니다.

`li`의 첫 번째 자식 노드인 텍스트 노드로부터 텍스트를 읽을 수 있습니다.

```js
for (let li of document.querySelectorAll('li')) {
  let title = li.firstChild.data;

  // title은 <li> 안에 있는 다른 노드들보다 앞에 위치한 텍스트입니다.
}
```

그리고 `li.getElementsByTagName('li').length`를 이용해 `li` 노드 아래에 있는 모든 `<li>` 태그의 개수를 가져올 수 있습니다.
