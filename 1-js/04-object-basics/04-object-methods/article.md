# 객체 메서드, "this"

객체는 사용자(user), 주문하기(order) 같이 실제 세계에 존재하는 개체(entity)를 표현할 목적으로 만들어집니다.

```js
let user = {
  name: "John",
  age: 30
};
```

실제 세상에서 사용자는 *행동*할 수 있는 개체입니다. 장바구니에서 물건 선택하기, 로그인하기, 로그아웃하기 등등의 행위를 하죠.

자바스크립트는 프로퍼티에 정의한 함수로 이런 행동을 표현합니다.  

## 메서드 예제

메서드에 대해 알아봅시다. 일단 `user`에게 hello 라고 말할 수 있는 능력을 부여해 보죠.

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

위 코드에선 함수 표현식(Function Expression)을 이용해 함수를 만들었습니다. 그리고 이 함수를 객체의 `user.sayHi` 프로퍼티 할당해 주었습니다. 

객체에 함수를 등록해주었기 때문에, 이제 호출할 수 있게 되었습니다. user에게 인사를 할 수 있는 능력이 부여되었습니다!

sayHi처럼 객체의 속성인 함수를 *메서드*라고 부릅니다.

위 코드에선 `user` 객체의 `sayHi`가 메서드가 되는 거죠.

이렇게 객체에 직접 메서드를 등록할 수 있지만, 이미 선언된 함수도 객체의 메서드로 등록할 수 있습니다.

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

OOP는 중요한 연구분야입니다. 어떻게 올바른 개체를 택할지, 개체 사이의 상호작용을 어떻게 나타낼 지에 대해 다루기 때문입니다. 설계를 통해 이런 의사결정을 진행하죠. 객체 지향 설계에 관한 훌륭한 책을 몇가지 소개해 드립니다. E.Gamma, R.Helm, R.Johnson, J.Vissides의 저서 "Elements of Reusable Object-Oriented Software"나 G.Booch의 "Object-Oriented Analysis and Design with Applications" 등의 책을 읽어보길 권유드립니다.
```
### 메서드 단축 구문

객체 리터럴 안에 메서드를 선언할 때 사용할 수 있는 단축구문을 소개합니다.

```js
// 아래 두 객체는 동일하게 동작합니다

let user = {
  sayHi: function() {
    alert("Hello");
  }
};

// 단축 구문을 사용하니 더 깔끔해 보이네요.
let user = {
*!*
  sayHi() { // "sayHi: function()"와 동일합니다
*/!*
    alert("Hello");
  }
};
```

위와 같이 `"function"`을 생략하고 메서드이름 `sayHi()`만 써도 메서드를 정의할 수 있습니다.

사실 두 방법은 완전히 동일한 표기법은 아닙니다. 객체 상속에 관한 미묘한 차이점이 존재하죠(이에 대해선 곧 다루도록 하겠습니다). 현재로는 이 차이가 중요하지 않습니다. 대부분의 상황에서 단축 구문을 사용하는 것이 선호되죠.

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

`user.sayHi()`을 실행하는 동안, `this`가 참조하는 값은 `user`가 됩니다.

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
user = null; // user객체에 null을 덮어 씁니다.

admin.sayHi(); // 이런! sayHi()가 엉뚱한 객체를 참고해서 에러가 발생했네요!
```

`alert` 안에서 `user.name`대신 `this.name`을 사용했다면, 코드가 원하는 대로 작동했을 겁니다.

## 어디에도 종속되지 않는 "this"("this" is not bound)

자바스크립트에서 "this" 키워드는 다른 프로그래밍 언어에서의 this 키워드와 다르게 동작합니다. 가장 먼저 소개해 드릴 특징은 어떤 함수에서도 사용할 수 있다는 점입니다.

다음 코드에는 문법 오류가 없습니다.

```js
function sayHi() {
  alert( *!*this*/!*.name );
}
```

`this`가 무엇을 참조하는지는 런타임에 결정됩니다. 따라서 this가 참조하는건 상황에 따라 동적으로 결정됩니다.

아래 예제에서 처럼, 동일한 함수라도 다른 객체에서 이 함수를 호출했다면 "this"가 참조하는 값은 다릅니다.

```js run
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

*!*
// 두개의 객체에서 하나의 함수를 사용함
user.f = sayHi;
admin.f = sayHi;
*/!*

// 함수가 참조하는 this는 각각 다름
// "this"는 "점(.) 앞의" 객체를 참조함
user.f(); // John  (this는 user를 가리킴)
admin.f(); // Admin  (this는 admin을 가리킴)

admin['f'](); // Admin (점(.)을 통한 접근과 대괄호를 이용한 접근에 차이가 없습니다)
```

사실, sayHi 함수를 객체 없이도 호출할 수 있습니다.

```js run
function sayHi() {
  alert(this);
}

sayHi(); // undefined
```

이런 경우에 엄격 모드(strict mode)에선 `this`가 `undefined`가 됩니다. `this.name`에 접근하려 한다면, 에러가 발생할 것입니다.

엄격 모드가 아닐 때, `this`는 *전역 객체*를 참조합니다(브라우저 환경에서 전역객체는 `window`가 되겠죠. 전역 객체는 [](info:global-object)에서 자세히 다루도록 하겠습니다). 이런 동작 차이는 `"use strict"'`가 도입된 배경이기도 합니다.

객체 없이 `this`를 사용하는 함수를 호출하는 것은 정상적인 방법이 아닙니다. 프로그래밍 실수입니다. 함수 몸체에 `this`가 있는 경우는, 이 함수를 어떤 객체와 함께 호출할 것임을 의도했다고 보면 됩니다.

```smart header="자유로운 `this`가 만드는 결과"
다른 언어를 사용하다 자바스크립트로 넘어왔다면, 객체에서 정의한 메서드는 항상 그 객체를 참조하는 this를 가지고 있다는 개념("bound `this`")을 자바스크립트에도 적용하려고 할 것입니다.

하지만 자바스크립트에서 `this`는 "자유롭습니다". this의 값은 런타임에 정해집니다. 메서드가 어디서 정의되었는지에 전혀 종속되지 않고, "점 앞의" 객체가 무엇인가에 따라 값이 결정됩니다.

이렇게 런타임에 결정되는 `this`의 동작 방식은 장점도 있고 단점도 있습니다. 여러 객체에 하나의 함수를 재사용 할 수 있어서 좋지만, 이런 유연성이 실수로 이어질 수 있기 때문에 주의해야 합니다.

자바스크립트가 this를 다루는 방식이 좋은지 나쁜지는 우리가 판단할 문제가 아닙니다. 개발자는 this의 동작 방식을 충분히 이해하고, 장점을 취하면서 실수를 피하는 데 집중하면 됩니다. 
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

- `base`는 객체입니다.
- `name`은 프로퍼티입니다.
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
