importance: 5

---

# 읽은 날짜 저장하기

[previous task](info:task/recipients-read)에서 처럼 메시지들의 배열이 있습니다. 상황은 비슷합니다.

```js
let messages = [
  {text: "Hello", from: "John"},
  {text: "How goes?", from: "John"},
  {text: "See you soon", from: "Alice"}
];
```

이제 질문은 "메시지가 언제 읽혔는가?"에 대한 정보를 저장하기 위해 어떤 자료구조를 제안할 것인가 입니다.

이전의 작업에서는 오로지 "yes/no"만 저장하면 되었습니다. 이제는 날짜를 저장하고 이 날짜는 메시지가 가비지 콜렉션에 포함되기 전까지 메모리에 남아있어야 합니다.

P.S. 날짜는 추후에 다루게 될 `Data`클래스의 내장 객체로 저장될 수 있습니다. 
