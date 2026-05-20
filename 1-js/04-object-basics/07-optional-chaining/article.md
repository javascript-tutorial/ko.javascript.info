
# 옵셔널 체이닝 '?.'

[recent browser="new"]

옵셔널 체이닝(optional chaining) `?.`을 사용하면 프로퍼티가 없는 중첩 객체를 에러 없이 안전하게 접근할 수 있습니다.

## 옵셔널 체이닝이 필요한 이유

이제 막 자바스크립트를 배우기 시작했다면 옵셔널 체이닝이 등장하게 된 배경 상황을 직접 겪어보지 않았을 겁니다. 몇 가지 사례를 재현하면서 왜 옵셔널 체이닝이 등장했는지 알아봅시다.

사용자가 여러 명 있는데 그중 몇 명은 주소 정보를 가지고 있지 않다고 가정해봅시다.

이럴 때 `user.address.street`를 사용해 주소 정보에 접근하면 에러가 발생할 수 있습니다.

```js run
let user = {}; // 주소 정보가 없는 사용자

alert(user.address.street); // TypeError: Cannot read property 'street' of undefined
```

이는 예상된 결과입니다. 자바스크립트는 이런 식으로 동작합니다. `user.address`가 `undefined`이므로 `user.address.street`를 가져오려는 시도는 에러를 발생시킵니다.

실제 개발 환경에서는 이런 상황에서 에러 대신 `undefined`를 반환받는 것이 더 나은 경우가 많습니다.

또 다른 사례론 브라우저에서 동작하는 코드를 개발할 때 발생할 수 있는 문제가 있습니다. 자바스크립트를 사용해 페이지에 존재하지 않는 요소에 접근해 요소의 정보를 가져오려 하면 문제가 발생하죠.

```js run
// querySelector(...) 호출 결과가 null인 경우 에러 발생
let html = document.querySelector('.my-element').innerHTML;
```

이 경우에도 요소가 존재하지 않으면 `null의` `.innerHTML` 프로퍼티에 접근하려 했기 때문에 에러가 발생합니다. 요소가 없는 것이 정상적인 상황일 때도 있는데, 이럴 때는 에러를 피하고 그냥 `html = null`을 결과로 받아들이고 싶을 것입니다.

어떻게 하면 될까요?

가장 직관적인 해결책은 프로퍼티에 접근하기 전에 `if`문이나 조건부 연산자 `?`를 사용해 값을 확인하는 것입니다. 다음과 같이 말이죠.

```
let user = {};

alert(user.address ? user.address.street : undefined);
```

에러 없이 잘 동작하네요. 하지만 코드가 꽤 볼품없습니다. 보시다시피 `"user.address"`가 코드에 두 번이나 등장합니다.

`document.querySelector`를 사용한 예시는 다음과 같은 모습일 것입니다.

```
let html = document.querySelector('.elem') ? document.querySelector('.elem').innerHTML : null;
```

요소 검색을 위한 `document.querySelector('.elem')`이 실제로 두 번이나 호출된 것을 볼 수 있습니다. 좋지 않은 방법이죠.

프로퍼티가 더 깊이 중첩되어 있다면 코드는 반복이 늘어나 더 지저분해질 것입니다.

비슷한 방식으로 `user.address.street.name`을 가져와 보겠습니다.

```js
let user = {}; // 주소 정보가 없는 사용자

alert(user.address ? user.address.street ? user.address.street.name : null : null);
```

정말 끔찍하네요. 이런 코드는 이해하기조차 어려울 수 있습니다.

명세서에 `?.`이 추가되기 전엔 이런 문제들을 해결하기 위해 `&&` 연산자를 사용하곤 했습니다.

예시 :
```js run
let user = {}; // 주소 정보가 없는 사용자

alert( user && user.address && user.address.street ); // undefined, 에러가 발생하지 않습니다.
```

중첩 객체의 특정 프로퍼티에 접근하기 위해 거쳐야 할 구성요소들을 AND로 연결해 실제 해당 객체나 프로퍼티가 있는지 확인하는 방법을 사용했었죠. 그런데 이렇게 AND를 연결해서 사용하면 코드가 아주 길어진다는 단점이 있습니다.

보시다시피 프로퍼티 이름이 코드 내에서 여전히 중복되기 때문입니다. 예를 들어 위 코드에서는 `user.address`가 세 번이나 등장합니다.

바로 이런 문제를 완전히 해결하기 위해 옵셔널 체이닝(optional chaining) `?.`이 자바스크립트에 추가되었습니다!

## 옵셔널 체이닝의 등장

`?.`은 `?.`'앞'의 평가 대상이 `undefined`나 `null`이면 평가를 멈추고 `undefined`를 반환합니다.

**설명이 장황해지지 않도록 지금부턴 평가후 결과가 `null`이나 `undefined`가 아닌 경우엔 값이 '있다' 혹은 '존재한다'라고 표현하겠습니다.**


이제 옵셔널 체이닝을 사용해 `user.address.street`에 안전하게 접근해봅시다.

즉, `value?.prop`은 다음과 같이 평가됩니다.

- `value`가 존재하면 `value.prop`처럼 동작합니다.

- 그렇지 않은 경우(`value`가 `undefined`나 `null`일 때)에는 `undefined`를 반환합니다.

이제 `?.`을 사용해 `user.address.street`에 안전하게 접근해 봅시다.


```js run
let user = {}; // 주소 정보가 없는 사용자

alert( user?.address?.street ); // undefined, 에러가 발생하지 않습니다.
```

`user?.address`로 주소를 읽으면 아래와 같이 `user` 객체가 존재하지 않더라도 에러가 발생하지 않습니다.

코드가 짧고 깔끔해졌으며, 중복도 전혀 없습니다.

`document.querySelector`를 사용한 예시를 살펴봅시다.

```javascript
let html = document.querySelector('.elem')?.innerHTML; // 요소가 존재하지 않으면 undefined가 됩니다.
```

`user?.address`로 주소를 읽으면 아래와 같이 `user` 객체가 존재하지 않더라도 에러가 발생하지 않고 잘 동작합니다.


```js run
let user = null;

alert( user?.address ); // undefined
alert( user?.address.street ); // undefined
```

위 예시를 통해 우리는 `?.`은 `?.` '앞' 평가 대상에만 동작되고, 확장은 되지 않는다는 사실을 알 수 있습니다.

참고로 위 예시에서 사용된 `user?.`는 `user`가 `null`이나 `undefined`인 경우만 처리할 수 있습니다.

`user`가 `null`이나 `undefined`가 아니고 실제 값이 존재하는 경우엔 반드시 `user.address` 프로퍼티는 있어야 합니다. 그렇지 않으면 `user?.address.street`의 두 번째 점 연산자에서 에러가 발생합니다.

예를 들어, `user?.address.street.name`에서 `?.`은 `user`가 `null`이나 `undefined`가 되는 것을 안전하게 허용하지만(이 경우 `undefined`를 반환합니다), 이는 오직 `user`에만 적용됩니다. 그 이후에 이어지는 프로퍼티들은 일반적인 방식으로 접근됩니다. 만약 뒤이어 오는 프로퍼티들 중 일부도 선택적인(optional) 값으로 다루고 싶다면, `.`을 `?.`로 더 교체해야 합니다.

```warn header="옵셔널 체이닝을 남용하지 마세요."
`?.`는 존재하지 않아도 괜찮은 대상에만 사용해야 합니다.

사용자 주소를 다루는 위 예시에서 논리상 `user`는 반드시 있어야 하는데 `address`는 필수값이 아닙니다. 그러니 `user.address?.street`를 사용하는 것이 바람직합니다.

이렇게 하면 실수로 `user`가 `undefined`가 되었을 때 이를 알려주는 에러가 발생하므로 바로 확인하고 수정할 수 있습니다. 반대로 `?.`을 남용하면, 적절치 않은 상황에서도 에러가 조용히 무시되어 버리기 때문에 디버깅이 더욱 어려워집니다.
```

````warn header="`?.`앞의 변수는 꼭 선언되어 있어야 합니다."
변수 `user`가 선언되어있지 않으면 `user?.anything` 평가시 에러가 발생합니다.

```js run
// ReferenceError: user is not defined
user?.address;
```
`user?.anything`을 사용하려면 `let`이나 `const`, `var`를 사용해 `user`를 정의해야 하죠. 이렇게 옵셔널 체이닝은 선언이 완료된 변수를 대상으로만 동작합니다.
````

## 단락 평가

`?.`는 왼쪽 평가대상에 값이 없으면 즉시 평가를 멈춥니다. 참고로 이런 평가 방법을 단락 평가(short-circuit)라고 부릅니다.

그렇기 때문에 함수 호출을 비롯한 `?.` 오른쪽에 있는 부가 동작은 `?.`의 평가가 멈췄을 때 더는 일어나지 않습니다.

```js run
let user = null;
let x = 0;

user?.sayHi(x++); // 아무 일도 일어나지 않습니다.

alert(x); // 0, x는 증가하지 않습니다.
```

## ?.()와 ?.[]

`?.`은 연산자가 아닙니다. `?.`은 함수나 대괄호와 함께 동작하는 특별한 문법 구조체(syntax construct)입니다.

함수 관련 예시와 함께 존재 여부가 확실치 않은 함수를 호출할 때  `?.()`를 어떻게 쓸 수 있는지 알아봅시다.

한 객체엔 메서드 `admin`이 있지만 다른 객체엔 없는 상황입니다.

```js run
let userAdmin = {
  admin() {
    alert("관리자 계정입니다.");
  }
};

let userGuest = {};

*!*
user1.admin?.(); // 관리자 계정입니다.
user2.admin?.();
*/!*
```

두 상황 모두에서 user 객체는 존재하기 때문에 `admin` 프로퍼티는 `.`만 사용해 접근했습니다.

그리고 난 후 `?.()`를 사용해 `admin`의 존재 여부를 확인했습니다. `user1`엔 `admin`이 정의되어 있기 때문에 메서드가 제대로 호출되었습니다. 반면 `user2`엔 `admin`이 정의되어 있지 않았음에도 불구하고 메서드를 호출하면 에러 없이 그냥 평가가 멈추는 것을 확인할 수 있습니다.

`.`대신 대괄호 `[]`를 사용해 객체 프로퍼티에 접근하는 경우엔 `?.[]`를 사용할 수도 있습니다. 위 예시와 마찬가지로 `?.[]`를 사용하면 객체 존재 여부가 확실치 않은 경우에도 안전하게 프로퍼티를 읽을 수 있습니다.

```js run
let key = "firstName";

let user1 = {
  firstName: "Violet"
};

let user2 = null;

alert( user1?.[key] ); // Violet
alert( user2?.[key] ); // undefined
```

`?.`은 `delete`와 조합해 사용할 수도 있습니다.

예시:

```js run
delete user?.name; // user가 존재하면 user.name을 삭제합니다.
```

```warn header="`?.`은 읽기나 삭제하기에는 사용할 수 있지만 쓰기에는 사용할 수 없습니다."
`?.`은 할당 연산자 왼쪽에서 사용할 수 없습니다.

예시:
```js run
let user = null;
// user가 존재할 경우 user.name에 값을 쓰려는 의도로 아래와 같이 코드를 작성해 보았습니다.

user?.name = "Violet"; // SyntaxError: Invalid left-hand side in assignment
// 에러가 발생하는 이유는 undefined = "Violet"이 되기 때문입니다.
```

## 요약

옵셔널 체이닝 문법 `?.`은 세 가지 형태로 사용할 수 있습니다.

1. `obj?.prop` -- `obj`가 존재하면 `obj.prop`을 반환하고, 그렇지 않으면 `undefined`를 반환함
2. `obj?.[prop]` -- `obj`가 존재하면 `obj[prop]`을 반환하고, 그렇지 않으면 `undefined`를 반환함
3. `obj?.method()` -- `obj`가 존재하면 `obj.method()`를 호출하고, 그렇지 않으면 `undefined`를 반환함

여러 예시를 통해 살펴보았듯이 옵셔널 체이닝 문법은 꽤 직관적이고 사용하기도 쉽습니다. `?.` 왼쪽 평가 대상이 `null`이나 `undefined`인지 확인하고 `null`이나 `undefined`가 아니라면 평가를 계속 진행합니다.

`?.`를 계속 연결해서 체인을 만들면 중첩 프로퍼티들에 안전하게 접근할 수 있습니다.

`?.`은 `?.`왼쪽 평가대상이 없어도 괜찮은 경우에만 선택적으로 사용해야 합니다.

꼭 있어야 하는 값인데 없는 경우에 `?.`을 사용하면 프로그래밍 에러를 쉽게 찾을 수 없으므로 이런 상황을 만들지 말도록 합시다.
