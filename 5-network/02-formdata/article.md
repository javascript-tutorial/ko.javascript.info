
# FormData

이번 챕터에선 파일 여부나 추가 필드 여부 등과 상관없이 통용되는 HTML 폼(form) 전송 방법에 대해 알아보겠습니다.

[FormData](https://xhr.spec.whatwg.org/#interface-formdata) objects can help with that. As you might have guessed, it's the object to represent HTML form data.

The constructor is:
```js
let formData = new FormData([form]);
```

HTML에 `form` 요소가 있는 경우, 위와 같은 코드를 작성하면 해당 폼 요소의 필드 전체가 자동 반영됩니다.

The special thing about `FormData` is that network methods, such as `fetch`, can accept a `FormData` object as a body. It's encoded and sent out with `Content-Type: multipart/form-data`.

From the server point of view, that looks like a usual form submission.

## 간단한 폼 전송하기

아주 간단한 폼을 전송한다고 가정해봅시다.

보시다시피 아주 짧은 코드로도 전송 처리가 가능합니다.

```html run autorun
<form id="formElem">
  <input type="text" name="name" value="John">
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

- `formData.append(name, value)` - add a form field with the given `name` and `value`,
- `formData.append(name, blob, fileName)` - `<input type="file">`형태의 필드를 추가. 세 번째 인수 `fileName`은 (필드 이름이 아니고) 사용자가 해당 이름을 가진 파일을 폼에 추가한 것처럼 설정해줌
- `formData.delete(name)` - remove the field with the given `name`,
- `formData.get(name)` - `name`에 해당하는 필드의 값을 가져옴
- `formData.has(name)` - if there exists a field with the given `name`, returns `true`, otherwise `false`

A form is technically allowed to have many fields with the same `name`, so multiple calls to `append` add more same-named fields.

`append` 메서드 이외에 필드 추가 시 사용할 수 있는 메서드로 `set`도 있습니다. `set`이 `append` 메서드와 다른 점은 `set`은 `name`과 동일한 이름을 가진 필드를 모두 제거하고 새로운 필드 하나를 추가한다는 데 있습니다. 따라서 `set` 메서드를 쓰면 `name`을 가진 필드가 단 한 개만 있게끔 보장할 수 있습니다. 이 외에 다른 기능은 `append` 메서드와 동일합니다.

- `formData.set(name, value)`,
- `formData.set(name, blob, fileName)`.

Also we can iterate over formData fields using `for..of` loop:

```js run
let formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2');

// key/value 쌍이 담긴 리스트
for(let [name, value] of formData) {
  alert(`${name} = ${value}`); // key1=value1, then key2=value2
}
```

## Sending a form with a file

The form is always sent as `Content-Type: multipart/form-data`, this encoding allows to send files. So, `<input type="file">` fields are sent also, similar to a usual form submission.

파일이 있는 폼 예시를 살펴봅시다.

```html run autorun
<form id="formElem">
  <input type="text" name="firstName" value="John">
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

In practice though, it's often convenient to send an image not separately, but as a part of the form, with additional fields, such as "name" and other metadata.

서버 입장에서도 원시 바이너리 데이터를 받는 것보다 multipart-encoded 폼을 받는게 좀 더 적합하죠.

This example submits an image from `<canvas>`, along with some other fields, as a form, using `FormData`:

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

Please note how the image `Blob` is added:

```js
formData.append("image", imageBlob, "image.png");
```

이 코드는 폼에 `<input type="file" name="image">` 태그가 있고, 사용자 기기의 파일 시스템에서 파일명이 `"image.png"`(3번째 인수 참고)인 `imageBlob` 데이터(2번째 인수 참고)를 추가한 것과 동일한 효과를 줍니다.

The server reads form data and the file, as if it were a regular form submission.

## Summary

[FormData](https://xhr.spec.whatwg.org/#interface-formdata) 객체는 `fetch` 등의 네트워크 메서드를 통해 HTML 폼을 보내는데 사용됩니다.

`FormData` 객체는 HTML 폼(`form`)을 직접 넘겨 `new FormData(form)`으로 만들 수도 있고, HTML 폼 없이 다음과 같은 메서드로 필드를 추가해 만들 수도 있습니다.

- `formData.append(name, value)`
- `formData.append(name, blob, fileName)`
- `formData.set(name, value)`
- `formData.set(name, blob, fileName)`

메서드를 사용할 때 주의할 점 2가지가 있습니다.

1. The `set` method removes fields with the same name, `append` doesn't. That's the only difference between them.
2. 파일을 보낼 땐 세 번째 인수가 필요한데 이 인수는 사용자 파일 시스템에서 지정한 파일명과 동일하게 지정됩니다.
Other methods are:

- `formData.delete(name)`
- `formData.get(name)`
- `formData.has(name)`

다룰 내용은 여기까지입니다!
