# 조건부 연산: if, '?'

때때로, 조건에 따라 다른 행동을 취해야 할 필요가 있습니다.

`if`문과 물음표 연산자라고 불리는 조건부 연산자인 `?`를 사용하면 조건에 따른 처리가 가능합니다. 

## "if" 문

`if`문은 조건을 평가하고 조건 결과가 `true`이면 코드 블록을 실행합니다.

예시:

```js run
let year = prompt('In which year was ECMAScript-2015 specification published?', '');

*!*
if (year == 2015) alert( 'You are right!' );
*/!*
```

위의 예제에서 조건은 간단한 항등 검사 (`year == 2015`)이지만 코드는 훨씬 더 복잡해질 수 있습니다.

만약 둘 이상의 명령문을 실행하려면 코드 블록을 중괄호로 묶어야합니다.

```js
if (year == 2015) {
  alert( "That's correct!" );
  alert( "You're so smart!" );
}
```

`if` 문을 사용할 때마다 중괄호`{}`로 코드 블록을 래핑(wrapping)하는 것이 좋습니다. 단 하나의 명령문만 실행해도 마찬가지입니다. 이렇게하면 가독성이 향상됩니다.

## 불리언,부울(논리 타입) 변환

`if (…)` 문은 괄호 안의 표현식을 평가하고 결과를 부울로 변환합니다.

<info:type-conversions> 챕터에 있는 변환 규칙을 상기해 보겠습니다.

- 숫자`0`, 빈 문자열`""`, `null`, `undefined`, `NaN`은 모두 `false`가 됩니다. 이때문에 이 값들을 "falsy"값 이라고 부릅니다.
- 다른 값은 `true`가 되므로 "truthy"라고 합니다.

따라서 아래 조건의 코드는 절대로 실행되지 않습니다.

```js
if (0) { // 0 is falsy
  ...
}
```

... 그리고 다음 조건 안에서는 항상 실행할 것입니다.

```js
if (1) { // 1 is truthy
  ...
}
```

다음과 같이 사전 평가된 부울 값을 `if`에 전달할 수 도 있습니다 :

```js
let cond = (year == 2015); // equality evaluates to true or false

if (cond) {
  ...
}
```

## "else"절

`if`문은 임의로 "else"블록을 포함할 수 있습니다. 조건이 거짓일 때 실행됩니다.

예시:
```js run
let year = prompt('In which year was the ECMAScript-2015 specification published?', '');

if (year == 2015) {
  alert( 'You guessed it right!' );
} else {
  alert( 'How can you be so wrong?' ); // any value except 2015
}
```

## 여러 조건 : "else if"

때때로 조건의 여러 변형을 테스트해야 합니다. `else if`절이 그렇게할 수 있게 합니다.

예시:

```js run
let year = prompt('In which year was the ECMAScript-2015 specification published?', '');

if (year < 2015) {
  alert( 'Too early...' );
} else if (year > 2015) {
  alert( 'Too late' );
} else {
  alert( 'Exactly!' );
}
```

위의 코드에서 JavaScript는 먼저 `year < 2015`를 확인합니다. 이 조건이 falsy라면 다음 조건`year > 2015`'으로 진행됩니다. 이 조건 또한 falsy인 경우 마지막 `alert`를 표시합니다.

더 많은 `else if`블록이 있을 수 있습니다. 마지막 `else`는 선택 사항입니다.

## 조건부 연산자 '?'

때로는 조건에 따라 다른 값을 변수에 할당해야 할 때가 있습니다.

예시:

```js run no-beautify
let accessAllowed;
let age = prompt('How old are you?', '');

*!*
if (age > 18) {
  accessAllowed = true;
} else {
  accessAllowed = false;
}
*/!*

alert(accessAllowed);
```

"조건부(conditional) 연산자" 또는 "물음표(question mark) 연산자"라고 불리는 이 연산자는 더 짧고 간단한 방법으로 이를 가능하게 해 줍니다.

이 연산자는 물음표`?`로 표시됩니다. 피연산자(operand)가 세 개 있어 조건부 연산자를 "삼항(ternary) 연산자"라고 부를 때도 있습니다. 조건부 연산자는 자바스크립트에서 피연산자를 가장 많이 가진 유일한 연산자입니다. 

문법:
```js
let result = condition ? value1 : value2;
```

평가할 조건인 `condition`이 truthy 일 경우 `value1`이 반환되고, 그렇지 않으면 `value2`가 반환됩니다.

예시:

```js
let accessAllowed = (age > 18) ? true : false;
```

`age > 18` 주위에 괄호를 생략할 수 있습니다. 물음표 연산자는 우선순위가 낮으므로 비교 연산자 `>`가 실행되고 난 후에 실행됩니다.

이 예제는 이전 것과 같은 동작을 할 것입니다.

```js
// the comparison operator "age > 18" executes first anyway
// (no need to wrap it into parentheses)
let accessAllowed = age > 18 ? true : false;
```

그러나 괄호를 사용하면 코드를 더 쉽게 ​​읽을 수 있게 하므로 사용하는 것이 좋습니다.

````smart
위의 예제에서 비교 자체가 `true/false`를 반환하기 때문에 물음표 연산자를 사용하지 않아도 됩니다.

```js
// the same
let accessAllowed = age > 18;
```
````

## 다중 '?'

일련의 물음표 연산자`?`는 둘 이상의 조건에 의존하는 값을 반환할 수 있습니다.

예시:
```js run
let age = prompt('age?', 18);

let message = (age < 3) ? 'Hi, baby!' :
  (age < 18) ? 'Hello!' :
  (age < 100) ? 'Greetings!' :
  'What an unusual age!';

alert( message );
```

처음에는 무슨 일이 일어나고 있는지 파악하기가 어려울 수 있습니다. 그러나 더 자세히 살펴보면, 테스트의 일반적인 순서라는 것을 알 수 있습니다.

1. 첫 번째 물음표는 `age < 3`인지 확인합니다.
2. 그 결과가 참(true)이면 - `Hi, baby!`를 반환합니다. 그렇지 않으면 콜론 '":"' 이후에 `age < 18`을 확인하는 표현식을 계속합니다.
3. 그 결과가 참(true)이면 ``Hello!'` 를 반환합니다. 그렇지 않으면 다음 콜론 '":"' ' 이후에 `age < 100`을 확인하는 표현식을 계속합니다.
4. 그 결과가 참(true)이면 `'Greetings!'`을 반환합니다. 그렇지 않으면 마지막 콜론 ': "" 이후에 `'What an unusual age!'`를 반환하는 표현식을 계속합니다.

`if..else`를 사용하면 어떻게 보이는지 확인해봅시다.

```js
if (age < 3) {
  message = 'Hi, baby!';
} else if (age < 18) {
  message = 'Hello!';
} else if (age < 100) {
  message = 'Greetings!';
} else {
  message = 'What an unusual age!';
}
```

## 종전과 다른 '?'사용

때로는 물음표`?`가 `if`의 대체물로 사용되기도 합니다

```js run no-beautify
let company = prompt('Which company created JavaScript?', '');

*!*
(company == 'Netscape') ?
   alert('Right!') : alert('Wrong.');
*/!*
```

`company == 'Netscape'`조건에 따라 `?` 다음의 첫 번째 또는 두 번째 표현식이 실행되고 경고가 표시됩니다.

여기서 변수에 결과를 할당하지 않습니다. 대신, 우리는 조건에 따라 다른 코드를 실행합니다.

**이런 식으로 물음표 연산자를 사용하지 않는 것이 좋습니다.**

이 물음표 표기법은 동등한 `if` 문 보다 짧아서 일부 프로그래머에게 매력적으로 느껴집니다. 그러나 읽기 쉽지 않습니다.

비교를 위해 `if`를 사용하는 동일한 코드가 있습니다.

```js run no-beautify
let company = prompt('Which company created JavaScript?', '');

*!*
if (company == 'Netscape') {
  alert('Right!');
} else {
  alert('Wrong.');
}
*/!*
```

우리의 눈은 코드를 수직으로 스캔합니다. 여러 줄에 걸쳐있는 코드 블록은 길고 수평 인 명령어 세트보다 이해하기 쉽습니다.

물음표 연산자`?`의 목적은 조건에 따라 하나의 값 또는 다른 값을 반환하는 것입니다. 정확하게 사용하십시오. 다른 코드 분기를 실행할 필요가 있을 때 `if`를 사용하십시오.
