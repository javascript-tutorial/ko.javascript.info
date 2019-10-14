
# "새로운 함수" 문법

제한적으로 사용하지만, 함수를 생성하는데 한 가지 방법이 더 있습니다. 가끔은 이 방법 외에는 대안이 없을 때도 있죠.

## 문법

함수를 만드는 문법은 아래와 같습니다:

```js
let func = new Function ([arg1[, arg2[, ...argN]],] functionBody)
```

함수의 매개 변수(또는 정확히는 함수들의 이름)가 먼저 오고, 본문이 마지막에 따라옵니다. 모든 인수는 문자열입니다. 

함수와 두 개의 인수가 있는 아래의 예제를 통해 좀 더 쉽게 이해해 보겠습니다.

```js run
let sum = new Function('a', 'b', 'return a + b'); 

alert( sum(1, 2) ); // 3
```

만약에 인수들이 없다면 오직 하나의 함수 본문을 가진 인수만이 있습니다:

```js run
let sayHi = new Function('alert("Hello")');

sayHi(); // Hello
```

함수가 문자 그대로 실행될 때 넘겨진다는 것이 가장 다른 점입니다.

이전의 모든 함수의 코드 선언문은 스크립트 안에서 쓰였습니다.

그러나 `new Function`이라는 문법은 어떠한 문자열을 함수로 바꾸어주는 역활을 합니다. 예를 들면, 새로운 함수를 서버에서 받아서 실행해야 할 때처럼 말이죠.

```js
let str = ... receive the code from a server dynamically ...

let func = new Function(str);
func();
```

위와 같은 예제는 굉장히 특정한 상황에만 사용됩니다. 서버로부터 코드를 받아올 때 아니면 템플릿으로 부터 함수를 유동적으로 컴파일할 때입니다. 이런 것들이 필요할 때는 좀 더 고급스러운 개발단계가 필요할 때입니다.

## 클로져

Usually, a function remembers where it was born in the special property `[[Environment]]`. It references the Lexical Environment from where it's created  (we covered that in the chapter <info:closure>).

But when a function is created using `new Function`, its `[[Environment]]` is set to reference not the current Lexical Environment, but the global one.

So, such function doesn't have access to outer variables, only to the global ones.

```js run
function getFunc() {
  let value = "test";

*!*
  let func = new Function('alert(value)');
*/!*

  return func;
}

getFunc()(); // 에러값이 정의되지 않음
```

아래 예제는 일반적인 표현입니다. 비교해보세요:

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

문자열로부터 함수를 만들어야 하는 상황이 있어야 한다고 생각해보면. 그 함수의 코드는 스크립트를 작성할 때는 알 수 없습니다. (그래서 보통 함수를 사용하지 않죠) 그러나, 서버 또는 다른 출처로부터 받게 되는 것을 실행되는 프로세스는 알 수 있습니다.

새로운 함수는 메인 스크립트와 상호작용해야 할 것입니다.

그런데 혹시 그렇게 생성된 함수가 외부의 지역변수에 접근해야 한다면 어떨까요?

문제는 자바스크립트가 운영에 반영되기 직전에 있습니다. 자바스크립트는 *minifier*라는 특수한 프로그램에 의해 압축됩니다 -- 코드의 특수한 주석이나 빈칸 -- 더 중요한 건 minifier가 지역변수를 짧은 이름으로 바꾸는 것 입니다.

예를 들어, 만약에 함수가 `let userName` 를 가지고 있다면 minifier 는 그것을 `let a`로 (`let a`을 어딘가 사용하고 있다면 다른 문자로) 대체합니다. 그리고 이런 작업은 모든 코드에서 진행됩니다. 보통 이런 작업은 값들이 지역변수라 안전하지만, 이름이 바뀌어서 외부 함수에서는 접근할 수 없게 됩니다. 그리고 함수의 내부에서 minifier는 선언된 모든 곳을 수정합니다. Minifiers 는 똑똑하고 코드의 구조를 분석하기 때문에 무조건 찾아서 바꾸지는 않기 때문에 어떠한 곳도 망가뜨리진 않지만,

만약 `new Function` 구문이 외부 변수들에 접근하려 한다면 *이후의* 코드는 minified 되었기 때문에 `userName` 이라는 것은 찾을 수 없을 것입니다. 

**`new Function` 문법이 외부 렉시컬 환경에 접근할 수 있더라도 minifiers에 의한 문제는 여전히 발생할 수 있습니다.**

이런 실수로부터 예방하기 위해 `new Function`에는 특별한 기능이 있습니다.

Besides, such code would be architecturally bad and prone to errors.

To pass something to a function, created as `new Function`, we should use its arguments.

## Summary

The syntax:

```js
let func = new Function(arg1, arg2, ..., body);
```

오래전부터 인수들은 콤마로 구별된 리스트로 사용할 수 있습니다.

These three declarations mean the same:

```js 
new Function('a', 'b', 'return a + b'); // 기본 문법
new Function('a,b', 'return a + b'); // 콤마로 구별된
new Function('a , b', 'return a + b'); // 콤마와 스페이스로 구별된
```

Functions created with `new Function`, have `[[Environment]]` referencing the global Lexical Environment, not the outer one. Hence, they cannot use outer variables. But that's actually good, because it insures us from errors. Passing parameters explicitly is a much better method architecturally and causes no problems with minifiers.
