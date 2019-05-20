importance: 5

---

# 바운드 함수의 기능

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

