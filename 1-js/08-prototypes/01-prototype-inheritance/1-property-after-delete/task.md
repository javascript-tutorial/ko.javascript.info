importance: 5

---

# 프로토타입으로 작업

한 쌍의 객체를 만들고 수정하는 코드가 있습니다.

이 프로세스에서 어떤 값이 나올까요?

```js
let animal = {
  jumps: null
};
let rabbit = {
  __proto__: animal,
  jumps: true
};

alert( rabbit.jumps ); // ? (1)

delete rabbit.jumps;

alert( rabbit.jumps ); // ? (2)

delete animal.jumps;

alert( rabbit.jumps ); // ? (3)
```

세 가지 답이 있습니다.
