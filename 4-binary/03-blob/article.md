# Blob

`ArrayBuffer` 와  뷰(views)는 자바스크립트의 한 부분으로써 ECMA 표준입니다.

브라우저에는 뷰와 더불어 [File API](https://www.w3.org/TR/FileAPI/)에서 설명하고 있는 고차(higher-level) 객체가 존재합니다. 존재하는 여러 고차 객체 중 이 페이지에서는 `Blob`에 대해서 설명할 것입니다.

`Blob`은 부가적인 문자형(대부분 MIME 타입)과 `blobParts`을 갖고 있습니다. `blobParts`로는 일련의 `Blob` 객체, 문자열, 그리고 `BufferSource`가 있습니다. 

![](blob.svg)

생성자 문법은 다음과 같습니다:

```js
new Blob(blobParts, options);
```

- **`blobParts`** 는 `Blob`/`BufferSource`/`String`으로 이루어진 배열입니다.
- **`options`** 부가적인 인수(객체):
  - **`type`** -- `Blob`의 타입(대부분 MIME 타입)을 의미합니다. (예: `image/png`),
  - **`endings`** -- 현재 사용하고 있는 OS에 알맞은 EOL(end-of-line), 줄 바꿈 문자(`\r\n` 또는`\n`)의 변경 여부를 의미합니다. 기본값으로는 `"transparent"` (아무것도 안 함)이며, `"native"` 옵션을 통해 자동으로 바꾸도록 할 수 있습니다.

예를 들어 :

```js
// 문자열로부터 Blob 생성하기
let blob = new Blob(["<html>…</html>"], {type: 'text/html'});
// 알아두세요! 첫 번째 인수는 배열(array) [...] 이어야 합니다
```

```js
// 타입이 지정된 배열(array)과 문자열로 Blob 생성하기
let hello = new Uint8Array([72, 101, 108, 108, 111]); // 바이너리 형식의 "Hello"입니다(아스키코드 값)

let blob = new Blob([hello, ' ', 'world'], {type: 'text/plain'});
```


다음과 같이 `Blob` 객체를 슬라이스(slice) 함으로써 일부를 추출할 수 있습니다:

```js
blob.slice([byteStart], [byteEnd], [contentType]);
```

- **`byteStart`** -- 기본값은 0이며, 시작하는 바이트를 의미합니다.
- **`byteEnd`** -- 기본값은 파일의 끝이며, 마지막 바이트를 의미합니다.
- **`contentType`** -- 기본값으로는 소스 파일의 타입과 동일하며, 새로 만들어질 Blob의 타입을 의미합니다.

인수는 `array.slice` 메서드와 유사하며, 음수도 인수로 사용할 수 있습니다.

```smart header="`Blob` 객체는 불변입니다"
`Blob`의 데이터를 수정할 수 없지만, `Blob`을 필요한 부분을 슬라이스를 하여, 새로운 `Blob` 객체를 따로 만든다거나, 또 다른 `Blob`에 추가할 수 있습니다.

이런 특징은 자바스크립트의 문자열과 유사합니다 : 문자열의 문자를 수정할 수 없지만, 수정된 문자열을 새로 만들 수 있듯이 말이죠.
``` 

## Blob을 URL처럼 사용하기

Blob은 URL과 같이 사용될 수 있어 `<a>`, `<img>`, 등 태그에서 컨텐츠를 보여줄 수 있습니다.

Blob의 `타입` 속성 덕분에 `Blob` 객체를 다운로드/업로드 할 수 있으며, 네트워크 요청이 있을 때 자연스럽게 `타입`은 `Content-Type`으로 사용됩니다.

간단한 예시를 통해서 알아볼까요? 링크를 클릭해서 `hello world`가 포함된 파일을 동적으로 생성된(dynamically-generated) `Blob`을 다운로드 할 수 있습니다.

```html run
<!--다운로드 속성은 브라우저에게 하여금 네비게이팅 대신 다운로드를 강제합니다-->
<a download="hello.txt" href='#' id="link">Download</a>

<script>
let blob = new Blob(["Hello, world!"], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);
</script>
```

자바스크립트로 동적인 링크를 만들어 `link.click()`을 통해 다운로드를 자동으로 시작하게 하는 클릭 이벤트를 재연할 수 있습니다.

다음은 사용자가, HTML 없이, 동적으로 생성된 `Blob`을 다운로드할 수 있는 위 예시와 비슷한 코드입니다 : 

```js run
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);

link.click();

URL.revokeObjectURL(link.href);
```

`URL.createObjectURL` 메서드가 `Blob`을 인자로 받고 이에 해당하는 고유한 URL을 다음과 같은 형식으로 생성합니다 : `blob:<origin>/<uuid>`.

위 예시 코드에서 `link.href`의 값은 다음과 같이 생겼습니다 : 

```
blob:https://javascript.info/1e67e00e-860d-40a5-89ae-6ab0cbee6273
```

`URL.createObjectURL`을 통해 생성된 URL은 브라우저가 내부적으로 URL -> `Blob` 매핑(mapping)을 거쳐 저장합니다. 그래서 만들어진 URL이 짧음에도 불구하고 `Blob`에 접근이 가능합니다.

생성된 URL(그리고 생성된 링크를 포함해서)은 현재 열린 document에서만 유효합니다. 그리고 일반적으로 URL을 요구하는 `<img>`, `<a>`, 등 다른 태그에서도 `Blob`을 참조하는 것이 가능합니다.

하지만 `Blob`에는 장점만 있는 것이 아닙니다. 매핑된 `Blob`은 브라우저가 직접 메모리를 해제할 수 없습니다.

매핑된 메모리는 document를 언로드(unload)될 때 해제됩니다. 하지만, 웹 앱이 지속적해서 유지되는 경우(예 : SPA,singal-page-app) 메모리는 계속 해제되지 않습니다.

**그래서 `Blob`을 통해 URL을 만들면, 사용하지 않아도, 메모리를 계속 점유하고 있을 겁니다**

`URL.revokeObjectURL(url)` 메서드는 내부 매핑에서 참조를 제거함으로써 `Blob`이 메모리에서 해제될 수 있도록 합니다.

방금 위에서 본 예시에서 `Blob`을 일회성으로 사용하게끔 의도를 했습니다. 그래서 링크를 클릭한 후(`link.click()`) 즉시 `URL.revokeObjectURL(link.href)`를 호출했습니다.

이와 달리, 앞에서 다룬 클릭 가능한 HTML 링크 예시의 경우, `URL.revokeObjectURL(link.href)`를 호출하지 않았습니다. 매핑이 제거됨으로써 `Blob` URL 링크가 무의미해지기 때문입니다. 

## Blob을 base64로 변환하기

`URL.createObjectURL`의 대안으로는 `Blob`을 base64 인코딩을 기반한 문자열로 바꾸는 방법이 있습니다.

base64 인코딩은 아스키 코드(0~64)로 만든 안전하고 "읽을 수 있는" 문자열로 된 이진 자료형을 의미합니다. 이 특징을 이용해 "data-urls"를 인코딩을 할 수 있습니다.

[data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)은 `데이터:[<mediatype>][;base64],<데이터>` 형식으로 이루어져 있습니다. 이렇게 만들어진 URL은 "일반적인" URL과 같이 어디에서나 사용할 수 있습니다.

예를 들어 웃는 이모티콘을 base64 인코딩된 URL을 나타내면 다음과 같습니다 :  

```html
<img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">
```

브라우저는 이 문자열을 디코딩하고 난 뒤 다음과 같은 이미지를 보여줄 것입니다 : <img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">


`Blob`을 base64로 변환하는 방법으로 내장된 `FileReader` 객체를 이용할 것입니다. `FileReader` 객체는 Blob을 다양한 포맷으로 데이터를 읽을 수 있으며, [다음 장에서](info:file)에서 좀 더 깊게 다뤄보겠습니다.

다음은 base-64를 통해 Blob을 다운로드하는 데모입니다 : 

```js run
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

*!*
let reader = new FileReader();
reader.readAsDataURL(blob); // Blob을 base64로 변환하고 onload 메서드를 호출합니다
*/!*

reader.onload = function() {
  link.href = reader.result; // data url
  link.click();
};
```

`Blob`을 URL로 만드는 두 가지 방법, `URL.createObjectURL(blob)`과 `FileReader.readAsDataURL(blob)`, 모두 사용할 수 있지만 `URL.createObjectURL(blob)`이 더 간단하고 빠릅니다.

```compare title-plus="URL.createObjectURL(blob)" title-minus="Blob을 data url로 만들기"
+ 메모리를 관리하기 위해 직접 해제를 해야 함.
+ Blob에 직접 접근 할 수 있음, 인코딩/디코딩 과정 필요 없음
- 메모리를 브라우저에서 관리해줄 수 있음.
- `Blob` 객체의 크기가 매우 큰 경우 인코딩 과정으로 인해 성능과 메모리 측면에서 손해가 발생함.
```

## 이미지를 Blob으로 바꾸기

`Blob`을 이용해서 이미지 일부를 저장하거나, 페이지 스크린 샷을 만들 수도 있습니다. 그것참 쓸만하겠네요! 하하핫!

이미지 연산(operations)은 HTML의 `<canvas>` 요소를 통해 완성됩니다:

1. 캔버스(canvas)에서 [canvas.drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) 메서드를 이용해 이미지 불러옵니다.
2. 이미지를 불러오면, `Blob`을 생성하고 `콜백(callback)`을 호출하는 캔버스의 [.toBlob(callback, format, quality)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) 메서드를 호출합니다.

다음 예시는 blob을 만들기 전에 단순히 이미지를 복사한 것입니다. blob이 아니어도 canvas에서 이미지를 잘라서 수정할 수도, 변환시킬 수 있습니다.

```js run
// 이미지를 불러오세용
let img = document.querySelector('img');

// 같은 크기의 <canvas>를 만드세용
let canvas = document.createElement('canvas');
canvas.width = img.clientWidth;
canvas.height = img.clientHeight;

let context = canvas.getContext('2d');

// 이미지를 복사하세용 (이 메서드는 이미지를 자를 수도 있습니다)
context.drawImage(img, 0, 0);
// context.rotate()와 같이 canvas에서 여러 가지 작업을 할 수 있습니다. 

// toBlob은 비동기 연산으로, 실행이 완료되면 콜백(callback)이 호출됩니다.
canvas.toBlob(function(blob) {
  // blob 준비 완료!, 다운로드합시다
  let link = document.createElement('a');
  link.download = 'example.png';

  link.href = URL.createObjectURL(blob);
  link.click();

  // 내부 blob 참조를 제거해서 브라우저가 blob을 메모리에서 해제하도록 합니다
  URL.revokeObjectURL(link.href);
}, 'image/png');
```

콜백보다 `async/await`방식을 선호하신다면... :
```js
let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
```

페이지의 스크린샷을 찍고 싶다면, 단순히 다음과 같은 라이브러리를 사용해도 됩니다 ( <https://github.com/niklasvh/html2canvas> ). 이 기능은 단순히 페이지를 쭉 훑어가면서 `<canvas>`에 그리는 것입니다. 그러면 우리도 위 예시와 같은 방법으로 페이지의 `Blob`을 얻을 수 있겠네요.

## Blob에서 ArrayBuffer로 만들기

`Blob` 생성자는 거의 모든것으로부터 blob 객체를 생성할 수 있습니다. `BufferSource`를 포함해서 말이죠.

저수준 프로세싱급의 성능이 필요하다면, 저수준에 가까운 `ArrayBuffer`를 `FileReader`를 이용해 이룰수 있습니다

```js
// blob으로부터 ArrayBuffer를 만들어줍니다
let fileReader = new FileReader();

*!*
fileReader.readAsArrayBuffer(blob);
*/!*

fileReader.onload = function(event) {
  let arrayBuffer = fileReader.result;
};
```


## 요약

`ArrayBuffer`와 `Uint8Array`을 비롯한 `BufferSource` 들이 "바이너리 데이터(binary data)"인 반면, [Blob](https://www.w3.org/TR/FileAPI/#dfn-Blob)은 "타입이 있는 바이너리 데이터"를 의미합니다.

이 특징은 브라우저에서 흔히 있는 업로드/다운로드 연산을 더욱더 편하게 만들어 줍니다.

[XMLHttpRequest](info:xmlhttprequest), [fetch](info:fetch), 등  웹-요청을 수행하는 메서드는 `Blob`과 바이너리 데이터 타입 모두 별도의 라이브러리 없이 사용할 수 있습니다.

`Blob`과 저수준의 바이너리 데이터 타입을 양방향으로 간단하게 변환할 수 있습니다.

- `new Blob(...)` 생성자를 이용해 타입이 있는 배열을 Blob으로 만들 수 있습니다
- `FileReader`를 이용해 다시 `ArrayBuffer`로 만들어 저수준의 바이너리 연산을 진행할 수도 있습니다.