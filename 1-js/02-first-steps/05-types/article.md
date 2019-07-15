# 자료형

자바스크립트의 변수는 어떤 데이터든지 담을 수 있습니다. 변수는 어떤 순간에 문자열일 수 있고 다른 순간엔 숫자가 될 수도 있습니다.

```js
// 변숫값을 문자열에서 숫자로 바꿔도 에러가 발생하지 않습니다.
let message = "hello";
message = 123456;
```

이처 데이터 타입(data type, 자료형)은 있지만, 변수가 어느 타입에도 묶여있지 않은 언어를 "동적 타입(dynamically typed)" 언어라 부릅니다.

자바스크립트에는 일곱 가지 기본 자료형이 있습니다. 이번 챕터에선 자바스크립트에서 쓰이는 자료형을 전반적으로 다루고, 이후 챕터에서 각 자료형을 자세히 다루도록 하겠습니다.

## 숫자형

```js
let n = 123;
n = 12.345;
```

*숫자형* 은 정수 및 부동소수점 숫자를 나타냅니다.

숫자형과 관련된 연산엔 곱셈 `*`, 나눗셈 `/`, 덧셈 `+`, 뺄셈 `-` 등이 있습니다.

숫자형엔 일반 숫자 외에도 `Infinity`, `-Infinity`, `NaN`같은 "특수 숫자 값(special numeric value)"이 포함됩니다.

- `Infinity`는 어떤 숫자보다 큰 특별한 값인 [무한대(∞)](https://en.wikipedia.org/wiki/Infinity)를 나타냅니다.

    어느 숫자든 0으로 나누면 무한대를 얻을 수 있습니다.

    ```js run
    alert( 1 / 0 ); // 무한대
    ```

    `Infinity`를 직접 참조할 수도 있습니다.

    ```js run
    alert( Infinity ); // 무한대
    ```
- `NaN`은 계산상의 오류를 나타냅니다. 부정확하거나 정의되지 않은 수학 연산을 사용하면 계산상의 에러가 발생하는데, 이때 `NaN`이 반환됩니다.

    ```js run
    alert( "숫자가 아님" / 2 ); // NaN, 문자열을 숫자로 나누는 것과 같은 연산은 계산상의 에러를 발생시킵니다.
    ```

    `NaN`은 여간해선 바뀌지 않습니다. `NaN`에 어떤 추가 연산을 해도 결국 `NaN`이 반환됩니다.

    ```js run
    alert( "숫자가 아님" / 2 + 5 ); // NaN
    ```

    연산 과정 어디에선가 `NaN`이 반환되었다면, 이는 모든 결과에 영향을 미칩니다.

```smart header="안전한 수학 연산"
자바스크립트 수학 연산은 "안전"하다고 볼 수 있습니다. 무언가를 0으로 나누거나 숫자가 아닌 문자열을 숫자로 취급하는 등의 모든 연산이 가능합니다.

말이 안되는 수학 연산을 하더라도 스크립트는 치명적인 에러를 내뿜으며 죽지 않습니다. 최악의 경우엔 `NaN`이 반환될 뿐이죠.
```

현실 세계에선 특수 숫자 값을 숫자로 취급하진 않지만, 자바스크립트에선 "숫자"형으로 취급합니다.

숫자를 다루는 방법에 대해선 <info:number> 챕터에서 자세히 알아보도록 하겠습니다.

## 문자형

자바스크립트에선 문자열(string)을 따옴표로 묶습니다.

```js
let str = "Hello";
let str2 = 'Single quotes are ok too';
let phrase = `can embed ${str}`;
```

따옴표는 크게 3가지로 구분됩니다.

1. 큰따옴표: `"Hello"`
2. 작은따옴표: `'Hello'`
3. 역 따옴표(백틱, backtick): <code>&#96;Hello&#96;</code>

큰따옴표와 작은따옴표는 "기본적인" 따옴표입니다. 자바스크립트에서는 두 따옴표를 동일하게 취급합니다.

역 따옴표는 "확장된 기능"을 가진 따옴표입니다. 변수와 표현식을 `${…}`로 감싼 후 문자열 사이에 넣을 수 있게 해줍니다. 다음과 같이 말이죠.

```js run
let name = "John";

// 변수를 문자열 중간에 삽입
alert( `Hello, *!*${name}*/!*!` ); // Hello, John!

// 표현식을 문자열 중간에 삽입
alert( `the result is *!*${1 + 2}*/!*` ); // the result is 3
```

`${…}` 안에는 `name` 같은 변수나 `1 + 2` 같은 수학 관련 표현식 이외에도 복잡한 표현식을 넣을 수 있습니다. 무엇이든 들어갈 수 있죠. 이렇게 들어간 `${…}` 내부의 표현식은 평가 후 문자열의 일부가 됩니다. 

이런 방법은 역 따옴표를 써야만 유효합니다. 기본 따옴표는 이러한 기능을 지원하지 않으므로 유의하시기 바랍니다.
```js run
alert( "the result is ${1 + 2}" ); // the result is ${1 + 2} (큰따옴표는 확장 기능을 지원하지 않습니다.)
```

문자열에 대한 자세한 내용은 <info:string>챕터에서 더 다루도록 하겠습니다. 

```smart header="*글자형*은 없습니다."
일부 언어에는 글자 하나를 위한 타입인 "글자(character)"형이 있습니다. C 언어와 Java에서의 `char`가 그 대표적인 예입니다.

자바스크립트에는 글자형이 없습니다. 하나 혹은 여러 글자로 이루어져 있는 `문자열`을 위한 자료형인 문자형만 있습니다.
```

## 불린형

불린형(논리 타입)은 `true`와 `false` 두 가지 값만 가집니다.

불린형은 긍정(yes)이나 부정(no)에 해당하는 값을 저장할 때 사용합니다. `true`는 "네. 맞습니다"를 의미하고 `false`는 "아니요, 틀립니다"를 의미하죠.

예시:

```js
let nameFieldChecked = true; // 네, name field가 확인되었습니다(checked).
let ageFieldChecked = false; // 아니요, age field를 확인하지 않았습니다(checked)
```

불린값은 비교 결과를 저장할 때 사용할 수도 있습니다.

```js run
let isGreater = 4 > 1;

alert( isGreater ); // true (비교 결과: "yes")
```

불린에 대해선 <info:logical-operators> 챕터에서 자세히 다루도록 하겠습니다.

## "null" 값

`null` 값은 위에 설명한 자료형 중 어느 것에도 속하지 않습니다.

`null` 값은 오로지 `null` 값만 포함하는 별도의 자료형을 형성합니다.

```js
let age = null;
```

자바스크립트에서 `null`은 다른 언어에서처럼 "존재하지 않는 객체에 대한 참조" 또는 "널 포인터(null pointer)"를 나타내지 않습니다.

`null`은 단지 "존재하지 않는(nothing)" 값, "비어 있는(empty)" 값, "알 수 없는(unknown)" 값을 나타냅니다.

위 코드는 어떤 이유때문에 `나이(age)`를 알 수 없거나 그 값이 비어있는 경우를 나타냅니다.

## "undefined" 값

`undefined` 값도 별도의 자료형을 만듭니다. `null`이 자신만의 고유한 자료형을 만드는 것처럼, `undefined` 값도 자신만의 자형에 속하게 됩니다.

`undefined`는 "값이 할당되지 않은 상태"를 의미합니다.

변수는 선언하였지만, 값을 할당하지 않았다면, 해당 변수는 `undefined`를 반환합니다.

```js run
let x;

alert(x); // "undefined"
```

`undefined`를 직접 변수에 할당하는 것은 기술적으로 문제가 없습니다.

```js run
let x = 123;

x = undefined;

alert(x); // "undefined"
```

하지만 이렇게 `undefined`를 할당하는 걸 권장하진 않습니다. 변수가 "비어있거나" "알 수 없는" 상태라는 걸 나타낼 때는 `null`을 사용하면 되죠. `undefined`는 변수에 값이 할당되었는지 여부를 확인할 때 사용하도록 합시다.

## 객체와 심볼

`객체(object)`는 특별한 자료형을 만듭니다.

객체형을 제외한 다른 자료형은 문자열이든 숫자든 한 가지만 표현할 수 있기 때문에 원시(primitive) 자료형이라 부릅니다. 객체가 데이터 컬렉션과 복잡한 개체(entity)를 저장하도록 해주는 것과는 다르죠. 객체에 대한 자세한 내용은 원시 자료형을 배우고 난 후 <info:object>에서 다루도록 하겠습니다.

`심볼(symbol)`형은 객체의 고유한 식별자(unique identifier)를 만들 때 사용됩니다. 심볼형은 객체를 이해하고 난 이후에 학습하는 것이 낫기 때문에 넘어가도록 하겠습니다. 

## typeof 연산자 [#type-typeof] 

`typeof` 연산자는 인수의 자료형을 반환합니다. 자료형마다 처리 방식을 다르게 하고 싶거나 변수의 형을 빠르게 알아내고자 할 때 유용하게 사용할 수 있습니다.

`typeof` 연산자는 두 가지 형태의 문법을 지원합니다.

1. 연산자: `typeof x`
2. 함수: `typeof(x)`

두 형태를 모두 지원하므로, 괄호가 있든 없든 작동하고, 그 결과도 같습니다.

`typeof x`는 해당 인수의 자료형을 나타내는 문자열을 반환합니다.

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

마지막 세 줄은 약간의 설명이 필요해 보이네요.

<<<<<<< HEAD
1. `Math`는 수학 연산을 제공하는 내장 객체이므로, 반환값이 `"object"`가 됩니다. `Math` 등의 내장객체는 객체형 입니다. `Math`에 대해선 <info:number> 챕터에서 학습하도록 하겠습니다. 
2. `typeof null`의 결과는 `"object"`입니다. `null`은 별도의 고유한 자료형을 가지는 특수 값으로 객체가 아니지만, 호환성을 위해 이런 오류가 수정되지 않고 유지되고 있습니다. 언어 자체의 오류이므로 `null`이 객체가 아님에 유의하시기 바랍니다.
3. `alert`는 함수이기 때문에 `typeof alert`의 결과는 `"function"`입니다. 함수에 대해선 다음 챕터에서 학습할 예정인데, 여기서 자바스크립트엔 "함수"형이 없다는 점에 대해 알아볼 입니다. 함수는 객체형에 속하죠. 그런데, `typeof`는 함수가 피연산자인 경우 `"function"`를 반환합니다. 함수는 객체형이기 때문에 이는 형식적으로는 잘못되긴 했지만, 이런 특징이 실무에선 매우 유용하게 사용되고 있습니다. 
=======
1. `Math` is a built-in object that provides mathematical operations. We will learn it in the chapter <info:number>. Here, it serves just as an example of an object.
2. The result of `typeof null` is `"object"`. That's wrong. It is an officially recognized error in `typeof`, kept for compatibility. Of course, `null` is not an object. It is a special value with a separate type of its own. So, again, this is an error in the language.
3. The result of `typeof alert` is `"function"`, because `alert` is a function. We'll study functions in the next chapters where we'll also see that there's no special "function" type in JavaScript. Functions belong to the object type. But `typeof` treats them differently, returning `"function"`. That's not quite correct, but very convenient in practice.
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7


## 요약

자바스크립트에는 일곱 가지 기본 자료형이 있습니다.

- 정수 또는 부동 소수점 등의 모든 종류의 숫자를 나타내는 `숫자형`.
- 문자열을 위한 `문자형`. 문자열은 하나 혹은 그 이상의 문자로 구성되며, 단일 문자를 나타내는 별도의 자료형은 없음.
- `true`/`false`(참/거짓)를 나타내는 `불린형`.
- 알 수 없는 값을 위한 `null` 타입. `null` 값만을 위한 독립 자료형.
- 할당되지 않은 값을 위한 `undefined` 타입. `undefined` 값만을 위한 독립 자료형.
- 복잡한 데이터 구조를 위한 `객체형`.
- 고유 식별자를 위한 `심볼형`.

`typeof` 연산자는 피연산자의 자료형을 알려줍니다.

- `typeof x` 또는 `typeof(x)` 형태로 사용.
- 자료형을 문자열 형태로 반환합니다.
- `null`의 typeof 연산은 `"object"`인데, 이는 언어상의 오류입니다. null은 객체가 아닙니다. 

이어지는 챕터에서는 원시 자료형에 대해 살펴보고, 원시 자료형에 어느 정도 익숙해지면 객체형에 대해 알아보도록 하겠습니다.