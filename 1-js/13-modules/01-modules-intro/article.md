
# 모듈 소개

<<<<<<< HEAD
개발하는 애플리케이션의 크기가 커질수록 파일을 여러 개로 쪼개야 할 필요가 생깁니다. 이 때 쪼개진 파일 각각을 '모듈'이라고 부릅니다.
모듈은 대게 클래스 하나 혹은 복수의 함수로 구성된 라이브러리 하나로 구성됩니다.
=======
As our application grows bigger, we want to split it into multiple files, so called "modules". A module usually contains a class or a library of functions.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

자바스크립트 생태계는 오랫동안 언어 수준에서 지원하는 모듈 관련 문법 없이 성장해 왔는데, 이 점이 문제가 되진 않았습니다. 초기 스크립트는 크기도 작고 간단했기 때문에 모듈의 필요성이 대두되지 않았기 때문입니다.

하지만 스크립트의 크기가 점차 커지고 복잡해지기 시작하자, 자바스크립트 커뮤니티는 모듈이라는 개념을 도입해 코드를 체계화하려는 여러 가지 시도를 하게 됩니다. 필요할 때마다 언제든지 모듈을 로드해 주는 특별한 라이브러리를 사용해서 말이죠.

예:

- [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition)는 가장 오래된 모듈 시스템 중 하나입니다. [require.js](http://requirejs.org/)라는 라이브러리를 통해 처음 개발되었습니다.
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)는 Node.js 서버를 위해 만들어진 모듈 시스템입니다.
- [UMD](https://github.com/umdjs/umd)는 여러 모듈 시스템을 함께 사용하기위해 만들어졌습니다. AMD와 CommonJS와 호환됩니다.

<<<<<<< HEAD
위 모듈 시스템은 오래된 스크립트에서 찾아볼 수 있는데, 이제는 역사의 뒤안길로 사라져가고 있습니다. 2015년부터 언어 수준에서 지원하는 모듈 시스템이 등장했기 때문입니다. 이제는 대부분의 주요 브라우저와 Node.js에서 모듈 시스템을 지원하고 있습니다.  
=======
Now all these slowly become a part of history, but we still can find them in old scripts.

The language-level module system appeared in the standard in 2015, gradually evolved since then, and is now supported by all major browsers and in Node.js. So we'll study it from now on.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

## 모듈이란?

<<<<<<< HEAD
모듈은 단순히 하나의 파일을 의미합니다. 하나의 스크립트죠.

지시자 `export`와 `import`를 이용하면 모듈 간 기능을 공유할 수 있습니다. 한 모듈에서 만든 기능을 다른 모듈에서 불러올 수 있죠.
=======
A module is just a file. One script is one module.

Modules can load each other and use special directives `export` and `import` to interchange functionality, call functions of one module from another one:
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

- `export` 키워드를 변수나 함수 앞에 붙이면, 파일 외부에서 현재 모듈의 변수나 함수에 접근할 수 있습니다.
- `import` 키워드는 다른 모듈에서 기능을 가져올 때 사용합니다.

파일 `sayHi.js` 내부에 있는 함수를 외부로 내보내는(export) 예시를 살펴보도록 하죠.

```js
// 📁 sayHi.js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
```

이제 다른 파일에서 위 함수를 가져와(import) 사용할 수 있습니다.

```js
// 📁 main.js
import {sayHi} from './sayHi.js';

alert(sayHi); // 함수
sayHi('John'); // Hello, John!
```

<<<<<<< HEAD
본 튜토리얼은 실행 환경에 상관없이 자바스크립트 언어 자체에 대해 다루고자 하였으나, 현재는 브라우저를 데모 환경으로 사용 중이므로, 브라우저에서 어떻게 모듈을 사용하는지 알아보도록 하겠습니다.
=======
The `import` directive loads the module by path `./sayHi.js` relative the current file and assigns exported function `sayHi` to the corresponding variable.

Let's run the example in-browser.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

모듈은 특별한 키워드와 기능을 제공하므로, `<script type="module">`을 사용해 해당 스크립트가 모듈인지의 여부를 브라우저에게 알려주어야 합니다.

아래와 같이 말이죠.

[codetabs src="say" height="140" current="index.html"]

<<<<<<< HEAD
브라우저는 자동으로 해당 모듈을 가져오고 평가한 후, 해당 모듈의 스크립트를 실행합니다.
=======
The browser automatically fetches and evaluates the imported module (and its imports if needed), and then runs the script.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

## 모듈의 핵심 기능

그냥 "일반적인" 스크립트와 모듈의 차이는 무엇일까요?

브라우저와 서버 사이드 자바스크립트 환경에서 모두 적용되는 모듈의 기능은 다음과 같습니다. 

### "엄격 모드"로 실행됩니다

모듈엔 항상 기본적으로 `엄격 모드가 적용(use strict)`됩니다. 그래서 선언되지 않은 변수에 값을 할당하면 에러가 발생합니다. 

```html run
<script type="module">
  a = 5; // error
</script>
```

<<<<<<< HEAD
위 예시를 통해 브라우저 환경에서 모듈은 엄격 모드로 실행된다는 것을 확인하였습니다. 다른 환경에서도 마찬가지입니다.

### 모듈 레벨 스코프
=======
### Module-level scope
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

각 모듈은 자기만의 스코프를 갖습니다. 모듈 내부에서 정의한 변수와 함수는 다른 스크립트(모듈)에서 접근할 수 없습니다.

아래 예시를 통해 이를 알아봅시다. 두 개의 스크립트를 임포트 한 상황입니다. `user.js`에서 선언한 변수 `user`를 `hello.js`에서 사용하려고 하니 에러가 발생합니다.

[codetabs src="scopes" height="140" current="index.html"]

외부에 공개하려는 모듈은 `export` 해줘야 하고, 내보내진(export) 모듈을 가져와 사용하려면 `import` 해줘야 합니다.

<<<<<<< HEAD
`user.js`를 `index.html`가 아닌 `hello.js` 안에서 바로 import 해줘야 원하는 대로 `user`를 사용할 수 있습니다.
=======
So we should import `user.js` into `hello.js` and get the required functionality from it instead of relying on global variables.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

이제 정상적으로 동작하네요.

[codetabs src="scopes-working" height="140" current="hello.js"]

브라우저 환경에서도 각 `<script type="module">` 마다 독립적인 모듈 스코프가 존재합니다.

```html run
<script type="module">
  // user는 모듈 안에서만 접근 가능합니다
  let user = "John";
</script>

<script type="module">
  *!*
  alert(user); // Error: user is not defined
  */!*
</script>
```

부득이하게 브라우저 환경에서 window 레벨의 "전역(global)" 변수를 사용해야 한다면, `window` 객체에 변수를 명시적으로 할당하고, `window.user`로 접근하면 됩니다. 하지만 정말 필요한 경우에만 이 방법을 사용하길 권유합니다.

### 모듈은 최초 임포트 시 단 한 번만 평가됩니다.

동일 모듈이 여러 곳에서 사용되더라도 모듈 내 코드는 최초 1회만 실행됩니다. 최초 실행 이후 다른 모듈에서 이 모듈을 임포트 합니다. 

이런 작동방식은 중요한 결과를 초래합니다. 예제로 알아봅시다.

alert 창을 띄워주는 코드를 담고 있는 모듈을 여러 곳에서 임포트 해보았습니다. alert 창은 단 한 번만 나타납니다.

```js
// 📁 alert.js
alert("Module is evaluated!");
```

```js
// 같은 모듈을 여러 파일에서 임포트함

// 📁 1.js
import `./alert.js`; // 모듈이 평가됩니다!

// 📁 2.js
<<<<<<< HEAD
import `./alert.js`; // (아무 일도 발생하지 않음)
```

현업에서 최상위 레벨 모듈은 대게 초기화 용도로 사용합니다. 재사용하고 싶은 무언가에 대한 데이터 구조를 만들고, 그 구조에 내용을 미리 채워 넣어 모듈을 만듭니다. 그리고 이 모듈을 내보내죠.
=======
import `./alert.js`; // (shows nothing)
```

In practice, top-level module code is mostly used for initialization, creation of internal data structures, and if we want something to be reusable -- export it.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

좀 더 어려운 예제를 살펴보도록 하겠습니다.

이 모듈에선 객체를 내보내고 있습니다.

```js
// 📁 admin.js
export let admin = {
  name: "John"
};
```

여러 파일에서 이 모듈을 임포트해도 앞에서 설명한바 처럼 모듈은 한 번만 평가됩니다. `admin` 객체가 하나 만들어지고, 이 모듈을 임포트 하는 모든 파일에 `admin` 객체가 전달됩니다.

각 파일에서 전달받은 `admin` 객체는 유일무이합니다. 모두 동일한 객체를 받습니다.

```js
// 📁 1.js
import {admin} from './admin.js';
admin.name = "Pete";

// 📁 2.js
import {admin} from './admin.js';
alert(admin.name); // Pete

*!*
// 1.js와 2.js 모두 같은 객체를 받습니다.
// 1.js에서 변화된 객체가 2.js에서도 보이는군요.
*/!*
```

<<<<<<< HEAD
자, 다시 정리해봅시다. 모듈은 단 한 번만 실행됩니다. 내보내기(exports)가 만들어지면 해당 모듈은 모든 가져오기 파일에서 공유됩니다. 따라서 `admin` 객체에 뭔가 변화가 있으면, 다른 모듈들은 이 변화를 볼 수 있습니다.

이런 특징은 환경설정이 필요한 모듈에서 유용하게 쓰입니다. 첫 번째 import에서 필요한 환경을 설정하면, 다른 파일에서 이 설정을 사용할 수 있기 때문입니다.
=======
So, let's reiterate -- the module is executed only once. Exports are generated, and then they are shared between importers, so if something changes the `admin` object, other modules will see that.

Such behavior allows to *configure* modules on first import. We can setup its properties once, and then in further imports it's ready.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

 `admin.js` 모듈을 예를 들어 설명해보도록 하겠습니다. `admin` 객체는 보안상의 이유로 이 모듈 이외의 파일에서 수정되면 안 됩니다.

```js
// 📁 admin.js
export let admin = { };

export function sayHi() {
  alert(`Ready to serve, ${admin.name}!`);
}
```

<<<<<<< HEAD
애플리케이션의 진입 스크립트인 `init.js`에서 `admin.name`을 설정해주었습니다. 이제 `admin` 객체의 이름을 다른 파일들이 모두 볼 수 있게 되었습니다. `admin.js`에서도 이 변화를 볼 수 있죠.
=======
In `init.js`, the first script of our app, we set `admin.name`. Then everyone will see it, including calls made from inside `admin.js` itself:
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

```js
// 📁 init.js
import {admin} from './admin.js';
admin.name = "Pete";
```

Another module can also see `admin.name`:

```js
// 📁 other.js
import {admin, sayHi} from './admin.js';

alert(admin.name); // *!*Pete*/!*

sayHi(); // Ready to serve, *!*Pete*/!*!
```

### import.meta

`import.meta` 객체는 현재 모듈에 대한 정보를 제공합니다.

실행 환경에 따라 정보의 내용은 다릅니다. 브라우저 환경에선 스크립트의 url정보를 가져올 수 있습니다. 스크립트 태그로 가져온 모듈이라면, 현재 웹페이지의 url 정보를 얻을 수 있습니다.

```html run height=0
<script type="module">
  alert(import.meta.url); // script url (인라인 스크립트가 있는 html 페이지의 url)
</script>
```

<<<<<<< HEAD
### 모듈 내의 "this"
=======
### In a module, "this" is undefined
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

사소한 기능이지만, 설명의 완전성을 위해 이 내용을 언급하고 넘어가야 할 것 같습니다.

<<<<<<< HEAD
모듈이 아닌 스크립트의 전역 객체엔 값이 있는데 반해, 모듈 스코프의 `this`는 undefined입니다.
=======
In a module, top-level `this` is undefined.

Compare it to non-module scripts, where `this` is a global object:
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

```html run height=0
<script>
  alert(this); // window
</script>

<script type="module">
  alert(this); // undefined
</script>
```

## 브라우저 특정 기능

브라우저 환경에서의 모듈은 일반적인 모듈과 몇 가지 차이점이 있습니다.

<<<<<<< HEAD
자바스크립트 초심자나 브라우저 환경에서 자바스크립트를 사용하지 않고 있다면 이 내용은 넘어가셔도 됩니다.
=======
You may want skip this section for now if you're reading for the first time, or if you don't use JavaScript in a browser.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

### 모듈의 지연 실행

외부 스크립트인지 인라인 스크립트인지에 상관없이 브라우저 환경에서 모듈 스크립트의 실행은 *항상* 지연됩니다. [](info:script-async-defer) 챕터에서 학습한 `defer` 속성이 적용된 것처럼 동작합니다.

<<<<<<< HEAD
따라서 아래와 같은 특성을 보입니다.
- 외부 모듈 스크립트 `<script type="module" src="...">`는 브라우저의 HTML 처리를 막지 않고, 다른 리소스와 함께 병렬적으로 로드됩니다. 
- HTML 문서가 완전히 준비될 때까지 모듈 스크립트는 대기 상태에 있다가, 이후에 실행됩니다. 모듈의 크기가 아주 작아서 HTML보다 빨리 불러와 졌더라도 말이죠. 
- 스크립트의 상대적 순서가 유지됩니다. 문서상 위쪽의 스크립트부터 차례로 실행됩니다.
=======
In other words:
- downloading of external module scripts `<script type="module" src="...">` doesn't block HTML processing, they load in parallel with other resources.
- module scripts wait until the HTML document is fully ready (even if they are tiny and load faster than HTML), and then run.
- relative order of scripts is maintained: scripts that go first in the document, execute first.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

이런 특징 때문에 모듈 스크립트는 항상 로드가 완전히 완료된 HTML 페이지를 "볼 수 있습니다". 모듈 아래에 정의한 HTML 요소에도 접근할 수 있죠.

예시:

```html run
<script type="module">
*!*
  alert(typeof button); // object: 스크립트는 아래쪽의 button 요소를 '참조'할 수 있습니다.
*/!*
  // 모듈 스크립트는 지연 실행되기 때문에, 페이지가 모두 로드되고 난 다음에 실행됩니다.
</script>

Compare to regular script below:

<script>
*!*
  alert(typeof button); // Error: 버튼은 undefined 상태입니다. 해당 요소가 스크립트 아래에 정의되었기 때문입니다.
*/!*
  // 일반 스크립트는 페이지 내 나머지 요소가 처리되기 이전에 실행됩니다.
</script>

<button id="button">Button</button>
```

두 번째 스크립트는 첫 번째 모듈 스크립트보다 먼저 실행된다는 것에 주의하시기 바랍니다. `undefined`가 먼저, `object`는 나중에 출력됩니다.

이는 모듈 스크립트의 지연 실행 때문입니다. 문서 전체가 처리되기 전까지 모듈 스크립트는 실행되지 않습니다. 반면 일반 스크립트는 바로 실행됩니다. 그래서 위와 같은 결과가 나타납니다.

<<<<<<< HEAD
모듈을 사용 하면, HTML 페이지가 로드되고 난 다음에 자바스크립트 모듈이 실행된다는 점에 항상 유의해야 합니다. 사용자는 자바스크립트 애플리케이션이 준비되기 전에 페이지에 노출될 수 있습니다. 페이지 내 어떤 기능은 자바스크립트가 로딩되기 전까지 동작하지 않을 수도 있는데, 이렇게 되면 사용자에게 혼란을 주게 됩니다. 모듈 스크립트를 불러오는 동안, 투명 오버레이나 "로딩 인디케이터(loading indicator)"를 보여주어 사용자의 혼란을 예방해 줍시다. 
=======
When using modules, we should be aware that HTML-page shows up as it loads, and JavaScript modules run after that, so the user may see the page before the JavaScript application is ready. Some functionality may not work yet. We should put "loading indicators", or otherwise ensure that the visitor won't be confused by that.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

### 인라인 스크립트 비동기 처리

<<<<<<< HEAD
async 속성(`<script async type="module">`)은 인라인 스크립트와 외부 스크립트 모두에 적용할 수 있습니다(역주: async속성은 모듈이 아닌 스크립트의 경우, 외부 스크립트 파일을 불러올 때만 유효합니다). async 속성이 붙은 스크립트는 임포트하려는 모듈을 모두 처리하면 다른 스크립트나 HTML 처리와 상관없이 즉시 실행됩니다.
=======
For non-module scripts, `async` attribute only works on external scripts. Async scripts run immediately when ready, independently of other scripts or the HTML document.

For module scripts, it works on any scripts.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

아래 스크립트엔 `async` 속성이 붙었기 때문에, 다른 스크립트나 HTML이 처리되길 기다리지 않습니다.

임포트 작업(`./analytics.js`을 가져옴)이 끝나면 해당 모듈은 바로 실행됩니다. HTML 분석이 끝나지 않거나, 다른 스크립트가 대기 상태에 있더라도 말이죠.

카운터나 광고, document 레벨(최상위 레벨) 이벤트 리스너와 같이 의존성이 없는 기능에 이 속성을 적용할 수 있습니다. 

```html
<!-- 문서나 다른 <script> 태그가 처리되길 기다리지 않고, -->
<!-- 모든 의존 모듈(analytics.js)을 불러왔으면, 스크립트를 실행합니다.-->
<script *!*async*/!* type="module">
  import {counter} from './analytics.js';

  counter.count();
</script>
```

### 외부 스크립트

<<<<<<< HEAD
외부 모듈 스크립트엔 두 가지 큰 특징이 있습니다.
=======
External scripts that have `type="module"` are different in two aspects:
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

1. 같은 `src` 속성값을 가진 외부 스크립트는 한 번만 실행됩니다.
    ```html
    <!-- my.js 스크립트는 한번만 페치(fetch) 및 실행됩니다. -->
    <script type="module" src="my.js"></script>
    <script type="module" src="my.js"></script>
    ```

<<<<<<< HEAD
2. 외부 사이트와 같은 다른 오리진에서 모듈 스크립트를 불러오려면 <info:fetch-crossorigin> 챕터에서 설명한 바와 같이 [CORS](mdn:Web/HTTP/CORS) 헤더가 필요합니다. 외부 모듈이 저장되어있는 원격 서버가 페치를 허용함을 나타내는 `Access-Control-Allow-Origin: *` 헤더(`*` 대신 페치를 허용할 도메인을 명시할 수도 있음)를 제공해야만 외부 모듈을 불러올 수 있습니다.
=======
2. External scripts that are fetched from another origin (e.g. another site) require [CORS](mdn:Web/HTTP/CORS) headers, as described in the chapter <info:fetch-crossorigin>. In other words, if a module script is fetched from another origin, the remote server must supply a header `Access-Control-Allow-Origin` allowing the fetch.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a
    ```html
    <!-- another-site.com이 Access-Control-Allow-Origin을 지원해야만 외부 모듈을 불러올 수 있습니다.-->
    <!-- 그렇지 않은 경우, 스크립트는 실행되지 않습니다.-->
    <script type="module" src="*!*http://another-site.com/their.js*/!*"></script>
    ```

    이 특징은 보안을 강화해 줍니다.

### "경로가 없는" 모듈은 사용할 수 없습니다

브라우저 환경에선, `import` 지시자는 반드시 상대 혹은 절대 URL 앞에 와야 합니다. 경로가 없는 모듈은 허용되지 않습니다.

아래 예제에서 `import`는 무효합니다.
```js
import {sayHi} from 'sayHi'; // Error!
// './sayHi.js'와 같이 모듈이 어디에 있는지 경로를 지정해 주어야 함
```

Node.js나 번들 툴은 경로가 없는 모듈을 허용합니다. 경로 없이도 해당 모듈을 찾수 있는 방법을 알기 때문이죠. 하지만 브라우저에선 아직까진 경로 없는 모듈을 지원하지 않습니다.

### 호환성을 지원해주는 "nomodule"

오래된 브라우저는 `type="module"`을 해석하지 못합니다. 이 브라우저들은 알려지지 않은 타입의 스크립트를 만나면 이를 무시하고 넘어갑니다. 대비책으로 `nomodule` 속성을 사용하면 호환성을 유지할 수 있습니다.

```html run
<script type="module">
  alert("모던 브라우저를 사용하고 계시군요.");
</script>

<script nomodule>
  alert("type=module을 해석할 수 있는 브라우저는 nomodule속성이 있는 스크립트는 넘어갑니다. 따라서 이 alert문은 실행되지 않습니다.")
  alert("오래된 브라우저를 사용하고 있다면, 이 alert문이 실행됩니다.");
</script>
```

<<<<<<< HEAD
번들링 툴을 사용하는 경우, 스크립트는 하나 혹은 여러 개의 파일로 번들링 됩니다. 이때, 번들링 전 스크립트에 있던 `import/export`문은 특별한 번들러 함수로 대체됩니다. 번들링 과정을 거친 스크립트엔 `import/export`가 없기 때문에 `type="module"` 역시 필요 없어집니다. 모듈이 아닌 일반 스크립트로 취급할 수 있게 되죠. 

```html
<!-- bundle.js는 웹팩과 같은 툴로 번들링 과정을 거친 스크립트라고 가정합시다. -->
<script src="bundle.js"></script>
```

## 빌드 툴(Build tools)
=======
## Build tools
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

실제 개발 환경에서 브라우저 모듈을 날 것 그대로 사용하는 경우는 거의 없습니다. 대부분 [웹팩(Webpack)](https://webpack.js.org/)과 같은 특별한 빌드 툴을 이용해 모듈을 번들링하고, 산출물을 프로덕션 서버에 배포합니다.

번들러(bundler)를 사용하면 모듈 번들링을 통제할 수 있다는 장점이 생깁니다. 경로가 없는 모듈이나 CSS/HTML 모듈도 사용할 수 있게 됩니다. 

빌드 툴은 아래와 같은 절차를 수행합니다.

1. HTML의 `<script type="module">` 안에 있는 "주(main) 모듈"을 택함(역주: 웹팩에선 엔트리 프로퍼티(entry property)에 주 모듈을 명기함).
2. 주 모듈이 어떤 모듈을 임포트 하는지를 이용해 다른 모듈과의 의존관계를 분석함.
3. 의존관계에 있는 모든 모듈을 이용하여 하나의 파일을 빌드함(여러개의 파일을 빌드할 수 있게 조정할 수도 있음). 이 때, `import` 호출은 번들러 함수로 대체됨. HTML이나 CSS 같은 "특수한" 모듈 타입도 지원함.
4. 진행 과정에서 아래와 같은 변환이나 최적화가 수행될 수 있음
    - 도달할 수 없는 코드는 제거됨.
    - 사용되지 않은 export는 제거됨("tree-shaking").
    - `console`, `debugger`같은 개발 관련 코드가 제거됨.
    - 최신 자바스크립트 문법이 사용된 경우, [바벨(Babel)](https://babeljs.io/)을 사용하여 같은 기능을 하는 낮은 버전의 스크립트로 변환함. 
    - 산출물의 크기를 축소함(공백 제거, 변수 이름을 짧게 줄이기 등).

If we use bundle tools, then as scripts are bundled together into a single file (or few files), `import/export` statements inside those scripts are replaced by special bundler functions. So the resulting "bundled" script does not contain any `import/export`, it doesn't require `type="module"`, and we can put it into a regular script:

```html
<!-- Assuming we got bundle.js from a tool like Webpack -->
<script src="bundle.js"></script>
```

That said, native modules are also usable. So we won't be using Webpack here: you can configure it later.

## 요약

지금까지 배운 내용의 핵심을 추려보도록 하겠습니다.

<<<<<<< HEAD
1. 하나의 모듈은 하나의 파일입니다. 브라우저에서 `import/export` 지시자를 사용하려면 `<script type="module">`같은 type 속성이 필요합니다. 모듈 타입 스크립트는 아래와 같은 특징을 지닙니다.
    - 지연 실행 됩니다.
    - 인라인 모듈 스크립트도 비동기 처리 할 수 있습니다.
    - 다른 오리진(도메인, 프로토콜, 포트)에서 외부 스크립트를 불러오려면, CORS 헤더가 필요합니다.
    - 중복된 외부 스크립트는 무시됩니다.
2. 모듈은 자신만의 스코프를 갖습니다. 모듈간 기능 공유는 `import/export`로 할 수 있습니다.
3. 항상 엄격 모드로 실행(`use strict`)됩니다.
4. 모듈 내 코드는 단 한번만 실행됩니다. 한번 Export된 모듈은 모든 임포터(importer)에서 공유합니다.

대게 각 모듈은 하나의 기능을 담고 있습니다. `export` 키워드를 사용해 이 기능을 해당 모듈 밖에서도 사용할 수 있도록 합니다. 내보내진 기능이 필요한 모듈은 `import` 키워드를 사용해 해당 기능을 사용하게 됩니다. 브라우저에선 모듈을 불러오고 평가하는 과정을 자동으로 수행해 줍니다.
=======
1. A module is a file. To make `import/export` work, browsers need `<script type="module">`. Modules have several differences:
    - Deferred by default.
    - Async works on inline scripts.
    - To load external scripts from another origin (domain/protocol/port), CORS headers are needed.
    - Duplicate external scripts are ignored.
2. Modules have their own, local top-level scope and interchange functionality via `import/export`.
3. Modules always `use strict`.
4. Module code is executed only once. Exports are created once and shared between importers.

When we use modules, each module implements the functionality and exports it. Then we use `import` to directly import it where it's needed. Browser loads and evaluates the scripts automatically.
>>>>>>> fb38a13978f6e8397005243bc13bc1a20a988e6a

실제 애플리케이션을 출시할 땐 성능 향상 등의 이점 때문에 [웹팩](https://webpack.js.org)과 같은 번들러를 사용합니다.

다음 챕터에선 모듈에 대한 여러 가지 예시를 좀 더 살펴보도록 하겠습니다. 어떻게 모듈을 내보내고 임포트하는지 알아보도록 하겠습니다.
