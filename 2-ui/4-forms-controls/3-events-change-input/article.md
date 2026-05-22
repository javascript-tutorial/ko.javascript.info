# 이벤트: change, input, cut, copy, paste

이번 챕터에선 데이터가 변경될 때 실행되는 다양한 이벤트에 대해 다루겠습니다.

## 이벤트: change

`change` 이벤트는 요소 변경이 끝나면 발생합니다.

텍스트 입력 요소인 경우에는 요소 변경이 끝날 때가 아니라 포커스를 잃을 때 이벤트가 발생합니다.

텍스트 입력 요소 예시를 살펴봅시다. 아래 텍스트 입력 필드에 글자를 입력하는 동안엔 이벤트가 발생하지 않습니다. 하지만 버튼을 클릭하는 등의 동작을 통해 포커스를 다른 곳으로 옮기는 순간 `change` 이벤트가 발생합니다.

```html autorun height=40 run
<input type="text" onchange="alert(this.value)">
<input type="button" value="버튼">
```

또 다른 요소를 기준으로 `change`이벤트가 언제 발생하는지 살펴봅시다. `select`와 `input type=checkbox`,`input type=radio`는 선택 값이 변경된 직후에 이벤트가 발생합니다. 

```html autorun height=40 run
<select onchange="alert(this.value)">
  <option value="">선택하세요.</option>
  <option value="1">옵션 1</option>
  <option value="2">옵션 2</option>
  <option value="3">옵션 3</option>
</select>
```


## 이벤트: input

`input` 이벤트는 사용자가 값을 수정할 때마다 발생합니다.

키보드 이벤트와 달리 `input` 이벤트는 어떤 방법으로든 값을 변경할 때 발생합니다. 마우스를 사용하여 글자를 붙여 넣거나 음성인식 기능을 사용해 글자를 입력할 때처럼 키보드가 아닌 다른 수단을 사용하여 값을 변경시킬 때도 `input` 이벤트가 발생합니다.

예시를 살펴봅시다.

```html autorun height=40 run
<input type="text" id="input"> oninput: <span id="result"></span>
<script>
  input.oninput = function() {
    result.innerHTML = input.value;
  };
</script>
```

수정이 일어날 때마다 이벤트를 실행하고 싶다면 `<input>` 이벤트가 가장 적절합니다.

한편, `input` 이벤트는 `key:⇦`, `key:⇨` 키같이 값을 변경시키지 않는 키보드 입력이나 동작에는 반응하지 않습니다. 

```smart header="그 무엇도 `oninput`를 막을 수 없습니다."
`input` 이벤트는 값이 수정되자마자 발생합니다.

따라서 `event.preventDefault()`를 사용해 기본 동작을 막더라도 값이 수정되면 그 즉시 `input`이벤트가 발생하기 때문에 `event.preventDefault()`를 써봤자 아무런 효과가 없습니다.
```

## 이벤트: cut, copy, paste

`cut`, `copy`, `paste` 이벤트는 각각 값을 잘라내기·복사하기·붙여넣기 할 때 발생합니다.

세 이벤트는 [ClipboardEvent](https://www.w3.org/TR/clipboard-apis/#clipboard-event-interfaces) 클래스의 하위 클래스이며 잘라내기·복사하기·붙여넣기 된 데이터에 접근할 수 있도록 해줍니다.

`input` 이벤트와는 달리 세 이벤트는 `event.preventDefault()`를 사용해 기본 동작을 막을 수 있습니다. 이렇게 하면 아무것도 복사·붙여넣기 할 수 없습니다.

예를 들어 아래 코드는 잘라내기·복사하기·붙여넣기 동작을 시도하면 모든 동작이 중단되고 얼럿창을 통해 잘라내기·복사하기·붙여넣기를 시도하는 텍스트를 표시합니다.

```html autorun height=40 run
<input type="text" id="input">
<script>
  input.onpaste = function(event) {
    alert("paste: " + event.clipboardData.getData('text/plain'));
    event.preventDefault();
  };

  input.oncut = input.oncopy = function(event) {
    alert(event.type + '-' + document.getSelection());
    event.preventDefault();
  };
</script>
```

(붙여넣기는 얼럿창에 나오지만 잘라내기·복사하기는 '-'로 보입니다 - 옮긴이)

알아두세요! 잘라내기·복사하기 이벤트 핸들러 내부에서 `event.clipboardData.getData(...)`를 호출하면 빈 문자열을 반환합니다. 엄밀히 말하면 아직 데이터가 클립보드에 들어가 있지 않기 때문입니다. 또한 `event.preventDefault()`를 사용하면 아예 복사조차 하지 못합니다.

따라서 위 예제는 `document.getSelection()`을 사용하여 선택한 텍스트를 가져옵니다. 문서 선택(document selection)에 대한 자세한 내용은 <info:selection-range>에서 다룹니다.

텍스트뿐만 아니라 모든 것을 복사하기·붙여넣기 할 수 있습니다. 예를 들어 OS 파일 매니저에서 파일을 복사해 붙여넣을 수 있습니다.

이는 `clipboardData`가 드래그 앤 드롭과 복사하기·붙여넣기에 공통으로 사용되는 `DataTransfer` 인터페이스를 구현하기 때문입니다. 이 인터페이스는 현재 논의 범위를 벗어나므로 자세히 다루지는 않지만 관련 메서드는 [DataTransfer 명세서](https://html.spec.whatwg.org/multipage/dnd.html#the-datatransfer-interface)에서 확인할 수 있습니다.

또한 클립보드에 접근하는 별도의 비동기 API인 `navigator.clipboard`도 있습니다 ([Firefox에서는 지원되지 않습니다](https://caniuse.com/async-clipboard)). 자세한 내용은 [클립보드 API 및 이벤트](https://www.w3.org/TR/clipboard-apis/) 명세서를 참조하면 됩니다.


### 안전 제한 사항

클립보드는 '전역' OS 레벨입니다. 사용자는 여러 애플리케이션을 오가며 다양한 내용을 복사하기·붙여넣기 할 수 있는데 브라우저 페이지가 그 내용을 모두 볼 수 있어서는 안 됩니다.

그래서 대부분의 브라우저는 복사하기·붙여넣기 같은 특정 사용자 동작이 일어나는 범위 안에서만 클립보드 읽기·쓰기에 끊김없이 접근할 수 있도록 허용합니다.

Firefox를 제외한 모든 브라우저에서는 `dispatchEvent`로 '사용자 지정(custom)' 클립보드 이벤트를 생성하는 것이 금지되어 있습니다. 그런 이벤트를 보내는(dispatch) 데 성공하더라도 명세에는 이러한 '합성(synthetic)' 이벤트가 클립보드에 접근해서는 안 된다고 명확히 규정합니다.

이벤트 핸들러 안에서 `event.clipboardData`를 저장해두었다가 나중에 접근하려고 해도 마찬가지로 동작하지 않습니다.

다시 말해 [event.clipboardData](https://www.w3.org/TR/clipboard-apis/#clipboardevent-clipboarddata)는 오직 사용자가 직접 발생시킨 이벤트의 핸들러 안에서만 동작합니다.

반면 [navigator.clipboard](https://www.w3.org/TR/clipboard-apis/#h-navigator-clipboard)는 더 최근에 등장한 API로 어떤 콘텍스트에서든 사용할 수 있도록 설계되었습니다. 필요한 경우 사용자에게 권한을 요청합니다.

## 요약

데이터가 변경될 때 실행되는 다양한 이벤트를 정리해봅시다.

| 이벤트 | 설명 | 특이사항 |
|---------|----------|-------------|
| `change` | 값이 변경될 때 이벤트 발생 | 텍스트 입력의 경우 포커스를 잃을 때 실행 |
| `input` | 텍스트가 입력될 때마다 이벤트 발생 | `change`와 달리 즉시 실행 |
| `cut`, `copy`, `paste` | 잘라내기·복사하기·붙여넣기 할 때 이벤트 발생 | 브라우저 기본 동작을 막아 이벤트 실행을 막을 수 있음. <br> `event.clipboardData` 프로퍼티를 사용하면 클립보드에 저장된 데이터를 읽고 쓸 수 있음 <br> (Firefox를 제외한 모든 브라우저는 `navigator.clipboard` 도 지원) |
