# XMLHttpRequest

`XMLHttpRequest`는 자바스크립트에서 HTTP 요청을 보낼 수 있게 해주는 브라우저 내장 객체입니다.

이름에 "XML"이 들어가 있지만 XML 형식뿐만 아니라 어떤 데이터에도 사용할 수 있습니다. 파일을 업로드하거나 다운로드하고, 진행 상황을 추적하는 등 여러 작업을 할 수 있습니다.

요즘은 `fetch`라는 더 모던한 방식이 있어 `XMLHttpRequest`를 어느 정도 대체합니다.

모던 웹 개발에서 `XMLHttpRequest`가 쓰이는 이유는 세 가지입니다.

1. 역사적인 이유로 `XMLHttpRequest`를 사용하는 기존 스크립트를 지원해야 하는 경우
2. 구형 브라우저를 지원해야 하고, 폴리필은 쓰고 싶지 않은 경우(예: 스크립트 크기를 작게 유지하기 위해)
3. 업로드 진행률 추적처럼 아직 `fetch`로 할 수 없는 기능이 필요한 경우

이런 상황에 해당하나요? 그렇다면 `XMLHttpRequest`를 계속 살펴봅시다. 그렇지 않다면 <info:fetch>로 넘어가세요.

## 기본

`XMLHttpRequest`에는 동기와 비동기 두 가지 동작 모드가 있습니다.

대부분의 경우 비동기 방식을 사용하므로, 먼저 비동기 요청을 살펴봅시다.

요청을 보내려면 다음 단계를 거칩니다.

1. `XMLHttpRequest`를 생성합니다.
    ```js
    let xhr = new XMLHttpRequest();
    ```
    생성자는 인수를 받지 않습니다.

2. 보통 `new XMLHttpRequest` 직후 초기화합니다.
    ```js
    xhr.open(method, URL, [async, user, password])
    ```

    이 메서드는 요청의 주요 매개변수를 지정합니다.

    - `method` -- HTTP 메서드입니다. 보통 `"GET"`이나 `"POST"`를 사용합니다.
    - `URL` -- 요청할 URL입니다. 문자열이거나 [URL](info:url) 객체일 수 있습니다.
    - `async` -- 명시적으로 `false`로 설정하면 요청이 동기 방식으로 이루어집니다. 이 부분은 조금 후에 다룹니다.
    - `user`, `password` -- 기본 HTTP 인증에 사용할 로그인과 비밀번호입니다(필요한 경우).

    이름과 달리 `open` 호출은 연결을 열지 않는다는 점에 주의하세요. `open`은 요청을 설정할 뿐이고, 실제 네트워크 동작은 `send`를 호출해야 시작됩니다.

3. 요청을 전송합니다.

    ```js
    xhr.send([body])
    ```

    이 메서드는 연결을 열고 서버로 요청을 보냅니다. 선택 사항인 `body` 매개변수에는 요청 본문이 들어갑니다.

    `GET` 같은 일부 요청 메서드에는 본문이 없습니다. 반면 `POST` 같은 메서드는 `body`를 사용해 서버로 데이터를 보냅니다. 이에 대한 예시는 뒤에서 살펴보겠습니다.

4. `xhr` 이벤트로 응답을 감지합니다.

    가장 널리 쓰이는 이벤트는 다음 세 가지입니다.
    - `load` -- 요청이 완료되고(HTTP 상태가 400이나 500이어도) 응답 전체가 다운로드되었을 때 발생합니다.
    - `error` -- 요청을 보낼 수 없을 때 발생합니다. 예를 들어 네트워크가 끊겼거나 URL이 잘못된 경우입니다.
    - `progress` -- 응답을 다운로드하는 동안 주기적으로 발생하며, 얼마나 다운로드되었는지 알려줍니다.

    ```js
    xhr.onload = function() {
      alert(`로드됨: ${xhr.status} ${xhr.response}`);
    };

    xhr.onerror = function() { // 요청을 전혀 보낼 수 없을 때만 발생
      alert(`네트워크 에러`);
    };

    xhr.onprogress = function(event) { // 주기적으로 발생
      // event.loaded - 다운로드한 바이트 수
      // event.lengthComputable = 서버가 Content-Length 헤더를 보낸 경우 true
      // event.total - 전체 바이트 수(lengthComputable인 경우)
      alert(`${event.total} 바이트 중 ${event.loaded} 바이트 수신`);
    };
    ```

아래는 전체 예시입니다. 다음 코드는 서버에서 `/article/xmlhttprequest/example/load` URL을 불러오고 진행 상황을 출력합니다.

```js run
// 1. 새 XMLHttpRequest 객체 생성
let xhr = new XMLHttpRequest();

// 2. 설정: /article/.../load URL에 GET 요청
xhr.open('GET', '/article/xmlhttprequest/example/load');

// 3. 네트워크로 요청 전송
xhr.send();

// 4. 응답을 받으면 호출됩니다
xhr.onload = function() {
  if (xhr.status != 200) { // 응답의 HTTP 상태 분석
    alert(`에러 ${xhr.status}: ${xhr.statusText}`); // 예: 404: Not Found
  } else { // 결과 표시
    alert(`완료, ${xhr.response.length} 바이트를 받았습니다`); // xhr.response는 서버 응답입니다
  }
};

xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    alert(`${event.total} 바이트 중 ${event.loaded} 바이트 수신`);
  } else {
    alert(`${event.loaded} 바이트 수신`); // Content-Length 없음
  }

};

xhr.onerror = function() {
  alert("요청 실패");
};
```

서버가 응답하면 다음 `xhr` 프로퍼티에서 결과를 받을 수 있습니다.

`status`
: HTTP 상태 코드(숫자)입니다. `200`, `404`, `403` 등이 있으며, HTTP와 무관한 실패가 발생하면 `0`일 수 있습니다.

`statusText`
: HTTP 상태 메시지(문자열)입니다. 보통 `200`에는 `OK`, `404`에는 `Not Found`, `403`에는 `Forbidden` 등이 대응됩니다.

`response`(오래된 스크립트에서는 `responseText`를 사용할 수도 있음)
: 서버 응답 본문입니다.

해당 프로퍼티로 타임아웃도 지정할 수 있습니다.

```js
xhr.timeout = 10000; // ms 단위 타임아웃, 10초
```

지정한 시간 안에 요청이 성공하지 못하면 요청이 취소되고 `timeout` 이벤트가 발생합니다.

````smart header="URL 검색 매개변수"
URL에 `?name=value` 같은 매개변수를 추가하고 올바르게 인코딩하려면 [URL](info:url) 객체를 사용할 수 있습니다.

```js
let url = new URL('https://google.com/search');
url.searchParams.set('q', 'test me!');

// 매개변수 'q'가 인코딩됩니다
xhr.open('GET', url); // https://google.com/search?q=test+me%21
```

````

## 응답 타입

`xhr.responseType` 프로퍼티를 사용해 응답 형식을 지정할 수 있습니다.

- `""`(기본값) -- 문자열로 받습니다.
- `"text"` -- 문자열로 받습니다.
- `"arraybuffer"` -- `ArrayBuffer`로 받습니다(이진 데이터는 [ArrayBuffer와 이진 배열](info:arraybuffer-binary-arrays) 챕터 참고).
- `"blob"` -- `Blob`으로 받습니다(이진 데이터는 <info:blob> 챕터 참고).
- `"document"` -- XML 문서(XPath와 기타 XML 메서드 사용 가능)나 HTML 문서(받은 데이터의 MIME 타입 기준)로 받습니다.
- `"json"` -- JSON으로 받습니다(자동으로 파싱됩니다).

예를 들어 응답을 JSON으로 받아봅시다.

```js run
let xhr = new XMLHttpRequest();

xhr.open('GET', '/article/xmlhttprequest/example/json');

*!*
xhr.responseType = 'json';
*/!*

xhr.send();

// 응답은 {"message": "Hello, world!"}입니다
xhr.onload = function() {
  let responseObj = xhr.response;
  alert(responseObj.message); // Hello, world!
};
```

```smart header="참고"
오래된 스크립트에서는 `xhr.responseText`, 심지어 `xhr.responseXML` 프로퍼티를 볼 수도 있습니다.

이 프로퍼티들은 문자열이나 XML 문서를 받기 위한 것으로 역사적인 이유로 남아 있습니다. 요즘은 위 예시처럼 `xhr.responseType`으로 형식을 지정하고 `xhr.response`에서 값을 가져오는 편이 좋습니다.
```

## `readyState` 상태

`XMLHttpRequest`는 진행 단계에 따라 상태가 바뀝니다. 현재 상태는 `xhr.readyState`로 확인할 수 있습니다.

[명세](https://xhr.spec.whatwg.org/#states)에 따른 모든 상태는 다음과 같습니다.

```js
UNSENT = 0; // 초기 상태
OPENED = 1; // open 호출됨
HEADERS_RECEIVED = 2; // 응답 헤더를 받음
LOADING = 3; // 응답을 불러오는 중(데이터 패킷을 받음)
DONE = 4; // 요청 완료
```

`XMLHttpRequest` 객체는 `0` -> `1` -> `2` -> `3` -> ... -> `3` -> `4` 순서로 상태를 거칩니다. 네트워크로 데이터 패킷을 받을 때마다 상태 `3`이 반복됩니다.

`readystatechange` 이벤트를 사용해 상태 변화를 추적할 수 있습니다.

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState == 3) {
    // 로딩 중
  }
  if (xhr.readyState == 4) {
    // 요청 완료
  }
};
```

아주 오래된 코드에서는 `readystatechange` 리스너를 찾을 수 있습니다. 이는 역사적인 이유로 남아 있는 것으로, `load`와 그 밖의 이벤트가 없던 시절에 쓰였습니다. 요즘은 `load/error/progress` 핸들러가 이를 대체합니다.

## 요청 중단하기

언제든 요청을 중단할 수 있습니다. `xhr.abort()`를 호출하면 됩니다.

```js
xhr.abort(); // 요청 중단
```

그러면 `abort` 이벤트가 발생하고 `xhr.status`는 `0`이 됩니다.

## 동기 요청

`open` 메서드의 세 번째 매개변수 `async`가 `false`로 설정되면 요청은 동기 방식으로 수행됩니다.

다시 말해 자바스크립트 실행은 `send()`에서 멈추고 응답을 받으면 다시 이어집니다. `alert`나 `prompt` 명령과 비슷합니다.

다음은 `open`의 세 번째 매개변수를 `false`로 바꾼 예시입니다.

```js
let xhr = new XMLHttpRequest();

xhr.open('GET', '/article/xmlhttprequest/hello.txt', *!*false*/!*);

try {
  xhr.send();
  if (xhr.status != 200) {
    alert(`에러 ${xhr.status}: ${xhr.statusText}`);
  } else {
    alert(xhr.response);
  }
} catch(err) { // onerror 대신
  alert("요청 실패");
}
```

겉보기엔 괜찮아 보일 수 있지만, 동기 호출은 로딩이 완료될 때까지 페이지 안의 자바스크립트 실행을 막기 때문에 거의 쓰지 않습니다. 어떤 브라우저에서는 스크롤조차 할 수 없게 됩니다. 동기 호출이 너무 오래 걸리면 브라우저가 "멈춘" 웹페이지를 닫으라고 제안할 수도 있습니다.

다른 도메인으로 요청하거나 타임아웃을 지정하는 등 `XMLHttpRequest`의 많은 고급 기능은 동기 요청에서 사용할 수 없습니다. 또한 보시다시피 진행 상황 표시도 없습니다.

이런 이유로 동기 요청은 아주 드물게, 거의 쓰지 않습니다. 더 이상 다루지 않겠습니다.

## HTTP 헤더

`XMLHttpRequest`로 커스텀 헤더를 보내고 응답 헤더를 읽을 수 있습니다.

HTTP 헤더를 다루는 메서드는 세 가지입니다.

`setRequestHeader(name, value)`
: 주어진 `name`과 `value`로 요청 헤더를 설정합니다.

    예를 들어 다음과 같습니다.

    ```js
    xhr.setRequestHeader('Content-Type', 'application/json');
    ```

    ```warn header="헤더 제한"
    브라우저가 독점적으로 관리하는 헤더도 있습니다. 예를 들어 `Referer`, `Host`가 그렇습니다.
    전체 목록은 [명세](https://xhr.spec.whatwg.org/#the-setrequestheader()-method)에서 확인할 수 있습니다.

    사용자 안전과 요청의 정확성을 위해 `XMLHttpRequest`는 이런 헤더를 변경할 수 없습니다.
    ```

    ````warn header="헤더를 제거할 수 없습니다"
    `XMLHttpRequest`의 또 다른 특이점은 `setRequestHeader`를 되돌릴 수 없다는 것입니다.

    헤더는 한 번 설정하면 그대로 유지됩니다. 같은 헤더를 추가로 설정하면 기존 값을 덮어쓰지 않고 헤더 정보에 더해집니다.

    예를 들어 다음과 같습니다.

    ```js
    xhr.setRequestHeader('X-Auth', '123');
    xhr.setRequestHeader('X-Auth', '456');

    // 헤더는 다음처럼 됩니다.
    // X-Auth: 123, 456
    ```
    ````

`getResponseHeader(name)`
: 주어진 `name`의 응답 헤더를 가져옵니다(`Set-Cookie`와 `Set-Cookie2` 제외).

    예를 들어 다음과 같습니다.

    ```js
    xhr.getResponseHeader('Content-Type')
    ```

`getAllResponseHeaders()`
: `Set-Cookie`와 `Set-Cookie2`를 제외한 모든 응답 헤더를 반환합니다.

    헤더는 하나의 문자열로 반환됩니다. 예시는 다음과 같습니다.

    ```http
    Cache-Control: max-age=31536000
    Content-Length: 4260
    Content-Type: image/png
    Date: Sat, 08 Sep 2012 16:53:16 GMT
    ```

    헤더 사이의 줄 바꿈은 항상 `"\r\n"`입니다(OS와 무관). 따라서 개별 헤더로 쉽게 나눌 수 있습니다. 이름과 값 사이의 구분자는 항상 콜론 뒤에 공백이 붙은 `": "`입니다. 이는 명세에 고정되어 있습니다.

    따라서 이름/값 쌍을 가진 객체를 얻으려면 자바스크립트를 조금 사용해야 합니다.

    예를 들어 다음처럼 만들 수 있습니다(이름이 같은 헤더가 두 개 있으면 나중 헤더가 앞선 헤더를 덮어쓴다고 가정합니다).

    ```js
    let headers = xhr
      .getAllResponseHeaders()
      .split('\r\n')
      .reduce((result, current) => {
        let [name, value] = current.split(': ');
        result[name] = value;
        return result;
      }, {});

    // headers['Content-Type'] = 'image/png'
    ```

## POST, FormData

POST 요청을 보내려면 내장 [FormData](mdn:api/FormData) 객체를 사용할 수 있습니다.

문법은 다음과 같습니다.

```js
let formData = new FormData([form]); // 객체 생성, 선택적으로 <form>에서 채움
formData.append(name, value); // 필드 추가
```

객체를 만들고 선택적으로 폼에서 값을 채운 뒤, 필요하면 `append`로 필드를 더 추가합니다. 그런 다음 아래처럼 보냅니다.

1. `xhr.open('POST', ...)` – `POST` 메서드를 사용합니다.
2. `xhr.send(formData)`로 폼을 서버에 제출합니다.

예시는 다음과 같습니다.

```html run refresh
<form name="person">
  <input name="name" value="John">
  <input name="surname" value="Smith">
</form>

<script>
  // 폼에서 FormData를 미리 채웁니다
  let formData = new FormData(document.forms.person);

  // 필드 하나 더 추가
  formData.append("middle", "Lee");

  // 전송
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/article/xmlhttprequest/post/user");
  xhr.send(formData);

  xhr.onload = () => alert(xhr.response);
</script>
```

폼은 `multipart/form-data` 인코딩으로 전송됩니다.

또는 JSON이 더 좋다면 `JSON.stringify`로 문자열을 만들어 전송하면 됩니다.

다만 `Content-Type: application/json` 헤더를 설정하는 것을 잊지 마세요. 많은 서버 사이드 프레임워크가 이 헤더를 보고 JSON을 자동으로 디코딩합니다.

```js
let xhr = new XMLHttpRequest();

let json = JSON.stringify({
  name: "John",
  surname: "Smith"
});

xhr.open("POST", '/submit')
xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

xhr.send(json);
```

`.send(body)` 메서드는 꽤 범용적입니다. `Blob`과 `BufferSource` 객체를 포함해 거의 모든 `body`를 보낼 수 있습니다.

## 업로드 진행률

`progress` 이벤트는 다운로드 단계에서만 발생합니다.

즉, `POST`로 무언가를 보내면 `XMLHttpRequest`는 먼저 데이터(요청 본문)를 업로드하고, 그다음 응답을 다운로드합니다.

큰 데이터를 업로드하는 경우엔 업로드 진행률을 추적하는 데 더 관심이 있을 것입니다. 하지만 이때 `xhr.onprogress`는 도움이 되지 않습니다.

업로드 이벤트 추적 전용 객체인 `xhr.upload`가 따로 있습니다. 이 객체에는 메서드가 없습니다.

`xhr.upload`는 `xhr`과 비슷하게 이벤트를 생성하지만, 오직 업로드 중에만 이벤트를 발생시킵니다.

- `loadstart` -- 업로드가 시작됨.
- `progress` -- 업로드 중 주기적으로 발생함.
- `abort` -- 업로드가 중단됨.
- `error` -- HTTP와 무관한 에러.
- `load` -- 업로드가 성공적으로 완료됨.
- `timeout` -- 업로드 타임아웃(`timeout` 프로퍼티가 설정된 경우).
- `loadend` -- 성공이나 에러 여부와 관계없이 업로드가 끝남.

핸들러 예시는 다음과 같습니다.

```js
xhr.upload.onprogress = function(event) {
  alert(`${event.total} 바이트 중 ${event.loaded} 바이트 업로드됨`);
};

xhr.upload.onload = function() {
  alert(`업로드가 성공적으로 완료되었습니다.`);
};

xhr.upload.onerror = function() {
  alert(`업로드 중 에러 발생: ${xhr.status}`);
};
```

다음은 실제 예시입니다. 진행률 표시가 있는 파일 업로드입니다.

```html run
<input type="file" onchange="upload(this.files[0])">

<script>
function upload(file) {
  let xhr = new XMLHttpRequest();

  // 업로드 진행률 추적
*!*
  xhr.upload.onprogress = function(event) {
    console.log(`${event.total} 바이트 중 ${event.loaded} 바이트 업로드됨`);
  };
*/!*

  // 성공 여부와 관계없이 완료 추적
  xhr.onloadend = function() {
    if (xhr.status == 200) {
      console.log("성공");
    } else {
      console.log("에러 " + this.status);
    }
  };

  xhr.open("POST", "/article/xmlhttprequest/post/upload");
  xhr.send(file);
}
</script>
```

## 크로스 오리진 요청

`XMLHttpRequest`는 [fetch](info:fetch-crossorigin)와 같은 CORS 정책을 사용해 크로스 오리진 요청을 보낼 수 있습니다.

`fetch`와 마찬가지로 기본적으로 다른 오리진에 쿠키와 HTTP 인증 정보를 보내지 않습니다. 이를 활성화하려면 `xhr.withCredentials`를 `true`로 설정하세요.

```js
let xhr = new XMLHttpRequest();
*!*
xhr.withCredentials = true;
*/!*

xhr.open('POST', 'http://anywhere.com/request');
...
```

크로스 오리진 헤더에 대한 자세한 내용은 <info:fetch-crossorigin> 챕터를 참고하세요.


## 요약

`XMLHttpRequest`로 GET 요청을 보내는 일반적인 코드는 다음과 같습니다.

```js
let xhr = new XMLHttpRequest();

xhr.open('GET', '/my/url');

xhr.send();

xhr.onload = function() {
  if (xhr.status != 200) { // HTTP 에러?
    // 에러 처리
    alert( '에러: ' + xhr.status);
    return;
  }

  // xhr.response에서 응답 가져오기
};

xhr.onprogress = function(event) {
  // 진행 상황 보고
  alert(`${event.total} 바이트 중 ${event.loaded} 바이트 로드됨`);
};

xhr.onerror = function() {
  // HTTP와 무관한 에러 처리(예: 네트워크 끊김)
};
```

실제로는 이벤트가 더 많습니다. [최신 명세](https://xhr.spec.whatwg.org/#events)에는 수명 주기 순서대로 다음 이벤트가 나열되어 있습니다.

- `loadstart` -- 요청이 시작됨.
- `progress` -- 응답의 데이터 패킷이 도착함. 이 시점까지 받은 응답 본문 전체는 `response`에 들어 있음.
- `abort` -- `xhr.abort()` 호출로 요청이 취소됨.
- `error` -- 연결 에러가 발생함. 예: 잘못된 도메인 이름. 404 같은 HTTP 에러에서는 발생하지 않음.
- `load` -- 요청이 성공적으로 완료됨.
- `timeout` -- 타임아웃으로 요청이 취소됨(설정된 경우에만 발생).
- `loadend` -- `load`, `error`, `timeout`, `abort` 후 발생함.

`error`, `abort`, `timeout`, `load` 이벤트는 상호 배타적입니다. 이들 중 하나만 발생할 수 있습니다.

가장 자주 쓰는 이벤트는 로드 완료(`load`)와 로드 실패(`error`)입니다. 또는 단일 `loadend` 핸들러를 사용하고 요청 객체 `xhr`의 프로퍼티를 확인해 무슨 일이 일어났는지 판단할 수 있습니다.

`readystatechange`라는 이벤트도 이미 살펴봤습니다. 역사적으로 이 이벤트는 명세가 자리 잡기 전 오래전에 등장했습니다. 요즘은 사용할 필요가 없고, 더 새로운 이벤트로 대체할 수 있지만 오래된 스크립트에서는 자주 볼 수 있습니다.

업로드만 따로 추적해야 한다면 `xhr.upload` 객체에서 같은 이벤트를 감지하면 됩니다.
