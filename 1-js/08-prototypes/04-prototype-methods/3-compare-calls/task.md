importance: 5

---

# 호출 간의 차이점

새로운 `rabbit` 객체를 만들어 봅시다.

```js
function Rabbit(name) {
  this.name = name;
}
Rabbit.prototype.sayHi = function() {
  alert(this.name);
};

let rabbit = new Rabbit("Rabbit");
```

아래와 같이 메서드를 호출하면 동일하게 동작할지 다르게 동작할지 예상해 보세요.

```js
rabbit.sayHi();
Rabbit.prototype.sayHi();
Object.getPrototypeOf(rabbit).sayHi();
rabbit.__proto__.sayHi();
```
