# Proxy와 Reflect

`Proxy`는 특정 객체를 감싸 프로퍼티 읽기, 쓰기와 같은 객체에 가해지는 작업을 중간에서 가로채는 객체로, 가로채진 작업은 `Proxy` 자체에서 처리되기도 하고, 원래 객체가 처리하도록 그대로 전달되기도 합니다.

프락시는 다양한 라이브러리와 몇몇 브라우저 프레임워크에서 사용되고 있습니다. 이번 챕터에선 프락시를 어떻게 실무에 적용할 수 있을지 다양한 예제를 통해 살펴보도록 하겠습니다. 

문법:

```js
let proxy = new Proxy(target, handler)
```

- `target` -- 감싸게 될 객체로, 함수를 포함한 모든 객체가 가능합니다.
- `handler` -- 동작을 가로채는 메서드인 '트랩(trap)'이 담긴 객체로, 여기서 프락시를 설정합니다(예시: `get` 트랩은 `target`의 프로퍼티를 읽을 때, `set` 트랩은 `target`의 프로퍼티를 쓸 때 활성화됨).

`proxy`에 작업이 가해지고, `handler`에 상응하는 트랩이 있으면 트랩이 실행되어 프락시가 이 작업을 처리할 기회를 얻게 됩니다. 트랩이 없으면 작업은 `target`에 직접 수행됩니다.

먼저, 트랩이 없는 프락시를 사용한 예시를 살펴봅시다.

```js run
let target = {};
let proxy = new Proxy(target, {}); // 빈 핸들러

proxy.test = 5; // 프락시에 값을 씁니다. -- (1)
alert(target.test); // 5, target에 새로운 프로퍼티가 생겼네요!

alert(proxy.test); // 5, 프락시를 사용해 값을 읽을 수도 있습니다. -- (2)

for(let key in proxy) alert(key); // test, 반복도 잘 동작합니다. -- (3)
```

위 예시의 프락시엔 트랩이 없기 때문에 `proxy`에 가해지는 모든 작업은 `target`에 전달됩니다. 

1. `proxy.test=`를 이용해 값을 쓰면 `target`에 새로운 값이 설정됩니다.
2. `proxy.test`를 이용해 값을 읽으면 `target`에서 값을 읽어옵니다.
3. `proxy`를 대상으로 반복 작업을 하면 `target`에 저장된 값이 반환됩니다.

그림에서 볼 수 있듯이 트랩이 없으면 `proxy`는 `target`을 둘러싸는 투명한 래퍼가 됩니다.

![](proxy.svg)  

`Proxy`는 일반 객체와는 다른 행동 양상을 보이는 '특수 객체(exotic object)'입니다. 프로퍼티가 없죠. `handler`가 비어있으면 `Proxy`에 가해지는 작업은 `target`에 곧바로 전달됩니다.

자 이제 트랩을 추가해 `Proxy`의 기능을 활성화해봅시다.

그 전에 먼저, 트랩을 사용해 가로챌 수 있는 작업은 무엇이 있는지 알아봅시다.

객체에 어떤 작업을 할 땐, 자바스크립트 명세서에 정의된 '내부 메서드(internal method)'가 깊숙한 곳에서 관여합니다. 프로퍼티를 읽을 땐 `[[Get]]`이라는 내부 메서드가, 프로퍼티에 쓸 땐 `[[Set]]`이라는 내부 메서드가 관여하게 되죠. 이런 내부 메서드들은 명세서에만 정의된 메서드이기 때문에 개발자가 코드를 사용해 호출할 순 없습니다.

프락시의 트랩은 내부 메서드의 호출을 가로챕니다. 프락시가 가로채는 내부 메서드 리스트는 [명세서](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)에서 확인할 수 있는데, 아래 표에도 이를 정리해 놓았습니다.

모든 내부 메서드엔 대응하는 트랩이 있습니다. `new Proxy`의 `handler`에 매개변수로 추가할 수 있는 메서드 이름은 아래 표의 '핸들러 메서드' 열에서 확인하실 수 있습니다.

| 내부 메서드 | 핸들러 메서드 | 작동 시점 |
|-----------------|----------------|-------------|
| `[[Get]]` | `get` | 프로퍼티를 읽을 때 |
| `[[Set]]` | `set` | 프로퍼티에 쓸 때 |
| `[[HasProperty]]` | `has` | `in` 연산자가 동작할 때 |
| `[[Delete]]` | `deleteProperty` | `delete` 연산자가 동작할 때 |
| `[[Call]]` | `apply` | 함수를 호출할 때 |
| `[[Construct]]` | `construct` | `new` 연산자가 동작할 때 |
| `[[GetPrototypeOf]]` | `getPrototypeOf` | [Object.getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) |
| `[[SetPrototypeOf]]` | `setPrototypeOf` | [Object.setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) |
| `[[IsExtensible]]` | `isExtensible` | [Object.isExtensible](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible) |
| `[[PreventExtensions]]` | `preventExtensions` | [Object.preventExtensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions) |
| `[[DefineOwnProperty]]` | `defineProperty` | [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty), [Object.defineProperties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) |
| `[[GetOwnProperty]]` | `getOwnPropertyDescriptor` | [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor), `for..in`, `Object.keys/values/entries` |
| `[[OwnPropertyKeys]]` | `ownKeys` | [Object.getOwnPropertyNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames), [Object.getOwnPropertySymbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols), `for..in`, `Object/keys/values/entries` |

```warn header="규칙"
내부 메서드나 트랩을 쓸 땐 자바스크립트에서 정한 몇 가지 규칙(invariant)을 반드시 따라야 합니다.

대부분의 조건은 반환 값과 관련되어있습니다.
- 값을 쓰는 게 성공적으로 처리되었으면 `[[Set]]`은 반드시 `true`를 반환해야 합니다. 그렇지 않은 경우는 `false`를 반환해야 합니다.
- 값을 지우는 게 성공적으로 처리되었으면 `[[Delete]]`는 반드시 `true`를 반환해야 합니다. 그렇지 않은 경우는 `false`를 반환해야 합니다.
- 기타 등등(아래 예시를 통해 더 살펴보겠습니다.)

이 외에 다른 조건도 있습니다.
- 프락시 객체를 대상으로 `[[GetPrototypeOf]]`가 적용되면 프락시 객체의 타깃 객체에 `[[GetPrototypeOf]]`를 적용한 것과 동일한 값이 반환되어야 합니다. 프락시의 프로토타입을 읽는 것은 타깃 객체의 프로토타입을 읽는 것과 동일해야 하죠. 

트랩이 연산을 가로챌 땐 위에서 언급한 규칙을 따라야 하죠.

규칙은 자바스크립트가 일관된 동작을 하고 잘못된 동작이 있으면 이를 고쳐주는 역할을 합니다. 규칙 목록은 [명세서](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)에서 확인할 수 있습니다. 이상한 짓을 하지 않는 이상 이 규칙을 어길 일은 거의 없습니다.
```

자, 이제 본격적으로 실용적인 예시들을 살펴보면서 프락시 객체가 어떻게 동작하는지 알아봅시다.

## 'get' 트랩으로 프로퍼티 기본값 설정하기

가장 흔히 볼 수 있는 트랩은 프로퍼티를 읽거나 쓸 때 사용되는 트랩입니다.

프로퍼티 읽기를 가로채려면 `handler`에 `get(target, property, receiver)` 메서드가 있어야 합니다.

`get`메서드는 프로퍼티를 읽으려고 할 때 작동합니다. 인수는 다음과 같습니다.

- `target` -- 동작을 전달할 객체로 `new Proxy`의 첫 번째 인자입니다.
- `property` -- 프로퍼티 이름
- `receiver` -- 타깃 프로퍼티가 getter라면 `receiver`는 getter가 호출될 때 `this` 입니다. 대게는 `proxy` 객체 자신이 `this`가 됩니다. 프락시 객체를 상속받은 객체가 있다면 해당 객체가 `this`가 되기도 하죠. 지금 당장은 이 인수가 필요 없으므로 더 자세한 내용은 나중에 다루도록 하겠습니다.

`get`을 활용해 객체에 기본값을 설정해보겠습니다.

예시에서 만들 것은, 존재하지 않는 요소를 읽으려고 할 때 기본값 `0`을 반환해주는 배열입니다.

존재하지 않는 요소를 읽으려고 하면 배열은 원래 `undefined`을 반환하는데, 예시에선 배열(객체)을 프락시로 감싸서 존재하지 않는 요소(프로퍼티)를 읽으려고 할 때 `0`이 반환되도록 해보겠습니다.

```js run
let numbers = [0, 1, 2];

numbers = new Proxy(numbers, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 0; // 기본값
    }
  }
});

*!*
alert( numbers[1] ); // 1
alert( numbers[123] ); // 0 (해당하는 요소가 배열에 없으므로 0이 반환됨)
*/!*
```

예시를 통해 알 수 있듯이 `get`을 사용해 트랩을 만드는 건 상당히 쉽습니다.

`Proxy`를 사용하면 '기본' 값 설정 로직을 원하는 대로 구현할 수 있죠.

구절과 번역문이 저장되어있는 사전이 있다고 가정해봅시다.

```js run
let dictionary = {
  'Hello': '안녕하세요',
  'Bye': '안녕히 가세요'
};

alert( dictionary['Hello'] ); // 안녕하세요
alert( dictionary['Welcome'] ); // undefined
```

지금 상태론 `dictionary`에 없는 구절에 접근하면 `undefined`가 반환됩니다. 사전에 없는 구절을 검색하려 했을 때 `undefined`가 아닌 구절 그대로를 반환해주는 게 좀 더 나을 것 같다는 생각이 드네요.

`dictionary`를 프락시로 감싸서 프로퍼티를 읽으려고 할 때 이를 프락시가 가로채도록 하면 우리가 원하는 기능을 구현할 수 있습니다.

```js run
let dictionary = {
  'Hello': '안녕하세요',
  'Bye': '안녕히 가세요'
};

dictionary = new Proxy(dictionary, {
*!*
  get(target, phrase) { // 프로퍼티를 읽기를 가로챕니다.
*/!*
    if (phrase in target) { // 조건: 사전에 구절이 있는 경우
      return target[phrase]; // 번역문을 반환합니다
    } else {
      // 구절이 없는 경우엔 구절 그대로를 반환합니다.
      return phrase;
    }
  }
});

// 사전을 검색해봅시다!
// 사전에 없는 구절을 입력하면 입력값이 그대로 반환됩니다.
alert( dictionary['Hello'] ); // 안녕하세요
*!*
alert( dictionary['Welcome to Proxy']); // Welcome to Proxy (입력값이 그대로 출력됨)
*/!*
```

````smart
프락시 객체가 변수를 어떻게 덮어쓰고 있는지 눈여겨보시기 바랍니다.

```js
dictionary = new Proxy(dictionary, ...);
```

타깃 객체의 위치와 상관없이 프락시 객체는 타깃 객체를 덮어써야만 합니다. 객체를 프락시로 감싼 이후엔 절대로 타깃 객체를 참조하는 코드가 없어야 합니다. 그렇지 않으면 엉망이 될 확률이 아주 높아집니다.
````

## 'set' 트랩으로 프로퍼티 값 검증하기 

숫자만 저장할 수 있는 배열을 만들고 싶다고 가정해봅시다. 숫자형이 아닌 값을 추가하려고 하면 에러가 발생하도록 해야겠죠.

프로퍼티에 값을 쓰려고 할 때 이를 가로채는 `set` 트랩을 사용해 이를 구현해보도록 하겠습니다. `set` 메서드의 인수는 아래와 같은 역할을 합니다.

`set(target, property, value, receiver)`:

- `target` -- 동작을 전달할 객체로 `new Proxy`의 첫 번째 인자입니다.
- `property` -- 프로퍼티 이름
- `value` -- 프로퍼티 값
- `receiver` -- `get` 트랩과 유사하게 동작하는 객체로, setter 프로퍼티에만 관여합니다.

우리가 구현해야 할 `set` 트랩은 숫자형 값을 설정하려 할 때만 `true`를, 그렇지 않은 경우엔(`TypeError`가 트리거되고) `false`를 반환하도록 해야 합니다.    

`set` 트랩을 사용해 배열에 추가하려는 값이 숫자형인지 검증해봅시다. 

```js run
let numbers = [];

numbers = new Proxy(numbers, { // (*)
*!*
  set(target, prop, val) { // 프로퍼티에 값을 쓰는 동작을 가로챕니다.
*/!*
    if (typeof val == 'number') {
      target[prop] = val;
      return true;
    } else {
      return false;
    }
  }
});

numbers.push(1); // 추가가 성공했습니다.
numbers.push(2); // 추가가 성공했습니다.
alert("Length is: " + numbers.length); // 2

*!*
numbers.push("test"); // Error: 'set' on proxy
*/!*

alert("윗줄에서 에러가 발생했기 때문에 이 줄은 절대 실행되지 않습니다.");
```

배열 관련 기능들은 여전히 사용할 수 있다는 점에 주목해주시기 바랍니다. `push`를 사용해 배열에 새로운 요소를 추가하고 `length` 프로퍼티는 이를 잘 반영하고 있다는 것을 통해 이를 확인할 수 있었습니다. 프락시를 사용해도 기존에 있던 기능은 절대로 손상되지 않습니다.

`push`나 `unshift` 같이 배열에 값을 추가해주는 메서드들은 내부에서 `[[Set]]`을 사용하고 있기 때문에 메서드를 오버라이드 하지 않아도 프락시가 동작을 가로채고 값을 검증해줍니다.

코드가 깨끗하고 간결해지는 효과가 있죠.

```warn header="`true`를 잊지 말고 반환해주세요."
위에서 언급했듯이 꼭 지켜야 할 규칙이 있습니다.

`set` 트랩을 사용할 땐 값을 쓰는 게 성공했을 때 반드시 `true`를 반환해줘야 합니다.

`true`를 반환하지 않았거나 falsy한 값을 반환하게 되면 `TypeError`가 발생합니다.
```

## 'ownKeys'와 'getOwnPropertyDescriptor'로 반복 작업하기

`Object.keys`, `for..in` 반복문을 비롯한 프로퍼티 순환 관련 메서드 대다수는 내부 메서드 `[[OwnPropertyKeys]]`(트랩 메서드는 `ownKeys`임)를 사용해 프로퍼티 목록을 얻습니다.

그런데 세부 동작 방식엔 차이가 있습니다.
- `Object.getOwnPropertyNames(obj)` -- 심볼형이 아닌 키만 반환합니다.
- `Object.getOwnPropertySymbols(obj)` -- 심볼형 키만 반환합니다.
- `Object.keys/values()` -- `enumerable` 플래그가 `true`이면서 심볼형이 아닌 키나 심볼형이 아닌 키에 해당하는 값 전체를 반환합니다(프로퍼티 플래그에 관한 내용은 <info:property-descriptors>에서 찾아보실 수 있습니다).
- `for..in` 반복문 -- `enumerable` 플래그가 `true`인 심볼형이 아닌 키, 프로토타입 키를 순회합니다.

메서드마다 차이는 있지만 `[[OwnPropertyKeys]]`를 통해 프로퍼티 목록을 얻는다는 점은 동일합니다.

아래 예시에선 `ownKeys` 트랩을 사용해 `_`로 시작하는 프로퍼티는 `for..in` 반복문의 순환 대상에서 제외하도록 해보았습니다. `ownKeys`를 사용했기 때문에 `Object.keys`와 `Object.values`에도 동일한 로직이 적용되는 것을 확인할 수 있습니다.

```js run
let user = {
  name: "John",
  age: 30,
  _password: "***"
};

user = new Proxy(user, {
*!*
  ownKeys(target) {
*/!*
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// "ownKeys" 트랩은 _password를 건너뜁니다.
for(let key in user) alert(key); // name, age

// 아래 두 메서드에도 동일한 로직이 적용됩니다.
alert( Object.keys(user) ); // name,age
alert( Object.values(user) ); // John,30
```

지금까진 의도한 대로 예시가 잘 동작하네요.

그런데 객체 내에 존재하지 않는 키를 반환하려고 하면 `Object.keys`는 이 키를 제대로 보여주지 않습니다.

```js run
let user = { };

user = new Proxy(user, {
*!*
  ownKeys(target) {
*/!*
    return ['a', 'b', 'c'];
  }
});

alert( Object.keys(user) ); // <빈 문자열>
```

이유가 무엇일까요? 답은 간단합니다. `Object.keys`는 `enumerable` 플래그가 있는 프로퍼티만 반환하기 때문이죠. 이를 확인하기 위해 `Object.keys`는 내부 메서드인 `[[GetOwnProperty]]`를 호출해 모든 프로퍼티의 [설명자](info:property-descriptors)를 확인합니다. 위 예시의 프로퍼티는 설명자가 하나도 없고 `enumerable` 플래그도 없으므로 순환 대상에서 제외되는 것이죠.

`Object.keys` 호출 시 프로퍼티를 반환하게 하려면 `enumerable` 플래그를 붙여줘 프로퍼티가 객체에 존재하도록 하거나 `[[GetOwnProperty]]`가 호출될 때 이를 중간에서 가로채서 설명자 `enumerable: true`를 반환하게 해주면 됩니다.  `getOwnPropertyDescriptor` 트랩이 바로 이때 사용되죠.

예시를 살펴봅시다.

```js run
let user = { };

user = new Proxy(user, {
  ownKeys(target) { // 프로퍼티 리스트를 얻을 때 딱 한 번 호출됩니다.
    return ['a', 'b', 'c'];
  },

  getOwnPropertyDescriptor(target, prop) { // 모든 프로퍼티를 대상으로 호출됩니다.
    return {
      enumerable: true,
      configurable: true
      /* 이 외의 플래그도 반환할 수 있습니다. "value:..."도 가능하죠. */
    };
  }

});

alert( Object.keys(user) ); // a, b, c
```

객체에 프로퍼티가 없을 때 `[[GetOwnProperty]]`만 가로채면 된다는 점을 다시 한번 상기하시기 바랍니다.

## 'deleteProperty'와 여러 트랩을 사용해 프로퍼티 보호하기

`_`(밑줄)이 앞에 붙은 프로퍼티나 메서드는 내부용으로만 쓰도록 하는 컨벤션은 널리 사용되고 있는 컨벤션 중 하나입니다. `_`이 앞에 붙으면 객체 바깥에선 이 프로퍼티에 접근해선 안 됩니다. 

그런데 기술적으론 가능하죠.

```js run
let user = {
  name: "John",
  _password: "비밀"
};

alert(user._password); // 비밀  
```

프락시를 사용해 `_`로 시작하는 프로퍼티에 접근하지 못하도록 막아봅시다.

원하는 기능을 구현하려면 아래와 같은 트랩이 필요합니다.
- `get` -- 프로퍼티를 읽으려고 하면 에러를 던져줌
- `set` -- 프로퍼티에 쓰려고 하면 에러를 던져줌
- `deleteProperty` -- 프로퍼티를 지우려고 하면 에러를 던져줌
- `ownKeys` -- `for..in`이나 `Object.keys`같은 프로퍼티 순환 메서드를 사용할 때 `_`로 시작하는 메서드는 제외함

구현 결과는 다음과 같습니다.

```js run
let user = {
  name: "John",
  _password: "***"
};

user = new Proxy(user, {
*!*
  get(target, prop) {
*/!*
    if (prop.startsWith('_')) {
      throw new Error("접근이 제한되어있습니다.");
    }
    let value = target[prop];
    return (typeof value === 'function') ? value.bind(target) : value; // (*)
  },
*!*
  set(target, prop, val) { // 프로퍼티 쓰기를 가로챕니다.
*/!*
    if (prop.startsWith('_')) {
      throw new Error("접근이 제한되어있습니다.");
    } else {
      target[prop] = val;
      return true;
    }
  },
*!*
  deleteProperty(target, prop) { // 프로퍼티 삭제를 가로챕니다.
*/!*  
    if (prop.startsWith('_')) {
      throw new Error("접근이 제한되어있습니다.");
    } else {
      delete target[prop];
      return true;
    }
  },
*!*
  ownKeys(target) { // 프로퍼티 순회를 가로챕니다.
*/!*
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// "get" 트랩이 _password 읽기를 막습니다.
try {
  alert(user._password); // Error: 접근이 제한되어있습니다.
} catch(e) { alert(e.message); }

// "set" 트랩이 _password에 값을 쓰는것을 막습니다.
try {
  user._password = "test"; // Error: 접근이 제한되어있습니다.
} catch(e) { alert(e.message); }

// "deleteProperty" 트랩이 _password 삭제를 막습니다.
try {
  delete user._password; // Error: 접근이 제한되어있습니다.
} catch(e) { alert(e.message); }

// "ownKeys" 트랩이 순회 대상에서 _password를 제외시킵니다.
for(let key in user) alert(key); // name
```

`get` 트랩의 `(*)`로 표시한 줄을 눈여겨 봐주시기 바랍니다.

```js
get(target, prop) {
  // ...
  let value = target[prop];
*!*
  return (typeof value === 'function') ? value.bind(target) : value; // (*)
*/!*
}
```

함수인지 여부를 확인하여 `value.bind(target)`를 호출 하고 있네요. 왜그럴까요?

이유는 `user.checkPassword()`같은 객체 메서드가 `_password`에 접근할 수 있도록 해주기 위해서입니다.

```js
user = {
  // ...
  checkPassword(value) {
    // checkPassword(비밀번호 확인)는 _password를 읽을 수 있어야 합니다.
    return value === this._password;
  }
}
```


`user.checkPassword()`를 호출하면 점 앞의 객체가 `this`가 되므로 프락시로 감싼 `user`에 접근하게 되는데, `this._password`는 `get` 트랩(프로퍼티를 읽으려고 하면 동작함)을 활성화하므로 에러가 던져집니다.

`(*)`로 표시한 줄에선 객체 메서드의 컨텍스트를 원본 객체인 `target`에 바인딩시켜준 이유가 바로 여기에 있습니다. `checkPassword()`를 호출할 땐 언제든 트랩 없이 `target`이 `this`가 되게 하기 위해서이죠.

이 방법은 대부분 잘 작동하긴 하는데 메서드가 어딘가에서 프락시로 감싸지 않은 객체를 넘기게 되면 엉망진창이 되어버리기 때문에 이상적인 방법은 아닙니다. 기존 객체와 프락시로 감싼 객체가 어디에 있는지 파악할 수 없기 때문이죠.

한 객체를 여러 번 프락시로 감쌀 경우 각 프락시마다 객체에 가하는 '수정'이 다를 수 있다는 점 또한 문제입니다. 프락시로 감싸지 않은 객체를 메서드에 넘기는 경우처럼 예상치 않은 결과가 나타날 수 있습니다.

따라서 이런 형태의 프락시는 어디서든 사용해선 안 됩니다.

```smart header="클래스와 private 프로퍼티"
모던 자바스크립트 엔진은 클래스 내 private 프로퍼티를 사용할 수 있게 해줍니다. private 프로퍼티는 프로퍼티 앞에 `#`을 붙이면 만들 수 있는데, 자세한 내용은 <info:private-protected-properties-methods>에서 찾아볼 수 있습니다. private 프로퍼티를 사용하면 프락시 없이도 프로퍼티를 보호할 수 있습니다.

그런데 private 프로퍼티는 상속이 불가능하다는 단점이 있습니다.
```

## 'has' 트랩으로 '범위` 내 여부 확인하기 

좀 더 많은 예시를 살펴봅시다.

범위를 담고 있는 객체가 있습니다.

```js
let range = {
  start: 1,
  end: 10
};
```

`in` 연산자를 사용해 특정 숫자가 `range` 내에 있는지 확인해봅시다.

`has` 트랩은 `in` 호출을 가로챕니다.

`has(target, property)`

- `target` -- `new Proxy`의 첫 번째 인자로 전달되는 타깃 객체
- `property` -- 프로퍼티 이름

예시:

```js run
let range = {
  start: 1,
  end: 10
};

range = new Proxy(range, {
*!*
  has(target, prop) {
*/!*
    return prop >= target.start && prop <= target.end
  }
});

*!*
alert(5 in range); // true
alert(50 in range); // false
*/!*
```

정말 멋진 편의 문법이지 않나요? 구현도 아주 간단합니다.

## 'apply' 트랩으로 함수 감싸기 [#proxy-apply]

함수 역시 프락시로 감쌀 수 있습니다.

`apply(target, thisArg, args)` 트랩은 프락시를 함수처럼 호출하려고 할 때 동작합니다.

- `target` -- 타깃 객체(자바스크립트에서 함수는 객체임)
- `thisArg` -- `this`의 값
- `args` -- 인수 목록

<info:call-apply-decorators> 챕터에서 살펴보았던 `delay(f, ms)` 데코레이터(decorator)를 떠올려봅시다.

해당 챕터 에선 프락시를 사용하지 않고 데코레이터를 구현하였습니다. `delay(f, ms)`를 호출하면 함수가 반환되는데, 이 함수는 함수 `f`가 `ms`밀리초 후에 호출되도록 해주었죠.  

함수를 기반으로 작성했던 데코레이터는 다음과 같습니다.

```js run
function delay(f, ms) {
  // 지정한 시간이 흐른 다음에 f 호출을 전달해주는 래퍼 함수를 반환합니다.
  return function() { // (*)
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// 래퍼 함수로 감싼 다음에 sayHi를 호출하면 3초 후 함수가 호출됩니다.
sayHi = delay(sayHi, 3000);

sayHi("John"); // Hello, John! (3초 후)
```

이미 살펴봤듯이 이 데코레이터는 대부분의 경우 잘 동작합니다. `(*)`로 표시 한곳의 래퍼 함수는 일정 시간 후 함수를 호출할 수 있게 해주죠. 

그런데 래퍼 함수는 프로퍼티 읽기/쓰기 등의 연산은 전달해주지 못합니다. 래퍼 함수로 감싸고 난 다음엔 기존 함수의 프로퍼티(`name`, `length` 등) 정보가 사라집니다.

```js run
function delay(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

*!*
alert(sayHi.length); // 1 (함수 정의부에서 명시한 인수의 개수)
*/!*

sayHi = delay(sayHi, 3000);

*!*
alert(sayHi.length); // 0 (래퍼 함수 정의부엔 인수가 없음)
*/!*
```

`Proxy` 객체는 타깃 객체에 모든 것을 전달해주므로 훨씬 강력합니다.

래퍼 함수 대신 `Proxy`를 사용해봅시다.

```js run
function delay(f, ms) {
  return new Proxy(f, {
    apply(target, thisArg, args) {
      setTimeout(() => target.apply(thisArg, args), ms);
    }
  });
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

sayHi = delay(sayHi, 3000);

*!*
alert(sayHi.length); // 1 (*) 프락시는 "get length" 연산까지 타깃 객체에 전달해줍니다.
*/!*

sayHi("John"); // Hello, John! (3초 후)
```

결과는 같지만 이번엔 호출뿐만 아니라 프락시에 가하는 모든 연산이 원본 함수에 전달된 것을 확인할 수 있습니다. 원본 함수를 프락시로 감싼 이후엔 `(*)`로 표시한 줄에서 `sayHi.length`가 제대로 된 결과를 반환하고 있는 것을 확인할 수 있습니다.

좀 더 성능이 좋은 래퍼를 갖게 되었네요.

이 외에도 다양한 트랩이 존재합니다. 트랩 전체 리스트는 상단부 표에 정리되어있으니 확인하시면 됩니다. 지금까지 소개해 드린 예시를 응용하면 충분히 프락시를 활용하실 수 있을 겁니다. 

## Reflect

`Reflect` is a built-in object that simplifies creation of `Proxy`.

It was said previously that internal methods, such as `[[Get]]`, `[[Set]]` and others are specifiction only, they can't be called directly.

The `Reflect` object makes that somewhat possible. Its methods are minimal wrappers around the internal methods.

Here are examples of operations and `Reflect` calls that do the same:

| Operation |  `Reflect` call | Internal method |
|-----------------|----------------|-------------|
| `obj[prop]` | `Reflect.get(obj, prop)` | `[[Get]]` |
| `obj[prop] = value` | `Reflect.set(obj, prop, value)` | `[[Set]]` |
| `delete obj[prop]` | `Reflect.deleteProperty(obj, prop)` | `[[HasProperty]]` |
| `new F(value)` | `Reflect.construct(F, value)` | `[[Construct]]` |
| ... | ... | ... |

For example:

```js run
let user = {};

Reflect.set(user, 'name', 'John');

alert(user.name); // John
```

In particular, `Reflect` allows us to call operators (`new`, `delete`...) as functions (`Reflect.construct`, `Reflect.deleteProperty`, ...). That's an interesting capability, but here another thing is important.

**For every internal method, trappable by `Proxy`, there's a corresponding method in `Reflect`, with the same name and arguments as `Proxy` trap.**

So we can use `Reflect` to forward an operation to the original object.

In this example, both traps `get` and `set` transparently (as if they didn't exist) forward reading/writing operations to the object, showing a message:

```js run
let user = {
  name: "John",
};

user = new Proxy(user, {
  get(target, prop, receiver) {
    alert(`GET ${prop}`);
*!*
    return Reflect.get(target, prop, receiver); // (1)
*/!*
  },
  set(target, prop, val, receiver) {
    alert(`SET ${prop}=${val}`);
*!*
    return Reflect.set(target, prop, val, receiver); // (2)
*/!*
  }
});

let name = user.name; // shows "GET name"
user.name = "Pete"; // shows "SET name=Pete"
```

Here:

- `Reflect.get` reads an object property.
- `Reflect.set` writes an object property and returns `true` if successful, `false` otherwise.

That is, everything's simple: if a trap wants to forward the call to the object, it's enough to call `Reflect.<method>` with the same arguments.

In most cases we can do the same without `Reflect`, for instance, reading a property `Reflect.get(target, prop, receiver)` can be replaced by `target[prop]`. There are important nuances though.

### Proxying a getter

Let's see an example that demonstrates why `Reflect.get` is better. And we'll also see why `get/set` have the fourth argument `receiver`, that we didn't use before.

We have an object `user` with `_name` property and a getter for it.

Here's a proxy around it:

```js run
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

*!*
let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop];
  }
});
*/!*

alert(userProxy.name); // Guest
```

The `get` trap is 'transparent' here, it returns the original property, and doesn't do anything else. That's enough for our example.

Everything seems to be all right. But let's make the example a little bit more complex.

After inheriting another object `admin` from `user`, we can observe the incorrect behavior:

```js run
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]; // (*) target = user
  }
});

*!*
let admin = {
  __proto__: userProxy,
  _name: "Admin"
};

// Expected: Admin
alert(admin.name); // outputs: Guest (?!?)
*/!*
```

Reading `admin.name` should return `"Admin"`, not `"Guest"`!

What's the matter? Maybe we did something wrong with the inheritance?

But if we remove the proxy, then everything will work as expected.

The problem is actually in the proxy, in the line `(*)`.

1. When we read `admin.name`, as `admin` object doesn't have such own property, the search goes to its prototype.
2. The prototype is `userProxy`.
3. When reading `name` property from the proxy, its `get` trap triggers and returns it from the original object as `target[prop]` in the line `(*)`.

    A call to `target[prop]`, when `prop` is a getter, runs its code in the context `this=target`. So the result is `this._name` from the original object `target`, that is: from `user`.

To fix such situations, we need `receiver`, the third argument of `get` trap. It keeps the correct `this` to be passed to a getter. In our case that's `admin`.

How to pass the context for a getter? For a regular function we could use `call/apply`, but that's a getter, it's not 'called', just accessed.

`Reflect.get` can do that. Everything will work right if we use it.

Here's the corrected variant:

```js run
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) { // receiver = admin
*!*
    return Reflect.get(target, prop, receiver); // (*)
*/!*
  }
});


let admin = {
  __proto__: userProxy,
  _name: "Admin"
};

*!*
alert(admin.name); // Admin
*/!*
```

Now `receiver` that keeps a reference to the correct `this` (that is `admin`), is passed to the getter using `Reflect.get` in the line `(*)`.

We can rewrite the trap even shorter:

```js
get(target, prop, receiver) {
  return Reflect.get(*!*...arguments*/!*);
}
```


`Reflect` calls are named exactly the same way as traps and accept the same arguments. They were specifically designed this way.

So, `return Reflect...` provides a safe no-brainer to forward the operation and make sure we don't forget anything related to that.

## Proxy limitations

Proxies provide a unique way to alter or tweak the behavior of the existing objects at the lowest level. Still, it's not perfect. There are limitations.

### Built-in objects: Internal slots

Many built-in objects, for example `Map`, `Set`, `Date`, `Promise` and others make use of so-called 'internal slots'.

These are like properties, but reserved for internal, specification-only purposes. For instance, `Map` stores items in the internal slot `[[MapData]]`. Built-in methods access them directly, not via `[[Get]]/[[Set]]` internal methods. So `Proxy` can't intercept that.

Why care? They're internal anyway!

Well, here's the issue. After a built-in object like that gets proxied, the proxy doesn't have these internal slots, so built-in methods will fail.

For example:

```js run
let map = new Map();

let proxy = new Proxy(map, {});

*!*
proxy.set('test', 1); // Error
*/!*
```

Internally, a `Map` stores all data in its `[[MapData]]` internal slot. The proxy doesn't have such a slot. The [built-in method `Map.prototype.set`](https://tc39.es/ecma262/#sec-map.prototype.set) method tries to access the internal property `this.[[MapData]]`, but because `this=proxy`, can't find it in `proxy` and just fails.

Fortunately, there's a way to fix it:

```js run
let map = new Map();

let proxy = new Proxy(map, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
*!*
    return typeof value == 'function' ? value.bind(target) : value;
*/!*
  }
});

proxy.set('test', 1);
alert(proxy.get('test')); // 1 (works!)
```

Now it works fine, because `get` trap binds function properties, such as `map.set`, to the target object (`map`) itself.

Unlike the previous example, the value of `this` inside `proxy.set(...)` will be not `proxy`, but the original `map`. So when the internal implementation of `set` tries to access `this.[[MapData]]` internal slot, it succeeds.

```smart header="`Array` has no internal slots"
A notable exception: built-in `Array` doesn't use internal slots. That's for historical reasons, as it appeared so long ago.

So there's no such problem when proxying an array.
```

### Private fields

The similar thing happens with private class fields.

For example, `getName()` method accesses the private `#name` property and breaks after proxying:

```js run
class User {
  #name = "Guest";

  getName() {
    return this.#name;
  }
}

let user = new User();

user = new Proxy(user, {});

*!*
alert(user.getName()); // Error
*/!*
```

The reason is that private fields are implemented using internal slots. JavaScript does not use `[[Get]]/[[Set]]` when accessing them.

In the call `getName()` the value of `this` is the proxied `user`, and it doesn't have the slot with private fields.

Once again, the solution with binding the method makes it work:

```js run
class User {
  #name = "Guest";

  getName() {
    return this.#name;
  }
}

let user = new User();

user = new Proxy(user, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == 'function' ? value.bind(target) : value;
  }
});

alert(user.getName()); // Guest
```

That said, the solution has drawbacks, as explained previously: it exposes the original object to the method, potentially allowing it to be passed further and breaking other proxied functionality.

### Proxy != target

The proxy and the original object are different objects. That's natural, right?

So if we use the original object as a key, and then proxy it, then the proxy can't be found:

```js run
let allUsers = new Set();

class User {
  constructor(name) {
    this.name = name;
    allUsers.add(this);
  }
}

let user = new User("John");

alert(allUsers.has(user)); // true

user = new Proxy(user, {});

*!*
alert(allUsers.has(user)); // false
*/!*
```

As we can see, after proxying we can't find `user` in the set `allUsers`, because the proxy is a different object.

```warn header="Proxies can't intercept a strict equality test `===`"
Proxies can intercept many operators, such as `new` (with `construct`), `in` (with `has`), `delete` (with `deleteProperty`) and so on.

But there's no way to intercept a strict equality test for objects. An object is strictly equal to itself only, and no other value.

So all operations and built-in classes that compare objects for equality will differentiate between the object and the proxy. No transparent replacement here.
```

## Revocable proxies

A *revocable* proxy is a proxy that can be disabled.

Let's say we have a resource, and would like to close access to it any moment.

What we can do is to wrap it into a revocable proxy, without any traps. Such a proxy will forward operations to object, and we can disable it at any moment.

The syntax is:

```js
let {proxy, revoke} = Proxy.revocable(target, handler)
```

The call returns an object with the `proxy` and `revoke` function to disable it.

Here's an example:

```js run
let object = {
  data: "Valuable data"
};

let {proxy, revoke} = Proxy.revocable(object, {});

// pass the proxy somewhere instead of object...
alert(proxy.data); // Valuable data

// later in our code
revoke();

// the proxy isn't working any more (revoked)
alert(proxy.data); // Error
```

A call to `revoke()` removes all internal references to the target object from the proxy, so they are no more connected. The target object can be garbage-collected after that.

We can also store `revoke` in a `WeakMap`, to be able to easily find it by a proxy object:

```js run
*!*
let revokes = new WeakMap();
*/!*

let object = {
  data: "Valuable data"
};

let {proxy, revoke} = Proxy.revocable(object, {});

revokes.set(proxy, revoke);

// ..later in our code..
revoke = revokes.get(proxy);
revoke();

alert(proxy.data); // Error (revoked)
```

The benefit of such an approach is that we don't have to carry `revoke` around. We can get it from the map by `proxy` when needed.

We use `WeakMap` instead of `Map` here because it won't block garbage collection. If a proxy object becomes 'unreachable' (e.g. no variable references it any more), `WeakMap` allows it to be wiped from memory together with its `revoke` that we won't need any more.

## References

- Specification: [Proxy](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots).
- MDN: [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

## Summary

`Proxy` is a wrapper around an object, that forwards operations on it to the object, optionally trapping some of them.

It can wrap any kind of object, including classes and functions.

The syntax is:

```js
let proxy = new Proxy(target, {
  /* traps */
});
```

...Then we should use `proxy` everywhere instead of `target`. A proxy doesn't have its own properties or methods. It traps an operation if the trap is provided, otherwise forwards it to `target` object.

We can trap:
- Reading (`get`), writing (`set`), deleting (`deleteProperty`) a property (even a non-existing one).
- Calling a function (`apply` trap).
- The `new` operator (`construct` trap).
- Many other operations (the full list is at the beginning of the article and in the [docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)).

That allows us to create "virtual" properties and methods, implement default values, observable objects, function decorators and so much more.

We can also wrap an object multiple times in different proxies, decorating it with various aspects of functionality.

The [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) API is designed to complement [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). For any `Proxy` trap, there's a `Reflect` call with same arguments. We should use those to forward calls to target objects.

Proxies have some limitations:

- Built-in objects have "internal slots", access to those can't be proxied. See the workaround above.
- The same holds true for private class fields, as they are internally implemented using slots. So proxied method calls must have the target object as `this` to access them.
- Object equality tests `===` can't be intercepted.
- Performance: benchmarks depend on an engine, but generally accessing a property using a simplest proxy takes a few times longer. In practice that only matters for some "bottleneck" objects though.
