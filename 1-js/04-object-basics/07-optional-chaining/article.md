
# 옵셔널 체이닝 '?.'

[recent browser="new"]

옵셔널 체이닝(optional chaining) `?.`을 사용하면 프로퍼티가 없는 중첩 객체를 에러 없이 안전하게 접근할 수 있습니다.

## 옵셔널 체이닝이 필요한 이유

이제 막 자바스크립트를 배우기 시작했다면 옵셔널 체이닝이 등장하게 된 배경 상황을 직접 겪어보지 않았을 겁니다. 몇 가지 사례를 재현하면서 왜 옵셔널 체이닝이 등장했는지 알아봅시다.

사용자가 여러 명 있는데 그중 몇 명은 주소 정보를 가지고 있지 않다고 가정해봅시다. 이럴 때 `user.address.street`를 사용해 주소 정보에 접근하면 에러가 발생할 수 있습니다.

```js run
let user = {}; // 주소 정보가 없는 사용자

alert(user.address.street); // TypeError: Cannot read property 'street' of undefined
```

또 다른 사례는 브라우저에서 동작하는 코드를 개발할 때 발생할 수 있는 문제로, 페이지에 존재하지 않는 요소에 접근해 요소의 정보를 가져오려 할 때 발생합니다.

```js run
// querySelector(...) 호출 결과가 null인 경우 에러 발생
let html = document.querySelector('.my-element').innerHTML;
```

명세서에 `?.`이 추가되기 전엔 이런 문제들을 해결하기 위해 `&&` 연산자를 사용하곤 했습니다.

예시:

```js run
let user = {}; // 주소 정보가 없는 사용자

alert( user && user.address && user.address.street ); // undefined, 에러가 발생하지 않습니다.
```

중첩 객체의 특정 프로퍼티에 접근하기 위해 거쳐야 할 구성요소들을 AND로 연결해 실제 해당 객체나 프로퍼티가 있는지 확인하는 방법을 사용했었죠. 그런데 이렇게 AND를 연결해서 사용하면 코드가 아주 길어진다는 단점이 있습니다.

## 옵셔널 체이닝의 등장

`?.`은 `?.`'앞'의 평가 대상이 `undefined`나 `null`이면 평가를 멈추고 `undefined`를 반환합니다.

**설명이 장황해지지 않도록 지금부턴 평가후 결과가 `null`이나 `undefined`가 아닌 경우엔 값이 '있다', '존재한다'라고 표현하겠습니다.**


옵셔널 체이닝을 사용해 `user.address.street`에 안전하게 접근해봅시다.

```js run
let user = {}; // 주소 정보가 없는 사용자

alert( user?.address?.street ); // undefined, 에러가 발생하지 않습니다.
```

`user?.address`로 주소를 읽으면 아래와 같이 `user` 객체가 존재하지 않더라도 에러가 발생하지 않습니다.

```js run
let user = null;

alert( user?.address ); // undefined
alert( user?.address.street ); // undefined
```

위 예시를 통해 우리는 `?.`은 `?.` '앞' 평가 대상에만 동작되고, 확장은 되지 않는다는 사실을 알 수 있습니다.

In the example above, `user?.` allows only `user` to be `null/undefined`.

On the other hand, if `user` does exist, then it must have `user.address` property, otherwise `user?.address.street` gives an error at the second dot.

```warn header="옵셔널 체이닝을 남용하지 마세요."
`?.`는 존재하지 않아도 괜찮은 대상에만 사용해야 합니다.

사용자 주소를 다루는 위 예시에서 논리상 `user`는 반드시 있어야 하는데 `address`는 필수값이 아닙니다. 그러니 `user.address?.street`를 사용하는 것이 바람직합니다.

실수로 인해 `user`에 값을 할당하지 않았다면 바로 알아낼 수 있도록 해야 합니다. 그렇지 않으면 에러를 조기에 발견하지 못하고 디버깅이 어려워집니다.
```

````warn header="`?.`앞의 변수는 꼭 선언되어 있어야 합니다."
변수 `user`가 선언되어있지 않으면 `user?.anything` 평가시 에러가 발생합니다.

```js run
// ReferenceError: user is not defined
user?.address;
```
There must be `let/const/var user`. The optional chaining works only for declared variables.
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
let user1 = {
  admin() {
    alert("관리자 계정입니다.");
  }
}

let user2 = {};

*!*
user1.admin?.(); // 관리자 계정입니다.
user2.admin?.();
*/!*
```

두 상황 모두에서 user 객체는 존재하기 때문에 `admin` 프로퍼티는 `.`만 사용해 접근했습니다.

그리고 난 후 `?.()`를 사용해 `admin`의 존재 여부를 확인했습니다. `user1`엔 `admin`이 정의되어 있기 때문에 메서드가 제대로 호출되었습니다. 반면 `user2`엔 `admin`이 정의되어 있지 않았음에도 불구하고 메서드를 호출하면 에러 없이 그냥 평가가 멈추는 것을 확인할 수 있습니다.

`.`대신 대괄호 `[]`를 사용해 객체 프로퍼티에 접근하는 경우엔 `?.[]`를 사용할 수도 있습니다. 위 예시와 마찬가지로 `?.[]`를 사용하면 객체 존재 여부가 확실치 않은 경우에도 안전하게 프로퍼티를 읽을 수 있습니다.

```js run
let user1 = {
  firstName: "Violet"
};

let user2 = null; // user2는 권한이 없는 사용자라고 가정해봅시다.

let key = "firstName";

alert( user1?.[key] ); // Violet
alert( user2?.[key] ); // undefined

alert( user1?.[key]?.something?.not?.existing); // undefined
```

`?.`은 `delete`와 조합해 사용할 수도 있습니다.

```js run
delete user?.name; // user가 존재하면 user.name을 삭제합니다.
```

```warn header="`?.`은 읽기나 삭제하기에는 사용할 수 있지만 쓰기에는 사용할 수 없습니다."
`?.`은 할당 연산자 왼쪽에서 사용할 수 없습니다.

```js run
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
