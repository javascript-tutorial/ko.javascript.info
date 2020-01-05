importance: 5

---

# 객체 리터럴에서 'this' 사용하기

함수 `makeUser`는 객체를 반환합니다.

이 객체의 `ref`에 접근하면 어떤 결과가 발생하고, 그 이유는 뭘까요?

```js
function makeUser() {
  return {
    name: "John",
    ref: this
  };
};

let user = makeUser();

alert( user.ref.name ); // 결과가 어떻게 될까요?
```

