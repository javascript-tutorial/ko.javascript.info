importance: 5

---

# Error creating an instance

아래에 Animal 클래스를 상속하는 Rabbit 코드가 있습니다.

아직은 Rabbit 객체를 생성할 수 없습니다. 무엇이 잘못된 것일까요? 코드를 수정해보세요.
```js run
class Animal {

  constructor(name) {
    this.name = name;
  }

}

class Rabbit extends Animal {
  constructor(name) {  
    this.name = name;
    this.created = Date.now();
  }
}

*!*
let rabbit = new Rabbit("White Rabbit"); // 에러: 정의되지 않음
*/!*
alert(rabbit.name);
```
