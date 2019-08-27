libs:
  - lodash

---

# 커링

[커링](https://en.wikipedia.org/wiki/Currying) 은 함수와 함께 사용할 수 있는 고급기술입니다. 오직 자바스크립트에만 존재하는 것은 아니고 다른 언어에도 존재합니다.

은 `f(a, b, c)`와 같은 호출 가능한 함수를 `f(a)(b)(c)`와 같이 호출할 수 있도록 변환하는 것입니다.

커링은 함수를 호출하지 않습니다. 단지 변환할 뿐이죠.

먼저 예제를 통해서 커링이 무엇인지 이해하고 그 다음에 실용적인 적용법을 알아보겠습니다.

`f`의 두 개의 인수를 커링하는 헬퍼 함수 `curry(f)`를 생성해 보겠습니다. 다르게 표현하면, `curry(f)`를 만들어서 두 개의 인수를 가진 `f(a, b)`를 `f(a)(b)`로 변환하는 것입니다.

```js run
*!*
function curry(f) { // curry(f) does the currying transform
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

As you can see, the implementation is straightforward: it's just two wrappers.
위의 예시에서 보듯이, 구현은 래퍼를 여러 개 사용한 것과 같습니다.

- The result of `curry(func)` is a wrapper `function(a)`.
- When it is called like `sum(1)`, the argument is saved in the Lexical Environment, and a new wrapper is returned `function(b)`.
- Then this wrapper is called with `2` as an argument, and it passes the call to the original `sum`.

- `curry(func)`의 결과는 `function(a)` 래퍼입니다.
- `sum(1)`과 같은 함수를 호출했을 때, 그 인수는 렉시컬 환경에 저장이 되고 새로운 래퍼 `function(b)`이 반환됩니다.
- 그리고 래퍼가 `2`라는 인수와 호출됩니다. 그리고 원래의 `sum`으로 넘겨져서 호출됩니다. 

odash 라이브러리의 [_.curry](https://lodash.com/docs#curry) 같은 더 진보적인 커링의 구현은 더욱 정교한 작업을 수행합니다. 모든 인수가 제공될 때 함수가 정상적으로 호출되도록 하는 래퍼를 반환합니다. *또는* 그렇지 않으면 partial을 반환합니다.

```js run
function sum(a, b) {
  return a + b;
}

let carriedSum = _.curry(sum); // using _.carry from lodash library

alert( carriedSum(1, 2) ); // 3, still callable normally
alert( carriedSum(1)(2) ); // 3, called partially
```

## 커링? 무엇을 위한 것인가?

커링의 이점을 이해하려면 가치가 있을 만한 실제 사례가 필요합니다.

예를 들어, 정보를 형식화하고 출력하는 로그 함수 `log (date, importance, message)`가 있다고 가정해 보겠습니다. 실제 프로젝트에서 이러한 함수는 네트워크를 통해 로그를 보내는 것과 같은 많은 유용한 기능을 제공합니다. 여기서는 `경고` 문을 띄우는 것으로 해보겠습니다.

```js
function log(date, importance, message) {
  alert(`[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`);
}
```

커리 해봅시다!

```js
log = _.curry(log);
```

위의 반영 후에도 `log`는 여전히 정상적으로 작동합니다.

```js
log(new Date(), "DEBUG", "some debug"); // log(a, b, c)
```

...그러나 커리가 적용된 폼으로도 작동합니다.

```js
log(new Date())("DEBUG")("some debug"); // log(a)(b)(c)
```

이제 현재 로그를 호출하는데 편리하도록 함수를 작성할 수 있습니다.

```js
// logNow 는 log 의 첫 번째 인수가 고정된 partial이 될 것입니다.
let logNow = log(new Date());

// use it
logNow("INFO", "message"); // [HH:mm] INFO message
```

이제 `logNow` 는 `log`의 첫번째 인수를 고정한것입니다, 다른말로하면 "partially 적용된 함수" 또는 짧게하면 "partial" 입니다.

이제 더 나아가서 디버깅 로그를 편리하게 하는 함수를 만들어 보겠습니다.

```js
let debugNow = logNow("DEBUG");

debugNow("message"); // [HH:mm] DEBUG message
```

So:
결과적으로
1. 커링한 후에 잃은 것은 없습니다. `log`는 아직 보통 때처럼 호출할 수 있습니다.
2. 오늘의 로그 같은 partial 함수를 쉽게 작성할 수 있습니다.


## Advanced curry implementation
## 고급 커리 구현

만약 좀 더 깊이 공부하고 싶다면 (필수는 아닙니다!), 예제를 통해서 "고급"커리를 구현하는 방법을 알아보겠습니다.

사실 꽤 짧습니다.

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

사용 예시입니다.

```js
function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

alert( curriedSum(1, 2, 3) ); // 6, 보통방법으로 호출하기
alert( curriedSum(1)(2,3) ); // 6, 첫번째 인수를 커링하기
alert( curriedSum(1)(2)(3) ); // 6, 모두 커링하기
```

새로운 `curry`는 복잡해 보일 수도 있지만 사실 이해하기는 쉽습니다.

`curry(func)`의 결과는 `curried`라는 아래의 래퍼와 같습니다.

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

위의 예시를 실행시키면, 두 개의 `if` 분기점이 있습니다.

1. 호출했을 때 :`args` count가 원래 함수에서 정의된 (`func.length`)만큼 또는 그것보다 길다면, 그 함수에 호출을 전달함.
2. partial 을 받을때: 아니면, `func`이 아직 호출되지 않습니다. 대신에 `pass`라는 다른 래퍼가 반환되고, 그것이 이전 인수들과 함께 새로운 인수들을 제공하는 `curried`에 다시 적용됩니다. 그다음에 새로운 호출에, 다시, 새로운 partial을 받거나 (만약에 인수들이 충분하지 않다면) 최종적으로 결과를 받습니다. 

For instance, let's see what happens in the case of `sum(a, b, c)`. Three arguments, so `sum.length = 3`.
예를 들면, `sum(a, b, c)` 예시에서 어떻게 진행되었는지 살펴보세요. 인수들이 세개 이므로 `sum.length = 3` 입니다.

`curried(1)(2)(3)`를 호출하기 위해서는

1. 첫 번째 `curried(1)` 호출이 `1`을 렉시컬 환경에 기억합니다. 그리고 `pass` 래퍼를 반환합니다.
2. `pass`래퍼가 `(2)`와 함께 호출됩니다 : 이전의 인수인 (`1`)을 가져서 `(2)`와 연결하고`curried (1, 2)`를 함께 호출합니다. 인수의 개수는 아직 3보다 작기때문에 `curry`는 `pass`를 반환합니다.
3. `pass` 래퍼가 다시 `(3)`과 함께 호출됩니다, 다음 호출인 `pass(3)`가 이전의 인수들인 (`1`, `2`)를 가져오고 `3`을 추가하고 `curried(1, 2, 3)` 호출을 합니다 -- 여기에 `3`인수는 마지막으로, 원래의 함수에 전달됩니다.

아직 확실하게 이해되지 않았다면, 호출되는 순서를 마음속이나 종이에 그려보세요.

```smart header="오직 고정된 길이의 함수들만 사용가능합니다"
커링은 해당 함수가 고정된 개수의 인수들을 가지도록 요구합니다.

`f(...args)`같은 나머지 매개변수를 사용하는 함수는 이러한 방법으로 커리할 수 없습니다.
```

```smart header="커링보다는 조금 더"
커링의 정의에 따르면, 커링은 `sum(a, b, c)`을 `sum(a)(b)(c)`으로 변환해야 합니다.

그러나 커링의 구현은 자바스크립트에서 고급단계입니다. 이번 챕터에서 알아보았듯이 커링은 함수를 다중-인수 변형 형태로 호출 가능할 수 있도록 하는 것 입니다.
```

## 요약

*커링*은 `f(a,b,c)`를 `f(a)(b)(c)` 형태로 호출할 수 있는 함수로 변환하는 기술입니다. 보통 자바스크립트에서의 구현은 해당 함수는 평소처럼 호출도 하고 만약에 인수들이 충분하지 않을 경우 partial을 반환합니다. 

커링은 partials를 쉽게 할 수 있도록 합니다. 로그 예시에서 보았듯이 다목적으로 쓰였던 `log(date, importance, message)` 함수는 커링후에 `log(date)`같이 하나의 인수를 가진 형태나 `log(date, importance)`처럼 두 개의 인수를 가진 형태로 호출할 수 있었습니다.