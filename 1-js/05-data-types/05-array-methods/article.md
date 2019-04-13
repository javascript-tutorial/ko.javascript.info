# 배열 메서드

배열은 다양한 메서드를 제공합니다. 학습의 편의를 위해, 본 챕터에선 배열 메서드를 크게 두 그룹으로 나누어 소개하도록 하겠습니다.

## 요소를 추가/제거하는 메서드

배열의 처음이나 끝에 요소를 추가하거나 제거하는 메서드는 이미 학습한 바 있습니다: 

- `arr.push(...items)` -- 배열의 끝에 요소를 추가,
- `arr.pop()` -- 배열의 끝 요소를 제거,
- `arr.shift()` -- 배열의 처음 요소를 제거,
- `arr.unshift(...items)` -- 배열의 처음에 요소를 추가.

이 외에도 요소를 추가/제거하는 다른 메서드가 있습니다.

### splice

배열에서 요소 하나를 지우고 싶다면 어떻게 해야할까요?

배열 역시 객체이므로, `delete`를 사용해 볼 수 있을것입니다:

```js run
let arr = ["I", "go", "home"];

delete arr[1]; // remove "go"

alert( arr[1] ); // undefined

// now arr = ["I",  , "home"];
alert( arr.length ); // 3
```

원하는대로 요소를 지우긴 했지만, 배열은 여전히 3개의 요소를 가지고 있네요. `arr.length == 3`을 통해 이를 확인할 수 있습니다.

이는 자연스러운 현상입니다. `delete obj.key`는 `key`를 이용해 값을 지우기 때문입니다. 객체를 다룰 땐 이렇게 값만 삭제되도 괜찮습니다. 하지만 배열을 다룰 땐, 나머지 요소들이 이동해 빈 공간을 채우길 기대하며 이 메서드를 썼을겁니다. 지워진 요소만큼 배열의 길이가 더 짧아지길 기대하며 말이죠. 

따라서 요소엔 특별한 메서드를 사용해야 합니다.

[arr.splice(str)](mdn:js/Array/splice)메서드는 만능 스위스 맥가이버 칼 처럼 요소를 자유자재로 다룰 수 있게 해줍니다. 이 메서드로 요소 추가, 삭제, 삽입이 모두 가능합니다.

문법은 다음과 같습니다.

```js
arr.splice(index[, deleteCount, elem1, ..., elemN])
```

첫 번째 매개변수는 수정을 시작할 `인덱스(index)`입니다. 그다음 매개변수는 `deleteCount`로, 제거할 요소의 갯수를 나타냅니다. `elem1, ..., elemN`은 배열에 추가 될 요소입니다.

다양한 예제를 통해 splice 메서드를 이해해 보도록 하겠습니다.

먼저 요소 삭제에 관한 예제부터 살펴보도록 하겠습니다.

```js run
let arr = ["I", "study", "JavaScript"];

*!*
arr.splice(1, 1); // 인덱스 1 부터 요소 한개(1)를 제거합니다.
*/!*

alert( arr ); // ["I", "JavaScript"]
```

쉽죠? 인덱스 `1`부터 시작해 `1`개의 요소를 지웠습니다.

다음 코드에선 요소 세개를 지우고, 그 자리를 다른 두개의 요소로 교체해 보도록 하겠습니다.

```js run
let arr = [*!*"I", "study", "JavaScript",*/!* "right", "now"];

// 처음 3개의 요소를 지우고, 이 자리를 다른 요소로 대체합니다
arr.splice(0, 3, "Let's", "dance");

alert( arr ) // now [*!*"Let's", "dance"*/!*, "right", "now"]
```

아래 코드를 통해 `splice` 메서드는 삭제된 요소로 구성된 배열을 반환한다는 것을 확인할 수 있습니다.

```js run
let arr = [*!*"I", "study",*/!* "JavaScript", "right", "now"];

// remove 2 first elements
let removed = arr.splice(0, 2);

alert( removed ); // "I", "study" <-- 삭제된 요소로 구성된 배열
```

요소를 제거하지 않으면서 추가할 수도 있습니다. `deleteCount`를 `0`으로 설정하기만 하면 됩니다.

```js run
let arr = ["I", "study", "JavaScript"];

// 인덱스 2 부터
// 0개의 요소를 삭제합니다.
// 그 후, "complex" 와 "language"를 추가합니다.
arr.splice(2, 0, "complex", "language");

alert( arr ); // "I", "study", "complex", "language", "JavaScript"
```

````smart header="음수 인덱스도 사용 가능합니다"
slice메서드와 다른 배열 관련 메서드에 음수 인덱스를 사용할 수 있습니다. 이때 음수 인덱스는 배열 끝에서부터 센 요소의 위치를 나타냅니다. 아래와 같이 말이죠.

```js run
let arr = [1, 2, 5];

// 인덱스 -1 부터 (배열 끝에서부터 첫번째 위치)
// 0 개의 요소를 삭제하고,
// 3 과 4를 추가해줍니다.
arr.splice(-1, 0, 3, 4);

alert( arr ); // 1,2,3,4,5
```
````

### slice

[arr.slice](mdn:js/Array/slice)메서드는 `arr.splice`와 비슷해보이지만, 훨씬 간단한 메서드입니다.

문법:

```js
arr.slice(start, end)
```

이 메서드는 `"start"` 인덱스부터 (`"end"`를 제외한) `"end"`인덱스 까지의 요소를 포함하는 메서드를 반환합니다. `start` 와 `end` 인덱스는 둘 다 음수일수도 있습니다. 인덱스가 음수일 땐 배열의 끝에서부터의 요소 갯수를 의미합니다.

문자열 메서드인 `str.slice`와 유사하게 동작하지만, 배열의 `arr.slice`메서드는 서브 문자열(substring) 대신 서브 배열(subarray)를 반환한다는 점이 다릅니다.

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

인수의 갯수는 제한이 없고, 인수로 배열이나 값을 받을 수 있습니다.

위 코드의 결과는 `arr`의 모든 요소와 `arg1`, `arg2` 등을 포함하는 배열입니다. 

인수가 배열이거나, 인수의 프로퍼티가 `Symbol.isConcatSpreadable`라면, 인수로 받은 배열의 모든 요소를 복사합니다. 이 경우 외에는 인수 자체를 복사합니다.

예제를 통해 알아봅시다.

```js run
let arr = [1, 2];

// 배열 arr을 배열 [3,4]와 병합함
alert( arr.concat([3, 4])); // 1,2,3,4

// 배열 arr을 배열 [3,4]와 배열 [5,6]과 병합함
alert( arr.concat([3, 4], [5, 6])); // 1,2,3,4,5,6

// 배열 arr을 배열 [3,4]와 병합하고, 값 5 와 6을 추가함
alert( arr.concat([3, 4], 5, 6)); // 1,2,3,4,5,6
```

일반적으로, concat 메서드는 제공받은 배열의 요소를 ("분해"해서) 복사합니다. 유사 배열 객체라 하더라도 본질은 객체이므로, 객체가 통으로 복사되어 더해집니다. 

```js run
let arr = [1, 2];

let arrayLike = {
  0: "something",
  length: 1
};

alert( arr.concat(arrayLike) ); // 1,2,[object Object]
//[1, 2, arrayLike]
```

하지만 유사배열 객체에 `Symbol.isConcatSpreadable` 프로퍼티가 있는 경우는, 분해된 객체의 요소가 더해집니다.

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

문법:
```js
arr.forEach(function(item, index, array) {
  // ... item에 무언갈 할 수 있습니다
});
```

아래는 배열의 각 요소를 보여주는 코드입니다.

```js run
// for each element call alert
["Bilbo", "Gandalf", "Nazgul"].forEach(alert);
```

아래는 index와 타깃 배열까지 출력해주는 좀 더 정교한 코드입니다.

```js run
["Bilbo", "Gandalf", "Nazgul"].forEach((item, index, array) => {
  alert(`${item} is at index ${index} in ${array}`);
});
```

함수의 반환값은 (반환값을 어떻게 명시해 줬던 간에) 무시됩니다. 결국 forEach 메서드의 반환값은 undefined이 됩니다.


## 배열 탐색하기

배열 내에서 뭔가를 찾을 때 쓰이는 메서드가 있습니다. 
These are methods to search for something in an array.

### indexOf/lastIndexOf and includes

배열의 [arr.indexOf](mdn:js/Array/indexOf), [arr.lastIndexOf](mdn:js/Array/lastIndexOf), [arr.includes](mdn:js/Array/includes) 메서드는 대응하는 문자열의 메서드와 동일한 문법을 사용하고, 하는일도 본질적으로 같지만, 연산 대상이 문자열이 아닌 배열의 요소라는 점만 다릅니다.
The methods [arr.indexOf](mdn:js/Array/indexOf), [arr.lastIndexOf](mdn:js/Array/lastIndexOf) and [arr.includes](mdn:js/Array/includes) have the same syntax and do essentially the same as their string counterparts, but operate on items instead of characters:

- `arr.indexOf(item, from)`는 인덱스 `from`부터 시작해 해당하는 `item`을 검색합니다. 일치하는 요소를 찾으면, 해당하는 요소의 인덱스를 반환하고, 찾지 못하면 `-1`을 반환합니다.
- `arr.indexOf(item, from)` looks for `item` starting from index `from`, and returns the index where it was found, otherwise `-1`.
- `arr.lastIndexOf(item, from)`는 위 메서드와 동일한 기능을 하는 메서드이나, 검색을 끝에서 부터 시작한다는 점만 다릅니다.
- `arr.lastIndexOf(item, from)` -- same, but looks from right to left.
- `arr.includes(item, from)`는 인덱스 `from`부터 시작해 배열에서 해당하는 `item`이 있는지를 검색하는데, 해당하는 요소를 발견하면 `true` 를 반환합니다.
- `arr.includes(item, from)` -- looks for `item` starting from index `from`, returns `true` if found.

예시 코드를 살펴보겠습니다.

```js run
let arr = [1, 0, false];

alert( arr.indexOf(0) ); // 1
alert( arr.indexOf(false) ); // 2
alert( arr.indexOf(null) ); // -1

alert( arr.includes(1) ); // true
```
위 메서드들은 요소를 찾을 때 완전 항등 연산자인 `===` 를 사용한다는 점에 유의하시기 바랍니다. 보시는 바와 같이 `false`를 검색하면 정확히 `false`만을 검색하지, 0을 검색하진 않습니다.
Note that the methods use `===` comparison. So, if we look for `false`, it finds exactly `false` and not the zero.

정확히 어떤 인덱스에 요소가 있는지는 알고 싶지 않고, 배열의 존재 여부만 확인하고 싶다면 `arr.includes`를 사용하는게 좋습니다.
If we want to check for inclusion, and don't want to know the exact index, then `arr.includes` is preferred.

또한, `includes` 메서드는 `NaN`도 찾아낼 수 있다는 점에서 `indexOf/lastIndexOf`메서드와 약간의 차이가 있습니다.
Also, a very minor difference of `includes` is that it correctly handles `NaN`, unlike `indexOf/lastIndexOf`:

```js run
const arr = [NaN];
alert( arr.indexOf(NaN) ); // -1 (0이 출력되길 기대하지만, 완전 항등 비교 === 는 NaN엔 작동하지 않습니다.)
alert( arr.includes(NaN) );// true (correct)
```

### find 와 findIndex

객체로 이루어진 배열이 있다고 가정해 봅시다. 특정 조건을 가진 객체를 배열 내에서 어떻게 찾아낼 수 있을까요?
Imagine we have an array of objects. How do we find an object with the specific condition?

[arr.find](mdn:js/Array/find)메서드는 이럴 때 쓸모가 있습니다.
Here the [arr.find](mdn:js/Array/find) method comes in handy.

문법은 다음과 같습니다.
```js
let result = arr.find(function(item, index, array) {
  // true가 반환되면, 반복이 멈추고 해당 요소(item)을 반환합니다.
  // 거짓 같은 값(falsy)일 경우는 undefined가 반환됩니다.
});
```

배열 내 모든 요소에 대하여 함수가 호출됩니다:
The function is called repetitively for each element of the array:

- `item` 은 요소를 의미합니다.
- `index` 는 인덱스를 의미합니다.
- `array` 는 배열 그 자체를 의미합니다.

만약 참이 반환되면, 탐색은 중단되고 해당 요소가 반환됩니다. 아무것도 찾지 못했을 경우는 `undefined`가 반환됩니다.
If it returns `true`, the search is stopped, the `item` is returned. If nothing found, `undefined` is returned.

`id`와 `name`이 있는 사용자 객체가 들어있는 배열을 예로 들어보도록 하겠습니다. 배열 내에서 `id == 1` 조건을 충족하는 사용자 객체를 찾아봅시다.

```js run
let users = [
  {id: 1, name: "John"},
  {id: 2, name: "Pete"},
  {id: 3, name: "Mary"}
];

let user = users.find(item => item.id == 1);

alert(user.name); // John
```

객체로 구성된 배열은 실 생활에서 아주 흔한 경우이기 때문에, `find` 메서드는 아주 유용합니다.
In real life arrays of objects is a common thing, so the `find` method is very useful.

위 예제에선 인수가 하나만 있는 함수인 `item => item.id == 1`을 `find` 메서드에 넘겨주었다는 점에 유의하시기 바랍니다. 이 함수에서 다른 인수는 거의 쓰이지 않고 있습니다.
Note that in the example we provide to `find` the function `item => item.id == 1` with one argument. Other arguments of this function are rarely used.

[arr.findIndex](mdn:js/Array/findIndex) 메서드는 find 메서드와 동일한 일을 하나, 조건에 맞는 요소를 반환하지 않고, 해당 요소의 인덱스만 반환한다는 점에서 차이가 있습니다. 아무것도 찾지 못한 경우는 `-1`을 반환합니다. 
The [arr.findIndex](mdn:js/Array/findIndex) method is essentially the same, but it returns the index where the element was found instead of the element itself and `-1` is returned when nothing is found.

### filter

`find` 메서드는 함수의 반환값을 `true`로 만드는 단 하나의 요소를 찾습니다. 요소를 찾게 되면 탐색이 중단되기 때문에, 이 요소는 조건에 맞는 첫 번 째 요소가 되겠죠.
The `find` method looks for a single (first) element that makes the function return `true`.

만약 조건에 맞는 요소가 여러개라면, [arr.filter(fn)](mdn:js/Array/filter)를 사용해 해당하는 객체를 찾을 수 있습니다.

문법은 `find`와 비슷하나, filter 메서드는 `true`가 이미 반환된 경우에도 탐색을 멈추지 않기 때문에 배열의 모든 요소를 검색합니다. 
The syntax is similar to `find`, but filter continues to iterate for all array elements even if `true` is already returned:

```js
let results = arr.filter(function(item, index, array) {
  // if true item is pushed to results and iteration continues
  // returns empty array for complete falsy scenario
});
```

예시:

```js run
let users = [
  {id: 1, name: "John"},
  {id: 2, name: "Pete"},
  {id: 3, name: "Mary"}
];

// 앞쪽 두명의 사용자를 반환합니다.
let someUsers = users.filter(item => item.id < 3);

alert(someUsers.length); // 2
```

## 배열을 변형시키는 메서드Transform an array

This section is about the methods transforming or reordering the array.


### map

[arr.map](mdn:js/Array/map) 메서드는 유용성과 사용 빈도가 아주 높은 메서드 중 하나입니다.

문법은 다음과 같습니다:

```js
let result = arr.map(function(item, index, array) {
  // 요소가 아닌 새로운 값을 반환합니다
})
```

map메서드는 배열의 각 요소에 함수를 호출하고, 결과를 배열로 받아 반환합니다.   

아래는 각 요소를 길이로 전환해주는 map 메서드 활용 예시입니다.

```js run
let lengths = ["Bilbo", "Gandalf", "Nazgul"].map(item => item.length);
alert(lengths); // 5,7,6
```

### sort(fn)

The method [arr.sort](mdn:js/Array/sort) sorts the array *in place*.

For instance:

```js run
let arr = [ 1, 2, 15 ];

// the method reorders the content of arr (and returns it)
arr.sort();

alert( arr );  // *!*1, 15, 2*/!*
```

Did you notice anything strange in the outcome?

The order became `1, 15, 2`. Incorrect. But why?

**The items are sorted as strings by default.**

Literally, all elements are converted to strings and then compared. So, the lexicographic ordering is applied and indeed `"2" > "15"`.

To use our own sorting order, we need to supply a function of two arguments as the argument of `arr.sort()`.

The function should work like this:
```js
function compare(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}
```

For instance:

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

Now it works as intended.

Let's step aside and think what's happening. The `arr` can be array of anything, right? It may contain numbers or strings or html elements or whatever. We have a set of *something*. To sort it, we need an *ordering function* that knows how to compare its elements. The default is a string order.

The `arr.sort(fn)` method has a built-in implementation of sorting algorithm. We don't need to care how it exactly works (an optimized [quicksort](https://en.wikipedia.org/wiki/Quicksort) most of the time). It will walk the array, compare its elements using the provided function and reorder them, all we need is to provide the `fn` which does the comparison.

By the way, if we ever want to know which elements are compared -- nothing prevents from alerting them:

```js run
[1, -2, 15, 2, 0, 8].sort(function(a, b) {
  alert( a + " <> " + b );
});
```

The algorithm may compare an element multiple times in the process, but it tries to make as few comparisons as possible.


````smart header="A comparison function may return any number"
Actually, a comparison function is only required to return a positive number to say "greater" and a negative number to say "less".

That allows to write shorter functions:

```js run
let arr = [ 1, 2, 15 ];

arr.sort(function(a, b) { return a - b; });

alert(arr);  // *!*1, 2, 15*/!*
```
````

````smart header="Arrow functions for the best"
Remember [arrow functions](info:function-expressions-arrows#arrow-functions)? We can use them here for neater sorting:

```js
arr.sort( (a, b) => a - b );
```

This works exactly the same as the other, longer, version above.
````

### reverse

The method [arr.reverse](mdn:js/Array/reverse) reverses the order of elements in `arr`.

For instance:

```js run
let arr = [1, 2, 3, 4, 5];
arr.reverse();

alert( arr ); // 5,4,3,2,1
```

It also returns the array `arr` after the reversal.

### split and join

Here's the situation from the real life. We are writing a messaging app, and the person enters the comma-delimited list of receivers: `John, Pete, Mary`. But for us an array of names would be much more comfortable than a single string. How to get it?

The [str.split(delim)](mdn:js/String/split) method does exactly that. It splits the string into an array by the given delimiter `delim`.

In the example below, we split by a comma followed by space:

```js run
let names = 'Bilbo, Gandalf, Nazgul';

let arr = names.split(', ');

for (let name of arr) {
  alert( `A message to ${name}.` ); // A message to Bilbo  (and other names)
}
```

The `split` method has an optional second numeric argument -- a limit on the array length. If it is provided, then the extra elements are ignored. In practice it is rarely used though:

```js run
let arr = 'Bilbo, Gandalf, Nazgul, Saruman'.split(', ', 2);

alert(arr); // Bilbo, Gandalf
```

````smart header="Split into letters"
The call to `split(s)` with an empty `s` would split the string into an array of letters:

```js run
let str = "test";

alert( str.split('') ); // t,e,s,t
```
````

The call [arr.join(separator)](mdn:js/Array/join) does the reverse to `split`. It creates a string of `arr` items glued by `separator` between them.

For instance:

```js run
let arr = ['Bilbo', 'Gandalf', 'Nazgul'];

let str = arr.join(';');

alert( str ); // Bilbo;Gandalf;Nazgul
```

### reduce/reduceRight

When we need to iterate over an array -- we can use `forEach`, `for` or `for..of`.

When we need to iterate and return the data for each element -- we can use `map`.

The methods [arr.reduce](mdn:js/Array/reduce) and [arr.reduceRight](mdn:js/Array/reduceRight) also belong to that breed, but are a little bit more intricate. They are used to calculate a single value based on the array.

The syntax is:

```js
let value = arr.reduce(function(previousValue, item, index, array) {
  // ...
}, initial);
```

The function is applied to the elements. You may notice the familiar arguments, starting from the 2nd:

- `item` -- is the current array item.
- `index` -- is its position.
- `array` -- is the array.

So far, like `forEach/map`. But there's one more argument:

- `previousValue` -- is the result of the previous function call, `initial` for the first call.

The easiest way to grasp that is by example.

Here we get a sum of array in one line:

```js run
let arr = [1, 2, 3, 4, 5];

let result = arr.reduce((sum, current) => sum + current, 0);

alert(result); // 15
```

Here we used the most common variant of `reduce` which uses only 2 arguments.

Let's see the details of what's going on.

1. On the first run, `sum` is the initial value (the last argument of `reduce`), equals `0`, and `current` is the first array element, equals `1`. So the result is `1`.
2. On the second run, `sum = 1`, we add the second array element (`2`) to it and return.
3. On the 3rd run, `sum = 3` and we add one more element to it, and so on...

The calculation flow:

![](reduce.png)

Or in the form of a table, where each row represents a function call on the next array element:

|   |`sum`|`current`|`result`|
|---|-----|---------|---------|
|the first call|`0`|`1`|`1`|
|the second call|`1`|`2`|`3`|
|the third call|`3`|`3`|`6`|
|the fourth call|`6`|`4`|`10`|
|the fifth call|`10`|`5`|`15`|


As we can see, the result of the previous call becomes the first argument of the next one.

We also can omit the initial value:

```js run
let arr = [1, 2, 3, 4, 5];

// removed initial value from reduce (no 0)
let result = arr.reduce((sum, current) => sum + current);

alert( result ); // 15
```

The result is the same. That's because if there's no initial, then `reduce` takes the first element of the array as the initial value and starts the iteration from the 2nd element.

The calculation table is the same as above, minus the first row.

But such use requires an extreme care. If the array is empty, then `reduce` call without initial value gives an error.

Here's an example:

```js run
let arr = [];

// Error: Reduce of empty array with no initial value
// if the initial value existed, reduce would return it for the empty arr.
arr.reduce((sum, current) => sum + current);
```


So it's advised to always specify the initial value.

The method [arr.reduceRight](mdn:js/Array/reduceRight) does the same, but goes from right to left.


## Array.isArray

Arrays do not form a separate language type. They are based on objects.

So `typeof` does not help to distinguish a plain object from an array:

```js run
alert(typeof {}); // object
alert(typeof []); // same
```

...But arrays are used so often that there's a special method for that: [Array.isArray(value)](mdn:js/Array/isArray). It returns `true` if the `value` is an array, and `false` otherwise.

```js run
alert(Array.isArray({})); // false

alert(Array.isArray([])); // true
```

## Most methods support "thisArg"

Almost all array methods that call functions -- like `find`, `filter`, `map`, with a notable exception of `sort`, accept an optional additional parameter `thisArg`.

That parameter is not explained in the sections above, because it's rarely used. But for completeness we have to cover it.

Here's the full syntax of these methods:

```js
arr.find(func, thisArg);
arr.filter(func, thisArg);
arr.map(func, thisArg);
// ...
// thisArg is the optional last argument
```

The value of `thisArg` parameter becomes `this` for `func`.

For instance, here we use an object method as a filter and `thisArg` comes in handy:

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
// find all users younger than user
let youngerUsers = users.filter(user.younger, user);
*/!*

alert(youngerUsers.length); // 2
```

In the call above, we use `user.younger` as a filter and also provide `user` as the context for it. If we didn't provide the context, `users.filter(user.younger)` would call `user.younger` as a standalone function, with `this=undefined`. That would mean an instant error.

## Summary

A cheatsheet of array methods:

- To add/remove elements:
  - `push(...items)` -- adds items to the end,
  - `pop()` -- extracts an item from the end,
  - `shift()` -- extracts an item from the beginning,
  - `unshift(...items)` -- adds items to the beginning.
  - `splice(pos, deleteCount, ...items)` -- at index `pos` delete `deleteCount` elements and insert `items`.
  - `slice(start, end)` -- creates a new array, copies elements from position `start` till `end` (not inclusive) into it.
  - `concat(...items)` -- returns a new array: copies all members of the current one and adds `items` to it. If any of `items` is an array, then its elements are taken.

- To search among elements:
  - `indexOf/lastIndexOf(item, pos)` -- look for `item` starting from position `pos`, return the index or `-1` if not found.
  - `includes(value)` -- returns `true` if the array has `value`, otherwise `false`.
  - `find/filter(func)` -- filter elements through the function, return first/all values that make it return `true`.
  - `findIndex` is like `find`, but returns the index instead of a value.
  
- To iterate over elements:
  - `forEach(func)` -- calls `func` for every element, does not return anything.

- To transform the array:
  - `map(func)` -- creates a new array from results of calling `func` for every element.
  - `sort(func)` -- sorts the array in-place, then returns it.
  - `reverse()` -- reverses the array in-place, then returns it.
  - `split/join` -- convert a string to array and back.
  - `reduce(func, initial)` -- calculate a single value over the array by calling `func` for each element and passing an intermediate result between the calls.

- Additionally:
  - `Array.isArray(arr)` checks `arr` for being an array.

Please note that methods `sort`, `reverse` and `splice` modify the array itself.

These methods are the most used ones, they cover 99% of use cases. But there are few others:

- [arr.some(fn)](mdn:js/Array/some)/[arr.every(fn)](mdn:js/Array/every) checks the array.

  The function `fn` is called on each element of the array similar to `map`. If any/all results are `true`, returns `true`, otherwise `false`.

- [arr.fill(value, start, end)](mdn:js/Array/fill) -- fills the array with repeating `value` from index `start` to `end`.

- [arr.copyWithin(target, start, end)](mdn:js/Array/copyWithin) -- copies its elements from position `start` till position `end` into *itself*, at position `target` (overwrites existing).

For the full list, see the [manual](mdn:js/Array).

From the first sight it may seem that there are so many methods, quite difficult to remember. But actually that's much easier than it seems.

Look through the cheatsheet just to be aware of them. Then solve the tasks of this chapter to practice, so that you have experience with array methods.

Afterwards whenever you need to do something with an array, and you don't know how -- come here, look at the cheatsheet and find the right method. Examples will help you to write it correctly. Soon you'll automatically remember the methods, without specific efforts from your side.
