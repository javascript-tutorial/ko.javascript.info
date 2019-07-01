
# 심볼형(Symbol type)

명세에선 객체의 프로퍼티 키는 문자형이나 심볼형만 될 수 있다고 정의합니다. 숫자나 불린형은 불가능하며, 오직 문자와 심볼형만 가능합니다.

지금까지는 객체의 키가 문자형인 경우만 접해봤는데, 이제 심볼을 키로 사용하는 경우에 대해 알아보겠습니다. 그리고 심볼을 키로 사용할 때의 이점에 대해서도 알아보도록 하겠습니다.

## 심볼(Symbols)

심볼값은 유일한 식별자를 나타냅니다.

심볼형 값은 `Symbol()`을 이용해 만들 수 있습니다.

```js
// id는 새로운 심볼입니다.
let id = Symbol();
```

<<<<<<< HEAD
심볼에 설명을 붙일 수도 있습니다(이를 심볼 이름이라고도 부릅니다). 디버깅 시 유용하게 쓰입니다.
=======
Upon creation, we can give symbol a description (also called a symbol name), mostly useful for debugging purposes:
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

```js run
// id는 "id"라는 설명을 가진 심볼입니다.
let id = Symbol("id");
```

심볼은 유일성이 보장됩니다. 설명이 같은 심볼을 여러 개 만들더라도, 각각의 심볼값은 다릅니다. 설명은 어떤 것에도 영향을 주지 않는 이름표일 뿐입니다.

설명이 같은 심볼 두 개를 만들어보도록 하겠습니다. 설명은 같지만, 값은 다르다는 것을 확인할 수 있습니다.

```js run
let id1 = Symbol("id");
let id2 = Symbol("id");

*!*
alert(id1 == id2); // false
*/!*
```

루비(Ruby)나 기타 언어에도 "symbols"이 있습니다. 하지만 자바스크립트의 심볼은 이들 언어에 쓰이는 심볼과는 다르기 때문에 혼동하면 안 됩니다.

````warn header="심볼은 문자열로 자동 변환되지 않습니다."
자바스크립트는 대부분의 값을 문자열로 암시적 형 변환 할 수 있는 기능을 지원합니다. 따라서 대부분 형태의 값에 `alert`를 사용할 수 있으며, 에러없이 코드가 실행됩니다. 그러나 심볼은 예외상황이 적용됩니다. 자동 변환되지 않기 때문입니다.

아래 코드의 `alert`는 에러를 발생시킵니다.

```js run
let id = Symbol("id");
*!*
alert(id); // TypeError: Cannot convert a Symbol value to a string
*/!*
```

"언어 보호장치(language guard)"는 혼란을 예방하기 위해 심볼의 형변환을 차단합니다. 문자열과 심볼은 근본적으로 다르고, 서로의 타입으로 변환돼선 안 되기 때문입니다.

심볼을 반드시 보여줘야 한다면, 다음과 같이 `.toString()` 메서드를 호출해 명시적으로 변환해주면 됩니다.
```js run
let id = Symbol("id");
*!*
alert(id.toString()); // Symbol(id), 이제 잘 실행됩니다.
*/!*
```

`symbol.description` 프로퍼티를 이용하면 설명만 얻을 수도 있습니다.
```js run
let id = Symbol("id");
*!*
alert(id.description); // id
*/!*
```

````

## "숨김" 프로퍼티("Hidden" properties)

심볼을 이용해 객체에 "숨김" 프로퍼티를 만들 수 있습니다. 숨김 프로퍼티는 다른 영역에 있는 코드에서 접근하거나 값을 덮어 쓸 수 없습니다.

<<<<<<< HEAD
`user` 객체에 "식별자(identifier)"를 만들어주고 싶다면, 심볼을 키로 사용할 수 있습니다. 아래와 같이 말이죠.
=======
For instance, if we're working with `user` objects, that belong to a third-party code and don't have any `id` field. We'd like to add identifiers to them.

Let's use a symbol key for it:
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

```js run
let user = { name: "John" };
let id = Symbol("id");

user[id] = "ID Value";
alert( user[id] ); // 심볼을 키로 사용해 데이터에 접근할 수 있습니다.
```

문자열 `"id"` 대신에 `Symbol("id")`을 사용하면 어떤 이점이 있을까요?

<<<<<<< HEAD
자세한 예제를 통해 어떤 장점이 있는지 알아보도록 하겠습니다.

`user` 안에 "id" 프로퍼티가 있어야 하는 또 다른 스크립트가 있다고 상상해 봅시다. 다른 스크립트는 자바스크립트 라이브러리일 수도 있으므로, 스크립트끼리는 서로의 스크립트를 알 수 없는 상황입니다.
=======
As `user` objects belongs to another code, and that code also works with them, we shouldn't just add any fields to it. That's unsafe. But a symbol cannot be accessed occasionally, the third-party code probably won't even see it, so it's probably all right to do.

Also, imagine that another script wants to have its own identifier inside `user`, for its own purposes. That may be another JavaScript library, so that the scripts are completely unaware of each other.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

이때, 다른 스크립트는 자체적으로 `Symbol("id")`을 만들 수 있습니다. 아래와 같이 말이죠.

```js
// ...
let id = Symbol("id");

user[id] = "Their id value";
```

<<<<<<< HEAD
이렇게 다른 스크립트에서 user 객체에 id 프로퍼티를 만들어도 충돌이 발생하지 않습니다. 심볼은 같은 이름을 가지더라도 항상 다르기 때문입니다.

만약 동일한 목적으로 심볼 대신에 `"id"`라는 문자열을 사용한다면, 충돌이 **발생할 수도** 있습니다.
=======
There will be no conflict between our and their identifiers, because symbols are always different, even if they have the same name.

...But if we used a string `"id"` instead of a symbol for the same purpose, then there *would* be a conflict:
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

```js run
let user = { name: "John" };

// 현재 스크립트는 "id" 프로퍼티를 사용합니다.
user.id = "ID Value";

// 만약 외부 스크립트에서 "id"를 사용한다면...

user.id = "Their id value"
// 이런! 값이 덮어 쓰였군요! 의도치 않게 스크립트가 손상되었네요.
```

### 객체 리터럴 내 심볼

<<<<<<< HEAD
심볼을 객체 리터럴 내에서 사용하고 싶다면 대괄호를 써야 합니다.
=======
If we want to use a symbol in an object literal `{...}`, we need square brackets around it.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

이렇게 말이죠.

```js
let id = Symbol("id");

let user = {
  name: "John",
*!*
  [id]: 123 // "id: 123"가 아닙니다.
*/!*
};
```
키로 문자열 "id"가 아니라 변수 `id`가 필요하기 때문입니다. 

### 심볼은 for..in 에서 배제됩니다.

심볼형 프로퍼티는 `for..in` 반복문의 반복 대상에서 배제됩니다.

예:

```js run
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

*!*
for (let key in user) alert(key); // name, age (심볼은 출력되지 않습니다.)
*/!*

// 심볼로 직접 접근을 하면 잘 작동합니다.
alert( "Direct: " + user[id] );
```

<<<<<<< HEAD
"은닉(hiding)" 개념으로 이를 이해하시면 될 것 같습니다. 만약 다른 스크립트나 라이브러리에서 객체에 반복문을 수행해도, 심볼형 프로퍼티엔 접근할 수 없습니다.
=======
`Object.keys(user)` also ignores them. That's a part of the general "hiding symbolic properties" principle. If another script or a library loops over our object, it won't unexpectedly access a symbolic property.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

반면, [Object.assign](mdn:js/Object/assign)메서드를 사용하면 문자열과 심볼 프로퍼티 모두를 복사할 수 있습니다.

```js run
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```

뭔가 모순이 있는것 같이 느껴질 수 있지만, 의도를 가지고 이렇게 구현되었습니다. 객체를 복사하거나 병합할 때, 일반적으로 (`id`와 같은 심볼을 포함한) *모든* 프로퍼티를 복사하고 싶어 할 것이라는 생각에서 이렇게 구현된 것입니다.

````smart header="다른 타입의 프로퍼티 키는 문자열로 강제 변환됩니다."
문자형과 심볼형만 객체의 키로 사용할 수 있습니다. 다른 형의 키는 문자열로 변환됩니다.

예를 들어, 숫자 `0`을 프로퍼티 키로 사용하면 문자열 `"0"`으로 변환됩니다.

```js run
let obj = {
  0: "test" // "0": "test"와 동일 합니다.
};

// 아래 두 alert 문은 같은 프로퍼티에 접근합니다. (숫자 0이 문자열 "0"으로 변환됩니다.)
alert( obj["0"] ); // test
alert( obj[0] ); // test (같은 프로퍼티)
```
````

## 전역 심볼(global symbol)

<<<<<<< HEAD
앞에서 봤던 것처럼, 심볼은 이름이 같더라도 서로 다릅니다. 하지만 이름이 같은 심볼이 같은 개체이길 원하는 경우도 있을 겁니다.
=======
As we've seen, usually all symbols are different, even if they have the same name. But sometimes we want same-named symbols to be same entities.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

애플리케이션의 서로 다른 부분에서 하나의 프로퍼티를 나타내는 심볼 `"id"` 를 사용하고 싶어 한다고 가정해 봅시다.

이런 경우를 위해 *전역 심볼 레지스트리*가 존재합니다. 전역 심볼 레지스트리(global symbol registry) 안에 심볼을 생성하고, 생성된 심볼에 접근하면, 같은 이름으로 여러 번 접근해도 항상 동일한 심볼이 반환됩니다.

<<<<<<< HEAD
`Symbol.for(key)`를 사용하면, 심볼을 레지스트리 안에 생성하거나 읽을 수 있습니다.
=======
In order to read (create if absent) a symbol from the registry, use `Symbol.for(key)`.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

이 메서드는 전역 레지스트리를 확인해 이름이 `key`인 심볼이 존재하면 그 심볼을 반환해줍니다. 심볼이 존재하지 않으면 주어진 `key`로 `Symbol(key)`이라는 새로운 심볼을 생성하고 레지스트리 안에 저장합니다.

예:

```js run
// 전역 레지스트리에서 심볼을 읽어 옵니다.
let id = Symbol.for("id"); // 만약 심볼이 존재하지 않는다면, 새로운 심볼을 생성합니다.

<<<<<<< HEAD
// 다시 한번 심볼을 읽어 옵니다.
=======
// read it again (maybe from another part of the code)
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd
let idAgain = Symbol.for("id");

// 이 둘은 같은 심볼입니다.
alert( id === idAgain ); // true
```

전역 심볼 레지스트리 안에 있는 심볼을 *전역 심볼*이라고 합니다. 애플리케이션 전체에서 사용하거나 코드 내 어디서나 접근 가능한 심볼이 필요할 때, 전역 심볼을 사용하면 됩니다.

```smart header="루비랑 비슷해 보이네요."
루비같은 몇몇 프로그래밍 언어에서는 이름마다 고유의 심볼이 있습니다.

자바스크립트에선 전역 심볼에만 이 특징이 적용됩니다.
```

### Symbol.keyFor

전역 심볼에 사용되는 `Symbol.for(key)`는 주어진 키로 심볼을 찾아 반환하는데, 이와 반대되는 메서드도 있습니다. `Symbol.keyFor(sym)`를 사용하면 주어진 전역 심볼에 대한 키를 반환합니다.

예:

```js run
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// 심볼을 이용해 이름을 얻을 수 있음
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
```

`Symbol.keyFor`는 전역 심볼 레지스트리를 뒤져 주어진 심볼의 키를 찾습니다. 따라서, 전역 심볼이 아닌 심볼에는 사용할 수 없습니다. 만약 전역 심볼이 아니라면, 심볼을 찾을 수 없기 때문에 `undefined`를 반환합니다.

예:

```js run
alert( Symbol.keyFor(Symbol.for("name")) ); // name, 전역 심볼

alert( Symbol.keyFor(Symbol("name2")) ); // undefined, 매개변수는 전역 심볼이 아닙니다.
```

## 시스템 심볼(system symbol)

"시스템" 심볼은 자바스크립트 내부에서 사용되는 심볼입니다. 시스템 심볼을 객체 미세 조정에 활용할 수 있습니다.

명세의 [잘 알려진 심볼](https://tc39.github.io/ecma262/#sec-well-known-symbols) 표에서 시스템 심볼을 확인할 수 있습니다.

- `Symbol.hasInstance`
- `Symbol.isConcatSpreadable`
- `Symbol.iterator`
- `Symbol.toPrimitive`
- ...등등

예를 들어, `Symbol.toPrimitive`는 객체의 원시 타입 변환을 설명해줍니다. 이에 대해선 곧 다룰 예정입니다.

위 시스템 심볼을 사용하는 자바스크립트 기능을 배우다 보면 시스템 심볼에 익숙해질 것입니다.

## 요약

`Symbol`은 유일무이한 식별자(unique identifier)로 사용되는 원시 타입입니다.

<<<<<<< HEAD
추가적인 설명(심볼 이름)과 함께 `Symbol()`을 호출하면 심볼을 만들 수 있습니다.

이름이 같은 심볼이라도, 값은 항상 다릅니다. 이름이 같은 심볼이 같은 값을 갖길 원한다면, 전역 레지스트리를 사용해야 합니다. `Symbol.for(key)`는 `key`라는 이름을 가진 전역 심볼을 반환합니다(심볼이 없다면 생성해줍니다). `Symbol.for`를 여러 번 호출해도 언제나 같은 심볼을 반환합니다.
=======
Symbols are created with `Symbol()` call with an optional description (name).

Symbols are always different values, even if they have the same name. If we want same-named symbols to be equal, then we should use the global registry: `Symbol.for(key)` returns (creates if needed) a global symbol with `key` as the name. Multiple calls of `Symbol.for` with the same `key` return exactly the same symbol.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

심볼의 주요 유스 케이스는 두 가지가 있습니다:

<<<<<<< HEAD
1. "숨김" 객체 프로퍼티.
    다른 스크립트나 라이브러리에 "소속된" 객체에 프로퍼티를 추가하고 싶다면, 심볼을 만들고, 이 심볼을 프로퍼티 키로 사용하면 됩니다. 심볼형 프로퍼티는 `for..in`에 등장하지 않기 때문에, 반복문을 통해 나열할 수 없습니다. 외부 스크립트는 현재 스크립트의 심볼을 가지고 있지 않기 때문에, 심볼에 직접 접근할 수 없습니다. 따라서 우연으로라도 스크립트를 방해하는 일이 발생하지 않습니다.
=======
1. "Hidden" object properties.
    If we want to add a property into an object that "belongs" to another script or a library, we can create a symbol and use it as a property key. A symbolic property does not appear in `for..in`, so it won't be occasionally processed together with other properties. Also it won't be accessed directly, because another script does not have our symbol. So the property will be protected from occasional use or overwrite.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

    심볼형 프로퍼티를 이용하면, 어떤 것을 "은밀히" 원하는 객체 안에 숨길 수 있습니다. 외부 스크립트에선 이를 볼 수 없습니다.

2. `Symbol.*`로 자바스크립트 내부에서 사용되는 다양한 시스템 심볼에 접근할 수 있습니다. 시스템 심볼을 이용하면 내장 알고리즘을 변경할 수 있습니다. [iterable](info:iterable)에 `Symbol.iterator`를 사용하기, `Symbol.toPrimitive`를 사용해 [객체를 원시 타입으로 변환](info:object-toprimitive)하기 등의 예시를 추후 살펴보도록 하겠습니다.

사실 심볼은 100% 숨겨져 있는 건 아닙니다. [Object.getOwnPropertySymbols(obj)](mdn:js/Object/getOwnPropertySymbols)라는 내장 메서드를 사용하면 모든 심볼을 볼 수 있습니다. [Reflect.ownKeys(obj)](mdn:js/Reflect/ownKeys)라는 메서드를 사용하면, 심볼 프로퍼티를 포함한 객체의 모든 키를 반환받을 수도 있습니다. 이렇게 심볼은 완전히 숨겨져 있지 않습니다. 하지만 대부분의 라이브러리, 내장 메서드, 문법 구조는 심볼이 숨겨진 존재라는 합의 하에 구현됩니다. 심볼을 노출시키는 메서드를 명시적으로 호출하는 경우는 아마 이 메서드가 하는 일을 잘 알고 있는 경우 일 것입니다.
