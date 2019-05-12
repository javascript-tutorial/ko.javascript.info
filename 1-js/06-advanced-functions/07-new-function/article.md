
# "새로운 함수" 문법

함수를 생성하는데 한 가지 방법이 더 있습니다. 제한적으로 사용되지만, 가끔 이 방법 외에는 대안이 없을 때도 있죠.

## 문법

함수를 만드는 문법은 다음과 같습니다.

```js
let func = new Function ([arg1[, arg2[, ...argN]],] functionBody)
```

다른 말로 하면, 함수의 매개 변수(또는 정확히는 그것들의 이름)가 먼저 오고, 본문이 마지막에 따라옵니다. 모든 인수는 문자열입니다. 

더 쉽게 이해하기 위해서 함수와 두 개의 인수가 있는 예제를 보겠습니다. 

```js run
let sum = new Function('a', 'b', 'return a + b'); 

alert( sum(1, 2) ); // 3
```

만약에 인수들이 없다면 오직 하나의 함수 본문을 가진 인수만이 있습니다.

```js run
let sayHi = new Function('alert("Hello")');

sayHi(); // Hello
```

가장 다른 점은 함수가 문자 그대로 실행될 때 넘겨진다는 것입니다.

예전의 모든 선언문에서 함수의 코드는 스크립트 안에서 쓰였습니다.

그러나 `new Function` 이라는 문법은 어떠한 문자열을 함수로 바꾸어주는 역활을 합니다. 예를 들면, 새로운 함수를 서버로 받아서 실행해야 될 때 처럼입니다.

```js
let str = ... receive the code from a server dynamically ...

let func = new Function(str);
func();
```

이것은 굉장히 특정한 상황에만 사용됩니다. 서버로부터 코드를 받아올 때나 아니면 템블릿으로 부터 함수를 유동적으로 컴파일 할 때 입니다. 이런 것들이 필요할 때는 좀 더 고급스러운 개발단계가 필요할 때 입니다.

## 클로져(Closure)

보통 함수는 어디에서 작성되었는지에 관한 특수한 프로퍼티는 `[[Environment]]`에 기억합니다. 생성된 렉시컬 환경을 참고합니다.

그러나 `new Function`문을 사용해서 함수가 생성되면 `[[Environment]]`은 현재의 렉시컬 환경이 아닙니다. 대신에 전역(global)이 됩니다.

```js run

function getFunc() {
  let value = "test";

*!*
  let func = new Function('alert(value)');
*/!*

  return func;
}

getFunc()(); // 에러 값이 정의되지 않음
```

일반적인 것과 비교해보세요.

```js run 
function getFunc() {
  let value = "test";

*!*
  let func = function() { alert(value); };
*/!*

  return func;
}

getFunc()(); // *!*"test"*/!*, from the Lexical Environment of getFunc
```

특수한 기능인 `new Function`이 이상해 보일 수 있습니다만 아주 유용할 때가 있습니다.

문자열로부터 함수를 만들어야 하는 상황이 있어야 된다고 생각해보면. 그 함수의 코드는 스크립트를 작성할 때는 알 수 없습니다. (그래서 보통 함수를 사용하지 않죠) 그러나, 실행되는 프로세스에서는 알 수 있습니다. 서버 또는 다른 출처로 부터 받게 되겠지요.

새로운 함수는 메인 스크립트와 상호작용해야 할 것입니다.

그런데 혹시 그렇게 생성된 함수가 외부의 지역변수에 접근해야 한다면 어떨까요?

문제는 자바스크립트가 운영에 반영되기 직전에 있습니다. 자바스크립트는 *minifier*라는 특수한 프로그램에 의해 압축된다는 것입니다 -- 코드의 특수한 주석이나 빈칸 -- 더 중요한 건 이것이 지역변수를 짧은 것으로 바꾸게 됩니다.

예를 들면, 만약에 함수가 `let userName` 이라는 걸 가지고 있다면 minifier 는 그것은 `let a`로 (또는 그것을 어딘가 사용하고 있다면 다른 문자로) 대체합니다. 그리고 이런 일은 모든 곳에서 일어납니다. 보통 이런 작업은 값들이 지역변수라 안전하지만, 외부 함수에서는 여기에 접근할 수 없습니다. 그리고 함수의 내부에서 minifier는 언급된 모든 곳을 수정합니다. Minifiers 는 똑똑하고 코드의 구조를 분석하기 때문에 어떠한 곳도 망가뜨리진 않습니다. 그냥 무조건 찾아서 바꾸는 작업을 하는 건 아닙니다.

그러나 만약 `new Function` 구문이 외부 변수들에 접근한다면 `userName` 이라는 것은 찾을 수 없을 것입니다. *이후의* 코드는 minified 되었기 때문이죠.

**`new Function`문법이 외부 렉시컬 환경에 접근할 수 있었을지라도 minifiers에 의한 문제는 생길 수 있습니다.**

`new Function`의 특별한 기능이 이런 실수로부터 예방합니다.

그리고 좀더 좋은 코드를 제공합니다. `new Function`이란 문법을 사용한 함수에 무언가를 넘기려고 한다면 명시적으로 인수(argument)로 넘기는것이 좋습니다.

아래의 "sum"함수는 그것을 잘 표현하고 있습니다.

```js run 
*!*
let sum = new Function('a', 'b', 'return a + b');
*/!*

let a = 1, b = 2;

*!*
// 필요한 값들이 매개변수로 전달되었음
alert( sum(a, b) ); // 3
*/!*
```

## 요약

문법

```js
let func = new Function(arg1, arg2, ..., body);
```

역사적인 이유로 인수들은 콤바로 구별된 리스트로 사용할 수 있습니다.

다음 세가지 표현은 똑같습니다. 

```js 
new Function('a', 'b', 'return a + b'); // 기본 문법
new Function('a,b', 'return a + b'); // 콤마로 구별된
new Function('a , b', 'return a + b'); // 콤마와 스페이스로 구별된
```

`new Function`으로 생성된 함수는 전역 렉시컬환경을 참조하는 `[[Environment]]`를 가지고 있습니다. 그러므로 그 함수는 외부 변수를 사용할 수 없습니다. 이것은 사실 에러를 방지하므로 좋은 현상입니다. 명시적으로 매개변수로 넘기는 것이 설계적으로 더 좋은 방법이고 minifiers와 문제가 생기지 않는 방법이기 때문입니다.
