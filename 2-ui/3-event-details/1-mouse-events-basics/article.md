# 마우스 이벤트

이번 챕터에선 마우스 이벤트와 마우스 이벤트 객체의 프로퍼티에 대해 자세히 다루겠습니다.

마우스 이벤트에 대해 학습하기 전에 주의할 점은, 마우스 이벤트는 '마우스'라는 장치를 통해서만 생기는 것이 아니라 핸드폰이나 태블릿 같은 다른 장치에서도 생긴다는 점입니다.

## 마우스 이벤트 종류

앞서 다음과 같은 이벤트에 대해 알아본 바 있습니다.

`mousedown·mouseup`
: 요소 위에서 마우스 왼쪽 버튼을 누를 때, 마우스 버튼 누르고 있다가 뗄 때 발생합니다.

`mouseover·mouseout`
: 마우스 커서가 요소 바깥에 있다가 요소 안으로 움직일 때, 커서가 요소 위에 있다가 요소 밖으로 움직일 때 발생합니다.

`mousemove`
: 마우스를 움직일 때 발생합니다.

`click`
: 마우스 왼쪽 버튼을 사용해 동일한 요소 위에서 `mousedown` 이벤트와 `mouseup` 이벤트를 연달아 발생시킬 때 실행됩니다.

`dblclick`
: 동일한 요소 위에서 마우스 왼쪽 버튼을 빠르게 클릭할 때 발생합니다. 요즘엔 잘 쓰이지 않습니다.

`contextmenu`
: 마우스 오른쪽 버튼을 눌렀을 때 발생합니다. 참고로 특별한 단축키를 눌러도 마우스 오른쪽 버튼을 눌렀을 때처럼 컨텍스트 메뉴가 나타나게 할 수는 있지만 `contextmenu`라는 마우스 이벤트와 동일하진 않습니다.

이 외에도 다양한 마우스 이벤트가 있는데, 다른 이벤트에 대해선 곧 다루겠습니다.

## 마우스 이벤트 순서

위에서 소개한 마우스 이벤트를 보면서 눈치채셨겠지만, 사용자는 단 하나의 동작을 했어도 실행되는 이벤트는 여러 개일 수 있습니다.

단순하게 마우스 왼쪽 버튼을 클릭하더라도 `mousedown`, `mouseup`, 마지막으로 `click` 이벤트가 발생하죠.

이렇게 동작은 하나지만 여러 이벤트가 실행될 때 실행 순서는 내부 규칙에 따라 결정됩니다.

```online
아래 버튼을 클릭 또는 더블클릭해 실제 마우스 버튼을 클릭했을 때 어떤 일이 발생하는지 알아봅시다.

모든 마우스 이벤트가 버튼 아래 창에 기록되는데, 이벤트 발생 간격이 1초 이상일 때는 이벤트 사이에 가로 선이 추가되도록 해놓았습니다.

이벤트 이름 옆엔 어떤 마우스 버튼이 이벤트를 발생시켰는지를 알려주는 `button` 프로퍼티도 보이는데, `button` 프로퍼티에 대한 내용은 바로 아래에서 설명하도록 하겠습니다.

<input onmousedown="return logMouse(event)" onmouseup="return logMouse(event)" onclick="return logMouse(event)" oncontextmenu="return logMouse(event)" ondblclick="return logMouse(event)" value="마우스 왼쪽이나 오른쪽 버튼을 사용해 클릭해보세요." type="button"> <input onclick="logClear('test')" value="초기화" type="button"> <form id="testform" name="testform"> <textarea style="font-size:12px;height:150px;width:360px;"></textarea></form>
```

## 마우스 버튼

클릭과 연관된 이벤트는 정확히 어떤 버튼에서 이벤트가 발생했는지를 알려주는 `button` 프로퍼티를 지원합니다.

`click` 이벤트는 마우스 왼쪽 버튼을, `contextmenu` 이벤트는 마우스 오른쪽 버튼을 눌렀을 때 발생하기 때문에 `click`과 `contextmenu` 이벤트를 다룰 땐 보통 `button` 프로퍼티를 사용하지 않습니다.

반면 `mousedown`이벤트나 `mouseup` 이벤트를 다룰 땐 해당 이벤트의 핸들러에 `event.button`을 명시해 줘야 할 수 있습니다. 이 이벤트들은 마우스 버튼 어디에서나 발생할 수 있는데 `button` 프로퍼티를 사용해야 정확히 어떤 버튼에서 이벤트가 발생했는지 알 수 있기 때문입니다.

주요 `event.button` 프로퍼티 값을 정리하면 다음과 같습니다.

| 버튼 | `event.button` |
|--------------|----------------|
| 왼쪽(주요 버튼) | 0 |
| 가운데(보조 버튼) | 1 |
| 오른쪽 (두 번째 버튼) | 2 |
| X1(뒤로 가기 버튼) | 3 |
| X2(앞으로 가기 버튼) | 4 |

상당수의 마우스는 왼쪽, 오른쪽 버튼만 가지고 있기 때문에 이 마우스들이 만들어내는 `event.button` 값은 `0`이나 `2`가 됩니다. 터치를 지원하는 기기들도 사람이 해당 기기를 터치했을 때 유사한 이벤트를 만듭니다.

참고로 `buttons`라는 프로퍼티도 있는데, 이 프로퍼티는 여러 개의 버튼을 한꺼번에 눌렀을 때 해당 버튼들에 대한 정보를 정수 형태로 저장해 줍니다. 실무에서 `buttons` 프로퍼티를 만날 일은 극히 드물긴 하지만 혹시라도 필요하다면[MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)에서 확인해보시길 바랍니다.

```warn header="역사의 뒤안길로 사라진 `event.which`"
오래된 코드를 보다 보면 `event.which`라는 프로퍼티를 발견할 수 있습니다. `event.which` 프로퍼티는 어떤 버튼을 클릭했는지 알려주는 비표준 프로퍼티로 다음과 같은 값을 가집니다.

- `event.which == 1` – 왼쪽 버튼
- `event.which == 2` – 가운데 버튼
- `event.which == 3` – 오른쪽 버튼

`event.which`는 이젠 지원하지 않는 프로퍼티이기 때문에 사용하지 마시길 바랍니다.
```

## shift, alt, ctrl, meta 프로퍼티

마우스 이벤트는 이벤트가 발생할 때 함께 누른 보조키가 무엇인지를 알려주는 프로퍼티를 지원합니다.

보조키 별로 지원하는 프로퍼티는 다음과 같습니다.

- `shiftKey`: `key:Shift` 키
- `altKey`: `key:Alt` (MacOS에선 `key:Opt` 키)
- `ctrlKey`: `key:Ctrl` 키
- `metaKey`: MacOS에서 `key:Cmd` 키

마우스 이벤트가 발생하는 도중에 해당 키가 함께 눌러졌다면 프로퍼티 값은 `true`가 됩니다.

예시를 살펴봅시다. 아래 버튼은 `key:Alt+Shift` 키와 마우스 왼쪽 버튼을 함께 클릭했을 때만 동작합니다.

```html autorun height=60
<button id="button">Alt, Shift 키를 누른 상태에서 클릭해주세요!</button>

<script>
  button.onclick = function(event) {
*!*
    if (event.altKey && event.shiftKey) {
*/!*
      alert('야호!');
    }
  };
</script>
```

```warn header="MacOS에선 `Ctrl` 대신 `Cmd`를 사용하세요!"
Windows와 Linux는 `key:Alt`, `key:Shift`, `key:Ctrl` 키를 지원합니다. 한편 MacOS에선 세 보조키 이외에 `key:Cmd`라는 키를 추가로 지원하는데, `key:Cmd` 키에 해당하는 프로퍼티로는 `metaKey`가 있습니다.

응용프로그램 대부분은 Windows, Linux에선 `key:Ctrl`, MacOS에선 `key:Cmd`를 사용해 단축키를 조합하곤 합니다.

이런 암묵적인 규칙 때문에 Windows 사용자가 `key:Ctrl+Enter`나 `key:Ctrl+A` 키를 눌렀을 때 동작하는 기능이 Mac에선 `key:Cmd+Enter`나 `key:Cmd+A`를 눌렀을 때 돌아갑니다.

따라서 Mac 사용자도 지원하는 프로그램을 만들려면 `key:Ctrl`키와 `click`이벤트가 발생했을 때 나타나는 효과가 `key:Cmd`키와 `click`이벤트가 발생했을 때 나타나는 효과와 동일하도록 코드를 작성해야 합니다.

물론 Mac 사용자가 `key:Ctrl` 키와 클릭을 동시에 하도록 강제할 수 있긴 합니다. 그런데 MacOS는 `key:Ctrl` 키와 마우스 왼쪽 버튼을 함께 누른 경우 마우스 오른쪽 버튼을 누른 것으로 해석하기 때문에 문제가 발생합니다. Windows, Linux에선 `click` 이벤트로 해석될 수 있는 동작이 MacOS에선 `contextmenu` 이벤트로 해석되는 것이죠.

따라서 모든 사용자가 운영체제 종류에 상관없이 동일한 경험을 하게 하려면 `ctrlKey` 프로퍼티를 사용하는 코드엔 `metaKey`도 함께 넣어주세요.

`if (event.ctrlKey || event.metaKey)`같이 말이죠.
```

```warn header="모바일 장치"
사용자가 키보드가 있는 기기를 사용할 경우, 단축키를 지원하면 사용자 경험을 상승시켜줄 수 있습니다.

그런데 모바일 장치같이 기기에 키보드가 없는 경우도 많기 때문에 사용자 경험을 해치지 않으려면 보조 키가 없는 사용자를 위한 지원하는 방법도 고려하며 프로그램을 만들어야 합니다.
```

## clientX, clientY와 pageX, pageY

마우스 이벤트는 두 종류의 좌표 정보를 지원합니다. 

1. 클라이언트 좌표: `clientX`와 `clientY`
2. 페이지 좌표: `pageX`와 `pageY`

두 정보에 대한 차이는 <info:coordinates> 챕터에서 다룬 바 있습니다.

그럼에도 불구하고 두 좌표에 대해 요약하자면 다음과 같습니다. 클라이언트 좌표인 `clientX`와 `clientY`는 웹 문서를 기준으로 각각 왼쪽에서 얼마나 떨어져 있는지, 위에서 얼마나 떨어져 있는지를 나타내는데 페이지가 스크롤 되어도 변하지 않습니다. 반면 `pageX`와 `pageY`는 창 왼쪽 위를 기준으로 얼마나 떨어져 있는지를 나타내며 페이지를 스크롤하면 값도 변합니다.

예를 들어봅시다. 사이즈가 500x500인 창에서 마우스 커서를 왼쪽 위 가장자리로 옮기면 페이지를 어디로 스크롤 하든 상관없이 `clientX`, `clientY` 값이 `0`이 됩니다.  

커서를 화면 정 가운데로 옮기면 마찬가지로 스크롤 바 위치에 상관없이 `clientX`, `clientY` 값이 각각 `250`이 되죠. `position:fixed`와 유사하다고 보시면 됩니다.

````online
커서를 input 필드 안으로 옮겨 `clientX`, `clientY` 값이 어떻게 변하는지 살펴봅시다. 참고로 아래 예시는 `iframe`안에서 구현되도록 해놓아서 좌표 정보가 `iframe`을 기준으로 계산됩니다.

```html autorun height=50
<input onmousemove="this.value=event.clientX+':'+event.clientY" value="Mouse over me">
```
````

## mousedown 이벤트와 선택 막기

글자 위에서 마우스를 더블클릭하면 글자가 선택되는데, 이런 기본 동작이 사용자 경험을 해칠 때가 있습니다.

`dblclick` 이벤트가 발생하면 얼럿창을 띄우고 싶다고 가정해봅시다. 제대로 코드를 작성했음에도 불구하고 핸들러가 실행되는 동시에 글자가 선택되는 불필요한 부수효과가 발생하였습니다.

```html autorun height=50
<span ondblclick="alert('dblclick')">이곳을 더블클릭해주세요.</span>
```

이외에도 마우스 왼쪽 버튼을 누른 채 커서를 이리저리 움직이면 글자가 선택되는 부수효과 역시 사용자 경험을 해칠 수 있습니다.

이렇게 불필요하게 글자가 선택되는 것을 막아주는 방법은 다양한데, <info:selection-range>에서 확인해 볼 수 있습니다.

여러 방법 중, 예시에서 보여드린 상황에 가장 적합한 방법은 `mousedown` 이벤트가 발생할 때 나타나는 브라우저 기본 동작을 막는 것입니다. 이렇게 하면 글자가 선택되는 부수효과를 막을 수 있습니다.


```html autorun height=50
...
<b ondblclick="alert('클릭!')" *!*onmousedown="return false"*/!*>
  여기를 더블클릭해주세요.
</b>
...
```

기본 동작을 막았기 때문에 굵은 글씨가 있는 영역에서 더블클릭을 해도 단어가 선택되지 않고, 글자를 드래그해도 글자가 선택되지 않습니다.

그런데 이때 눈여겨봐야 할 점은 기본동작을 막았음에도 불구하고 글자를 선택할 수 있는 방법이 여전히 있다는 점입니다. `...`이 있는 부분부터 시작해 드래그를 시작하면 굵은 글씨를 선택할 수 있죠.

````smart header="복사 막기"
콘텐츠를 보호하려는 목적으로 방문자가 내용을 복사, 붙여넣기 하는 걸 막으려면 `oncopy`라는 이벤트를 활용하면 됩니다.

```html autorun height=80 no-beautify
<div *!*oncopy="alert('불법 복제를 예방하기 복사 기능을 막아놓았습니다!');return false"*/!*>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent convallis ultrices lacus ut dictum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
</div>
```
바로위 상자 안에 있는 글자를 선택한 후 복사하려고하면 `oncopy` 이벤트의 기본 기능을 막아놓았기 때문에 복사가 안되는 것을 확인할 수 있습니다.

페이지 소스 보기를 할 수 있는 사용자라면 이런 방법이 소용이 없겠지만 모든 사용자가 소스 보기를 할 수 있는 건 아니기 때문에 이런 식으로 불법 복제를 어느 정도 막을 수 있죠.
````

## 요약

마우스 이벤트는 다음과 같은 프로퍼티를 지원합니다.

- 버튼 관련: `button`
- 보조키 관련: `altKey`, `ctrlKey`, `shiftKey`와 MacOS 전용 `metaKey`. 해당 키를 누른 경우에 프로퍼티 값이 `true`가 됩니다.
  - `key:Ctrl`를 고려한 코드를 작성하고 있다면 MacOS 사용자는 주로 `key:Cmd` 키를 사용한다는 점을 고려해서 `if (e.metaKey || e.ctrlKey)`같이 모든 사용자를 지원할 수 있도록 코드를 작성해야 합니다. 

- 클라이언트 좌표 관련: `clientX`, `clientY`
- 페이지 좌표 관련: `pageX`, `pageY`

`mousedown` 이벤트가 발생하면 브라우저 기본 동작 때문에 글자가 선택됩니다. 이런 기본 동작이 사용자 경험을 해친다면 기본동작을 막아서 문제를 해결할 수 있습니다.

다음 챕터에선 포인터(커서)가 움직일 때 발생하는 이벤트와 포인터가 움직일 때 포인터 아래에 있는 요소들을 어떻게 추적할 수 있는지에 대해 자세히 다루겠습니다.
