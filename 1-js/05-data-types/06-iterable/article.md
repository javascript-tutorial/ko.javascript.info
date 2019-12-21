
# iterable 객체

*반복 가능한(iterable, 이터러블)* 객체는 배열을 일반화한 객체입니다. 이터러블 이라는 개념을 사용하면 어떤 객체에든 `for..of` 반복문을 적용할 수 있습니다.

배열은 대표적인 이터러블입니다. 배열 외에도 다수의 내장 객체가 반복 가능합니다. 문자열 역시 이터러블의 예입니다. 

배열이 아닌 객체가 있는데, 이 객체가 어떤 것들의 컬렉션(목록, 집합 등)을 나타내고 있는 경우, `for..of` 문법을 적용할 수만 있다면 컬렉션을 순회하는데 유용할 겁니다. 이게 가능하도록 해봅시다.


## Symbol.iterator

직접 이터러블 객체를 만들어 이터러블이라는 개념을 이해해 보도록 합시다. 

`for..of`를 적용하기에 적합해 보이는 배열이 아닌 객체를 만들겠습니다.

예시의 객체 `range`는 숫자 간격을 나타내고 있습니다.

```js
let range = {
  from: 1,
  to: 5
};

// 아래와 같이 for..of가 동작할 수 있도록 하는 게 목표입니다.
// for(let num of range) ... num=1,2,3,4,5
```

`range`를 이터러블로 만들려면(`for..of`가 동작하도록 하려면) 객체에 `Symbol.iterator`(특수 내장 심볼)라는 메서드를 추가해 아래와 같은 일이 벌어지도록 해야 합니다.

1. `for..of`가 시작되자마자 `for..of`는 `Symbol.iterator`를 호출합니다(`Symbol.iterator`가 없으면 에러가 발생합니다). `Symbol.iterator`는 반드시 *이터레이터(iterator, 메서드 `next`가 있는 객체)* 를 반환해야 합니다.
2. 이후 `for..of`는 *반환된 객체(이터레이터)만*을 대상으로 동작합니다.
3. `for..of`에 다음 값이 필요하면, `for..of`는 이터레이터의 `next()`메서드를 호출합니다.
4. `next()`의 반환 값은 `{done: Boolean, value: any}`와 같은 형태이어야 합니다. `done=true`는 반복이 종료되었음을 의미합니다. `done=false`일땐 `value`에 다음 값이 저장됩니다.

`range`를 반복 가능한 객체로 만들어주는 코드는 다음과 같습니다.

```js run
let range = {
  from: 1,
  to: 5
};

// 1. for..of 최초 호출 시, Symbol.iterator가 호출됩니다.
range[Symbol.iterator] = function() {

  // Symbol.iterator는 이터레이터 객체를 반환합니다.
  // 2. 이후 for..of는 반환된 이터레이터 객체만을 대상으로 동작하는데, 이때 다음 값도 정해집니다.
  return {
    current: this.from,
    last: this.to,      

    // 3. for..of 반복문에 의해 반복마다 next()가 호출됩니다.
    next() {
      // 4. next()는 값을 객체 {done:.., value :...}형태로 반환해야 합니다.
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    }
  };
};

// 이제 의도한 대로 동작합니다!
for (let num of range) {
  alert(num); // 1, then 2, 3, 4, 5
}
```

이터러블 객체의 핵심은 '관심사의 분리(Separation of concern, SoC)'에 있습니다.

- `range`엔 메서드 `next()`가 없습니다.
- 대신 `range[Symbol.iterator]()`를 호출해서 만든 '이터레이터' 객체와 이 객체의 메서드 `next()`에서 반복에 사용될 값을 만들어냅니다.

이렇게 하면 이터레이터 객체와 반복 대상인 객체를 분리할 수 있습니다.

이터레이터 객체와 반복 대상 객체를 합쳐서 `range` 자체를 이터레이터로 만들면 코드가 더 간단해집니다. 

다음처럼 말이죠.

```js run
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    this.current = this.from;
    return this;
  },

  next() {
    if (this.current <= this.to) {
      return { done: false, value: this.current++ };
    } else {
      return { done: true };
    }
  }
};

for (let num of range) {
  alert(num); // 1, then 2, 3, 4, 5
}
```

이제 `range[Symbol.iterator]()`가 객체 `range` 자체를 반환합니다. 반환된 객체엔 필수 메서드인 `next()`가 있고 `this.current`에 반복이 얼마나 진행되었는지를 나타내는 값도 저장되어 있습니다. 코드는 더 짧아졌고요. 이렇게 작성하는 게 좋을 때가 종종 있습니다.

단점은 두 개의 `for..of` 반복문을 하나의 객체에 동시에 사용할 수 없다는 점입니다. 이터레이터(객체 자신)가 하나뿐이어서 두 반복문이 반복 상태를 공유하기 때문이죠. 그런데 동시에 두 개의 `for..of`를 사용하는 것은 비동기 처리에서도 흔한 케이스는 아닙니다.

```smart header="무한개의 이터레이터"
무수히 많은 이터레이터도 가능합니다. `range`에서 `range.to`에 `Infinity`를 할당하면 `range`가 무한대가 되죠. 무수히 많은 의사 난수(pseudorandom numbers)를 생성하는 이터러블 객체를 만드는 것도 가능합니다. 이 방법이 유용하게 쓰이는 경우도 있습니다.

`next`엔 제약사항이 없습니다. `next`가 값을 계속 반환하는 것은 정상적인 동작입니다.

물론 위와 같은 이터러블에 `for..of` 반복문을 사용하면 끝이 없을 겁니다. 그렇다 하더라도 `break`를 사용하면 언제든지 반복을 멈출 수 있습니다.
```


## 문자열은 이터러블입니다.

배열과 문자열은 가장 광범위하게 쓰이는 내장 이터러블입니다. 

`for..of`는 문자열의 각 글자를 순회합니다.

```js run
for (let char of "test") {
  // 글자 하나당 한 번 실행됩니다(4회 호출).
  alert( char ); // t, e, s, t가 차례대로 출력됨
}
```

서로게이트 쌍(surrogate pair)에도 잘 동작합니다.

```js run
let str = '𝒳😂';
for (let char of str) {
    alert( char ); // 𝒳와 😂가 차례대로 출력됨
}
```

## 이터레이터를 명시적으로 호출하기

이터레이터를 어떻게 명시적으로 사용할 수 있는지 살펴보면서 좀 더 깊게 이해해봅시다.

`for..of`를 사용했을 때와 동일한 방법으로 문자열을 순회할 건데, 이번엔 직접 호출을 통해서 순회해보겠습니다. 다음 코드는 문자열 이터레이터를 만들고, 여기서 값을 '수동으로' 가져옵니다.

```js run
let str = "Hello";

// for..of를 사용한 것과 동일한 작업을 합니다.
// for (let char of str) alert(char);

let iterator = str[Symbol.iterator]();

while (true) {
  let result = iterator.next();
  if (result.done) break;
  alert(result.value); // 글자가 하나씩 출력됩니다.
}
```

이터레이터를 명시적으로 호출하는 경우는 거의 없는데, 이 방법을 사용하면 `for..of`를 사용하는 것보다 반복 과정을 더 잘 통제할 수 있다는 장점이 있습니다. 반복을 시작했다가 잠시 멈춰 다른 작업을 하다가 다시 반복을 시작하는 것과 같이 반복 과정을 여러 개로 쪼개는 것이 가능합니다. 

## 이터러블과 유사 배열 [#array-like]

비슷해 보이지만 아주 다른 용어 두 가지가 있습니다. 헷갈리지 않으려면 두 용어를 잘 이해하고 있어야 합니다. 

- *이터러블(iterable)* 은 위에서 설명한 바와 같이 메서드 `Symbol.iterator`가 구현된 객체입니다.
- *유사 배열(array-like)* 은 인덱스와 `length` 프로퍼티가 있어서 배열처럼 보이는 객체입니다.

브라우저나 등의 호스트 환경에서 자바스크립트를 사용해 문제를 해결할 때 이터러블 객체나 유사 배열 객체 혹은 둘 다인 객체를 만날 수 있습니다. 

이터러블 객체(`for..of` 를 사용할 수 있음)이면서 유사배열 객체(숫자 인덱스와 `length` 프로퍼티가 있음)인 문자열이 대표적인 예입니다.

이터러블 객체라고 해서 유사 배열 객체는 아닙니다. 유사 배열 객체라고 해서 이터러블 객체인 것도 아닙니다.

위 예시의 `range`는 이터러블 객체이긴 하지만 인덱스도 없고 `length` 프로퍼티도 없으므로 유사 배열 객체가 아닙니다.

아래 예시의 객체는 유사 배열 객체이긴 하지만 이터러블 객체가 아닙니다.

```js run
let arrayLike = { // 인덱스와 length프로퍼티가 있음 => 유사 배열
  0: "Hello",
  1: "World",
  length: 2
};

*!*
// Symbol.iterator가 없으므로 에러 발생
for (let item of arrayLike) {}
*/!*
```

이터러블과 유사 배열은 대게 *배열이 아니기 때문에* `push`, `pop` 등의 메서드를 지원하지 않습니다. 이터러블과 유사 배열을 배열처럼 다루고 싶을 때 이런 특징은 불편함을 초래합니다. `range`에 배열 메서드를 사용해 무언가를 하고 싶을 때처럼 말이죠. 어떻게 하면 이터러블과 유사 배열에 배열 메서드를 적용할 수 있을까요?

## Array.from

범용 메서드 [Array.from](mdn:js/Array/from)는 이터러블이나 유사 배열을 받아 '진짜' `Array`를 만들어줍니다. 이 과정을 거치면 이터러블이나 유사 배열에 배열 메서드를 사용할 수 있습니다.

예시:

```js run
let arrayLike = {
  0: "Hello",
  1: "World",
  length: 2
};

*!*
let arr = Array.from(arrayLike); // (*)
*/!*
alert(arr.pop()); // World (메서드가 제대로 동작합니다.)
```

`(*)`로 표시한 줄의 `Array.from`는 객체를 받고, 이것이 이터러블인지 혹은 유사 배열인지 검사한 후, 객체 요소 모두를 복제해 새로운 배열을 만듭니다.

이터러블을 사용한 예시는 다음과 같습니다.

```js
// range는 챕터 위쪽 예시에서 그대로 가져왔다고 가정합시다.
let arr = Array.from(range);
alert(arr); // 1,2,3,4,5 (배열-문자열 형 변환이 제대로 동작합니다.)
```

`Array.from`의 전체 문법은 선택적인 "매핑" 함수를 사용할 수 있게 해줍니다.
```js
Array.from(obj[, mapFn, thisArg])
```

선택 인수 `mapFn`은 각 요소가 실제 배열에 추가되기 전에 적용할 수 있는 함수이고, `thisArg`는 `mapFn`의 `this`를 설정하는 데 쓰입니다.

예시:

```js
// range는 챕터 위쪽 예시에서 그대로 가져왔다고 가정합시다.

// 각 숫자를 제곱
let arr = Array.from(range, num => num * num);

alert(arr); // 1,4,9,16,25
```

아래 예시에선 `Array.from`를 사용해 문자열을 배열로 만들어보았습니다.

```js run
let str = '𝒳😂';

// str를 분해해 글자가 담긴 배열로 만듦
let chars = Array.from(str);

alert(chars[0]); // 𝒳
alert(chars[1]); // 😂
alert(chars.length); // 2
```

`Array.from`은 `str.split`과 달리, 문자열 자체가 가진 이터러블 속성을 이용해 동작합니다. 따라서 `for..of`처럼 서로게이트 쌍에도 제대로 적용됩니다.

위 예시는 기술적으로 아래 예시와 동일하게 동작한다고 보시면 됩니다.

```js run
let str = '𝒳😂';

let chars = []; // Array.from 내부에선 아래와 동일한 반복문이 돌아갑니다.
for (let char of str) {
  chars.push(char);
}

alert(chars);
```

어쨌든 `Array.from`을 사용한 예시가 더 짧습니다.

`Array.from`을 사용하면 서로게이트 쌍을 처리할 수 있는 `slice`를 직접 구현할 수도 있습니다.

```js run
function slice(str, start, end) {
  return Array.from(str).slice(start, end).join('');
}

let str = '𝒳😂𩷶';

alert( slice(str, 1, 3) ); // 😂𩷶

// 내장 순수 메서드는 서로게이트 쌍을 지원하지 않습니다.
alert( str.slice(1, 3) ); // 쓰레깃값 출력 (영역이 다른 특수 값)
```


## 요약

`for..of`을 사용할 수 있는 객체를 *이터러블*이라고 부릅니다.

- 이터러블엔 메서드 `Symbol.iterator`가 반드시 구현되어 있어야 합니다.
    - `obj[Symbol.iterator]`의 결과는 *이터레이터*라고 부릅니다. 이터레이터는 이어지는 반복 과정을 처리합니다.
    - 이터레이터엔 객체 `{done: Boolean, value: any}`을 반환하는 메서드 `next()`가 반드시 구현되어 있어야 합니다. 여기서 `done:true`은 반복이 끝났음을 의미하고 그렇지 않은 경우엔 `value`에 다음 값이 저장됩니다.
- 메서드 `Symbol.iterator`는 `for..of`에 의해 자동으로 호출되는데, 개발자가 명시적으로 호출하는 것도 가능합니다.
- 문자열이나 배열 같은 내장 이터러블에도 `Symbol.iterator`가 구현되어 있습니다.
- 문자열 이터레이터는 서로게이트 쌍을 지원합니다.


인덱스와 `length` 프로퍼티가 있는 객체는 *유사 배열*이라 불립니다. 유사 배열 객체엔 다양한 프로퍼티와 메서드가 있을 수 있는데 배열 내장 메서드는 없습니다.

명세서를 보면 대부분의 메서드는 '진짜' 배열이 아닌 이터러블이나 유사 배열을 대상으로 동작한다고 쓰여 있는걸 볼 수 있습니다. 이 방법이 더 추상적이기 때문입니다.

`Array.from(obj[, mapFn, thisArg])`을 사용하면 이터러블이나 유사 배열인 `obj`를 진짜 `Array`로 만들 수 있습니다. 이렇게 하면 `obj`에도 배열 메서드를 사용할 수 있죠. 선택 인수 `mapFn`와 `thisArg`는 각 요소에 함수를 적용할 수 있게 해줍니다.
