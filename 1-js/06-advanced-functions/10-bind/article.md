libs:
  - lodash

---

# Function binding
# 함수 바인딩(Function binding)

When using `setTimeout` with object methods or passing object methods along, there's a known problem: "losing `this`".
`setTimeout`을 객체 메서들 또는 객체 메서드 들을 보낼때, "`this`를 잃어버리는" 잘 알려진 문제점이 있습니다.

Suddenly, `this` just stops working right. The situation is typical for novice developers, but happens with experienced ones as well.
갑자기 `this`가 작동안하게 되는것이죠. 이 상황은 초보 개발자에게 자주 일어나지

## Losing "this"
## "this"를 잃어버리는것

We already know that in JavaScript it's easy to lose `this`. Once a method is passed somewhere separately from the object -- `this` is lost.
자바스크립트는 `this`를 쉽게 잃어버린다는것을 알고 있습니다. 매서드가 어딘가에서 객체로부터 독립적으로 넘겨질때 `this`는 잃어버립니다.

Here's how it may happen with `setTimeout`:
여기에 그 현상이 `setTimeout`과 어떻게 일어나는지 볼 수 있습니다: 

```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
setTimeout(user.sayHi, 1000); // Hello, undefined!
*/!*
```

As we can see, the output shows not "John" as `this.firstName`, but `undefined`!
볼수있듯이, 결과값이 "John"이 `this.firstName` 이 아니라 `undefined` 입니다!

That's because `setTimeout` got the function `user.sayHi`, separately from the object. The last line can be rewritten as:
그 이유는 `setTimeout` 이 `user.sayHi`함수를 객체로 부터 독립적으로 가져왔기 때문입니다. 마지막 라인은 이렇게 다시 쓰여질 수 있습니다:

```js
let f = user.sayHi;
setTimeout(f, 1000); // lost user context
```

The method `setTimeout` in-browser is a little special: it sets `this=window` for the function call (for Node.js, `this` becomes the timer object, but doesn't really matter here). So for `this.firstName` it tries to get `window.firstName`, which does not exist. In other similar cases as we'll see, usually `this` just becomes `undefined`.
`setTimeout`매서드는 브라우저 안에서는 조금 특별합니다. 그것은 `this=window` 을 함수를 호출하기 위해서 셋팅합니다(Node.js 에서는 `this` 가 타이머 객체가 됩니다. 여기서는 크게 상관은 없습니다). 그래서 `this.firstName` 은 존재하지 않는 `window.firstName`을 가져오려고 합니다. 다른 상황에서도 종종 `this`가 `undefined`로 되는것을 볼 것입니다.

The task is quite typical -- we want to pass an object method somewhere else (here -- to the scheduler) where it will be called. How to make sure that it will be called in the right context?
이 작업은 매우 전형적입니다. 호출 될 곳에서 객체 메서드를 다른 곳으로 (여기서는 스케쥴러에) 전달하려고합니다. 어떻게 올바른 컨텍스트에서 호출되는 것을 확인할수 있을까요?

## Solution 1: a wrapper
## 첫번째 해결책: a wrapper

The simplest solution is to use a wrapping function:
가장 간단한 해결방법은 wrapping 함수를 사용하는 것입니다:

```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);
*/!*
```

Now it works, because it receives `user` from the outer lexical environment, and then calls the method normally.
이제 작동합니다, 왜냐하면 `user`를 외부 렉시컬 환경으로 받아서 메서드를 보통때 처럼 호출했기 때문입니다.

The same, but shorter:
똑같지만, 짧게 하면:

```js
setTimeout(() => user.sayHi(), 1000); // Hello, John!
```

Looks fine, but a slight vulnerability appears in our code structure.
괜찮아 보입니다만, 코드 구조에는 약간 취약한 점이 있습니다.

What if before `setTimeout` triggers (there's one second delay!) `user` changes value? Then, suddenly, it will call the wrong object!
`setTimeout`이 시작되기 전에 (1 초의 지연이 있습니다!)`user`가 값을 변경하면 어떻게 될까요? 그렇다면 갑자기 잘못된 개체를 호출할것 입니다!


```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(() => user.sayHi(), 1000);

// ...within 1 second
user = { sayHi() { alert("Another user in setTimeout!"); } };

// Another user in setTimeout?!?
// setTimeout에 또 다른 user 가?!?
```

The next solution guarantees that such thing won't happen.
다음 해결책은 이러한 현상이 일어나는걸 방지합니다.

## Solution 2: bind
## 두번째 해결방법: bind

Functions provide a built-in method [bind](mdn:js/Function/bind) that allows to fix `this`.
함수들은 `this`를 수정하도록 하는 내장 매서드인 [bind](mdn:js/Function/bind) 를 제공합니다.

The basic syntax is:
기본 문법:

```js
// more complex syntax will be little later
let boundFunc = func.bind(context);
````

The result of `func.bind(context)` is a special function-like "exotic object", that is callable as function and transparently passes the call to `func` setting `this=context`.
`func.bind(context)`의 결과는 "exotic object"같은 특별한 함수입니다, 이것은 함수로서 호출 가능하고`func`에`this = context`를 투명하게 전달합니다.

In other words, calling `boundFunc` is like `func` with fixed `this`.
즉,`boundFunc`를 호출하는 것은 `this`가 고정 된 `func`와 같습니다.

For instance, here `funcUser` passes a call to `func` with `this=user`:
예를 들면 여기서 `funcUser`는 `this = user` 를 가지고 `func` 를 호출합니다 :

```js run  
let user = {
  firstName: "John"
};

function func() {
  alert(this.firstName);
}

*!*
let funcUser = func.bind(user);
funcUser(); // John  
*/!*
```

Here `func.bind(user)` as a "bound variant" of `func`, with fixed `this=user`.

All arguments are passed to the original `func` "as is", for instance:

여기 `func.bind (user)`는 `func`의 "바운드 변수"로 고정 된 `this = user`를 가지고 있습니다.

모든 인수는 원래 `func` "있는 그대로"으로 전달됩니다. 예를 들면:

```js run  
let user = {
  firstName: "John"
};

function func(phrase) {
  alert(phrase + ', ' + this.firstName);
}

// bind this to user
let funcUser = func.bind(user);

*!*
funcUser("Hello"); // Hello, John (argument "Hello" is passed, and this=user)
*/!*
```

Now let's try with an object method:
이제 객체 메서드를 사용해 보겠습니다:


```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
let sayHi = user.sayHi.bind(user); // (*)
*/!*

sayHi(); // Hello, John!

setTimeout(sayHi, 1000); // Hello, John!
```

In the line `(*)` we take the method `user.sayHi` and bind it to `user`. The `sayHi` is a "bound" function, that can be called alone or passed to `setTimeout` -- doesn't matter, the context will be right.

Here we can see that arguments are passed "as is", only `this` is fixed by `bind`:

`(*)`줄에서 `user.sayHi` 메소드를 가져 와서 `user`에 바인드합니다. `sayHi`는 단독으로 호출되거나 `setTimeout`에 전달 될 수있는 "바운드 (bound)"함수입니다 - 중요하지는 않습니다. 컨텍스트는 맞을 것입니다.

인수는 "있는 그대로"전달되고, 단지 "this"만이 `bind`에 의해 고정된다는 것을 알 수 있습니다:

```js run
let user = {
  firstName: "John",
  say(phrase) {
    alert(`${phrase}, ${this.firstName}!`);
  }
};

let say = user.say.bind(user);

say("Hello"); // Hello, John ("Hello" argument is passed to say)
say("Bye"); // Bye, John ("Bye" is passed to say)
```

````smart header="Convenience method: `bindAll`"
If an object has many methods and we plan to actively pass it around, then we could bind them all in a loop:
객체가 많은 메서드를 가지고 있고 그것을 능동적으로 전달할 계획이라면, 모든 것을 루프로 묶을 수 있습니다:

```js
for (let key in user) {
  if (typeof user[key] == 'function') {
    user[key] = user[key].bind(user);
  }
}
```

JavaScript libraries also provide functions for convenient mass binding , e.g. [_.bindAll(obj)](http://lodash.com/docs#bindAll) in lodash.
자바스크립트 라이브러리들은 편리한 매스 바인딩(mass binding)함수들을 제공하고 있습니다. 예를들면, lodash 에는 [_.bindAll(obj)](http://lodash.com/docs#bindAll)가 있습니다.
````

## Summary
## 요약

Method `func.bind(context, ...args)` returns a "bound variant" of function `func` that fixes the context `this` and first arguments if given.

Usually we apply `bind` to fix `this` in an object method, so that we can pass it somewhere. For example, to `setTimeout`. There are more reasons to `bind` in the modern development, we'll meet them later.

메서드`func.bind (context, ... args)`는 문맥`this`와 첫 번째 인수가 주어지면 수정하는`func` 함수의 "바운드 변수"를 반환합니다.

보통 객체 메소드에서 `this '를 고치기 위해 `bind`를 적용하여 어딘가에 전달할 수 있습니다. 예를 들면,`setTimeout`. 현대적인 개발에 'bind'하는 이유는 더 있습니다. 나중에 다시 다루어 보겠습니다.