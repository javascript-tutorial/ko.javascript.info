
# 오래된 'var'

```smart header="오래된 스크립트를 읽는 데 도움을 주는 글입니다."
이번 주제에선 작성된 지 오래된 스크립트를 읽는 데 도움을 줄 만한 내용을 다룹니다. 

새로운 코드를 작성할 때는 이 방법을 쓰시면 안 됩니다.
```

[변수](info:variables)를 다룬 첫 번째 장에서 변수 선언 방법 세 가지를 배운 바 있습니다.

1. `let`
2. `const`
3. `var`

`var`로 선언한 변수는 `let`으로 선언한 변수와 유사합니다. 대부분의 경우에 `let`을 `var`로, `var`를 `let`으로 바꿔도 큰 문제 없이 동작합니다.

```js run
var message = "안녕하세요.";
alert(message); // 안녕하세요.
```

하지만 `var`는 초기 자바스크립트 구현 방식 때문에 `let`과 `const`로 선언한 변수와는 다른 방식으로 동작합니다. 근래엔 `var`를 쓰지 않아서 이를 만나는 건 흔치 않은 일이지만, `var`는 오래된 스크립트에서 당신을 기다리고 있는 괴물 같은 존재입니다.

구식 스크립트를 다룰 계획이 없는 개발자라면 이 챕터를 건너뛰거나 학습을 미루려고 할 겁니다. 

하지만 그랬다간 이 괴물에게 물릴 수 있습니다. 특히 `var`를 사용하는 오래된 스크립트를 `let`로 바꿀 때 `var`에 대해 제대로 알아두어야 합니다. 그렇지 않으면 예상치 못한 에러를 만날 수 있습니다.

## 'var'는 블록 스코프가 없습니다.

`var`로 선언한 변수의 스코프는 함수 스코프이거나 전역 스코프입니다. 블록 기준으로 스코프가 생기지 않기 때문에 블록 밖에서 접근 가능합니다.

예시:

```js run
if (true) {
  var test = true; // 'let' 대신 'var'를 사용했습니다.
}

*!*
alert(test); // true(if 문이 끝났어도 변수에 여전히 접근할 수 있음)
*/!*
```

`var`는 코드 블록을 무시하기 때문에 `test`는 전역 변수가 됩니다. 전역 스코프에서 이 변수에 접근할 수 있죠.

두 번째 행에서 `var test`가 아닌 `let test`를 사용했다면, 변수 `test`는 `if`문 안에서만 접근할 수 있습니다.

```js run
if (true) {
  let test = true; // 'let'으로 변수를 선언함
}

*!*
alert(test); // Error: test is not defined
*/!*
```

반복문에서도 유사한 일이 일어납니다. `var`는 블록이나 루프 수준의 스코프를 형성하지 않기 때문이죠.

```js
for (var i = 0; i < 10; i++) {
  // ...
}

*!*
alert(i); // 10, 반복문이 종료되었지만 'i'는 전역 변수이므로 여전히 접근 가능합니다.
*/!*
```

코드 블록이 함수 안에 있다면, `var`는 함수 레벨 변수가 됩니다.

```js run
function sayHi() {
  if (true) {
    var phrase = "Hello";
  }

  alert(phrase); // 제대로 출력됩니다.
}

sayHi();
alert(phrase); // Error: phrase is not defined
```

위에서 살펴본 바와 같이, `var`는 `if`, `for` 등의 코드 블록을 관통합니다. 아주 오래전의 자바스크립트에선 블록 수준 렉시컬 환경이 만들어 지지 않았기 때문입니다. `var`는 구식 자바스크립트의 잔재이죠.

## "var" tolerates redeclarations

If we declare the same variable with `let` twice in the same scope, that's an error:

```js run
let user;
let user; // SyntaxError: 'user' has already been declared
```

With `var`, we can redeclare a variable any number of times. If we use `var` with an already-declared variable, it's just ignored:

```js run
var user = "Pete";

var user = "John"; // this "var" does nothing (already declared)
// ...it doesn't trigger an error

alert(user); // John
```

## 선언하기 전 사용할 수 있는 'var'

`var` 선언은 함수가 시작될 때 처리됩니다. 전역에서 선언한 변수라면 스크립트가 시작될 때 처리되죠.

함수 본문 내에서 `var`로 선언한 변수는 선언 위치와 상관없이 함수 본문이 시작되는 지점에서 정의됩니다(단, 변수가 중첩 함수 내에서 정의되지 않아야 이 규칙이 적용됩니다).

따라서 아래 두 예제는 동일하게 동작합니다.

```js run
function sayHi() {
  phrase = "Hello";

  alert(phrase);

*!*
  var phrase;
*/!*
}
sayHi();
```

`var phrase`가 위로 이동한 것처럼 말이죠.

```js run
function sayHi() {
*!*
  var phrase;
*/!*

  phrase = "Hello";

  alert(phrase);
}
sayHi();
```

코드 블록은 무시되기 때문에, 아래 코드 역시 동일하게 동작합니다.

```js run
function sayHi() {
  phrase = "Hello"; // (*)

  *!*
  if (false) {
    var phrase;
  }
  */!*

  alert(phrase);
}
sayHi();
```

이렇게 변수가 끌어올려 지는 현상을 '호이스팅(hoisting)'이라고 부릅니다. `var`로 선언한 모든 변수는 함수의 최상위로 '끌어 올려지기(hoisted)' 때문입니다(*hoist*는 끌어올리다 라는 뜻이 있습니다. -- 옮긴이).

바로 위 예제에서 `if (false)` 블록 안 코드는 절대 실행되지 않지만, 이는 호이스팅에 전혀 영향을 주지 않습니다. `if` 내부의 `var` 는 함수 `sayHi`의 시작 부분에서 처리되므로 `(*)`로 표시한 줄에서 `phrase`는 이미 정의가 된 상태인 것이죠.

**선언은 호이스팅 되지만 할당은 호이스팅 되지 않습니다.**

예시를 통해 살펴봅시다.

```js run
function sayHi() {
  alert(phrase);  

*!*
  var phrase = "Hello";
*/!*
}

sayHi();
```

`var phrase = "Hello"`행에선 두 가지 일이 일어납니다.

1. 변수 선언(`var`) 
2. 변수에 값을 할당(`=`)

변수 선언은 함수 실행이 시작될 때 처리되지만(호이스팅) 할당은 호이스팅 되지 않기 때문에 할당 관련 코드에서 처리됩니다. 따라서 위 예제는 아래 코드처럼 동작하게 됩니다.

```js run
function sayHi() {
*!*
  var phrase; // 선언은 함수 시작 시 처리됩니다.
*/!*

  alert(phrase); // undefined

*!*
  phrase = "Hello"; // 할당은 실행 흐름이 해당 코드에 도달했을 때 처리됩니다.
*/!*
}

sayHi();
```

이처럼 모든 `var` 선언은 함수 시작 시 처리되기 때문에, `var`로 선언한 변수는 어디서든 참조할 수 있습니다. 하지만 변수에 무언가를 할당하기 전까진 값이 undefined이죠.

바로 위의 두 예시에서 `alert`를 호출하기 전에 변수 `phrase`는 선언이 끝난 상태이기 때문에 에러 없이 얼럿 창이 뜹니다. 그러나 값이 할당되기 전이기 때문에 얼럿 창엔 `undefined`가 출력되죠.

### 즉시 실행 함수 표현식

과거엔 `var`만 사용할 수 있었습니다. 그런데 `var`의 스코프는 블록 레벨 수준이 아니죠. 개발자들은 `var`도 블록 레벨 스코프를 가질 수 있게 여러가지 방안을 고려하게 됩니다. 이때 만들어진 것이 '즉시 실행 함수 표현식(immediately-invoked function expressions)'입니다. 즉시 실행 함수 표현식은 `IIFE`라고 부르기도 합니다.

즉시 실행 함수 표현식을 요즘에는 자주 쓰지 않습니다. 하지만 오래된 스크립트에서 만날 수 있기 때문에 즉시 실행 함수 표현식이 무엇인지 알아 둘 필요가 있습니다.

IIFE는 다음과 같이 생겼습니다.

```js run
(function() {

  let message = "Hello";

  alert(message); // Hello

})();
```

함수 표현식이 만들어지고 바로 호출되면서, 해당 함수가 바로 실행되었습니다. 이 함수는 자신만의 변수를 갖고있네요.

즉시 실행 함수를 만들 땐, 함수 표현식을 괄호로 둘러쌓아 (function {...})와 같은 형태로 만듭니다. 이렇게 괄호로 둘러싸지 않으면 에러가 발생합니다. 자바스크립트는 'function'이라는 키워드를 만나면 함수 선언문이 시작될 것이라 예상합니다. 그런데 함수 선언문으로 함수를 만들 땐 반드시 함수의 이름이 있어야 합니다. 따라서 아래와 예시를 실행하면 에러가 발생합니다.

```js run
// 함수를 선언과 동시에 실행하려고 함
function() { // <-- Error: Function statements require a function name

  let message = "Hello";

  alert(message); // Hello

}();
```

"그럼 이름을 넣으면 되는 거 아닌가?"라고 생각해 이름을 넣어도 에러가 발생합니다. 자바스크립트는 함수 선언문으로 정의한 함수를 정의와 동시에 바로 호출하는 것을 허용하지 않기 때문입니다.

```js run
// 맨 아래의 괄호 때문에 문법 에러가 발생합니다.
function go() {

}(); // <-- 함수 선언문은 선언 즉시 호출할 수 없습니다.
```

함수를 괄호로 감싸면 자바스크립트가 함수를 함수 선언문이 아닌 표현식으로 인식하도록 속일 수 있습니다. 함수 표현식은 이름이 없어도 괜찮고, 즉시 호출도 가능합니다.

괄호를 사용하는 방법 말고도, 자바스크립트가 함수 표현식이라고 인식하게 해주는 다른 방법들이 있습니다.

```js run
// IIFE를 만드는 방법

(function() {
  alert("함수를 괄호로 둘러싸기");
}*!*)*/!*();

(function() {
  alert("전체를 괄호로 둘러싸기");
}()*!*)*/!*;

*!*!*/!*function() {
  alert("표현식 앞에 비트 NOT 연산자 붙이기");
}();

*!*+*/!*function() {
  alert("표현식 앞에 단항 덧셈 연산자 붙이기");
}();
```

위와 같은 방법을 사용하면 함수 표현식처럼 인식되어 바로 실행이 가능합니다. 그런데 모던 자바스크립트에선 이렇게 코드를 작성할 필요가 없습니다.

## 요약

`var`로 선언한 변수는 `let`이나 `const`로 선언한 변수와 다른 두 가지 주요한 특성을 보입니다.

1. `var`로 선언한 변수는 블록 스코프가 아닌 함수 수준 스코프를 갖습니다.
2. `var` 선언은 함수가 시작되는 시점(전역 공간에선 스크립트가 시작되는 시점)에서 처리됩니다.

이 외에도 전역 객체와 관련된 특성 하나가 더 있는데, 이에 대해선 다음 챕터에서 다루도록 하겠습니다.

`var`만의 특성은 대부분의 상황에서 좋지 않은 부작용을 만들어냅니다. `let`이 표준에 도입된 이유가 바로 이런 부작용을 없애기 위해서입니다. 변수는 블록 레벨 스코프를 갖는 게 좋으므로 이제는 `let`과 `const`를 이용해 변수를 선언하는 게 대세가 되었습니다.
