importance: 5

---

# bind를 적용한 함수를 메서드에 정의하기

아래 코드를 실행하면 어떤 결과가 나올까요?

```js
function f() {
  alert( this ); // ?
}

let user = {
  g: f.bind(null)
};

user.g();
```

