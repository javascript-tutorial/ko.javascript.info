먼저, 해당 코드가 왜 작동하지 않는지 살펴봐야 합니다.

코드를 실행하면 이유를 찾을 수 있습니다. 상속 받는 클래스의 생성자는 `super()`를 반드시 호출해야 합니다. 그렇지 않으면 `"this"`가 '정의'되지 않습니다.

수정한 코드는 다음과 같습니다.

```js run
class Rabbit extends Object {
  constructor(name) {
*!*
    super(); // 상속 클래스의 생성자에선 부모 생성자를 반드시 호출해야 합니다.
*/!*
    this.name = name;
  }
}

let rabbit = new Rabbit("Rab");

alert( rabbit.hasOwnProperty('name') ); // true
```

그런데 이게 끝이 아닙니다.

위와 같이 수정 해도, 여전히 `"class Rabbit extends Object"`와 `class Rabbit`는 다른점이 있습니다.

아시다시피 'extends' 문법은 두 개의 프로토타입을 설정합니다.

1. 생성자 함수의 `"prototype"` 사이(일반 메서드용)
2. 생성자 함수 자체 사이(정적 메서드용)

예시의 `class Rabbit extends Object`는 다음과 같은 관계를 만들죠.

```js run
class Rabbit extends Object {}

alert( Rabbit.prototype.__proto__ === Object.prototype ); // (1) true
alert( Rabbit.__proto__ === Object ); // (2) true
```

따라서 `Rabbit`은 아래와 같이 `Rabbit`을 통해 `Object`의 정적 메서드에 접근할 수 있습니다.

```js run
class Rabbit extends Object {}

*!*
// 보통은 Object.getOwnPropertyNames 로 호출합니다.
alert ( Rabbit.getOwnPropertyNames({a: 1, b: 2})); // a,b
*/!*
```

그런데 `extends Object`가 없으면, `Rabbit.__proto__`는 `Object`로 설정되지 않습니다.

데모:

```js run
class Rabbit {}

alert( Rabbit.prototype.__proto__ === Object.prototype ); // (1) true
alert( Rabbit.__proto__ === Object ); // (2) false (!)
alert( Rabbit.__proto__ === Function.prototype ); // true (모든 함수의 기본 프로토타입)

*!*
// error, no such function in Rabbit
alert ( Rabbit.getOwnPropertyNames({a: 1, b: 2})); // Error
*/!*
```

이런 이유 때문에 `Rabbit`에서 `Object`의 정적 메서드를 사용할 수 없습니다.

한편, `Function.prototype`은 `call`, `bind` 등의 '일반' 함수 메서드를 가집니다. 내장 객체, `Object`의 생성자는 `Object.__proto__ === Function.prototype` 관계를 갖기 때문에 `Function.prototype`에 정의된 일반 함수 메서드는 두 경우 모두에 사용할 수 있습니다.  

이해를 돕기 위한 그림:

![](rabbit-extends-object.svg)

그냥 클래스를 정의하는 것과 명시적으로 `Object`를 상속해 클래스를 정의하는 것의 차이를 요약하면 다음과 같습니다.

| class Rabbit | class Rabbit extends Object  |
|--------------|------------------------------|
| --             | 생성자에서 `super()`를 반드시 호출해야 함 |
| `Rabbit.__proto__ === Function.prototype` | `Rabbit.__proto__ === Object` |
