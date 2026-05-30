
# Fetch API

지금까지 `fetch`에 대해 꽤 많은 것을 배웠습니다.

이제 나머지 API를 살펴보며 `fetch`의 모든 기능을 알아봅시다.

```smart
여기서 설명하는 대부분의 옵션은 거의 사용되지 않기 때문에 이 챕터를 건너뛰어도 `fetch`를 잘 활용할 수 있습니다.

그래도 `fetch`로 무엇을 할 수 있는지 알아두면 좋습니다. 필요한 상황이 생기면 돌아와서 자세히 읽어보세요.
```

다음은 기본값(주석은 대안)이 포함된 fetch의 모든 옵션 목록입니다.

```js
let promise = fetch(url, {
  method: "GET", // POST, PUT, DELETE 등
  headers: {
    // Content-Type 헤더 값은 보통 요청 본문에 따라
    // 자동으로 설정됩니다.
    "Content-Type": "text/plain;charset=UTF-8"
  },
  body: undefined // string, FormData, Blob, BufferSource, or URLSearchParams
  referrer: "about:client", // Referer 헤더를 보내지 않으려면 빈 문자열("")을 사용합니다.
  // 또는 현재 origin에 해당하는 URL을 지정합니다.
  referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
  mode: "cors", // same-origin, no-cors
  credentials: "same-origin", // omit, include
  cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
  redirect: "follow", // manual, error
  integrity: "", // "sha256-abcdef1234567890"와 같은 해시
  keepalive: false, // true
  signal: undefined, // 요청을 중단할 AbortController
  window: window // null
});
```

목록이 꽤 길죠?

`method`, `headers`, `body`는 <info:fetch> 챕터에서 자세히 다루었습니다.

`signal`은 <info:fetch-abort> 챕터에서 다룹니다.

이제 나머지 기능들을 살펴봅시다.

## referrer, referrerPolicy

이 옵션들은 `fetch`가 HTTP `Referer` header를 설정하는 방식을 제어합니다.

Referer 헤더는 보통 자동으로 설정되며, 요청을 보낸 페이지의 URL을 포함합니다. 대부분은 중요하지 않지만, 보안 목적으로 제거하거나 줄여야 할 때가 있습니다.

**referrer 옵션을 사용하면 현재 오리진 내의 Referer 값을 직접 설정하거나 제거할 수 있습니다.**

referer를 보내지 않으려면 빈 문자열("")로 설정하세요.
```js
fetch('/page', {
*!*
  referrer: "" // Referer 헤더 없음
*/!*
});
```

현재 오리진 내의 다른 URL로 설정하려면 다음과 같이 하면 됩니다.

```js
fetch('/page', {
  // https://javascript.info에 있다고 가정할 때
  // 현재 오리진 내라면 어떤 Referer 헤더든 설정 가능합니다
*!*
  referrer: "https://javascript.info/anotherpage"
*/!*
});
```

**`referrerPolicy` 옵션은 `Referer`에 대한 일반 규칙을 설정합니다.**

요청은 세 가지 유형으로 나뉩니다.

1. 같은 오리진으로의 요청
2. 다른 오리진으로의 요청
3. HTTPS에서 HTTP로의 요청(안전한 프로토콜에서 안전하지 않은 프로토콜로)

정확한 `Referer`값을 설정하는 `referrer` 옵션과 달리, `referrerPolicy`는 각 요청 유형에 대한 일반 규칙을 브라우저에 알려줍니다.

사용 가능한 값들은 [Referrer 정책 명세](https://w3c.github.io/webappsec-referrer-policy/)에 있습니다.

- **`"no-referrer-when-downgrade"`** -- 기본값으로, HTTPS에서 HTTP로(덜 안전한 프로토콜로) 요청하는 경우를 제외하고 항상 전체 Referer를 전송합니다.
- **`"no-referrer"`** -- `Referer`를 보내지 않습니다.
- **`"origin"`** -- 전체 페이지 URL 대신 오리진만 `Referer`로 전송합니다. 예를 들어 `http://site.com/path` 대신 `http://site.com`만 전송합니다.
- **`"origin-when-cross-origin"`** -- 같은 오리진으로 요청을 보낼 때는 전체 `Referer`를 보내고, 다른 오리진으로 요청을 보낼 때는 오리진 부분만 보냅니다(위와 동일).
- **`"same-origin"`** -- 같은 오리진으로 요청을 보낼 때는 전체 `Referer`를 보내고, 다른 오리진으로 요청할 때는 `Referer`를 보내지 않습니다.
- **`"strict-origin"`** -- 오리진만 보냅니다. 단, HTTPS에서 HTTP로 요청할 때는 `Referer`를 보내지 않습니다.
- **`"strict-origin-when-cross-origin"`** -- 같은 오리진으로 요청할 때는 전체 `Referer`를 보내고, 다른 오리진으로 요청할 때는 오리진만 보냅니다. 단, HTTPS에서 HTTP로 요청할 때는 아무것도 보내지 않습니다.
- **`"unsafe-url"`** -- HTTPS에서 HTTP로 요청할 때도 항상 전체 URL을 `Referer`에 담아 보냅니다.

모든 조합을 정리한 표입니다.

| 값 | 같은 오리진 | 다른 오리진 | HTTPS→HTTP |
|-------|----------------|-------------------|------------|
| `"no-referrer"` | - | - | - |
| `"no-referrer-when-downgrade"` 또는 `""` (기본값) | 전체 | 전체 | - |
| `"origin"` | 오리진 | 오리진 | 오리진 |
| `"origin-when-cross-origin"` | 전체 | 오리진 | 오리진 |
| `"same-origin"` | 전체 | - | - |
| `"strict-origin"` | 오리진 | 오리진 | - |
| `"strict-origin-when-cross-origin"` | 전체 | 오리진 | - |
| `"unsafe-url"` | 전체 | 전체 | 전체 |

사이트 외부에 알려지면 안 되는 URL 구조를 가진 관리자 영역이 있다고 가정하겠습니다.

`fetch` 요청을 보내면 기본적으로 현재 페이지의 전체 URL이 담긴 `Referer` 헤더가 항상 전송됩니다. 단, HTTPS에서 HTTP로 요청을 보낼 때는 `Referer`가 전송되지 않습니다.

예시는 `Referer: https://javascript.info/admin/secret/paths`와 같습니다.

만약 다른 웹사이트에 전체 URL 경로가 아닌 오리진만 알려주고 싶다면 아래 옵션을 설정하면 됩니다.

```js
fetch('https://another.com/page', {
  // ...
  referrerPolicy: "origin-when-cross-origin", // Referer: https://javascript.info
});
```

이 옵션은 모든 `fetch` 호출에 적용할 수 있습니다. 예를 들어 프로젝트의 모든 요청을 처리하는 JavaScript 라이브러리에서 내부적으로 `fetch`를 사용한다면, 그 라이브러리에 이 옵션을 넣어둘 수 있습니다.

기본 동작과 다른 점은 하나뿐입니다. 다른 오리진으로 요청을 보낼 때 `fetch`는 URL 전체가 아니라 오리진 부분만 보냅니다. 예를 들어 세부 경로를 제외한 `https://javascript.info`만 전송합니다. 반면 같은 오리진으로 요청을 보낼 때는 전체 `Referer`가 그대로 전송되므로, 요청이 발생한 페이지를 확인해야 하는 디버깅 상황에서 유용할 수 있습니다.

```smart header="Referrer policy는 `fetch` 전용이 아닙니다"
[명세](https://w3c.github.io/webappsec-referrer-policy/)에서 설명하는 Referrer policy는 `fetch`에만 적용되는 것이 아니라, 더 전역적으로 적용됩니다.

특히 `Referrer-Policy` HTTP 헤더를 사용해 전체 페이지의 기본 정책을 설정할 수도 있고, `<a rel="noreferrer">`를 사용해 링크별로 설정할 수도 있습니다.
```

## mode

`mode` 옵션은 우발적인 크로스 오리진 요청을 방지하는 안전장치입니다. 

- **`"cors"`** -- 기본값으로, <info:fetch-crossorigin>에서 설명한 대로 크로스 오리진 요청을 허용합니다.
- **`"same-origin"`** -- 크로스 오리진 요청을 금지합니다.
- **`"no-cors"`** -- 단순한 크로스 오리진 요청만 허용합니다.

`fetch`의 URL이 서드 파티에서 제공되는 경우, 크로스 오리진 기능을 제한하는 '차단 스위치'로 이 옵션을 활용할 수 있습니다.

## credentials

`credentials` 옵션은 `fetch`가 요청에 쿠키와 HTTP 인증 헤더를 포함할지를 명세합니다.

- **`"same-origin"`** -- 기본값으로, 크로스 오리진 요청에는 전송하지 않습니다.
- **`"include"`** -- 항상 전송합니다. JavaScript에서 응답에 접근하려면 크로스 오리진 서버에서 `Accept-Control-Allow-Credentials`를 반환해야 하며, 이는 <info:fetch-crossorigin> 챕터에서 다루었습니다.
- **`"omit"`** -- 같은 오리진 요청에도 전송하지 않습니다.

## cache

기본적으로 `fetch` 요청은 표준 HTTP 캐싱을 사용합니다. 즉 일반 HTTP 요청과 마찬가지로 `Expires`, `Cache-Control` 헤더를 따르고, `If-Modified-Since` 등을 전송합니다.

이때 `cache` 옵션을 사용하면 HTTP 캐시를 무시하거나, 캐시 사용 방식을 세밀하게 조정할 수 있습니다.

- **`"default"`** -- `fetch`가 표준 HTTP 캐시 규칙과 헤더를 사용합니다.
- **`"no-store"`** -- HTTP 캐시를 완전히 무시합니다. `If-Modified-Since`, `If-None-Match`, `If-Unmodified-Since`, `If-Match`, `If-Range` 헤더를 설정하면 이 모드가 기본값이 됩니다.
- **`"reload"`** -- HTTP 캐시에 저장된 응답이 있더라도 사용하지 않습니다. 대신 응답 헤더가 허용한다면 응답을 캐시에 저장합니다.
- **`"no-cache"`** -- 캐시된 응답이 있으면 조건부 요청을 만들고, 없으면 일반 요청을 만듭니다. 응답은 HTTP 캐시에 저장됩니다.
- **`"force-cache"`** -- HTTP 캐시에 응답이 있으면, 오래된 응답이라도 반드시 캐시에서 가져옵니다. HTTP 캐시에 응답이 없으면 일반 HTTP 요청을 보내고 평소처럼 동작합니다.
- **`"only-if-cached"`** -- HTTP 캐시에 응답이 있으면, 오래된 응답이라도 반드시 캐시에서 가져옵니다. HTTP 캐시에 응답이 없으면 에러가 발생합니다. `mode`가 `"same-origin"`일 때만 동작합니다.

## redirect

일반적으로 `fetch`는 301, 302 같은 HTTP 리다이렉트가 발생하면 자동으로 해당 주소를 따라갑니다.

`redirect` 옵션으로 기본 동작을 변경할 수 있습니다.

- **`"follow"`** -- 기본값으로, HTTP 리다이렉트를 따릅니다.
- **`"error"`** -- HTTP 리다이렉트 발생 시 오류를 반환합니다.
- **`"manual"`** -- HTTP 리다이렉트를 자동으로 따라가지 않습니다. 대신 `response.url`에는 새 URL이 들어가고, `response.redirected`는 `true`가 됩니다. 따라서 필요한 경우 새 URL로 직접 리다이렉트할 수 있습니다.

## integrity

`integrity` 옵션을 사용하면 응답이 미리 알고 있는 체크섬과 일치하는지 확인할 수 있습니다.

[명세](https://w3c.github.io/webappsec-subresource-integrity/)에 따르면 SHA-256, SHA-384, SHA-512 해시 함수를 지원하며, 브라우저에 따라 다른 함수를 지원하기도 합니다.

예를 들어 파일을 내려받을 때 SHA-256 체크섬이 `"abcdef"`라는 것을 알고 있다고 가정해 봅시다. 물론 실제 체크섬은 이보다 더 깁니다.

이 값을 다음과 같이 `integrity` 옵션에 넣을 수 있습니다.

```js
fetch('http://site.com/file', {
  integrity: 'sha256-abcdef'
});
```

그러면 `fetch`가 직접 SHA-256 해시를 계산하고, 이를 우리가 입력한 문자열과 비교합니다. 이때 값이 일치하지 않으면 에러가 발생합니다.

## keepalive

`keepalive` 옵션은 요청을 시작한 웹페이지보다 요청이 더 오래 유지될 수 있음을 나타냅니다.

예를 들어 사용자 경험을 분석하고 개선하기 위해 현재 방문자가 페이지를 어떻게 사용하는지에 대한 통계 데이터, 즉 마우스 클릭이나 방문자가 본 페이지 영역 등을 수집한다고 해 봅시다.

방문자가 페이지를 떠날 때 이 데이터를 서버에 저장해야 한다면

`window.onunload` 이벤트를 사용할 수 있습니다.

```js run
window.onunload = function() {
  fetch('/analytics', {
    method: 'POST',
    body: "statistics",
*!*
    keepalive: true
*/!*
  });
};
```

일반적으로 문서가 언로드되면 관련된 모든 네트워크 요청은 중단됩니다. 하지만 `keepalive` 옵션을 사용하면 페이지를 떠난 뒤에도 브라우저가 백그라운드에서 요청을 계속 처리합니다. 따라서 요청을 성공적으로 완료하려면 이 옵션이 꼭 필요합니다.

이 옵션에는 몇 가지 제한이 있습니다.

- `keepalive` 요청의 본문 크기 제한은 64KB이라서 메가바이트 단위의 데이터를 보낼 수는 없습니다.
    - 방문 통계 데이터가 많이 수집된다면, 마지막 `onunload` 요청에 너무 많은 데이터가 남지 않도록 일정한 간격으로 나누어 보내야 합니다.
    - 이 제한은 모든 `keepalive` 요청에 합산 적용됩니다. 여러 `keepalive` 요청을 병렬로 보낼 수는 있지만, 요청 본문 크기의 합은 64KB를 넘을 수 없습니다.
- 문서가 언로드되면 서버 응답을 처리할 수 없습니다. 따라서 위 예시의 `fetch` 요청은 `keepalive` 덕분에 성공하겠지만, 그 뒤에 이어지는 함수는 동작하지 않습니다.
    - 통계 데이터를 전송하는 경우처럼 서버 응답을 따로 처리할 필요가 없다면 문제가 되지 않습니다. 서버는 데이터를 받기만 하면 되고, 이런 요청에는 보통 빈 응답을 보내기 때문입니다.
