
# 모듈 소개

개발하는 애플리케이션의 크기가 커지면 언젠간 파일을 여러 개로 분리해야 하는 시점이 옵니다. 이때 분리된 파일 각각을 '모듈(module)'이라고 부르는데, 모듈은 대개 클래스 하나 혹은 특정한 목적을 가진 복수의 함수로 구성된 라이브러리 하나로 구성됩니다.

초기 스크립트는 크기도 작고 기능도 단순했기 때문에 자바스크립트는 긴 세월 동안 모듈 관련 표준 문법 없이 성장할 수 있었습니다. 새로운 문법을 만들 필요가 없었던 것이죠.

그런데 스크립트의 크기가 점차 커지고 기능도 복잡해지자 자바스크립트 커뮤니티는 특별한 라이브러리를 만들어 필요한 모듈을 언제든지 불러올 수 있게 해준다거나 코드를 모듈 단위로 구성해 주는 방법을 만드는 등 다양한 시도를 하게 됩니다. 

그 시도는 다음과 같은 모듈 시스템으로 이어졌습니다.

- [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) --  가장 오래된 모듈 시스템 중 하나로 [require.js](http://requirejs.org/)라는 라이브러리를 통해 처음 개발되었습니다.
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) -- Node.js 서버를 위해 만들어진 모듈 시스템입니다.
- [UMD](https://github.com/umdjs/umd) -- AMD와 CommonJS와 같은 다양한 모듈 시스템을 함께 사용하기 위해 만들어졌습니다.

이런 모듈 시스템은 오래된 스크립트에서 여전히 발견할 수 있는데, 이제는 역사의 뒤안길로 사라져가고 있습니다.

모듈 시스템은 2015년에 표준으로 등재되었습니다. 이 이후로 관련 문법은 진화를 거듭해 이제는 대부분의 주요 브라우저와 Node.js가 모듈 시스템을 지원하고 있습니다. 이제 본격적으로 모던 자바스크립트에서 쓰이는 모듈에 대해 알아봅시다.

## 모듈이란?

모듈은 단지 파일 하나에 불과합니다. 스크립트 하나는 모듈 하나입니다.

모듈에 특수한 지시자 `export`와 `import`를 적용하면 다른 모듈을 불러와 불러온 모듈에 있는 함수를 호출하는 것과 같은 기능 공유가 가능합니다. 

- `export` 지시자를 변수나 함수 앞에 붙이면 외부 모듈에서 해당 변수나 함수에 접근할 수 있습니다(`모듈 내보내기`).
- `import` 지시자를 사용하면 외부 모듈의 기능을 가져올 수 있습니다(`모듈 가져오기`).

`export` 지시자를 사용해 파일 `sayHi.js` 내부의 함수 `sayHi`를 외부로 내보내 봅시다.

```js
// 📁 sayHi.js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
```

이제 `import` 지시자를 사용해 `main.js`에서 함수 `sayHi`를 사용할 수 있게 해봅시다.

```js
// 📁 main.js
import {sayHi} from './sayHi.js';

alert(sayHi); // 함수
sayHi('John'); // Hello, John!
```

위 예시에서 `import` 지시자는 상대 경로(`./sayHi.js`)를 이용해 모듈을 가져오고 `sayHi.js`에서 내보낸 함수 `sayHi`를 상응하는 변수에 할당합니다.

이제 브라우저에서 모듈이 어떻게 동작하는지 예시를 이용해 알아봅시다.

모듈은 특수한 키워드나 기능과 함께 사용되므로 `<script type="module">` 같은 속성을 설정해 해당 스크립트가 모듈이란 걸 브라우저가 알 수 있게 해줘야 합니다.

아래와 같이 말이죠.

[codetabs src="say" height="140" current="index.html"]

브라우저가 자동으로 모듈을 가져오고 평가한 다음 이를 실행한 것을 확인할 수 있습니다.

```warn header="Modules work only via HTTP(s), not in local files"
If you try to open a web-page locally, via `file://` protocol, you'll find that `import/export` directives don't work. Use a local web-server, such as [static-server](https://www.npmjs.com/package/static-server#getting-started) or use the "live server" capability of your editor, such as VS Code [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to test modules.
```

## 모듈의 핵심 기능

'일반' 스크립트와 모듈의 차이는 무엇일까요?

모든 호스트 환경에 공통으로 적용되는 모듈의 핵심 기능에 대해 알아봅시다.

### '엄격 모드'로 실행됨

모듈은 항상 `엄격 모드(use strict)`로 실행됩니다. 선언되지 않은 변수에 값을 할당하는 등의 코드는 에러를 발생시킵니다. 

```html run
<script type="module">
  a = 5; // 에러
</script>
```

### 모듈 레벨 스코프

모듈은 자신만의 스코프가 있습니다. 따라서 모듈 내부에서 정의한 변수나 함수는 다른 스크립트에서 접근할 수 없습니다.

`user.js`와 `hello.js`를 가져오고 `user.js`에서 선언한 변수 `user`를 `hello.js`에서 사용해봅시다. 에러가 난 것을 확인할 수 있습니다(개발자 도구 확인).

[codetabs src="scopes" height="140" current="index.html"]

외부에 공개하려는 모듈은 `export` 해야 하고, 내보내진 모듈을 가져와 사용하려면 `import` 해줘야 합니다.

 전역변수를 대신하여 `hello.js`에 `user.js`를 가져와 필요한 기능을 얻을 수 있습니다.

아래와 같이 코드를 수정하면 정상적으로 동작합니다.

[codetabs src="scopes-working" height="140" current="hello.js"]

브라우저 환경에서도 `<script type="module">`을 사용해 모듈을 만들면 독립적인 스코프가 만들어집니다.

```html run
<script type="module">
  // user는 해당 모듈 안에서만 접근 가능합니다.
  let user = "John";
</script>

<script type="module">
  *!*
  alert(user); // Error: user is not defined
  */!*
</script>
```

참고로, 브라우저 환경에서 부득이하게 window 레벨 전역 변수를 만들어야 한다면 `window` 객체에 변수를 명시적으로 할당하고 `window.user`와 같이 접근하는 방식을 취하시면 됩니다. 그런데 이 방법은 정말 필요한 경우에만 사용하길 권유합니다.

### 단 한 번만 평가됨

동일한 모듈이 여러 곳에서 사용되더라도 모듈은 최초 호출 시 단 한 번만 실행됩니다. 실행 후 결과는 이 모듈을 가져가려는 모든 모듈에 내보내 집니다.

이런 작동방식은 중요한 결과를 초래합니다. 예시를 통해 이에 대해 알아봅시다.

alert 함수가 있는 모듈(`alert.js`)을 여러 모듈에서 가져오기로 해봅시다. alert 창은 단 한 번만 나타납니다.

```js
// 📁 alert.js
alert("모듈이 평가되었습니다!");
```

```js
// 동일한 모듈을 여러 모듈에서 가져오기

// 📁 1.js
import `./alert.js`; // 얼럿창에 '모듈이 평가되었습니다!'가 출력됩니다.

// 📁 2.js
import `./alert.js`; // 아무 일도 발생하지 않습니다.
```

실무에선 최상위 레벨 모듈을 대개 초기화나 내부 데이터 구조를 만들 때 사용합니다. 이것들을 내보내 재사용하는 것이죠.

이제 좀 더 어려운 예시를 살펴보겠습니다.

객체를 내보내는 모듈을 만들어봅시다.

```js
// 📁 admin.js
export let admin = {
  name: "John"
};
```

이 모듈을 가져오는 모듈이 여러 개이더라도 앞서 설명한 것 처럼 모듈은 최초 호출 시 단 한 번만 평가됩니다. 이때 `admin` 객체가 만들어지고 이 모듈을 가져오는 모든 모듈에 `admin` 객체가 전달됩니다.

각 모듈에 동일한 `admin` 객체가 전달되는 것이죠.

```js
// 📁 1.js
import {admin} from './admin.js';
admin.name = "Pete";

// 📁 2.js
import {admin} from './admin.js';
alert(admin.name); // Pete

*!*
// 1.js와 2.js 모두 같은 객체를 가져오므로
// 1.js에서 객체에 가한 조작을 2.js에서도 확인할 수 있습니다.
*/!*
```

자, 다시 한번 말씀드리겠습니다. 모듈은 단 한 번만 실행되고 실행된 모듈은 필요한 곳에 공유되므로 어느 한 모듈에서 `admin` 객체를 수정하면 다른 모듈에서도 변경사항을 확인할 수 있습니다. 

이런 특징을 이용하면 모듈 *설정*을 쉽게 할 수 있습니다. 최초로 실행되는 모듈의 객체 프로퍼티를 원하는 대로 설정하면 다른 모듈에서 이 설정을 그대로 사용할 수 있기 때문이죠.

예시를 통해 이에 대해 자세히 알아봅시다. 아래 `admin.js` 모듈은 어떤 특정한 기능을 제공해주는데, 이 기능을 사용하려면 외부에서 `admin` 객체와 관련된 인증 정보를 받아와야 한다고 가정해봅시다.

```js
// 📁 admin.js
export let admin = { };

export function sayHi() {
  alert(`${admin.name}님, 안녕하세요!`);
}
```

최초로 실행되는 스크립트인 `init.js`에서 `admin.name`을 설정해주었습니다. 이렇게 하면 `admin.js`를 포함한 외부 스크립트에서 `admin.name`에 저장된 정보를 볼 수 있습니다.

```js
// 📁 init.js
import {admin} from './admin.js';
admin.name = "Pete";
```

또 다른 모듈에서도 `admin.name`에 저장된 정보를 볼 수 있다는 걸 확인해 봅시다.

```js
// 📁 other.js
import {admin, sayHi} from './admin.js';

alert(admin.name); // *!*Pete*/!*

sayHi(); // *!*Pete*/!*님, 안녕하세요!
```

### import.meta

`import.meta` 객체는 현재 모듈에 대한 정보를 제공해줍니다.

호스트 환경에 따라 제공하는 정보의 내용은 다른데, 브라우저 환경에선 스크립트의 url 정보를 얻을 수 있습니다. HTML 안에 있는 모듈이라면, 현재 실행 중인 웹페이지의 url 정보를 얻을 수 있습니다.

```html run height=0
<script type="module">
  alert(import.meta.url); // script URL (인라인 스크립트가 위치해 있는 html 페이지의 URL)
</script>
```

### 'this'는 undefined

사소한 내용이지만 튜토리얼의 완전성을 위해 이 내용을 언급하고 넘어가야 할 것 같습니다.

모듈 최상위 레벨의 `this`는 `undefined`입니다.

모듈이 아닌 일반 스크립트의 `this`는 전역 객체인 것과 대조됩니다.

```html run height=0
<script>
  alert(this); // window
</script>

<script type="module">
  alert(this); // undefined
</script>
```

## 브라우저 특정 기능

브라우저 환경에서 `type="module"`이 붙은 스크립트가 일반 스크립트와 어떤 점이 다른지 알아봅시다.

자바스크립트 초심자나 브라우저 환경에서 자바스크립트를 사용하지 않고 있다면 이 내용은 넘어가셔도 됩니다.

### 지연 실행

모듈 스크립트는 *항상* 지연 실행됩니다. 외부 스크립트, 인라인 스크립트와 관계없이 마치 `defer` 속성을 붙인 것처럼 실행됩니다(`defer`속성에 대한 자세한 내용은 [](info:script-async-defer)에서 확인할 수 있습니다).

따라서 모듈 스크립트는 아래와 같은 특징을 보입니다.
- 외부 모듈 스크립트 `<script type="module" src="...">`를 다운로드할 때 브라우저의 HTML 처리가 멈추지 않습니다. 브라우저는 외부 모듈 스크립트와 기타 리소스를 병렬적으로 불러옵니다.
- 모듈 스크립트는 HTML 문서가 완전히 준비될 때까지 대기 상태에 있다가 HTML 문서가 완전히 만들어진 이후에 실행됩니다. 모듈의 크기가 아주 작아서 HTML보다 빨리 불러온 경우에도 말이죠.
- 스크립트의 상대적 순서가 유지됩니다. 문서상 위쪽의 스크립트부터 차례로 실행됩니다.

이런 특징 때문에 모듈 스크립트는 항상 완전한 HTML 페이지를 '볼 수' 있고 문서 내 요소에도 접근할 수 있습니다.

예시:

```html run
<script type="module">
*!*
  alert(typeof button); // 모듈 스크립트는 지연 실행되기 때문에 페이지가 모두 로드되고 난 다음에 얼럿 함수가 실행되므로
*/!*
  // 얼럿창에 object가 정상적으로 출력됩니다. 모듈 스크립트는 아래쪽의 button 요소를 '볼 수' 있죠.
</script>

하단의 일반 스크립트와 비교해 봅시다.

<script>
*!*
  alert(typeof button); // 일반 스크립트는 페이지가 완전히 구성되기 전이라도 바로 실행됩니다.
*/!*
  // 버튼 요소가 페이지에 만들어지기 전에 접근하였기 때문에 undefined가 출력되는 것을 확인할 수 있습니다.
</script>

<button id="button">Button</button>
```

위 예시에서 일반 스크립트는 첫 번째 모듈 스크립트보다 먼저 실행된다는 점에 주의하시기 바랍니다. `undefined`가 먼저, `object`는 나중에 출력됩니다.

모듈 스크립트는 지연 실행되기 때문에 문서 전체가 처리되기 전까지 실행되지 않고, 일반 스크립트는 바로 실행되므로 위와 같은 결과가 나타났습니다.

모듈을 사용할 땐 HTML 페이지가 완전히 나타난 이후에 모듈이 실행된다는 점에 항상 유의해야 합니다. 페이지 내 특정 기능이 모듈 스크립트에 의존적인 경우, 모듈이 완전히 로딩되기 전에 페이지만 먼저 사용자에게 노출되면 사용자가 혼란을 느낄 수 있기 때문입니다. 모듈 스크립트를 불러오는 동안엔 투명 오버레이나 '로딩 인디케이터(loading indicator)'를 보여주어 사용자의 혼란을 예방해 주도록 합시다. 

### 인라인 스크립트의 비동기 처리

모듈이 아닌 일반 스크립트에서 `async` 속성은 외부 스크립트를 불러올 때만 유효합니다. `async` 속성이 붙은 스크립트는 로딩이 끝나면 다른 스크립트나 HTML 문서가 처리되길 기다리지 않고 바로 실행됩니다.

반면, 모듈 스크립트에선 `async` 속성을 인라인 스크립트에도 적용할 수 있습니다.

아래 인라인 스크립트엔 `async` 속성이 붙었기 때문에 다른 스크립트나 HTML이 처리되길 기다리지 않고 바로 실행됩니다.

가져오기(`./analytics.js`) 작업이 끝나면 HTML 파싱이 끝나지 않았거나 다른 스크립트가 대기 상태에 있더라도 모듈이 바로 실행됩니다.

이런 특징은 광고나 문서 레벨 이벤트 리스너, 카운터 같이 어디에도 종속되지 않는 기능을 구현할 때 유용하게 사용할 수 있습니다. 

```html
<!-- 필요한 모듈(analytics.js)의 로드가 끝나면 -->
<!-- 문서나 다른 <script>가 로드되길 기다리지 않고 바로 실행됩니다.-->
<script *!*async*/!* type="module">
  import {counter} from './analytics.js';

  counter.count();
</script>
```

### 외부 스크립트

`type="module"`가 붙은 외부 모듈 스크립트엔 두 가지 큰 특징이 있습니다.

1. `src` 속성값이 동일한 외부 스크립트는 한 번만 실행됩니다.
    ```html
    <!-- my.js는 한번만 로드 및 실행됩니다. -->
    <script type="module" src="my.js"></script>
    <script type="module" src="my.js"></script>
    ```

2. 외부 사이트같이 다른 오리진에서 모듈 스크립트를 불러오려면 <info:fetch-crossorigin> 챕터에서 설명한 바와 같이 [CORS](mdn:Web/HTTP/CORS) 헤더가 필요합니다. 모듈이 저장되어있는 원격 서버가 `Access-Control-Allow-Origin: *` 헤더를 제공해야만 외부 모듈을 불러올 수 있습니다. 참고로 `*` 대신 페치(fetch)를 허용할 도메인을 명시할 수도 있습니다.
    ```html
    <!-- another-site.com이 Access-Control-Allow-Origin을 지원해야만 외부 모듈을 불러올 수 있습니다.-->
    <!-- 그렇지 않으면 스크립트는 실행되지 않습니다.-->
    <script type="module" src="*!*http://another-site.com/their.js*/!*"></script>
    ```

    이 특징은 보안을 강화해 줍니다.

### '경로가 없는' 모듈은 금지

브라우저 환경에서 `import`는 반드시 상대 혹은 절대 URL 앞에 와야 합니다. 경로가 없는 모듈은 허용하지 않습니다.

아래 예제에서 `import`는 무효합니다.
```js
import {sayHi} from 'sayHi'; // Error!
// './sayHi.js'와 같이 경로 정보를 지정해 주어야 합니다.
```

Node.js나 번들링 툴은 경로가 없어도 해당 모듈을 찾수 있는 방법을 알기 때문에 경로가 없는 모듈을 사용할 수 있습니다. 하지만 브라우저는 경로 없는 모듈을 지원하지 않습니다.

### 호환을 위한 'nomodule'

구식 브라우저는 `type="module"`을 해석하지 못하기 때문에 모듈 타입의 스크립트를 만나면 이를 무시하고 넘어갑니다. `nomodule` 속성을 사용하면 이런 상황을 대비할 수 있습니다.

```html run
<script type="module">
  alert("모던 브라우저를 사용하고 계시군요.");
</script>

<script nomodule>
  alert("type=module을 해석할 수 있는 브라우저는 nomodule 타입의 스크립트는 넘어갑니다. 따라서 이 alert 문은 실행되지 않습니다.")
  alert("오래된 브라우저를 사용하고 있다면, type=module이 붙은 스크립트는 무시합니다. 대신 이 alert 문이 실행됩니다.");
</script>
```

## 빌드 툴

브라우저 환경에서 모듈을 '단독'으로 사용하는 경우는 흔치 않습니다. 대개 [웹팩(Webpack)](https://webpack.js.org/)과 같은 특별한 툴을 사용해 모듈을 한 데 묶어(번들링) 프로덕션 서버에 올리는 방식을 사용합니다.

번들러를 사용하면 모듈 분해를 통제할 수 있습니다. 여기에 더하여 경로가 없는 모듈이나 CSS, HTML 포맷의 모듈을 사용할 수 있게 해준다는 장점이 있습니다.

빌드 툴의 역할은 아래와 같습니다.

1. HTML의 `<script type="module">`에 넣을 '주요' 모듈('진입점' 역할을 하는 모듈)을 선택합니다. 
2. '주요' 모듈에 의존하고 있는 모듈 분석을 시작으로 모듈 간의 의존 관계를 파악합니다.
3. 모듈 전체를 한데 모아 하나의 큰 파일을 만듭니다(설정에 따라 여러 개의 파일을 만드는 것도 가능합니다). 이 과정에서 `import`문이 번들러 내 함수로 대체되므로 기존 기능은 그대로 유지됩니다.
4. 이런 과정 중에 변형이나 최적화도 함께 수행됩니다.
    - 도달 가능하지 않은 코드는 삭제됩니다.
    - 내보내진 모듈 중 쓰임처가 없는 모듈을 삭제합니다('가지치기(tree-shaking)').
    - `console`, `debugger` 같은 개발 관련 코드가 삭제됩니다.
    - 최신 자바스크립트 문법이 사용된 경우 [바벨(Babel)](https://babeljs.io/)을 사용하여 같은 기능을 하는 낮은 버전의 스크립트로 변환합니다.
    - 공백 제거, 변수 이름 줄이기 등으로 산출물의 크기를 줄입니다.

번들링 툴을 사용하면 스크립트들은 하나 혹은 여러 개의 파일로 번들링 됩니다. 이때 번들링 전 스크립트에 있던 `import/export`문은 특별한 번들러 함수로 대체됩니다. 번들링 과정이 끝나면 기존 스크립트에서 `import/export`가 사라지기 때문에 `type="module"`이 필요 없어집니다. 따라서 아래와 같이 번들링 과정을 거친 스크립트는 일반 스크립트처럼 취급할 수 있습니다. 

```html
<!-- 웹팩과 같은 툴로 번들링 과정을 거친 스크립트인 bundle.js -->
<script src="bundle.js"></script>
```

번들링 과정을 거치면 모듈이 일반 스크립트가 되어버리긴 하지만 네이티브 모듈도 당연히 사용 가능하므로 이 튜토리얼에선 웹팩없이 내용을 전개해보도록 하겠습니다.

## 요약

지금까지 배운 내용을 요약해봅시다.

1. 모듈은 하나의 파일입니다. 브라우저에서 `import/export` 지시자를 사용하려면 `<script type="module">`같은 속성이 필요합니다. 모듈은 아래와 같은 특징을 지닙니다.
    - 지연 실행됩니다.
    - 인라인 모듈 스크립트도 비동기 처리 할 수 있습니다.
    - 외부 오리진(도메인, 프로토콜, 포트)에서 스크립트를 불러오려면 CORS 헤더가 있어야 합니다.
    - 중복된 외부 스크립트는 무시됩니다.
2. 모듈은 자신만의 스코프를 갖습니다. 모듈 간 기능 공유는 `import/export`로 할 수 있습니다.
3. 항상 엄격 모드로 실행(`use strict`)됩니다.
4. 모듈 내 코드는 단 한 번만 실행됩니다. 모듈을 내보내면 이 모듈을 가져오기 하는 모듈 모두가 내보내진 모듈을 공유합니다.

모듈 내 함수나 객체 등은 `export` 키워드로 내보낼 수 있습니다. 이렇게 내보내진 기능은 `import` 키워드를 사용해 가져와 사용할 수 있습니다. 브라우저는 자동으로 스크립트를 불러오고 평가합니다.

실제 애플리케이션을 출시할 땐 성능 개선 등의 이점 때문에 [웹팩](https://webpack.js.org)과 같은 번들러를 사용합니다.

다음 챕터에선 더 많은 예시와 함께 모듈을 어떻게 내보내고 가져오는지 알아보겠습니다.
