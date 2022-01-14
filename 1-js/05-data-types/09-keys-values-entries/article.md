
# Object.keys, values, entries

개별 자료 구조에서 한발 뒤로 물러나 순회(iteration)에 관해 이야기 나누어봅시다.

이전 챕터에서 우리는 순회에 필요한 메서드 `map.keys()`, `map.values()`, `map.entries()`에 대해 알아보았습니다.

이 메서드들은 포괄적인 용도로 만들어졌기 때문에 메서드를 적용할 자료구조는 일련의 합의를 준수해야 합니다. 커스텀 자료구조를 대상으로 순회를 해야 한다면 이 메서드들을 쓰지 못하고 직접 메서드를 구현해야 합니다.

`keys()`, `values()`, `entries()`를 사용할 수 있는 자료구조는 다음과 같습니다.

- `Map`
- `Set`
- `Array`

일반 객체에도 순회 관련 메서드가 있긴 한데, `keys()`, `values()`, `entries()`와는 문법에 차이가 있습니다.

## Object.keys, values, entries

일반 객체엔 다음과 같은 메서드를 사용할 수 있습니다.

- [Object.keys(obj)](mdn:js/Object/keys) -- 객체의 키만 담은 배열을 반환합니다.
- [Object.values(obj)](mdn:js/Object/values) -- 객체의 값만 담은 배열을 반환합니다.
- [Object.entries(obj)](mdn:js/Object/entries) -- `[키, 값]` 쌍을 담은 배열을 반환합니다.

`Map`, `Set`, `Array` 전용 메서드와 일반 객체용 메서드의 차이를 (맵을 기준으로) 비교하면 다음과 같습니다.

|             | 맵              | 객체       |
|-------------|------------------|--------------|
| 호출 문법    | `map.keys()`  | `Object.keys(obj)`(`obj.keys()` 아님) |
| 반환 값      | iterable 객체      | '진짜' 배열                     |

첫 번째 차이는 `obj.keys()`가 아닌 `Object.keys(obj)`를 호출한다는 점입니다.

이렇게 문법이 다른 이유는 유연성 때문입니다. 아시다시피 자바스크립트에선 복잡한 자료구조 전체가 객체에 기반합니다. 그러다 보니 객체 `data`에 자체적으로 `data.values()`라는 메서드를 구현해 사용하는 경우가 있을 수 있습니다. 이렇게 커스텀 메서드를 구현한 상태라도 `Object.values(data)`같은 형태로 메서드를 호출할 수 있으면 커스텀 메서드와 내장 메서드 둘 다를 사용할 수 있습니다.

두 번째 차이는 메서드 `Object.*`를 호출하면 iterable 객체가 아닌 객체의 한 종류인 배열을 반환한다는 점입니다. '진짜' 배열을 반환하는 이유는 하위 호환성 때문입니다.

예시:

```js
let user = {
  name: "John",
  age: 30
};
```

- `Object.keys(user) = ["name", "age"]`
- `Object.values(user) = ["John", 30]`
- `Object.entries(user) = [ ["name","John"], ["age",30] ]`

아래 예시처럼 `Object.values`를 사용하면 프로퍼티 값을 대상으로 원하는 작업을 할 수 있습니다.

```js run
let user = {
  name: "Violet",
  age: 30
};

// 값을 순회합니다.
for (let value of Object.values(user)) {
  alert(value); // Violet과 30이 연속적으로 출력됨
}
```

```warn header="Object.keys, values, entries는 심볼형 프로퍼티를 무시합니다."
`for..in` 반복문처럼, Object.keys, Object.values, Object.entries는 키가 심볼형인 프로퍼티를 무시합니다.

대개는 심볼형 키를 연산 대상에 포함하지 않는 게 좋지만, 심볼형 키가 필요한 경우엔 심볼형 키만 배열 형태로 반환해주는 메서드인 [Object.getOwnPropertySymbols](mdn:js/Object/getOwnPropertySymbols)를 사용하면 됩니다. `getOwnPropertySymbols` 이외에도 키 *전체*를 배열 형태로 반환하는 메서드인 [Reflect.ownKeys(obj)](mdn:js/Reflect/ownKeys)를 사용해도 괜찮습니다.
```


## 객체 변환하기

객체엔 `map`, `filter` 같은 배열 전용 메서드를 사용할 수 없습니다.

하지만 `Object.entries`와 `Object.fromEntries`를 순차적으로 적용하면 객체에도 배열 전용 메서드 사용할 수 있습니다. 적용 방법은 다음과 같습니다.

1. `Object.entries(obj)`를 사용해 객체의 키-값 쌍이 요소인 배열을 얻습니다.
2. 1.에서 만든 배열에 `map` 등의 배열 전용 메서드를 적용합니다.
3. 2.에서 반환된 배열에 `Object.fromEntries(array)`를 적용해 배열을 다시 객체로 되돌립니다.

이 방법을 사용해 가격 정보가 저장된 객체 prices의 프로퍼티 값을 두 배로 늘려보도록 합시다. 

```js run
let prices = {
  banana: 1,
  orange: 2,
  meat: 4,
};

*!*
let doublePrices = Object.fromEntries(
  // 객체를 배열로 변환해서 배열 전용 메서드인 map을 적용하고 fromEntries를 사용해 배열을 다시 객체로 되돌립니다.
  Object.entries(prices).map(([key, value]) => [key, value * 2])
);
*/!*

alert(doublePrices.meat); // 8
```   

지금 당장은 어렵게 느껴지겠지만 한두 번 위 방법을 적용해 보면 객체에 배열 전용 메서드를 적용하는게 쉬워질 겁니다.
