# submit 이벤트와 메서드

`submit` 이벤트는 폼을 제출할 때 트리거 되는데, 주로 폼을 서버로 전송하기 전에 내용을 검증하거나 폼 전송을 취소할 때 사용합니다.

한편, `form.submit()` 메서드는 자바스크립트만으로 폼 전송을 하고자 할 때 사용합니다. `submit()`메서드는 동적으로 폼을 생성하고 서버에 보내고자 할 때 사용합니다.

개괄적인 설명은 여기서 마치고 이제 submit 이벤트와 메서드에 대해 자세히 살펴봅시다.

## submit 이벤트

폼을 전송하는 방법은 크게 두 가지가 있습니다.

1. `<input type="submit">`이나 `<input type="image">` 클릭하기
2. 인풋 필드에서 `key:Enter` 키 누르기

두 방법 모두 폼의 `submit` 이벤트를 트리거합니다. 이벤트 핸들러에선 데이터를 체크하는데, 데이터에 에러가 있는 경우 에러를 출력한 다음 `event.preventDefault()`를 호출하곤 합니다. 이렇게 되면 폼은 서버에 전송되지 않습니다.

아래 폼에서 두 동작을 각각 수행해 보세요.
1. 텍스트 필드로 이동해 `key:Enter` 키를 누릅니다.
2. `<input type="submit">`을 클릭합니다.

참고로 두 동작 모두 `alert` 창을 보여주는데, `return false` 때문에 폼은 전송되지 않습니다.

```html autorun height=60 no-beautify
<form onsubmit="alert('submit!');return false">
  1. input 필드에 포커스를 준 다음 Enter 키 누르기: <input type="text" value="text"><br>
  2. '제출' 버튼 누르기: <input type="submit" value="제출">
</form>
```

````smart header="`submit`과 `click`의 관계"
input 필드에서 `key:Enter` 키를 눌러 폼을 전송하면 `<input type="submit">`에 있는 `click` 이벤트가 트리거 됩니다.

클릭을 하지 않았는데도 `click` 이벤트가 트리거 되니까 좀 이상해 보이긴 하네요.

데모를 살펴봅시다.
```html autorun height=60
<form onsubmit="return false">
 <input type="text" size="30" value="여기에 포커스를 준 다음에 Enter 키 누르기">
 <input type="submit" value="제출" *!*onclick="alert('클릭 이벤트가 트리거 되었습니다!')"*/!*>
</form>
```

````

## submit 메서드

`form.submit()`을 호출하면 자바스크립트로 직접 폼을 서버에 전송할 수 있습니다.

`form.submit()` 메서드가 호출된 다음엔 `submit` 이벤트는 생성되지 않습니다. 개발자가 `form.submit()`을 호출했다면 스크립트에서 이미 필요한 모든 조치를 했다고 가정하기 때문입니다.

이런 submit 메서드의 특징은 다음과 같이 폼을 직접 만들고 전송하길 원할 때 응용할 수 있습니다.

```js run
let form = document.createElement('form');
form.action = 'https://google.com/search';
form.method = 'GET';

form.innerHTML = '<input name="q" value="테스트">';

// 폼을 제출하려면 반드시 폼이 문서 안에 있어야 합니다.
document.body.append(form);

form.submit();
```
