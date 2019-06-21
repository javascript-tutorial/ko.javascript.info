
# Global object

The global object provides variables and functions that are available anywhere. Mostly, the ones that are built into the language or the environment.

In a browser it is named `window`, for Node.js it is `global`, for other environments it may have another name.

Recently, `globalThis` was added to the language, as a standartized name for a global object, that should be supported across all environments. In some browsers, namely non-Chromium Edge, `globalThis` is not yet supported, but can be easily polyfilled.

All properties of the global object can be accessed directly:

```js run
alert("Hello");

// the same as
window.alert("Hello");
```

브라우저에서 `var`로 선언한 전역 함수나 전역 변수는 전역 객체의 프로퍼티가 됩니다.

```js run untrusted refresh
var gVar = 5;

alert(window.gVar); // 5 (became a property of the global object)
```

Please don't rely on that! This behavior exists for compatibility reasons. Modern scripts use JavaScript modules where such thing doesn't happen. We'll cover them later in the chapter  [](info:modules).

Also, more modern variable declarations `let` and `const` do not exhibit such behavior at all:

```js run untrusted refresh
let gLet = 5;

alert(window.gLet); // undefined (doesn't become a property of the global object)
```

If a value is so important that you'd like to make it available globally, write it directly as a property:

```js run
*!*
// make current user information global, to let all scripts access it
window.currentUser = {
  name: "John"
};
*/!*

// somewhere else in code
alert(currentUser.name);  // John

// or, if we have a local variable with the name "currentUser"
// get it from window explicitly (safe!)
alert(window.currentUser.name); // John
```

That said, using global variables is generally discouraged. There should be as few global variables as possible. The code design where a function gets "input" variables and produces certain "outcome" is  clearer, less prone to errors and easier to test.

## Using for polyfills

We use the global object to test for support of modern language features.

For instance, test if a built-in `Promise` object exists (it doesn't in really old browsers):
```js run
if (!window.Promise) {
  alert("Your browser is really old!");
}
```

If there's none (say, we're in an old browser), we can create "polyfills": add functions that are not supported by the environment, but exist in the modern standard.

```js run
if (!window.Promise) {
  window.Promise = ... // custom implementation of the modern language feature
}
```

## Summary

- The global object holds variables that should be available everywhere.

    That includes JavaScript built-ins, such as `Array` and environment-specific values, such as `window.innerHeight` -- the window height in the browser.
- The global object has a universal name `globalThis`.

    하지만 대게 관습에 따라 브라우저 환경에선 `window`, Node.js에선 `global`이라는 이름으로 참조할 때가 많습니다. `globalThis`는 근래에 제안되었기 때문에, 모든 브라우저에서 이를 지원하진 않습니다. 따라서 폴리필을 구현해 이를 사용해야 합니다.
- 전역 객체에 변수를 저장하는 건 해당 변수가 프로젝트 전역에서 정말 필요할 때만 하도록 합시다. 가능한 한 최소한으로 사용합시다.
- [modules](info:modules)을 사용하고 있지 않은 경우라면 브라우저 환경에서 `var`로 선언한 전역 함수나 전역 변수는 전역 객체의 프로퍼티가 됩니다.
- 해석이 용이하고 요구사항 변경에 쉽게 대응하는 코드를 구현하려면 전역 객체는 `window.x = ...` 처럼 직접 조작해야 합니다.
