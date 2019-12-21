# 메서드와 'this'

객체는 사용자(user), 주문(order) 등과 같이 실제 존재하는 개체(entity)를 표현하고자 할 때 생성됩니다.

```js
let user = {
  name: "John",
  age: 30
};
```

사용자는 현실에서 장바구니에서 물건 선택하기, 로그인하기, 로그아웃하기 등의 행동을 합니다. 이와 마찬가지로 사용자를 나타내는 객체 user도 특정한 *행동*을 할 수 있습니다. 

자바스크립트에선 객체의 프로퍼티에 함수를 할당해 객체에게 행동할 수 있는 능력을 부여해줍니다.

## 메서드 만들기

객체 `user`에게 인사할 수 있는 능력을 부여해 줍시다.

```js run
let user = {
  name: "John",
  age: 30
};

*!*
user.sayHi = function() {
  alert("안녕하세요!");
};
*/!*

user.sayHi(); // 안녕하세요!
```

함수 표현식으로 함수를 만들고, 객체 프로퍼티 `user.sayHi`에 함수를 할당해 주었습니다. 

이제 객체에 할당된 함수를 호출하면 user가 인사를 해줍니다.

이렇게 객체 프로퍼티에 할당된 함수를 *메서드(method)* 라고 부릅니다. 

위 예시에선 `user`의 `sayHi`가 메서드이죠.

메서드는 아래와 같이 이미 정의된 함수를 이용해서 만들 수도 있습니다.

```js run
let user = {
  // ...
};

*!*
// 함수 선언
function sayHi() {
  alert("안녕하세요!");
};

// 선언된 함수를 메서드로 등록
user.sayHi = sayHi;
*/!*

user.sayHi(); // 안녕하세요!
```

```smart header="객체 지향 프로그래밍"
객체를 사용하여 개체를 표현하는 방식을 [객체 지향 프로그래밍(object-oriented programming, OOP)](https://en.wikipedia.org/wiki/Object-oriented_programming) 이라 부릅니다.

OOP는 그 자체만으로도 학문의 분야를 만드는 중요한 주제입니다. 올바른 개체를 선택하는 방법, 개체 사이의 상호작용을 나타내는 방법 등에 관한 의사결정은 (객체 지향) 설계를 기반으로 이뤄집니다. 관련 추천도서로는 에릭 감마의 "GoF의 디자인 패턴", 그래디 부치의 "UML을 활용한 객체지향 분석 설계" 등이 있습니다.
```
### 메서드 단축 구문

객체 리터럴 안에 메서드를 선언할 때 사용할 수 있는 단축 문법을 소개해 드리겠습니다.

```js
// 아래 두 객체는 동일하게 동작합니다.

user = {
  sayHi: function() {
    alert("Hello");
  }
};

// 단축 구문을 사용하니 더 깔끔해 보이네요.
user = {
*!*
  sayHi() { // "sayHi: function()"과 동일합니다.
*/!*
    alert("Hello");
  }
};
```

위처럼 `"function"`을 생략해도 메서드를 정의할 수 있습니다.

일반적인 방법과 단축 구문을 사용한 방법이 완전히 동일하진 않습니다. 객체 상속과 관련된 미묘한 차이가 존재하는데 지금으로선 이 차이가 중요하지 않기 때문에 넘어가도록 하겠습니다. 

## 메서드와 "this"

메서드는 객체에 저장된 정보에 접근할 수 있어야 제 역할을 할 수 있습니다. 모든 메서드가 그런 건 아니지만, 대부분의 메서드가 객체 프로퍼티의 값을 활용합니다.

`user.sayHi()`의 내부 코드에서 객체 `user`에 저장된 이름(name)을 이용해 인사말을 만드는 경우가 이런 경우에 속합니다.   

**메서드 내부에서 `this` 키워드를 사용하면 객체에 접근할 수 있습니다.**

"점 앞"의 `this`는 객체를 나타냅니다. 정확히는 메서드를 호출할 때 사용된 객체를 나타내죠.

예시:

```js run
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    // "this"는 "현재 객체"를 나타냅니다.
    alert(this.name);
*/!*
  }

};

user.sayHi(); // John
```

`user.sayHi()`가 실행되는 동안에 `this`는 `user`를 나타냅니다.

`this`를 사용하지 않고 외부 변수를 참조해 객체에 접근하는 것도 가능합니다.

```js
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert(user.name); // "this" 대신 "user"를 이용함
*/!*
  }

};
```

그런데 이렇게 외부 변수를 사용해 객체를 참조하면 예상치 못한 에러가 발생할 수 있습니다. `user`를 복사해 다른 변수에 할당(`admin = user`)하고, `user`는 전혀 다른 값으로 덮어썼다고 가정해 봅시다. sayHi()는 원치 않는 값(null)을 참조할 겁니다.

실제 코드를 이용해 에러를 만들어 보겠습니다.

```js run
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert( user.name ); // Error: Cannot read property 'name' of null
*/!*
  }

};


let admin = user;
user = null; // user를 null로 덮어씁니다.

admin.sayHi(); // sayHi()가 엉뚱한 객체를 참고하면서 에러가 발생했습니다.
```

`alert` 함수가 `user.name` 대신 `this.name`을 인수로 받았다면 에러가 발생하지 않았을 겁니다.

## 자유로운 "this"

자바스크립트의 `this`는 다른 프로그래밍 언어의 `this`와 동작 방식이 다릅니다. 자바스크립트에선 모든 함수에 `this`를 사용할 수 있습니다.

아래와 같이 코드를 작성해도 문법 에러가 발생하지 않습니다.

```js
function sayHi() {
  alert( *!*this*/!*.name );
}
```

`this` 값은 런타임에 결정됩니다. 컨텍스트에 따라 달라지죠.

동일한 함수라도 다른 객체에서 호출했다면 "this"가 참조하는 값이 달라집니다.

```js run
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

*!*
// 다른 객체에서 동일한 함수를 사용함
user.f = sayHi;
admin.f = sayHi;
*/!*

// "this"는 "점(.) 앞의" 객체를 참조하기 때문에
// this 값이 달라짐
user.f(); // John  (this == user)
admin.f(); // Admin  (this == admin)

admin['f'](); // Admin (점(.)과 대괄호는 동일하게 동작함)
```

규칙은 간단합니다. `obj.f()`를 호출했다면 `this`는 `f`를 호출하는 동안의 `obj`입니다. 위 예시에선 `obj`가 `user`나 `admin`을 참조하겠죠.

````smart header="객체 없이 호출하기: `this == undefined`"
객체가 없어도 함수를 호출할 수 있습니다.

```js run
function sayHi() {
  alert(this);
}

sayHi(); // undefined
```

위와 같은 코드를 엄격 모드에서 실행하면, `this`엔 `undefined`가 할당됩니다. `this.name`으로 name에 접근하려고 하면 에러가 발생하죠.

그런데 엄격 모드가 아닐 때는 `this`가 *전역 객체*를 참조합니다(브라우저 환경에선 `window`. 전역 객체는 [](info:global-object)에서 자세히 다룰 예정입니다). 이런 동작 차이는 `"use strict"`가 도입된 배경이기도 합니다.

이런 식의 코드는 대게 실수로 작성된 경우가 많습니다. 함수 본문에 `this`가 사용되었다면, 객체 컨텍스트 내에서 함수를 호출할 것이라고 예상하시면 됩니다.
````

```smart header="자유로운 `this`가 만드는 결과"
다른 언어를 사용하다 자바스크립트로 넘어온 개발자는 `this`를 혼동하기 쉽습니다. `this`는 항상 메서드가 정의된 객체를 참조할 것이라고 착각하죠. 이런 개념을 "bound `this`"라고 부릅니다. 

자바스크립트에서 `this`는 런타임에 결정됩니다. 메서드가 어디서 정의되었는지에 상관없이 `this`는 "점 앞의" 객체가 무엇인가에 따라 "자유롭게" 결정됩니다.

이렇게 `this`가 런타임에 결정되면 좋은 점도 있고 나쁜 점도 있습니다. 함수(메서드)를 하나만 만들어 여러 객체에서 재사용할 수 있다는 것은 장점이지만, 이런 유연함이 실수로 이어질 수 있다는 것은 단점입니다.

자바스크립트가 this를 다루는 방식이 좋은지, 나쁜지는 우리가 판단할 문제가 아닙니다. 개발자는 this의 동작 방식을 충분히 이해하고, 장점을 취하면서 실수를 피하는 데만 집중하면 됩니다. 
```

## 참조 타입

```warn header="심화 학습"
이번 절은 특정 에지 케이스(edge case)를 설명하기 위해 작성된 심화 내용입니다.

튜토리얼을 빠르게 학습하고 싶다면 넘어가거나 미뤄도 괜찮습니다.
```

복잡한 상황에서 메서드를 호출하면 `this` 값을 잃어버리는 경우가 생깁니다. 예시를 살펴봅시다.

```js run
let user = {
  name: "John",
  hi() { alert(this.name); },
  bye() { alert("Bye"); }
};

user.hi(); // John (간단한 호출은 의도한 대로 잘 동작합니다.)

*!*
// name에 따라 user.hi나 user.bye가 호출되게 해봅시다.
(user.name == "John" ? user.hi : user.bye)(); // Error: Cannot read property 'name' of undefined
*/!*
```

마지막 줄에서 조건부 연산자를 사용해 `user.hi`나 `user.bye` 중 하나가 호출되도록 했습니다. user의 name이 "John"이므로 결과는 `user.hi`가 될 것입니다.

`()`가 있어서 메서드 hi가 즉시 호출될 것이라 예상했는데, 에러가 발생했습니다.

에러는 메서드를 호출할 때 `"this"`에 `undefined`가 할당되어있기 때문에 발생했습니다.

마지막 줄이 아래와 같았다면 에러 없이 잘 작동했을 겁니다.
```js
user.hi(); // object dot method
```

아래 코드에선 에러가 발생하죠. 
```js
(user.name == "John" ? user.hi : user.bye)(); // evaluated method
```

이유가 뭘까요? 원인을 알려면 `obj.method()`를 호출했을 때, 내부에서 어떤 일이 일어나는지 알아야 합니다.

코드를 유심히 살펴보면 `obj.method()`엔 연산이 두 개 있다는 걸 눈치챌 수 있습니다.

1. 점 `'.'`은 객체 프로퍼티 `obj.method`에 접근합니다.
2. 괄호 `()`는 메서드를 실행합니다.

첫 번째 연산에서 `this` 값을 얻게 되는데, 이 정보가 어떻게 두 번째 연산으로 전달될까요? 

두 연산을 각각 별도의 줄에서 실행했다면 `this` 값에 대한 정보를 잃는 건 확실합니다.

```js run
let user = {
  name: "John",
  hi() { alert(this.name); }
}

*!*
// 메서드 참조와 호출을 두 줄에 나누어서 실행함
let hi = user.hi;
hi(); // this가 undefined이기 때문에 에러가 발생합니다.
*/!*
```

`hi = user.hi`는 함수를 변수에 할당해주는데, 마지막 줄 코드와는 완전히 독립적으로 동작하므로 `this`엔 아무런 값도 저장되지 않습니다.

**`user.hi()`를 의도한 대로 동작시키기 위해 자바스크립트는 속임수를 사용합니다. `'.'`은 함수가 아닌, [참조 타입(Reference Type)](https://tc39.github.io/ecma262/#sec-reference-specification-type) 값을 반환하게 합니다.**

참조 타입은 "명세에서만 사용되는 타입(specification type)"입니다. 개발자가 실제론 사용할 수 없는 자료형입니다.

참조 타입 값은 `(base, name, strict)`이 조합된 형태입니다.

- `base`: 객체,
- `name`: 프로퍼티의 이름,
- `strict`: 엄격 모드에선 true임

`user.hi`로 프로퍼티에 접근하면 함수가 아닌, 참조 타입 값을 반환합니다. 엄격 모드였다면 아래와 같은 값이 반환되었겠죠.

```js
// 참조 타입 값
(user, "hi", true)
```

참조형 값에 괄호 `()`를 붙여 호출하면 객체, 객체의 메서드와 연관된 모든 정보를 받습니다. 이 정보를 이용해 `this`(`=user`)를 결정합니다.

참조 타입은 "중개인" 역할을 하는 특별한 내부 타입으로, 점 `.`연산에서 알아낸 정보를 괄호 `()`로 전달해주는 역할을 합니다.

점 연산 이외의 연산(할당 연산 등)은 참조 타입을 통째로 버리고 `user.hi`(함수) 값만 받아 전달합니다. 이런 과정 중에 `this` 정보가 사라집니다.

`obj.method()` 같이 점을 사용하거나, `obj[method]()` 같이 대괄호를 사용해 함수를 호출했을 때만 `this` 값이 의도한 대로 전달됩니다. 이런 문제는 [func.bind()](/bind#solution-2-bind) 등을 이용하면 해결 할 수 있는데, 이에 대해선 추후에 알아보도록 하겠습니다.

## "this"가 없는 화살표 함수

화살표 함수는 일반 함수와는 다르게 "고유한" `this`를 가지지 않습니다. 화살표 함수에서 `this`를 참조하면, (화살표 함수가 아닌) "평범한" 외부 함수에서 `this` 값을 가져옵니다. 

아래 예시에서 함수 `arrow()`의 `this`는 외부 함수 `user.sayHi()`의 `this`를 사용합니다.

```js run
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
```

별개의 `this`가 만들어지는 건 원하지 않고, 외부 컨텍스트에 있는 `this`를 이용하고 싶은 경우 화살표 함수가 유용합니다. 이에 대한 자세한 내용은 별도의 챕터, <info:arrow-functions>에서 다루겠습니다.


## 요약

- 객체 프로퍼티에 저장된 함수를 "메서드"라고 부릅니다. 
- `object.doSomthing()`은 객체를 "행동"할 수 있게 해줍니다. 
- 메서드는 `this`로 객체를 참조합니다.

`this` 값은 런타임에 결정됩니다.
- 함수를 선언할 때 `this`를 사용할 수 있습니다. 다만, 함수가 호출되기 전까지 `this`엔 값이 할당되지 않습니다.
- 함수를 복사해 객체 간 전달할 수 있습니다.
- 함수를 객체 프로퍼티에 저장해 `object.method()`같이 "메서드" 형태로 호출하면 `this`는 `object`를 참조합니다.

화살표 함수는 자신만의 `this`를 가지지 않는다는 점에서 독특합니다. 화살표 함수 안에서 `this`를 사용하면, 외부에서 `this` 값을 가져옵니다. 
