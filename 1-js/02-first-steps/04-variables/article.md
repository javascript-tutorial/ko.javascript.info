# Variables

Most of the time, a JavaScript application needs to work with information. Here are two examples:
1. An online shop -- the information might include goods being sold and a shopping cart.
2. A chat application -- the information might include users, messages, and much more.

Variables are used to store this information.

## A variable

A [variable](https://en.wikipedia.org/wiki/Variable_(computer_science)) is a "named storage" for data. We can use variables to store goodies, visitors, and other data.

To create a variable in JavaScript, use the `let` keyword.

The statement below creates (in other words: *declares* or *defines*) a variable with the name "message":

```js
let message;
```

Now, we can put some data into it by using the assignment operator `=`:

```js
let message;

*!*
message = 'Hello'; // store the string
*/!*
```

The string is now saved into the memory area associated with the variable. We can access it using the variable name:

```js run
let message;
message = 'Hello!';

*!*
alert(message); // shows the variable content
*/!*
```

To be concise, we can combine the variable declaration and assignment into a single line:

```js run
let message = 'Hello!'; // define the variable and assign the value

alert(message); // Hello!
```

We can also declare multiple variables in one line:

```js no-beautify
let user = 'John', age = 25, message = 'Hello';
```

That might seem shorter, but we don't recommend it. For the sake of better readability, please use a single line per variable.

The multiline variant is a bit longer, but easier to read:

```js
let user = 'John';
let age = 25;
let message = 'Hello';
```

Some people also define multiple variables in this multiline style:
```js no-beautify
let user = 'John',
  age = 25,
  message = 'Hello';
```

...Or even in the "comma-first" style:

```js no-beautify
let user = 'John'
  , age = 25
  , message = 'Hello';
```

Technically, all these variants do the same thing. So, it's a matter of personal taste and aesthetics.


````smart header="`let` 대신 `var`"
작성된지 오래된 스크립트에서 `let` 대신 `var`라는 키워드를 발견하는 경우가 있습니다:

```js
*!*var*/!* message = 'Hello';
```

The `var` keyword is *almost* the same as `let`. It also declares a variable, but in a slightly different, "old-school" way.

`let`과 `var` 사이에는 미묘한 차이점이 있습니다. 하지만 지금 시점에서 둘 사이의 차이점을 중요하게 다루지는 않을 것입니다. 이후 <info:var> 에서 이에 대해 자세히 다루겠습니다.
````

## A real-life analogy

We can easily grasp the concept of a "variable" if we imagine it as a "box" for data, with a uniquely-named sticker on it.

For instance, the variable `message` can be imagined as a box labeled `"message"` with the value `"Hello!"` in it:

![](variable.png)

상자 속엔 어떤 값이든지 들어갈 수 있습니다.

원하는 만큼 값을 변경할 수도 있습니다.:
```js run
let message;

message = 'Hello!';

message = 'World!'; // 값이 변경되었습니다.

alert(message);
```

When the value is changed, the old data is removed from the variable:

![](variable-change.png)

We can also declare two variables and copy data from one into the other.

```js run
let hello = 'Hello world!';

let message;

*!*
// copy 'Hello world' from hello into message
message = hello;
*/!*

// now two variables hold the same data
alert(hello); // Hello world!
alert(message); // Hello world!
```

```smart header="함수형 언어"
[함수형(functional)](https://en.wikipedia.org/wiki/Functional_programming) 프로그래밍 언어는 변숫값 변경을 금지합니다. [스칼라(Scala)](http://www.scala-lang.org/) 와 [얼랭(Erlang)](http://www.erlang.org/)은 대표적인 함수형 언어입니다. 

이 언어에서는 일단 "상자 속에" 값이 저장되면, 그 값은 영원히 유지됩니다. 또 다른 값을 저장하고 싶다면 새로운 상자를 만들어야(새 변수를 선언해야)만 합니다. 이전 변수를 재사용할 수 없습니다.

처음 봤을 땐 좀 이상해 보일 수 있지만, 중대한 개발에 상당히 적합한 언어입니다. 더 나아가, 이런 제약이 장점으로 작용하는 병렬 계산(parallel computations)과 같은 영역이 있습니다. 이런 언어를 (곧 사용할 계획이 없을지라도) 공부한다면 시야를 넓히는 데 도움이 될 것입니다.
```

## 변수 명명법(variable-naming)

자바스크립트에는 변수명에 두 가지 제약이 존재합니다.

1. 변수명에는 오직 문자, 숫자, 기호로는 `$`와 `_`만 들어갈 수 있습니다.
2. 첫 글자는 숫자가 될 수 없습니다.

유효한 변수명의 예시입니다.:

```js
let userName;
let test123;
```

변수명이 여러 단어로 구성되어 있을 땐 [카멜 케이스(camelCase)](https://en.wikipedia.org/wiki/CamelCase) 가 흔히 사용됩니다. 카멜케이스는 단어를 차례대로 나열하면서 첫 단어를 제외한 각 단어의 첫글자를 대문자로 작성합니다.: `myVeryLongName`.

What's interesting -- the dollar sign `'$'` and the underscore `'_'` can also be used in names. They are regular symbols, just like letters, without any special meaning.

These names are valid:

```js run untrusted
let $ = 1; // declared a variable with the name "$"
let _ = 2; // and now a variable with the name "_"

alert($ + _); // 3
```

Examples of incorrect variable names:

```js no-beautify
let 1a; // cannot start with a digit

let my-name; // hyphens '-' aren't allowed in the name
```

```smart header="대소문자 구별"
`apple`와 `AppLE`은 서로 다른 변수입니다.
```

````smart header="비 라틴계 언어도 변수명에 사용할 수 있지만 권장하진 않습니다."
모든 언어를 변수명에 사용할 수 있습니다. 키릴 문자나 심지어 상형문자까지도 사용할 수 있습니다.

```js
let имя = '...';
let 我 = '...';
```

Technically, there is no error here, such names are allowed, but there is an international tradition to use English in variable names. Even if we're writing a small script, it may have a long life ahead. People from other countries may need to read it some time.
````

````warn header="Reserved names"
There is a [list of reserved words](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords), which cannot be used as variable names because they are used by the language itself.

For example: `let`, `class`, `return`, and `function` are reserved.

The code below gives a syntax error:

```js run no-beautify
let let = 5; // can't name a variable "let", error!
let return = 5; // also can't name it "return", error!
```
````

````warn header="An assignment without `use strict`"

Normally, we need to define a variable before using it. But in the old times, it was technically possible to create a variable by a mere assignment of the value without using `let`. This still works now if we don't put `use strict` in our scripts to maintain compatibility with old scripts.

```js run no-strict
// note: no "use strict" in this example

num = 5; // the variable "num" is created if it didn't exist

alert(num); // 5
```

This is a bad practice and would cause an error in strict mode:

```js
"use strict";

*!*
num = 5; // error: num is not defined
*/!*
```
````

## Constants

To declare a constant (unchanging) variable, use `const` instead of `let`:

```js
const myBirthday = '18.04.1982';
```

Variables declared using `const` are called "constants". They cannot be changed. An attempt to do so would cause an error:

```js run
const myBirthday = '18.04.1982';

myBirthday = '01.01.2001'; // error, can't reassign the constant!
```

When a programmer is sure that a variable will never change, they can declare it with `const` to guarantee and clearly communicate that fact to everyone.


### Uppercase constants

There is a widespread practice to use constants as aliases for difficult-to-remember values that are known prior to execution.

Such constants are named using capital letters and underscores.

For instance, let's make constants for colors in so-called "web" (hexadecimal) format:

```js run
const COLOR_RED = "#F00";
const COLOR_GREEN = "#0F0";
const COLOR_BLUE = "#00F";
const COLOR_ORANGE = "#FF7F00";

// ...when we need to pick a color
let color = COLOR_ORANGE;
alert(color); // #FF7F00
```

Benefits:

- `COLOR_ORANGE` is much easier to remember than `"#FF7F00"`.
- It is much easier to mistype `"#FF7F00"` than `COLOR_ORANGE`.
- When reading the code, `COLOR_ORANGE` is much more meaningful than `#FF7F00`.

When should we use capitals for a constant and when should we name it normally? Let's make that clear.

Being a "constant" just means that a variable's value never changes. But there are constants that are known prior to execution (like a hexadecimal value for red) and there are constants that are *calculated* in run-time, during the execution, but do not change after their initial assignment.

For instance:
```js
const pageLoadTime = /* time taken by a webpage to load */;
```

The value of `pageLoadTime` is not known prior to the page load, so it's named normally. But it's still a constant because it doesn't change after assignment.

In other words, capital-named constants are only used as aliases for "hard-coded" values.  

## Name things right

Talking about variables, there's one more extremely important thing.

A variable name should have a clean, obvious meaning, describe the data that it stores.

Variable naming is one of the most important and complex skills in programming. A quick glance at variable names can reveal which code was written by a beginner versus an experienced developer.

In a real project, most of the time is spent modifying and extending an existing code base rather than writing something completely separate from scratch. When we return to some code after doing something else for a while, it's much easier to find information that is well-labeled. Or, in other words, when the variables have good names.

Please spend time thinking about the right name for a variable before declaring it. Doing so will repay you handsomely.

Some good-to-follow rules are:

- Use human-readable names like `userName` or `shoppingCart`.
- Stay away from abbreviations or short names like `a`, `b`, `c`, unless you really know what you're doing.
- Make names maximally descriptive and concise. Examples of bad names are `data` and `value`. Such names say nothing. It's only okay to use them if the context of the code makes it exceptionally obvious which data or value the variable is referencing.
- Agree on terms within your team and in your own mind. If a site visitor is called a "user" then we should name related variables `currentUser` or `newUser` instead of `currentVisitor` or `newManInTown`.

Sounds simple? Indeed it is, but creating descriptive and concise variable names in practice is not. Go for it.

```smart header="Reuse or create?"
And the last note. There are some lazy programmers who, instead of declaring new variables, tend to reuse existing ones.

As a result, their variables are like boxes into which people throw different things without changing their stickers. What's inside the box now? Who knows? We need to come closer and check.

Such programmers save a little bit on variable declaration but lose ten times more on debugging.

An extra variable is good, not evil.

Modern JavaScript minifiers and browsers optimize code well enough, so it won't create performance issues. Using different variables for different values can even help the engine optimize your code.
```

## Summary

We can declare variables to store data by using the `var`, `let`, or `const` keywords.

- `let` -- is a modern variable declaration. The code must be in strict mode to use `let` in Chrome (V8).
- `var` -- is an old-school variable declaration. Normally we don't use it at all, but we'll cover subtle differences from `let` in the chapter <info:var>, just in case you need them.
- `const` -- is like `let`, but the value of the variable can't be changed.

Variables should be named in a way that allows us to easily understand what's inside them.
