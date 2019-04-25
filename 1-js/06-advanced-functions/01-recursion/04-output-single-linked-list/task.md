importance: 5

---
# 단일 연결 리스트 출력하기

단일 연결 리스트가 있다고 가정 해 봅니다 (<info:recursion>):

```js
let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};
```

목록 항목을 하나씩 출력하는`printList (list)`함수를 작성해보세요.

반목문을 사용하고 재귀적인 방법을 사용해서 두 가지로 접근해봅니다.

어떤 게 더 좋은 코드인가요? 재귀가 있는 것인가요? 없는 것인가요?
