# call/apply와 데코레이터, 포워딩

자바스크립트는 함수를 다룰 때 탁월한 유연성을 제공합니다. 함수는 이곳저곳 전달될 수 있고, 객체로도 사용될 수 있습니다. 이번 챕터에선 함수 간에 호출을 어떻게 *포워딩(forwarding)* 하는지, 함수를 어떻게 *데코레이팅(decorating)* 하는지에 대해 알아보겠습니다.

## 코드 변경 없이 캐싱 기능 추가하기

CPU를 많이 잡아먹지만 결과는 안정적인 함수 `slow(x)`가 있다고 가정해 봅시다. 결과가 안정적이라는 말은 `x`가 같으면 호출 결과도 같다는 것을 의미입니다.

`slow(x)`가 자주 호출된다면, 결과를 어딘가에 저장(캐싱)해 재연산에 걸리는 시간을 줄이고 싶을 겁니다.

아래 예시에선 `slow()` 안에 캐싱 관련 코드를 추가하는 대신, 래퍼 함수를 만들어 캐싱 기능을 추가할 예정입니다. 곧 정리하겠지만, 이렇게 래퍼 함수를 만들면 여러 가지 이점이 있습니다.

코드를 먼저 살펴봅시다. 설명은 아래쪽에 적어두었습니다.

```js run
function slow(x) {
  // CPU 집약적인 작업이 여기에 올 수 있습니다.
  alert(`slow(${x})을/를 호출함`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function(x) {
    if (cache.has(x)) {    // cache에 해당 키가 있으면
      return cache.get(x); // 대응하는 값을 cache에서 읽어옵니다.
    }

    let result = func(x);  // 그렇지 않은 경우엔 func를 호출하고,

    cache.set(x, result);  // 그 결과를 캐싱(저장)합니다.
    return result;
  };
}

slow = cachingDecorator(slow);

alert( slow(1) ); // slow(1)이 저장되었습니다.
alert( "다시 호출: " + slow(1) ); // 동일한 결과

alert( slow(2) ); // slow(2)가 저장되었습니다.
alert( "다시 호출: " + slow(2) ); // 윗줄과 동일한 결과
```

`cachingDecorator`같이 인수로 받은 함수의 행동을 변경시켜주는 함수를 *데코레이터(decorator)* 라고 부릅니다.

모든 함수를 대상으로 `cachingDecorator`를 호출 할 수 있는데, 이때 반환되는 것은 캐싱 래퍼입니다. 함수에 `cachingDecorator`를 적용하기만 하면 캐싱이 가능한 함수를 원하는 만큼 구현할 수 있기 때문에 데코레이터 함수는 아주 유용하게 사용됩니다.

캐싱 관련 코드를 함수 코드와 분리할 수 있기 때문에 함수의 코드가 간결해진다는 장점도 있습니다. 

아래 그림에서 볼 수 있듯이 `cachingDecorator(func)`를 호출하면 '래퍼(wrapper)', `function(x)`이 반환됩니다. 래퍼 `function(x)`는 `func(x)`의 호출 결과를 캐싱 로직으로 감쌉니다(wrapping).

![](decorator-makecaching-wrapper.svg)

바깥 코드에서 봤을 때, 함수 `slow`는 래퍼로 감싼 이전이나 이후나 동일한 일을 수행합니다. 행동 양식에 캐싱 기능이 추가된 것뿐입니다.

`slow` 본문을 수정하는 것 보다 독립된 래퍼 함수 `cachingDecorator`를 사용할 때 생기는 이점을 정리하면 다음과 같습니다.

- `cachingDecorator`를 재사용 할 수 있습니다. 원하는 함수 어디에든 `cachingDecorator`를 적용할 수 있습니다.
- 캐싱 로직이 분리되어 `slow` 자체의 복잡성이 증가하지 않습니다. 
- 필요하다면 여러 개의 데코레이터를 조합해서 사용할 수도 있습니다(추가 데코레이터는 `cachingDecorator` 뒤를 따릅니다).

## 'func.call'를 사용해 컨텍스트 지정하기

위에서 구현한 캐싱 데코레이터는 객체 메서드에 사용하기엔 적합하지 않습니다.

객체 메서드 `worker.slow()`는 데코레이터 적용 후 제대로 동작하지 않죠.

```js run
// worker.slow에 캐싱 기능을 추가해봅시다.
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    // CPU 집약적인 작업이라 가정
    alert(`slow(${x})을/를 호출함`);
    return x * this.someMethod(); // (*)
  }
};

// 이전과 동일한 코드
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

alert( worker.slow(1) ); // 기존 메서드는 잘 동작합니다.

worker.slow = cachingDecorator(worker.slow); // 캐싱 데코레이터 적용

*!*
alert( worker.slow(2) ); // 에러 발생!, Error: Cannot read property 'someMethod' of undefined
*/!*
```

`(*)`로 표시한 줄에서 `this.someMethod` 접근에 실패했기 때문에 에러가 발생했습니다.

원인은 `(**)`로 표시한 줄에서 래퍼가 기존 함수 `func(x)`를 호출하면 `this`가 `undefined`가 되기 때문입니다.

아래 코드를 실행해도 비슷한 증상이 나타납니다.

```js
let func = worker.slow;
func(2);
```

래퍼가 기존 메서드 호출 결과를 전달하려 했지만 `this`의 컨텍스트가 사라졌기 때문에 에러가 발생하는 것이죠.

에러가 발생하지 않게 코드를 수정해 봅시다.

먼저, `this`를 명시적으로 고정해 함수를 호출할 수 있게 해주는 특별한 내장 함수 메서드 [func.call(context, ...args)](mdn:js/Function/call)에 대해 알아봅시다.

문법은 다음과 같습니다.

```js
func.call(context, arg1, arg2, ...)
```

메서드를 호출하면 메서드의 첫 번째 인수가 `this`, 이어지는 인수가 `func`의 인수가 된 후, `func`이 호출됩니다.

아래 함수와 메서드를 호출하면 거의 동일한 일이 발생합니다.
```js
func(1, 2, 3);
func.call(obj, 1, 2, 3)
```

둘 다 인수로 `1`, `2`, `3`을 받죠. 유일한 차이점은 `func.call`에선 `this`가 `obj`로 고정된다는 점입니다.

다른 컨텍스트(다른 객체) 하에 `sayHi`를 호출하는 예시를 살펴봅시다. `sayHi.call(user)`를 호출하면 `sayHi`의 컨텍스트가 `this=user`로, `sayHi.call(admin)`을 호출하면 `sayHi`의 컨텍스트가 `this=admin`로 설정됩니다.

```js run
function sayHi() {
  alert(this.name);
}

let user = { name: "John" };
let admin = { name: "Admin" };

// call을 사용해 원하는 객체가 'this'가 되도록 합니다.
sayHi.call( user ); // this = John
sayHi.call( admin ); // this = Admin
```

아래 예시에선 `call`을 사용해 컨텍스트와 `phrase`에 원하는 값을 지정해 보았습니다.


```js run
function say(phrase) {
  alert(this.name + ': ' + phrase);
}

let user = { name: "John" };

// this엔 user가 고정되고, "Hello"는 메서드의 첫 번째 인수가 됩니다.
say.call( user, "Hello" ); // John: Hello
```

래퍼 안에서 `call`을 사용해 컨텍스트를 원본 함수로 전달하면 에러가 발생하지 않습니다.

```js run
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    alert(`slow(${x})을/를 호출함`);
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
    let result = func.call(this, x); // 이젠 'this'가 제대로 전달됩니다.
*/!*
    cache.set(x, result);
    return result;
  };
}

worker.slow = cachingDecorator(worker.slow); // 캐싱 데코레이터 적용

alert( worker.slow(2) ); // 제대로 동작합니다.
alert( worker.slow(2) ); // 제대로 동작합니다. 다만, 원본 함수가 호출되지 않고 캐시 된 값이 출력됩니다.
```

이제 에러 없이 모든 게 정상적으로 동작합니다.

명확한 이해를 위해 `this`가 어떤 과정을 거쳐 전달되는지 자세히 살펴보겠습니다.

1. 데코레이터를 적용한 후에 `worker.slow`는 래퍼 `function (x) { ... }`가 됩니다.
2. `worker.slow(2)`를 실행하면 래퍼는 `2`를 인수로 받고, `this=worker`가 됩니다(점 앞의 객체).
3. 결과가 캐시되지 않은 상황이라면 `func.call(this, x)`에서 현재 `this` (`=worker`)와 인수(`=2`)를 원본 메서드에 전달합니다.

## 'func.apply'로 여러 인수 전달하기

`cachingDecorator`를 좀 더 다채롭게 해봅시다. 지금 상태론 인수가 하나뿐인 함수에만 `cachingDecorator`를 적용할 수 있습니다.

복수 인수를 가진 메서드, `worker.slow`를 캐싱하려면 어떻게 해야 할지 생각해 봅시다.

```js
let worker = {
  slow(min, max) {
    return min + max; // CPU를 아주 많이 쓰는 작업이라고 가정
  }
};

// 동일한 인수를 전달했을 때 호출 결과를 기억할 수 있어야 합니다.
worker.slow = cachingDecorator(worker.slow);
```

지금까진 인수가 `x` 하나뿐이었기 때문에 `cache.set(x, result)`으로 결과를 저장하고 `cache.get(x)`으로 저장된 결과를 불러오기만 하면 됐습니다. 그런데 이제부턴 `(min,max)`같이 *인수가 여러 개*이고, 이 인수들을 넘겨 호출한 결과를 기억해야 합니다. 네이티브 `맵`은 단일 키만 받지만 말이죠.

해결 방법은 여러 가지입니다.

1. 복수 키를 지원하는 맵과 유사한 자료 구조 구현하기(서드 파티 라이브러리 등을 사용해도 됨)
2. 중첩 맵을 사용하기. `(max, result)` 쌍 저장은 `cache.set(min)`으로, `result`는 `cache.get(min).get(max)`을 사용해 얻습니다.
3. 두 값을 하나로 합치기. `맵`의 키로 문자열 `"min,max"`를 사용합니다. 여러 값을 하나로 합치는 코드는 *해싱 함수(hashing function)* 에 구현해 유연성을 높입니다.

세 번째 방법만으로 충분하기 때문에 이 방법을 사용해 코드를 수정해 보겠습니다.

여기에 더하여 `func.call(this, x)`를 `func.call(this, ...arguments)`로 교체해, 래퍼 함수로 감싼 함수가 호출될 때 복수 인수 넘길 수 있도록 하겠습니다.

더 강력해진 `cachingDecorator`를 살펴봅시다.

```js run
let worker = {
  slow(min, max) {
    alert(`slow(${min},${max})을/를 호출함`);
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
    let result = func.call(this, ...arguments); // (**)
*/!*

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
  return args[0] + ',' + args[1];
}

worker.slow = cachingDecorator(worker.slow, hash);

alert( worker.slow(3, 5) ); // 제대로 동작합니다.
alert( "다시 호출: " + worker.slow(3, 5) ); // 동일한 결과 출력(캐시된 결과)
```

이제 인수의 개수에 관계없이 래퍼가 잘 동작합니다. 해시 함수가 복수의 인수를 자유자재로 처리할 수 있도록 수정을 해야 하긴 하지만 말이죠. 이를 가능하게 해주는 흥미로운 방법은 아래에서 소개해 드리겠습니다.

개선 후, 바뀐 것은 두 가지입니다.

- `(*)`로 표시한 줄에서 `hash`가 호출되면서 `arguments`를 사용한 단일 키가 만들어집니다. 여기선 간단한 '결합' 함수로 인수 `(3, 5)`를 키 `"3,5"`로 바꿨는데, 좀 더 복잡한 경우라면 또 다른 해싱 함수가 필요할 수 있습니다.
- `(**)`로 표시한 줄에선 `func.call(this, ...arguments)`를 사용해 컨텍스트(`this`)와 래퍼가 가진 인수 전부(`...arguments`)를 기존 함수에 전달하였습니다.

그런데 여기서 `func.call(this, ...arguments)` 대신, `func.apply(this, arguments)`를 사용해도 됩니다.

내장 메서드 [func.apply](mdn:js/Function/apply)의 문법은 다음과 같습니다.

```js
func.apply(context, args)
```

`apply`는 `func`의 `this`를 `context`로 고정해주고, 유사 배열 객체인 `args`를 인수로 사용할 수 있게 해줍니다.

`call`과 `apply`의 문법적 차이는 `call`이 복수 인수를 따로따로 받는 대신 `apply`는 인수를 유사 배열 객체로 받는다는 점뿐입니다.

따라서 아래 코드 두 줄은 거의 같은 역할을 합니다.

```js
func.call(context, ...args); // 전개 연산자를 사용해 인수가 담긴 배열을 전달하는 것과
func.apply(context, args);   // apply를 사용하는 것은 동일합니다.
```

그런데 약간의 차이가 있긴 합니다.

- 전개 연산자 `...`은 *이터러블* `args`을 분해 해 `call`에 전달할 수 있도록 해줍니다.
- `apply`는 오직 *유사 배열* 형태의 `args`만 받습니다.

이 차이만 빼면 두 메서드는 완전히 동일하게 동작합니다. 인수가 이터러블 형태라면 `call`을, 유사 배열 형태라면 `apply`를 사용하면 됩니다.

배열같이 이터러블이면서 유사 배열인 객체엔 둘 다를 사용할 수 있는데, 대부분의 자바스크립트 엔진은 내부에서 `apply`를 최적화 하기 때문에 `apply`를 사용하는 게 좀 더 빠르긴 합니다. 

이렇게 컨텍스트와 함께 인수 전체를 다른 함수에 전달하는 것을 *콜 포워딩(call forwarding)* 이라고 합니다.

가장 간단한 형태의 콜 포워딩은 다음과 같습니다.

```js
let wrapper = function() {
  return func.apply(this, arguments);
};
```

이런 식으로 외부에서 `wrapper`를 호출하면, 기존 함수인 `func`를 호출하는 것과 명확하게 구분할 수 있습니다.

## 메서드 빌리기 [#method-borrowing]

위에서 구현한 해싱 함수를 개선해봅시다.

```js
function hash(args) {
  return args[0] + ',' + args[1];
}
```

지금 상태에선 인수 두 개만 다룰 수 있습니다. `args`의 요소 개수에 상관없이 요소들을 합칠 수 있으면 더 좋겠네요. 

가장 자연스러운 해결책은 배열 메서드 [arr.join](mdn:js/Array/join)을 사용하는 것입니다.

```js
function hash(args) {
  return args.join();
}
```

그런데 아쉽게도 이 방법은 동작하지 않습니다. `hash(arguments)`를 호출할 때 인수로 넘겨주는 `arguments`는 진짜 배열이 아니고 이터러블 객체나 유사 배열 객체이기 때문입니다.

배열이 아닌 것에 `join`을 호출하면 에러가 발생합니다.

```js run
function hash() {
*!*
  alert( arguments.join() ); // Error: arguments.join is not a function
*/!*
}

hash(1, 2);
```

그런데 아래와 같은 방법을 사용하면 배열 메서드 `join`을 사용할 수 있습니다.

```js run
function hash() {
*!*
  alert( [].join.call(arguments) ); // 1,2
*/!*
}

hash(1, 2);
```

이런 트릭을 *메서드 빌리기(method borrowing)* 라고 합니다.

일반 배열에서 `join` 메서드를 빌려오고(`[].join`), `[].join.call`를 사용해 `arguments`를 컨텍스트로 고정한 후 `join`메서드를 호출하는 것이죠.

이게 어떻게 가능할까요?

네이티브 메서드 `arr.join(glue)`의 내부 알고리즘은 아주 간단하기 때문입니다.

스펙을 '그대로' 차용해 설명해 보겠습니다.

1. `glue`가 첫 번째 인수가 되도록 합니다. 인수가 없으면 `","`가 첫 번째 인수가 됩니다.
2. `result`는 빈 문자열이 되도록 초기화합니다.
3. `this[0]`을 `result`에 덧붙입니다.
4. `glue`와 `this[1]`를 `result`에 덧붙입니다.
5. `glue`와 `this[2]`를 `result`에 덧붙입니다.
6. `this.length`개의 항목이 모두 추가될 때까지 이 일을 반복합니다.
7. `result`를 반환합니다.

기존에 `call`을 사용했던 방식처럼 `this`를 받고 `this[0]`, `this[1]` 등이 합쳐집니다. 이렇게 내부 알고리즘이 구현되어있기 때문에 어떤 유사 배열이던 `this`가 될 수 있습니다. 상당수의 메서드가 이런 관습을 따르고 있죠. `this`에 `arguments`가 할당되더라도 잘 동작하는 이유가 여기에 있습니다.

## 데코레이터와 함수 프로퍼티

함수 또는 메서드를 데코레이터로 감싸 대체하는 것은 대체적으로 안전합니다. 그런데 원본 함수에 `func.calledCount` 등의 프로퍼티가 있으면 데코레이터를 적용한 함수에선 프로퍼티를 사용할 수 없으므로 안전하지 않습니다. 함수에 프로퍼티가 있는 경우엔 데코레이터 사용에 주의해야 합니다.

위 예시에서 함수 `slow`에 프로퍼티가 있었다면 `cachingDecorator(slow)` 호출 결과인 래퍼엔 프로퍼티가 없겠죠.

몇몇 데코레이터는 자신만의 프로퍼티를 갖기도 합니다. 데코레이터는 함수가 얼마나 많이 호출되었는지 세거나 호출 시 얼마나 많은 시간이 소모되었는지 등의 정보를 래퍼의 프로퍼티에 저장할 수 있습니다.

함수 프로퍼티에 접근할 수 있게 해주는 데코레이터를 만드는 방법도 있습니다. 그런데 이걸 구현하려면 `Proxy`라는 특별한 객체를 사용해 함수를 감싸야 합니다. `Proxy`에 대해선 <info:proxy#proxy-apply>에서 다루도록 하겠습니다.

## 요약

*데코레이터*는 함수를 감싸는 래퍼로 함수의 행동을 변화시킵니다. 주요 작업은 여전히 함수에서 처리합니다.

데코레이터는 함수에 추가된 '기능' 혹은 '상(相, aspect)' 정도로 보시면 됩니다. 하나 혹은 여러 개의 데코레이터를 추가해도 함수의 코드는 변경되지 않습니다.

`cachingDecorator`는 아래와 같은 메서드를 사용해 구현하였습니다.

- [func.call(context, arg1, arg2...)](mdn:js/Function/call) -- 주어진 컨텍스트와 인수를 사용해 `func`를 호출합니다.
- [func.apply(context, args)](mdn:js/Function/apply) -- `this`에 `context`가 할당되고, 유사 배열 `args`가 인수로 전달되어 `func`이 호출됩니다.

*콜 포워딩*은 대게 `apply`를 사용해 구현합니다.

```js
let wrapper = function() {
  return original.apply(this, arguments);
};
```

특정 객체에서 메서드를 가져오고, 다른 객체를 컨텍스트로 고정한 후 함수를 `호출(call)`하는 형태인 *메서드 빌리기*에 대한 예제도 살펴보았습니다. 메서드 빌리기는 배열 메서드를 빌려서 이를 `arguments`에 적용할 때 흔히 사용됩니다. 나머지 매개변수와 배열을 함께 사용하면 유사한 기능을 구현할 수 있습니다.

데코레이터를 사용해서 기능을 구현한 사례들이 많습니다. 아래 문제들을 풀어보면서 데코레이터에 대해 얼마나 이해하고 있는지 확인해봅시다.