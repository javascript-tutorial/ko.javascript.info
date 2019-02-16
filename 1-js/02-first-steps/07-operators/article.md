# Operators(연산자)

우리는 학교에서 많은 연산자를 알고있다. 그것들은 덧셈 `+`, 곱셈 `*`, 뺄셈 `-`과 같은 것들입니다.

이 장에서는 수학시간에 다루지 않는 연산자에 대해 집중적으로 다룹니다.

## Terms(용어): "unary"(단항 연산자), "binary"(이항 연산자), "operand"(피연산자)

계속하기 전에 몇 가지 일반적인 용어를 알아 보겠습니다.

- *An operand*(피연산자) -- 는 연산자가 적용되는 것입니다. 예를 들어, `5 * 2` 의 곱셈에는 두 개의 피연산자가 있습니다: 왼쪽 피연산자는 `5`이고 오른쪽 피연산자는 `2`입니다. 때때로 사람들은 "operands"대신에 "arguments"(인수)라고도 부릅니다.
- 연산자가 하나의 피연산자를 가진 경우 이것은 *unary*입니다. 예를 들어, unary negation(단항 부정 연산자) `-`는 숫자의 부호를 뒤집습니다:

    ```js run
    let x = 1;

    *!*
    x = -x;
    */!*
    alert( x ); // -1, unary negation was applied
    ```
- 연산자는 피연산자가 두 개인 경우 *binary*입니다. 같은 뺄셈이지만 binary form(바이너리 형식)으로도 존재합니다:

    ```js run no-beautify
    let x = 1, y = 3;
    alert( y - x ); // 2, binary minus subtracts values
    ```

    형식상, 여기서 우리는 두 가지 다른 연산자에 대해 말하고있습니다.: unary negation (단일 피연산자: 부호 반전)과 binary subtraction (2개의 피연산자: 뺄셈)입니다. 

## 문자열 연결, binary +

이제 학교에서 배운 수학을 뛰어 넘는 JavaScript 연산자의 특수 기능을 살펴 보겠습니다.

대개, 연산자 덧셈 `+`는 숫자를 합산합니다.

그러나 binary `+`가 strings(문자열)에 적용되면, 그 문자열을 병합 (연결)합니다 :

```js
let s = "my" + "string";
alert(s); // mystring
```

피연산자 중 하나가 string이면 다른 하나는 string로 변환됩니다.

예를 들어:

```js run
alert( '1' + 2 ); // "12"
alert( 2 + '1' ); // "21"
```

See, it doesn't matter whether the first operand is a string or the second one. The rule is simple: if either operand is a string, the other one is converted into a string as well.
첫 번째 피연산자가 string인지 또는 두 번째 피연산자가 string인지는 중요하지 않습니다. 규칙은 간단합니다: 두 피연산자가 string이면 다른 하나는 string로 변환됩니다.

그러나 연산은 왼쪽에서 오른쪽으로 실행됩니다. 두 개의 숫자 뒤에 string이 오면, 숫자들은 string로 변환되기 전에 덧셈 연산합니다.:

```js run
alert(2 + 2 + '1' ); // "41" and not "221"
```

String 연결 및 변환은 binary 덧셈 `+`의 특별한 기능입니다. 다른 산술 연산자는 숫자로만 작동하며 항상 피연산자를 숫자로 변환합니다.

예를 들어, 뺄셈 `-`와 나누기 `/`:

```js run
alert( 2 - '1' ); // 1
alert( '6' / '2' ); // 3
```

## Numeric conversion(숫자 변환), unary +

덧셈 `+`는 2가지 형식이 있습니다.: 우리가 위에서 사용한 이항 연산자 형식과 단항 연산자 형식입니다.

단항 연산자 덧셈 (다른 말로하면 하나의 값에 적용된 덧셈 연산자 `+`)는 숫자에 아무 것도 하지 않습니다. 그러나 피연산자가 숫자가 아닌 경우 단항 기호는 피연산자를 숫자로 변환합니다.

예를 들어:

```js run
// No effect on numbers
let x = 1;
alert( +x ); // 1

let y = -2;
alert( +y ); // -2

*!*
// Converts non-numbers
alert( +true ); // 1
alert( +"" );   // 0
*/!*
```

실제로 `Number(...)`와 똑같은 일을 하지만 더 짧습니다.

strings을 숫자로 변환하는 요구는 매우 자주 발생합니다. 예를 들어 HTML form(양식) 필드에서 값을 가져 오는 경우에는 대개 strings입니다.

그것들을 합산한다면?

이항연산자 덧셈은 그것들을 strings로 더할겁니다:

```js run
let apples = "2";
let oranges = "3";

alert( apples + oranges ); // "23", the binary plus concatenates strings
```

그것들을 숫자로 처리하려면 변환한 다음 합산해야합니다.

```js run
let apples = "2";
let oranges = "3";

*!*
// both values converted to numbers before the binary plus
alert( +apples + +oranges ); // 5
*/!*

// the longer variant
// alert( Number(apples) + Number(oranges) ); // 5
```

From a mathematician's standpoint, the abundance of pluses may seem strange. But from a programmer's standpoint, there's nothing special: unary pluses are applied first, they convert strings to numbers, and then the binary plus sums them up.

Why are unary pluses applied to values before the binary ones? As we're going to see, that's because of their *higher precedence*.

## Operator precedence

If an expression has more than one operator, the execution order is defined by their *precedence*, or, in other words, the implicit priority order of operators.

From school, we all know that the multiplication in the expression `1 + 2 * 2` should be calculated before the addition. That's exactly the precedence thing. The multiplication is said to have *a higher precedence* than the addition.

Parentheses override any precedence, so if we're not satisfied with the implicit order, we can use them to change it. For example: `(1 + 2) * 2`.

There are many operators in JavaScript. Every operator has a corresponding precedence number. The one with the larger number executes first. If the precedence is the same, the execution order is from left to right.

Here's an extract from the [precedence table](https://developer.mozilla.org/en/JavaScript/Reference/operators/operator_precedence) (you don't need to remember this, but note that unary operators are higher than corresponding binary ones):

| Precedence | Name | Sign |
|------------|------|------|
| ... | ... | ... |
| 16 | unary plus | `+` |
| 16 | unary negation | `-` |
| 14 | multiplication | `*` |
| 14 | division | `/` |
| 13 | addition | `+` |
| 13 | subtraction | `-` |
| ... | ... | ... |
| 3 | assignment | `=` |
| ... | ... | ... |

As we can see, the "unary plus" has a priority of `16` which is higher than the `13` of "addition" (binary plus). That's why, in the expression `"+apples + +oranges"`, unary pluses work before the addition.

## Assignment

Let's note that an assignment `=` is also an operator. It is listed in the precedence table with the very low priority of `3`.

That's why, when we assign a variable, like `x = 2 * 2 + 1`, the calculations are done first and then the `=` is evaluated, storing the result in `x`.

```js
let x = 2 * 2 + 1;

alert( x ); // 5
```

It is possible to chain assignments:

```js run
let a, b, c;

*!*
a = b = c = 2 + 2;
*/!*

alert( a ); // 4
alert( b ); // 4
alert( c ); // 4
```

Chained assignments evaluate from right to left. First, the rightmost expression `2 + 2` is evaluated and then assigned to the variables on the left: `c`, `b` and `a`. At the end, all the variables share a single value.

````smart header="The assignment operator `\"=\"` returns a value"
An operator always returns a value. That's obvious for most of them like addition `+` or multiplication `*`. But the assignment operator follows this rule too.

The call `x = value` writes the `value` into `x` *and then returns it*.

Here's a demo that uses an assignment as part of a more complex expression:

```js run
let a = 1;
let b = 2;

*!*
let c = 3 - (a = b + 1);
*/!*

alert( a ); // 3
alert( c ); // 0
```

In the example above, the result of `(a = b + 1)` is the value which is assigned to `a` (that is `3`). It is then used to subtract from `3`.

Funny code, isn't it? We should understand how it works, because sometimes we see it in 3rd-party libraries, but shouldn't write anything like that ourselves. Such tricks definitely don't make code clearer or readable.
````

## Remainder %

The remainder operator `%`, despite its appearance, is not related to percents.

The result of `a % b` is the remainder of the integer division of `a` by `b`.

For instance:

```js run
alert( 5 % 2 ); // 1 is a remainder of 5 divided by 2
alert( 8 % 3 ); // 2 is a remainder of 8 divided by 3
alert( 6 % 3 ); // 0 is a remainder of 6 divided by 3
```

## Exponentiation **

The exponentiation operator `**` is a recent addition to the language.

For a natural number `b`, the result of `a ** b` is `a` multiplied by itself `b` times.

For instance:

```js run
alert( 2 ** 2 ); // 4  (2 * 2)
alert( 2 ** 3 ); // 8  (2 * 2 * 2)
alert( 2 ** 4 ); // 16 (2 * 2 * 2 * 2)
```

The operator works for non-integer numbers of `a` and `b` as well.

For instance:

```js run
alert( 4 ** (1/2) ); // 2 (power of 1/2 is the same as a square root, that's maths)
alert( 8 ** (1/3) ); // 2 (power of 1/3 is the same as a cubic root)
```

## Increment/decrement

<!-- Can't use -- in title, because built-in parse turns it into – -->

Increasing or decreasing a number by one is among the most common numerical operations.

So, there are special operators for it:

- **Increment** `++` increases a variable by 1:

    ```js run no-beautify
    let counter = 2;
    counter++;      // works the same as counter = counter + 1, but is shorter
    alert( counter ); // 3
    ```
- **Decrement** `--` decreases a variable by 1:

    ```js run no-beautify
    let counter = 2;
    counter--;      // works the same as counter = counter - 1, but is shorter
    alert( counter ); // 1
    ```

```warn
Increment/decrement can only be applied to variables. Trying to use it on a value like `5++` will give an error.
```

The operators `++` and `--` can be placed either before or after a variable.

- When the operator goes after the variable, it is in "postfix form": `counter++`.
- The "prefix form" is when the operator goes before the variable: `++counter`.

Both of these statements do the same thing: increase `counter` by `1`.

Is there any difference? Yes, but we can only see it if we use the returned value of `++/--`.

Let's clarify. As we know, all operators return a value. Increment/decrement is no exception. The prefix form returns the new value while the postfix form returns the old value (prior to increment/decrement).

To see the difference, here's an example:

```js run
let counter = 1;
let a = ++counter; // (*)

alert(a); // *!*2*/!*
```

In the line `(*)`, the *prefix* form `++counter` increments `counter` and returns the new value, `2`. So, the `alert` shows `2`.

Now, let's use the postfix form:

```js run
let counter = 1;
let a = counter++; // (*) changed ++counter to counter++

alert(a); // *!*1*/!*
```

In the line `(*)`, the *postfix* form `counter++` also increments `counter` but returns the *old* value (prior to increment). So, the `alert` shows `1`.

To summarize:

- If the result of increment/decrement is not used, there is no difference in which form to use:

    ```js run
    let counter = 0;
    counter++;
    ++counter;
    alert( counter ); // 2, the lines above did the same
    ```
- If we'd like to increase a value *and* immediately use the result of the operator, we need the prefix form:

    ```js run
    let counter = 0;
    alert( ++counter ); // 1
    ```
- If we'd like to increment a value but use its previous value, we need the postfix form:

    ```js run
    let counter = 0;
    alert( counter++ ); // 0
    ```

````smart header="Increment/decrement among other operators"
The operators `++/--` can be used inside expressions as well. Their precedence is higher than most other arithmetical operations.

For instance:

```js run
let counter = 1;
alert( 2 * ++counter ); // 4
```

Compare with:

```js run
let counter = 1;
alert( 2 * counter++ ); // 2, because counter++ returns the "old" value
```

Though technically okay, such notation usually makes code less readable. One line does multiple things -- not good.

While reading code, a fast "vertical" eye-scan can easily miss something like `counter++` and it won't be obvious that the variable increased.

We advise a style of "one line -- one action":

```js run
let counter = 1;
alert( 2 * counter );
counter++;
```
````

## Bitwise operators

Bitwise operators treat arguments as 32-bit integer numbers and work on the level of their binary representation.

These operators are not JavaScript-specific. They are supported in most programming languages.

The list of operators:

- AND ( `&` )
- OR ( `|` )
- XOR ( `^` )
- NOT ( `~` )
- LEFT SHIFT ( `<<` )
- RIGHT SHIFT ( `>>` )
- ZERO-FILL RIGHT SHIFT ( `>>>` )

These operators are used very rarely. To understand them, we need to delve into low-level number representation and it would not be optimal to do that right now, especially since we won't need them any time soon. If you're curious, you can read the [Bitwise Operators](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) article on MDN. It would be more practical to do that when a real need arises.

## Modify-in-place

We often need to apply an operator to a variable and store the new result in that same variable.

For example:

```js
let n = 2;
n = n + 5;
n = n * 2;
```

This notation can be shortened using the operators `+=` and `*=`:

```js run
let n = 2;
n += 5; // now n = 7 (same as n = n + 5)
n *= 2; // now n = 14 (same as n = n * 2)

alert( n ); // 14
```

Short "modify-and-assign" operators exist for all arithmetical and bitwise operators: `/=`, `-=`, etc.

Such operators have the same precedence as a normal assignment, so they run after most other calculations:

```js run
let n = 2;

n *= 3 + 5;

alert( n ); // 16  (right part evaluated first, same as n *= 8)
```

## Comma

The comma operator `,` is one of the rarest and most unusual operators. Sometimes, it's used to write shorter code, so we need to know it in order to understand what's going on.

The comma operator allows us to evaluate several expressions, dividing them with a comma `,`. Each of them is evaluated but only the result of the last one is returned.

For example:

```js run
*!*
let a = (1 + 2, 3 + 4);
*/!*

alert( a ); // 7 (the result of 3 + 4)
```

Here, the first expression `1 + 2` is evaluated and its result is thrown away. Then, `3 + 4` is evaluated and returned as the result.

```smart header="Comma has a very low precedence"
Please note that the comma operator has very low precedence, lower than `=`, so parentheses are important in the example above.

Without them: `a = 1 + 2, 3 + 4` evaluates `+` first, summing the numbers into `a = 3, 7`, then the assignment operator `=` assigns    `a = 3`, and finally the number after the comma, `7`, is not processed so it's ignored.
```

Why do we need an operator that throws away everything except the last part?

Sometimes, people use it in more complex constructs to put several actions in one line.

For example:

```js
// three operations in one line
for (*!*a = 1, b = 3, c = a * b*/!*; a < 10; a++) {
 ...
}
```

Such tricks are used in many JavaScript frameworks. That's why we're mentioning them. But, usually, they don't improve code readability so we should think well before using them.
