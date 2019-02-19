# Data types(자료형)

JavaScript의 변수는 모든 데이터를 포함할 수 있습니다. 변수는 한 순간에 문자열이 될 수도 있고 다음 순간에는 숫자도 될 수 있습니다:

```js
// no error
let message = "hello";
message = 123456;
```

이러한 것을 허용하는 프로그래밍 언어를 "다이나믹 타이핑"이라고 하는데, 이는 Data types은 있지만 변수는 그 어느 것에도 구속되어 있지 않다는 것을 의미합니다.

JavaScript에는 7 가지 기본 데이터 자료형이 있습니다. 여기서는 전반적으로 다루고 이후에 챕터들 각각에 대해 자세히 다룰 것입니다.

## A number(숫자 자료형)

```js
let n = 123;
n = 12.345;
```

*number* 자료형은 정수 및 부동소수점 번호를 모두 나타냅니다.

숫자에 대한 많은 연산이 있습니다. (예 : 곱하기 `*`, 나눗셈 `/`, 덧셈 `+`, 뺄셈 `-` 등이 있습니다.

일반 숫자 외에도 이 데이터 자료형에 속하는 소위 "특수 숫자 값"이 있습니다 : `Infinity`, `-Infinity` 및 `NaN`.

- `Infinity`는 수학적 [무한대](https://en.wikipedia.org/wiki/Infinity) ∞를 나타냅니다. 어떤 숫자보다 큰 특별한 값입니다.

    우리는 0으로 나눈 결과로 얻을 수 있습니다:

    ```js run
    alert( 1 / 0 ); // Infinity
    ```

    아니면 직접 참조하십시오:

    ```js run
    alert( Infinity ); // Infinity
    ```
- `NaN`은 계산상의 오류를 나타냅니다. 다음과 같이 부정확하거나 정의되지 않은 수학 연산의 결과입니다.

    ```js run
    alert( "not a number" / 2 ); // NaN, such division is erroneous
    ```

    `NaN`은 여간해선 바뀌지 않습니다. `NaN`에 대한 어떠한 추가 연산도 `NaN`을 반환합니다. :

    ```js run
    alert( "not a number" / 2 + 5 ); // NaN
    ```

    따라서 `NaN`이 수학적 표현 어딘가에 있으면 모든 결과로 퍼트립니다. 

```smart header="수학적 연산은 안전합니다."
수학을 하는 것은 JavaScript에서 "안전"합니다. 우리는 0으로 나누고 숫자가 아닌 문자열을 숫자로 취급하는 등의 작업을 할 수 있습니다.

그런다고 치명적 오류로 스크립트가 멈추지 않습니다("die"). 최악의 경우 `NaN`을 결과로 얻습니다.
```

특수 숫자 값은 공식적으로 "number"자료형에 속합니다. 물론 이 것들은 상식적으로 숫자가 아닙니다.

<info:number> 챕터에서 우리는 숫자를 다루는 방법에 대해 더 자세히 알아볼 것입니다.

## A string(문자열)

JavaScript의 문자열은 따옴표로 묶어야합니다.

```js
let str = "Hello";
let str2 = 'Single quotes are ok too';
let phrase = `can embed ${str}`;
```

JavaScript에는 세 가지 자료형의 따옴표가 있습니다.

1. 큰 따옴표: `"Hello"`.
2. 작은 따옴표: `'Hello'`.
3. Backticks(역 따옴표, 백틱): <code>&#96;Hello&#96;</code>.

큰 따옴표와 작은 따옴표는 "간단한"따옴표입니다. JavaScript에서는 차이점이 없습니다.

Backticks는 "확장 된 기능"을 가진 따옴표입니다. 그것들은 `${…}`에서 변수와 표현식을 Backticks로 감싸진 문자열 안에 끼워 넣을 수 있게합니다. 예를 들면 :

```js run
let name = "John";

// embed a variable
alert( `Hello, *!*${name}*/!*!` ); // Hello, John!

// embed an expression
alert( `the result is *!*${1 + 2}*/!*` ); // the result is 3
```

`${…}` 내부 표현식의 수치를 구하고, 결과는 문자열의 일부가 됩니다. 우리는 거기에 무엇이든 넣을 수 있습니다: `name` 이나 `1 + 2` 와 같은 수학적 표현식 이나 좀더 복잡한 것들을 말입니다. 

이 방법은 Backticks에서만 수행할 수 있습니다. 다른 따옴표에는 이 포함 기능이 없습니다!
```js run
alert( "the result is ${1 + 2}" ); // the result is ${1 + 2} (double quotes do nothing)
```

<info:string> 챕터에서 문자열을 보다 자세하게 다룰 것입니다.

```smart header="*문자* 자료형은 없습니다."
일부 언어에는 단일 문자에 대해 특수한 "문자" 자료형이 있습니다. 예를 들어, C 언어와 Java에서의 `char`입니다. 

JavaScript에는 이러한 자료형이 없습니다. 자료형은 `string`뿐입니다. 문자열은 하나의 문자 또는 많은 문자들로 구성될 수 있습니다.
```

## A boolean (불리언 - 논리 자료형)

boolean 자료형은 `true`와 `false` 두 가지 값만 가지고 있습니다.

이 자료형은 일반적으로 yes/no 값을 저장하는데 사용됩니다. 'true'는 "yes, correct"를 의미하고 "false"는 "no, incorrect"를 의미합니다.

예를 들어:

```js
let nameFieldChecked = true; // yes, name field is checked
let ageFieldChecked = false; // no, age field is not checked
```
Boolean 값은 비교 결과로도 나타납니다:

```js run
let isGreater = 4 > 1;

alert( isGreater ); // true (the comparison result is "yes")
```

우리는 <info:logical-operators> 챕터에서 boolean을 더 자세하게 다루겠습니다.  

## "null"값

특수한 `null`값은 위에 설명 된 자료형 중 어느 것에도 속하지 않습니다.

그것은 `null`값만 포함하는 별도의 자료형을 형성합니다.

```js
let age = null;
```

JavaScript에서 `null`은 다른 언어와 마찬가지로 "존재하지 않는 object에 대한 참조" 또는 "null pointer"가 아닙니다.

이것은 "nothing"(아무것도 아닌), "empty"(빈) 또는 "unknown"(알수없는)을 나타내는 특별한 값입니다.

위의 코드는 무슨 이유에서인지 `age`를 unknown 이나 empty 라고 말합니다.

## The "undefined" value ("정의되지 않은" 값)

`undefined` 특수값도 위에서 설명한 자료형에서 벗어나 있습니다. 마치 `null`처럼 자신의 고유한 자료형을 만듭니다.

`undefined`의 의미는 '값이 할당되지 않음'입니다.

변수가 선언되었지만 할당되지 않았다면, 그 값은 `undefined`입니다 :

```js run
let x;

alert(x); // shows "undefined"
```

기술적으로, 어떠한 변수에도 `undefined`를 할당할 수 있습니다 :

```js run
let x = 123;

x = undefined;

alert(x); // "undefined"
```

...그러나 우리는 그렇게하는 것을 권장하지 않습니다. 일반적으로 변수에 "empty"또는 "unknown"값을 할당하기 위해`null`을 사용하고, 변수가 할당되었는지 확인하는 것과 같은 검사에는 `undefined`를 사용합니다.

## Objects and Symbols(객체와 심볼)

`object` 자료형은 특별합니다.

다른 모든 자료형은 그 값이 한 가지만 포함 할 수 있기 때문에 "primitive"(원시 자료형) 라고 합니다. (그것은 문자열이나 숫자 또는 무엇이든 될 수 있습니다). 대조적으로 objects는 데이터 모음과 더 복잡한 엔터티를 저장하는 데 사용됩니다. 우리가 primitives 에 대해 더 많이 배우고 나서 나중에 <info:object> 챕터에서 다룰 것입니다. 

`symbol` 자료형은 objects에 대한 고유한 식별자(unique identifiers)를 생성하는 데 사용됩니다. 완전한 설명을 위해 여기서 언급해야 하지만, objects를 공부한 이후에 이 자료형을 공부하는 것이 더 좋습니다. 

## The typeof operator(typeof 연산자) [#type-typeof] 

`typeof` 연산자는 argument(인수)의 자료형을 반환합니다. 다른 자료형의 값을 다르게 처리하거나 빠른 검사를 하고 싶을 때 유용합니다.

그것은 두 가지 형태의 syntax(문법)을 지원합니다 :

1. As an operator(연산자): `typeof x`.
2. As a function(함수): `typeof(x)`.

다시 말해, 괄호가 있든 없든 이것은 괄호로 작동합니다. 결과는 같습니다.

`typeof x` 호출은 자료형 이름의 문자열을 반환합니다:

```js
typeof undefined // "undefined"

typeof 0 // "number"

typeof true // "boolean"

typeof "foo" // "string"

typeof Symbol("id") // "symbol"

*!*
typeof Math // "object"  (1)
*/!*

*!*
typeof null // "object"  (2)
*/!*

*!*
typeof alert // "function"  (3)
*/!*
```

마지막 세 줄에는 추가 설명이 필요할 수 있습니다:

1. `Math`은 수학 연산을 제공하는 내장된 object입니다. 우리는 이것을 <info:number> 챕터에서 배울 것입니다. 여기서는 이것을 object의 예로서 사용합니다.
2. `typeof null`의 결과는 `"object"`입니다. 이 결과는 잘못됐습니다. 호환성을 위해 보관 된 `typeof`에서 공식적으로 인정되는 오류입니다. 물론 `null`은 object가 아닙니다. 별도의 고유한 자료형의 특수 값입니다. 다시 말하지만 이것은 언어의 오류입니다.
3. `alert`는 언어의 함수이기 때문에 `typeof alert`의 결과는 `"function"`입니다. 우리는 다음 장에서 function을 공부할 것이고, JavaScript에는 특별히 "function"자료형이 없다는 것에 대해 볼겁니다. Functions는 object 자료형에 속합니다. 그러나 `typeof`는 그것들을 다르게 취급합니다. 형식적으로는 잘못되었지만 실제로는 매우 편리합니다. 

## 요약

JavaScript에는 7 가지 기본 자료형이 있습니다.

- 어떠한 종류의 숫자 위한 `number`: 정수 또는 부동 소수점.
- 문자열을 위한 `string`. 문자열에는 하나 이상의 문자가 있을 수 있으며, 별도의 단일 문자 자료형(Char)은 없습니다.
- `true`/`false`(참/거짓)을 위한 `boolean`.
- 알 수 없는 값의 `null` -- 단일 값 `null` 을 가진 독립 자료형입니다.
- 할당되지 않은 값을 위한 `undefined`- 단일 값 `undefined`인 가진 독립 자료형입니다.
- 더 복잡한 자료 구조를 위한 `object`
- 고유한 식별자를 위한 `symbol`

`typeof` 연산자는 어떤 자료형이 변수에 저장되어 있는지를 알려줍니다.

- 2가지 형식: `typeof x` 이거나 `typeof(x)`.
- `"string"`과 같이 자료형의 이름을 가진 문자열을 반환합니다.
- For `null` returns `"object"` -- this is an error in the language, it's not actually an object.
- `null`은 `"object"`를 반환합니다. -- 이것은 이 언어의 오류 입니다. 실제로는 object가 아닙니다. 

다음 장에서는 primitive 값에 대해 살펴보고 일단 익숙해지면 objects로 넘어갑니다.
