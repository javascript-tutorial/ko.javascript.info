
# 변수의 스코프

자바스크립트는 함수 지향 언어입니다. 이런 특징은 개발자에게 많은 자유도를 줍니다. 함수를 동적으로 생성할 수 있고, 다른 변수에 생성된 함수를 인수로 넘길 수 있으며, 함수가 생성된 곳이 아닌 다른 곳에서 함수를 호출할 수도 있기 때문입니다.

함수 내부에서 함수 외부에 있는 변수에 접근할 수 있다는 사실은 앞서 학습해서 알고 계실 겁니다.

Now let's expand our knowledge to include more complex scenarios.

```smart header="We'll talk about `let/const` variables here"
In JavaScript, there are 3 ways to declare a variable: `let`, `const` (the modern ones), and `var` (the remnant of the past).

- In this article we'll use `let` variables in examples.
- Variables, declared with `const`, behave the same, so this article is about `const` too.
- The old `var` has some notable differences, they will be covered in the article <info:var>.
```

## Code blocks

If a variable is declared inside a code block `{...}`, it's only visible inside that block.

For example:

```js run
{
  // do some job with local variables that should not be seen outside

  let message = "Hello"; // only visible in this block

  alert(message); // Hello
}

alert(message); // Error: message is not defined
```

We can use this to isolate a piece of code that does its own task, with variables that only belong to it:

```js run
{
  // show message
  let message = "Hello";
  alert(message);
}

{
  // show another message
  let message = "Goodbye";
  alert(message);
}
```

````smart header="There'd be an error without blocks"
Please note, without separate blocks there would be an error, if we use `let` with the existing variable name:

```js run
// show message
let message = "Hello";
alert(message);

// show another message
*!*
let message = "Goodbye"; // Error: variable already declared
*/!*
alert(message);
```
````

For `if`, `for`, `while` and so on, variables declared in `{...}` are also only visible inside:

```js run
if (true) {
  let phrase = "Hello!";

  alert(phrase); // Hello!
}

alert(phrase); // Error, no such variable!
```

Here, after `if` finishes, the `alert` below won't see the `phrase`, hence the error.

That's great, as it allows us to create block-local variables, specific to an `if` branch.

The similar thing holds true for `for` and `while` loops:

```js run
for (let i = 0; i < 3; i++) {
  // the variable i is only visible inside this for
  alert(i); // 0, then 1, then 2
}

alert(i); // Error, no such variable
```

Visually, `let i` is outside of `{...}`. But the `for` construct is special here: the variable, declared inside it, is considered a part of the block.

## Nested functions

A function is called "nested" when it is created inside another function.

It is easily possible to do this with JavaScript.

We can use it to organize our code, like this:

```js
function sayHiBye(firstName, lastName) {

  // helper nested function to use below
  function getFullName() {
    return firstName + " " + lastName;
  }

  alert( "Hello, " + getFullName() );
  alert( "Bye, " + getFullName() );

}
```

Here the *nested* function `getFullName()` is made for convenience. It can access the outer variables and so can return the full name. Nested functions are quite common in JavaScript.

What's much more interesting, a nested function can be returned: either as a property of a new object or as a result by itself. It can then be used somewhere else. No matter where, it still has access to the same outer variables.

Below, `makeCounter` creates the "counter" function that returns the next number on each invocation:

```js run
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1
alert( counter() ); // 2
```

Despite being simple, slightly modified variants of that code have practical uses, for instance, as a [random number generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) to generate random values for automated tests.

How does this work? If we create multiple counters, will they be independent? What's going on with the variables here?

Undestanding such things is great for the overall knowledge of JavaScript and beneficial for more complex scenarios. So let's go a bit in-depth.

## 렉시컬 환경

```warn header="Here be dragons!"
The in-depth technical explanation lies ahead.

As far as I'd like to avoid low-level language details, any understanding without them would be lacking and incomplete, so get ready.
```

For clarity, the explanation is split into multiple steps.

### Step 1. Variables

자바스크립트에선 실행 중인 함수, 실행 중인 코드 블록 `{...}`, 실행 중인 스크립트 전체는 *렉시컬 환경(Lexical Environment)* 이라 불리는 숨김 내부 연관 객체를 갖습니다.

렉시컬 환경은 두 부분으로 구성됩니다.

1. *환경 레코드(Environment Record)* -- 모든 지역 변수를 프로퍼티로 저장하고 있는 객체. `this`가 참조하는 값 등의 정보도 저장됩니다.
2. *외부 렉시컬 환경(Outer Lexical Environment)* 에 대한 참조 -- 외부 코드와 연관되어 있습니다.

**'변수'는 특수 내부 객체인 `환경 레코드`의 프로퍼티에 불과합니다. '변수를 가져오거나 변경'하는 행위는 '환경 레코드의 프로퍼티를 가져오거나 변경'하는 행위와 동일합니다.**

아래 예시엔 렉시컬 환경이 하나만 존재합니다.

![lexical environment](lexical-environment-global.svg)

이렇게 스크립트 전체와 관련된 렉시컬 환경을 전역 렉시컬 환경(global Lexical Environment)이라고 부릅니다.

그림에서 네모 상자는 변수가 저장되는 환경 레코드를 나타내고, 붉은 화살표는 외부 참조(outer reference)를 나타냅니다. 전역 렉시컬 환경은 외부 참조를 갖지 않기 때문에 화살표가 `null`을 가리키는 걸 확인할 수 있습니다.

아래 그림은 코드가 실행됨에 따라 렉시컬 환경이 어떻게 변하는지 보여줍니다.

Here's a little bit longer code:

![lexical environment](closure-variable-phrase.svg)

우측의 네모 상자들은 코드가 한 줄, 한 줄 실행될 때마다 전역 렉시컬 환경이 어떻게 변화하는지 보여줍니다.

1. When the script starts, the Lexical Environment is pre-populated with all declared variables.
    - Initially, they are in the "Uninitialized" state. That's a special internal state, it means that the engine knows about the variable, but won't allow to use it before `let`. It's almost the same as if the variable didn't exist.
2. Then `let phrase` definition appears. There's no assignment yet, so its value is `undefined`. We can use the variable since this moment.
3. `phrase` is assigned a value.
4. `phrase` changes the value.

아직까진 어려운 게 없어 보이네요.

- A variable is a property of a special internal object, associated with the currently executing block/function/script.
- Working with variables is actually working with the properties of that object.

```smart header="Lexical Environment is a specification object"
"Lexical Environment" is a specification object: it only exists "theoretically" in the [language specification](https://tc39.es/ecma262/#sec-lexical-environments) to describe how things work. We can't get this object in our code and manipulate it directly.

JavaScript engines also may optimize it, discard variables that are unused to save memory and perform other internal tricks, as long as the visible behavior remains as described.
```

### Step 2. Function Declarations

A function is also a value, like a variable.

**The difference is that a Function Declaration is instantly fully initialized.**

When a Lexical Environment is created, a Function Declaration immediately becomes a ready-to-use function (unlike `let`, that is unusable till the declaration).

That's why we can use a function, declared as Function Declaration, even before the declaration itself.

For example, here's the initial state of the global Lexical Environment when we add a function:

![](closure-function-declaration.svg)

Naturally, this behavior only applies to Function Declarations, not Function Expressions where we assign a function to a variable, such as `let say = function(name)...`.

### Step 3. Inner and outer Lexical Environment

When a function runs, at the beginning of the call, a new Lexical Environment is created automatically to store local variables and parameters of the call.

따라서 `say("John")`을 호출하면 아래와 같은 내부 변화가 일어납니다(현재 실행 흐름은 붉은색 화살표로 나타낸 줄에 멈춰있는 상황입니다).

<!--
    ```js
    let phrase = "Hello";

    function say(name) {
     alert( `${phrase}, ${name}` );
    }

    say("John"); // Hello, John
    ```-->

![](lexical-environment-simple.svg)

보시는 바와 같이 함수가 호출 중일 때는 두 개의 렉시컬 환경이 만들어집니다. 호출 중인 함수를 위한 내부 렉시컬 환경과 이 렉시컬 환경이 가리키는 외부(전역) 렉시컬 환경이 만들어지죠.

- 내부 렉시컬 환경은 현재 실행 중인 함수인 `say`에 상응합니다. 내부 렉시컬 환경은 함수의 인자인 `name`을 프로퍼티로 갖습니다. `say("John")`을 호출했기 때문에 프로퍼티 `name`의 값은 `"John"`이 됩니다.
- 외부 렉시컬 환경은 전역 렉시컬 환경입니다. 전역 렉시컬 환경은 변수 `phrase`와 함수 `say`를 프로퍼티로 갖습니다.

그리고 내부 렉시컬 환경은 `외부` 렉시컬 환경을 참조합니다.

**코드에서 변수에 접근할 때는 먼저 내부 렉시컬 환경을 검색 범위로 잡고 변수에 상응하는 프로퍼티가 내부 렉시컬 환경에 있는지 찾습니다. 이때 원하는 대상을 찾지 못하면 검색 범위를 내부 렉시컬 환경이 참조하는 외부 렉시컬 환경으로 확장합니다. 이 과정은 검색 범위가 전역 렉시컬 환경으로 확장될 때까지 반복됩니다.**

전역 렉시컬 환경에 도달할 때까지 변수에 상응하는 프로퍼티를 찾지 못하면 엄격 모드에선 에러가 발생합니다. 참고로 정의되지 않은 변수에 `user = "John"`같이 값을 할당하려고 하면 비 엄격 모드에선 새로운 전역 변수 `user`가 만들어지는데, 이는 하위 호환성을 위해 존재하는 기능입니다.

예시와 그림을 보면서 검색이 어떻게 진행되는지 살펴봅시다.

- `say` 내부의 `alert`에서 `name`에 접근하려고 하면, 먼저 내부 렉시컬 환경을 살펴봅니다.
- `phrase`에 접근하려는데, `phrase`에 상응하는 프로퍼티가 내부 렉시컬 환경엔 없기 때문에 검색 범위를 외부 렉시컬 환경으로 넓혀 `phrase`에 상응하는 프로퍼티가 있는지 찾아봅시다.

![lexical environment lookup](lexical-environment-simple-lookup.svg)


### Step 4. Returning a function

Let's return to the `makeCounter` example.

```js
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();
```

At the beginning of each `makeCounter()` call, a new Lexical Environment object is created, to store variables for this `makeCounter` run.

So we have two nested Lexical Environments, just like in the example above:

![](closure-makecounter.svg)

What's different is that, during the execution of `makeCounter()`, a tiny nested function is created of only one line: `return count++`. We don't run it yet, only create.

All functions remember the Lexical Environment in which they were made. Technically, there's no magic here: all functions have the hidden property named `[[Environment]]`, that keeps the reference to the Lexical Environment where the function was created:

![](closure-makecounter-environment.svg)

So, `counter.[[Environment]]` has the reference to `{count: 0}` Lexical Environment. That's how the function remembers where it was created, no matter where it's called. The `[[Environment]]` reference is set once and forever at function creation time.

Later, when `counter()` is called, a new Lexical Environment is created for the call, and its outer Lexical Environment reference is taken from `counter.[[Environment]]`:

![](closure-makecounter-nested-call.svg)

Now when the code inside `counter()` looks for `count` variable, it first searches its own Lexical Environment (empty, as there are no local variables there), then the Lexical Environment of the outer `makeCounter()` call, where finds it and changes.

**A variable is updated in the Lexical Environment where it lives.**

Here's the state after the execution:

![](closure-makecounter-nested-call-2.svg)

If we call `counter()` multiple times, the `count` variable will be increased to `2`, `3` and so on, at the same place.

```smart header="클로저"
'클로저(closure)'는 개발자라면 필수로 알아야 하는 프로그래밍 용어입니다.

[클로저](https://en.wikipedia.org/wiki/Closure_(computer_programming))는 외부 변수를 기억하고 액세스할 수 있는 함수입니다. 몇몇 언어에서는 클로저를 구현하는 게 불가능하거나 특수한 방식으로 함수를 작성해야 클로저를 만들 수 있습니다. 하지만 자바스크립트에선 모든 함수가 자연스럽게 클로저가 됩니다(예외가 하나 있는데, 이에 대해선 <info:new-function>에서 다루도록 하겠습니다).

요점을 정리해 봅시다. 자바스크립트의 함수는 숨김 프로퍼티인 `[[Environment]]`를 이용해 자신이 어디서 만들어졌는지 알 수 있습니다. 또한, 자바스크립트 함수는 외부 변수에 접근할 수 있습니다.

채용 인터뷰에서 "클로저가 무엇입니까?"라는 질문을 받으면, 클로저의 정의를 말하고 자바스크립트에선 모든 함수가 클로저라고 이야기하면 될 것 같습니다. 그리고 `[[Environment]]` 프로퍼티와 렉시컬 환경이 어떤 방식으로 동작하는지에 대한 설명을 덧붙이면 됩니다.
```

## 가비지 컬렉션

Usually, a Lexical Environment is removed from memory with all the variables after the function call finishes. That's because there are no references to it. As any JavaScript object, it's only kept in memory while it's reachable.

...But if there's a nested function that is still reachable after the end of a function, then it has `[[Environment]]` property that references the lexical environment.

In that case the Lexical Environment is still reachable even after the completion of the function, so it stays alive.

For example:

```js
function f() {
  let value = 123;

  return function() {
    alert(value);
  }
}

let g = f(); // g.[[Environment]] stores a reference to the Lexical Environment
// of the corresponding f() call
```

`f()`를 여러 번 호출하고 그 결과가 어딘가에 저장되는 경우, 렉시컬 환경 각각 모두가 메모리에 유지된다는 점에 유의하시기 바랍니다. 아래 예시를 실행하면 3개의 렉시컬 환경이 만들어지는데, 각 렉시컬 환경은 메모리에서 삭제되지 않습니다.

```js
function f() {
  let value = Math.random();

  return function() { alert(value); };
}

// 배열 안의 세 함수는 각각 f()를 호출할 때 생성된
// 렉시컬 환경과 연관 관계를 맺습니다.
let arr = [f(), f(), f()];
```

렉시컬 환경 객체는 다른 객체와 마찬가지로 도달할 수 없을 때 메모리에서 삭제됩니다. 해당 렉시컬 환경 객체를 참조하는 중첩 함수가 하나라도 있으면 사라지지 않죠.

아래 코드와 같이 중첩 함수가 삭제되고 난 후에야, 이를 감싸는 렉시컬 환경(그리고 그 안의 변수인 `value`)이 메모리에서 제거됩니다.

```js
function f() {
  let value = 123;

  return function() {
    alert(value);
  }
}

let g = f(); // g가 살아있는 동안엔 연관 렉시컬 환경은 살아있습니다.

g = null; // 도달할 수 없는 상태가 되었으므로 메모리에서 삭제됩니다.
```

### 최적화 프로세스

앞에서 보았듯이, 함수가 살아있는 동안엔 이론상으론 모든 외부 변수가 메모리에 유지됩니다.

그러나 실제로는 자바스크립트 엔진이 이를 최적화하려고 합니다. 자바스크립트 엔진은 변수 사용을 분석하고 외부 변수가 사용되지 않는다고 판단되면 이를 메모리에서 제거합니다. 

**디버깅 시, 최적화 과정에서 제거된 변수를 사용할 수 없다는 점이 V8 (Chrome, Opera) 엔진의 주요 부작용입니다.**

Chrome 브라우저에서 개발자 도구를 열고 아래의 코드를 실행해봅시다.

일시 중지된 곳에서 콘솔을 열고 `alert(value)`를 입력해 보죠.

```js run
function f() {
  let value = Math.random();

  function g() {
    debugger; // 이 시점에서 콘솔에 alert(value);를 입력하면 "value is not defined"가 출력됩니다.
  }

  return g;
}

let g = f();
g();
```

보다시피 정의되지 않은 변수라는 에러가 출력됩니다. 이론상으로는 이 변수에 접근할 수 있어야 하지만 최적화 과정에서 외부 변수도 함께 최적화 대상이 되어서 이런 에러가 발생했습니다.

최적화는 흥미로운 디버깅 이슈를 발생시킬 수 있습니다(원인을 찾는 데 많은 시간을 허비하지 않을 때야 재밌겠지만 말이죠). 발생할 수 있는 상황 중 하나를 여기서 소개해 드리도록 하겠습니다. 의도한 변수 대신 같은 이름을 가진 다른 외부 변수가 출력되는 걸 확인해 보시죠.

```js run global
let value = "Surprise!";

function f() {
  let value = "the closest value";

  function g() {
    debugger; // 콘솔에 alert(value);를 입력하면 Surprise!가 출력됩니다.
  }

  return g;
}

let g = f();
g();
```

This feature of V8 is good to know. If you are debugging with Chrome/Opera, sooner or later you will meet it.

That is not a bug in the debugger, but rather a special feature of V8. Perhaps it will be changed sometime. You always can check for it by running the examples on this page.
