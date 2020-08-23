# 파일과 파일 리더, File and FileReader

[File](https://www.w3.org/TR/FileAPI/#dfn-file) 객체는 `Blob`을 상속한 구조이며, 파일 시스템과 관련된 기능들이 확장된 객체입니다.

파일 객체를 생성하는 방법에는 두 가지가 있습니다.

첫째, 생성자를 통해 만드는 겁니다, `Blob`과 유사하죠 :

```js
new File(fileParts, fileName, [options])
```

- **`fileParts`** -- Blob/BufferSource/문자열로 구성된 배열입니다.
- **`fileName`** -- 파일명입니다(문자열).
- **`options`** -- 선택적인 객체 인자:
    - **`lastModified`** -- 파일의 최근 수정한 타임스탬프(정수로 나타낸 시간)입니다.

둘째, 파일 객체를 브라우저상에서 접하는 경우는 대부분 `<input type="file">` 태그로부터 파일을 받거나, 브라우저 인터페이스상으로 드래그 앤 드롭(drag'n'drop)을 통해 받는 경우를 많이 접해봤을 겁니다. 이의 경우, 파일은 OS(운영체제)로부터 정보를 받습니다.

`File` 객체가 `Blob`을 상속하는 구조인 만큼 같은 속성을 공유하고, 다음 특징을 추가로 갖고 있습니다 :
- `name` -- 파일명,
- `lastModified` -- 최근 수정의 타임 스탬프.

다음은 브라우저 상에서 `<input type="file">` 태그를 통해 `File` 객체를 받는 방법입니다 :

```html run
<input type="file" onchange="showFile(this)">

<script>
function showFile(input) {
  let file = input.files[0];

  alert(`File name: ${file.name}`); // 예 : my.png
  alert(`Last modified: ${file.lastModified}`); // 예 : 1552830408824
}
</script>
```

```smart
input 태그를 통해서 여러 개의 파일이 선택될 수 있습니다. 그래서 `input.files`는 위의 예시 코드와 같이 배열입니다. 여기서는 하나의 파일을 예시로 들고 있어서 `input.files[0]`하고 썼습니다.
```

## 파일 리더, FileReader

[FileReader](https://www.w3.org/TR/FileAPI/#dfn-filereader)는 오직 `Blob`객체와 `File` 객체의 데이터를 읽기 위해 만들어진 객체입니다.

이벤트(event)를 통해 데이터를 전송하며, 저장장치로부터 데이터를 읽는 I/O 작업으로 인해 시간이 다소 걸릴 수도 있습니다.

생성자 :

```js
let reader = new FileReader(); // 인자 없음!
```

FileReader 객체의 메서드:

- **`readAsArrayBuffer(blob)`** -- 데이터를 바이너리 포맷(`ArrayBuffer`)으로 읽습니다.
- **`readAsText(blob, [encoding])`** -- 데이터를 일반 텍스트 형태로 읽습니다. 선택적 인자로 주어진 인코딩(기본값 : `utf-8`)으로 읽습니다.
- **`readAsDataURL(blob)`** -- 데이터를 바이너리 데이터 형식으로 읽고, base64 데이터 URL 형식으로 인코딩합니다.
- **`abort()`** -- 진행 중인 작업을 중단합니다.

`read`로 시작하는 메서드는 어떤 포맷을 선호하는지, 또는 어떻게 데이터를 사용할지에 따른 선택입니다.

- `readAsArrayBuffer` -- 저수준의 연산을 하는 바이너리 파일을 위한 메서드 입니다. 슬라이싱(slicing)과 같은 고수준의 연산 경우, 파일을 읽지 않고 직접 수행할 수 있습니다.
- `readAsText` -- 텍스트 파일에 적합합니다, 문자열을 얻기 위해 수행하는 경우에 사용됩니다.
- `readAsDataURL` -- 파일 데이터를 `src`,`img`, 등 태그에 사용하는 경우 사용됩니다. 유사한 방법으로는 이전 장에서 언급한 <info:blob>: `URL.createObjectURL(file)`이 있습니다.

파일을 읽으면서, 발생 가능한 이벤트는 다음과 같습니다:
- `loadstart` -- 로딩 시작되면 일어납니다.
- `progress` -- 파일을 읽는 도중 일어납니다.
- `load` -- 파일 읽기가 완료된 상태입니다. 에러 없음!
- `abort` -- `abort()` 메서드가 호출된 상태입니다.
- `error` -- 에러가 발생한 상태입니다.
- `loadend` -- 성공과 실패 상관없이 파일 읽기가 모두 완료된 상태입니다.

위 이벤트들은 (FileReader 객체 인스턴스).on(이벤트 이름)으로 확인할 수 있습니다.

파일 읽기가 완료되면, FileReader의 프로퍼티를 통해 결과를 접할 수 있습니다:
- `reader.result` 는 결과입니다. (야호 성공했다!)
- `reader.error` 는 에러입니다. (실패했다...)

아마 가장 많이 사용된 이벤트는 `load`와 `error`일 겁니다 

다음은 파일을 읽는 예시입니다:

```html run
<input type="file" onchange="readFile(this)">

<script>
function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    console.log(reader.result);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}
</script>
```

```smart header="Blob을 위한 `FileReader`"
이전 장 <info:blob>에서 언급했듯이, `FileReader`는 아무 파일을 읽을 수 없지만, Blob은 읽을 순 있습니다.

FileReader를 이용해 Blob을 다른 포맷으로 변환할 수 있습니다:
- `readAsArrayBuffer(blob)` -- 에서 `ArrayBuffer`로 변환합니다.
- `readAsText(blob, [encoding])` -- 에서 문자열로 변환합니다 (`TextDecoder`의 대안입니다).
- `readAsDataURL(blob)` -- 에서 base64 데이터 URL로 변환합니다.
```


```smart header="`FileReaderSync`는 웹 워커(Web Workers)에서 사용가능합니다"
웹 워커를 위해 동기화를 지원하는 `FileReader`가 존재합니다, [FileReaderSync](https://www.w3.org/TR/FileAPI/#FileReaderSync).

`read`로 시작하는 메서드는 이벤트(load, abort, error, ...)를 생성하지 않고, 일반적인 함수와 같이 결과를 반환합니다.

메서드 이름 그대로 나와 있듯이 FileReaderSync는 동기적으로 작동하기 때문에 복수의 작업을 하는 웹 워커 외부에는 존재하지 않습니다. 내부에만 존재하기 때문에, 동기적으로 처리해도 웹 페이지에 영향을 끼치지 않습니다.
```

## 요약

`File` 객체는 `Blob`으로부터 상속받았습니다.

그래서 `File` 객체는 `Blob`의 메서드와 프로퍼티를 그대로 가지며, 추가로 `File` 객체는 `name`과 `lastModified` 프로퍼티와 파일 시스템(OS)으로부터 읽을 수 있는 특징을 갖습니다. 일반적으로 `<input>` 태그와 드래그 앤 드롭(`ondragend`) 사용자 입력으로부터  `File` 객체를 받습니다. 

`FileReader` 객체는 다음 세 가지 포맷으로 파일이나 Blob을 읽을 수 있습니다:
- 문자열 (`readAsText` 메서드).
- `ArrayBuffer` (`readAsArrayBuffer` 메서드).
- 데이터 URL(base64 인코딩) (`readAsDataURL` 메서드).

대부분의 경우 파일을 읽을 필요가 없습니다. Blob을 사용했을 때와 마찬가지로, `URL.createObjectURL(file)` 메서드를 이용해 짧은 URL을 생성한 뒤 `<a>` 또는 `<img>` 태그에 할당한 뒤 사용할 수 있습니다. 이 방법으로 파일을 다운로드받을 수 있거나 캔버스(canvas)의 일부인 이미지로 보일 수 있습니다.

네트워크를 통해 `File`을 전송하기도 쉽습니다 : `XMLHttpRequest` 또는 `fetch` 같은 네트워크 API는 `File` 오브젝트를 인자로 받기 때문입니다.
