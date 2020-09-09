정답: `null`


```js run
function f() {
  alert( this ); // null
}

let user = {
  g: f.bind(null)
};

user.g();
```

bind를 적용한 함수의 컨텍스트는 완전히 고정됩니다. 한번 고정되면 바꿀 방법이 없습니다.

따라서 `user.g()`를 실행했음에도 불구하고 기존 함수의 컨텍스트는 `null`이 되기 때문에 `null`이 출력됩니다.
