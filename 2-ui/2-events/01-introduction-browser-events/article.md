# 브라우저 이벤트(browser event) 알아보기

*이벤트*는 무언가 일어났다는 신호입니다. 모든 DOM 노드는 이런 신호를 만들어 냅니다(이벤트는 DOM에만 한정되진 않습니다).

아래는 가장 유용하게 쓰이는 DOM 이벤트를 나열해 놓은 것 입니다. 잠시 살펴보도록 합시다:

**마우스 이벤트(Mouse events):**
- `click` -- 요소 위에서 마우스 버튼을 눌렀을 때 (터치스크린이 있는 장치에선 탭 했을 때).
- `contextmenu` -- 요소 위에서 마우스 우클릭 버튼을 눌렀을 때.
- `mouseover` / `mouseout` -- 마우스를 요소 위로 움직였을 때 / 마우스가 요소 밖으로 움직였을 때.
- `mousedown` / `mouseup` -- 요소 위에서 마우스 버튼을 누르고 있을 때 / 마우스 버튼을 뗄 때.
- `mousemove` -- 마우스를 움직일 때.

**폼 요소 이벤트(Form element events):**
- `submit` -- 사용자가 `<form>`을 제출할 때.
- `focus` --  사용자가 `<input>`과 같은 요소에 포커스 할 때(focuses on an element).

**키보드 이벤트(Keyboard events):**
- `keydown` 와 `keyup` -- 사용자가 키보드를 눌렀다 뗄 때.

**문서 이벤트(Document events):**
- `DOMContentLoaded` -- HTML이 전부 로드되고 처리되어서 DOM이 완전히 만들어 졌을 때.

**CSS 이벤트(CSS events):**
- `transitionend` -- CSS-애니메이션(CSS-animation)이 종료되었을 때.

이 외에도 다양한 종류의 이벤트가 있습니다. 다음 장에서 몇몇 이벤트에 대해 자세히 다룰 예정입니다.

## 이벤트 핸들러(Event handlers)

이벤트에 반응하려면 이벤트가 발생하는 시점에 실행되는 *핸들러(handler)* 함수가 필요합니다.  

핸들러는 사용자의 행동에 어떻게 반응할지를 자바스크립트 코드로 표현한 것입니다.

핸들러를 지정하는 방법은 여러가지가 있습니다. 가장 간단한 방법부터 살펴보도록 하겠습니다.

### HTML-속성(HTML-attribute)

핸들러는 HTML 안에서 `on<event>`와 같은 속성을 통해 설정할 수 있습니다.

아래와 같이 `onclick`속성을 사용하면 `input`태그에 `click`핸들러를 적용할 수 있습니다:

```html run
<input value="Click me" *!*onclick="alert('클릭!')"*/!* type="button">
```

마우스를 클릭하면 `onclick`안의 코드가 실행됩니다.

`onclick`안의 따옴표에 주목해주세요. 속성 값이 이미 쌍따옴표로 둘러 쌓여있기 때문에 이렇게 작성한 것입니다. 이 점을 잊고 `onclick="alert("클릭!")"`과 같이 속성 값에서 또 쌍따옴표를 쓰게 되면 코드가 작동하지 않습니다.

HTML-속성(HTML-attribute)값에 긴 코드를 작성하는건 편리한 방법이 아닙니다. 대신 자바스크립트 함수를 만들어서 이를 호출하는 방법을 추천합니다.

버튼을 클릭하면 `countRabbits()`함수가 호출됩니다:

```html autorun height=50
<script>
  function countRabbits() {
    for(let i=1; i<=3; i++) {
      alert("Rabbit number " + i);
    }
  }
</script>

<input type="button" *!*onclick="countRabbits()"*/!* value="토끼를 세봅시다!">
```

HTML 속성은 대소문자를 구분하지 않습니다. `ONCLICK`은 `onClick` 나 `onCLICK`과 동일하게 작동합니다. 하지만 대개의 경우 속성은 `onclick`와 같이 소문자로 작성합니다.

### DOM 프로퍼티(property)

DOM 프로퍼티 `on<event>`을 사용하면 핸들러를 할당할 수 있습니다.

`elem.onclick`을 사용한 예시:

```html autorun
<input id="elem" type="button" value="클릭해주세요">
<script>
*!*
  elem.onclick = function() {
    alert('감사합니다');
  };
*/!*
</script>
```

HTML-속성을 사용해 핸들러를 할당하면 브라우저는 속성의 콘텐츠를 이용해 새로운 함수를 만듭니다. 그리고 DOM 프로퍼티에 함수를 생성합니다.

따라서 이 방법은 위의 예제와 동일한 방법입니다.

**핸들러는 항상 DOM 프로퍼티 안에 있습니다: HTML-속성은 핸들러를 초기화 하는 방법중 하나일 뿐입니다.**

아래 두 코드조각은 동일하게 작동합니다:

1. HTML만 사용해서 작성:

    ```html autorun height=50
    <input type="button" *!*onclick="alert('클릭!')"*/!* value="버튼">
    ```
2. HTML과 JS를 함께 사용해 작성:

    ```html autorun height=50
    <input type="button" id="button" value="버튼">
    <script>
    *!*
      button.onclick = function() {
        alert('클릭!');
      };
    */!*
    </script>
    ```

**`onclick` 프로퍼티는 하나이기 때문에, 단 하나의 이벤트 핸들러만 할당할 수 있습니다.**

아래의 예제코드와 같이 자바스크립트로 핸들러를 하나 더해주면 기존에 존재하는 핸들러는 덮어씌워집니다:

```html run height=50 autorun
<input type="button" id="elem" onclick="alert('이전')" value="클릭해주세요">
<script>
*!*
  elem.onclick = function() { // 기존에 작성된 핸들러를 덮어씀
    alert('이후'); // 이 경고창만 보입니다
  };
*/!*
</script>
```

한편, 이미 존재하는 함수를 핸들러에 직접 할당할 수도 있습니다:

```js
function sayThanks() {
  alert('감사합니다!');
}

elem.onclick = sayThanks;
```

핸들러를 제거하고 싶다면 `elem.onclick = null`과 같이 null을 대입하면 됩니다.

## 요소에 접근하기: this

핸들러에서 `this`는 핸들러가 할당 된 요소를 참조합니다.

아래의 코드에서 보는 바와 같이 `this.innerHTML`에서 this는 `button`을 참조하므로 `button`을 클릭하면 그 안의 콘텐츠를 볼 수 있습니다:

```html height=50 autorun
<button onclick="alert(this.innerHTML)">클릭해주세요</button>
```

## 자주하는 실수

이벤트를 다룰 일이 생기면 아래의 세부요소들에 주의해주세요.

**함수는 `sayThanks`와 같이 할당해야합니다. `sayThanks()`는 작동하지 않습니다.**

```js
// 옳바른 방법
button.onclick = sayThanks;

// 틀린 방법
button.onclick = sayThanks();
```

`sayThanks()`와 같이 괄호를 덧붙이게 되면 함수를 실행한 것이 되어 그 함수의 *결과(result)* 를 할당하게 됩니다. 따라서 코드 마지막 줄의 `onclick`엔 (함수가 아무것도 반환하지 않기 때문에)`undefined`이 대입되고, 원하는 대로 이벤트가 작동하지 않습니다. 

...하지만 마크업(markup)에선 괄호가 필요합니다:

```html
<input type="button" id="button" onclick="sayThanks()">
```

이 차이는 브라우저가 속성을 읽을 때 속성 값을 사용해 핸들러 함수를 만들기 때문에 발생합니다.

따라서 위 예시는 아래와 동일하게 작동합니다:
```js
button.onclick = function() {
*!*
  sayThanks(); // 속성 내용
*/!*
};
```

**문자열(strings)보다는 함수를 쓰세요.**

`elem.onclick = "alert(1)"`은 잘 작동하긴 합니다(역주: 쌍따옴표로 둘러쌓인 문자열을 대입). 호환성 때문에 이렇게 작성해도 문제가 없도록 만들어졌지만, 이 방법을 쓰지 않기를 강력히 권고합니다.

**Don't use `setAttribute` for handlers.**

Such a call won't work:

```js run no-beautify
// a click on <body> will generate errors,
// because attributes are always strings, function becomes a string
document.body.setAttribute('onclick', function() { alert(1) });
```

**DOM-property case matters.**

Assign a handler to `elem.onclick`, not `elem.ONCLICK`, because DOM properties are case-sensitive.

## addEventListener

The fundamental problem of the aforementioned ways to assign handlers -- we can't assign multiple handlers to one event.

For instance, one part of our code wants to highlight a button on click, and another one wants to show a message.

We'd like to assign two event handlers for that. But a new DOM property will overwrite the existing one:

```js no-beautify
input.onclick = function() { alert(1); }
// ...
input.onclick = function() { alert(2); } // replaces the previous handler
```

Web-standard developers understood that long ago and suggested an alternative way of managing handlers using special methods `addEventListener` and `removeEventListener`. They are free of such a problem.

The syntax to add a handler:

```js
element.addEventListener(event, handler[, phase]);
```

`event`
: Event name, e.g. `"click"`.

`handler`
: The handler function.

`phase`
: An optional argument, the "phase" for the handler to work. To be covered later. Usually we don't use it.

To remove the handler, use `removeEventListener`:


```js
// exactly the same arguments as addEventListener
element.removeEventListener(event, handler[, phase]);
```

````warn header="Removal requires the same function"
To remove a handler we should pass exactly the same function as was assigned.

That doesn't work:

```js no-beautify
elem.addEventListener( "click" , () => alert('Thanks!'));
// ....
elem.removeEventListener( "click", () => alert('Thanks!'));
```

The handler won't be removed, because `removeEventListener` gets another function -- with the same code, but that doesn't matter.

Here's the right way:

```js
function handler() {
  alert( 'Thanks!' );
}

input.addEventListener("click", handler);
// ....
input.removeEventListener("click", handler);
```

Please note -- if we don't store the function in a variable, then we can't remove it. There's no way to "read back" handlers assigned by `addEventListener`.
````

Multiple calls to `addEventListener` allow to add multiple handlers, like this:

```html run no-beautify
<input id="elem" type="button" value="Click me"/>

<script>
  function handler1() {
    alert('Thanks!');
  };

  function handler2() {
    alert('Thanks again!');
  }

*!*
  elem.onclick = () => alert("Hello");
  elem.addEventListener("click", handler1); // Thanks!
  elem.addEventListener("click", handler2); // Thanks again!
*/!*
</script>
```

As we can see in the example above, we can set handlers *both* using a DOM-property and `addEventListener`. But generally we use only one of these ways.

````warn header="For some events, handlers only work with `addEventListener`"
There exist events that can't be assigned via a DOM-property. Must use `addEventListener`.

For instance, the event `transitionend` (CSS animation finished) is like that.

Try the code below. In most browsers only the second handler works, not the first one.

```html run
<style>
  input {
    transition: width 1s;
    width: 100px;
  }

  .wide {
    width: 300px;
  }
</style>

<input type="button" id="elem" onclick="this.classList.toggle('wide')" value="Click me">

<script>
  elem.ontransitionend = function() {
    alert("DOM property"); // doesn't work
  };

*!*
  elem.addEventListener("transitionend", function() {
    alert("addEventListener"); // shows up when the animation finishes
  });
*/!*
</script>
```
````

## Event object

To properly handle an event we'd want to know more about what's happened. Not just a "click" or a "keypress", but what were the pointer coordinates? Which key was pressed? And so on.

When an event happens, the browser creates an *event object*, puts details into it and passes it as an argument to the handler.

Here's an example of getting mouse coordinates from the event object:

```html run
<input type="button" value="Click me" id="elem">

<script>
  elem.onclick = function(*!*event*/!*) {
    // show event type, element and coordinates of the click
    alert(event.type + " at " + event.currentTarget);
    alert("Coordinates: " + event.clientX + ":" + event.clientY);
  };
</script>
```

Some properties of `event` object:

`event.type`
: Event type, here it's `"click"`.

`event.currentTarget`
: Element that handled the event. That's exactly the same as `this`, unless you bind `this` to something else, and then `event.currentTarget` becomes useful.

`event.clientX / event.clientY`
: Window-relative coordinates of the cursor, for mouse events.

There are more properties. They depend on the event type, so we'll study them later when we come to different events in details.

````smart header="The event object is also accessible from HTML"
If we assign a handler in HTML, we can also use the `event` object, like this:

```html autorun height=60
<input type="button" onclick="*!*alert(event.type)*/!*" value="Event type">
```

That's possible because when the browser reads the attribute, it creates a handler like this:  `function(event) { alert(event.type) }`. That is: its first argument is called `"event"`, and the body is taken from the attribute.
````


## Object handlers: handleEvent

We can assign an object as an event handler using `addEventListener`. When an event occurs, its `handleEvent` method is called with it.

For instance:


```html run
<button id="elem">Click me</button>

<script>
  elem.addEventListener('click', {
    handleEvent(event) {
      alert(event.type + " at " + event.currentTarget);
    }
  });
</script>
```

In other words, when `addEventListener` receives an object as the handler, it calls `object.handleEvent(event)` in case of an event.

We could also use a class for that:


```html run
<button id="elem">Click me</button>

<script>
  class Menu {
    handleEvent(event) {
      switch(event.type) {
        case 'mousedown':
          elem.innerHTML = "Mouse button pressed";
          break;
        case 'mouseup':
          elem.innerHTML += "...and released.";
          break;
      }
    }
  }

*!*
  let menu = new Menu();
  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
*/!*
</script>
```

Here the same object handles both events. Please note that we need to explicitly setup the events to listen using `addEventListener`. The `menu` object only gets `mousedown` and `mouseup` here, not any other types of events.

The method `handleEvent` does not have to do all the job by itself. It can call other event-specific methods instead, like this:

```html run
<button id="elem">Click me</button>

<script>
  class Menu {
    handleEvent(event) {
      // mousedown -> onMousedown
      let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
      this[method](event);
    }

    onMousedown() {
      elem.innerHTML = "Mouse button pressed";
    }

    onMouseup() {
      elem.innerHTML += "...and released.";
    }
  }

  let menu = new Menu();
  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
</script>
```

Now event handlers are clearly separated, that may be easier to support.

## Summary

There are 3 ways to assign event handlers:

1. HTML attribute: `onclick="..."`.
2. DOM property: `elem.onclick = function`.
3. Methods: `elem.addEventListener(event, handler[, phase])` to add, `removeEventListener` to remove.

HTML attributes are used sparingly, because JavaScript in the middle of an HTML tag looks a little bit odd and alien. Also can't write lots of code in there.

DOM properties are ok to use, but we can't assign more than one handler of the particular event. In many cases that limitation is not pressing.

The last way is the most flexible, but it is also the longest to write. There are few events that only work with it, for instance `transtionend` and `DOMContentLoaded` (to be covered). Also `addEventListener` supports objects as event handlers. In that case the method `handleEvent` is called in case of the event.

No matter how you assign the handler -- it gets an event object as the first argument. That object contains the details about what's happened.

We'll learn more about events in general and about different types of events in the next chapters.
