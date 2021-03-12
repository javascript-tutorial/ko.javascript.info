
먼저 잘못된 방법부터 살펴보겠습니다.

```js
function clear(elem) {
  for (let i=0; i < elem.childNodes.length; i++) {
      elem.childNodes[i].remove();
  }
}
```

`remove()`는 `elem.childNodes`을 변화시키기 때문에 반복문을 실행할 때마다 `0` 번째 인덱스부터 시작해야만 합니다. 그러나 `i` 는 계속해서 증가하므로, 결국 일부 원소들을 지나치게 됩니다.

`for..of` 반복문에도 역시 같은 문제가 있습니다.

올바른 방법은 다음과 같습니다.

```js
function clear(elem) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}
```

같은 동작을 수행하는 더 쉬운 방법도 있습니다.

```js
function clear(elem) {
  elem.innerHTML = '';
}
```
