# 텍스트 디코더와 텍스트 인코더

이진 데이터가 문자열이라면 어떨지 생각해봅시다. 예를 들어 텍스트 데이터가 있는 파일을 받았다고 가정하겠습니다.

내장된 [텍스트 디코더](https://encoding.spec.whatwg.org/#interface-textdecoder) 객체는 주어진 버퍼와 인코딩으로 실제 자바스크립트 문자열의 값을 읽을 수 있습니다.

첫 번째로 함수 선언을 합니다.
```js
let decoder = new TextDecoder([label], [options]);
```

- **`label`** -- 기본적인 인코딩 방식은 `utf-8`이지만, `big5`, `windows-1251` 및 다른 인코딩 방식도 지원됩니다.
- **`options`** -- 선택 항목:
  - **`fatal`** -- 불린 값이 `true`인 경우 잘못된(읽을 수 없는) 문자에 대한 예외를 처리하고 기본값 문자인 `\uFFFD`로 대체합니다.
  - **`ignoreBOM`** -- 불린 값이 `true`인 경우 사용되지 않는 바이트 순서 표식(Byte Order Mark, BOM)을 무시합니다.

...그런 다음 디코딩합니다.

```js
let str = decoder.decode([input], [options]);
```

- **`input`** -- 디코딩 할 `BufferSource`를 입력합니다.
- **`options`** -- 선택 항목:
  - **`stream`** -- 받아들이는 많은 데이터에서 `decoder`를 반복적으로 호출할 때, decoding이 true로 이어집니다. 이런 경우 멀티 바이트 문자가 많은 데이터로 분할될 수 있습니다. 이 옵션은 `TextDecoder`에 "unfinished" 문자를 입력시키고 다음 데이터가 오면 디코드하도록 지시합니다.

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

// the string is in the middle
// create a new view over it, without copying anything
let binaryString = uint8Array.subarray(1, -1);

alert( new TextDecoder().decode(binaryString) ); // Hello
```

## 텍스트 인코더

[텍스트 인코더](https://encoding.spec.whatwg.org/#interface-textencoder)는 반대로 문자열을 바이트로 변환합니다.

함수 선언은 다음과 같습니다.

```js run
let encoder = new TextEncoder();
```

인코딩은 "utf-8"만 지원합니다.

2가지 메서드가 있습니다.
- **`encode(str)`** -- 문자열로부터 `Uint8Array` 을 반환합니다.
- **`encodeInto(str, destination)`** -- `destination` 안으로 `str`을 인코딩합니다. 여기서 `destination`은 `Uint8Array`이어야 합니다.

```js run
let encoder = new TextEncoder();

let uint8Array = encoder.encode("Hello");
alert(uint8Array); // 72,101,108,108,111
```
