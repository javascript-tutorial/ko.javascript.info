
# 이벤트 위임

캡처링과 버블링을 활용하면 강력한 이벤트 핸들링 패턴인 *이벤트 위임(event delegation)* 을 구현할 수 있습니다.

이벤트 위임은 비슷한 방식으로 여러 요소를 다뤄야 할 때 사용됩니다. 각 요소마다 핸들러를 할당하지 않고, 요소의 공통 조상에 이벤트 핸들러를 단 하나만 할당해도 여러 요소를 한꺼번에 다룰 수 있습니다.

공통 조상에 할당한 핸들러에서 `event.target`을 이용하면, 실제 어디서 이벤트가 발생했는지 알 수 있습니다. 이를 이용해 이벤트를 핸들링합니다.

예제를 살펴봅시다. 다음은 고대 중국 철학과 관련된 [팔괘도(Ba-Gua diagram)](http://en.wikipedia.org/wiki/Ba_gua) 입니다.

그림을 보시죠.

[iframe height=350 src="bagua" edit link]

HTML은 다음과 같이 작성되었습니다:

```html
<table>
  <tr>
    <th colspan="3"><em>Bagua</em> Chart: Direction, Element, Color, Meaning</th>
  </tr>
  <tr>
    <td class="nw"><strong>Northwest</strong><br>Metal<br>Silver<br>Elders</td>
    <td class="n">...</td>
    <td class="ne">...</td>
  </tr>
  <tr>...2 more lines of this kind...</tr>
  <tr>...2 more lines of this kind...</tr>
</table>
```

지금 보는 표에는 9개의 칸이 있습니다. 하지만 칸이 99개이든 9999개이든 상관없이 이벤트 위임을 적용할 수 있습니다.

**우리가 할 작업은 `<td>`를 클릭했을 때, 그 칸을 강조하는 것입니다.**

이를 위해 각 `<td>`마다 `onclick` 핸들러를 할당하는 대신, `<table>` 요소에 "모든 이벤트를 잡아내는(catch-all)" 핸들러를 할당하도록 하겠습니다.

이 핸들러는 `event.target`을 이용해 어떤 요소가 클릭 되었는지 감지하고, 해당 칸을 강조합니다.

코드는 아래와 같습니다:

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

위 팔괘도의 HTML을 살펴봅시다. `<td>`안에 `<strong>`이 중첩된 것을 확인할 수 있습니다:

```html
<td>
*!*
  <strong>Northwest</strong>
*/!*
  ...
</td>
```

 `<strong>`을 클릭하게 되면 이 요소가 이벤트의 타깃이 됩니다. `event.target`에 이 요소가 저장되고, 원하는 강조 기능이 작동하지 않습니다.

![](bagua-bubble.svg)

따라서 `table.onclick`핸들러에서 `event.target`을 이용해 클릭 이벤트가 `<td>`안쪽에서 일어났는지, 아닌지를 알아내야 합니다.

아래는 기능이 좀 더 향상한 코드입니다:

```js
table.onclick = function(event) {
  let td = event.target.closest('td'); // (1)

  if (!td) return; // (2)

  if (!table.contains(td)) return; // (3)

  highlight(td); // (4)
};
```

설명:
1. `elem.closest(selector)` 메서드는 elem의 상위 요소 중 selector와 일치하는 가장 근접한 조상 요소를 반환합니다. 위 코드에선 이벤트가 발생한 요소부터 시작해 위로 올라가며 가장 가까운 `<td>` 요소를 찾습니다.
2. 만약 `event.target`이 `<td>`안에 있지 않으면, 반환 값은 `null`이 됩니다. 따라서, 아무 작업도 일어나지 않습니다.
3. 중첩 테이블이 있는 경우, `event.target`은 현재 테이블 바깥에 있는 `<td>`일 수도 있습니다. 이런 경우를 처리하기 위해, `<td>`가 팔괘도 안에 있는지를 확인합니다.
4. 이제 진짜 td를 강조해 줍니다.

As the result, we have a fast, efficient highlighting code, that doesn't care about the total number of `<td>` in the table.

## 이벤트 위임 활용: 마크업 내 이벤트 핸들링 최적화

There are other uses for event delegation.

Let's say, we want to make a menu with buttons "Save", "Load", "Search" and so on. And there's an object with methods `save`, `load`, `search`... How to match them?

처음엔 버튼 각각에 독립된 핸들러를 할당해 기능을 구현하려고 할 겁니다. 하지만 이 방법보다 더 우아한 해결책이 있습니다. 메뉴 전체에 핸들러를 하나 할당해주고, 각 버튼의 `data-action` 속성에 호출할 메서드를 할당해 주는 방법 말이죠:

```html
<button *!*data-action="save"*/!*>Click to Save</button>
```

핸들러는 속성값을 읽고 메서드를 실행합니다. 아래 코드를 실행해 봅시다:

```html autorun height=60 run untrusted
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

`(*)`로 표시한 줄의 `this.onClick`은 `this`에 bind 되었다는 것을 주의해 주세요. 이렇게 하지 않으면 `this`는 `Menu` 객체를 참조하지 않고, DOM 요소(`elem`)를 참조하게 됩니다. . `this[action]`은 우리가 원하는 바가 아닙니다. 

<<<<<<< HEAD
이렇게 작성한 코드는 어떤 이점이 있을까요? 아래와 같은 장점이 있습니다.
=======
So, what advantages does delegation give us here?
>>>>>>> 10c7807f49122f475f7cda5d07a324247091c080

```compare
+ 각 버튼마다 핸들러 할당을 위한 코드를 작성할 필요가 없어집니다. 버튼에 해당하는 메서드를 만들고, 마크업에 그 메서드를 써주기만 하면 됩니다.
+ HTML 구조는 유연하기 때문에, 언제든지 버튼을 추가하고 제거할 수 있게 됩니다.
```

`.action-save`, `.action-load` 같은 클래스를 사용할 수도 있지만, `data-action` 속성이 좀 더 의미론적으로 낫습니다. CSS 규칙을 적용할 수도 있게 됩니다.

## "행동" 패턴

이벤트 위임을 사용하여 *선언적 방식으로* 요소에 "행동(behavior)"을 추가할 수도 있습니다. 이때는 특별한 속성과 클래스를 사용합니다.

아래 절차를 통해 이 패턴을 만들 수 있습니다.
1. We add a custom attribute to an element that describes its behavior.
2. document 전체를 감지하는 핸들러가 이벤트를 추적하게 합니다. 1에서 추가한 속성이 있는 요소에서 이벤트가 발생하면 작업을 수행하도록 말이죠.

### Behavior: Counter

`data-counter`를 사용해 요소에 행동을 더해보도록 하겠습니다. "클릭 시 숫자가 증가"하는 버튼을 만드는 예제입니다:

```html run autorun height=60
Counter: <input type="button" value="1" data-counter>
One more counter: <input type="button" value="2" data-counter>

<script>
  document.addEventListener('click', function(event) {

    if (event.target.dataset.counter != undefined) { // 속성이 존재할 경우...
      event.target.value++;
    }

  });
</script>
```

버튼을 클릭하면 숫자가 증가합니다. 여기서 집중해야 할 것은 버튼이 아니고, 접근방식입니다.

`data-counter` 속성은 원하는 만큼 만들 수 있습니다. 필요할 때마다 HTML에 더해주기만 하면 되니까요. 여기선 이벤트 위임을 사용하여 HTML을 "확장"하였습니다. 새로운 행동을 선언해주는 속성을 추가해서 말이죠.

```warn header="document 수준의 핸들러를 만들 땐 항상 `addEventListener`를 사용하세요"
`document` 객체에 핸들러를 할당할 땐, `document.onclick`를 사용해선 안 됩니다. 무조건 `addEventListener`를 사용해 할당해야 합니다. `document.onclick`은 충돌을 일으킬 가능성이 있기 때문입니다. 새로운 핸들러가 이전의 핸들러를 덮어쓰는 것 같이 말이죠 말이죠.

코드 곳곳에서 `document`에 다수의 핸들러를 할당할 수 있습니다. 실제 프로젝트에서 이는 자연스러운 일입니다.  
```

### Behavior: Toggler

One more example of behavior. `data-toggle-id` 속성이 있는 요소를 클릭하면, 속성값을 `id`로 가진 요소가 나타나거나 사라지게 할 수 있습니다:

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

요소에 토글기능을 더해주기 위해 자바스크립트를 사용하지 않았다는 점에 주목합시다. `data-toggle-id` 속성만 사용하여 원하는 기능을 구현하였습니다. 

기능이 필요한 모든 요소에 자바스크립트를 쓰지 않아도 되기 때문에, 이런 방식으로 구현하면 매우 편리합니다. "행동"을 선언해 주기만 하면 되기 때문입니다. document 수준에 할당된 핸들러는 페이지 내의 모든 요소에 동작합니다.

여러 개의 행동을 조합해 한 요소에 적용하는 것도 가능합니다.

<<<<<<< HEAD
이런 "행동" 패턴은 자바스크립트 내 프래그먼트의 대안이 될 수 있습니다.
=======
The "behavior" pattern can be an alternative to mini-fragments of JavaScript.
>>>>>>> 10c7807f49122f475f7cda5d07a324247091c080

## 요약

이벤트 위임은 멋집니다! DOM 이벤트에 사용할 수 있는 아주 유용한 패턴입니다.

<<<<<<< HEAD
유사한 요소를 하나의 핸들러로 다루는 데 주로 사용하지만, 꼭 이런 경우에만 사용하는 건 아닙니다.
=======
It's often used to add the same handling for many similar elements, but not only for that.
>>>>>>> 10c7807f49122f475f7cda5d07a324247091c080

다음과 같은 알고리즘으로 이벤트 핸들러는 동작합니다:

1. 컨테이너에 하나의 핸들러를 할당합니다.
2. 핸들러의 `event.target`을 사용해 이벤트가 발생한 요소가 어디인지 알아냅니다.
3. 원하는 요소에서 이벤트가 발생했다고 확인되면, 이벤트를 핸들링 합니다.

장점:

```compare
<<<<<<< HEAD
+ 단순한 초기화와 메모리 절약: 많은 핸들러를 할당하지 않아도 되기 때문입니다.
+ 적은 코드: 요소를 더하거나 뺄 때, 핸들러를 추가하거나 제거할 필요가 없습니다.
+ DOM 수정: `innerHTML`이나 유사한 기능을 하는 스크립트로 요소 덩어리를 더하거나 뺄 수 있습니다.
=======
+ Simplifies initialization and saves memory: no need to add many handlers.
+ Less code: when adding or removing elements, no need to add/remove handlers.
+ DOM modifications: we can mass add/remove elements with `innerHTML` and the like.
>>>>>>> 10c7807f49122f475f7cda5d07a324247091c080
```

이벤트 위임에도 물론 단점이 있습니다:

```compare
<<<<<<< HEAD
- 이벤트 위임을 사용하려면, 이벤트가 반드시 버블링 되어야 합니다. 하지만 몇몇 이벤트는 버블링 되지 않습니다. 그리고, 낮은 레벨에 할당한 핸들러엔 `event.stopPropagation()`를 쓸 수 없습니다.
- CPU 작업 부하가 늘어날 수 있습니다. 컨테이너 수준에 할당된 핸들러가 모든 하위 컨테이너에서 발생하는 이벤트에 응답해야 하기 때문입니다. 응답할 필요가 있는 이벤트이든 아니든 상관없이 말이죠.
=======
- First, the event must be bubbling. Some events do not bubble. Also, low-level handlers should not use `event.stopPropagation()`.
- Second, the delegation may add CPU load, because the container-level handler reacts on events in any place of the container, no matter whether they interest us or not. But usually the load is negligible, so we don't take it into account.
>>>>>>> 10c7807f49122f475f7cda5d07a324247091c080
```
