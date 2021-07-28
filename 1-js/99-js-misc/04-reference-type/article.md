
# 참조 타입

```warn header="심화 학습"
이번 절에선 특정 에지 케이스(edge case)를 설명하기 위한 심화 내용을 다룹니다.

<<<<<<< HEAD
숙련된 상당수의 개발자가 이 절에서 다룰 내용을 모른 채로 일하고 있지만 문제가 없고, 중요한 내용은 아니기 때문에 자바스크립트 내부에서 어떤 일이 일어나는지 알고 싶지 않다면 이번 글은 넘어가거나 미뤄도 괜찮습니다.
=======
It's not important. Many experienced developers live fine without knowing it. Read on if you want to know how things work under the hood.
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b
```

복잡한 상황에서 메서드를 호출하면 `this` 값을 잃어버리는 경우가 생깁니다.

예시를 살펴봅시다.

```js run
let user = {
  name: "John",
  hi() { alert(this.name); },
  bye() { alert("Bye"); }
};

user.hi(); // John (간단한 호출은 의도한 대로 잘 동작합니다.)

// name에 따라 user.hi나 user.bye가 호출되게 해봅시다.
*!*
(user.name == "John" ? user.hi : user.bye)(); // TypeError: Cannot read property 'name' of undefined
*/!*
```

마지막 줄에서 조건부 연산자를 사용해 `user.hi`나 `user.bye` 중 하나가 호출되도록 했습니다. user의 name이 "John"이므로 `user.hi`가 호출될 것이라 예상하며 말이죠.

그런데 에러가 발생했습니다. 뒤에 `()`가 있어서 메서드 hi가 즉시 호출될 것이라 예상했는데 원하는 대로 되지 않았네요.

에러는 메서드를 호출할 때 `"this"`에 `undefined`가 할당되었기 때문에 발생했습니다.

마지막 줄이 아래와 같았다면 에러 없이 잘 작동했을 겁니다.
```js
user.hi();
```

그런데 아래 코드에선 에러가 발생하죠.
```js
(user.name == "John" ? user.hi : user.bye)();
```

원인이 뭘까요? 원인을 알려면 `obj.method()`를 호출했을 때, 내부에서 어떤 일이 일어나는지 알아야 합니다.

## 참조 타입 자세히 알아보기

코드를 유심히 살펴보면 `obj.method()`엔 연산이 두 개 있다는 걸 눈치챌 수 있습니다.

1. 점 `'.'`은 객체 프로퍼티 `obj.method`에 접근합니다.
2. 괄호 `()`는 접근한 프로퍼티(메서드)를 실행합니다.

그렇다면 첫 번째 연산에서 얻은 `this` 정보가 어떻게 두 번째 연산으로 전달될까요? 

두 연산을 각각 별도의 줄에서 두었다면 `this` 정보를 잃는 건 확실합니다.

```js run
let user = {
  name: "John",
  hi() { alert(this.name); }
}

*!*
// 메서드 접근과 호출을 별도의 줄에서 실행함
let hi = user.hi;
hi(); // this가 undefined이기 때문에 에러가 발생합니다.
*/!*
```

`hi = user.hi`에선 함수가 변수에 할당됩니다. 그런데 마지막 줄과는 완전히 독립적으로 동작하므로 `this`엔 아무런 값도 저장되지 않습니다.

**`user.hi()`를 의도한 대로 동작시키기 위해 자바스크립트는 속임수를 사용합니다. `'.'`이 함수가 아닌, [참조 타입(Reference Type)](https://tc39.github.io/ecma262/#sec-reference-specification-type) 값을 반환하게 하죠.**

참조 타입은 '명세서 에서만 사용되는 타입(specification type)'입니다. 개발자가 실제론 사용할 수 없습니다.

참조 타입에 속하는 값은 `(base, name, strict)`이 조합된 형태를 띱니다.

- `base`: 객체
- `name`: 프로퍼티의 이름
- `strict`: 엄격 모드에서 true

`user.hi`로 프로퍼티에 접근하면 함수가 아닌, 참조형(참조 타입) 값을 반환합니다. 엄격 모드에선 아래와 같은 값이 반환되죠.

```js
// 참조형 값
(user, "hi", true)
```

참조형 값에 괄호 `()`를 붙여 호출하면 객체, 객체의 메서드와 연관된 모든 정보를 받습니다. 이 정보를 기반으로 `this`(`=user`)가 결정됩니다.

이렇게 참조 타입은 내부에서 점 `.`연산에서 알아낸 정보를 괄호 `()`로 전달해주는 '중개인' 역할을 합니다.

그런데 점 연산 이외의 연산(할당 연산 등)은 참조 타입을 통째로 버리고 `user.hi` 값(함수)만 받아 전달합니다. 이 때문에 점 이외의 연산에선 `this` 정보가 사라집니다.

<<<<<<< HEAD
`obj.method()` 같이 점을 사용하거나, `obj[method]()` 같이 대괄호를 사용해 함수를 호출했을 때만 `this` 값이 의도한 대로 전달됩니다. 이런 문제는 [func.bind()](/bind#solution-2-bind) 등을 이용하면 해결 할 수 있는데, 이에 대해선 추후에 알아보도록 하겠습니다.
=======
So, as the result, the value of `this` is only passed the right way if the function is called directly using a dot `obj.method()` or square brackets `obj['method']()` syntax (they do the same here). There are various ways to solve this problem such as [func.bind()](/bind#solution-2-bind).
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

## 요약

참조 타입은 자바스크립트 내부에서 사용되는 타입입니다.

`.`이나 대괄호를 사용해 객체 프로퍼티인 메서드(`obj.method()`)에 접근하려 하면 정확한 프로퍼티 값이 반환되는 것이 아니라 특별한 형태의 값인 '참조 타입' 값이 반한됩니다. 이 참조타입 값엔 프로퍼티 값과 프로퍼티가 정의된 객체 정보가 담겨있습니다. 

`()`를 사용해 메서드를 호출할 때, 메서드 내에서 사용되는 `this`에 제대로 된 객체 정보를 전달해 줄 수 있는 이유가 바로 '참조 타입' 덕분입니다. 

그런데 `.`이나 대괄호 이외의 연산에선 참조 타입이 그냥 프로퍼티 값으로 변해버립니다. 객체 메서드라면 함숫값으로 변해버리죠.

이런 내부 동작은 보이지 않는 곳에서 일어납니다. 참조 타입이 어떻게 동작하는지 알아야 해결할 수 있는 문제는 표현식을 이용해 동적으로 객체에서 메서드를 가져올 때와 같이 자주 발생하지 않습니다.
