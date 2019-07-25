# 객체 메서드, "this"

사용자(user), 주문하기(order) 같이 실제 세계에 존재하는 개체(entity)를 표현할 목적으로 객체를 만듭니다.

```js
let user = {
  name: "John",
  age: 30
};
```

실제 세상에서 사용자는 *행동*할 수 있는 개체입니다. 이 개체는 장바구니에서 물건 선택하기, 로그인하기, 로그아웃하기 등등의 행위를 하죠.

자바스크립트는 프로퍼티에 정의한 함수로 이런 행동을 표현합니다.  

## 메서드 예제

메서드에 대해 알아봅시다. 일단 `user`에게 인사할 수 있는 능력을 부여해 보죠.

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

위 코드에선 함수 표현식(Function Expression)을 이용해 함수를 만들었습니다. 그리고 이 함수를 객체의 `user.sayHi` 프로퍼티에 할당해 주었습니다. 

이제 함수를 호출할 수 있게 되었네요. user가 인사를 할 있게 되었습니다!

이렇게 객체의 프로퍼티에 정의된 함수를 *메서드*라고 부릅니다. 

위 코드에선 `user` 객체의 `sayHi`가 메서드가 되는 거죠.

메서드는 아래와 같이 이미 선언된 함수를 이용해 등록할 수도 있습니다.

```js run
let user = {
  // ...
};

*!*
// 함수 선언
function sayHi() {
  alert("Hello!");
};

// 선언된 함수를 메서드로 등록
user.sayHi = sayHi;
*/!*

user.sayHi(); // Hello!
```

```smart header="객체 지향 프로그래밍"
개체를 표현하는 방식으로 객체를 사용할 수 있습니다. 이런 방식을 [객체지향 프로그래밍(object-oriented programming)](https://en.wikipedia.org/wiki/Object-oriented_programming) 이라고 부릅니다. 줄여서 "OOP" 라고 하죠.

OOP는 중요한 연구 분야입니다. 어떻게 올바른 개체를 택할지, 개체 사이의 상호작용은 어떻게 나타낼지에 대해 다루기 때문입니다. 설계를 통해 이런 의사결정을 진행하죠. 객체 지향 설계에 관한 훌륭한 책을 몇 가지 소개해 드립니다. E.Gamma, R.Helm, R.Johnson, J.Vissides의 저서 "Elements of Reusable Object-Oriented Software"나 G.Booch의 "Object-Oriented Analysis and Design with Applications" 등의 책을 읽어보길 권유 드립니다.
```
### 메서드 단축 구문

단축 구문은 객체 리터럴 안에 메서드를 선언할 때 사용할 수 있습니다.

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
  sayHi() { // "sayHi: function()"과 동일합니다
*/!*
    alert("Hello");
  }
};
```

위와 같이 `"function"`을 생략하고 메서드 이름 `sayHi()`만 써도 메서드를 정의할 수 있습니다.

사실 두 방법은 완전히 동일한 표기법은 아닙니다. 객체 상속에 관한 미묘한 차이점이 존재하죠(이에 대해선 곧 다루도록 하겠습니다). 현재로는 이 차이가 중요하지 않습니다. 대부분의 상황에서 단축 구문을 사용하는 것이 선호됩니다.

## 메서드 내 "this"

객체의 메서드는 객체 안에 저장된 정보에 접근해 무언가를 할 때가 많습니다.

`user.sayHi()` 메서드가 `user`의 name 정보를 이용해 인사말을 만들어야 할 때가 이런 경우겠죠.

**`this` 키워드를 사용하면 메서드가 객체에 접근할 수 있게 할 수 있습니다.**

"점 앞"의 `this`는 객체를 참조합니다. 정확히는 메서드를 호출하는데 사용된 객체를 참조하죠.

예시:

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

`user.sayHi()`를 실행하는 동안, `this`가 참조하는 값은 `user`가 됩니다.

`this` 없이도 이 객체에 접근할 수 있긴 합니다. 외부 변수를 참조하면 가능하죠.

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

그런데 이렇게 외부 변수를 이용해 객체를 참조하면 예상치 못한 일이 발생할 수 있습니다. `admin = user`같이 `user`를 복사해 다른 변수에 할당하고, 기존에 있던 `user` 객체에 다른 값을 덮어쓴 경우를 생각해 봅시다. 이렇게 되면 엉뚱한 객체를 참조하겠죠.

이런 경우를 실제 코드를 이용해 재현해 보겠습니다.

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
user = null; // user객체에 null을 덮어씁니다.

admin.sayHi(); // 이런! sayHi()가 엉뚱한 객체를 참고해서 에러가 발생했네요!
```

`alert` 안에서 `user.name` 대신 `this.name`을 사용했다면, 코드가 원하는 대로 작동했을 겁니다.

## 어디에도 종속되지 않는 "this"

자바스크립트에서 "this" 키워드는 다른 프로그래밍 언어에서의 this와 다르게 동작합니다. 가장 먼저 소개해 드릴 특징은 어떤 함수에서도 사용할 수 있다는 점입니다.

다음 코드에는 문법 오류가 없습니다.

```js
function sayHi() {
  alert( *!*this*/!*.name );
}
```

`this`가 무엇을 참조하는지는 런타임의 컨텍스트에 따라 동적으로 결정됩니다. 어떤 것이든 될 수 있죠.

아래 예제에서처럼, 동일한 함수라도 다른 객체에서 이 함수를 호출했다면 "this"가 참조하는 값은 달라집니다.

```js run
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

*!*
// 두 개의 객체에서 하나의 함수를 사용함
user.f = sayHi;
admin.f = sayHi;
*/!*

// 함수가 참조하는 this는 각각 다름
// "this"는 "점(.) 앞의" 객체를 참조함
user.f(); // John  (this는 user를 가리킴)
admin.f(); // Admin  (this는 admin을 가리킴)

admin['f'](); // Admin (점(.)을 통한 접근과 대괄호를 이용한 접근에 차이가 없습니다)
```

규칙은 간단합니다. `obj.f()`가 호출되었다면, `this`는 `f`를 호출하는 동안의 `obj`가 됩니다. 위 예제에선 `user`이나 `admin`가 되겠죠.

````smart header="객체 없이 호출하기 `this == undefined`"
객체가 없어도 함수를 호출할 순 있습니다.

```js run
function sayHi() {
  alert(this);
}

sayHi(); // undefined
```

이 경우, 엄격 모드(strict mode)에선 `this`가 `undefined`가 됩니다. `this.name`에 접근하려 한다면, 에러가 발생하죠.

엄격 모드가 아닐 때, `this`는 *전역 객체*를 참조합니다(브라우저 환경에서 전역객체는 `window`가 되겠죠. 전역 객체는 [](info:global-object)에서 자세히 다루도록 하겠습니다). 이런 동작 차이는 `"use strict"'`가 도입된 배경이기도 합니다.

객체 없이 `this`를 사용하는 함수를 호출하는 것은 대게 프로그래밍 발생한 실수일 경우가 많습니다. 함수 몸체에 `this`가 있는 경우는, 이 함수를 어떤 객체와 함께 호출할 것임을 의도했다고 보면 됩니다.
````

```smart header="자유로운 `this`가 만드는 결과"
다른 언어를 사용하다 자바스크립트로 넘어온 개발자는 객체에서 정의한 메서드는 항상 그 객체를 참조하는 this를 가지고 있다는 개념("bound `this`")이 자바스크립트에도 적용될 것이라 생각합니다

하지만 자바스크립트에서 this는 런타임에 결정되기 때문에, 이런 개념이 적용되지 않습니다. 자바스크립트의 `this`는 "자유롭죠". 메서드가 어디서 정의되었는지에 전혀 종속되지 않고, "점 앞의" 객체가 무엇인가에 따라 값이 결정됩니다.

이렇게 런타임에 결정되는 `this`의 동작 방식은 장점도 있고 단점도 있습니다. 여러 객체에 하나의 함수를 재사용할 수 있어서 좋지만, 이런 유연성이 실수로 이어질 수 있기 때문에 주의해야 합니다.

자바스크립트가 this를 다루는 방식이 좋은지 나쁜지는 우리가 판단할 문제가 아닙니다. 개발자는 this의 동작 방식을 충분히 이해하고, 장점을 취하면서 실수를 피하는 데 집중하면 됩니다. 
```

## 자바스크립트 내부 탐색하기: 참조 타입(Reference Type)

```warn header="자바스크립트 내부 기능"
이번 절은 특정 에지 케이스(edge case)를 설명하기 위해 작성하였습니다.

빠르게 튜토리얼을 학습하고 싶다면 이 절을 넘어가거나 학습을 미뤄도 괜찮습니다.
```

함수 호출이 복잡하게 얽혀있을 때 `this`가 참조하는 값을 찾지 못할 수 있습니다. 아래와 같이 말이죠.

```js run
let user = {
  name: "John",
  hi() { alert(this.name); },
  bye() { alert("Bye"); }
};

user.hi(); // John (단순한 호출은 의도하는 대로 동작합니다)

*!*
// name 값을 이용해 user.hi나 user.bye를 호출해 봅시다.
(user.name == "John" ? user.hi : user.bye)(); // Error!
*/!*
```

예시의 마지막 줄엔 `user.hi`나 `user.bye` 중 하나를 고르는 조건부 연산자가 있습니다. user 객체의 name이 "John"이므로 결과는 `user.hi`가 될 것입니다.

hi 메서드는 `()`와 함께 즉시 호출됩니다. 하지만 예상하던 대로 작동하지 않습니다!

메서드는 호출되었지만, 에러가 발생한 것을 확인할 수 있습니다. 메서드 호출 시 `"this"`의 값이 `undefined`가 되어버리기 때문입니다.

아래 코드는 명확히 작동합니다(객체 점 메서드).
```js
user.hi();
```

이 코드는 작동하지 않죠(계산된 메서드). 
```js
(user.name == "John" ? user.hi : user.bye)(); // Error!
```

왜 그럴까요? 원인을 알려면 `obj.method()` 호출의 작동 방법을 밑바닥부터 알아보아야 합니다.

코드를 유심히 살펴보면 표현식 `obj.method()`을 평가할 때 두 번의 연산이 수행된다는 걸 알 수 있습니다.

1. 점 `'.'`은 객체 프로퍼티 `obj.method`에 접근하도록 해 줍니다.
2. 괄호 `()`를 만나 메서드가 실행됩니다.

첫 번째 연산에서 얻은 `this`에 대한 정보가 어떻게 두 번째 연산에 전달될까요? 

점과 괄호를 다른 줄에서 사용하면 `this`에 대한 정보를 잃게 되는 건 확실합니다.

```js run
let user = {
  name: "John",
  hi() { alert(this.name); }
}

*!*
// 메서드 참조와 호출을 두 줄에 나누어서 함
let hi = user.hi;
hi(); // undefined
*/!*
```

`hi = user.hi`는 함수를 변수에 할당합니다. 마지막 줄은 그 윗줄과 연관이 없고 완전히 독립적이기 때문에 `this`가 참조하는 값이 없게 됩니다.

**자바스크립트에선 `user.hi()` 호출을 의도한 대로 동작시키기 위해 속임수를 사용합니다. `'.'`은 함수를 반환하지 않고, 특별한 값인 [참조 타입(Reference Type)](https://tc39.github.io/ecma262/#sec-reference-specification-type)을 반환합니다.**

이 참조 타입은 "명세에서 쓰이는 타입(Specification type)"입니다. 개발자가 참조 타입을 명시적으로 사용할 수는 없지만, 자바스크립트 내부에선 사용됩니다. 

참조 타입은 값 세개`(base, name, strict)`를 조합해 그 값을 확정합니다.

- `base`는 객체,
- `name`은 프로퍼티의 이름,
- `strict`는 `use strict`의 여부를 나타냅니다. 엄격 모드라면 이 값은 true입니다.

`user.hi` 프로퍼티에 접근하면 함수가 아닌, 참조 타입의 값을 참조합니다. 엄격 모드라면 `user.hi`가 참조하는 값은 아래와 같습니다.

```js
// 참조 타입 값
(user, "hi", true)
```

참조 타입에 괄호 `()`를 호출할 때, 괄호는 객체와 객체의 메서드에 관한 모든 정보를 받습니다. 그 후 알맞은 `this`(`=user`)를 결정하죠.

Reference type is a special "intermediary" internal type, with the purpose to pass information from dot `.` to calling parentheses `()`.

`hi = user.hi`내의 할당 연산과 같은 점 이외의 연산들은 참조 타입을 통째로 버리고, `user.hi`(함수)의 값을 받아 전달합니다. 그래서 그 이후의 연산에서 `this`의 정보는 사라집니다.

이런 이유로 `this`의 값은 점을 사용한 `obj.method()`, 또는 대괄호를 사용한 `obj[method]()`와 같이 함수를 직접 호출했을 때만 의도한 대로 전달됩니다. 추후 [func.bind()](/bind#solution-2-bind) 등을 이용해 이 문제를 해결하는 방법을 알아보도록 하겠습니다.

## 화살표 함수엔 "this"가 없습니다

화살표 함수는 "자신의" `this`를 가지지 않습니다. 조금 특별하죠. 화살표 함수 본문에서 참조하는 `this`는 "화살표 함수가 아닌 평범한" 외부 함수에서 참조하는 값을 참조합니다. 

아래 코드에서 `arrow()`는 바깥 `user.sayHi()`메서드의 `this`를 사용합니다.

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

이런 동작 방식은 화살표 함수가 제공하는 특별한 기능입니다. 독립된 `this`를 사용하지 않고 싶은데, 외부 컨텍스트에서 `this`를 가지고 오고 싶은 경우, 화살표 함수가 유용합니다. 이 내용은 <info:arrow-functions>에서 더 깊이 다뤄보도록 하겠습니다.


## 요약

- 객체 프로퍼티에 저장된 함수는 "메서드"라 부릅니다. 
- `object.doSomthing()`는 객체를 "행동"할 수 있게 해줍니다. 
- 메서드는 `this`로 객체를 참조할 수 있습니다.

`this`의 값은 런타임에 결정됩니다. 
- 함수 선언 시, `this`를 사용할 수 있지만, 함수가 호출되기 전까지 `this`의 값은 없습니다.
- 함수는 객체 간 복사될 수 있습니다.
- `object.method()`같이 "메서드" 문법으로 함수가 호출될 경우, `this`의 값은 `object`입니다.

화살표 함수는 특별합니다. `this`를 가지지 않죠. 화살표 함수 안에서 `this`를 사용하면, 그 값을 바깥에서 가져옵니다. 
