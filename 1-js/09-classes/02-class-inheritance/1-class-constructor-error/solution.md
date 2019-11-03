자식 클래스의 생성자에서 `super()`를 호출하지 않아 에러가 발생했습니다.

수정 후 코드는 다음과 같습니다.

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
let rabbit = new Rabbit("White Rabbit"); // 잘 동작합니다.
*/!*
alert(rabbit.name); // White Rabbit
```
