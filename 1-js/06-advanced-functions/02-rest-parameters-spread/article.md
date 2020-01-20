<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
# 나머지 매개변수와 전개 연산자
=======
# Rest parameters and spread syntax
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

상당수의 자바스크립트 내장 함수는 임의의 수의 인수를 허용합니다.

예시:

- `Math.max(arg1, arg2, ..., argN)` -- 인수 중 가장 큰 수를 반환합니다.
- `Object.assign(dest, src1, ..., srcN)` -- `src1..N`의 프로퍼티를 `dest`로 복사합니다.
- 기타 등등

이번 챕터에서는 이렇게 임의의 수의 인수를 받는 방법에 대해 알아보겠습니다. 또한 함수의 매개변수에 배열을 전달하는 방법에 대해서도 알아보겠습니다.

## 나머지 매개변수 `...`

정의 방법과 상관없이 함수를 호출할 때 넘겨주는 인수의 개수엔 제약이 없습니다.

아래와 같이 말이죠.
```js run
function sum(a, b) {
  return a + b;
}

alert( sum(1, 2, 3, 4, 5) );
```

함수를 정의할 땐 인수를 두 개만 받을 수 있다고 정의했고, 실제 함수를 호출할 땐 이보다 더 많은 인수를 전달하였는데 에러가 발생하지 않습니다. 하지만 반환 값은 당연히 처음 두 개의 인수만을 이용해 계산되죠.

마침표 세 개 `...` 뒤에 배열 이름을 적어준 후 함수 선언부의 매개변수 자리에 넣어주면 나머지 매개변수를 배열에 넣어줄 수 있습니다. 마침표 세 개 `...`가 의미하는 바는 "나머지 매개변수들을 한데 모아 배열에 집어넣어라"라는 의미를 갖죠.  

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

앞부분의 매개변수는 변수로, 남아있는 매개변수들은 배열로 모을 수도 있습니다.

아래 예시에선 처음 두 인수는 변수에, 나머지 인수는 `titles`이라는 배열에 할당됩니다.

```js run
function showName(firstName, lastName, ...titles) {
  alert( firstName + ' ' + lastName ); // Julius Caesar

  // 나머지 인수들은 배열 titles에 할당됩니다.
  // titles = ["Consul", "Imperator"]
  alert( titles[0] ); // Consul
  alert( titles[1] ); // Imperator
  alert( titles.length ); // 2
}

showName("Julius", "Caesar", "Consul", "Imperator");
```

````warn header="나머지 매개변수는 항상 마지막에 있어야 합니다."
나머지 매개변수는 "남아있는" 인수 모두를 모으는 역할을 하므로 아래 예시에선 에러가 발생합니다.

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

  // arguments는 반복 가능한 객체입니다.
  // for(let arg of arguments) alert(arg);
}

// 2, Julius, Caesar가 출력됨
showName("Julius", "Caesar");

// 1, Ilya, undefined가 출력됨(두 번째 인수는 없음)
showName("Ilya");
```

나머지 매개변수는 지원된 지 얼마 안 된 비교적 최신의 문법입니다. 과거엔 인수를 모두 얻어낼 방법이 `arguments`를 사용하는 것밖에 없었습니다. 물론 지금도 여전히 `arguments`를 사용하는 게 가능하죠. 오래된 코드를 보다 보면 `arguments`를 만나실 수 있을 겁니다.

`arguments`는 유사 배열 객체이면서 반복 가능한 객체입니다. 어쨌든 배열은 아니죠. 따라서 배열 메서드를 사용할 수 없다는 것이 단점입니다. `arguments.map (...)` 같은 유용한 메서드를 사용할 수 없죠.

`arguments`는 모든 인수를 담기 때문에 나머지 매개변수처럼 인수의 일부만 사용할 수 없다는 단점도 있습니다.

따라서 배열 메서드를 사용하고 싶거나 인수 일부만 사용하고자 할 때는 나머지 매개변수가 적합합니다.

````smart header="화살표 함수에는 `\"arguments\"`가 없습니다."
화살표 함수에서 `arguments` 객체에 접근하면, 외부에 있는 "일반" 함수의 arguments 객체를 가져옵니다.

예시:

```js run
function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```

화살표 함수는 `this`가 없습니다. 여기에 더하여 `arguments` 객체도 없다는 것을 위 예시를 통해 확인해 보았습니다.
````


<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
## 전개 연산자 [# spread-operator]
=======
## Spread syntax [#spread-syntax]
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

지금까지 매개변수 리스트를 배열로 가져오는 방법에 대해 살펴보았습니다.

그런데 개발을 하다 보면 반대되는 기능이 필요할 때가 생깁니다. 배열을 통째로 매개변수에 넘겨주는 것 같이 말이죠.

예시를 통해 이런 경우를 살펴봅시다. 내장 함수 [Math.max](mdn:js/Math/max)는 인수로 받은 숫자 중 가장 큰 숫자를 반환합니다.

```js run
alert( Math.max(3, 5, 1) ); // 5
```

배열 `[3, 5, 1]`이 있는데, 이 배열에 `Math.max`를 호출할 수 있을까요?

아무런 조작 없이 배열을 "있는 그대로" `Math.max`에 넘기면 원하는 대로 동작하지 않습니다. `Math.max`는 배열이 아닌 숫자형 인수를 받기 때문입니다. 

```js run
let arr = [3, 5, 1];

*!*
alert( Math.max(arr) ); // NaN
*/!*
```

`Math.max (arr [0], arr [1], arr [2])` 처럼 숫자를 수동으로 나열할 수도 있는데 배열 길이를 알 수 없기 때문에 이마저도 불가능합니다. 스크립트가 돌아갈 때 배열 내 요소가 아주 많을 수도, 아예 없을 수도 있죠. 수동으로 이걸 다 처리하다 보면 코드가 지저분해집니다.

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
*전개 연산자(spread operator)*는 이럴 때 사용하기 위해 만들어졌습니다. 전개 연산자는 `...`를 사용하기 때문에 나머지 매개변수와 비슷해 보이지만, 나머지 매개변수와 반대의 역할을 해주죠.
=======
*Spread syntax* to the rescue! It looks similar to rest parameters, also using `...`, but does quite the opposite.
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

함수를 호출할 때 `... arr`를 사용하면, 반복 가능한 객체 `arr`이 인수 리스트로 "확장"됩니다.

`Math.max`를 사용한 예시로 다시 돌아가 봅시다.

```js run
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5 (전개 연산자가 배열을 인수 리스트 바꿔주었습니다.)
```

아래와 같이 이터러블 여러 개를 전달하는 것도 가능합니다.

```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(...arr1, ...arr2) ); // 8
```

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
전개 연산자를 평범한 값과 혼합해 사용하는 것도 가능하죠.
=======
We can even combine the spread syntax with normal values:
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md


```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(1, ...arr1, 2, ...arr2, 25) ); // 25
```

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
전개 연산자를 활용해 배열을 병합할 수도 있습니다.
=======
Also, the spread syntax can be used to merge arrays:
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

```js run
let arr = [3, 5, 1];
let arr2 = [8, 9, 15];

*!*
let merged = [0, ...arr, 2, ...arr2];
*/!*

alert(merged); // 0,3,5,1,2,8,9,15 (0, arr, 2, arr2 순서로 합쳐집니다.)
```

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
위 예시에선 배열을 대상으로 어떻게 전개 연산자가 동작하는지 보여줬는데 배열이 아니더라도 이터러블이라면 전개 연산자를 사용할 수 있습니다.

아래 예시에선 전개 연산자를 사용해 문자열을 문자 배열로 변환 시켜 보았습니다.
=======
In the examples above we used an array to demonstrate the spread syntax, but any iterable will do.

For instance, here we use the spread syntax to turn the string into array of characters:
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

```js run
let str = "Hello";

alert( [...str] ); // H,e,l,l,o
```

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
전개 연산자는 내부에서 iterator(반복자)를 사용해 요소를 수집합니다. `for..of`와 같은 방식으로 말이죠.
=======
The spread syntax internally uses iterators to gather elements, the same way as `for..of` does.
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

문자열에 `for..of`를 사용하면 문자열을 구성하는 문자를 반환하는 것 같이, `...str`도 `"H","e","l","l","o"`가 되고, 이 문자 리스트는 `[...str]`의 배열 초기자(array initializer)로 전달됩니다.

메서드 `Array.from`은 문자열 같은 이터러블을 배열로 바꿔주기 때문에 이를 사용해도 동일한 작업을 할 수 있습니다.

```js run
let str = "Hello";

// Array.from은 이터러블을 배열로 바꿔줍니다.
alert( Array.from(str) ); // H,e,l,l,o
```

`[...str]`와 동일한 결과가 출력되네요.

그런데 `Array.from (obj)`과 `[... obj]`에는 아래와 같은 미묘한 차이가 있습니다.

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
- `Array.from` 은 유사 배열 객체와 반복 가능한 객체 둘 다에 사용할 수 있습니다.
- 전개 연산자는 이터러블에만 사용할 수 있습니다.
=======
- `Array.from` operates on both array-likes and iterables.
- The spread syntax works only with iterables.
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

이런 이유때문에 무언가를 배열로 바꿀 때는 `Array.from`이 전개 연산자보다 보편적으로 사용되는 편입니다.


## 요약

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
`"..."`는 나머지 매개변수나 전개 연산자로 사용됩니다.
=======
When we see `"..."` in the code, it is either rest parameters or the spread syntax.
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

나머지 매개변수와 전개 연산자는 아래의 방법으로 구분할 수 있습니다.

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
- `...`이 함수 매개변수의 끝에 있으면 인수 목록의 나머지를 배열로 모아주는 "나머지 매개변수"입니다.
- `...`이 함수 호출 시 사용되면 배열을 목록으로 확장해주는 "전개 연산자"입니다.
=======
- When `...` is at the end of function parameters, it's "rest parameters" and gathers the rest of the list of arguments into an array.
- When `...` occurs in a function call or alike, it's called a "spread syntax" and expands an array into a list.
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

사용 패턴:

<<<<<<< HEAD:1-js/06-advanced-functions/02-rest-parameters-spread-operator/article.md
- 인수 개수에 제한이 없는 함수를 만들 때 나머지 매개변수를 사용합니다.
- 많은 수의 인수를 받는 함수에 배열을 전달할 때 전개 연산자를 사용합니다.
=======
- Rest parameters are used to create functions that accept any number of arguments.
- The spread syntax is used to pass an array to functions that normally require a list of many arguments.
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/06-advanced-functions/02-rest-parameters-spread/article.md

둘을 함께 사용하면 매개변수 목록과 배열 간 전환을 쉽게 할 수 있습니다.

조금 오래된 방법이긴 하지만 `arguments`라는 반복 가능한 유사 배열 객체를 사용해도 인수 모두를 사용할 수 있습니다.
