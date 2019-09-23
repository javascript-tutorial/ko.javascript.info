먼저, 해당 코드가 왜 작동하지 않는지 살펴봐야 합니다.

이유는 코드를 실행한다면 명백해 보입니다. 상속받는 클래스는 `super()`를 반드시 호출해야 합니다. 그렇지 않으면 `"this"` 는 "정의"되지 않기 때문이죠.

아래 수정된 코드가 있습니다.

```js run
class Rabbit extends Object {
  constructor(name) {
*!*
    super(); // 상속할 때 부모의 생성자를 호출해야 합니다.
*/!*
    this.name = name;
  }
}

let rabbit = new Rabbit("Rab");

alert( rabbit.hasOwnProperty('name') ); // true
```

그런데 그게 전부는 아닙니다.

위와 같이 수정한다고 해도, 여전히 `"class Rabbit extends Object"`와 `class Rabbit` 사이에는 다른 점이 존재합니다.

이미 배웠듯이, "extends" 문법은 두 개의 프로토타입을 설정합니다.

1. 생성자 함수들의 `"prototype"` 사이에 (메서드를 위한 것)
2. 생성자 함수 자신들 사이에 (정적인 메서드를 위한 것)

예제의 경우에는, `class Rabbit extends Object`가 뜻하는 것은 아래와 같습니다.

```js run
class Rabbit extends Object {}

alert( Rabbit.prototype.__proto__ === Object.prototype ); // (1) true
alert( Rabbit.__proto__ === Object ); // (2) true
```

그래서 `Rabbit` 이 `Object` 의 정적인 메서드에 `Rabbit` 을 통해서 접근할 수 있게 해야 합니다. 아래와 같이 말이죠.

```js run
class Rabbit extends Object {}

*!*
//  보통은 Object.getOwnPropertyNames 로 호출합니다
alert ( Rabbit.getOwnPropertyNames({a: 1, b: 2})); // a,b
*/!*
```

그러나 `extends Object`가 없다면, `Rabbit.__proto__` 은 `Object`로 설정되지 않습니다.

아래에 예시가 있습니다.

```js run
class Rabbit {}

alert( Rabbit.prototype.__proto__ === Object.prototype ); // (1) (true Rabbit의 프로토타입은 객체의 프로토타입입니다. - Chris)
alert( Rabbit.__proto__ === Object ); // (2) false (!) (Rabbit의 프로토타입은 객체가 아닙니다. - Chris) 
alert( Rabbit.__proto__ === Function.prototype ); // 어떠한 함수든 기본으로 (__proto__는 함수의 프로토타입입니다. - Chris)

*!*
// error, no such function in Rabbit
alert ( Rabbit.getOwnPropertyNames({a: 1, b: 2})); // 에러
*/!*
```

그래서 `Rabbit`은 `Object`의 정적 메서드에 접근을 할 수 없습니다.

어쨌든 `Function.prototype` 은 `call`, `bind` 기타 등등의 "제네릭" 함수의 메서드를 가집니다. 제네릭 함수들은 궁극적으로 두 가지 경우에 모두 사용 가능합니다. 왜냐하면, `Object`의 내장된 생성자는 `Object.__proto__ === Function.prototype` 이기 때문이죠.

이해를 돕기 위한 그림이 있습니다.

![](rabbit-extends-object.svg)

그래서, 짧게 요약하면 두 가지 다른 점이 있습니다.

| class Rabbit | class Rabbit extends Object  |
|--------------|------------------------------|
| --             | `super()`를 생성자에서 호출해야 합니다. |
| `Rabbit.__proto__ === Function.prototype` | `Rabbit.__proto__ === Object` |
