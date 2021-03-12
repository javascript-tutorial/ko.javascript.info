# 네이티브 프로토타입

`prototype` 프로퍼티는 자바스크립트 내부에서도 광범위하게 사용됩니다. 모든 내장 생성자 함수에서 `prototype` 프로퍼티를 사용하죠.

첫 번째로 자세히 살펴본 다음 어떻게 내장 객체에 새 기능을 추가하여 프로토타입 프로퍼티를 사용하는지 알아보겠습니다.

## Object.prototype

빈 객체를 표현한다고 해 봅시다.

```js run
let obj = {};
alert( obj ); // "[object Object]" ?
```

`"[object Object]"` 문자열을 생성하는 코드는 어디에 있을까요? `toString` 메서드에서 이 문자열을 생성한다는 것을 앞서 배워서 알고 있지만 도대체 코드는 어디에 있는 걸까요? `obj`는 비어 있는데 말이죠.

`obj = new Object()`를 줄이면 `obj = {}`가 됩니다. 여기서 `Object`는 내장 객체 생성자 함수인데, 이 생성자 함수의 `prototype`은 `toString`을 비롯한 다양한 메서드가 구현되어있는 거대한 객체를 참조합니다.

그림을 이용해 살펴봅시다.

![](object-prototype.svg)

`new Object()`를 호출하거나 리터럴 문법 `{...}`을 사용해 객체를 만들 때, 새롭게 생성된 객체의 `[[Prototype]]`은 이전 챕터에서 언급한 규칙에 따라 `Object.prototype`을 참조합니다.

![](object-prototype-1.svg)

따라서 `obj.toString()`을 호출하면 `Object.prototype`에서 해당 메서드를 가져오게 되죠.

예시를 통해 이를 확인할 수 있습니다.

```js run
let obj = {};

alert(obj.__proto__ === Object.prototype); // true

alert(obj.toString === obj.__proto__.toString); //true
alert(obj.toString === Object.prototype.toString); //true
```

그런데 이때 `Object.prototype` 위의 체인엔 `[[Prototype]]`이 없다는 점을 주의하셔야 합니다.

```js run
alert(Object.prototype.__proto__); // null
```

## 다른 내장 프로토타입

`Array`, `Date`, `Function`을 비롯한 내장 객체들 역시 프로토타입에 메서드를 저장해 놓습니다.

배열 `[1, 2, 3]`을 만들면 기본 `new Array()` 생성자가 내부에서 사용되기 때문에 `Array.prototype`이 배열 `[1, 2, 3]`의 프로토타입이 되죠. `Array.prototype`은 배열 메서드도 제공합니다. 이런 내부 동작은 메모리 효율을 높여주는 장점을 가져다줍니다.

명세서에선 모든 내장 프로토타입의 꼭대기엔 `Object.prototype`이 있어야 한다고 규정합니다. 이런 규정 때문에 몇몇 사람들은 "모든 것은 객체를 상속받는다."라는 말을 하죠.

세 개의 내장 객체를 이용해 전체적인 그림을 그리면 다음과 같습니다.

![](native-prototypes-classes.svg)

각 내장 객체의 프로토타입을 확인해 보겠습니다.

```js run
let arr = [1, 2, 3];

// arr은 Array.prototype을 상속받았나요?
alert( arr.__proto__ === Array.prototype ); // true

// arr은 Object.prototype을 상속받았나요?
alert( arr.__proto__.__proto__ === Object.prototype ); // true

// 체인 맨 위엔 null이 있습니다.
alert( arr.__proto__.__proto__.__proto__ ); // null
```

체인 상의 프로토타입엔 중복 메서드가 있을 수 있습니다. `Array.prototype`엔 요소 사이에 쉼표를 넣어 요소 전체를 합친 문자열을 반환하는 자체 메서드 `toString`가 있습니다.

```js run
let arr = [1, 2, 3]
alert(arr); // 1,2,3 <-- Array.prototype.toString 의 결과
```

그런데 `Object.prototype`에도 메서드 `toString`이 있습니다. 이렇게 중복 메서드가 있을 때는 체인 상에서 가까운 곳에 있는 메서드가 사용됩니다. `Array.prototype`이 체인 상에서 더 가깝기 때문에 `Array.prototype`의 `toString`이 사용되죠.


![](native-prototypes-array-tostring.svg)


Chrome 개발자 콘솔과 같은 도구를 사용하면 상속 관계를 확인할 수 있습니다. `console.dir`를 사용하면 내장 객체의 상속 관계를 확인하는 데 도움이 됩니다.

![](console_dir_array.png)

배열이 아닌 다른 내장 객체들 또한 같은 방법으로 동작합니다. 함수도 마찬가지이죠. 함수는 내장 객체 `Function`의 생성자를 사용해 만들어지는데 `call`, `apply`를 비롯한 함수에서 사용할 수 있는 메서드는 `Fuction.prototype`에서 가져옵니다. 함수에도 `toString`이 구현되어 있습니다.

```js run
function f() {}

alert(f.__proto__ == Function.prototype); // true
alert(f.__proto__.__proto__ == Object.prototype); // true, 객체에서 상속받음
```

## 원시값

문자열과 숫자 불린값을 다루는 것은 엄청 까다롭습니다.

문자열과 숫자 불린값은 객체가 아닙니다. 그런데 이런 원시값들의 프로퍼티에 접근하려고 하면 내장 생성자 `String`, `Number`, `Boolean`을 사용하는 임시 래퍼(wrapper) 객체가 생성됩니다. 임시 래퍼 객체는 이런 메서드를 제공하고 난 후에 사라집니다.

래퍼 객체는 보이지 않는 곳에서 만들어집니다. 최적화는 엔진이 담당하죠. 그런데 명세서에선 각 자료형에 해당하는 래퍼 객체의 메서드를 프로토타입 안에 구현해 놓고  `String.prototype`, `Number.prototype`, `Boolean.prototype`을 사용해 쓸 수 있도록 규정합니다. 

```warn header="`null`과 `undefined`에 대응하는 래퍼 객체는 없습니다."
특수 값인 `null`과 `undefined`는 문자열과 숫자 불린값과는 거리가 있습니다. `null`과 `undefined`에 대응하는 래퍼 객체는 없죠. 따라서 `null`과 `undefined`에선 메서드와 프로퍼티를 이용할 수 없습니다. 프로토타입도 물론 사용할 수 없습니다.
```

## 네이티브 프로토타입 변경하기[#native-prototype-change]

네이티브 프로토타입을 수정할 수 있습니다. `String.prototype`에 메서드를 하나 추가하면 모든 문자열에서 해당 메서드를 사용할 수 있죠.

```js run
String.prototype.show = function() {
  alert(this);
};

"BOOM!".show(); // BOOM!
```

개발을 하다 보면 "새로운 내장 메서드를 만드는 게 좋지 않을까?"라는 생각이 들 때가 있습니다. 네이티브 프로토타입에 새 내장 메서드를 추가하고 싶은 유혹이 자꾸 생기죠. 그런데 이는 좋지 않은 방법입니다.

```warn
프로토타입은 전역으로 영향을 미치기 때문에 프로토타입을 조작하면 충돌이 날 가능성이 높습니다. 두 라이브러리에서 동시에 `String.prototype.show` 메서드를 추가하면 한 라이브러리의 메서드가 다른 라이브러리의 메서드를 덮어쓰죠.

이런 이유로 네이티브 프로토타입을 수정하는 것을 추천하지 않습니다.
```

**모던 프로그래밍에서 네이티브 프로토타입 변경을 허용하는 경우는 딱 하나뿐입니다. 바로 폴리필을 만들 때입니다.**

폴리필은 자바스크립트 명세서에 있는 메서드와 동일한 기능을 하는 메서드 구현체를 의미합니다. 명세서에는 정의되어 있으나 특정 자바스크립트 엔진에서는 해당 기능이 구현되어있지 않을 때 폴리필을 사용합니다.

폴리필을 직접 구현하고 난 후 폴리필을 내장 프로토타입에 추가할 때만 네이티브 프로토타입을 변경합시다.

예시:

```js run
if (!String.prototype.repeat) { // repeat이라는 메서드가 없다고 가정합시다
  // 프로토타입에 repeat를 추가

  String.prototype.repeat = function(n) {
    // string을 n회 반복(repeat)합니다.

    // 실제 이 메서드를 구현하려면 코드는 더 복잡해질겁니다.
    // 전체 알고리즘은 명세서에서 확인할 수 있겠죠.
    // 그런데 완벽하지 않은 폴리필이라도 충분히 쓸만합니다.
    return new Array(n + 1).join(this);
  };
}

alert( "La".repeat(3) ); // LaLaLa
```


## 프로토타입에서 빌려오기

<info:call-apply-decorators#method-borrowing>에서 메서드 빌리기에 대한 내용을 학습한 바 있습니다.

한 객체의 메서드를 다른 객체로 복사할 때 이 기법이 사용됩니다.

개발을 하다 보면 네이티브 프로토타입에 구현된 메서드를 빌려야 하는 경우가 종종 생깁니다.

유사 배열 객체를 만들고 여기에 `Array` 메서드를 복사해봅시다. 

예시:

```js run
let obj = {
  0: "Hello",
  1: "world!",
  length: 2,
};

*!*
obj.join = Array.prototype.join;
*/!*

alert( obj.join(',') ); // Hello,world!
```

예시를 실행하면 에러 없이 의도한 대로 동작합니다. 내장 메서드 `join`의 내부 알고리즘은 제대로 된 인덱스가 있는지와 `length` 프로퍼티가 있는지만 확인하기 때문입니다. 호출 대상이 진짜 배열인지는 확인하지 않죠. 다수의 내장 메서드가 이런 식으로 동작합니다.

메서드 빌리기 말고도 `obj.__proto__`를 `Array.prototype`로 설정해 배열 메서드를 상속받는 방법이 있습니다. 이렇게 하면 `obj`에서 모든 `Array`메서드를 사용할 수 있습니다. 
 
그런데 이 방법은 `obj`가 다른 객체를 상속받고 있을 때는 사용할 수 없습니다. 자바스크립트는 단일 상속만을 허용한다는 점을 기억하시기 바랍니다.

메서드 빌리기는 유연합니다. 여러 객체에서 필요한 기능을 가져와 섞는 것을 가능하게 해줍니다.

## 요약

- 모든 내장 객체는 같은 패턴을 따릅니다.
    - 메서드는 프로토타입에 저장됩니다(`Array.prototype`, `Object.prototype`, `Date.prototype` 등).
    - 객체 자체엔 데이터만 저장합니다(배열의 요소, 객체의 프로퍼티, 날짜 등).
- 원시값 또한 래퍼 객체의 프로토타입에 `Number.prototype`, `String.prototype`, `Boolean.prototype` 같은 메서드를 저장합니다. `undefined`와 `null` 값은 래퍼 객체를 가지지 않습니다.
- 내장 프로토타입을 수정할 수 있습니다. 내장 프로토타입의 메서드를 빌려와 새로운 메서드를 만드는 것 역시 가능합니다. 그러나 내장 프로토타입 변경은 되도록 하지 않아야 합니다. 내장 프로토타입은 새로 명세서에 등록된 기능을 사용하고 싶은데 자바스크립트 엔진엔 이 기능이 구현되어있지 않을 때만 변경하는 게 좋습니다. 
