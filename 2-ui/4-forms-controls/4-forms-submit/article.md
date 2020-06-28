# 이벤트와 메서드를 이용한 폼 제출

이벤트 `submit`은 폼(form)을 제출할 때 트리거 되며, 서버에 폼을 보내기 전에 유효성을 검사하거나 제출을 중단하고 자바스크립트에서 처리할 때 사용됩니다.

메서드 `form.submit()`을 사용해 자바스크립트에서 폼을 전송할 수 있습니다. 이 메서드를 이용해 동적으로 폼을 생성하고 서버로 보낼 수 있습니다.

이벤트와 메서드를 이용하여 폼을 제출하는 방법에 대해 자세히 알아봅시다.

## 이벤트로 폼 제출하기

폼을 제출하는 방법은 크게 두 가지가 있습니다.

1. `<input type="submit">` 또는 `<input type="image">`를 클릭한다.
2. `Key:Enter`을 입력 필드에서 누른다.

두 방법 모두 폼에서 이벤트 `submit`를 발생시킵니다. 핸들러는 데이터를 검사하며 에러가 있을 때 에러를 보여주고 `event.preventDefault()`를 호출합니다. 에러가 발생하면 폼이 서버로 전송되지 않습니다. 

아래의 데모에서 다음과 같이 해봅시다.
1. 텍스트 필드에서 `Key:Enter`를 누른다.
2. `<input type="submit">`을 클릭한다.

두 방법 모두 `alert`를 보여주며 폼은 `return false`에 의해 어디로도 전송되지 않습니다.

```html autorun height=60 no-beautify
<form onsubmit="alert('submit!');return false">
  First: Enter in the input field <input type="text" value="text"><br>
  Second: Click "submit": <input type="submit" value="Submit">
</form>
```

````smart header="`submit`과 `click`의 관계"
폼이 입력 필드에서 `Key:Enter`를 눌러 전송되는 경우, `click` 이벤트는 `<input type="submit>`에서 트리거 됩니다.

여기서 재밌는 점은 우리는 어떤 것도 클릭하지 않았다는 것입니다.

설명을 위한 데모를 보시죠.
```html autorun height=60
<form onsubmit="return false">
 <input type="text" size="30" value="Focus here and press enter">
 <input type="submit" value="Submit" *!*onclick="alert('click')"*/!*>
</form>
```

````

## 메서드로 폼 제출하기

`form.submit()`을 호출함으로써 서버에 폼을 제출할 수 있습니다.

프로그래머가 `form.submit()`을 호출할 때 스크립트는 관련 프로세스를 모두 수행한 것으로 가정하며, 이 경우 이벤트 `submit`은 발생하지 않습니다.

때로는 다음과 같이 폼을 생성하고 전송할 수 있습니다.

```js run
let form = document.createElement('form');
form.action = 'https://google.com/search';
form.method = 'GET';

form.innerHTML = '<input name="q" value="test">';

// 폼은 제출을 위해 document 내에 있어야 합니다.
document.body.append(form);

form.submit();
```
