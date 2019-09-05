# 나머지 매개변수와 전개 연산자

상당수의 자바스크립트 내장 함수는 임의의 수의 인수를 허용합니다.

예시:

- `Math.max(arg1, arg2, ..., argN)` -- 인수 중 가장 큰 수를 반환합니다.
- `Object.assign(dest, src1, ..., srcN)` -- `src1..N`의 프로퍼티를 `dest`로 복사합니다.
- 기타 등등

이번 챕터에서는 이렇게 임의의 수의 인수를 받는 방법에 대해 알아보겠습니다. 또한 함수의 매개변수에 배열을 전달하는 방법에 대해서도 알아보겠습니다.

## 나머지 매개변수 `...`

어떻게 정의되었는지 상관없이, 함수를 호출할 때 넘겨주는 인수의 개수엔 제약이 없습니다.

아래와 같이 말이죠.
```js run
function sum(a, b) {
  return a + b;
}

alert( sum(1, 2, 3, 4, 5) );
```

인수 개수는 "초과"하였지만, 오류가 발생하지 않습니다. 하지만 반환값은 당연히 처음 두 개의 인수만을 이용해 계산되죠.

나머지 매개변수(rest parameters)는 함수 선언 시 세 개의 점 '...'과 함께 사용할 수 있습니다. 단어를 보고 유추할 수 있듯이, "나머지 매개변수를 배열로 모아주는" 역할을 합니다.

아래는 모든 인수를 배열 `args`에 모아주는 예제입니다.

```js run
function sumAll(...args) { // args는 배열의 이름입니다.
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}

alert( sumAll(1) ); // 1
alert( sumAll(1, 2) ); // 3
alert( sumAll(1, 2, 3) ); // 6
```

앞부분의 매개변수는 변수로, 뒷부분의 남아있는 매개변수는 배열로 모을 수도 있습니다.

아래는 처음 두 인수를 변수에, 나머지 인수들을 `titles` 배열에 모아주는 예제입니다.

```js run
function showName(firstName, lastName, ...titles) {
  alert( firstName + ' ' + lastName ); // Julius Caesar

  // 나머지 인수들은 배열 titles에 모입니다.
  // titles = ["Consul", "Imperator"]
  alert( titles[0] ); // Consul
  alert( titles[1] ); // Imperator
  alert( titles.length ); // 2
}

showName("Julius", "Caesar", "Consul", "Imperator");
```

````warn header="나머지 매개변수는 항상 마지막에 있어야 합니다."
나머지 매개변수는 남아있는 인수 모두를 모으기 때문에, 아래 예제에선 에러가 발생합니다.

```js
function f(arg1, ...rest, arg2) { // ...rest 후에 arg2가 있으면 안 됩니다.
  // 에러
}
```

`...rest`는 항상 마지막에 있어야 합니다.
````

## "arguments" 변수

`arguemnts`라는 특별한 유사 배열 객체(array-like object)를 이용하면 인덱스로 모든 인수에 접근할 수 있습니다.

예시:

```js run
function showName() {
  alert( arguments.length );
  alert( arguments[0] );
  alert( arguments[1] );

  // iterable이므로, 아래와 같이 for 문으로 반복할 수도 있습니다.
  // for(let arg of arguments) alert(arg);
}

// 2, Julius, Caesar가 출력됨
showName("Julius", "Caesar");

// 1, Ilya, undefined가 출력됨(두 번째 인수는 없음)
showName("Ilya");
```

나머지 매개변수는 지원된 지 얼마 안 된 비교적 최신의 문법입니다. 과거엔 `arguments` 객체를 이용해 모든 인수를 사용할 수 있었습니다. 물론 지금도 여전히 `arguments`를 사용할 수 있습니다. 오래된 코드를 보다 보면 `arguments`가 아직 쓰이는 것을 발견할 수 있죠.

`arguments`는 유사 배열이고 이터러블(iterable)입니다. 하지만 배열은 아닙니다. 따라서 배열 메서드를 지원하지 않아, `arguments.map (...)` 같은 유용한 메서드를 사용할 수 없죠.

그리고 모든 인수를 포함하기 때문에, 나머지 매개변수처럼 인수의 일부만 사용할 수 없습니다.

따라서 배열 메서드를 사용하고 싶거나 인수 일부만 사용하고자 할 때는 나머지 매개변수가 선호됩니다.

````smart header="화살표 함수에는 `\"arguments\"`가 없습니다."
화살표 함수에서 `arguments` 객체에 접근하면, 외부에 있는 "보통" 함수의 arguments 객체를 가져옵니다.

예시:

```js run
function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```

앞서 배운 바와 같이 화살표 함수에는 자신만의 `this`가 없습니다. 위 예제를 통해 확인한 바와 같이 `arguments` 객체 또한 없습니다.
````


## 전개 연산자 [# spread-operator]

지금까지 매개변수의 목록을 배열로 가져오는 방법에 대해 살펴보았습니다.

그럼 배열을 매개변수에 사용하고 싶을 때는 어떻게 할까요?

아래 [Math.max](mdn:js/Math/max) 내장함수는 주어진 숫자 목록에서 가장 큰 숫자를 반환합니다.

```js run
alert( Math.max(3, 5, 1) ); // 5
```

만약 배열 `[3, 5, 1]`이 있는 상황에서, 이 배열에 `Math.max`를 호출할 수 있을까요?

아무런 조작 없이 배열을 "있는 그대로" `Math.max`에 넘기면 원하는 대로 동작하지 않을 겁니다. `Math.max`는 배열이 아닌 숫자형의 인수 목록을 받기 때문입니다. 

```js run
let arr = [3, 5, 1];

*!*
alert( Math.max(arr) ); // NaN이 출력됩니다.
*/!*
```

배열 안에 요소가 몇 개가 있을지 알 수 없기 때문에 `Math.max (arr [0], arr [1], arr [2])`처럼 숫자 목록을 수동으로 나열할 수도 없습니다. 스크립트 실행 시 배열 내 요소는 아주 많을 수도, 아예 없을 수도 있습니다. 수동으로 이걸 다 처리하려면 코드가 지저분해 보이겠죠.

이럴 때 *전개 연산자(spread operator)*를 사용할 수 있습니다. 전개 연산자는 `...`를 사용하기 때문에 나머지 매개변수와 비슷해 보이지만, 나머지 매개변수와 반대의 일을 합니다.

함수 호출 시 `... arr`를 사용하면, iterable(반복 가능한) 객체 `arr`을 인수들의 목록으로 "확장"해줍니다.

`Math.max`을 사용한 예제로 다시 돌아가 봅시다.

```js run
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5 (배열이 확장되어 인수들의 목록으로 바뀌었습니다.)
```

아래와 같이 반복 가능한 객체를 여러 개 전달 할 수도 있습니다.

```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(...arr1, ...arr2) ); // 8
```

전개 연산자를 일반 값과 혼합해 사용하는 것도 가능합니다.


```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(1, ...arr1, 2, ...arr2, 25) ); // 25
```

전개 연산자를 사용해 배열을 병합하는 것도 가능합니다.

```js run
let arr = [3, 5, 1];
let arr2 = [8, 9, 15];

*!*
let merged = [0, ...arr, 2, ...arr2];
*/!*

alert(merged); // 0,3,5,1,2,8,9,15 (0, arr, 2, arr2 순서로 합쳐집니다.)
```

위의 예제들은 배열을 이용해 전개 연산자를 어떻게 사용하는지 보여줬지만, 배열 이외에 모든 iterable에 전개 연산자를 사용할 수 있습니다.

다음은 전개 연산자를 사용해 문자열을 문자 배열로 변환시키는 예제입니다.

```js run
let str = "Hello";

alert( [...str] ); // H,e,l,l,o
```

전개 연산자는 iterator(반복자)를 사용하여 요소를 수집합니다. `for..of`와 같은 방식으로 말이죠.

그래서 문자열에 `for..of`를 사용하면 문자열을 구성하는 문자를 반환하는 것 같이, `...str`은 `"H","e","l","l","o"`가 됩니다. 문자 목록은 `[...str]` 배열 초기자(array initializer)로 전달됩니다. 

`Array.from` 메서드를 사용하면 동일한 작업을 할 수 있습니다. 이 메서드는 문자열 같은 iterable을 배열로 바꿔주기 때문입니다.  

```js run
let str = "Hello";

// Array.from은 iterable을 배열로 바꿔줍니다.
alert( Array.from(str) ); // H,e,l,l,o
```

`[...str]`와 동일한 결과가 출력됩니다.

그런데 `Array.from (obj)`과 `[... obj]`에는 미묘한 차이가 있습니다.

- `Array.from` 은 유사 배열 객체와  iterables(반복 가능한) 객체 둘 다에 적용할 수 있습니다.
- 전개 연산자는 iterable 객체에서만 작동합니다.

따라서 무언가를 배열로 바꿀 때, `Array.from`이 보다 보편적으로 사용됩니다.


## 요약

코드 내에서 `"..."`는 나머지 매개변수 혹은 전개 연산자로 사용됩니다.

나머지 매개변수와 전개 연산자는 아래의 방법으로 구분할 수 있습니다.

- `...`이 함수 매개변수의 끝에 있으면, "나머지 매개변수"입니다. 나머지 매개변수는 인수 목록의 나머지를 배열로 모아줍니다.
- `...`이 함수 호출 시 사용되면, "전개 연산자"입니다. 전개 연산자는 배열을 목록으로 확장해줍니다.

용례:

- 인수 개수에 제한이 없는 함수를 만들 때 나머지 매개변수를 사용합니다.
- 복수의 인수를 받는 함수에 배열을 전달할 때 전개 연산자를 사용합니다.

둘을 함께 사용하면 매개변수 목록과 배열 간 전환을 쉽게 할 수 있습니다.

조금 오래된 방법이긴 하지만 `arguments`를 사용하면 모든 인수를 사용할 수 있습니다.