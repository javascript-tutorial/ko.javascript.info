importance: 5

---

<<<<<<< HEAD
# 어디에서 쓸까요?
=======
# Where does it write?
>>>>>>> e92bb83e995dfea982dcdc5065036646bfca13f0

`animal`에서 상속받은 `rabbit`이 있습니다.

`rabbit.eat()`을 호출했을 때, `animal`과 `rabbit` 중 어떤 객체가 `full` 프로퍼티를 받을까요?

```js
let animal = {
  eat() {
    this.full = true;
  }
};

let rabbit = {
  __proto__: animal
};

rabbit.eat();
```
