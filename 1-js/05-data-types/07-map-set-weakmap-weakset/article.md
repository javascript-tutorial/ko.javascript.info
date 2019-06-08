
# 맵, 셋, 위크 맵, 위크 셋

지금까지 아래와 같은 자료구조에 대해 학습해보았습니다.

- 키와 값이 연결된 컬렉션을 저장하는 객체.
- 순서가 있는 컬렉션을 저장하는 배열.

하지만 현실 세계를 반영하기엔 이 자료구조 만으론 부족해서, `Map`과 `Set`이 등장하게 되었습니다.

## 맵

[맵(Map)](mdn:js/Map)은 `객체`와 같이 키를 가진 데이터가 저장된 컬렉션입니다. `맵`의 키엔 다양한 자료형 허용된다는 점이 객체와 다릅니다.

맵에는 아래와 같은 주요 메서드가 있습니다.

- `new Map()` -- 맵을 만듭니다.
- `map.set(key, value)` -- `key`를 이용해 `value`를 추가합니다.
- `map.get(key)` -- `key`에 해당하는 값을 가져옵니다. 존재하지 않는 `key`에 호출하면 `undefined`를 반환합니다.
- `map.has(key)` -- `key`가 존재하면 `true`, 존재하지 않으면 `false`를 반환합니다.
- `map.delete(key)` -- `key`에 해당하는 값을 삭제합니다.
- `map.clear()` -- 모든 요소를 제거합니다.
- `map.size` -- 요소의 개수를 반환합니다.

예시:

```js run
let map = new Map();

map.set('1', 'str1');   // 문자열 키
map.set(1, 'num1');     // 숫자 형 키
map.set(true, 'bool1'); // boolean 키

// 객체는 key를 문자열로 변환한다는 걸 기억하고 계신가요?
// 맵은 key의 타입을 변환시키지 않고 그대로 유지합니다. 따라서 출력되는 값이 다릅니다.
alert( map.get(1)   ); // 'num1'
alert( map.get('1') ); // 'str1'

alert( map.size ); // 3
```

위에서 확인한 바와 같이, 맵의 키는 문자열로 바뀌지 않고, 키의 타입에 제한이 없습니다. 객체와는 다른 특성이죠.

**맵은 객체도 키로 쓸 수 있습니다.**

예시:
```js run
let john = { name: "John" };

// 모든 소비자를 대상으로, 가게 방문 횟수를 세봅시다.
let visitsCountMap = new Map();

// john을 맵의 키로 사용하겠습니다.
visitsCountMap.set(john, 123);

alert( visitsCountMap.get(john) ); // 123
```

키에 객체를 쓸 수 있다는 점은 `맵`의 가장 중요한 기능입니다. 키가 문자열만으로 이뤄졌다면 `객체`를 써도 괜찮습니다. 다만, 위의 예시에서와같이 `맵`을 보통의 `객체`로 바꾸는 건 어려울 수 있습니다.

`Map`이 있기 전에는, 객체에 특별한 식별자를 넣는 방식을 사용하곤 했습니다. 아래와 같이 말이죠.

```js run
// id 필드를 추가함
let john = { name: "John", *!*id: 1*/!* };

let visitsCounts = {};

// id를 이용해 값을 저장함
visitsCounts[john.id] = 123;

alert( visitsCounts[john.id] ); // 123
```

하지만 `Map`이 도입되면서 훨씬 우아한 방법으로 같은 작업을 할 수 있게 되었습니다.


```smart header="`Map`이 키를 비교하는 방식"
`맵`은 [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero) 알고리즘을 사용해 값의 등가 여부를 확인합니다. 이 알고리즘은 일치 연산자 `===`와 거의 유사하지만, `NaN`과 `NaN`을 같다고 취급하는 것에서 일치 연산자와 차이가 있습니다. 따라서 맵에선 `NaN`도 키로 쓸 수 있습니다.

이 알고리즘은 수정하거나 커스터마이징 하는 것이 불가능합니다.
```


````smart header="체이닝"

`map.set`은 맵 자신을 반환하기 때문에, "체이닝"이 가능합니다.

```js
map.set('1', 'str1')
  .set(1, 'num1')
  .set(true, 'bool1');
```
````

## 객체를 맵으로

키-값 쌍을 가진 배열(또는, 다른 이터러블 객채)을 `맵`에 전달할 수 있습니다. 아래와 같이 말이죠.

```js
// [key, value] 쌍을 가진 배열
let map = new Map([
  ['1',  'str1'],
  [1,    'num1'],
  [true, 'bool1']
]);
```

내장 메서드 [Object.entries(obj)](mdn:js/Object/entries)는 객체 각 키/값 쌍을 요소(`[key, value]`)로 가지는 배열을 반환합니다.

이를 이용하면 객체로 맵을 초기화할 수 있습니다.

```js
let map = new Map(Object.entries({
  name: "John",
  age: 30
}));
```

`Object.entries`를 사용해 객체를 `[ ["name","John"], ["age", 30] ]`로 바꾸고, `맵`에 이를 전달하여 맵을 초기화 해보았습니다.

## 맵의 요소에 반복 작업하기

`맵`의 각 요소를 대상으로 반복 작업을 할 땐, 다음 세 가지 메서드를 활용할 수 있습니다.

- `map.keys()` -- 각 요소의 키 정보만 모은 iterable를 반환합니다.
- `map.values()` -- 각 요소의 값 정보만 모은 iterable를 반환합니다.
- `map.entries()` --  요소의 `[키, 값]`을 한 쌍으로 하는 iterable을 반환합니다. 이 iterable은 `for..of`반복문에서 기본으로 쓰입니다.  

예시:

```js run
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);

// 키(vegetable)를 대상으로 순회합니다.
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}

// 값(amounts)을 대상으로 순회합니다.
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// [키, 값] 쌍을 대상으로 순회합니다. 
for (let entry of recipeMap) { // recipeMap.entries()와 동일합니다.
  alert(entry); // cucumber,500 (and so on)
}
```

```smart header="삽입 순서가 유지됩니다."
`객체`에서 프로퍼티 순서가 보장되지 않는 것과는 다르게, `Map`은 요소의 삽입 순서를 기억하고 유지합니다. 따라서 요소의 순회 역시 맵에 추가된 순서대로 이뤄집니다.
```

`Map`은 `Array`와 유사하게 내장 메서드, `forEach`도 제공한다는 점도 기억해 두시기 바랍니다.

```js
// 각 (키, 값) 쌍을 대상으로 함수를 실행 
recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 etc
});
```


## 셋

`셋(Set)`은 중복을 허용하지 않는 값의 컬렉션입니다.

주요 메서드는 다음과 같습니다.

- `new Set(iterable)` -- 셋을 만듭니다. 배열의 값으로 만들 수도 있고, 반복 가능한(iterable) 객체로도 만들 수 있습니다.
- `set.add(value)` -- 값을 추가하고, 셋 자신을 반환합니다.
- `set.delete(value)` -- 값을 제거합니다. 제거에 성공하면 `true`를, 아니면 `false`를 반환합니다.    
- `set.has(value)` -- 셋 내에 값이 존재하면 `true`, 아니면 `false`를 반환합니다.
- `set.clear()` -- 셋을 비웁니다.
- `set.size` -- 셋에 몇 개의 값이 있는지 세줍니다.

방문자에 대한 정보를 저장하려는 경우를 생각해 봅시다. 한 방문자가 여러 번 방문할 경우 해당 방문자에 대한 정보를 중복해서 저장하면 안 된다는 요구사항이 있을겁니다.

이런 경우 `Set`이 적합한 자료구조일 겁니다.

```js run
let set = new Set();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

// 어떤 고객은 여러 번 방문할 수 있습니다.
set.add(john);
set.add(pete);
set.add(mary);
set.add(john);
set.add(mary);

// 셋에는 유일무이한 값만 저장됩니다.
alert( set.size ); // 3

for (let user of set) {
  alert(user.name); // John, Pete, Mary순으로 출력됩니다.
}
```

`셋` 대신 배열을 사용하여 방문자 정보를 저장할 수도 있었을 겁니다. 이런 경우, [arr.find](mdn:js/Array/find) 메서드를 사용해 중복 값의 여부를 확인할 수 있겠죠. 하지만 이 메서드는 중복값을 찾기 위해 전체 요소를 확인하므로, 셋을 사용하는 것보다 좋지 않은 성능을 보입니다. `셋`은 내부적으로 값의 유일무이성을 확인하기 위해 최적화되어있습니다.

## 셋의 값에 반복 작업하기

`for..of`나 `forEach`을 사용하면 셋에 반복 작업을 할 수 있습니다.

```js run
let set = new Set(["oranges", "apples", "bananas"]);

for (let value of set) alert(value);

// forEach도 동일하게 동작합니다.
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```

그런데 흥미로운 점이 하나 보이네요. `forEach`에 쓰인 콜백이 세 개의 인수를 받는데, 첫 번째는 값, 두 번째도 *또다시 값*을 받고 있습니다. 세 번째는 목표하는 객체인 셋이고요. 같은 값이 인수에 두 번 등장하고 있습니다.

이렇게 구현된 이유는 `Map`과의 호환성 때문입니다. `Map`의 `forEach`에 쓰인 콜백이 세 개의 인수를 받을 때를 위해서죠. 이상해 보이지만 이렇게 구현해 놓았기 때문에 `Map`을 `Set`으로, 혹은 `Set`을 `Map`으로 교체하기 쉬워집니다.

셋은 맵과 마찬가지로 반복 작업을 위한 메서드를 제공합니다.

- `set.keys()` -- 셋 내의 모든 값을 포함하는 이터러블 객체를 반환합니다.
- `set.values()` -- `set.keys`와 동일한 작업을 하며, `Map`과의 호환성을 위해 만들어졌습니다.
- `set.entries()` -- 셋 내의 각 값을 이용해 만든 `[value, value]`배열을 포함하는 이터러블 객체를 반환합니다. `Map`과의 호환성을 위해 만들어졌습니다.

## WeakMap and WeakSet

`WeakSet` is a special kind of `Set` that does not prevent JavaScript from removing its items from memory. `WeakMap` is the same thing for `Map`.

As we know from the chapter <info:garbage-collection>, JavaScript engine stores a value in memory while it is reachable (and can potentially be used).

For instance:
```js
let john = { name: "John" };

// the object can be accessed, john is the reference to it

// overwrite the reference
john = null;

*!*
// the object will be removed from memory
*/!*
```

Usually, properties of an object or elements of an array or another data structure are considered reachable and kept in memory while that data structure is in memory.

For instance, if we put an object into an array, then while the array is alive, the object will be alive as well, even if there are no other references to it.

Like this:

```js
let john = { name: "John" };

let array = [ john ];

john = null; // overwrite the reference

*!*
// john is stored inside the array, so it won't be garbage-collected
// we can get it as array[0]
*/!*
```

Or, if we use an object as the key in a regular `Map`, then while the `Map` exists, that object exists as well. It occupies memory and may not be garbage collected.

For instance:

```js
let john = { name: "John" };

let map = new Map();
map.set(john, "...");

john = null; // overwrite the reference

*!*
// john is stored inside the map,
// we can get it by using map.keys()
*/!*
```

`WeakMap/WeakSet` are fundamentally different in this aspect. They do not prevent garbage-collection of key objects.

Let's explain it starting with `WeakMap`.

The first difference from `Map` is that `WeakMap` keys must be objects, not primitive values:

```js run
let weakMap = new WeakMap();

let obj = {};

weakMap.set(obj, "ok"); // works fine (object key)

*!*
// can't use a string as the key
weakMap.set("test", "Whoops"); // Error, because "test" is not an object
*/!*
```

Now, if we use an object as the key in it, and there are no other references to that object -- it will be removed from memory (and from the map) automatically.

```js
let john = { name: "John" };

let weakMap = new WeakMap();
weakMap.set(john, "...");

john = null; // overwrite the reference

// john is removed from memory!
```

Compare it with the regular `Map` example above. Now if `john` only exists as the key of `WeakMap` -- it is to be automatically deleted.

`WeakMap` does not support iteration and methods `keys()`, `values()`, `entries()`, so there's no way to get all keys or values from it.

`WeakMap` has only the following methods:

- `weakMap.get(key)`
- `weakMap.set(key, value)`
- `weakMap.delete(key)`
- `weakMap.has(key)`

Why such a limitation? That's for technical reasons. If an object has lost all other references (like `john` in the code above), then it is to be garbage-collected automatically. But technically it's not exactly specified *when the cleanup happens*.

The JavaScript engine decides that. It may choose to perform the memory cleanup immediately or to wait and do the cleaning later when more deletions happen. So, technically the current element count of a `WeakMap` is not known. The engine may have cleaned it up or not, or did it partially. For that reason, methods that access `WeakMap` as a whole are not supported.

Now where do we need such thing?

The idea of `WeakMap` is that we can store something for an object that should exist only while the object exists. But we do not force the object to live by the mere fact that we store something for it.

```js
weakMap.set(john, "secret documents");
// if john dies, secret documents will be destroyed automatically
```

That's useful for situations when we have a main storage for the objects somewhere and need to keep additional information, that is only relevant while the object lives.

Let's look at an example.

For instance, we have code that keeps a visit count for each user. The information is stored in a map: a user is the key and the visit count is the value. When a user leaves, we don't want to store their visit count anymore.

One way would be to keep track of users, and when they leave -- clean up the map manually:

```js run
let john = { name: "John" };

// map: user => visits count
let visitsCountMap = new Map();

// john is the key for the map
visitsCountMap.set(john, 123);

// now john leaves us, we don't need him anymore
john = null;

*!*
// but it's still in the map, we need to clean it!
*/!*
alert( visitsCountMap.size ); // 1
// and john is also in the memory, because Map uses it as the key
```

Another way would be to use `WeakMap`:

```js
let john = { name: "John" };

let visitsCountMap = new WeakMap();

visitsCountMap.set(john, 123);

// now john leaves us, we don't need him anymore
john = null;

// there are no references except WeakMap,
// so the object is removed both from the memory and from visitsCountMap automatically
```

With a regular `Map`, cleaning up after a user has left becomes a tedious task: we not only need to remove the user from its main storage (be it a variable or an array), but also need to clean up the additional stores like `visitsCountMap`. And it can become cumbersome in more complex cases when users are managed in one place of the code and the additional structure is in another place and is getting no information about removals.

```summary
`WeakMap` can make things simpler, because it is cleaned up automatically. The information in it like visits count in the example above lives only while the key object exists.
```

`WeakSet` behaves similarly:

- It is analogous to `Set`, but we may only add objects to `WeakSet` (not primitives).
- An object exists in the set while it is reachable from somewhere else.
- Like `Set`, it supports `add`, `has` and `delete`, but not `size`, `keys()` and no iterations.

For instance, we can use it to keep track of whether a message is read:

```js
let messages = [
    {text: "Hello", from: "John"},
    {text: "How goes?", from: "John"},
    {text: "See you soon", from: "Alice"}
];

// fill it with array elements (3 items)
let unreadSet = new WeakSet(messages);

// use unreadSet to see whether a message is unread
alert(unreadSet.has(messages[1])); // true

// remove it from the set after reading
unreadSet.delete(messages[1]); // true

// and when we shift our messages history, the set is cleaned up automatically
messages.shift();

*!*
// no need to clean unreadSet, it now has 2 items
*/!*
// (though technically we don't know for sure when the JS engine clears it)
```

The most notable limitation of `WeakMap` and `WeakSet` is the absence of iterations, and inability to get all current content. That may appear inconvenient, but does not prevent `WeakMap/WeakSet` from doing their main job -- be an "additional" storage of data for objects which are stored/managed at another place.

## Summary

Regular collections:
- `Map` -- is a collection of keyed values.

    The differences from a regular `Object`:

    - Any keys, objects can be keys.
    - Iterates in the insertion order.
    - Additional convenient methods, the `size` property.

- `Set` -- is a collection of unique values.

    - Unlike an array, does not allow to reorder elements.
    - Keeps the insertion order.

Collections that allow garbage-collection:

- `WeakMap` -- a variant of `Map` that allows only objects as keys and removes them once they become inaccessible by other means.

    - It does not support operations on the structure as a whole: no `size`, no `clear()`, no iterations.

- `WeakSet` -- is a variant of `Set` that only stores objects and removes them once they become inaccessible by other means.

    - Also does not support `size/clear()` and iterations.

`WeakMap` and `WeakSet` are used as "secondary" data structures in addition to the "main" object storage. Once the object is removed from the main storage, if it is only found in the `WeakMap/WeakSet`, it will be cleaned up automatically.
