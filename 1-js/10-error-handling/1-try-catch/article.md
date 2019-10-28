# "try..catch"로 에러 핸들링하기

아무리 프로그래밍에 능한 사람이더라도 에러가 있는 스크립트를 작성할 수 있습니다. 원인은 아마도 실수, 예상치 못한 사용자 입력, 잘못된 서버 응답 등의 수천만 가지 이유 때문일 겁니다.

에러가 발생하면 스크립트는 "죽고" (즉시 중단되고), 콘솔에 에러가 출력됩니다.

그러나 `try..catch` 문법을 사용하면 스크립트가 죽는 걸 방지하고, 에러를 "잡아서(catch)" 더 합당한 무언가를 할 수 있게 됩니다.

## "try..catch" 문법

'try..catch' 구문은 'try'와 'catch'라는 두 개의 주요 블록으로 구성됩니다.

```js
try {

  // 코드...

} catch (err) {

  // 에러 핸들링

}
```

아래와 같이 동작하죠.

1. 먼저, `try {...}` 안의 코드가 실행됩니다.
2. 에러가 없다면, `try` 안의 마지막 줄까지 실행되고, `catch` 블록은 건너뜁니다.
3. 에러가 있다면, `try` 안 코드의 실행이 중단되고, `catch(err)` 블록으로 넘어갑니다. `err` 변수(아무 이름이나 사용 가능)는 무슨 일이 일어났는지를 상세히 설명하는 에러 객체를 포함합니다.

![](try-catch-flow.svg)

`try {…}` 블록 안의 코드가 에러를 만들어도 `catch`에서 에러를 다루기 때문에 스크립트가 죽지 않습니다.

예제를 살펴봅시다.

- 아래는 에러가 없는 예제로, `(1)`과 `(2)`를 `alert` 창에 보여줍니다.

    ```js run
    try {

      alert('try 블록 시작');  // *!*(1) <--*/!*

      // ...에러가 없습니다.

      alert('try 블록 끝');   // *!*(2) <--*/!*

    } catch(err) {

      alert('에러가 없으므로, catch는 무시되었습니다.'); // (3)

    }
    ```
- 아래는 에러가 있는 예제로, `(1)`과 `(3)`을 보여줍니다.

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
    ```


````warn header="`try..catch`는 오직 런타임 에러에만 유효합니다."
`try..catch`가 제대로 동작하려면, 코드가 실행 가능(runnable)해야 합니다. 유효한 자바스크립트 코드 이여야 하죠.

중괄호 짝이 안 맞는 것처럼 코드가 문법적으로 잘못된 경우엔 try..catch가 동작하지 않습니다.

```js run
try {
  {{{{{{{{{{{{
} catch(e) {
  alert("유효하지 않은 코드이기 때문에, 자바스크립트 엔진은 이 코드를 이해할 수 없습니다.");
}
```

자바스크립트 엔진은 코드를 먼저 읽고 난 후 코드를 실행합니다. 코드를 읽는 중에 발생하는 에러는 "parse-time" 에러라고 부르는데, 이 에러는 (해당 코드 안에서) 복구가 불가능합니다. 엔진이 코드를 이해할 수 없기 때문이죠.

따라서 `try..catch`는 유효한 코드에서 발생하는 에러만 처리할 수 있습니다. 이런 에러를 "런타임 에러(runtime error)"라고 부르며, "예외(exception)"라고 부를 때도 있습니다.
````


````warn header="`try..catch`는 동기적으로 동작합니다."
setTimeout처럼 "스케줄 된(scheduled)" 코드에서 발생한 예외는 `try..catch`에서 잡아낼 수 없습니다.

```js run
try {
  setTimeout(function() {
    noSuchVariable; // 스크립트는 여기서 죽습니다.
  }, 1000);
} catch (e) {
  alert( "작동 멈춤" );
}
```

왜냐하면 함수는 엔진이 이미 `try..catch` 구문을 떠난 다음에야 실행되기 때문입니다.

스케줄 된 함수 내부의 예외를 잡고 싶다면, `try..catch`가 반드시 함수 내부에 있어야 합니다. 
```js run
setTimeout(function() {
  try {    
    noSuchVariable; // 이제 try..catch에서 에러를 핸들링 할 수 있습니다!
  } catch {
    alert( "error is caught here!" );
  }
}, 1000);
```
````

## 에러 객체

자바스크립트에선 에러 발생 시 에러의 상세내용을 포함한 객체가 만들어집니다. 이 객체는 `catch` 블록에 인수로 전달됩니다.

```js
try {
  // ...
} catch(err) { // <-- "에러 객체", err 대신 다른 이름으로도 쓸 수 있음
  // ...
}
```

모든 내장 에러에 대해서, `catch` 블록에 전달된 에러 객체는 두 가지 주요 프로퍼티를 가집니다.

`name`
: 에러의 이름. 정의되지 않은 변수 때문에 발생한 에러라면 `"ReferenceError"`가 이름이 됩니다.

`message`
: 에러의 상세 내용을 담고 있는 문자 형태의 메시지.

그 밖에 표준은 아니지만, 대부분의 자바스크립트 환경에서 지원하는 비표준 프로퍼티도 있습니다. `stack`은 가장 널리 사용되는 비표준 프로퍼티 중 하나입니다.

`stack`
: 현재 호출 스택. 에러를 유발한 중첩 호출들의 순서에 대한 정보를 가진 문자열로, 디버깅 목적으로 사용합니다.

예시:

```js run untrusted
try {
*!*
  lalala; // 에러, 변수가 정의되지 않음!
*/!*
} catch(err) {
  alert(err.name); // ReferenceError
  alert(err.message); // lalala is not defined
  alert(err.stack); // ReferenceError: lalala is not defined at (...call stack)

  // 에러 전체를 보여줄 수도 있습니다.
  // 이때, 에러 객체는 "name: message" 형태의 문자열로 변환됩니다.
  alert(err); // ReferenceError: lalala is not defined
}
```

## "catch"에서 에러객체 생략하기

[recent browser=new]

에러에 대한 자세한 정보가 필요하지 않으면, `catch`에서 이를 생략할 수 있습니다.

```js
try {
  // ...
} catch { // <-- (err) 없이 쓰임
  // ...
}
```

## "try..catch" 직접 사용해보기

`try..catch`가 실제로 어떻게 사용되는지 알아봅시다.

앞서 JSON으로 인코딩된 값을 읽을 수 있도록 해주는 [JSON.parse(str)](mdn:js/JSON/parse) 메서드에 대해 배운 바 있습니다.

이 메서드는 주로 서버 등의 출처에서 네트워크를 통해 전달받은 데이터를 디코딩하는 데 사용합니다.

전달받은 데이터에 `JSON.parse`를 호출하는 식으로 사용되죠.

```js run
let json = '{"name":"John", "age": 30}'; // 서버로부터 전달받은 데이터

*!*
let user = JSON.parse(json); // 전달받은 문자열을 자바스크립트 객체로 변환
*/!*

// 문자열로 전달받은 user가 프로퍼티를 가진 user 객체가 됨
alert( user.name ); // John
alert( user.age );  // 30
```

JSON에 관한 자세한 정보는 <info:json> 에서 찾을 수 있습니다.

**`json`이 잘못 만들어진 경우 `JSON.parse`에서 에러가 발생하여 스크립트가 "죽습니다".**

<<<<<<< HEAD
스크립트가 죽는 것에 만족해야 할까요? 당연히 아니죠!
=======
Should we be satisfied with that? Of course not!
>>>>>>> 70ca842bef2390bc26d13dea2b856838aa890fe0

잘못된 데이터를 서버에서 전달받아 스크립트가 죽는경우, 사용자는 (개발자 콘솔을 열지 않는 이상) 스크립트가 죽는 원인이 잘못된 데이터 때문이란 걸 절대 알 수 없습니다. 사람들은 에러의 원인을 알려주는 메시지 없이 무언가가 "그냥 죽는" 것을 정말 싫어하죠.

`try..catch`를 사용해 이런 경우를 처리해 보도록 합시다.

```js run
let json = "{ bad json }";

try {

*!*
  let user = JSON.parse(json); // <-- 여기서 에러가 발생합니다.
*/!*
  alert( user.name ); // 따라서 이 코드는 작동하지 않고,

} catch (e) {
*!*
  // 바로 catch 문으로 넘어옵니다.
  alert( "데이터에 에러가 있어 재요청을 시도하겠습니다." );
  alert( e.name );
  alert( e.message );
*/!*
}
```

위 예시에선 에러가 발생했다는 걸 단순히 보여주기 위해 `catch` 블록을 사용했지만, catch 블록 안에서 더 많은 일을 할 수 있습니다. 네트워크 요청 보내기, 사용자에게 대안 제안하기, 에러 정보를 로깅 장치에 보내기 등 말이죠. 이 모든 것들이 스크립트가 그냥 죽도록 놔두는 것보다 훨씬 나은 대응입니다.

## 자체 에러 던지기

`json`이 문법적으로 잘못되진 않았지만, 코드 내에서 쓰이고 있는 프로퍼티인 `name`에 대한 정보를 가지고 있지 않다면 어떻게 될까요?

다음처럼 말이죠.

```js run
let json = '{ "age": 30 }'; // 불완전한 데이터

try {

  let user = JSON.parse(json); // <-- 에러 없음
*!*
  alert( user.name ); // 이름이 없습니다!
*/!*

} catch (e) {
  alert( "실행되지 않습니다." );
}
```

`JSON.parse` 는 정상적으로 실행되었습니다. 하지만 전달받은 데이터에 `name`이 없는 건, 위 코드에선 에러를 유발하는 상황입니다.

이제 `throw` 연산자를 사용해 에러 처리를 통합해 보도록 하겠습니다.

### "Throw" 연산자

`throw` 연산자는 에러를 생성합니다.

문법은 다음과 같습니다.

```js
throw <error object>
```

이론적으로는 어떤 것이든 에러 객체로 사용할 수 있습니다. 숫자, 문자열 같은 원시 타입도 허용되죠. 하지만 되도록 (내장 에러와의 호환을 위해) `name`과 `message` 프로퍼티가 있는 객체를 사용하는 것을 권장합니다. 

자바스크립트는 표준 에러객체를 만들어주는 `Error`, `SyntaxError`, `ReferenceError`, `TypeError`등의 다양한 내장 생성자를 지원합니다. 이 생성자들을 이용해 에러 객체를 만들 수도 있습니다.

아래와 같이 말이죠.

```js
let error = new Error(message);
// or
let error = new SyntaxError(message);
let error = new ReferenceError(message);
// ...
```

일반 객체가 아닌 내장 생성자를 사용해 만든 내장 에러 객체의 `name` 프로퍼티는 생성자의 이름과 동일한 값을 갖습니다. `message`는 인수에서 가져옵니다.

예시:

```js run
let error = new Error("Things happen o_O");

alert(error.name); // Error
alert(error.message); // Things happen o_O
```

잘못된 데이터를 받았을 때, `JSON.parse`가 어떤 종류의 에러를 만들어내는지 아래 코드를 통해 살펴봅시다.

```js run
try {
  JSON.parse("{ bad json o_O }");
} catch(e) {
*!*
  alert(e.name); // SyntaxError
*/!*
  alert(e.message); // Unexpected token o in JSON at position 2
}
```

`SyntaxError`가 발생하네요.

사용자를 나타내는 객체에 `name` 프로퍼티는 반드시 있어야 하므로, `name`이 없으면 error로 처리해야 합니다.

Throw 연산자를 사용해 에러를 던져봅시다:

```js run
let json = '{ "age": 30 }'; // 불완전한 데이터

try {

  let user = JSON.parse(json); // <-- 에러 없음

  if (!user.name) {
*!*
    throw new SyntaxError("불완전한 데이터: 이름 없음"); // (*)
*/!*
  }

  alert( user.name );

} catch(e) {
  alert( "JSON Error: " + e.message ); // JSON Error: 불완전한 데이터: 이름 없음
}
```

`(*)`로 표시한 줄에서 `throw` 연산자는 전달받은 `message`를 이용해 `SyntaxError`를 생성합니다. 자바스크립트가 자체적으로 에러를 생성하는 방식과 동일하게 말이죠. 에러가 발생했으므로 `try`의 실행은 즉시 중단되고 이제 제어 흐름은 `catch`로 넘어갑니다.

이제 모든 에러를 `catch` 블록 안에서 처리할 수 있게 되었습니다. `JSON.parse`에서 에러가 발생한 경우를 포함해서 말이죠.

## 에러 다시 던지기

<<<<<<< HEAD
위 예제에선 `try..catch`를 사용해 불완전한 데이터를 처리하였습니다. 그런데 *또 다른 예기치 않은 에러*가 `try {...}` 블록 안에서 발생하면 할 수도 있지 않을까요? 정의하지 않은 변수를 사용하려는 경우 등의 프로그래밍 에러가 발생할 가능성은 항상 있습니다.

다음처럼요.
=======
In the example above we use `try..catch` to handle incorrect data. But is it possible that *another unexpected error* occurs within the `try {...}` block? Like a programming error (variable is not defined) or something else, not just this "incorrect data" thing.

For example:
>>>>>>> 70ca842bef2390bc26d13dea2b856838aa890fe0

```js run
let json = '{ "age": 30 }'; // 불완전한 데이터

try {
  user = JSON.parse(json); // <-- user 앞에 let을 쓰지 않음

  // ...
} catch(err) {
  alert("JSON Error: " + err); // JSON Error: ReferenceError: user is not defined
  // (실제론 JSON Error가 아님에도 불구하고, JSON Error가 만들어졌습니다.)
}
```

프로그래머는 실수를 하기 때문에, 어떤 에러든 발생할 수 있습니다! 끔찍한 해킹으로 이어질 수 있는 엄청난 버그가 몇십 년간 몇백만 명이 사용한 오픈소스 유틸리티에서도 조차 발견됩니다.

위에선 "불완전한 데이터"를 다루려는 목적으로 `try..catch`를 썼습니다. 하지만 `catch`는 근본적으로 `try` 블록에서 발생한 *모든* 에러들을 잡습니다. 위 코드에서 catch는 에러를 잡아냈지만, 발생한 에러의 종류에 관계없이 "JSON Error" 메시지를 보여줍니다. 이렇게 에러 종류와 관계없이 동일한 방식으로 에러를 처리하는 방식의 디버깅은 좋지 않습니다. 디버깅을 어렵게 만들죠. 

다행히도, `name` 프로퍼티를 사용하면 발생한 에러가 어떤 타입인지 알아낼 수 있습니다.

```js run
try {
  user = { /*...*/ };
} catch(e) {
*!*
  alert(e.name); // 존재하지 않는 변수에 접근하려 했으므로 "ReferenceError"가 발생
*/!*
}
```

규칙은 간단합니다.

**catch에선 타입을 알고 있는 에러만 처리하고, 나머지 에러는 모두 "다시 던집니다."**

"다시 던지기" 기술을 자세히 설명하면 아래와 같습니다.

<<<<<<< HEAD
1. catch에서 모든 에러를 받습니다.
2. `catch(err) {...}` 블록에서 에러 객체, `err`을 분석합니다.
2. 에러를 어떻게 처리할지 모르는 경우는 `throw err`로 처리합니다.
=======
1. Catch gets all errors.
2. In the `catch(err) {...}` block we analyze the error object `err`.
2. If we don't know how to handle it, we do `throw err`.
>>>>>>> 70ca842bef2390bc26d13dea2b856838aa890fe0

아래는 다시 던지기 기술을 사용하여 `catch`블록에선 `SyntaxError`만 처리하도록 했습니다.

```js run
let json = '{ "age": 30 }'; // 불완전한 데이터
try {

  let user = JSON.parse(json);

  if (!user.name) {
    throw new SyntaxError("불완전한 데이터: 이름 없음");
  }

*!*
  blabla(); // 예상치 못한 에러
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

`catch` 블록 안의 `(*)`로 표시된 줄에서 다시 던져진(rethrow) 에러는 `try..catch` "밖으로 던져져" 스크립트를 죽입니다. 바깥에 `try..catch`가 있다면 스크립트를 죽이지 않고 여기서 에러를 처리할 수 있습니다.

이런 식으로 구현하게 되면 실제로 어떻게 다룰지 알고 있는 에러들만 `catch` 블록에서 처리할 수 있습니다. 알 수 없는 에러를 "건너뛸 수 있습니다".

아래 예제는 `try..catch`를 한 레벨 더 만들어, 예상치 못한 에러를 처리하는 방법을 보여줍니다.

```js run
function readData() {
  let json = '{ "age": 30 }';

  try {
    // ...
*!*
    blabla(); // 에러!
*/!*
  } catch (e) {
    // ...
    if (e.name != 'SyntaxError') {
*!*
      throw e; // 알 수 없는 에러 다시 던지기
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

`readData`안에선 `SyntaxError`만 처리하고, 예상치 못한 에러는 함수 바깥의 `try..catch`에서 처리됩니다.

## try..catch..finally

잠깐만요, 이게 다가 아닙니다.

`try..catch`는 `finally`라는 코드 절을 하나 더 가질 수 있습니다.

finally 절은 아래의 경우에 실행됩니다.

- 에러가 없는 경우, `try` 실행이 끝난 후
- 에러가 있는 경우, `catch` 실행이 끝난 후

finally를 사용해 try..catch 를 확장하면 다음과 같습니다.

```js
*!*try*/!* {
   ... 코드를 실행 ...
} *!*catch*/!*(e) {
   ... 에러 핸들링 ...
} *!*finally*/!* {
   ... 항상 실행 ...
}
```

아래 코드를 실행해보세요.

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

위 코드는 두 가지 경로로 실행됩니다.

1. "Make an error?"에 "Yes"로 답하면, `try -> catch -> finally`.
2. "No"로 하면, `try -> finally`.

`finally` 절은 무언가를 실행하고, 결과에 상관없이 실행을 완료하고 싶을 경우 사용합니다.

예를 들어, 피보나치 함수 `fib(n)`의 연산 시간을 측정하고 싶다고 해 봅시다. 함수 실행 전에 측정을 시작해서 실행이 끝난 후 측정을 종료하는 방법이 자연스레 떠올랐을 겁니다. 그런데 만약 함수 실행 도중 에러가 발생하면 어떻게 될까요? 아래 코드의 함수 `fib(n)`는 음수나 정수가 아닌 수가 입력될 경우 에러가 리턴됩니다.

`finally` 절은 연산 시간 측정을 종료하기 적절한 곳입니다.

`fib` 함수가 에러 없이 정상적으로 실행되든 에러를 발생하든 상관없이, `finally`를 사용하면 연산 시간을 제대로 측정할 수 있습니다.

```js run
let num = +prompt("양의 정수를 입력해주세요.", 35)

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

alert(result || "에러 발생");

alert( `연산 시간: ${diff}ms` );
```

코드를 실행하고 `35`를 `프롬프트 대화상자`에 입력하면 `try` 다음에 `finally`가 정상적으로 실행되면서 연산 시간을 확인할 수 있습니다. `-1`을 입력하면 에러가 발생하고, 연산 시간은 `0ms`가 됩니다. 두 경우 모두 연산 시간이 정상적으로 측정되었습니다.

자바스크립트에서 함수를 빠져나가려면 `return` 이나 `throw`를 사용하면 되는데, `finally` 절을 이용하면 두 경우를 모두 다룰 수 있습니다.


```smart header="`try..catch..finally` 안의 변수는 지역 변수입니다."
위 코드에서 `diff`와 `result`는 `try..catch`블록 *밖*의 전역 공간에서 선언되었다는 사실에 주의하세요.

`{...}` 블록 안에서 `let`을 사용해 변수를 선언했다면, 블록 안에서만 유효한 지역 변수가 됩니다.
```

````smart header="`finally` 와 `return`"
`finally` 절은 `try..catch`절을 빠져나가는 *어떤* 경우에도 실행됩니다. `return`을 사용해 명시적으로 빠져나가려는 경우에도 실행됩니다.

아래 코드의 `try`블록 안엔 `return`문이 있는데, 이 경우에도 `finally`가 실행됩니다. `try..catch`절 바깥의 코드는 그 이후 실행됩니다.

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

alert( func() ); // finally 안의 alert가 실행되고 난 후, 실행됨
```
````

````smart header="`try..finally`"

`catch` 절이 없는 `try..finally` 구문도 상황에 따라 유용하게 쓸 수 있습니다. 당장은 에러를 처리하고 싶지 않지만, 시작한 프로세스가 마무리되었는지 확실히 하고 싶은 경우에 사용합니다.

```js
function func() {
  // 무언가를 측정하는 경우와 같이 끝맺음이 있어야 하는 프로세스
  try {
    // ...
  } finally {
    // 스크립트가 죽더라도 완료됨
  }
}
```
위의 코드에서 `try` 안에서 발생한 에러는 `catch`가 없기 때문에, 항상 밖으로 떨어져 나옵니다. 그러나 실행 흐름이 함수를 떠나기 전에 `finally`가 실행됩니다.
````

## 전역 catch

```warn header="호스트 환경을 확인하세요"
이 절의 내용은 코어 자바스크립트 내용이 아닙니다.
```

<<<<<<< HEAD
`try..catch` 바깥에서 치명적인 에러가 발생해 스크립트가 죽었다고 상상해봅시다.

어떻게 대처해야 할까요? 에러를 기록하거나 사용자에게 무언가를 보여주는 것 등을 할 수 있겠죠.

자바스크립트 명세에는 이런 치명적인 에러에 대응하는 방법이 적혀있지 않습니다. 하지만 try..catch 밖의 에러를 잡는 것은 아주 중요하기 때문에, 여러 자바스크립트 실행 환경에선 해당 기능을 제공합니다. Node.js의 [`process.on("uncaughtException")`](https://nodejs.org/api/process.html#process_event_uncaughtexception)이 그 예입니다. 브라우저 환경에선 [window.onerror](mdn:api/GlobalEventHandlers/onerror)를 이용해 에러를 처리합니다. window.onerror프로퍼티에 특별한 함수를 할당하면, 예상치 못한 에러가 발생했을 때 이 함수가 실행됩니다.
=======
Let's imagine we've got a fatal error outside of `try..catch`, and the script died. Like a programming error or some other terrible thing.

Is there a way to react on such occurrences? We may want to log the error, show something to the user (normally they don't see error messages), etc.

There is none in the specification, but environments usually provide it, because it's really useful. For instance, Node.js has [`process.on("uncaughtException")`](https://nodejs.org/api/process.html#process_event_uncaughtexception) for that. And in the browser we can assign a function to the special [window.onerror](mdn:api/GlobalEventHandlers/onerror) property, that will run in case of an uncaught error.
>>>>>>> 70ca842bef2390bc26d13dea2b856838aa890fe0

문법은 이렇습니다.

```js
window.onerror = function(message, url, line, col, error) {
  // ...
};
```

`message`
: 에러 메시지

`url`
: 에러가 발생한 스크립트의 URL

`line`, `col`
: 에러가 발생한 곳의 줄과 열 번호

`error`
: 에러 객체

예시:

```html run untrusted refresh height=1
<script>
*!*
  window.onerror = function(message, url, line, col, error) {
    alert(`${message}\n At ${line}:${col} of ${url}`);
  };
*/!*

  function readData() {
    badFunc(); // 에러가 발생한 장소
  }

  readData();
</script>
```

전역 핸들러 `window.onerror`를 죽어버린 스크립트를 복구하려는 목적으론 잘 사용하지 않습니다. 프로그래밍 에러가 발생한 경우 `window.onerror`만으로 스크립트를 복구하는 건 사실상 불가능 하죠. `window.onerror`는 개발자에게 에러 메시지를 보내는 용도로 사용합니다.

전역 핸들러 이외에도 에러를 로깅 해주는 여러 가지 웹 서비스가 있습니다. <https://errorception.com> 나 <http://www.muscula.com>처럼 말이죠.

이런 웹 서비스는 다음과 같은 프로세스로 작동합니다.

1. 서비스 가입하면 JS 파일(혹은 스크립트의 url)을 제공받는데, 이 파일을 페이지에 삽입합니다.
2. JS 파일에는 커스텀 `window.onerror` 함수가 있습니다.
3. 에러가 발생하면, 에러에 관한 내용을 서비스로 보냅니다.
4. 웹 서비스 사이트에 로그인하고 로깅된 에러를 봅니다.

## 요약

`try..catch`를 이용하면 런타임 에러를 처리할 수 있습니다. "try"에선 코드를 실행하고, 에러가 발생하면 "catch"에서 잡아냅니다.

문법은 다음과 같습니다.

```js
try {
  // 이곳의 코드를 실행
} catch(err) {
  // 에러가 발생하면, 여기부터 실행됨
  // err는 에러 객체
} finally {
  // 에러 발생 여부와 상관 없이 try/catch 이후에 실행 됨
}
```

`catch` 나 `finally`를 따로 다루는 절이 없는 걸 봐서, `try..catch`와 `try..finally`도 유효한 문법이란 걸 유추할 수 있습니다.

에러 객체엔 다음 프로퍼티가 있습니다.

- `message` -- 사람이 읽을 수 있는 형태의 에러 메시지.
- `name` -- 에러 이름을 담은 문자열 (에러 생성자 이름).
- `stack` (표준이 아니지만 잘 지원됨) -- 에러가 생성되는 순간의 스택.

에러 객체가 필요 없으면 `catch(err) {` 대신 `catch {`를 쓸 수 있습니다.

`throw` 연산자를 사용하면 커스텀 에러를 만들 수 있습니다. 이론상으론, `throw`의 인수로 아무것이나 가능하지만, 대게 내장 `Error` 클래스에서 상속받은 에러 객체를 인수에 넣습니다. 확장 에러에 대해선 다음 챕터에서 다루도록 하겠습니다.

*다시 던지기*는 에러 처리 시 사용되는 중요한 패턴입니다. `catch` 블록에선 대게, 예상하였거나 어떻게 다룰지 알고 있는 에러를 다루고, 예상치 못한 에러는 다시 던지기를 통해 다룹니다. 

대다수의 자바스크립트 환경에서는 `try..catch` 없이도 사용할 수 있는 "전역" 에러 핸들러가 있습니다. 이 핸들러에선 "떨어져 나온" 에러를 다루게 됩니다. 브라우저 환경의 전역 에러 핸들러는 `window.onerror`입니다.
