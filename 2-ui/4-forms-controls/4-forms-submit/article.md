# 이벤트와 메서드를 이용한 폼 제출

 `submit` 이벤트는 폼(form)을 제출할 때 트리거 되며, 주로 서버에 폼을 보내기 전에 유효성을 검사하거나 폼 제출을 중단하고 자바스크립트를 사용해 폼을 처리할 때 사용됩니다.

 `form.submit()` 메서드를  사용하면 자바스크립트 단에서 폼 전송이 시작되도록 할 수 있습니다.  `form.submit()` 메서드는 동적으로 폼을 생성하고 서버로 보낼 수 있도록 해주기 때문입니다.

지금부턴 이벤트와 메서드를 이용해 폼을 제출하는 방법에 대해 자세히 알아보겠습니다.

## submit 이벤트로 폼 제출하기

폼을 제출하는 방법은 크게 두 가지가 있습니다.

1. `<input type="submit">` 또는 `<input type="image">`를 클릭하기
2. `Key:Enter`을 입력 필드에서 누르기

두 방법 모두 폼에서  `submit` 이벤트를 발생시킵니다. 이벤트가 발생하면 이벤트 핸들러는 데이터를 검사하는데, 이때 에러가 있으면 에러를 보여주고 `event.preventDefault()`를 호출해 폼이 서버로 전송되지 않도록 합니다.

예시의 폼에서 다음과 같은 동작을 해봅시다.
1. 텍스트 필드로 간 후 `Key:Enter`를 누르기
2. `<input type="submit">`을 클릭하기

동작을 수행하면 `alert`창이 뜨고 `return false` 때문에 폼은 어디로도 전송되지 않는 것을 확인할 수 있습니다.

```html autorun height=60 no-beautify
<form onsubmit="alert('submit!');return false">
  첫 번째: 텍스트 필드로 간 후 엔터누르기 <input type="text" value="text"><br>
  두 번째: "submit" 클릭하기 <input type="submit" value="Submit">
</form>
```

````smart header="`submit`과 `click`의 관계"
입력 필드에서 `Key:Enter`를 눌러 폼을 전송하는 경우, `click` 이벤트는 `<input type="submit">`에서 트리거 됩니다.

여기서 재밌는 점은 실제 어떤 것도 클릭하지 않았는데도 `click` 이벤트가 트리거 되었다는 것입니다.

데모를 살펴봅시다.
```html autorun height=60
<form onsubmit="return false">
 <input type="text" size="30" value="Focus here and press enter">
 <input type="submit" value="Submit" *!*onclick="alert('click')"*/!*>
</form>
```

````

## submit 메서드로 폼 제출하기

`form.submit()`을 호출함으로써 서버에 폼을 제출할 수 있습니다.

이렇게 메서드를 직접 호출하는 방식으로 폼을 제출하면 개발자가 당연히 `form.submit()`을 호출할 때 관련 프로세스를 모두 수행한 것이라 가정되어 `submit` 이벤트가 발생하지 않습니다.

때로는 이 방법은 다음 예시와 같이 폼을 수동으로 생성 및 전송할 때 사용됩니다.

```js run
let form = document.createElement('form');
form.action = 'https://google.com/search';
form.method = 'GET';

form.innerHTML = '<input name="q" value="test">';

// 폼은 제출하려면 반드시 document 내에 있어야 합니다.
document.body.append(form);

form.submit();
```
