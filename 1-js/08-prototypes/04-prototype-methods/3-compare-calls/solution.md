
`this`는 실제 점 앞에 있는 객체를 나타내기 때문에, 첫 번째 호출에선 `this`가 `rabbit`이고, 다른 호출에선 `Rabbit.prototype`입니다.

따라서 첫 번째 호출만이 `Rabbit`을 출력하고 다른 호출은 `undefined`를 출력합니다.

```js run
function Rabbit(name) {
  this.name = name;
}
Rabbit.prototype.sayHi = function() {
  alert( this.name );
}

let rabbit = new Rabbit("Rabbit");

rabbit.sayHi();                        // Rabbit
Rabbit.prototype.sayHi();              // undefined
Object.getPrototypeOf(rabbit).sayHi(); // undefined
rabbit.__proto__.sayHi();              // undefined
```
