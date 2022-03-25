
# FormData 객체

이번 챕터에선 파일 여부나 추가 필드 여부 등과 상관없이 통용되는 HTML 폼(form) 전송 방법에 대해 알아보겠습니다.

[FormData](https://xhr.spec.whatwg.org/#interface-formdata)는 폼을 쉽게 보내도록 도와주는 객체입니다. 이름을 보고 유추하셨듯이 `FormData` 객체는 HTML 폼 데이터를 나타냅니다.

생성자는 다음과 같습니다.
```js
let formData = new FormData([form]);
```

HTML에 `form` 요소가 있는 경우, 위와 같은 코드를 작성하면 해당 폼 요소의 필드 전체가 자동 반영됩니다.

`fetch` 등의 네트워크 메서드가 `FormData` 객체를 바디로 받는다는 건 `FormData`의 특징입니다. 이때 브라우저가 보내는 HTTP 메시지는 인코딩되고 `Content-Type` 속성은 `multipart/form-data`로 지정된 후 전송됩니다.

서버 관점에선 `FormData`를 사용한 방식과 일반 폼 전송 방식에 차이가 없습니다

## 간단한 폼 전송하기

아주 간단한 폼을 전송한다고 가정해봅시다.

보시다시피 아주 짧은 코드로도 전송 처리가 가능합니다.

```html run autorun
<form id="formElem">
  <input type="text" name="name" value="Bora">
  <input type="text" name="surname" value="Lee">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user', {
      method: 'POST',
*!*
      body: new FormData(formElem)
*/!*
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

요청을 받아 처리하는 서버 측 코드는 튜토리얼 범위를 넘어서서 추가하진 않았는데, 서버는 POST 요청을 받아 '저장 성공'이라는 응답을 보내준다고 정도만 알고 계시면 됩니다.

## FormData 메서드

`FormData`에 속하는 필드는 아래와 같은 메서드로 수정할 수 있습니다.

- `formData.append(name, value)` - `name`과 `value`를 가진 폼 필드를 추가
- `formData.append(name, blob, fileName)` - `<input type="file">`형태의 필드를 추가. 세 번째 인수 `fileName`은 (필드 이름이 아니고) 사용자가 해당 이름을 가진 파일을 폼에 추가한 것처럼 설정해줌
- `formData.delete(name)` - `name`에 해당하는 필드를 삭제
- `formData.get(name)` - `name`에 해당하는 필드의 값을 가져옴
- `formData.has(name)` - `name`에 해당하는 필드가 있으면 `true`를, 그렇지 않으면 `false`를 반환

폼은 이름(`name`)이 같은 필드 여러 개를 허용하기 때문에 `append` 메서드를 여러 번 호출해 이름이 같은 필드를 계속 추가해도 문제가 없습니다.

`append` 메서드 이외에 필드 추가 시 사용할 수 있는 메서드로 `set`도 있습니다. `set`이 `append` 메서드와 다른 점은 `set`은 `name`과 동일한 이름을 가진 필드를 모두 제거하고 새로운 필드 하나를 추가한다는 데 있습니다. 따라서 `set` 메서드를 쓰면 `name`을 가진 필드가 단 한 개만 있게끔 보장할 수 있습니다. 이 외에 다른 기능은 `append` 메서드와 동일합니다.

- `formData.set(name, value)`
- `formData.set(name, blob, fileName)`

참고로 폼 데이터 필드에 반복 작업을 할땐 `for..of` 루프를 사용할 수 있습니다.

```js run
let formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2');

// key/value 쌍이 담긴 리스트
for(let [name, value] of formData) {
  alert(`${name} = ${value}`); // key1 = value1, then key2 = value2
}
```

## 파일이 있는 폼 전송하기

폼을 전송할 때 HTTP 메시지의 `Content-Type` 속성은 항상 `multipart/form-data`이고 메시지는 인코딩되어 전송됩니다. 파일이 있는 폼도 당연히 이 규칙을 따르기 때문에 `<input type="file">`로 지정한 필드 역시 일반 폼을 전송할 때와 유사하게 전송됩니다.

파일이 있는 폼 예시를 살펴봅시다.

```html run autorun
<form id="formElem">
  <input type="text" name="firstName" value="Bora">
  Picture: <input type="file" name="picture" accept="image/*">
  <input type="submit">
</form>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch('/article/formdata/post/user-avatar', {
      method: 'POST',
*!*
      body: new FormData(formElem)
*/!*
    });

    let result = await response.json();

    alert(result.message);
  };
</script>
```

## Blob 데이터가 있는 폼 전송하기

<info:fetch> 챕터에서 살펴본 바와 같이 이미지 같은 동적으로 생성된 바이너리 파일은 `Blob` 객체를 사용해 쉽게 전송할 수 있습니다. 이때 `Blob` 객체는 `fetch` 메서드의 `body` 매개변수에 바로 넘겨줄 수 있죠. 

그런데 실제 코딩을 하다 보면 이미지를 별도로 넘겨주는 것보다 폼에 필드를 추가하고 여기에 이미지 '이름' 등의 메타데이터를 같이 실어 넘겨주는 게 좀 더 편리합니다.

서버 입장에서도 원시 바이너리 데이터를 받는 것보다 multipart-encoded 폼을 받는 게 좀 더 적합하죠.

아래는 `<canvas>`를 사용해 만든 이미지를 `FormData`를 사용해 폼 형태로 다른 추가 필드와 함께 전송하는 예시입니다.

```html run autorun height="90"
<body style="margin:0">
  <canvas id="canvasElem" width="100" height="80" style="border:1px solid"></canvas>

  <input type="button" value="이미지 전송" onclick="submit()">

  <script>
    canvasElem.onmousemove = function(e) {
      let ctx = canvasElem.getContext('2d');
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };

    async function submit() {
      let imageBlob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));

*!*
      let formData = new FormData();
      formData.append("firstName", "Bora");
      formData.append("image", imageBlob, "image.png");
*/!*    

      let response = await fetch('/article/formdata/post/image-form', {
        method: 'POST',
        body: formData
      });
      let result = await response.json();
      alert(result.message);
    }

  </script>
</body>
```

예시에서 이미지 `Blob`을 추가한 코드를 다시 봅시다.

```js
formData.append("image", imageBlob, "image.png");
```

이 코드는 폼에 `<input type="file" name="image">` 태그가 있고, 사용자 기기의 파일 시스템에서 파일명이 `"image.png"`(3번째 인수 참고)인 `imageBlob` 데이터(2번째 인수 참고)를 추가한 것과 동일한 효과를 줍니다.

요청을 받은 서버는 일반 폼과 동일하게 폼 데이터와 파일을 읽고 처리합니다.

## 요약

[FormData](https://xhr.spec.whatwg.org/#interface-formdata) 객체는 `fetch` 등의 네트워크 메서드를 통해 HTML 폼을 보내는데 사용됩니다.

`FormData` 객체는 HTML 폼(`form`)을 직접 넘겨 `new FormData(form)`으로 만들 수도 있고, HTML 폼 없이 다음과 같은 메서드로 필드를 추가해 만들 수도 있습니다.

- `formData.append(name, value)`
- `formData.append(name, blob, fileName)`
- `formData.set(name, value)`
- `formData.set(name, blob, fileName)`

메서드를 사용할 때 주의할 점 2가지가 있습니다.

1. `set` 메서드는 `name`이 같은 필드 모두를 지우고 `append`는 그렇지 않습니다. 다른 차이는 없습니다.
2. 파일을 보낼 땐 세 번째 인수가 필요한데 이 인수는 사용자 파일 시스템에서 지정한 파일명과 동일하게 지정됩니다.

이외에도 다음과 같은 메서드가 있습니다

- `formData.delete(name)`
- `formData.get(name)`
- `formData.has(name)`

다룰 내용은 여기까지입니다!
