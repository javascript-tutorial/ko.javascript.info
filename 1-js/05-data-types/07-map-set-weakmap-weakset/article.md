
# 맵, 셋, 위크맵, 위크셋(Map, Set, WeakMap and WeakSet)

지금까지 아래와 같은 복잡한 자료구조에 대해 학습해보았습니다.

- 키와 값이 연결된 컬렉션을 저장하는 객체.
- 순서가 있는 컬렉션을 저장하는 배열.

하지만 이 자료구조 만으론 부족해서, `Map`과 `Set`이 등장하게 되었습니다.

## 맵

[맵](mdn:js/Map)은 `객체`와 같이 키 값을 가진 데이터가 저장된 컬렉션입니다. 하지만 `맵`의 키는 다양한 자료형이 될 수 있다는 점이 다릅니다.

맵의 주요 메서드는 다음과 같습니다:

- `new Map()` -- 맵을 만듭니다.
- `map.set(key, value)` -- `key`와 `value`를 쌍으로 가진 요소를 추가합니다.
- `map.get(key)` -- key에 해당하는 값을 가져옵니다. 맵에 해당 `key`를 가진 요소가 없으면 `undefined`을 반환합니다.
- `map.has(key)` -- 해당 `key`정보가 맵에 있으면 `true`를 반환하고, 없으면 `false`를 반환합니다.
- `map.delete(key)` -- 해당 `key`를 가진 요소를 삭제합니다.
- `map.clear()` -- 맵을 삭제합니다.
- `map.size` -- 요소의 갯수를 반환합니다.

예:

```js run
let map = new Map();

map.set('1', 'str1');   // 문자열 키
map.set(1, 'num1');     // 숫자형 키
map.set(true, 'bool1'); // boolean 키

// 객체는 key를 문자열로 변환한다는 걸 기억하고 계신가요?
// 맵은 타입을 변환시키지 않고 그대로 유지합니다. 이런 점이 두 자료구조를 각각 특색있게 만듭니다:
alert( map.get(1)   ); // 'num1'
alert( map.get('1') ); // 'str1'

alert( map.size ); // 3
```

위에서 확인한 바와 같이, 맵의 키는 문자열로 바뀌지 않습니다. 객체와는 다른 특성입니다. 그리고 키의 타입에 제한이 없습니다.

**맵은 객체를 키로 쓸 수 있습니다.**

예:
```js run
let john = { name: "John" };

// 소비자의 가게 방문 횟수를 세봅시다. 대상은 모든 소비자입니다.
let visitsCountMap = new Map();

// john은 이제 키가 됩니다.
visitsCountMap.set(john, 123);

alert( visitsCountMap.get(john) ); // 123
```

객체를 키로 쓰는 건 `맵`의 중요한 특징입니다. 키가 문자열만으로 이루어진 `객체`를 `맵`으로 바꾸는건 괜찮습니다. 하지만 위의 예시에서와 같이 `맵`을 보통의 `객체`로 바꾸는 건 어려울 수 있습니다.

`Map`이 있기 전에는, 특별한 객체 식별자를 요소에 추가하는 방식을 사용하곤 했습니다. 아래와 같이 말이죠:

```js run
// id 필드를 추가함
let john = { name: "John", *!*id: 1*/!* };

let visitsCounts = {};

// id를 이용해 값을 저장함
visitsCounts[john.id] = 123;

alert( visitsCounts[john.id] ); // 123
```

하지만 `Map`을 사용하면 훨씬 우아하게 같은 작업을 할 수 있게되었습니다.


```smart header="`Map`이 키를 비교하는 방식"
`맵`은 동일한 키가 존재하는지 확인할 때, [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero) 알고리즘을 사용합니다. 이 알고리즘은 타입과 값이 동시에 일치하는지 확인하는 `===`와 거의 같지만 `NaN`과 `NaN`을 같다고 취급하는 것에서 차이가 있습니다. 따라서 `NaN` 역시 키로 쓸 수 있습니다.

맵에서 쓰이는 이 알고리즘을 다른 알고리즘으로 바꾸거나, 알고리즘 일부만 변경하는 것 모두 금지되어 있습니다.
```


````smart header="체이닝"

`map.set`은 맵 자신을 반환하기 때문에, "체인"으로 연결할 수 있습니다:
Every `map.set` call returns the map itself, so we can "chain" the calls:

```js
map.set('1', 'str1')
  .set(1, 'num1')
  .set(true, 'bool1');
```
````

## 객체를 맵으로

`맵`이 만들어지면, 키-값 쌍을 가진 배열이나 다른 iterable을 맵에 전달해 줄 수 있습니다. 아래와 같이 말이죠:

```js
// [key, value] 쌍을 가진 배열
let map = new Map([
  ['1',  'str1'],
  [1,    'num1'],
  [true, 'bool1']
]);
```

내장 메서드인 [Object.entries(obj)](mdn:js/Object/entries)는 첫 번째 요소가 키이고 두 번째 요소가 값인 배열을 반환합니다.

이를 이용하면 객체를 이용해 맵을 초기화 할 수 있습니다.

```js
let map = new Map(Object.entries({
  name: "John",
  age: 30
}));
```

`Object.entries`를 써서 `[ ["name","John"], ["age", 30] ]` 같이 키/값 쌍의 배열이 반환되는걸 확인해 보았습니다. `맵`에서 이를 유용하게 쓸 수 있습니다.

## 맵 객체 요소 나열하기

`맵`객체의 요소를 확인하려면 다음과 같은 세 가지 메서드가 필요합니다:

- `map.keys()` -- 키 정보만 모아 iterable로 반환합니다.
- `map.values()` -- 값 정보만 모아 iterable로 반환합니다.
- `map.entries()` --  요소의 `[키, 값]`을 한쌍으로하는 iterable을 반환합니다. 이 iterable은 `for..of`에서에서 기본으로 쓰입니다.  

예:

```js run
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);

// iterate over keys (vegetables)
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}

// iterate over values (amounts)
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// iterate over [key, value] entries
for (let entry of recipeMap) { // the same as of recipeMap.entries()
  alert(entry); // cucumber,500 (and so on)
}
```

```smart header="The insertion order is used"
The iteration goes in the same order as the values were inserted. `Map` preserves this order, unlike a regular `Object`.
```

Besides that, `Map` has a built-in `forEach` method, similar to `Array`:

```js
// runs the function for each (key, value) pair 
recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 etc
});
```


## Set

A `Set` is a collection of values, where each value may occur only once.

Its main methods are:

- `new Set(iterable)` -- creates the set, optionally from an array of values (any iterable will do).
- `set.add(value)` -- adds a value, returns the set itself.
- `set.delete(value)` -- removes the value, returns `true` if `value` existed at the moment of the call, otherwise `false`.
- `set.has(value)` -- returns `true` if the value exists in the set, otherwise `false`.
- `set.clear()` -- removes everything from the set.
- `set.size` -- is the elements count.

For example, we have visitors coming, and we'd like to remember everyone. But repeated visits should not lead to duplicates. A visitor must be "counted" only once.

`Set` is just the right thing for that:

```js run
let set = new Set();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

// visits, some users come multiple times
set.add(john);
set.add(pete);
set.add(mary);
set.add(john);
set.add(mary);

// set keeps only unique values
alert( set.size ); // 3

for (let user of set) {
  alert(user.name); // John (then Pete and Mary)
}
```

The alternative to `Set` could be an array of users, and the code to check for duplicates on every insertion using [arr.find](mdn:js/Array/find). But the performance would be much worse, because this method walks through the whole array checking every element. `Set` is much better optimized internally for uniqueness checks.

## Iteration over Set

We can loop over a set either with `for..of` or using `forEach`:

```js run
let set = new Set(["oranges", "apples", "bananas"]);

for (let value of set) alert(value);

// the same with forEach:
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```

Note the funny thing. The `forEach` function in the `Set` has 3 arguments: a value, then *again a value*, and then the target object. Indeed, the same value appears in the arguments twice.

That's for compatibility with `Map` where `forEach` has three arguments. Looks a bit strange, for sure. But may help to replace `Map` with `Set` in certain cases with ease, and vice versa.

The same methods `Map` has for iterators are also supported:

- `set.keys()` -- returns an iterable object for values,
- `set.values()` -- same as `set.keys`, for compatibility with `Map`,
- `set.entries()` -- returns an iterable object for entries `[value, value]`, exists for compatibility with `Map`.

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
