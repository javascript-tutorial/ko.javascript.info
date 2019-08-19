# 문서 수정하기

"살아있는" 페이지를 만들기 위해선 DOM 조작이 필요합니다.

이번 주제에선 새롭게 요소를 생성하는 방법과 페이지 상에 이미 존재하는 콘텐츠를 어떻게 수정하는지 살펴보도록 하겠습니다.

## 예제: 메시지 보여주기

Let's see the methods on example. We'll add a message on the page that looks nicer than `alert`.

아래와 같은 alert 창을 살펴봅시다:

```html autorun height="80"
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

*!*
<div class="alert">
  <strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.
</div>
*/!*
```

That was an HTML example. Now let's create the same `div` with JavaScript (assuming that the styles are in the HTML or an external CSS file).

## 요소 생성하기

To create DOM nodes, there are two methods:

`document.createElement(tag)`
: 태그 이름을 가지고 새로운 요소 만들기:

    ```js
    let div = document.createElement('div');
    ```

`document.createTextNode(text)`
: 원하는 텍스트를 가지고 새로운 *텍스트 노드* 만들기:

    ```js
    let textNode = document.createTextNode('안녕하세요');
    ```

### 메시지 생성하기

In our case the message is a `div` with `alert` class and the HTML in it:

```js
let div = document.createElement('div');
div.className = "alert";
div.innerHTML = "<strong>Hi there!</strong> You've read an important message.";
```

We created the element, but as of now it's only in a variable. We can't see the element on the page, as it's not yet a part of the document.

## 메서드 삽입하기

`div`가 브라우저에 나타나게 하려면 이걸 `document` 내 어딘가에 삽입해야 합니다. 예를 들어 `document.body`안에라던가 말이죠.

There's a special method `append` for that: `document.body.append(div)`.

코드로 살펴보죠:

```html run height="80"
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

<script>
  let div = document.createElement('div');
  div.className = "alert";
  div.innerHTML = "<strong>Hi there!</strong> You've read an important message.";

*!*
  document.body.append(div);
*/!*
</script>
```

This set of methods provides more ways to insert:

- `node.append(...nodes or strings)` -- 노드나 문자열을 `node` 끝에 삽입해줍니다.
- `node.prepend(...nodes or strings)` -- 노드나 문자열을 `node` 맨 앞에 삽입해줍니다.
- `node.before(...nodes or strings)` –-  노드나 문자열을 `node` 이전에 삽입해줍니다.
- `node.after(...nodes or strings)` –- 노드나 문자열을 `node` 다음에 삽입해줍니다.
- `node.replaceWith(...nodes or strings)` –- `node`를 새로운 노드나 문자열로 대체합니다.

Here's an example of using these methods to add items to a list and the text before/after it:

```html autorun
<ol id="ol">
  <li>0</li>
  <li>1</li>
  <li>2</li>
</ol>

<script>
  ol.before('before'); // insert string "before" before <ol>
  ol.after('after'); // insert string "after" after <ol>

  let liFirst = document.createElement('li');
  liFirst.innerHTML = 'prepend';
  ol.prepend(liFirst); // insert liFirst at the beginning of <ol>

  let liLast = document.createElement('li');
  liLast.innerHTML = 'append';
  ol.append(liLast); // insert liLast at the end of <ol>
</script>
```

Here's a visual picture what methods do:

![](before-prepend-append-after.svg)

리스트가 이렇게 변경되죠:

```html
before
<ol id="ol">
  <li>prepend</li>
  <li>0</li>
  <li>1</li>
  <li>2</li>
  <li>append</li>
</ol>
after
```

이 메서드들은 복수의 노드와 문자열을 한 번에 넣을 수 있게도 해줍니다.

문자열과 요소를 한 번에 삽입하는 예를 살펴보죠:

```html run
<div id="div"></div>
<script>
  div.before('<p>Hello</p>', document.createElement('hr'));
</script>
```

모든 문자는 *문자*그 자체로 삽입되었습니다.

위 코드 실행 후 나타나는 HTML은 다음과 같습니다:

```html run
*!*
&lt;p&gt;Hello&lt;/p&gt;
*/!*
<hr>
<div id="div"></div>
```

문자열이 `elem.textContent`를 사용한 것과 같이 안전한 방법으로 삽입되었습니다.

이런 특징 때문에 이 메서드들은 DOM 노드나 문자열을 삽입할 때만 사용해야 합니다.

그런데 만약 `elem.innerHTML`을 사용한 것처럼 "HTML 자체"를 삽입하고 싶다면 어떻게 해야 할까요?

## insertAdjacentHTML/Text/Element

For that we can use another, pretty versatile method: `elem.insertAdjacentHTML(where, html)`.

이 메서드의 첫 번째 매개변수는 삽입할 위치를 지정해주는 문자열이고 반드시 다음 값 중 하나여야 합니다:

- `"beforebegin"` -- `elem` 바로 앞에 `html`을 삽입합니다 ,
- `"afterbegin"` -- `elem`의 첫 번째 자식 요소 바로 앞에 `html`을 삽입합니다.
- `"beforeend"` -- `elem`의 마지막 자식 요소 바로 다음에 `html`을 삽입합니다.
- `"afterend"` -- `elem` 바로 다음에 `html`을 삽입합니다.

두 번째 매개변수는 HTML 문자열이고, HTML "그 자체"로 삽입됩니다.

예시:

```html run
<div id="div"></div>
<script>
  div.insertAdjacentHTML('beforebegin', '<p>Hello</p>');
  div.insertAdjacentHTML('afterend', '<p>Bye</p>');
</script>
```

위 코드는 아래와 같이 변합니다:

```html run
<p>Hello</p>
<div id="div"></div>
<p>Bye</p>
```

이렇게 하면 HTML을 페이지에 삽입할 수 있습니다.

insertAdjacentHTML을 사용한 삽입을 도식화하면 다음과 같습니다:

![](insert-adjacent.svg)

이 그림과 이전 그림이 꽤 유사하게 생겼다는 걸 알아차리실 수 있을 겁니다. 삽입하려는 지점은 두 그림에서 완전히 같고, HTML을 삽입하려는 점만 다르다는 걸 관찰 할 수 있습니다.

이 메서드와 유사한 기능을 가진 다른 메서드는 아래와 같이 2개가 있습니다

- `elem.insertAdjacentText(where, text)` -- 같은 기능이며 HTML대신 `text(문자열)`을 문자열 그 자체로 삽입합니다,
- `elem.insertAdjacentElement(where, elem)` -- 역시 같은 기능이며, 요소 삽입에 쓰입니다

이 두 메서드는 메서드 신택스를 유사하게 해 구색을 갖추려고 만들어졌습니다. 실제론 대부분 `insertAdjacentHTML`만 사용됩니다. 요소나 문자는 `append/prepend/before/after`메서드가 있고, 이 메서드들이 더 짧고, 요소 노드나 text 조각을 쉽게 삽입할 수 있게 해주기 때문입니다.

자 이제 alert 메시지 예제를 다시 작성해보도록 합시다:

```html run
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

<script>
  document.body.insertAdjacentHTML("afterbegin", `<div class="alert">
    <strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.
  </div>`);
</script>
```

## Node removal

To remove a node, there's a method `node.remove()`.

Let's make our message disappear after a second:

```html run untrusted
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

<script>
  let div = document.createElement('div');
  div.className = "alert";
  div.innerHTML = "<strong>Hi there!</strong> You've read an important message.";

  document.body.append(div);
*!*
  setTimeout(() => div.remove(), 1000);
*/!*
</script>
```

Please note: if we want to *move* an element to another place -- there's no need to remove it from the old one.

**All insertion methods automatically remove the node from the old place.**

For instance, let's swap elements:

```html run height=50
<div id="first">First</div>
<div id="second">Second</div>
<script>
  // no need to call remove
  second.after(first); // take #second and after it insert #first
</script>
```

## 노드 복제하기: cloneNode

위의 예제에서 유사한 메시지 하나를 더 띄워주려면 어떻게 해야 할까요?

We could make a function and put the code there. But the alternative way would be to *clone* the existing `div` and modify the text inside it (if needed).

큰 요소를 다룰 땐 이 대안이 좀 더 빠르고 간단합니다.

- `elem.cloneNode(true)`는 자신을 호출한 노드의 "깊은" 복제본을 생성합니다. 매개변수가 true이면 자손 노드 전체를 복제합니다. `elem.cloneNode(false)`은 해당 노드 하나만 복제합니다.

이를 이용해 메시지 띄어주기 예시를 다시 작성해봅시다:

```html run height="120"
<style>
.alert {
  padding: 15px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>

<div class="alert" id="div">
  <strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.
</div>

<script>
*!*
  let div2 = div.cloneNode(true); // clone the message
  div2.querySelector('strong').innerHTML = '안녕히 가세요!'; // change the clone

  div.after(div2); // show the clone after the existing div
*/!*
</script>
```

## DocumentFragment [#document-fragment]

`DocumentFragment`는 특별한 DOM 노드 타입으로, 여러 노드로 구성된 그룹을 전달하는 데 쓰이는 래퍼(wrapper) 역할을 합니다.

문서에 있는 다른 노드를 DocumentFragment에 추가하는 것도 가능합니다. 하지만, 이렇게 만들어진 DocumentFragment를 문서 어딘가에 삽입하면, DocumentFragment는 사라집니다. 물론 DocumentFragment안에 들어있던 노드는 문서에 추가가 되기 때문에 사라지지 않죠. 

예시를 살펴봅시다. 아래의 `getListContent` 함수는  `<li>` 노드로 구성된 fragment를 만들고, 이 fragment를 `<ul>`에 추가해 줍니다.

```html run
<ul id="ul"></ul>

<script>
function getListContent() {
  let fragment = new DocumentFragment();

  for(let i=1; i<=3; i++) {
    let li = document.createElement('li');
    li.append(i);
    fragment.append(li);
  }

  return fragment;
}

*!*
ul.append(getListContent()); // (*)
*/!*
</script>
```

`(*)`로 표시한 마지막 줄에서 `DocumentFragment`를 추가해 주었지만, 추가한 fragment가 문서에 녹아들었기 때문에 최종 결과물은 아래와 같아진다는 점에 유의하시기 바랍니다.

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

`DocumentFragment`를 직접 사용하는 일은 드뭅니다. 여러 노드로 구성된 배열을 만들어 반환 할 수 있으므로, 이렇게 특별한 종류의 노드를 만들 필요가 없기 때문입니다. 위 예시를 `DocumentFragment` 없이 다시 작성해 보도록 하겠습니다. 

```html run
<ul id="ul"></ul>

<script>
function getListContent() {
  let result = [];

  for(let i=1; i<=3; i++) {
    let li = document.createElement('li');
    li.append(i);
    result.push(li);
  }

  return result;
}

*!*
ul.append(...getListContent()); // append + "..." operator = friends!
*/!*
</script>
```

여기서 `DocumentFragment`를 언급하고 넘어가는 이유는, [template](info:template-element) 요소와 같이 `DocumentFragment`를 기반으로 만들어진 개념이 있기 때문입니다. template 요소는 추후 다루도록 하겠습니다.  

## Old-school insert/remove methods

[old]

There are also "old school" DOM manipulation methods, existing for historical reasons.

These methods come from really ancient times. Nowadays, there's no reason to use them, as modern methods, such as `append`, `prepend`, `before`, `after`, `remove`, `replaceWith`, are more flexible.

The only reason we list these methods here is that you can find them in many old scripts:

`parentElem.appendChild(node)`
: Appends `node` as the last child of `parentElem`.

    The following example adds a new `<li>` to the end of `<ol>`:

    ```html run height=100
    <ol id="list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
    </ol>

    <script>
      let newLi = document.createElement('li');
      newLi.innerHTML = 'Hello, world!';

      list.appendChild(newLi);
    </script>
    ```

`parentElem.insertBefore(node, nextSibling)`
: Inserts `node` before `nextSibling` into `parentElem`.

    The following code inserts a new list item before the second `<li>`:

    ```html run height=100
    <ol id="list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
    </ol>
    <script>
      let newLi = document.createElement('li');
      newLi.innerHTML = 'Hello, world!';

    *!*
      list.insertBefore(newLi, list.children[1]);
    */!*
    </script>
    ```
    To insert `newLi` as the first element, we can do it like this:

    ```js
    list.insertBefore(newLi, list.firstChild);
    ```

`parentElem.replaceChild(node, oldChild)`
: Replaces `oldChild` with `node` among children of `parentElem`.

`parentElem.removeChild(node)`
: Removes `node` from `parentElem` (assuming `node` is its child).

    The following example removes first `<li>` from `<ol>`:

    ```html run height=100
    <ol id="list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
    </ol>

    <script>
      let li = list.firstElementChild;
      list.removeChild(li);
    </script>
    ```

All these methods return the inserted/removed node. In other words, `parentElem.appendChild(node)` returns `node`. But usually the returned value is not used, we just run the method.

## A word about "document.write"

웹페이지에 뭔가를 더해주는 기능을 하는 아주 오래된 메서드가 하나 있습니다: `document.write`

이렇게 쓰입니다:

```html run
<p>Somewhere in the page...</p>
*!*
<script>
  document.write('<b>Hello from JS</b>');
</script>
*/!*
<p>The end</p>
```

`document.write(html)`메서드는 `html`을 페이지에 "동적으로" 추가해줍니다. `html`문자열이 동적으로 생성되기 때문에 꽤 유연하게 작동합니다. 날개를 단 새처럼 동적인 웹페이지를 만드는데 이 메서드를 사용할 수 있습니다.

이 메서드는 DOM도 없고 그 어떤 표준도 존재하지 않을 때 만들어졌습니다. 아주 오래전에 말이죠. 하지만 아직 다양한 곳에서 쓰이기 때문에 살아있습니다.

최근에 들어선 다음과 같은 한계 때문에 이 메서드를 거의 사용하진 않습니다

**`document.write`는 페이지를 불러오는 도중에만 작동합니다.**

페이지가 다 로드되고 나서 다시 호출하면 기존의 콘텐츠는 사라집니다.

예시로 살펴봅시다:

```html run
<p>일 초 후 이 페이지의 콘텐츠는 교체 될 예정입니다...</p>
*!*
<script>
  // 일초후 document.write 실행
  // 일초후는 페이지가 이미 로드되어있는 시점이므로 기존 콘텐츠는 사라지게 됩니다.
  setTimeout(() => document.write('<b>...사라졌습니다.</b>'), 1000);
</script>
*/!*
```

위에서 다룬 다른 DOM 메서드들과 달리 페이지가 다 로드된 시점에선 사용할 수 없습니다.

That's the downside.

There's an upside also. Technically, when `document.write` is called while the browser is reading ("parsing") incoming HTML, and it writes something, the browser consumes it just as if it were initially there, in the HTML text.

So it works blazingly fast, because there's *no DOM modification* involved. It writes directly into the page text, while the DOM is not yet built.

만약 엄청나게 많은 문자열을 HTML에 동적으로 더해줘야 하고, 아직 페이지가 로딩되기 전 시점이면서 속도가 중요한 상황이라면 이 메서드가 유용할 수 있습니다. 하지만 실제 이런 조건을 한 번에 충족해야 하는 상황이 흔치 않죠. 이런 스크립트가 눈에 띈다면 그건 그냥 오래된 스크립트라서 그런 겁니다.  

## 요약

- Methods to create new nodes:
    - `document.createElement(tag)` -- creates an element with the given tag,
    - `document.createTextNode(value)` -- creates a text node (rarely used),
    - `elem.cloneNode(deep)` -- clones the element, if `deep==true` then with all descendants.  

- Insertion and removal:
    - `node.append(...nodes or strings)` -- insert into `node`, at the end,
    - `node.prepend(...nodes or strings)` -- insert into `node`, at the beginning,
    - `node.before(...nodes or strings)` –- insert right before `node`,
    - `node.after(...nodes or strings)` –- insert right after `node`,
    - `node.replaceWith(...nodes or strings)` –- replace `node`.
    - `node.remove()` –- remove the `node`.

    Text strings are inserted "as text".

- There are also "old school" methods:
    - `parent.appendChild(node)`
    - `parent.insertBefore(node, nextSibling)`
    - `parent.removeChild(node)`
    - `parent.replaceChild(newElem, node)`

    All these methods return `node`.

- Given a piece of HTML: `elem.insertAdjacentHTML(where, html)`, inserts depending on `where`:
    - `"beforebegin"` -- insert `html` right before `elem`,
    - `"afterbegin"` -- insert `html` into `elem`, at the beginning,
    - `"beforeend"` -- insert `html` into `elem`, at the end,
    - `"afterend"` -- insert `html` right after `elem`.

    Also there are similar methods `elem.insertAdjacentText` and `elem.insertAdjacentElement`, they insert text strings and elements, but they are rarely used.

- To append HTML to the page before it has finished loading:
    - `document.write(html)`

    After the page is loaded such a call erases the document. Mostly seen in old scripts.
