# Blob

`ArrayBuffer`와 뷰는 ECMA 표준의 일부이며 자바스크립트의 일부입니다.

브라우저에는 `Blob` 같이 [File API](https://www.w3.org/TR/FileAPI/)에 설명된 상위 수준 객체가 추가로 존재합니다.

`Blob`은 선택사항인 문자열 `type`(보통 MIME형)과 `blobParts`로 구성됩니다. `blobParts`는 다른 `Blob` 객체, 문자열, `BufferSource`의 나열로 이루어집니다.

![](blob.svg)

생성자 문법은 다음과 같습니다.

```js
new Blob(blobParts, options);
```

- **`blobParts`** 는 `Blob`/`BufferSource`/`String` 값의 배열입니다.
- **`options`** 선택사항 객체
  - **`type`** -- `Blob`형으로 보통 MIME형, 예) `image/png`,
  - **`endings`** -- `Blob` 생성 시 현재 OS 줄 바꿈(`\r\n` or `\n`)에 맞추어 줄의 끝을 변환할지 여부. 기본값은 `"transparent"`(아무것도 하지 않음)이나`"native"`(변환함)도 가능합니다.

예를 들면,

```js
// Blob을 문자열로부터 생성합니다
let blob = new Blob(["<html>…</html>"], {type: 'text/html'});
// 주의 : 첫 번째 인수는 배열 [...]이어야 합니다.
```

```js
// create Blob from a typed array and strings
let hello = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in binary form

let blob = new Blob([hello, ' ', 'world'], {type: 'text/plain'});
```


`Blob`은 다음과 같이 잘라내어 추출할 수 있습니다.

```js
blob.slice([byteStart], [byteEnd], [contentType]);
```

- **`byteStart`** -- 시작 바이트로 기본값은 0.
- **`byteEnd`** -- 끝 바이트(지정한 값 이전 값까지 포함하며(exclusive) 기본값은 끝까지).
- **`contentType`** -- 새 blob의 `type`으로 기본값은 원본과 같음.

인수는 `array.slice`와 비슷하며 음수도 허용됩니다.

```smart header="`Blob` 객체는 불변입니다"
`Blob` 안에서 직접 데이터를 변경할 수는 없지만 `Blob` 일부를 잘라내어 새 `Blob` 객체를 생성하거나 새 `Blob`으로 합쳐 넣는 작업 등이 가능합니다.

이런 동작 방식은 JavaScript 문자열과 비슷합니다. 문자열 안의 문자는 변경할 수 없지만 수정된 문자열을 새로 만들 수 있습니다.
```

## Blob을 URL로 사용하기

Blob을 손쉽게 `<a>`, `<img>` 등 태그의 URL로 사용하여 내용을 보여줄 수 있습니다.

`type` 덕분에 `Blob` 객체를 다운로드/업로드할 수 있으며 `type`은 자연스럽게 네트워크 요청 시 `Content-Type`이 됩니다.

간단한 예제로 시작해 봅시다. 링크를 클릭하면 `Blob`이 동적 생성되며 `hello world` 내용을 가진 파일로 다운로드됩니다.

```html run
<!-- download 속성은 브라우저가 탐색 대신 다운로드하도록 강제합니다 -->
<a download="hello.txt" href='#' id="link">Download</a>

<script>
let blob = new Blob(["Hello, world!"], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);
</script>
```

자바스크립트로 링크를 동적 생성하고 `link.click()`으로 클릭처럼 동작하게 하여 다운로드를 자동으로 시작할 수도 있습니다.

다음은 HTML 없이 동적 생성된 `Blob`을 사용자가 다운로드하는 유사한 코드입니다.

```js run
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);

link.click();

URL.revokeObjectURL(link.href);
```

`URL.createObjectURL`은 `Blob`으로 `blob:<origin>/<uuid>` 형태의 고유 URL을 만듭니다.

이 형태를 `link.href` 값으로 사용합니다.

```
blob:https://javascript.info/1e67e00e-860d-40a5-89ae-6ab0cbee6273
```

`URL.createObjectURL`로 만든 URL마다 브라우저는 URL -> `Blob` 매핑을 내부적으로 저장하므로 짧은 URL로 `Blob`에 접근할 수 있게 됩니다.

생성된 URL(링크 포함)은 현재 열려있는 document 안에서만 유효하며  `<img>`, `<a>` 등 기본적으로 URL이 들어가는 모든 객체에서 `Blob`을 참조할 수 있습니다.

그러나 부작용이 있습니다. `Blob`으로 매핑이 있기 때문에 `Blob` 자체는 메모리에 존재합니다. 브라우저는 메모리를 해제하지 못합니다.

매핑은 document가 언로드될 때 자동으로 정리되고 `Blob` 객체도 그때 해제됩니다. 만약 앱이 오랫동안 살아있다면 곧바로 해제되지는 않습니다.

**따라서 URL을 생성하면 더는 필요하지 않더라도 `Blob`은 메모리에 계속 있게 됩니다.**

`URL.revokeObjectURL(url)`은 내부 매핑에서 참조를 제거하므로 `Blob`이 삭제되고(다른 참조가 없는 경우) 메모리가 해제됩니다.

마지막 예제에서는 즉시 다운로드에 `Blob`을 딱 한 번만 사용하기 위해 `URL.revokeObjectURL(link.href)`을 바로 호출합니다.

클릭 가능한 HTML 링크가 있는 이전 예제에서는 `Blob` URL을 유효하게 두기 위해  `URL.revokeObjectURL(link.href)`을 호출하지 않았습니다. 폐기되어 매핑이 삭제되면 URL은 더이상 동작하지 않습니다.

## Blob에서 base64로

`URL.createObjectURL` 대신 `Blob`을 base64 인코딩 문자열로 변환할 수 있습니다.

이 인코딩은 이진 데이터를 0부터 64까지의 ASCII 코드로 구성된 매우 안전한 "읽을 수 있는" 문자열로 나타냅니다. 그리고 더 중요한 것은 이 인코딩을 "data-urls"에서 사용할 수 있다는 것입니다.

[data url](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) 형식은 `data:[<mediatype>][;base64],<data>`입니다. 이러한 URL은 '일반' URL과 동등하게 모든 곳에서 사용할 수 있습니다.

다음은 웃는 얼굴 예제입니다.

```html
<img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">
```

브라우저는 문자열을 디코딩하고 다음 이미지를 표시합니다. <img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">


`Blob`을 base64로 변환하기 위해 내장 객체 `FileReader`를 사용합니다. Blob에서 데이터를 여러 형식으로 읽을 수 있습니다. [다음 챕터](info:file)에서 더 자세히 다룹니다.


다음은 이제 base-64를 통해 blob을 다운로드하는 데모입니다.
```js run
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

*!*
let reader = new FileReader();
reader.readAsDataURL(blob); // blob을 base64로 변환하고 언로드를 호출
*/!*

reader.onload = function() {
  link.href = reader.result; // 데이터 URL
  link.click();
};
```

`Blob` URL을 만드는 두 가지 방법 모두 사용할 수 있지만 보통  `URL.createObjectURL(blob)`이 더 간단하고 빠릅니다.

```compare title-plus="URL.createObjectURL(blob)" title-minus="Blob을 data URL로 사용하기"
+ 메모리를 관리해야 한다면 폐기 필요
+ 'encoding/decoding' 없이 Blob으로 직접 액세스
- 아무것도 폐기할 필요 없음
- 큰 `Blob` 객체를 인코딩하기 위하여 성능 및 메모리 손실
```

## 이미지를 Blob으로 만들기

이미지, 이미지의 일부, 심지어 페이지 스크린샷으로도 `Blob`을 만들 수 있습니다. 어딘가에 업로드할 때 편리합니다.

이미지 작업은 `<canvas>` 요소를 통해 수행됩니다.

1. [canvas.drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) 를 사용하여 캔버스에 이미지를(또는 그 일부를) 그립니다.
2. `Blob`을 실행하고 완료되면 `callback`을 실행하는 canvas 메소드 [.toBlob(callback, format, quality)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)를 호출합니다.

아래 예제는 단순히 이미지 복사만 하지만 Blob을 만들기 전에 Canvas에서 잘라내거나 변형시킬 수도 있습니다.

```js run
// 아무 이미지나 가져옵니다
let img = document.querySelector('img');

// 동일 크기의 <canvas>를 만듭니다
let canvas = document.createElement('canvas');
canvas.width = img.clientWidth;
canvas.height = img.clientHeight;

let context = canvas.getContext('2d');

// 이미지를 복사합니다(이 메소드로 이미지를 자를 수 있습니다).
context.drawImage(img, 0, 0);
// context.rotate() 등 많은 것을 canvas에서 할 수 있습니다

// toBlob은 비동기 작업이며 완료되면 콜백이 호출됩니다
canvas.toBlob(function(blob) {
  // Blob이 준비되어 다운로드합니다
  let link = document.createElement('a');
  link.download = 'example.png';

  link.href = URL.createObjectURL(blob);
  link.click();

  // 내부 Blob 참조를 삭제하여 브라우저가 메모리를 지우도록 합니다
  URL.revokeObjectURL(link.href);
}, 'image/png');
```

콜백 대신 `async/await`를 선호한다면,
```js
let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
```

페이지 스크린샷을 찍을 때 <https://github.com/niklasvh/html2canvas> 같은 라이브러리를 사용할 수 있으며 페이지를 돌아다니다가 `<canvas>`에 그려줍니다. 그러면 페이지 스크린샷의 `Blob`을 위와 같은 방식으로 얻을 수 있습니다.

## Blob에서 ArrayBuffer로

`Blob` 생성자에서는 `BufferSource`를 포함하여 거의 모든 것으로부터 Blob을 만들 수 있습니다.

그러나 저수준 처리를 수행해야 하는 경우 `FileReader`를 사용하여 Blob으로부터 가장 저수준 형태인 `ArrayBuffer`을 얻을 수 있습니다.

```js
// blob에서 arrayBuffer 얻기
let fileReader = new FileReader();

*!*
fileReader.readAsArrayBuffer(blob);
*/!*

fileReader.onload = function(event) {
  let arrayBuffer = fileReader.result;
};
```


## 요약

`ArrayBuffer`, `Uint8Array`, 그 밖의 다른 `BufferSource`는 그냥 "이진 데이터"이지만 [Blob](https://www.w3.org/TR/FileAPI/#dfn-Blob)은 "타입을 가진 이진 데이터"입니다.

이런 이유로 Blob은 브라우저에서 매우 일반적인 업로드/다운로드 작업에 편리합니다.

웹 요청을 수행하는 [XMLHttpRequest](info:xmlhttprequest), [fetch](info:fetch) 등과 같은 메소드에서는 다른 이진 타입과 마찬가지로 `Blob`도 기본적으로 함께 사용할 수 있습니다.

`Blob`은 저수준 이진 데이터 타입은 서로 쉽게 변환할 수 있습니다.

- `new Blob(...)` 생성자를 사용하여 형식화 배열을 Blob으로 만들 수 있습니다.
- `FileReader`를 사용하면 Blob을 도로 `ArrayBuffer`로 얻어 저수준 이진 처리를 위한 뷰를 생성할 수 있습니다.
