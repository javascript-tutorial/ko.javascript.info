# "new" 연산자와 생성자

객체 리터럴 `{...}` 을 사용하면 객체 한 개를 만들 수 있습니다. 하지만 복수의 사용자나 메뉴 아이템 등을 구현하기 위해, 대다수의 경우 유사한 기능을 하는 복수의 객체를 만들어야 합니다.

`"new"` 연산자와 생성자 함수를 사용하면 복수의 객체를 쉽게 만들 수 있습니다. 

## 생성자 함수

생성자 함수(Constructor function)는 함수입니다. 일반 함수와는 달리 생성자 함수는 아래 두 가지 표기법을 써서 작성하는 게 관습입니다.

1. 함수 이름은 첫 글자는 대문자로 시작합니다.
2. `"new"` 연산자와 함께 사용합니다.

예:

```js run
function User(name) {
  this.name = name;
  this.isAdmin = false;
}

*!*
let user = new User("Jack");
*/!*

alert(user.name); // Jack
alert(user.isAdmin); // false
```

`new User(...)`를 써서 함수를 실행하면, 다음 절차가 실행됩니다.

1. 빈 객체가 생성되고, `this`에 생성된 객체를 할당합니다.
2. The function body executes. Usually it modifies `this`, adds new properties to it.
2. 생성자 함수가 실행됩니다. 이때 새로운 프로퍼티가 `this`에 추가되면서, `this`가 수정됩니다.
3. `this`가 반환됩니다.

다시 표현하면, `new User(...)` 는 아래와 같은 일을 합니다:

```js
function User(name) {
*!*
  // this = {};  (암시적 생성)
*/!*

  // 새로운 프로퍼티를 this에 추가함
  this.name = name;
  this.isAdmin = false;

*!*
  // return this;  (암시적 반환)
*/!*
}
```

따라서, `new User("Jack")`의 결과는 아래의 객체가 됩니다:

```js
let user = {
  name: "Jack",
  isAdmin: false
};
```

이제 `new User("Ann")`, `new User("Alice")` 등을 사용해 새로운 사용자를 만들 수 있게 되었습니다. 리터럴을 써서 매번 객체를 만드는 방법보다, 이 방법이 훨씬 간단하고 읽기 쉽습니다.

이렇게, 재사용 가능한 객체 생성 코드 구현이 생성자의 주요 목적입니다.

다시 한번 상기시켜드리겠습니다. 어떤 함수도 생성자 함수가 될 수 있습니다. 이는, `new` 연산자와 함께 실행하면 어떤 함수도 위에 언급한 절차를 그대로 밟는다는 의미입니다. "첫 글자를 대문자로 작성"하면, 함수는 `new` 연산자와 함께 호출해야 합니다. 이는 공동의 약속입니다.

````smart header="new function() { ... }"
객체 하나를 만들어야 하고, 이 객체가 복잡하기 때문에 생성 시 많은 코드가 필요하다면, 코드를 생성자 함수로 감싸서 객체를 만들 수 있습니다. 아래와 같이 말이죠:

```js
let user = new function() {
  this.name = "John";
  this.isAdmin = false;

  // ...사용자 생성을 위해 필요한 다른 코드
  // 복잡한 로직과 지역 변수 등
};
```

위 생성자는 어디에도 저장되지 않기 때문에 다시 사용할 수 없습니다. 만들어지고 난 다음 딱 한 번 호출되기만 하죠. 이렇게 만든 이유는 객체를 만들 때 코드를 캡슐화하려는 목적 때문입니다. 재사용은 신경 쓰지 않고요.
````

## Constructor mode test: new.target

```smart header="어렵습니다"
이 절의 내용은 자주 쓰이지 않습니다. 자바스크립트의 모든 것을 알고싶지 않다면 넘어가셔도 좋습니다.
```

함수 안에서 `new.target` 프로퍼티를 사용하면, 함수가 `new` 연산자와 함께 호출되었는지 아닌지를 확인할 수 있습니다.

일반적인 함수 호출 시 `new.target`은 undefined이고, 함수가 생성자로서 `new`와 함께 호출된 경우, `new.target`는 함수 자체를 반환합니다.

```js run
function User() {
  alert(new.target);
}

// without "new":
*!*
User(); // undefined
*/!*

// with "new":
*!*
new User(); // function User { ... }
*/!*
```

That can be used inside the function to know whether it was called with `new`, "in constructor mode", or without it, "in regular mode".

We can also make both `new` and regular calls to do the same, like this:

```js run
function User(name) {
  if (!new.target) { // new 없이 실행한 경우
    return new User(name); // ...new를 대신해서 넣어줌
  }

  this.name = name;
}

let john = User("John"); // new User를 쓴 것처럼 바꿔줌
alert(john.name); // John
```

이 방법은 syntax를 좀 더 유연하게 사용할 수 있게 하려는 목적으로 라이브러리에서 사용되곤 합니다. 이 방법을 사용하면, 사람들이 `new`와 함께 함수를 호출하든 아니든 동일하게 동작합니다. 

다만, 모든 곳에서 이 방법을 쓰는 건 추천하지 않습니다. `new`를 생략하면 무슨 일이 일어나는 것인지 명확하지 않습니다. 하지만 `new` 를 쓰면 새로운 객체가 만들어진다는 걸 누구나 알 수 있죠.

## 싱성자와 Return 문 

보통, 생성자 함수엔 `return` 문이 없습니다. 필요한 모든 것이 `this`에 할당되고, this는 자동으로 반환됩니다.

그런데 만약 생성자 함수에 `return` 문이 있다면 어떨까요? 규칙은 간단합니다:

- `return` 이 객체와 함께 호출되었다면, this 대신 객체를 반환합니다.
- `return` 이 원시 자료형과 함께 호출되었다면, return 문은 무시됩니다.

정리하자면, `return`이 객체와 함께 쓰이면, 생성자 함수는 객체를 반환하고, 다른 모든 경우는 `this`를 반환합니다.

아래의 예에서 `return`은 `this`를 오버라이드 하고, 객체를 반환합니다:

```js run
function BigUser() {

  this.name = "John";

  return { name: "Godzilla" };  // <-- 객체를 반환
}

alert( new BigUser().name );  // 객체, Godzilla를 받아옵니다
```

아래는 아무것도 `return`하지 않는 예입니다(return 뒤에 원시 자료형이 있더라도 동일하게 작동합니다): 

```js run
function SmallUser() {

  this.name = "John";

  return; // 실행이 중지되고, this를 반환

  // ...

}

alert( new SmallUser().name );  // John
```

보통 생성자엔 `return`문이 없습니다. 여기서 생성자가 객체를 반환하는 특이 케이스를 소개해드린 이유는 튜토리얼의 완전성을 위해서 입니다.

````smart header="괄호를 생략하기"
인수가 없다면, `new` 다음 괄호를 생략할 수 있습니다:

```js
let user = new User; // <-- 괄호 없음
// 아래는 위와 동일하게 작동함
let user = new User();
```

괄호를 생략하는 건 "좋은 스타일"이 아닙니다. 하지만 명세서에선 이런 문법을 허용하고 있습니다.
````

## 생성자 내 메서드

Using constructor functions to create objects gives a great deal of flexibility. The constructor function may have parameters that define how to construct the object, and what to put in it.

`this`는 프로퍼티 뿐만 아니라 메서드에서도 쓸 수 있습니다.

아래는 `name`프로퍼티와 `sayHi`라는 메서드를 가진 객체를 `new User(name)`를 통해 만들어냅니다:

```js run
function User(name) {
  this.name = name;

  this.sayHi = function() {
    alert( "My name is: " + this.name );
  };
}

*!*
let john = new User("John");

john.sayHi(); // My name is: John
*/!*

/*
john = {
   name: "John",
   sayHi: function() { ... }
}
*/
```

## 요약

- 생성자 함수, 짧게 줄여서 생성자는 일반 함수입니다. 일반함수와 구분하기 위해 첫 글자를 대문자로 쓰자고 약속하였습니다.
- 생성자 함수는 `new` 연산자와 함께 호출되어야 합니다. 이렇게 호출하면 빈 `this`가 암시적으로 생성되고, 마지막엔 이 this가 반환됩니다.

유사한 객체를 여러 개 만들 때 생성자 함수를 쓸 수 있습니다.

자바스크립트는 다양한 내장 언어 객체를 만들 수 있는 생성자 함수를 제공합니다. 날짜를 위한 `Date`, 집합(set)을 위한 `Set` 등이 있고, 이에 대해서는 곧 학습할 예정입니다.

```smart header="Objects, we'll be back!"
이번 주제에선 객체와 생성자에 대한 기초를 다뤘습니다. 이 기초 내용은 다음장에서 배울 데이터 타입과 함수를 이해하는데 필수적인 내용입니다. 

데이터 타입과 함수에 대한 학습 이후엔, <info:prototypes>, <info:classes> 챕터에서 다시 객체에 대해 좀 더 다뤄보도록 하겠습니다.
```
