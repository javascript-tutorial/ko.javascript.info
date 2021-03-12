
# 프로퍼티 플래그와 설명자

아시다시피 객체엔 프로퍼티가 저장됩니다.

지금까진 프로퍼티를 단순히 '키-값' 쌍의 관점에서만 다뤘습니다. 그런데 사실 프로퍼티는 우리가 생각했던 것보다 더 유연하고 강력한 자료구조입니다. 

이 챕터에선 객체 프로퍼티 추가 구성 옵션 몇 가지를 다루고, 이어지는 챕터에선 이 옵션들을 이용해 손쉽게 getter나 setter 함수를 만드는 법을 알아보겠습니다.

## 프로퍼티 플래그

객체 프로퍼티는 **`값(value)`** 과 함께 플래그(flag)라 불리는 특별한 속성 세 가지를 갖습니다. 

- **`writable`** -- `true`이면 값을 수정할 수 있습니다. 그렇지 않다면 읽기만 가능합니다.
- **`enumerable`** -- `true`이면 반복문을 사용해 나열할 수 있습니다. 그렇지 않다면 반복문을 사용해 나열할 수 없습니다.
- **`configurable`** -- `true`이면 프로퍼티 삭제나 플래그 수정이 가능합니다. 그렇지 않다면 프로퍼티 삭제와 플래그 수정이 불가능합니다.

프로퍼티 플래그는 특별한 경우가 아니고선 다룰 일이 없기 때문에 여기서 처음 소개하게 되었습니다. 지금까지 해왔던 '평범한 방식'으로 프로퍼티를 만들면 해당 프로퍼티의 플래그는 모두 `true`가 됩니다. 이렇게 `true`로 설정된 플래그는 언제든 수정할 수 있습니다.

자 이제 본격적으로 프로퍼티 플래그에 대해 다뤄봅시다. 먼저 플래그를 얻는 방법을 알아보겠습니다.

[Object.getOwnPropertyDescriptor](mdn:js/Object/getOwnPropertyDescriptor)메서드를 사용하면 특정 프로퍼티에 대한 정보를 *모두* 얻을 수 있습니다.

문법:
```js
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```

`obj`
: 정보를 얻고자 하는 객체

`propertyName`
: 정보를 얻고자 하는 객체 내 프로퍼티

메서드를 호출하면 "프로퍼티 설명자(descriptor)"라고 불리는 객체가 반환되는데, 여기에는 프로퍼티 값과 세 플래그에 대한 정보가 모두 담겨있습니다.

예시:

```js run
let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/* property descriptor:
{
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
}
*/
```

메서드 [Object.defineProperty](mdn:js/Object/defineProperty)를 사용하면 플래그를 변경할 수 있습니다.

문법:

```js
Object.defineProperty(obj, propertyName, descriptor)
```

`obj`, `propertyName`
: 설명자를 적용하고 싶은 객체와 객체 프로퍼티

`descriptor`
: 적용하고자 하는 프로퍼티 설명자

`defineProperty`메서드는 객체에 해당 프로퍼티가 있으면 플래그를 원하는 대로 변경해줍니다. 프로퍼티가 없으면 인수로 넘겨받은 정보를 이용해 새로운 프로퍼티를 만듭니다. 이때 플래그 정보가 없으면 플래그 값은 자동으로 `false`가 됩니다. 

아래 예시를 보면 프로퍼티 `name`이 새로 만들어지고, 모든 플래그 값이 `false`가 된 것을 확인할 수 있습니다.

```js run
let user = {};

*!*
Object.defineProperty(user, "name", {
  value: "John"
});
*/!*

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": "John",
*!*
  "writable": false,
  "enumerable": false,
  "configurable": false
*/!*
}
 */
```

'평범한 방식으로' 객체 프로퍼티 `user.name`을 만들었을 때와 `defineProperty`를 이용해 프로퍼티를 만들었을 때의 가장 큰 차이점은 플래그에 있습니다. `defineProperty`를 사용해 프로퍼티를 만든 경우, `descriptor`에 플래그 값을 명시하지 않으면 플래그 값이 자동으로 `false`가 됩니다. 플래그 값을 `true`로 설정하려면 `descriptor`에 `true`라고 명시해 주어야 합니다. 이제 예시를 통해 플래그의 효과에 대해 알아봅시다.

## writable 플래그

`writable` 플래그를 사용해 `user.name`에 값을 쓰지 못하도록(non-writable) 해봅시다.

```js run
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
*!*
  writable: false
*/!*
});

*!*
user.name = "Pete"; // Error: Cannot assign to read only property 'name'
*/!*
```

이제 `defineProperty`를 사용해 `writable` 플래그를 `true`로 변경하지 않는 한 그 누구도 객체의 이름을 변경할 수 없게 되었습니다.

```smart header="에러는 엄격 모드에서만 발생합니다."
비 엄격 모드에선 읽기 전용 프로퍼티에 값을 쓰려고 해도 에러가 발생하지 않습니다. 다만 이때 값을 변경하는 것은 불가능합니다. 비 엄격 모드에선 이와 같이 플래그에서 정한 규칙을 위반하는 행위는 에러 없이 그냥 무시됩니다.
```

아래 예시는 위 예시와 동일하게 동작합니다. 다만 아래 예시에선 `defineProperty` 메서드를 사용해 프로퍼티를 밑바닥부터 만들어 보았습니다.

```js run
let user = { };

Object.defineProperty(user, "name", {
*!*
  value: "John",
  // defineProperty를 사용해 새로운 프로퍼티를 만들 땐, 어떤 플래그를 true로 할지 명시해주어야 합니다.
  enumerable: true,
  configurable: true
*/!*
});

alert(user.name); // John
user.name = "Pete"; // Error
```

## enumerable 플래그

`user`에 커스텀 메서드 `toString`을 추가해봅시다.

객체 내장 메서드 `toString`은 열거가 불가능(non-enumerable)하기 때문에 `for..in` 사용시 나타나지 않습니다. 하지만 커스텀 `toString`을 추가하면 아래와 같이 `for..in`에 `toString`이 나타납니다.

```js run
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

//커스텀 toString은 for...in을 사용해 열거할 수 있습니다.
for (let key in user) alert(key); // name, toString
```

그런데 특정 프로퍼티의 `enumerable` 플래그 값을 `false`로 설정하면 `for..in` 반복문에 나타나지 않게 할 수 있습니다. 커스텀 `toString`도 열거가 불가능하게 할 수 있습니다.

```js run
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

Object.defineProperty(user, "toString", {
*!*
  enumerable: false
*/!*
});

*!*
// 이제 for...in을 사용해 toString을 열거할 수 없게 되었습니다.
*/!*
for (let key in user) alert(key); // name
```

열거가 불가능한 프로퍼티는 `Object.keys`에도 배제됩니다.

```js
alert(Object.keys(user)); // name
```

## configurable 플래그

구성 가능하지 않음을 나타내는 플래그(non-configurable flag)인 `configurable:false`는 몇몇 내장 객체나 프로퍼티에 기본으로 설정되어있습니다.

어떤 프로퍼티의 `configurable` 플래그가 `false`로 설정되어 있다면 해당 프로퍼티는 객체에서 지울 수 없습니다.

내장 객체 `Math`의 `PI` 프로퍼티가 대표적인 예입니다. 이 프로퍼티는 쓰기와 열거, 구성이 불가능합니다.

```js run
let descriptor = Object.getOwnPropertyDescriptor(Math, 'PI');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}
*/
```
개발자가 코드를 사용해 `Math.PI` 값을 변경하거나 덮어쓰는 것도 불가능합니다.

```js run
Math.PI = 3; // Error

// 수정도 불가능하지만 지우는 것 역시 불가능합니다.
```

`configurable` 플래그를 `false`로 설정하면 돌이킬 방법이 없습니다. `defineProperty`를 써도 값을 `true`로 되돌릴 수 없죠.

`configurable:false`가 만들어내는 구체적인 제약사항은 아래와 같습니다.
1. `configurable` 플래그를 수정할 수 없음
2. `enumerable` 플래그를 수정할 수 없음.
3. `writable: false`의 값을 `true`로 바꿀 수 없음(`true`를 `false`로 변경하는 것은 가능함).
4. 접근자 프로퍼티 `get/set`을 변경할 수 없음(새롭게 만드는 것은 가능함).

이런 특징을 이용하면 아래와 같이 "영원히 변경할 수 없는" 프로퍼티(`user.name`)를 만들 수 있습니다.

```js run
let user = { };

Object.defineProperty(user, "name", {
  value: "John",
  writable: false,
  configurable: false
});

*!*
// user.name 프로퍼티의 값이나 플래그를 변경할 수 없습니다.
// 아래와 같이 변경하려고 하면 에러가 발생합니다.
//   user.name = "Pete"
//   delete user.name
//   Object.defineProperty(user, "name", { value: "Pete" })
Object.defineProperty(user, "name", {writable: true}); // Error
*/!*
```

```smart header="\"non-configurable\"은 \"non-writable\"과 다릅니다."
`configurable` 플래그가 `false`이더라도 `writable` 플래그가 `true`이면 프로퍼티 값을 변경할 수 있습니다.

`configurable: false`는 플래그 값 변경이나 프로퍼티 삭제를 막기 위해 만들어졌지, 프로퍼티 값 변경을 막기 위해 만들어진 게 아닙니다.
```

## Object.defineProperties

[Object.defineProperties(obj, descriptors)](mdn:js/Object/defineProperties) 메서드를 사용하면 프로퍼티 여러 개를 한 번에 정의할 수 있습니다.

문법:

```js
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
```

예시:

```js
Object.defineProperties(user, {
  name: { value: "John", writable: false },
  surname: { value: "Smith", writable: false },
  // ...
});
```

프로퍼티 여러 개를 한 번에 정의해보았습니다.

## Object.getOwnPropertyDescriptors

[Object.getOwnPropertyDescriptors(obj)](mdn:js/Object/getOwnPropertyDescriptors) 메서드를 사용하면 프로퍼티 설명자를 전부 한꺼번에 가져올 수 있습니다.

이 메서드를 `Object.defineProperties`와 함께 사용하면 객체 복사 시 플래그도 함께 복사할 수 있습니다.

```js
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

지금까진 아래처럼 할당 연산자를 사용해 프로퍼티를 복사하는 방법으로 객체를 복사해 왔습니다.

```js
for (let key in user) {
  clone[key] = user[key]
}
```

그런데 이 방법은 플래그는 복사하지 않습니다. 플래그 정보도 복사하려면 `Object.defineProperties`를 사용하시기 바랍니다.  

위 샘플 코드처럼 `for..in`을 사용해 객체를 복사하면 심볼형 프로퍼티도 놓치게 됩니다. 하지만 `Object.getOwnPropertyDescriptors`는 심볼형 프로퍼티를 포함한 프로퍼티 설명자 *전체*를 반환합니다. 

## 객체 수정을 막아주는 다양한 메서드

프로퍼티 설명자는 특정 프로퍼티 하나를 대상으로 합니다.

아래 메서드를 사용하면 한 객체 내 프로퍼티 *전체*를 대상으로 하는 제약사항을 만들 수 있습니다.

[Object.preventExtensions(obj)](mdn:js/Object/preventExtensions)
: 객체에 새로운 프로퍼티를 추가할 수 없게 합니다.

[Object.seal(obj)](mdn:js/Object/seal)
: 새로운 프로퍼티 추가나 기존 프로퍼티 삭제를 막아줍니다. 프로퍼티 전체에 `configurable: false`를 설정하는 것과 동일한 효과입니다.

[Object.freeze(obj)](mdn:js/Object/freeze)
: 새로운 프로퍼티 추가나 기존 프로퍼티 삭제, 수정을 막아줍니다. 프로퍼티 전체에 `configurable: false, writable: false`를 설정하는 것과 동일한 효과입니다.

아래 메서드는 위 세 가지 메서드를 사용해서 설정한 제약사항을 확인할 때 사용할 수 있습니다.

[Object.isExtensible(obj)](mdn:js/Object/isExtensible)
: 새로운 프로퍼티를 추가하는 게 불가능한 경우 `false`를, 그렇지 않은 경우 `true`를 반환합니다.

[Object.isSealed(obj)](mdn:js/Object/isSealed)
: 프로퍼티 추가, 삭제가 불가능하고 모든 프로퍼티가 `configurable: false`이면 `true`를 반환합니다.

[Object.isFrozen(obj)](mdn:js/Object/isFrozen)
: 프로퍼티 추가, 삭제, 변경이 불가능하고 모든 프로퍼티가 `configurable: false, writable: false`이면 `true`를 반환합니다.

위 메서드들은 실무에선 잘 사용되지 않습니다.
