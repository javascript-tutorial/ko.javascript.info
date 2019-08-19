# 데코레이터 그리고 포워딩, call/apply

자바스크립트는 함수들을 대할 때 특별한 유동성을 제공합니다. 함수들이 서로 전달될 수 있고 객체처럼 사용될 수 있습니다. 이번 챕터에서는 여기서 더 나아가 함수들이 어떻게 *포워드* 되고 *데코레이트(decorate)* 되는지 살펴보겠습니다.  

## 캐싱의 투명성(Transparent caching)

`slow(x)`라는 CPU 사용률이 무겁지만, 결과는 안정적인 함수가 있다고 가정해보죠. 다르게 표현한다면, 똑같은 `x`라는 값에 대해 항상 같은 결과를 반환하는 함수가 있다고 가정해 보겠습니다. 

만약에 이러한 함수가 자주 호출된다면, 다른 `x`의 결과들을 캐시(기억) 해서 다시 계산하는 데 소모되는 추가적인 시간을 줄이고 싶을 것입니다.

그런데 이런 방법을 구현할 때 `slow()`에 추가적인 기능을 더하는 대신 래퍼(wrapper)를 생성할 수 있습니다. 이렇게 하는 데는 많은 장점이 있습니다.

아래에 코드와 설명을 통해 알아보겠습니다.

```js run
function slow(x) {
  // 이런 작업은 CPU를 많이 사용합니다
  alert(`Called with ${x}`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function(x) {
    if (cache.has(x)) { // 만약에 결과가 map에 담겨져 온다면
      return cache.get(x); // 그것을 반환합니다
    }

    let result = func(x); // 아닐경우 함수를 호출합니다

    cache.set(x, result); // 그리고 결과를 캐쉬(기억) 합니다
    return result;
  };
}

slow = cachingDecorator(slow);

alert( slow(1) ); // slow(1) 이 캐쉬되어 있습니다
alert( "Again: " + slow(1) ); // 똑같습니다

alert( slow(2) ); // slow(2) 가 캐쉬되어 있습니다
alert( "Again: " + slow(2) ); // 이전 라인과 같습니다
```

위의 예시에서 `cachingDecorator`처럼 다른 함수를 가져와서 그 행동을 변환하는 특별한 함수를 바로 *데코레이터* 라고 합니다.

중요한 것은 `cachingDecorator`는 대상이 어떤 함수이든지 상관없이 호출할 수 있고 그 함수는 캐싱 래퍼를 반환할 것입니다. 이런 방법은 어떠한 함수도 특별한 기능처럼 사용할 수 있기 때문에 좋습니다. 오직 필요한 것은 `cachingDecorator`를 적용하는 것뿐입니다.

캐싱을 해당하는 메인 함수 코드로부터 분리하는 것은 메인 코드를 간단하게 하는 데도 도움이 됩니다.

다음은 어떻게 작동하는지 자세히 알아보겠습니다.

`cachingDecorator(func)`의 결괏값은 "래퍼" 입니다: `function(x)` 이라는 함수로 "둘러싼" `func(x)`의 호출을 caching 로직으로 담아냅니다:

![](decorator-makecaching-wrapper.png)

위의 그림처럼, 래퍼는 `func(x)`의 결괏값을 "있는 그대로" 반환합니다. 코드의 바깥에서는, 둘러싸여진 `slow` 함수가 아직 똑같은 작업을 합니다. 단지 그 행동에 캐싱하는 것이 더해졌을 뿐이죠.

다시 설명하면, `slow` 코드를 직접 수정하는 것보다 독립적인 `cachingDecorator`를 사용하는 것은 다음과 같은 많은 이점이 있습니다:

- `cachingDecorator`는 재사용 가능합니다. 다른 함수에도 적용할 수 있습니다.
- 캐싱하는 로직이 분리됩니다, `slow` 함수 (다른 함수들이 되더라도) 자체를 복잡하게 만들지 않습니다.
- 필요에 따라 여러 개의 데코레이터들을 섞어서 사용할 수 있습니다(다른 데코레이터들에 대해서는 곧 알아보겠습니다).


## "func.call"을 컨텍스트에 사용하기

위에서 언급한 캐싱 데코레이터는 객체의 메서드들에게 사용하기는 적합하지는 않습니다.

예를 들면, 아래의 `worker.slow()` 코드는 데코레이션 뒤에 작동을 멈춥니다.

```js run
// worker.slow 캐싱을 만듬
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    // 아래와 같은 CPU-heavy 작업들이 있다고 한다면
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

// 이전코드와 같음
function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
*!*
    let result = func(x); // (**)
*/!*
    cache.set(x, result);
    return result;
  };
}

alert( worker.slow(1) ); // 원래 메서드는 작동함

worker.slow = cachingDecorator(worker.slow); // 캐싱을 생성

*!*
alert( worker.slow(2) ); // 에러, 정의되지 않은 'someMethod'프로퍼티를 읽을 수 없음
*/!*
```

`(*)`줄의 `this.someMethod`를 접근하려고 하면 에러가 발생하고 실패합니다. 왜 그럴까요?

이유는 `(**)`라인에서 래퍼는 원래의 함수인 `func(x)`를 그대로 호출하려고 하고 그렇게 호출되면 `this = undefined`가 됩니다.

아래의 코드를 실행시킬 경우 비슷한 현상이 일어납니다.

```js
let func = worker.slow;
func(2);
```

래퍼는 컨텍스트에 있는 `this` 없이 원래 가지고 있던 메서드를 호출하기 때문에 에러가 발생합니다.

이제 이런 문제를 고쳐보겠습니다.

특별히 제작된 함수 메서드인 [func.call(context, ...args)](mdn:js/Function/call) 를 사용하면 함수를 호출할 때 `this`를 설정하게 허용하고 있습니다.

문법은 다음과 같습니다.

```js
func.call(context, arg1, arg2, ...)
```

`func`를 실행할 때 첫 번째 인수로 `this`를 사용합니다. 그리고 다음 인수들이 따라옵니다.

아래의 두 호출은 거의 같습니다:
```js
func(1, 2, 3);
func.call(obj, 1, 2, 3)
```

위의 두 경우 모두 `func`와 인수들인 `1`, `2` 그리고 `3`을 호출합니다. 다른 점이 있다면 `func.call` 이 `this`를 `obj`로 설정한다는 것이죠.

예시에서처럼, 아래의 코드는 `sayHi`를 다른 객체들의 컨텍스트에서 호출합니다: `sayHi.call(user)` 는 `this=user`로 설정된 `sayHi`를 실행하고 다음 라인은 `this=admin`으로 설정합니다:

```js run
function sayHi() {
  alert(this.name);
}

let user = { name: "John" };
let admin = { name: "Admin" };

// 다른 객체를 "this"로 설정하도록 호출함
sayHi.call( user ); // this = John
sayHi.call( admin ); // this = Admin
```

그리고 아래 예시처럼 `call`을 사용해서 `say`를 부여받은 컨텍스트와 phrase를 호출합니다.


```js run
function say(phrase) {
  alert(this.name + ': ' + phrase);
}

let user = { name: "John" };

// user가 this 가 되고, "Hello"는 첫 번째 인수가 됩니다 
say.call( user, "Hello" ); // John: Hello
```


아래 예시에서는, `call`을 래퍼 안에서 사용해서 원래의 함수에 컨텍스트를 전달합니다.


```js run
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
*!*
    let result = func.call(this, x); // "this" 가 정확히 전달되었음
*/!*
    cache.set(x, result);
    return result;
  };
}

worker.slow = cachingDecorator(worker.slow); // 캐시를 생성합니다

alert( worker.slow(2) ); // 작동함
alert( worker.slow(2) ); // 작동함, 원래함수를 호출하지는 않았음 (캐싱되었음)
```

이제 모두 제대로 작동하는 것 같습니다.

더 확실히 이해하기 위해서 `this`가 어떻게 전달되었는지 자세히 알아보겠습니다:

1. `worker.slow`를 데코레이션 한 후에 `function (x) { ... }` 가 래퍼가 되었습니다.
2. 그래서 `worker.slow(2)`가 실행되었을 때는, 래퍼가 `2`를 인수로 하고 `this=worker`가 됩니다. (dot 이전에 객체입니다).
3. wrapper 안에서는, 결과가 캐시 되지 않았다고 가정합니다, `func.call(this, x)`이 현재의 `this`(`=worker`)를 전달하고 현재의 인수 (`=2`)를 원래 매서드에 전달합니다.

## "func.apply"를 다중-인수와 사용하기

이제 `cachingDecorator`를 다목적으로 만들어 보겠습니다. 아직은 오직 하나의 인수를 가진 함수들과 작동했으니까요.

`worker.slow`매서드를 어떻게 하면 다중-인수를 캐싱하게 할 수 있을까요?

```js
let worker = {
  slow(min, max) {
    return min + max; // 이것이 CPU를 많이 잡아먹는 작업이라고 가정 합니다
  }
};

// 똑같은 인수들을 호출해야 할 것입니다
worker.slow = cachingDecorator(worker.slow);
```

두 가지 해결해야 할 점이 있습니다.

첫 번째는 어떻게 `min` 과 `max`두 인수를 `cache` 맵의 키로 사용할 것인가입니다. 한가지 인수를 사용할 때 `x`는 `cache.set(x, result)`을 사용해서 결과를 저장하고 `cache.get(x)`을 사용하면 되었습니다. 그러나 이제 *인수의 조합* `(min,max)`를 기억해야 합니다만 네이티브 `Map`은 오직 한가지 값을 키로 가질 수 있습니다.

이것을 해결하는 방법은 여러 가지가 있습니다.

1. 새로운 (또는 서드파티) 더욱 변형하기 쉽고 멀티 키를 사용할 수 있는 자료형을 가진 맵을 사용한다.
2. 중첩 맵들을 사용한다: `cache.set(min)` 는 `(max, result)`라는 짝을 저장하는 `Map`이 될 것입니다. 그렇게 하면 `result`를 `cache.get(min).get(max)` 식으로 얻을 수 있을 것입니다.
3. 두 가지 값들을 하나로 합친다. `"min,max"` 문자열을 그냥 `Map` 값으로 사용할 것입니다. 좀 더 유동적으로 하기 위해서 *hashing function*를 데코레이터에 사용한다면 어떻게 많은 값을 하나로 만들 수 있는지 알 수 있습니다.


대다수의 애플리케이션은 3번째 방법이 적절하기 때문에 여기에서도 첫 번째 문제를 해결할 방법으로 선택하도록 하겠습니다.

두 번째 문제는 많은 인수를 어떻게 `func`으로 전달할까 하는 것입니다. 아직은 `function(x)` 래퍼는 하나의 인수를 가정하고 그것을 `func.call(this, x)`로 전달합니다.

해결방법은 [func.apply](mdn:js/Function/apply)라는 내장함수를 사용하는 것입니다.

문법은 아래와 같습니다.

```js
func.apply(context, args)
```

위의 함수는 `func`의 `this=context`를 설정하고 `args` 배열 같은 객체를 사용해서 인수를 리스트로 호출합니다.

아래 예시에서, 두 호출은 거의 같다고 할 수 있습니다.

```js
func(1, 2, 3);
func.apply(context, [1, 2, 3])
```

두 가지 모두 `func` 이 `1,2,3` 인수들을 전달합니다. 그러나 `apply` 또한 `this=context`를 설정합니다.

아래의 코드에서, 함수 `say`는 `this=user`와 `messageData`를 인수들이 리스트로 받아서 호출되었습니다.

```js run
function say(time, phrase) {
  alert(`[${time}] ${this.name}: ${phrase}`);
}

let user = { name: "John" };

let messageData = ['10:00', 'Hello']; // time과 phrase가 됨

*!*
// user는 this 가 됩니다, messageData 는 인수들로 구성된 리스트로 넘겨집니다(time, phrase)
say.apply(user, messageData); // [10:00] John: Hello (this=user)
*/!*
```

`call`과 `apply`의 다른 점은 `call`은 인수들로 구성된 리스트를, `apply`는 배열 같은 객체를 가져온다는 것입니다.

챕터 <info:rest-parameters-spread-operator> 에서 전개 연산자 `...` 가 배열(또는 iterable 반복 가능한) 인수들이 리스트로 전달할 수 있다는 것을 배웠습니다. 그리고 만약 전개 연산자를 `call`과 같이 사용한다면, 거의 `apply`와 똑같이 작동합니다.

아래의 두 가지 호출은 거의 동일합니다

```js
let args = [1, 2, 3];

*!*
func.call(context, ...args); // 배열을 전개 연산자 리스트처럼 전달합니다
func.apply(context, args);   // 위의 call은 apply를 사용하는 것과 같습니다
*/!*
```

그러나 자세히 보면 `call`과 `apply` 사이에는 조금 다른 점이 있습니다.

- 전개 연산자 `...`는 *iterable* `args`를 리스트처럼 `call` 함수에 전달하는 것을 허용합니다.
- `apply`는 오직 *유사 배열* `args` 만을 받습니다. 

따라서 두 가지 호출은 서로를 보완합니다. iterable 호출이 예상되는 곳에서 `call` 이 사용되고 유사 배열일 경우에는 `apply`가 사용됩니다.

그리고 `args`가 iterable 하면서 유사 배열일 경우에는, 기술적으로 실제 배열이면 어떤 것이든 사용할 수 있습니다만, `apply`가 단일 작업이기 때문에 더 빠르게 동작할 것입니다. 대부분 자바스크립트 엔진은 내부적으로 `call + spread`를 함께 쓰는 것보다 최적화가 잘 되게 되어있기 때문이죠.

한 가지 더 중요한 사실은 `apply`를 사용할 때, 아래 예시처럼 자신의 호출을 또 다른 함수로 전달할 수 있다는 것입니다.

```js
let wrapper = function() {
  return anotherFunction.apply(this, arguments);
};
```

위와 같은 것을 *call forwarding*이라고 합니다. 여기서 `래퍼`가 받는 모든 것을 전달합니다: `this`라는 컨텍스트와 인수를 `anotherFunction`의 결과와 함께 반환합니다.

외부의 `래퍼` 함수가 호출되었을 때, 원래 함수의 호출로부터는 구별할 수 없습니다.

`cachingDecorator`를 통해서 위에서 언급한 모든 것을 살펴보겠습니다.

```js run
let worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`);
    return min + max;
  }
};

function cachingDecorator(func, hash) {
  let cache = new Map();
  return function() {
*!*
    let key = hash(arguments); // (*)
*/!*
    if (cache.has(key)) {
      return cache.get(key);
    }

*!*
    let result = func.apply(this, arguments); // (**)
*/!*

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
  return args[0] + ',' + args[1];
}

worker.slow = cachingDecorator(worker.slow, hash);

alert( worker.slow(3, 5) ); // 작동함
alert( "Again " + worker.slow(3, 5) ); // 똑같음(캐쉬에 저장됨)
```

이제 래퍼는 인수의 개수가 몇 개든지 작동하게 되었습니다.

위의 예시에는 두 가지 변경 점이 있습니다

- `(*)`있는 줄에서 `hash`를 호출해서 `arguments`러부터 독립된 키를 만들어냅니다. 여기에 간단한 "joining" 함수를 만들어서 `(3, 5)`를 `"3, 5"`키값으로 반환하게 합니다. 더 복잡한 경우에는 다른 해시 함수가 필요하겠지만요.
- 그다음엔 `(**)`이 `func.apply`를 사용해서 래퍼가 가진 컨텍스트와 모든 인수를 (몇 개든 상관없이) 원래의 함수로 전달합니다.


## 메서드 빌리기 [#method-borrowing]

이제 해시 함수를 조금 개선해보겠습니다.

```js
function hash(args) {
  return args[0] + ',' + args[1];
}
```

위의 예시는 아직까진 두 개의 인수들로만 작동합니다만, 몇 개의 `args`이던지 상관없이 작동하게 된다면 더 좋을 것 같습니다.

그렇게 하기 위해서는 [arr.join](mdn:js/Array/join) 메서드를 사용할 수 있습니다.

```js
function hash(args) {
  return args.join();
}
```

그런데…. 안타깝게도, 위의 예시는 작동하지 않습니다. 왜냐하면 `hash(arguments)`와 `arguments` 객체 모두 정규 배열은 아니면서 iterable 이고 유사 배열이기 때문이죠, 

그래서 아래 예시처럼 `join`을 호출하는 것은 실패할 것입니다.

```js run
function hash() {
*!*
  alert( arguments.join() ); // 에러, arguments.join은 함수가 아님
*/!*
}

hash(1, 2);
```

여전히, 배열을 쉽게 join 하는 방법은 있습니다.

```js run
function hash() {
*!*
  alert( [].join.call(arguments) ); // 1,2
*/!*
}

hash(1, 2);
```

위와 같은 방법을 *메서드 빌리기(method borrowing)* 라고 합니다.

정규 배열 `[].join`에서 join 메서드를 가져오고 `[] .join.call`을 사용하여 `arguments` 의 컨텍스트안에서 동작하게 됩니다.

어떻게 이런 방법이 작동할까요?

그 이유는 네이티브 메서드인 `arr.join(glue)` 의 내부 알고리즘이 매우 간결하기 때문입니다.

거의 명세서를 "있는 그대로" 따르고 있습니다.

1.`glue`를 첫 번째 인수로, 인수가 없으면 쉼표`","`합니다.
2. `result` 를 빈 문자열로 둡니다.
3.`this [0]`을`result` 에 추가합니다.
4.`glue` 와 `this [1]` 을 추가합니다.
5.`glue` 와 `this [2]` 를 추가합니다.
6. `this.length` 길이의 아이템만큼 계속됩니다.
7.`result`를 반환합니다.

위와 같은 기술적인 이유로 `this`를 가져가서 `this[0]`, `this[1]` ...기타등등을 join 합니다. 이 방법은 의도적으로 모든 배열을 허용하는 방식으로 작성되었습니다. (우연이 아니라, 이렇게 하는 데는 많은 메서드들이 필요합니다). 그래서 `this = arguments`와 함께 작동합니다.

## 요약

*데코레이터*는 함수의 행동을 변환하는 래퍼이다. 실제 작업은 전달되는 함수에 의해 진행된다.

일반적으로 하나의 함수나 하나의 메서드를 하나로 데코레이트 하는 것이 안전하다. 원래 함수가 `func.calledCount` 또는 어떠한 속성을 가지고 있다면, 그것은 래퍼이기 때문에 데코레이트 된 후의 함수는 프로퍼티를 가지고 있지 않다. 데코레이터는 자신만의 프로퍼티를 제공하기 때문에 데코레이터를 사용할 때는 신중해야 합니다.

데코레이터들은 한 개 또는 여러 개의 "기능들(features)" 또는 "관점들(aspects)"을 원래 함수를 변경하지 않고! 주입할 수 있다. 

`cachingDecorator`를 구현하기 위해서는 다음과 같은 메서드를 살펴보았습니다.

- [func.call(context, arg1, arg2...)](mdn:js/Function/call) -- `func`를 주어진 컨텍스트와 인수들과 호출.
- [func.apply(context, args)](mdn:js/Function/apply) -- `func` 를 `컨텍스트`가 `this`로 넘겨진 것과 유사 배열 `args`가인수들의 리스트로 받아서 호출

일반적인 *call forwarding*은 보통 `apply`를 통해 이루어집니다.

```js
let wrapper = function() {
  return original.apply(this, arguments);
}
```

*메서드 빌리기*의 방법 또한 알아보았습니다. 해당 객체의 메서드를 다른 객체의 컨텍스트 안에서 `호출` 사용되었습니다. 배열 메서드들을 가지고 와서 `인수`들로 전달하는 것은 자주 쓰이는 방법입니다. 다른 방법으로는 정규 배열인 나머지 매개변수들 객체를 사용하는 것입니다.


데코레이터들을 실제도 더 많이 있습니다. 이번 챕터에서 문제를 어떤 방식으로 해결했는지 다시 한번 확인해 보세요.
