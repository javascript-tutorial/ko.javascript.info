libs:
  - lodash

---

# Currying and partials
# 커링과 partials

Until now we have only been talking about binding `this`. Let's take it a step further.
지금까지는 `this`를 어떻게 바인딩할 것인지 알아보았습니다. 이번 챕터에서는 좀 더 깊이 알아보겠습니다. 

We can bind not only `this`, but also arguments. That's rarely done, but sometimes can be handy.
오직 `this`만을 바인드할수 있는것은 아니고 인수들도 바인드 할수있습니다. 흔하게 사용되지는 않지만 가끔은 편리할때가 있습니다. 

The full syntax of `bind`:
아래는 `bind`의 전체구문입니다

```js
let bound = func.bind(context, arg1, arg2, ...);
```

It allows to bind context as `this` and starting arguments of the function.
위의 함수는 `this`를 컨텍스트로 바인드한 다음에 함수의 인수들을 바인딩하기 시작합니다.

For instance, we have a multiplication function `mul(a, b)`:
예를들면, 아래에 곱셈을 하는 함수 `mul(a,b)`가 있습니다

```js
function mul(a, b) {
  return a * b;
}
```

Let's use `bind` to create a function `double` on its base:
`bind`를 기반으로 사용해서 새로운 `double`함수를 생성해 보겠습니다

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
`mul.bind (null, 2)` 를 호출하면 `mul`에 호출을 전달하는 새로운 함수`double`이 만들어지고 `null`이 컨텍스트로,`2`가 첫 번째 인수로 사용됩니다. 추가적으로 전해지는 인수는 "그대로" 전달됩니다.

That's called [partial function application](https://en.wikipedia.org/wiki/Partial_application) -- we create a new function by fixing some parameters of the existing one.
이것을 [partial function application](https://en.wikipedia.org/wiki/Partial_application) -- 기존 매개변수의 일부 매개변수를 고정하여 새로운 함수를 작성합니다.

Please note that here we actually don't use `this` here. But `bind` requires it, so we must put in something like `null`.
여기서 실제로 `this`를 사용하지 않는다는 것을 주의해야 합니다. `bind`가 필요로하기 때문에 `null`과 같은 것을 넣어야 하는것이죠.

The function `triple` in the code below triples the value:
아래의 `triple`함수 예시는 값을 3세배로 만듭니다

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
왜 partial 함수를 만들어야 할까요?

The benefit is that we can create an independent function with a readable name (`double`, `triple`). We can use it and not provide first argument of every time as it's fixed with `bind`.
좋은점은 읽을 수있는 이름 (`double`,`triple`)을 가진 독립적인 함수를 생성 할 수 있다는 것입니다. `bind`로 첫 번째 인수가 고정되어있기 때문에 매번 제공하지 않아도 됩니다.

In other cases, partial application is useful when we have a very generic function and want a less universal variant of it for convenience.
다른 경우에는 부분적으로 애플리케이션이 매우 일반적인 기능을 가지고 있을때 편의를 위해서 약간 다목적으로 사용할 수 있게 변형이 필요할 때 유용합니다.

For instance, we have a function `send(from, to, text)`. Then, inside a `user` object we may want to use a partial variant of it: `sendTo(to, text)` that sends from the current user.
예를들면, `send(from, to, test)`함수가 있다고 할때  `user` 객체 안에는 `sendTo (to, text)`를 부분적으로 변형해서 현재 유저가 보내는것으로 수정할때 사용할수 있습니다.

## Going partial without context
## 컨텍스트 없이 partial 하기

What if we'd like to fix some arguments, but not bind `this`?
만약에 `this`를 바인드하지 않고 인수들을 변경하려면 어떻게 할까요?

The native `bind` does not allow that. We can't just omit the context and jump to arguments.
기본적인 `bind`는 컨텍스트를 생략하고 인수들로 건너뛰는것을 허용하지 않습니다.

Fortunately, a `partial` function for binding only arguments can be easily implemented.
다행히도, 인수들만을 바인딩하는 `partial`함수는 쉽게 작성할수 있습니다. 

Like this:
아래와 같습니다

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

// add a partial method that says something now by fixing the first argument
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hello");
// Something like:
// [10:00] John: Hello!
```

The result of `partial(func[, arg1, arg2...])` call is a wrapper `(*)` that calls `func` with:
`partial(func[, arg1, arg2...])`호출의 결과는 `func`를 호출하는 래퍼 `(*)`입니다.

- Same `this` as it gets (for `user.sayNow` call it's `user`)
- 똑같은 `this`를 갖습니다 (`user.sayNow`는 `user`라고 부릅니다)
- Then gives it `...argsBound` -- arguments from the `partial` call (`"10:00"`)
- 그 다음 `...argsBound`를 전달 --  (`"10:00"`)를 호출한 `partial`의 인수들
- Then gives it `...args` -- arguments given to the wrapper (`"Hello"`)
- 그 다음 `...args`를 전달 -- (`"Hello"`)래퍼로 부터 받은 인수들

So easy to do it with the spread operator, right?
전개 연산자를 사용하니 참 쉽죠?

Also there's a ready [_.partial](https://lodash.com/docs#partial) implementation from lodash library.
또한 [_.partial](https://lodash.com/docs#partial)라는 이미 작성된 lodash 라이브러리도 있습니다.

## Currying
## 커링(Currying)

Sometimes people mix up partial function application mentioned above with another thing named "currying". That's another interesting technique of working with functions that we just have to mention here.
때로 위에서 언급한 partial 기능을 가진 애플리케이션을 "커링"이라는 또 다른 기능과 섞어서 사용합니다. 커링은 이번 챕터에서 알아볼 함수로 작업하는 또 다른 흥미로운 기술입니다.

[Currying](https://en.wikipedia.org/wiki/Currying) is a transformation of functions that translates a function from callable as `f(a, b, c)` into callable as `f(a)(b)(c)`. In JavaScript, we usually make a wrapper to keep the original function.
[커링](https://en.wikipedia.org/wiki/Currying) 는 함수를 `f (a, b, c)` 와 같이 호출할 수있는 함수를 `f(a)(b)(c)`로 호출 할 수 있도록 변환하는 함수입니다. 자바스크립트에서는 보통 원래 함수를 유지하는 래퍼를 만듭니다. 

Currying doesn't call a function. It just transforms it.
커링은 함수를 호출하지 않습니다. 단지 변환할뿐이죠.

Let's create a helper `curry(f)` function that performs currying for a two-argument `f`. In other words, `curry(f)` for two-argument `f(a, b)` translates it into `f(a)(b)`
두개의 인수 `f`를 커링하는 `curry(f)`라는 헬퍼 함수를 생성해보죠. 다른말로 하면, `curry(f)`라는 함수의 두개의 신수 `f(a, b)`를 `f(a)(b)`로 번역하는것 입니다.

```js run
*!*
function curry(f) { // curry(f) 가 커링을 하게 됩니다
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}
*/!*

// usage
function sum(a, b) {
  return a + b;
}

let carriedSum = curry(sum);

alert( carriedSum(1)(2) ); // 3
```

As you can see, the implementation is a series of wrappers.
위의 예시에서 보듯이, 구현은 래퍼를 여러개 사용한것과 같습니다.

- The result of `curry(func)` is a wrapper `function(a)`.
- `curry(func)`의 결과는 `function(a)`래퍼입니다.
- When it is called like `sum(1)`, the argument is saved in the Lexical Environment, and a new wrapper is returned `function(b)`.
- `sum(1)`과 같은 함수를 호출했을때, 그 인수는 렉시컬 환경에 저장이 되고 새로운 래퍼 `function(b)`이 반환됩니다.
- Then `sum(1)(2)` finally calls `function(b)` providing `2`, and it passes the call to the original multi-argument `sum`.
- 그 다음에 `sum(1)(2)`이 마침내 `2`를 제공하는 `function(b)`를 호출합니다, 그리고 그것이 원래의 다중인수를 가진 `sum`르로 넘겨져서 호출됩니다. 

More advanced implementations of currying like [_.curry](https://lodash.com/docs#curry) from lodash library do something more sophisticated. They return a wrapper that allows a function to be called normally when all arguments are supplied *or* returns a partial otherwise.
lodash 라이브러리의 [_.curry](https://lodash.com/docs#curry)같은 커링의 더 진보적인 구현은 더 정교한 작업을 수행합니다. 모든 인수가 제공될 때 함수가 정상적으로 호출되도록하는 래퍼를 반환합니다. *또는* 그렇지 않으면 partial을 반환합니다.

```js
function curry(f) {
  return function(...args) {
    // if args.length == f.length (as many arguments as f has),
    //   then pass the call to f
    // otherwise return a partial function that fixes args as first arguments
  };
}
```

## Currying? What for?
## 커링? 무엇을 위한 것인가?

To understand the benefits we definitely need a worthy real-life example.
커링의 이점을 이해하려면 가치가 있을만한 실제 사례가 필요합니다.

Advanced currying allows the function to be both callable normally and partially.
고급 currying 기능은 정상적으로 또는 부분적으로 호출 할 수 있습니다.

For instance, we have the logging function `log(date, importance, message)` that formats and outputs the information. In real projects such functions also have many other useful features like sending logs over the network:
예를 들어, 정보를 형식화하고 출력하는 로그 기능`log (date, importance, message)`를 가지고있습니다. 실제 프로젝트에서 이러한 함수에는 네트워크를 통해 로그를 보내는 것과 같은 많은 유용한 기능이 있습니다.

```js
function log(date, importance, message) {
  alert(`[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`);
}
```

Let's curry it!
커리 해봅시다!

```js
log = _.curry(log);
```

After that `log` still works the normal way:
위의 반영후에도 `log`는 여전히 정상적으로 작동합니다

```js
log(new Date(), "DEBUG", "some debug");
```

...But also can be called in the curried form:
...그러나 역시 커리된 양식으로 호출 될수도 있습니다

```js
log(new Date())("DEBUG")("some debug"); // log(a)(b)(c)
```

Let's get a convenience function for today's logs:
log라는 편리한 함수를 사용해 봅니다

```js
// todayLog will be the partial of log with fixed first argument
let todayLog = log(new Date());

// use it
todayLog("INFO", "message"); // [HH:mm] INFO message
```

And now a convenience function for today's debug messages:
편리한 debug message 함수를 사용해 봅니다

```js
let todayDebug = todayLog("DEBUG");

todayDebug("message"); // [HH:mm] DEBUG message
```

So:
1. We didn't lose anything after currying: `log` is still callable normally.
2. We were able to generate partial functions such as for today's logs.

## Advanced curry implementation
## 고급 커리 구현

In case you'd like to get in details (not obligatory!), here's the "advanced" curry implementation that we could use above.
만약 좀더 깊이 공부하고 싶다면(필수는 아닙니다!), 아래 예시는 "고급"커리를 구현하는 방법을 보여주고 있습니다.

It's pretty short:
사실 꽤 짧습니다

```js
function curry(func) {

  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };

}
```

Usage examples:
사용 예시입니다

```js
function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

alert( curriedSum(1, 2, 3) ); // 6, still callable normally
alert( curriedSum(1)(2,3) ); // 6, currying of 1st arg
alert( curriedSum(1)(2)(3) ); // 6, full currying
```

The new `curry` may look complicated, but it's actually easy to understand.
새로운 `curry`는 복잡해 보일수도 있지만 사실 이해하기는 쉽습니

The result of `curry(func)` is the wrapper `curried` that looks like this:
`curry(func)`의 결과는 `curried`라는 아래의 래퍼와 같습니다

```js
// func is the function to transform
function curried(...args) {
  if (args.length >= func.length) { // (1)
    return func.apply(this, args);
  } else {
    return function pass(...args2) { // (2)
      return curried.apply(this, args.concat(args2));
    }
  }
};
```

When we run it, there are two branches:
위의 예시를 실행시키면, 두개의 브랜치가 있습니다

1. Call now: if passed `args` count is the same as the original function has in its definition (`func.length`) or longer, then just pass the call to it.
1. Call now :`args` count 가 원래 함수에서 정의된 (`func.length`)만큼 또는 그것보다 길다면, 그 함수에 호출을 전달함.

2. Get a partial: otherwise, `func` is not called yet. Instead, another wrapper `pass` is returned, that will re-apply `curried` providing previous arguments together with the new ones. Then on a new call, again, we'll get either a new partial (if not enough arguments) or, finally, the result.
2. Get a partial: 아니면, `func`이 아직 호출되지 않았음. 대신에 `pass`라는 다른 래퍼가 반환되고, 그것이 이전 인수들과 함께 새로운 인수들을 제공하는 `curried`에 다시 적용됩니다. 그 다음에 새로운 호출에, 다시, 새로운 partial 을 받거나 (만약에 인수들이 충분하지 않다면) 아니면 최종적으로 결과를 받습니다. 

For instance, let's see what happens in the case of `sum(a, b, c)`. Three arguments, so `sum.length = 3`.
예를 들면,  `sum(a, b, c)`예시에서 어떻게 진행되었는지 살펴보세요. 세가지 인수들, `sum.length = 3`입니다.

For the call `curried(1)(2)(3)`:
`curried(1)(2)(3)`를 호출하기 위해서는

1. The first call `curried(1)` remembers `1` in its Lexical Environment, and returns a wrapper `pass`.
1. 첫번채 `curried(1)`호출이 `1`를 렉시컬 환경에 기억합니다, 그리고 `pass`래퍼를 반환합니다.

2. The wrapper `pass` is called with `(2)`: it takes previous args (`1`), concatenates them with what it got `(2)` and calls `curried(1, 2)` with them together.
2. `pass`래퍼가 `(2)`와 함께 호출됩니다 : 이전의 인수인 (`1`)을 가져서 `(2)`와 연결시키고`curried (1, 2)`를 호출합니다.
    As the argument count is still less than 3, `curry` returns `pass`.
    인수 카운트가 여전히 3보다 작 으면 `curry`는 `pass`를 반환합니다.
3. The wrapper `pass` is called again with `(3)`,  for the next call `pass(3)` takes previous args (`1`, `2`) and adds `3` to them, making the call `curried(1, 2, 3)` -- there are `3` arguments at last, they are given to the original function.
3. `pass` 래퍼가 다시 `(3)`과 함께 호출됩니다, 다음 호출인 `pass(3)`이 이전의 인수들인 (`1`, `2`)를 가져오고 `3`을 추가하고 `curried(1, 2, 3)` 호출을 합니다 -- 여기에 `3`인수는 마지막으로, 원래의 함수에 주어졌습니다.

If that's still not obvious, just trace the calls sequence in your mind or on the paper.
아직 확실하게 이해되지 않았다면, 호출되는 순서를 마음속이나 종이에 그려보세요.

```smart header="Fixed-length functions only 오직 고정된 길이의 함수들만 사용가능합니다"
The currying requires the function to have a known fixed number of arguments.
커링은 함수가 알려진 수의 인수를 가지도록 요구합니다.
```

```smart header="A little more than currying 커링보다는 조금 더"
By definition, currying should convert `sum(a, b, c)` into `sum(a)(b)(c)`.
정의를 내리자면, 커링은 `sum(a, b, c)`을 `sum(a)(b)(c)`으로 변환해야 합니다.

But most implementations of currying in JavaScript are advanced, as described: they also keep the function callable in the multi-argument variant.
그러나 자바스크립트에서 대부분의 커링구현은 고급단계 입니다. 설명했듯이: 다중-인수 변형에서 함수를 호출 가능하도록 유지합니다.
```

## Summary
## 요약

- When we fix some arguments of an existing function, the resulting (less universal) function is called *a partial*. We can use `bind` to get a partial, but there are other ways also.
- 기존 함수의 일부 인수를 수정하면 결과 함수 (일부 범용적인)를 *a partial* 함수라고 부릅니다. `bind`를 사용하여 partial 을 구현할 수 있지만 다른 방법들도 있습니다.

    Partials are convenient when we don't want to repeat the same argument over and over again. Like if we have a `send(from, to)` function, and `from` should always be the same for our task, we can get a partial and go on with it.
    Partials 은 똑같은 인수를 계속 사용해야 할때 편리합니다. `send(from, to)`같은 함수가 있고 `from`이 항상 똑같은 작업일때 partial을 적용해서 일괄적으로 적용할수 있습니다.

- *Currying* is a transform that makes `f(a,b,c)` callable as `f(a)(b)(c)`. JavaScript implementations usually both keep the function callable normally and return the partial if arguments count is not enough.
- *커링*은 `f(a,b,c)`를 호출할수있는 `f(a)(b)(c)`함수로 변환하는 기술입니다. 보통 자바스크립트에서의 구현은 해당 함수는 평소처럼 호출도 하고 만약에 인수들이 충분하지 않을 경우 partial을 반환합니다. 

    Currying is great when we want easy partials. As we've seen in the logging example: the universal function `log(date, importance, message)` after currying gives us partials when called with one argument like `log(date)` or two arguments `log(date, importance)`.
    커링은 partials을 쉽게 할수 있을때 좋습니다. logging 예시에서 보았듯이, `log(date, importance, message)`라는 다목적인 함수는 커링후에 하나의 인수인 경우에는 `log(date)` 아니면 두개의 인수일때는 `log(date, importance)`라는 partials 을 전달합니다.
