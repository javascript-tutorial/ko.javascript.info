importance: 5

---

# 프로토타입 이해하기

객체 두 개를 이용해 쌍을 만들고 이를 수정하는 코드가 아래에 있습니다.

얼럿창에 어떤 값이 나올지 예측해보세요.

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

세 개의 답을 제출하셔야 합니다.
