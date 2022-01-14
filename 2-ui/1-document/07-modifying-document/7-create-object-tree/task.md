importance: 5

---

# 객체로부터 트리(tree) 생성하기

중첩된 객체의 데이터로 `ul·li` 리스트를 생성하는 `createTree` 함수를 만들어 보세요.

예시:

```js
let data = {
  "Fish": {
    "trout": {},
    "salmon": {}
  },

  "Tree": {
    "Huge": {
      "sequoia": {},
      "oak": {}
    },
    "Flowering": {
      "apple tree": {},
      "magnolia": {}
    }
  }
};
```

코드 형식:

```js
let container = document.getElementById('container');
*!*
createTree(container, data); // container 요소 내에 트리를 생성합니다.
*/!*
```

결과물이 될 트리는 이런 모습이어야 합니다.

[iframe border=1 src="build-tree-dom"]

두 방법 중 원하는 방법으로 과제를 해결해 보세요.

1. 전체 트리를 생성한 후 `container.innerHTML` 로 컨테이너에 추가합니다.
2. 노드를 각각 생성한 후 DOM 메서드를 사용해 컨테이너에 추가합니다.

두 방법을 모두 사용해보면 더 좋습니다.

내용이 없는 `<ul></ul>`처럼 '불필요한' 요소가 트리에 존재해서는 안된다는 점을 참고하세요.