importance: 5

---

# 배열 컨텍스트에서 함수 호출하기

아래 코드를 실행하면 어떤 결과가 나올까요? 그리고 그 이유는 무엇일까요?

```js
let arr = ["a", "b"];

arr.push(function() {
  alert( this );
})

arr[2](); // ?
```

