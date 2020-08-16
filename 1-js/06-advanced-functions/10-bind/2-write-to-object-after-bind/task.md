importance: 5

---

# 메서드로서의 묶인 함수

결과는 무엇일까요?

```js
function f() {
  alert( this ); // ?
}

let user = {
  g: f.bind(null)
};

user.g();
```

