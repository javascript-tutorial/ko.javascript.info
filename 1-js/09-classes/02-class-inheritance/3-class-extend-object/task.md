importance: 5

---

# 객체를 확장하는 클래스?

이미 살펴보았듯이, 보통 모든 객체들은 `Object.prototype` 으로 부터 상속되고 `hasOwnProperty` 같은 "제네릭" 객체의 메서드에 접근이 가능합니다

아래 예시가 있습니다.

```js run
class Rabbit {
  constructor(name) {
    this.name = name;
  }
}

let rabbit = new Rabbit("Rab");

*!*
// hasOwnProperty 메서드는 Object.prototype 으로 부터 왔습니다
alert( rabbit.hasOwnProperty('name') ); // true
*/!*
```

그런데 만약에 명시적으로 `"class Rabbit extends Object"` 라고 사용한다면, 결과는 간단히 `"class Rabbit"`로 사용하는 것과 다를까요?

그렇다면 무엇이 다를까요?

아래에 예시가 있습니다. (이것은 작동하지 않습니다 -- 왜 그럴까요? 작동하게 수정할 수 있을까요?)

```js
class Rabbit extends Object {
  constructor(name) {
    this.name = name;
  }
}

let rabbit = new Rabbit("Rab");

alert( rabbit.hasOwnProperty('name') ); // true
```
