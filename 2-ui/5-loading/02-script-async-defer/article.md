
# 비동기, 지연 스크립트

모던 웹브라우저에서 돌아가는 스크립트들은 대부분 HTML보다 '무겁습니다'. 용량이 커서 다운로드받는 데 오랜 시간이 걸리고 처리하는 것 역시 마찬가지이죠.

브라우저는 HTML을 읽다가 `<script>...</script>` 태그를 만나면 스크립트를 먼저 실행해야 하므로 DOM 생성을 멈춥니다. 이는 외부 스크립트 `<script src="..."></script>`를 만났을 때도 마찬가지입니다. 외부에서 스크립트를 다운로드받고 실행한 후에야 나머지 페이지들을 처리할 수 있습니다.

이런 브라우저의 동작 방식은 두 가지 중요한 이슈를 만듭니다.

1. 스크립트는 스크립트 아래에 있는 DOM 요소를 볼 수 없습니다. 따라서 핸들러 추가 같은 여러 행위가 불가능해집니다.
2. 페이지 위쪽에 용량이 큰 스크립트가 있는 경우, 이 스크립트가 페이지를 '막아버립니다'. 페이지에 접속하는 사용자들은 스크립트를 다운받고 실행할 때까지 스크립트 아래쪽 페이지를 볼 수 없게 됩니다.

```html run height=100
<p>...스크립트 앞 콘텐츠...</p>

<script src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<!-- 스크립트 로딩이 끝나기 전까지 아래 내용이 보이지 않습니다. -->
<p>...스크립트 뒤 콘텐츠...</p>
```

이런 부작용들을 피할 수 있는 몇 가지 방법이 있습니다. 아래 예시처럼 스크립트를 페이지 맨 아래 놓는 것이 하나의 방법이 될 수 있죠. 이렇게 하면 스크립트에서 스크립트 위에 있는 요소를 볼 수 있습니다. 또한, 페이지 콘텐츠 출력을 막지 않게 됩니다.

```html
<body>
  ... 스크립트 위 콘텐츠들 ...

  <script src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>
</body>
```

그런데 이 방법은 완벽한 해결책은 아닙니다. HTML 문서 자체가 아주 큰 경우를 가정해봅시다. 브라우저가 HTML 문서 전체를 다운로드 한 다음에 스크립트를 다운받게 하면 페이지가 정말 느려질 겁니다.

네트워크 속도가 빠른 곳에서 페이지에 접속하고 있다면 이런 지연은 눈에 잘 띄지 않습니다. 하지만 아직도 네트워크 환경이 열악한 곳이 많습니다. 모바일 네트워크 접속이 느린 곳도 많죠.

다행히도 이런 문제를 해결할 수 있는 `<script>` 속성이 있습니다. 바로 `defer`와 `async`입니다.

## defer

브라우저는 `defer` 속성이 있는 스크립트(이하 `defer` 스크립트 또는 지연 스크립트)를 '백그라운드'에서 불러옵니다. 실행은 페이지 로딩이 끝날 때까지 *지연* 되죠. `defer` 스크립트를 만나도 HTML 파싱이 멈추지 않는 이유는 여기에 있습니다.

위쪽 예시와 동일한 코드인데 스크립트에 `defer`만 붙여보겠습니다.

```html run height=100
<p>...스크립트 앞 콘텐츠...</p>

<script defer src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<!-- 바로 볼 수 있네요! -->
<p>...스크립트 뒤 콘텐츠...</p>
```

- 지연 스크립트는 HTML 파싱을 절대 막지 않습니다.
- 지연 스크립트는 DOM 트리가 완성된 후, `DOMContentLoaded` 이벤트가 발생하기 전에 실행됩니다.

예시를 통해 직접 살펴봅시다.

```html run height=100
<p>...스크립트 앞 콘텐츠...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert("DOM이 준비되고 `defer` 스크립트가 실행된 후, DOMContentLoaded 이벤트가 발생했습니다!")); // (2)
</script>

<script defer src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<p>...스크립트 뒤 콘텐츠...</p>
```

1. 페이지 콘텐츠는 바로 출력됩니다.
2. `DOMContentLoaded` 이벤트는 지연 스크립트를 기다립니다. 따라서 `DOMContentLoaded` 이벤트는 DOM 트리가 완성되고 지연 스크립트가 실행된 후에 실행됩니다.

지연 스크립트도 일반 스크립트와 마찬가지로 HTML에 추가된 순(상대순, 요소순)으로 실행됩니다.

따라서 길이가 긴 스크립트가 앞에, 길이가 짧은 스크립트가 뒤에 있을 때, 뒤에 있는 스크립트는 앞의 스크립트가 실행될 때까지 대기합니다.

```html
<script defer src="https://javascript.info/article/script-async-defer/long.js"></script>
<script defer src="https://javascript.info/article/script-async-defer/small.js"></script>
```

```smart header="작은 스크립트는 먼저 다운되지만, 실행은 나중에 됩니다."
브라우저는 성능을 위해 페이지에 어떤 스크립트들이 있는지 스캔한 다음 스크립트를 병렬적으로 다운로드합니다. 따라서 위 예시의 스크립트 다운도 병렬적으로 진행되죠. `small.js` 다운로드가 `long.js`보다 빨리 끝날 수 있습니다.

그렇지만 명세서에서 스크립트를 문서에 추가된 순서대로 실행하라고 정의했기 때문에 `small.js`는 `long.js` 다음에 실행됩니다.
```

```smart header="`defer` 속성은 외부 스크립트에만 유효합니다."
`<script>`에 `src`가 없으면 `defer` 속성은 무시됩니다. 
```


## async

`async` 속성은 스크립트가 완전히 독립적으로 행동할 수 있게 보장해 줍니다.

- 페이지는 `async` 속성이 붙은 스크립트(이하 async 스크립트 또는 비동기 스크립트)를 기다리지 않고 페이지 내 콘텐츠를 처리, 출력합니다.
- `DOMContentLoaded`와 async 스크립트는 서로를 기다리지 않습니다.
    - 페이지 구성이 끝나기 전에 `async` 스크립트 로딩이 끝난 경우, `DOMContentLoaded`는 async 스크립트 전에 발생할 수 있습니다,
    - async 스크립트가 짧거나 HTTP 캐시 안에 있는 경우, `DOMContentLoaded`는 `async` 스크립트 후에도 발생할 수 있습니다.
- 다른 스크립트들은 `async` 스크립트를 기다리지 않습니다. `async` 스크립트 역시 다른 스크립트들을 기다리지 않습니다.


이런 특징 때문에 페이지에 `async` 스크립트가 여러 개 있는 경우, 그 실행 순서가 제각각이 됩니다. 먼저 로드되는 스크립트가 먼저 실행됩니다.

```html run height=100
<p>...스크립트 앞 콘텐츠...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert("DOM이 준비 되었습니다!"));
</script>

<script async src="https://javascript.info/article/script-async-defer/long.js"></script>
<script async src="https://javascript.info/article/script-async-defer/small.js"></script>

<p>...스크립트 뒤 콘텐츠...</p>
```

1. 페이지 콘텐츠는 바로 출력됩니다. 비동기 스크립트는 페이지 로딩을 막지 않습니다.
2. `DOMContentLoaded` 이벤트는 비동기 스크립트 전이나 후에 실행됩니다. 순서에 보장이 없습니다.
3. 비동기 스크립트는 서로를 기다리지 않습니다. 위치상으론 `small.js`가 아래이긴 하지만 `long.js`보다 먼저 로드되었기 때문에 더 먼저 실행되었습니다. 이를 'load-first order'라고 부릅니다.

비동기 스크립트는 방문자 수 카운터나 광고 관련 스크립트같이 각각 독립적인 역할을 하는 서드 파티 스크립트를 현재 개발 중인 스크립트에 통합하려 할 때 아주 유용합니다. async 스크립트는 개발 중인 스크립트에 의존하지 않고, 그 반대도 마찬가지이기 때문입니다. 

```html
<!-- Google Analytics는 일반적으로 다음과 같이 삽입합니다. -->
<script async src="https://google-analytics.com/analytics.js"></script>
```


## 동적 스크립트

자바스크립트를 사용하면 스크립트를 동적으로 추가할 수 있습니다(dynamic script).

```js run
let script = document.createElement('script');
script.src = "/article/script-async-defer/long.js";
document.body.append(script); // (*)
```

이렇게 추가한 동적 스크립트는 문서에 추가되자 마자(`(*)`로 표시한 줄) 스크립트 로딩이 시작됩니다.

**동적 스크립트는 기본적으로 'async' 스크립트처럼 행동합니다.**

따라서, 동적 스크립트는 다음과 같은 특징을 갖습니다.
- 그 어떤 것도 기다리지 않습니다. 다른 자원들도 동적 스크립트를 기다리지 않습니다.
- 먼저 로드된 스크립트가 먼저 실행됩니다('load-first order').


```js run
let script = document.createElement('script');
script.src = "/article/script-async-defer/long.js";

*!*
script.async = false;
*/!*

document.body.append(script);
```

아래 예시에선 두 개의 스크립트를 동적으로 문서에 추가합니다. `script.async=false`가 없었다면 이 두 스크립트는 'load-first order'로 실행됩니다. 크기가 작은 `small.js`가 먼저 실행되겠죠. 하지만 `script.async=false`가 있기 때문에 실행은 '문서에 추가된 순서'대로 됩니다.


```js run
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.body.append(script);
}

// async=false이기 때문에 long.js가 먼저 실행됩니다.
loadScript("/article/script-async-defer/long.js");
loadScript("/article/script-async-defer/small.js");
```


## 요약

`async`와 `defer` 스크립트는 다운로드 시 페이지 렌더링을 막지 않는다는 공통점이 있습니다. 따라서 사용자는 오래 기다리지 않고도 페이지 콘텐츠를 볼 수 있습니다.

두 스크립트의 차이점은 다음과 같습니다.

|         | 순서 | `DOMContentLoaded` |
|---------|---------|---------|
| `async` | *load-first order*. 문서 내 순서와 상관없이 먼저 로드된 스크립트가 먼저 실행됩니다. |  비동기 스크립트는 문서가 완전히 다운로드되지 않은 상태라도 로드 및 실행될 수 있습니다. 스크립트 크기가 작거나 캐싱 처리 되어있을 때 혹은 문서 길이가 아주 길 때 이런 일이 발생합니다. |
| `defer` | *문서에 추가된 순* |  지연 스크립트는 문서 로드와 파싱이 완료된 후에, `DOMContentLoaded` 이벤트 발생 전에 실행됩니다. |

```warn header="스크립트 로딩이 안 되었어도 페이지는 동작해야 합니다."
`defer`를 사용하게 되면 스크립트가 실행되기 *전* 에 페이지가 화면에 출력된다는 점에 항상 유의해야 합니다.

사용자는 그래픽 관련 컴포넌트들이 준비되지 않은 상태에서 화면을 보게 될 수 있죠. 

따라서 지연 스크립트가 영향을 주는 영역엔 반드시 '로딩 인디케이터'가 있어야 합니다. 관련 버튼도 사용 불가(disabled) 처리를 해줘야 하죠. 이렇게 해야 사용자에게 현재 어떤 것은 사용할 수 있는지, 어떤 것은 사용할 수 없는지를 알려줄 수 있습니다. 
```

실무에선 `defer`를 DOM 전체가 필요한 스크립트나 실행 순서가 중요한 경우에 적용합니다. `async`는 방문자 수 카운터나 광고 관련 스크립트같이 독립적인 스크립트에 혹은 실행 순서가 중요하지 않은 경우에 적용합니다.
