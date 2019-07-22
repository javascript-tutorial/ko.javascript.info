# 배열 메서드

배열은 다양한 메서드를 제공합니다. 학습의 편의를 위해 본 챕터에선 배열 메서드를 기능단위로 나눠 소개하도록 하겠습니다.

## 요소를 추가/제거하는 메서드

배열의 처음이나 끝에 요소(item)를 추가하거나 제거하는 메서드는 이미 학습한 바 있습니다.

- `arr.push(...items)` -- 배열의 끝에 요소를 추가.
- `arr.pop()` -- 배열의 끝 요소를 제거.
- `arr.shift()` -- 배열의 처음 요소를 제거.
- `arr.unshift(...items)` -- 배열의 처음에 요소를 추가.

<<<<<<< HEAD
이 외에 요소를 추가/제거하는 메서드를 알아보도록 하겠습니다.
=======
Here are a few others.
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

### splice

배열에서 요소 하나를 지우고 싶다면 어떻게 해야 할까요?

배열 역시 객체이므로, 객체 연산자인 `delete`를 사용해 볼 수 있을 것입니다.

```js run
let arr = ["I", "go", "home"];

delete arr[1]; // remove "go"

alert( arr[1] ); // undefined

// now arr = ["I",  , "home"];
alert( arr.length ); // 3
```

원하는 대로 요소를 지우긴 했지만, 배열엔 여전히 세 개의 요소가 남아있네요. `arr.length == 3`을 통해 이를 확인할 수 있습니다.

이는 자연스러운 현상입니다. `delete obj.key`는 `key`를 이용해 값을 지우기 때문입니다. `delete` 메서드는 제 역할을 다 한 것이죠. 객체엔 이렇게 해도 괜찮습니다. 하지만 개발자는 삭제하고 남은 나머지 요소들이 이동해 삭제된 요소의 공간을 채우길 기대하며 이 메서드를 썼을 겁니다. 요소를 지운 만큼 배열의 길이가 더 짧아지길 기대하며 말이죠. 

이런 기대를 충족하려면 특별한 메서드를 사용해야 합니다.

[arr.splice(str)](mdn:js/Array/splice) 메서드는 만능 스위스 맥가이버 칼 같습니다. 요소를 자유자재로 다룰 수 있게 해주죠. 이 메서드로 요소 추가, 삭제, 교체가 모두 가능합니다.

문법은 다음과 같습니다.

```js
arr.splice(index[, deleteCount, elem1, ..., elemN])
```

첫 번째 매개변수는 수정을 시작할 `인덱스(index)`입니다. 그다음 매개변수는 `deleteCount`로, 제거하고자 하는 요소의 개수를 나타냅니다. `elem1, ..., elemN`은 배열에 추가될 요소입니다.

다양한 예제를 통해 splice 메서드를 이해해 보도록 하겠습니다.

먼저 요소 삭제에 관한 예제부터 살펴보도록 하겠습니다.

```js run
let arr = ["I", "study", "JavaScript"];

*!*
arr.splice(1, 1); // 인덱스 1부터 요소 한 개(1)를 제거합니다.
*/!*

alert( arr ); // ["I", "JavaScript"]
```

쉽죠? 인덱스 `1`부터 시작해 요소 한 개(`1`)를 지웠습니다.

다음 코드에선 요소 세 개(3)를 지우고, 그 자리를 다른 두 개의 요소로 교체해 보도록 하겠습니다.

```js run
let arr = [*!*"I", "study", "JavaScript",*/!* "right", "now"];

// 처음 세 개(3)의 요소를 지우고, 이 자리를 다른 요소로 대체합니다.
arr.splice(0, 3, "Let's", "dance");

alert( arr ) // now [*!*"Let's", "dance"*/!*, "right", "now"]
```

`splice` 메서드는 삭제된 요소로 구성된 배열을 반환합니다. 아래 코드를 통해 확인해 봅시다. 

```js run
let arr = [*!*"I", "study",*/!* "JavaScript", "right", "now"];

// 처음 두 개의 요소를 삭제함
let removed = arr.splice(0, 2);

alert( removed ); // "I", "study" <-- 삭제된 요소로 구성된 배열
```

`splice` 메서드는 요소를 제거하지 않으면서 요소를 추가해 줄 수도 있습니다. `deleteCount`를 `0`으로 설정하기만 하면 됩니다.

```js run
let arr = ["I", "study", "JavaScript"];

// 인덱스 2부터
// 0개의 요소를 삭제합니다.
// 그 후, "complex"와 "language"를 추가합니다.
arr.splice(2, 0, "complex", "language");

alert( arr ); // "I", "study", "complex", "language", "JavaScript"
```

````smart header="음수 인덱스도 사용 가능합니다"
slice메서드와 다른 배열 관련 메서드에 음수 인덱스를 사용할 수 있습니다. 이때 마이너스 부호 앞의 숫자는 배열 끝에서부터 센 요소의 위치를 나타냅니다. 아래와 같이 말이죠.

```js run
let arr = [1, 2, 5];

// 인덱스 -1부터 (배열 끝에서부터 첫 번째 요소)
// 0개의 요소를 삭제하고,
// 3과 4를 추가해줍니다.
arr.splice(-1, 0, 3, 4);

alert( arr ); // 1,2,3,4,5
```
````

### slice

[arr.slice](mdn:js/Array/slice) 메서드는 `arr.splice`와 비슷해 보이지만, 훨씬 간단한 메서드입니다.

문법:

```js
arr.slice(start, end)
```

이 메서드는 `"start"` 인덱스부터 (`"end"`를 제외한) `"end"`인덱스까지의 요소를 포함하는 메서드를 반환합니다. `start`와 `end` 인덱스는 둘 다 음수일 수도 있습니다. 인덱스가 음수일 땐 배열 끝에서부터의 요소 개수를 의미합니다.

`arr.slice`메서드의 동작은 문자열 메서드인 `str.slice`와 유사하지만, `arr.slice`메서드는 서브 문자열(substring) 대신 서브 배열(subarray)를 반환한다는 점이 다릅니다.

예:

```js run
let str = "test";
let arr = ["t", "e", "s", "t"];

alert( str.slice(1, 3) ); // es
alert( arr.slice(1, 3) ); // e,s

alert( str.slice(-2) ); // st
alert( arr.slice(-2) ); // s,t
```

### concat

[arr.concat](mdn:js/Array/concat) 메서드는 배열의 끝에 다른 배열이나 요소를 추가해줍니다.

문법은 다음과 같습니다.

```js
arr.concat(arg1, arg2...)
```

인수의 개수는 제한이 없고, 인수로 배열이나 값을 받을 수 있습니다.

메서드를 적용한 결과는 `arr`에 속한 모든 요소와, `arg1`, `arg2` 등에 속한 모든 요소를 합친 배열입니다.

인수가 배열이거나, 인수의 프로퍼티가 `Symbol.isConcatSpreadable`이라면, 인수로 받은 배열의 모든 요소를 복사합니다. 이 외에는 인수 자체를 복사합니다.

예시:

```js run
let arr = [1, 2];

// 배열 arr을 배열 [3,4]와 병합함
alert( arr.concat([3, 4])); // 1,2,3,4

// 배열 arr을 배열 [3,4]와 배열 [5,6]과 병합함
alert( arr.concat([3, 4], [5, 6])); // 1,2,3,4,5,6

// 배열 arr을 배열 [3,4]와 병합하고, 값5 와 6을 추가함
alert( arr.concat([3, 4], 5, 6)); // 1,2,3,4,5,6
```

일반적으로, concat 메서드는 제공받은 배열의 요소를 ("분해"해서) 복사합니다. 객체는 통으로 복사되어 더해집니다. 배열처럼 보이는 객체(유사 배열 객체)도 마찬가지로 전체가 복사됩니다. 

```js run
let arr = [1, 2];

let arrayLike = {
  0: "something",
  length: 1
};

alert( arr.concat(arrayLike) ); // 1,2,[object Object]
//[1, 2, arrayLike]
```

하지만 유사 배열 객체에 `Symbol.isConcatSpreadable` 프로퍼티가 있으면, 객체의 요소가 더해집니다.

```js run
let arr = [1, 2];

let arrayLike = {
  0: "something",
  1: "else",
*!*
  [Symbol.isConcatSpreadable]: true,
*/!*
  length: 2
};

alert( arr.concat(arrayLike) ); // 1,2,something,else
```

## Iterate: forEach

[arr.forEach](mdn:js/Array/forEach) 메서드는 주어진 함수를 배열 요소 각각에 대해 실행할 수 있게 해줍니다.

문법은 다음과 같습니다.
```js
arr.forEach(function(item, index, array) {
  // 요소에 무언갈 할 수 있습니다.
});
```

아래는 배열의 각 요소를 보여주는 코드입니다.

```js run
// for each element call alert
["Bilbo", "Gandalf", "Nazgul"].forEach(alert);
```

아래는 타깃 배열의 인덱스까지 출력해주는 좀 더 정교한 코드입니다.

```js run
["Bilbo", "Gandalf", "Nazgul"].forEach((item, index, array) => {
  alert(`${item} is at index ${index} in ${array}`);
});
```

함수의 반환값은 (반환값을 어떻게 명시해 줬든 간에) 무시됩니다(역주: 결국 forEach 메서드의 반환값은 undefined가 됩니다).


## 배열 탐색하기

배열 내에서 뭔가를 찾고 싶을 때 쓰는 메서드에 대해 알아봅시다.

### indexOf/lastIndexOf와 includes

배열 메서드인 [arr.indexOf](mdn:js/Array/indexOf), [arr.lastIndexOf](mdn:js/Array/lastIndexOf), [arr.includes](mdn:js/Array/includes)는 같은 이름을 가진 문자열 메서드와 동일한 문법을 사용하고 하는 일도 본질적으로 같습니다. 연산 대상이 문자열이 아닌 배열의 요소라는 점만 다릅니다.

<<<<<<< HEAD
- `arr.indexOf(item, from)`는 인덱스 `from`부터 시작해 해당하는 `item(요소)`을 찾습니다. 일치하는 요소를 발견하면 해당하는 요소의 인덱스를 반환하고 그렇지 않다면 `-1`을 반환합니다.
- `arr.lastIndexOf(item, from)`는 위 메서드와 동일한 기능을 하는 메서드이나, 검색을 끝에서부터 시작한다는 점만 다릅니다.
- `arr.includes(item, from)`는 인덱스 `from`부터 시작해 배열에 해당하는 `요소(item)`가 있는지를 검색하는데, 해당하는 요소를 발견하면 `true`를 반환합니다.
=======
- `arr.indexOf(item, from)` -- looks for `item` starting from index `from`, and returns the index where it was found, otherwise `-1`.
- `arr.lastIndexOf(item, from)` -- same, but looks for from right to left.
- `arr.includes(item, from)` -- looks for `item` starting from index `from`, returns `true` if found.
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

예시 코드를 살펴보겠습니다.

```js run
let arr = [1, 0, false];

alert( arr.indexOf(0) ); // 1
alert( arr.indexOf(false) ); // 2
alert( arr.indexOf(null) ); // -1

alert( arr.includes(1) ); // true
```
위 메서드들은 요소를 찾을 때 완전 항등 연산자인 `===` 를 사용한다는 점에 유의하시기 바랍니다. 보시는 바와 같이 `false`를 검색하면 정확히 `false`만을 검색하지, 0을 검색하진 않습니다.

요소의 위치를 정확히 알고 싶은게 아니고, 배열 내 존재 여부만 확인하고 싶다면 `arr.includes`를 사용하는 게 좋습니다.

`includes` 메서드는 `NaN`도 찾아낼 수 있다는 점에서 `indexOf/lastIndexOf`메서드와 약간의 차이가 있습니다.

```js run
const arr = [NaN];
alert( arr.indexOf(NaN) ); // -1 (0이 출력되길 기대하지만, 완전 항등 비교 === 는 NaN엔 작동하지 않습니다.)
alert( arr.includes(NaN) );// true (기대하는 대로 NaN의 여부를 확인하였습니다.)
```

### find 와 findIndex

객체로 이루어진 배열이 있다고 가정해 봅시다. 특정 조건을 가진 객체를 배열 내에서 어떻게 찾아낼 수 있을까요?

[arr.find](mdn:js/Array/find) 메서드는 이럴 때 쓸모가 있습니다.

문법은 다음과 같습니다.
```js
let result = arr.find(function(item, index, array) {
  // true가 반환되면, 반복이 멈추고 해당 item(요소)을 반환합니다.
  // 거짓 같은 값(falsy)일 경우는 undefined를 반환합니다.
});
```

배열 내 모든 요소에 대하여 함수가 호출됩니다. 이때,

- `item` 은 요소를 의미합니다.
- `index` 는 인덱스를 의미합니다.
- `array` 는 배열 그 자체를 의미합니다.

find 메서드가 참을 반환하면, 탐색은 중단되고 해당 `요소(item)`가 반환됩니다. 아무것도 찾지 못했을 경우는 `undefined`가 반환됩니다.

`id`와 `name` 프로퍼티를 가진 사용자 객체로 구성된 배열을 예로 들어보도록 하겠습니다. 배열 내에서 `id == 1` 조건을 충족하는 사용자 객체를 찾아봅시다.

```js run
let users = [
  {id: 1, name: "John"},
  {id: 2, name: "Pete"},
  {id: 3, name: "Mary"}
];

let user = users.find(item => item.id == 1);

alert(user.name); // John
```

실무에서 객체로 구성된 배열을 자주 만나게 될겁니다. 그렇기 때문에 `find` 메서드는 유용하죠.

위 예제에선 인수가 하나만 있는 함수인 `item => item.id == 1`을 `find` 메서드에 넘겨주었다는 점에 유의하시기 바랍니다. `find` 메서드를 가지고 무언가를 할 때, 다른 인수를 쓰는 경우는 거의 없습니다.

[arr.findIndex](mdn:js/Array/findIndex) 메서드는 find 메서드와 동일한 일을 하나, 조건에 맞는 요소를 반환하지 않고, 해당 요소의 인덱스만 반환한다는 점에서 차이가 있습니다. 아무것도 찾지 못한 경우는 `-1`을 반환합니다. 

### filter

`find` 메서드는 함수의 반환값을 `true`로 만드는 단 하나의 요소를 찾습니다. 요소를 찾게 되면 탐색이 중단되기 때문에, 조건에 맞는 첫 번째 요소만 반환됩니다.

만약 조건을 충족하는 요소가 여러 개라면, [arr.filter(fn)](mdn:js/Array/filter)를 사용해 해당하는 객체를 찾을 수 있습니다.

문법은 `find`와 비슷합니다. 하지만 filter 메서드는 `true`가 이미 반환된 경우에도 탐색을 멈추지 않기 때문에 배열의 모든 요소를 검색한다는 점에서 차이가 있습니다.

```js
let results = arr.filter(function(item, index, array) {
  // 조건을 만족하는 요소가 반환되더라도 탐색은 멈추지 않습니다.
  // 모든 요소가 조건을 충족하지 않으면, 빈 배열이 반환됩니다.
});
```

예시:

```js run
let users = [
  {id: 1, name: "John"},
  {id: 2, name: "Pete"},
  {id: 3, name: "Mary"}
];

// 앞쪽 두 명의 사용자를 반환합니다.
let someUsers = users.filter(item => item.id < 3);

alert(someUsers.length); // 2
```

## 배열을 변형시키는 메서드

배열을 변형하거나 재정렬하는 메서드를 알아보도록 하겠습니다.


### map

[arr.map](mdn:js/Array/map) 메서드는 유용성과 사용 빈도가 아주 높은 메서드 중 하나입니다.

문법은 다음과 같습니다.

```js
let result = arr.map(function(item, index, array) {
  // 요소가 아닌 새로운 값을 반환합니다
})
```

map 메서드는 배열의 각 요소에 함수를 호출하고, 결과를 배열로 받아 반환합니다.   

아래는 map 메서드를 활용해 각 요소의 길이를 출력해주는 예시입니다.

```js run
let lengths = ["Bilbo", "Gandalf", "Nazgul"].map(item => item.length);
alert(lengths); // 5,7,6
```

### sort(fn)

[arr.sort](mdn:js/Array/sort) 메서드는 배열의 요소를 *올바른 순서로* 정렬해줍니다.

예시:

```js run
let arr = [ 1, 2, 15 ];

// sort 메서드는 arr의 내용을 재정렬하고, 재정렬된 배열을 반환합니다.
arr.sort();

alert( arr );  // *!*1, 15, 2*/!*
```

결과에서 뭔가 이상한 걸 발견하지 않으셨나요?

순서가 `1, 15, 2`가 되었습니다. 기대하던 결과와는 다르네요. 왜 이런 결과가 나왔을까요?

**요소는 문자열로 취급되어 정렬되기 때문입니다.**

모든 요소는 문자열로 변환되고 나서 비교됩니다. 사전 순으로 재정렬 되기 때문에, `"2" > "15"`라는 결과가 도출되었습니다.

문자열 기준이 아닌 다른 기준을 만들어 정렬하고 싶다면, 인수 두 개를 받는 함수를 만들어 `arr.sort()`의 인수로 전달해 주면 됩니다.

`arr.sort()`에 넘겨줄 함수는 아래와 같은 형태이어야 합니다.
```js
function compare(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}
```

예시:

```js run
function compareNumeric(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}

let arr = [ 1, 2, 15 ];

*!*
arr.sort(compareNumeric);
*/!*

alert(arr);  // *!*1, 2, 15*/!*
```

이제 의도한 대로 숫자가 오름차순으로 정렬되었습니다.

<<<<<<< HEAD
잠시 멈춰 이 메서드가 어떻게 동작하는지 생각해 봅시다. `arr`의 요소는 어떤 값이든 가능합니다. 숫자, 문자열, html 요소 등 모든 것이 요소가 될 수 있죠. *무언가*로 구성된 집합이 arr에 담긴 상황입니다. 이제 이 집합을 정렬해봅시다. 요소를 어떤 기준으로 비교하고 정렬할지 정의하는 *순서를 매겨주는 함수(ordering function)* 가 필요합니다. 아무 매개변수도 넘겨주지 않으면 sort 메서드는 사전 순으로 정렬합니다.
=======
Let's step aside and think what's happening. The `arr` can be array of anything, right? It may contain numbers or strings or HTML elements or whatever. We have a set of *something*. To sort it, we need an *ordering function* that knows how to compare its elements. The default is a string order.
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

`arr.sort(fn)` 메서드의 정렬 알고리즘은 내부에 구현되어 있습니다. 대부분 최적화된 [quicksort](https://en.wikipedia.org/wiki/Quicksort)를 이용하여 구현하는데, 이 알고리즘이 어떻게 작동하는지는 지금 살펴보지 않겠습니다. `arr.sort(fn)`의 정렬 알고리즘은 매개변수로 넘겨준 함수(비교 함수)를 이용해 배열 내를 돌아다니며 요소를 비교하고, 재정렬합니다. 개발자는 비교에 쓰이는 `fn` 만 제공해 주면 됩니다.  

정렬 과정에서 어떤 요소끼리 비교가 일어났는지 확인하고 싶다면 아래 코드를 통해 확인하면 됩니다.

```js run
[1, -2, 15, 2, 0, 8].sort(function(a, b) {
  alert( a + " <> " + b );
});
```

이 알고리즘은 정렬 시 요소를 여러번 비교합니다. 하지만 비교를 가능한 한 적게 하는 방식으로 구현되어 있습니다.


````smart header="비교 함수는 어떤 숫자든 반환할 수 있습니다."
사실 비교함수는 양수가 "~보다 크다"를 나타내고 음수가 "~보다 작다"를 나타내기만 하면 리턴값엔 아무 제약이 없습니다.

이 점을 이용하면 콜백을 간결하게 작성할 수 있습니다.

```js run
let arr = [ 1, 2, 15 ];

arr.sort(function(a, b) { return a - b; });

alert(arr);  // *!*1, 2, 15*/!*
```
````

````smart header="화살표 함수가 제일 좋습니다"
앞서 배웠던 [화살표 함수](info:function-expressions-arrows#arrow-functions)를 기억하시나요? 비교함수를 화살표 함수로 작성하면 아주 깔끔한 코드로 배열을 정렬할 수 있습니다.

```js
arr.sort( (a, b) => a - b );
```

화살표 함수로 작성한 위 코드는 앞서 소개한 긴 버전의 코드와 동일하게 작동합니다.
````

### reverse

[arr.reverse](mdn:js/Array/reverse) 메서드는 `arr`의 요소를 역순으로 정렬시킵니다.

예시:

```js run
let arr = [1, 2, 3, 4, 5];
arr.reverse();

alert( arr ); // 5,4,3,2,1
```

이 메서드 역시 역순으로 재정렬된 배열을 반환합니다.

### split과 join

<<<<<<< HEAD
메시지 전송 애플리케이션을 만들고 있다고 가정해 봅시다. 메시지 수신자가 여러 명일 경우, 발신자는 쉼표를 이용해 각 수신자를 구분해 입력할 것입니다. `John, Pete, Mary`같이 말이죠. 개발자는 이렇게 하나의 긴 문자열로 입력받은 수신자 리스트를 배열 형태로 전환해 처리하고 싶을 겁니다. 어떻게 입력받은 문자열을 배열로 바꿀 수 있을까요?
=======
Here's the situation from real life. We are writing a messaging app, and the person enters the comma-delimited list of receivers: `John, Pete, Mary`. But for us an array of names would be much more comfortable than a single string. How to get it?
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

[str.split(delim)](mdn:js/String/split) 메서드를 이용하면, 정확히 우리가 원하는 것을 할 수 있습니다. 이 메서드는 구분자 `delim`을 이용해 긴 문자열을 배열로 쪼개주기 때문입니다.

아래 코드에선 쉼표와 공백이 하나의 구분자 역할을 하고 있습니다.

```js run
let names = 'Bilbo, Gandalf, Nazgul';

let arr = names.split(', ');

for (let name of arr) {
  alert( `A message to ${name}.` ); // A message to Bilbo  (and other names)
}
```

`split` 메서드는 두 번째 인수로 숫자를 받을 수 있습니다. 이 숫자는 배열의 길이를 제한해줍니다. 길이를 넘어서는 요소는 무시되죠. 실무에선 자주 사용하지 않습니다.

```js run
let arr = 'Bilbo, Gandalf, Nazgul, Saruman'.split(', ', 2);

alert(arr); // Bilbo, Gandalf
```

````smart header="문자열을 글자 하나하나로 쪼개기"
메서드 `split(s)`의 인수에 빈 문자열 `s`를 넣으면 문자열을 구성하는 글자 하나하나를 요소로 갖는 배열을 만들 수 있습니다.

```js run
let str = "test";

alert( str.split('') ); // t,e,s,t
```
````

[arr.join(separator)](mdn:js/Array/join) 메서드는 `split`의 반대 메서드입니다. 배열 `arr`의 요소를 통으로 묶어 하나의 문자열을 만들어줍니다. 매개변수 `separator`는 접착제 같은 역할을 합니다. 각 요소의 중간마다 삽입되어 하나의 문자열을 만듭니다.

예시:

```js run
let arr = ['Bilbo', 'Gandalf', 'Nazgul'];

let str = arr.join(';');

alert( str ); // Bilbo;Gandalf;Nazgul
```

### reduce/reduceRight

배열 내 요소를 대상으로 반복 작업을 하고 싶을 때 `forEach`, `for`, `for..of`을 사용할 수 있다고 배웠습니다.

각 요소를 돌면서 반복 작업을 수행하고, 요소를 조작하여 얻은 값을 받고 싶을 때는 `map`을 사용할 수 있죠.

[arr.reduce](mdn:js/Array/reduce)와 [arr.reduceRight](mdn:js/Array/reduceRight)도 유사한 작업을 합니다. 다만 사용법이 조금 복잡합니다. 이 메서드들은 배열을 기반으로 어떤 값 하나를 도출해 내고 싶을 때 사용합니다.

문법은 다음과 같습니다.

```js
let value = arr.reduce(function(previousValue, item, index, array) {
  // ...
}, initial);
```

매개변수로 받는 함수는 각 요소에 적용됩니다. 함수의 인수로 익숙한 값들이 보이네요.

- `item`은 현재 배열 요소를 나타냅니다.
- `index`는 요소의 위치를 나타냅니다.
- `array`는 배열입니다.

이 인수만을 봤을 때, `forEach/map`과 다른 게 없어 보이네요. 하지만 못 보던 인수를 하나 발견하셨을 겁니다. 

- `previousValue`는 이전 함수 호출의 결과입니다. `initial`은 함수를 처음 호출할 때 사용할 값(초깃값)이죠.

조금 어렵겠지만, 예제를 통해 이 메서드를 이해해 보도록 합시다.

<<<<<<< HEAD
`reduce` 메서드를 이용해 코드 한 줄로 배열의 모든 요소를 더한 값을 구해보겠습니다.
=======
Here we get a sum of an array in one line:
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

```js run
let arr = [1, 2, 3, 4, 5];

let result = arr.reduce((sum, current) => sum + current, 0);

alert(result); // 15
```

인수 두 개를 사용하는 활용법은 `reduce` 메서드를 이용시 흔하게 쓰이는 패턴입니다.

어떤 과정을 거쳐 위 결과가 나왔는지 살펴보도록 합시다.

1. 처음 콜백을 호출할 때, `sum`엔 초깃값 `0`(`reduce`의 마지막 인수)이 할당됩니다. `current`엔 배열의 첫 번째 요소 값인 `1`이 할당됩니다. 따라서 결과는 `1`이 되죠.
2. 두 번째 호출 시, `sum = 1` 입니다. 여기에 두 번째 요소(`2`)를 더해주고, 결과를 반환합니다. 
3. 세 번째 호출 시, `sum = 3`이고, 여기에 다음 요소를 더해줍니다. 이 과정이 계속 이어집니다.

그림으로 이 과정을 살펴보도록 합시다.

![](reduce.png)

표를 이용해 설명하면, 다음과 같습니다. 콜백 호출 시 사용될 인수의 값과, 연산 결과를 열에서 찾을 수 있습니다.

|   |`sum`|`current`|`result`|
|---|-----|---------|---------|
|첫 번째 호출|`0`|`1`|`1`|
|두 번째 호출|`1`|`2`|`3`|
|세 번째 호출|`3`|`3`|`6`|
|네 번째 호출|`6`|`4`|`10`|
|다섯번째 호출|`10`|`5`|`15`|


표를 통해 보니 조금 더 명확하네요. 이전 호출 시 결괏값(result)이 다음 호출의 첫 번째 인수가 되는 것을 확인할 수 있습니다. 

초깃값을 생략할 수도 있습니다.

```js run
let arr = [1, 2, 3, 4, 5];

// reduce 메서드에서 초깃값(initial value)을 제거함(0을 없앰)
let result = arr.reduce((sum, current) => sum + current);

alert( result ); // 15
```

결과는 같네요. 초깃값이 없으면 `reduce` 메서드는 배열의 첫 번째 요소를 초깃값으로 사용하고, 두 번째 요소부터 콜백을 호출하기 때문입니다.

위 표에서 첫 번째 줄만 없애면, 초깃값 없이 계산한 바로 위 예제의 연산 순서를 나타낼 수 있습니다.

하지만 이렇게 초깃값 없이 `reduce`를 사용할 땐 극도의 주의를 기울여야 합니다. 배열이 비어있는 상태면 `reduce` 호출 시 에러가 발생하기 때문입니다.

예시:

```js run
let arr = [];

// Error: Reduce of empty array with no initial value
// 초깃값을 설정해 주었다면, 배열이 비어있는 경우에 그 값을 반환했을 겁니다.
arr.reduce((sum, current) => sum + current);
```


이런 예외상황 때문에, 항상 초깃값을 명시해 줄 것을 권유합니다.

[arr.reduceRight](mdn:js/Array/reduceRight) 메서드도 같은 연산을 하지만, 배열의 오른쪽부터 연산을 수행한다는 점만 다릅니다.


## Array.isArray

자바스크립트에서 배열은 독립된 자료형으로 취급되지 않습니다. 객체에 속하죠.

따라서 일반 객체와 배열을 구분하고 싶을 때 `typeof`는 도움이 되지 않습니다.

```js run
alert(typeof {}); // 객체
alert(typeof []); // 객체
```

하지만 배열은 많이 쓰이기 때문에, 배열인지 아닌지를 감별해내는 특별한 메서드가 필요합니다. [Array.isArray(value)](mdn:js/Array/isArray)가 바로 그 역할을 해줍니다. `value`가 배열일 때 이 메서드는 `true`을 반환하고, 배열이 아닐 땐 `false`를 반환합니다.

```js run
alert(Array.isArray({})); // false

alert(Array.isArray([])); // true
```

## 대부분의 메서드는 "thisArg"을 지원합니다.

콜백을 호출하는 대부분의 배열 메서드(`find`, `filter`, `map` 등. `sort`는 제외)는 `thisArg`라는 추가적인 선택 매개변수를 받을 수 있습니다.

쓸 일이 흔치 않기 때문에 각 메서드를 설명할 때 이 매개변수에 대해 언급하지 않았습니다. 하지만 튜토리얼의 완성도를 위해 잠시 언급하고 넘어가도록 하겠습니다.

thisArg는 각 메서드에서 다음과 같이 활용할 수 있습니다.

```js
arr.find(func, thisArg);
arr.filter(func, thisArg);
arr.map(func, thisArg);
// ...
// thisArg는 선택적으로 사용할 수 있는 마지막 인수입니다.
```

매개변수인 `thisArg`의 값은 `func`의 `this`가 됩니다.

아래와 같이 객체의 메서드를 filter 메서드의 콜백으로 사용 시, `thisArg`를 유용하게 쓸 수 있습니다.   

```js run
let user = {
  age: 18,
  younger(otherUser) {
    return otherUser.age < this.age;
  }
};

let users = [
  {age: 12},
  {age: 16},
  {age: 32}
];

*!*
// user보다 나이가 적은 user를 찾음
let youngerUsers = users.filter(user.younger, user);
*/!*

alert(youngerUsers.length); // 2
```

객체의 메서드인 `user.younger`를 필터처럼 사용하고, `user`를 비교 기준으로 삼은 것을 확인할 수 있습니다. `user`를 인수로 써주지 않았다면, `users.filter(user.younger)`에서 `user.younger`는 독립된 콜백 함수로 호출됐을 겁니다. 이렇게 되면, `this=undefined`가 되어 에러가 발생합니다.

## 요약

<<<<<<< HEAD
지금까지 살펴본 배열 메서드를 요약해보도록 합시다.
=======
A cheat sheet of array methods:
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3

- 요소를 더하거나 지우기
  - `push(...items)` -- 배열 끝에 요소 넣기
  - `pop()` -- 배열 끝 요소 추출하기
  - `shift()` -- 첫 요소 추출하기
  - `unshift(...items)` -- 배열의 처음에 요소 추가하기
  - `splice(pos, deleteCount, ...items)` -- `pos` 인덱스(위치)부터 `deleteCount`개의 요소를 지우고, `items` 추가하기
  - `slice(start, end)` -- 배열의 `start`부터 `end` 바로 앞 인덱스까지의 요소를 복사해, 새로운 배열을 만듦
  - `concat(...items)` --  현재 배열의 모든 요소를 복사하고, 여기에 `items`를 추가해 새로운 배열을 만든 후, 이를 반환함. `items`가 배열이면, 이 배열의 인수를 기존 배열에 더해줌

- 원하는 요소 찾기
  - `indexOf/lastIndexOf(item, pos)` -- `pos`부터 시작해 원하는 `item`을 찾음. 찾게 되면 해당 요소의 인덱스를, 아니면 `-1`을 반환함
  - `includes(value)` -- 배열에 `value`가 있으면 `true`를, 그렇지 않으면 `false`를 반환함
  - `find/filter(func)` -- 함수를 조건 기준으로 삼고, 조건을 `true`로 만드는 첫 번째/전체 요소를 반환함
  - `findIndex`는 `find`와 유사함. 다만, 요소 대신 인덱스를 반환함
  
- 배열 전체 순회하기
  - `forEach(func)` -- 모든 요소에 `func`을 호출하고, 결과를 반환하지 않음

- 배열 변형하기
  - `map(func)` -- 모든 요소에 `func`을 호출하고, 반환된 결과를 가지고 새로운 배열을 만듦
  - `sort(func)` -- 배열을 정렬하고, 정렬된 배열을 반환함
  - `reverse()` -- 배열을 뒤집어 반환함
  - `split/join` -- 문자열을 배열로, 배열을 문자열로 변환함
  - `reduce(func, initial)` -- 요소를 차례로 돌면서 `func`을 호출하고, 반환값을 다음 함수 호출 시 전달함. 최종적으로 하나의 값이 도출됨 

- 기타
  - `Array.isArray(arr)` -- `arr`이 배열인지 여부를 확인함

`sort`, `reverse`, `splice`는 기존 배열을 변형시킨다는 점에 주의하시기 바랍니다.

지금까지 배운 메서드는 가장 많이 쓰이는 메서드이고, 메서드 유스 케이스의 99%에 적용할 수 있습니다. 하지만 이 외에 몇 가지 추가적인 메서드가 있습니다.

- [arr.some(fn)](mdn:js/Array/some)/[arr.every(fn)](mdn:js/Array/every)는 배열을 확인합니다.

  두 메서드는 `map`과 유사하게 배열 안 모든 요소에 콜백을 호출합니다. 콜백의 특정/모든 반환값이 `true`이면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.  

- [arr.fill(value, start, end)](mdn:js/Array/fill) 인덱스 `start`부터 `end`까지 `value`를 채워 넣습니다.

- [arr.copyWithin(target, start, end)](mdn:js/Array/copyWithin) -- 인덱스 `start`부터 `end`까지 요소를 복사하고, 그 요소를 `target` 위치에 붙여넣습니다. 기존 요소가 있다면 덮어씌워 집니다.

배열에 관한 모든 메서드는 [manual](mdn:js/Array)에서 찾아볼 수 있습니다.

처음엔 메서드 종류가 너무 많아서 외우기 힘들 수 있습니다. 하지만 보기보다 쉬우니 너무 걱정하지 않으셨으면 좋겠습니다.

<<<<<<< HEAD
요약본을 참고해 이런 메서드가 있다는 정도만 알아두세요. 아래 과제를 풀면서 충분히 연습하다 보면 배열 메서드에 대한 경험치가 쌓일 겁니다.

나중에 배열을 이용해 뭔가를 해야 하는데 어떻게 해야 할지 생각이 떠오르지 않으면 이곳으로 돌아와 요약본을 다시 보고 상황에 맞는 메서드를 찾으면 됩니다. 메서드에 딸린 예시들이 실제 코드 작성시 도움이 될 겁니다. 이런 과정을 반복하다 보면 특별한 노력 없이도 메서드가 저절로 외워질 겁니다.
=======
Look through the cheat sheet just to be aware of them. Then solve the tasks of this chapter to practice, so that you have experience with array methods.

Afterwards whenever you need to do something with an array, and you don't know how -- come here, look at the cheat sheet and find the right method. Examples will help you to write it correctly. Soon you'll automatically remember the methods, without specific efforts from your side.
>>>>>>> 4a8d8987dfc3256045e6b4a3bd8810ad3b25d1b3
