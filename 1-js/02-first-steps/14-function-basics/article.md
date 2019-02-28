# 함수

스크립트를 작성하다 보면 여러 곳에서 유사한 동작이 필요한 경우가 자주 생깁니다.

사용자가 로그인이나 로그아웃 했을 때 간드러진 메시지를 보여주는 동작이 그 예가 될 수 있습니다.

함수는 프로그램을 구성하는 "구성 단위(building blocks)"입니다. 함수 덕분에 중복 코드 없이 유사한 동작을 여러번 호출할 수 있습니다. 

`alert(message)`, `prompt(message, default)`, `confirm(question)`와 같은 내장 함수를 사용 해 본 경험이 있을겁니다. 이런 내장 함수 이외에도 직접 함수를 만들어 사용할 수 있습니다. 

## 함수 선언(Function Declaration)

함수를 만들려면 *함수를 선언*해야 합니다.

아래와 같이 말이죠:

```js
function showMessage() {
  alert( 'Hello everyone!' );
}
```

함수를 선언할 때, `function` 키워드를 제일 앞에 써주고, 다음으로 *함수 이름*, 이어서 괄호로 둘러 쌓인 매개변수를 명시해 줍니다(위의 예에선 매개변수가 없습니다). 그리고 난다음 함수를 구성하는 문의 모임인 "함수 바디"를 중괄호에 쌓아 적어줍니다.

![](function_basics.png)

새롭게 정의된 함수는 이름을 사용하면 호출이 가능합니다: `showMessage()`.

예:

```js run
function showMessage() {
  alert( 'Hello everyone!' );
}

*!*
showMessage();
showMessage();
*/!*
```

`showMessage()`로 함수를 호출하면 함수 내의 코드가 실행됩니다. showMessage 함수를 두 번 호출했으므로, 얼럿창에 메시지가 두 번 뜹니다.

함수의 주요 용도중 하나는 중복 코드 피하기 입니다. 위 예를 통해 이를 확인해보았습니다.

메시지 내용을 바꾸거나 메시지를 보여주는 방식을 변경하려면, 코드 한 부분만 수정하면 됩니다. 출력에 관여하는 함수만 수정하면 되죠.

## 지역 변수(Local variables)

함수 내에서 선언한 변수는 함수 바디 안에서만 존재합니다.

예:

```js run
function showMessage() {
*!*
  let message = "Hello, I'm JavaScript!"; // local variable
*/!*

  alert( message );
}

showMessage(); // Hello, I'm JavaScript!

alert( message ); // <-- 에러! message는 함수내의 지역 변수입니다
```

## 외부 변수(Outer variables) 

함수내에서 함수 바깥의 변수에 접근할 수 있습니다. 예:

```js run no-beautify
let *!*userName*/!* = 'John';

function showMessage() {
  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

showMessage(); // Hello, John
```

함수 바디에서 바깥의 변수에 접근할수 있고, 수정도 가능합니다.

예:

```js run
let *!*userName*/!* = 'John';

function showMessage() {
  *!*userName*/!* = "Bob"; // (1) 외부 변수 수정

  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

alert( userName ); // 함수 호출 전이므로 *!*John*/!* 

showMessage();

alert( userName ); // 함수에 의해 *!*Bob*/!* 으로 값이 바뀜
```

외부 변수는 함수 내 지역 변수가 없는 경우만 사용됩니다. 함수 내에서 `let`을 적는걸 잊을 경우, 의도치 않게 외부 변수를 수정하는 실수를 할 수 있습니다.

만약 함수 외부와 내부에 같은 이름의 변수가 선언되었다면, 지역 변수는 외부 변수에 *영향을 주지 못합니다*. 아래 코드를 살펴보시죠. 함수 내부에서 `userName` 변수를 선언하였고, 새로운 값을 할당하였지만 외부 변수 값은 변하지 않습니다. 

```js run
let userName = 'John';

function showMessage() {
*!*
  let userName = "Bob"; // 지역 변수 선언
*/!*

  let message = 'Hello, ' + userName; // *!*Bob*/!*
  alert(message);
}

// userName는 함수 내부에서만 생성되고 쓰임
showMessage();

alert( userName ); // *!*John*/!*이 출력됨, 함수는 외부 변수에 접근하지 못하기 때문에, 값이 변경되지 않음
```

```smart header="전역 변수(Global variables)"
위 코드의 `userName`처럼, 함수 외부에 선언된 변수는 *전역(global)* 변수가 됩니다.

전역 변수는 (지역 변수에 의해 가려지지만 않는다면) 모든 함수에서 접근 가능합니다.

대게, 함수에서 필요한 변수는 함수 안에서 선언합니다. 전역변수는 프로젝트 수준(project-level)의 데이터를 저장하는데만 쓰입니다. 전역 변수는 어느 곳에서든 접근 할 수 있다는 점 때문에 중요합니다. 최신 코드(modern code)엔 전역 변수가 거의 없거나 아주 적게 있습니다. 대부분의 변수를 함수 내에 작성하기 때문입니다.
```

## 매개변수(Parameters)

매개변수(parameter)를 이용하면 임의의 데이터를 함수 안에 전달할 수 있습니다. 매개변수는 *인수(arguments)* 로 불리기도 합니다(역주: 매개변수와 인수는 엄밀히 같진 않지만, 본 튜토리얼 원문을 토대로 번역하였습니다).

아래 함수 showMessage는 매개변수 `from` 과 `text`를 받고 있습니다.

```js run
function showMessage(*!*from, text*/!*) { // 인수: from, text
  alert(from + ': ' + text);
}

*!*
showMessage('Ann', 'Hello!'); // Ann: Hello! (*)
showMessage('Ann', "What's up?"); // Ann: What's up? (**)
*/!*
```

`(*)` 와 `(**)`로 표시한 줄에서 함수가 호출 되는데, 전달된 인자는 지역변수로 복사됩니다. 함수는 이 복사된 값을 사용합니다. 

예시 하나를 더 살펴봅시다. 변수 `from`이 있고, 이 변수를 함수에 전달하였습니다. 
Here's one more example: we have a variable `from` and pass it to the function. 
Please note: the function changes `from`, but the change is not seen outside, 
because a function always gets a copy of the value:
Here's one more example: we have a variable `from` and pass it to the function. Please note: the function changes `from`, but the change is not seen outside, because a function always gets a copy of the value:


```js run
function showMessage(from, text) {

*!*
  from = '*' + from + '*'; // make "from" look nicer
*/!*

  alert( from + ': ' + text );
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

// the value of "from" is the same, the function modified a local copy
alert( from ); // Ann
```

## Default values

If a parameter is not provided, then its value becomes `undefined`.

For instance, the aforementioned function `showMessage(from, text)` can be called with a single argument:

```js
showMessage("Ann");
```

That's not an error. Such a call would output `"Ann: undefined"`. There's no `text`, so it's assumed that `text === undefined`.

If we want to use a "default" `text` in this case, then we can specify it after `=`:

```js run
function showMessage(from, *!*text = "no text given"*/!*) {
  alert( from + ": " + text );
}

showMessage("Ann"); // Ann: no text given
```

Now if the `text` parameter is not passed, it will get the value `"no text given"`

Here `"no text given"` is a string, but it can be a more complex expression, which is only evaluated and assigned if the parameter is missing. So, this is also possible:

```js run
function showMessage(from, text = anotherFunction()) {
  // anotherFunction() only executed if no text given
  // its result becomes the value of text
}
```

```smart header="Evaluation of default parameters"

In JavaScript, a default parameter is evaluated every time the function is called without the respective parameter. In the example above, `anotherFunction()` is called every time `showMessage()` is called without the `text` parameter. This is in contrast to some other languages like Python, where any default parameters are evaluated only once during the initial interpretation.

```


````smart header="Default parameters old-style"
Old editions of JavaScript did not support default parameters. So there are alternative ways to support them, that you can find mostly in the old scripts.

For instance, an explicit check for being `undefined`:

```js
function showMessage(from, text) {
*!*
  if (text === undefined) {
    text = 'no text given';
  }
*/!*

  alert( from + ": " + text );
}
```

...Or the `||` operator:

```js
function showMessage(from, text) {
  // if text is falsy then text gets the "default" value
  text = text || 'no text given';
  ...
}
```


````


## Returning a value

A function can return a value back into the calling code as the result.

The simplest example would be a function that sums two values:

```js run no-beautify
function sum(a, b) {
  *!*return*/!* a + b;
}

let result = sum(1, 2);
alert( result ); // 3
```

The directive `return` can be in any place of the function. When the execution reaches it, the function stops, and the value is returned to the calling code (assigned to `result` above).

There may be many occurrences of `return` in a single function. For instance:

```js run
function checkAge(age) {
  if (age > 18) {
*!*
    return true;
*/!*
  } else {
*!*
    return confirm('Do you have permission from your parents?');
*/!*
  }
}

let age = prompt('How old are you?', 18);

if ( checkAge(age) ) {
  alert( 'Access granted' );
} else {
  alert( 'Access denied' );
}
```

It is possible to use `return` without a value. That causes the function to exit immediately.

For example:

```js
function showMovie(age) {
  if ( !checkAge(age) ) {
*!*
    return;
*/!*
  }

  alert( "Showing you the movie" ); // (*)
  // ...
}
```

In the code above, if `checkAge(age)` returns `false`, then `showMovie` won't proceed to the `alert`.

````smart header="A function with an empty `return` or without it returns `undefined`"
If a function does not return a value, it is the same as if it returns `undefined`:

```js run
function doNothing() { /* empty */ }

alert( doNothing() === undefined ); // true
```

An empty `return` is also the same as `return undefined`:

```js run
function doNothing() {
  return;
}

alert( doNothing() === undefined ); // true
```
````

````warn header="Never add a newline between `return` and the value"
For a long expression in `return`, it might be tempting to put it on a separate line, like this:

```js
return
 (some + long + expression + or + whatever * f(a) + f(b))
```
That doesn't work, because JavaScript assumes a semicolon after `return`. That'll work the same as:

```js
return*!*;*/!*
 (some + long + expression + or + whatever * f(a) + f(b))
```
So, it effectively becomes an empty return. We should put the value on the same line instead.
````

## Naming a function [#function-naming]

Functions are actions. So their name is usually a verb. It should be brief, as accurate as possible and describe what the function does, so that someone reading the code gets an indication of what the function does.

It is a widespread practice to start a function with a verbal prefix which vaguely describes the action. There must be an agreement within the team on the meaning of the prefixes.

For instance, functions that start with `"show"` usually show something.

Function starting with...

- `"get…"` -- return a value,
- `"calc…"` -- calculate something,
- `"create…"` -- create something,
- `"check…"` -- check something and return a boolean, etc.

Examples of such names:

```js no-beautify
showMessage(..)     // shows a message
getAge(..)          // returns the age (gets it somehow)
calcSum(..)         // calculates a sum and returns the result
createForm(..)      // creates a form (and usually returns it)
checkPermission(..) // checks a permission, returns true/false
```

With prefixes in place, a glance at a function name gives an understanding what kind of work it does and what kind of value it returns.

```smart header="One function -- one action"
A function should do exactly what is suggested by its name, no more.

Two independent actions usually deserve two functions, even if they are usually called together (in that case we can make a 3rd function that calls those two).

A few examples of breaking this rule:

- `getAge` -- would be bad if it shows an `alert` with the age (should only get).
- `createForm` -- would be bad if it modifies the document, adding a form to it (should only create it and return).
- `checkPermission` -- would be bad if it displays the `access granted/denied` message (should only perform the check and return the result).

These examples assume common meanings of prefixes. What they mean for you is determined by you and your team. Maybe it's pretty normal for your code to behave differently. But you should have a firm understanding of what a prefix means, what a prefixed function can and cannot do. All same-prefixed functions should obey the rules. And the team should share the knowledge.
```

```smart header="Ultrashort function names"
Functions that are used *very often* sometimes have ultrashort names.

For example, the [jQuery](http://jquery.com) framework defines a function with `$`. The [LoDash](http://lodash.com/) library has its core function named `_`.

These are exceptions. Generally functions names should be concise and descriptive.
```

## Functions == Comments

Functions should be short and do exactly one thing. If that thing is big, maybe it's worth it to split the function into a few smaller functions. Sometimes following this rule may not be that easy, but it's definitely a good thing.

A separate function is not only easier to test and debug -- its very existence is a great comment!

For instance, compare the two functions `showPrimes(n)` below. Each one outputs [prime numbers](https://en.wikipedia.org/wiki/Prime_number) up to `n`.

The first variant uses a label:

```js
function showPrimes(n) {
  nextPrime: for (let i = 2; i < n; i++) {

    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime;
    }

    alert( i ); // a prime
  }
}
```

The second variant uses an additional function `isPrime(n)` to test for primality:

```js
function showPrimes(n) {

  for (let i = 2; i < n; i++) {
    *!*if (!isPrime(i)) continue;*/!*

    alert(i);  // a prime
  }
}

function isPrime(n) {
  for (let i = 2; i < n; i++) {
    if ( n % i == 0) return false;
  }
  return true;
}
```

The second variant is easier to understand, isn't it? Instead of the code piece we see a name of the action (`isPrime`). Sometimes people refer to such code as *self-describing*.

So, functions can be created even if we don't intend to reuse them. They structure the code and make it readable.

## Summary

A function declaration looks like this:

```js
function name(parameters, delimited, by, comma) {
  /* code */
}
```

- Values passed to a function as parameters are copied to its local variables.
- A function may access outer variables. But it works only from inside out. The code outside of the function doesn't see its local variables.
- A function can return a value. If it doesn't, then its result is `undefined`.

To make the code clean and easy to understand, it's recommended to use mainly local variables and parameters in the function, not outer variables.

It is always easier to understand a function which gets parameters, works with them and returns a result than a function which gets no parameters, but modifies outer variables as a side-effect.

Function naming:

- A name should clearly describe what the function does. When we see a function call in the code, a good name instantly gives us an understanding what it does and returns.
- A function is an action, so function names are usually verbal.
- There exist many well-known function prefixes like `create…`, `show…`, `get…`, `check…` and so on. Use them to hint what a function does.

Functions are the main building blocks of scripts. Now we've covered the basics, so we actually can start creating and using them. But that's only the beginning of the path. We are going to return to them many times, going more deeply into their advanced features.
