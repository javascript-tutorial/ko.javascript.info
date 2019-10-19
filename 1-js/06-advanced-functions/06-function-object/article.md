
# 객체로서의 함수와 기명 함수 표현식

자바스크립트에서 함수는 값으로 취급됩니다. 이에 대해선 이미 배워서 알고 계실 겁니다.

모든 값은 자료형을 가지고 있는데, 그렇다면 함수의 자료형은 무엇일까요?

함수는 객체입니다.

함수는 호출 가능한(callable) '행동 객체'입니다. 호출도 할 수 있고 객체처럼 프로퍼티를 추가/제거하거나 참조를 통해 전달하는 것이 가능하죠.


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

그런데, 객체 메서드 이름은 함수처럼 자동 할당이 되지 않습니다. 적절한 이름을 추론하는 게 불가능한 상황이 있는데, 이때 name 프로퍼티엔 빈 문자열이 저장됩니다. 아래와 같이 말이죠.

```js run
// 배열 안에서 함수를 생성함
let arr = [function() {}];

alert( arr[0].name ); // <빈 문자열>
// 엔진이 이름을 설정할 수 없어서 name 프로퍼티의 값이 빈 문자열이 됨
```

실무에서 대부분의 함수는 이름이 있으므로, 위와 같은 상황은 잘 발생하지 않습니다.

## 'length' 프로퍼티

내장 프로퍼티 'length'는 함수 매개변수의 개수를 반환합니다. 예시를 살펴봅시다.

```js run
function f1(a) {}
function f2(a, b) {}
function many(a, b, ...more) {}

alert(f1.length); // 1
alert(f2.length); // 2
alert(many.length); // 2
```

나머지 매개변수는 개수에 포함되지 않는다는 걸 위 예시를 통해 확인해 보았습니다.

`length` 프로퍼티는 다른 함수 안에서 동작하는 함수를 [검사(introspection)](https://en.wikipedia.org/wiki/Type_introspection)할 때도 사용됩니다.

아래 예시에서 함수 `ask`는 질문에 쓰일 `question`과 조건에 따라 호출할 임의의 수의 `handler` 함수도 함께 받고 있습니다.

사용자가 답을 제출하면 함수는 핸들러 함수를 호출하죠. 아래 예제에선 두 종류의 핸들러 함수를 `ask` 함수에 전달하였습니다.

- 인수가 없는 함수: 사용자가 OK를 클릭했을 때 호출되는 함수
- 인수가 있는 함수: 사용자가 OK를 클릭하든, Cancel을 클릭하든 답을 반환하는 함수

`handler.length` 프로퍼티를 확인하면 의도한 대로 `handler`를 호출할 수 있습니다.

`handler.length` 프로퍼티를 사용하면 인수가 없는 간단한 핸들러 함수(긍정적인 상황에서 호출)와 일반적인 핸들러 함수(조건에 관계없이 호출)를 동시에 구현할 수 있습니다.

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

## 사용자 지정 프로퍼티

함수 객체에 자체적으로 만든 프로퍼티를 추가할 수도 있습니다.

함수 호출 횟수를 `counter` 프로퍼티에 저장해봅시다. 

```js run
function sayHi() {
  alert("Hi");
  
  *!*
  // 함수를 몇 번 호출했는지 세봅시다.
  sayHi.counter++;
  */!*
}
sayHi.counter = 0; // 초기값

sayHi(); // Hi
sayHi(); // Hi

alert( `호출 횟수: ${sayHi.counter}회` ); // 호출 횟수: 2회
```

```warn header="프로퍼티는 변수가 아닙니다."
`sayHi.counter = 0`와 같이 함수에 프로퍼티를 할당해도 함수 내에 지역변수 `counter`가 만들어지지 않습니다. `counter` 프로퍼티와 변수 `let counter`는 전혀 관계가 없습니다.

함수를 객체처럼 다룰 수 있고, 객체에 프로퍼티를 저장할 수 있지만, 이는 실행에 아무 영향을 끼치지 않습니다. 변수는 함수 프로퍼티가 아니고 함수 프로퍼티는 변수가 아니기 때문이죠. 둘 사이에는 공통점이 없습니다.
```

클로저를 함수 프로퍼티로 바꿔서 사용할 수도 있습니다. <info:closure> 챕터에서 살펴본 바 있는 counter 함수를 함수 프로퍼티를 사용해 바꿔보도록 하겠습니다. 

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

`count`를 외부 렉시컬 환경이 아닌 함수 프로퍼티에 바로 저장하였습니다.   

이렇게 함수 프로퍼티에 정보를 저장하는 게 클로저를 사용하는 것보다 나은 방법일까요?

두 방법의 차이점은 `count` 값이 외부변수에 저장되어있는 경우 드러납니다. 클로저를 사용한 경우는 외부 코드에서 `count`를 수정할 수 없고, 오로지 중첩함수 내에서만 값을 수정할 수 있습니다. 함수 프로퍼티를 사용한 경우는 아래와 같이 외부에서 값을 수정할 수 있습니다.

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

어떤 방법을 선택할지는 목적에 따라 달라지겠죠.

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

먼저 이렇게 이름을 붙여도 위 함수는 여전히 함수 표현식이라는 점에 주목해야 합니다. `"func"`이라는 이름을 `function` 다음에 붙이더라도 여전히 표현식을 할당한 형태를 유지하고, 함수 선언문으로 바뀌지 않습니다.

이름을 추가한다고 해서 무언가 바뀌지 않죠.

`sayHi()`로 호출하는 것도 여전히 가능합니다.

```js run
let sayHi = function *!*func*/!*(who) {
  alert(`Hello, ${who}`);
};

sayHi("John"); // Hello, John
```

`func`같이 이름을 붙이면 아래와 같이 두 가지가 달라집니다.

1. 이름을 사용해 함수 표현식 내부에서 자신을 참조할 수 있습니다.
2. 함수 표현식 외부에선 이름을 사용할 수 없습니다.

아래 함수 `sayHi`는 `who`에 값이 없는 경우, 인수로 `"Guest"`를 받습니다.

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

// 아래와 같이 func를 호출하는 건 불가능합니다.
func(); // Error, func is not defined (함수 표현식 밖에서는 func을 사용할 수 없습니다.)
```

왜 `func`과 같은 이름을 붙여 사용하는 걸까요? 중첩 호출을 사용해도 될 것 같은데 말이죠. 


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

이렇게 코드를 작성하면 외부 코드에 의해 `sayHi`가 변경될 경우 문제가 생깁니다. 함수 표현식을 새로운 변수에 할당하고, 기존 변수에 `null`을 할당하면 에러가 발생하죠.  

```js run
let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
*!*
    sayHi("Guest"); // Error: sayHi is not a function
*/!*
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // sayHi는 더 이상 호출할 수 없습니다!
```

에러의 원인은 함수가 `sayHi`를 외부 렉시컬 환경에서 가지고 오기 때문입니다. 지역 렉시컬 환경엔 `sayHi`가 없기 때문에 외부 렉시컬 환경에서 `sayHi`를 찾기 때문이죠. 함수 호출 시점에 외부 렉시컬 환경의 `sayHi`엔 `null`이 저장되어있기 때문에 에러가 발생합니다.

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

`"func"`은 함수 내부에서 찾을 수 있기 때문에 의도한 대로 예시가 동작합니다. 함수 외부에선 `"func"`을 사용할 수 없고, `"func"`을 외부 렉시컬 환경에서 가져오지도 않습니다. 함수 표현식에 붙인 이름은 현재 함수만 참조하도록 명세서에 정의되어있기 때문입니다.

이렇게 기명 함수 표현식을 이용하면 `sayHi`나 `welcome` 같은 외부 변수의 변경과 관계없이 `func`이라는 '내부 함수 이름'을 사용해 언제든 함수 표현식이 자기 자신을 호출할 수 있게 만들 수 있습니다.

```smart header="함수 선언문엔 내부 이름을 지정할 수 없습니다."
'내부 이름'은 함수 표현식에만 사용할 수 있고, 함수 선언문엔 사용할 수 없습니다. 함수 선언문을 통해 만든 함수엔 '내부' 이름을 지정할 수 있는 문법이 없습니다.

내부 이름이 필요하다면 함수 선언문 대신 함수 표현식을 사용해 함수를 다시 정의하면 됩니다.
```

## 요약

함수는 객체입니다.

다음 함수 객체 프로퍼티는 여러 곳에서 사용할 수 있습니다.

- `name` -- 함수의 이름이 저장됩니다. 함수 선언부에서 이름을 가져오는데, 익명 함수인 경우는 자바스크립트 엔진이 컨텍스트(할당 등)를 이용해 이름을 추론합니다.
- `length` -- 함수 선언부에 있는 인수의 수로 나머지 매개변수는 포함하지 않습니다.

함수 표현식으로 함수를 정의하였는데 이름이 있다면 이를 기명 함수 표현식이라 부릅니다. 기명 함수 표현식의 이름은 재귀 호출과 같이 함수 내부에서 자기 자신을 호출하고자 할 때 사용할 수 있습니다.

함수 객체엔 다양한 프로퍼티를 추가할 수 있는데, 잘 알려진 자바스크립트 라이브러리를 뜯어보면 이런 커스텀 프로퍼티에 대한 예시들을 많이 찾아볼 수 있습니다.

이런 라이브러리들은 '주요' 함수 하나를 만들고 여기에 다양한 '헬퍼' 함수를 붙이는 식으로 구성되어있습니다. [jQuery](https://jquery.com)는 주요 함수 `$`를 중심으로 구성되어있죠. [lodash](https://lodash.com)는 주요 함수 `_`에 `_.clone`, `_.keyBy`등의 프로퍼티를 추가하는 식으로 구성되어있습니다. 자세한 정보는 lodash [공식 문서](https://lodash.com/docs)에서 찾아볼 수 있습니다. 이렇게 함수 하나에 다양한 헬퍼 함수를 붙여 라이브러리를 만들면 라이브러리 하나가 전역 변수 하나만 차지하므로 전역 공간을 더럽히지 않는다는 장점이 있습니다. 이름 충돌도 방지할 수 있죠.


라이브러리에서 정의한 메인 함수와 여기에 딸린 프로퍼티에 정의된 다양한 기능을 사용하면 다양한 작업을 수행할 수 있습니다.
