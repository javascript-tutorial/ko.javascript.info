# 자료형

자바스크립트의 변수는 어떤 데이터든지 담을 수 있습니다. 변수는 어떤 순간에 문자열일 수 있고 다른 순간엔 숫자가 될 수도 있습니다.

```js
// 변숫값을 문자열에서 숫자로 바꿔도 에러가 발생하지 않습니다.
let message = "hello";
message = 123456;
```

이처럼 자료의 타입은 있지만, 변수의 타입은 언제든지 바꿀 수 있는 언어를 "동적 타입(dynamically typed)" 언어라고 부릅니다.

<<<<<<< HEAD
자바스크립트에는 일곱 가지 기본 자료형이 있습니다. 이번 챕터에선 이 자료형 모두를 전반적으로 다루도록 하겠습니다. 각 자료형에 대한 세부 사항들은 이어지는 챕터에서 다루도록 하겠습니다.

## 숫자형
=======
There are eight basic data types in JavaScript. Here, we'll cover them in general and in the next chapters we'll talk about each of them in detail.

## Number
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912

```js
let n = 123;
n = 12.345;
```

*숫자형(number type)* 은 정수 및 부동소수점 숫자(floating point number)를 나타냅니다.

숫자형과 관련된 연산엔 곱셈 `*`, 나눗셈 `/`, 덧셈 `+`, 뺄셈 `-` 등이 있습니다.

숫자형엔 일반적인 숫자 외에 `Infinity`, `-Infinity`, `NaN`같은 "특수 숫자 값(special numeric value)"이 포함됩니다.

- `Infinity`는 어떤 숫자보다 큰 특별한 값인 [무한대 ∞](https://en.wikipedia.org/wiki/Infinity)를 나타냅니다.

    어느 숫자든 0으로 나누면 무한대를 얻을 수 있습니다.

    ```js run
    alert( 1 / 0 ); // 무한대
    ```

    `Infinity`를 직접 참조할 수도 있습니다.

    ```js run
    alert( Infinity ); // 무한대
    ```
- `NaN`은 계산 중에 에러가 발생했다는 것을 나타내주는 값입니다. 부정확하거나 정의되지 않은 수학 연산을 사용하면 계산 중에 에러가 발생하는 데, 이때 `NaN`이 반환됩니다.

    ```js run
    alert( "숫자가 아님" / 2 ); // NaN, 문자열을 숫자로 나누면 오류가 발생합니다.
    ```

    `NaN`은 여간해선 바뀌지 않습니다. `NaN`에 어떤 추가 연산을 해도 결국 `NaN`이 반환됩니다.

    ```js run
    alert( "숫자가 아님" / 2 + 5 ); // NaN
    ```

    연산 과정 어디에선가 `NaN`이 반환되었다면, 이는 모든 결과에 영향을 미칩니다.

```smart header="수학 연산은 안전합니다."
자바스크립트에서 행해지는 수학 연산은 "안전"하다고 볼 수 있습니다. 무언가를 0으로 나누거나 숫자가 아닌 문자열을 숫자로 취급하는 등의 이례적인 연산이 자바스크립트에선 가능합니다.

말이 안 되는 수학 연산을 하더라도 스크립트는 치명적인 에러를 내뿜으며 죽지 않습니다. `NaN`을 반환하며 연산이 종료될 뿐입니다.
```

현실에선 특수 숫자 값을 숫자로 취급하진 않습니다. 하지만 자바스크립트에선 특수 숫자 값을 숫자형으로 분류합니다.

숫자를 다루는 방법에 대해선 <info:number> 챕터에서 자세히 알아보도록 하겠습니다.

<<<<<<< HEAD
## 문자형
=======
## BigInt

In JavaScript, the "number" type cannot represent integer values larger than <code>2<sup>53</sup></code> (or less than <code>-2<sup>53</sup></code> for negatives), that's a technical limitation caused by their internal representation. That's about 16 decimal digits, so for most purposes the limitation isn't a problem, but sometimes we need really big numbers, e.g. for cryptography or microsecond-precision timestamps.

`BigInt` type was recently added to the language to represent integers of arbitrary length.

A `BigInt` is created by appending `n` to the end of an integer literal:

```js
// the "n" at the end means it's a BigInt
const bigInt = 1234567890123456789012345678901234567890n;
```

As `BigInt` numbers are rarely needed, we devoted them a separate chapter <info:bigint>.

```smart header="Compatability issues"
Right now `BigInt` is supported in Firefox and Chrome, but not in Safari/IE/Edge.
```

## String
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912

자바스크립트에선 문자열(string)을 따옴표로 묶습니다.

```js
let str = "Hello";
let str2 = 'Single quotes are ok too';
let phrase = `can embed another ${str}`;
```

따옴표는 아래와 같이 세 종류가 있습니다.

1. 큰따옴표: `"Hello"`
2. 작은따옴표: `'Hello'`
3. 역 따옴표(백틱, backtick): <code>&#96;Hello&#96;</code>

<<<<<<< HEAD
큰따옴표와 작은따옴표는 "기본적인" 따옴표로, 자바스크립트에서는 이 둘에 차이를 두지 않습니다.
=======
Double and single quotes are "simple" quotes. There's practically no difference between them in JavaScript.
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912

역 따옴표로 변수나 표현식을 감싼 후 `${…}`안에 넣어주면, 원하는 변수나 표현식을 문자열 중간에 손쉽게 넣을 수 있습니다. 아래와 같이 말이죠.

```js run
let name = "John";

// 변수를 문자열 중간에 삽입
alert( `Hello, *!*${name}*/!*!` ); // Hello, John!

// 표현식을 문자열 중간에 삽입
alert( `the result is *!*${1 + 2}*/!*` ); // the result is 3
```

`${…}` 안에는 `name` 같은 변수나 `1 + 2` 같은 수학 관련 표현식을 넣을 수 있습니다. 물론 더 복잡한 표현식도 넣을 수 있죠. 무엇이든 들어갈 수 있습니다. 이렇게 문자열 중간에 들어간 변수나 표현식은 평가가 끝난 후 문자열의 일부가 됩니다. 

큰따옴표나 작은따옴표를 사용하면 원하는 대로 동작하지 않는다는 점에 주의하시기 바랍니다. 이 방법은 역 따옴표를 써야만 가능합니다.
```js run
alert( "the result is ${1 + 2}" ); // the result is ${1 + 2} (큰따옴표는 확장 기능을 지원하지 않습니다.)
```

문자열은 <info:string>챕터에서 더 자세히 다루도록 하겠습니다. 

<<<<<<< HEAD
```smart header="*글자형*은 없습니다."
일부 언어는 글자 하나를 저장할 때 쓰이는 자료형, "글자(character)"형을 따로 지원합니다. C 언어와 Java의 `char`가 그 대표적인 예입니다.
=======
```smart header="There is no *character* type."
In some languages, there is a special "character" type for a single character. For example, in the C language and in Java it is called "char".
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912

자바스크립트는 글자형을 지원하지 않습니다. 한 글자 혹은 여러 글자로 구성된 `문자열`을 저장할 때 쓰이는 자료형인 문자형만 지원합니다.
```

<<<<<<< HEAD
## 불린형
=======
## Boolean (logical type)
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912

불린형(논리 타입)은 `true`와 `false` 두 가지 값밖에 없는 자료형입니다.

불린형은 긍정(yes)이나 부정(no)을 나타내는 값을 저장할 때 사용합니다. `true`는 긍정, `false`는 부정을 의미합니다.

예시:

```js
let nameFieldChecked = true; // 네, name field가 확인되었습니다(checked).
let ageFieldChecked = false; // 아니요, age field를 확인하지 않았습니다(checked)
```

불린값은 비교 결과를 저장할 때 사용되기도 합니다.

```js run
let isGreater = 4 > 1;

alert( isGreater ); // true (비교 결과: "yes")
```

불린형에 대한 자세한 사항들은 <info:logical-operators> 챕터에서 다루도록 하겠습니다.

## "null" 값

`null` 값은 지금까지 소개한 자료형 중 어느 자료형에도 속하지 않는 값입니다.

`null` 값은 오로지 `null` 값만 포함하는 별도의 자료형을 형성합니다.

```js
let age = null;
```

자바스크립트의 `null`은 자바스크립트 이외 언어의 `null`과 성격이 다릅니다. 자바스크립트 이외 언어에선 `null`을 "존재하지 않는 객체에 대한 참조" 또는 "널 포인터(null pointer)"를 나타낼 때 사용합니다.

하지만 자바스크립트에선 `null`을 "존재하지 않는(nothing)" 값, "비어 있는(empty)" 값, "알 수 없는(unknown)" 값을 나타내는 데 사용합니다.

`let age = null;`은 `나이(age)`를 알 수 없거나 그 값이 비어있음을 보여줍니다.

## "undefined" 값

`undefined` 값도 `null`이 자신만의 고유한 자료형을 만드는 것처럼 자신만의 자료형을 형성합니다.

`undefined`는 "값이 할당되지 않은 상태"를 나타낼 때 사용합니다.

변수는 선언했지만, 값을 할당하지 않았다면 해당 변수에 `undefined`가 자동으로 할당됩니다.

```js run
let x;

alert(x); // "undefined"
```

개발자가 변수에 `undefined`를 직접 할당하는 것도 가능하긴 합니다.

```js run
let x = 123;

x = undefined;

alert(x); // "undefined"
```

하지만 이렇게 `undefined`를 직접 할당하는 걸 권장하진 않습니다. 변수가 "비어있거나" "알 수 없는" 상태라는 걸 나타내려면 `null`을 사용하세요. `undefined`는 변수에 값이 할당되었는지 여부를 확인할 때 사용하도록 합시다.

## 객체와 심볼

`객체(object)`형은 특수한 자료형입니다.

객체형을 제외한 다른 자료형은 문자열이든 숫자든 한 가지만 표현할 수 있기 때문에 원시(primitive) 자료형이라 부릅니다. 반면 객체는 데이터 컬렉션이나 복잡한 개체(entity)를 표현할 때 사용합니다. 이에 대한 자세한 내용은 원시형을 배우고 난 후 <info:object>에서 다루도록 하겠습니다.

`심볼(symbol)`형은 객체의 고유한 식별자(unique identifier)를 만들 때 사용됩니다. 심볼형에 대해선 객체를 학습하고 난 이후에 자세히 알아보도록 하겠습니다.

## typeof 연산자 [#type-typeof] 

`typeof` 연산자는 인수의 자료형을 반환해줍니다. 자료형에 따라 처리 방식을 다르게 하고 싶거나 변수의 자료형을 빠르게 알아내고자 할 때 유용합니다.

`typeof` 연산자는 두 가지 형태의 문법을 지원합니다.

1. 연산자: `typeof x`
2. 함수: `typeof(x)`

괄호가 있든 없든 결과가 동일합니다.

`typeof x`를 호출하면 인수의 자료형을 나타내는 문자열을 반환합니다.

```js
typeof undefined // "undefined"

typeof 0 // "number"

typeof 10n // "bigint"

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

마지막 세 줄은 약간의 설명이 필요해 보이네요.

1. `Math`는 수학 연산을 제공하는 내장 객체이므로 `"object"`가 출력됩니다. `Math`에 대해선 <info:number> 챕터에서 학습하도록 하겠습니다. 내장객체는 객체형이라는 것을 알려주기 위해 이런 예시를 작성해 보았습니다. 
2. `typeof null`의 결과는 `"object"`입니다. `null`은 별도의 고유한 자료형을 가지는 특수 값으로 객체가 아니지만, 자바스크립트에선 호환성을 유지하기 위해 이런 오류를 수정하지 않고 남겨둔 상황입니다. 언어 자체의 오류이므로 `null`이 객체가 아님에 유의하시기 바랍니다.
3. `typeof`는 피연산자가 함수면 `"function"`을 반환합니다. 그러므로 `typeof alert`는 `"function"`을 출력해줍니다. 그런데 자바스크립트엔 "함수"형이 없습니다. 함수는 객체형에 속합니다. 이런 동작 방식이 형식적으론 잘못되긴 했지만, 실무에선 매우 유용하게 사용되고 있습니다. 함수에 관한 내용은 이후 챕터에서 자세히 다루도록 하겠습니다.

<<<<<<< HEAD

## 요약

자바스크립트에는 일곱 가지 기본 자료형이 있습니다.

- `숫자형` -- 정수, 부동 소수점 숫자 등의 숫자를 나타낼 때 사용합니다.
- `문자형` -- 하나 혹은 그 이상의 문자로 만들어진 문자열을 나타낼 때 사용합니다. 단일 문자를 나타내는 별도의 자료형은 없습니다.
- `불린형` -- `true`/`false`(참/거짓)를 나타낼 때 사용합니다.
- `null` -- `null` 값만을 위한 독립 자료형입니다. `null`은 알 수 없는 값을 나타냅니다.
- `undefined` -- `undefined` 값만을 위한 독립 자료형입니다. `undefined`는 할당되지 않은 값을 나타냅니다. 
- `객체형` -- 복잡한 데이터 구조를 표현할 때 사용합니다.
- `심볼형` -- 객체의 고유 식별자를 만들 때 사용합니다.
=======
## Summary

There are 8 basic data types in JavaScript.

- `number` for numbers of any kind: integer or floating-point, integers are limited by ±2<sup>53</sup>.
- `bigint` is for integer numbers of arbitrary length.
- `string` for strings. A string may have one or more characters, there's no separate single-character type.
- `boolean` for `true`/`false`.
- `null` for unknown values -- a standalone type that has a single value `null`.
- `undefined` for unassigned values -- a standalone type that has a single value `undefined`.
- `object` for more complex data structures.
- `symbol` for unique identifiers.
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912

`typeof` 연산자는 피연산자의 자료형을 알려줍니다.

- `typeof x` 또는 `typeof(x)` 형태로 사용합니다.
- 피 연산자의 자료형을 문자열 형태로 반환합니다.
- `null`의 typeof 연산은 `"object"`인데, 이는 언어상 오류입니다. null은 객체가 아닙니다. 

이어지는 챕터에선 원시 자료형에 대해 학습해 볼 예정입니다. 원시형에 어느 정도 익숙해지면 객체형에 대해 알아보도록 하겠습니다.