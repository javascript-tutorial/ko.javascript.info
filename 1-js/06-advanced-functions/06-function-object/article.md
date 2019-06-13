
# 함수 객체, NFE

자바스크립트에서 함수는 값이라는 것을 알고 있습니다.

자바스크립트의 모든 값은 타입을 가지고 있습니다. 함수의 타입은 무엇일까요?

자바스크립트에서 함수는 객체입니다.

좋은 의미에서 함수들이 호출할 수 있는 "행동하는 객체"라고 상상해 보세요. 프로퍼티를 추가/제거, 참고로 전달하는 것 등. 호출하기만 하는 것이 아니라 함수를 객체처럼 다루어야 합니다.


## "name" 프로퍼티

함수 객체는 몇 가지 사용 가능한 프로퍼티를 가지고 있습니다.

아래 예시처럼 "name" 프로퍼티를 사용하면 함수의 이름을 가져올 수 있죠.

```js run
function sayHi() {
  alert("Hi");
}

alert(sayHi.name); // sayHi
```

재밌는 건 이름을 할당하는 로직은 똑똑하다는 것입니다. 할당에 사용되는 함수에 올바른 이름을 지정합니다.

```js run
let sayHi = function() {
  alert("Hi");
}

alert(sayHi.name); // sayHi (works!)
```

기본값으로 적용해도 똑같이 작동합니다.
만약에 할당이 기본값을 통해 적용된 경우에도 똑같이 작동합니다.

```js run
function f(sayHi = function() {}) {
  alert(sayHi.name); // sayHi (works!)
}

f();
```

자바스크립트 명세서에 따르면, 이러한 기능을 "contextual name"이라고 합니다. 만약에 함수가 이것을 제공하지 않으면 할당할 때 컨텍스트에서 가져옵니다.

객체 메서드들도 이름들을 가지고 있습니다.

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

몇 가지 경우에는 올바른 이름을 지정해 줄 수 없는 경우도 있습니다. 이런 몇몇 경우에는 name 프로퍼티는 비어있습니다. 아래와 같이 말이죠.

```js
// 배열안에서 함수가 생성됨
let arr = [function() {}];

alert( arr[0].name ); // <빈 문자열>
// 엔진이 이름을 설정할 방법이 없으므로 존재하지 않음
```

실제로는 거의 모든 함수는 name을 가지고 있습니다.

## "length" 프로퍼티

또 다른 내부 프로퍼티인 "length"는 함수 매개변수의 개수를 반환합니다. 아래 예시가 있습니다.

```js run
function f1(a) {}
function f2(a, b) {}
function many(a, b, ...more) {}

alert(f1.length); // 1
alert(f2.length); // 2
alert(many.length); // 2
```

여기서 나머지 매개변수는 개수를 셀 때 포함되지 않습니다.

가끔 `length` 프로퍼티는 다른 함수들 안에서 동작하는 함수들의 내부검사에 사용됩니다.

예를 들면, 아래 코드의 함수 `ask`는 질문에 쓰일 `question`을 받는데, 이때 함수 내에서 호출 할 임의의 수의 `handler` 함수도 함께 받습니다.

사용자가 답을 제공하면, 함수는 핸들러를 호출합니다. 아래 예제에선 두 종류의 핸들러를 `ask` 함수에 전달하였습니다.

- 오직 사용자가 올바른 답을 제시해야만 호출되는 인수가 없는 함수.
- 어떤 경우에도 답을 반환하는 매개변수가 있는 함수

아이디어는 간단합니다. 인수가 없는 핸들러 구문은 긍정적인 경우에만(대부분의 경우), 다른하나는 다목적인 핸들러도 제공하기 위함입니다. 

`handlers` 를 바르게 호출하기 위해서는 `length` 프로퍼티를 검사해야 합니다.

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

// 정수의경우 두가지 핸들러 모두 호출
// 음수의 경우, 두번재것만 호출
ask("Question?", () => alert('You said yes'), result => alert(result));
```

위와 같이 특별한 경우를 [다형성(polymorphism)](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)) 이라고 부릅니다 -- 인수를 타입이나, 예제의 경우에는 `length`에 따라 다르게 다루는 경우입니다. 이러한 방법은 자바스크립트 라이브러리에서 사용됩니다.

## 커스텀 프로퍼티

또한 자체적으로 만든 프로퍼티도 추가할 수 있습니다.

다음 예시는 `counter` 프로퍼티를 추가해 몇 번 호출되었는지 추적합니다.

```js run
function sayHi() {
  alert("Hi");
  
  *!*
  // 몇 번 동작하는지 세어봅니다
  sayHi.counter++;
  */!*
}
sayHi.counter = 0; // 초기값

sayHi(); // Hi
sayHi(); // Hi

alert( `Called ${sayHi.counter} times` ); // 2번 호출되었습니다
```

```warn header="프로퍼티는 변수가 아닙니다."
`sayHi.counter = 0`와 같이 함수에 할당된 프로퍼티는 함수 내에 지역변수 `counter`를 만들지 않습니다. `counter` 프로퍼티와 변수 `let counter` 는 상관관계가 없습니다.

함수를 객체처럼 다룰 수 있고, 객체엔 프로퍼티를 저장할 수 있습니다. 하지만 이런 특징이 실행에는 아무 영향을 주지 않습니다. 변수는 함수의 프로퍼티가 아니고 함수의 프로퍼티는 변수가 아닙니다. 공통점이 없죠.
```

가끔 함수 프로퍼티들은 클로져(Closures)들을 대체할 수 있습니다. 예를 들면, <info:closure> 챕터에 있는 카운터 함수의 예를 함수 프로퍼티를 사용하는 방법으로 다시 작성할 수 있습니다.  

```js run
function makeCounter() {
  // 다음과 같이 하는 대신에
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

여기서 `count`는 외부 렉시컬 환경이 아니라 함수에 바로 저장되어 있습니다.   

클로저를 사용하는 것보다 좋은 방법일까요? 아닐까요?

가장 다른 점은, 만약 `count`의 값이 외부변수에 존재한다면 외부코드에서는 접근할 수 없다는 것입니다. 오직 중첩함수만이 수정할 수 있을 것입니다. 그리고 만약 그것이 함수에 연결되돼있는 상황이라면 그때는 외부에서도 접근이 가능할 것입니다.

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

그렇다면 구현하는 방법의 선택은 목적에 따라 다를 것입니다.

## NFE(명시된 함수 표현식)

명시된 함수표현 식 또는 NFE란 이름을 가진 함수표현 식을 뜻하는 용어입니다.

일반적인 함수표현 식을 예로 들어보겠습니다.

```js
let sayHi = function(who) {
  alert(`Hello, ${who}`);
};
```

그리고 여기에 이름을 붙여보겠습니다.

```js
let sayHi = function *!*func*/!*(who) {
  alert(`Hello, ${who}`);
};
```

여기서 무언가 얻은 게 있을까요? `"func"`이름을 붙이는 목적은 무엇일까요?

첫 번째로 함수표현 식을 사용합니다. `"func"`이름을 `function`다음에 붙이는 것은 함수를 정의하지는 않습니다. 왜냐하면 여전히 대입 표현형식의 한 부분이기 때문입니다.

이름을 추가하는 것이 무언가를 망가뜨리지도 않았습니다.

함수는 아직도 `sayHi()`로 사용 가능하죠.

```js run
let sayHi = function *!*func*/!*(who) {
  alert(`Hello, ${who}`);
};

sayHi("John"); // Hello, John
```

`func`이름에는 두 가지 특별한 점이 있습니다.

1. 그것은 함수에 내부적으로 자신을 레퍼런스합니다.
2. 그것은 함수 외부에서 보이지 않습니다.

예를 들어, 함수 `sayHi` 아래에서 `who`가 주어지지 않았을 때 자신을 `"Guest"` 로 부르면

```js run
let sayHi = function *!*func*/!*(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    func("Guest"); // func를 사용해서 스스로를 호출 합니다.
*/!*
  }
};

sayHi(); // Hello, Guest

// 그러나 이건 동작하지 않습니다.
func(); // 에러 func 는 정의되지 않았습니다. (함수 밖에서는 보이지 않습니다)
```

`func`를 사용하는 사람이 있나요? 아마도 중첩함수를 부를 때는 `sayHi`를 사용하지 않습니까? 


사실 대부분의 경우 아래와 같이 작성하겠죠.

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

위의 코드의 문제점은 `sayHi`의 value가 바뀔 수 있다는 것입니다. 아마도 함수는 다른 변숫값으로 갈 수 있고 코드가 동작한다면 에러를 출력할 것입니다.

```js run
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    sayHi("Guest"); // 에러 sayHi 는 함수가 아님
*/!*
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // 에러 중첩된 sayHi는 더 이상 작동하지 않습니다!
```

이런 현상이 일어나는 것은 `sayHi` 함수를 외부 렉시컬 환경에서 가져오기 때문입니다. 지역적으로(local) `sayHi` 는 없습니다. 그래서 외부변수가 사용된 것입니다. 외부의 `sayHi`를 호출하면 `null`인 것입니다.

함수 표현식에 이름을 붙이는 것은 정확히 이러한 문제를 해결합니다.

다음 코드를 수정해 봅시다.

```js run
let sayHi = function *!*func*/!*(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    func("Guest"); // 지금은 괜찮습니다
*/!*
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Hello, Guest (중첩함수가 작동합니다)
```

`"func"`가 함수의 내부(function-local)이기 때문에 지금은 작동합니다. 그건 밖에서 가져온 값이 아닙니다(그리고 밖에선 보이지도 않습니다). 규격에 의하면 항상 현재 함수를 레퍼런스합니다.

외부코드는 아직도 `sayHi` 또는 `welcome` 변수를 가지고 있습니다. 그리고 `func` 이 내부 함수 이름입니다. 어떻게 함수가 자신을 내부에서 부를 수 있을까요.

```smart header="함수 선언과는 관련이 없습니다"
"내부 이름" 기능은 함수 선언가 아니라 오직 함수 표현 식에서만 가능합니다. 함수를 정의할 때는 내부 이름을 명시할 문법은 존재하지 않습니다.

가끔, 내부이름이 필요할 때 함수 선언를 명시된 함수표현 식으로 다시 작성할 뿐입니다.
```

## 요약

함수는 객체입니다.

다음 함수 프로퍼티들에 대해 알아보았습니다.

- `name` -- 함수의 이름. 함수를 정의할 때만 명시할 수 있는 게 아니라 할당하거나 객체 프로퍼티로도 가능합니다.
- `length` -- 함수 선언에 있는 인수들의 수. 나머지 연산자들은 세지 않는다.

만약 함수가 함수 표현식으로 되었다면(중요한 코드의 흐름이 아니라면), 그리고 이름을 가지고 있다면 그것은 명시된(이름을 가진) 함수 표현식입니다. 그 이름은 내부에서 재귀적인 호출 같은 레퍼런스 용도로 사용될 수 있습니다.

또한 함수들은 추가적인 프로퍼티를 가질 수 있습니다. 자바스크립트에서 많이 알려진 라이브러리들은 이러한 특징을 훌륭하게 사용하고 있습니다.

라이브러리들은 "main" 함수를 생성하고 다른 많은 "helper" 함수를 붙입니다. 예를 들면 [jQuery](https://jquery.com) 라이브러리는 함수의 이름을 `$`라고 사용합니다. [lodash](https://lodash.com) 라이브러리는 `_`이라는 이름을 사용합니다. 그리고 `_.clone`, `_.keyBy` 같은 함수를 만들었으며 그것들을 배우기 위한 다른 프로퍼티들도 있습니다. ([docs](https://lodash.com/docs) 참고) 사실, 그것들은 전역 지역에 오염을 막기 위한 것입니다. 그래서 하나의 라이브러리는 오직 하나의 전역 변수를 제공하죠. 혹시 일어날 수 있는 이름 충돌을 방지하는 것입니다.

그래서 함수는 스스로 유용한 작업을 행할 수도 있고 다른 여러 기능을 프로퍼티에 가지고 있을 수 있는 것입니다.
