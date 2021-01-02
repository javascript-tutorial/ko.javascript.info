# 나머지 매개변수와 전개 문법

상당수의 자바스크립트 내장 함수는 인수의 개수에 제약을 두지 않습니다.

예시:

- `Math.max(arg1, arg2, ..., argN)` -- 인수 중 가장 큰 수를 반환합니다.
- `Object.assign(dest, src1, ..., srcN)` -- `src1..N`의 프로퍼티를 `dest`로 복사합니다.
- 기타 등등

이번 챕터에서는 이렇게 임의의 수의 인수를 받는 방법에 대해 알아보겠습니다. 또한 함수의 매개변수에 배열을 전달하는 방법에 대해서도 알아보겠습니다.

## 나머지 매개변수 `...`

함수 정의 방법과 상관없이 함수에 넘겨주는 인수의 개수엔 제약이 없습니다.

아래와 같이 말이죠.
```js run
function sum(a, b) {
  return a + b;
}

alert( sum(1, 2, 3, 4, 5) );
```

함수를 정의할 땐 인수를 두 개만 받도록 하고, 실제 함수를 호출할 땐 이보다 더 많은 '여분의' 인수를 전달했지만, 에러가 발생하지 않았습니다. 다만 반환 값은 처음 두 개의 인수만을 사용해 계산됩니다.

이렇게 여분의 매개변수는 그 값들을 담을 배열 이름을 마침표 세 개 `...`뒤에 붙여주면 함수 선언부에 포함시킬 수 있습니다. 이때 마침표 세 개 `...`는 "나머지 매개변수들을 한데 모아 배열에 집어넣어라."는 것을 의미합니다.

아래 예시에선 모든 인수가 배열 `args`에 모입니다.

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

앞부분의 매개변수는 변수로, 그 이외의 매개변수들은 배열로 모을 수도 있습니다.

아래 예시에선 처음 두 인수는 변수에, 나머지 인수들은 `titles`이라는 배열에 할당됩니다.

```js run
function showName(firstName, lastName, ...titles) {
  alert( firstName + ' ' + lastName ); // Julius Caesar

  // 나머지 인수들은 배열 titles의 요소가 됩니다.
  // titles = ["Consul", "Imperator"]
  alert( titles[0] ); // Consul
  alert( titles[1] ); // Imperator
  alert( titles.length ); // 2
}

showName("Julius", "Caesar", "Consul", "Imperator");
```

````warn header="나머지 매개변수는 항상 마지막에 있어야 합니다."
나머지 매개변수는 남아있는 인수를 모으는 역할을 하므로 아래 예시에선 에러가 발생합니다.

```js
function f(arg1, ...rest, arg2) { // ...rest 후에 arg2가 있으면 안 됩니다.
  // 에러
}
```

`...rest`는 항상 마지막에 있어야 합니다.
````

## 'arguments' 변수

`arguemnts`라는 특별한 유사 배열 객체(array-like object)를 이용하면 인덱스를 사용해 모든 인수에 접근할 수 있습니다.

예시:

```js run
function showName() {
  alert( arguments.length );
  alert( arguments[0] );
  alert( arguments[1] );

  // arguments는 이터러블 객체이기 때문에
  // for(let arg of arguments) alert(arg); 를 사용해 인수를 나열할 수 있습니다.
}

// 2, Julius, Caesar가 출력됨
showName("Julius", "Caesar");

// 1, Bora, undefined가 출력됨(두 번째 인수는 없음)
showName("Bora");
```

나머지 매개변수는 비교적 최신의 문법입니다. 과거엔 함수의 인수 전체를 얻어내는 방법이 `arguments`를 사용하는 것밖에 없었습니다. 물론 지금도 `arguments`를 사용할 수 있습니다. 오래된 코드를 보다 보면 `arguments`를 만나게 되죠.

`arguments`는 유사 배열 객체이면서 이터러블(반복 가능한) 객체입니다. 어쨌든 배열은 아니죠. 따라서 배열 메서드를 사용할 수 없다는 단점이 있습니다. `arguments.map (...)`을 호출할 수 없죠.

여기에 더하여 `arguments`는 인수 전체를 담기 때문에 나머지 매개변수처럼 인수의 일부만 사용할 수 없다는 단점도 있습니다.

따라서 배열 메서드를 사용하고 싶거나 인수 일부만 사용하고자 할 때는 나머지 매개변수를 사용하는 것이 좋습니다.

````smart header="화살표 함수에는 `\'arguments\'`가 없습니다."
화살표 함수에서 `arguments` 객체에 접근하면, 외부에 있는 '일반' 함수의 arguments 객체를 가져옵니다.

예시:

```js run
function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```

앞서 배운 바와 같이 화살표 함수는 자체 `this`를 가지지 않습니다. 여기에 더하여 `arguments` 객체도 없다는 것을 위 예시를 통해 확인해 보았습니다.
````


## spread 문법 [#spread-syntax]

지금까지 매개변수 목록을 배열로 가져오는 방법에 대해 살펴보았습니다.

그런데 개발을 하다 보면 반대되는 기능이 필요할 때가 생깁니다. 배열을 통째로 매개변수에 넘겨주는 것 같이 말이죠.

예시를 통해 이런 경우를 살펴봅시다. 내장 함수 [Math.max](mdn:js/Math/max)는 인수로 받은 숫자 중 가장 큰 숫자를 반환합니다.

```js run
alert( Math.max(3, 5, 1) ); // 5
```

배열 `[3, 5, 1]`가 있고, 이 배열을 대상으로 `Math.max`를 호출하고 싶다고 가정해봅시다.

아무런 조작 없이 배열을 '있는 그대로' `Math.max`에 넘기면 원하는 대로 동작하지 않습니다. `Math.max`는 배열이 아닌 숫자 목록을 인수로 받기 때문입니다. 

```js run
let arr = [3, 5, 1];

*!*
alert( Math.max(arr) ); // NaN
*/!*
```

`Math.max (arr[0], arr[1], arr[2])` 처럼 배열 요소를 수동으로 나열하는 방법도 있긴 한데 배열 길이를 알 수 없을 때는 이마저도 불가능합니다. 스크립트가 돌아갈 때 실제 넘어오는 배열의 길이는 아주 길 수도 있고, 아예 빈 배열일 수도 있기 때문입니다. 수동으로 이걸 다 처리하다 보면 코드가 지저분해지겠죠.

*전개 문법(spread syntax)* 은 이럴 때 사용하기 위해 만들어졌습니다. `...`를 사용하기 때문에 나머지 매개변수와 비슷해 보이지만, 전개 문법은 나머지 매개변수와 반대의 역할을 합니다.

함수를 호출할 때 `... arr`를 사용하면, 이터러블 객체 `arr`이 인수 목록으로 '확장'됩니다.

`Math.max`를 사용한 예시로 다시 돌아가 봅시다.

```js run
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5 (전개 문법이 배열을 인수 목록으로 바꿔주었습니다.)
```

아래와 같이 이터러블 객체 여러 개를 전달하는 것도 가능합니다.

```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(...arr1, ...arr2) ); // 8
```

전개 문법을 평범한 값과 혼합해 사용하는 것도 가능하죠.


```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(1, ...arr1, 2, ...arr2, 25) ); // 25
```

배열을 합칠 때 전개 문법을 활용할 수도 있습니다.

```js run
let arr = [3, 5, 1];
let arr2 = [8, 9, 15];

*!*
let merged = [0, ...arr, 2, ...arr2];
*/!*

alert(merged); // 0,3,5,1,2,8,9,15 (0, arr, 2, arr2 순서로 합쳐집니다.)
```

앞선 예시들에선 배열을 대상으로 전개 문법이 어떻게 동작하는지 살펴보았습니다. 그런데 배열이 아니더라도 이터러블 객체이면 전개 문법을 사용할 수 있습니다.

전개 문법을 사용해 문자열을 문자 배열로 변환 시켜 보겠습니다.

```js run
let str = "Hello";

alert( [...str] ); // H,e,l,l,o
```

전개 문법은 `for..of`와 같은 방식으로 내부에서 iterator(반복자)를 사용해 요소를 수집합니다.

문자열에 `for..of`를 사용하면 문자열을 구성하는 문자가 반환됩니다. `...str`도 `"H","e","l","l","o"`가 되는데, 이 문자 목록은 배열 초기자(array initializer) `[...str]`로 전달됩니다.

메서드 `Array.from`은 문자열 같은 이터러블 객체를 배열로 바꿔주기 때문에 `Array.from`을 사용해도 동일한 작업을 할 수 있습니다.

```js run
let str = "Hello";

// Array.from은 이터러블을 배열로 바꿔줍니다.
alert( Array.from(str) ); // H,e,l,l,o
```

`[...str]`와 동일한 결과가 출력되는 것을 확인할 수 있습니다.

그런데 `Array.from(obj)`와 `[...obj]`에는 다음과 같은 미묘한 차이가 있습니다.

- `Array.from`은 유사 배열 객체와 이터러블 객체 둘 다에 사용할 수 있습니다.
- 전개 문법은 이터러블 객체에만 사용할 수 있습니다.

이런 이유때문에 무언가를 배열로 바꿀 때는 전개 문법보다 `Array.from`이 보편적으로 사용됩니다.


## Get a new copy of an array/object

Remember when we talked about `Object.assign()` [in the past](info:object-copy#cloning-and-merging-object-assign)?

It is possible to do the same thing with the spread syntax.

```js run
let arr = [1, 2, 3];
let arrCopy = [...arr]; // spread the array into a list of parameters
                        // then put the result into a new array

// do the arrays have the same contents?
alert(JSON.stringify(arr) === JSON.stringify(arrCopy)); // true

// are the arrays equal?
alert(arr === arrCopy); // false (not same reference)

// modifying our initial array does not modify the copy:
arr.push(4);
alert(arr); // 1, 2, 3, 4
alert(arrCopy); // 1, 2, 3
```

Note that it is possible to do the same thing to make a copy of an object:

```js run
let obj = { a: 1, b: 2, c: 3 };
let objCopy = { ...obj }; // spread the object into a list of parameters
                          // then return the result in a new object

// do the objects have the same contents?
alert(JSON.stringify(obj) === JSON.stringify(objCopy)); // true

// are the objects equal?
alert(obj === objCopy); // false (not same reference)

// modifying our initial object does not modify the copy:
obj.d = 4;
alert(JSON.stringify(obj)); // {"a":1,"b":2,"c":3,"d":4}
alert(JSON.stringify(objCopy)); // {"a":1,"b":2,"c":3}
```

This way of copying an object is much shorter than `let objCopy = Object.assign({}, obj);` or for an array `let arrCopy = Object.assign([], arr);` so we prefer to use it whenever we can.


## 요약

`"..."`은 나머지 매개변수나 전개 문법으로 사용됩니다.

나머지 매개변수와 전개 문법은 아래의 방법으로 구분할 수 있습니다.

- `...`이 함수 매개변수의 끝에 있으면 인수 목록의 나머지를 배열로 모아주는 '나머지 매개변수'입니다.
- `...`이 함수 호출 시 사용되면 배열을 목록으로 확장해주는 '전개 문법'입니다.

사용 패턴:

- 인수 개수에 제한이 없는 함수를 만들 때 나머지 매개변수를 사용합니다.
- 다수의 인수를 받는 함수에 배열을 전달할 때 전개 문법을 사용합니다.

둘을 함께 사용하면 매개변수 목록과 배열 간 전환을 쉽게 할 수 있습니다.

조금 오래된 방법이긴 하지만 `arguments`라는 반복 가능한 유사 배열 객체를 사용해도 인수 모두를 사용할 수 있습니다.
