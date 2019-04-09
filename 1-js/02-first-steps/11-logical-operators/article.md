# 논리 연산자

자바스크립트에는 세 가지 논리 연산자가 있습니다: `||`(OR), `&&`(AND), `!`(NOT).

"논리적"이라고 부르지만 모든 유형의 값에 적용 할 수 있습니다.(논리 타입뿐만 아니라) 그 결과는 어떤 타입이든 가능합니다.

세부 사항을 확인합시다.

## || (OR)

"OR"연산자는 두 개의 수직선 기호로 표시됩니다.

```js
result = a || b;
```

클래식 프로그래밍에서 "논리적 OR"은 불리언 값만 조작하기 위한 것이었습니다. 인수중 하나라도 `true`이면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

자바스크립트에서 연산자는 조금 더 까다롭고 강력합니다. 하지만 먼저 불리언 값에 어떤 일이 일어나는지 살펴 보겠습니다.

가능한 논리적 조합에는 네 가지가 있습니다.

```js run
alert( true || true );   // true
alert( false || true );  // true
alert( true || false );  // true
alert( false || false ); // false
```

보시다시피 결과는 두 피연산자가 모두 `false`인 경우를 제외하고 항상 `true`입니다.

피연산자가 논리타입이 아니면 평가를 위해 논리타입으로 변환됩니다.

예를 들어, 숫자 `1`은 `true`로 취급되고 숫자 `0`은 `false`로 취급됩니다. 
 
```js run
if (1 || 0) { // works just like if( true || false )
  alert( 'truthy!' );
}
```

대부분의 경우, OR `||`는 주어진 조건 중 어떠한 것이 `true`인지 테스트하기 위해 `if`문에서 사용합니다.

예:

```js run
let hour = 9;

*!*
if (hour < 10 || hour > 18) {
*/!*
  alert( 'The office is closed.' );
}
```

더 많은 조건을 넘길 수 있습니다.

```js run
let hour = 12;
let isWeekend = true;

if (hour < 10 || hour > 18 || isWeekend) {
  alert( 'The office is closed.' ); // it is the weekend
}
```

## OR은 첫 번째로 참인 값을 찾습니다.

위에서 설명한 로직(논리)은 다소 고전적입니다. 이제 자바스크립트의 "추가"기능을 소개하겠습니다.

확장 알고리즘은 다음과 같이 작동합니다.

OR 값이 여러 개있는 경우:

```js
result = value1 || value2 || value3;
```

OR`||`연산자는 다음을 수행합니다.

- 피연산자(operand)를 왼쪽에서 오른쪽으로 수치를 구합니다.
- 각 피연산자에 대해 논리 타입으로 변환합니다. 결과가 `true`이면 수치연산을 멈추고 해당 피연산자의 원래 값(변환 전)을 반환합니다.
- 모든 피연산자의 수치를 구한 경우(즉 모두 `거짓`인 경우) 마지막 피연산자를 반환합니다.

값은 변환없이 원래 형식으로 반환됩니다.

바꾸어 말하면, OR`"||"`의 연속은 첫 번째 참인 값을 반환하거나 참인 값이 없으면 마지막 값을 반환합니다. 

예:

```js run
alert( 1 || 0 ); // 1 (1 is truthy)
alert( true || 'no matter what' ); // (true is truthy)

alert( null || 1 ); // 1 (1 is the first truthy value)
alert( null || 0 || 1 ); // 1 (the first truthy value)
alert( undefined || null || 0 ); // 0 (all falsy, returns the last value)
```

위의 예시들은 "순수하고 전형적인 부울-전용 OR"과 비교되는 흥미로운 사용법을 유도합니다.

1. **변수 또는 표현식 목록에서 첫 번째 truthy 값 얻기.**

    Imagine we have several variables which can either contain data or be `null/undefined`. How can we find the first one with data?
    데이터를 담거나 `null/undefined`일 수 있는 여러 변수가 있다고 상상해봅시다. 데이터를 가진 첫 번째 변수를 어떻게 찾을 수 있을까요?

    OR `||`을 사용할 수 있습니다:

    ```js run
    let currentUser = null;
    let defaultUser = "John";

    *!*
    let name = currentUser || defaultUser || "unnamed";
    */!*

    alert( name ); // selects "John" – the first truthy value
    ```

    `currentUser`와 `defaultUser` 둘 다 거짓(falsy)이면, `"unnamed"`가 결과가 됩니다.

2. **단락 회로 평가.(Short-circuit evaluation)**

    피연산자는 값뿐만 아니라 임의의 표현식이 될 수 있습니다. OR`||`는 왼쪽에서 오른쪽으로 평가 및 테스트합니다. 참인 값에 도달하면 평가가 중지되고 그 값이 리턴됩니다. 이 프로세스는 가능한 한 짧게 왼쪽에서 오른쪽으로 진행되기 때문에 "단락 회로 평가"라고합니다.

    "단락 회로 평가"는 두 번째 인수로 주어진 표현식이 변수 할당과 같은 부수적인 효과를 가질 때 분명하게 나타납니다.

    In the example below, `x` does not get assigned:
    아래 예제에서 `x`는 할당되지 않습니다.:

    ```js run no-beautify
    let x;

    *!*true*/!* || (x = 1);

    alert(x); // undefined, because (x = 1) not evaluated
    ```

    대신에 첫 번째 인수가 `false`인 경우, `||`는 두 번째 인수를 평가하여 할당을 수행합니다.

    ```js run no-beautify
    let x;

    *!*false*/!* || (x = 1);

    alert(x); // 1
    ```

    할당은 간단한 경우입니다. 다른 부수적인 효과도 발생할 수 있습니다.

    As we can see, such a use case is a "shorter way of doing `if`". The first operand is converted to boolean. If it's false, the second one is evaluated.
    우리가 볼 수 있듯이, 그러한 유스 케이스는 "if if를하는 더 짧은 방법"이다. 첫 번째 피연산자는 부울로 변환됩니다. 거짓이면 두 번째 것이 평가됩니다.

    Most of time, it's better to use a "regular" `if` to keep the code easy to understand, but sometimes this can be handy.

## && (AND)

The AND operator is represented with two ampersands `&&`:

```js
result = a && b;
```

In classical programming, AND returns `true` if both operands are truthy and `false` otherwise:

```js run
alert( true && true );   // true
alert( false && true );  // false
alert( true && false );  // false
alert( false && false ); // false
```

An example with `if`:

```js run
let hour = 12;
let minute = 30;

if (hour == 12 && minute == 30) {
  alert( 'The time is 12:30' );
}
```

Just as with OR, any value is allowed as an operand of AND:

```js run
if (1 && 0) { // evaluated as true && false
  alert( "won't work, because the result is falsy" );
}
```


## AND finds the first falsy value

Given multiple AND'ed values:

```js
result = value1 && value2 && value3;
```

The AND `&&` operator does the following:

- Evaluates operands from left to right.
- For each operand, converts it to a boolean. If the result is `false`, stops and returns the original value of that operand.
- If all operands have been evaluated (i.e. all were truthy), returns the last operand.

In other words, AND returns the first falsy value or the last value if none were found.

The rules above are similar to OR. The difference is that AND returns the first *falsy* value while OR returns the first *truthy* one.

Examples:

```js run
// if the first operand is truthy,
// AND returns the second operand:
alert( 1 && 0 ); // 0
alert( 1 && 5 ); // 5

// if the first operand is falsy,
// AND returns it. The second operand is ignored
alert( null && 5 ); // null
alert( 0 && "no matter what" ); // 0
```

We can also pass several values in a row. See how the first falsy one is returned:

```js run
alert( 1 && 2 && null && 3 ); // null
```

When all values are truthy, the last value is returned:

```js run
alert( 1 && 2 && 3 ); // 3, the last one
```

````smart header="Precedence of AND `&&` is higher than OR `||`"
The precedence of AND `&&` operator is higher than OR `||`.

So the code `a && b || c && d` is essentially the same as if the `&&` expressions were in parentheses: `(a && b) || (c && d)`.
````

Just like OR, the AND `&&` operator can sometimes replace `if`.

For instance:

```js run
let x = 1;

(x > 0) && alert( 'Greater than zero!' );
```

The action in the right part of `&&` would execute only if the evaluation reaches it. That is, only if `(x > 0)` is true.

So we basically have an analogue for:

```js run
let x = 1;

if (x > 0) {
  alert( 'Greater than zero!' );
}
```

The variant with `&&` appears shorter. But `if` is more obvious and tends to be a little bit more readable.

So we recommend using every construct for its purpose: use `if` if we want if and use `&&` if we want AND.

## ! (NOT)

The boolean NOT operator is represented with an exclamation sign `!`.

The syntax is pretty simple:

```js
result = !value;
```

The operator accepts a single argument and does the following:

1. Converts the operand to boolean type: `true/false`.
2. Returns the inverse value.

For instance:

```js run
alert( !true ); // false
alert( !0 ); // true
```

A double NOT `!!` is sometimes used for converting a value to boolean type:

```js run
alert( !!"non-empty string" ); // true
alert( !!null ); // false
```

That is, the first NOT converts the value to boolean and returns the inverse, and the second NOT inverses it again. In the end, we have a plain value-to-boolean conversion.

There's a little more verbose way to do the same thing -- a built-in `Boolean` function:

```js run
alert( Boolean("non-empty string") ); // true
alert( Boolean(null) ); // false
```

The precedence of NOT `!` is the highest of all logical operators, so it always executes first, before `&&` or `||`.
