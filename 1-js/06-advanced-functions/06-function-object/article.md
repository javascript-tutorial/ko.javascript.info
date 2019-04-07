
# 함수 개체, NFE

이미 알고 있듯이 JavaScript의 함수는 값입니다.

JavaScript의 모든 값에는 유형이 있습니다. 어떤 유형의 함수입니까?

자바 스크립트에서 함수는 객체입니다.

함수를 상상하는 좋은 방법은 호출 가능한 "액션 객체"입니다. 우리는 객체를 호출 할 수있을뿐만 아니라 속성을 추가 / 제거하거나 참조로 전달할 수 있습니다.


## "name"속성

함수 객체는 몇 가지 유용한 속성을 포함합니다.

예를 들어 함수의 이름은 "name"속성으로 액세스 할 수 있습니다.

```js run
function sayHi() {
  alert("Hi");
}

alert(sayHi.name); // sayHi
```

더 재미있는 것은 이름 지정 논리가 똑똑하다는 것입니다. 또한 할당에 사용되는 함수에 올바른 이름을 지정합니다.

```js run
let sayHi = function() {
  alert("Hi");
}

alert(sayHi.name); // sayHi (works!)
```

또한 할당이 기본값을 통해 수행되는 경우에도 작동합니다.

```js run
function f(sayHi = function() {}) {
  alert(sayHi.name); // sayHi (works!)
}

f();
```

이 사양에서이 기능을 "컨텍스트 이름"이라고합니다. 함수가 하나를 제공하지 않으면 할당에서 문맥으로부터 계산됩니다.

객체 메소드에도 이름이 있습니다.

```js run
let user = {

  sayHi() {
    // ...
  },

  sayBye: function() {
    // ...
  }

}

alert(user.sayHi.name); // sayHi
alert(user.sayBye.name); // sayBye
```

그래도 마법은 없습니다. 올바른 이름을 찾는 방법이없는 경우가 있습니다. 이 경우 name 속성은 다음과 같이 비어 있습니다.

```js
// function created inside array
let arr = [function() {}];

alert( arr[0].name ); // <empty string>
// the engine has no way to set up the right name, so there is none
```

In practice, however, most functions do have a name.

## "길이"속성

함수 매개 변수의 수를 반환하는 또 다른 기본 제공 속성 "length"가 있습니다. 예를 들면 다음과 같습니다.

```js run
function f1(a) {}
function f2(a, b) {}
function many(a, b, ...more) {}

alert(f1.length); // 1
alert(f2.length); // 2
alert(many.length); // 2
```

여기서 우리는 나머지 매개 변수가 계산되지 않음을 알 수 있습니다.

`length` 속성은 때로는 다른 함수에서 작동하는 함수에서의 내성 검사에 사용됩니다.

예를 들어, 아래의 코드에서`ask` 함수는 호출 할`question`과 호출 할`handler` 함수의 임의의 수를 받아들입니다.

사용자가 대답을 제공하면 함수는 핸들러를 호출합니다. 두 종류의 핸들러를 전달할 수 있습니다.

- 사용자가 긍정적 인 대답을 줄 때만 호출되는 인수가없는 함수입니다.
- 인수가있는 함수로, 대 / 소문자로 호출되고 응답을 반환합니다.

생각은 긍정적 인 경우 (가장 빈번한 변종)에 대해 단순하고 인자없는 핸들러 구문이 있지만 보편적 인 핸들러도 제공 할 수 있다는 것입니다.

`핸들러` 를 올바른 방법으로 호출하기 위해, 우리는 `length` 속성을 검사합니다 :

```js run
function ask(question, ...handlers) {
  let isYes = confirm(question);

  for(let handler of handlers) {
    if (handler.length == 0) {
      if (isYes) handler();
    } else {
      handler(isYes);
    }
  }

}

// 양수 응답의 경우 두 핸들러가 호출됩니다.
// 부정 응답의 경우, 두 번째 응답 만
ask("Question?", () => alert('You said yes'), result => alert(result));
```

이것은 소위 말하는 특별한 경우입니다. [다형성](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)) -- 그들의 타입에 따라 다르게 다루거나, 우리의 경우에는`길이`에 의존한다. 이 아이디어는 JavaScript 라이브러리에서 사용됩니다.

## 사용자 정의 속성

우리는 또한 우리 자신의 속성을 추가 할 수 있습니다.

여기에 총 호출 수를 추적하는`counter` 속성을 추가합니다 :

```js run
function sayHi() {
  alert("Hi");

  *!*
  // 우리가 몇 번이나 뛰는지 세어 봅시다.
  sayHi.counter++;
  */!*
}
sayHi.counter = 0; // initial value

sayHi(); // Hi
sayHi(); // Hi

alert( `Called ${sayHi.counter} times` ); // Called 2 times
```

```warn header="A property is not a variable"
`sayHi.counter = 0`과 같은 함수에 할당 된 속성은 그 안에 지역 변수`counter '를 정의하지 않습니다. 즉, 'counter'속성과 'let counter'변수는 서로 관련이없는 두 가지 항목입니다.

우리는 함수를 객체로 취급하고 속성을 저장하지만 그 실행에는 아무런 영향을 미치지 않습니다. 변수는 절대로 함수 속성을 사용하지 않으며 반대의 경우도 마찬가지입니다. 이들은 단지 평행 세계입니다.
```

함수 속성은 때때로 클로저를 대체 할 수 있습니다. 예를 들어 함수 함수를 사용하려면 <info:closure> 장에서 카운터 함수 예제를 다시 작성할 수 있습니다.

```js run
function makeCounter() {
  // instead of:
  // let count = 0

  function counter() {
    return counter.count++;
  };

  counter.count = 0;

  return counter;
}

let counter = makeCounter();
alert( counter() ); // 0
alert( counter() ); // 1
```

`count`는 이제 외부 어휘 환경이 아닌 함수에 직접 저장됩니다.

클로저를 사용하는 것보다 좋든 나쁘지 않습니까?

가장 큰 차이점은`count`의 값이 외부 변수에있는 경우 외부 코드가 외부 변수에 액세스 할 수 없다는 것입니다. 중첩 된 함수 만 수정할 수 있습니다. 그리고 그것이 함수에 묶여 있다면, 그런 일이 가능합니다 :

```js run
function makeCounter() {

  function counter() {
    return counter.count++;
  };

  counter.count = 0;

  return counter;
}

let counter = makeCounter();

*!*
counter.count = 10;
alert( counter() ); // 10
*/!*
```

따라서 구현의 선택은 우리의 목표에 달려 있습니다.

## Named Function Expression

명명 된 함수 식 NFE는 이름이있는 함수 식에 대한 용어입니다.

예를 들어, 일반적인 Function Expression을 살펴 보겠습니다.
```js
let sayHi = function(who) {
  alert(`Hello, ${who}`);
};
```

그리고 그것에 이름을 추가하십시오 :

```js
let sayHi = function *!*func*/!*(who) {
  alert(`Hello, ${who}`);
};
```

우리가 여기서 무엇을 얻었습니까? 추가 된 "func"이름의 목적은 무엇입니까?

먼저 Function Expression을 가지고 있음을 주목하십시오. `function` 다음에``func``라는 이름을 추가해도 함수 선언이되지 않습니다. 왜냐하면 그것이 여전히 할당 표현식의 일부로 생성 되었기 때문입니다.

그런 이름을 추가해도 아무 것도 깨뜨리지 못했습니다.

이 함수는 여전히`sayHi ()`로 사용할 수 있습니다 :

```js run
let sayHi = function *!*func*/!*(who) {
  alert(`Hello, ${who}`);
};

sayHi("John"); // Hello, John
```

`func`이라는 이름에는 두 가지 특별한 것들이 있습니다 :

1. 함수가 내부적으로 자신을 참조 할 수있게합니다.
2. 함수 밖에서는 보이지 않습니다.

예를 들어,`sayHi` 함수는`who`가 제공되지 않으면``Guest``로 다시 호출합니다 :

```js run
let sayHi = function *!*func*/!*(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    func("Guest"); // use func to re-call itself
*/!*
  }
};

sayHi(); // Hello, Guest

// But this won't work:
func(); // Error, func is not defined (not visible outside of the function)
```

왜 우리는`func`을 사용합니까? 아마도`sayHi`를 중첩 호출에 사용하겠습니까?


실제로 대부분의 경우 다음과 같은 작업을 수행 할 수 있습니다.

```js
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    sayHi("Guest");
*/!*
  }
};
```

이 코드의 문제점은`sayHi '값이 변경 될 수 있다는 것입니다. 함수가 다른 변수로 갈 수 있으며 코드에서 오류가 발생합니다.

```js run
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    sayHi("Guest"); // 오류 : sayHi는 함수가 아닙니다.
*/!*
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // 오류, 중첩 된 sayHi 호출이 더 이상 작동하지 않습니다!
```

이것은 함수가 외부 어휘 환경에서`sayHi`를 사용하기 때문에 발생합니다. 지역 sayHi가 없으므로 외부 변수가 사용됩니다. 그리고 외침의 순간에 바깥 쪽`sayHi`는`null`입니다.

함수 표현식에 넣을 수있는 선택적 이름은 이러한 종류의 문제를 정확하게 해결하기위한 것입니다.

코드를 수정하여 사용하자.

```js run
let sayHi = function *!*func*/!*(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    func("Guest"); // Now all fine
*/!*
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Hello, Guest (nested call works)
```

``func ''라는 이름이 함수 - 지역이기 때문에 이제는 작동합니다. 외부에서 가져온 것이 아니며 거기에서 볼 수 없습니다. 사양은 항상 현재 함수를 참조한다는 것을 보장합니다.

바깥 쪽 코드는 여전히 변수`sayHi` 또는`welcome`을 가지고 있습니다. 그리고`func`은 함수가 내부적으로 어떻게 호출 할 수 있는지를 나타내는 "내부 함수 이름"입니다.

```smart header="There's no such thing for Function Declaration"
여기에 설명 된 "내부 이름"기능은 Function Expressions에만 사용할 수 있으며 Function Declarations에는 사용할 수 없습니다. Function Declarations의 경우, 하나의 "내부"이름을 추가 할 수있는 구문이 없습니다.

때로는 신뢰할 수있는 내부 이름이 필요할 때 함수 선언을 명명 된 함수 식 형식으로 다시 작성해야하는 경우가 있습니다.
```

## 요약

함수는 객체입니다.

여기에 우리는 그들의 속성을 다뤘습니다.

-`name` - 함수 이름. 함수 정의에서뿐만 아니라 할당 및 객체 속성에도 제공됩니다.
-`length` - 함수 정의에있는 인자의 수. 나머지 매개 변수는 계산되지 않습니다.

함수가 함수 표현식 (주 코드 플로우가 아닌)으로 선언되고 이름을 전달하면 명명 된 함수 표현식이라고합니다. 이름은 재귀 호출 등을 위해 내부에서 참조 할 때 사용할 수 있습니다.

또한 함수에는 추가 속성이있을 수 있습니다. 많은 잘 알려진 JavaScript 라이브러리가이 기능을 유용하게 사용합니다.

그들은 "main"함수를 만들고 그것에 다른 많은 "helper"함수를 붙입니다. 예를 들어, the [jquery](https://jquery.com) 라이브러리는 이름이 지정된 함수를 만듭니다. `$`. 
The [lodash](https://lodash.com) 라이브러리는`_` 함수를 생성합니다. 그리고 나서 `_.clone`, `_.keyBy` 그리고 다른속성들을 (see the [docs](https://lodash.com/docs) 
그(것)들에 관하여 더 많은 것을 배우고 싶을 때). 사실 그들은 지구 공간의 오염을 줄이기 위해 그것을합니다. 그래서 단일 도서관은 하나의 지구 변수를 제공합니다. 이렇게하면 명명 충돌의 가능성이 줄어 듭니다.

따라서 함수는 유용한 작업을 단독으로 수행 할 수 있으며 속성에서 다른 기능을 수행 할 수도 있습니다.
