
# 전역 객체

전역 객체를 사용하면 어디서나 사용 가능한 변수나 함수를 만들 수 있습니다. 전역 객체는 언어 자체나 호스트 환경에 기본 내장되어 있는 경우가 많습니다.

브라우저 환경에선 전역 객체를 `window`, Node.js 환경에선 `global`라고 부르는데, 각 호스트 환경마다 부르는 이름은 다릅니다. 

<<<<<<< HEAD
전역 객체의 이름을 `globalThis`로 표준화하자는 내용이 최근에 자바스크립트 명세에 추가되었기 때문에 모든 호스트 환경이 이를 따라야 하죠. Chromium 기반이 아닌 몇몇 브라우저는 아직 `globalThis`를 지원하진 않지만, 이에 대한 폴리필(polyfill)을 쉽게 만들 수 있습니다.
=======
Recently, `globalThis` was added to the language, as a standardized name for a global object, that should be supported across all environments. It's supported in all major browsers.
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115

본 튜토리얼은 브라우저 환경에서 구동되기 때문에 `window`라는 전역 객체를 사용하도록 하겠습니다. 다른 호스트 환경에서 작업하고 계신다면 `window`대신 `globalThis`를 사용하시면 됩니다.

전역 객체의 모든 프로퍼티는 아래와 같이 직접 접근할 수 있습니다.

```js run
alert("Hello");
// 위와 동일하게 동작합니다.
window.alert("Hello");
```

브라우저에서 `let`이나 `const`가 아닌 `var`로 선언한 전역 함수나 전역 변수는 전역 객체의 프로퍼티가 됩니다.

```js run untrusted refresh
var gVar = 5;

alert(window.gVar); // 5 (var로 선언한 변수는 전역 객체 window의 프로퍼티가 됩니다)
```

<<<<<<< HEAD
하위 호환성 때문에 이런 방식으로 전역 객체를 사용해도 동작은 하지만, 이 방법은 쓰지 않으시길 바랍니다. [모듈](info:modules)을 사용하는 모던 자바스크립트는 이런 방식을 지원하지 않습니다.
=======
The same effect have function declarations (statements with `function` keyword in the main code flow, not function expressions).

Please don't rely on that! This behavior exists for compatibility reasons. Modern scripts use [JavaScript modules](info:modules) where such a thing doesn't happen.
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115

`var` 대신 `let`을 사용하면 위 예시와는 달리 전역 객체를 통해 변수에 접근할 수 없습니다.

```js run untrusted refresh
let gLet = 5;

alert(window.gLet); // undefined (let으로 선언한 변수는 전역 객체의 프로퍼티가 되지 않습니다.)
```

중요한 변수라서 모든 곳에서 사용할 수 있게 하려면, 아래와 같이 전역 객체에 직접 프로퍼티를 추가해 주시기 바랍니다.

```js run
*!*
// 모든 스크립트에서 현재 사용자(current user)에 접근할 수 있게 이를 전역 객체에 추가함
window.currentUser = {
  name: "John"
};
*/!*

// 아래와 같은 방법으로 모든 스크립트에서 currentUser에 접근할 수 있음
alert(currentUser.name);  // John

// 지역 변수 'currentUser'가 있다면
// 지역 변수와 충돌 없이 전역 객체 window에서 이를 명시적으로 가져올 수 있음
alert(window.currentUser.name); // John
```

전역 변수는 되도록 사용하지 않는 것이 좋습니다. 함수를 만들 땐 외부 변수나 전역 변수를 사용하는 것보다 '인풋' 변수를 받고 이를 이용해 '아웃풋'을 만들어내게 해야 테스트도 쉽고, 에러도 덜 만들어냅니다. 

## 폴리필 사용하기

전역 객체를 이용해 현재 사용중인 브라우저가 최신 자바스크립트 기능을 지원하는지 여부를 확인할 수 있습니다.

내장 객체 `Promise`를 지원하는지 여부를 아래와 같이 테스트할 수 있죠. 구식 브라우저는 `Promise` 객체를 지원하지 않기 때문에 `alert` 창이 뜰 겁니다.
```js run
if (!window.Promise) {
  alert("구식 브라우저를 사용 중이시군요!");
}
```

명세에는 있는 기능이지만 해당 기능을 지원하지 않는 오래된 브라우저를 사용하고 있다면 직접 함수를 만들어 전역 객체에 추가하는 방식으로 "폴리필"을 만들 수 있습니다.

```js run
if (!window.Promise) {
  window.Promise = ... // 모던 자바스크립트에서 지원하는 기능을 직접 구현함
}
```

## 요약

- 전역 객체를 사용하면 어디서든 접근 가능한 변수를 만들 수 있습니다.

    전역 객체엔 `Array`와 같은 내장 객체, `window.innerHeight`(뷰포트의 높이를 반환함)같은 브라우저 환경 전용 변수 등이 저장되어 있습니다.
- 전역 객체는 `globalThis`라는 보편적인 이름으로 불립니다.

<<<<<<< HEAD
    하지만 '관습'에 따라 브라우저에서는 `window`, Node.js에서는 `global`이라는 이름으로 불릴 때가 많습니다. `globalThis`는 제안 목록에 추가 된 지 얼마 안 된 기능이기 때문에, 비 크로미움 기반 브라우저에선 지원하지 않습니다(폴리필을 구현하면 사용할 수 있습니다).
- 프로젝트 전체에서 꼭 필요한 변수만 전역 객체에 저장하도록 하고, 전역 변수는 가능한 한 최소한으로 사용합시다.
- [모듈](info:modules)을 사용하고 있지 않다면, 브라우저에서 `var`로 선언한 전역 변수는 전역 객체의 프로퍼티가 됩니다.
- 이해하기 쉽고 요구사항 변경에 쉽게 대응할 수 있는 코드를 구현하려면, `window.x`처럼 전역 객체의 프로퍼티에 직접 접근합시다.
=======
    ...But more often is referred by "old-school" environment-specific names, such as `window` (browser) and `global` (Node.js).
- We should store values in the global object only if they're truly global for our project. And keep their number at minimum.
- In-browser, unless we're using [modules](info:modules), global functions and variables declared with `var` become a property of the global object.
- To make our code future-proof and easier to understand, we should access properties of the global object directly, as `window.x`.
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115
