importance: 5

---
# 필드로 정렬
정렬 할 객체 배열이 있습니다.

```js
let users = [
  { name: "John", age: 20, surname: "Johnson" },
  { name: "Pete", age: 18, surname: "Peterson" },
  { name: "Ann", age: 19, surname: "Hathaway" }
];
```

그렇게하는 일반적인 방법은 다음과 같습니다.

```js
// by name (Ann, John, Pete)
users.sort((a, b) => a.name > b.name ? 1 : -1);

// by age (Pete, Ann, John)
users.sort((a, b) => a.age > b.age ? 1 : -1);
```

우리가 덜 장황하게 만들 수 있을까요?

```js
users.sort(byField('name'));
users.sort(byField('age'));
```

따라서, 함수를 작성하는 대신 `byField (fieldName)`을 입력하십시오.

그것을 사용할 수 있는 byField 함수를 작성하십시오.
