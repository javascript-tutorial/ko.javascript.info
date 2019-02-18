# 원시 자료형(Primitives)의 메서드

자바스크립트는 Primitives(문자열(strings), 숫자(numbers) 등의 원시 자료형)를 마치 객체처럼 다룰 수 있게 해줍니다. 

또한 이 primitives는 objects처럼 호출할 수 있는 메서드를 제공합니다. 우리는 곧 primitives를 공부할 것이지만, 우선 우리는 그것이 어떻게 작동하는지 확인할 것입니다. 왜냐하면, 물론 이 것은 objects가 아니기 때문입니다. (그리고 여기서 우리는 그것을 더 명확하게 짚고 넘어갈 것입니다.)

또한 이 primitives는 객체처럼 호출할 수 있는 메서드도 제공합니다. 호출 가능한 메서드에 대해서 학습하기 전에 원시자료형에 어떻게 메서드를 사용할 수 있는지 알아보도록 하겠습니다. 메서드를 사용할 수 있지만 여기서 Primitives는 객체가 아닙니다(여기서 우리는 이 점을 더 명확하게 집고 넘어갈 것입니다). 

먼저, Primitives 와 객체 사이의 주요 차이를 살펴 보겠습니다.

A primitive(원시자료)

- 원시 자료형의 값입니다.
- 여섯 가지 기본 유형이 있습니다.: `문자열(string)`, `숫자(number)`, `불리언(boolean)`, `심볼(symbol)`, `null`, `undefined`.

객체

- 프로퍼티(property)를 사용해 여러 값을 저장할 수 있습니다.
- `{name : "John", age : 30}`와 같이`{}`로 만들 수 있습니다. 자바스크립트에는 여러 종류의 객체가 있습니다. 함수는 객체의 예중 하나입니다.

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

위에서 우리는 `sayHi`라는 메서드가 정의된 `john`이라는 객체를 만들었습니다.

날짜, 오류, HTML 요소(HTML elements) 등에 관한 다양한 내장 객체가 존재합니다. 이 객체들은 각각 자신만의 프로퍼티와 메서드를을 가지고 있습니다.

하지만, 프로퍼티와 메서드를 사용하는 것은 시스템 자원을 많이 사용합니다!

객체는 primitives 보다 "무겁습니다". 내부 기능을 구동하기 위해 추가 자원이 필요하기 때문입니다. 하지만 프로그래밍에서 프로퍼티와 메서드가 매우 유용한 역할을 하기 때문에, 자바스크립트 엔진은 추가 부담을 줄이기 위해 프로퍼티와 메서드를 최적화하려고 노력합니다.

## 객체로서의 primitive

다음은 자바스크립트 창안자(creator)가 직면 한 역설입니다:

- 문자열이나 숫자와 같은 primitive를 다루어야 하는 많은 작업이 있습니다. 이런 작업을 메서드로 수행하면 좋을 것같습니다.
- primitive는 가능한 한 빠르고 가벼워야합니다.

조금 어색해 보이지만, 해결책은 여기에 있습니다 :

1. Primitives는 여전히 primitive입니다. 여전히 단일 값입니다.
2. 문자열, 숫자, 불리언, 심볼 타입의 메서드와 프로퍼티에 대한 접근을 허용합니다.
3. premitive의 메서드나 프로퍼티를 참조하려고 하면 추가 기능을 제공하는 특수한 "원시 래퍼 객체(object wrapper)"를 생성한다음 다음 삭제합니다.

"원시 래퍼 객체"는 primitive 타입에 따라 각각 다른 종류가 있습니다. 각 래퍼 객체는 원시 자료형의 이름을 그대로 따 `String`,`Number`,`Boolean`, `Symbol`로 부릅니다. 원시 자료형에 따라 원시 래퍼 객체도 다른 세트의 메서드를 제공합니다.

대문자로 된 문자열을 반환하는 [str.toUpperCase()](https://developer.mozilla.org/en/docs/Web/자바스크립트/Reference/Global_Objects/String/toUpperCase) 메서드를 예로 들어보겠습니다.

어떻게 작동하는지 알아봅시다:

```js run
let str = "Hello";

alert( str.toUpperCase() ); // HELLO
```

간단 하죠? 아래는 `str.toUpperCase ()`에서 실제로 일어나는 일입니다:

1. 문자열 `str`은 primitive 입니다. 그래서 프로퍼티에 접근하는 순간, 문자열의 값을 알고, `toUpperCase()`와 같은 유용한 메서드를 가진 특별한 객체가 생성됩니다.
2. 메서드가 실행되고, 새로운 문자열을 반환합니다 (`alert`창에 나타납니다).
3. 특별한 객체는 파괴되고, 다시 primitive `str`만 남습니다.

이런 과정 때문에 primitives는 메서드를 제공 할 수 있으면서 여전히 가볍습니다.

자바스크립트 엔진은 위 프로세스를 고도로 최적화합니다. 심지어 여분의 객체 생성 없이 위 과정이 가능하도록 합니다. 최적화 과정은 객체를 생성 하지 않고도, 명세를 지키며, 마치 원시 래퍼 객체를 생성한것 처럼 작동해야 합니다.

숫자 타입엔 고유한 메서드가 있습니다. 대표적인 메서드인 [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/자바스크립트/Reference/Global_Objects/Number/toFixed)는 주어진 정밀도로 숫자를 반올림합니다. 

```js run
let n = 1.23456;

alert( n.toFixed(2) ); // 1.23
```

<info:number>, <info:string> 주제에서 보다 구체적인 메서드를 알아보도록 하겠습니다.

````warn header="`String/Number/Boolean` 생성자(Constructors)는 내부용으로만 사용합니다."
Java와 같은 일부 언어는 `new Number(1)` 또는 `new Boolean(false)` 과 같은 syntax(구문)을 명시적으로 사용하여 primitives "래퍼 객체"를 만듭니다.


자바스크립트에서도 역사적인 이유 때문에 이렇게 래퍼 객체를 생성하는게 가능 하지만, **추천하지는 않습니다**. 여러 이유 때문에 당신을 미치게 만들 것입니다. 

예시 :

```js run
alert( typeof 1 ); // "number"

alert( typeof new Number(1) ); // "object"!
```

아래의 변수 'zero'는 객체이기 때문에 alert창이 활성화 됩니다.

```js run
let zero = new Number(0);

if (zero) { // zero is true, because it's an object
  alert( "zero is truthy?!?" );
}
```

반면에 `new`를 쓰지 않고 `String / Number / Boolean` 함수를 사용하면 원하던 의도대로 생성자를 유용하게 사용할 수 있습니다. 의도한 바와 같이 값을 문자열, 숫자, 불리언 primitive 으로 변환해 줍니다.

아래는 전적으로 유효한 코드입니다:
```js
let num = Number("123"); // 문자열을 숫자 primitive로 변환
```
````

````warn header="`null/undefined` 는 메서드가 없습니다."
특수 자료형인 `null`과 `undefined` primitives는 법칙을 따르지 않습니다. 이 자료형들에 대응하는 "래퍼 객체"가 없고 메서드도 제공하지 않습니다. 어떤 의미에서, 두 자료형은 "가장 원시적"이라 할 수 있습니다.

두 자료형에 속한 값의 프로퍼티에 접근하려는 행위는 오류를 발생시킵니다.

```js run
alert(null.test); // error
```
````

## 요약

- 'null'과 'undefined'를 제외한 primitives 는 유용한 메서드를 제공합니다. 다음 주제에서 이 메서드를 공부할 것입니다.
- 공식적으로 이러한 메서드는 임시 객체 생성을 통해 작동하지만, 자바스크립트 엔진은 내부 최적화가 되어있어 메서드 호출 비용이 비싸지 않습니다.