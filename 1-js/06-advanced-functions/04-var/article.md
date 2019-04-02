
# The old "var"

첫 번째 장에서 [variables](info:variables), 변수 선언의 세 가지 방법을 언급했습니다.

1. `let`
2. `const`
3. `var`

`let`과`const`는 어휘 환경에서 정확히 같은 방식으로 행동합니다.

하지만 `var`는 매우 다른 동물입니다. 아주 오래 전부터 시작된 동물입니다. 일반적으로 현대 스크립트에는 사용되지 않지만 이전 스크립트에는 여전히 숨어 있습니다.

그러한 스크립트를 만날 계획이 없다면이 장을 건너 뛰거나 연기 할 수도 있습니다. 그렇지만 나중에 다시 물릴 기회가 있습니다.

첫눈에 반해 `var`는 `let`과 비슷한 동작을합니다. 즉, 변수를 선언합니다.

```js run
function sayHi() {
  var phrase = "Hello"; // 지역 변수, "let"대신 "var"

  alert(phrase); // Hello
}

sayHi();

alert(phrase); // 오류, 구문이 정의되지 않았습니다.
```

...하지만 여기에는 차이점이 있습니다.

## "var" 는 블록 범위가 없다.

`var` 변수는 함수 전체 또는 전역 변수이며 블록을 통해 볼 수 있습니다.

예를 들면 :

```js
if (true) {
  var test = true; // "let"대신 "var"를 사용하십시오.
}

*!*
alert(test); // true 이면 변수는 if 다음에도 살아있음
*/!*
```

두 번째 라인에서 `let test` 를 사용하면 `alert` 에 보이지 않을 것입니다. 그러나 `var`은 코드 블록을 무시하므로 전역적인 `test`가 있습니다.

루프에 대해서도 마찬가지입니다 : `var`는 블록 또는 루프 로컬 일 수 없습니다 :

```js
for (var i = 0; i < 10; i++) {
  // ...
}

*!*
alert(i); // 10, "i" 루프 이후에 표시됩니다. 전역 변수입니다.
*/!*
```

코드 블럭이 함수 안에 있으면 `var`는 함수 레벨 변수가됩니다 :

```js
function sayHi() {
  if (true) {
    var phrase = "Hello";
  }

  alert(phrase); // works
}

sayHi();
alert(phrase); // 오류 : 구문이 정의되지 않았습니다.
```

보시다시피, `var`은 `if`,`for`또는 다른 코드 블록을 관통합니다. 오래 전에 JavaScript 블록에서 어휘 환경이 없었기 때문입니다. 그리고 `var`는 그것의 잔재입니다.

## "var" are processed at the function start

`var` 선언은 함수가 시작될 때 (또는 스크립트가 전역을 위해 시작될 때) 처리됩니다.

즉,`var` 변수는 정의의 어디에 있든지 관계없이 함수의 처음부터 정의됩니다 (정의가 중첩 된 함수에 없다고 가정).

그래서이 코드는 :

```js
function sayHi() {
  phrase = "Hello";

  alert(phrase);

*!*
  var phrase;
*/!*
}
```

... 기술적으로 이것과 같습니다 (위에서 이동 된 `var phrase`) :

```js
function sayHi() {
*!*
  var phrase;
*/!*

  phrase = "Hello";

  alert(phrase);
}
```

... 아니면 (코드 블록이 무시된다는 것을 기억하십시오.)

```js
function sayHi() {
  phrase = "Hello"; // (*)

  *!*
  if (false) {
    var phrase;
  }
  */!*

  alert(phrase);
}
```

사람들은 또한 모든 행동이 "호이 스팅 (hoisting)"(raising)이라고 부릅니다. 왜냐하면 모든 `var` 이 기능의 최상위로 "올려지기"때문입니다.

그래서 위의 예제에서 `if (false)`브랜치는 결코 실행되지 않지만, 그건 중요하지 않습니다. 내부의 `var` 는 함수의 시작 부분에서 처리되므로 `(*)`의 순간에 변수가 존재합니다.

**선언문은 호이스팅 되었졌지만 할당은 불가능합니다.**

다음과 같이 예제로 설명하는 것이 좋습니다.

```js run
function sayHi() {
  alert(phrase);  

*!*
  var phrase = "Hello";
*/!*
}

sayHi();
```

`var phrase = "Hello"`행에는 두 개의 액션이 있습니다 :

1. 변수 선언 `var`
2. 변수 할당 `=`.

선언은 함수 실행의 시작에서 처리되지만 ( "hoisted") 할당은 항상 나타나는 위치에서 작동합니다. 따라서 코드는 기본적으로 다음과 같이 작동합니다.

```js run
function sayHi() {
*!*
  var phrase; // declaration works at the start...
*/!*

  alert(phrase); // undefined

*!*
  phrase = "Hello"; // ...assignment - when the execution reaches it.
*/!*
}

sayHi();
```

모든 `var` 선언은 함수 시작에서 처리되기 때문에, 우리는 그것들을 어느 곳에서나 참조 할 수 있습니다. 그러나 변수는 할당까지 정의되지 않습니다.

위의 두 예제 모두 `alert` 변수는 `phrase` 변수가 있기 때문에 오류없이 실행됩니다. 그러나 그 값은 아직 할당되지 않았으므로 '정의되지 않음'을 보여줍니다.

## 요약

`var`의 두 가지 주요 차이점은 다음과 같습니다.

1. 변수는 블록 범위가 없으며 함수 수준에서 최소로 표시됩니다.
2. 변수 선언은 함수 시작시 처리됩니다.

전역 객체와 관련된 사소한 차이점이 하나 있습니다. 다음 장에서 다루겠습니다.

이러한 차이점은 실제로 대부분의 경우 나쁜 것입니다. 블록 수준 변수는 정말 좋은 점입니다. 그래서`let`이 오래전에 표준에 도입되었고, 변수를 선언하는 주요 방법 (`const`과 함께)입니다.