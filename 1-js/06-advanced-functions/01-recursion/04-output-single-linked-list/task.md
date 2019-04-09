importance: 5

---

# 단일 링크 목록 출력

단일 연결 목록이 있다고 가정 해 봅니다 (<info:recursion>):

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

목록 항목을 하나씩 출력하는`printList (list)`함수를 작성하십시오.

루프를 사용하고 재귀를 사용하여 솔루션의 두 가지 변형을 만듭니다.

무엇이 더 좋습니까? 재귀가 있거나 없으면 어떻게됩니까?
