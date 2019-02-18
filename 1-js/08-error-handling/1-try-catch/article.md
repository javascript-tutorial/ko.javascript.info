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


## "try..catch" 사용하기

`try..catch`의 실제 사례를 살펴봅시다.

이미 알고 있듯이, 자바스크립트는 JSON으로 암호화된 값을 읽을 수 있는 [JSON.parse(str)](mdn:js/JSON/parse) 메소드를 지원합니다.

보통은 서버 또는 다른 출처로부터 네트워크를 통해 전달된 데이터를 복호화하는데 사용합니다.

이를 전달받아 다음과 같이 `JSON.parse`을 호출합니다.

```js run
let json = '{"name":"John", "age": 30}'; // data from the server

*!*
let user = JSON.parse(json); // convert the text representation to JS object
*/!*

// now user is an object with properties from the string
alert( user.name ); // John
alert( user.age );  // 30
```

JSON에 대해 더 자세한 정보는 <info:json> 장에서 찾을 수 있습니다.

**만약 `json`이 잘못 구성되면, `JSON.parse`은 오류를 발생시키고, 스크립트는 "죽습니다".**

우리는 이에 만족해야 할까요? 당연히 아니죠!

이런 방식으로는, 데이터가 무언가 잘못되었을 경우 방문자는 (개발자 콘솔을 열 때까지) 그 사실을 절대 알 수 없습니다. 그리고 사람들은 에러 메시지 없이 무언가가 "그냥 죽는" 것을 좋아하지 않습니다.

`try..catch`를 사용하여 오류를 처리해 봅시다.

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

여기에서는 단지 메시지룰 보여주기 위해 `catch` 블록을 사용하지만, 더 많은 일을 할 수 있습니다. 네트워크 요청 보내기, 사용자에게 대안을 제안하기, 오류에 대한 정보를 로깅 장치에 보내기, ... . 모두 그냥 죽는 것보다 훨씬 낫습니다.

## 자체 오류 던지기

만약 `json`이 문법적으로 정확하지만, 필수 속성인 `name`이 없다면 어떨까요?

다음처럼 말이죠.

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

여기에서 `JSON.parse` 는 정상적으로 동작하지만, `name`의 부재는 우리에게는 실제로 오류입니다.

오류 처리를 통합하기 위해, 우리는 `throw` 연산자를 사용할 것입니다.

### "Throw" 연산자

`throw` 연산자는 오류를 생성합니다.

문법은 다음과 같습니다.

```js
throw <error object>
```

이론적으로는 아무 것이나 오류 객체로 사용할 수 있습니다. 심지어 숫자, 문자열 같은 원시 타입도 되지만, 객체를 사용하는 것이 좋고 가급적이면 `name`과 `message` 속성과 사용합니다. (내장 오류와 호환이 되도록).

자바스크립트는 많은 표준 오류를 위한 내장 생성자를 가지고 있습니다. `Error`, `SyntaxError`, `ReferenceError`, `TypeError`등입니다. 이들을 오류 객체를 생성하는데 사용할 수도 있습니다.

문법은 이렇습니다.

```js
let error = new Error(message);
// or
let error = new SyntaxError(message);
let error = new ReferenceError(message);
// ...
```

내장 오류에서(아무 객체나가 아닌 오류만에서만), `name` 속성은 정확히 생성자의 이름입니다. 그리고 `message`는 인수로부터 가져와집니다.

예를 들면,

```js run
let error = new Error("Things happen o_O");

alert(error.name); // Error
alert(error.message); // Things happen o_O
```

`JSON.parse`이 어떤 종류의 오류를 생성하는지 봅시다.

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

보다시피 `SyntaxError`입니다.

우리의 경우에서는, 사용자가 반드시 `name`을 가져야만 한다고 가정하며 `name`의 부재 역시 문법 오류로 처리될 것입니다.

그럼 던져봅시다.

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

`(*)` 줄에서, `throw` 연산자는 주어진 `message`를 가지고 `SyntaxError`를 생성하는데, 이는 자바스크립트가 자체적으로 생성하는 방식과 동일합니다. `try`의 실행은 즉시 중단되고 제어 흐름은 `catch`으로 뛰어넘습니다.

이제 `catch`는 모든 에러를 처리하는 단 한 곳이 되었고, `JSON.parse`와 다른 경우들을 모두 처리합니다.

## 다시 던지기

위의 예제들에서는 `try..catch`를 사용하여 틀린 데이터를 처리했습니다. 그런데 *또다른 예기치 않은 오류*가 `try {...}` 블록 안에서 발생하는 것이 가능할까요? 가령 변수가 undefined이거나 또는 "틀린 데이터"인 예처럼 다른 무언가이거나요.

다음처럼요.

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

당연히 모든 일이 일어날 수 있습니다! 프로그래머들은 실수를 합니다. 심지어 몇 십년간 몇 백만명이 사용한 오픈소스 유틸리티에서도요 -- 끔찍한 해킹으로 이어질 수 있는 엄청난 버그가 갑자기 발견될 수 있습니다(`ssh` 툴에서도 벌어진 일입니다).

우리의 경우에서는, `try..catch`는 "틀린 데이터"를 잡기 위한 것이었습니다. 하지만 근본적으로, `catch`는 `try`의 *모든* 오류들을 잡습니다. 여기에서는 예기치 못한 오류를 잡지만, 여전히 동일한 "JSON Error"를 보여줍니다. 그것은 잘못된 것이며 또한 코드를 더 디버깅하기 어렵게 만듭니다.

다행스럽게도, 우리는 잡은 오류가 무엇인지 알아낼 수 있습니다. 예를 들어 `name`에서 얻어낼 수 있습니다.

```js run
try {
  user = { /*...*/ };
} catch(e) {
*!*
  alert(e.name); // "ReferenceError" for accessing an undefined variable
*/!*
}
```

규칙은 간단합니다.

**Catch는 알고 있는 오류들만 처리하고 나머지 오류들은 모두 "다시 던져야" 합니다.**

"다시 던지기" 기술을 더 자세히 설명하면,

1. Catch가 모든 오류들을 잡습니다.
2. `catch(err) {...}` 블록에서 `err` 객체를 분석합니다.
2. 어떻게 처리할지 모르면 `throw err`를 합니다.

In the code below, we use rethrowing so that `catch` only handles `SyntaxError`:
아래 코드에서는, 다시 던지기를 사용하여 `catch`가 `SyntaxError`만 처리합니다.

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

`(*)` 줄에서 안쪽 `catch` 블록에서 던져진 오류는 `try..catch`에서 "떨어져 나와서" 바깥쪽 `try..catch`(존재한다면)에서 잡히거나, 스크립트를 죽이게 됩니다.

이렇게 `catch` 블록은 실제로 어떻게 다루어야 할지 알고 있는 오류들만 처리하고 나머지는 "스킵"합니다.

아래 예제에서는 이런 오류들을 어떻게 `try..catch` 한 단계 위의 레벨에서 잡을 수 있는지 시연합니다.

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

여기에서 `readData`는 `SyntaxError`를 다루는 방법만 알고 있고, 바깥쪽 `try..catch`는 모든 것을 다루는 방법을 압니다.

## try..catch..finally

잠깐만요, 이게 다가 아닙니다.

`try..catch`문은 `finally`라는 코드 절을 하나 더 가질 수 있습니다.

만약 존재한다면, 모든 경우에 대해 실행됩니다. 

- 오류가 없는 경우, `try` 후에,
- 오류가 있는 경우, `catch` 뒤에.

확장된 문법은 다음과 같습니다.

```js
*!*try*/!* {
   ... try to execute the code ...
} *!*catch*/!*(e) {
   ... handle errors ...
} *!*finally*/!* {
   ... execute always ...
}
```

다음 코드를 실행해보세요.

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

이 코드에는 두 가지 실행 경로가 있습니다.

1. "Make an error?"에 "Yes"로 답하면, `try -> catch -> finally`.
2. "No"로 하면, `try -> finally`.

`finally` 절은 `try..catch` 전에 무언가를 시작하고 그것을 결과에 상관없이 완료하고 싶을 경우 사용됩니다.

가령, 피보나치 함수 `fib(n)`의 시간을 측정하고 싶습니다. 자연히 실행 전에 측정을 시작하고 그 후에 종료할 수 있습니다. 그런데 함수 호출하는 도중에 오류가 있다면 어떻게 될까요? 구체적으로, 아래 코드에서 `fib(n)`의 실행은 음수 또는 정수가 아닌 수에 대한 오류를 리턴합니다.

`finally` 절은 측정을 종료하기 아주 좋은 장소입니다.

여기에서 `finally`는 시간이 `fib`이 정상적으로 실행되는 경우, 그리고 오류가 있는 경우, 두가지 상황에서 모두 올바르게 측정될 것이라는 사실을 보장합니다. 

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

코드를 실행하고 `35`를 `prompt`에 입력하면 확인할 수 있습니다. -- 정상적으로 `try` 다음에 `finally`가 실행됩니다. 그리고나서 `-1`를 입력하면 -- 즉시 `0ms` 시간이라는 오류가 나올 것입니다. 두 경우 다 측정이 정상적으로 이루어집니다.

다른 말로 하면, 함수를 나가는 두 가지 경로가 있을 수 있습니다. `return` 또는 `throw`입니다. `finally` 절은 두 경우 둘 다 처리할 수 있습니다.

```smart header="`try..catch..finally` 안의 변수들은 로컬 변수입니다"
위의 코드에서 `result`와 `diff` 변수들은 `try..catch` *이전*에 선언되었다는 사실에 주의하세요.

그렇지 않고, 만약 `{...}` 블록 안에서 `let`을 했다면, 그 안에서만 가시성을 가집니다.
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

`catch` 절이 없는 `try..finally` 구문도 유용합니다. 당장 여기에서는 오류를 처리하고 싶지 않지만, 시작한 프로세스가 완료되기를 원할 경우에 이를 사용합니다.

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
위의 코드에서는, `try` 안의 오류는 `catch`가 없기 때문에 항상 떨어져 나옵니다. 그러나 실행 흐름이 바깥으로 나가기 전에 `finally`가 실행됩니다.
````

## 전역 catch

```warn header="Environment-specific"
이 장의 정보는 코어 자바스크립트의 일부가 아닙니다.
```

`try..catch` 바깥에 프로그래밍 오류나 끔찍한 다른 무언가처럼 치명적인 오류가 있어서 스크립트가 죽었다고 상상해봅시다. 

이런 상황에 대응하는 방법이 있을까요? 오류를 기록하거나, 사용자에게 무언가 보여주는 것(정상적이라면 오류 메시지는 보이지 않습니다) 등을 원할 수 있습니다.

명세에는 없지만, 아주 유용하기 때문에 환경에서는 일반적으로 기능을 제공합니다. 가령, Node.JS에는 [process.on('uncaughtException')](https://nodejs.org/api/process.html#process_event_uncaughtexception)이 있습니다. 그리고 브라우저에서 특별한 [window.onerror](mdn:api/GlobalEventHandlers/onerror) 속성에 함수를 할당할 수 있습니다. 잡히지 않은 오류가 있는 경우에 실행됩니다.

문법은 이렇습니다.

```js
window.onerror = function(message, url, line, col, error) {
  // ...
};
```

`message`
: 오류 메시지.

`url`
: 오류가 발생한 스크립트의 URL.

`line`, `col`
: 오류가 발생한 줄과 열 번호.

`error`
: 오류 객체.

예를 들면,

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

전역 처리기 `window.onerror`의 용도는 보통 스크립트 실행을 복구하고자 하는 것이 아니며(프로그래밍 오류인 경우 아마 불가능할 것입니다), 개발자에게 오류 메시지를 보내기 위한 것입니다.

<https://errorception.com> 또는 <http://www.muscula.com>처럼 이런 경우를 위한 오류 로깅을 제공하는 웹서비스들도 있습니다.

이들은 다음처럼 동작합니다.

1. 서비스에 등록하고 JS 코드 조각 (또는 스크립트 URL)을 가져와서 페이지에 삽입합니다.
2. 그 JS 스크립트에는 커스텀 `window.onerror` 메소드가 있습니다.
3. 오류가 발생하면, 서비스로 이에 대한 네트워크 요청을 보냅니다.
4. 서비스 웹 인터페이스에 로그인하고 오류를 볼 수 있습니다.

## 정리

`try..catch` 구문은 런타임 오류들을 처리할 수 있게 합니다. 말 그대로 코드 실행을 시도하고 발생할 수 있는 오류를 잡습니다.

문법은 다음과 같습니다.

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

`catch` 장이나 `finally` 장이 없으므로, `try..catch`와 `try..finally`만 가능하겠지요.

오류 객체들은 다음 속성들을 가집니다.

- `message` -- 사람이 읽을 수 있는 형태의 오류 메시지.
- `name` -- 오류 이름 문자열 (오류 생성자 이름).
- `stack` (표준 아님) -- 오류가 생성되는 순간의 스택.

`throw` 연산자를 사용하면 자체 오류도 생성할 수 있습니다. 이론적으로, `throw`의 인수로는 아무 것이나 가능하지만, 일반적으로 내장 `Error` 클래스에서 상속받은 오류 객체를 사용합니다. 다음 장에 확장 오류들이 더 나옵니다.

다시 던지기는 오류 처리의 기본 패턴입니다. 일반적으로 `catch` 블록은 어떤 특정한 오류 종류들이 나올 것인지, 이 오류들을 어떻게 다룰지 알고 있으므로, 알지 못하는 오류들은 다시 던지기를 해야 합니다. 

`try..catch`를 사용하지 않더라도, 대다수의 환경에서는 "전역" 오류 처리기를 설정하여 "떨어져 나온" 오류들을 잡는데 사용합니다. 브라우저에서는 `window.onerror`입니다.
