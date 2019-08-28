
# Object.keys, values, entries

개별 데이터 구조로부터 한발 물러나서, 순회에 대해 이야기 나누어봅시다.

이전 챕터에서 우리는 `map.keys()`, `map.values()`, `map.entries()` 와 같은 메서드들을 보았습니다.

이런 메서드들은 일반적이고,우리가 데이터 구조를 사용하기 위한 일반적인 합의입니다. 만약 우리가 자신만의 데이터 구조를 만들었다고 하더라도, 우리는 마찬가지로 해당 메서드들을 시행하도록 해야합니다.

메서드들은 다음을 지원합니다:

- `Map`
- `Set`
- `Array` (`arr.values()` 제외)

기본 객체 또한 유사한 메서드들을 지원하는데, 문법은 약간 다릅니다.

## Object.keys, values, entries

기본 객체는 다음 메서드들을 지원합니다:

- [Object.keys(obj)](mdn:js/Object/keys) -- 배열의 키들을 반환합니다.
- [Object.values(obj)](mdn:js/Object/values) -- 배열의 값들을 반환합니다.
- [Object.entries(obj)](mdn:js/Object/entries) -- 배열의 `[key, value]` 쌍을 반환합니다.

다음 비교들을 기록해주세요.(예를 들어, map과 비교했습니다):

|             | Map              | Object       |
|-------------|------------------|--------------|
| 호출 문법    | `map.keys()`  | `Object.keys(obj)`, but not `obj.keys()` |
| 리턴 값      | 순회 가능      | "진짜" 배열                     |

첫번째 차이는 `obj.keys()`가 아니라, `Object.keys(obj)`를 호출해야만 한다는 점입니다.

왜 그럴까요? 그 주된 이유는 유연성에 있습니다. 자바스크립트에서 모든 복잡한 구조체들의 기본은 객체입니다, 기억하세요. 그래서 우리는 자신만의 data.values() 메서드를 구현하는 data 같은 객체를 가질 수 있습니다. 그리고 우린 여전히 해당 메서드를 Object.values(data) 로도 호출 할 수 있구요.

두번째 차이는 `Object.*` 메서드 들은 순회만 가능한 객체가 아니라 "진짜" 배열 객체들을 반환한다는 것 입니다. 이건 주로 역사적인 이유들 때문입니다.

예를 들어보면:

```js
let user = {
  name: "John",
  age: 30
};
```

- `Object.keys(user) = ["name", "age"]`
- `Object.values(user) = ["John", 30]`
- `Object.entries(user) = [ ["name","John"], ["age",30] ]`

여기 프로퍼티 값들을 순회하기 위해서 `Object.values` 를 사용한 예제가 있습니다:

```js run
let user = {
  name: "John",
  age: 30
};

// 값들을 순회한다.
for (let value of Object.values(user)) {
  alert(value); // John, 그 후에 30
}
```

```warn header="Object.keys/values/entries 는 심볼릭 프로퍼티들을 무시합니다."
`for..in` 반복문 처럼, 이 메서드들은 키 값으로 `Symbol(...)`을 사용하는 프로퍼티들을 무시합니다.

대개는 그게 편리합니다. 만약 우리가 심볼릭 키값을 원하게 된다면, 심볼릭 키값들만 배열로 반환하는 [Object.getOwnPropertySymbols](mdn:js/Object/getOwnPropertySymbols) 가 별도의 메서드로 있습니다. 또는, *모든* 키 값을 반환하는 [Reflect.ownKeys(obj)](mdn:js/Reflect/ownKeys) 메서드도 존재합니다.
```


## 객체 변환하기

객체는 배열들에 존재하는 다양한 메서드들 보다는 메서드가 부족합니다., e.g. `map`, `filter` 그리고 기타 등등.

만약 우리가 배열 메서드들을 적용 시키고 싶다면, `Object.entries` 와 `Object.fromEntries`로 배열 메서드를 사용할 수 있습니다:

1. `obj`로 부터 키, 값의 쌍을 갖는 배열을 얻기 위해 `Object.entries(obj)`를 사용합니다.
2. 넘겨받은 배열로 배열 메서드를 사용합니다.(e.g map)
3. 결과가 나온 배열에 `Object.fromEntries(array)`를 사용해서, 객체로 되돌립니다.

다음 처럼, prices 값을 가지고, prices 값을 두배로 할 수 있는 객체가 있습니다:

```js run
let prices = {
  banana: 1,
  orange: 2,
  meat: 4,
};

*!*
let doublePrices = Object.fromEntries(
  // 배열로 변환 후, map을 사용하고, 그 후에, fromEntries 로 객체를 받는다.
  Object.entries(prices).map(([key, value]) => [key, value * 2])
);
*/!*

alert(doublePrices.meat); // 8
```   

처음 보면 좀 어렵게 느껴질 겁니다. 하지만, 한 두번 써보게 되면 이해하기가 수월할 겁니다.

우리는 이러한 방식으로 좀 더 복잡하게 변형해서 강력한 한 줄 메서드들을 만들 수 있습니다. 중요한 건 밸런스를 지키는 것이고,그게 코드를 간결하고 이해하기 쉽게 합니다.
