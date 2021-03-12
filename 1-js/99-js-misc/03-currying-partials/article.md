libs:
  - lodash

---

# 커링

[커링 (Currying)](https://en.wikipedia.org/wiki/Currying) 은 함수와 함께 사용할 수 있는 고급기술입니다. 오직 자바스크립트에만 존재하는 것은 아니고 다른 언어에도 존재하죠.

커링은 `f(a, b, c)`처럼 단일 호출로 처리하는 함수를 `f(a)(b)(c)`와 같이 각각의 인수가 호출 가능한 프로세스로 호출된 후 병합되도록 변환하는 것입니다.

커링은 함수를 호출하지 않습니다. 단지 변환할 뿐이죠.

먼저 예제를 통해서 커링이 무엇인지 이해하고 그다음에 실용적인 적용법을 알아보겠습니다.

`f`의 두 개의 인수를 커링하는 헬퍼 함수 `curry(f)`를 생성해 보겠습니다. 다른 말로 하면, `f(a, b)`처럼 두 개의 인수를 요구하는 함수를 `f(a)(b)` 형식으로 변환하는 `curry(f)`라는 함수를 만드는 것입니다.

```js run
*!*
function curry(f) { // 커링 변환을 하는 curry(f) 함수
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

let curriedSum = curry(sum);

alert( curriedSum(1)(2) ); // 3
```

위의 예시에서 보듯이, 실제 구현은 그저 두 개의 래퍼를 사용한 것과 같이 간단합니다.

- `curry(func)`의 반환값은 `function(a)`형태의 래퍼입니다.
- `curriedSum(1)`같은 함수가 호출되었을 때, 그 인수는 렉시컬 환경에 저장이 되고 새로운 래퍼 `function(b)`이 반환됩니다.
- 그리고 반환된 `function(b)`래퍼 함수가 `2`를 인수로 호출됩니다. 그리고 반환값이 원래의 `sum`으로 넘겨져서 호출됩니다. 

lodash 라이브러리의 [_.curry](https://lodash.com/docs#curry) 같이 래퍼를 반환할 때 함수가 보통 때처럼 또는 partial 적으로 호출하는 것을 허용하는 더 진보적으로 구현된 커링도 있습니다.

```js run
function sum(a, b) {
  return a + b;
}

let carriedSum = _.curry(sum); // lodash 라이브러리의 _.carry 사용

alert( carriedSum(1, 2) ); // 3, 보통 때 처럼 호출가능
alert( carriedSum(1)(2) ); // 3, partially 호출되었음
```

## 커링은 어디에 써야할까요?

커링의 이점을 이해하려면 가치가 있을 만한 실제 사례가 필요합니다.

예를 들어, 정보를 형식화하고 출력하는 로그 함수 `log (date, importance, message)`가 있다고 가정해 보겠습니다. 실제 프로젝트에서 이러한 함수는 네트워크를 통해 로그를 보내는 것과 같은 많은 유용한 기능을 제공합니다. 여기서는 `alert 창` 을 띄우는 것으로 해보겠습니다.

```js
function log(date, importance, message) {
  alert(`[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`);
}
```

커링을 적용해보겠습니다!

```js
log = _.curry(log);
```

위와 같이 커링을 적용한 후에도 기존 함수 `log` 는 정상적으로 작동합니다.

```js
log(new Date(), "DEBUG", "some debug"); // log(a, b, c)
```

...그러나 커링을 적용한 함수를 호출해도 정상적으로 동작합니다.

```js
log(new Date())("DEBUG")("some debug"); // log(a)(b)(c)
```

아래처럼 현재 시간으로 로그를 출력하는데 편리하도록 log 함수를 작성해서 사용할 수 있습니다.

```js
// logNow 는 log 의 첫 번째 인수가 고정된 partial이 될 것입니다.
let logNow = log(new Date());

// use it
logNow("INFO", "message"); // [HH:mm] INFO message
```

이제 `logNow` 는 `log`의 첫 번째 인수를 고정한 것입니다. 다른 말로 하면 "partially 적용된 함수" 또는 짧게 하면 "partial" 입니다.

이제 더 나아가서 디버깅 로그를 편리하게 하는 함수를 만들어 보겠습니다.

```js
let debugNow = logNow("DEBUG");

debugNow("message"); // [HH:mm] DEBUG 메세지
```

결과적으로
1. 커링한 후에 잃은 것은 없습니다. `log`는 아직 보통 때처럼 호출할 수 있습니다.
2. 오늘의 로그 같은 partial 함수를 쉽게 작성할 수 있습니다.

## 고급 커리 구현

좀 더 깊이 공부하고 싶은 분들을 위해 다중-인수를 허용하는 "고급" 커리를 구현하는 방법을 예제를 통해 알아보겠습니다.

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

alert( curriedSum(1, 2, 3) ); // 6, 보통때 처럼 단일 callable 형식으로 호출하기
alert( curriedSum(1)(2,3) ); // 6, 첫 번째 인수를 커링하기
alert( curriedSum(1)(2)(3) ); // 6, 모두 커링하기
```

새로운 `curry`는 복잡해 보일 수도 있지만 사실 이해하기는 쉽습니다.

`curry(func)`의 반환값은 `curried`라는 아래의 래퍼와 같습니다.

```js
// func 이 변환되어야 하는 함수입니다
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

(1)에 해당하는 경우(함수가 호출되었을때): `args` 를 카운트한 갯수가 전달된 원래 함수 func (`func.length`)와 같거나 길다면, 그대로 `func` 호출에 전달함.
(2)에 해당하는 경우(partial이 적용될때): 아직 `func`이 호출되지 않습니다. `pass`라는 래퍼가 대신 반환되고, `pass` 래퍼함수가 `curried`를 이전함수와 새로운 인수와 함께 다시 적용합니다. 그 다음 새로운 `curried` 호출에, 다시 새로운 partial (만약에 인수가 충분하지 않으면)을 반환하거나 최종적으로 `func` 결과를 반환합니다.

예를 들면, `sum(a, b, c)` 예시에서 어떻게 진행되었는지 살펴보세요. 인수가 세 개이므로 `sum.length = 3` 입니다.

`curried(1)(2)(3)`이 호출되는 과정은 다음과 같습니다.

1. 첫 번째 `curried(1)` 을 호출할때 `1`을 렉시컬 환경에 기억하고 `curried(1)` 이 `pass` 래퍼를 반환합니다.
2. `pass`래퍼가 `(2)`와 함께 호출됩니다. 이전의 인수인 (`1`)을 가져서 `(2)`와 연결하고`curried (1, 2)`를 함께 호출합니다. 인수의 개수는 아직 3보다 작기때문에 `curry`는 `pass`를 반환합니다.
3. `pass` 래퍼가 다시 `(3)`과 함께 호출됩니다. 다음 호출인 `pass(3)`가 이전의 인수들인 (`1`, `2`)를 가져오고 `3`을 추가하고 `curried(1, 2, 3)` 호출을 합니다 -- 여기에 `3`인수는 마지막으로, 원래의 함수에 전달됩니다.

아직 확실하게 이해되지 않았다면, 호출 순서를 마음속이나 종이에 그려보세요.

```smart header="오직 고정된 길이의 함수들만 사용 가능합니다"
커링은 해당 함수가 고정된 개수의 인수를 가지도록 요구합니다.

`f(...args)`같은 나머지 매개변수를 사용하는 함수는 이러한 방법으로 커리할 수 없습니다.
```

```smart header="커링보다는 조금 더"
커링의 정의에 따르면, 커링은 `sum(a, b, c)`을 `sum(a)(b)(c)`으로 변환해야 합니다.

그러나 커링의 구현은 자바스크립트에서 고급단계입니다. 이번 챕터에서 알아보았듯이 커링은 다중-인수를 단일 프로세스로 callable 한 함수를 다중 프로세스 형태로 변형할 수 있도록 하는 것입니다.
```

## 요약

*커링*은 `f(a,b,c)`를 `f(a)(b)(c)` 와 같이 다중 callable 프로세스 형태로 변환하는 기술입니다. 보통 자바스크립트에서의 커링되어진 함수는 평소처럼 호출도 하고 만약에 인수들이 충분하지 않을 때에는 partial을 반환합니다.

커링은 partial을 쉽게 적용할 수 있도록 해줍니다. 로그 예시에서 보았듯이 커링을 적용하면 인수 세 개의 범용 함수 `log(date, importance, message)`를 `log(date)`같이 인수가 하나인 형태나 `log(date, importance)`처럼 인수가 두 개인 형태로 호출할 수 있습니다.
