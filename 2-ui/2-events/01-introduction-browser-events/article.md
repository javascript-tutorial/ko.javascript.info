# 브라우저 이벤트 소개

*이벤트(event)* 는 무언가 일어났다는 신호입니다. 모든 DOM 노드는 이런 신호를 만들어 냅니다(이벤트는 DOM에만 한정되진 않습니다).

아래는 유용하게 쓰이는 DOM 이벤트 리스트입니다. 잠시 살펴보도록 합시다:

**마우스 이벤트(Mouse events):**
- `click` -- 요소(element) 위에서 마우스 버튼을 눌렀을 때 (터치스크린이 있는 장치에선 탭 했을 때).
- `contextmenu` -- 요소 위에서 마우스 우클릭 버튼을 눌렀을 때.
- `mouseover` / `mouseout` -- 마우스를 요소 위로 움직였을 때 / 마우스가 요소 밖으로 움직였을 때.
- `mousedown` / `mouseup` -- 요소 위에서 마우스 버튼을 누르고 있을 때 / 마우스 버튼을 뗄 때.
- `mousemove` -- 마우스를 움직일 때.

**폼 요소 이벤트(Form element events):**
- `submit` -- 사용자가 `<form>`을 제출할 때.
- `focus` --  사용자가 `<input>`과 같은 요소에 포커스 할 때.

**키보드 이벤트(Keyboard events):**
- `keydown` 와 `keyup` -- 사용자가 키보드를 누르거나 뗄 때.

**문서 이벤트(Document events):**
- `DOMContentLoaded` -- HTML이 전부 로드되고 처리되어서, DOM 생성이 완료되었을 때.

**CSS 이벤트(CSS events):**
- `transitionend` -- CSS-애니메이션(CSS-animation)이 종료되었을 때.

이 외에도 다양한 이벤트가 있습니다. 다음 주제에서 몇몇 이벤트에 대해 자세히 다룰 예정입니다.

## 이벤트 핸들러(Event handlers)

이벤트에 반응하려면 이벤트가 발생하는 시점에 실행되는 *핸들러(handler)* 함수를 할당해야 합니다.  

핸들러는 사용자의 행동에 어떻게 반응할지를 자바스크립트 코드로 표현한 것입니다.

핸들러를 할당하는 방법은 여러 가지가 있습니다. 가장 간단한 방법부터 살펴보도록 하겠습니다.

### HTML-속성(HTML-attribute)

핸들러는 HTML 안에서 `on<event>`와 같은 속성을 통해 할당할 수 있습니다.

아래와 같이 `onclick`속성을 사용하면 `input`태그에 `click`핸들러를 할당할 수 있습니다:

```html run
<input value="Click me" *!*onclick="alert('클릭!')"*/!* type="button">
```

마우스를 클릭하면 `onclick`안의 코드가 실행됩니다.

`onclick`안의 따옴표에 주목해주세요. 속성값이 이미 쌍따옴표로 둘러 쌓여있기 때문에 이렇게 작성한 것입니다. 이 점을 잊고 `onclick="alert("클릭!")"`과 같이 속성값 내부에 또 쌍따옴표를 쓰게 되면 코드가 작동하지 않습니다.

HTML-속성(HTML-attribute)값에 긴 코드를 할당하는 건 추천하지 않습니다. 만약 코드가 길다면, 자바스크립트 함수를 만들어서 이를 호출하는 방법을 추천합니다.

아래 버튼을 클릭하면 `countRabbits()`함수가 호출됩니다:

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

HTML 속성은 대소문자를 구분하지 않기 때문에, `ONCLICK`은 `onClick`이나 `onCLICK`과 동일하게 작동합니다. 하지만 대개 속성값은 `onclick`와 같이 소문자로 작성합니다.

### DOM 프로퍼티

DOM 프로퍼티(property) `on<event>`을 사용하면 핸들러를 할당할 수 있습니다.

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

HTML-속성을 사용해 핸들러를 할당하면, 브라우저는 속성을 읽고, 속성의 콘텐츠를 이용해 새로운 함수를 만듭니다. 그리고 DOM 프로퍼티에 그 함수를 할당합니다.

따라서 DOM 프로퍼티를 사용해 핸들러를 만든 위 예시는 HTML 속성을 사용해 만든 예시와 동일하게 작동합니다.

**핸들러는 항상 DOM 프로퍼티에 할당됩니다: HTML-속성을 사용해 핸들러를 정의하는 방법은 핸들러를 초기화하는 여러 방법 중 하나일 뿐입니다.**

아래 두 코드는 동일하게 작동합니다:

1. HTML만 사용:

    ```html autorun height=50
    <input type="button" *!*onclick="alert('클릭!')"*/!* value="버튼">
    ```
2. HTML과 자바스크립트를 함께 사용:

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

**`onclick` 프로퍼티는 유일하기 때문에, 복수의 이벤트 핸들러를 할당할 수 없습니다.**

아래의 예제와 같이 핸들러를 하나 추가하면, 기존에 존재하는 핸들러는 덮어씌워 집니다:

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

핸들러를 제거하고 싶다면 `elem.onclick = null`과 같이 null을 할당하면 됩니다.

## this로 요소에 접근하기

핸들러 내부에 쓰인 `this`는 핸들러가 할당된 요소를 참조합니다.

아래 코드의 `this.innerHTML`에서 this는 `button`을 참조하므로 `button`을 클릭하면 그 안의 콘텐츠를 볼 수 있습니다:

```html height=50 autorun
<button onclick="alert(this.innerHTML)">클릭해주세요</button>
```

## 자주 하는 실수

<<<<<<< HEAD
이벤트를 다룰 때, 아래의 주의사항을 기억하세요.
=======
If you're starting to work with events -- please note some subtleties.
>>>>>>> ff042a03191dfad1268219ae78758193a5803b38

**함수는 `sayThanks`와 같이 할당해야 합니다. `sayThanks()`과 같이 쓰면 동작하지 않습니다.**

```js
// 올바른 방법
button.onclick = sayThanks;

// 틀린 방법
button.onclick = sayThanks();
```

`sayThanks()`와 같이 괄호를 덧붙이게 되면, 함수가 호출됩니다. 따라서 위 예제의 마지막 줄에선 함수호출의 *결괏(result)값*이 프로퍼티에 할당합니다. `onclick`엔 (함수가 아무것도 반환하지 않기 때문에)`undefined`이 할당되고, 이벤트가 원하는 대로 동작하지 않습니다. 

...On the other hand, in the markup we do need the parentheses:

```html
<input type="button" id="button" onclick="sayThanks()">
```

The difference is easy to explain. When the browser reads the attribute, it creates a handler function with *body from its content*: `sayThanks()`.

So the markup generates this property:
```js
button.onclick = function() {
*!*
  sayThanks(); // 속성 내용
*/!*
};
```

**문자열(strings)보다는 함수를 쓰세요.**

<<<<<<< HEAD
`elem.onclick = "alert(1)"`은 잘 작동하긴 합니다(역주: 큰따옴표로 둘러싸인 문자열을 대입). 호환성 때문에 이렇게 작성해도 문제가 없도록 만들어졌지만, 이 방법을 쓰지 않기를 강력히 권고합니다.
=======
The assignment `elem.onclick = "alert(1)"` would work too. It works for compatibility reasons, but is strongly not recommended.
>>>>>>> ff042a03191dfad1268219ae78758193a5803b38

**`setAttribute`를 써서 핸들러를 할당하지 마세요.**

아래 코드는 작동하지 않습니다:

```js run no-beautify
// <body>를 클릭하면 에러가 발생합니다.
// 속성은 항상 문자열이기 때문에, 함수가 문자열이 되어버리기 때문입니다
document.body.setAttribute('onclick', function() { alert(1) });
```

**DOM-프로퍼티는 대/소문자를 구분합니다.**

핸들러 할당 시 `elem.onclick`는 괜찮지만, `elem.ONCLICK`는 안됩니다. DOM 프로퍼티는 대/소문자를 구분하기 때문입니다.

## addEventListener

HTML-속성과 DOM 프로퍼티를 이용한 이벤트 핸들러 할당 방식엔 근본적인 문제가 있습니다. 하나의 이벤트에 복수의 핸들러를 할당할 수 없다는 문제이죠.

예를 들어, 클릭 시 버튼을 강조하면서 메시지를 보여주고 싶다고 해 봅시다.

두 개의 이벤트 핸들러가 필요합니다. 하지만 새로운 DOM 프로퍼티는 이미 존재하는 프로퍼티를 덮어쓰기 할 겁니다:

```js no-beautify
input.onclick = function() { alert(1); }
// ...
input.onclick = function() { alert(2); } // 이전의 핸들러를 교체함
```

웹 표준을 지키는 개발자들은 오래전부터 이 문제를 인지했고, `addEventListener` 와 `removeEventListener` 라는 특별한 메서드를 이용해 핸들러를 관리하자는 대안을 제시했습니다. 핸들러를 여러개 할당할 수 있는 게 가능하도록 말이죠. 

핸들러를 더해줄 땐 다음의 syntax(구문) 을 사용합니다:

```js
element.addEventListener(event, handler[, options]);
```

`event`
: 이벤트 이름, e.g. `"click"`.

`handler`
: 핸들러 함수

`options`
: 아래와 같은 프로퍼티를 갖는 추가적인 객체입니다:
    - `once`: `true`이면 호출할 때 listener가 자동으로 삭제됩니다.
    - `capture`: 어느 단계에서 이벤트를 다뤄야 하는지를 알려주는 프로퍼티로, <info:bubbling-and-capturing>에서 다룰 예정입니다. `{capture: false/true}`는  `options`을 `false/true`로 설정하는 것과 같습니다. 과거엔 `options` 자체가 `false/true` 값을 가지는 프로퍼티였습니다.
    - `passive`: true일 경우, listener에서 지정한 함수가 preventDefault()를 호출하지 않습니다. <info:default-browser-action>에서 자세히 다루겠습니다.


핸들러 삭제는 `removeEventListener`로 합니다:

```js
element.removeEventListener(event, handler[, options]);
```

````warn header="삭제는 동일한 함수만 할 수 있습니다"
핸들러를 삭제하려면, 핸들러 할당 시 사용한 함수를 그대로 전달해주어야 합니다.

아래는 작동하지 않습니다:

```js no-beautify
elem.addEventListener( "click" , () => alert('Thanks!'));
// ....
elem.removeEventListener( "click", () => alert('Thanks!'));
```

`removeEventListener`를 썼지만, 핸들러는 지워지지 않습니다. `removeEventListener`가 할당된 함수와 다른 함수를 받고 있기 때문입니다. 코드는 똑같지만, 그건 상관없습니다. (역주: 이렇게 `addEventListener`로 추가한 익명 함수는 제거할 수 없습니다.) 

이렇게 해야 작동합니다:

```js
function handler() {
  alert( 'Thanks!' );
}

input.addEventListener("click", handler);
// ....
input.removeEventListener("click", handler);
```

주의하세요 -- 변수를 사용해 핸들러 함수를 저장하지 않으면, 핸들러를 지울 수 없습니다. `addEventListener`를 통해 할당한 핸들러를 "불러올" 방법이 전혀 없기 때문입니다.
````

`addEventListener`를 여러 번 호출하면 핸들러를 여러 개 붙일 수 있습니다. 아래와 같이 말이죠:

```html run no-beautify
<input id="elem" type="button" value="Click me"/>

<script>
  function handler1() {
    alert('감사합니다!');
  };

  function handler2() {
    alert('다시 한번 감사합니다!');
  }

*!*
  elem.onclick = () => alert("안녕하세요");
  elem.addEventListener("click", handler1); // 감사합니다!
  elem.addEventListener("click", handler2); // 다시 한번 감사합니다!
*/!*
</script>
```

지금까지 살펴본 바와 같이 핸들러는 DOM-프로퍼티와 `addEventListener` *두 가지 방법*으로 할당할 수 있습니다. 하지만 일반적으론 두 가지 방법 중 하나만을 사용해 할당합니다.

````warn header="어떤 이벤트는 `addEventListener`와 함께 써야만 작동합니다"
DOM-프로퍼티로 할당할 수 없는 이벤트가 존재합니다. 이런 경우는 무조건  `addEventListener`를 써야 합니다.

`transitionend` (CSS 애니메이션이 끝나면 발생) 이벤트가 그 예입니다.

아래 코드를 실행해 보세요. 대부분 브라우저에서 두 번째 핸들러만 작동하고, 첫 번째는 작동하지 않을 겁니다.

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
    alert("DOM property"); // 실행 안 됨
  };

*!*
  elem.addEventListener("transitionend", function() {
    alert("addEventListener"); // 애니메이션이 종료되면 나타남
  });
*/!*
</script>
```
````

## 이벤트 객체(Event object)

이벤트를 잘 다루려면 어떤 일이 일어났는지 상세히 알아야 합니다. "click" 이벤트가 발생했다면 마우스 포인터가 어디에 있는지, "keypress" 이벤트가 발생했다면 어떤 키가 눌렸는지 등에 대한 상세한 정보가 필요합니다.

이벤트가 발생하면 브라우저는 *이벤트 객체(event object)*라는 걸 만들고, 이벤트에 관한 상세한 정보를 이 이벤트 객체에 넣은 다음, 핸들러에 인수로 전달합니다.

아래는 이벤트 객체로부터 마우스 좌표 정보를 얻어내는 예시입니다:

```html run
<input type="button" value="Click me" id="elem">

<script>
  elem.onclick = function(*!*event*/!*) {
    // 이벤트 타입과, 요소, 클릭 이벤트가 발생한 좌표를 보여줌
    alert(event.type + " at " + event.currentTarget);
    alert("Coordinates: " + event.clientX + ":" + event.clientY);
  };
</script>
```

아래는 `이벤트` 객체에서 지원하는 몇 가지 프로퍼티 목록입니다:

`event.type`
: 이벤트 타입, 위 예시에선 `"click"`.

`event.currentTarget`
: Element that handled the event. That's exactly the same as `this`, unless the handler is an arrow function, or its `this` is bound to something else, then we can get the element from  `event.currentTarget`.

`event.clientX / event.clientY`
: 마우스 이벤트에서, 커서의 상대 좌표(역주: 모니터 기준의 좌표가 아닌, 브라우저 화면 기준 좌표)

이 외에도 다양한 프로퍼티가 있습니다. 이벤트 타입에 따라 이벤트 객체에서 제공해주는 프로퍼티가 다르기 때문에, 추후 다양한 종류의 이벤트를 학습하면서, 프로퍼티에 대해서도 상세히 알아보도록 하겠습니다.

````smart header="이벤트 객체는 HTML에서도 접근할 수 있습니다"
핸들러를 HTML에서 할당한 경우에도, `event` 객체를 사용할 수 있습니다. 아래와 같이 말이죠:

```html autorun height=60
<input type="button" onclick="*!*alert(event.type)*/!*" value="이벤트 타입">
```

이게 가능한 이유는 브라우저가 속성을 읽을 때, `function(event) { alert(event.type) }` 같은 핸들러를 만들어 내기 때문입니다. 첫 번째 인수는 `"event"`로 불리고, 함수 몸체는 속성으로부터 가져옵니다
````


## 객체 핸들러: handleEvent

We can assign not just a function, but an object as an event handler using `addEventListener`. When an event occurs, its `handleEvent` method is called.

예:


```html run
<button id="elem">클릭해주세요</button>

<script>
  elem.addEventListener('click', {
    handleEvent(event) {
      alert(event.type + " at " + event.currentTarget);
    }
  });
</script>
```

As we can see, when `addEventListener` receives an object as the handler, it calls `object.handleEvent(event)` in case of an event.

클래스를 사용할 수도 있습니다:


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

위 예제에선 같은 객체가 두 개의 이벤트를 처리(handle)하고 있습니다. 주의할 것은 `addEventListener`를 사용해 요소에 이벤트 리스너를 명시적으로 할당해 주어야 한다는 점입니다. 위 예제에서 `menu` 객체는 오직 `mousedown` 와 `mouseup`이벤트에만 응답하고, 다른 타입의 이벤트에는 응답하지 않습니다. 

`handleEvent` 메서드가 모든 이벤트를 처리할 필요는 없습니다. 이벤트 관련 메서드를 `handleEvent` 에서 호출해서 사용할 수도 있습니다. 아래와 같이 말이죠:

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

이벤트 핸들러가 명확히 분리되어서, 코드 변경이 용이할 수 있도록 바뀌었습니다.

## Summary

이벤트 핸들러는 3가지 방법으로 할당할 수 있습니다:

1. HTML 속성: `onclick="..."`.
2. DOM 프로퍼티: `elem.onclick = function`.
3. 메서드: `elem.addEventListener(event, handler[, phase])` 로 핸들러를 추가하고, `removeEventListener` 로 핸들러를 제거.

HTML 속성을 이용한 할당은 자주 쓰이지 않습니다. HTML 태그 중간에 자바스크립트가 들어가있으면 어색하기 때문입니다. 긴 코드를 끼워 넣는 게 불가능한 점도 이유 중 하나입니다.

DOM 프로퍼티를 사용한 방법은 괜찮습니다. 하지만 복수의 핸들러 할당이 불가능하다는 단점이 있습니다. 대부분, 복수의 핸들러를 다루진 않을 겁니다.

메서드를 사용하는 방법은 가장 유연합니다. 하지만 코드가 가장 깁니다. `transtionend` 와 `DOMContentLoaded`(추후 다룰 예정)같은 이벤트는 이 방법으로만 처리할 수 있습니다. `addEventListener`는 객체로 이벤트를 다룰 수 있게 해주기도 합니다. 이 경우엔 이벤트가 발생하면 `handleEvent`가 호출됩니다.

어떤 방법으로 이벤트 핸들러를 할당하던, 첫 번째 인자는 이벤트 객체입니다. 이 객체는 어떤 일이 일어났는지에 대한 상세한 정보를 담고 있습니다.

다음 주제에서 이벤트에 대해 전반적인 내용과 다양한 이벤트 타입에 대해서 다뤄보도록 하겠습니다.
