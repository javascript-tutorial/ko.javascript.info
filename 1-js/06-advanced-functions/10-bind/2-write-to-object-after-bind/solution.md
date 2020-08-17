정답: `null`.


```js run
function f() {
  alert( this ); // null
}

let user = {
  g: f.bind(null)
};

user.g();
```

묶인 함수의 내용은 고정되어 있습니다. 더 바꿀 방법은 없습니다.

따라서 `user.g()`를 실행하는 동안에도 기존 함수는 `this=null`로 호출됩니다.
