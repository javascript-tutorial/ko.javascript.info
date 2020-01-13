# 브라우저 기본 동작(browser default action)

Many events automatically lead to certain actions performed by the browser.

예:

- A click on a link - initiates navigation to its URL.
- A click on a form submit button - initiates its submission to the server.
- Pressing a mouse button over a text and moving it - selects the text.

If we handle an event in JavaScript, we may not want the corresponding browser action to happen, and want to implement another behavior instead.

## 브라우저 기본 동작 취소하기

두 가지 방법으로 이벤트의 기본 동작을 취소할 수 있습니다:

- The main way is to use the `event` object. There's a method `event.preventDefault()`.
- If the handler is assigned using `on<event>` (not by `addEventListener`), then returning `false` also works the same.

In this HTML a click on a link doesn't lead to navigation, browser doesn't do anything:

```html autorun height=60 no-beautify
<a href="/" onclick="return false">Click here</a>
or
<a href="/" onclick="event.preventDefault()">here</a>
```

In the next example we'll use this technique to create a JavaScript-powered menu.

```warn header="Returning `false` from a handler is an exception"
The value returned by an event handler is usually ignored.

The only exception is `return false` from a handler assigned using `on<event>`.

In all other cases, `return` value is ignored. In particular, there's no sense in returning `true`.
```

### 예제: 메뉴

아래와 같이 사이트 메뉴가 있다고 해봅시다:

```html
<ul id="menu" class="menu">
  <li><a href="/html">HTML</a></li>
  <li><a href="/javascript">JavaScript</a></li>
  <li><a href="/css">CSS</a></li>
</ul>
```

약간의 CSS를 가미해 아래와 같이 꾸며보았습니다:

[iframe height=70 src="menu" link edit]

Menu items are implemented as HTML-links `<a>`, not buttons `<button>`. There are several reasons to do so, for instance:

- 많은 사람이 "마우스 오른쪽 클릭" 후 "새 창에서 열기"를 통해 링크를 열기 때문입니다. `<button>` 이나 `<span>`을 쓰면 이 기능을 쓸 수 없습니다.
- 검색 엔진은 인덱싱(색인)을 하는 동안 `<a href="...">` 링크를 따라갑니다.

이런 이유로 `<a>`를 사용하여 각 항목을 만들었습니다. 하지만 자바스크립트로 클릭 이벤트를 의도적으로 처리해야 하는 경우가 많기 때문에, 브라우저 기본 동작을 취소해 보도록 하겠습니다.

아래와 같이 말이죠:

```js
menu.onclick = function(event) {
  if (event.target.nodeName != 'A') return;

  let href = event.target.getAttribute('href');
  alert( href ); // 서버에서 데이터를 읽어오거나, UI를 새로 만든다거나 하는 등의 작업

*!*
  return false; // 브라우저 동작 취소(URL로 넘어가지 않음)
*/!*
};
```

If we omit `return false`, then after our code executes the browser will do its "default action" -- navigating to the URL in `href`. And we don't need that here, as we're handling the click by ourselves.

By the way, using event delegation here makes our menu very flexible. We can add nested lists and style them using CSS to "slide down".

````smart header="Follow-up events"
Certain events flow one into another. If we prevent the first event, there will be no second.

예를 들어 살펴보겠습니다. `<input>` 필드의 `mousedown` 이벤트는 `focus` 이벤트를 유발합니다. 따라서 `mousedown`를 막으면 포커싱도 발생하지 않습니다. 

Try to click on the first `<input>` below -- the `focus` event happens. But if you click the second one, there's no focus.

```html run autorun
<input value="Focus works" onfocus="this.value=''">
<input *!*onmousedown="return false"*/!* onfocus="this.value=''" value="Click me">
```

That's because the browser action is canceled on `mousedown`. The focusing is still possible if we use another way to enter the input. For instance, the `key:Tab` key to switch from the 1st input into the 2nd. But not with the mouse click any more.
````

## addEventListener의 "passive" 옵션

`addEventListener`의 옵션에 `passive: true`를 설정하면, `preventDefault()`를 이용해 스크롤 이벤트를 막지 않겠다고 브라우저에게 인식시킵니다. 

이런 기능이 왜 필요한 걸까요?

모바일 기기에는 (사용자가 스크린에 손가락을 대고 움직일 때 발생하는 )`touchmove`와 같은 이벤트가 있습니다. 이런 이벤트는 기본적으로 스크롤링(scrolling)을 발생시킵니다. 하지만 핸들러의 `preventDefault()`를 사용하면 기본동작인 스크롤링을 막을 수 있습니다.  

브라우저는 스크롤링을 발생시키는 이벤트를 감지했을 때, 먼저 모든 핸들러를 처리하는데, 이때 `preventDefault`가 어디에서도 호출되지 않았다고 판단되면, 그제야 스크롤링을 진행합니다. 이 과정에서 불필요한 지연이 생기고, UI가 "덜덜 떨리는" 현상이 발생합니다.

`passive: true` 옵션은 핸들러가 스크롤링을 취소하지 않을 것이라는 정보를 브라우저에게 알려주는 역할을 합니다. 이 정보를 바탕으로 브라우저는 최대한 자연스러운 동작으로 스크롤링 되고, 이벤트는 적절하게 처리됩니다. 

Firefox, Chrome 같은 몇몇 브라우저에서 `touchstart` 와 `touchmove` 이벤트의 `passive` 는 기본값이 `true`입니다.


## event.defaultPrevented

기본 동작을 막은 경우는 `event.defaultPrevented` 값이 `true` 이고, 그렇지 않은 경우는 `false` 입니다.

이를 이용할 수 있는 흥미로운 유스 케이스(use case)가 있습니다.

<info:bubbling-and-capturing> 챕터의 `event.stopPropagation()`를 기억하시나요? 여기서 버블링을 막는 게 왜 나쁜지 이야기한 바 있습니다.

Sometimes we can use `event.defaultPrevented` instead, to signal other event handlers that the event was handled.

Let's see a practical example.

`컨텍스트 메뉴(contextmenu)`는 브라우저에서 마우스 우클릭 시 발생하는 이벤트입니다. 이 이벤트가 발생하면 컨텍스트 메뉴가 뜨죠. 컨텍스트 메뉴 대신 다른 걸 띄울 수도 있습니다. 아래와 같이 말이죠:

```html autorun height=50 no-beautify run
<button>Right-click shows browser context menu</button>

<button *!*oncontextmenu="alert('Draw our menu'); return false"*/!*>
  Right-click shows our context menu
</button>
```

Now, in addition to that context menu we'd like to implement document-wide context menu.

Upon right click, the closest context menu should show up.

```html autorun height=80 no-beautify run
<p>Right-click here for the document context menu</p>
<button id="elem">Right-click here for the button context menu</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Document context menu");
  };
</script>
```

`elem`을 클릭했을 때 두 개의 컨텍스트 메뉴가 뜨는 문제가 발생합니다: 버튼 레벨의 메뉴와 이벤트가 버블링되면서 발생하는 문서 레벨의 메뉴가 뜨죠.

How to fix it? One of solutions is to think like: "When we handle right-click in the button handler, let's stop its bubbling" and use `event.stopPropagation()`:

```html autorun height=80 no-beautify run
<p>Right-click for the document menu</p>
<button id="elem">Right-click for the button menu (fixed with event.stopPropagation)</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
*!*
    event.stopPropagation();
*/!*
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Document context menu");
  };
</script>
```

이제 의도한 대로 버튼 레벨의 메뉴만 동작합니다. 하지만 이에 대한 대가가 너무 큽니다. 외부 코드에서 더는 마우스 우클릭에 대한 정보를 얻을 수 없기 때문입니다. 통계 자료 수집을 위한 카운터 등이 동작하지 못하는 거죠. 현명하지 못한 해결책입니다. 

`document`에 할당된 핸들러에서 기본 동작이 막혀있는지 확인하면 이를 해결할 수 있습니다. 기본 동작이 막혀있는데 이벤트를 핸들링하려는 경우, 이에 반응하지 않도록 하면 되는 거죠.


```html autorun height=80 no-beautify run
<p>Right-click for the document menu (added a check for event.defaultPrevented)</p>
<button id="elem">Right-click for the button menu</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
*!*
    if (event.defaultPrevented) return;
*/!*

    event.preventDefault();
    alert("Document context menu");
  };
</script>
```

이제 모든 기능이 의도한 대로 동작합니다. 중첩 요소가 몇 개 있고, 요소마다 각각의 컨텍스트 메뉴가 있는 경우도 이젠 의도한 대로 동작할 것입니다. 각 `contextmenu` 핸들러에서 `event.defaultPrevented`를 확인해서 말이죠.

```smart header="event.stopPropagation()와 event.preventDefault()"
위 예제를 통해 보았듯이, `event.stopPropagation()`와 (`return false`로 알려진)`event.preventDefault()` 는 명백히 다른 메서드입니다. 두 메서드는 연관성이 없습니다.
```

<<<<<<< HEAD
```smart header="중첩 컨텍스트 메뉴의 아키텍처"
There are also alternative ways to implement nested context menus. One of them is to have a single global object with a handler for `document.oncontextmenu`, and also methods that allow to store other handlers in it.
=======
```smart header="Nested context menus architecture"
There are also alternative ways to implement nested context menus. One of them is to have a single global object with a handler for `document.oncontextmenu`, and also methods that allow us to store other handlers in it.
>>>>>>> a4a84083a7656f2b25de8b766b2457d3aae17874

이 전역 객체는 모든 우클릭을 잡아내서 내부의 핸들러를 빠르게 살펴본 후, 적절한 핸들러를 실행시킬 겁니다.

하지만 이렇게 구현하게 되면, 컨텍스트 메뉴에 관련된 각 코드 조각들이 이 객체에 대해 알고 있어야만 하고, 자신만의 `contextmenu` 핸들러 대신 객체의 도움을 사용해야만 합니다.
```

## 요약

브라우저 환경에서의 다양한 기본 동작:

- `mousedown` -- (마우스가 움직인 곳에서) 선택을 시작합니다.
- `<input type="checkbox">`을 `click` -- `input`을 선택/선택해제(check/uncheck) 합니다.
- `submit` -- 폼 안에서 `<input type="submit">`을 클릭하거나 `key:Enter`를 눌렀을 때 이 이벤트가 발생하고, 브라우저는 폼을 서버로 전송합니다.
- `keydown` -- 키를 누르면 텍스트 박스에 글자를 추가하거나 그 외의 다른 동작을 수행합니다.
- `contextmenu` -- 마우스 오른쪽 버튼을 클릭하면 발생하는 이벤트로, 브라우저 컨텍스트 메뉴를 보여줍니다. 
- ...그 외 다양한 동작이 있습니다...

모든 기본동작은 자바스크립트를 이용하여 이벤트를 명시적으로 다룸으로써 막을 수 있습니다.

`event.preventDefault()` 나 `return false`를 사용하면 이벤트를 막을 수 있습니다. 두 번째 메서드는 `on<event>`를 통해 할당한 핸들러에서만 동작합니다.

`addEventListener`의 `passive: true` 옵션은 브라우저에게 기본동작을 막지 않을 것이라는 정보를 전달합니다. 이 옵션은 모바일에서 발생하는 `touchstart` 와 `touchmove`를 다룰 때 유용합니다. 브라우저는 모든 핸들러를 처리하지 않아도 스크롤링을 시작할 수 있기 때문입니다. 

기본동작을 막은 경우, `event.defaultPrevented` 값은 `true`이고, 그렇지 않은 경우는 `false` 값을 갖습니다.

```warn header="Stay semantic, don't abuse"
기본 동작을 막고 자바스크립트 코드를 추가하면 요소의 동작을 원하는 대로 바꿀 수 있습니다. 기술적인 제약 없이 말이죠. 링크 `<a>`를 버튼처럼 만들 수 있고, 버튼 `<button>`을 (다른 URL로 전송시켜주는) 링크처럼 동작하게 할 수도 있습니다.

하지만 HTML 요소의 의미를 지키면서 동작을 바꿔야 합니다. `<a>`는 페이지를 돌아다니는 동작을 해야 하지 버튼처럼 동작해선 안 됩니다.

이렇게 요소가 가진 의미를 해치지 않으면서 코드를 작성하면 "좋은 코드"가 될 뿐만 아니라, 접근성 측면에서도 도움이 됩니다.

<<<<<<< HEAD
`<a>`를 이용한 예제를 고려한다면 다음에 주의하시길 권합니다: 브라우저가 제공해주는 기능 덕분에 사용자는 마우스 우클릭 등의 방법을 이용해 새 창에서 링크를 열 수 있습니다. 이 기능은 인기가 많죠. 하지만, 버튼을 자바스크립트 코드로 조작해 링크처럼 동작하게 만들고, CSS를 이용해 링크처럼 꾸미더라도, 브라우저가 제공하는 `<a>`와 관련된 기능은 버튼에선 작동하지 않습니다.
=======
Also if we consider the example with `<a>`, then please note: a browser allows us to open such links in a new window (by right-clicking them and other means). And people like that. But if we make a button behave as a link using JavaScript and even look like a link using CSS, then `<a>`-specific browser features still won't work for it.
>>>>>>> a4a84083a7656f2b25de8b766b2457d3aae17874
```
