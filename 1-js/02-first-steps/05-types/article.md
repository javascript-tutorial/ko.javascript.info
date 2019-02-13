# Data types(자료형)

JavaScript의 변수는 모든 데이터를 포함할 수 있습니다. 변수는 한 순간에 문자열이 될 수 있고 다음 순간에는 숫자도 될 수 있습니다:

```js
// no error
let message = "hello";
message = 123456;
```

이러한 것을 허용하는 프로그래밍 언어를 "다이나믹 타이핑"이라고 하는데, 이는 데이터 형식이 있지만 변수는 그 어느 것에도 구속되어 있지 않다는 것을 의미합니다.

JavaScript에는 7 가지 기본 데이터 유형이 있습니다. 여기서는 전반적으로 다루고 다음 장에서는 각각에 대해 자세히 다룰 것입니다.

## A number(숫자 유형)

```js
let n = 123;
n = 12.345;
```

*number* 유형은 정수 및 부동소수점 번호를 모두 나타낸다.

숫자에 대한 많은 연산이 있습니다. (예 : 곱하기 `*`, 나눗셈 `/`, 덧셈 `+`, 뺄셈 `-` 등이 있습니다.

일반 숫자 외에도 이 데이터 유형에 속하는 소위 "특수 숫자 값"이 있습니다 : `Infinity`, `-Infinity` 및 `NaN`.

- '무한대'는 수학적 [무한대](https://en.wikipedia.org/wiki/Infinity) ∞를 나타냅니다. 어떤 숫자보다 큰 특별한 가치입니다.

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

    따라서 `NaN`이 수학적 표현 어딘가에 있으면 모든 결과로 전파합니다. 

```smart header="수학적 연산은 안전합니다."
수학을하는 것은 JavaScript에서 "안전"합니다. 우리는 0으로 나누고 숫자가 아닌 문자열을 숫자로 취급하는 등의 작업을 할 수 있습니다.

치명적인 오류 ("die")로 스크립트가 멈추지 않습니다. 최악의 경우 `NaN`을 결과로 얻습니다.
```

특수 숫자 값은 공식적으로 "number"유형에 속합니다. 물론 이 것들은 상식적으로 숫자가 아닙니다.

이 장에서 우리는 숫자를 다루는 방법에 대해 더 자세히 알아볼 것입니다. <info:number>.

## A string(문자열)

JavaScript의 문자열은 따옴표로 묶어야합니다.

```js
let str = "Hello";
let str2 = 'Single quotes are ok too';
let phrase = `can embed ${str}`;
```

JavaScript에는 세 가지 유형의 따옴표가 있습니다.

1. 큰 따옴표: `"Hello"`.
2. 작은 따옴표: `'Hello'`.
3. Backticks(백틱-역 따옴표): <code>&#96;Hello&#96;</code>.

큰 따옴표와 작은 따옴표는 "간단한"따옴표입니다. JavaScript에는 차이점이 없습니다.

Backticks는 "확장 된 기능"을 가진 따옴표입니다. 그것들은 `${…}`에서 변수와 표현식을 Backticks로 감싸진 문자열 안에 끼워 넣을수 있게합니다. 예를 들면 :

```js run
let name = "John";

// embed a variable
alert( `Hello, *!*${name}*/!*!` ); // Hello, John!

// embed an expression
alert( `the result is *!*${1 + 2}*/!*` ); // the result is 3
```

The expression inside `${…}` is evaluated and the result becomes a part of the string. We can put anything in there: a variable like `name` or an arithmetical expression like `1 + 2` or something more complex.

Please note that this can only be done in backticks. Other quotes don't have this embedding functionality!
```js run
alert( "the result is ${1 + 2}" ); // the result is ${1 + 2} (double quotes do nothing)
```

We'll cover strings more thoroughly in the chapter <info:string>.

```smart header="There is no *character* type."
In some languages, there is a special "character" type for a single character. For example, in the C language and in Java it is `char`.

In JavaScript, there is no such type. There's only one type: `string`. A string may consist of only one character or many of them.
```

## A boolean (logical type)

The boolean type has only two values: `true` and `false`.

This type is commonly used to store yes/no values: `true` means "yes, correct", and `false` means "no, incorrect".

For instance:

```js
let nameFieldChecked = true; // yes, name field is checked
let ageFieldChecked = false; // no, age field is not checked
```

Boolean values also come as a result of comparisons:

```js run
let isGreater = 4 > 1;

alert( isGreater ); // true (the comparison result is "yes")
```

We'll cover booleans more deeply in the chapter <info:logical-operators>.

## The "null" value

The special `null` value does not belong to any of the types described above.

It forms a separate type of its own which contains only the `null` value:

```js
let age = null;
```

In JavaScript, `null` is not a "reference to a non-existing object" or a "null pointer" like in some other languages.

It's just a special value which represents "nothing", "empty" or "value unknown".

The code above states that `age` is unknown or empty for some reason.

## The "undefined" value

The special value `undefined` also stands apart. It makes a type of its own, just like `null`.

The meaning of `undefined` is "value is not assigned".

If a variable is declared, but not assigned, then its value is `undefined`:

```js run
let x;

alert(x); // shows "undefined"
```

Technically, it is possible to assign `undefined` to any variable:

```js run
let x = 123;

x = undefined;

alert(x); // "undefined"
```

...But we don't recommend doing that. Normally, we use `null` to assign an "empty" or "unknown" value to a variable, and we use `undefined` for checks like seeing if a variable has been assigned.

## Objects and Symbols

The `object` type is special.

All other types are called "primitive" because their values can contain only a single thing (be it a string or a number or whatever). In contrast, objects are used to store collections of data and more complex entities. We'll deal with them later in the chapter <info:object> after we learn more about primitives.

The `symbol` type is used to create unique identifiers for objects. We have to mention it here for completeness, but it's better to study this type after objects.

## The typeof operator [#type-typeof]

The `typeof` operator returns the type of the argument. It's useful when we want to process values of different types differently or just want to do a quick check.

It supports two forms of syntax:

1. As an operator: `typeof x`.
2. As a function: `typeof(x)`.

In other words, it works with parentheses or without them. The result is the same.

The call to `typeof x` returns a string with the type name:

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

The last three lines may need additional explanation:

1. `Math` is a built-in object that provides mathematical operations. We will learn it in the chapter <info:number>. Here, it serves just as an example of an object.
2. The result of `typeof null` is `"object"`. That's wrong. It is an officially recognized error in `typeof`, kept for compatibility. Of course, `null` is not an object. It is a special value with a separate type of its own. So, again, this is an error in the language.
3. The result of `typeof alert` is `"function"`, because `alert` is a function of the language. We'll study functions in the next chapters where we'll see that there's no special "function" type in JavaScript. Functions belong to the object type. But `typeof` treats them differently. Formally, it's incorrect, but very convenient in practice.


## Summary

There are 7 basic types in JavaScript.

- `number` for numbers of any kind: integer or floating-point.
- `string` for strings. A string may have one or more characters, there's no separate single-character type.
- `boolean` for `true`/`false`.
- `null` for unknown values -- a standalone type that has a single value `null`.
- `undefined` for unassigned values -- a standalone type that has a single value `undefined`.
- `object` for more complex data structures.
- `symbol` for unique identifiers.

The `typeof` operator allows us to see which type is stored in a variable.

- Two forms: `typeof x` or `typeof(x)`.
- Returns a string with the name of the type, like `"string"`.
- For `null` returns `"object"` -- this is an error in the language, it's not actually an object.

In the next chapters, we'll concentrate on primitive values and once we're familiar with them, we'll move on to objects.
