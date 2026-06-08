
# defer, async 스크립트

모던 웹브라우저에서 돌아가는 스크립트들은 대부분 HTML보다 '무겁습니다'. 용량이 커서 다운로드받는 데 오랜 시간이 걸리고 처리하는 것 역시 마찬가지이죠.

브라우저는 HTML을 읽다가 `<script>...</script>` 태그를 만나면 스크립트를 먼저 실행해야 하므로 DOM 생성을 멈춥니다. 이는 `src` 속성이 있는 외부 스크립트 `<script src="..."></script>`를 만났을 때도 마찬가지입니다. 외부에서 스크립트를 다운받고 실행한 후에야 남은 페이지를 처리할 수 있습니다.

이런 브라우저의 동작 방식은 두 가지 중요한 이슈를 만듭니다.

1. 스크립트에서는 스크립트 아래에 있는 DOM 요소에 접근할 수 없습니다. 따라서 DOM 요소에 핸들러를 추가하는 것과 같은 여러 행위가 불가능해집니다.
2. 페이지 위쪽에 용량이 큰 스크립트가 있는 경우 스크립트가 페이지를 '막아버립니다'. 페이지에 접속하는 사용자들은 스크립트를 다운받고 실행할 때까지 스크립트 아래쪽 페이지를 볼 수 없게 됩니다.

```html run height=100
<p>...스크립트 앞 콘텐츠...</p>

<script src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<!-- 스크립트 다운로드 및 실행이 끝나기 전까지 아래 내용이 보이지 않습니다. -->
<p>...스크립트 뒤 콘텐츠...</p>
```

이런 부작용들을 피할 수 있는 몇 가지 방법이 있습니다. 아래 예시처럼 스크립트를 페이지 맨 아래 놓는 것이 하나의 방법이 될 수 있죠. 이렇게 하면 스크립트 위에 있는 요소에 접근할 수 있습니다. 또한, 페이지 콘텐츠 출력을 막지 않게 됩니다.

```html
<body>
  ... 스크립트 위 콘텐츠들 ...

  <script src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>
</body>
```

그런데 이 방법은 완벽한 해결책이 아닙니다. HTML 문서 자체가 아주 큰 경우를 가정해봅시다. 브라우저가 HTML 문서 전체를 다운로드 한 다음에 스크립트를 다운받게 하면 페이지가 정말 느려질 겁니다.

네트워크 속도가 빠른 곳에서 페이지에 접속하고 있다면 이런 지연은 눈에 잘 띄지 않습니다. 하지만 아직도 네트워크 환경이 열악한 곳이 많습니다. 모바일 네트워크 접속이 느린 곳도 많죠.

다행히도 이런 문제를 해결할 수 있는 `<script>` 속성이 있습니다. 바로 `defer`와 `async`입니다.

## defer

브라우저는 `defer` 속성이 있는 스크립트(이하 defer 스크립트 또는 지연 스크립트)를 '백그라운드'에서 다운로드합니다. 따라서 지연 스크립트를 다운로드하는 도중에도 HTML 처리를 계속 진행하며 DOM을 생성합니다. 그리고 defer 스크립트는 DOM 구성이 완료된 뒤 실행됩니다.

위쪽 예시와 동일한 코드인데 스크립트에 `defer`만 붙여보겠습니다.

```html run height=100
<p>...스크립트 앞 콘텐츠...</p>

<script defer src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<!-- 바로 볼 수 있네요! -->
<p>...스크립트 뒤 콘텐츠...</p>
```

- 지연 스크립트는 페이지 생성을 절대 막지 않습니다.
- 지연 스크립트는 DOM이 준비된 후에 실행되긴 하지만 `DOMContentLoaded` 이벤트 발생 전에 실행됩니다.

예시를 통해 직접 살펴봅시다.

```html run height=100
<p>...스크립트 앞 콘텐츠...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert("`defer` 스크립트가 실행된 후, DOM이 준비되었습니다!"));
</script>

<script defer src="https://javascript.info/article/script-async-defer/long.js?speed=1"></script>

<p>...스크립트 뒤 콘텐츠...</p>
```

1. 페이지 콘텐츠는 바로 출력됩니다.
2. `DOMContentLoaded` 이벤트는 지연 스크립트 실행을 기다립니다. 따라서 얼럿창은 DOM 트리가 완성되고 지연 스크립트가 실행된 후에 뜹니다.

**지연 스크립트는 일반 스크립트와 마찬가지로 HTML에 추가된 순(상대순, 요소순)으로 실행됩니다.**

따라서 길이가 긴 스크립트가 앞에, 길이가 짧은 스크립트가 뒤에 있어도 짧은 스크립트는 긴 스크립트가 실행될 때까지 기다립니다.

```html
<script defer src="https://javascript.info/article/script-async-defer/long.js"></script>
<script defer src="https://javascript.info/article/script-async-defer/small.js"></script>
```

브라우저는 성능을 위해 페이지에 어떤 스크립트들이 있는지 쭉 살펴본 후에야 스크립트를 병렬적으로 다운로드합니다. 위 예시에서도 스크립트 다운로드가 병렬적으로 진행되었습니다. 그런데 이때 크기가 작은 `small.js`가 `long.js`보다 먼저 다운로드될 수 있습니다.

하지만 `defer` 속성은 브라우저에 '막지 마'라고 지시하는 것 외에도 상대 순서를 유지합니다. 따라서 `small.js`가 먼저 다운로드 되더라도 `long.js` 다음에 실행됩니다.

이는 자바스크립트 라이브러리를 로드한 다음 해당 라이브러리에 의존하는 스크립트를 로드해야 하는 경우에 중요할 수 있습니다.

```smart header="`defer` 속성은 외부 스크립트에만 유효합니다."
`<script>`에 `src`가 없으면 `defer` 속성은 무시됩니다. 
```

## async

`async` 속성이 붙은 스크립트(이하 async 스크립트 또는 비동기 스크립트)는 `defer` 스크립트와 다소 유사하지만 동작 방식에 중요한 차이점이 있습니다.

`async` 속성은 스크립트가 페이지와 완전히 독립적으로 동작함을 의미합니다.

- async 스크립트는 defer 스크립트와 마찬가지로 백그라운드에서 다운로드됩니다. 따라서 HTML 페이지는 async 스크립트 다운이 완료되길 기다리지 않고 페이지 내 콘텐츠를 처리, 출력합니다(하지만 async 스크립트 실행중에는 HTML 파싱이 멈춥니다 - 옮긴이).
- 다른 스크립트들은 async 스크립트를 기다리지 않습니다. async 스크립트 역시 다른 스크립트들을 기다리지 않습니다.
- `DOMContentLoaded` 이벤트와 async 스크립트는 서로를 기다리지 않습니다.
    - 페이지 구성이 끝난 후에 async 스크립트 다운로딩이 끝난 경우, `DOMContentLoaded`는 async 스크립트 실행 전에 발생할 수 있습니다,
    - async 스크립트가 짧아서 페이지 구성이 끝나기 전에 다운로드 되거나 스크립트가 HTTP 캐시 처리 된 경우, `DOMContentLoaded`는 `async` 스크립트 실행 후에 발생할 수도 있습니다.

다시 말해 비동기 스크립트는 백그라운드에서 로드되어 준비가 되면 실행됩니다. DOM이나 다른 스크립트는 비동기 스크립트를 기다리지 않으며 비동기 스크립트 또한 그 어떤 것도 기다리지 않습니다. 로드되는 즉시 실행되는 완전히 독립적인 스크립트인 셈입니다. 간단하죠?

defer 스크립트를 사용했을 때와 비슷한 예시를 살펴봅시다.
`long.js`와 `small.js` 스크립트가 있고, `defer` 대신 `async`를 사용했습니다.

이 스크립트는 서로를 기다리지 않으므로 먼저 다운로드되는 스크립트가 먼저 실행됩니다. (아마 `small.js`일 것입니다.)

```html run height=100
<p>...스크립트 앞 콘텐츠...</p>

<script>
  document.addEventListener('DOMContentLoaded', () => alert("DOM이 준비 되었습니다!"));
</script>

<script async src="https://javascript.info/article/script-async-defer/long.js"></script>
<script async src="https://javascript.info/article/script-async-defer/small.js"></script>

<p>...스크립트 뒤 콘텐츠...</p>
```

1. 비동기 스크립트 다운로드는 페이지 로딩을 막지 않기 때문에 페이지 콘텐츠가 바로 출력됩니다.
2. `DOMContentLoaded` 이벤트는 상황에 따라 비동기 스크립트 전이나 후에 실행됩니다. 정확한 순서를 예측할 수 없습니다.
3. 비동기 스크립트는 서로를 기다리지 않습니다. 위치상으로는 `small.js`가 아래이긴 하지만 `long.js`보다 먼저 다운로드되었기 때문에 먼저 실행됩니다. (하지만 `long.js`가 캐시된 경우 먼저 로드되어 실행될 수 있습니다.) 이렇게 먼저 로드가 된 스크립트가 먼저 실행되는 것을 'load-first order'(로드 우선 순서 - 옮긴이)라고 부릅니다.

비동기 스크립트는 방문자 수 카운터나 광고 관련 스크립트처럼 각각 독립적인 역할을 하는 서드 파티 스크립트를 현재 개발 중인 스크립트에 통합하려 할 때 아주 유용합니다. async 스크립트는 개발 중인 스크립트에 의존하지 않고, 그 반대도 마찬가지이기 때문입니다.

```html
<!-- Google Analytics는 일반적으로 다음과 같이 삽입합니다. -->
<script async src="https://google-analytics.com/analytics.js"></script>
```

```smart header="The `async` attribute is only for external scripts"
Just like `defer`, the `async` attribute is ignored if the `<script>` tag has no `src`.
```

## 동적 스크립트

페이지에 스크립트를 추가하는 또 다른 중요한 방법이 있습니다.

자바스크립트를 사용하면 문서에 스크립트를 동적으로 추가할 수 있습니다. 이렇게 추가한 스크립트를 동적 스크립트(dynamic script)라고 부릅니다.

```js run
let script = document.createElement('script');
script.src = "/article/script-async-defer/long.js";
document.body.append(script); // (*)
```

위 예시에서 외부 스크립트는 관련 요소가 문서에 추가되자 마자(`(*)`로 표시한 줄) 다운로드가 시작됩니다.

그런데 **동적 스크립트는 기본적으로 'async' 스크립트처럼 행동합니다.**

따라서 다음과 같은 특징을 갖습니다.
- 동적 스크립트는 그 어떤 것도 기다리지 않습니다. 그리고 그 어떤 것도 동적 스크립트를 기다리지 않습니다.
- 먼저 다운로드된 스크립트가 먼저 실행됩니다('load-first' order).

`script.async=false`를 명시적으로 설정하면 위 특징을 변경할 수 있습니다. 그러면 스크립트는 `defer`처럼 문서 순서대로 실행됩니다.

아래 예시에서 `loadScript(src)` 함수는 스크립트를 추가하고 `async`를 `false`로 설정합니다.

따라서 `long.js`는 (가장 먼저 추가되었기 때문에) 항상 먼저 실행됩니다.

```js run
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
*!*
  script.async = false;
*/!*  
  document.body.append(script);
}

// async=false이기 때문에 long.js가 먼저 실행됩니다.
loadScript("/article/script-async-defer/long.js");
loadScript("/article/script-async-defer/small.js");
```

`script.async=false`를 지정하지 않으면 스크립트는 기본으로 먼저 로드된 순서대로 실행됩니다(아마 `small.js`가 먼저 실행됩니다.)
앞서 `defer`에서 살펴본 것처럼 라이브러리를 먼저 로드하고 이를 사용하는 다른 스크립트를 이후에 실행해야 하는 경우에는 실행 순서가 중요합니다.


## 요약

`async`와 `defer` 스크립트는 다운로드 시 페이지 렌더링을 막지 않는다는 공통점이 있습니다. 따라서 async와 defer를 적절히 사용하면 사용자가 오래 기다리지 않고 페이지 콘텐츠를 볼 수 있게 할 수 있습니다.

두 스크립트의 차이점은 다음과 같습니다.

|         | 순서 | DOMContentLoaded |
|---------|---------|---------|
| `async` | *load-first order*. 문서 내 순서와 상관없이 먼저 다운로드된 스크립트가 먼저 실행됩니다. |  비동기 스크립트는 HTML 문서가 완전히 다운로드되지 않은 상태라도 로드 및 실행될 수 있습니다. 스크립트 크기가 작거나 캐싱 처리 되어있을 때 혹은 HTML 문서 길이가 아주 길 때 이런 일이 발생합니다. |
| `defer` | *문서에 추가된 순* |  지연 스크립트는 문서 다운로드와 파싱이 완료된 후에, `DOMContentLoaded` 이벤트 발생 전에 실행됩니다. |

실무에선 `defer`를 DOM 전체가 필요한 스크립트나 실행 순서가 중요한 경우에 적용합니다.
`async`는 방문자 수 카운터나 광고 관련 스크립트같이 독립적인 스크립트에 혹은 실행 순서가 중요하지 않은 경우에 적용합니다.

```warn header="스크립트 다운로드가 끝나지 않았어도 페이지는 동작해야 합니다."
`defer`를 사용하게 되면 스크립트가 실행되기 *전* 에 페이지가 화면에 출력된다는 점에 항상 유의해야 합니다.

사용자는 그래픽 관련 컴포넌트들이 준비되지 않은 상태에서 화면을 보게 될 수 있죠. 

따라서 지연 스크립트가 영향을 주는 영역엔 반드시 '로딩 인디케이터'가 있어야 합니다. 관련 버튼도 사용 불가(disabled) 처리를 해줘야 하죠. 이렇게 해야 사용자에게 현재 어떤 것은 사용할 수 있는지, 어떤 것은 사용할 수 없는지를 알려줄 수 있습니다.
```