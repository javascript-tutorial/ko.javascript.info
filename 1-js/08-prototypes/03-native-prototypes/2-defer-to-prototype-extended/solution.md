

```js run
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

// 확인해 보세요.
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // 1초 후 3 출력
```

객체 메서드에 대한 데코레이션 동작을 만들기 위해서 `this`를 `f.apply`안에서 사용하는 것을 알아두세요.

그래서 래퍼 함수가 객체 메서드로써 호출된다면 `this`는 기존 메서드 `f`에 전달됩니다.

```js run
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

let user = {
  name: "John",
  sayHi() {
    alert(this.name);
  }
}

user.sayHi = user.sayHi.defer(1000);

user.sayHi();
```
