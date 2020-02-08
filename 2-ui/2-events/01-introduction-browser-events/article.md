# 브라우저 이벤트 소개

*이벤트(event)* 는 무언가 일어났다는 신호입니다. 모든 DOM 노드는 이런 신호를 만들어 냅니다. 참고로, 이벤트는 DOM에만 한정되진 않습니다.

자주 사용되는 유용한 DOM 이벤트는 무엇이 있는지 잠시 살펴봅시다.

**마우스 이벤트:**
- `click` -- 요소 위에서 마우스 왼쪽 버튼을 눌렀을 때(터치스크린이 있는 장치에선 탭 했을 때) 발생합니다.
- `contextmenu` -- 요소 위에서 마우스 오른쪽 버튼을 눌렀을 때 발생합니다.
- `mouseover`와 `mouseout` -- 마우스 커서를 요소 위로 움직였을 때, 커서가 요소 밖으로 움직였을 때 발생합니다.
- `mousedown`과 `mouseup` -- 요소 위에서 마우스 왼쪽 버튼을 누르고 있을 때, 마우스 버튼을 뗄 때 발생합니다.
- `mousemove` -- 마우스를 움직일 때 발생합니다.

**폼 요소 이벤트:**
- `submit` -- 사용자가 `<form>`을 제출할 때 발생합니다.
- `focus` --  사용자가 `<input>`과 같은 요소에 포커스 할 때 발생합니다.

**키보드 이벤트:**
- `keydown`과 `keyup` -- 사용자가 키보드 버튼을 누르거나 뗄 때 발생합니다.

**문서 이벤트:**
- `DOMContentLoaded` -- HTML이 전부 로드 및 처리되어 DOM 생성이 완료되었을 때 발생합니다.

**CSS 이벤트:**
- `transitionend` -- CSS 애니메이션(CSS-animation)이 종료되었을 때 발생합니다.

이 외에도 다양한 이벤트가 있는데, 몇몇 이벤트는 다음 챕터에서 자세히 다룰 예정입니다.

## 이벤트 핸들러

이벤트에 반응하려면 이벤트가 발생했을 때 실행되는 함수인 *핸들러(handler)* 를 할당해야 합니다.

핸들러는 사용자의 행동에 어떻게 반응할지를 자바스크립트 코드로 표현한 것입니다.

핸들러는 여러 가지 방법으로 할당할 수 있습니다. 가장 간단한 방법부터 살펴봅시다.

### HTML 속성

HTML 안의 `on<event>` 속성에 핸들러를 할당할 수 있습니다.

아래와 같이 `input` 태그의 `onclick` 속성에 `click` 핸들러를 할당하는 것 같이 말이죠.

```html run
<input value="클릭해 주세요." *!*onclick="alert('클릭!')"*/!* type="button">
```

버튼을 클릭하면 `onclick` 안의 코드가 실행됩니다.

여기서 주의해야 할 것은 속성값 내에서 사용된 따옴표입니다. 속성값 전체가 큰따옴표로 둘러싸여 있기 때문에 작은 따옴표로 둘러쌓습니다. `onclick="alert("클릭!")"`과 같이 속성값 내부에 또 큰따옴표를 쓰면 코드가 작동하지 않습니다.

긴 코드를 HTML 속성값으로 사용하는 것은 추천하지 않습니다. 만약 코드가 길다면, 함수를 만들어서 이를 호출하는 방법을 추천합니다.

아래 버튼을 클릭하면 함수 `countRabbits()`이 호출됩니다.

```html autorun height=50
<script>
  function countRabbits() {
    for(let i=1; i<=3; i++) {
      alert(`토끼 ${i}마리`);
    }
  }
</script>

<input type="button" *!*onclick="countRabbits()"*/!* value="토끼를 세봅시다!">
```

HTML 속성은 대·소문자를 구분하지 않기 때문에, `ONCLICK`은 `onClick`이나 `onCLICK`과 동일하게 작동합니다. 하지만 속성값은 대개 `onclick` 같이 소문자로 작성합니다.

### DOM 프로퍼티

DOM 프로퍼티 `on<event>`을 사용해도 핸들러를 할당할 수 있습니다.

`elem.onclick`을 사용한 예시:

```html autorun
<input id="elem" type="button" value="클릭해 주세요.">
<script>
*!*
  elem.onclick = function() {
    alert('감사합니다.');
  };
*/!*
</script>
```

핸들러를 HTML 속성을 사용해 할당하면, 브라우저는 속성값을 이용해 새로운 함수를 만듭니다. 그리고 생성된 함수를 DOM 프로퍼티에 할당합니다.

따라서 DOM 프로퍼티를 사용해 핸들러를 만든 위쪽 예시는 HTML 속성을 사용해 만든 바로 위 예시와 동일하게 작동합니다.

**핸들러는 언제나 DOM 프로퍼티에 할당됩니다. HTML 속성을 사용해 핸들러를 정의하는 방법은 DOM 프로퍼티를 초기화하는 여러 방법의 하나일 뿐입니다.**

아래 두 예시는 동일하게 작동합니다.

1. HTML만 사용하는 방법

    ```html autorun height=50
    <input type="button" *!*onclick="alert('클릭!')"*/!* value="클릭해 주세요.">
    ```
2. HTML과 자바스크립트를 함께 사용하는 방법

    ```html autorun height=50
    <input type="button" id="button" value="클릭해 주세요.">
    <script>
    *!*
      button.onclick = function() {
        alert('클릭!');
      };
    */!*
    </script>
    ```

**`onclick` 프로퍼티는 단 하나밖에 없기 때문에, 복수의 이벤트 핸들러를 할당할 수 없습니다.**

아래 예시와 같이 핸들러를 하나 더 추가하면, 기존 핸들러는 덮어씌워 집니다.

```html run height=50 autorun
<input type="button" id="elem" onclick="alert('이전')" value="클릭해 주세요.">
<script>
*!*
  elem.onclick = function() { // 기존에 작성된 핸들러를 덮어씀
    alert('이후'); // 이 경고창만 보입니다.
  };
*/!*
</script>
```

이미 존재하는 함수를 직접 핸들러에 할당할 수도 있습니다.

```js
function sayThanks() {
  alert('감사합니다!');
}

elem.onclick = sayThanks;
```

핸들러를 제거하고 싶다면 `elem.onclick = null` 같이 null을 할당하면 됩니다.

## this로 요소에 접근하기

핸들러 내부에 쓰인 `this`의 값은 핸들러가 할당된 요소입니다.

아래 예시의`this.innerHTML`에서 this는 `button`이므로 버튼을 클릭하면 버튼 안의 콘텐츠가 얼럿창에 출력됩니다.

```html height=50 autorun
<button onclick="alert(this.innerHTML)">클릭해 주세요.</button>
```

## 자주 하는 실수

이벤트를 다룰 때는 아래 주의사항을 항상 염두에 두시기 바랍니다.

**함수는 `sayThanks`처럼 할당해야 합니다. `sayThanks()`를 할당하면 동작하지 않습니다.**

```js
// 올바른 방법
button.onclick = sayThanks;

// 틀린 방법
button.onclick = sayThanks();
```

`sayThanks()` 같이 괄호를 덧붙이는 것은 함수를 호출하겠다는 것을 의미합니다. 위 예시의 마지막 줄처럼 sayThanks()를 프로퍼티에 할당하면 함수 호출의 *결괏(result)값*이 할당되죠. 함수 `sayThanks`가 아무것도 반환하지 않는다면 `onclick` 프로퍼티엔 `undefined`이 할당되므로 이벤트가 원하는 대로 동작하지 않습니다. 

그런데, HTML 속성값에는 괄호가 있어야 합니다.

```html
<input type="button" id="button" onclick="sayThanks()">
```

브라우저는 속성값을 읽고, 이 값을 *함수 본문*으로 하는 핸들러 함수를 만들기 때문에 이런 차이가 발생합니다. 

브라우저는 `onclick` 프로퍼티에 새로운 함수를 할당하죠.
```js
button.onclick = function() {
*!*
  sayThanks(); // 속성값
*/!*
};
```

**문자열이 아닌 함수를 쓰세요.**

`elem.onclick = "alert(1)"`도 잘 작동하긴 합니다. 호환성 유지를 위해 문자열을 프로퍼티에 할당해도 문제가 없게 만들어놨지만, 이 방법을 쓰지 않기를 강력히 권유합니다.

**`setAttribute`로 핸들러를 할당하지 마세요.**

아래 코드는 동작하지 않습니다.

```js run no-beautify
// <body>를 클릭하면 에러가 발생합니다.
// 속성은 항상 문자열이기 때문에, 함수가 문자열이 되어버리기 때문입니다.
document.body.setAttribute('onclick', function() { alert(1) });
```

**DOM 프로퍼티는 대·소문자를 구분합니다.**

핸들러 할당 시 `elem.onclick`은 괜찮지만, `elem.ONCLICK`은 안됩니다. DOM 프로퍼티는 대·소문자를 구분하기 때문입니다.

## addEventListener

HTML 속성과 DOM 프로퍼티를 이용한 이벤트 핸들러 할당 방식엔 근본적인 문제가 있습니다. 하나의 이벤트에 복수의 핸들러를 할당할 수 없다는 문제이죠.

버튼을 클릭하면 버튼을 강조하면서 메시지를 보여주고 싶다고 해 봅시다.

두 개의 이벤트 핸들러가 필요할 겁니다. 하지만 기존 방법으로는 프로퍼티가 덮어씌워 진다는 문제가 있습니다.

```js no-beautify
input.onclick = function() { alert(1); }
// ...
input.onclick = function() { alert(2); } // 이전 핸들러를 덮어씀
```

웹 표준에 관여하는 개발자들은 오래전부터 이 문제를 인지하고, `addEventListener` 와 `removeEventListener` 라는 특별한 메서드를 이용해 핸들러를 관리하자는 대안을 제시했습니다. 핸들러를 여러 개 할당할 수 있도록 말이죠.

문법은 다음과 같습니다.

```js
element.addEventListener(event, handler[, options]);
```

`event`
: 이벤트 이름(예: `"click"`)

`handler`
: 핸들러 함수

`options`
: 아래 프로퍼티를 갖는 객체
    - `once`: `true`이면 이벤트가 트리거 될 때 리스너가 자동으로 삭제됩니다.
    - `capture`: 어느 단계에서 이벤트를 다뤄야 하는지를 알려주는 프로퍼티로, 관련 내용은 <info:bubbling-and-capturing> 챕터에서 자세히 다룰 예정입니다. 호환성 유지를 위해 `options`를 객체가 아닌 `false/true`로 할당하는 것도 가능한데, 이는 `{capture: false/true}`는 와 동일합니다.
    - `passive`: `true`이면 리스너에서 지정한 함수가 `preventDefault()`를 호출하지 않습니다. <info:default-browser-action> 챕터에서 자세히 다루겠습니다.


핸들러 삭제는 `removeEventListener`로 합니다.

```js
element.removeEventListener(event, handler[, options]);
```

````warn header="삭제는 동일한 함수만 할 수 있습니다."
핸들러를 삭제하려면 핸들러 할당 시 사용한 함수를 그대로 전달해주어야 합니다.

아래와 같이 이벤트를 할당하고 삭제하면 원하는 대로 동작하지 않습니다.

```js no-beautify
elem.addEventListener( "click" , () => alert('감사합니다!'));
// ....
elem.removeEventListener( "click", () => alert('감사합니다!'));
```

`removeEventListener`를 썼지만, 핸들러는 지워지지 않습니다. `removeEventListener`가 `addEventListener`를 사용해 할당한 함수와 다른 함수를 받고 있기 때문입니다. 함수는 똑같게 생겼지만 그럼에도 불구하고 다른 함수이기 때문에 이런 문제가 발생합니다.

위 예시를 제대로 고치면 다음과 같습니다.

```js
function handler() {
  alert( '감사합니다!' );
}

input.addEventListener("click", handler);
// ....
input.removeEventListener("click", handler);
```

변수에 핸들러 함수를 저장해 놓지 않으면 핸들러를 지울 수 없다는 것을 항상 기억해 놓으셔야 합니다. 이렇게 하지 않으면 `addEventListener`로 할당한 핸들러를 '불러올' 수 없습니다.
````

`addEventListener`를 여러 번 호출하면 아래와 같이 핸들러를 여러 개 붙일 수 있습니다.

```html run no-beautify
<input id="elem" type="button" value="클릭해 주세요."/>

<script>
  function handler1() {
    alert('감사합니다!');
  };

  function handler2() {
    alert('다시 한번 감사합니다!');
  }

*!*
  elem.onclick = () => alert("안녕하세요.");
  elem.addEventListener("click", handler1); // 감사합니다!
  elem.addEventListener("click", handler2); // 다시 한번 감사합니다!
*/!*
</script>
```

지금까지 살펴본 바와 같이 핸들러는 DOM 프로퍼티와 `addEventListener` 를 사용하는 방법 *두 가지*를 사용해 할당할 수 있습니다. 하지만 대개는 두 방법 중 하나만을 사용해 할당합니다.

````warn header="어떤 이벤트는 `addEventListener`를 써야만 작동합니다."
DOM 프로퍼티에 할당할 수 없는 이벤트가 몇몇 있습니다. 이런 이벤트는 무조건  `addEventListener`를 써야 합니다.

CSS 애니메이션이 끝날 때 발생하는 `transitionend` 이벤트가 대표적인 예입니다.

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

<input type="button" id="elem" onclick="this.classList.toggle('wide')" value="클릭해 주세요.">

<script>
  elem.ontransitionend = function() {
    alert("DOM 프로퍼티"); // 실행 안 됨
  };

*!*
  elem.addEventListener("transitionend", function() {
    alert("addEventListener"); // 애니메이션이 종료되면 나타남
  });
*/!*
</script>
```
````

## 이벤트 객체

이벤트를 제대로 다루려면 어떤 일이 일어났는지 상세히 알아야 합니다.  'click' 이벤트가 발생했다면 마우스 포인터가 어디에 있는지, 'keypress' 이벤트가 발생했다면 어떤 키가 눌렸는지 등에 대한 상세한 정보가 필요합니다.

이벤트가 발생하면 브라우저는 *이벤트 객체(event object)*라는 것을 만듭니다. 여기에 이벤트에 관한 상세한 정보를 넣은 다음, 핸들러에 인수 형태로 전달합니다.

아래는 이벤트 객체로부터 마우스 좌표 정보를 얻어내는 예시입니다.

```html run
<input type="button" value="클릭해 주세요." id="elem">

<script>
  elem.onclick = function(*!*event*/!*) {
    // 이벤트 타입과 요소, 클릭 이벤트가 발생한 좌표를 보여줌
    alert(event.type + " 이벤트가 " + event.currentTarget + "에서 발생했습니다.");
    alert("이벤트가 발생한 곳의 좌표는 " + event.clientX + ":" + event.clientY +"입니다.");
  };
</script>
```

`이벤트` 객체에서 지원하는 프로퍼티 중 일부는 다음과 같습니다.

`event.type`
: 이벤트 타입, 위 예시에선 `"click"`.

`event.currentTarget`
: 이벤트를 처리하는 요소. 화살표 함수를 사용해 핸들러를 만들거나 다른 곳에 바인딩하지 않은 경우엔 `this`가 가리키는 값과 같음, 화살표 함수를 사용했거나 함수를 다른 곳에 바인딩한 경우엔 `event.currentTarget`를 사용해 이벤트가 처리되는 요소 정보를 얻을 수 있음

`event.clientX / event.clientY`
: 마우스 관련 이벤트에서, 커서의 상대 좌표(모니터 기준 좌표가 아닌, 브라우저 화면 기준 좌표 - 옮긴이)

이 외에도 다양한 프로퍼티가 있습니다. 이벤트 타입에 따라 이벤트 객체에서 제공하는 프로퍼티는 다릅니다. 추후 다양한 종류의 이벤트를 학습하면서 이벤트별 프로퍼티에 대해서도 상세히 알아보겠습니다.

````smart header="이벤트 객체는 HTML에서도 접근할 수 있습니다."
HTML에서 핸들러를 할당한 경우에도 아래와 같이 `event` 객체를 사용할 수 있습니다.

```html autorun height=60
<input type="button" onclick="*!*alert(event.type)*/!*" value="이벤트 타입">
```

브라우저는 속성을 읽고 `function(event) { alert(event.type) }` 같은 핸들러를 만들어 내기 때문입니다. 생성된 핸들러 함수의 첫 번째 인수는 `"event"`로 불리고, 함수 본문은 속성값 가져옵니다.
````


## 객체 형태의 핸들러와 handleEvent

`addEventListener`를 사용하면 함수뿐만 아니라 객체를 이벤트 핸들러로 할당할 수 있습니다. 이벤트가 발생하면 객체에 구현한 `handleEvent` 메서드가 호출됩니다. 

예시:


```html run
<button id="elem">클릭해 주세요.</button>

<script>
  elem.addEventListener('click', {
    handleEvent(event) {
      alert(event.type + " 이벤트가 " + event.currentTarget + "에서 발생했습니다.");
    }
  });
</script>
```

보시다시피 `addEventListener`가 인수로 객체 형태의 핸들러를 받으면 이벤트 발생 시 `object.handleEvent(event)`가 호출됩니다.

클래스를 사용할 수도 있습니다.


```html run
<button id="elem">클릭해 주세요.</button>

<script>
  class Menu {
    handleEvent(event) {
      switch(event.type) {
        case 'mousedown':
          elem.innerHTML = "마우스 버튼을 눌렀습니다.";
          break;
        case 'mouseup':
          elem.innerHTML += " 그리고 버튼을 뗐습니다.";
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

위 예시에선 하나의 객체에서 두 개의 이벤트를 처리하고 있습니다. 이때 주의할 점은 `addEventListener`를 사용할 때는 요소에 타입을 정확히 명시해 주어야 한다는 점입니다. 위 예시에서 `menu` 객체는 오직 `mousedown` 와 `mouseup`이벤트에만 응답하고, 다른 타입의 이벤트에는 응답하지 않습니다.

`handleEvent` 메서드가 모든 이벤트를 처리할 필요는 없습니다. 이벤트 관련 메서드를 `handleEvent` 에서 호출해서 사용할 수도 있습니다. 아래와 같이 말이죠,

```html run
<button id="elem">클릭해 주세요.</button>

<script>
  class Menu {
    handleEvent(event) {
      // mousedown -> onMousedown
      let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
      this[method](event);
    }

    onMousedown() {
      elem.innerHTML = "마우스 버튼을 눌렀습니다.";
    }

    onMouseup() {
      elem.innerHTML += " 그리고 버튼을 뗐습니다.";
    }
  }

  let menu = new Menu();
  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
</script>
```

이벤트 핸들러가 명확히 분리되었기 때문에 코드 변경이 원활해졌습니다.

## 요약

이벤트 핸들러는 3가지 방법으로 할당할 수 있습니다.

1. HTML 속성: `onclick="..."`.
2. DOM 프로퍼티: `elem.onclick = function`.
3. 메서드: `elem.addEventListener(event, handler[, phase])`로 핸들러를 추가하고, `removeEventListener` 로 핸들러를 제거함

HTML 속성을 이용한 이벤트 핸들러 할당은 자주 쓰이지 않습니다. HTML 태그 중간에 자바스크립트가 들어가 있으면 어색하기 때문입니다. 긴 코드를 끼워 넣는 게 불가능한 점도 이유 중 하나입니다.

DOM 프로퍼티를 사용한 방법은 괜찮습니다. 하지만 복수의 핸들러 할당이 불가능하다는 단점이 있습니다. 여러 상황에서 이런 제약이 큰 단점이 되진 않지만요.

메서드를 사용하는 방법은 가장 유연하지만, 코드는 가장 깁니다. `transtionend`와 `DOMContentLoaded`(추후 다룰 예정)같은 일부 이벤트는 이 방법으로만 처리할 수 있습니다. `addEventListener`는 객체 형태의 이벤트를 지원합니다. 이 경우엔 이벤트 발생 시 객체 안에 구현된 메서드인 `handleEvent`가 호출됩니다.

어떤 방법으로 이벤트 핸들러를 할당하던, 첫 번째 인자는 이벤트 객체입니다. 이벤트 객체는 어떤 일이 일어났는지에 대한 상세한 정보를 담고 있습니다.

다음 주제에서 이벤트에 대해 전반적인 내용과 다양한 이벤트 타입에 대해서 다루겠습니다.
