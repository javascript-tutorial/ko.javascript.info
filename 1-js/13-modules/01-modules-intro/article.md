
# 모듈 소개

개발하는 애플리케이션의 크기가 커질수록 파일을 여러개로 쪼개고자 하는 욕구는 강해집니다. 이 때 쪼개놓은 하나의 파일을 '모듈'이라고 부릅니다.
모듈은 대게 클래스 하나 혹은 복수의 함수로 구성된 라이브러리 하나를 담습니다.

자바스크립트 생태계는 오랫동안 언어 수준에서 지원하는 모듈 문법 없이 성장해 왔습니다. 이 점이 문제가 되진 않았습니다. 초기 스크립트는 크기도 작고 간단했기 때문이죠. 그래서 모듈의 필요성이 대두되지 않았습니다.  

하지만 스크립트의 크기가 점차 커지고 복잡해지기 시작했습니다. 그래서 자바스크립트 커뮤니티는 모듈이라는 개념을 도입해 코드를 체계화 하려는 여러가지 시도를 하였습니다.   

예:

- [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition)는 가장 오래된 모듈 시스템 중 하나입니다. [require.js](http://requirejs.org/)라는 라이브러리를 통해 처음 개발되었습니다.
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)는 Node.js 서버를 위해 만들어진 모듈 시스템입니다.
- [UMD](https://github.com/umdjs/umd)는 여러 모듈 시스템을 함께 사용하기위해 만들어졌습니다. AMD와 CommonJS와 호환됩니다.

위 모듈 시스템은 오래된 스크립트에서 찾아 볼 수 있는데, 이제는 역사의 뒤안길로 사라져가고 있습니다. 언어 차원에서 지원하는 모듈 시스템이 2015년부터 등장했기 때문입니다. 이제는 거의 대부분의 주요 브라우저와 Node.js에서 모듈 시스템을 지원하고 있습니다.  

## 모듈이란?

모듈은 단순한 파일입니다. 하나의 스크립트죠. 아주 간단합니다.

모듈간 기능 공유는 지시자 `export`와 `import`를 이용하면 됩니다.

- `export` 키워드를 변수나 함수 앞에 붙이면, 이 변수나 함수는 파일 외부에서 접근 할 수 있습니다.
- `import` 키워드는 다른 모듈에서 기능을 가져올 때 사용합니다.

파일 `sayHi.js` 내부에 있는 함수를 외부로 내보내는(export) 예시를 살펴보도록 하죠.

```js
// 📁 sayHi.js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
```

이제 다른 파일에서 위 함수를 가져오고(import) 사용할 수 있습니다.

```js
// 📁 main.js
import {sayHi} from './sayHi.js';

alert(sayHi); // 함수
sayHi('John'); // Hello, John!
```

본 튜토리얼은 실행 환경에 상관 없이 자바스크립트 언어 자체에 대해 다루고자 하였으나, 브라우저를 데모 환경으로 사용중이므로 브라우저에서 어떻게 모듈이 동작하는지 알아보도록 하겠습니다.

모듈을 사용하려면 `<script type="module">` 같이 속성을 설정해 주어야 합니다. 

[codetabs src="say" height="140" current="index.html"]

브라우저는 스크립트 내 import 키워드를 만낫을 때 자동으로 모듈을 가져오고 평가한 다음, 스크립트를 실행합니다.

## 모듈의 핵심 기능

그냥 "일반적인" 스크립트와 모듈의 차이는 무엇일까요?

브라우저와 서버사이드 자바스크립트 환경에서 모두 적용되는 모듈의 기능은 다음과 같습니다. 

### "use strict"이 항상 적용됩니다

모듈은 항상 `use strict(엄격 모드)`로 실행됩니다. 그래서 선언되지 않은 변수에 값을 할당하면 에러가 발생하죠. 

```html run
<script type="module">
  a = 5; // error
</script>
```

위 예시를 통해 브라우저 환경에서 모듈은 엄격모드로 실행된다는 것을 확인하였습니다. 모든 환경에서도 마찬가지입니다.

### 모듈 레벨 스코프

각 모듈은 자기만의 상위 레벨 스코프를 갖습니다. 즉, 모듈 최상위 레벨의 변수와 함수는 다른 스크립트(모듈)에서 접근할 수 없습니다. 

아래 예시를 통해 이를 알아봅시다. 두개의 스크립트를 임포트 한 상황입니다. `user.js`에서 선언한 변수 `user`를 `hello.js`에서 사용하려고 하니 에러가 발생합니다.

[codetabs src="scopes" height="140" current="index.html"]

외부에서 사용하려는 모듈은 `export`해줘야하고, 내보내진(export) 모듈을 가져와 사용하려면 `import`해줘야 합니다.

따라서 `user.js`를 `hello.js` 안에서 바로 import해줘야 합니다. `index.html`에서 가져오지 말고요.

이제 정상적으로 동작하네요.

[codetabs src="scopes-working" height="140" current="hello.js"]

브라우저 환경에서도 각 `<script type="module">` 마다 독립적인 최상위 레벨 스코프가 존재합니다.

```html run
<script type="module">
  // 변수 user는 모듈 안에서만 접근 가능합니다
  let user = "John";
</script>

<script type="module">
  *!*
  alert(user); // Error: user is not defined
  */!*
</script>
```

부득이하게 브라우저 환경에서 "전역(global)" 변수를 사용해야 한다면, `window` 객체에 변수를 명시적으로 할당하고, `window.user`로 접근하면 됩니다. 하지만 정말 필요한 경우에만 이 방법을 사용하길 권유합니다.

### 모듈은 최초 임포트 시 단 한번만 평가됩니다. 

동일 모듈이 여러 곳에서 사용되는 경우, 모듈 내 코드는 최초 1회만 실행됩니다. 실행 이후 다른 모듈에서 이 모듈을 가져오죠. 

이는 중요한 결과를 초래합니다. 예제를 살펴봅시다.

alert 메시지를 보여주는 것 같이 실행 시 부작용이 발생하는 코드를 담고 있는 모듈은 여러번 임포트 되어도 최초 한번만 실행됩니다.

```js
// 📁 alert.js
alert("Module is evaluated!");
```

```js
// 같은 모듈을 여러 파일에서 임포트함

// 📁 1.js
import `./alert.js`; // 모듈이 평가됩니다!

// 📁 2.js
import `./alert.js`; // (아무일도 발생하지 않음)
```

현업에서 최상위 레벨 모듈 코드는 대게 초기화 용도로 사용합니다. 데이터 구조를 만들고, 그 구조에 내용을 미리 채워넣죠. 그리고 재사용 하고 싶은 경우 이 모듈을 내보냅니다.

좀 더 어려운 예제를 살펴봅시다.

모듈이 객체를 내보내는 경우를 보시죠.

```js
// 📁 admin.js
export let admin = {
  name: "John"
};
```

이 모듈이 여러 파일에서 임포트되어도 앞에서 설명한 바 처럼 한 번만 평가됩니다. `admin` 객체가 만들어지고, 이 모듈을 임포트 하는 모든 파일에 `admin`객체가 전달됩니다.

각 파일에서 전달받은 `admin` 객체는 유일무이한 객체입니다. 모두 동일한 객체를 받는 거죠. 

```js
// 📁 1.js
import {admin} from './admin.js';
admin.name = "Pete";

// 📁 2.js
import {admin} from './admin.js';
alert(admin.name); // Pete

*!*
// 1.js와 2.js 모두 같은 객체를 받아옵니다.
// 1.js에서 변화된 객체가 2.js에서도 보이는 군요.
*/!*
```

자, 다시 정리해봅시다. 모듈은 단 한번만 실행됩니다. 내보내기(exports)가 만들어지면 해당 모듈은 모든 가져오기 파일에서 공유됩니다. 따라서 `admin` 객체에 뭔가 변화가 있으면, 다른 모듈들은 이 변화를 볼 수 있습니다.

이런 특징은 환경설정이 필요한 모듈에서 유용하게 쓰입니다. 첫번째 import 에서 프로퍼티를 설정하하면, 다른 파일에서 이 설정을 사용할 수 있기 때문입니다.

 `admin.js` 모듈을 예를들어 설명해보도록 하겠습니다. `admin` 객체는 보안상의 이유로 이 모듈 이외의 파일에서 수정되면 안됩니다.     

```js
// 📁 admin.js
export let admin = { };

export function sayHi() {
  alert(`Ready to serve, ${admin.name}!`);
}
```

애플리케이션의 진입 스크립트인 `init.js`에서 `admin.name`을 설정해주었습니다. 이제 `admin`객체의 이름을 다른 파일들이 모두 볼 수 있게 되었습니다. `admin.js`에서도 이 변화를 볼 수 있죠.

```js
// 📁 init.js
import {admin} from './admin.js';
admin.name = "Pete";
```

```js
// 📁 other.js
import {admin, sayHi} from './admin.js';

alert(admin.name); // *!*Pete*/!*

sayHi(); // Ready to serve, *!*Pete*/!*!
```

### import.meta

`import.meta` 객체는 현재 모듈에 대한 정보를 제공합니다.

실행 환경에 따라 정보의 내용은 다릅니다. 브라우저 환경에선 스크립트의 url, HTML안에 있는 모듈의 경우 현재 웹페이지의 url 정보를 제공합니다.

```html run height=0
<script type="module">
  alert(import.meta.url); // script url (인라인 스크립트가 있는 html 페이지의 url)
</script>
```

### 모듈에서 최상위 레벨의 "this"

사소한 기능이지만, 설명의 완전성을 위해 이 내용을 언급하고 넘어가야 할 것 같습니다. 

모듈의 최상위 레벨 `this`는 undefined 값을 가집니다. 모듈이 아닌 스크립트의 전역 객체엔 값이 있습니다.

```html run height=0
<script>
  alert(this); // window
</script>

<script type="module">
  alert(this); // undefined
</script>
```

## 브라우저 특정 기능

`type="module"`가 붙은 브라우저 환경에서의 모듈은 일반적인 모듈과 몇가지 차이점이 있습니다.

자바스크립트 초심자나 브라우저 환경에서 자바스크립트를 사용하지 않고 있다면 이 내용은 넘어가셔도 됩니다.

### 모듈의 지연 실행

외부 스크립트인지 인라인 스크립트인지에 상관없이 모듈 스크립트의 실행은 *항상* 지연됩니다. [](info:script-async-defer) 챕터에서 학습한 `defer` 속성이 적용된 것처럼 동작하죠.

따라서 아래와 같은 특성을 보입니다.
- 외부 모듈 스크립트 `<script type="module" src="...">`는 브라우저의 HTML 처리를 막지 않습니다.
- HTML 문서과 완전히 준비 될 때까지 모듈 스크립트 실행은 대기 상태에 있습니다.
- 스크립트의 상대적 순서가 유지됩니다. 위쪽의 스크립트를 먼저 실행합니다.

이런 특징 때문에 모듈 스크립트는 스크립트 아래에 정의된 HTML 요소도 볼 수 있습니다.

예시:

```html run
<script type="module">
*!*
  alert(typeof button); // object: 스크립트는 아래쪽의 button 요소를 '참조'할 수 있습니다.
*/!*
  // 모듈 스크립트는 지연 되기 때문에, 페이지가 모두 로드되고 난 다음에 실행됩니다.
</script>

<script>
*!*
  alert(typeof button); // Error: 버튼은 undefined 상태입니다. 스크립트 아래의 요소를 참조할 수 없습니다
*/!*
  // 일반 스크립트는 페이지 내 나머지 요소가 처리되기 이전에 실행됩니다
</script>

<button id="button">Button</button>
```

주의 사항: 두번째 스크립트는 첫 번째 모듈 스크립트보다 먼저 실행됩니다! 그렇기 때문에 `undefined`가 먼저, `object`가 나중에 출력됩니다.

이는 모듈 스크립트가 지연 실행되기 때문입니다. 문서 전체가 처리되기 전까지 실행되지 않죠. 반면 일반 스크립트는 바로 실행됩니다. 그래서 위와 같은 결과가 나타납니다.

모듈 사용 시 자바스크립트 애플리케이션이 준비되기 전에 HTML 문서가 먼저 나타날 수 있다는 점을 항상 염두해야 합니다. 몇몇 기능은 자바스크립트가 로딩되기 전까지 동작하지 않을 수 있습니다. 이 시점에 투명 오버레이나 "로딩 인디케이터(loading indicator)"를 보여주지 않으면 사용자의 혼란을 초래합니다.

### 인라인 스크립트의 비동기성 Async works on inline scripts

`<script async type="module">`의 async 속성은 인라인 스크립트와 외부 스크립트 모두에 적용할 수 있습니다. 이렇게 async 속성이 붙은 스크립트는 임포트된 모듈이 처리될 때 즉시 실행됩니다. 다른 스크립트나 HTML 문서와 독립적으로 말이죠. 

For example, the script below has `async`, so it doesn't wait for anyone.

It performs the import (fetches `./analytics.js`) and runs when ready, even if HTML document is not finished yet, or if other scripts are still pending.

That's good for functionality that doesn't depend on anything, like counters, ads, document-level event listeners.

```html
<!-- all dependencies are fetched (analytics.js), and the script runs -->
<!-- doesn't wait for the document or other <script> tags -->
<script *!*async*/!* type="module">
  import {counter} from './analytics.js';

  counter.count();
</script>
```

### External scripts

There are two notable differences of external module scripts:

1. External scripts with same `src` run only once:
    ```html
    <!-- the script my.js is fetched and executed only once -->
    <script type="module" src="my.js"></script>
    <script type="module" src="my.js"></script>
    ```

2. External scripts that are fetched from another domain require [CORS](mdn:Web/HTTP/CORS) headers. In other words, if a module script is fetched from another domain, the remote server must supply a header `Access-Control-Allow-Origin: *` (may use fetching domain instead of `*`) to indicate that the fetch is allowed.
    ```html
    <!-- another-site.com must supply Access-Control-Allow-Origin -->
    <!-- otherwise, the script won't execute -->
    <script type="module" src="*!*http://another-site.com/their.js*/!*"></script>
    ```

    That ensures better security by default.

### No bare modules allowed

In the browser, in scripts (not in HTML), `import` must get either a relative or absolute URL. So-called "bare" modules, without a path, are not allowed.

For instance, this `import` is invalid:
```js
import {sayHi} from 'sayHi'; // Error, "bare" module
// must be './sayHi.js' or wherever the module is
```

Certain environments, like Node.js or bundle tools allow bare modules, as they have own ways for finding modules and hooks to fine-tune them. But browsers do not support bare modules yet.

### Compatibility, "nomodule"

Old browsers do not understand `type="module"`. Scripts of the unknown type are just ignored. For them, it's possible to provide a fallback using `nomodule` attribute:

```html run
<script type="module">
  alert("Runs in modern browsers");
</script>

<script nomodule>
  alert("Modern browsers know both type=module and nomodule, so skip this")
  alert("Old browsers ignore script with unknown type=module, but execute this.");
</script>
```

If we use bundle tools, then as modules are bundled together, their `import/export` statements are replaced by special bundler calls, so the resulting build does not require `type="module"`, and we can put it into a regular script:

```html
<!-- Assuming we got bundle.js from a tool like Webpack -->
<script src="bundle.js"></script>
```

## Build tools

In real-life, browser modules are rarely used in their "raw" form. Usually, we bundle them together with a special tool such as [Webpack](https://webpack.js.org/) and deploy to the production server.

One of the benefits of using bundlers -- they give more control over how modules are resolved, allowing bare modules and much more, like CSS/HTML modules.

Build tools do the following:

1. Take a "main" module, the one intended to be put in `<script type="module">` in HTML.
2. Analyze its dependencies: imports and then imports of imports etc.
3. Build a single file with all modules (or multiple files, that's tunable), replacing native `import` calls with bundler functions, so that it works. "Special" module types like HTML/CSS modules are also supported.
4. In the process, other transforms and optimizations may be applied:
    - Unreachable code removed.
    - Unused exports removed ("tree-shaking").
    - Development-specific statements like `console` and `debugger` removed.
    - Modern, bleeding-edge JavaScript syntax may be transformed to older one with similar functionality using [Babel](https://babeljs.io/).
    - The resulting file is minified (spaces removed, variables replaced with shorter named etc).

That said, native modules are also usable. So we won't be using Webpack here: you can configure it later.

## Summary

To summarize, the core concepts are:

1. A module is a file. To make `import/export` work, browsers need `<script type="module">`, that implies several differences:
    - Deferred by default.
    - Async works on inline scripts.
    - External scripts need CORS headers.
    - Duplicate external scripts are ignored.
2. Modules have their own, local top-level scope and interchange functionality via `import/export`.
3. Modules always `use strict`.
4. Module code is executed only once. Exports are created once and shared between importers.

So, generally, when we use modules, each module implements the functionality and exports it. Then we use `import` to directly import it where it's needed. Browser loads and evaluates the scripts automatically.

In production, people often use bundlers such as [Webpack](https://webpack.js.org) to bundle modules together for performance and other reasons.

In the next chapter we'll see more examples of modules, and how things can be exported/imported.
