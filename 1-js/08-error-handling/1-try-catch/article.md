# "try..catch"로 에러 핸들링(Error handling) 

아무리 프로그래밍에 능한 사람이더라도, 에러가 있는 스크립트를 작성할 수 있습니다. 원인은 아마도 실수, 예상치 못한 사용자 입력, 잘못된 서버 응답, 그 밖에 수천만 가지 다른 이유 때문일 것입니다.

에러가 발생하면 스크립트는 "죽고" (즉시 중단되고), 콘솔에 에러가 출력됩니다.

그러나 `try..catch` 문법을 사용하면, 스크립트가 죽는 걸 방지하고 에러를 "잡아서" 더 합당한 무언가를 할 수 있게 됩니다.

## "try..catch" 문법

'try..catch' 구문에는 두 개의 주요 블록이 있습니다: 'try'와 'catch'입니다.

```js
try {

  // 코드...

} catch (err) {

  // 에러 핸들링

}
```

'try..catch' 는 다음처럼 동작합니다.

1. 먼저, `try {...}` 안의 코드를 실행합니다.
2. 만약 에러가 없다면, `catch(err)` 블록은 무시됩니다: `try`의 안의 마지막 줄까지 실행되고, `catch`블록은 건너뜁니다.
3. 만약 에러가 있으면, `try` 안의 코드는 실행이 중단되고, `catch(err)` 블록의 첫 부분으로 넘어갑니다. `err` 변수(아무 이름이나 사용 가능)는 무슨 일이 일어났는지를 상세히 설명하는 에러 객체를 포함합니다.

![](try-catch-flow.png)

따라서, `try {…}` 블록에 에러가 있는 코드가 있더라도 스크립트는 죽지 않습니다: `catch`에서 에러를 다룰 기회가 생깁니다.

예제를 좀 더 봅시다.

- 아래는 에러가 없는 예제로, `(1)`과 `(2)`를 `alert` 창에 보여줍니다.

    ```js run
    try {

      alert('try 블록 시작');  // *!*(1) <--*/!*

      // ...에러가 없습니다.

      alert('try 블록 끝');   // *!*(2) <--*/!*

    } catch(err) {

      alert('에러가 없으므로, catch는 무시되었습니다.'); // (3)

    }

    alert("...실행이 계속됩니다");
    ```
- 아래는, 에러가 있는 예제로, `(1)`과 `(3)`을 보여줍니다.

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

    alert("...실행이 계속됩니다");
    ```


````warn header="`try..catch`는 오직 런타임 에러에만 유효합니다"
`try..catch`가 동작하려면, 코드가 실행 가능해야 합니다. 다시 말하면, 유효한 자바스크립트여야 합니다.

중괄호 짝이 안 맞는 것처럼 코드가 문법적으로 틀린 경우, try..catch는 동작하지 않습니다:

```js run
try {
  {{{{{{{{{{{{
} catch(e) {
  alert("유효하지 않은 코드이기 때문에, 자바스크립트 엔진은 이 코드를 이해할 수 없습니다.");
}
```

자바스크립트 엔진(JavaScript engine)은 코드를 먼저 읽고 난 다음, 코드를 실행합니다. 구문을 읽는(parse) 중에 발생하는 에러는 "parse-time" 에러라고 부르며, (그 코드 안에서는) 복구할 수 없습니다. 엔진이 코드를 이해할 수 없기 때문입니다.

따라서, `try..catch`는 유효한 코드에서 발생하는 에러만 처리할 수 있습니다. 이런 에러들을 "런타임 에러"라고 부르며 가끔은 "예외"라고 불릴 때도 있습니다.
````


````warn header="`try..catch`는 동기적으로 동작합니다"
setTimeout처럼 "스케줄 된(scheduled)" 코드에서 발생한 예외는 `try..catch`에서 잡아낼 수 없습니다.

```js run
try {
  setTimeout(function() {
    noSuchVariable; // 스크립트는 여기서 죽을 것입니다
  }, 1000);
} catch (e) {
  alert( "작동 멈춤" );
}
```

왜냐하면 `try..catch`가 함수의 실행 시간을 조정하는 `setTimeout` 호출을 감싸고 있기 때문입니다. setTimeout 함수는 엔진이 `try..catch` 구문을 떠난 후에나 실행됩니다.

스케줄 된 함수 내부의 예외를 잡고 싶다면, `try..catch`를 함수 내부에 둡시다:

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

## 에러 객체(Error object)

자바스크립트는 에러가 발생하면, 에러의 상세내용을 포함한 객체를 생성합니다. 이 객체는 `catch` 블록에 인수로 전달됩니다:

```js
try {
  // ...
} catch(err) { // <-- "에러 객체", err 대신 다른 이름으로 쓸 수 있음
  // ...
}
```

모든 내장 에러에 대해서, `catch` 블록에 전달된 에러 객체는 두 주요 프로퍼티(property)을 가집니다.

`name`
: 에러 이름. 정의되지 않은 변수에 대해서는 `"ReferenceError"`.

`message`
: 에러의 상세 내용을 담고 있는 문자 메시지.

그 밖에 대부분의 자바스크립트 환경에서 사용 가능한 비표준 프로퍼티도 있습니다. 가장 널리 사용되고 지원되는 프로퍼티는 `stack`입니다:

`stack`
: 현재 호출 스택: 에러로 이어지는 중첩 호출의 순서에 대한 정보를 가진 문자열. 디버깅 목적으로 사용.

예시:

```js run untrusted
try {
*!*
  lalala; // 에러, 변수가 정의되지 않음!
*/!*
} catch(err) {
  alert(err.name); // ReferenceError
  alert(err.message); // lalala is not defined
  alert(err.stack); // ReferenceError: lalala is not defined at ...

  // 에러 전체를 보여줄수도 있습니다
  // 에러는 "name: message" 형태의 문자열로 변환됩니다
  alert(err); // ReferenceError: lalala is not defined
}
```


## "try..catch" 사용하기

`try..catch`의 실제 사례를 살펴봅시다.

이미 알고 있듯이, 자바스크립트는 JSON으로 인코딩(encode)된 값을 읽을 수 있는 [JSON.parse(str)](mdn:js/JSON/parse) 메서드를 지원합니다.

이 메서드는 주로 서버 또는 다른 출처로부터 네트워크를 통해 전달받은 데이터를 디코딩(decode)하는데 사용됩니다.

전달된 데이터에 `JSON.parse`을 호출해 봅시다:

```js run
let json = '{"name":"John", "age": 30}'; // 서버로부터 전달받은 데이터

*!*
let user = JSON.parse(json); // 전달받은 문자열을 자바스크립트 객체로 변환
*/!*

// 문자열로 전달받은 user가 프로퍼티를 가진 user 객체가 됨
alert( user.name ); // John
alert( user.age );  // 30
```

JSON에 관한 자세한 정보는 <info:json> 주제에서 찾을 수 있습니다.

**문법에 맞지 않는 `json`이 사용되면, `JSON.parse`에서 에러가 발생하고, 스크립트는 "죽습니다".**

스크립트가 죽는 것에 만족해야 할까요? 당연히 아니죠!

전달받은 데이터가 잘못되어서 스크립트가 죽어버리면, 방문자는 (개발자 콘솔을 열지 않는 이상)이 상황이 잘못된 데이터 때문이란 걸 절대 알 수 없습니다. 그리고 사람들은 에러 메시지 없이 무언가가 "그냥 죽는" 것을 좋아하지 않습니다.

`try..catch`를 사용하여 이 에러를 처리해 봅시다.

```js run
let json = "{ bad json }";

try {

*!*
  let user = JSON.parse(json); // <-- 여기서 에러가 발생하면...
*/!*
  alert( user.name ); // 이 코드는 작동하지 않고

} catch (e) {
*!*
  // ...바로 catch문으로 넘어옵니다
  alert( "데이터에 에러가 있어 재요청을 시도하겠습니다." );
  alert( e.name );
  alert( e.message );
*/!*
}
```

위 예시에선 에러가 발생했다는 걸 단순히 보여주기 위해 `catch` 블록을 사용했지만, catch 블록 안에서 더 많은 일을 할 수 있습니다. 네트워크 요청 보내기, 사용자에게 대안 제안하기, 에러 정보를 로깅 장치에 보내기 등 말이죠. 이 모든 것들이 스크립트가 그냥 죽는 것보다 훨씬 나은 대응입니다.

## 자체 에러 던지기

만약 `json`이 문법적으로 정확하지만, 필수 프로퍼티인 `name`이 없다면 어떻게 될까요?

다음처럼 말이죠:

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

여기에서 `JSON.parse` 는 정상적으로 동작하지만, `name`의 부재는 우리에게는 실제로 에러입니다.

`throw` 연산자를 사용해 에러 처리를 통합할 필요가 있습니다.

### "Throw" 연산자

`throw` 연산자는 에러를 생성합니다.

문법은 다음과 같습니다:

```js
throw <error object>
```

이론적으로는 아무것이나 에러 객체로 사용할 수 있습니다. 심지어 숫자, 문자열 같은 원시 타입도 허용됩니다. 하지만 객체를 사용하는 것이 좋고, 되도록 (내장 에러와의 호환을 위해) `name`과 `message` 프로퍼티와 함께 사용하길 권장합니다.

자바스크립트는 표준 에러를 위한 `Error`, `SyntaxError`, `ReferenceError`, `TypeError`등의 다양한 내장 생성자를 지원합니다. 에러 객체를 생성하는데 이들을 사용할 수 있습니다.

문법은 이렇습니다:

```js
let error = new Error(message);
// or
let error = new SyntaxError(message);
let error = new ReferenceError(message);
// ...
```

(일반 객체가 아닌 에러 객체의) 내장 에러에서, `name` 프로퍼티는 생성자의 이름과 동일합니다. `message`는 인수에서 가져옵니다.

예:

```js run
let error = new Error("Things happen o_O");

alert(error.name); // Error
alert(error.message); // Things happen o_O
```

`JSON.parse`가 어떤 종류의 에러를 만들어내는지 봅시다.

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

사용자를 나타내는 객체에 `name`프로퍼티는 있어야 하므로, `name`의 부재를 syntax error로 처리해 봅시다.

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

`(*)`로 표시한 줄에서 사용된 `throw` 연산자는 전달받은 `message`로 `SyntaxError`를 생성합니다. 이렇게 생성한 커스텀 에러는 자바스크립트가 자체적으로 에러를 생성하는 방식과 동일하게 생성됩니다. 에러가 발생했으므로 `try`의 실행은 즉시 중단되고 이제 제어 흐름은 `catch`로 넘어갑니다.

이제 모든 에러를 `catch` 블록 안에서 처리할 수 있게 되었습니다. `JSON.parse`에서 발생한 에러와 다른 모든 경우를 말이죠.

## 다시 던지기(Rethrowing)

지금까지 불완전한 데이터를 `try..catch`를 사용해 처리해 보았습니다. 그런데 *또 다른 예기치 않은 에러*가 `try {...}` 블록 안에서 발생하는 것이 가능할까요? "불완전한 데이터" 이외에, 정의하지 않은 변수를 사용하려는 경우같이 말이죠.

다음처럼요:

```js run
let json = '{ "age": 30 }'; // 불완전한 데이터

try {
  user = JSON.parse(json); // <-- user 앞에 let을 쓰지 않음

  // ...
} catch(err) {
  alert("JSON Error: " + err); // JSON Error: ReferenceError: user is not defined
  // (no JSON Error actually)
}
```

프로그래머는 실수를 하기 떄문에, 어떤 에러든 발생할 수 있습니다! 몇십 년간 몇백만 명이 사용한 오픈소스 유틸리티에서도 조차 실수가 발견됩니다 -- 끔찍한 해킹으로 이어질 수 있는 엄청난 버그가 갑자기 발견될 수 있습니다(실제 `ssh` 툴에서도 벌어진 일입니다).

여기서 사용된 예제는 "불완전한 데이터"를 잡기 위해 `try..catch`를 썼습니다. 하지만 `catch`는 근본적으로 `try` 블록에서 발생한 *모든* 에러들을 잡습니다. 위 코드에서 catch는 에러를 잡아냈지만, 발생한 에러의 종류에 관계 없이 "JSON Error"메시지를 보여줍니다. 이렇게 에러 종류와 관계없이 동일한 방식으로 에러를 처리하는 디버깅 방법은 잘못된 것이며, 디버깅을 어렵게 만듭니다.

다행히도, 발생한 에러가 어떤 타입인지 알아낼 방법이 있습니다. `name` 프로퍼티를 사용해서 말이죠.

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

**Catch는 타입을 알고 있는 에러만 처리하고, 나머지 에러는 모두 "다시 던집니다."**

"다시 던지기" 기술을 더 자세히 설명하면:

1. Catch는 모든 에러를 잡습니다.
2. `catch(err) {...}` 블록에서 `err` 객체를 분석합니다.
2. 에러를 어떻게 처리할지 모르는 경우는 `throw err`로 처리합니다.

아래는, 다시 던지기를 사용하여 `catch`는 `SyntaxError`만 처리하도록 했습니다.

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

`catch` 블록 안의 `(*)`로 표시된 줄에서 다시 던져진(rethrow) 에러는, `try..catch`문 "밖으로 던져져" 스크립트를 죽입니다. 또는, 바깥쪽 `try..catch`(가 존재한다면 여기)에서 처리됩니다.

이런 식으로 구현하게 되면 `catch` 블록에선 실제로 어떻게 다룰지 알고 있는 에러들만 처리할 수 있습니다. 알 수 없는 에러는 "건너뜁니다".

아래 예제는 `try..catch`를 한 레벨 더 만들어, 예상치 못한 에러를 처리해 줍니다:

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

여기에서 `readData`는 `SyntaxError`만 처리하고, 예상치 못한 에러는 함수 바깥의 `try..catch`에서 처리됩니다.

## try..catch..finally

잠깐만요, 이게 다가 아닙니다.

`try..catch`는 `finally`라는 코드 절을 하나 더 가질 수 있습니다.

finally 절은, 아래의 두 경우에 모두 실행됩니다.

- 에러가 없는 경우, `try` 후에,
- 에러가 있는 경우, `catch` 뒤에.

finally를 사용해 try..catch 를 확장하면 다음과 같습니다:

```js
*!*try*/!* {
   ... 코드를 실행 ...
} *!*catch*/!*(e) {
   ... 에러 핸들링 ...
} *!*finally*/!* {
   ... 항상 실행 ...
}
```

아래 코드를 실행해보세요:

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

위 코드의 실행 경로는 두 가지입니다:

1. "Make an error?"에 "Yes"로 답하면, `try -> catch -> finally`.
2. "No"로 하면, `try -> finally`.

`finally` 절은 `try..catch` 전에 무언가를 시작하고 그것을 결과에 상관없이 완료하고 싶을 경우 사용됩니다.

예를 들어, 피보나치 함수 `fib(n)`의 연산 시간을 측정하고 싶다고 해 봅시다. 함수 실행 전에 측정을 시작해서 실행이 끝난 후 측정을 종료하는 방법이 자연스레 떠올랐을 겁니다. 
그런데 만약 함수 실행 도중 에러가 발생하면 어떻게 될까요? 아래 코드의 함수 `fib(n)`는 음수나 정수가 아닌 수가 입력될 경우 에러가 리턴됩니다.

`finally` 절은 연산 시간 측정을 종료하기 좋은 장소입니다.

`fib` 함수가 에러 없이 정상적으로 실행되든, 에러를 발생하든 상관없이, `finally`를 사용하면 연산 시간을 제대로 측정할 수 있습니다.

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

alert( `연산 시간 ${diff}ms` );
```

코드를 실행하고 `35`를 `프롬프트(prompt) 대화상자`에 입력하면 `try` 다음에 `finally`가 정상적으로 실행되면서 연산 시간을 확인할 수 있습니다. `-1`를 입력하면 에러가 발생하고, 연산 시간은 `0ms`가 됩니다. 두 경우 모두 연산 시간이 정상적으로 측정되었습니다.

한편, 자바스크립트에서 함수를 빠져나가는 방법은 `return` 또는 `throw`가 있는데, `finally` 절을 이용하면 두 경우를 모두 처리할 수 있습니다.

```smart header="`try..catch..finally` 안의 변수는 로컬 변수입니다"
위의 코드에서 `result`와 `diff` 변수는 `try..catch` *이전*에 선언되었다는 사실에 주의하세요.

만약 `{...}` 블록 안에서 `let`을 사용해 변수를 선언했다면, 블록 안에서만 유효한 지역변수가 됩니다.
```

````smart header="`finally` 와 `return`"
`finally` 절은 `try..catch`절을 빠져나가는 *어떤* 경우에도 실행됩니다. `return`을 사용해 명시적으로 빠져나가려는 경우에도 실행됩니다.

아래 코드의 `try`블록 안엔 `return`문이 있습니다. 이 경우에도, `finally`는 실행되고, `try..catch`절 바깥의 코드는 그 이후 실행됩니다.

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

alert( func() ); // finally 안의 alert가 실행되고 난 후 이 라인이 실행됨
```
````

````smart header="`try..finally`"

`catch` 절이 없는 `try..finally` 구문도 유용합니다. 당장은 에러를 처리하고 싶지 않지만, 시작한 프로세스가 마무리되었는지 확실히 하고 싶은 경우에 사용합니다.
오
```js
function func() {
  // 측정과 같이 끝맺음이 있어야 하는 프로세스 시작
  try {
    // ...
  } finally {
    // 스크립트가 죽더라도 완료시킴
  }
}
```
위의 코드에서는, `try` 안의 에러는 `catch`가 없기 때문에, 항상 밖으로 떨어져 나옵니다. 그러나 실행 흐름이 바깥으로 나가기 전에 `finally`가 실행됩니다.
````

## 전역(Global) catch

```warn header="개발 환경을 확인하세요"
이 절의 내용은 코어 자바스크립트 내용이 아닙니다.
```

프로그래밍 에러 등 때문에 생긴 치명적인 에러가 `try..catch` 바깥에 있어서 스크립트가 죽었다고 상상해봅시다.

이런 상황은 어떻게 대처할까요? 에러를 기록하거나, (사용자는 보통, 에러 메시지를 보진 않지만) 무언가를 보여주는 걸 할 수 있겠죠.

명세에는 이런 치명적인 에러에 대응하는 방법은 적혀있지 않습니다. 하지만 try..catch 밖의 에러를 잡는 기능은 아주 유용하게 사용되기 때문에, 자바스크립트 환경에선 이 기능을 제공합니다. Node.JS의 [process.on('uncaughtException')](https://nodejs.org/api/process.html#process_event_uncaughtexception)이 그 예입니다. 브라우저 환경에선 [window.onerror](mdn:api/GlobalEventHandlers/onerror) 프로퍼티에 함수를 할당해 에러를 처리합니다. try..catrh 블록에서 잡히지 않은 에러가 있는 경우, 이 함수가 호출됩니다.

문법은 이렇습니다.

```js
window.onerror = function(message, url, line, col, error) {
  // ...
};
```

`message`
: 에러 메시지.

`url`
: 에러가 발생한 스크립트의 URL.

`line`, `col`
: 에러가 발생한 줄과 열 번호.

`error`
: 에러 객체.

예시:

```html run untrusted refresh height=1
<script>
*!*
  window.onerror = function(message, url, line, col, error) {
    alert(`${message}\n At ${line}:${col} of ${url}`);
  };
*/!*

  function readData() {
    badFunc(); // 아이고, 뭔가 잘못됐군요!
  }

  readData();
</script>
```

전역 핸들러 `window.onerror`는 죽어버린 스크립트를 복구하려는 목적으로 사용하지 않습니다. 프로그래밍 에러가 발생한 경우 `window.onerror`만으로 스크립트를 복구하는 건 불가능 할 겁니다. `window.onerror`는 개발자에게 에러 메시지를 보낼 때 사용합니다.

전역 핸들러 이외에도 에러를 기록(로깅)하게 해주는 여러 가지 웹 서비스가 있습니다. <https://errorception.com> 나 <http://www.muscula.com>처럼 말이죠.

이런 웹 서비스는 다음과 같이 작동합니다.

1. 서비스에 등록하고, 제공받은 JS 코드 조각 (또는 스크립트 URL)을 페이지에 삽입합니다.
2. 그 JS 스크립트에는 커스텀 `window.onerror` 함수가 있습니다.
3. 에러가 발생하면, 에러와 관련된 네트워크 요청을 서비스로 보냅니다.
4. 서비스 웹 인터페이스에 로그인하고 기록된 에러를 봅니다.

## 요약

`try..catch`로 런타임 에러를 처리할 수 있습니다. 코드가 실행되고, 실행 도중 발생할 수 있는 에러는 `try..catch`에서 잡을 수 있습니다.

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

`catch` 나 `finally`를 따로 다루는 절이 없는 걸 봐서, `try..catch`와 `try..finally`만 문법적으로 유효하다는 걸 알 수 있습니다.

에러 객체엔 다음 프로퍼티가 있습니다.

- `message` -- 사람이 읽을 수 있는 형태의 에러 메시지.
- `name` -- 에러 이름을 담은 문자열 (에러 생성자 이름).
- `stack` (표준 아님) -- 에러가 생성되는 순간의 스택.

`throw` 연산자를 사용하면 커스텀 에러를 만들 수 있습니다. 이론상으론, `throw`의 인수로 아무것이나 가능하지만, 대게 내장 `Error` 클래스에서 상속받은 에러 객체를 인수에 넣습니다. 다음 주제에서 확장 에러를 다루도록 하겠습니다.

다시 던지기(Rethrowing)는 에러 처리의 기본 패턴입니다: `catch` 블록에선 대게, 예상하였거나 어떻게 다룰지 알고 있는 에러를 다루기 때문에, 예상치 못한 에러는 다시 던지기를 통해 다뤄야 합니다. 

대다수의 자바스크립트 환경에서는 `try..catch` 없이도 사용할 수 있는 "전역" 에러 핸들러가 있습니다. 이 핸들러에서 "떨어져 나온" 에러를 다루게 됩니다. 브라우저에 환경의 전역 에러 핸들러는 `window.onerror`입니다.