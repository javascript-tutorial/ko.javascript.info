# 나머지 매개변수와 전개 연산자

많은 자바스크립트 내장 함수는 임의의 수의 인수를 지원합니다.

예를 들어

- `Math.max(arg1, arg2, ..., argN)` -- 가장 큰 인수를 반환합니다.
- `Object.assign(dest, src1, ..., srcN)` -- `src1..N` 에서 `dest` 로 속성을 복사.
- ...등등.

이번 챕터에서는 이러한 방법을 살펴보겠습니다. 그리고 중요한 것은 이러한 함수 및 배열을 사용해서 편하게 작업하는 방법을 배워보겠습니다.

## 나머지 매개변수 `...`

어떤 함수가 정의되더라도 함수의 인수는 여러개로 호출할 수 있습니다.

예를 들면
```js run
function sum(a, b) {
  return a + b;
}

alert( sum(1, 2, 3, 4, 5) );
```

"초과된" 인수 때문에 오류가 발생하지는 않습니다. 그러나 결과에서 처음 두 개만 계산되죠.

나머지 매개변수는 세 개의 점 '...'이 있는 함수 선언에서 언급할 수 있습니다. 표현 그대로 "나머지 매개변수를 배열로 모으는" 것을 의미합니다.

예를 들어 모든 인수를 배열 `args`에 모으려면

```js run
function sumAll(...args) { // args 가 배열의 이름입니다
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}

alert( sumAll(1) ); // 1
alert( sumAll(1, 2) ); // 3
alert( sumAll(1, 2, 3) ); // 6
```

첫 번째 매개변수를 변수로 가져오고 나머지 매개변수 만 수집 할 수 있습니다.

여기서 처음 두 인수는 변수에 들어가고 나머지는 `titles` 배열에 들어갑니다.

```js run
function showName(firstName, lastName, ...titles) {
  alert( firstName + ' ' + lastName ); // Julius Caesar

  // the rest go into titles array
  // i.e. titles = ["Consul", "Imperator"]
  alert( titles[0] ); // Consul
  alert( titles[1] ); // Imperator
  alert( titles.length ); // 2
}

showName("Julius", "Caesar", "Consul", "Imperator");
```

````warn header="나머지 매개변수는 항상 마지막에 있어야 합니다"
나머지 매개변수는 나머지 모든 인수를 수집하므로 다음은 오류입니다.

```js
function f(arg1, ...rest, arg2) { // arg2 후에 ...rest ?!
  // error
}
```

`...rest`는 항상 마지막에 있어야 합니다.
````

## "arguments" 변수

`arguemnts`라는 이름의 특별한 유사-배열-객체(array-like object)가 인덱스에 의해 모든 인수를 포함하고 있습니다.

예를 들면 :

```js run
function showName() {
  alert( arguments.length );
  alert( arguments[0] );
  alert( arguments[1] );

  // 반복 가능하다
  // for(let arg of arguments) alert(arg);
}

// shows: 2, Julius, Caesar
showName("Julius", "Caesar");

// shows: 1, Ilya, undefined (no second argument)
showName("Ilya");
```

과거의 자바스크립트에는 나머지 매개변수가 존재하지 않았고  `arguments`를 사용하는 것이 매개변수의 숫자에 관계없이 모든 인수를 사용하는 유일한 방법이었습니다.

그리고 `arguments`는 여전히 작동하고 사용할 수 있습니다.

그러나 `arguments` 의 단점은 배열과 같이 반복은 할 수 있지만 배열은 아닙니다. 배열 메서드를 지원하지 않아서, `arguments.map (...)`을 호출할 수 없습니다.

또한 언제나 모든 인수를 포함합니다. 나머지 매개변수와 마찬가지로 부분적으로 사용할 수 없습니다.

이런 이유로 현재는 나머지 매개변수가 선호됩니다.

````smart header="`\"arguments\" 는 화살표 함수에는 없습니다`"
화살표 함수에서 `arguments` 객체에 접근하면, 그것들은 외부에 있는 "보통" 함수로부터 가져옵니다.

다음은 그 예입니다.

```js run
function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```
````

그러나, 화살표 함수에는 그 함수만을 위한 `this` 가 없습니다. 그래서 `arguments` 객체도 없습니다.

## 전개 연산자 [# spread-operator]

매개변수를 배열로 가져오는 방법을 살펴보았습니다.

그런데 가끔 그것의 역행인 작업이 필요할때가 있습니다.

예를 들어 [Math.max](mdn:js/Math/max) 라는 내장함수는 목록에서 가장 큰 숫자를 반환합니다.

```js run
alert( Math.max(3, 5, 1) ); // 5
```

배열 `[3, 5, 1]` 이 있다고 할때 `Math.max`를` 어떻게 호출할 수 있을까요?

`Math.max`는 단일 배열이 아닌 목록으로된 숫자 인자를 인수로 받기 때문에 "배열" 그대로 넘기면 작동하지 않습니다

```js run
let arr = [3, 5, 1];

*!*
alert( Math.max(arr) ); // NaN
*/!*
```

확실히 `Math.max (arr [0], arr [1], arr [2])` 코드에서는 배열항목을 수동으로 나열할 수 없습니다. 
왜냐하면 스크립트가 실행될 때 배열이 더 클 수도 있고 작을 수도 있고 혹은 비어있을지 알 수 없기 때문이죠. 이것이 잘못된 결과를 가져올 수 있습니다.

*전개 연산자* 가 해결해 줍니다! 전개 연산자는 나머지 매개변수와 비슷하게 보이고 `...` 을 사용하지만, 사실은 반대로 작동합니다.

`... arr`이 함수에서 호출 될때, iterable(반복 가능한) 객체 `arr`을 인수들의 목록으로 "확장" 합니다.

For `Math.max`:

```js run
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5 (배열을 인자들의 목록으로 바꾼다)
```

다음과 같이 여러 iterable을 전달할 수도 있습니다.

```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(...arr1, ...arr2) ); // 8
```

전개 연산자를 일반 값과 혼합해 사용할 수도 있습니다.


```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(1, ...arr1, 2, ...arr2, 25) ); // 25
```

또한 전개 연산자를 사용하여 배열을 병합할 수 있습니다.

```js run
let arr = [3, 5, 1];
let arr2 = [8, 9, 15];

*!*
let merged = [0, ...arr, 2, ...arr2];
*/!*

alert(merged); // 0,3,5,1,2,8,9,15 (0, 다음은 arr, 다음은 2, 다음은 arr2)
```

위의 예제에서는 전개 연산자를 보여주기 위해 배열을 사용했지만, 다른 어떠한 iterable 작업이라면 가능합니다.

다음 예제는 전개 연산자를 사용하여 문자열을 문자 배열로 변환합니다.

```js run
let str = "Hello";

alert( [...str] ); // H,e,l,l,o
```

전개 연산자는 `for..of` 와 같은 방식으로 내부적으로 iterators(반복자들)을 사용하여 요소를 수집합니다.

그래서, 문자일경우, `for..of` 는 문자를 반환하고 `...str`은 `"H","e","l","l","o"`가 됩니다. 문자의 리스트는 `[...str]` 배열 이니셜라이저로 넘겨집니다. 

이 특별한 작업을 위해서 iterable `Array.from`을 배열로 변환하기 때문에 `Array.from`을 사용할 수도 있습니다 :

이러한 iterable (문자열 같은) 객체를 배열로 변환하는 특수한 작업에는 `Array.from`을 사용할 수도 있습니다.

```js run
let str = "Hello";

// Array.from converts an iterable into an array
alert( Array.from(str) ); // H,e,l,l,o
```

결과는`[...str]`과 같습니다.

그러나 `Array.from (obj)`와 `[... obj]`에는 미묘한 차이가 있습니다 :

- `Array.from` 은 유사-배열과 iterables(반복 가능한) 둘 다에서 작동합니다.
- 전개 연산자는 iterable 객체 에서만 작동합니다.

그래서, 배열로 뭔가를 돌리는 작업을 할때는 `Array.from` 을 사용하는 경향이 있습니다.


## 요약

`"..."`는 코드에서 볼 때, 나머지 매개변수 또는 전개 연산자이다.

나머지 매개변수와 전개 연산자를 서로 구분할 수 있는 쉬운 방법이 있다.

- `...`이 함수 매개변수의 끝에 있을 때, 그것은 "나머지 매개변수"이고 나머지 인수 목록을 배열로 모으는 것이다.
- `...`이 함수 호출과 비슷하게 발생하면, 그것은 "전개 연산자"이고 배열을 리스트로 확장하는 것이다.

패턴 사용하기

- 나머지 매개변수는 주로 여러 개의 인수를 허용하는 함수에 사용된다.
- 전개 연산자는 일반적으로 많은 인수 목록을 요구하는 함수에 배열을 전달하는 데 사용된다.

두 방법 모두 목록과 매개변수 배열 간의 이동을 쉽게 돕습니다.

여전히 모든 함수 호출의 인수는 "오래된-방식" 인 `arguments`(배열 같은 iterable 객체)을 사용할 수 있습니다.