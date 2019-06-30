libs:
  - lodash

---

# 커링과 partials

지금까지는 `this`를 어떻게 바인딩할 것인지 알아보았습니다. 이번 챕터에서는 좀 더 깊이 배워보겠습니다. 

오직 `this`만을 바인드할 수 있는 것은  아니고 인수들도 바인드할 수 있습니다. 흔하게 사용되지는 않지만 가끔은 편리할 때가 있습니다. 

아래는 `bind`의 전체구문입니다.

```js
let bound = func.bind(context, arg1, arg2, ...);
```

위의 함수는 `this`를 컨텍스트로 바인드한 다음에 함수의 인수들을 바인딩하기 시작합니다.

예를 들면, 아래에 곱셈하는 함수 `mul(a,b)`가 있습니다.

```js
function mul(a, b) {
  return a * b;
}
```

`bind`를 사용해서 새로운 `double` 함수를 생성해 보겠습니다.

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

`mul.bind (null, 2)` 를 호출하면 `mul`에 호출을 전달하는 새로운 함수 `double`이 만들어지고 `null`이 컨텍스트로,`2`가 첫 번째 인수로 사용됩니다. 추가로 전해지는 인수는 "그대로" 전달됩니다.

이것을 [partial 함수 애플리케이션](https://en.wikipedia.org/wiki/Partial_application) -- 기존 매개변수의 일부 매개변수를 고정하여 새로운 함수를 작성한 것 이라고 합니다.

여기서 실제로 `this`를 사용하지 않는다는 것을 주의해야 합니다. `bind` 할 대상이 필요로하기 때문에 `null`과 같은 것을 넣어야 하는 것이죠.

아래의 `triple` 함수 예시는 값을 3 세배로 만듭니다.

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

왜 partial 함수가 필요할까요?

장점은 읽을 수가 있는 이름 (`double`,`triple`)을 가진 독립적인 함수를 생성할 수 있다는 것입니다. `bind`로 첫 번째 인수가 고정되어있기 때문에 매번 제공하지 않아도 됩니다.

다른 경우에는 부분적으로 애플리케이션이 매우 일반적인 기능을 가지고 있을 때 편의를 위해서 다소 다목적으로 사용할 수 있게 변형하고 싶을 때 유용합니다.

예를 들면, `send(from, to, test)` 함수가 있다고 할때  `user` 객체 안에는 `sendTo (to, text)`를 부분적으로 변형해서 현재 유저가 보내는 것으로 수정할 때 사용할 수 있습니다.

## 컨텍스트 없이 partial 하기

만약에 `this`를 바인드하지 않고 인수들을 변경하려면 어떻게 할까요?

기본적인 `bind`는 컨텍스트를 생략하고 인수들로 건너뛰는 것을 허용하지 않습니다.

그러나 다행히도, 인수들만을 바인딩하는 `partial` 함수는 쉽게 작성할 수 있습니다. 

아래와 같습니다.

```js run
*!*
function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}
*/!*

// 사용법
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  }
};

// partial 매서드를 추가함으로써 첫 번째 인수를 변경하여 무엇인가 출력되게 하기
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hello");
// 아래와 같은 결과
// [10:00] John: Hello!
```

`partial(func[, arg1, arg2...])` 호출의 결과는 `func`를 호출하는 래퍼 `(*)`입니다.
- 똑같은 `this`를 갖습니다. (`user.sayNow`는 `user`라고 부릅니다)
- 그다음 `...argsBound`를 전달 --  (`"10:00"`)를 호출한 `partial`의 인수들
- 그다음 `...args`를 전달 -- (`"Hello"`)래퍼로 부터 받은 인수들

전개 연산자를 사용하니 참 쉽죠?

또한 [_.partial](https://lodash.com/docs#partial)라는 이미 작성된 lodash 라이브러리도 있습니다.

## 커링(Currying)

가끔은 위에서 언급한 partial 기능을 가진 애플리케이션을 "커링"이라는 또 다른 기능과 섞어서 사용합니다. 커링은 이번 챕터에서 알아볼 함수로 또 다른 흥미로운 기술입니다.

[커링](https://en.wikipedia.org/wiki/Currying) 은 함수를 `f (a, b, c)` 와 같이 호출할 수가 있는 함수를 `f(a)(b)(c)`로 호출할 수 있도록 변환하는 함수입니다. 자바스크립트에서는 보통 원래 함수를 유지하는 래퍼를 만듭니다. 

커링은 함수를 호출하지 않습니다. 단지 변환할 뿐이죠.

두 개의 인수 `f`를 커링하는 `curry(f)`라는 헬퍼 함수를 생성해보죠. 다른 말로 하면, `curry(f)`라는 함수의 두 개의 신수 `f(a, b)`를 `f(a)(b)`로 번역하는 것 입니다.

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

// 사용법
function sum(a, b) {
  return a + b;
}

let carriedSum = curry(sum);

alert( carriedSum(1)(2) ); // 3
```

위의 예시에서 보듯이, 구현은 래퍼를 여러 개 사용한 것과 같습니다.

- `curry(func)`의 결과는 `function(a)` 래퍼입니다.
- `sum(1)`과 같은 함수를 호출했을 때, 그 인수는 렉시컬 환경에 저장이 되고 새로운 래퍼 `function(b)`이 반환됩니다.
- 그다음에 `sum(1)(2)`이 마침내 `2`를 제공하는 `function(b)`를 호출합니다, 그리고 그것이 원래의 다중인수를 가진 `sum`르로 넘겨져서 호출됩니다. 

lodash 라이브러리의 [_.curry](https://lodash.com/docs#curry) 같은 커링의 더 진보적인 구현은 더 정교한 작업을 수행합니다. 모든 인수가 제공될 때 함수가 정상적으로 호출되도록 하는 래퍼를 반환합니다. *또는* 그렇지 않으면 partial을 반환합니다.

```js
function curry(f) {
  return function(...args) {
    // if args.length == f.length (as many arguments as f has),
    //   then pass the call to f
    // otherwise return a partial function that fixes args as first arguments
  };
}
```

## 커링? 무엇을 위한 것인가?

커링의 이점을 이해하려면 가치가 있을 만한 실제 사례가 필요합니다.

고급 currying 기능은 정상적으로 또는 부분적으로 호출할 수 있습니다.

예를 들어, 정보를 형식화하고 출력하는 로그 기능 `log (date, importance, message)`를 가지고 있습니다. 실제 프로젝트에서 이러한 함수에는 네트워크를 통해 로그를 보내는 것과 같은 많은 유용한 기능이 있습니다.

```js
function log(date, importance, message) {
  alert(`[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`);
}
```

커리 해봅시다!

```js
log = _.curry(log);
```

위의 반영 후에도 `log`는 여전히 정상적으로 작동합니다

```js
log(new Date(), "DEBUG", "some debug");
```

...그러나 역시 커리된 양식으로 호출 될 수도 있습니다

```js
log(new Date())("DEBUG")("some debug"); // log(a)(b)(c)
```

log라는 편리한 함수를 사용해 보겠습니다.

```js
// currentLog 는 log 의 첫 번째 인수가 고정된 partial이 될 것입니다.
let logNow = log(new Date());

// 사용해 보겠습니다
logNow("INFO", "message"); // [HH:mm] INFO message
```

편리한 debug message 함수를 사용해 보겠습니다.

```js
let debugNow = logNow("DEBUG");

debugNow("message"); // [HH:mm] DEBUG message
```

결과적으로
1. 커링한 후에 잃은 것은 없습니다. `log`는 아직 보통 때처럼 호출할 수 있습니다.
2. today's logs처럼 일반적인 partial 함수들을 생성할 수 있습니다.

## 고급 커리 구현

만약 좀 더 깊이 공부하고 싶다면(필수는 아닙니다!), 아래 예시를 통해 "고급"커리를 구현하는 방법을 알아보겠습니다.

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

alert( curriedSum(1, 2, 3) ); // 6, still callable normally
alert( curriedSum(1)(2,3) ); // 6, currying of 1st arg
alert( curriedSum(1)(2)(3) ); // 6, full currying
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

위의 예시를 실행시키면, 두 개의 분기점이 있습니다

1. Call now :`args` count가 원래 함수에서 정의된 (`func.length`)만큼 또는 그것보다 길다면, 그 함수에 호출을 전달함.
2. Get a partial: 아니면, `func`이 아직 호출되지 않았음. 대신에 `pass`라는 다른 래퍼가 반환되고, 그것이 이전 인수들과 함께 새로운 인수들을 제공하는 `curried`에 다시 적용됩니다. 그다음에 새로운 호출에, 다시, 새로운 partial을 받거나 (만약에 인수들이 충분하지 않다면) 아니면 최종적으로 결과를 받습니다. 

예를 들면,  `sum(a, b, c)` 예시에서 어떻게 진행되었는지 살펴보세요. 세 가지 인수들, `sum.length = 3`입니다.

`curried(1)(2)(3)`를 호출하기 위해서는

1. 첫 번째 `curried(1)` 호출이 `1`을 렉시컬 환경에 기억합니다, 그리고 `pass` 래퍼를 반환합니다.
2. `pass`래퍼가 `(2)`와 함께 호출됩니다 : 이전의 인수인 (`1`)을 가져서 `(2)`와 연결하고`curried (1, 2)`를 호출합니다.
    
    인수 카운트가 여전히 3보다 작으면 `curry`는 `pass`를 반환합니다.
3. `pass` 래퍼가 다시 `(3)`과 함께 호출됩니다, 다음 호출인 `pass(3)`가 이전의 인수들인 (`1`, `2`)를 가져오고 `3`을 추가하고 `curried(1, 2, 3)` 호출을 합니다 -- 여기에 `3`인수는 마지막으로, 원래의 함수에 주어졌습니다.

아직 확실하게 이해되지 않았다면, 호출되는 순서를 마음속이나 종이에 그려보세요.

```smart header="오직 고정된 길이의 함수들만 사용 가능합니다"
커링은 함수가 알려진 수의 인수를 가지도록 요구합니다.
```

```smart header="커링보다는 조금 더"
정의를 내리자면, 커링은 `sum(a, b, c)`을 `sum(a)(b)(c)`으로 변환해야 합니다.

그러나 자바스크립트에서 대부분의 커링구현은 고급단계입니다. 살펴보았듯이, 다중-인수 변형에서 함수를 호출할 수 있도록 유지합니다.
```

## 요약

- 기존 함수의 일부 인수를 수정하면 결과 함수 (일부 범용적인)를 *a partial* 함수라고 부릅니다. `bind`를 사용하여 partial을 구현할 수 있지만 다른 방법들도 있습니다.

    Partials 은 똑같은 인수를 계속 사용해야 할 때 편리합니다. `send(from, to)` 같은 함수가 있고 `from`이 항상 똑같은 작업일 때 partial을 적용해서 일괄적으로 적용할 수 있습니다.

- *커링*은 `f(a,b,c)`를 호출할 수 있는 `f(a)(b)(c)` 함수로 변환하는 기술입니다. 보통 자바스크립트에서의 구현은 해당 함수는 평소처럼 호출도 하고 만약에 인수들이 충분하지 않을 경우 partial을 반환합니다. 

    커링은 partials을 쉽게 할 수 있을 때 좋습니다. logging 예시에서 보았듯이, `log(date, importance, message)`라는 다목적인 함수는 커링후에 하나의 인수인 경우에는 `log(date)` 아니면 두 개의 인수일 때는 `log(date, importance)`라는 partials 을 전달합니다.
