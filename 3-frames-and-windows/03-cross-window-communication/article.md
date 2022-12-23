<!-- # Cross-window communication -->

# 크로스 윈도우 통신

"동일 출처"(같은 사이트) 정책은 윈도우와 프레임의 접근을 서로 제한합니다.

아이디어는 사용자가 `john-smith.com`과 `gmail.com` 두 사이트를 열어 놓은 경우, `gmail.com`로 부터 메일을 읽기 위해 `john-smith.com`에서 스크립트를 원하지 않는다는 것입니다. 따라서 "Same Origin" 정책의 목적은 정보 도용으로 부터 사용자를 보호하는 것입니다.

## 동일 출처 [#same-origin]

두 개의 URL이 동일한 프로토콜과 도메인 그리고 포트를 가진 경우, "Same Origin"을 갖는다고 말합니다.

다음 URL은 모두 동일 출처를 공유합니다.

- `http://site.com`
- `http://site.com/`
- `http://site.com/my/page.html`

다음 URL은 동일 출처를 공유하지 않습니다.

- <code>http://<b>www.</b>site.com</code> (another domain: `www.` matters)
- <code>http://<b>site.org</b></code> (another domain: `.org` matters)
- <code><b>https://</b>site.com</code> (another protocol: `https`)
- <code>http://site.com:<b>8080</b></code> (another port: `8080`)

"동일 출처" 정책은 다음과 같이 명시합니다.

- 예를 들어 `window.open`로 생성한 팝업이나 `<iframe>`안에 윈도우 또는 동일 출처에서의 윈도우처럼 다른 위도우에 대한 참조를 가지고 있는 경우, 해당 윈도우에 대한 전체 엑세스 권한을 가집니다.
- 윈도우가 다른 출처에서 온 경우 변수, 문서등 윈도우의 내용에 엑세스할 수 없습니다. 유일한 예외는 location입니다 : 우리는 그걸 바꿀 수 있다(그걸 바꾸면 유저가 재 연결된다.) 하지만 우리는 location을 읽을 수는 없다.(따라서 우리는 유저가 어디있는지 볼 수는 없습니다. 정보의 유출은 없습니다.)

### 실행 : iframe

`<iframe>` 태그는 별도의 `document`와 `window` 객체를 가진 구분된 임베디드 윈도우를 호스트합니다.

프로퍼티를 사용하여 윈도우에 접근할 수 있습니다.

- `<iframe>`내부의 윈도우를 가져오기 위한 `iframe.contentWindow`
- `<iframe>`내부의 문서를 가져오기 위한 `iframe.contentDocument`, `iframe.contentWindow.document`의 축약형입니다.

임베디드 윈도우 내부의 무언가에 접근할 때, 브라우저는 iframe이 동일 출처를 가지고 있는지 아닌지 확인합니다. iframe이 동일 출처를 갖고 있지 않는 경우 접근이 거부됩니다.(`location`에 쓰기는 예외이며 접근이 혀용됩니다.)

예로, 다른 출처에 대한 `<iframe>`에 읽기와 쓰기를 시도해봅시다.

```html run
<iframe src="https://example.com" id="iframe"></iframe>

<script>
    iframe.onload = function() {
      // 내부 윈도우에 대한 참조를 가질 수 있습니다.
  *!*
      let iframeWindow = iframe.contentWindow; // OK
  */!*
      try {
        // ... 하지만 문서 내부에 대한 것은 아닙니다.
  *!*
        let doc = iframe.contentDocument; // ERROR
  */!*
      } catch(e) {
        alert(e); // 보안 오류 (다른 출처)
      }

      // 또한 iframe 내부 페이지의 URL을 읽을 수 없습니다.
      try {
        // Location 객체로 부터 URL을 읽을 수 없습니다.
  *!*
        let href = iframe.contentWindow.location.href; // 오류
  */!*
      } catch(e) {
        alert(e); // 보안 오류
      }

      // ...we can WRITE into location (and thus load something else into the iframe)!
  *!*
      iframe.contentWindow.location = '/'; // OK
  */!*

      iframe.onload = null; // clear the handler, not to run it after the location change
    };
</script>
```

위의 코드는 다음 작업을 제외한 모든 작업에 대한 오류를 보여줍니다.

- 내부 윈도우 `iframe.contentWindow`로 참조를 가져오는 것은 허용됩니다.
- `location`에 쓰기

이와 반대로 `<iframe>`이 같은 출처를 가진다면 무엇이든 할 있습니다.

```html run
<!-- 동일 출처의 iframe -->
<iframe src="/" id="iframe"></iframe>

<script>
  iframe.onload = function () {
    // 다음과 같이 실행할 수 있다.
    iframe.contentDocument.body.prepend("Hello, world!");
  };
</script>
```

```
smart header="`iframe.onload`vs`iframe.contentWindow.onload`"
```

`<iframe>`태그에 있는 `iframe.onload` event는 임베디드된 윈도우 객체에 있는 `iframe.contentWindow.onload`과 본질적으로 같습니다. 그것은 window가 모든 자료들을 로드했을 때 시작합니다.

... 하지만 다른 출처의 iframe에 대해 `iframe.contentWindow.onload`에 접근할 수 없습니다. 그래서 `iframe.contentWindow`를 사용합니다.

## 하위 도메인의 윈도우들 : document.domain

정의에 따라, 다른 도메인을 가진 두 URL은 다른 출처를 가집니다.

예를 들어 `john.site.com`, `peter,site,com`에서 `site.com`를 공통 2차 도메인을 공유하는 것 같이 도메인들이 서로 같은 2차 도메인을 공유하는 경우, 크로스 윈도우 통신의 목적을 위해 "동일 출처"에서 온 것처럼 다뤄지도록 브라우저가 그 차이를 무시하도록 만들 수 있습니다.

동작되도록 만들기 위해, 각 윈도우에서 다음 코드를 실행해야 합니다.

```js
document.domain = "site.com";
```

이것이 전부입니다. 이제 그들은 제한없이 상호교환 할 수 있습니다. 다시 말해,
동일한 두 번째 수준 도메인이 있는 페이지에서만 가능합니다.

## Iframe: wrong document pitfall

iframe이 동일한 출처에서 제공되고 `document`에 액세스할 수 있는 경우 함정이 있습니다. 교차 출처와 관련이 없지만 아는 것이 중요합니다.

iframe이 생성되면 즉시 문서가 생성됩니다. 하지만 그 문서는 로드되는 문서와 다릅니다!

따라서 우리가 이 문서로 즉시 사용할 경우, 우리는 아마 실패할 것입니다.

다음을 봐보세요 :

```html run
<iframe src="/" id="iframe"></iframe>

<script>
    let oldDoc = iframe.contentDocument;
    iframe.onload = function() {
      let newDoc = iframe.contentDocument;
  *!*
      // load된 문서가 초기와 같지 않습니다!
      alert(oldDoc == newDoc); // 거짓
  */!*
    };
</script>
```

아직 로드되지 않은 iframe의 문서로 작업하면 안 됩니다. 왜냐하면 그것은 *잘못된 문서*이기 때문입니다. 이벤트 핸들러를 설정하면 무시됩니다.

어떻게 문서가 잘못된 곳에 있을 때를 탐지할 수 있을까요?

올바른 문서는 `iframe.onload`가 트리거될 때 위치합니다. 그러나 모든 리소스가 있는 전체 iframe이 로드될 때만 트리거됩니다.

`setInterval`에서 확인을 하여 그 순간을 더 일찍 알아차릴 수 있습니다.

```html run
<iframe src="/" id="iframe"></iframe>

<script>
  let oldDoc = iframe.contentDocument;

  // 100ms마다 document가 새로운 것인지 확인합니다
  let timer = setInterval(() => {
    let newDoc = iframe.contentDocument;
    if (newDoc == oldDoc) return;

    alert("New document is here!");

    clearInterval(timer); // 더 이상 필요하지 않기때문에 setInterval을 제거합니다.
  }, 100);
</script>
```

## Collection: window.frames

`<iframe>`의 윈도우 객체를 얻는 다른 방법은 `window.frames`컬랙션으로부터 얻는 것입니다.

- 숫자로 : `window.frames[0]` -- document안에 있는 첫 번째 frame의 window 객체
- 이름으로 : `window.frames.iframeName` -- `name="iframeName"`을 가진 frame의 window 객체

예를 들어:

```html run
<iframe src="/" style="height:80px" name="win" id="iframe"></iframe>

<script>
  alert(iframe.contentWindow == frames[0]); // true
  alert(iframe.contentWindow == frames.win); // true
</script>
```

iframe은 내부의 다른 iframe들을 가질 수도 있습니다. 해당 `window`객체들은 계층 구조를 형성합니다.

네비게이션 링크는 다음과 같습니다:

- `window.frames` -- "자식" window들의 모음
- `window.parent` -- "부모" window의 참조
- `window.top` -- 가장 위에 있는 부모 window의 참조

예를 들어:

```js run
window.frames[0].parent === window; // 참
```

프레임 내부에 현재 document가 열려있는 지 아닌지 확인하기 위해 `top`속성을 사용할 수 있습니다.

```js run
if (window == top) {
  // current window == window.top?
  alert("The script is in the topmost window, not in a frame");
} else {
  alert("The script runs in a frame!");
}
```

## "sandbox"iframe 속성

`sandbox` 속성은 신뢰할 수 없는 코드 실행을 방지하기 위해 `<iframe>` 내부의 특정 작업을 제외할 수 있습니다. iframe을 다른 출처에서 온 것으로 취급하거나 다른 제한을 적용하여 iframe을 "샌드박스"합니다.

`<iframe sandbox src="...">`에 적용되는 제한의 "기본 세트"가 있습니다. 그러나 `<iframe sandbox="allow-forms allow-popups">`와 같이 속성 값으로 적용되지 않아야 하는 제한 목록을 공백으로 구분하여 제공하면 완화될 수 있습니다.

즉, 빈 `"sandbox"` 속성은 가능한 가장 엄격한 제한을 두지만 제거하려는 항목의 공백으로 구분된 목록을 넣을 수 있습니다.

다음은 제한 사항 목록입니다.

`allow-same-origin`
: 기본적으로 `"sandbox"`는 iframe에 대해 "다른 원본" 정책을 적용합니다. 즉, `src`가 동일한 사이트를 가리키더라도 브라우저가 `iframe`을 다른 출처에서 온 것으로 취급하도록 합니다. 스크립트에 대한 모든 묵시적 제한이 있습니다. 이 옵션은 해당 기능을 제거합니다.

`allow-top-navigation`
: `iframe`이 `parent.location`으로 바꾸도록 허용합니다.

`allow-forms`
: `iframe`에서 양식을 제출할 수 있습니다.

`allow-scripts`
: `iframe`에서 스크립트를 실행할 수 있습니다.

`allow-popups`
: `iframe`에서 `window.open` 팝업을 허용합니다.

아래 예는 기본 제한 세트가 있는 샌드박스 iframe을 보여줍니다: `<iframe sandbox src="...">`. JavaScript와 양식이 있습니다.

아무것도 작동하지 않습니다. 따라서 기본 세트는 정말 가혹합니다.

```
[codetabs src="sandbox" height=140]
```

`"sandbox"` 속성의 목적은 더 많은 제한을 추가하는 것뿐입니다. 제거할 수 없습니다. 특히 iframe이 다른 출처에서 온 경우 동일 출처 제한을 완화할 수 없습니다.

## Cross-window 메시지

`postMessage` 인터페이스를 사용하면 윈도우가 어디에서 왔는지에 관계없이 서로 대화할 수 있습니다.

따라서 "Same Origin" 정책을 우회하는 방법입니다. 이는 `john-smith.com`의 창이 `gmail.com`과 대화하고 정보를 교환할 수 있도록 허용하지만 둘 다 동의하고 해당 JavaScript 함수를 호출하는 경우에만 가능합니다. 그것은 사용자에게 안전합니다.

인터페이스에는 두 부분이 있습니다.

### post 메시지

메시지를 보내고자 하는 윈도우는 수신 윈도우의 [postMessage](mdn:api/Window.postMessage) 메소드를 호출합니다. 즉, `win`에게 메시지를 보내려면 `win.postMessage(data, targetOrigin)`을 호출해야 합니다.

인수:

`data`
: 보낼 데이터. 모든 개체가 될 수 있으며 데이터는 "구조적 복제 알고리즘"을 사용하여 복제됩니다. IE는 문자열만 지원하므로 해당 브라우저를 지원하려면 복잡한 개체를 `JSON.stringify`해야 합니다.

`targetOrigin`
: 대상 창의 출처를 지정하여 지정된 출처의 창만 메시지를 받도록 합니다.

`targetOrigin`은 안전 조치입니다. 대상 창이 다른 출처에서 온 경우 발신자 창에서 '위치'를 읽을 수 없습니다. 따라서 우리는 현재 어떤 사이트가 의도한 창에 열려 있는지 확신할 수 없습니다. 사용자는 다른 곳으로 이동할 수 있고 발신자 창은 그것에 대해 전혀 모릅니다.

`targetOrigin`을 지정하면 윈도우가 여전히 올바른 사이트에 있는 경우에만 데이터를 수신합니다. 데이터가 민감한 경우 중요합니다.

예를 들어 여기서 `win`은 원본 `http://example.com`의 문서가 있는 경우에만 메시지를 수신합니다.

```html no-beautify
<iframe src="http://example.com" name="example">
  <script>
    let win = window.frames.example;

    win.postMessage("message", "http://example.com");
  </script></iframe
>
```

검사를 원하지 않으면 `targetOrigin`을 `*`로 설정할 수 있습니다.

```html no-beautify
<iframe src="http://example.com" name="example">
  <script>
      let win = window.frames.example;

    *!*
      win.postMessage("message", "*");
    */!*
  </script></iframe
>
```

### onmessage

메시지를 받으려면 대상 창에 `message` 이벤트에 대한 핸들러가 있어야 합니다. `postMessage`가 호출되고 `targetOrigin` 검사가 성공하면 트리거됩니다.

이벤트 개체에는 다음과 같은 특수 속성이 있습니다.

`data`
: `postMessage`의 데이터입니다.

`origin`
: 발신자의 출처(예: `http://javascript.info`).

`source`
: 발신자 창에 대한 참조입니다. 원한다면 즉시 `source.postMessage(...)`로 되돌릴 수 있습니다.

해당 처리기를 할당하려면 `addEventListener`를 사용해야 합니다. 짧은 구문인 `window.onmessage`는 작동하지 않습니다.

예를 들면 다음과 같습니다.

```js
window.addEventListener("message", function (event) {
  if (event.origin != "http://javascript.info") {
    // 알 수 없는 도메인의 것들은 무시합니다.
    return;
  }

  alert("received: " + event.data);

  // event.source.postMessage(...)를 사용하여 다시 메시지를 보낼 수 있습니다.
});
```

전체 예:

[codetabs src="postmessage" height=120]

## 요약

메서드를 호출하고 다른 창의 콘텐츠에 액세스하려면 먼저 해당 창에 대한 참조가 있어야 합니다.

팝업의 경우 다음 참조가 있습니다.

- 오프너 창에서: `window.open` -- 새 창을 열고 이에 대한 참조를 반환합니다.
- 팝업에서: `window.opener` -- 팝업에서 오프너 창에 대한 참조입니다.

iframe의 경우 다음을 사용하여 부모/자식 창에 액세스할 수 있습니다.

- `window.frames` -- 중첩된 창 개체의 컬렉션,
- `window.parent`, `window.top`은 상위 및 상위 창에 대한 참조입니다.
- `iframe.contentWindow`는 `<iframe>` 태그 안에 있는 창입니다.

윈도우가 동일한 출처(호스트, 포트, 프로토콜)를 공유하는 경우 윈도우는 서로 원하는 모든 작업을 수행할 수 있습니다.

그렇지 않으면 가능한 동작은 다음과 같습니다.

- 다른 창의 `위치`를 변경합니다(쓰기 전용 액세스).
- 그것에 메시지를 게시하십시오.

예외는 다음과 같습니다:

- 동일한 두 번째 수준 도메인인 `a.site.com` 및 `b.site.com`을 공유하는 Windows. 그런 다음 둘 다 `document.domain='site.com'`을 설정하면 "동일한 출처" 상태가 됩니다.
- iframe에 `sandbox` 속성이 있는 경우 속성 값에 `allow-same-origin`이 지정되지 않는 한 "다른 출처" 상태로 강제 전환됩니다. 동일한 사이트의 iframe에서 신뢰할 수 없는 코드를 실행하는 데 사용할 수 있습니다.

`postMessage` 인터페이스를 사용하면 모든 출처를 가진 두 개의 창이 대화할 수 있습니다.

1. 발신자는 `targetWin.postMessage(data, targetOrigin)`을 호출합니다.
2. `targetOrigin`이 `'*'`이 아니면 브라우저는 `targetWin` 창에 `targetOrigin`이 있는지 확인합니다.
3. 그렇다면 `targetWin`은 특수 속성을 사용하여 `message` 이벤트를 트리거합니다.

   - `origin` -- 발신자 창의 출처(예: `http://my.site.com`)
   - `source` -- 보낸 사람 창에 대한 참조입니다.
   - `data` -- 문자열만 지원하는 IE를 제외한 모든 개체, 데이터.

   대상 창 내에서 이 이벤트에 대한 핸들러를 설정하려면 `addEventListener`를 사용해야 합니다.
