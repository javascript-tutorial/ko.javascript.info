# DOMContentLoaded, load, beforeunload, unload 이벤트

HTML 문서의 생명주기엔 다음과 같은 3가지 주요 이벤트가 관여합니다.

- `DOMContentLoaded` -- 브라우저가 HTML을 전부 읽고 DOM 트리를 완성하는 즉시 발생합니다. 이미지 파일(`<img>`)이나 스타일시트 등의 기타 자원은 기다리지 않습니다.
- `load` -- HTML로 DOM 트리를 만드는 게 완성되었을 뿐만 아니라 이미지, 스타일시트 같은 외부 자원도 모두 불러오는 것이 끝났을 때 발생합니다.
- `beforeunload/unload` -- 사용자가 페이지를 떠날 때 발생합니다.

세 이벤트는 다음과 같은 상황에서 활용할 수 있습니다.

- `DOMContentLoaded` -- DOM이 준비된 것을 확인한 후 원하는 DOM 노드를 찾아 핸들러를 등록해 인터페이스를 초기화할 때
- `load` -- 이미지 사이즈를 확인할 때 등. 외부 자원이 로드된 후이기 때문에 스타일이 적용된 상태이므로 화면에 뿌려지는 요소의 실제 크기를 확인할 수 있음
- `beforeunload` -- 사용자가 사이트를 떠나려 할 때, 변경되지 않은 사항들을 저장했는지 확인시켜줄 때
- `unload` -- 사용자가 진짜 떠나기 전에 사용자 분석 정보를 담은 통계자료를 전송하고자 할 때

이제 각 이벤트에 대하여 자세히 살펴보도록 합시다.

## DOMContentLoaded

`DOMContentLoaded` 이벤트는 `document` 객체에서 발생합니다.

따라서 이 이벤트를 다루려면 `addEventListener`를 사용해야 합니다.

```js
document.addEventListener("DOMContentLoaded", ready);
// "document.onDOMContentLoaded = ..."는 동작하지 않습니다.
```

예시:

```html run height=200 refresh
<script>
  function ready() {
    alert('DOM이 준비되었습니다!');

    // 이미지가 로드되지 않은 상태이기 때문에 사이즈는 0x0입니다.
    alert(`이미지 사이즈: ${img.offsetWidth}x${img.offsetHeight}`);
  }

*!*
  document.addEventListener("DOMContentLoaded", ready);
*/!*
</script>

<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

위 예시에서 `DOMContentLoaded` 핸들러는 문서가 로드되었을 때 실행됩니다. 따라서 핸들러 아래쪽에 위치한 `<img>`뿐만 아니라 모든 요소에 접근할 수 있습니다.

그렇지만 이미지가 로드되는 것은 기다리지 않기 때문에 `alert` 창엔 이미지 사이즈가 0이라고 뜹니다. 

처음 `DOMContentLoaded` 이벤트를 접하면 그다지 복잡하지 않은 이벤트라는 생각이 듭니다. "DOM 트리가 완성되면 `DOMContentLoaded` 이벤트가 발생한다"라고 생각하기 때문이죠. 그런데 `DOMContentLoaded`에는 몇 가지 특이사항이 있습니다.

### DOMContentLoaded와 scripts

브라우저는 HTML 문서를 처리하는 도중에 `<script>` 태그를 만나면, DOM 트리 구성을 멈추고 `<script>`를 실행합니다. 스크립트실행이 끝난 후에야 나머지 HTML 문서를 처리하죠. `<script>`에 있는 스크립트가 DOM 조작 관련 로직을 담고 있을 수 있기 때문에 이런 방지책이 만들어 졌습니다. 따라서 `DOMContentLoaded` 이벤트 역시 `<script>` 안에있는 스크립트가 처리고 난 후에 발생합니다.

예시를 통해 이를 살펴봅시다.

```html run
<script>
  document.addEventListener("DOMContentLoaded", () => {
    alert("DOM이 준비되었습니다!");
  });
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash.js"></script>

<script>
  alert("라이브러리 로딩이 끝나고 인라인 스크립트가 실행되었습니다.");
</script>
```

예시를 실행하면 "라이브러리 로딩이 끝나고..."가 먼저 보인 후 "DOM이 준비되었습니다!"가 출력되는 것을 확인할 수 있습니다. 스크립트가 모두 실행되고 난 후에야 `DOMContentLoaded` 이벤트가 발생한 것이죠.

```warn header="DOMContentLoaded를 막지 않는 스크립트"
위와 같은 규칙엔 두 가지 예외사항이 있습니다.
1. `async` 속성이 있는 스크립트는 `DOMContentLoaded`를 막지 않습니다. [`async` 속성](info:script-async-defer)에 대해선 곧 학습할 예정입니다.
2. `document.createElement('script')`로 동적으로 생성되고 웹페이지에 추가된 스크립트는 `DOMContentLoaded`를 막지 않습니다.
```

### DOMContentLoaded와 styles

외부 스타일시트는 DOM에 영향을 주지 않기 때문에 `DOMContentLoaded`는 외부 스타일시트가 로드되기를 기다리지 않습니다. 

그런데 한 가지 예외가 있습니다. 스타일시트를 불러오는 태그 바로 다음에 스크립트가 위치하면 이 스크립트는 스타일시트가 로드되기 전까지 실행되지 않습니다.

```html run
<link type="text/css" rel="stylesheet" href="style.css">
<script>
  // 이 스크립트는 위 스타일시트가 로드될 때까지 실행되지 않습니다.
  alert(getComputedStyle(document.body).marginTop);
</script>
```

이런 예외는 스크립트에서 스타일에 영향을 받는 요소의 프로퍼티를 사용할 가능성이 있기 때문에 만들어졌습니다. 위 예시에선 스크립트에서 요소의 좌표 정보를 사용하고 있네요. 스타일이 로드되고, 적용되고 난 다음에야 좌표 정보가 확정되기 때문에 자연스레 이런 제약이 생겼습니다.

`DOMContentLoaded`는 스크립트가 로드되길 기다립니다. 위의 경우라면 당연히 스타일시트 역시 기다리게 됩니다.

### 브라우저 내장 자동완성

Firefox와 Chrome, Opera의 폼 자동완성(form autofill)은 `DOMContentLoaded`에서 일어납니다.

페이지에 아이디와 비밀번호를 적는 폼이 있고, 브라우저에 아이디, 비밀번호 정보가 저장되어 있다면 `DOMContentLoaded` 이벤트가 발생할 때 인증 정보가 자동으로 채워집니다. 물론 사용자가 자동 완성을 허용했을 때 그렇겠죠. 

따라서 실행해야 할 스크립트가 길어서 `DOMContentLoaded` 이벤트가 지연된다면 자동완성 역시 뒤늦게 처리됩니다. 브라우저 자동 완성 기능을 켜 놓은 사용자라면 특정 사이트에서 자동 완성이 늦게 처리되는 걸 경험 해 보셨을 겁니다. 이런 사이트에선 페이지 로딩이 다 끝난 후에야 아이디나 패스워드 같은 브라우저에 저장한 정보가 폼에 뜨죠. 이런 지연이 발생하는 이유는 `DOMContentLoaded` 이벤트가 실행되는 시점 때문입니다.


## window.onload [#window-onload]

`window` 객체의 `load` 이벤트는 스타일, 이미지 등의 리소스들이 모두 로드되었을 때 실행됩니다. `load` 이벤트는 `onload` 프로퍼티를 통해서도 사용할 수 있습니다.

아래 예시에서 `window.onload`는 이미지가 모두 로드되고 난 후 실행되기 때문에 이미지 사이즈가 제대로 출력되는 것을 확인할 수 있습니다. 

```html run height=200 refresh
<script>
  window.onload = function() { // window.addEventListener('load', (event) => {와 동일합니다.
    alert('페이지 전체가 로드되었습니다.');

    // 이번엔 이미지가 제대로 불러와 진 후에 얼럿창이 실행됩니다.
    alert(`이미지 사이즈: ${img.offsetWidth}x${img.offsetHeight}`);
  };
</script>

<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

## window.onunload

`window` 객체의 `unload` 이벤트는 사용자가 페이지를 떠날 때, 즉 문서를 완전히 닫을 때 실행됩니다. `unload` 이벤트에선 팝업창을 닫는 것과 같은 딜레이가 없는 작업을 수행할 수 있습니다.

그런데 분석 정보를 보내는 것은 예외사항에 속합니다.

사용자가 웹사이트에서 어떤 행동을 하는지에 대한 분석 정보를 모으고 있다고 가정해봅시다.

`unload` 이벤트는 사용자가 페이지를 떠날 때 발생하므로 자연스럽게 `unload` 이벤트에서 분석 정보를 서버로 보내는 게 어떨까 하는 생각이 드네요.

메서드 `navigator.sendBeacon(url, data)`은 바로 이런 용도를 위해 만들어졌습니다. 메서드에 대한 자세한 설명은 <https://w3c.github.io/beacon/>에서 찾아볼 수 있습니다.

`sendBeacon`는 데이터를 백그라운드에서 전송합니다. 다른 페이지로 전환시 분석 정보는 제대로 서버에 전송되지만, 딜레이가 없는 것은 바로 이 때문입니다.  

`sendBeacon`은 다음과 같이 사용할 수 있습니다.
```js
let analyticsData = { /* 분석 정보가 담긴 객체 */ };

window.addEventListener("unload", function() {
  navigator.sendBeacon("/analytics", JSON.stringify(analyticsData));
};
```

- 요청은 POST 메서드로 전송됩니다.
- 요청 시 문자열뿐만 아니라 폼이나 <info:fetch>에서 설명하는 기타 포맷들도 보낼 수 있습니다. 대개는 문자열 형태의 객체가 전송됩니다.
- 전송 데이터는 64kb를 넘을 수 없습니다.

`sendBeacon` 요청이 종료된 시점엔 브라우저가 다른 페이지로 전환을 마친 상태일 확률이 높습니다. 따라서 서버 응답을 받을 수 있는 방법이 없죠. 사용자 분석 정보에 관한 응답은 대개 빈 상태입니다.

[fetch](info:fetch) 메서드는 '페이지를 떠난 후'에도 요청이 가능하도록 해주는 플래그 `keepalive`를 지원합니다. 자세한 내용은 <info:fetch-api>에서 확인해보세요.


한편, 다른 페이지로 전환 중에 이를 취소하고 싶은 경우가 생기곤 합니다. `unload`에선 페이지 전환을 취소할 수 없고 `onbeforeunload`를 사용하면 가능합니다.

## window.onbeforeunload [#window.onbeforeunload]

사용자가 현재 페이지를 떠나 다른 페이지로 이동하려 할 때나 창을 닫으려고 할 때 `beforeunload` 핸들러에서 추가 확인을 요청할 수 있습니다.

`beforeunload` 이벤트를 취소하려 하면 브라우저는 사용자에게 확인을 요청합니다.

아래 예시를 실행하고, 브라우저에서 새로 고침을 해 직접 확인해봅시다.

```js run
window.onbeforeunload = function() {
  return false;
};
```

`false`말고도 비어있지 않은 문자열을 반환하면 이벤트를 취소한 것과 같은 효과를 볼 수 있는데, 이는 역사적인 이유 때문에 남아있는 기능입니다. 과거엔 문자열을 반환하면 브라우저에서 이 문자열을 보여줬었는데, [근래의 명세서](https://html.spec.whatwg.org/#unloading-documents)에선 이를 권장하지 않습니다.

예시를 살펴봅시다.

```js run
window.onbeforeunload = function() {
  return "저장되지 않은 변경사항이 있습니다. 정말 페이지를 떠나실 건 가요?";
};
```

이렇게 문자열을 반환하도록 해도 얼럿창에 문자열이 보이지 않게 된 이유는 몇몇 사이트 관리자들이 오해가 생길 법하거나 성가신 메시지를 띄우면서 `beforeunload`를 남용했기 때문입니다. 오래된 브라우저에서 위 예시를 실행하고 새로 고침을 누르면 "저장되지 않은..." 메시지가 뜨긴 합니다. 하지만 모던 브라우저에선 `beforeunload` 이벤트를 취소할 때 보이는 메시지를 커스터마이징 할 수 없습니다.

## readyState

문서가 완전히 로드된 후에 `DOMContentLoaded` 핸들러를 설정하면 어떤 일이 발생할까요?

아마도 절대 실행되지 않을 겁니다.

그런데 가끔은 문서가 로드되었는지 아닌지를 판단할 수 없는 경우가 있습니다. DOM이 완전히 구성된 후에 특정 함수를 실행해야 할 때는 DOM 트리 완성 여부를 알 수 없어 조금 난감하죠. 

이럴 때 현재 로딩 상태를 알려주는 `document.readyState` 프로퍼티를 사용할 수 있습니다.

프로퍼티의 값은 세 종류가 있습니다.

- `"loading"` -- 문서를 불러오는 중일 때
- `"interactive"` -- 문서가 완전히 불러와졌을 때
- `"complete"` -- 문서를 비롯한 이미지 등의 리소스들도 모두 불러와졌을 때

우리는 `document.readyState`의 값을 확인하고 상황에 맞게 핸들러를 설정하거나 코드를 실행하면 됩니다.

예시:

```js
function work() { /*...*/ }

if (document.readyState == 'loading') {
  // 아직 로딩 중이므로 이벤트를 기다립니다.
  document.addEventListener('DOMContentLoaded', work);
} else {
  // DOM이 완성되었습니다!
  work();
}
```

이 외에도 상태가 변경되었을 때 실행되는 이벤트 `readystatechange`를 사용하면 상태에 맞게 원하는 작업을 할 수 있습니다. 개발자 도구의 콘솔창을 열고 아래 예시를 실행해 상태 변화를 직접 출력해봅시다.

```js run
// 현재 상태
console.log(document.readyState);

// 상태 변경 출력
document.addEventListener('readystatechange', () => console.log(document.readyState));
```

이렇게 아주 오래전부터 있었던 `readystatechange` 이벤트라는 대안을 사용해도 문서 로딩 상태를 파악할 수 있습니다. 그런데 이 이벤트는 요즘엔 잘 사용하지 않습니다.

이제 마무리로 지금까지 배운 이벤트들의 순서에 대해 정리해봅시다.

아래 예시엔 이벤트를 로깅하는 `<iframe>`과 `<img>`를 비롯한 여러 이벤트 핸들러가 있습니다.

```html
<script>
  log('초기 readyState:' + document.readyState);

  document.addEventListener('readystatechange', () => log('readyState:' + document.readyState));
  document.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded'));

  window.onload = () => log('window onload');
</script>

<iframe src="iframe.html" onload="log('iframe onload')"></iframe>

<img src="http://en.js.cx/clipart/train.gif" id="img">
<script>
  img.onload = () => log('img onload');
</script>
```

[샌드박스](sandbox:readystate)를 열어 직접 예시를 실행해보세요.

실행 결과는 다음과 같습니다.
1. [1] initial readyState:loading
2. [2] readyState:interactive
3. [2] DOMContentLoaded
4. [3] iframe onload
5. [4] img onload
6. [4] readyState:complete
7. [4] window onload

대괄호 안에 있는 숫자는 실제 해당 로그가 출력되기까지 걸린 시간을 나타냅니다. 같은 숫자는 1 미리 초 오차 범위 내에서 동시에 실행된 이벤트라는 것을 의미합니다.

- `document.readyState`는 `DOMContentLoaded`가 실행되기 바로 직전에 `interactive`가 됩니다. 따라서 `DOMContentLoaded`와 `interactive`는 같은 상태를 나타낸다고 볼 수 있습니다.
- `document.readyState`는 `iframe`, `img`를 비롯한 리소스 전부가 로드되었을 때 `complete`가 됩니다. 위 예시에서 우리는 `readyState`의 값이 `img.onload`와 `window.onload`가 실행된 시점과 거의 동일한 시점에 `complete`로 바뀌었다는 것을 확인할 수 있습니다. `readyState`의 값이 `complete`로 바뀐다는 것은 `window.onload`가 실행된다는 것과 동일한 의미입니다. 이 둘의 차이점은 `window.onload`는 다른 `load` 핸들러가 전부 실행된 후에야 동작한다는 것에 있습니다.


## 요약

페이지 로드 관련 이벤트는 다음과 같습니다.

- `DOMContentLoaded` -- DOM 구성이 완료되었을 때 `document` 객체에서 실행됩니다. 자바스크립트를 사용해 요소를 조작하는 것은 이 이벤트가 실행된 후입니다.
  - `<script>...</script>`나 `<script src="..."></script>`를 사용해 삽입한 스크립트는 DOMContentLoaded가 실행되는 것을 막습니다. 브라우저는 이 스크립트가 실행되길 기다립니다.
  - `DOMContentLoaded`는 실행되어도 이미지를 비롯한 기타 리소스들은 여전히 로드 중일 수 있습니다.
- `load` -- 페이지를 비롯한 이미지 등의 자원 전부가 모두 불러와졌을 때 `window` 객체에서 실행됩니다. 모든 자원이 로드되는 걸 기다리기에는 시간이 오래 걸릴 수 있으므로 이 이벤트는 잘 사용되지 않습니다.
- `beforeunload` -- 사용자가 페이지를 떠나려 할 때 `window` 객체에서 발생합니다. 이 이벤트를 취소하려 하면 브라우저는 사용자에게 "we have unsaved changes..."등의 메시지를 띄워 정말 페이지를 떠날 건지 물어봅니다.
- `unload` -- 사용자가 최종적으로 사이트를 떠날 때 `window` 객체에서 발생합니다. `unload` 이벤트 핸들러에선 지연을 유발하는 복잡한 작업이나 사용자와의 상호작용은 할 수 없습니다. 이 제약사항 때문에 `unload` 이벤트는 아주 드물게 사용됩니다. 하지만 예외적으로 `navigator.sendBeacon`을 사용해 네트워크 요청을 보낼 수 있습니다.
- `document.readyState` -- 문서의 현재 상태를 나타내줍니다. `readystatechange` 이벤트를 사용하면 변화를 추적할 수 있습니다.
  - `loading` -- 문서를 불러오는 중일 때
  - `interactive` -- 문서가 완전히 불러와졌을 때. `DOMContentLoaded`가 실행되기 바로 직전에 해당 값으로 변경됩니다.
  - `complete` -- 문서를 비롯한 이미지 등의 리소스들도 모두 불러와졌을 때. `window.onload`가 실행되기 바로 직전에 해당 값으로 변경됩니다.
