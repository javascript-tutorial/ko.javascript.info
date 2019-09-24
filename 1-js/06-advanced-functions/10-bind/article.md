libs:
  - lodash

---

# 함수 바인딩

When passing object methods as callbacks, for instance to `setTimeout`, there's a known problem: "losing `this`".

In this chapter we'll see the ways to fix it.

## "this"를 잃어버리는 것

We've already seen examples of losing `this`. Once a method is passed somewhere separately from the object -- `this` is lost.

아래 예시를 통해 그 현상이 `setTimeout`에서 어떻게 일어나는지 살펴보겠습니다.

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

위에 예시처럼, 결과는 "John"이 `this.firstName` 이 되어야 하는데 `undefined` 입니다!

그 이유는 `setTimeout` 이 `user.sayHi`함수를 객체로부터 독립적으로 가져왔기 때문입니다. 마지막 라인을 다시 쓰면 다음과 같습니다.

```js
let f = user.sayHi;
setTimeout(f, 1000); // user 컨텍스트를 잃어버렸음
```

The method `setTimeout` in-browser is a little special: it sets `this=window` for the function call (for Node.js, `this` becomes the timer object, but doesn't really matter here). So for `this.firstName` it tries to get `window.firstName`, which does not exist. In other similar cases, usually `this` just becomes `undefined`.

호출될 곳에서 객체 메서드를 다른 곳으로 (여기서는 스케줄러에) 전달하려고 하는 것은 매우 전형적인 현상입니다. 어떻게 하면 올바른 컨텍스트에서 호출되는 것을 확인할 수 있을까요?

## 첫 번째 해결책: a wrapper

가장 간단한 해결방법은 wrapping 함수를 사용하는 것입니다.

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

위의 예시는 작동합니다, 왜냐하면 `user`를 외부 렉시컬 환경으로 받아서 메서드를 보통 때처럼 호출했기 때문입니다.

위 예시와 같지만, 짧게 하면 아래와 같습니다.

```js
setTimeout(() => user.sayHi(), 1000); // Hello, John!
```

위의 코드는 보기에는 괜찮지만, 코드 구조에는 약간 취약한 점이 있습니다.

`setTimeout`이 시작되기 전에 (1초의 지연이 있습니다!) `user`가 값을 변경하면 어떻게 될까요? 그렇게 되면 갑자기 잘못된 개체를 호출할 것입니다!


```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(() => user.sayHi(), 1000);

// ...1초 안에
user = { sayHi() { alert("Another user in setTimeout!"); } };

// setTimeout에 또 다른 user 가?!?
```

두 번째 해결방법은 갑자기 값이 변경되는 현상이 일어나는 걸 방지합니다.

## 두 번째 해결방법: bind

함수들은 `this`를 수정하도록 하는 내장 매서드 [bind](mdn:js/Function/bind) 를 제공합니다.

기본 문법:

```js
// 더 복잡한 문법은 나중에 다루겠습니다
let boundFunc = func.bind(context);
````

`func.bind(context)`의 결과는 "exotic object" 같은 특별한 함수입니다, 이것은 함수로서 호출할 수도 있으면서 `func`에 `this = context`를 명확하게 전달합니다.

즉,`boundFunc`를 호출하는 것은 `this`가 고정된 `func`와 같습니다.

아래 예시에서 `funcUser`는 `this = user`를 가지고 `func` 를 호출합니다.

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

위의 예시에서 `func.bind (user)`는`func`의 "바운드 변수"로 고정된 `this = user`를 가지고 있습니다.

모든 인수는 기본적으로 "있는 그대로" `func` 에 전달됩니다. 예시는 아래와 같습니다:

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
funcUser("Hello"); // Hello, John ("Hello" 인수가 넘겨졌고 this=user입니다)
*/!*
```

이제 아래 예시에서 객체 메서드를 사용해 보겠습니다.


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

`(*)`줄에서 `user.sayHi` 메서드를 가져와서 `user`에 바인드합니다. `sayHi`는 단독으로 호출되거나 `setTimeout`에 전달될 수 있는 "바운드 (bound)"함수입니다 - 컨텍스트는 맞기 때문에 중요하지는 않습니다.

인수는 "있는 그대로" 전달되고, 단지 "this"만이 `bind`에 의해 고정된다는 것을 알 수 있습니다.

```js run
let user = {
  firstName: "John",
  say(phrase) {
    alert(`${phrase}, ${this.firstName}!`);
  }
};

let say = user.say.bind(user);

say("Hello"); // Hello, John ("Hello"인수가 say로 넘겨졌음)
say("Bye"); // Bye, John ("Bye"가 say 로 넘겨졌음)
```

````smart header="Convenience method: `bindAll`"
객체가 많은 메서드를 가지고 있고 그것을 능동적으로 전달할 계획이라면, 모든 것을 루프로 묶을 수 있습니다.

```js
for (let key in user) {
  if (typeof user[key] == 'function') {
    user[key] = user[key].bind(user);
  }
}
```

자바스크립트 라이브러리들은 편리한 매스 바인딩(mass binding) 함수들을 제공하고 있습니다. lodash를 예로 들면 [_.bindAll(obj)](http://lodash.com/docs#bindAll) 가 있습니다.
````

## Partial functions

Until now we have only been talking about binding `this`. Let's take it a step further.

We can bind not only `this`, but also arguments. That's rarely done, but sometimes can be handy.

The full syntax of `bind`:

```js
let bound = func.bind(context, [arg1], [arg2], ...);
```

It allows to bind context as `this` and starting arguments of the function.

For instance, we have a multiplication function `mul(a, b)`:

```js
function mul(a, b) {
  return a * b;
}
```

Let's use `bind` to create a function `double` on its base:

```js run
function mul(a, b) {
  return a * b;
}

*!*
let double = mul.bind(null, 2);
*/!*

alert( double(3) ); // = mul(2, 3) = 6
alert( double(4) ); // = mul(2, 4) = 8
alert( double(5) ); // = mul(2, 5) = 10
```

The call to `mul.bind(null, 2)` creates a new function `double` that passes calls to `mul`, fixing `null` as the context and `2` as the first argument. Further arguments are passed "as is".

That's called [partial function application](https://en.wikipedia.org/wiki/Partial_application) -- we create a new function by fixing some parameters of the existing one.

Please note that here we actually don't use `this` here. But `bind` requires it, so we must put in something like `null`.

The function `triple` in the code below triples the value:

```js run
function mul(a, b) {
  return a * b;
}

*!*
let triple = mul.bind(null, 3);
*/!*

alert( triple(3) ); // = mul(3, 3) = 9
alert( triple(4) ); // = mul(3, 4) = 12
alert( triple(5) ); // = mul(3, 5) = 15
```

Why do we usually make a partial function?

The benefit is that we can create an independent function with a readable name (`double`, `triple`). We can use it and not provide the first argument every time as it's fixed with `bind`.

In other cases, partial application is useful when we have a very generic function and want a less universal variant of it for convenience.

For instance, we have a function `send(from, to, text)`. Then, inside a `user` object we may want to use a partial variant of it: `sendTo(to, text)` that sends from the current user.

## Going partial without context

What if we'd like to fix some arguments, but not the context `this`? For example, for an object method.

The native `bind` does not allow that. We can't just omit the context and jump to arguments.

Fortunately, a helper function `partial` for binding only arguments can be easily implemented.

Like this:

```js run
*!*
function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}
*/!*

// Usage:
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  }
};

// add a partial method with fixed time
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hello");
// Something like:
// [10:00] John: Hello!
```

The result of `partial(func[, arg1, arg2...])` call is a wrapper `(*)` that calls `func` with:
- Same `this` as it gets (for `user.sayNow` call it's `user`)
- Then gives it `...argsBound` -- arguments from the `partial` call (`"10:00"`)
- Then gives it `...args` -- arguments given to the wrapper (`"Hello"`)

So easy to do it with the spread operator, right?

Also there's a ready [_.partial](https://lodash.com/docs#partial) implementation from lodash library.

## Summary

메서드`func.bind (context, ... args)`는 컨텍스트의 `this`와 첫 번째 인수가 주어지면 수정되는 `func` 함수의 "바운드 변수"를 반환합니다.

Usually we apply `bind` to fix `this` for an object method, so that we can pass it somewhere. For example, to `setTimeout`.

When we fix some arguments of an existing function, the resulting (less universal) function is called *partially applied* or *partial*.

Partials are convenient when we don't want to repeat the same argument over and over again. Like if we have a `send(from, to)` function, and `from` should always be the same for our task, we can get a partial and go on with it.
