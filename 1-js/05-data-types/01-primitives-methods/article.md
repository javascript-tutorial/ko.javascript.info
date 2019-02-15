# Primitives(원시 자료형)의 메서드

우리는 JavaScript로 primitives(strings(문자형), numbers(숫자형), etc)을 마치 objects(객체 자료형)처럼 사용할 수 있습니다. 

또한 이 primitives는 objects처럼 호출할 수 있는 메서드를 제공합니다. 우리는 곧 primitives를 공부할 것이지만, 우선 우리는 그것이 어떻게 작동하는지 확인할 것입니다. 왜냐하면, 물론 이 것은 objects가 아니기 때문입니다. (그리고 여기서 우리는 그것을 더 명확하게 짚고 넘어갈 것입니다.)

Primitives 와 objects 사이의 주요 차이를 살펴 보겠습니다.

A primitive(원시자료)

- 원시적 자료형의 값입니다.
- 6 가지 기본 유형이 있습니다.: `string`, `number`, `boolean`, `symbol`, `null` and `undefined`.

An object(객체)

- Properties(속성)로 여러 값들을 저장할 수 있습니다.
- `{name : "John", age : 30}`와 같이`{}`로 만들 수 있습니다. JavaScript에는 다른 종류의 objects가 있습니다. functions(함수)는 예를 들어 objects입니다.

objects에 대한 가장 좋은 점 중 하나는 function 을 properties 중 하나로 저장할 수 있다는 것입니다.

```js run
let john = {
  name: "John",
  sayHi: function() {
    alert("Hi buddy!");
  }
};

john.sayHi(); // Hi buddy!
```

그래서 여기서 우리는 sayHi라는 메서드로 john이라는 object를 만들었습니다.

날짜, 오류, HTML 요소 등으로 작동하는 객체와 같이 이미 내장된 객체가 많이 있습니다. 그들은 다른 속성과 메서드를을 가지고 있다.

하지만, 이 기능들은 비용이 듭니다!(시스템 자원을 많이 사용합니다.)

Objects는 primitives보다 "무겁"습니다. 내부 장치를 사용하기 위해 추가 자원이 필요합니다. 그러나 properties와 메서드가 프로그래밍에 매우 유용하기 때문에 JavaScript 엔진은 추가 부담을 줄이기 위해 optimize(최적화)하려고 노력합니다.

## 객체로서의 primitive(원시 자료형)

다음은 JavaScript 작성자가 직면 한 역설입니다.

- string(문자형)이나 number(숫자형)와 같은 primitive를 사용하여 수행하고자하는 많은 작업이 있습니다. 메서드로 액세스하는 것이 좋을 것입니다.
- primitive는 가능한 한 빠르고 가벼워야합니다.

해결책은 조금 어색해 보이지만, 여기에 있습니다 :

1. Primitives는 여전히 primitive입니다. 바라시는 단일 값입니다.
2. 언어는 strings, numbers, booleans(논리 자료형) 및 symbol(ECMAScript 6 에 추가되었습니다)의 메서드 및 속성에 대한 액세스를 허용합니다.
3. 이런 일이 발생하면 추가 기능을 제공하는 특수한 "object wrapper"가 생성 된 다음 소멸됩니다.

"object wrappers"는 각 primitive type에 따라 다르며 `String`,`Number`,`Boolean`과 `Symbol`라고 불립니다. 따라서, 그들은 다른 세트의 메서드를 제공합니다.

예를 들어 대문자로 된 문자열을 반환하는 [str.toUpperCase()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase) 메서드가 있습니다.

다음은 작동 방식입니다.

```js run
let str = "Hello";

alert( str.toUpperCase() ); // HELLO
```

간단 하죠? 다음은 `str.toUpperCase ()`에서 실제로 일어나는 일입니다 :

1. 문자열 `str`은 primitive 입니다. 그래서 property에 접근하는 순간에, 문자열의 값을 알고,`toUpperCase()`와 같은 유용한 메서드를 가진 특별한 object가 생성됩니다.
2. 이 메서드는 실행되어 새로운 문자열을 반환합니다 (`alert`로 나타납니다).
3. 특별한 object는 파괴되고 primitive `str`만을 남겨 둡니다.

따라서 primitives는 메서드를 제공 할 수 있지만 여전히 가볍습니다.

JavaScript 엔진은 이 프로세스를 고도로 최적화합니다. 이 것은 심지어 여분의 object 의 생성을 전혀 하지않고 건너 뛸 수도 있습니다. 그러나 여전히 명세를 고수하고 마치 object를 생성하는 것처럼 작동해야합니다.

숫자에는 고유 한 메서드가 있습니다. 예를 들어 [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)는 주어진 정밀도로 숫자를 반올림합니다. 

```js run
let n = 1.23456;

alert( n.toFixed(2) ); // 1.23
```

<info:number> 및 <info:string> 장에서 보다 구체적인 메서드를 볼 수 있습니다.

````warn header="Constructors(생성자) `String/Number/Boolean` 는 내적 용도로만 사용합니다."
Java와 같은 일부 언어는 `new Number(1)` 또는 `new Boolean(false)` 과 같은 syntax(구문)을 사용하여 명시 적으로 primitives 에 대해 "wrapper objects"를 만들 수 있습니다.


JavaScript에서는 이 것들은 역사적인 이유로 가능은 하지만, 매우 **추천하지는 않습니다**. 여러 곳에서 당신을 미치게 만들 것입니다. 

예를 들면 :

```js run
alert( typeof 1 ); // "number"

alert( typeof new Number(1) ); // "object"!
```

그리고 다음에 나오는 'zero'가 object 이기 때문에 경고가 나타납니다.

```js run
let zero = new Number(0);

if (zero) { // zero is true, because it's an object
  alert( "zero is truthy?!?" );
}
```

반면에 `new`가 없는 `String / Number / Boolean` 함수를 사용하면 완전히 제정신으로 유용하게 사용할 수 있습니다. 값을 문자열형, 숫자형 또는 논리자료형 (primitive)의 해당 유형으로 변환합니다.

예를 들어, 이것은 전적으로 유효합니다.
```js
let num = Number("123"); // convert a string to number
```
````

````warn header="`null/undefined` 는 메서드가 없습니다."
특수한 `null`과 `undefined` primitives는 예외입니다. 그들에는 대응하는 "wrapper objects"가 없고 메서드를 제공하지 않는다. 어떤 의미에서는, 그들은 "가장 원시적 인" 것입니다.

이러한 값의 속성에 액세스하려고하면 오류가 발생합니다.

```js run
alert(null.test); // error
```
````

## 요약

- 'null'과 'undefined'를 제외한 primitives 는 유용한 메서드를 제공합니다. 우리는 다음 장에서 그것들을 공부할 것입니다.
- 공식적으로 이러한 메서드는 임시 objects를 통해 작동하지만 JavaScript 엔진은 내부적으로 최적화되도록 잘 조정되어 있으므로 호출 비용이 비싸지 않습니다.