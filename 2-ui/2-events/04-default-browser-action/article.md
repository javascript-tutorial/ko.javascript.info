# 브라우저 기본 동작(browser default action)

상당수의 이벤트는 브라우저 동작을 자동으로 유발시킵니다.

예:

- 링크를 클릭 -- 정의된 URL로 이동.
- 폼(from)안의 제출(submit)버튼을 클릭 -- 폼을 서버로 전송함.
- 글자 위에서 마우스 버튼을 누르고, 마우스를 움직임 -- 글자를 선택.

이벤트를 다루다 보면, 이런 기본 동작이 필요치 않는 경우도 있습니다. 다행이도, 이런 동작을 막을 수 있는 방법이 있습니다.

## 브라우저 기본 동작 취소하기

두 가지 방법으로 이벤트의 기본 동작을 취소할 수 있습니다:

- 가장 많이 쓰이는 방법은 `event` 객체의 `event.preventDefault()`메서드를 이용하는것입니다.
- 만약 이벤트가 (`addEventListener`이 아니라) `on<event>`를 이용해 할당되었다면, `false`를 반환해 주면 됩니다.

아래 예제에선 링크를 클릭 해도 URL로 연결되지 않습니다.

```html autorun height=60 no-beautify
<a href="/" onclick="return false">Click here</a>
or
<a href="/" onclick="event.preventDefault()">here</a>
```

```warn header="`true`를 반환할 필요는 없습니다"
이벤트 핸들러가 반환하는 값은 대게 무시됩니다.

딱 한가지 예외는 `on<event>`를 이용해 할당한 핸들러에 `return false`이 있을 때 입니다.

이 외에 다른 모든 경우는 반환문이 필요 없고, 있더라도 그 반환문은 처리되지 않습니다.
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

메뉴의 각 항목을 버튼이 아닌 `<a>` 링크로 만들었습니다. 이렇게 작성한 이유는 아래와 같은 이점이 있기 때문입니다:

- 많은 사람들이 "마우스 오른쪽 클릭" 후 "새 창에서 열기"를 통해 링크를 열기 때문입니다. `<button>` 이나 `<span>`을 쓰면 이 기능을 쓸 수 없습니다.
- 검색 엔진은 인덱싱(색인)을 하는 동안 `<a href="...">` 링크를 따라갑니다.

이런 이유 때문에 `<a>`를 사용하여 각 항목을 만들었습니다. 하지만 자바스크립트로 클릭 이벤트를 의도적으로 처리해야 하는 경우가 많기 때문에, 브라우저 기본 동작을 취소해 보도록 하겠습니다.

아래와 같이 말이죠:

```js
menu.onclick = function(event) {
  if (event.target.nodeName != 'A') return;

  let href = event.target.getAttribute('href');
  alert( href ); // ...서버에서 데이터를 읽어오거나, UI를 새로 만든다거나 하는 등의 작업

*!*
  return false; // 브라우저 동작 취소(URL로 넘어가지 않음)
*/!*
};
```

위에서 `return false`를 생략했다면, 브라우저 "기본 동작"이 실행돼 `href` 속성에 정의된 URL로 이동하게 됩니다.

한편, 위에서 작성한 메뉴에 이벤트 위임을 적용하면 메뉴를 좀 더 유연하게 만들 수 있습니다. 중첩 리스트를 더해주고, CSS를 사용해 이 리스트에 "slide down" 애니메이션을 적용해 줄 수 있습니다. 


## 연결되는 이벤트 취소하기

이벤트 흐름이 한 이벤트에서 시작해 다른 이벤트로 흘러갈 때도 있습니다. 이런 경우, 첫 번째 이벤트를 취소하면 다음 이벤트가 발생하지 않습니다.

예를 들어 살펴보겠습니다. `<input>` 필드의 `mousedown` 이벤트는 `focus` 이벤트를 유발합니다. 따라서 `mousedown`를 막으면 포커싱도 발생하지 않습니다. 

아래에서 첫번째 `<input>`을 클릭해보세요. `focus` 이벤트가 발생합니다. 이게 일반적인 경우입니다.

하지만 두번째 `<input>`을 클릭하면 포커스 이벤트가 발생하지 않는 걸 확인할 수 있습니다.

```html run autorun
<input value="Focus works" onfocus="this.value=''">
<input *!*onmousedown="return false"*/!* onfocus="this.value=''" value="Click me">
```

이는 `mousedown`에서 브라우저 동작을 취소했기 때문입니다. 마우스 클릭 말고 다른 방법을 사용하면 포커싱이 가능합니다. 첫번째 input에서 `key:Tab` 키를 눌러 두번째 input으로 이동하면 됩니다. 이렇게 해도 여전히 마우스 클릭을 통한 포커싱은 동작하지 않습니다.

## addEventListener의 "passive" 옵션

`addEventListener`의 옵션에 `passive: true`를 설정하면, `preventDefault()`를 이용해 스크롤 이벤트를 막지 않겠다고 브라우저에게 인식시킵니다. 

이런 기능이 왜 필요한걸까요?

모바일 기기에는 (사용자가 스크린에 손가락을 대고 움직일 때 발생하는 )`touchmove`와 같은 이벤트가 있습니다. 이런 이벤트는 기본적으로 스크롤링(scrolling)을 발생시킵니다. 하지만 핸들러의 `preventDefault()`를 사용하면 기본동작인 스크롤링을 막을 수 있습니다.  

브라우저는 스크롤링을 발생시키는 이벤트를 감지했을 때, 먼저 모든 핸들러를 처리하는데, 이 때 `preventDefault`가 어디에서도 호출되지 않았다고 판단되면, 그제서야 스크롤링을 진행합니다. 이 과정에서 불필요한 지연이 생기고, UI가 "덜덜 떨리는" 현상이 발생합니다.

`passive: true` 옵션은 핸들러가 스크롤링을 취소하지 않을거라는 정보를 브라우저에게 알려주는 역할을 합니다. 이 정보를 바탕으로 브라우저는 최대한 자연스러운 동작으로 스크롤링 되고, 이벤트는 적절하게 처리됩니다. 

Firefox, Chrome 같은 몇몇 브라우저에서 `touchstart` 와 `touchmove` 이벤트의 `passive` 는 기본값이 `true`입니다.


## event.defaultPrevented

기본 동작을 막은 경우는 `event.defaultPrevented` 값이 `true` 이고, 그렇지 않은 경우는 `false` 입니다.

이를 이용할 수 있는 흥미로운 유스 케이스(use case)가 있습니다.

<info:bubbling-and-capturing> 챕터에서 `event.stopPropagation()`를 배우면서 버블링을 막으면 왜 나쁜지 이야기 한 걸 기억하시나요?

버블링을 막는 대신 `event.defaultPrevented`을 사용할 수 있습니다.

이벤트 버블링을 막아야 해결되는 이슈지만, 버블링을 막는 대신 다른 방법으로 해당 이슈를 해결하는 사례를 살펴보도록 합시다. 

브라우저에서 마우스 우클릭시 발생하는 `컨텍스트 메뉴(contextmenu)` 이벤트는 컨텍스트 메뉴를 보여줍니다. 컨텍스트 메뉴가 뜨는걸 말고, 자신만의 메뉴를 보여줄 수도 있습니다. 아래와 같이 말이죠:

```html autorun height=50 no-beautify run
<button>Right-click for browser context menu</button>

<button *!*oncontextmenu="alert('Draw our menu'); return false"*/!*>
  Right-click for our context menu
</button>
```

Now let's say we want to implement our own document-wide context menu, with our options. And inside the document we may have other elements with their own context menus:

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

The problem is that when we click on `elem`, we get two menus: the button-level and (the event bubbles up) the document-level menu.

How to fix it? One of solutions is to think like: "We fully handle the event in the button handler, let's stop it" and use `event.stopPropagation()`:

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

Now the button-level menu works as intended. But the price is high. We forever deny access to information about right-clicks for any outer code, including counters that gather statistics and so on. That's quite unwise.

An alternative solution would be to check in the `document` handler if the default action was prevented? If it is so, then the event was handled, and we don't need to react on it.


```html autorun height=80 no-beautify run
<p>Right-click for the document menu (fixed with event.defaultPrevented)</p>
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

Now everything also works correctly. If we have nested elements, and each of them has a context menu of its own, that would also work. Just make sure to check for `event.defaultPrevented` in each `contextmenu` handler.

```smart header="event.stopPropagation() and event.preventDefault()"
As we can clearly see, `event.stopPropagation()` and `event.preventDefault()` (also known as `return false`) are two different things. They are not related to each other.
```

```smart header="Nested context menus architecture"
There are also alternative ways to implement nested context menus. One of them is to have a special global object with a method that handles `document.oncontextmenu`, and also methods that allow to store various "lower-level" handlers in it.

The object will catch any right-click, look through stored handlers and run the appropriate one.

But then each piece of code that wants a context menu should know about that object and use its help instead of the own `contextmenu` handler.
```

## Summary

There are many default browser actions:

- `mousedown` -- starts the selection (move the mouse to select).
- `click` on `<input type="checkbox">` -- checks/unchecks the `input`.
- `submit` -- clicking an `<input type="submit">` or hitting `key:Enter` inside a form field causes this event to happen, and the browser submits the form after it.
- `wheel` -- rolling a mouse wheel event has scrolling as the default action.
- `keydown` -- pressing a key may lead to adding a character into a field, or other actions.
- `contextmenu` -- the event happens on a right-click, the action is to show the browser context menu.
- ...there are more...

All the default actions can be prevented if we want to handle the event exclusively by JavaScript.

To prevent a default action -- use either `event.preventDefault()` or  `return false`. The second method works only for handlers assigned with `on<event>`.

The `passive: true` option of `addEventListener` tells the browser that the action is not going to be prevented. That's useful for some mobile events, like `touchstart` and `touchmove`, to tell the browser that it should not wait for all handlers to finish before scrolling.

If the default action was prevented, the value of `event.defaultPrevented` becomes `true`, otherwise it's `false`.

```warn header="Stay semantic, don't abuse"
Technically, by preventing default actions and adding JavaScript we can customize the behavior of any elements. For instance, we can make a link `<a>` work like a button, and a button `<button>` behave as a link (redirect to another URL or so).

But we should generally keep the semantic meaning of HTML elements. For instance, `<a>` should preform navigation, not a button.

Besides being "just a good thing", that makes your HTML better in terms of accessibility.

Also if we consider the example with `<a>`, then please note: a browser allows to open such links in a new window (by right-clicking them and other means). And people like that. But if we make a button behave as a link using JavaScript and even look like a link using CSS, then `<a>`-specific browser features still won't work for it.
```
