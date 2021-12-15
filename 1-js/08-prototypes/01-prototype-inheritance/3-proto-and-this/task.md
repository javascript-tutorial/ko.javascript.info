importance: 5

---

# 어디에 프로퍼티가 추가될까요

`animal`을 상속받는 `rabbit`이 있습니다.

`rabbit.eat()`을 호출했을 때, `animal`과 `rabbit` 중 어떤 객체에 `full` 프로퍼티가 생길까요?

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
