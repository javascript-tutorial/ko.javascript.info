# 함수

스크립트를 작성하다 보면 유사한 동작이 여러 곳에서 필요한 경우가 자주 생깁니다.

사용자가 로그인이나 로그아웃했을 때 안내 메시지를 보여주는 동작 같은 경우 말이죠.

함수는 프로그램을 구성하는 주요 "구성 요소(building blocks)"입니다. 함수를 이용하면 중복 코드 없이 유사한 동작을 하는 코드를 여러 번 호출할 수 있습니다. 

우리는 앞서 예시 등을 통해 `alert(message)`, `prompt(message, default)`, `confirm(question)`과 같은 내장 함수를 사용해 본 경험이 있습니다. 이 챕터에선 이런 내장 함수 이외의 함수를 직접 만들어 사용하는 방법에 대해 알아보겠습니다.

## 함수 선언

*함수 선언(function declaration)* 방식을 이용하면 함수를 만들 수 있습니다.

함수 선언 방식은 아래와 같이 작성할 수 있습니다.

```js
function showMessage() {
  alert( '안녕하세요!' );
}
```

함수를 선언할 때, `function` 키워드를 제일 앞에 써주고, 다음으로 *함수 이름*, 이어서 매개변수를 괄호로 둘러싸 명시해 줍니다. 위 예시의 함수는 매개변수가 없는데, 만약 매개변수가 여러 개 있다면 각 매개변수를 콤마로 구분해줍니다. 그리고 난 다음 함수를 구성하는 문의 모임인 "함수 본문(body)"을 중괄호로 쌓아 줍니다.

```js
function name(parameters) {
  ...함수 본문...
}
```

새롭게 정의된 함수는 함수 이름 옆에 괄호를 붙여 호출할 수 있습니다. `showMessage()`같이 말이죠. 

예시:

```js run
function showMessage() {
  alert( '안녕하세요!' );
}

*!*
showMessage();
showMessage();
*/!*
```

`showMessage()`로 함수를 호출하면 함수 본문이 실행됩니다. 위 예시에선 showMessage를 두 번 호출했으므로 얼럿창이 두 번 뜹니다.

함수의 주요 용도 중 하나는 중복 코드 피하기입니다. 위 예시에서 alert문이 있는 함수를 작성하고, 그 함수를 두 번 호출해 이를 확인해 보았습니다.

얼럿창의 메시지를 바꾸거나 메시지를 보여주는 방식 자체를 변경하고 싶다면, 함수 본문 중 출력에 관여하는 코드만 수정해주면 됩니다.

## 지역 변수

함수 내에서 선언한 변수는 함수 본문 안에서만 존재합니다. 이때 함수 내 변수를 함수의 지역 변수(local variable)라고 부릅니다.

예시:

```js run
function showMessage() {
*!*
  let message = "안녕하세요!"; // 지역 변수
*/!*

  alert( message );
}

showMessage(); // 안녕하세요!

alert( message ); // <-- Error: message is not defined (message는 함수 내 지역 변수이기 때문에 에러가 발생합니다.)
```

## 외부 변수

함수 내부에서 함수 외부의 변수(외부 변수, outer variable)에 접근할 수 있습니다.

```js run no-beautify
let *!*userName*/!* = 'John';

function showMessage() {
  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

showMessage(); // Hello, John
```

함수 내부에서 외부의 변수에 접근하는 것뿐만 아니라, 수정도 할 수 있습니다.

예시:

```js run
let *!*userName*/!* = 'John';

function showMessage() {
  *!*userName*/!* = "Bob"; // (1) 외부 변수를 수정함

  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

alert( userName ); // 함수 호출 전이므로 *!*John*/!* 이 출력됨

showMessage();

alert( userName ); // 함수에 의해 *!*Bob*/!* 으로 값이 바뀜
```

외부 변수는 함수 내 지역 변수가 없는 경우에만 사용됩니다.

함수 내부에 외부 변수와 동일한 이름을 가진 변수가 선언되었다면, 외부 변수는 아무런 *영향을 받지 않습니다*. 아래 예시에서 함수의 지역변수로 `userName`을 선언하고 새로운 값을 할당했지만, 외부 변숫값은 변하지 않습니다. 

```js run
let userName = 'John';

function showMessage() {
*!*
  let userName = "Bob"; // 같은 이름을 가진 지역 변수를 선언합니다.
*/!*

  let message = 'Hello, ' + userName; // *!*Bob*/!*
  alert(message);
}

// 함수는 내부 변수인 userName만 사용합니다,
showMessage();

alert( userName ); // 지역 변수가 이미 존재하므로 함수는 외부 변수에 접근하지 않습니다. 따라서 값이 변경되지 않고, *!*John*/!*이 출력됩니다.
```

```smart header="전역 변수"
위 예시의 `userName`처럼, 함수 외부에서 선언한 변수는 *전역* 변수(global variable)라고 부릅니다.

전역 변수는 (같은 이름을 가진 지역 변수에 의해 가려지지만 않는다면) 모든 함수에서 접근할 수 있습니다.

그런데 전역변수는 되도록 사용하지 않는 것이 좋습니다. 최근에 작성된 코드들은 대부분 전역변수를 사용하지 않거나 최소한으로만 사용합니다. 변수는 연관되는 함수 내에 선언하는 것이 좋습니다. 전역변수가 가끔 쓰이긴 하는데, 이때는 프로젝트 수준(project-level)의 데이터를 저장하는 데 해당 변수가 사용됩니다. 
```

## 매개변수

매개변수(parameter)를 이용하면 임의의 데이터를 함수 안에 전달할 수 있습니다. 매개변수는 *인수(argument)* 라고 불리기도 합니다(역주: 매개변수와 인수는 엄밀히 같진 않지만, 본 튜토리얼 원문을 토대로 번역하였습니다).

아래 예시에서 함수 showMessage는 매개변수 `from` 과 `text`를 받고 있습니다.

```js run
function showMessage(*!*from, text*/!*) { // 인수: from, text
  alert(from + ': ' + text);
}

*!*
showMessage('Ann', 'Hello!'); // Ann: Hello! (*)
showMessage('Ann', "What's up?"); // Ann: What's up? (**)
*/!*
```

`(*)`, `(**)`로 표시한 줄에서 함수가 호출되면, 함수에 전달된 인자는 지역변수 `from`과 `text`에 복사됩니다. 함수는 지역변수에 저장된 값을 사용해 본문을 실행합니다. 

예시 하나를 더 살펴봅시다. 전역 변수 `from`이 있고, 이 변수를 함수에 전달하였습니다. 함수 본문에서 `from`의 값을 변경하였지만, 변경 사항은 외부 변수 `from`에 반영되지 않았습니다. 함수는 언제나 복사된 값을 사용하기 때문입니다.


```js run
function showMessage(from, text) {

*!*
  from = '*' + from + '*'; // "from"을 좀 더 멋지게 꾸며줍니다.
*/!*

  alert( from + ': ' + text );
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

// 함수는 복사된 값을 사용하기 때문에 바깥의 "from"은 값이 변경되지 않습니다. 
alert( from ); // Ann
```

## 매개변수 기본값

매개변수에 값을 제공하지 않으면, 그 값은 `undefined`가 됩니다.

위 예시에서 사용한 함수 `showMessage(from, text)`엔 매개변수가 2개 명시되어 있지만, 아래와 같이 인수를 하나만 넣어서 호출할 수 있습니다.

```js
showMessage("Ann");
```

이렇게 코드를 작성해도 에러가 발생하지 않습니다. 두 번째 매개변수에 값이 제공되지 않았기 때문에 `text`의 값은 `undefied`가 되고, 에러 없이 `"Ann: undefined"`가 출력될 뿐입니다. 

위와 같이 매개변수에 값이 제공되지 않아도 그 값이 `undefined`가 되지 않게 하려면 "기본(default)"값을 설정해주면 됩니다. 매개변수 옆에 `=`을 붙이고 원하는 기본값을 써주면 되죠.   

```js run
function showMessage(from, *!*text = "no text given"*/!*) {
  alert( from + ": " + text );
}

showMessage("Ann"); // Ann: no text given
```

이젠 `text` 매개변수를 전달받지 못해도 기본값 `"no text given"`을 받을 수 있게 되었습니다.

위 예시에선 문자열 `"no text given"`을 기본값으로 전달받았습니다. 하지만 아래와 같이 더 복잡한 표현식도 기본값으로 설정할 수도 있습니다.

```js run
function showMessage(from, text = anotherFunction()) {
  // anotherFunction()은 text값이 없을 때만 호출됨
  // anotherFunction()의 반환값이 text의 값이 됨
}
```

```smart header="매개변수 기본값의 평가"
자바스크립트에선 함수를 호출할 때마다 매개변수 기본값을 평가합니다. 물론 해당하는 매개변수가 없을 때만 기본값을 평가하죠. 위 예제에선 매개변수 `text`에 값이 없는 경우 `showMessage()`를 호출할 때마다 `anotherFunction()`이 호출되죠.

그런데 Python 등의 몇몇 언어는 함수를 호출할 때마다 기본값을 평가하지 않습니다. Python은 초기 해석(initial interpretation)단계에서 단 한 번만 매개변수 기본값을 평가합니다. 
```

````smart header="옛 방식으로 기본값 설정하기"
오래된 버전의 자바스크립트에선 지금까지 소개한 방법으로 매개변수 기본값을 지정해 줄 수 없었습니다. 그래서 많은 개발자가 아래와 같은 방법을 사용해 기본값을 지정해주었습니다. 이런 방법은 오래된 코드에서 종종 살펴볼 수 있습니다.

아래 예시에선 `undefined`를 명시적으로 확인하는 방법을 사용하여 기본값을 지정하고 있습니다.

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

이 외에도 `||` 연산자를 사용해 매개변수 기본값을 지정할 수 있습니다.

```js
function showMessage(from, text) {
  // text가 거짓 같은 값일 때 "기본값"을 할당합니다.
  text = text || 'no text given';
  ...
}
```


````


## 반환 값

함수를 호출했을 때, 함수를 호출한 그곳에 특정 값을 반환할수 있게 할 수 있습니다. 이때 반환되는 특정 값을 반환 값(return value)이라고 부릅니다. 

인수로 받은 두 값을 더해주는 간단한 함수를 만들어 이를 살펴보도록 하겠습니다.

```js run no-beautify
function sum(a, b) {
  *!*return*/!* a + b;
}

let result = sum(1, 2);
alert( result ); // 3
```

지시자 `return`은 함수 본문 내 어디서든 사용할 수 있습니다. 함수 본문이 실행될 때 지시자 `return`을 만나면 실행을 즉시 중단하고 함수를 호출한 곳에 값을 반환합니다. 위 예시에선 반환 값을 `result`에 할당하였습니다. 

아래와 같이 함수 하나에 여러 개의 `return`문이 올 수도 있습니다.

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

아래와 같이 지시자 `return`만 명시하는 것도 가능합니다. 이런 경우는 함수가 즉시 종료됩니다.

예시:

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

위 예시에서, `checkAge(age)`가 `false`를 반환하면, `(*)`로 표시한 줄은 실행되지 않기 때문에 함수 `showMovie`는 얼럿창을 보여주지 않습니다.

````smart header="`return`문 자체가 없거나 `return` 지시자만 있는 함수는 `undefined`를 반환합니다."
`return`문이 없는 함수는 `undefined`를 반환합니다.

```js run
function doNothing() { /* empty */ }

alert( doNothing() === undefined ); // true
```

`return` 지시자만 있어서 어떤 값도 반환하지 않는 경우도 `undefined`를 반환합니다. `return`은 `return undefined`와 동일하게 동작합니다.

```js run
function doNothing() {
  return;
}

alert( doNothing() === undefined ); // true
```
````

````warn header="`return`과 값 사이에 절대 줄을 삽입하지 마세요."
긴 표현식을 사용해 `return`문을 작성하는 경우, 아래와 같이 새 줄을 넣어 코드를 작성하려는 시도를 할 수 있습니다.

```js
return
 (some + long + expression + or + whatever * f(a) + f(b))
```
이렇게 `return`문을 작성하면 안 됩니다. 자바스크립트는 return 다음에 세미콜론이 있다고 가정하기 때문입니다. 따라서 위 코드는 아래 코드처럼 동작합니다.

```js
return*!*;*/!*
 (some + long + expression + or + whatever * f(a) + f(b))
```
<<<<<<< HEAD
`return` 지시자만 남는 것처럼 되어버리기 때문에 원하는 표현식이 아닌 undefined`를 반환하게 됩니다.
 표현식을 꼭 여러 줄에 걸쳐 작성하고 싶다면 아래와 같이 여는 괄호를 `return` 지시자와 같은 줄에 써주면 됩니다. 
=======

So, it effectively becomes an empty return.

If we want the returned expression to wrap across multiple lines, we should start it at the same line as `return`. Or at least put the opening parentheses there as follows:
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

```js
return (
  some + long + expression
  + or +
  whatever * f(a) + f(b)
  )
```
이렇게 하면 의도한 대로 반환 값을 얻을 수 있습니다. 
````

## 함수 이름짓기 [#function-naming]

함수는 어떤 `동작`을 수행하기 위한 코드를 모아놓은 곳이기 때문에 함수의 이름은 대게 동사입니다. 함수 이름은 가능한 한 명확해야 합니다. 또한 함수가 어떤 동작을 하는지 설명할 수 있어야 하죠. 코드를 읽는 사람은 함수 이름만 보고도 함수가 어떤 기능을 하는지 힌트를 얻을 수 있어야 합니다.     

함수 이름은 함수가 어떤 동작을 하는지 축약해서 설명해주는 동사를 접두어로 붙여 만드는 게 관습입니다. 접두어의 의미는 팀 내에서 반드시 합의해야 합니다. 

`"show"`로 시작하는 함수는 대게 무언가를 보여주는 함수입니다.

이 외에 아래와 같은 접두어를 사용할 수 있습니다.

- `"get…"` -- 값을 반환함,
- `"calc…"` -- 무언가를 계산함,
- `"create…"` -- 무언가를 생성함,
- `"check…"` -- 무언가를 확인하고 불린값을 반환함.

위 접두어를 사용하면 아래와 같은 함수를 만들 수 있습니다.

```js no-beautify
showMessage(..)     // 메시지를 보여줌
getAge(..)          // 나이를 나타내는 값을 얻고 그 값을 반환함
calcSum(..)         // 합계를 계산하고 그 결과를 반환함
createForm(..)      // form을 생성하고 만들어진 form을 반환함
checkPermission(..) // 승인 여부를 확인하고 true나 false를 반환함
```

접두어를 적절히 활용하면 함수 이름만 보고도 함수가 어떤 동작을 하고 어떤 값을 반환하는지 쉽게 알 수 있습니다.

```smart header="함수는 동작 하나만 담당해야 합니다."
함수는 함수 이름에 언급되어있는 동작을 정확히 수행해야 합니다. 그 이외의 동작은 수행해선 안 됩니다.

독립적인 두 개의 동작은 독립된 함수 두 개에서 나눠서 수행할 수 있도록 해야 합니다. 두 동작을 필요로 하는 곳이 동일한 곳이라도 말이죠. 이런 경우는 대게 두 함수를 호출하는 제3의 함수를 만듭니다. 

자주 하는 실수를 예로 들어보도록 하겠습니다.

- `getAge` 함수는 나이를 얻어오는 동작만 수행해야 합니다. `alert` 창에 나이를 출력해주는 동작은 이 함수에 들어가지 않는 것이 좋습니다.
- `createForm` 함수는 form을 만들고 이를 반환하는 동작만 해야 합니다. form을 문서에 추가하는 동작이 해당 함수에 들어가 있으면 좋지 않습니다.
- `checkPermission` 함수는 승인 여부를 확인하고 그 결과를 반환하는 동작만 해야 합니다. `승인이 허가되었는지 거부되었는지`에 관한 메시지를 보여주는 동작이 들어가 있으면 안 좋습니다.

위의 예시들은 접두어의 의미가 합의되었다고 가정하고 만들었습니다. 본인이나 본인이 속한 팀에서 접두어의 의미를 재합의하여 함수를 만들 수도 있긴 하지만, 아마도 위 예시에서 사용한 접두어 의미와 크게 차이가 나진 않을 겁니다. 어찌 되었든 접두어를 사용하여 함수 이름을 지을 땐 해당 접두어에 어떤 의미가 있는지 잘 이해하고 있어야 합니다. 해당 접두어가 붙은 함수가 어떤 동작을 하는지, 어떤 동작은 하지 못하는지 알고 있어야 하죠. 접두어를 붙여 만든 모두 함수는 팀에서 만든 규칙을 반드시 따라야 합니다. 또한 팀원들은 규칙을 충분한 이해 하고 공유해야 합니다.  
```

```smart header="아주 짧은 이름"
정말 *빈번히* 쓰이는 함수 중에 이름이 아주 짧은 함수가 있습니다.

[jQuery](http://jquery.com) 프레임워크에선 `$`라는 이름을 가진 함수를 정의합니다. [Lodash](http://lodash.com/) 라이브러리에서 정의하는 핵심 함수의 이름은 `_` 입니다.

이런 함수들은 예외에 속합니다. 함수 이름은 위에서 설명한 바와 같이 간결하고 함수가 어떤 일을 하는지 설명할 수 있게 지어야 합니다.
```

## 함수 == 주석

함수는 짧고 한 가지 기능만 수행할 수 있게 만들어야 합니다. 함수가 길어진다면 함수 잘게 쪼갤 때가 되었다는 신호로 받아들이셔야 합니다. 함수를 쪼개는 건 쉬운 작업은 아닙니다. 하지만 함수를 분리해 작성하면 많은 장점이 있기 때문에 함수가 길어질 경우 함수를 분리해 작성할 것을 권유 드립니다.

함수를 분리해 간결하게 만들면 테스트와 디버깅이 쉬워집니다. 그리고 함수 그 자체로 주석의 역할까지 합니다!

두 함수 `showPrimes(n)`를 비교해 봅시다. 각 함수는 `n`까지의 [소수(prime numbers)](https://en.wikipedia.org/wiki/Prime_number)를 출력해줍니다.

첫 번째 `showPrimes(n)`에선  라벨을 사용해 반복문을 작성해보았습니다.

```js
function showPrimes(n) {
  nextPrime: for (let i = 2; i < n; i++) {

    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime;
    }

    alert( i ); // 소수
  }
}
```

두 번째 `showPrimes(n)`는 소수인지 아닌지 여부를 테스트하는 코드를 따로 분리해 `isPrime(n)`이라는 함수에 넣어서 작성했습니다.  

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

두 번째 `showPrimes(n)`가 더 이해하기 쉽지 않나요? `isPrime` 함수 이름을 보고 해당 함수가 소수 여부를 테스트하는 동작을 한다는 걸 쉽게 알 수 있습니다. 사람들은 이런 코드를 *self-describing* 코드라고 부릅니다.

위와 같이 중복을 없애려는 용도 이외에도 새로운 함수를 만들 수 있습니다. 이런 함수는 코드를 구조화하고 가독성을 높여줍니다.

## 요약

함수 선언 방식으로 함수를 만들 수 있습니다.

```js
function 함수이름(복수의, 매개변수는, 콤마로, 구분합니다) {
  /* 함수 본문 */
}
```

- 함수에 전달된 매개변수는 복사 후 함수의 지역변수가 됩니다.
- 함수는 외부 변수에 접근할 수 있습니다. 하지만 함수 바깥에서 함수 내부의 지역변수에 접근하는 건 불가능합니다. 
- 함수는 값을 반환할 수 있습니다. 값을 반환하지 않는 경우는 반환 값이 `undefined`가 됩니다.

깔끔하고 이해하기 쉬운 코드를 작성하려면, 함수 내부에서 외부 변수를 사용하는 방법 대신 지역 변수와 매개변수를 활용하는 게 좋습니다.

개발자는 매개변수를 받아서 그 변수를 가지고 반환 값을 만들어 내는 함수를 더 쉽게 이해할 수 있습니다. 매개변수 없이 함수 내부에서 외부 변수를 수정해 반환값을 만들어 내는 함수는 가독성이 떨어집니다.

함수 이름을 지을 땐 아래와 같은 규칙을 따르는 것이 좋습니다.

- 함수 이름은 함수가 어떤 동작을 하는지 설명할 수 있도록 지어야 합니다. 이렇게 함수 이름을 만들면 함수 호출 코드만 보아도 해당 함수가 무엇을 하고 어떤 값을 반환할지 바로 알 수 있습니다. 
- 함수는 어떤 동작을 수행하기 때문에 이름이 주로 동사입니다.
- `create…`, `show…`, `get…`, `check…` 등의 잘 알려진 접두어를 사용해 함수 이름을 지을 수 있습니다. 접두어를 사용해서 이름을 지으면 함수 이름만 보고도 해당 함수가 어떤 동작을 하는지 파악할 수 있습니다.

함수는 스크립트를 구성하는 주요 구성 요소입니다. 지금까진 다룬 내용은 함수의 기초입니다. 여기선 함수를 만드는 방법, 사용하는 방법을 소개했는데 이 내용은 시작일 뿐이죠. 이어지는 내용에선 지금까지 배운 기초를 기반으로 함수가 제공하는 고급을 소개하도록 하겠습니다.