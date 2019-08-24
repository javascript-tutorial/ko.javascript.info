# 반복문: while 과 for

우리는 자주 반복된 행동을 할 필요가 있습니다.

예를 들어, 목록에서 상품을 차례대로 출력하거나 1에서 10까지 각 번호에 대해 동일한 코드를 실행합니다.


*반복문*은 동일한 코드를 여러 번 반복하는 방법입니다.

## 반복문 "while" 

`while` 반복문에는 다음과 같은 구문이 있습니다.

```js
while (condition) {
  // code
  // so-called "loop body"
}
```

`조건`이 참 같은 값이면 반복문 본문의 `코드`를 실행합니다.

예를 들어, 아래 반복문은 `i < 3`이 참인 동안 `i`를 출력합니다. :

```js run
let i = 0;
while (i < 3) { // shows 0, then 1, then 2
  alert( i );
  i++;
}
```

반복문 본문의 단일 실행을 *iteration*이라고합니다. 위 예제의 반복문은 3개의 iteration을 만듭니다. 

만약 위 예제에서 `i ++`가 없다면, 반복문은 (이론적으로) 영원히 반복될 것입니다. 실제로 브라우저는 이러한 반복문을 중지하는 방법을 제공하고, Server-side JavaScript에서는 프로세스를 종료할 수 있습니다.

비교식이 아니어도 어떠한 표현식이나 변수도 반복문의 조건이 될 수 있습니다. 조건은 `while`에 의해 평가되고 boolean으로 변환됩니다.

예를 들면 `while (i! = 0)`을 더 간결하게 `while (i)`로 쓸 수 있습니다.

```js run
let i = 3;
*!*
while (i) { // when i becomes 0, the condition becomes falsy, and the loop stops
*/!*
  alert( i );
  i--;
}
```

````smart header="한 줄짜리 본문에는 중괄호가 필요하지 않습니다."
반복문 본문에 단일 명령문이 있으면 중괄호를 생략할 수 있습니다. `{…}`: 

```js run
let i = 3;
*!*
while (i) alert(i--);
*/!*
```
````

## 반복문 "do..while" 

조건 검사는 `do..while` 구문을 사용하여 반복문의 본문 *아래로* 이동할 수 있습니다.

```js
do {
  // loop body
} while (condition);
```

반복문은 먼저 본문을 실행할 것이고, 그러고 나서 조건을 확인하고, 조건이 참 같은 값인 동안 이것을 반복적으로 실행합니다.

예제:

```js run
let i = 0;
do {
  alert( i );
  i++;
} while (i < 3);
```

이 구문 형식은 조건이 참 같은 값인지에 관계없이 반복문 본문을 **한 번 이상** 실행하려는 경우에만 사용해야합니다. 일반적으로 `while (…) {…}`과 같은 다른 형식이 선호됩니다.

## 반복문 "for"

`for` 반복문은 더 복잡하지만 가장 일반적으로 사용되는 반복문 이기도합니다.

다음과 같이 보입니다.:

```js
for (begin; condition; step) {
  // ... loop body ...
}
```

이러한 단락의 의미를 예제로서 살펴 보겠습니다. 아래 반복문은 `0`에서 `3`까지(`3`은 포함하지 않고) `i`에 대해 `alert(i)`를 실행합니다.:

```js run
for (let i = 0; i < 3; i++) { // shows 0, then 1, then 2
  alert(i);
}
```

`for` 문을 부분별로 살펴봅시다.

| part  |          |                                                                            |
|-------|----------|----------------------------------------------------------------------------|
| begin | `i = 0`    | 반복이 실행되면 1번 실행합니다.                                     |
| condition | `i < 3`| 모든 반복문의 iteration 전에 조건을 검사합니다. 거짓이면 반복문을 중지합니다.              |
| step| `i++`      | 각 iteration에서 본문 이후, 조건 확인 전에 실행합니다. |
| body | `alert(i)`| 조건이 참 같은 값이면 반복해서 실행합니다.                         |

일반적인 반복문 알고리즘은 다음과 같이 작동합니다.

```
Run begin
→ (if condition → run body and run step)
→ (if condition → run body and run step)
→ (if condition → run body and run step)
→ ...
```

즉, `begin`은 1번만 실행하고 나서 다음 행위를 반복합니다.: 각 `condition` 테스트 후 `body`와 `step`이 실행됩니다.

반복문을 처음 사용하는 경우, 예제로 돌아가서 종이에 단계별로 실행되는 방식을 재현해 보는게 도움이 될 수 있습니다.

위의 예제의 경우에 정확히 무슨 일이 일어나는지 확인해봅시다 :

```js
// for (let i = 0; i < 3; i++) alert(i)

// run begin
let i = 0
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// ...finish, because now i == 3
```

````smart header="Inline 변수 선언"
여기, "counter" 변수 `i`는 반목문 안에서 바로 선언됩니다. 이것을 "inline" 변수 선언이라고 합니다. 이러한 변수는 반복문 내부에서만 볼 수 있습니다.

```js run
for (*!*let*/!* i = 0; i < 3; i++) {
  alert(i); // 0, 1, 2
}
alert(i); // error, no such variable
```

Instead of defining a variable, we could use an existing one:
변수를 정의하는 대신 기존 변수를 사용할 수도 있습니다:

```js run
let i = 0;

for (i = 0; i < 3; i++) { // use an existing variable
  alert(i); // 0, 1, 2
}

alert(i); // 3, visible, because declared outside of the loop
```

````

### 건너뛰는 부분

`for`의 어떤 부분이라도 건너뛸 수 있습니다.

예를 들어, 반복문을 시작할 때 아무것도 하지 않아도 된다면 `begin`을 생략할 수 있습니다.

이것 처럼요:

```js run
let i = 0; // we have i already declared and assigned

for (; i < 3; i++) { // no need for "begin"
  alert( i ); // 0, 1, 2
}
```

`step` 부분을 제거할 수도 있습니다 :

```js run
let i = 0;

for (; i < 3;) {
  alert( i++ );
}
```

이것은 반복문을 `while (i < 3)`과 동일하게 만듭니다.

우리는 실제로 모든 것을 제거하여 무한 루프를 만들 수 있습니다.

```js
for (;;) {
  // repeats without limits
}
```

두 개의 `for` 세미콜론 `;` 이 있어야합니다. 그렇지 않으면 구문 오류가 발생합니다.

## 반복문에서 빠져나오기

일반적으로 반복문의 조건이 거짓 같은 값이 되면 반복문은 종료됩니다.

그러나 특별한 `break` 지시문을 사용하여 언제든지 강제 종료할 수 있습니다.

예를 들어, 아래 반복문은 일련의 숫자를 사용자에게 묻고, 숫자를 입력하지 않으면 "breaking"(강제종료) 합니다.

```js
let sum = 0;

while (true) {

  let value = +prompt("Enter a number", '');

*!*
  if (!value) break; // (*)
*/!*

  sum += value;

}
alert( 'Sum: ' + sum );
```

`break` 지시문은 사용자가 빈 줄을 입력하거나 입력을 취소하면 `(*)` 라인에서 활성화됩니다. 이것은 반복문을 즉시 멈추고, 제어권를 반복문 이후 첫번째 라인에 넘깁니다. 즉, `alert`입니다.

The combination "infinite loop + `break` as needed" is great for situations when a loop's condition must be checked not in the beginning or end of the loop, but in the middle or even in several places of its body.
"무한 루프 + '필요에 따라'브레이크 '조합은 루프의 시작 또는 끝이 아니라 중간 또는 심지어 여러 곳에서 루프의 상태를 점검해야하는 상황에 적합합니다.

## Continue to the next iteration [#continue]

The `continue` directive is a "lighter version" of `break`. It doesn't stop the whole loop. Instead, it stops the current iteration and forces the loop to start a new one (if the condition allows).

We can use it if we're done with the current iteration and would like to move on to the next one.

The loop below uses `continue` to output only odd values:

```js run no-beautify
for (let i = 0; i < 10; i++) {

  // if true, skip the remaining part of the body
  *!*if (i % 2 == 0) continue;*/!*

  alert(i); // 1, then 3, 5, 7, 9
}
```

For even values of `i`, the `continue` directive stops executing the body and passes control to the next iteration of `for` (with the next number). So the `alert` is only called for odd values.

````smart header="The `continue` directive helps decrease nesting"
A loop that shows odd values could look like this:

```js
for (let i = 0; i < 10; i++) {

  if (i % 2) {
    alert( i );
  }

}
```

From a technical point of view, this is identical to the example above. Surely, we can just wrap the code in an `if` block instead of using `continue`.

But as a side-effect, this created one more level of nesting (the `alert` call inside the curly braces). If the code inside of`if` is longer than a few lines, that may decrease the overall readability.
````

````warn header="No `break/continue` to the right side of '?'"
Please note that syntax constructs that are not expressions cannot be used with the ternary operator `?`. In particular, directives such as `break/continue` aren't allowed there.

For example, if we take this code:

```js
if (i > 5) {
  alert(i);
} else {
  continue;
}
```

...and rewrite it using a question mark:


```js no-beautify
(i > 5) ? alert(i) : *!*continue*/!*; // continue isn't allowed here
```

...it stops working: there's a syntax error.

This is just another reason not to use the question mark operator `?` instead of `if`.
````

## Labels for break/continue

Sometimes we need to break out from multiple nested loops at once.

For example, in the code below we loop over `i` and `j`, prompting for the coordinates `(i, j)` from `(0,0)` to `(3,3)`:

```js run no-beautify
for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // what if we want to exit from here to Done (below)?
  }
}

alert('Done!');
```

We need a way to stop the process if the user cancels the input.

The ordinary `break` after `input` would only break the inner loop. That's not sufficient--labels, come to the rescue!

A *label* is an identifier with a colon before a loop:
```js
labelName: for (...) {
  ...
}
```

The `break <labelName>` statement in the loop below breaks out to the label:

```js run no-beautify
*!*outer:*/!* for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // if an empty string or canceled, then break out of both loops
    if (!input) *!*break outer*/!*; // (*)

    // do something with the value...
  }
}
alert('Done!');
```

In the code above, `break outer` looks upwards for the label named `outer` and breaks out of that loop.

So the control goes straight from `(*)` to `alert('Done!')`.

We can also move the label onto a separate line:

```js no-beautify
outer:
for (let i = 0; i < 3; i++) { ... }
```

The `continue` directive can also be used with a label. In this case, code execution jumps to the next iteration of the labeled loop.

````warn header="Labels do not allow to \"jump\" anywhere"
Labels do not allow us to jump into an arbitrary place in the code.

For example, it is impossible to do this:
```js
break label; // doesn't jumps to the label below

label: for (...)
```

A call to `break/continue` is only possible from inside a loop and the label must be somewhere above the directive.
````

## Summary

We covered 3 types of loops:

- `while` -- The condition is checked before each iteration.
- `do..while` -- The condition is checked after each iteration.
- `for (;;)` -- The condition is checked before each iteration, additional settings available.

To make an "infinite" loop, usually the `while(true)` construct is used. Such a loop, just like any other, can be stopped with the `break` directive.

If we don't want to do anything in the current iteration and would like to forward to the next one, we can use the `continue` directive.

`break/continue` support labels before the loop. A label is the only way for `break/continue` to escape a nested loop to go to an outer one.
