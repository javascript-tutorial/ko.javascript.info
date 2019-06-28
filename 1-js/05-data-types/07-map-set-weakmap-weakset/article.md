
# 맵, 셋, 위크 맵, 위크 셋

지금까지 아래와 같은 자료구조에 대해 학습해보았습니다.

- 키와 값이 연결된 컬렉션을 저장하는 객체.
- 순서가 있는 컬렉션을 저장하는 배열.

하지만 현실 세계를 반영하기엔 이 자료구조 만으론 부족해서, `맵(Map)`과 `셋(Set)`이 등장하게 되었습니다.

## 맵

[맵(Map)](mdn:js/Map)은 키를 가진 데이터가 저장된다는 점에서 `객체`와 유사합니다. 다만, `맵`의 키엔 다양한 자료형이 허용된다는 점이 객체와 다릅니다.

맵에는 아래와 같은 주요 메서드가 있습니다.

- `new Map()` -- 맵을 만듭니다.
- `map.set(key, value)` -- `key`를 이용해 `value`를 추가합니다.
- `map.get(key)` -- `key`에 해당하는 값을 가져옵니다. 존재하지 않는 `key`에 호출하면 `undefined`를 반환합니다.
- `map.has(key)` -- `key`가 존재하면 `true`, 존재하지 않으면 `false`를 반환합니다.
- `map.delete(key)` -- `key`에 해당하는 값을 삭제합니다.
- `map.clear()` -- 맵 안의 모든 요소를 제거합니다.
- `map.size` -- 요소의 개수를 반환합니다.

예시:

```js run
let map = new Map();

map.set('1', 'str1');   // 문자형 키
map.set(1, 'num1');     // 숫자형 키
map.set(true, 'bool1'); // 불린형 키

// 객체는 key를 문자형으로 변환한다는 걸 기억하고 계신가요?
// 맵은 key의 타입을 변환시키지 않고 그대로 유지합니다. 따라서 출력되는 값이 다릅니다.
alert( map.get(1)   ); // 'num1'
alert( map.get('1') ); // 'str1'

alert( map.size ); // 3
```

위에서 확인한 바와 같이, 맵은 키를 문자형으로 변환하지 않습니다. 키의 타입에 제한이 없죠.

**맵은 객체도 키로 쓸 수 있습니다.**

예시:
```js run
let john = { name: "John" };

// 고객의 가게 방문 횟수를 세본다고 가정해 봅시다.
let visitsCountMap = new Map();

// john을 맵의 키로 사용하겠습니다.
visitsCountMap.set(john, 123);

alert( visitsCountMap.get(john) ); // 123
```

`맵`의 가장 중요한 기능 중 하나는 키에 객체를 쓸 수 있다는 것입니다. 키가 문자열만으로 이뤄졌다면 `객체`를 써도 괜찮습니다. 하지만, 위 예시에서 `맵`을 보통의 `객체`로 바꾸는 건 어려울 수 있습니다.

한번 시도해 봅시다.

```js run
let john = { name: "John" };

let visitsCountObj = {}; // 객체를 사용해 보도록 합시다.

visitsCountObj[john] = 123; // john 객체를 키로 사용해 봅시다.

*!*
// 이렇게 써야 방문횟수를 출력할 수 있습니다!
alert( visitsCountObj["[object Object]"] ); // 123
*/!*
```

키로 사용된 `john`은 객체이기 떄문에, 문자열로 바뀌어 `"[object Object]"`가 됩니다. 어떻게 문자열로 바꿀지 규칙을 지정하지 않은 객체는 `john`처럼 `"[object Object]"`로 바뀝니다. 지저분해져 버리죠.

`Map`이 있기 전에는, 객체에 특별한 식별자를 넣는 방식을 사용하곤 했습니다. 아래와 같이 말이죠.

```js run
// id 필드를 추가함
let john = { name: "John", *!*id: 1*/!* };

let visitsCounts = {};

// id를 이용해 값을 저장함
visitsCounts[john.id] = 123;

alert( visitsCounts[john.id] ); // 123
```

하지만 `Map`이 도입되면서 훨씬 우아한 방법으로 같은 작업을 처리할 수 있게 되었습니다.


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

새로운 맵을 만들 때, 키-값 쌍을 가진 배열(또는, 다른 반복 가능한(iterable, 이터러블) 객체)을 `맵`에 전달할 수 있습니다. 아래와 같이 말이죠.

```js
// [key, value] 쌍을 가진 배열
let map = new Map([
  ['1',  'str1'],
  [1,    'num1'],
  [true, 'bool1']
]);
```

내장 메서드 [Object.entries(obj)](mdn:js/Object/entries)는 객체의 각 키/값 쌍을 요소(`[key, value]`)로 가지는 배열을 반환합니다.

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

- `map.keys()` -- 각 요소의 키를 모은 이터러블 객체를 반환합니다.
- `map.values()` -- 각 요소의 값을 모은 이터러블 객체를 반환합니다.
- `map.entries()` --  요소의 `[키, 값]`을 한 쌍으로 하는 이터러블 객체를 반환합니다. 이 이터러블 객체는 `for..of`반복문의 기초로 쓰입니다.  

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

// 값(amount)을 대상으로 순회합니다.
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// [키, 값] 쌍을 대상으로 순회합니다. 
for (let entry of recipeMap) { // recipeMap.entries()와 동일합니다.
  alert(entry); // cucumber,500 (and so on)
}
```

```smart header="삽입 순서가 유지됩니다."
`객체`에서 프로퍼티 순서가 보장되지 않는 것과는 다르게, `Map`은 요소의 삽입 순서를 기억하고 유지합니다. 따라서 순회 역시 맵에 추가된 순서대로 이뤄집니다.
```

`Map`은 `Array`와 유사하게 내장 메서드 `forEach`도 제공합니다.

```js
// 각 (키, 값) 쌍을 대상으로 함수를 실행 
recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 etc
});
```


## 셋

`셋(Set)`은 중복을 허용하지 않는 값의 컬렉션입니다.

주요 메서드는 다음과 같습니다.

- `new Set(iterable)` -- 셋을 만듭니다. `이터러블` 객체(대게, 배열)를 전달받았다면, 그 안의 값들을 복사해 set에 넣어줍니다.
- `set.add(value)` -- 값을 추가하고, 셋 자신을 반환합니다.
- `set.delete(value)` -- 값을 제거합니다. 제거에 성공하면 `true`를, 아니면 `false`를 반환합니다.    
- `set.has(value)` -- 셋 내에 값이 존재하면 `true`, 아니면 `false`를 반환합니다.
- `set.clear()` -- 셋을 비웁니다.
- `set.size` -- 셋에 몇 개의 값이 있는지 세줍니다.

방문자 방명록을 만든다고 가정해 봅시다. 한 방문자가 여러 번 방문한 경우, 해당 방문자를 중복해서 기록하지 않아야겠죠. 한 방문자는 "단 한 번만 기록"되어야 합니다.

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

`셋` 대신 배열을 사용하여 방문자 정보를 저장할 수도 있었을 겁니다. 중복 값 여부는 배열 메서드인 [arr.find](mdn:js/Array/find)를 이용해 확인할 수 있겠죠. 하지만 이 메서드는 전체 요소를 뒤져 중복 값을 찾기 때문에, 셋을 사용하는 것보다 성능이 좋지 않습니다. `셋`은 내부적으로 값의 유일무이성을 확인하기 위해 최적화되어있기 때문입니다.

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

이렇게 구현된 이유는 `Map`과의 호환성 때문입니다. `Map`의 `forEach`에 쓰인 콜백이 세 개의 인수를 받을 때를 위해서죠. 이상해 보이지만, 이렇게 구현해 놓았기 때문에 `Map`을 `Set`으로, 혹은 `Set`을 `Map`으로 교체하기 쉬워집니다.

셋은 맵과 마찬가지로 반복 작업을 위한 메서드를 제공합니다.

- `set.keys()` -- 셋 내의 모든 값을 포함하는 이터러블 객체를 반환합니다.
- `set.values()` -- `set.keys`와 동일한 작업을 하며, `Map`과의 호환성을 위해 만들어졌습니다.
- `set.entries()` -- 셋 내의 각 값을 이용해 만든 `[value, value]`배열을 포함하는 이터러블 객체를 반환합니다. `Map`과의 호환성을 위해 만들어졌습니다.

## 위크맵과 위크셋

`위크셋(WeakSet)`은 특별한 형태의 `셋`으로, `위크셋`의 요소는 가비지 컬렉터의 대상이 됩니다. `위크맵(WeakMap)`도 특별한 형태의 `맵`으로 가비지 컬렉터의 대상이 되죠.

<info:garbage-collection>에서 배웠듯이, 자바스크립트 엔진은 도달 가능하고(reachable) 잠재적으로 사용될 것 같은 값은 메모리에 유지합니다.

아래와 같이 말이죠.
```js
let john = { name: "John" };

// john이라는 참조를 통해 해당 객체에 접근할 수 있습니다.

// 참조를 null로 덮어씀
john = null;

*!*
// 객체는 메모리상에서 사라집니다.
*/!*
```

그런데, 객체의 프로퍼티나 배열의 요소 혹은 기타 자료구조(맵, 셋 등)의 요소는 해당 자료 구조가 메모리에 남아있다면 도달 가능한 것으로 취급됩니다. 따라서 메모리에서 사라지지 않습니다.  

예시를 들어 이해해 보도록 합시다. 배열의 요소로 객체 하나를 추가했을 때, 배열이 메모리상에 존재하는 한 객체는 메모리상에서 지워지지 않습니다. 이 객체가 참조하는 것이 아무것도 없더라도 말이죠.

예시:

```js
let john = { name: "John" };

let array = [ john ];

john = null; // 참조를 null로 덮어씀

*!*
// john이 배열안에 있고, 배열은 메모리 상에 남아있기 때문에, 가비지 컬렉터의 대상이 되지 않습니다.
// array[0]으로 이를 확인할 수 있습니다.
*/!*
```

일반 `맵`에서 객체를 키로 사용한 경우 역시, `맵`이 살아있으면 객체도 살게 됩니다. 객체는 메모리 공간을 차지하고, 가비지 컬렉터의 대상이 되지 않습니다.

예시:

```js
let john = { name: "John" };

let map = new Map();
map.set(john, "...");

john = null; // 참조를 null로 덮어씀

*!*
// john은 맵 안에 남아있습니다.
// map.keys()를 통해 이를 확인할 수 있죠.
*/!*
```

이런 측면에서 `위크맵/위크셋`은 일반 `맵/셋`과 전혀 다른 양상을 보입니다. 가비지 컬렉션의 대상이 되기 때문입니다.

`위크맵`부터 시작해 자세히 알아보도록 합시다.

`맵`과 `위크맵`의 첫번째 차이는, `WeakMap`의 키는 반드시 객체여야 한다는 점입니다. 원시값은 키가 될 수 없습니다.

```js run
let weakMap = new WeakMap();

let obj = {};

weakMap.set(obj, "ok"); // 정상적으로 동작합니다(객체 키).

*!*
// 문자열은 키로 사용할 수 없습니다.
weakMap.set("test", "Whoops"); // "test"는 객체가 아니기 때문에 에러가 발생합니다.
*/!*
```

키로 사용된 객체가 있고 이 객체가 참조하는 것이 없다면, 해당 객체는 메모리(와 맵)에서 자동으로 삭제됩니다. 

```js
let john = { name: "John" };

let weakMap = new WeakMap();
weakMap.set(john, "...");

john = null; // 참조를 덮어씀

// john은 이제 메모리에서 사라집니다!
```

위 예시를 일반 `Map`에서 쓰인 예시와 비교해 보시기 바랍니다. `john`을 참조하는 것이 아무것도 없고, 오로지 `위크맵`의 키로만 사용되고 있으면 `john`은 메모리에서 자동으로 삭제됩니다.

두 번째 차이점은, `맵`과는 달리 `위크맵`은 반복 작업과 `keys()`, `values()`, `entries()` 메서드를 지원하지 않는다는 점입니다. 따라서 키 전체나 값 전체를 얻는 게 불가능합니다.

`위크맵`은 아래 메서드만 지원합니다.

- `weakMap.get(key)`
- `weakMap.set(key, value)`
- `weakMap.delete(key)`
- `weakMap.has(key)`

이런 제약사항은 기술적인 이유때문에 생겼습니다. 위 예시의 `john`처럼 객체가 모든 참조를 잃게 되면, 해당 객체는 자동으로 가비지 컬렉션의 대상이 됩니다. 하지만 *언제* 가비지 컬렉션이 일어나는지는 기술적으로 정확히 알 수 없습니다.

이 시점은 자바스크립트 엔진이 결정합니다. 메모리 청소가 즉시 진행될 수도 있고, 기다렸다 다른 삭제 작업이 있을 때 같이 진행할 수도 있습니다. 따라서 `위크맵`에 요소가 몇 개 들어가있는지는 현시점에선 알 수 가 없습니다. 게다가 엔진은 필요없는 요소를 한꺼번에 지울 수도 있고, 부분 부분 지울수도 있기 때문에 요소 전체에 무언가를 하는 메서드를 지원하지 않게 된 것입니다.

그럼 위크맵을 어떤 용도로 사용해야 하는 걸까요?

객체 안에 무언가를 저장하고자 하는데, 이 무언가를 객체가 존재하는 동안에만 유지하려는 경우에 사용할 수 있습니다. 다만 이때, 객체에 무언갈 저장하려 한다는 사실이 객체가 메모리에 남아있도록 강제하진 않습니다.

```js
weakMap.set(john, "비밀문서");
// john이 사망하면, 비밀문서는 자동으로 파기됩니다.
```

이렇게 위크맵은 객체를 저장하는 주 저장소(main storage)가 어딘가 있고, 객체가 살아있는 동안에만 유효한 추가 정보를 보존하려는 경우 유용합니다.

예시를 살펴봅시다.

사용자당 방문 횟수를 저장하려는 경우를 가정해 봅시다. 여기에 더하여, 특정 사용자가 시스템에서 탈퇴하면 해당 사용자의 방문 횟수 정보를 저장할 필요가 없다고 해 봅시다. 사용자 객체를 키, 방문 횟수를 값으로 하는 맵을 사용하는 걸 떠올리셨을 겁니다. 

구체적으론 아래와 같이 사용자를 계속 추적하다, 사용자가 탈퇴하면 맵을 수동으로 비우는 방법을 사용할 수 있겠네요.

```js run
let john = { name: "John" };

// 맵: 사용자 => 방문 횟수
let visitsCountMap = new Map();

// john이 맵의 키가 됩니다.
visitsCountMap.set(john, 123);

// john이 탈퇴해서 정보를 저장할 필요가 없어집니다.
john = null;

*!*
// 여전히 맵에 해당 정보가 남아있어서, 직접 삭제해줘야합니다!
*/!*
alert( visitsCountMap.size ); // 1
// 맵이 john을 키로 사용하고 있기 때문에, john은 여전히 메모리에 남습니다.
```

이번엔 `위크맵`을 사용하여 해당 요구 사항을 구현해 봅시다.

```js
let john = { name: "John" };

let visitsCountMap = new WeakMap();

visitsCountMap.set(john, 123);

// john이 탈퇴해서 정보를 저장할 필요가 없어집니다.
john = null;

// 위크맵을 제외하곤 john과 연관된 것이 없습니다.
// 따라서 객체 john은 메모리와 visitsCountMap에서 자동으로 지워집니다.
```

일반적인 `맵`을 사용하면, 탈퇴한 사용자의 정보를 지우는 게 성가십니다. 주 저장소(변수나 배열 등)에서 해당 사용자를 지워야 할 뿐만 아니라, `visitsCountMap` 같은 추가 저장소에 저장된 정보도 지워줘야 하죠. 사용자 관리에 대한 코드와 추가 정보에 대한 코드가 따로 관리되고 있는 상황에서, 추가 정보를 담당하는 코드가 사용자 삭제 여부를 알 수 없는 경우라면 문제는 더 까다로워집니다.  

```summary
`위크맵`은 자동으로 가비지 컬렉션이 진행됩니다. 위 예제의 방문 횟수와 같은 정보는 키로 사용된 객체가 살아있을 때까지만 메모리에 남아있습니다.
```

이제 `위크셋`에 대해 알아봅시다.
 
- `Set`과 유사합니다. 다만, `위크셋`은 객체만 포함할 수 있습니다. 원시값은 허용하지 않습니다.
- 셋 안의 객체는 도달 가능할 때만 존재합니다.
- `Set`과 마찬가지로 메서드 `add`, `has`, `delete`를 지원합니다. 하지만 `size`, `keys()`, 다른 반복작업에 관한 메서드는 쓸 수 없습니다.

아래 예시는 메시지를 읽었는지 안 읽었는지를 추적하기 위한 용도로 위크셋을 사용하고 있습니다.

```js
let messages = [
    {text: "Hello", from: "John"},
    {text: "How goes?", from: "John"},
    {text: "See you soon", from: "Alice"}
];

// 배열 요소(총 3개의 메시지)로 위크셋을 채웁니다.
let unreadSet = new WeakSet(messages);

// 읽지 않은 메시지를 확인하기 위해 unreadSet을 사용합니다.
alert(unreadSet.has(messages[1])); // true

// 메시지를 읽으면 unreadSet에서 해당 메시지를 삭제합니다.
unreadSet.delete(messages[1]); // true

// 첫 번째 메시지를 지웁니다. 이때, `위크셋`도 자동으로 청소됩니다.
messages.shift();

*!*
// unreadSet을 비워줄 필요가 없습니다. 이제 unreadSet엔 2개의 메시지가 남아있게됩니다.
*/!*
// (다만, 언제 자바스크립트 엔진이 unreadSet을 갱신할지는 정확히 알 수 없습니다.)
```

`WeakMap`과 `WeakSet`의 가장 큰 단점은 요소에 반복 작업을 할 수 없다는 점입니다. 해당 자료구조 안의 모든 요소를 한 번에 가지고 오는 것도 불가능하죠. 어찌 보면 불편한 제약사항입니다. 하지만 이런 제약이 `WeakMap/WeakSet`이 하는 주요 작업을 방해하진 않습니다. 객체가 별도로 관리 및 저장되고 있는 상황에서, "추가" 자료를 저장해주는 공간이라는 본질에 영향을 주지 않죠.     

## 요약

[맵(Map)](mdn:js/Map)은 `객체`와 같이 키를 가진 데이터가 저장된 컬렉션입니다. `맵`의 키엔 다양한 자료형 허용된다는 점이 객체와 다릅니다.

일반적인 컬렉션:
- `맵` --  키를 가진 데이터가 저장된 컬렉션.

    일반 `객체`와 다른점:

    - 키의 타입에 제약이 없습니다. 객체도 키가 될 수 있습니다.
    - 반복작업 시 데이터가 삽입된 순서를 기준삼아 작업을 수행합니다.
    - `size` 프로퍼티 이외에 유용한 추가 메서드가 있습니다.

- `셋` -- 중복을 허용하지 않는 값의 컬렉션.

    - 배열과는 달리, 요소의 순서를 바꾸는게 허용되지 않습니다.
    - 데이터의 삽입 순서가 그대로 유지됩니다.

가비지 컬렉션을 허용하는 컬렉션:

- `위크맵` -- `맵`의 변종으로, 키는 반드시 객체여야 합니다. 키를 참조하는 값이 없는 경우 해당 키(객체)는 가비지 컬렉션의 대상이 됩니다.

    - 위크맵 전체를 대상으로 하는 연산을 지원하지 않습니다. 따라서 `size` 프로퍼티나, `clear()` 메서드, 또는 반복 작업 관련 메서드를 쓸 수 없습니다.

- `위크셋` -- `셋`의 변종으로, 객체만 셋의 요소가 될 수 있습니다. 요소인 객체가 참조하는 것이 없는 경우 해당 객체는 가비지 컬렉션의 대상이 됩니다.

`WeakMap` and `WeakSet` are used as "secondary" data structures in addition to the "main" object storage. Once the object is removed from the main storage, if it is only found in the `WeakMap/WeakSet`, it will be cleaned up automatically.
