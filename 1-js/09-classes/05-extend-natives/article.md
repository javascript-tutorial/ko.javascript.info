
# 내장 클래스 확장하기

배열, 맵 같은 내장 클래스도 확장 가능합니다.

아래 예시에서 `PowerArray`는 기본 `Array`를 상속받아 만들었습니다.

```js run
// 메서드 하나를 추가합니다(더 많이 추가하는 것도 가능).
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }
}

let arr = new PowerArray(1, 2, 5, 10, 50);
alert(arr.isEmpty()); // false

let filteredArr = arr.filter(item => item >= 10);
alert(filteredArr); // 10, 50
alert(filteredArr.isEmpty()); // false
```

뭔가 흥미로운 점이 하나 보이네요. `filter`, `map` 등의 내장 메서드가 상속받은 클래스인 `PowerArray`의 인스턴스(객체)를 반환합니다. 이 객체를 구현할 땐 내부에서 객체의 `constructor` 프로퍼티를 사용합니다.

따라서 아래와 같은 관계를 갖습니다.
```js
arr.constructor === PowerArray
```

`arr.filter()`가 호출될 때, 내부에선 기본 `Array`가 아닌 `arr.constructor`를 기반으로 새로운 배열이 만들어지고 여기에 필터 후 결과가 담깁니다. 이렇게 되면 `PowerArray`에 구현된 메서드를 사용할 수 있다는 장점이 생깁니다.

물론 동작 방식을 변경할 수 있습니다.

특수 정적 getter인 `Symbol.species`를 클래스에 추가할 수 있는데, `Symbol.species`가 있으면 `map`, `filter` 등의 메서드를 호출할 때 만들어지는 개체의 생성자를 지정할 수 있습니다. 원하는 생성자를 반환하기만 하면 되죠. 

`map`이나 `filter`같은 내장 메서드가 일반 배열을 반환하도록 하려면 아래 예시처럼 `Symbol.species`가 `Array`를 반환하도록 해주면 됩니다.

```js run
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }

*!*
  // 내장 메서드는 반환 값에 명시된 클래스를 생성자로 사용합니다.
  static get [Symbol.species]() {
    return Array;
  }
*/!*
}

let arr = new PowerArray(1, 2, 5, 10, 50);
alert(arr.isEmpty()); // false

// filter는 arr.constructor[Symbol.species]를 생성자로 사용해 새로운 배열을 만듭니다.
let filteredArr = arr.filter(item => item >= 10);

*!*
// filteredArr는 PowerArray가 아닌 Array의 인스턴스입니다.
*/!*
alert(filteredArr.isEmpty()); // Error: filteredArr.isEmpty is not a function
```

보시다시피 이제 `.filter`가 `Array`를 반환합니다. 따라서 더는 확장 기능이 전달되지 않습니다.

```smart header="다른 컬렉션도 유사하게 동작합니다."
`Map`, `Set` 같은 컬렉션도 위외 같이 동작합니다. 이 컬렉션들도 `Symbol.species`를 사용합니다.
```

## 내장 객체와 정적 메서드 상속

내장 객체는 `Object.keys`, `Array.isArray` 등의 자체 정적 메서드를 갖습니다.

앞서 학습한 바와 같이 네이티브 클래스들은 서로 상속 관계를 맺습니다. `Array`는 `Object`를 상속받죠.

일반적으론 한 클래스가 다른 클래스를 상속받으면 정적 메서드와 그렇지 않은 메서드 모두를 상속받습니다. 이와 관련된 내용은 [](info:static-properties-methods#statics-and-inheritance)에서 자세히 설명해 드린 바 있습니다. 

그런데 내장 클래스는 다릅니다. 내장클래스는 정적 메서드를 상속받지 못합니다.

예를 들어봅시다. `Array`와 `Date`는 모두 `Object`를 상속받기 때문에 두 클래스의 인스턴스에선 `Object.prototype`에 구현된 메서드를 사용할 수 있습니다. 그런데 `Array.[[Prototype]]`은 `Object`를 참조하지 않고, `Date.[[Prototype]]`은 `Object`를 참조하지 않기 때문에 `Array.keys()`나 `Date.keys()`같은 정적 메서드를 인스턴스에서 사용할 수 없습니다.

아래는 `Date`와 `Object`의 관계를 나타낸 그림입니다.

![](object-date-inheritance.svg)

보시다시피 `Date`와 `Object`를 직접 이어주는 링크가 없습니다. `Date`와 `Object`는 독립적이죠. `Date.prototype`만 `Object.prototype`를 상속받습니다.

내장 객체 간의 상속과 `extends`를 사용한 상속의 가장 큰 차이점이 여기에 있습니다.
