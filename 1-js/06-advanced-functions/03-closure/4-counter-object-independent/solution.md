
잘 동작합니다.

생성자 함수의 두 중첩 함수는 동일한 외부 렉시컬 환경에서 만들어졌기 때문에 같은 `count` 변수를 공유합니다.

```js run
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

alert( counter.up() ); // 1
alert( counter.up() ); // 2
alert( counter.down() ); // 1
```
