# 조건 연산자: if, '?'

때때로, 우리는 다른 조건에 따라 다른 행동을 취할 필요가 있습니다.

그렇게하기 위해, `if`문과 간결함을 위해 `?`연산자로 참조될 조건부 삼항연산자(conditional ternary operator)를 사용합니다. 

## "if" 문

`if`문은 조건을 평가하고 조건 결과가 `true`이면 코드 블록을 실행합니다.

예시:

```js run
let year = prompt('In which year was ECMAScript-2015 specification published?', '');

*!*
if (year == 2015) alert( 'You are right!' );
*/!*
```

위의 예제에서 조건은 간단한 항등 검사 (`year == 2015`)이지만 코드는 훨씬 더 복잡해질 수 있습니다.

만약 둘 이상의 명령문을 실행하려면 코드 블록을 중괄호로 묶어야합니다.

```js
if (year == 2015) {
  alert( "That's correct!" );
  alert( "You're so smart!" );
}
```

`if` 문을 사용할 때마다 중괄호`{}`로 코드 블록을 래핑(wrapping)하는 것이 좋습니다. 단 하나의 명령문만 실행해도 마찬가지입니다. 이렇게하면 가독성이 향상됩니다.

## 불리언,부울(논리 타입) 변환

`if (…)` 문은 괄호 안의 표현식을 평가하고 결과를 부울로 변환합니다.

Let's recall the conversion rules from the chapter <info:type-conversions>:
<info:type-conversions> 챕터에 있는 변환 규칙을 상기해 보겠습니다.

- 숫자`0`, 빈 문자열`""`, `null`, `undefined`, `NaN`은 모두 `false`가 됩니다. 이때문에 이 값들을 "falsy"값 이라고 부릅니다.
- 다른 값은 `true`가 되므로 "truthy"라고 합니다.

따라서 아래 조건의 코드는 절대로 실행되지 않습니다.

```js
if (0) { // 0 is falsy
  ...
}
```

... 그리고 다음 조건 안에서는 항상 실행할 것입니다.

```js
if (1) { // 1 is truthy
  ...
}
```

다음과 같이 사전 평가된 부울 값을 `if`에 전달할 수 도 있습니다 :

```js
let cond = (year == 2015); // equality evaluates to true or false

if (cond) {
  ...
}
```

## "else"절

The `if` statement may contain an optional "else" block. It executes when the condition is false.
`if`문은 선택적 "else"블록을 포함 할 수 있습니다. 조건이 거짓 일 때 실행됩니다.

For example:
```js run
let year = prompt('In which year was the ECMAScript-2015 specification published?', '');

if (year == 2015) {
  alert( 'You guessed it right!' );
} else {
  alert( 'How can you be so wrong?' ); // any value except 2015
}
```

## Several conditions: "else if"

Sometimes, we'd like to test several variants of a condition. The `else if` clause lets us do that.

For example:

```js run
let year = prompt('In which year was the ECMAScript-2015 specification published?', '');

if (year < 2015) {
  alert( 'Too early...' );
} else if (year > 2015) {
  alert( 'Too late' );
} else {
  alert( 'Exactly!' );
}
```

In the code above, JavaScript first checks `year < 2015`. If that is falsy, it goes to the next condition `year > 2015`. If that is also falsy, it shows the last `alert`.

There can be more `else if` blocks. The final `else` is optional.

## Ternary operator '?'

Sometimes, we need to assign a variable depending on a condition.

For instance:

```js run no-beautify
let accessAllowed;
let age = prompt('How old are you?', '');

*!*
if (age > 18) {
  accessAllowed = true;
} else {
  accessAllowed = false;
}
*/!*

alert(accessAllowed);
```

The so-called "ternary" or "question mark" operator lets us do that in a shorter and simpler way.

The operator is represented by a question mark `?`.  The formal term "ternary" means that the operator has three operands. It is actually the one and only operator in JavaScript which has that many.

The syntax is:
```js
let result = condition ? value1 : value2;
```

The `condition` is evaluated: if it's truthy then `value1` is returned, otherwise -- `value2`.

For example:

```js
let accessAllowed = (age > 18) ? true : false;
```

Technically, we can omit the parentheses around `age > 18`. The question mark operator has a low precedence, so it executes after the comparison `>`. 

This example will do the same thing as the previous one:

```js
// the comparison operator "age > 18" executes first anyway
// (no need to wrap it into parentheses)
let accessAllowed = age > 18 ? true : false;
```

But parentheses make the code more readable, so we recommend using them.

````smart
In the example above, you can avoid using the question mark operator because the comparison itself returns `true/false`:

```js
// the same
let accessAllowed = age > 18;
```
````

## Multiple '?'

A sequence of question mark operators `?` can return a value that depends on more than one condition.

For instance:
```js run
let age = prompt('age?', 18);

let message = (age < 3) ? 'Hi, baby!' :
  (age < 18) ? 'Hello!' :
  (age < 100) ? 'Greetings!' :
  'What an unusual age!';

alert( message );
```

It may be difficult at first to grasp what's going on. But after a closer look, we can see that it's just an ordinary sequence of tests:

1. The first question mark checks whether `age < 3`.
2. If true -- it returns `'Hi, baby!'`. Otherwise, it continues to the expression after the colon '":"', checking `age < 18`.
3. If that's true -- it returns `'Hello!'`. Otherwise, it continues to the expression after the next colon '":"', checking `age < 100`.
4. If that's true -- it returns `'Greetings!'`. Otherwise, it continues to the expression after the last colon '":"', returning `'What an unusual age!'`.

Here's how this looks using `if..else`:

```js
if (age < 3) {
  message = 'Hi, baby!';
} else if (age < 18) {
  message = 'Hello!';
} else if (age < 100) {
  message = 'Greetings!';
} else {
  message = 'What an unusual age!';
}
```

## Non-traditional use of '?'

Sometimes the question mark `?` is used as a replacement for `if`:

```js run no-beautify
let company = prompt('Which company created JavaScript?', '');

*!*
(company == 'Netscape') ?
   alert('Right!') : alert('Wrong.');
*/!*
```

Depending on the condition `company == 'Netscape'`, either the first or the second expression after the `?` gets executed and shows an alert.

We don't assign a result to a variable here. Instead, we execute different code depending on the condition.

**We don't recommend using the question mark operator in this way.**

The notation is shorter than the equivalent `if` statement, which appeals to some programmers. But it is less readable.

Here is the same code using `if` for comparison:

```js run no-beautify
let company = prompt('Which company created JavaScript?', '');

*!*
if (company == 'Netscape') {
  alert('Right!');
} else {
  alert('Wrong.');
}
*/!*
```

Our eyes scan the code vertically. Code blocks which span several lines are easier to understand than a long, horizontal instruction set.

The purpose of the question mark operator `?` is to return one value or another depending on its condition. Please use it for exactly that. Use `if` when you need to execute different branches of code.
