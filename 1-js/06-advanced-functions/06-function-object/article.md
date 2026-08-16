
# 객체로서의 함수와 기명 함수 표현식

자바스크립트에서 함수는 값으로 취급됩니다. 이에 대해선 이미 배워서 알고 계실 겁니다.

모든 값은 자료형을 가지고 있는데, 그렇다면 함수의 자료형은 무엇일까요?

함수는 객체입니다.

함수는 호출이 가능한(callable) '행동 객체'라고 이해하면 쉽습니다. 우리는 함수를 호출 할 수 있을 뿐만 아니라 객체처럼 함수에 프로퍼티를 추가·제거하거나 참조를 통해 전달할 수도 있습니다.


## 'name' 프로퍼티

함수 객체엔 몇 가지 쓸만한 프로퍼티가 있습니다.

'name' 프로퍼티를 사용하면 함수 이름을 가져올 수 있죠.

```js run
function sayHi() {
  alert("Hi");
}

alert(sayHi.name); // sayHi
```

함수 객체에 이름을 할당해주는 로직은 아주 똑똑해서 익명 함수라도 자동으로 이름이 할당됩니다.

```js run
let sayHi = function() {
  alert("Hi");
};

alert(sayHi.name); // sayHi (익명 함수이지만 이름이 있네요!)
```

기본값을 사용해 이름을 할당한 경우에도 마찬가지죠.

```js run
function f(sayHi = function() {}) {
  alert(sayHi.name); // sayHi (이름이 있네요!)
}

f();
```

자바스크립트 명세서에서 정의된 이 기능을 'contextual name'이라고 부릅니다. 이름이 없는 함수의 이름을 지정할 땐 컨텍스트에서 이름을 가져오죠.

객체 메서드의 이름도 'name' 프로퍼티를 이용해 가져올 수 있습니다.

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

그런데 객체 메서드 이름은 함수처럼 자동 할당이 되지 않습니다. 적절한 이름을 추론하는 게 불가능한 상황이 있는데, 이때 name 프로퍼티엔 빈 문자열이 저장됩니다. 아래와 같이 말이죠.

```js run
// 배열 안에서 함수를 생성함
let arr = [function() {}];

alert( arr[0].name ); // <빈 문자열>
// 엔진이 이름을 설정할 수 없어서 name 프로퍼티의 값이 빈 문자열이 됨
```

실무에서 대부분의 함수는 이름이 있으므로 위와 같은 상황은 잘 발생하지 않습니다.

## 'length' 프로퍼티

내장 프로퍼티 `length`는 함수 매개변수의 개수를 반환합니다. 예시를 살펴봅시다.

```js run
function f1(a) {}
function f2(a, b) {}
function many(a, b, ...more) {}

alert(f1.length); // 1
alert(f2.length); // 2
alert(many.length); // 2
```

위 예시를 통해 나머지 매개변수는 개수에 포함되지 않는다는 사실 또한 확인해 보았습니다.

한편, `length` 프로퍼티는 다른 함수 안에서 동작하는 함수의 [타입을 검사(type introspection)](https://en.wikipedia.org/wiki/Type_introspection) 할 때도 종종 사용됩니다.

질문에 쓰일 `question`과 질문에 대한 답에 따라 호출할 임의의 수의 `handler` 함수를 함께 받는 함수 `ask`를 예시로 이에 대해 알아봅시다.

사용자가 답을 제출하면 `ask`는 핸들러 함수를 호출합니다. 이때 우리는 두 종류의 핸들러 함수를 `ask`에 전달할 수 있습니다.

- 인수가 없는 함수로, 사용자가 OK를 클릭했을 때만 호출됨
- 인수가 있는 함수로, 사용자가 OK를 클릭하든 Cancel을 클릭하든 호출됨

그리고 `handler.length` 프로퍼티를 사용하면 상황에 맞는 `handler`를 호출할 수 있습니다.

사용자가 긍정적인 대답을 했을 때 사용 할 인수가 없는 핸들러를 하나 만들고, 사용자의 응답 종류와 관계없이 범용적으로 사용할만한 핸들러도 구축해 `ask` 내부에서 `handler.length`와 함께 사용하면 되죠.

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

// 사용자가 OK를 클릭한 경우, 핸들러 두 개를 모두 호출함 
// 사용자가 Cancel을 클릭한 경우, 두 번째 핸들러만 호출함
ask("질문 있으신가요?", () => alert('OK를 선택하셨습니다.'), result => alert(result));
```

인수의 종류에 따라(위 예시에선 인수의 `length` 프로퍼티 값에 따라) 인수를 다르게 처리하는 방식을 프로그래밍 언어에선 [다형성(polymorphism)](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)) 이라고 부릅니다. 자바스크립트 라이브러리를 뜯어보다 보면 다형성이 곳곳에서 사용되고 있다는 것을 확인할 수 있습니다.

## 커스텀 프로퍼티

함수에 자체적으로 만든 프로퍼티를 추가할 수도 있습니다.

이런 특징을 이용해 함수 호출 횟수를 `counter` 프로퍼티에 저장해보겠습니다. 

```js run
function sayHi() {
  alert("Hi");
  
  *!*
  // 함수를 몇 번 호출했는지 세봅시다.
  sayHi.counter++;
  */!*
}
sayHi.counter = 0; // 초깃값

sayHi(); // Hi
sayHi(); // Hi

alert( `호출 횟수: ${sayHi.counter}회` ); // 호출 횟수: 2회
```

```warn header="프로퍼티는 변수가 아닙니다."
`sayHi.counter = 0`와 같이 함수에 프로퍼티를 할당해도 함수 내에 지역변수 `counter`가 만들어지지 않습니다. `counter` 프로퍼티와 변수 `let counter`는 전혀 관계가 없습니다.

프로퍼티를 저장하는 것처럼 함수를 객체처럼 다룰 수 있지만, 이는 실행에 아무 영향을 끼치지 않습니다. 변수는 함수 프로퍼티가 아니고 함수 프로퍼티는 변수가 아니기 때문입니다. 둘 사이에는 공통점이 없습니다.
```

클로저는 함수 프로퍼티로 대체할 수 있습니다. <info:closure> 챕터에서 살펴본 바 있는 counter 함수를 함수 프로퍼티를 사용해 바꿔보도록 하겠습니다. 

```js run
function makeCounter() {

  // let count = 0 대신 아래 메서드(프로퍼티)를 사용함
  
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

이제 `count`는 외부 렉시컬 환경이 아닌 함수 프로퍼티에 바로 저장됩니다.   

그런데 과연 이렇게 함수 프로퍼티에 정보를 저장하는 게 클로저를 사용하는 것보다 나은 방법일까요?

두 방법의 차이점은 `count` 값이 외부 변수에 저장되어있는 경우 드러납니다. 클로저를 사용한 경우엔 외부 코드에서 `count`에 접근할 수 없습니다. 오직 중첩함수 내에서만 `count` 값을 수정할 수 있습니다. 반면 함수 프로퍼티를 사용해 `count`를 함수에 바인딩시킨 경우엔 다음 예시와 같이 외부에서 값을 수정할 수 있습니다.

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

따라서 구현 방법은 목적에 따라 선택하면 될 것 같습니다.

## 기명 함수 표현식

기명 함수 표현식(Named Function Expression, NFE)은 이름이 있는 함수 표현식을 나타내는 용어입니다.

먼저, 일반 함수 표현식을 살펴봅시다.

```js
let sayHi = function(who) {
  alert(`Hello, ${who}`);
};
```

여기에 이름을 붙여보겠습니다.

```js
let sayHi = function *!*func*/!*(who) {
  alert(`Hello, ${who}`);
};
```

이렇게 이름을 붙인다고 해서 뭐가 달라지는 걸까요? `"func"`이라는 이름은 어떤 경우에 붙이는 걸까요?

먼저 이렇게 이름을 붙여도 위 함수는 여전히 함수 표현식이라는 점에 주목해야 합니다. `function` 뒤에 `"func"`이라는 이름을 붙이더라도 여전히 표현식을 할당한 형태를 유지하기 때문에 함수 선언문으로 바뀌지 않습니다.

이름을 추가한다고 해서 기존에 동작하던 기능이 동작하지 않는 일은 발생하지 않습니다.

`sayHi()`로 호출하는 것도 여전히 가능합니다.

```js run
let sayHi = function *!*func*/!*(who) {
  alert(`Hello, ${who}`);
};

sayHi("John"); // Hello, John
```

대신 `func`과 같은 이름을 붙이면 두 가지가 변화가 생깁니다. 이 두 변화 때문에 기명 함수 표현식을 사용하는 것이죠.

1. 이름을 사용해 함수 표현식 내부에서 자기 자신을 참조할 수 있습니다.
2. 기명 함수 표현식 외부에선 그 이름을 사용할 수 없습니다.

함수 `sayHi`를 예시로 이에 대해 살펴봅시다. 함수 `sayHi`는 `who`에 값이 없는 경우, 인수 `"Guest"`를 받고 자기 자신을 호출합니다.

```js run
let sayHi = function *!*func*/!*(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    func("Guest"); // func를 사용해서 자신을 호출합니다.
*/!*
  }
};

sayHi(); // Hello, Guest

// 하지만 아래와 같이 func를 호출하는 건 불가능합니다.
func(); // Error, func is not defined (기명 함수 표현식 밖에서는 그 이름에 접근할 수 없습니다.)
```

그런데 여기서 왜 중첩 호출을 할 때 `sayHi`대신 `func`을 사용했을까요? 


사실 대부분의 개발자는 아래와 같이 코드를 작성하곤 합니다.

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

하지만 이렇게 코드를 작성하면 외부 코드에 의해 `sayHi`가 변경될 수 있다는 문제가 생깁니다. 함수 표현식을 새로운 변수에 할당하고, 기존 변수에 `null`을 할당하면 에러가 발생하죠.

```js run
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    sayHi("Guest"); // TypeError: sayHi is not a function
*/!*
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // 중첩 sayHi 호출은 더 이상 불가능합니다!
```

에러는 함수가 `sayHi`를 자신의 외부 렉시컬 환경에서 가지고 오기 때문에 발생합니다. 지역(local) 렉시컬 환경엔 `sayHi`가 없기 때문에 외부 렉시컬 환경에서 `sayHi`를 찾는데, 함수 호출 시점에 외부 렉시컬 환경의 `sayHi`엔 `null`이 저장되어있기 때문에 에러가 발생합니다.

함수 표현식에 이름을 붙여주면 바로 이런 문제를 해결할 수 있습니다.

코드를 수정해 봅시다.

```js run
let sayHi = function *!*func*/!*(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    func("Guest"); // 원하는 값이 제대로 출력됩니다.
*/!*
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Hello, Guest (중첩 호출이 제대로 동작함)
```

`"func"`이라는 이름은 함수 지역 수준(function-local)에 존재하므로 외부 렉시컬 환경에서 찾지 않아도 됩니다. 외부 렉시컬 환경에선 보이지도 않죠. 함수 표현식에 붙인 이름은 현재 함수만 참조하도록 명세서에 정의되어있기 때문입니다.

이렇게 기명 함수 표현식을 이용하면 `sayHi`나 `welcome` 같은 외부 변수의 변경과 관계없이 `func`이라는 '내부 함수 이름'을 사용해 언제든 함수 표현식 내부에서 자기 자신을 호출할 수 있습니다.

```smart header="함수 선언문엔 내부 이름을 지정할 수 없습니다."
지금까지 살펴본 '내부 이름'은 함수 표현식에만 사용할 수 있고, 함수 선언문엔 사용할 수 없습니다. 함수 선언문엔 '내부' 이름을 지정할 수 있는 문법이 없습니다.

개발을 하다 보면 믿을만한 내부 이름이 필요할 때가 생기곤 합니다. 이 때 바로 함수 선언문을 기명 함수 표현식으로 다시 정의하면 됩니다.
```

## 요약

함수는 객체입니다.

이번 챕터에선 객체로서의 함수에서 사용 할 수 있는 프로퍼티 두 가지를 다뤄보았습니다.

- `name` -- 함수의 이름이 저장됩니다. 대개는 함수 선언부에서 이름을 가져오는데, 선언부에 이름이 없는 경우엔 자바스크립트 엔진이 컨텍스트(할당 등)를 이용해 이름을 추론합니다.
- `length` -- 함수 선언부에 있는 인수의 수로 나머지 매개변수는 포함되지 않습니다.

함수 표현식으로 함수를 정의하였는데 이름이 있다면 이를 기명 함수 표현식이라 부릅니다. 기명 함수 표현식의 이름은 재귀 호출과 같이 함수 내부에서 자기 자신을 호출하고자 할 때 사용할 수 있습니다.

함수엔 다양한 프로퍼티를 추가할 수 있습니다. 널리 쓰이는 자바스크립트 라이브러리 상당수에서 이런 커스텀 프로퍼티를 잘 활용하고 있습니다.

이런 라이브러리들은 '주요' 함수 하나를 만들고 여기에 다양한 '헬퍼' 함수를 붙이는 식으로 구성됩니다. [jQuery](https://jquery.com)는 이름이 `$`인 주요 함수로 이루어져 있습니다. [lodash](https://lodash.com)는 주요 함수 `_`에 `_.clone`, `_.keyBy`등의 프로퍼티를 추가하는 식으로 구성되죠. 자세한 정보는 lodash [공식 문서](https://lodash.com/docs)에서 찾아볼 수 있습니다. 이렇게 함수 하나에 다양한 헬퍼 함수를 붙여 라이브러리를 만들면 라이브러리 하나가 전역 변수 하나만 사용하므로 전역 공간을 더럽히지 않는다는 장점이 있습니다. 이름 충돌도 방지할 수 있죠.


이렇게 객체로서의 함수 특징을 이용해 커스텀 프로퍼티를 만들면 함수는 자기 자신을 이용해 원하는 일을 수행할 수 있고, 함수 자기 자신에 딸린 프로퍼티의 기능도 사용할 수 있다는 장점이 있습니다.
