# 노드 프로퍼티: 타입, 태그 그리고 내용(type, tag and contents)

DOM 노드에 대하여 좀 더 살펴보도록 합시다.

In this chapter we'll see more into what they are and learn their most used properties.

## DOM 노드 클래스

Different DOM nodes may have different properties. For instance, an element node corresponding to tag `<a>` has link-related properties, and the one corresponding to `<input>` has input-related properties and so on. Text nodes are not the same as element nodes. But there are also common properties and methods between all of them, because all classes of DOM nodes form a single hierarchy.

각각의 DOM 노드는 그에 대응하는 내장 클래스에 속합니다.

계층구조의 꼭대기엔 [EventTarget](https://dom.spec.whatwg.org/#eventtarget)이 있고, [Node](http://dom.spec.whatwg.org/#interface-node)는 이 EventTarget을 상속받습니다. 다른 DOM 노드들은 Node를 상속받습니다.

아래 그림은 이런 계층구조를 잘 나타냅니다.

![](dom-class-hierarchy.svg)

노드 클래스:

- [EventTarget](https://dom.spec.whatwg.org/#eventtarget) -- is the root "abstract" class. Objects of that class are never created. It serves as a base, so that all DOM nodes support so-called "events", we'll study them later.
- [Node](http://dom.spec.whatwg.org/#interface-node) -- is also an "abstract" class, serving as a base  for DOM nodes. It provides the core tree functionality: `parentNode`, `nextSibling`, `childNodes` and so on (they are getters). Objects of `Node` class are never created. But there are concrete node classes that inherit from it, namely: `Text` for text nodes, `Element` for element nodes and more exotic ones like `Comment` for comment nodes.
- [Element](http://dom.spec.whatwg.org/#interface-element) -- is a base class for DOM elements. It provides element-level navigation like `nextElementSibling`, `children` and searching methods like `getElementsByTagName`, `querySelector`. A  browser supports not only HTML, but also XML and SVG. The `Element` class serves as a base for more specific classes: `SVGElement`, `XMLElement` and `HTMLElement`.
- [HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement) -- is finally the basic class for all HTML elements. It is inherited by concrete HTML elements:
    - [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) -- the class for `<input>` elements,
    - [HTMLBodyElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlbodyelement) -- the class for `<body>` elements,
    - [HTMLAnchorElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlanchorelement) -- the class for `<a>` elements,
    - ...and so on, each tag has its own class that may provide specific properties and methods.

각 노드의 프로퍼티와 메서드는 상속으로부터 만들어집니다.

For example, let's consider the DOM object for an `<input>` element. It belongs to [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) class.

It gets properties and methods as a superposition of (listed in inheritance order):

- `HTMLInputElement` -- this class provides input-specific properties,
- `HTMLElement` -- it provides common HTML element methods (and getters/setters),
- `Element` -- provides generic element methods,
- `Node` -- provides common DOM node properties,.
- `EventTarget` -- gives the support for events (to be covered),
- ...and finally it inherits from `Object`, so "plain object" methods like `hasOwnProperty` are also available.

DOM 노드 클래스 이름을 확인하려면 객체가 `constructor` 프로퍼티를 가진다는 점을 이용할 수 있습니다. `constructor` 프로퍼티는 클래스 생성자를 참조하고, `constructor.name`을 통해 이름을 알아낼 수 있습니다.

```js run
alert( document.body.constructor.name ); // HTMLBodyElement
```

...`toString`을 사용해도 됩니다:

```js run
alert( document.body ); // [object HTMLBodyElement]
```

`instanceof` 를 사용해 상속 관계를 확인할 수 있습니다:

```js run
alert( document.body instanceof HTMLBodyElement ); // true
alert( document.body instanceof HTMLElement ); // true
alert( document.body instanceof Element ); // true
alert( document.body instanceof Node ); // true
alert( document.body instanceof EventTarget ); // true
```

위에서 확인한 바와 같이 DOM 노드도 자바스크립트 객체이므로, 프로토타입 기반의 상속 관계를 가집니다.

브라우저 콘솔에 `console.dir(elem)`를 입력하면 이런 관계를 눈으로 볼 수 있습니다. `HTMLElement.prototype`, `Element.prototype`등이 콘솔에 출력될 것입니다.

```smart header="`console.dir(elem)` 와 `console.log(elem)`"
브라우저 대부분은 개발자 도구에서 `console.log` 와 `console.dir` 명령어를 지원합니다. 이 명령어들은 콘솔에 인수(argument)를 출력해줍니다. 자바스크립트 객체에선 이 두 명령어가 각은 역할을 합니다.

하지만 DOM 요소에선 다른 출력값을 보입니다:

- `console.log(elem)` 는 요소(elem)의 DOM 트리를 출력하고,
- `console.dir(elem)` 는 요소(elem)를 DOM 객체처럼 취급하여 출력합니다. 따라서 프로퍼티를 확인하기 쉽다는 장점이 있습니다.

`document.body`를 통해 그 차이를 직접 확인해보세요.
```

````smart header="스펙 문서에서 쓰이는 IDL"
스펙 문서에선 DOM 클래스를 JavaScript가 아닌 이해하기 쉬운 표기법인 [Interface description language](https://en.wikipedia.org/wiki/Interface_description_language) (IDL)을 이용하여 설명합니다.

IDL은 모든 프로퍼티의 앞에 타입을 붙여서 작성됩니다. `DOMString`과 `boolean` 과 같은 타입이 프로퍼티 앞에 붙게 됩니다.

아래는 스펙 문서의 일부를 발췌하여 주석을 달아놓은 예시입니다:

```js
// HTMLInputElement를 정의
*!*
// 콜론 ":" 은 HTMLInputElement가 HTMLElement로 부터 상속되었다는 것을 의미함 
*/!*
interface HTMLInputElement: HTMLElement {
  // <input> elements 와 관련된 프로퍼티와 메서드

*!*
  // "DOMString"은 아래 프로퍼티의 값이 문자열이라는 것을 의미함
*/!*
  attribute DOMString accept;
  attribute DOMString alt;
  attribute DOMString autocomplete;
  attribute DOMString value;

*!*
  // 불린값을 가지는 프로퍼티 (true/false)
  attribute boolean autofocus;
*/!*
  ...
*!*
  // "void"는 해당 메서드의 리턴값이 없음을 의미함
*/!*
  void select();
  ...
}
```
````

## nodeType 프로퍼티

`nodeType` 프로퍼티는 DOM 노드의 "타입"을 알아내고자 할 때 쓰이는 옛날식의 프로퍼티입니다.

노드 타입은 상숫값을 가집니다:
- `elem.nodeType == 1` 은 요소 노드,
- `elem.nodeType == 3` 은 텍스트(Text) 노드,
- `elem.nodeType == 9` 은 DOCUMENT 객체(document object)를 나타내고,
- [스펙 문서](https://dom.spec.whatwg.org/#node)로 가면 다양한 노드 타입을 볼 수 있습니다.

예시:

```html run
<body>
  <script>  
  let elem = document.body;

  // 어떤 타입일까요?
  alert(elem.nodeType); // 1 => 요소

  // 첫번째 자식 노드는...
  alert(elem.firstChild.nodeType); // 3 => 텍스트

  // 문서객체는 타입이 9
  alert( document.nodeType ); // 9
  </script>
</body>
```

모던 자바스크립트에선 노드 타입을 `instanceof`나 다른 클래스 기반의 테스트를 이용해 확인합니다. 하지만 가끔은 `nodeType`를 쓰는 게 간단할 때도 있습니다. `nodeType`을 쓰면 오직 타입을 읽기만 하고 바꾸지는 못합니다.

## 태그: nodeName 과 tagName

`nodeName` 이나 `tagName` 프로퍼티를 사용하면 DOM 노드의 태그 이름을 알아낼 수 있습니다.

예:

```js run
alert( document.body.nodeName ); // BODY
alert( document.body.tagName ); // BODY
```

그럼 `tagName` 과 `nodeName` 차이는 없는걸까요?

물론 있습니다. 미묘하지만 이름에서 그 차이를 확인할 수 있습니다.

- `tagName` 프로퍼티는 `요소(Element)` 노드에만 존재합니다.
- `nodeName`은 모든 `Node`에서 찾을 수 있습니다:
    - 요소노드에선 `tagName`과 같은 역할을 합니다.
    - text, comment 등의 노드 타입에선 노드 타입을 나타내는 문자열을 리턴합니다.

`nodeName`은 모든 노드에서 지원되지만, `tagName`은 `Element` 클래스로부터 유래되었기 때문에 요소 노드에서만 지원됩니다. 

`document`와 comment 노드로 `tagName` 과 `nodeName`의 차이점을 확인 해 봅시다:


```html run
<body><!-- comment -->

  <script>
    // for comment
    alert( document.body.firstChild.tagName ); // undefined (요소가 아님)
    alert( document.body.firstChild.nodeName ); // #comment

    // for document
    alert( document.tagName ); // undefined (요소가 아님)
    alert( document.nodeName ); // #document
  </script>
</body>
```

요소만 다루고 있다면 `tagName`과 `nodeName`을 사용하면 됩니다. 둘에는 차이가 없습니다.

<<<<<<< HEAD
```smart header="태그 이름은 XHTML을 제외하고 항상 대문자입니다"
브라우저는 HTML과 XML유형의 문서를 다른 방법으로 처리합니다. 웹페이지는 대게 HTML 모드로 처리됩니다. 헤더가 `Content-Type: application/xml+xhtml`인 XML-문서의 경우는 XML 모드로 처리됩니다.
=======
```smart header="The tag name is always uppercase except in XML mode"
The browser has two modes of processing documents: HTML and XML. Usually the HTML-mode is used for webpages. XML-mode is enabled when the browser receives an XML-document with the header: `Content-Type: application/xml+xhtml`.
>>>>>>> 5b195795da511709faf79a4d35f9c5623b6dbdbd

HTML 모드에선 `tagName/nodeName`이 모두 대문자를 리턴합니다. `<body>` 이든 `<BoDy>` 상관없이 `BODY`를 리턴합니다.

XML 모드에선 문자가 그대로 유지되는데, 최근엔 거의 사용되지 않습니다.
```


## innerHTML: 내용 들여다보기

[innerHTML](https://w3c.github.io/DOM-Parsing/#widl-Element-innerHTML) 프로퍼티를 사용하면 요소 안의 HTML을 문자열로 받아올 수 있습니다.

요소 안의 HTML을 수정하는 것도 가능합니다. innerHTML은 페이지를 수정하는 데 쓰이는 강력한 방법의 하나입니다.

아래는 `document.body`안의 내용(contents)을 출력하고 완전히 바꾸는 예시입니다:

```html run
<body>
  <p>A paragraph</p>
  <div>A div</div>

  <script>
    alert( document.body.innerHTML ); // read the current contents
    document.body.innerHTML = 'The new BODY!'; // replace it
  </script>

</body>
```

문법이 틀린 HTML을 넣게 되면 브라우저가 자동으로 이를 고쳐 줄 때도 있습니다:

```html run
<body>

  <script>
    document.body.innerHTML = '<b>test'; // forgot to close the tag
    alert( document.body.innerHTML ); // <b>test</b> (fixed)
  </script>

</body>
```

```smart header="Scripts don't execute"
If `innerHTML` inserts a `<script>` tag into the document -- it becomes a part of HTML, but doesn't execute.
```

### Beware: "innerHTML+=" does a full overwrite

We can append HTML to an element by using `elem.innerHTML+="more html"`.

Like this:

```js
chatDiv.innerHTML += "<div>Hello<img src='smile.gif'/> !</div>";
chatDiv.innerHTML += "How goes?";
```

But we should be very careful about doing it, because what's going on is *not* an addition, but a full overwrite.

Technically, these two lines do the same:

```js
elem.innerHTML += "...";
// is a shorter way to write:
*!*
elem.innerHTML = elem.innerHTML + "..."
*/!*
```

In other words, `innerHTML+=` does this:

1. The old contents is removed.
2. The new `innerHTML` is written instead (a concatenation of the old and the new one).

**As the content is "zeroed-out" and rewritten from the scratch, all images and other resources will be reloaded**.

In the `chatDiv` example above the line `chatDiv.innerHTML+="How goes?"` re-creates the HTML content and reloads `smile.gif` (hope it's cached). If `chatDiv` has a lot of other text and images, then the reload becomes clearly visible.

There are other side-effects as well. For instance, if the existing text was selected with the mouse, then most browsers will remove the selection upon rewriting `innerHTML`. And if there was an `<input>` with a text entered by the visitor, then the text will be removed. And so on.

Luckily, there are other ways to add HTML besides `innerHTML`, and we'll study them soon.

## outerHTML: full HTML of the element

The `outerHTML` property contains the full HTML of the element. That's like `innerHTML` plus the element itself.

Here's an example:

```html run
<div id="elem">Hello <b>World</b></div>

<script>
  alert(elem.outerHTML); // <div id="elem">Hello <b>World</b></div>
</script>
```

**Beware: unlike `innerHTML`, writing to `outerHTML` does not change the element. Instead, it replaces it in the DOM.**

Yeah, sounds strange, and strange it is, that's why we make a separate note about it here. Take a look.

Consider the example:

```html run
<div>Hello, world!</div>

<script>
  let div = document.querySelector('div');

*!*
  // replace div.outerHTML with <p>...</p>
*/!*
  div.outerHTML = '<p>A new element</p>'; // (*)

*!*
  // Wow! 'div' is still the same!
*/!*
  alert(div.outerHTML); // <div>Hello, world!</div> (**)
</script>
```

Looks really odd, right?

In the line `(*)` we replaced `div` with `<p>A new element</p>`. In the outer document (the DOM) we can see the new content instead of the `<div>`. But, as we can see in line `(**)`, the value of the old `div` variable hasn't changed!

The `outerHTML` assignment does not modify the DOM element (the object referenced by, in this case, the variable 'div'), but removes it from the DOM and inserts the new HTML in its place.

So what happened in `div.outerHTML=...` is:
- `div` was removed from the document.
- Another piece of HTML `<p>A new element</p>` was inserted in its place.
- `div` still has its old value. The new HTML wasn't saved to any variable.

It's so easy to make an error here: modify `div.outerHTML` and then continue to work with `div` as if it had the new content in it. But it doesn't. Such thing is correct for `innerHTML`, but not for `outerHTML`.

We can write to `elem.outerHTML`, but should keep in mind that it doesn't change the element we're writing to ('elem'). It puts the new HTML in its place instead. We can get references to the new elements by querying the DOM.

## nodeValue/data: text node content

The `innerHTML` property is only valid for element nodes.

Other node types, such as text nodes, have their counterpart: `nodeValue` and `data` properties. These two are almost the same for practical use, there are only minor specification differences. So we'll use `data`, because it's shorter.

An example of reading the content of a text node and a comment:

```html run height="50"
<body>
  Hello
  <!-- Comment -->
  <script>
    let text = document.body.firstChild;
*!*
    alert(text.data); // Hello
*/!*

    let comment = text.nextSibling;
*!*
    alert(comment.data); // Comment
*/!*
  </script>
</body>
```

For text nodes we can imagine a reason to read or modify them, but why comments?

Sometimes developers embed information or template instructions into HTML in them, like this:

```html
<!-- if isAdmin -->
  <div>Welcome, Admin!</div>
<!-- /if -->
```

...Then JavaScript can read it from `data` property and process embedded instructions.

## textContent: pure text

The `textContent` provides access to the *text* inside the element: only text, minus all `<tags>`.

For instance:

```html run
<div id="news">
  <h1>Headline!</h1>
  <p>Martians attack people!</p>
</div>

<script>
  // Headline! Martians attack people!
  alert(news.textContent);
</script>
```

As we can see, only text is returned, as if all `<tags>` were cut out, but the text in them remained.

In practice, reading such text is rarely needed.

**Writing to `textContent` is much more useful, because it allows to write text the "safe way".**

Let's say we have an arbitrary string, for instance entered by a user, and want to show it.

- With `innerHTML` we'll have it inserted "as HTML", with all HTML tags.
- With `textContent` we'll have it inserted "as text", all symbols are treated literally.

Compare the two:

```html run
<div id="elem1"></div>
<div id="elem2"></div>

<script>
  let name = prompt("What's your name?", "<b>Winnie-the-pooh!</b>");

  elem1.innerHTML = name;
  elem2.textContent = name;
</script>
```

1. The first `<div>` gets the name "as HTML": all tags become tags, so we see the bold name.
2. The second `<div>` gets the name "as text", so we literally see `<b>Winnie-the-pooh!</b>`.

In most cases, we expect the text from a user, and want to treat it as text. We don't want unexpected HTML in our site. An assignment to `textContent` does exactly that.

## The "hidden" property

The "hidden" attribute and the DOM property specifies whether the element is visible or not.

We can use it in HTML or assign using JavaScript, like this:

```html run height="80"
<div>Both divs below are hidden</div>

<div hidden>With the attribute "hidden"</div>

<div id="elem">JavaScript assigned the property "hidden"</div>

<script>
  elem.hidden = true;
</script>
```

Technically, `hidden` works the same as `style="display:none"`. But it's shorter to write.

Here's a blinking element:


```html run height=50
<div id="elem">A blinking element</div>

<script>
  setInterval(() => elem.hidden = !elem.hidden, 1000);
</script>
```

## More properties

DOM elements also have additional properties, in particular those that depend on the class:

- `value` -- the value for `<input>`, `<select>` and `<textarea>` (`HTMLInputElement`, `HTMLSelectElement`...).
- `href` -- the "href" for `<a href="...">` (`HTMLAnchorElement`).
- `id` -- the value of "id" attribute, for all elements (`HTMLElement`).
- ...and much more...

For instance:

```html run height="80"
<input type="text" id="elem" value="value">

<script>
  alert(elem.type); // "text"
  alert(elem.id); // "elem"
  alert(elem.value); // value
</script>
```

Most standard HTML attributes have the corresponding DOM property, and we can access it like that.

If we want to know the full list of supported properties for a given class, we can find them in the specification. For instance, `HTMLInputElement` is documented at <https://html.spec.whatwg.org/#htmlinputelement>.

Or if we'd like to get them fast or are interested in a concrete browser specification -- we can always output the element using `console.dir(elem)` and read the properties. Or explore "DOM properties" in the Elements tab of the browser developer tools.

## Summary

Each DOM node belongs to a certain class. The classes form a hierarchy. The full set of properties and methods come as the result of inheritance.

Main DOM node properties are:

`nodeType`
: We can use it to see if a node is a text or an element node. It has a numeric value: `1` for elements,`3` for text nodes, and a few others for other node types. Read-only.

`nodeName/tagName`
: For elements, tag name (uppercased unless XML-mode). For non-element nodes `nodeName` describes what it is. Read-only.

`innerHTML`
: The HTML content of the element. Can be modified.

`outerHTML`
: The full HTML of the element. A write operation into `elem.outerHTML` does not touch `elem` itself. Instead it gets replaced with the new HTML in the outer context.

`nodeValue/data`
: The content of a non-element node (text, comment). These two are almost the same, usually we use `data`. Can be modified.

`textContent`
: The text inside the element: HTML minus all `<tags>`. Writing into it puts the text inside the element, with all special characters and tags treated exactly as text. Can safely insert user-generated text and protect from unwanted HTML insertions.

`hidden`
: When set to `true`, does the same as CSS `display:none`.

정리하자면 `innerHTML+=` 은 다음과 같은 기능을 수행합니다:

However, HTML attributes and DOM properties are not always the same, as we'll see in the next chapter.
