꼼수처럼 보일지도 모르겠지만 해답은 간단한데요, 상세한 설명은 아래에 있습니다.

```js
let sortedRows = Array.from(table.tBodies[0].rows) // 1
  .sort((rowA, rowB) => rowA.cells[0].innerHTML.localeCompare(rowB.cells[0].innerHTML));

table.tBodies[0].append(...sortedRows); // (3)
```

풀이 과정:

1. `<tbody>`로부터 모든 `<tr>`을 불러옵니다.
2. 그 후 name 필드에 해당하는 첫 번째 `<td>`의 내용을 기준으로 정렬합니다.
3. 이제 `.append(...sortedRows)`를 사용해 정렬된 노드를 삽입합니다.

행에 해당하는 요소들을 지울 필요 없이 '재삽입' 하면 기존 위치를 저절로 벗어나게 됩니다.

예시에서는 `<tbody>` 가 표에 명시적으로 존재하는데요, HTML 표가 명시적으로 `<tbody>`를 갖지 않더라도 DOM 구조상에는 언제나 존재한다는 점을 참고하세요.
