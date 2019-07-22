
# 오래된 "var"

[변수](info:variables)에 대한 첫 번째 장에서 변수를 선언하는 세 가지 방법을 배운 바 있습니다.

1. `let`
2. `const`
3. `var`

`let`과 `const`는 렉시컬 환경에서 정확히 같은 방식으로 동작합니다.

하지만 `var`는 괴물 같은 존재로, 두 변수와는 전혀 다른 방식으로 동작합니다. 초기 자바스크립트 구현 방식 때문이죠. 모던 스크립트에선 `var`를 만나긴 힘들겠지만, 이 괴물은 오래된 스크립트에 도사리고 있습니다.

구식의 스크립트를 다룰 계획이 없는 개발자라면 이 챕터를 건너뛰거나 학습을 미루려고 할 겁니다. 하지만 그랬다간 이 괴물에게 물릴 수 있습니다.

처음 `var`를 접했을 때는 `let`과 비슷하게 변수를 선언하는 것처럼 보일 겁니다.

```js run
function sayHi() {
  var phrase = "Hello"; // "let" 대신 "var"를 사용해 지역 변수를 선언 

  alert(phrase); // Hello
}

sayHi();

alert(phrase); // Error, phrase is not defined
```

하지만 `var`와 `let`은 차이가 있습니다.

## "var"는 블록 스코프가 없습니다.

<<<<<<< HEAD
`var`로 선언한 변수는 함수 스코프이거나 전역 스코프를 가집니다. 블록 스코프를 따르지 않습니다.
=======
Variables, declared with `var`, are either function-wide or global. They are visible through blocks.
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

예시:

```js run
if (true) {
  var test = true; // "let" 대신 "var"를 사용했습니다.
}

*!*
alert(test); // if 조건문이 끝났어도 변수에 여전히 접근할 수 있습니다.
*/!*
```

<<<<<<< HEAD
`var`는 코드 블록을 무시하기 때문에 `test`는 전역변수가 되어 코드 블럭 밖에서도 `test`에 접근할 수 있습니다.

두 번째 행에서 `var test`가 아닌 `let test`를 사용했다면, 변수 `test`는 `if` 안에서만 접근할 수 있었을 겁니다.
=======
As `var` ignores code blocks, we've got a global variable `test`.

If we used `let test` instead of `var test`, then the variable would only be visible inside `if`:
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

```js run
if (true) {
  let test = true; // use "let"
}

*!*
alert(test); // Error: test is not defined
*/!*
```

반복문에서도 `var`는 블록이나 루프 수준의 스코프를 형성하지 않습니다.

```js
for (var i = 0; i < 10; i++) {
  // ...
}

*!*
alert(i); // 10, 반복문이 종료되었지만 "i"는 전역 변수이므로 여전히 접근 가능합니다.
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
alert(phrase); // Error: phrase is not defined (Check the Developer Console)
```

위에서 살펴본 바와 같이, `var`는 `if`, `for` 등의 코드 블록을 관통합니다. 아주 오래전의 자바스크립트는 블록이 렉시컬 환경을 갖지 못했기 때문입니다. `var`는 구식 자바스크립트의 잔재이죠.

<<<<<<< HEAD
## "var" 는 함수 시작 시 처리됩니다.
=======
## "var" declarations are processed at the function start
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

`var`는 함수가 시작될 때 처리됩니다. 전역 변수라면 스크립트가 시작될 때 처리되죠. 

`var` 변수는 함수 내 어디서 정의되었나에 상관없이 함수 시작분에서 정의됩니다. 단, 변수가 중첩 함수 내에서 정의되지 않아야 이 규칙이 적용됩니다.

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

`var phrase`가 위로 이동되었어도 말이죠.

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

이렇게 변수가 끌어올려 지는(raising) 현상을 "호이스팅(hoisting)"이라고 부릅니다. `var`로 선언한 모든 변수가 함수의 최상위로 "끌어 올려지기(hoisted)" 때문입니다.

바로 위 예제에서 `if (false)` 블록 안 코드는 절대 실행되지 않지만, 이는 호이스팅에 전혀 영향을 미치지 않습니다. `if` 내부의 `var` 는 함수 `sayHi`의 시작 부분에서 처리되므로, `(*)`로 표시한 줄에서 변수는 존재하죠.

**선언은 호이스팅 되지만 할당은 호이스팅 되지 않습니다.**

예제를 통해 이에 대해 알아보도록 합시다.

```js run
function sayHi() {
  alert(phrase);  

*!*
  var phrase = "Hello";
*/!*
}

sayHi();
```

`var phrase = "Hello"`행에선 두 가지 동작이 일어납니다.

1. `var`를 통한 변수 선언. 
2. `=`를 통한 할당.

함수 실행이 시작되면 변수 선언("호이스팅")이 처리되지만, 할당은 할당을 한 바로 그곳에서 처리됩니다. 따라서 위 예제는 아래 코드처럼 동작하죠.

```js run
function sayHi() {
*!*
  var phrase; // 선언은 함수 시작 시 처리됩니다.
*/!*

  alert(phrase); // undefined

*!*
  phrase = "Hello"; // 할당은 실행 흐름이 이곳에 도달했을 때 처리됩니다.
*/!*
}

sayHi();
```

이처럼 모든 `var` 선언은 함수 시작 시 처리되기 때문에, `var`로 선언한 변수는 어디서든 참조할 수 있습니다. 하지만 변수에 무언갈 할당하기 전까진 undefined입니다.

바로 위의 두 예제에서 `alert`는 오류 없이 실행됩니다. 변수 `phrase`가 선언된 상태이기 때문입니다. 그러나 값을 할당하지 않았기 때문에 `undefined`가 출력됩니다.

## 요약

<<<<<<< HEAD
`var`로 선언한 변수는 두 가지 주요한 특성을 보입니다.

1. 블록 스코프를 갖지 않고, 최소 함수 수준 스코프를 갖습니다.
2. 선언이 함수가 시작될 때 처리됩니다.
=======
There are two main differences of `var` compared to `let/const`:

1. `var` variables have no block scope, they are visible minimum at the function level.
2. `var` declarations are processed at function start (script start for globals).
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

이 외에도 전역 객체와 관련된 특성 하나가 더 있는데, 이에 대해선 다음 챕터에서 다루도록 하겠습니다.

<<<<<<< HEAD
이러한 `var`만의 특성은 대부분의 상황에서 좋지 않은 부작용을 낳습니다. 변수는 블록 레벨에서 처리돼야 좋죠. 이런 이유 때문에 `let`이 표준에 도입된 것입니다. 이제는 `let`과 `const`를 이용해 변수를 선언하는 게 대세입니다.
=======
These differences make `var` worse than `let` most of the time. Block-level variables is such a great thing. That's why `let` was introduced in the standard long ago, and is now a major way (along with `const`) to declare a variable.
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3
