
# 이벤트 위임(Event delegation)

캡처링과 버블링을 활용하면 강력한 이벤트 핸들링 패턴인 *이벤트 위임*을 구현할 수 있습니다.

비슷한 방식으로 여러 요소를 다뤄야 할 때 이벤트 위임을 활용할 수 있습니다. 요소마다 핸들러를 할당하지 않고, 요소의 공통 조상에 이벤트 핸들러를 단 하나만 할당하면 됩니다.

공통 조상에 할당한 핸들러에서 `event.target`을 이용하면, 실제 어디서 이벤트가 발생했는지 알 수 있고, 이를 이용해 이벤트를 핸들링합니다.

예제를 살펴봅시다. 다음은 고대 중국 철학과 관련된 [팔괘도(Ba-Gua diagram)](http://en.wikipedia.org/wiki/Ba_gua) 입니다.

[iframe height=350 src="bagua" edit link]

The HTML is like this:

```html
<table>
  <tr>
    <th colspan="3"><em>Bagua</em> Chart: Direction, Element, Color, Meaning</th>
  </tr>
  <tr>
    <td>...<strong>Northwest</strong>...</td>
    <td>...</td>
    <td>...</td>
  </tr>
  <tr>...2 more lines of this kind...</tr>
  <tr>...2 more lines of this kind...</tr>
</table>
```

지금 보는 표에는 9개의 칸만 있습니다. 하지만 칸이 99개이든 9999개이든 상관없이 이벤트 위임을 적용할 수 있습니다.  

**우리가 해야 할 작업은 `<td>`를 클릭했을 때, 그 칸을 강조하는 것입니다.**

각 `<td>`마다 `onclick` 핸들러를 할당하는 대신, `<table>` 요소에 "모든 이벤트를 잡아내는(catch-all)" 핸들러를 할당할 수 있습니다.

이 핸들러는 `event.target`을 이용해 어떤 요소가 클릭 되었는지 감지하고, 해당 칸을 강조합니다.

코드:

```js
let selectedTd;

*!*
table.onclick = function(event) {
  let target = event.target; // 클릭이 어디서 발생했나?

  if (target.tagName != 'TD') return; // TD에서 발생한 게 아니라면? 아무 작업도 안 함

  highlight(target); // 강조해줌 
};
*/!*

function highlight(td) {
  if (selectedTd) { // 강조된 칸을 원상태로 바꿔줌
    selectedTd.classList.remove('highlight');
  }
  selectedTd = td;
  selectedTd.classList.add('highlight'); // 새로운 td를 강조해줌
}
```

이렇게 코드를 작성하면 테이블 내의 칸 개수는 고민거리가 되지 않습니다. 강조기능을 수정하지 않더라도 `<td>`를 언제라도 넣고 뺄 수 있게 됩니다. 

하지만, 단점도 존재합니다.

위처럼 구현하면 클릭 이벤트가 `<td>`가 아닌 그 안에 동작할 수 있습니다.

위 팔괘도의 HTML을 살펴봅시다. `<td>`안에 `<strong>`가 중첩된 것을 확인할 수 있습니다:

```html
<td>
*!*
  <strong>Northwest</strong>
*/!*
  ...
</td>
```

 `<strong>`을 클릭하게 되면 이 요소가 이벤트의 타깃이 됩니다. `event.target`에 이 요소가 저장되죠.

![](bagua-bubble.png)

따라서 `table.onclick`핸들러에서 `event.target`을 이용해 클릭 이벤트가 `<td>`안쪽에서 일어났는지, 아닌지를 알아내야 합니다.

아래는 기능을 좀 더 향상시킨 코드입니다:

```js
table.onclick = function(event) {
  let td = event.target.closest('td'); // (1)

  if (!td) return; // (2)

  if (!table.contains(td)) return; // (3)

  highlight(td); // (4)
};
```

설명:
1. `elem.closest(selector)` 메서드는 selector의 가장 가까운 조상을 반환합니다. 위 코드에선 근원 요소로부터 시작해 위로 올라가며 `<td>` 요소를 찾습니다.
2. 만약 `event.target`이 `<td>`안에 있지 않으면, 반환값은 `null`이 됩니다. 따라서, 아무 작업도 일어나지 않습니다.
3. 중첩 테이블이 있는 경우, `event.target`은 현재 테이블 바깥에 있는 `<td>`일 수도 있습니다. 이런 경우를 처리하기 위해, `<td>`가 팔괘도 안에 있는지를 확인합니다.
4. 이제 진짜 td를 강조해 줍니다.

## 이벤트 위임 활용: 마크업 내 이벤트 핸들링 최적화

이벤트 위임은 이벤트 핸들링을 최적화하는데 사용할 수 있습니다. 위의 예제에선 `<td>`를 강조하는 것과 같이, 유사한 동작을 하나의 핸들러로 제어하려는 목적으로 이벤트 위임을 활용했습니다.

하지만, 하나의 핸들러에서 다양한 동작을 다룰 수도 있습니다. 이 핸들러를 제어의 시작점으로 활용해서 말이죠.

"Save", "Load", "Search" 등의 버튼이 있는 메뉴를 만든다고 가정해 봅시다. `save`, `load`, `search`등의 메서드를 가진 객체가 필요할 겁니다.

처음엔 버튼 각각에 독립된 핸들러를 할당해 기능을 구현하려고 할 겁니다. 하지만 이 방법보다 더 우아한 해결책이 있습니다. 메뉴 전체와 각 버튼의 `data-action` 속성에 핸들러를 할당해주면 됩니다. 속성값으론 호출할 메서드를 할당해 줍니다:

```html
<button *!*data-action="save"*/!*>Click to Save</button>
```

핸들러는 속성값을 읽고 메서드를 실행합니다. 아래 코드를 실행해 봅시다:

```html autorun height=60 run
<div id="menu">
  <button data-action="save">Save</button>
  <button data-action="load">Load</button>
  <button data-action="search">Search</button>
</div>

<script>
  class Menu {
    constructor(elem) {
      this._elem = elem;
      elem.onclick = this.onClick.bind(this); // (*)
    }

    save() {
      alert('saving');
    }

    load() {
      alert('loading');
    }

    search() {
      alert('searching');
    }

    onClick(event) {
*!*
      let action = event.target.dataset.action;
      if (action) {
        this[action]();
      }
*/!*
    };
  }

  new Menu(menu);
</script>
```

`(*)`로 표시한 줄의 `this.onClick`은 `this`에 bind 되었다는 것을 주의해 주세요. 이렇게 하지 않으면 `this`는 DOM 요소(`elem`)를 참조하게 됩니다. menu 객체를 참조하지 않습니다. `this[action]`은 우리가 원하는 바가 아닙니다. 

자 그럼, 이렇게 작성한 코드는 어떤 이점이 있을까요? 아래와 같은 장점이 있습니다.

```compare
+ 각 버튼에 핸들러를 할당하기 위한 코드를 작성할 필요가 없어집니다. 버튼에 해당하는 메서드를 만들고, 마크업에 그 메서드를 써주기만 하면 됩니다.
+ HTML 구조는 유연하기 때문에, 언제든지 버튼을 추가하고 제거할 수 있게 됩니다.
```

`.action-save`, `.action-load` 같은 클래스를 사용할 수도 있지만, `data-action` 속성이 좀 더 의미론적으로 낫습니다. CSS 규칙을 적용할 수도 있게 됩니다.

## The "behavior" pattern

We can also use event delegation to add "behaviors" to elements *declaratively*, with special attributes and classes.

The pattern has two parts:
1. We add a special attribute to an element.
2. A document-wide handler tracks events, and if an event happens on an attributed element -- performs the action.

### Counter

For instance, here the attribute `data-counter` adds a behavior: "increase on click" to buttons:

```html run autorun height=60
Counter: <input type="button" value="1" data-counter>
One more counter: <input type="button" value="2" data-counter>

<script>
  document.addEventListener('click', function(event) {

    if (event.target.dataset.counter != undefined) { // if the attribute exists...
      event.target.value++;
    }

  });
</script>
```

If we click a button -- its value is increased. Not buttons, but the general approach is important here.

There can be as many attributes with `data-counter` as we want. We can add new ones to HTML at any moment. Using the event delegation we "extended" HTML, added an attribute that describes a new behavior.

```warn header="For document-level handlers -- always `addEventListener`"
When we assign an event handler to the `document` object, we should always use `addEventListener`, not `document.onclick`, because the latter will cause conflicts: new handlers overwrite old ones.

For real projects it's normal that there are many handlers on `document` set by different parts of the code.
```

### Toggler

One more example. A click on an element with the attribute `data-toggle-id` will show/hide the element with the given `id`:

```html autorun run height=60
<button *!*data-toggle-id="subscribe-mail"*/!*>
  Show the subscription form
</button>

<form id="subscribe-mail" hidden>
  Your mail: <input type="email">
</form>

<script>
*!*
  document.addEventListener('click', function(event) {
    let id = event.target.dataset.toggleId;
    if (!id) return;

    let elem = document.getElementById(id);

    elem.hidden = !elem.hidden;
  });
*/!*
</script>
```

Let's note once again what we did. Now, to add toggling functionality to an element -- there's no need to know JavaScript, just use the attribute `data-toggle-id`.

That may become really convenient -- no need to write JavaScript for every such element. Just use the behavior. The document-level handler makes it work for any element of the page.

We can combine multiple behaviors on a single element as well.

The "behavior" pattern can be an alternative of mini-fragments of JavaScript.

## Summary

Event delegation is really cool! It's one of the most helpful patterns for DOM events.

It's often used to add same handling for many similar elements, but not only for that.

The algorithm:

1. Put a single handler on the container.
2. In the handler -- check the source element `event.target`.
3. If the event happened inside an element that interests us, then handle the event.

Benefits:

```compare
+ Simplifies initialization and saves memory: no need to add many handlers.
+ Less code: when adding or removing elements, no need to add/remove handlers.
+ DOM modifications: we can mass add/remove elements with `innerHTML` and alike.
```

The delegation has its limitations of course:

```compare
- First, the event must be bubbling. Some events do not bubble. Also, low-level handlers should not use `event.stopPropagation()`.
- Second, the delegation may add CPU load, because the container-level handler reacts on events in any place of the container, no matter if they interest us or not. But usually the load is negligible, so we don't take it into account.
```
