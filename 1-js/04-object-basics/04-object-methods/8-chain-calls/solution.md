메서드를 호출할 때마다 객체 자신을 반환하게 하면 됩니다.

```js run demo
let ladder = {
  step: 0,
  up() {
    this.step++;
*!*
    return this;
*/!*
  },
  down() {
    this.step--;
*!*
    return this;
*/!*
  },
  showStep() {
    alert( this.step );
*!*
    return this;
*/!*
  }
}

ladder.up().up().down().up().down().showStep(); // 1
```

체이닝이 길어질 땐 메서드 호출을 별도의 줄에 작성하면 가독성이 좋아집니다.

```js
ladder
  .up()
  .up()
  .down()
  .up()
  .down()
  .showStep(); // 1
```
