# Blob

`ArrayBuffer`와 뷰(view)는 ECMA 표준의 일부로 자바스크립트에 속합니다.

브라우저엔 이보다 더 고수준의 객체가 추가로 존재하는데 [File API](https://www.w3.org/TR/FileAPI/)에 기술되어 있습니다. 그중 하나가 `Blob`입니다.

`Blob`은 옵션 문자열 `type`(주로 MIME 타입)과 `blobParts`(다른 `Blob` 객체·문자열·`BufferSource`의 나열)로 구성됩니다.

![](blob.svg)

생성자 문법은 다음과 같습니다.

```js
new Blob(blobParts, options);
```

- **`blobParts`** -- `Blob`·`BufferSource`·`String` 값을 담은 배열입니다.
- **`options`** -- 옵션 객체입니다.
  - **`type`** -- `Blob`의 타입으로 주로 `image/png` 같은 MIME 타입이 들어갑니다.
  - **`endings`** -- 줄 바꿈 문자를 현재 OS의 새 줄 문자(`\r\n` 또는 `\n`)에 맞게 변환할지 결정합니다. 기본값은 아무 처리도 하지 않는 `"transparent"`이고 변환을 수행하는 `"native"`로 지정할 수도 있습니다.

예시를 살펴봅시다.

```js
// 문자열로 Blob을 만듭니다.
let blob = new Blob(["<html>…</html>"], {type: 'text/html'});
// 첫 번째 인수는 반드시 배열 [...] 형태여야 한다는 점에 유의하세요.
```

```js
// TypedArray와 문자열을 조합해 Blob을 만듭니다.
let hello = new Uint8Array([72, 101, 108, 108, 111]); // 이진 형태의 "Hello"

let blob = new Blob([hello, ' ', 'world'], {type: 'text/plain'});
```


`Blob`의 일부를 추출할 땐 다음 메서드를 사용합니다.

```js
blob.slice([byteStart], [byteEnd], [contentType]);
```

- **`byteStart`** -- 시작 바이트로 기본값은 0입니다.
- **`byteEnd`** -- 마지막 바이트입니다(해당 바이트 직전까지 추출하며 기본값은 끝까지).
- **`contentType`** -- 새로 만들 blob의 `type`으로 기본값은 원본과 같습니다.

인수 구성이 `array.slice`와 유사하고 음수도 허용됩니다.

```smart header="변경할 수 없는 `Blob` 객체"
`Blob` 안의 데이터를 직접 변경할 방법은 없습니다. 대신 `Blob`을 잘라 새로운 `Blob` 객체를 만들고 이를 다른 것과 섞어 또 다른 `Blob`을 만드는 일은 가능합니다.

자바스크립트 문자열과 유사한 동작 방식입니다. 문자열 중간의 글자 하나를 고칠 순 없지만 고친 내용을 담은 새 문자열은 만들 수 있죠.
```

## Blob을 URL로 사용하기

Blob은 그 내용을 표시하기 위한 URL로서 `<a>`·`<img>` 등의 태그에 쉽게 사용할 수 있습니다.

`type`이 있는 덕분에 `Blob` 객체를 다운로드·업로드할 수도 있습니다. 네트워크 요청에서 `type`은 자연스럽게 `Content-Type` 헤더가 됩니다.

간단한 예시부터 시작해 봅시다. 링크를 클릭하면 동적으로 생성된 `hello world` 내용의 `Blob`이 파일로 다운로드됩니다.

```html run
<!-- download 속성이 있으면 브라우저는 링크 이동 대신 다운로드를 수행합니다. -->
<a download="hello.txt" href='#' id="link">다운로드</a>

<script>
let blob = new Blob(["Hello, world!"], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);
</script>
```

자바스크립트에서 링크를 동적으로 만들고 `link.click()`으로 클릭을 시뮬레이션할 수도 있습니다. 이러면 사용자 조작 없이 다운로드가 자동으로 시작됩니다.

HTML 없이 동적으로 생성한 `Blob`을 다운로드하게 만드는 비슷한 코드입니다.

```js run
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);

link.click();

URL.revokeObjectURL(link.href);
```

`URL.createObjectURL`은 `Blob`을 받아 `blob:<origin>/<uuid>` 형태의 고유한 URL을 만듭니다.

`link.href` 값은 다음과 같은 모습입니다.

```
blob:https://javascript.info/1e67e00e-860d-40a5-89ae-6ab0cbee6273
```

브라우저는 `URL.createObjectURL`로 생성한 URL마다 URL → `Blob` 매핑을 내부에 저장합니다. 그래서 URL이 짧아도 이 URL로 `Blob`에 접근할 수 있습니다.

생성된 URL(과 그 URL을 쓰는 링크)은 현재 문서가 열려 있는 동안 그 문서 안에서만 유효합니다. 이 URL은 `<img>`·`<a>`를 비롯해 URL을 기대하는 모든 객체에서 `Blob`을 참조하는 데 쓸 수 있습니다.

다만 부작용이 하나 있습니다. `Blob` 매핑이 존재하는 동안엔 `Blob` 자체가 메모리에 상주합니다. 브라우저가 이를 해제할 수 없습니다.

매핑은 문서가 언로드될 때 자동으로 정리되고 그때 `Blob` 객체도 함께 해제됩니다. 하지만 앱이 오래 살아 있다면 해제 시점은 금방 오지 않습니다.

**따라서 URL을 만들어 두면 그 `Blob`은 더는 필요 없어져도 메모리에 남아 있게 됩니다.**

`URL.revokeObjectURL(url)`은 내부 매핑에서 참조를 제거합니다. 그 덕분에(다른 참조가 없다면) `Blob`이 삭제될 수 있고 메모리도 해제됩니다.

마지막 예시에선 `Blob`을 즉시 다운로드에 한 번만 쓸 생각이므로 `URL.revokeObjectURL(link.href)`를 바로 호출했습니다.

클릭 가능한 HTML 링크를 쓴 이전 예시에선 `URL.revokeObjectURL(link.href)`를 호출하지 않습니다. 호출하면 `Blob` URL이 무효가 되기 때문입니다. 취소 후엔 매핑이 제거되어 URL이 더는 동작하지 않습니다.

## Blob을 base64로 변환하기

`URL.createObjectURL`의 대안으로 `Blob`을 base64 인코딩 문자열로 변환하는 방법이 있습니다.

base64 인코딩은 이진 데이터를 0부터 64까지의 ASCII 코드로 이루어진 아주 안전한 '읽을 수 있는' 문자열로 표현합니다. 더 중요한 점은 이 인코딩을 '데이터 URL(data url)'에 쓸 수 있다는 사실입니다.

[데이터 URL](mdn:/http/Data_URIs)은 `data:[<mediatype>][;base64],<data>` 형태입니다. 이런 URL은 '일반' URL과 동등하게 어디에서나 사용할 수 있습니다.

웃는 얼굴 이미지를 예시로 살펴봅시다.

```html
<img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">
```

브라우저가 문자열을 디코딩해 이미지를 표시합니다. <img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">


`Blob`을 base64로 변환할 땐 내장 객체 `FileReader`를 사용합니다. `FileReader`는 Blob의 데이터를 여러 형식으로 읽을 수 있습니다. [다음 챕터](info:file)에서 더 자세히 다루겠습니다.

이번엔 base64를 이용해 blob을 다운로드하는 데모입니다.

```js run
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

*!*
let reader = new FileReader();
reader.readAsDataURL(blob); // blob을 base64로 변환하고 변환이 끝나면 onload를 호출합니다.
*/!*

reader.onload = function() {
  link.href = reader.result; // 데이터 URL
  link.click();
};
```

`Blob`으로 URL을 만드는 두 방법 모두 사용할 수 있습니다. 하지만 보통은 `URL.createObjectURL(blob)`이 더 간단하고 빠릅니다.

```compare title-plus="URL.createObjectURL(blob)" title-minus="Blob을 데이터 URL로 변환"
+ 메모리를 신경 쓴다면 URL을 취소해야 합니다.
+ blob에 바로 접근하므로 '인코딩·디코딩'이 없습니다.
- 아무것도 취소할 필요가 없습니다.
- 큰 `Blob` 객체를 인코딩할 때 성능과 메모리 손실이 있습니다.
```

## 이미지를 Blob으로 변환하기

이미지 전체나 일부, 심지어 페이지 스크린샷으로도 `Blob`을 만들 수 있습니다. 만든 `Blob`은 어딘가에 업로드할 때 유용합니다.

이미지 연산은 `<canvas>` 요소에서 이뤄집니다.

1. [canvas.drawImage](mdn:/api/CanvasRenderingContext2D/drawImage)를 사용해 캔버스에 이미지(또는 이미지 일부)를 그립니다.
2. 캔버스 메서드 [.toBlob(callback, format, quality)](mdn:/api/HTMLCanvasElement/toBlob)를 호출하면 `Blob`이 만들어지고 완성되는 시점에 `callback`이 호출됩니다.

아래 예시에선 이미지를 복사하기만 하지만 blob으로 만들기 전에 캔버스에서 이미지를 잘라내거나 변형할 수도 있습니다.

```js run
// 아무 이미지나 가져옵니다.
let img = document.querySelector('img');

// 이미지와 같은 크기로 <canvas>를 만듭니다.
let canvas = document.createElement('canvas');
canvas.width = img.clientWidth;
canvas.height = img.clientHeight;

let context = canvas.getContext('2d');

// 캔버스에 이미지를 복사합니다(drawImage로는 이미지를 잘라낼 수도 있습니다).
context.drawImage(img, 0, 0);
// context.rotate()를 비롯해 캔버스에서 다양한 작업을 할 수 있습니다.

// toBlob은 비동기 연산이라 작업이 끝나면 콜백이 호출됩니다.
canvas.toBlob(function(blob) {
  // blob이 준비되었으니 다운로드합니다.
  let link = document.createElement('a');
  link.download = 'example.png';

  link.href = URL.createObjectURL(blob);
  link.click();

  // 내부 blob 참조를 삭제해 브라우저가 메모리를 해제할 수 있게 합니다.
  URL.revokeObjectURL(link.href);
}, 'image/png');
```

콜백 대신 `async/await`를 선호한다면 다음처럼 쓸 수 있습니다.
```js
let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
```

페이지 스크린샷엔 <https://github.com/niklasvh/html2canvas> 같은 라이브러리를 사용할 수 있습니다. 이 라이브러리는 페이지를 훑으며 `<canvas>`에 그대로 그려줄 뿐입니다. 그다음은 위와 같은 방법으로 `Blob`을 얻으면 됩니다.

## Blob에서 ArrayBuffer 추출하기

`Blob` 생성자를 사용하면 `BufferSource`를 포함해 거의 모든 것으로 blob을 만들 수 있습니다.

반대로 저수준 처리가 필요하다면 `FileReader`를 사용해 blob에서 가장 저수준 형태인 `ArrayBuffer`를 얻을 수 있습니다.

```js
// blob에서 arrayBuffer를 얻습니다.
let fileReader = new FileReader();

*!*
fileReader.readAsArrayBuffer(blob);
*/!*

fileReader.onload = function(event) {
  let arrayBuffer = fileReader.result;
};
```


## 요약

`ArrayBuffer`·`Uint8Array` 등의 `BufferSource`가 '이진 데이터'라면 [Blob](https://www.w3.org/TR/FileAPI/#dfn-Blob)은 '타입이 있는 이진 데이터'를 나타냅니다.

그 덕분에 Blob은 브라우저에서 아주 흔한 업로드·다운로드 작업에 편리하게 쓰입니다.

[XMLHttpRequest](info:xmlhttprequest)·[fetch](info:fetch) 등 웹 요청을 수행하는 메서드는 다른 이진 타입과 마찬가지로 `Blob`도 기본으로 다룰 수 있습니다.

`Blob`과 저수준 이진 데이터 타입 사이의 변환도 간단합니다.

- `new Blob(...)` 생성자를 사용하면 TypedArray로 Blob을 만들 수 있습니다.
- `FileReader`를 사용하면 Blob에서 `ArrayBuffer`를 다시 얻을 수 있고 그 위에 뷰를 만들어 저수준 이진 처리를 할 수 있습니다.
