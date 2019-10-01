
# Object.keys, values, entries

개별 자료 구조에서 한 발 물러나서, 순회에 관하여 이야기 나누어봅시다.

이전 챕터에서 `map.keys()`, `map.values()`, `map.entries()` 와 같은 메서드들을 보았습니다.

이러한 메서드들은 일반적이며, 자료 구조를 쓰기 위해 공통 메서드들을 구현하도록 하는 보편적인 합의가 있습니다. 만약 우리가 자신만의 자료 구조를 만들었다고 하더라도, 우리는 마찬가지로 해당 메서드들을 구현해야 합니다.

메서드들은 다음을 지원합니다.

- `Map`
- `Set`
- `Array` (`arr.values()` 제외)

기본 객체 또한 유사한 메서드들을 지원하는데, 문법은 약간 다릅니다.

## Object.keys, values, entries

기본 객체는 다음 메서드들을 지원합니다.

- [Object.keys(obj)](mdn:js/Object/keys) -- 배열의 키들을 반환합니다.
- [Object.values(obj)](mdn:js/Object/values) -- 배열의 값들을 반환합니다.
- [Object.entries(obj)](mdn:js/Object/entries) -- 배열의 `[key, value]` 쌍을 반환합니다.

다음 비교들을 기록해주세요.(예를 들어, map과 비교했습니다)

|             | Map              | Object       |
|-------------|------------------|--------------|
| 호출 문법    | `map.keys()`  | `Object.keys(obj)`, but not `obj.keys()` |
| 리턴 값      | 순회 가능      | "진짜" 배열                     |

첫 번째 차이는 `obj.keys()`가 아니라, `Object.keys(obj)`를 호출해야만 한다는 점입니다.

왜 그럴까요? 그 주된 이유는 유연성에 있습니다. 자바스크립트에서 모든 복잡한 구조체들의 기본은 객체입니다, 기억하세요. 그래서 우리는 자신만의 data.values() 메서드를 구현하는 data 같은 객체를 가질 수 있습니다. 그리고 우린 여전히 해당 메서드를 Object.values(data) 로도 호출 할 수 있구요.

두 번째 차이는 `Object.*` 메서드 들은 순회만 가능한 객체가 아니라 "진짜" 배열 객체들을 반환한다는 것 입니다. 이건 주로 역사적인 이유 때문입니다.

예시 입니다.

```js
let user = {
  name: "John",
  age: 30
};
```

- `Object.keys(user) = ["name", "age"]`
- `Object.values(user) = ["John", 30]`
- `Object.entries(user) = [ ["name","John"], ["age",30] ]`

여기 프로퍼티 값들을 순회하기 위해서 `Object.values` 를 사용한 예제가 있습니다.

```js run
let user = {
  name: "John",
  age: 30
};

// 값들을 순회 합니다.
for (let value of Object.values(user)) {
  alert(value); // John, 그 후에 30
}
```

```warn header="Object.keys/values/entries 는 심볼릭 프로퍼티들을 무시합니다."
`for..in` 반복문 처럼, 이 메서드들은 키 값으로 `Symbol(...)`을 사용하는 프로퍼티들을 무시합니다.

대개는 그게 편리합니다. 만약 우리가 심볼릭 키값을 원하게 된다면, 심볼릭 키값들만 배열로 반환하는 [Object.getOwnPropertySymbols](mdn:js/Object/getOwnPropertySymbols) 가 별도의 메서드로 있습니다. 또는, *모든* 키 값을 반환하는 [Reflect.ownKeys(obj)](mdn:js/Reflect/ownKeys) 메서드도 존재합니다.
```


## 객체 변환하기

객체는 배열에 존재하는 다음과 같은 `map`, `filter` 그리고 기타 다양한 메서드들 보다는 그 종류가 부족합니다.

만약 배열 메서드들을 적용하고 싶다면, `Object.entries`를 뒤따라 `Object.fromEntries`를 사용하여 적용 할 수 있습니다.

1. `obj`로 부터 키, 값의 쌍을 갖는 배열을 얻기 위해 `Object.entries(obj)`를 사용합니다.
2. 넘겨받은 배열로 배열 메서드를 사용합니다.(e.g map)
3. 결과가 나온 배열에 `Object.fromEntries(array)`를 사용해서, 객체로 되돌립니다.

예를 들어, prices 객체를 가지고 있고 각 값을 두 배로 늘린 새로운 객체를 얻고 싶다면 다음과 같습니다.

```js run
let prices = {
  banana: 1,
  orange: 2,
  meat: 4,
};

*!*
let doublePrices = Object.fromEntries(
  // 배열로 변환해서 map을 사용하고 fromEntries에 전달하여 객체로 되돌려 받습니다.
  Object.entries(prices).map(([key, value]) => [key, value * 2])
);
*/!*

alert(doublePrices.meat); // 8
```   

처음 보면 좀 어렵게 느껴질 겁니다. 하지만, 한두 번 써보게 되면 이해하기가 수월할 겁니다.

배열과 객체의 메서드들을 연결하는 방법으로 더 복잡한 변환을 하는 강력한 한 줄 코드를 만들 수 있습니다. 다만, 코드를 이해하기 쉽도록 간결하게 균형을 유지하는 것이 중요합니다.
