
# Mutation observer

`MutationObserver`는 DOM 요소를 관찰하고 변화에 따라 콜백을 호출하는 내장객체입니다.

먼저 문법을 살펴보고 뒤이어 실무의 예제를 살펴보면서 mutationObserver가 얼마나 유용한지 알아보겠습니다.

## 문법

`MutationObserver`는 사용하기 쉽습니다.

먼저 콜백 함수와 함께 옵저버를 생성합니다.

```js
let observer = new MutationObserver(callback);
```

그리고 나서 DOM 노드를 옵저버에 등록합니다.

```js
observer.observe(node, config);
```

`config`는 '어떤 변화의 종류에 반응할지'에 대한 참 거짓 옵션을 가지는 객체입니다.
- `childList` -- `node`의 바로 아래에 있는 자식 요소의 변화,
- `subtree` -- `node`의 모든 후손,
- `attributes` -- `node`의 속성,
- `attributeFilter` -- 선택한 속성만 관찰하기 위한 속성명의 배열,
- `characterData` -- `node.data`(텍스트 내용)을 관찰할지에 대한 여부,

다른 옵션:
- `attributeOldValue` -- `true`이면 이전 값과 새로운 값의 속성을 콜백 함수로 전달할 수 있습니다. 그렇지 않으면 새 값만 보냅니다(`attributes` 옵션이 필요함).
- `characterDataOldValue` -- `true`이면 이전 값과 새로운 값의 `node.data`를 콜백 함수로 전달할 수 있습니다. 그렇지 않으면 새 값만 보냅니다(`characterData` 옵션이 필요함).

변화가 생기고 나서 해당 `callback`이 실행됩니다. 변화는 첫 번째 인수로 [MutationRecord](https://dom.spec.whatwg.org/#mutationrecord) 객체의 배열이 들어가며 옵저버 자기자신이 두번째 인수로 들어갑니다.

[MutationRecord](https://dom.spec.whatwg.org/#mutationrecord) 객체는 프로퍼티를 가지고 있습니다.

- `type` -- mutation 타입, 아래의 타입들 중 하나
    - `"attributes"`: 속성 수정
    - `"characterData"`: 텍스트 노드에 사용되는 데이터 수정
    - `"childList"`: 자식 요소의 추가·삭제
- `target` -- 변화가 발생한 곳: `"attributes"`의 요소, `"characterData"`의 텍스트 노드,  `"childList"` mutation의 요소 중 하나,
- `addedNodes/removedNodes`  -- 추가·삭제된 노드,
- `previousSibling/nextSibling` -- 추가·삭제된 노드의 이전 및 다음 형제 노드,
- `attributeName/attributeNamespace` -- 변경된 속성의 이름·네임스페이스(XML의 경우),
- `oldValue` -- 해당 옵션이 `attributeOldValue`·`characterDataOldValue`으로 설정된 경우, 속성이나 텍스트 변경에만 따른 이전 값

예를 들어 아래에 `contentEditable`속성을 가진 `<div>`가 있습니다. 해당 속성은 `div`에 포커스가 가고 수정할 수 있게 해줍니다.

```html run
<div contentEditable id="elem">Click and <b>edit</b>, please</div>

<script>
let observer = new MutationObserver(mutationRecords => {
  console.log(mutationRecords); // console.log(the changes)
});

// 속성을 제외한 모든 것을 관찰
observer.observe(elem, {
  childList: true, // 바로 아래 자식 요소를 관찰
  subtree: true, // 하위 후손도 관찰
  characterDataOldValue: true // 콜백에 이전 데이터를 넘김
});
</script>
```

이 코드를 브라우저에서 실행한 다음, 주어진 `<div>`에 포커스를 옮겨 `<b>edit</b>`안의 텍스트를 변경하면 `console.log`는 하나의 mutation을 출력합니다.

```js
mutationRecords = [{
  type: "characterData",
  oldValue: "edit",
  target: <text node>,
  // 다른 프로퍼티는 비어있음
}];
```

`<b>edit</b>`를 삭제하는 등 더 복잡한 수정 연산이 있다면 the mutation 이벤트는 다수의 mutation records를 포함할 수 있습니다.

```js
mutationRecords = [{
  type: "childList",
  target: <div#elem>,
  removedNodes: [<b>],
  nextSibling: <text node>,
  previousSibling: <text node>
  // 다른 프로퍼티는 비어있음
}, {
  type: "characterData"
  target: <text node>
  // ...mutation의 세부사항은 브라우저가 이런 삭제사항을 어떻게 처리하는지에 달려있습니다.
  // 두 개의 인접한 텍스트 노드인 "edit " 과 " please"를 하나의 노드로 통합하거나,
  // "edit " 과 " please"를 별도의 텍스트 노드로 둘 수도 있습니다.
}];
```

따라서 `MutationObserver`는 DOM 하위 트리의 변화에 반응할 수 있게 해줍니다.

## Usage for integration

When such thing may be useful?

Imagine the situation when you need to add a third-party script that contains useful functionality, but also does something unwanted, e.g. shows ads `<div class="ads">Unwanted ads</div>`.

Naturally, the third-party script provides no mechanisms to remove it.

Using `MutationObserver`, we can detect when the unwanted element appears in our DOM and remove it.

There are other situations when a third-party script adds something into our document, and we'd like to detect, when it happens, to adapt our page, dynamically resize something etc.

`MutationObserver` allows to implement this.

## Usage for architecture

There are also situations when `MutationObserver` is good from architectural standpoint.

Let's say we're making a website about programming. Naturally, articles and other materials may contain source code snippets.

Such snippet in an HTML markup looks like this:

```html
...
<pre class="language-javascript"><code>
  // here's the code
  let hello = "world";
</code></pre>
...
```

Also we'll use a JavaScript highlighting library on our site, e.g. [Prism.js](https://prismjs.com/). A call to `Prism.highlightElem(pre)` examines the contents of such `pre` elements and adds into them special tags and styles for colored syntax highlighting, similar to what you see in examples here, at this page.

When exactly to run that highlighting method? We can do it on `DOMContentLoaded` event, or at the bottom of the page. At that moment we have our DOM ready, can search for elements `pre[class*="language"]` and call `Prism.highlightElem` on them:

```js
// highlight all code snippets on the page
document.querySelectorAll('pre[class*="language"]').forEach(Prism.highlightElem);
```

Everything's simple so far, right? There are `<pre>` code snippets in HTML, we highlight them.

Now let's go on. Let's say we're going to dynamically fetch materials from a server. We'll study methods for that [later in the tutorial](info:fetch). For now it only matters that we fetch an HTML article from a webserver and display it on demand:

```js
let article = /* fetch new content from server */
articleElem.innerHTML = article;
```

The new `article` HTML may contain code snippets. We need to call `Prism.highlightElem` on them, otherwise they won't get highlighted.

**Where and when to call `Prism.highlightElem` for a dynamically loaded article?**

We could append that call to the code that loads an article, like this:

```js
let article = /* fetch new content from server */
articleElem.innerHTML = article;

*!*
let snippets = articleElem.querySelectorAll('pre[class*="language-"]');
snippets.forEach(Prism.highlightElem);
*/!*
```

...But imagine, we have many places in the code where we load contents: articles, quizzes, forum posts. Do we need to put the highlighting call everywhere? That's not very convenient, and also easy to forget.

And what if the content is loaded by a third-party module? E.g. we have a forum written by someone else, that loads contents dynamically, and we'd like to add syntax highlighting to it. No one likes to patch third-party scripts.

Luckily, there's another option.

We can use `MutationObserver` to automatically detect when code snippets are inserted in the page and highlight them.

So we'll handle the highlighting functionality in one place, relieving us from the need to integrate it.

### Dynamic highlight demo

Here's the working example.

If you run this code, it starts observing the element below and highlighting any code snippets that appear there:

```js run
let observer = new MutationObserver(mutations => {

  for(let mutation of mutations) {
    // examine new nodes, is there anything to highlight?

    for(let node of mutation.addedNodes) {
      // we track only elements, skip other nodes (e.g. text nodes)
      if (!(node instanceof HTMLElement)) continue;

      // check the inserted element for being a code snippet
      if (node.matches('pre[class*="language-"]')) {
        Prism.highlightElement(node);
      }

      // or maybe there's a code snippet somewhere in its subtree?
      for(let elem of node.querySelectorAll('pre[class*="language-"]')) {
        Prism.highlightElement(elem);
      }
    }
  }

});

let demoElem = document.getElementById('highlight-demo');

observer.observe(demoElem, {childList: true, subtree: true});
```

Here, below, there's an HTML-element and JavaScript that dynamically fills it using `innerHTML`.

Please run the previous code (above, observes that element), and then the code below. You'll see how `MutationObserver` detects and highlights the snippet.

<p id="highlight-demo" style="border: 1px solid #ddd">A demo-element with <code>id="highlight-demo"</code>, run the code above to observe it.</p>

The following code populates its `innerHTML`, that causes the `MutationObserver` to react and highlight its contents:

```js run
let demoElem = document.getElementById('highlight-demo');

// dynamically insert content with code snippets
demoElem.innerHTML = `A code snippet is below:
  <pre class="language-javascript"><code> let hello = "world!"; </code></pre>
  <div>Another one:</div>
  <div>
    <pre class="language-css"><code>.class { margin: 5px; } </code></pre>
  </div>
`;
```

Now we have `MutationObserver` that can track all highlighting in observed elements or the whole `document`. We can add/remove code snippets in HTML without thinking about it.

## Additional methods

There's a method to stop observing the node:

- `observer.disconnect()` -- stops the observation.

When we stop the observing, it might be possible that some changes were not processed by the observer yet.

- `observer.takeRecords()` -- gets a list of unprocessed mutation records, those that happened, but the callback did not handle them.

These methods can be used together, like this:

```js
// we'd like to stop tracking changes
observer.disconnect();

// handle unprocessed some mutations
let mutationRecords = observer.takeRecords();
...
```

```smart header="Garbage collection interaction"
Observers use weak references to nodes internally. That is: if a node is removed from DOM, and becomes unreachable, then it becomes garbage collected.

The mere fact that a DOM node is observed doesn't prevent the garbage collection.
```

## Summary  

`MutationObserver` can react on changes in DOM: attributes, added/removed elements, text content.

We can use it to track changes introduced by other parts of our code, as well as to integrate with third-party scripts.

`MutationObserver` can track any changes. The config "what to observe" options are used for optimizations, not to spend resources on unneeded callback invocations.
