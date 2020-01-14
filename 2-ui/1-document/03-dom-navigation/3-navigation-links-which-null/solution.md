1. 네 맞습니다. `elem.lastChild`는 항상 마지막 노드이기 때문에 `nextSibling`이 없습니다.
2. 아닙니다. `elem.children[0]`은 *요소 노드 중* 첫 번째 자식 노드를 나타내기 때문입니다. 이 앞에 요소 노드가 아닌 다른 노드가 올 수도 있습니다. `previousSibling`은 텍스트 노드가 될 수도 있습니다.

주의 사항: 두 경우 모두 자식 노드가 없는 경우 에러가 발생합니다.

자식 노드가 없으면 `elem.lastChild`은 `null`이 되기 때문에 `elem.lastChild.nextSibling`에 접근할 수 없습니다. 그리고 컬렉션 `elem.children`은 빈 배열 `[]`같이 빈 상태가 됩니다.
