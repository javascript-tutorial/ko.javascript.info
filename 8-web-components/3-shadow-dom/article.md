# Shadow DOM

Shadow DOM serves for encapsulation. It allows a component to have its very own "shadow" DOM tree, that can't be accidentally accessed from the main document, may have local style rules, and more.
<!--Shadow Dom은 캡슐화에 사용됩니다. 구성요소가 실수로 주요 문서에 엑세스 할 수 없고 로컬 스타일 등을 가질 수 있는 한 컴포넌트 자체의 "shadow" Dom 트리를 가질 수 있습니다.-->
## Built-in shadow DOM

Did you ever think how complex browser controls are created and styled?
<!-- 어떻게 복합 브라우저 컨트롤이 만들어지고 꾸며지는지 생각해본 적 있나요? -->
Such as `<input type="range">`:
<!--예`<input type="range">`:-->
<p>
<input type="range">
</p>

The browser uses DOM/CSS internally to draw them. That DOM structure is normally hidden from us, but we can see it in developer tools. E.g. in Chrome, we need to enable in Dev Tools "Show user agent shadow DOM" option.
<!--브라우저는 DOM/CSS를 내부적으로 사용합니다. DOM구조는 일반적으로 사용자에게 가려져 있지만, 개발자 도구를 사용하여 볼 수 있습니다.예를 들어 Chrome에서는 Dev Tools "Show user agent shadow DOM"옵션을 활성화해야합니다.-->
Then `<input type="range">` looks like this:
<!--`<input type="range">`는 다음과 같아 보입니다:-->
![](shadow-dom-range.png)

What you see under `#shadow-root` is called "shadow DOM".
<!-- `#shadow-root`아래에 보이는 것은 "shadow DOM"이라고 합니다. -->
We can't get built-in shadow DOM elements by regular JavaScript calls or selectors. These are not regular children, but a powerful encapsulation technique.
<!-- 정규 자바스크립트 호출 또는 선택자로는 내장된 shadow DOM을 호출할 수 없습니다. 정규 자식이 아니지만, 강력한 캡슐화 기술입니다. -->
In the example above, we can see a useful attribute `pseudo`. It's non-standard, exists for historical reasons. We can use it style subelements with CSS, like this:
<!-- 위의 예시 중, 유용한 속성인 `psedo`를 볼 수 있습니다. 비-표준이지만, 계층적인 이유로 존재하고 있습니다. CSS와 같이 스타일 하위요소들을 다음과 같이 사용할 수 있습니다:  -->
```html run autorun
<style>
/* make the slider track red */
input::-webkit-slider-runnable-track {
  background: red; 
}
</style>

<input type="range">
```

Once again, `pseudo` is a non-standard attribute. Chronologically, browsers first started to experiment with internal DOM structures to implement controls, and then, after time, shadow DOM was standardized to allow us, developers, to do the similar thing.
<!--다시한번 말하지만 `pseudo`는 비정규적인 속성이다. 브라우저는 컨트롤을 구현하기 위해 먼저 내부 DOM 구조를 실험하기 시작했으며, 시간이 지나더라도 개발자가 비슷한 작업을 수행 할 수 있도록 Shadow DOM이 표준화되었습니다.  -->

Further on, we'll use the modern shadow DOM standard, covered by [DOM spec](https://dom.spec.whatwg.org/#shadow-trees) other related specifications.
더 나아가, DOM 스펙이 다른 관련 스펙에 적용이 되는 최신 Shadow DOM 표준을 사용합니다.
## Shadow tree

A DOM element can have two types of DOM subtrees:

1. Light tree -- a regular DOM subtree, made of HTML children. All subtrees that we've seen in previous chapters were "light".
2. Shadow tree -- a hidden DOM subtree, not reflected in HTML, hidden from prying eyes.

If an element has both, then the browser renders only the shadow tree. But we can setup a kind of composition between shadow and light trees as well. We'll see the details later in the chapter <info:slots-composition>.

Shadow tree can be used in Custom Elements to hide component internals and apply component-local styles.

For example, this `<show-hello>` element hides its internal DOM in shadow tree:

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

That's how the resulting DOM looks in Chrome dev tools, all the content is under "#shadow-root":

![](shadow-dom-say-hello.png)

First, the call to `elem.attachShadow({mode: …})` creates a shadow tree.

There are two limitations:
1. We can create only one shadow root per element.
2. The `elem` must be either a custom element, or one of: "article", "aside", "blockquote", "body", "div", "footer", "h1..h6", "header", "main" "nav", "p", "section", or "span". Other elements, like `<img>`, can't host shadow tree.

The `mode` option sets the encapsulation level. It must have any of two values:
- `"open"` -- the shadow root is available as `elem.shadowRoot`.

    Any code is able to access the shadow tree of `elem`.   
- `"closed"` -- `elem.shadowRoot` is always `null`.

    We can only access the shadow DOM by the reference returned by `attachShadow` (and probably hidden inside a class). Browser-native shadow trees, such as  `<input type="range">`, are closed. There's no way to access them.

The [shadow root](https://dom.spec.whatwg.org/#shadowroot), returned by `attachShadow`, is like an element: we can use `innerHTML` or DOM methods, such as `append`, to populate it.

The element with a shadow root is called a "shadow tree host", and is available as the shadow root `host` property:

```js
// assuming {mode: "open"}, otherwise elem.shadowRoot is null
alert(elem.shadowRoot.host === elem); // true
```

## Encapsulation

Shadow DOM is strongly delimited from the main document:

1. Shadow DOM elements are not visible to `querySelector` from the light DOM. In particular,  Shadow DOM elements may have ids that conflict with those in the light DOM. They must be unique only within the shadow tree.
2. Shadow DOM has own stylesheets. Style rules from the outer DOM don't get applied.

For example:

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

1. The style from the document does not affect the shadow tree.
2. ...But the style from the inside works.
3. To get elements in shadow tree, we must query from inside the tree.

## References

- DOM: <https://dom.spec.whatwg.org/#shadow-trees>
- Compatibility: <https://caniuse.com/#feat=shadowdomv1>
- Shadow DOM is mentioned in many other specifications, e.g. [DOM Parsing](https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin) specifies that shadow root has `innerHTML`.


## Summary

Shadow DOM is a way to create a component-local DOM.

1. `shadowRoot = elem.attachShadow({mode: open|closed})` -- creates shadow DOM for `elem`. If `mode="open"`, then it's accessible as `elem.shadowRoot` property.
2. We can populate `shadowRoot` using `innerHTML` or other DOM methods.

Shadow DOM elements:
- Have their own ids space,
- Invisible to JavaScript selectors from the main document, such as `querySelector`,
- Use styles only from the shadow tree, not from the main document.

Shadow DOM, if exists, is rendered by the browser instead of so-called "light DOM" (regular children). In the chapter <info:slots-composition> we'll see how to compose them.
