importance: 4

---

# 배열을 사용하여 키가 있는 객체 만들기

다음 형식의 사용자 배열이 있습니다. `{id:..., name:..., age... }`.

`id`가 키(key), 배열 요소가 값(value)인 객체를 생성하는 `groupById (arr)`함수를 작성해보세요.

예시:

```js
let users = [
  {id: 'john', name: "John Smith", age: 20},
  {id: 'ann', name: "Ann Smith", age: 24},
  {id: 'pete', name: "Pete Peterson", age: 31},
];

let usersById = groupById(users);

/*
// 함수 호출 후

usersById = {
  john: {id: 'john', name: "John Smith", age: 20},
  ann: {id: 'ann', name: "Ann Smith", age: 24},
  pete: {id: 'pete', name: "Pete Peterson", age: 31},
}
*/
```

이런 함수는 서버 데이터 작업할 때 유용합니다.

이번 과제에서 우리는 `id`가 고유하다는 가정을 합니다. 배열에서 같은 `id`를 갖는 두 개의 배열 요소는 존재하지 않습니다.

정답 작성 시 `.reduce` 메소드를 이용해보세요.
