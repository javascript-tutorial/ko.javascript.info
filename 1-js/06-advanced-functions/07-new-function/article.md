
# "새로운 기능"문법

함수를 만드는 또 다른 방법이 있습니다. 거의 사용되지 않지만 때로는 대안이 없습니다.

## 구문

함수를 만드는 구문 :

```js
let func = new Function ([arg1[, arg2[, ...argN]],] functionBody)
```

즉, 함수 매개 변수 (또는 더 정확하게는 그 이름)가 먼저 나오고 본문이 마지막입니다. 모든 인수는 문자열입니다.

예를보고 이해하는 것이 더 쉽습니다. 다음은 두 개의 인수가있는 함수입니다.

```js run
let sum = new Function('a', 'b', 'return a + b'); 

alert( sum(1, 2) ); // 3
```

인자가 없다면, 인자는 하나 뿐이며, 함수 몸체는 :

```js run
let sayHi = new Function('alert("Hello")');

sayHi(); // Hello
```

우리가 본 다른 방법과의 주요 차이점은 런타임에 전달되는 문자열로부터 문자 그대로 생성된다는 것입니다.

이전의 모든 선언에서는 프로그래머가 스크립트에 함수 코드를 작성해야했습니다.

그러나`new Function`은 임의의 문자열을 함수로 바꿀 수 있습니다. 예를 들어 서버에서 새로운 함수를 받아서 실행할 수 있습니다.

```js
let str = ... 동적으로 서버에서 코드를 수신 ...

let func = new Function(str);
func();
```

매우 특정한 경우, 예를 들어 서버에서 코드를 받거나 템플릿에서 함수를 동적으로 컴파일하는 경우와 같이 사용됩니다. 그 필요성은 대개 발전된 발전 단계에서 발생합니다.

## 클로져

대개 함수는 특별한 속성 인 `[[Environment]]`에서 태어난 곳을 기억합니다. 어휘 환경을 작성한 곳에서 참조합니다.

그러나 함수가`new Function`을 사용하여 생성되면, `[[Environment]]`는 현재 어휘 환경이 아니라 전역 어휘 환경을 참조합니다.

```js run

function getFunc() {
  let value = "test";

*!*
  let func = new Function('alert(value)');
*/!*

  return func;
}

getFunc()(); // error: value is not defined
```

일반적인 동작과 비교해보십시오.

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

이 새로운 기능의 특이한 점은 이상하게 보이지만 실제로는 매우 유용합니다.

문자열로 함수를 만들어야한다고 상상해보십시오. 이 함수의 코드는 스크립트를 작성할 당시에는 알지 못하기 때문에 (정규 함수를 사용하지 않는 이유가 여기에 해당됩니다) 실행 과정에서 알 수 있습니다. 서버 또는 다른 출처에서받을 수 있습니다.

우리의 새로운 기능은 메인 스크립트와 상호 작용해야합니다.

아마도 우리가 외부 지역 변수에 액세스 할 수 있기를 원할 것입니다.

문제는 JavaScript를 프로덕션에 게시하기 전에 추가 주석, 공백을 제거하여 코드를 줄이는 특수 프로그램 인 *minifier *를 사용하여 압축 한 것입니다. 중요한 것은 로컬 변수의 이름을 더 짧은 변수로 바꿉니다.

예를 들어, 함수가 `let userName`을 가지고 있다면, minifier는 그것을 `let a`(또는이 문자가 점유되어 있다면 다른 문자)로 대체하고, 모든 곳에서 그것을 수행합니다. 변수가 지역 변수이므로 함수 외부에있는 변수에 액세스 할 수 없으므로 대개 안전한 것입니다. 함수 내에서 minifier가 모든 함수를 대체합니다. Minifier는 똑똑하고 코드 구조를 분석하므로 아무 것도 깨뜨리지 않습니다. 그들은 바보 같은 찾기 및 교체가 아닙니다.

그러나`new Function`이 외부 변수에 접근 할 수 있다면`userName`을 찾을 수 없습니다. 코드가 축소 된 후에 * 문자열로 전달되기 때문입니다.

**`new function`에서 외부 어휘 환경에 접근 할 수 있다고하더라도 minifier에 문제가있을 수 있습니다.**

`new function`의 '특징'은 실수로부터 우리를 구해줍니다.

그리고 더 나은 코드를 시행합니다. `new Function`에 의해 생성 된 함수에 무언가를 전달해야한다면 명시 적으로 인수로 전달해야합니다.

우리의 "sum"함수는 실제로 그렇게합니다 :

```js run 
*!*
let sum = new Function('a', 'b', 'return a + b');
*/!*

let a = 1, b = 2;

*!*
// 외부 값은 인수로 전달됩니다
alert( sum(a, b) ); // 3
*/!*
```

## 요약

구문 :

```js
let func = new Function(arg1, arg2, ..., body);
```

역사적인 이유로 인수는 쉼표로 구분 된 목록으로 제공 될 수도 있습니다.

이 세 가지는 같은 의미입니다.

```js 
new Function('a', 'b', 'return a + b'); // basic syntax
new Function('a,b', 'return a + b'); // comma-separated
new Function('a , b', 'return a + b'); // comma-separated with spaces
```

`new Function`으로 생성 된 함수는 외부 환경이 아니라 전역 어휘 환경을 참조하는`[[Environment]]`를 가지고 있습니다. 따라서 외부 변수를 사용할 수 없습니다. 하지만 그것은 실제로 좋은 것입니다. 왜냐하면 오류로 인해 우리를 구할 수 없기 때문입니다. 매개 변수를 명시 적으로 전달하는 것은 구조적으로 훨씬 더 나은 방법이며 minifier를 사용하여 문제를 일으키지 않습니다.
