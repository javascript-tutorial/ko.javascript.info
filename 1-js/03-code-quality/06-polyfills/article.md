
<<<<<<< HEAD
# 폴리필
=======
# Polyfills and transpilers
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

자바스크립트는 끊임없이 진화하는 언어입니다. 새로운 제안(proposal)이 정기적으로 등록, 분석되고, 가치가 있다고 판단되는 제안은 <https://tc39.github.io/ecma262/>에 추가됩니다. 그리고 궁극적으로 [명세서(specification)](http://www.ecma-international.org/publications/standards/Ecma-262.htm)에 등록됩니다.

자바스크립트 엔진을 만드는 각 조직은 나름대로 우선순위를 매겨 명세서 내 어떤 기능을 먼저 구현할지 결정합니다. 명세서에 등록된 기능보다 초안(draft)에 있는 제안을 먼저 구현하기로 결정하는 경우도 있습니다. 구현 난도가 높아서 이런 결정을 내리는 경우도 있지만, 구미를 당기지 않아 이런 결정을 내리기도 합니다.

엔진이 표준 전체를 지원하지 않고 일부만 지원하는 건 흔한 일이죠.

엔진별로 어떤 기능을 지원하고 있는지는 <https://kangax.github.io/compat-table/es6/>에서 확인할 수 있습니다. 표가 상당히 큰데, 각 기능에 대해선 차근차근 배울 예정이니 너무 겁먹지 않으셔도 됩니다.

<<<<<<< HEAD
## 바벨

명세서에 등록된 지 얼마 안 된 기능을 사용해 코드를 작성하다 보면 특정 엔진에서 우리가 작성한 코드를 지원하지 않는다는 걸 알게 되는 경우가 있습니다. 명세서 내 모든 기능을 모든 엔진이 구현하고 있지 않기 때문이죠.

이럴 때 바벨을 사용할 수 있습니다.

[바벨(Babel)](https://babeljs.io)은 [트랜스파일러(transpiler)](https://en.wikipedia.org/wiki/Source-to-source_compiler)로, 모던 자바스크립트 코드를 구 표준을 준수하는 코드로 바꿔줍니다.

바벨의 주요 역할은 다음과 같습니다.

1. 트랜스파일러 -- 바벨은 코드를 재작성해주는 트랜스파일러 프로그램입니다. 바벨은 개발자의 컴퓨터에서 돌아가는데, 이를 실행하면 기존 코드가 구 표준을 준수하는 코드로 변경됩니다. 변경된 코드는 웹사이트 형태로 사용자에게 전달됩니다. [웹팩(webpack)](http://webpack.github.io/)과 같은 모던 프로젝트 빌드 시스템은 코드가 수정될 때마다 자동으로 트랜스파일러를 동작시켜줍니다. 이런 과정이 없으면 개발이 끝난 코드를 한데 통합하는 데 어려움이 있을 수 있습니다.

2. 폴리필

    명세서엔 새로운 문법이나 기존에 없던 내장 함수에 대한 정의가 추가되곤 합니다. 
    새로운 문법을 사용해 코드를 작성하면 트랜스파일러는 이를 구 표준을 준수하는 코드로 변경해줍니다. 반면, 새롭게 표준에 추가된 함수는 명세서 내 정의를 읽고 이에 맞게 직접 함수를 구현해야 사용할 수 있습니다. 자바스크립트는 매우 동적인 언어라서 원하기만 하면 어떤 함수라도 스크립트에 추가할 수 있습니다. 물론 기존 함수를 수정하는 것도 가능합니다. 개발자는 스크립트에 새로운 함수를 추가하거나 수정해서 스크립트가 최신 표준을 준수 할 수 있게 작업할 수 있습니다.

    이렇게 변경된 표준을 준수할 수 있게 기존 함수의 동작 방식을 수정하거나, 새롭게 구현한 함수의 스크립트를 "폴리필(polyfill)"이라 부릅니다. 폴리필(poly`fill`)은 말 그대로 구현이 누락된 새로운 기능을 메꿔주는(`fill in`) 역할을 합니다.

    주목할 만한 폴리필 두 가지는 아래와 같습니다.
    - [core js](https://github.com/zloirock/core-js) -- 다양한 폴리필을 제공합니다. 특정 기능의 폴리필만 사용하는 것도 가능합니다.
    - [polyfill.io](http://polyfill.io) -- 기능이나 사용자의 브라우저에 따라 폴리필 스크립트를 제공해주는 서비스입니다.

모던 자바스크립트를 이용해 스크립트를 작성하려면 트랜스파일러와 폴리필은 필수입니다.

## 튜토리얼에서 예시 실행하기
=======
As programmers, we'd like to use most recent features. The more good stuff - the better!

On the other hand, how to make our modern code work on older engines that don't understand recent features yet?

There are two tools for that:

1. Transpilers.
2. Polyfills.

Here, in this chapter, our purpose is to get the gist of how they work, and their place in web development.

## Transpilers

A [transpiler](https://en.wikipedia.org/wiki/Source-to-source_compiler) is a special piece of software that can parse ("read and understand") modern code, and rewrite it using older syntax constructs, so that the result would be the same.

E.g. JavaScript before year 2020 didn't have the "nullish coalescing operator" `??`. So, if a visitor uses an outdated browser, it may fail to understand the code like `height = height ?? 100`.

A transpiler would analyze our code and rewrite `height ?? 100` into `(height !== undefined && height !== null) ? height : 100`.

```js
// before running the transpiler
height = height ?? 100;

// after running the transpiler
height = (height !== undefined && height !== null) ? height : 100;
```

Now the rewritten code is suitable for older JavaScript engines.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

Usually, a developer runs the transpiler on their own computer, and then deploys the transpiled code to the server.

<<<<<<< HEAD
````online
튜토리얼 내 예시 대부분은 아래와 같이 클릭 한 번으로 바로 실행할 수 있습니다.

```js run
alert('우측 상단 모서리에 있는 "재생" 버튼을 눌러 스크립트를 실행해 보세요.');
```

모던 자바스크립트를 사용해 작성한 예시는 해당 기능을 지원하는 브라우저에서만 작동합니다.
````

```offline
오프라인에서 PDF 포맷으로 튜토리얼을 읽고 계신다면 예시를 실행할 수 없습니다. EPUB에선 일부 예시가 실행 가능합니다.
```

Google Chrome은 모든 브라우저 중 대개 가장 먼저 최신 기능을 지원합니다. 트랜스파일러 없이 최신 기능을 사용할 수 있기 때문에 Chrome은 데모용으로 사용하기 좋습니다. 그런데 다른 브라우저들도 많이 뒤처지는 편은 아니니 안심하고 사용하셔도 될 것 같습니다.
=======
Speaking of names, [Babel](https://babeljs.io) is one of the most prominent transpilers out there. 

Modern project build systems, such as [webpack](http://webpack.github.io/), provide means to run transpiler automatically on every code change, so it's very easy to integrate into development process.

## Polyfills

New language features may include not only syntax constructs and operators, but also built-in functions.

For example, `Math.trunc(n)` is a function that "cuts off" the decimal part of a number, e.g `Math.trunc(1.23)` returns `1`.

In some (very outdated) JavaScript engines, there's no `Math.trunc`, so such code will fail.

As we're talking about new functions, not syntax changes, there's no need to transpile anything here. We just need to declare the missing function.

A script that updates/adds new functions is called "polyfill". It "fills in" the gap and adds missing implementations.

For this particular case, the polyfill for `Math.trunc` is a script that implements it, like this:

```js
if (!Math.trunc) { // if no such function
  // implement it
  Math.trunc = function(number) {
    // Math.ceil and Math.floor exist even in ancient JavaScript engines
    // they are covered later in the tutorial
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  };
}
```

JavaScript is a highly dynamic language, scripts may add/modify any functions, even including built-in ones. 

Two interesting libraries of polyfills are:
- [core js](https://github.com/zloirock/core-js) that supports a lot, allows to include only needed features.
- [polyfill.io](http://polyfill.io) service that provides a script with polyfills, depending on the features and user's browser.


## Summary

In this chapter we'd like to motivate you to study modern and even "bleeding-edge" language features, even if they aren't yet well-supported by JavaScript engines.

Just don't forget to use transpiler (if using modern syntax or operators) and polyfills (to add functions that may be missing). And they'll ensure that the code works.

For example, later when you're familiar with JavaScript, you can setup a code build system based on [webpack](http://webpack.github.io/) with [babel-loader](https://github.com/babel/babel-loader) plugin.

Good resources that show the current state of support for various features:
- <https://kangax.github.io/compat-table/es6/> - for pure JavaScript.
- <https://caniuse.com/> - for browser-related functions.

P.S. Google Chrome is usually the most up-to-date with language features, try it if a tutorial demo fails. Most tutorial demos work with any modern browser though.

>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
