인스턴스를 생성할 수 없었던 이유는 자식의 생성자가 `super()`를 호출해야 하기 때문입니다.

아래에 올바른 코드가 있습니다.

```js run
class Animal {

  constructor(name) {
    this.name = name;
  }

}

class Rabbit extends Animal {
  constructor(name) {  
    *!*
    super(name);
    */!*
    this.created = Date.now();
  }
}

*!*
let rabbit = new Rabbit("White Rabbit"); // 이제 생성됩니다
*/!*
alert(rabbit.name); // White Rabbit
```
