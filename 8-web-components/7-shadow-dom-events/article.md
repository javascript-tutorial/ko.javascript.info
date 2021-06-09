# Shadow DOM 과 이벤트

Shadow 트리의 기본 개념은 컴포넌트의 내부 구현 세부 정보를 캡슐화하는 것입니다.

클릭 이벤트가 `<user-card>` 컴포넌트의 Shadow DOM 내부에서 발생한다고 가정하겠습니다. 하지만, 메인 document의 스크립트는 특히 컴포넌트를 써드파티 라이브러리에서 가져온 경우, Shadow DOM 내부에 대해 알지 못합니다.

따라서, 세부 정보를 캡슐화하기 위해 브라우저는 이벤트를 _retargets_ 합니다.

**Shadow DOM에서 발생하는 이벤트는 컴포넌트의 외부에서 감지될 때 호스트 요소를 타깃으로 합니다.**

다음은 간단한 예시입니다.

```html run autorun="no-epub" untrusted height=60
<user-card></user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<p>
      <button>Click me</button>
    </p>`;
    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

document.onclick =
  e => alert("Outer target: " + e.target.tagName);
</script>
```

버튼을 클릭하면, 메시지는 다음과 같습니다.

1. 내부 타깃: `BUTTON` -- 내부 이벤트 핸들러가 올바른 타깃인 Shadow DOM 내부에서 요소를 가져옵니다.
2. 외부 타깃: `USER-CARD` -- document 이벤트 핸들러가 shadow 호스트를 타깃으로 가져옵니다.

이벤트 리타깃팅(retargeting)은 외부 문서가 컴포넌트 내부에 대해 알 필요가 없기 때문에 유용한 기능입니다. 이 관점에서 보면, 이벤트는 `<user-card>`에서 발생했습니다.

**이벤트가 light DOM에 있는 슬롯 요소에서 발생하면 리타깃팅이 발생하지 않습니다.**

예를 들어, 사용자가 아래 예시에서 `<span slot="username">` 을 클릭하면 shadow 및 light 핸들러 모두 이벤트 타깃은 바로 이 `span` 요소입니다.

```html run autorun="no-epub" untrusted height=60
<user-card id="userCard">
*!*
  <span slot="username">John Smith</span>
*/!*
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div>
      <b>Name:</b> <slot name="username"></slot>
    </div>`;

    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

userCard.onclick = e => alert(`Outer target: ${e.target.tagName}`);
</script>
```

`"John Smith"`에서 클릭이 발생하면, 내부 및 외부 핸들러 모두 타깃은 `<span slot="username">`입니다. 이것은 light DOM의 요소이므로 리타깃팅이 없습니다.

반면에 shadow DOM에서 시작된 요소에서 클릭이 발생하면, 예를 들어 `<b>Name</b>`에서 라면, shadow DOM 밖에서 버블링이 발생하여 event.target은 `<user-card>`로 재설정됩니다.

## 버블링, event.composedPath()

이벤트 버블링을 위해 평면화 된 DOM이 사용됩니다.

따라서 슬롯 요소가 있고, 내부 어딘가에서 이벤트가 발생하면 `<slot>` 및 위쪽으로 버블링됩니다.

모든 shadow 요소와 원래 이벤트 타깃의 전체 경로는 `event.composedPath()`를 사용하여 얻을 수 있습니다. 메서드 이름에서 알 수 있듯이, 해당 경로는 합성 후에 사용됩니다.

위의 예시에서, 평면화 된 DOM은 다음과 같습니다.

```html
<user-card id="userCard">
  #shadow-root
    <div>
      <b>Name:</b>
      <slot name="username">
        <span slot="username">John Smith</span>
      </slot>
    </div>
</user-card>
```


따라서, `<span slot="username">`을 클릭하면 `event.composedPath()`이 호출되고, 배열을 반환합니다: [`span`, `slot`, `div`, `shadow-root`, `user-card`, `body`, `html`, `document`, `window`]. 이것이 바로 합성 후 평면화 된 DOM에 있는 타깃 요소의 부모 체인입니다.

```warn header="Shadow tree 세부 사항은 `{mode:'open'}`트리에만 제공됩니다" 
shadow 트리가 `{mode: 'closed'}`로 생성 된 경우, 구성된 경로는 호스트인 `user-card` 및 위쪽에서 부터 시작합니다.

이것은 Shadow DOM에서 작동하는 다른 메서드와 유사한 원리입니다. closed 된 트리의 내부는 완전히 숨겨집니다.
```


## event.composed

대부분의 이벤트는 Shadow DOM 경계를 통해 성공적으로 버블링됩니다. 그렇지 않은 이벤트는 거의 없습니다.

이것은 `composed`된 이벤트 객체 속성에 의해 관리됩니다. 만약 `true`이면 이벤트가 경계를 넘습니다. 그렇지 않으면, Shadow DOM 내부에서만 감지될 수 있습니다.

[UI 이벤트 사양](https://www.w3.org/TR/uievents)을 살펴보면, 대부분의 이벤트가 `composed: true` 를 가지고 있습니다.

- `blur`, `focus`, `focusin`, `focusout`,
- `click`, `dblclick`,
- `mousedown`, `mouseup` `mousemove`, `mouseout`, `mouseover`,
- `wheel`,
- `beforeinput`, `input`, `keydown`, `keyup`.

모든 터치 이벤트와 포인터 이벤트도 `composed: true`를 가집니다.

`composed: false`를 가지는 몇몇 이벤트들도 있습니다.

- `mouseenter`, `mouseleave` (전혀 버블링되지 않습니다),
- `load`, `unload`, `abort`, `error`,
- `select`,
- `slotchange`.

이러한 이벤트는 이벤트 타깃이 존재하는 동일한 DOM 내의 요소에서만 포착 할 수 있습니다.

## 사용자 지정 이벤트

사용자 지정 이벤트를 전달할 때, `bubbles`과 `composed` 속성을 모두 `true`로 설정해야 컴포넌트 외부로 버블링 됩니다.

예를 들어, 여기에서는 `div#outer`의 Shadow DOM에 `div#inner`를 만들고 여기에 두 개의 이벤트를 트리거합니다. `composed: true`인 것만 문서 외부에 표시됩니다.

```html run untrusted height=0
<div id="outer"></div>

<script>
outer.attachShadow({mode: 'open'});

let inner = document.createElement('div');
outer.shadowRoot.append(inner);

/*
div(id=outer)
  #shadow-dom
    div(id=inner)
*/

document.addEventListener('test', event => alert(event.detail));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
*!*
  composed: true,
*/!*
  detail: "composed"
}));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
*!*
  composed: false,
*/!*
  detail: "not composed"
}));
</script>
```

## 요약

이벤트는 `composed` 플래그가 `true`로 설정된 경우에만 Shadow DOM 경계를 넘어갑니다.

기본 제공 이벤트는 관련 사양에 설명 된대로 대부분 `composed: true`을 가집니다.

- UI 이벤트 <https://www.w3.org/TR/uievents>.
- 터치 이벤트 <https://w3c.github.io/touch-events>.
- 포인터 이벤트 <https://www.w3.org/TR/pointerevents>.
- 기타

`composed: false`를 가지는 몇몇 기본제공 이벤트도 있습니다.

- `mouseenter`, `mouseleave` (마찬가지로 버블링되지 않습니다),
- `load`, `unload`, `abort`, `error`,
- `select`,
- `slotchange`.

이러한 이벤트는 동일한 DOM 내의 요소에서만 포착 될 수 있습니다.

`CustomEvent`를 디스패치하는 경우, `composed: true`를 명시적으로 설정해야합니다.

중첩 된 컴포넌트의 경우, 하나의 Shadow DOM이 다른 컴포넌트에 중첩 될 수 있습니다. 이 경우 composed된 이벤트는 모든 Shadow DOM 경계를 통해 버블 링됩니다. 따라서, 이벤트가 가까이에 둘러싸고 있는 컴포넌트에만 사용되는 경우, shadow 호스트에 이벤트를 전달하고 `composed: false`로 설정할 수도 있습니다. 그렇다면 컴포넌트 Shadow DOM을 벗어나지만, 더 높은 수준의 DOM으로 버블링되지 않습니다.
