# 원시 값의 메서드

자바스크립트는 원시 값(문자열(strings), 숫자(numbers) 등)를 마치 객체처럼 다룰 수 있게 해줍니다. 

따라서 원시 값에서도 객체처럼 메서드를 호출할 수 있습니다. 이 메서드에 대해선 곧 학습하도록 하겠습니다. 그 전에 다시 한번 원시 값은 객체가 아니란 것을 상기하도록 합시다.

먼저, 원시 값과 객체 사이의 주요 차이를 살펴보겠습니다.

원시값:

- 원시 타입의 값입니다.
- 원시 타입은 여섯 가지가 있습니다.: `문자열(string)`, `숫자(number)`, `불리언(boolean)`, `심볼(symbol)`, `null`, `undefined`.

객체:

- 프로퍼티(property)를 사용해 여러 값을 저장할 수 있습니다.
- `{name : "John", age : 30}`와 같이`{}`로 만들 수 있습니다. 자바스크립트에는 여러 종류의 객체가 있습니다. 함수도 객체의 한 종류입니다.

객체의 장점 중 하나는 함수를 프로퍼티로 저장할 수 있다는 것입니다.

```js run
let john = {
  name: "John",
  sayHi: function() {
    alert("Hi buddy!");
  }
};

john.sayHi(); // Hi buddy!
```

위의 코드에서, 객체 `john`에 `sayHi`라는 메서드가 정의된 것을 볼 수 있습니다. 

자바스크립트엔 날짜, 오류, HTML 요소(HTML elements) 등을 나타내는 다양한 내장 객체가 있습니다. 이 객체들은 객체 종류에 따라 고유한 프로퍼티와 메서드를 가집니다.

하지만, 이런 기능을 활용하는 건 시스템 자원을 많이 사용합니다!

객체는 원시 값보다 "무겁습니다". 내부 기능을 구동하기 위해 추가 자원이 필요하기 때문입니다. 하지만 프로퍼티와 메서드는 아주 유용하기 때문에, 자바스크립트 엔진에선 프로퍼티와 메서드 최적화를 통해 추가 부담을 줄이려 노력합니다.

## 원시 값을 객체처럼 사용하기

다음은 자바스크립트 창안자(creator)가 직면한 역설입니다.

- 문자열이나 숫자와 같은 원시 값을 다루어야 하는 작업이 많습니다. 메서드를 사용하면 이런 작업이 수월할 것 같다는 생각이 듭니다.
- 그런데 원시 값은 가능한 한 빠르고 가벼워야 합니다.

조금 어색해 보이지만, 자바스크립트 창안자는 아래 방법을 통해 해결책을 모색하였습니다.

1. 원시 값은 원시 값 그대로 남겨둡니다. 여전히 단일 값이기 때문에 가볍습니다.
2. 문자열, 숫자, 불리언, 심볼이 메서드와 프로퍼티에 접근하도록 언어 차원에서 허용합니다.
3. 이를 가능하게 하기 위해, 원시 값이 메서드나 프로퍼티를 참조하려고 하면 추가 기능을 제공하는 특수한 "원시 래퍼 객체(object wrapper)"를 생성해 줍니다. 사용이 끝나면 생성한 래퍼 객체를 삭제합니다.

The "object wrappers" are different for each primitive type and are called: `String`, `Number`, `Boolean` and `Symbol`. Thus, they provide different sets of methods.

For instance, there exists a method [str.toUpperCase()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase) that returns a capitalized string.

Here's how it works:

```js run
let str = "Hello";

alert( str.toUpperCase() ); // HELLO
```

Simple, right? Here's what actually happens in `str.toUpperCase()`:

1. The string `str` is a primitive. So in the moment of accessing its property, a special object is created that knows the value of the string, and has useful methods, like `toUpperCase()`.
2. That method runs and returns a new string (shown by `alert`).
3. The special object is destroyed, leaving the primitive `str` alone.

So primitives can provide methods, but they still remain lightweight.

The JavaScript engine highly optimizes this process. It may even skip the creation of the extra object at all. But it must still adhere to the specification and behave as if it creates one.

A number has methods of its own, for instance, [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) rounds the number to the given precision:

```js run
let n = 1.23456;

alert( n.toFixed(2) ); // 1.23
```

We'll see more specific methods in chapters <info:number> and <info:string>.


````warn header="`String/Number/Boolean` 생성자(Constructors)는 내부용으로만 사용합니다."
Java와 같은 일부 언어는 `new Number(1)` 또는 `new Boolean(false)`와 같이 타입을 명시적으로 적어주는 문법을 사용해 원시 "래퍼 객체"를 만듭니다.

자바스크립트에서도 역사적인 이유 때문에 이렇게 래퍼 객체를 생성하는 게 가능 합니다. 하지만, 이 방법을 **추천하지는 않습니다**. 여러 이유 때문에 당신을 미치게 할 것입니다. 

예시 :

```js run
alert( typeof 0 ); // "number"

alert( typeof new Number(0) ); // "object"!
```

객체는 `if`안에서 항상 참 같은 값으로 평가되기 때문에 alert 창이 활성화됩니다.

```js run
let zero = new Number(0);

if (zero) { // 변수 zero는 객체이므로, 참이 됩니다.
  alert( "zero is truthy!?!" );
}
```

On the other hand, using the same functions `String/Number/Boolean` without `new` is a totally sane and useful thing. They convert a value to the corresponding type: to a string, a number, or a boolean (primitive).

For example, this is entirely valid:
```js
let num = Number("123"); // convert a string to number
```
````


````warn header="`null/undefined` 는 메서드가 없습니다."
특수 자료형인 `null`과 `undefined` 원시 값은 위의 법칙을 따르지 않습니다. 이 자료형들에 대응하는 "래퍼 객체"는 없고, 따라서 메서드도 제공되지 않습니다. 어떤 의미에서, 두 자료형은 "가장 원시적"이라 할 수 있습니다.

두 자료형에 속한 값의 프로퍼티에 접근하려는 행위는 오류를 발생시킵니다.

```js run
alert(null.test); // error
````

## Summary

- Primitives except `null` and `undefined` provide many helpful methods. We will study those in the upcoming chapters.
- Formally, these methods work via temporary objects, but JavaScript engines are well tuned to optimize that internally, so they are not expensive to call.