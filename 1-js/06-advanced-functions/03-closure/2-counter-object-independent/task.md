importance: 5

---

# 카운터 객체

여기서 counter 객체는 생성자 함수의 도움으로 만들어집니다.

작동할까요? 그것은 무엇을 보여줄 것인가?

```js
function Counter() {
  let count = 0;

  this.up = function() {
    return ++count;
  };
  this.down = function() {
    return --count;
  };
}

let counter = new Counter();

alert( counter.up() ); // ?
alert( counter.up() ); // ?
alert( counter.down() ); // ?
```

