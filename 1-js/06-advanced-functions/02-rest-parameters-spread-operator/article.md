# 나머지 매개변수와 전개 연산자

많은 자바 스크립트 내장 함수는 임의의 수의 인수를 지원합니다.

예를 들어:

- `Math.max(arg1, arg2, ..., argN)` -- 가장 큰 인수를 반환합니다.
- `Object.assign(dest, src1, ..., srcN)` -- `src1..N` 에서 `dest` 로 속성복사.
- ...등등.

이 장에서는 같은 방법을 배우게됩니다. 그리고 더 중요한 것은 이러한 함수 및 배열을 사용하여 편안하게 작업하는 방법입니다.

## 나머지 매개변수 `...`

어떤 함수가 정의 되더라도 함수는 여러 개의 인수로 호출 할 수 있습니다.

여기처럼 :
```js run
function sum(a, b) {
  return a + b;
}

alert( sum(1, 2, 3, 4, 5) );
```

"과도한"인수 때문에 오류가 발생하지 않습니다. 그러나 결과에서 처음 두 개만 계산됩니다.

나머지 매개변수는 세 개의 점 '...'이있는 함수 정의에서 언급 할 수 있습니다. 말 그대로 "나머지 매개변수를 배열로 모으는"것을 의미합니다.

예를 들어, 모든 인수를 배열`args`에 모으려면 :

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

여기서 처음 두 인수는 변수에 들어가고 나머지는 `titles` 배열에 들어갑니다 :

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

````warn header="The rest parameters must be at the end"
나머지 매개변수는 나머지 모든 인수를 수집하므로 다음은 의미가 없으므로 오류가 발생합니다.

```js
function f(arg1, ...rest, arg2) { // arg2 후에 ...rest ?!
  // error
}
```

`...rest`는 항상 최후의 것이어야합니다.
````

## "arguments" 변수

또한 인덱스에 의해 모든 인수를 포함하는`arguments`라는 특별한 배열과 같은 객체가 있습니다.

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

예전에는 나머지 매개변수가 언어에 존재하지 않았고,`arguments` 를 사용하는 것이 총 수에 관계없이 함수의 모든 인수를 얻는 유일한 방법이었습니다.

그리고 그것은 여전히 작동합니다, 우리는 오늘 그것을 사용할 수 있습니다.

그러나 단점은 `arguments` 는 배열과 반복 가능하지만 배열이 아니기 때문입니다. 배열 메소드를 지원하지 않으므로, 예를 들어 `arguments.map (...)`을 호출 할 수 없습니다.

또한 항상 모든 인수를 포함합니다. 나머지 매개변수와 마찬가지로 부분적으로 캡처 할 수 없습니다.

따라서 이러한 기능이 필요할 때 나머지 매개변수가 선호됩니다.

````smart header="`\"arguments\" 는 화살표 함수에는 없습니다`"
화살표 함수에서`arguments` 객체에 접근하면, 그것들은 외부 "정상"함수로부터 그것들을 가져옵니다.

다음은 그 예입니다.

```js run
function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```
````

기억 하듯이, 화살표 함수에는 그들 만의 `This` 가 없습니다. 그래서 우리는 특별한 `arguments` 객체도 가지고 있지 않다는 것을 알 수 있습니다.

## 전개 연산자 [# spread-operator]

방금 매개변수 목록에서 배열을 가져 오는 방법을 보았습니다.

그러나 때때로 우리는 정확히 그 반대를해야합니다.

예를 들어 목록에서 가장 큰 숫자를 반환하는 내장 함수가 있습니다 [Math.max](mdn:js/Math/max):

```js run
alert( Math.max(3, 5, 1) ); // 5
```

이제 배열 `[3, 5, 1]` 을 가정 해 봅시다. 어떻게 `Math.max` 를 호출할까요?

`Math.max`는 단일 배열이 아닌 숫자 인자 목록을 기대하기 때문에 "그대로"전달하면 작동하지 않습니다 :

```js run
let arr = [3, 5, 1];

*!*
alert( Math.max(arr) ); // NaN
*/!*
```

그리고 확실하게 우리는 `Math.max (arr [0], arr [1], arr [2])` 코드에 항목을 수동으로 나열 할 수 없습니다. 스크립트가 실행될 때 많은 부분이있을 수도 있고 없을 수도 있습니다. 그리고 그것은 추악해질 것입니다.

*전개 연산자* 가 해답입니다! 그것은 나머지 매개변수와 비슷하게 보이며`...`을 사용하지만 꽤 반대입니다.

`... arr`이 함수 호출에서 사용될 때, iterable 객체 `arr`을 인수 목록으로 "확장"합니다.

For `Math.max`:

```js run
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5 (배열을 인자의리스트로 바꾼다)
```

또한 다음과 같이 여러 iterable을 전달할 수 있습니다.

```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(...arr1, ...arr2) ); // 8
```

전개 연산자를 일반 값과 결합 할 수도 있습니다.


```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(1, ...arr1, 2, ...arr2, 25) ); // 25
```

또한 전개 연산자를 사용하여 배열을 병합 할 수 있습니다.

```js run
let arr = [3, 5, 1];
let arr2 = [8, 9, 15];

*!*
let merged = [0, ...arr, 2, ...arr2];
*/!*

alert(merged); // 0,3,5,1,2,8,9,15 (0, 그다음 arr, 그다음 2, 그다음 arr2)
```

위의 예제에서 우리는 전개 연산자를 보여주기 위해 배열을 사용했지만 모든 반복 가능은 수행 할 것입니다.

예를 들어 여기에서는 전개 연산자를 사용하여 문자열을 문자 배열로 변환합니다.

```js run
let str = "Hello";

alert( [...str] ); // H,e,l,l,o
```

전개 연산자는`for..of`와 같은 방식으로 내부적으로 반복자를 사용하여 요소를 수집합니다.

그래서, 문자일경우, `for..of` 는 문자를 반환하고 `...str`은 `"H","e","l","l","o"`가 됩니다. 문자의 리스트는 `[...str]` 배열 이니셜라이저로 넘겨집니다. 

이 특별한 작업을 위해서 iterable `Array.from`을 배열로 변환하기 때문에 `Array.from`을 사용할 수도 있습니다 :

```js run
let str = "Hello";

// Array.from converts an iterable into an array
alert( Array.from(str) ); // H,e,l,l,o
```

결과는`[... str]`과 같습니다.

그러나`Array.from (obj)`와`[... obj]`에는 미묘한 차이가 있습니다 :

- `Array.from`는 array-likes와 iterables 둘 다에서 작동합니다.
- 전개 연산자는 iterable에서만 작동합니다.

그래서, 배열로 뭔가를 돌리는 작업을 위해, `Array.from` 은 보편적 인 경향이 있습니다.


## 요약

`"... "`을 코드에서 볼 때, 그것은 나머지 매개변수 또는 전개 연산자입니다.

서로 구분할 수있는 쉬운 방법이 있습니다.

- `...`이 함수 매개변수의 끝에있을 때, 그것은 "나머지 매개변수"이고 나머지 인수 목록을 배열로 모으는 것입니다.
- `...`이 함수 호출이나 비슷하게 발생하면, 그것은 "확산 연산자"라고 불리고 배열을리스트로 확장합니다.

패턴 사용 :

- 나머지 매개변수는 여러 개의 인수를 허용하는 함수를 작성하는 데 사용됩니다.
- 전개 연산자는 일반적으로 많은 인수 목록이 필요한 함수에 배열을 전달하는 데 사용됩니다.

함께 목록과 매개변수 배열 간을 쉽게 이동할 수 있습니다.

함수 호출의 모든 인수는 "오래된-방식" 인 `arguments`:배열 스타일의 반복 가능한 객체 에서도 사용할 수 있습니다.
