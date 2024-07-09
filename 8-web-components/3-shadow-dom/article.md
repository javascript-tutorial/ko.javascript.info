# Shadow DOM

Shadow Dom은 캡슐화에 사용됩니다. 구성요소가 실수로 주요 문서에 엑세스할 수 없으며, 로컬 스타일 등을 가질 수 있는 한 컴포넌트 자체의 "shadow" Dom 트리를 가질 수 있습니다.

## 내장된 shadow DOM

어떻게 복합 브라우저 컨트롤이 구성되는지 생각해본 적 있나요?

`<input type="range">`은 이렇게 구성됩니다:

<p>
<input type="range">
</p>

브라우저는 DOM/CSS를 내부적으로 사용합니다. DOM 구조는 일반적으로 사용자에게 가려져 있지만, 개발자 도구를 사용하여 볼 수 있습니다. 예를 들어 Chrome에서는 Dev Tools "Show user agent shadow DOM" 옵션을 활성화해야 합니다.

`<input type="range">`는 다음과 같아 보입니다:
![](shadow-dom-range.png)


`#shadow-root` 아래에 보이는 것은 "shadow DOM"이라고 합니다.

정규 자바스크립트 호출 또는 선택자로는 내장된 shadow DOM을 호출할 수 없습니다. 정규 자식이 아니지만, 강력한 캡슐화 기술입니다.

위의 예시 중, 유용한 속성인 `pseudo`를 볼 수 있습니다. 비-표준이지만, 계층적인 이유로 존재하고 있습니다. CSS와 같이 스타일 하위요소들을 다음과 같이 사용할 수 있습니다: 
```html run autorun
<style>
/* make the slider track red */
input::-webkit-slider-runnable-track {
  background: red;
}
</style>

<input type="range">
```


다시 한번 말하지만 `pseudo`는 비정규적인 속성입니다. 브라우저는 컨트롤을 구현하기 위해 먼저 내부 DOM 구조를 실험하기 시작했으며, 시간이 지나더라도 개발자가 비슷한 작업을 수행 할 수 있도록 Shadow DOM이 표준화되었습니다. 

더 나아가, DOM 스펙이 다른 관련 스펙에 적용이 되는 최신 Shadow DOM 표준을 사용합니다.

## Shadow tree

DOM 요소는 2가지 DOM 보조 트리로 이루어져 있습니다:

1. Light tree -- HTML 자식 요소로 구성된 일반 DOM 하위 트리입니다. 이전 장에서 본 모든 하위 트리는 "라이트" 트리였습니다.
2. Shadow tree -- HTML에 반영되지 않은 숨겨진 DOM 하위 트리로 눈에 띄지 않습니다. 

요소가 양쪽에 있는 경우에는, 브라우저는 섀도 트리만을 렌더링합니다. 하지만 섀도 트리와 라이트 트리 사이를 설정할 수 있습니다. 자세한 내용은 <info:slots-composition>에서 나중에 볼 수 있습니다. 
	
섀도 트리는 사용자 정의 요소에서 내부 구성 요소들을 숨기고 구성 요소 로컬 스타일을 적용하는 데 사용할 수 있습니다.

예를 들어, `<show-hello>` 요소는 섀도 트리 안에 있는 내부 DOM에 내부 구성요소들을 숨기고 있습니다:

```html run autorun height=60
<script>
customElements.define('show-hello', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<p>
      Hello, ${this.getAttribute('name')}
    </p>`;
  }  
});
</script>

<show-hello name="John"></show-hello>
```

Chrome 개발 도구에서 결과 DOM이 보이는 방식이고, 모든 콘텐츠는 "# shadow-root"아래에 있습니다:
![](shadow-dom-say-hello.png)


먼저, elem.attachShadow({mode: …})`는 섀도 트리를 생성하는 호출입니다.

2가지 제약이 있습니다:
1. 요소당 하나의 섀도 루트를 만들 수 있습니다.
2. 'elem'은 맞춤 요소이거나 "article", "aside", "blockquote", "body", "div", "footer", "h1… h6", "header", "main" "중 하나 여야합니다. `<img>`와 같은 "nav ","p ","section "또는"span ". 과 같은 다른 요소는 섀도 트리를 호스팅할 수 없습니다.

이 `mode`옵션은 캡슐화 레벨을 설정합니다. 다음 두 값 중 하나를 가져야합니다:
- '"open"'– 섀도 루트는 'elem.shadowRoot' 사용될 수 있습니다.

모든 코드는 섀도 트리의 'elem'에 액세스 할 수 있습니다 .  
`"closed"`–- `elem.shadowRoot`는 항상 null입니다.

반환된 참조 attachShadow(그리고 아마도 클래스 내부에 숨겨져 있는)에 의해서만 Shadow DOM에 접근 할 수 있습니다 . `<input type="range">`와 같은 브라우저 네이티브 섀도 트리는 차단되어 있습니다. 액세스 할 방법이 없습니다.

`attachShadow`에 의해 반환된 [섀도우 루트](https://dom.spec.whatwg.org/#shadowroot)는, 한 요소와 같습니다 :  `append` 처럼 innerHTML 또는 같은 DOM 방법으로,  섀도우 루트를 구성합니다.

쉐도우 루트와 함께 있는 이 요소는 "섀도 트리 호스트"라고 불리고, 하며 섀도 루트 호스트 속성 으로 사용할 수 있습니다:

```js
// assuming {mode: "open"}, otherwise elem.shadowRoot is null
alert(elem.shadowRoot.host === elem); // true
```

## 캡슐화

Shadow DOM은 주요 문서에서 강력하게 구분됩니다:

1. Shadow DOM 요소들은 light DOM에 `querySelector`에서 볼 수 없습니다 . 특히, Shadow DOM 요소에서 light DOM에 있는 ID와 충돌하는 ID가 있을 수 있습니다. Shadow dom에 있는 Id들은 섀도우 트리 내에서만 존재해야합니다.
2. Shadow DOM은 고유의 스타일 시트를 가집니다. 외부의 DOM에서 지정한 스타일 규칙들을 적용하지 못합니다.

다음과 같은 예시가 있습니다:

```html run untrusted height=40
<style>
*!*
  /* document style won't apply to the shadow tree inside #elem (1) */
*/!*
  p { color: red; }
</style>

<div id="elem"></div>

<script>
  elem.attachShadow({mode: 'open'});
*!*
    // shadow tree has its own style (2)
*/!*
  elem.shadowRoot.innerHTML = `
    <style> p { font-weight: bold; } </style>
    <p>Hello, John!</p>
  `;

*!*
  // <p> is only visible from queries inside the shadow tree (3)
*/!*
  alert(document.querySelectorAll('p').length); // 0
  alert(elem.shadowRoot.querySelectorAll('p').length); // 1
</script>  
```

1. 문서에 있는 스타일은 섀도 트리에 영향을 주지 못합니다.
2. ...섀도 트리 내부에 있는 스타일은 작동합니다.
3. 섀도 트리 내에 있는 요소들을 가져오기 위해서는, 트리 내부에서 질의문을 가져와야 합니다.

## 참고문헌

- DOM: <https://dom.spec.whatwg.org/#shadow-trees>
- 호환성: <https://caniuse.com/#feat=shadowdomv1>
- Shadow DOM은 많은 상황에서 특정됩니다, 예를 들어 [DOM Parsing](https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin) 섀도 루트가 `innerHTML` 가질 때처럼 특정됩니다.


## 요약

Shadow DOM은 컴포넌트-로컬 DOM을 만드는 방법 중 하나입니다.

1. `shadowRoot = elem.attachShadow({mode: open|closed})` -- shadow DOM에서 `elem`일 경우에 생성됩니다. `mode="open"`일 경우, `elem.shadowRoot`객체에 접근할 수 있습니다. 
2. `innerHTML` 또는 다른 DOM 메서드를 `shadowRoot`사용하여 접근할 수 있습니다 .

Shadow DOM요소들:
- 자신의 ID 자리를 가지고 있고,
-`querySelector`와 같은,기본 문서로부터 Javascript 선택기에 보이지 않고,
- 주 문서가 아닌,오직 섀도 트리로부터의 스타일을 사용합니다.

Shadow DOM이 있는 경우, 소위 "light DOM" 대신 브라우저에서 렌더링합니다. <info:slots-composition> 장에서 구성하는 방법을 살펴보겠습니다.
