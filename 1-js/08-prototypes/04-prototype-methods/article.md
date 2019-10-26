
# 프로토타입 메서드와 __proto__가 없는 객체

이 절의 첫 번째 챕터에서 프로토타입을 설정하기 위한 모던한 방법이 있다고 언급했습니다.

`__proto__`는 다소 구식이고 더는 사용하지 말아야 할 것으로 봅니다(자바스크립트 표준 중 브라우저 부분에서).

모던한 방식은 다음과 같습니다.

- [Object.create(proto[, descriptors])](mdn:js/Object/create) -- 인자로 넘긴 `proto`를 `[[Prototype]]`로 하는 빈 객체를 생성합니다. 이때 프로퍼티 설명자를 추가로 넘길 수 있습니다.
- [Object.getPrototypeOf(obj)](mdn:js/Object/getPrototypeOf) -- `obj`의 `[[Prototype]]`을 반환합니다.
- [Object.setPrototypeOf(obj, proto)](mdn:js/Object/setPrototypeOf) -- `obj`의 `[[Prototype]]`을 `proto` 설정합니다.

`__proto__` 대신 이 메서드들을 사용하는 것이 좋습니다.

예시:

```js run
let animal = {
  eats: true
};

// 프로토타입이 animal인 새로운 객체를 생성합니다.
*!*
let rabbit = Object.create(animal);
*/!*

alert(rabbit.eats); // true

*!*
alert(Object.getPrototypeOf(rabbit) === animal); // true
*/!*

*!*
Object.setPrototypeOf(rabbit, {}); // rabbit의 프로토타입을 {}으로 바꿉니다.
*/!*
```

`Object.create`에 프로퍼티 설명자를 선택적으로 전달할 수도 있습니다. 다음과 같이 설명자를 이용해 새로운 객체에 프로퍼티를 추가할 수 있습니다.

```js run
let animal = {
  eats: true
};

let rabbit = Object.create(animal, {
  jumps: {
    value: true
  }
});

alert(rabbit.jumps); // true
```

설명자는 <info:property-descriptors>에서 설명하는 것과 같은 형태로 사용합니다.

`Object.create`를 사용하면 `for..in`을 사용해 프로퍼티를 복사할 때보다 더 효과적으로 객체를 복제할 수 있습니다.

```js
// obj와 완벽하게 동일한 얕은 사본
let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
```

이 호출은 `obj`의 모든 프로퍼티를 포함한 완벽한 사본을 만들어냅니다. 사본은 열거 가능한 프로퍼티와 불가능한 프로퍼티, 데이터 프로퍼티, getter, setter 등 모든 프로퍼티와 올바른 `[[Prototype]]`을 가지게 됩니다.

## 간략한 역사

`[[Prototype]]`을 다루기 위한 방법은 아주 많습니다! 같은 것을 하기 위한 여러 방법이 있는 것입니다!

왜 그럴까요?

역사적인 이유가 있습니다.

- 생성자의 `"prototype"` 프로퍼티가 아주 오래전부터 있었습니다.
- 후에 2012년에 이르러 `Object.create`가 표준에 등장했습니다. 이를 이용해 주어진 프로토타입을 가진 객체를 만들 수는 있었지만, 프로토타입을 get/set할 수는 없었습니다. 그래서 언제든지 프로토타입을 get/set 할 수 있도록 비표준 `__proto__` 접근자가 브라우저에 구현되었습니다.
- 2015년에는 `Object.setPrototypeOf`와 `Object.getPrototypeOf`가 표준에 추가되었고 `__proto__`와 동일한 기능을 수행하게 되었습니다. 사실상 `__proto__`가 모든 곳에 구현되어있었기 때문에, `__proto__`는 앞으로 더 이상 사용되지 말하야 할 것으로 보고 표준의 부록 B(Annex B)에 추가되었습니다. 브라우저가 아닌 환경에서 `__proto__`는 선택사항입니다.

오늘날에는 이 모든 방식을 사용할 수 있습니다.

왜 `__proto__`를 함수 `getPrototypeOf/setPrototypeOf`로 대체했을까요? 흥미로운 질문입니다. 이 질문에 대한 답은 `__proto__`가 왜 나쁜지 이해하면 얻을 수 있습니다. 답을 얻기 위해 계속 읽어 봅시다.

```warn header="속도가 중요하다면 이미 존재하는 객체의 `[[Prototype]]`을 바꾸지 마세요."
기술적으로는 `[[Prototype]]`을 언제든지 get/set할 수 있습니다. 하지만 일반적으로 생성 시점에만 `[[Prototype]]`을 설정하고 이후엔 수정하지 않습니다. `rabbit`은 `animal`을 상속하고 그 사실은 변하지 않습니다.

자바스크립트 엔진은 이를 토대로 최적화되어 있습니다. `Object.setPrototypeOf`나 `obj.__proto__=`를 써서 프로토타입을 그때그때 바꾸는 것은 매우 느립니다. 객체의 프로퍼티에 접근하는 동작의 최적화를 깨기 때문입니다. 그러므로 `[[Prototype]]`을 바꾸는 것이 어떤 결과를 초래할지 확실히 알거나 자바스크립트의 속도가 전혀 중요하지 않은 경우가 아니라면 `[[Prototype]]`을 바꾸지 마세요.
```

## '매우 단순한' 객체 [#very-plain]

알다시피 객체는 키/값 쌍을 저장할 수 있는 연관 배열입니다.

하지만 사용자가 제공한 키를 저장하려고 할 때(예를 들어 사용자가 사전을 만들 때), 사소한 결함을 하나 볼 수 있습니다. 다른 모든 문자열은 키로 사용할 수 있지만  `"__proto__"`는 사용할 수 없습니다.

다음 예제를 살펴봅시다.

```js run
let obj = {};

let key = prompt("What's the key?", "__proto__");
obj[key] = "some value";

alert(obj[key]); // "some value"가 아니라 [object Object]입니다!
```

여기서 사용자가 `__proto__`를 입력하면 할당이 되지 않습니다.

사실 놀랄 일은 아닙니다. `__proto__` 프로퍼티는 특별하기 때문입니다. `__proto__`는 항상 객체이거나 `null`이어야 합니다. 문자열 타입은 프로토타입으로 사용할 수 없습니다.

하지만 *의도치 않게* 그런 식으로 구현할 수 있습니다. 그렇죠? 키/값 쌍을 저장하려는데 키의 이름이 `"__proto__"`이면 제대로 저장되지 않습니다. 그러니 이건 버그가 맞습니다.

여기선 그 결과가 그리 치명적이진 않습니다. 그렇지만 객체를 값으로 할당하는 경우엔 프로토타입이 정말 바뀔 수 있습니다. 그렇게 되면 완전히 기대하지 않은 것이 실행될 수 있습니다.

설상가상으로 개발자들은 대게 프로토타입이 바뀔 가능성을 전혀 생각하지 않습니다. 그래서 프로토타입이 바뀐 것은 눈치채기도 힘들고, 서버 사이드에서 자바스크립트를 사용중일 땐 심지어 취약점이 되기도 합니다.

이런 기대하지 않은 동작은 원래 함수인 `toString`이나 다른 내장 메서드에 할당을 할 때도 일어날 수 있습니다.

이 문제를 어떻게 피할 수 있을까요?

우선 `맵`을 사용하면 모든 것이 해결됩니다.

하지만 `객체`를 써도 괜찮습니다. 언어를 만든 사람들이 오래전에 이 문제를 고려했기 때문입니다.

`__proto__`는 객체의 프로퍼티가 아니라 `Object.prototype`의 접근자입니다.

![](object-prototype-2.svg)

그래서 `obj.__proto__`를 읽거나 쓸 때, 이에 대응하는 getter/setter를 프로토타입에서 호출해 `[[Prototype]]`을 가져오거나 설정합니다.

이 절을 시작할 때 언급한것 처럼 `__proto__`은 `[[Prototype]]`에 접근하기 위한 방법이지 `[[Prototype]]` 그 자체가 아닙니다.

자 이제 객체를 연관 배열로 사용하고 싶다면 간단한 트릭을 사용하면 됩니다.

```js run
*!*
let obj = Object.create(null);
*/!*

let key = prompt("What's the key?", "__proto__");
obj[key] = "some value";

alert(obj[key]); // "some value"
```

`Object.create(null)`은 프로토타입이 없는 빈 객체를 생성합니다(`[[Prototype]]`이 `null`).

![](object-prototype-null.svg)

그러므로 `__proto__` getter/setter를 상속하지 않습니다. 이제 `"__proto__"`는 일반적인 데이터 프로퍼티로 처리되므로 위의 예제는 잘 동작하게 됩니다.

이런 객체를 '매우 단순한(very plain)' 객체 혹은 '순수 사전식 객체(pure dictionary objects)'라고 부릅니다. 일반적으로 많이 사용하는 단순한 객체 `{...}` 보다 훨씬 단순하기 때문이죠.

이 방식의 단점은 이런 객체들은 내장 객체 메서드가 없다는 것입니다. `toString`을 예로 들 수 있습니다.

```js run
*!*
let obj = Object.create(null);
*/!*

alert(obj); // Error (toString이 없음)
```

하지만 연관 배열이니 보통은 괜찮습니다.

객체와 연관된 메서드 대부분은  `Object.keys(obj)`와 같이 `Object.something(...)`형태라는 점을 유의하세요. 프로토타입에 있는 게 아니기 때문에 '매우 단순한 객체'에도 이런 메서드들을 사용할 수 있습니다.


```js run
let chineseDictionary = Object.create(null);
chineseDictionary.hello = "你好";
chineseDictionary.bye = "再见";

alert(Object.keys(chineseDictionary)); // hello,bye
```

## 요약

프로토타입을 설정하고 프로토타입에 접근하기 위한 모던한 방식은 다음과 같습니다.

- [Object.create(proto[, descriptors])](mdn:js/Object/create) -- 인자로 넘긴 `proto`를 `[[Prototype]]`으로 하는 객체를 만듭니다(`null`일 수 있습니다). 선택적으로 설명자를 넘길 수도 있습니다.
- [Object.getPrototypeOf(obj)](mdn:js/Object.getPrototypeOf) -- `obj`의 `[[Prototype]]`을 반환합니다(`__proto__` getter와 같습니다).
- [Object.setPrototypeOf(obj, proto)](mdn:js/Object.setPrototypeOf) -- `obj`의 `[[Prototype]]`을 `proto`로 설정합니다(`__proto__` setter와 같습니다).

사용자가 만든 키를 객체에 저장할 때, 내장 `__proto__` getter/setter는 안전하지 않습니다. 사용자가 `"__proto__"`를 키로 입력할 수도 있기 때문에 에러가 생길 수 있습니다. 단순한 에러면 좋겠지만 보통 예측 불가능한 결과가 생깁니다.

그러므로 이럴 땐 `Object.create(null)`을 사용해 `__proto__`가 없는 '매우 단순한 객체'를 만들거나, `맵` 객체를 일관되게 사용하는 것이 좋습니다.

또 `Object.create`를 사용해 객체의 모든 설명자를 얕게 복사(shallow-copy)할 수 있습니다.

```js
let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
```

`__proto__`는 `[[Prototype]]`의 getter/setter라는 점과 다른 메서드와 같이 `Object.prototype`에 정의되어 있다는 것도 확인했습니다.

`Object.create(null)`를 사용해 프로토타입이 없는 객체를 만들 수 있습니다. 이런 객체는 '순수히 사전으로' 사용되고 `"__proto__"`를 키로 사용할 때도 문제가 없습니다.

살펴볼 만한 다른 메서드들은 다음과 같습니다.

- [Object.keys(obj)](mdn:js/Object/keys) / [Object.values(obj)](mdn:js/Object/values) / [Object.entries(obj)](mdn:js/Object/entries) -- 객체가 소유한 열거가능한 프로퍼티의 이름/값/키-값 배열을 반환합니다.
- [Object.getOwnPropertySymbols(obj)](mdn:js/Object/getOwnPropertySymbols) -- 객체가 소유한 심볼 키의 배열을 반환합니다.
- [Object.getOwnPropertyNames(obj)](mdn:js/Object/getOwnPropertyNames) -- 객체가 소유한 모든 문자열 키의 배열을 반환합니다.
- [Reflect.ownKeys(obj)](mdn:js/Reflect/ownKeys) -- 객체가 소유한 키의 배열을 반환합니다.
- [obj.hasOwnProperty(key)](mdn:js/Object/hasOwnProperty): `obj`가 소유한(상속하지 않은) 키 중 이름이 `key`인 것이 있으면 `true`를 반환합니다.

객체의 프로퍼티를 반환하는 모든 메서드(`Object.keys` 등) 은 '객체가 소유한' 프로퍼티만 반환합니다. 상속한 프로퍼티는 `for..in`를 사용해 얻을 수 있습니다.
