# 텍스트 디코더와 텍스트 인코더

이진 데이터가 문자열이라면 어떨지 생각해봅시다. 예를 들어 텍스트 데이터가 있는 파일을 받았다고 가정하겠습니다.

내장 객체, [TextDecoder](https://encoding.spec.whatwg.org/#interface-textdecoder)는 주어진 버퍼와 인코딩으로 값을 실제 자바스크립트 문자열로 읽을 수 있게 해줍니다.

첫 번째로 객체를 생성합니다.
```js
let decoder = new TextDecoder([label], [options]);
```

- **`label`** -- 기본적인 인코딩 방식은 `utf-8`이지만 `big5`, `windows-1251` 및 다른 인코딩 방식도 지원됩니다.
- **`options`** -- 선택 항목입니다.
  - **`fatal`** -- 불린 값. `true`인 경우, 잘못된 글자(디코딩 불가능한 글자)를 대상으로 예외를 던집니다. `false(기본값)`인 경우, 글자를 `\uFFFD`로 대체합니다.
  - **`ignoreBOM`** -- 불린 값이 `true`인 경우 사용되지 않는 바이트 순서 표식(Byte Order Mark, BOM)을 무시합니다.

그런 다음 생성했던 객체를 디코딩합니다.

```js
let str = decoder.decode([input], [options]);
```

- **`input`** -- 디코딩할 `BufferSource`를 입력합니다.
- **`options`** -- 선택 항목입니다.
  - **`stream`** -- 많은 양의 데이터를 받아들여 `decoder`를 반복적으로 호출할 때도 decoding이 반복적으로 실행됩니다. 이런 경우 멀티 바이트 문자가 많은 데이터로 분할될 수 있습니다. 이 옵션은 데이터 분할을 방지하기 위해 `TextDecoder`에 "unfinished" 문자를 입력시키고 다음 데이터가 오면 디코딩하도록 지시합니다.

예시:

```js run
let uint8Array = new Uint8Array([72, 101, 108, 108, 111]);

alert( new TextDecoder().decode(uint8Array) ); // Hello
```


```js run
let uint8Array = new Uint8Array([228, 189, 160, 229, 165, 189]);

alert( new TextDecoder().decode(uint8Array) ); // 你好
```

버퍼의 하위 배열 뷰를 생성하여 버퍼의 일부를 디코딩 할 수 있습니다.


```js run
let uint8Array = new Uint8Array([0, 72, 101, 108, 108, 111, 0]);

// 문자열을 나타내는 배열의 요소는 중간에 존재합니다.
// 배열의 복사 없이 문자열을 출력할 수 있습니다.
let binaryString = uint8Array.subarray(1, -1);

alert( new TextDecoder().decode(binaryString) ); // Hello
```

## 텍스트 인코더

[TextEncoder](https://encoding.spec.whatwg.org/#interface-textencoder)는 반대로 문자열을 바이트로 변환합니다.

문법은 다음과 같습니다.

```js run
let encoder = new TextEncoder();
```

`TextEncoder`는 인코딩 시 'utf-8'만 지원합니다.

2가지 메서드가 있습니다.
- **`encode(str)`** -- `Uint8Array`에 문자열을 반환합니다.
- **`encodeInto(str, destination)`** -- `Uint8Array` 구조 형태로 문자열 `str`를 `destination`에 인코딩합니다.

```js run
let encoder = new TextEncoder();

let uint8Array = encoder.encode("Hello");
alert(uint8Array); // 72,101,108,108,111
```
