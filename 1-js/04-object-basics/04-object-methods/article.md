# 객체 메서드(method), "this"

객체는 대게 user같이 실제 세계에 존재하는 것들을 표현하기 위해 생성됩니다. 

```js
let user = {
  name: "John",
  age: 30
};
```

그리고, 실제 세계에서는, user는 *행동*할 수 있죠 : 쇼핑 카트에서 선택하기, 로그인하기, 로그아웃하기 등등.

자바스크립트에서 행동은 객체 안에 함수로 표현됩니다. 

## 메서드 예제

시작하기 위해, `user`에게 hello라고 말하는 법을 가르쳐 줍시다:

```js run
let user = {
  name: "John",
  age: 30
};

*!*
user.sayHi = function() {
  alert("Hello!");
};
*/!*

user.sayHi(); // Hello!
```

여기서  함수를 만들기 위해서 Function 표현을 사용했습니다. 그리고 객체의 `user.sayHi` 속성에 이것을 할당해 줬습니다. 

그리고서 이것을 호출할 수 있죠. 이제는 user가 말할 수 있습니다!

객체의 속성인 함수를 *메서드*라고 부릅니다.

즉, 여기서  `user`안에 `sayHi`메서드를 가진 것이죠.

물론, 미리 선언된 함수를 메서드로 사용할 수 있습니다. 이렇게요:

```js run
let user = {
  // ...
};

*!*
// first, declare
function sayHi() {
  alert("Hello!");
};

// then add as a method
user.sayHi = sayHi;
*/!*

user.sayHi(); // Hello!
```

```smart header="객체 지향 프로그래밍"
우리 코드에 어떤 존재를 객체를 사용하여 나타낼 때, [객체지향 프로그래밍](https://en.wikipedia.org/wiki/Object-oriented_programming) 이라고 말합니다. 줄여서 "OOP"라고 하죠.

OOP는 매우 중요하죠. 이것 자체로 흥미로운 과학입니다. 어떻게 올바른 객체를 택할 수 있을까요? 그들 사이의 상호작용 관계를 어떻게 조직할 수 있을까요? 이런 것이 설계입니다. 그리고 이 주제에 관한 훌륭한 책이 있습니다. "Elements of Reusable Object-Oriented Software" by E.Gamma, R.Helm, R.Johnson, J.Vissides 또는 "Object-Oriented Analysis and Design with Applications" by G.Booch, 그 밖에도 더 있습니다. 나중이 이 주제에 대해 <객체 지향 프로그래밍> 주제에서 겉핥기식으로 배워 볼 것입니다.
```
### 메서드 선언 짧게 만들기

객체 리터럴 안에 메서드를 선언하기 위한 더 짧은 문법이 있습니다:

```js
// these objects do the same

let user = {
  sayHi: function() {
    alert("Hello");
  }
};

// method shorthand looks better, right?
let user = {
*!*
  sayHi() { // same as "sayHi: function()"
*/!*
    alert("Hello");
  }
};
```

이처럼, `"function"`을 생략하고 그냥 `sayHi()`를 쓸 수 있습니다.

사실을 말하자면, 완전히 같은 표기는 아닙니다. 객체 상속에 관련된 미묘한 차이점이 존재합니다(나중에 다루도록 하겠습니다). 하지만 지금은 아무런 문제가 되지 않습니다. 거의 모든 경우에 짧은 문법을 더 좋아합니다. 

## 메서드안에 "this"

보통 객체의 메서드는 제 역할을 하기 위해 객체 안에 저장된 정보에 접근할 권한이 필요합니다.

예를 들어, `user.sayHi()`안에 있는 코드는 `user`의 name 속성을 필요로 할 수 있습니다.

**`this`키워드를 사용하면 메서드는 객체에 접근할 수 있습니다.**

`this`의 값은 "점 연산 이전"의 객체입니다. 메서드를 호출한 객체이죠.

예를 들어:

```js run
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert(this.name);
*/!*
  }

};

user.sayHi(); // John
```

`user.sayHi()`의 실행 동안, `this`의 값은 `user`가 될 것입니다.

기술적으로, `this` 없이도 접근할 수 있습니다. 바깥 변수를 통해 참조함으로 말이죠:

```js
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert(user.name); // "user" instead of "this"
*/!*
  }

};
```

...하지만 이런 코드는 신뢰성이 떨어지죠. 만약 `user`를 다른 변수에 저장하기로 한다거나 `admin = user`, `user`를 다른 것으로 오버라이드 한다면, 원하지 않은 객체를 참조하게 될 것입니다.

아래 보여드리겠습니다:

```js run
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert( user.name ); // leads to an error
*/!*
  }

};


let admin = user;
user = null; // overwrite to make things obvious

admin.sayHi(); // Whoops! inside sayHi(), the old name is used! error!
```

만약 `this.name`를 `user.name`대신 `alert` 안에서 사용한다고 하죠, 그럼 코드는 작동할 것입니다.

## "this"는 바운드가 아니다.

자바스크립트에서, "this" 키워드는 다른 객체지향 언어들과 다르게 동작합니다. 먼저, 어떤 함수에서도 사용할 수 있습니다.

다음과 코드에는 문법 오류가 없습니다:

```js
function sayHi() {
  alert( *!*this*/!*.name );
}
```

`this`값은 실행 시간에 결정됩니다. 어떤 것이든 될 수 있죠.

예를 들어, 같은 함수라도 다른 "this"를 가질 수 있습니다. 다른 객체에서 호출됐다면 말이죠.

```js run
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

*!*
// use the same functions in two objects
user.f = sayHi;
admin.f = sayHi;
*/!*

// these calls have different this
// "this" inside the function is the object "before the dot"
user.f(); // John  (this == user)
admin.f(); // Admin  (this == admin)

admin['f'](); // Admin (dot or square brackets access the method – doesn't matter)
```

사실, 이 함수를 객체 없이 호출할 수도 있습니다.

```js run
function sayHi() {
  alert(this);
}

sayHi(); // undefined
```

`this`가 strict mode에서 `undefined`일 경우. `this.name`을 접근하려 한다면, 에러를 출력할 것입니다.

strict mode가 아닌 모드에서 `this`의 값은 *global object*일 것입니다(브라우저 환경에선, `window`가 될겁니다. [](info:global-object)에서 자세히 다루도록 하겠습니다). 이것에 `"use strict"'`가 고치는 것들에 관한 역사적인 배경이 있는 동작입니다.

보통은 객체 없이 `this`를 사용하는 함수를 호출하는 것은 정상적이지 않다는 것을 알아두세요. 오히려 프로그래밍 실수라고 여기죠. 함수가 `this`를 가지고 있다면 어떤 객체의 문맥에서 호출될 것을 의도했다고 보면 되죠.

```smart header="The consequences of unbound `this`"
만약 당신이 다른 언어에서 넘어왔다면, 객체 안에 정의된 메서드들의 `this`는 언제나 그 객체를 가리킨다는 "bound `this`"의 개념을 사용하려 할 것이다. 

자바스크립트에서 `this`는 "free"이다. 호출 시간에 이 값이 정해지며 메서드가 어디에 정의된 것인가가 아니라 "점 연산 전에" 객체가 무엇이었는가에 달려있다.

실행 시간 정해지는 `this`의 개념은 장점 단점이 있다. 한편으로는 다른 객체에 의해 함수가 재사용 될 수 있을 것이고 다른 한편으로는, 실수할 수 있는 더 큰 기회를 제공한다.

우리는 이 설계 결정이 좋은가 나쁜가를 판단할 위치에 있지 않다. 우리는 어떻게 이것과 함께 일할 수 있나 이해하고 어떻게 이익을 취할 것인지 또 어떻게 문제점을 피할 것인지 이해할 것이다. 
```

## 내부적인 것들: 참조 타입(Reference Type)

```warn header="In-depth language feature"
이 섹션에서는 특정한 엣지 케이스들 이해하기 위한 고급 주제를 다룹니.

만약 빠르게 가고 싶다면, 다음으로 미루거나 건너뛰어도 좋습니다.
```

뒤얽힌 함수 호출은 `this`를 잃을 수도 있습니다. 예를 들어:

```js run
let user = {
  name: "John",
  hi() { alert(this.name); },
  bye() { alert("Bye"); }
};

user.hi(); // John (the simple call works)

*!*
// now let's call user.hi or user.bye depending on the name
// 이제 user.hi나 user.bye를 이름에 따라 호출해 보자.
(user.name == "John" ? user.hi : user.bye)(); // Error!
*/!*
```

마지막 줄은 `user.hi`나 `user.bye` 둘 중 하나를 고르는 삼항 연산자입니다. 이 경우에는 결과는 `user.hi`입니다.

메서드는 `()`로 즉시 호출됩니다. 하지만 작동하지 않습니다! 

에러 호출 결과를 보면 호출 안에 `"this"`의 값이 `undefined`로 바뀌었다는 것을 볼 수 있습니다.

이건 작동합니다 (객체 점 연산 메서드):
```js
user.hi();
```

이건 작동 안 합니다 (계산된 메서드): 
```js
(user.name == "John" ? user.hi : user.bye)(); // Error!
```

왜냐? 이게 왜 이렇게 되는가 이해하고 싶다면, `obj.method()` 호출이 어떻게 작동하는지 그 밑바닥으로 가 보죠.

자세히 보면, 두 개의 연산이 `obj.method()`안에 있다는 것을 알 수 있을 것입니다:

1. 먼저, 점 연산 `'.'`은 `obj.method`를 접근합니다.
2. 그리고는 괄호 `()`를 실행합니다.

그래서, `this`에 대한 정보가 첫 번째 부분에서 두 번째 부분으로 어떻게 전달 됐냐고요?

만약 우리가 이 연산들을 다른 줄에 둔다면 분명 `this`를 잃어버릴 것입니다.

```js run
let user = {
  name: "John",
  hi() { alert(this.name); }
}

*!*
// 두 줄에 나누어서 호출하고 얻는 메서드 
let hi = user.hi;
hi(); // undefined
*/!*
```

여기서는 `hi = user.hi`와 같이 변수에 함수를 할당합니다. 그리고 마지막 줄은 완전히 독립적입니다. 그렇기 때문에 `this`가 없습니다.

**`user.hi()`호출이 작동하게끔 하기 위해서 자바스크립트는 속임수를 사용합니다. 점 연산이 함수가 아닌, 참조 타입[Reference Type](https://tc39.github.io/ecma262/#sec-reference-specification-type) 이라는 특별한 값을 반환하게끔 하는 것이죠.**

참조 타입은 "명세 타입(Specification type)"입니다. 우리는 이것을 명시적으로 사용할 수는 없습니다. 하지만 내부적으로 언어에서 사용하죠. 

참조 타입의 값은 세 개의 조합으로 이루어져 있습니다. `(base, name, strict)`이죠.

- `base` is the object.
- `base`는 객체입니다.
- `name` is the property.
- `name`은 속성입니다.
- `strict` is true if `use strict` is in effect.
- `strict`는 `use strict`가 설정돼있다면 참입니다.

`user.hi` 속성 접근의 결과는 함수가 아닙니다. 참조 타입입니다. strict mode에서 `user.hi`는:

```js
// Reference Type value
(user, "hi", true)
```

괄호 `()`가 참조 타입에 호출받을 때는 객체와 객체의 메서드에 관한 모든 정보를 받습니다. 그리고 `this`를 올바르게 세팅할 수 있죠(이 경우에는 `=user`).

`hi = user.hi`과 같은 다른 모든 연산은 모든 참조 타입을 포기하고 `user.hi`(함수)의 값을 가지고 전달합니다. 그래서 이후로는 `this`를 잃습니다.

그래서, 결과적으로 `this`값은 직접적으로 점 연산을 사용해서 `obj.method()` 또는 `obj[method]()`와 같이 대괄호 문법을 통해 호출되면 올바른 방법으로 전달될 것입니다(여기서는 모두 같습니다). 나중에 강의에서, 우리는 [func.bind()](/bind#solution-2-bind)와 같은 다양한 방법으로 이 문제를 해결하는 법을 배울 것입니다.

## 화살표 함수는 "this"가 없다

화살표 함수는 특별합니다: 이 함수는 "자신의" `this`를 가지지 않습니다. 만약 우리가 `this`를 참조하려고 한다면, "평범한" 외부의 함수로부터 가져올 것입니다. 

예를 들어, 'arrow()'는 `this`를 바깥 `user.sayHi()`메서드에서 사용한다고 해 봅시다:

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

이것은 화살표 함수의 특별한 기능입니다. 우리 분리된 `this`를 가지는 것을 원하지 않을 때 유용합니다. 그렇게 하는 것보다는 바깥의 문맥에서 가져오는 것이죠. 나중에 <info:arrow-functions>주제에서 더 깊이 다뤄볼 것입니다.


## 요약

- 객체 속성에 저장된 함수는 "메서드"라 부른다. 
- 메서드는 객체를 `object.doSomthing()`과 같이 "행동"하게 해준다. 
- 메서드는 `this`로 객체를 참조할 수 있다.

`this`의 값은 실행시간에 결정된다. 
- 함수가 선언되었을 때, `this`를 사용할 수도 있다. 하지만 `this`는 함수가 호출될 때까지 값이 없다.
- 그 함수는 객체 간 복사될 수 있다.
- "메서드" 문법으로 함수가 호출될 때: `object.method()`, 호출 동안에 `this`의 값은 `object`이다.

화살표 함수는 특별하다는 것을 알아두세요: `this`를 가지지 않습니다. 화살표 함수 안에서 `this`를 접근할 때는 바깥으로부터 가져옵니다. 
