importance: 3

---

# 배열은 복사가 될까요?

아래 코드를 실행하면 어떤 결과가 나올까요?

```js
let fruits = ["사과", "배", "오렌지"];

// 배열을 '복사'한 후, push 메서드를 이용해 새로운 값을 추가합니다.
let shoppingCart = fruits;
shoppingCart.push("바나나");

// fruits에 어떤 값이 들어 있을까요?
alert( fruits.length ); // ?
```

