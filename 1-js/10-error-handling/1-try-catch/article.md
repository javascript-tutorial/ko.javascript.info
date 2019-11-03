# 'try..catch'와 에러 핸들링

아무리 프로그래밍에 능한 사람이더라도 에러가 있는 스크립트를 작성할 수 있습니다. 원인은 아마도 실수, 예상치 못한 사용자 입력, 잘못된 서버 응답 등의 수천만 가지 이유 때문일 겁니다.

에러가 발생하면 스크립트는 '죽고'(즉시 중단되고), 콘솔에 에러가 출력됩니다.

그러나 `try..catch` 문법을 사용하면 스크립트가 죽는 걸 방지하고, 에러를 '잡아서(catch)' 더 합당한 무언가를 할 수 있게 됩니다.

## 'try..catch' 문법

'try..catch' 문법은 'try'와 'catch'라는 두 개의 주요 블록으로 구성됩니다.

```js
try {

  // 코드...

} catch (err) {

  // 에러 핸들링

}
```

동작 알고리즘은 다음과 같습니다.

1. 먼저, `try {...}` 안의 코드가 실행됩니다.
2. 에러가 없다면, `try` 안의 마지막 줄까지 실행되고, `catch` 블록은 건너뜁니다.
3. 에러가 있다면, `try`의 실행이 중단되고, `catch(err)` 블록으로 제어 흐름이 넘어갑니다. 변수 `err`(아무 이름이나 사용 가능)은 무슨 일이 일어났는지에 대한 설명이 담긴 에러 객체를 포함합니다.

![](try-catch-flow.svg)

따라서 `try {…}` 블록 안에서 에러가 발생해도 `catch`에서 에러를 다루기 때문에 스크립트가 죽지 않습니다.

예제를 살펴봅시다.

- 에러가 없는 예제 -- `(1)`과 `(2)`를 `alert` 창에 보여줌

    ```js run
    try {

      alert('try 블록 시작');  // *!*(1) <--*/!*

      // ...에러가 없습니다.

      alert('try 블록 끝');   // *!*(2) <--*/!*

    } catch(err) {

      alert('에러가 없으므로, catch는 무시됩니다.'); // (3)

    }
    ```
- 에러가 있는 예제 -- `(1)`과 `(3)`을 보여줍니다.

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


````warn header="`try..catch`는 오직 런타임 에러에만 동작합니다."
`try..catch`는 실행 가능한(runnable) 코드에만 동작합니다. 실행 가능한 코드는 유효한 자바스크립트 코드를 의미합니다.

중괄호 짝이 안 맞는 것처럼 코드가 문법적으로 잘못된 경우엔 `try..catch`가 동작하지 않습니다.

```js run
try {
  {{{{{{{{{{{{
} catch(e) {
  alert("유효하지 않은 코드이기 때문에, 자바스크립트 엔진은 이 코드를 이해할 수 없습니다.");
}
```

자바스크립트 엔진은 코드를 읽고 난 후 코드를 실행합니다. 코드를 읽는 중에 발생하는 에러는 'parse-time' 에러라고 부르는데, 엔진은 이 코드를 이해할 수 없기 때문에 parse-time 에러는 (코드 안에서) 복구가 불가능합니다.

`try..catch`는 유효한 코드에서 발생하는 에러만 처리할 수 있습니다. 이런 에러를 '런타임 에러(runtime error)' 혹은 '예외(exception)'라고 부릅니다.
````


````warn header="`try..catch`는 동기적으로 동작합니다."
setTimeout처럼 '스케줄 된(scheduled)' 코드에서 발생한 예외는 `try..catch`에서 잡아낼 수 없습니다.

```js run
try {
  setTimeout(function() {
    noSuchVariable; // 스크립트는 여기서 죽습니다.
  }, 1000);
} catch (e) {
  alert( "작동 멈춤" );
}
```

`setTimeout`에 넘겨진 익명 함수는 엔진이 `try..catch`를 떠난 다음에서야 실행되기 때문입니다.

스케줄 된 함수 내부의 예외를 잡으려면, `try..catch`를 반드시 함수 내부에 구현해야 합니다. 
```js run
setTimeout(function() {
  try {    
    noSuchVariable; // 이제 try..catch에서 에러를 핸들링 할 수 있습니다!
  } catch {
    alert( "에러를 잡았습니다!" );
  }
}, 1000);
```
````

## 에러 객체

에러가 발생하면 자바스크립트는 에러 상세내용이 담긴 객체를 생성합니다. 그 후, `catch` 블록에 이 객체를 인수로 전달합니다.

```js
try {
  // ...
} catch(err) { // <-- '에러 객체', err 대신 다른 이름으로도 쓸 수 있음
  // ...
}
```

모든 내장 에러를 포함한 에러 객체는 두 가지 주요 프로퍼티를 가집니다.

`name`
: 에러 이름. 정의되지 않은 변수 때문에 발생한 에러라면 `"ReferenceError"`가 이름이 됩니다.

`message`
: 에러 상세 내용을 담고 있는 문자 메시지

두 프로퍼티 이외에 표준은 아니지만, 대부분의 호스트 환경에서 지원하는 프로퍼티도 있습니다. `stack`은 가장 널리 사용되는 비표준 프로퍼티 중 하나입니다.

`stack`
: 현재 호출 스택. 에러를 유발한 중첩 호출들의 순서 정보를 가진 문자열로 디버깅 목적으로 사용됩니다.

예시:

```js run untrusted
try {
*!*
  lalala; // 에러, 변수가 정의되지 않음!
*/!*
} catch(err) {
  alert(err.name); // ReferenceError
  alert(err.message); // lalala is not defined
  alert(err.stack); // ReferenceError: lalala is not defined at (호출 스택)

  // 에러 전체를 보여줄 수도 있습니다.
  // 이때, 에러 객체는 "name: message" 형태의 문자열로 변환됩니다.
  alert(err); // ReferenceError: lalala is not defined
}
```

## 선택적 'catch' 바인딩

[recent browser=new]

에러에 대한 자세한 정보가 필요하지 않으면, `catch`에서 이를 생략할 수 있습니다.

```js
try {
  // ...
} catch { // <-- (err) 없이 쓰임
  // ...
}
```

## 'try..catch' 사용하기

`try..catch`가 실무에서 어떻게 사용되는지 알아봅시다.

앞서 JSON으로 인코딩된 값을 읽을 수 있도록 해주는 [JSON.parse(str)](mdn:js/JSON/parse) 메서드에 대해 배운 바 있습니다.

이 메서드는 주로 서버 등에서 네트워크를 통해 전달받은 데이터를 디코딩하는 데 사용합니다.

전달받은 데이터에 `JSON.parse`를 호출하는 식으로 사용되죠.

```js run
let json = '{"name":"John", "age": 30}'; // 서버로부터 전달받은 데이터

*!*
let user = JSON.parse(json); // 전달받은 문자열을 자바스크립트 객체로 변환
*/!*

// 문자열 형태로 전달받은 user가 프로퍼티를 가진 객체가 됨
alert( user.name ); // John
alert( user.age );  // 30
```

JSON에 관한 자세한 정보는 <info:json> 챕터에서 찾을 수 있습니다.

**`json`의 형식이 잘못된 경우, `JSON.parse`가 에러를 만들기 때문에 스크립트가 '죽습니다'.**

스크립트가 죽는 것에 만족해야 할까요? 당연히 아니죠!

서버에서 전달받은 데이터가 잘못되어 스크립트가 죽는 경우, 사용자는 (개발자 콘솔을 열지 않는 이상) 원인을 절대 알 수 없습니다. 그런데 사람들은 에러의 원인을 알려주는 메시지 없이 무언가가 '그냥 죽는 것'을 정말 싫어합니다.

`try..catch`를 사용해 이를 처리해 봅시다.

```js run
let json = "{ bad json }";

try {

*!*
  let user = JSON.parse(json); // <-- 여기서 에러가 발생하므로
*/!*
  alert( user.name ); // 이 코드는 동작하지 않습니다.

} catch (e) {
*!*
  // 에러가 발생하면 제어 흐름이 catch 문으로 넘어옵니다.
  alert( "데이터에 에러가 있어 재요청을 시도합니다." );
  alert( e.name );
  alert( e.message );
*/!*
}
```

위 예시에선 에러가 발생했다는 걸 단순히 보여주기 위해 `catch` 블록을 사용했지만, `catch` 블록 안에서 새로운 네트워크 요청 보내기, 사용자에게 대안 제안하기, 로깅 장치에 에러 정보 보내기 등과 같은 일을 할 수 있습니다. 스크립트가 죽도록 놔두는 것보다 훨씬 나은 대응이죠.

## 자체 에러 던지기

`json`이 문법적으로 잘못되진 않았지만, 필수 프로퍼티 `name`을 가지고 있지 않다면 무슨 일이 생길까요?

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

위 예시에서 `JSON.parse`는 정상적으로 실행되었지만 `name`이 없는 건 에러를 유발하는 상황입니다.

이제 `throw` 연산자를 사용해 에러 처리를 통합해 보도록 하겠습니다.

### 'Throw' 연산자

`throw` 연산자는 에러를 생성합니다.

문법은 다음과 같습니다.

```js
throw <error object>
```

이론적으로는 숫자, 문자열 같은 원시 타입을 포함한 어떤 것이든 에러 객체로 사용할 수 있습니다. 하지만 되도록 (내장 에러와의 호환을 위해) `name`과 `message` 프로퍼티가 있는 객체를 에러 객체로 사용하는 것을 권장합니다. 

자바스크립트는 `Error`, `SyntaxError`, `ReferenceError`, `TypeError`등의 표준 에러 객체를 만들어주는 내장 생성자를 지원합니다. 이 생성자들을 이용해 에러 객체를 만들 수도 있습니다.

아래와 같이 말이죠.

```js
let error = new Error(message);
// or
let error = new SyntaxError(message);
let error = new ReferenceError(message);
// ...
```

일반 객체가 아닌 내장 생성자를 사용해 만든 내장 에러 객체의 `name` 프로퍼티는 생성자의 이름과 동일한 값을 갖습니다. 프로퍼티 `message`의 값은 인수에서 가져옵니다.

예시:

```js run
let error = new Error("이상한 일이 발생했습니다. o_O");

alert(error.name); // Error
alert(error.message); // 이상한 일이 발생했습니다. o_O
```

잘못된 데이터를 받았을 때, `JSON.parse`가 어떤 종류의 에러를 만들어내는지 아래 코드를 통해 살펴봅시다.

```js run
try {
  JSON.parse("{ 잘못된 형식의 json o_O }");
} catch(e) {
*!*
  alert(e.name); // SyntaxError
*/!*
  alert(e.message); // Unexpected token o in JSON at position 2
}
```

`SyntaxError`가 발생하네요.

사용자를 나타내는 객체에 `name` 프로퍼티는 반드시 있어야 하므로, 우리 예시에선 `name`이 없으면 에러가 발생한 것으로 간주합시다.

`throw` 연산자를 사용해 에러를 던져보겠습니다.

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

`(*)`로 표시한 줄에서 `throw` 연산자는 `message`를 이용해 자바스크립트가 자체적으로 에러를 생성하는 방식과 동일한 방식으로 `SyntaxError`를 생성합니다. 에러가 발생했으므로 `try`의 실행은 즉시 중단되고 제어 흐름은 `catch`로 넘어갑니다.

이제 `JSON.parse`에서 에러가 발생한 경우를 포함한 모든 에러를 `catch` 블록 안에서 처리할 수 있게 되었습니다.

## 에러 다시 던지기

위 예제에선 `try..catch`를 사용해 불완전한 데이터를 처리하였습니다. 그런데 *또 다른 예기치 않은 에러*가 `try {...}` 블록 안에서 발생 할 수도 있습니다. 정의하지 않은 변수 등의 프로그래밍 에러가 발생할 가능성은 항상 있습니다.

예시:

```js run
let json = '{ "age": 30 }'; // 불완전한 데이터

try {
  user = JSON.parse(json); // <-- user 앞에 let을 쓰지 않음

  // ...
} catch(err) {
  alert("JSON Error: " + err); // JSON Error: ReferenceError: user is not defined
  // (실제론 JSON Error가 아닙니다.)
}
```

어떤 에러든 발생할 수 있습니다! 끔찍한 해킹으로 이어질 수 있는 엄청난 버그가 몇십 년간 몇백만 명이 사용한 오픈소스 유틸리티에서도 조차 발견됩니다.

위에선 '불완전한 데이터'를 다루려는 목적으로 `try..catch`를 썼습니다. 그런데 `catch`는 근본적으로 `try` 블록에서 발생한 *모든* 에러들을 잡습니다. 위 코드에서 `catch`는 예상치 못한 에러를 잡아냈긴 했지만, 에러의 종류와 관계없이 "JSON Error" 메시지를 보여줍니다. 이렇게 에러 종류와 관계없이 동일한 방식으로 에러를 처리하는 방식은 디버깅을 어렵게 만들기 때문에 좋지 않습니다. 

다행히도, `name` 프로퍼티를 사용하면 에러의 종류를 알아낼 수 있습니다.

```js run
try {
  user = { /*...*/ };
} catch(e) {
*!*
  alert(e.name); // 존재하지 않는 변수에 접근하려 했으므로 "ReferenceError"가 발생
*/!*
}
```

에러 처리 규칙은 간단합니다.

**catch에선 타입을 알고 있는 에러만 처리하고, 나머지 에러는 모두 '다시 던집니다(rethrow)'.**

'다시 던지기' 기술을 자세히 설명해보겠습니다.

1. `catch`에서 모든 에러를 받습니다.
2. `catch(err) {...}` 블록에서 에러 객체, `err`을 분석합니다.
3. 에러를 어떻게 처리할지 모르는 경우는 `throw err`로 처리합니다.

다시 던지기를 사용하여 `catch` 블록에선 `SyntaxError`만 처리하도록 해보겠습니다.

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
    throw e; // 에러 다시 던지기 (*)
  }
*/!*

}
```

`catch` 블록 안의 `(*)`로 표시된 줄에서 다시 던져진(rethrow) 에러는 `try..catch` '밖으로 던져집니다'. 이때 바깥에 `try..catch`가 있다면 여기서 에러를 잡습니다. 아니라면 스크립트가 죽겠죠. 

따라서 `catch` 블록은 어떻게 다룰지 알고 있는 에러만 처리하고, 알 수 없는 에러는 '건너뜁니다'.

아래 예시에선 `try..catch`를 한 레벨 더 만들어, 예상치 못한 에러를 어떻게 처리하는지 보여줍니다.

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
  alert( "External catch got: " + e ); // 에러를 잡음
*/!*
}
```

`readData`는 `SyntaxError` 처리 방법만 알고 있는 반면, 함수 바깥의 `try..catch`는 예상치 못한 에러 처리 방법도 알고 있습니다.

## try..catch..finally

여기서 끝이 아닙니다.

`try..catch`는 `finally`라는 코드 절을 하나 더 가질 수 있습니다.

`finally`안의 코드는 아래 상황에서 실행됩니다.

- 에러가 없는 경우, `try` 실행이 끝난 후
- 에러가 있는 경우, `catch` 실행이 끝난 후

`finally`를 사용해 `try..catch`를 확장하면 다음과 같습니다.

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
  if (confirm('에러를 만드시겠습니까?')) 이상한_코드();
} catch (e) {
  alert( 'catch' );
} finally {
  alert( 'finally' );
}
```

위 코드는 두 가지 경로로 실행됩니다.

1. "에러를 만드시겠습니까"에 "OK"로 답한 경우: `try -> catch -> finally`
2. "No"로 답한 경우: `try -> finally`

`finally` 절은 무언가를 실행하고, 결과에 상관없이 실행을 완료하고 싶을 경우 사용됩니다.

피보나치 함수 `fib(n)`의 연산 시간을 측정하고 싶다고 해 봅시다. 함수 실행 전에 측정을 시작해서 실행이 끝난 후 측정을 종료하면 되겠죠. 그런데 함수 실행 도중 에러가 발생하면 어떻게 될까요? 아래에서 구현한 함수 `fib(n)`는 음수나 정수가 아닌 수가 입력될 경우 에러가 반환됩니다.

`finally` 절은 무슨 일이 일어났든 관계없이 연산 시간 측정을 종료하기 적절한 곳입니다.

`fib` 함수가 에러 없이 정상적으로 실행되든 에러를 발생하든 상관없이, `finally`를 사용하면 연산 시간을 제대로 측정할 수 있습니다.

```js run
let num = +prompt("양의 정수를 입력해주세요.", 35)

let diff, result;

function fib(n) {
  if (n < 0 || Math.trunc(n) != n) {
    throw new Error("음수나 정수가 아닌 값은 처리할 수 없습니다.");
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

함수는 `return` 이나 `throw`를 만나면 종료되는데, `finally` 절은 이용하면 두 경우를 모두 실행됩니다.


```smart header="`try..catch..finally` 안의 변수는 지역 변수입니다."
위 예시에서 변수 `diff`와 `result`는 `try..catch` *전* 에 선언되었다는 점에 주의해 주세요.

`try` 블록 안에서 변수를 선언했다면, 블록 안에서만 유효한 지역 변수가 됩니다.
```

````smart header="`finally` 와 `return`"
`finally` 절은 `try..catch`절을 빠져나가는 *어떤* 경우에도 실행됩니다. `return`을 사용해 명시적으로 빠져나가려는 경우도 마찬가지 입니다.

아래 예시의 `try` 블록 안엔 `return`이 있습니다. 이 경우엔 값이 바깥 코드로 반환되기 전에 `finally`가 실행됩니다.

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

`catch` 절이 없는 `try..finally` 구문도 상황에 따라 유용하게 쓸 수 있습니다. `try..finally` 안에선 에러를 처리하고 싶지 않지만, 시작한 프로세스가 마무리되었는지 확실히 하고 싶은 경우에 사용합니다.

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
위 코드엔 `catch`가 없기 때문에 `try` 안에서 발생한 에러는 항상 밖으로 떨어져 나옵니다. 그러나 실행 흐름이 함수를 떠나기 전에 `finally`가 실행됩니다.
````

## 전역 catch

```warn header="호스트 환경을 확인하세요"
이 절은 코어 자바스크립트가 아닙니다.
```

`try..catch` 바깥에서 치명적인 에러가 발생해 스크립트가 죽었다고 상상해봅시다.

대처 방법은 무엇이 있을까요? 에러를 기록하거나 사용자에게 무언가를 보여주는 것 등을 할 수 있을 겁니다.

자바스크립트 명세에는 이런 치명적인 에러에 대응하는 방법이 적혀있지 않습니다. 하지만 `try..catch` 밖의 에러를 잡는 것은 아주 중요하기 때문에, 자바스크립트 호스트 환경 대다수는 에러 처리 기능을 제공합니다. Node.js의 [`process.on("uncaughtException")`](https://nodejs.org/api/process.html#process_event_uncaughtexception)이 그 예입니다. 브라우저 환경에선 [window.onerror](mdn:api/GlobalEventHandlers/onerror)를 이용해 에러를 처리합니다. window.onerror프로퍼티에 함수를 할당하면, 예상치 못한 에러가 발생했을 때 이 함수가 실행됩니다.

문법:

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

전역 핸들러 `window.onerror`를 죽어버린 스크립트를 복구하려는 목적으론 잘 사용하지 않습니다. 프로그래밍 에러가 발생한 경우 `window.onerror`만으로 스크립트를 복구하는 건 사실상 불가능 합니다. `window.onerror`는 개발자에게 에러 메시지를 보내는 용도로 사용합니다.

`window.onerror`말고  <https://errorception.com> 나 <http://www.muscula.com>같은 에러 로깅과 관련된 여러 가지 상용 서비스가 있습니다.

이런 서비스들은 다음과 같은 프로세스로 동작합니다.

1. 서비스를 가입하면 자바스크립트 파일(혹은 스크립트 url)을 받는데, 개발자는 이 파일을 페이지에 삽입합니다.
2. 받은 파일은 커스텀 `window.onerror` 함수를 설정합니다.
3. 에러가 발생하면, 이 커스텀 함수가 에러에 관한 내용을 담아 서비스에 네트워크 요청을 보냅니다.
4. 서비스 사이트에 로그인하고 기록된 에러를 봅니다.

## 요약

`try..catch`를 이용하면 런타임 에러를 처리할 수 있습니다. `try`에선 코드를 실행하고, 에러가 발생하면 `catch`에서 잡아냅니다.

문법은 다음과 같습니다.

```js
try {
  // 이곳의 코드를 실행
} catch(err) {
  // 에러가 발생하면, 여기부터 실행됨
  // err는 에러 객체
} finally {
  // 에러 발생 여부와 상관없이 try/catch 이후에 실행됨
}
```

`catch` 나 `finally`를 따로 다루는 절이 없는 걸 봐서, `try..catch`와 `try..finally`도 유효한 문법이란 걸 유추할 수 있습니다.

에러 객체엔 다음 프로퍼티가 있습니다.

- `message` -- 사람이 읽을 수 있는 형태의 에러 메시지
- `name` -- 에러 이름을 담은 문자열 (에러 생성자 이름)
- `stack` (표준이 아니지만 대부분의 호스트 환경이 지원함) -- 에러가 발생한 순간의 스택

에러 객체가 필요 없으면 이를 생략하여 `catch(err) {` 대신 `catch {`를 쓸 수 있습니다.

`throw` 연산자를 사용하면 에러를 직접 만들 수 있습니다. 이론상으론, `throw`의 인수에 모든 것이 가능하지만, 대게 내장 `Error` 클래스를 상속받은 에러 객체가 인수에 들어갑니다. 확장 에러에 대해선 다음 챕터에서 다루도록 하겠습니다.

*다시 던지기*는 에러 처리 시 사용되는 중요한 패턴입니다. `catch` 블록에선 대게, 예상하였거나 어떻게 다룰지 알고 있는 에러를 다루고, 예상치 못한 에러는 다시 던지기 합니다.

`try..catch`가 없어도 대부분의 호스트 환경이 '전역' 에러 핸들러를 지원해주기 때문에 '떨어져 나온' 에러를 잡을 수 있습니다. 브라우저의 전역 에러 핸들러는 `window.onerror`입니다.
