# 함수

스크립트를 작성하다 보면 유사한 동작이 여러 곳에서 필요한 경우가 자주 생깁니다.

사용자가 로그인이나 로그아웃 했을 때 안내 메시지를 보여주는 동작같은 경우 말이죠.

함수는 프로그램을 구성하는 "구성 요소(building blocks)"입니다. 함수 덕분에 중복 코드 없이 유사한 동작을 여러 번 호출할 수 있습니다. 

`alert(message)`, `prompt(message, default)`, `confirm(question)`와 같은 내장 함수를 사용 해 본 경험이 있을 겁니다. 이런 내장 함수 이외에도 직접 함수를 만들어 사용할 수 있습니다. 

## 함수 선언(Function Declaration)

함수를 만들려면 *함수를 선언*해야 합니다.

아래와 같이 말이죠:

```js
function showMessage() {
  alert( 'Hello everyone!' );
}
```

<<<<<<< HEAD
함수를 선언할 때, `function` 키워드를 제일 앞에 써주고, 다음으로 *함수 이름*, 이어서 괄호로 둘러싸인 매개변수를 명시해 줍니다(위의 예에선 매개변수가 없습니다). 그리고 난 다음 함수를 구성하는 문의 모임인 "함수 본문(body)"를 중괄호에 쌓아 적어줍니다.
=======
The `function` keyword goes first, then goes the *name of the function*, then a list of *parameters* between the parentheses (comma-separated, empty in the example above) and finally the code of the function, also named "the function body", between curly braces.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

```js
function name(parameters) {
  ...body...
}
```

새롭게 정의한 함수는 이름으로 호출합니다: `showMessage()`.

예:

```js run
function showMessage() {
  alert( 'Hello everyone!' );
}

*!*
showMessage();
showMessage();
*/!*
```

`showMessage()`로 함수를 호출하면 함수 내의 코드가 실행됩니다. showMessage 함수를 두 번 호출했으므로, 얼럿(alert)창에 메시지가 두 번 뜹니다.

함수의 주요 용도 중 하나는 중복 코드 피하기입니다. 위 예를 통해 이를 확인해보았습니다.

메시지 내용을 바꾸거나 메시지를 보여주는 방식을 변경하려면, 코드 한 부분만 수정하면 됩니다. 출력에 관여하는 함수 본문만 수정하면 되죠.

## 지역 변수(Local variables)

함수 내에서 선언한 변수는 함수 본문 안에서만 존재합니다.

예:

```js run
function showMessage() {
*!*
  let message = "Hello, I'm JavaScript!"; // 지역 변수
*/!*

  alert( message );
}

showMessage(); // Hello, I'm JavaScript!

alert( message ); // <-- 에러! message는 함수 내의 지역 변수입니다
```

## 외부 변수(Outer variables) 

함수 내에서 함수 바깥의 변수에 접근할 수 있습니다. 예:

```js run no-beautify
let *!*userName*/!* = 'John';

function showMessage() {
  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

showMessage(); // Hello, John
```

함수 본문에서 바깥의 변수에 접근할 수 있고, 수정도 가능합니다.

예:

```js run
let *!*userName*/!* = 'John';

function showMessage() {
  *!*userName*/!* = "Bob"; // (1) 외부 변수 수정

  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

alert( userName ); // 함수 호출 전이므로 *!*John*/!* 

showMessage();

alert( userName ); // 함수에 의해 *!*Bob*/!* 으로 값이 바뀜
```

외부 변수는 함수 내 지역 변수가 없는 경우만 사용됩니다.

만약 함수 외부와 내부에 같은 이름의 변수가 선언되었다면, 지역 변수는 외부 변수에 *영향을 주지 못합니다*. 아래 코드를 살펴보시죠. 함수 내부에서 `userName` 변수를 선언하고 새로운 값을 할당했지만, 외부 변숫값은 변하지 않습니다. 

```js run
let userName = 'John';

function showMessage() {
*!*
  let userName = "Bob"; // 지역 변수 선언
*/!*

  let message = 'Hello, ' + userName; // *!*Bob*/!*
  alert(message);
}

// userName는 함수 내부에서만 생성되고 쓰임
showMessage();

alert( userName ); // *!*John*/!*이 출력됨, 함수는 외부 변수에 접근하지 못하기 때문에, 값이 변경되지 않음
```

```smart header="전역 변수)"
위 코드의 `userName`처럼, 함수 외부에 선언된 변수는 *전역* 변수(global variable)가 됩니다.

전역 변수는 (지역 변수에 의해 가려지지만 않는다면) 모든 함수에서 접근 가능합니다.

전역변수는 되도록 사용하지 않는 것이 좋습니다. 모던 코드에선 전역변수를 사용하지 않거나 최소한으로만 사용하고, 변수는 연관되는 함수 내에 작성됩니다. 프로젝트 수준(project-level)의 데이터를 저장하는 데 가끔 전역변수가 쓰이는 경우가 있긴 합니다.
```

## 매개변수(Parameters)

매개변수(parameter)를 이용하면 임의의 데이터를 함수 안에 전달할 수 있습니다. 매개변수는 *인수(arguments)* 로 불리기도 합니다(역주: 매개변수와 인수는 엄밀히 같진 않지만, 본 튜토리얼 원문을 토대로 번역하였습니다).

아래 함수 showMessage는 매개변수 `from` 과 `text`를 받고 있습니다.

```js run
function showMessage(*!*from, text*/!*) { // 인수: from, text
  alert(from + ': ' + text);
}

*!*
showMessage('Ann', 'Hello!'); // Ann: Hello! (*)
showMessage('Ann', "What's up?"); // Ann: What's up? (**)
*/!*
```

`(*)` 와 `(**)`로 표시한 줄에서 함수를 호출하는데, 이때 함수에 전달된 인자는 지역변수로 복사됩니다. 함수는 복사된 값을 사용합니다. 

예시 하나를 더 살펴봅시다. 변수 `from`이 있고, 이 변수를 함수에 전달하였습니다. 함수 내부에서 `from`을 변경하였지만, 변경된 값은 외부 변수 `from`에 영향을 미치지 못합니다. 함수는 언제나 복사된 값을 사용하기 때문입니다:


```js run
function showMessage(from, text) {

*!*
  from = '*' + from + '*'; // "from"을 꾸며줌
*/!*

  alert( from + ': ' + text );
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

// 바깥의 "from" 값은 그대로임. 함수는 복사 값을 사용하기 때문
alert( from ); // Ann
```

## 매개변수 기본값(Default values)

매개변수에 값을 제공하지 않으면, 그 값은 `undefined`으로 할당됩니다.

예를 들어, 앞서 예제로 사용한 함수 `showMessage(from, text)`는 인수 하나만 넣어서 호출할 수 있습니다.

```js
showMessage("Ann");
```

이렇게 호출해도 에러가 발생하지 않습니다. 단지 결괏값이 `"Ann: undefined"`가 될 뿐입니다. `text` 값이 넘어오지 않았기 때문에, 함수는 `text === undefined`으로 인식합니다.

위의 경우에서 만약 `text`의 "기본(default)"값을 설정하고 싶으면, `=` 다음에 기본값을 써주면 됩니다:

```js run
function showMessage(from, *!*text = "no text given"*/!*) {
  alert( from + ": " + text );
}

showMessage("Ann"); // Ann: no text given
```

이젠 `text` 매개변수를 전달받지 못한 경우, 기본값 `"no text given"`을 대신 전달받습니다.

여기선 기본값으로 문자열인 `"no text given"`을 전달받았습니다. 하지만 더 복잡한 표현식을 기본값으로 할당할 수도 있습니다. 아래와 같이 말이죠:

```js run
function showMessage(from, text = anotherFunction()) {
  // anotherFunction()은 text값이 없을 때만 호출됨
  // 결괏값은 text 값이 됨
}
```

<<<<<<< HEAD
```smart header="매개변수 기본값의 평가 시점"

자바스크립트에선 함수 호출 시 기대하고 있는 매개변수 값이 없을 때마다 기본값을 재산정합니다. 위의 예에서 `showMessage()`을 호출하는데, `text` 매개변수 값이 없으면 그때마다 `anotherFunction()`가 호출됩니다. Python과 같은 몇몇 언어는 매번 기본값을 평가하지 않습니다. 이런 언어들은 인터프리터가 최초 실행되는 시점(the initial interpretation)에 단 한 번만 매개변수를 평가합니다.

```


````smart header="옛날식 기본값"
오래된 버전의 자바스크립트에선 기본값을 지정할 수 없었습니다. 그래서 기본값을 지정해주는 방법으로 아래와 같은 방법을 사용했습니다. 오래된 코드에서 이 방법이 사용된 걸 종종 볼 수 있을 겁니다.
=======
```smart header="Evaluation of default parameters"
In JavaScript, a default parameter is evaluated every time the function is called without the respective parameter. In the example above, `anotherFunction()` is called every time `showMessage()` is called without the `text` parameter.

This is in contrast to some other languages like Python, where any default parameters are evaluated only once during the initial interpretation.
```

````smart header="Default parameters old-style"
Old editions of JavaScript did not support default parameters. So there are alternative ways to support them, that you can find mostly in the old scripts.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

아래 예에선 `undefined`을 명시적으로 확인하는 방법이 사용되었습니다:

```js
function showMessage(from, text) {
*!*
  if (text === undefined) {
    text = 'no text given';
  }
*/!*

  alert( from + ": " + text );
}
```

...`||` 연산자를 사용할 수도 있습니다:

```js
function showMessage(from, text) {
  // 만약 text가 거짓 같은 값(falsy)라면 "기본(default)" 값을 할당합니다
  text = text || 'no text given';
  ...
}
```


````


## 반환 값(Returning a value)

함수는 함수를 호출한 곳에 특정 값을 반환해 줄 수 있습니다. 이때 이 값을 반환 값이라고 합니다. 

간단한 예제로, 두 값을 더하는 함수를 살펴보겠습니다.

```js run no-beautify
function sum(a, b) {
  *!*return*/!* a + b;
}

let result = sum(1, 2);
alert( result ); // 3
```

`return` 키워드는 함수 본문 안 어디에든 올 수 있습니다. `return`을 만나면 함수를 즉시 종료하고 함수를 호출한 곳에 값을 반환합니다(위의 예에선 반환 값이 `result`에 할당되었습니다). 

아래와 같이 하나의 함수에 여러 개의 `return`이 올 수도 있습니다:

```js run
function checkAge(age) {
  if (age > 18) {
*!*
    return true;
*/!*
  } else {
*!*
    return confirm('보호자의 동의를 받으셨나요?');
*/!*
  }
}

let age = prompt('나이를 알려주세요', 18);

if ( checkAge(age) ) {
  alert( '접속 허용' );
} else {
  alert( '접속 차단' );
}
```

값없이 `return` 키워드만 쓸 수도 있습니다. 이때는 함수가 즉시 종료됩니다.

예:

```js
function showMovie(age) {
  if ( !checkAge(age) ) {
*!*
    return;
*/!*
  }

  alert( "영화 상영" ); // (*)
  // ...
}
```

위 예에서, `checkAge(age)`가 `거짓(false)`을 반환하면, `showMovie`의 얼럿창은 보이지 않습니다:

````smart header="`return`문이 없거나 아무것도 반환하지 않는 함수는 `undefined`을 반환합니다"
함수에서 return을 명시적으로 호출하지 않으면, 반환 값은 `undefined`가 됩니다.

```js run
function doNothing() { /* empty */ }

alert( doNothing() === undefined ); // true
```
어떤 값도 반환하지 않는 경우도, `return undefined`를 한 것과 같습니다:

```js run
function doNothing() {
  return;
}

alert( doNothing() === undefined ); // true
```
````

````warn header="`return`과 값 사이에 절대 새 줄을 넣지 마세요"
`return` 값이 긴 경우, 줄 나눔을 하고 싶을 수 있습니다. 아래와 같이 말이죠:

```js
return
 (some + long + expression + or + whatever * f(a) + f(b))
```
이렇게 하면 안 됩니다. 자바스크립트는 return 키워드가 들어간 줄 끝에 세미콜론(semicolon)이 들어가 있다고 가정하기 때문입니다. 따라서 위 코드는 아래 코드같이 작동합니다:

```js
return*!*;*/!*
 (some + long + expression + or + whatever * f(a) + f(b))
```
결론적으로 아무것도 반환하지 않게 됩니다. return 값은 꼭 return 키워드와 같은 줄에 있어야 합니다.
````

## 함수 이름짓기 [#function-naming]

함수는 동작입니다. 따라서 함수의 이름은 대게 동사입니다. 함수 이름은 가능한 한 명확하게, 그리고 함수가 어떤 기능을 하는지 설명할 수 있도록 지어야 합니다. 코드를 읽는 사람이 함수가 어떤 기능을 하는지 이름만 보고도 힌트를 얻을 수 있도록 말이죠.     

함수의 이름은 함수가 대충 어떤 동작을 하는지 설명하는 동사를 접두어로 붙여 시작하는 게 관습입니다. 이렇게 접두어를 붙일 때는, 접두어의 의미를 팀 내에서 반드시 의논하고 합의해야 합니다. 

예를 들어 `"show"`로 시작하는 함수는 대게 무언가를 보여주는 동작을 하는 함수입니다.

접두어의 의미는 아래와 같이 쓰일 수 있습니다.

- `"get…"` -- 값을 반환함,
- `"calc…"` -- 무언가를 계산함,
- `"create…"` -- 무언가를 만듦,
- `"check…"` -- 무언가를 확인하고 boolean(불리언) 값을 반환함.

함수 이름의 예:

```js no-beautify
showMessage(..)     // 메시지를 보여줌
getAge(..)          // 나이를 반환함(그리고 그 값을 얻음)
calcSum(..)         // 합계를 계산하고 그 결과를 반환함
createForm(..)      // form을 만듦 (그리고 대게 만들어진 form을 반환함)
checkPermission(..) // 승인 여부를 확인하고 true/false를 반환함
```

접두어를 적절히 활용하면 함수 이름을 통해 함수가 어떤 동작을 하고 어떤 값을 반환하는지 한눈에 볼 수 있습니다.

```smart header="하나의 함수 -- 하나의 동작"
함수는 함수 이름에 언급되어있는 동작을 정확히 수행해야 합니다. 그 이상은 안 됩니다.

독립적인 두 개의 동작은 두 함수로 나눠서 작성해야 합니다. 두 동작이 한 곳에서 필요하더라도 말이죠(이런 경우는 대게 두 함수를 호출하는 제3의 함수를 만듭니다). 

예를 통해 함수를 언제 쪼개야 하는지 알아봅시다:

- `getAge` -- `alert` 창에 나이를 출력해주는 동작이 들어가 있으면 안 좋습니다(오직 나이를 얻어오는 용도로 사용해야 합니다).
- `createForm` -- 문서를 수정해서 form을 문서에 더해주는 동작이 들어가 있으면 안 좋습니다(form을 만들고 이를 반환하는 동작만 해야 합니다).  
- `checkPermission` -- `승인 허가/거부` 메시지를 보여주는 동작이 들어가 있으면 안 좋습니다(승인 여부를 확인하고 그 결과를 반환하는 동작만 해야 합니다).

These examples assume common meanings of prefixes. You and your team are free to agree on other meanings, but usually they're not much different. In any case, you should have a firm understanding of what a prefix means, what a prefixed function can and cannot do. All same-prefixed functions should obey the rules. And the team should share the knowledge.
```

```smart header="아주 짧은 함수 이름"
*빈번히* 쓰이는 함수 중 아주 짧은 이름을 가진 함수도 있습니다.

[jQuery](http://jquery.com) 프레임워크(framework)는 `$`라는 이름을 가진 함수를 정의합니다. [Lodash](http://lodash.com/) 라이브러리(library)의 핵심 함수는 이름이 `_` 입니다.

이런 함수들은 예외라고 생각하셔야 합니다. 일반적으로 함수 이름은 간결하고 함수가 어떤 일을 하는지 설명할 수 있어야 합니다.
```

## 함수 == 주석

함수는 간결해야하고, 한 가지 기능만 수행해야 합니다. 거대한 함수는 작은 함수로 쪼개는 게 좋습니다. 함수를 쪼개는 게 쉽지 않을 수도 있지만, 쪼개는 건 많은 장점이 있기 때문에 함수를 쪼개는 것을 추천합니다.

함수를 쪼개 놓으면 테스트와 디버깅이 쉬워집니다. 그리고 함수 그 자체로 주석의 역할까지 합니다!

예를 들어봅시다. 아래 두 `showPrimes(n)`을 비교해 보죠. 각 함수는 `n`까지의 [소수(prime numbers)](https://en.wikipedia.org/wiki/Prime_number)를 출력해줍니다.

첫 번째 `showPrimes(n)`은 라벨(label)을 사용합니다:

```js
function showPrimes(n) {
  nextPrime: for (let i = 2; i < n; i++) {

    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime;
    }

    alert( i ); // a prime
  }
}
```

두 번째 `showPrimes(n)`은 `isPrime(n)`이라는 추가 함수를 만들어 소수인지 아닌지 여부를 테스트합니다:

```js
function showPrimes(n) {

  for (let i = 2; i < n; i++) {
    *!*if (!isPrime(i)) continue;*/!*

    alert(i);  // a prime
  }
}

function isPrime(n) {
  for (let i = 2; i < n; i++) {
    if ( n % i == 0) return false;
  }
  return true;
}
```

두 번째 `showPrimes(n)`이 더 이해하기 쉽지 않나요? 소수인지 아닌지 여부를 체크하는 코드 조각 대신에 `isPrime`같이 함수 이름을 통해 그 동작을 확인할 수 있습니다. 사람들은 이렇게 *자기 설명, self-describing*이 가능한 코드를 선호합니다.

위와 같이 나중에 다시 필요하지 않은 동작이더라도 함수로 만들 수 있습니다. 코드를 구조화하고 읽기 쉽게 만들어 주기 때문입니다. 

## 요약

함수의 선언은 아래와 같이 합니다:

```js
function name(parameters, delimited, by, comma) {
  /* code */
}
```

- 매개변수로 함수에 전달된 값은, 복사되어 지역변수가 됩니다.
- 함수내부에서 함수 바깥의 변수에 접근할 수 있습니다. 하지만 함수 바깥의 코드가 함수 안의 변수에 접근하는 건 불가능합니다. 
- 함수는 값을 반환할 수 있습니다. 값을 반환하지 않는 경우는, 반환값이 `undefined`이 됩니다.

코드를 깔끔하고 이해하기 쉽도록 작성하려면, 지역변수와 지역 매개변수를 주로 활용하는 게 좋습니다. 외부 변수사용은 이를 방해합니다. 

매개변수를 받아서 그 변수를 가지고 반환값을 만들어 내는 함수는 개발자가 이해하기 쉽습니다. 반면, 매개변수 없이 외부 변수 수정을 부작용(side-effect)처럼 수행하는 함수는 이해하기 어렵습니다. 

함수 이름짓기:

- 함수 이름은 함수가 어떤 일을 하는지 설명할 수 있도록 지어야 합니다. 함수 이름이 잘 지어졌다면, 함수 호출 코드를 보았을 때 이 함수가 무엇을 하고 어떤 값을 반환할지 바로 알 수 있습니다. 
- 함수는 동작입니다. 따라서 함수 이름은 주로 동사를 이용해 만듭니다.
- `create…`, `show…`, `get…`, `check…` 등의 잘 알려진 접두어를 사용해 함수를 만들 수 있습니다. 접두어를 사용하면 함수가 어떤 동작을 하는지 정보를 얻을 수 있습니다.

함수는 스크립트를 구성하는 주요 구성 요소입니다. 지금까진 함수의 기초를 다루면서 함수를 만들고 사용하는 방법을 알아보았습니다. 하지만 이 내용은 시작일 뿐입니다. 이어지는 내용을 통해 고급 기능을 다루도록 하겠습니다.
