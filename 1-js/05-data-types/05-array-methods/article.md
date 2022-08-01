# 배열과 메서드

배열은 다양한 메서드를 제공합니다. 학습 편의를 위해 본 챕터에선 배열 메서드를 몇 개의 그룹으로 나눠 소개하도록 하겠습니다.

## 요소 추가·제거 메서드

배열의 맨 앞이나 끝에 요소(item)를 추가하거나 제거하는 메서드는 이미 학습한 바 있습니다.

- `arr.push(...items)` -- 맨 끝에 요소 추가
- `arr.pop()` -- 맨 끝 요소 제거
- `arr.shift()` -- 맨 앞 요소 제거
- `arr.unshift(...items)` -- 맨 앞에 요소 추가

이 외에 요소 추가와 제거에 관련된 메서드를 알아봅시다.

### splice

배열에서 요소를 하나만 지우고 싶다면 어떻게 해야 할까요?

배열 역시 객체형에 속하므로 프로퍼티를 지울 때 쓰는 연산자 `delete`를 사용해 볼 수 있을 겁니다.

```js run
let arr = ["I", "go", "home"];

delete arr[1]; // "go"를 삭제합니다.

alert( arr[1] ); // undefined

// delete를 써서 요소를 지우고 난 후 배열 --> arr = ["I",  , "home"]; 
alert( arr.length ); // 3
```

원하는 대로 요소를 지웠지만 배열의 요소는 여전히 세 개이네요. `arr.length == 3`을 통해 이를 확인할 수 있습니다.

이는 자연스러운 결과입니다. `delete obj.key`는 `key`를 이용해 해당 키에 상응하는 값을 지우기 때문이죠. `delete` 메서드는 제 역할을 다 한 것입니다. 그런데 우리는 삭제된 요소가 만든 빈 공간을 나머지 요소들이 자동으로 채울 것이라 기대하며 이 메서드를 썼습니다. 배열의 길이가 더 짧아지길 기대하며 말이죠. 

이런 기대를 충족하려면 특별한 메서드를 사용해야 합니다.

[arr.splice(start)](mdn:js/Array/splice)는 만능 스위스 맥가이버 칼 같은 메서드입니다. 요소를 자유자재로 다룰 수 있게 해주죠. 이 메서드를 사용하면 요소 추가, 삭제, 교체가 모두 가능합니다.

문법은 다음과 같습니다.

```js
arr.splice(index[, deleteCount, elem1, ..., elemN])
```

첫 번째 매개변수는 조작을 가할 첫 번째 요소를 가리키는 `인덱스(index)`입니다. 두 번째 매개변수는 `deleteCount`로, 제거하고자 하는 요소의 개수를 나타냅니다. `elem1, ..., elemN`은 배열에 추가할 요소를 나타냅니다.

splice 메서드를 사용해 작성된 예시 몇 가지를 보여드리겠습니다.

먼저 요소 삭제에 관한 예시부터 살펴보겠습니다.

```js run
let arr = ["I", "study", "JavaScript"];

*!*
arr.splice(1, 1); // 인덱스 1부터 요소 한 개를 제거
*/!*

alert( arr ); // ["I", "JavaScript"]
```

쉽죠? 인덱스 `1`이 가리키는 요소부터 시작해 요소 한 개(`1`)를 지웠습니다.

다음 예시에선 요소 세 개(3)를 지우고, 그 자리를 다른 요소 두 개로 교체해 보도록 하겠습니다.

```js run
let arr = [*!*"I", "study", "JavaScript",*/!* "right", "now"];

// 처음(0) 세 개(3)의 요소를 지우고, 이 자리를 다른 요소로 대체합니다.
arr.splice(0, 3, "Let's", "dance");

alert( arr ) // now [*!*"Let's", "dance"*/!*, "right", "now"]
```

`splice`는 삭제된 요소로 구성된 배열을 반환합니다. 아래 예시를 통해 확인해 봅시다. 

```js run
let arr = [*!*"I", "study",*/!* "JavaScript", "right", "now"];

// 처음 두 개의 요소를 삭제함
let removed = arr.splice(0, 2);

alert( removed ); // "I", "study" <-- 삭제된 요소로 구성된 배열
```

`splice` 메서드의 `deleteCount`를 `0`으로 설정하면 요소를 제거하지 않으면서 새로운 요소를 추가할 수 있습니다.

```js run
let arr = ["I", "study", "JavaScript"];

// 인덱스 2부터
// 0개의 요소를 삭제합니다.
// 그 후, "complex"와 "language"를 추가합니다.
arr.splice(2, 0, "complex", "language");

alert( arr ); // "I", "study", "complex", "language", "JavaScript"
```

````smart header="음수 인덱스도 사용할 수 있습니다."
slice 메서드 뿐만 아니라 배열 관련 메서드엔 음수 인덱스를 사용할 수 있습니다. 이때 마이너스 부호 앞의 숫자는 배열 끝에서부터 센 요소 위치를 나타냅니다. 아래와 같이 말이죠.

```js run
let arr = [1, 2, 5];

// 인덱스 -1부터 (배열 끝에서부터 첫 번째 요소)
// 0개의 요소를 삭제하고
// 3과 4를 추가합니다.
arr.splice(-1, 0, 3, 4);

alert( arr ); // 1,2,3,4,5
```
````

### slice

[arr.slice](mdn:js/Array/slice)는 `arr.splice`와 유사해 보이지만 훨씬 간단합니다.

문법:

```js
arr.slice([start], [end])
```

이 메서드는 `"start"` 인덱스부터 (`"end"`를 제외한) `"end"`인덱스까지의 요소를 복사한 새로운 배열을 반환합니다. `start`와 `end`는 둘 다 음수일 수 있는데 이땐, 배열 끝에서부터의 요소 개수를 의미합니다.

`arr.slice`는 문자열 메서드인 `str.slice`와 유사하게 동작하는데 `arr.slice`는 서브 문자열(substring) 대신 서브 배열(subarray)을 반환한다는 점이 다릅니다.

예시:

```js run
let arr = ["t", "e", "s", "t"];

alert( arr.slice(1, 3) ); // e,s (인덱스가 1인 요소부터 인덱스가 3인 요소까지를 복사(인덱스가 3인 요소는 제외))

alert( arr.slice(-2) ); // s,t (인덱스가 -2인 요소부터 제일 끝 요소까지를 복사)
```

`arr.slice()`는 인수를 하나도 넘기지 않고 호출하여 `arr`의 복사본을 만들 수 있습니다. 이런 방식은 기존의 배열을 건드리지 않으면서 배열을 조작해 새로운 배열을 만들고자 할 때 자주 사용됩니다.

### concat

[arr.concat](mdn:js/Array/concat)은 기존 배열의 요소를 사용해 새로운 배열을 만들거나 기존 배열에 요소를 추가하고자 할 때 사용할 수 있습니다. 

문법은 다음과 같습니다.

```js
arr.concat(arg1, arg2...)
```

인수엔 배열이나 값이 올 수 있는데, 인수 개수엔 제한이 없습니다. 

메서드를 호출하면 `arr`에 속한 모든 요소와 `arg1`, `arg2` 등에 속한 모든 요소를 한데 모은 새로운 배열이 반환됩니다.

인수 `argN`가 배열일 경우 배열의 모든 요소가 복사됩니다. 그렇지 않은경우(단순 값인 경우)는 인수가 그대로 복사됩니다.

예시:

```js run
let arr = [1, 2];

// arr의 요소 모두와 [3,4]의 요소 모두를 한데 모은 새로운 배열이 만들어집니다.
alert( arr.concat([3, 4]) ); // 1,2,3,4

// arr의 요소 모두와 [3,4]의 요소 모두, [5,6]의 요소 모두를 모은 새로운 배열이 만들어집니다.
alert( arr.concat([3, 4], [5, 6]) ); // 1,2,3,4,5,6

// arr의 요소 모두와 [3,4]의 요소 모두, 5와 6을 한데 모은 새로운 배열이 만들어집니다.
alert( arr.concat([3, 4], 5, 6) ); // 1,2,3,4,5,6
```

`concat` 메서드는 제공받은 배열의 요소를 복사해 활용합니다. 객체가 인자로 넘어오면 (배열처럼 보이는 유사 배열 객체이더라도) 객체는 분해되지 않고 통으로 복사되어 더해집니다.  

```js run
let arr = [1, 2];

let arrayLike = {
  0: "something",
  length: 1
};

alert( arr.concat(arrayLike) ); // 1,2,[object Object]
```

그런데 인자로 받은 유사 배열 객체에 특수한 프로퍼티 `Symbol.isConcatSpreadable`이 있으면 `concat`은 이 객체를 배열처럼 취급합니다. 따라서 객체 전체가 아닌 객체 프로퍼티의 값이 더해집니다.

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

## forEach로 반복작업 하기

[arr.forEach](mdn:js/Array/forEach)는 주어진 함수를 배열 요소 각각에 대해 실행할 수 있게 해줍니다.

문법:
```js
arr.forEach(function(item, index, array) {
  // 요소에 무언가를 할 수 있습니다.
});
```

아래는 요소 모두를 얼럿창을 통해 출력해주는 코드입니다.

```js run
// for each element call alert
["Bilbo", "Gandalf", "Nazgul"].forEach(alert);
```

아래는 인덱스 정보까지 더해서 출력해주는 좀 더 정교한 코드입니다.

```js run
["Bilbo", "Gandalf", "Nazgul"].forEach((item, index, array) => {
  alert(`${item} is at index ${index} in ${array}`);
});
```

참고로, 인수로 넘겨준 함수의 반환값은 무시됩니다.


## 배열 탐색하기

배열 내에서 무언가를 찾고 싶을 때 쓰는 메서드에 대해 알아봅시다.

### indexOf, lastIndexOf와 includes

[arr.indexOf](mdn:js/Array/indexOf)와 [arr.lastIndexOf](mdn:js/Array/lastIndexOf), [arr.includes](mdn:js/Array/includes)는 같은 이름을 가진 문자열 메서드와 문법이 동일합니다. 물론 하는 일도 같습니다. 연산 대상이 문자열이 아닌 배열의 요소라는 점만 다릅니다.

- `arr.indexOf(item, from)`는 인덱스 `from`부터 시작해 `item(요소)`을 찾습니다. 요소를 발견하면 해당 요소의 인덱스를 반환하고, 발견하지 못했으면 `-1`을 반환합니다.
- `arr.lastIndexOf(item, from)`는 위 메서드와 동일한 기능을 하는데, 검색을 끝에서부터 시작한다는 점만 다릅니다.
- `arr.includes(item, from)`는 인덱스 `from`부터 시작해 `item`이 있는지를 검색하는데, 해당하는 요소를 발견하면 `true`를 반환합니다.

예시:

```js run
let arr = [1, 0, false];

alert( arr.indexOf(0) ); // 1
alert( arr.indexOf(false) ); // 2
alert( arr.indexOf(null) ); // -1

alert( arr.includes(1) ); // true
```

위 메서드들은 요소를 찾을 때 완전 항등 연산자 `===` 을 사용한다는 점에 유의하시기 바랍니다. 보시는 바와 같이 `false`를 검색하면 정확히 `false`만을 검색하지, 0을 검색하진 않습니다.

요소의 위치를 정확히 알고 싶은게 아니고 요소가 배열 내 존재하는지 여부만 확인하고 싶다면 `arr.includes`를 사용하는 게 좋습니다.

`includes`는 `NaN`도 제대로 처리한다는 점에서 `indexOf/lastIndexOf`와 약간의 차이가 있습니다.

```js run
const arr = [NaN];
alert( arr.indexOf(NaN) ); // -1 (완전 항등 비교 === 는 NaN엔 동작하지 않으므로 0이 출력되지 않습니다.)
alert( arr.includes(NaN) );// true (NaN의 여부를 확인하였습니다.)
```

### find와 findIndex

객체로 이루어진 배열이 있다고 가정해 봅시다. 특정 조건에 부합하는 객체를 배열 내에서 어떻게 찾을 수 있을까요?

이럴 때 [arr.find(fn)](mdn:js/Array/find)을 사용할 수 있습니다.

문법:
```js
let result = arr.find(function(item, index, array) {
  // true가 반환되면 반복이 멈추고 해당 요소를 반환합니다.
  // 조건에 해당하는 요소가 없으면 undefined를 반환합니다.
});
```

요소 전체를 대상으로 함수가 순차적으로 호출됩니다.

- `item` -- 함수를 호출할 요소
- `index` -- 요소의 인덱스
- `array` -- 배열 자기 자신

함수가 참을 반환하면 탐색은 중단되고 해당 `요소`가 반환됩니다. 원하는 요소를 찾지 못했으면 `undefined`가 반환됩니다.

`id`와 `name` 프로퍼티를 가진 사용자 객체로 구성된 배열을 예로 들어보겠습니다. 배열 내에서 `id == 1` 조건을 충족하는 사용자 객체를 찾아봅시다.

```js run
let users = [
  {id: 1, name: "John"},
  {id: 2, name: "Pete"},
  {id: 3, name: "Mary"}
];

let user = users.find(item => item.id == 1);

alert(user.name); // John
```

실무에서 객체로 구성된 배열을 다뤄야 할 일이 잦기 때문에 `find` 메서드 활용법을 알아두면 좋습니다.

그런데 위 예시에서 `find` 안의 함수가 인자를 하나만 가지고 있다는 점에 주목해주시기 바랍니다(`item => item.id == 1`). 이런 패턴이 가장 많이 사용되는 편입니다. 다른 인자들(`index`, `array`)은 잘 사용되지 않습니다.

[arr.findIndex](mdn:js/Array/findIndex)는 `find`와 동일한 일을 하나, 조건에 맞는 요소를 반환하는 대신 해당 요소의 인덱스를 반환한다는 점이 다릅니다. 조건에 맞는 요소가 없으면 `-1`이 반환됩니다. 

### filter

`find` 메서드는 함수의 반환 값을 `true`로 만드는 단 하나의 요소를 찾습니다.

조건을 충족하는 요소가 여러 개라면 [arr.filter(fn)](mdn:js/Array/filter)를 사용하면 됩니다.

`filter`는 `find`와 문법이 유사하지만, 조건에 맞는 요소 전체를 담은 배열을 반환한다는 점에서 차이가 있습니다.


```js
let results = arr.filter(function(item, index, array) {
  // 조건을 충족하는 요소는 results에 순차적으로 더해집니다.
  // 조건을 충족하는 요소가 하나도 없으면 빈 배열이 반환됩니다.
});
```

예시:

```js run
let users = [
  {id: 1, name: "John"},
  {id: 2, name: "Pete"},
  {id: 3, name: "Mary"}
];

// 앞쪽 사용자 두 명을 반환합니다.
let someUsers = users.filter(item => item.id < 3);

alert(someUsers.length); // 2
```

## 배열을 변형하는 메서드

배열을 변형시키거나 요소를 재 정렬해주는 메서드에 대해 알아봅시다.

### map

[arr.map](mdn:js/Array/map)은 유용성과 사용 빈도가 아주 높은 메서드 중 하나입니다.

`map`은 배열 요소 전체를 대상으로 함수를 호출하고, 함수 호출 결과를 배열로 반환해줍니다.

문법:

```js
let result = arr.map(function(item, index, array) {
  // 요소 대신 새로운 값을 반환합니다.
});
```

아래 예시에선 각 요소(문자열)의 길이를 출력해줍니다.

```js run
let lengths = ["Bilbo", "Gandalf", "Nazgul"].map(item => item.length);
alert(lengths); // 5,7,6
```

### sort(fn)

[arr.sort()](mdn:js/Array/sort)는 배열의 요소를 정렬해줍니다. 배열 *자체*가 변경됩니다. 

메서드를 호출하면 재정렬 된 배열이 반환되는데, 이미 `arr` 자체가 수정되었기 때문에 반환 값은 잘 사용되지 않는 편입니다.

예시:

```js run
let arr = [ 1, 2, 15 ];

// arr 내부가 재 정렬됩니다.
arr.sort();

alert( arr );  // *!*1, 15, 2*/!*
```

엇! 뭔가 이상하네요.

재정렬 후 배열 요소가 `1, 15, 2`가 되었습니다. 기대하던 결과(`1, 2, 15`)와는 다르네요. 왜 이런 결과가 나왔을까요?

**요소는 문자열로 취급되어 재 정렬되기 때문입니다.**

모든 요소는 문자형으로 변환된 이후에 재 정렬됩니다. 앞서 배웠듯이 문자열 비교는 사전편집 순으로 진행되기 때문에 2는 15보다 큰 값으로 취급됩니다(`"2" > "15"`).

기본 정렬 기준 대신 새로운 정렬 기준을 만들려면 `arr.sort()`에 새로운 함수를 넘겨줘야 합니다.

인수로 넘겨주는 함수는 반드시 값 두 개를 비교해야 하고 반환 값도 있어야 합니다.
```js
function compare(a, b) {
  if (a > b) return 1; // 첫 번째 값이 두 번째 값보다 큰 경우
  if (a == b) return 0; // 두 값이 같은 경우
  if (a < b) return -1; //  첫 번째 값이 두 번째 값보다 작은 경우
}
```

이제 배열 요소를 숫자 오름차순 기준으로 정렬해봅시다.

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

이제 기대했던 대로 요소가 정렬되었습니다.

여기서 잠시 멈춰 위 예시에서 어떤 일이 일어났는지 생각해 봅시다. 사실 `arr`엔 숫자, 문자열, 객체 등이 들어갈 수 있습니다. 알 수 없는 *무언가*로 구성된 집합이 되는 거죠. 이제 이 비 동질적인 집합을 정렬해야 한다고 가정해봅시다. 무언가를 정렬하려면 기준이 필요하겠죠? 이때 *정렬 기준을 정의해주는 함수(ordering function, 정렬 함수)* 가 필요합니다. `sort`에 정렬 함수를 인수로 넘겨주지 않으면 이 메서드는 사전편집 순으로 요소를 정렬합니다. 

`arr.sort(fn)`는 포괄적인 정렬 알고리즘을 이용해 구현되어있습니다. 대개 최적화된 [퀵 소트(quicksort)](https://en.wikipedia.org/wiki/Quicksort)를 사용하는데, `arr.sort(fn)`는 주어진 함수를 사용해 정렬 기준을 만들고 이 기준에 따라 요소들을 재배열하므로 개발자는 내부 정렬 동작 원리를 알 필요가 없습니다. 우리가 해야 할 일은 정렬 함수 `fn`을 만들고 이를 인수로 넘겨주는 것뿐입니다.

정렬 과정에서 어떤 요소끼리 비교가 일어났는지 확인하고 싶다면 아래 코드를 활용하시면 됩니다.

```js run
[1, -2, 15, 2, 0, 8].sort(function(a, b) {
  alert( a + " <> " + b );
  return a - b;
});
```

정렬 중에 한 요소가 특정 요소와 여러 번 비교되는 일이 생기곤 하는데 비교 횟수를 최소화 하려다 보면 이런 일이 발생할 수 있습니다.

````smart header="정렬 함수는 어떤 숫자든 반환할 수 있습니다."
정렬 함수의 반환 값엔 제약이 없습니다. 양수를 반환하는 경우 첫 번째 인수가 두 번째 인수보다 '크다'를 나타내고, 음수를 반환하는 경우 첫 번째 인수가 두 번째 인수보다 '작다'를 나타내기만 하면 됩니다.

이 점을 이용하면 정렬 함수를 더 간결하게 만들 수 있습니다.

```js run
let arr = [ 1, 2, 15 ];

arr.sort(function(a, b) { return a - b; });

alert(arr);  // *!*1, 2, 15*/!*
```
````

````smart header="화살표 함수를 사용합시다."
[화살표 함수](info:arrow-functions-basics)를 사용하면 정렬 함수를 더 깔끔하게 만들 수 있습니다. 

```js
arr.sort( (a, b) => a - b );
```

화살표 함수를 활용한 코드와 함수 선언문을 사용한 코드는 동일하게 작동합니다.
````

````smart header="문자열엔 `localeCompare`를 사용하세요."
[strings](info:string#correct-comparisons)에서 배운 비교 알고리즘이 기억나시나요? 이 알고리즘은 유니코드를 기준으로 글자를 비교합니다.

`Ö`같은 문자가 있는 언어에도 대응하려면 `str.localeCompare` 메서드를 사용해 문자열을 비교하는 게 좋습니다.

독일어로 나타낸 국가가 요소인 배열을 정렬해봅시다.

```js run
let countries = ['Österreich', 'Andorra', 'Vietnam'];

alert( countries.sort( (a, b) => a > b ? 1 : -1) ); // Andorra, Vietnam, Österreich (제대로 정렬이 되지 않았습니다.)

alert( countries.sort( (a, b) => a.localeCompare(b) ) ); // Andorra,Österreich,Vietnam (제대로 정렬되었네요!)
```
````

### reverse

[arr.reverse](mdn:js/Array/reverse)는 `arr`의 요소를 역순으로 정렬시켜주는 메서드입니다.

예시:

```js run
let arr = [1, 2, 3, 4, 5];
arr.reverse();

alert( arr ); // 5,4,3,2,1
```

반환 값은 재 정렬된 배열입니다.

### split과 join

메시지 전송 애플리케이션을 만들고 있다고 가정해 봅시다. 수신자가 여러 명일 경우, 발신자는 쉼표로 각 수신자를 구분할 겁니다. `John, Pete, Mary`같이 말이죠. 개발자는 긴 문자열 형태의 수신자 리스트를 배열 형태로 전환해 처리하고 싶을 겁니다. 입력받은 문자열을 어떻게 배열로 바꿀 수 있을까요?

[str.split(delim)](mdn:js/String/split)을 이용하면 우리가 원하는 것을 정확히 할 수 있습니다. 이 메서드는 구분자(delimiter) `delim`을 기준으로 문자열을 쪼개줍니다.

아래 예시에선 쉼표와 공백을 합친 문자열이 구분자로 사용되고 있습니다.

```js run
let names = 'Bilbo, Gandalf, Nazgul';

let arr = names.split(', ');

for (let name of arr) {
  alert( `${name}에게 보내는 메시지` ); // Bilbo에게 보내는 메시지
}
```

`split` 메서드는 두 번째 인수로 숫자를 받을 수 있습니다. 이 숫자는 배열의 길이를 제한해주므로 길이를 넘어서는 요소를 무시할 수 있습니다. 실무에서 자주 사용하는 기능은 아닙니다.

```js run
let arr = 'Bilbo, Gandalf, Nazgul, Saruman'.split(', ', 2);

alert(arr); // Bilbo, Gandalf
```

````smart header="문자열을 글자 단위로 분리하기"
`split(s)`의 `s`를 빈 문자열로 지정하면 문자열을 글자 단위로 분리할 수 있습니다.

```js run
let str = "test";

alert( str.split('') ); // t,e,s,t
```
````

[arr.join(glue)](mdn:js/Array/join)은 `split`과 반대 역할을 하는 메서드입니다. 인수 `glue`를 접착제처럼 사용해 배열 요소를 모두 합친 후 하나의 문자열을 만들어줍니다.

예시:

```js run
let arr = ['Bilbo', 'Gandalf', 'Nazgul'];

let str = arr.join(';'); // 배열 요소 모두를 ;를 사용해 하나의 문자열로 합칩니다.

alert( str ); // Bilbo;Gandalf;Nazgul
```

### reduce와 reduceRight

`forEach`, `for`, `for..of`를 사용하면 배열 내 요소를 대상으로 반복 작업을 할 수 있습니다.

각 요소를 돌면서 반복 작업을 수행하고, 작업 결과물을 새로운 배열 형태로 얻으려면 `map`을 사용하면 되죠.

[arr.reduce](mdn:js/Array/reduce)와 [arr.reduceRight](mdn:js/Array/reduceRight)도 이런 메서드들과 유사한 작업을 해줍니다. 그런데 사용법이 조금 복잡합니다. `reduce`와 `reduceRight`는 배열을 기반으로 값 하나를 도출할 때 사용됩니다.

문법:

```js
let value = arr.reduce(function(accumulator, item, index, array) {
  // ...
}, [initial]);
```

인수로 넘겨주는 함수는 배열의 모든 요소를 대상으로 차례차례 적용되는데, 적용 결과는 다음 함수 호출 시 사용됩니다.   

함수의 인수는 다음과 같습니다.

- `accumulator` -- 이전 함수 호출의 결과. `initial`은 함수 최초 호출 시 사용되는 초깃값을 나타냄(옵션)
- `item` -- 현재 배열 요소
- `index` -- 요소의 위치
- `array` -- 배열

이전 함수 호출 결과는 다음 함수를 호출할 때 첫 번째 인수(`previousValue`)로 사용됩니다.

첫 번째 인수는 앞서 호출했던 함수들의 결과가 누적되어 저장되는 '누산기(accumulator)'라고 생각하면 됩니다. 마지막 함수까지 호출되면 이 값은 `reduce`의 반환 값이 됩니다.

복잡해 보이긴 하지만 예제를 통해 메서드를 이해해 봅시다.

`reduce`를 이용해 코드 한 줄로 배열의 모든 요소를 더한 값을 구해보겠습니다.

```js run
let arr = [1, 2, 3, 4, 5];

let result = arr.reduce((sum, current) => sum + current, 0);

alert(result); // 15
```

`reduce`에 전달한 함수는 오직 인수 두 개만 받고 있습니다. 대개 이렇게 인수를 두 개만 받습니다.

이제 어떤 과정을 거쳐 위와 같은 결과가 나왔는지 자세히 살펴보겠습니다.

1. 함수 최초 호출 시, `reduce`의 마지막 인수인 `0(초깃값)`이 `sum`에 할당됩니다. `current`엔 배열의 첫 번째 요소인 `1`이 할당됩니다. 따라서 함수의 결과는 `1`이 됩니다.
2. 두 번째 호출 시, `sum = 1` 이고 여기에 배열의 두 번째 요소(`2`)가 더해지므로 결과는 `3`이 됩니다. 
3. 세 번째 호출 시, `sum = 3` 이고 여기에 배열의 다음 요소가 더해집니다. 이런 과정이 계속 이어집니다.

계산 흐름:

![](reduce.svg)

표를 이용해 설명하면 아래와 같습니다. 함수가 호출될 때마다 넘겨지는 인수와 연산 결과는 각 열에서 확인할 수 있습니다.

|   |`sum`|`current`|result|
|---|-----|---------|---------|
|첫 번째 호출|`0`|`1`|`1`|
|두 번째 호출|`1`|`2`|`3`|
|세 번째 호출|`3`|`3`|`6`|
|네 번째 호출|`6`|`4`|`10`|
|다섯번째 호출|`10`|`5`|`15`|

이제 이전 호출의 결과가 어떻게 다음 호출의 첫 번째 인수로 전달되는지 아셨죠?

한편, 아래와 같이 초깃값을 생략하는 것도 가능합니다.

```js run
let arr = [1, 2, 3, 4, 5];

// reduce에서 초깃값을 제거함(0이 없음)
let result = arr.reduce((sum, current) => sum + current);

alert( result ); // 15
```

초깃값을 없애도 결과는 동일하네요. 초깃값이 없으면 `reduce`는 배열의 첫 번째 요소를 초깃값으로 사용하고 두 번째 요소부터 함수를 호출하기 때문입니다.

위 표에서 첫 번째 호출에 관련된 줄만 없애면 초깃값 없이 계산한 위 예제의 계산 흐름이 됩니다.

하지만 이렇게 초깃값 없이 `reduce`를 사용할 땐 극도의 주의를 기울여야 합니다. 배열이 비어있는 상태면 `reduce` 호출 시 에러가 발생하기 때문입니다.

예시:

```js run
let arr = [];

// TypeError: Reduce of empty array with no initial value
// 초깃값을 설정해 주었다면 초깃값이 반환되었을 겁니다.
arr.reduce((sum, current) => sum + current);
```

이런 예외상황 때문에 항상 초깃값을 명시해 줄 것을 권장합니다.

[arr.reduceRight](mdn:js/Array/reduceRight)는 `reduce`와 동일한 기능을 하지만 배열의 오른쪽부터 연산을 수행한다는 점이 다른 메서드입니다.


## Array.isArray로 배열 여부 알아내기 

자바스크립트에서 배열은 독립된 자료형으로 취급되지 않고 객체형에 속합니다.

따라서 `typeof`로는 일반 객체와 배열을 구분할 수가 없죠.

```js run
alert(typeof {}); // object
alert(typeof []); // object
```

그런데 배열은 자주 사용되는 자료구조이기 때문에 배열인지 아닌지를 감별해내는 특별한 메서드가 있다면 아주 유용할 겁니다. [Array.isArray(value)](mdn:js/Array/isArray)는 이럴 때 사용할 수 있는 유용한 메서드입니다. `value`가 배열이라면 `true`를, 배열이 아니라면 `false`를 반환해주죠.

```js run
alert(Array.isArray({})); // false

alert(Array.isArray([])); // true
```

## 배열 메서드와 'thisArg'

함수를 호출하는 대부분의 배열 메서드(`find`, `filter`, `map` 등. `sort`는 제외)는 `thisArg`라는 매개변수를 옵션으로 받을 수 있습니다.

자주 사용되는 인수가 아니어서 지금까진 이 매개변수에 대해 언급하지 않았는데, 튜토리얼의 완성도를 위해 `thisArg`에 대해 잠시 언급하고 넘어가도록 하겠습니다.

`thisArg`는 아래와 같이 활용할 수 있습니다.

```js
arr.find(func, thisArg);
arr.filter(func, thisArg);
arr.map(func, thisArg);
// ...
// thisArg는 선택적으로 사용할 수 있는 마지막 인수입니다.
```

`thisArg`는 `func`의 `this`가 됩니다.

아래 예시에서 객체 `army`의 메서드를 `filter`의 인자로 넘겨주고 있는데, 이때 `thisArg`는 `canJoin`의 컨텍스트 정보를 넘겨줍니다.

```js run
let army = {
  minAge: 18,
  maxAge: 27,
  canJoin(user) {
    return user.age >= this.minAge && user.age < this.maxAge;
  }
};

let users = [
  {age: 16},
  {age: 20},
  {age: 23},
  {age: 30}
];

*!*
// army.canJoin 호출 시 참을 반환해주는 user를 찾음
let soldiers = users.filter(army.canJoin, army);
*/!*

alert(soldiers.length); // 2
alert(soldiers[0].age); // 20
alert(soldiers[1].age); // 23
```

`thisArgs`에 `army`를 지정하지 않고 단순히 `users.filter(army.canJoin)`를 사용했다면 `army.canJoin`은 단독 함수처럼 취급되고, 함수 본문 내 `this`는 `undefined`가 되어 에러가 발생했을 겁니다.   

`users.filter(user => army.canJoin(user))`를 사용하면 `users.filter(army.canJoin, army)`를 대체할 수 있긴 한데 `thisArg`를 사용하는 방식이 좀 더 이해하기 쉬우므로 더 자주 사용됩니다.

## 요약

지금까지 살펴본 배열 메서드를 요약해보도록 합시다.

- 요소를 더하거나 지우기
  - `push(...items)` -- 맨 끝에 요소 추가하기
  - `pop()` -- 맨 끝 요소 추출하기
  - `shift()` -- 첫 요소 추출하기
  - `unshift(...items)` -- 맨 앞에 요소 추가하기
  - `splice(pos, deleteCount, ...items)` -- `pos`부터 `deleteCount`개의 요소를 지우고, `items` 추가하기
  - `slice(start, end)` -- `start`부터 `end` 바로 앞까지의 요소를 복사해 새로운 배열을 만듦
  - `concat(...items)` -- 배열의 모든 요소를 복사하고 `items`를 추가해 새로운 배열을 만든 후 이를 반환함. `items`가 배열이면 이 배열의 인수를 기존 배열에 더해줌

- 원하는 요소 찾기
  - `indexOf/lastIndexOf(item, pos)` -- `pos`부터 원하는 `item`을 찾음. 찾게 되면 해당 요소의 인덱스를, 아니면 `-1`을 반환함
  - `includes(value)` -- 배열에 `value`가 있으면 `true`를, 그렇지 않으면 `false`를 반환함
  - `find/filter(func)` -- `func`의 반환 값을 `true`로 만드는 첫 번째/전체 요소를 반환함
  - `findIndex`는 `find`와 유사함. 다만 요소 대신 인덱스를 반환함

- 배열 전체 순회하기
  - `forEach(func)` -- 모든 요소에 `func`을 호출함. 결과는 반환되지 않음

- 배열 변형하기
  - `map(func)` -- 모든 요소에 `func`을 호출하고, 반환된 결과를 가지고 새로운 배열을 만듦
  - `sort(func)` -- 배열을 정렬하고 정렬된 배열을 반환함
  - `reverse()` -- 배열을 뒤집어 반환함
  - `split/join` -- 문자열을 배열로, 배열을 문자열로 변환함
  - `reduce(func, initial)` -- 요소를 차례로 돌면서 `func`을 호출함. 반환값은 다음 함수 호출에 전달함. 최종적으로 하나의 값이 도출됨 

- 기타
  - `Array.isArray(arr)` -- `arr`이 배열인지 여부를 판단함

`sort`, `reverse`, `splice`는 기존 배열을 변형시킨다는 점에 주의하시기 바랍니다.

지금까지 배운 메서드만으로 배열과 관련된 작업 99%를 해결할 수 있습니다. 이 외의 배열 메서드도 있긴 한데 잠시 언급하고 넘어가겠습니다.

- [arr.some(fn)](mdn:js/Array/some)과 [arr.every(fn)](mdn:js/Array/every)는 배열을 확인합니다.

  두 메서드는 `map`과 유사하게 모든 요소를 대상으로 함수를 호출합니다. `some`은 함수의 반환 값을 `true`로 만드는 요소가 하나라도 있는지 여부를 확인하고 `every`는 모든 요소가 함수의 반환 값을 `true`로 만드는지 여부를 확인합니다. 두 메서드 모두 조건을 충족하면 `true`를, 그렇지 않으면 `false`를 반환합니다.

- [arr.fill(value, start, end)](mdn:js/Array/fill)은 `start`부터 `end`까지 `value`를 채워 넣습니다.

- [arr.copyWithin(target, start, end)](mdn:js/Array/copyWithin)은 `start`부터 `end`까지 요소를 복사하고, 복사한 요소를 `target`에 붙여넣습니다. 기존 요소가 있다면 덮어씁니다.

배열에 관한 모든 메서드는 [manual](mdn:js/Array)에서 찾아볼 수 있습니다.

배워야 할 메서드 종류가 너무 많아서 이걸 다 외워야 하나라는 생각이 들 수 있는데, 생각보다 쉬우니 너무 걱정하지 않으셨으면 좋겠습니다.

일단은 요약본을 참고해 자주 사용하는 메서드가 무엇인지 정도만 알아두어도 괜찮습니다. 아래 과제를 풀면서 충분히 연습하다 보면 배열 메서드에 대한 경험치가 쌓일 겁니다.

나중에 배열을 이용해 뭔가를 해야 하는데 방법이 떠오르지 않을 때 이곳으로 돌아와 요약본을 다시 보고 상황에 맞는 메서드를 찾으면 됩니다. 설명에 딸린 예시들이 실제 코드 작성 시 도움이 될 겁니다. 이런 과정을 반복하다 보면 특별한 노력 없이도 메서드를 저절로 외울 수 있습니다.
