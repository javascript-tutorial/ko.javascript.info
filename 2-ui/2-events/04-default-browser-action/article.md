# 브라우저 기본 동작

상당수 이벤트는 발생 즉시 브라우저에 의해 특정 동작을 자동으로 수행합니다.

예시:

- 링크를 클릭하면 해당 URL로 이동합니다.
- 폼 전송 버튼을 클릭하면 서버에 폼이 전송됩니다.
- 마우스 버튼을 누른 채로 글자 위에서 커서를 움직이면 글자가 선택됩니다.

그런데 어떨 때는 이런 브라우저 기본 동작 대신에 자바스크립트를 사용해 직접 동작을 구현해야 하는 경우가 생깁니다.

## 브라우저 기본 동작 막기

브라우저 기본 동작을 취소할 수 있는 방법은 두 가지가 있습니다.

- 첫 번째 방법은 `event` 객체를 사용하는 것입니다. 이때 `event` 객체에 구현된 `event.preventDefault()` 메서드를 사용합니다.
- 핸들러가 `addEventListener`가 아닌 `on<event>`를 사용해 할당되었다면 `false`를 반환하게 해 기본 동작을 막을 수도 있습니다.

아래 HTML에선 링크를 클릭해도 해당 URL로 이동하지 않습니다.

```html autorun height=60 no-beautify
<a href="/" onclick="return false">이곳</a>
이나
<a href="/" onclick="event.preventDefault()">이곳을</a> 클릭해주세요.
```

다음 예시에선 여기서 배운 기법을 사용해 자바스크립트를 사용한 메뉴를 만들어보겠습니다.

```warn header="핸들러에서 `false`를 반환하는 것은 예외 상황입니다."
이벤트 핸들러에서 반환된 값은 대개 무시됩니다.

하나의 예외사항이 있는데 바로 `on<event>`를 사용해 할당한 핸들러에서 `false`를 반환하는 것입니다.

이 외의 값들은 `return` 되어도 무시됩니다. `true` 역시 무시되죠.
```

### 메뉴 구현하기

아래와 같은 메뉴를 구현하겠다고 가정해봅시다.

```html
<ul id="menu" class="menu">
  <li><a href="/html">HTML</a></li>
  <li><a href="/javascript">JavaScript</a></li>
  <li><a href="/css">CSS</a></li>
</ul>
```

약간의 CSS를 가미해 메뉴를 꾸미면 아래와 같습니다.

[iframe height=70 src="menu" link edit]

각 항목은 `<button>` 태그가 아닌 링크를 만들 때 쓰이는 `<a>` 태그를 사용해 만들어 보았습니다. 이렇게 한데는 여러 이유가 있습니다.

- 많은 사람이 '마우스 오른쪽 버튼을 클릭'한 후 '새 창에서 열기'를 클릭해 링크를 열기 때문입니다. `<button>` 이나 `<span>`을 쓰면 이 기능을 쓸 수 없습니다.
- 검색 엔진은 인덱싱(색인)을 하는 동안 `<a href="...">` 링크를 따라갑니다.

이런 이유로 `<a>`를 사용하여 각 항목을 만들었습니다. 그런데 위에서 언급했듯이 우리는 여기서 자바스크립트로 클릭 이벤트를 의도적으로 처리하기로 했으므로 실제 자바스크립트를 사용해 브라우저 기본 동작을 취소해 보도록 하겠습니다.

아래와 같이 말이죠.

```js
menu.onclick = function(event) {
  if (event.target.nodeName != 'A') return;

  let href = event.target.getAttribute('href');
  alert( href ); // 서버에서 데이터를 읽어오거나, UI를 새로 만든다거나 하는 등의 작업이 여기에 들어갑니다.

*!*
  return false; // 브라우저 동작을 취소합니다(URL로 넘어가지 않음).
*/!*
};
```

맨 아랫줄 `return false`를 생략하면 예시에서 만든 핸들러가 실행되었을 때 브라우저는 '기본 동작'을 수행합니다. `href`에 지정한 URL로 이동하죠. 그런데 우리가 원하는 건 페이지 이동이 아니기 때문에 브라우저 기본 동작을 취소시키고 원하는 동작을 수행하도록 코드를 작성했습니다.

한편, 여기서도 이벤트 위임을 사용했는데 이렇게 하면 코드가 유연해집니다. 중첩 메뉴를 쉽게 추가할 수 있고 메뉴를 클릭하면 중첩 메뉴가 '스르륵' 나타나도록 CSS를 적용할 수도 있습니다.

````smart header="후속 이벤트"
어떤 이벤트들은 순차적으로 발생합니다. 이런 이벤트들은 첫 번째 이벤트를 막으면 두 번째 이벤트가 일어나지 않습니다.

`<input>` 필드의 `mousedown` 이벤트는 `focus` 이벤트를 유발합니다. 따라서 `mousedown`를 막으면 포커싱도 발생하지 않죠. 

아래 예시에서 첫 번째 `<input>`을 클릭해봅시다. `focus` 이벤트가 발생할 겁니다. 그런데 두 번째 `<input>`는 클릭해도 `focus` 이벤트가 발생하지 않습니다. 

```html run autorun
<input value="focus가 동작합니다," onfocus="this.value=''">
<input *!*onmousedown="return false"*/!* onfocus="this.value=''" value="클릭해 주세요.">
```

두 번째 `<input>`에서 `focus` 이벤트가 발생하지 않는 이유는 `mousedown` 이벤트의 브라우저 기본 동작이 취소되었기 때문입니다. 그런데 다른 방법을 사용하면 `focus` 이벤트를 발생시킬 수 있습니다. 첫 번째 `<input>`에 포커스한 상태에서 `key:Tab` 키를 누르면 포커스가 두 번째 `<input>`으로 넘어갑니다.
````

## addEventListener의 'passive' 옵션

`addEventListener`의 `passive: true` 옵션은 브라우저에게 `preventDefault()`를 호출하지 않겠다고 알리는 역할을 합니다.

이 옵션은 왜 필요한 걸까요?

모바일 기기에는 사용자가 스크린에 손가락을 대고 움직일 때 발생하는 `touchmove`와 같은 이벤트가 있습니다. 이런 이벤트는 기본적으로 스크롤링(scrolling)을 발생시킵니다. 그런데 핸들러의 `preventDefault()`를 사용하면 스크롤링을 막을 수 있습니다.  

브라우저는 스크롤링을 발생시키는 이벤트를 감지했을 때 먼저 모든 핸들러를 처리하는데, 이때 `preventDefault`가 어디에서도 호출되지 않았다고 판단되면, 그제야 스크롤링을 진행합니다. 이 과정에서 불필요한 지연이 생기고, 화면이 '덜덜 떨리는' 현상이 발생합니다.

`passive: true` 옵션은 핸들러가 스크롤링을 취소하지 않을 것이라는 정보를 브라우저에게 알려주는 역할을 합니다. 이 정보를 바탕으로 브라우저는 화면을 최대한 자연스럽게 스크롤링 할 수 있게 하고 이벤트는 적절하게 처리됩니다. 

Firefox, Chrome 같은 몇몇 브라우저에서 `touchstart` 와 `touchmove` 이벤트의 `passive` 는 기본값이 `true`입니다.


## event.defaultPrevented

기본 동작을 막은 경우는 `event.defaultPrevented` 값이 `true` 이고, 그렇지 않은 경우는 `false` 입니다.

이를 이용한 흥미로운 유스 케이스가 있습니다.

<info:bubbling-and-capturing> 챕터에서 배운 `event.stopPropagation()`를 기억하시나요? 여기서 버블링을 막는 게 왜 나쁜지 이야기한 바 있습니다.

가끔은 `event.stopPropagation()`대신에 `event.defaultPrevented`를 사용해 이벤트가 적절히 처리되었다고 다른 이벤트에게 알릴 수도 있습니다.

실제 예시를 통해 이 말을 이해해봅시다.

브라우저에서 마우스 오른쪽 버튼을 클릭하면 `contextmenu`라는 이벤트가 발생합니다. 이 이벤트가 발생하면 컨텍스트 메뉴가 뜨죠. 그런데 컨텍스트 메뉴 대신 다른 걸 띄울 수도 있습니다. 아래와 같이 말이죠.

```html autorun height=50 no-beautify run
<button>마우스 오른쪽 버튼을 클릭하면 컨텍스트 메뉴가 뜹니다.</button>

<button *!*oncontextmenu="alert('커스텀 메뉴가 뜨네요!'); return false"*/!*>
  여기서 마우스 오른쪽 버튼을 클릭해보세요.
</button>
```

이렇게 버튼에서만 자체 컨텍스트 메뉴를 띄우는 대신, 문서 레벨에서도 자체 컨텍스트 메뉴를 뜨게 할 수 있습니다.

마우스 오른쪽 버튼을 클릭하면 가장 가까운 컨텍스트 메뉴가 나타납니다.

```html autorun height=80 no-beautify run
<p>문서 레벨 컨텍스트 메뉴</p>
<button id="elem">버튼 레벨 컨텍스트 메뉴</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    alert("버튼 컨텍스트 메뉴");
  };

  document.oncontextmenu = function(event) {
    event.preventDefault();
    alert("문서 컨텍스트 메뉴");
  };
</script>
```

그런데 위와 같이 구현하면 `elem`을 클릭했을 때 두 개의 컨텍스트 메뉴가 뜨는 문제가 발생합니다. 이벤트가 버블링되면서 버튼 레벨의 컨텍스트 메뉴와 문서 레벨의 컨텍스트 메뉴가 뜨는 것이죠.

어떻게 이 문제를 고칠 수 있을까요? 가장 먼저 떠오르는 생각은 "버튼에 구현된 마우스 우클릭 이벤트를 처리하고 나면 버블링이 멈추도록 하자"일 겁니다. 이때 `event.stopPropagation()`을 사용하겠죠.

```html autorun height=80 no-beautify run
<p>문서 레벨 컨텍스트 메뉴</p>
<button id="elem">버튼 레벨 컨텍스트 메뉴(event.stopPropagation를 사용해 버그 수정)</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
*!*
    event.stopPropagation();
*/!*
    alert("버튼 컨텍스트 메뉴");
  };

  document.oncontextmenu = function(event) {
    event.preventDefault();
    alert("문서 컨텍스트 메뉴");
  };
</script>
```

이제 의도한 대로 버튼에서 마우스 오른쪽 버튼을 클릭하면 버튼 레벨의 컨텍스트 메뉴만 뜹니다. 하지만 이에 대한 대가가 너무 큽니다. 외부 코드를 사용해 더는 마우스 우클릭에 대한 정보를 얻을 수 없기 때문입니다. 통계 자료 수집을 위한 코드가 동작하지 못하죠. 현명하지 못한 해결책입니다. 

`event.stopPropagation()`를 사용하는 것 대신에 `document` 핸들러에서 기본 동작이 막혀있는지 확인하면 문제를 해결할 수 있습니다. 기본 동작이 막혀있는데 이벤트를 핸들링하려는 경우, 이에 반응하지 않도록 하면 되죠.


```html autorun height=80 no-beautify run
<p>문서 레벨 컨텍스트 메뉴(event.defaultPrevented를 확인함)</p>
<button id="elem">버튼 레벨 컨텍스트 메뉴</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    alert("버튼 컨텍스트 메뉴");
  };

  document.oncontextmenu = function(event) {
*!*
    if (event.defaultPrevented) return;
*/!*

    event.preventDefault();
    alert("문서 컨텍스트 메뉴");
  };
</script>
```

이제 모든 기능이 의도한 대로 동작합니다. 중첩 요소가 몇 개 있고, 요소마다 각각의 컨텍스트 메뉴가 있는 경우도 이젠 의도한 대로 동작할 겁니다. 각 `contextmenu` 핸들러에서 `event.defaultPrevented`를 확인하면 되죠.

```smart header="event.stopPropagation()과 event.preventDefault()"
위 예시를 통해 보았듯이, `event.stopPropagation()`과 `return false`로 알려진 `event.preventDefault()`는 명백히 다른 메서드입니다. 두 메서드는 연관성이 없습니다.
```

```smart header="중첩 컨텍스트 메뉴의 아키텍처"
중첩 컨텍스트 메뉴를 구현하는 다른 방법도 있습니다. 전역 객체에 `document.oncontextmenu` 전용 핸들러를 구현하고 다른 핸들러를 저장할 수 있게 메서드를 구현하는 방법입니다.

이 전역 객체는 모든 우클릭을 잡아내서 내부의 핸들러를 빠르게 살펴본 후 적절한 핸들러를 실행시킬 겁니다.

하지만 이 방법을 사용하면 컨텍스트 메뉴에 관련된 각 코드 조각들이 이 객체에 대해 알고 있어야 하고, 자신만의 `contextmenu` 핸들러 대신 객체에 의존하게 된다는 단점도 있습니다.
```

## 요약

각 이벤트에 대응하는 브라우저 기본 동작은 다음과 같습니다.

- `mousedown` -- 마우스가 움직인 곳에서 선택을 시작합니다.
- `<input type="checkbox">`를 `click` -- `input`을 선택/선택해제 합니다.
- `submit` -- 폼 안에서 `<input type="submit">`을 클릭하거나 `key:Enter`를 누르면 이 이벤트가 발생하고, 브라우저는 폼을 서버로 전송합니다.
- `keydown` -- 키를 누르면 텍스트 박스에 글자를 추가하거나 그 외의 다른 동작을 수행합니다.
- `contextmenu` -- 마우스 오른쪽 버튼을 클릭하면 발생하는 이벤트로, 브라우저 컨텍스트 메뉴를 보여줍니다. 
- 이 외의 다양한 기본 동작이 있습니다.

자바스크립트를 사용하면 기본동작을 명시적으로 막을 수 있습니다.

`event.preventDefault()`나 `return false`를 사용하면 이벤트를 막을 수 있습니다. `return false`를 사용하는 방법은 `on<event>`를 통해 할당한 핸들러에서만 동작합니다.

`addEventListener`의 `passive: true` 옵션은 브라우저에게 기본동작을 막지 않을 것이라는 정보를 전달합니다. 이 옵션은 모바일에서 발생하는 `touchstart`와 `touchmove`를 다룰 때 유용합니다. 브라우저는 모든 핸들러를 처리하지 않아도 스크롤링을 시작할 수 있기 때문입니다. 

기본동작을 막은 경우, `event.defaultPrevented` 값은 `true`이고, 그렇지 않은 경우는 `false`입니다.

```warn header="기본 동작을 너무 남용하지 마세요."
기본 동작을 막는 자바스크립트 코드를 추가하면 제약 없이 요소의 동작을 원하는 대로 바꿀 수 있습니다. 링크 `<a>`를 버튼처럼 만들 수 있고, 버튼 `<button>`을 다른 URL로 이동시켜주는 링크처럼 동작하게 할 수도 있습니다.

하지만 HTML 요소의 의미를 지키면서 동작을 바꿔야 합니다. `<a>`는 페이지를 돌아다니는 동작을 해야 하지 버튼처럼 동작해선 안 됩니다.

이렇게 요소가 가진 의미를 해치지 않으면서 코드를 작성하면 '좋은 코드'가 될 뿐만 아니라 접근성 측면에서도 도움이 됩니다.

`<a>`와 기본동작 막기를 조합한 코드를 구상할 때 주의할 것이 있습니다. 사용자는 브라우저 기본 동작을 사용해 마우스 우클릭 등의 방법으로 새 창에서 링크를 열 수 있습니다. 이 기능은 인기가 많죠. 하지만 자바스크립트로 버튼을 조작해 링크처럼 동작하게 만들고 CSS를 이용해 버튼을 링크처럼 꾸미더라도 브라우저에서 제공하는 `<a>` 관련 기능은 버튼에선 작동하지 않습니다.
```
