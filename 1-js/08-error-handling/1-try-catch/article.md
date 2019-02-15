# "try..catch"로 에러 핸들링(Error handling) 

아무리 프로그래밍에 능한 사람이더라도, 오류가 있는 스크립트를 작성할 수 있습니다. 원인은 아마도 실수, 예상치 못한 사용자 입력, 잘못된 서버 응답, 그 밖에 수천만 가지 다른 이유 때문일 것입니다.

보통 오류가 발생하면 스크립트는 "죽으면서" (즉시 중단되면서), 콘솔에 오류를 출력합니다.

그러나 `try..catch` 문법을 사용하면, 죽는 대신에 오류를 "잡아서" 더 합당한 무언가를 할 수 있게 됩니다.

## "try..catch" 문법

'try..catch' 구문에는 두 개의 주요 블록이 있습니다: 'try'와 'catch'입니다.

```js
try {

  // 코드...

} catch (err) {

  // 에러 핸들링

}
```

이는 다음처럼 동작합니다.

1. 먼저, `try {...}` 안의 코드를 실행합니다.
2. 만약 오류가 없다면, `catch(err)` 블록은 무시됩니다: `try`의 안의 마지막 줄까지 실행되면 `catch`는 건너뜁니다.
3. 만약 오류가 있으면, `try` 실행이 중단되고, `catch(err)` 블록의 첫부분으로 넘어갑니다. `err` 변수(아무 이름이나 사용 가능)는 무슨 일이 일어났는지를 상세히 설명하는 오류 개체를 포함합니다.

![](try-catch-flow.png)

이런 동작 때문에 `try {…}` 블록 안쪽에 오류가 있는 코드가 있더라도 스크립트는 죽지 않습니다: `catch`에서 에러를 다룰 수 있는 기회가 생깁니다.

예제를 좀 더 봅시다.

- 오류가 없는 예제로, `alert` `(1)`과 `(2)`를 보여줍니다.

    ```js run
    try {

      alert('try 블록 시작');  // *!*(1) <--*/!*

      // ...에러가 없습니다.

      alert('try 블록 끝');   // *!*(2) <--*/!*

    } catch(err) {

      alert('에러가 없으므로, Catch는 무시되었습니다.'); // (3)

    }

    alert("...실행이 계속 됩니다");
    ```
- 오류가 있는 예제로, `(1)`과 `(3)`을 보여줍니다.

    ```js run
    try {

      alert('try 블록 시작');  // *!*(1) <--*/!*

    *!*
      lalala; // 에러, 변수가 정의되지 않음!
    */!*

      alert('try 블록 끝(절대 도달하지 않음)');  // (2)

    } catch(err) {

      alert(`에러가 발생했습니다!`); // *!*(3) <--*/!*

    }

    alert("...실행이 계속 됩니다");
    ```


````warn header="`try..catch`는 오직 런타임 오류에만 동작합니다."
`try..catch`가 동작하려면, 코드가 실행 가능해야 합니다. 다시 말하면, 유효한 자바스크립트여야 합니다.

중괄호 짝이 안 맞는 것처럼 코드가 문법적으로 틀리다면 동작하지 않을 것입니다

```js run
try {
  {{{{{{{{{{{{
} catch(e) {
  alert("유효하지 않은 코드이기 때문에 자바스크립트 엔진은 이 코드를 이해할 수 없습니다.");
}
```

자바스크립트 엔진(JavaScript engine)은 먼저 코드를 읽고 난 후에 코드를 실행합니다. 구문을 읽는 중에 발생하는 오류는 "parse-time" 오류라고 부르며 (그 코드 안에서) 복구 불가능합니다. 엔진이 코드를 이해할 수 없기 때문입니다.

따라서, `try..catch`는 유효한 코드에서 발생하는 오류만 처리할 수 있습니다. 이런 오류들을 "런타임 오류"라고 부르며 가끔은 "예외"라고 불릴 때도 있습니다.
````


````warn header="`try..catch`는 동기적으로 동작합니다"
만약 setTimeout처럼 "스케줄 된(scheduled)" 코드에서 예외가 발생한다면` try..catch`는 예외를 잡아낼 수 없을 것입니다.

```js run
try {
  setTimeout(function() {
    noSuchVariable; // 스크립트는 여기서 죽을 것입니다
  }, 1000);
} catch (e) {
  alert( "작동 멈춤" );
}
```

왜냐하면 `try..catch`가 함수의 실행 시간을 조정하는 `setTimeout` 호출을 감싸고 있기 때문입니다. 하지만 함수 자체는 엔진이 `try..catch` 구문을 떠나버린 나중 시점에 실행됩니다.

스케줄 된 함수 내부의 예외를 잡으려면, `try..catch`가 함수 내부에 있어야 합니다:

```js run
setTimeout(function() {
  try {    
    noSuchVariable; // try..catch가 에러를 잡아냅니다!
  } catch (e) {
    alert( "error is caught here!" );
  }
}, 1000);
```
````

## 오류 객체(Error object)

오류가 발생하면, 자바스크립트는 오류의 상세내용을 포함한 객체를 만듭니다. 이 객체는 `catch` 블록에 인수로서 전달됩니다:

```js
try {
  // ...
} catch(err) { // <-- "에러 객체", err 대신 다른 이름으로 쓸 수 있음
  // ...
}
```

모든 내장 오류에 대해서, `catch` 블록에 전달되는 오류 객체는 두 주요 프로퍼티(property)을 가집니다.

`name`
: 오류 이름. 정의되지 않은 변수에 대해서는 `"참조오류(ReferenceError)"`.

`message`
: 오류 상세에 대한 문자 메시지.

그 밖에 대부분의 환경에서 가능한 비표준 속성들이 있습니다. 가장 널리 사용되고 지원되는 것으로는 다음이 있습니다:

`stack`
: 현재 호출 스택: 오류로 이어지는 중첩 호출의 나열에 대한 정보를 가진 문자열. 디버깅 목적으로 사용.

예시:

```js run untrusted
try {
*!*
  lalala; // 에러, 변수가 정의되지 않음!
*/!*
} catch(err) {
  alert(err.name); // 참조오류
  alert(err.message); // lalala는 정의되지 않은 변수입니다
  alert(err.stack); // 참조오류: lalala는 정의되지 않은 ...

  // 에러 전체를 보여줄수도 있습니다
  // 에러는 "name: message" 형태의 문자열로 변환됩니다
  alert(err); // 참조오류: lalala는 정의되지 않은 변수입니다
}
```


## Using "try..catch"

Let's explore a real-life use case of `try..catch`.

As we already know, JavaScript supports the [JSON.parse(str)](mdn:js/JSON/parse) method to read JSON-encoded values.

Usually it's used to decode data received over the network, from the server or another source.

We receive it and call `JSON.parse`, like this:

```js run
let json = '{"name":"John", "age": 30}'; // data from the server

*!*
let user = JSON.parse(json); // convert the text representation to JS object
*/!*

// now user is an object with properties from the string
alert( user.name ); // John
alert( user.age );  // 30
```

You can find more detailed information about JSON in the <info:json> chapter.

**If `json` is malformed, `JSON.parse` generates an error, so the script "dies".**

Should we be satisfied with that? Of course, not!

This way, if something's wrong with the data, the visitor will never know that (unless they open the developer console). And people really don't like when something "just dies" without any error message.

Let's use `try..catch` to handle the error:

```js run
let json = "{ bad json }";

try {

*!*
  let user = JSON.parse(json); // <-- when an error occurs...
*/!*
  alert( user.name ); // doesn't work

} catch (e) {
*!*
  // ...the execution jumps here
  alert( "Our apologies, the data has errors, we'll try to request it one more time." );
  alert( e.name );
  alert( e.message );
*/!*
}
```

Here we use the `catch` block only to show the message, but we can do much more: send a new network request, suggest an alternative to the visitor, send information about the error to a logging facility, ... . All much better than just dying.

## Throwing our own errors

What if `json` is syntactically correct, but doesn't have a required `name` property?

Like this:

```js run
let json = '{ "age": 30 }'; // incomplete data

try {

  let user = JSON.parse(json); // <-- no errors
*!*
  alert( user.name ); // no name!
*/!*

} catch (e) {
  alert( "doesn't execute" );
}
```

Here `JSON.parse` runs normally, but the absence of `name` is actually an error for us.

To unify error handling, we'll use the `throw` operator.

### "Throw" operator

The `throw` operator generates an error.

The syntax is:

```js
throw <error object>
```

Technically, we can use anything as an error object. That may be even a primitive, like a number or a string, but it's better to use objects, preferably with `name` and `message` properties (to stay somewhat compatible with built-in errors).

JavaScript has many built-in constructors for standard errors: `Error`, `SyntaxError`, `ReferenceError`, `TypeError` and others. We can use them to create error objects as well.

Their syntax is:

```js
let error = new Error(message);
// or
let error = new SyntaxError(message);
let error = new ReferenceError(message);
// ...
```

For built-in errors (not for any objects, just for errors), the `name` property is exactly the name of the constructor. And `message` is taken from the argument.

For instance:

```js run
let error = new Error("Things happen o_O");

alert(error.name); // Error
alert(error.message); // Things happen o_O
```

Let's see what kind of error `JSON.parse` generates:

```js run
try {
  JSON.parse("{ bad json o_O }");
} catch(e) {
*!*
  alert(e.name); // SyntaxError
*/!*
  alert(e.message); // Unexpected token o in JSON at position 0
}
```

As we can see, that's a `SyntaxError`.

And in our case, the absence of `name` could be treated as a syntax error also, assuming that users must have a `name`.

So let's throw it:

```js run
let json = '{ "age": 30 }'; // incomplete data

try {

  let user = JSON.parse(json); // <-- no errors

  if (!user.name) {
*!*
    throw new SyntaxError("Incomplete data: no name"); // (*)
*/!*
  }

  alert( user.name );

} catch(e) {
  alert( "JSON Error: " + e.message ); // JSON Error: Incomplete data: no name
}
```

In the line `(*)`, the `throw` operator generates a `SyntaxError` with the given `message`, the same way as JavaScript would generate it itself. The execution of `try` immediately stops and the control flow jumps into `catch`.

Now `catch` became a single place for all error handling: both for `JSON.parse` and other cases.

## Rethrowing

In the example above we use `try..catch` to handle incorrect data. But is it possible that *another unexpected error* occurs within the `try {...}` block? Like a variable is undefined or something else, not just that "incorrect data" thing.

Like this:

```js run
let json = '{ "age": 30 }'; // incomplete data

try {
  user = JSON.parse(json); // <-- forgot to put "let" before user

  // ...
} catch(err) {
  alert("JSON Error: " + err); // JSON Error: ReferenceError: user is not defined
  // (no JSON Error actually)
}
```

Of course, everything's possible! Programmers do make mistakes. Even in open-source utilities used by millions for decades -- suddenly a crazy bug may be discovered that leads to terrible hacks (like it happened with the `ssh` tool).

In our case, `try..catch` is meant to catch "incorrect data" errors. But by its nature, `catch` gets *all* errors from `try`. Here it gets an unexpected error, but still shows the same `"JSON Error"` message. That's wrong and also makes the code more difficult to debug.

Fortunately, we can find out which error we get, for instance from its `name`:

```js run
try {
  user = { /*...*/ };
} catch(e) {
*!*
  alert(e.name); // "ReferenceError" for accessing an undefined variable
*/!*
}
```

The rule is simple:

**Catch should only process errors that it knows and "rethrow" all others.**

The "rethrowing" technique can be explained in more detail as:

1. Catch gets all errors.
2. In `catch(err) {...}` block we analyze the error object `err`.
2. If we don't know how to handle it, then we do `throw err`.

In the code below, we use rethrowing so that `catch` only handles `SyntaxError`:

```js run
let json = '{ "age": 30 }'; // incomplete data
try {

  let user = JSON.parse(json);

  if (!user.name) {
    throw new SyntaxError("Incomplete data: no name");
  }

*!*
  blabla(); // unexpected error
*/!*

  alert( user.name );

} catch(e) {

*!*
  if (e.name == "SyntaxError") {
    alert( "JSON Error: " + e.message );
  } else {
    throw e; // rethrow (*)
  }
*/!*

}
```

The error throwing on line `(*)` from inside `catch` block "falls out" of `try..catch` and can be either caught by an outer `try..catch` construct (if it exists), or it kills the script.

So the `catch` block actually handles only errors that it knows how to deal with and "skips" all others.

The example below demonstrates how such errors can be caught by one more level of `try..catch`:

```js run
function readData() {
  let json = '{ "age": 30 }';

  try {
    // ...
*!*
    blabla(); // error!
*/!*
  } catch (e) {
    // ...
    if (e.name != 'SyntaxError') {
*!*
      throw e; // rethrow (don't know how to deal with it)
*/!*
    }
  }
}

try {
  readData();
} catch (e) {
*!*
  alert( "External catch got: " + e ); // caught it!
*/!*
}
```

Here `readData` only knows how to handle `SyntaxError`, while the outer `try..catch` knows how to handle everything.

## try..catch..finally

Wait, that's not all.

The `try..catch` construct may have one more code clause: `finally`.

If it exists, it runs in all cases:

- after `try`, if there were no errors,
- after `catch`, if there were errors.

The extended syntax looks like this:

```js
*!*try*/!* {
   ... try to execute the code ...
} *!*catch*/!*(e) {
   ... handle errors ...
} *!*finally*/!* {
   ... execute always ...
}
```

Try running this code:

```js run
try {
  alert( 'try' );
  if (confirm('Make an error?')) BAD_CODE();
} catch (e) {
  alert( 'catch' );
} finally {
  alert( 'finally' );
}
```

The code has two ways of execution:

1. If you answer "Yes" to "Make an error?", then `try -> catch -> finally`.
2. If you say "No", then `try -> finally`.

The `finally` clause is often used when we start doing something before `try..catch` and want to finalize it in any case of outcome.

For instance, we want to measure the time that a Fibonacci numbers function `fib(n)` takes. Naturally, we can start measuring before it runs and finish afterwards. But what if there's an error during the function call? In particular, the implementation of `fib(n)` in the code below returns an error for negative or non-integer numbers.

The `finally` clause is a great place to finish the measurements no matter what.

Here `finally` guarantees that the time will be measured correctly in both situations -- in case of a successful execution of `fib` and in case of an error in it:

```js run
let num = +prompt("Enter a positive integer number?", 35)

let diff, result;

function fib(n) {
  if (n < 0 || Math.trunc(n) != n) {
    throw new Error("Must not be negative, and also an integer.");
  }
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

let start = Date.now();

try {
  result = fib(num);
} catch (e) {
  result = 0;
*!*
} finally {
  diff = Date.now() - start;
}
*/!*

alert(result || "error occured");

alert( `execution took ${diff}ms` );
```

You can check by running the code with entering `35` into `prompt` -- it executes normally, `finally` after `try`. And then enter `-1` -- there will be an immediate error, an the execution will take `0ms`. Both measurements are done correctly.

In other words, there may be two ways to exit a function: either a `return` or `throw`. The `finally` clause handles them both.


```smart header="Variables are local inside `try..catch..finally`"
Please note that `result` and `diff` variables in the code above are declared *before* `try..catch`.

Otherwise, if `let` were made inside the `{...}` block, it would only be visible inside of it.
```

````smart header="`finally` and `return`"
The `finally` clause works for *any* exit from `try..catch`. That includes an explicit `return`.

In the example below, there's a `return` in `try`. In this case, `finally` is executed just before the control returns to the outer code.

```js run
function func() {

  try {
*!*
    return 1;
*/!*

  } catch (e) {
    /* ... */
  } finally {
*!*
    alert( 'finally' );
*/!*
  }
}

alert( func() ); // first works alert from finally, and then this one
```
````

````smart header="`try..finally`"

The `try..finally` construct, without `catch` clause, is also useful. We apply it when we don't want to handle errors right here, but want to be sure that processes that we started are finalized.

```js
function func() {
  // start doing something that needs completion (like measurements)
  try {
    // ...
  } finally {
    // complete that thing even if all dies
  }
}
```
In the code above, an error inside `try` always falls out, because there's no `catch`. But `finally` works before the execution flow jumps outside.
````

## Global catch

```warn header="Environment-specific"
The information from this section is not a part of the core JavaScript.
```

Let's imagine we've got a fatal error outside of `try..catch`, and the script died. Like a programming error or something else terrible.

Is there a way to react on such occurrences? We may want to log the error, show something to the user (normally they don't see error messages) etc.

There is none in the specification, but environments usually provide it, because it's really useful. For instance, Node.JS has [process.on('uncaughtException')](https://nodejs.org/api/process.html#process_event_uncaughtexception) for that. And in the browser we can assign a function to special [window.onerror](mdn:api/GlobalEventHandlers/onerror) property. It will run in case of an uncaught error.

The syntax:

```js
window.onerror = function(message, url, line, col, error) {
  // ...
};
```

`message`
: Error message.

`url`
: URL of the script where error happened.

`line`, `col`
: Line and column numbers where error happened.

`error`
: Error object.

For instance:

```html run untrusted refresh height=1
<script>
*!*
  window.onerror = function(message, url, line, col, error) {
    alert(`${message}\n At ${line}:${col} of ${url}`);
  };
*/!*

  function readData() {
    badFunc(); // Whoops, something went wrong!
  }

  readData();
</script>
```

The role of the global handler `window.onerror` is usually not to recover the script execution -- that's probably impossible in case of programming errors, but to send the error message to developers.

There are also web-services that provide error-logging for such cases, like <https://errorception.com> or <http://www.muscula.com>.

They work like this:

1. We register at the service and get a piece of JS (or a script URL) from them to insert on pages.
2. That JS script has a custom `window.onerror` function.
3. When an error occurs, it sends a network request about it to the service.
4. We can log in to the service web interface and see errors.

## Summary

The `try..catch` construct allows to handle runtime errors. It literally allows to try running the code and catch errors that may occur in it.

The syntax is:

```js
try {
  // run this code
} catch(err) {
  // if an error happened, then jump here
  // err is the error object
} finally {
  // do in any case after try/catch
}
```

There may be no `catch` section or no `finally`, so `try..catch` and `try..finally` are also valid.

Error objects have following properties:

- `message` -- the human-readable error message.
- `name` -- the string with error name (error constructor name).
- `stack` (non-standard) -- the stack at the moment of error creation.

We can also generate our own errors using the `throw` operator. Technically, the argument of `throw` can be anything, but usually it's an error object inheriting from the built-in `Error` class. More on extending errors in the next chapter.

Rethrowing is a basic pattern of error handling: a `catch` block usually expects and knows how to handle the particular error type, so it should rethrow errors it doesn't know.

Even if we don't have `try..catch`, most environments allow to setup a "global" error handler to catch errors that "fall out". In-browser that's `window.onerror`.
