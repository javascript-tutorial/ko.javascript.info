# 참조에 의한 객체 복사

객체와 원시 타입의 근본적인 차이 중 하나는 객체는 '참조에 의해(by reference)' 저장되고 복사된다는 것입니다.

원시값(문자열, 숫자, 불린 값)은 '값 그대로' 저장·할당되고 복사되는 반면에 말이죠.

예시:

```js
let message = "Hello!";
let phrase = message;
```

예시를 실행하면 두 개의 독립된 변수에 각각 문자열 `"Hello!"`가 저장됩니다.

![](variable-copy-value.svg)

그런데 객체의 동작방식은 이와 다릅니다.

**변수엔 객체가 그대로 저장되는 것이 아니라, 객체가 저장되어있는 '메모리 주소'인 객체에 대한 '참조 값'이 저장됩니다.**

그림을 통해 변수 user에 객체를 할당할 때 무슨 일이 일어나는지 알아봅시다.

```js
let user = {
  name: "John"
};
```

![](variable-contains-reference.svg)

객체는 메모리 내 어딘가에 저장되고, 변수 `user`엔 객체를 '참조'할 수 있는 값이 저장됩니다.

따라서 **객체가 할당된 변수를 복사할 땐 객체의 참조 값이 복사되고 객체는 복사되지 않습니다.**

예시:

```js no-beautify
let user = { name: "John" };

let admin = user; // 참조값을 복사함
```

변수는 두 개이지만 각 변수엔 동일 객체에 대한 참조 값이 저장되죠.

![](variable-copy-reference.svg)

따라서 객체에 접근하거나 객체를 조작할 땐 여러 변수를 사용할 수 있습니다.

```js run
let user = { name: 'John' };

let admin = user;

*!*
admin.name = 'Pete'; // 'admin' 참조 값에 의해 변경됨
*/!*

alert(*!*user.name*/!*); // 'Pete'가 출력됨. 'user' 참조 값을 이용해 변경사항을 확인함
```

객체를 서랍장에 비유하면 변수는 서랍장을 열 수 있는 열쇠라고 할 수 있습니다. 서랍장은 하나, 서랍장을 열 수 있는 열쇠는 두 개인데, 그중 하나(`admin`)를 사용해 서랍장을 열어 정돈한 후, 또 다른 열쇠로 서랍장을 열면 정돈된 내용을 볼 수 있습니다.

### 참조에 의한 비교

객체 비교 시 동등 연산자 `==`와 일치 연산자 `===`는 동일하게 동작합니다.

**비교 시 피연산자인 두 객체가 동일한 객체인 경우에 참을 반환하죠.**

두 변수가 같은 객체를 참조하는 예시를 살펴봅시다. 일치·동등 비교 모두에서 참이 반환됩니다.

```js run
let a = {};
let b = a; // 참조에 의한 복사

alert( a == b ); // true, 두 변수는 같은 객체를 참조합니다.
alert( a === b ); // true
```

다른 예시를 살펴봅시다. 두 객체 모두 비어있다는 점에서 같아 보이지만, 독립된 객체이기 때문에 일치·동등 비교하면 거짓이 반환됩니다.

```js run
let a = {};
let b = {}; // 독립된 두 객체

alert( a == b ); // false
```

`obj1 > obj2` 같은 대소 비교나 `obj == 5` 같은 원시값과의 비교에선 객체가 원시형으로 변환됩니다. 객체가 어떻게 원시형으로 변하는지에 대해선 곧 학습할 예정인데, 이러한 비교(객체끼리의 대소 비교나 원시값과 객체를 비교하는 것)가 필요한 경우는 매우 드물긴 합니다. 대개 코딩 실수 때문에 이런 비교가 발생합니다.

## 객체 복사, 병합과 Object.assign

객체가 할당된 변수를 복사하면 동일한 객체에 대한 참조 값이 하나 더 만들어진다는 걸 배웠습니다.

그런데 객체를 복제하고 싶다면 어떻게 해야 할까요? 기존에 있던 객체와 똑같으면서 독립적인 객체를 만들고 싶다면 말이죠.

방법은 있는데 자바스크립트는 객체 복제 내장 메서드를 지원하지 않기 때문에 조금 어렵습니다. 사실 객체를 복제해야 할 일은 거의 없습니다. 참조에 의한 복사로 해결 가능한 일이 대다수이죠.

정말 복제가 필요한 상황이라면 새로운 객체를 만든 다음 기존 객체의 프로퍼티들을 순회해 원시 수준까지 프로퍼티를 복사하면 됩니다.

아래와 같이 말이죠.

```js run
let user = {
  name: "John",
  age: 30
};

*!*
let clone = {}; // 새로운 빈 객체

// 빈 객체에 user 프로퍼티 전부를 복사해 넣습니다.
for (let key in user) {
  clone[key] = user[key];
}
*/!*

// 이제 clone은 완전히 독립적인 복제본이 되었습니다.
clone.name = "Pete"; // clone의 데이터를 변경합니다.

alert( user.name ); // 기존 객체에는 여전히 John이 있습니다.
```

[Object.assign](mdn:js/Object/assign)를 사용하는 방법도 있습니다.

문법과 동작방식은 다음과 같습니다.

```js
Object.assign(dest, [src1, src2, src3...])
```

- 첫 번째 인수 `dest`는 목표로 하는 객체입니다.
- 이어지는 인수 `src1, ..., srcN`는 복사하고자 하는 객체입니다. `...`은 필요에 따라 얼마든지 많은 객체를 인수로 사용할 수 있다는 것을 나타냅니다.
- 객체 `src1, ..., srcN`의 프로퍼티를 `dest`에 복사합니다. `dest`를 제외한 인수(객체)의 프로퍼티 전부가 첫 번째 인수(객체)로 복사됩니다.
- 마지막으로 `dest`를 반환합니다.

`assign` 메서드를 사용해 여러 객체를 하나로 병합하는 예시를 살펴봅시다.
```js
let user = { name: "John" };

let permissions1 = { canView: true };
let permissions2 = { canEdit: true };

*!*
// permissions1과 permissions2의 프로퍼티를 user로 복사합니다.
Object.assign(user, permissions1, permissions2);
*/!*

// now user = { name: "John", canView: true, canEdit: true }
```

목표 객체(`user`)에 동일한 이름을 가진 프로퍼티가 있는 경우엔 기존 값이 덮어씌워 집니다.

```js run
let user = { name: "John" };

Object.assign(user, { name: "Pete" });

alert(user.name); // user = { name: "Pete" }
```

`Object.assign`을 사용하면 반복문 없이도 간단하게 객체를 복사할 수 있습니다.

```js
let user = {
  name: "John",
  age: 30
};

*!*
let clone = Object.assign({}, user);
*/!*
```

예시를 실행하면 `user`에 있는 모든 프로퍼티가 빈 배열에 복사되고 변수에 할당됩니다.

## 중첩 객체 복사

지금까진 `user`의 모든 프로퍼티가 원시값인 경우만 가정했습니다. 그런데 프로퍼티는 다른 객체에 대한 참조 값일 수도 있습니다. 이 경우는 어떻게 해야 할까요?

아래와 같이 말이죠.
```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

alert( user.sizes.height ); // 182
```

`clone.sizes = user.sizes`로 프로퍼티를 복사하는 것만으론 객체를 복제할 수 없습니다. `user.sizes`는 객체이기 때문에 참조 값이 복사되기 때문입니다. `clone.sizes = user.sizes`로 프로퍼티를 복사하면 `clone`과 `user`는 같은 sizes를 공유하게 됩니다.

아래와 같이 말이죠.

```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

let clone = Object.assign({}, user);

alert( user.sizes === clone.sizes ); // true, 같은 객체입니다.

// user와 clone는 sizes를 공유합니다.
user.sizes.width++;       // 한 객체에서 프로퍼티를 변경합니다.
alert(clone.sizes.width); // 51, 다른 객체에서 변경 사항을 확인할 수 있습니다.
```

이 문제를 해결하려면 `user[key]`의 각 값을 검사하면서, 그 값이 객체인 경우 객체의 구조도 복사해주는 반복문을 사용해야 합니다. 이런 방식을 '깊은 복사(deep cloning)'라고 합니다.

깊은 복사 시 사용되는 표준 알고리즘인 [Structured cloning algorithm](https://html.spec.whatwg.org/multipage/structured-data.html#safe-passing-of-structured-data)을 사용하면 위 사례를 비롯한 다양한 상황에서 객체를 복제할 수 있습니다.

자바스크립트 라이브러리 [lodash](https://lodash.com)의 메서드인 [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep)을 사용하면 이 알고리즘을 직접 구현하지 않고도 깊은 복사를 처리할 수 있으므로 참고하시기 바랍니다.

## 요약

객체는 참조에 의해 할당되고 복사됩니다. 변수엔 '객체' 자체가 아닌 메모리상의 주소인 '참조'가 저장됩니다. 따라서 객체가 할당된 변수를 복사하거나 함수의 인자로 넘길 땐 객체가 아닌 객체의 참조가 복사됩니다.

그리고 복사된 참조를 이용한 모든 작업(프로퍼티 추가·삭제 등)은 동일한 객체를 대상으로 이뤄집니다.

객체의 '진짜 복사본'을 만들려면 '얕은 복사(shallow copy)'를 가능하게 해주는 `Object.assign`이나  '깊은 복사'를 가능하게 해주는 [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep)를 사용하면 됩니다. 이때 얕은 복사본은 중첩 객체를 처리하지 못한다는 점을 기억해 두시기 바랍니다.
