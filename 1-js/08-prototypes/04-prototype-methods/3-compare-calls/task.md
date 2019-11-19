importance: 5

---

# 호출 간의 차이점

새로운 `rabbit` 오브젝트를 만들어 봅시다.

```js
function Rabbit(name) {
  this.name = name;
}
Rabbit.prototype.sayHi = function() {
  alert(this.name);
};

let rabbit = new Rabbit("Rabbit");
```

이 호출들은 똑같이 동작합니까?

```js
rabbit.sayHi();
Rabbit.prototype.sayHi();
Object.getPrototypeOf(rabbit).sayHi();
rabbit.__proto__.sayHi();
```
