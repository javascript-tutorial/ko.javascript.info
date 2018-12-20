# 노드 프로퍼티(Node properties): 타입, 태그 그리고 내용(type, tag and contents)

DOM 노드에 대하여 좀 더 살펴보도록 합시다.

이번 주제에선 노드가 무엇인지 그리고 많이 쓰이는 프로퍼티에 대해서 알아보도록 하겠습니다.

## DOM 노드 클래스

DOM노드는 클래스에 따라 각각 다른 프로퍼티를 가집니다. `<a>`태그에 대응하는 요소노드의 경우 링크와 관련된 프로퍼티를 가지고 `<input>`태그에 대응하는 요소노드의 경우 입력과 관련된 프로퍼티를 가지는 것이 그 예입니다. 텍스트 노드는 요소 노드와는 다릅니다. 하지만 모든 노드 클래스는 공통의 계층(Node)으로부터 상속되므로 같은 기본 프로퍼티와 메서드를 공유합니다.  

각각의 DOM 노드는 그에 대응하는 내장 클래스에 속하게 됩니다.

계층구조의 꼭대기엔 [EventTarget](https://dom.spec.whatwg.org/#eventtarget)이 있고, [Node](http://dom.spec.whatwg.org/#interface-node)는 이 EventTarget을 상속받습니다. 다른 DOM 노드들은 Node를 상속 받습니다.

이런 계층구조를 설명해주는 그림이 아래에 있습니다:

![](dom-class-hierarchy.png)

노드 클래스:

- [EventTarget](https://dom.spec.whatwg.org/#eventtarget) -- 계층의 뿌리에 있는 "추상" 클래스입니다. 이 클래스를 구현한 객체는 절대 생성되지 않습니다. 모든 노드가 "events"라는 걸 지원하도록 하는 기반의 역할을 합니다. 이부분에 대해선 추후 이야기 할 예정입니다.
- [Node](http://dom.spec.whatwg.org/#interface-node) -- DOM 노드의 기초가 되는 "추상" 클래스 입니다. `parentNode`, `nextSibling`, `childNodes`와 같은 노드사이 이동에 관련된 getter 메서드를 지원합니다. `Node` 클래스를 구현한 객체는 절대 생성되지 않습니다. 하지만 이 추상클래스를 상속받는 구체적인 클래스는 존재합니다. Text 노드를 위한 `Text`, 요소, Element 노드를 위한 `Element`, Comment 노드를 위한 `Comment`가 그 예입니다.
- [Element](http://dom.spec.whatwg.org/#interface-element) -- DOM 요소의 기초가 되는 클래스입니다. `nextElementSibling`, `children`와 같은 요소레벨 탐색 관련 프로퍼티와 `getElementsByTagName`, `querySelector`와 같은 검색 메서드를 제공합니다. 브라우저에는 HTML뿐만 아니라 XML, SVG가 있을 수 있습니다. `Element` 클래스는 `SVGElement`, `XMLElement`, `HTMLElement`의 기초가 됩니다.
- [HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement) -- 모든 HTML 요소의 기초가 되는 클래스입니다. 다양한 HTML요소들은 이 클래스를 상속받습니다.
    - [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) -- `<input>` 요소를 위한 클래스
    - [HTMLBodyElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlbodyelement) -- `<body>` 요소를 위한 클래스
    - [HTMLAnchorElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlanchorelement) -- `<a>` 요소를 위한 클래스
    - 이 외에도 각각의 태그는 특정 프로퍼티와 메서드를 제공하는 자신만의 클래스를 가집니다.

각 노드의 프로퍼티와 메서드는 상속으로부터 만들어짐을 알 수 있습니다.

예를들어 `<input>` 요소에 대응하는 DOM 객체를 생각해 봅시다. 이 객체는 [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) 클래스에 속합니다. 
따라서 아래 상속 관계에 따라 프로퍼티와 메서드를 갖게 됩니다. 
 For example, let's consider the DOM object for an `<input>` element. 
  It belongs to [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) class. It gets properties and methods as a superposition of:

- `HTMLInputElement` -- 이 클래스는 입력과관련된 프로퍼티를 제공합니다. 그리고 아래로부터 상속됩니다...
- `HTMLElement` -- HTML 요소 메서드(getter/setter)를 제공합니다. 그리고 아래로부터 상속됩니다...
- `Element` -- 전반적인 요소 메서드를 제공합니다. 그리고 아래로부터 상속됩니다...
- `Node` -- 전반적인 DOM 노드 프로퍼티를 제공합니다. 그리고 아래로부터 상속됩니다...
- `EventTarget` -- 이벤트와 관련된 일을 합니다(뒤에서 다룰 예정입니다)
- ... `EventTarget`은 `Object`를 상속받습니다 따라서 `hasOwnProperty`와 같은 순수 객체관련 메서드를 사용할 수 있습니다.

DOM 노드 클래스 이름을 확인하려면 object가 `constructor` 프로퍼티를 가진다는 점을 이용할 수 있습니다. `constructor` 프로퍼티는 클래스 생성자를 참조하고, `constructor.name`을 통해 이름을 알아낼 수 있습니다.

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

위에서 확인한 바와 같이 DOM 노드도 자바스크립트 객체이므로, 프로토타입 기반의 상속관계를 가집니다.

브라우저 콘솔에 `console.dir(elem)`를 입력하면 이런 관계를 눈으로 볼 수 있습니다. `HTMLElement.prototype`, `Element.prototype`등이 콘솔에 출력될 것입니다.

```smart header="`console.dir(elem)` 와 `console.log(elem)`"
대부분의 브라우저는 개발자 도구에서 `console.log` 와 `console.dir` 명령어를 지원합니다. 이 명령어들은 콘솔에 인수(argument)를 출력해준다. 자바스크립트 객체에선 이 두 명령어가 각은 역할을 한다.
Most browsers support two commands in their developer tools: `console.log` and `console.dir`. They output their arguments to the console. For JavaScript objects these commands usually do the same.

하지만 DOM 요소에선 다른 출력값을 보인다:

- `console.log(elem)` 는 요소(elem)의 DOM 트리를 출력한다.
- `console.dir(elem)` 는 요소(elem)를 DOM 객체처럼 취급하여 출력한다. 따라서 프로퍼티를 확인하기 쉽다는 장점이 있다.

Try it on `document.body`.
```

````smart header="스펙문서에서 쓰이는 IDL"
스펙문서에선 클래스를 JavaScript가 아닌 이해하기 쉬운 표기법인 [Interface description language](https://en.wikipedia.org/wiki/Interface_description_language) (IDL)을 이용하여 설명합니다. 

IDL은 모든 프로퍼티의 앞에 타입을 붙여서 작성됩니다. `DOMString`과 `boolean` 과 같은 타입이 프로퍼티 앞에 붙게 됩니다.

아래는 스펙문서의 일부를 발췌하여 주석을 달아놓은 예시입니다:

```js
// HTMLInputElement를 정의
*!*
// 콜론 ":" 은 HTMLInputElement가 HTMLElement로 부터 상속되었다는 것을 의미함 
*/!*
interface HTMLInputElement: HTMLElement {
  // <input> elements 와 관련된 프로퍼티와 메서드

*!*
  // "DOMString"은 아래 프로퍼티들이 문자열이라는 것을 의미함
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

다른 클래스에서도 유사한 문법을 확인할 수 있습니다.
````
````
라인 137, 138은 지울것.

## nodeType 프로퍼티

`nodeType` 프로퍼티는 DOM 노드의 "타입"을 알아내고자 할 때 쓰이는 옛날식의 프로퍼티입니다.

노드 타입은 상수 값을 가집니다:
- `elem.nodeType == 1` 은 요소 노드,
- `elem.nodeType == 3` 은 TEXT 노드,
- `elem.nodeType == 9` 은 DOCUMENT 객체(document object)를 나타내고,
- [스펙 문서](https://dom.spec.whatwg.org/#node)로 가면 다양한 노드 타입을 볼 수 있습니다.

예시:

```html run
<body>
  <script>  
  let elem = document.body;

  // 어떤 타입일까요?
  alert(elem.nodeType); // 1 => element

  // 첫번째 자식 노드는...
  alert(elem.firstChild.nodeType); // 3 => text

  // 문서객체는 타입이 9
  alert( document.nodeType ); // 9
  </script>
</body>
```

모던 자바스크립트에선 노드 타입을 `instanceof`나 다른 클래스 기반의 테스트를 이용해 확인합니다. 하지만 가끔은 `nodeType`를 쓰는게 간단할 때도 있습니다. `nodeType`을 쓰면 오직 타입을 읽기만 하고 바꾸지는 못합니다.

## 태그: nodeName 과 tagName

`nodeName` 이나 `tagName` 프로퍼티를 사용하면 DOM 노드의 태그 이름을 알아낼 수 있습니다.

예:

```js run
alert( document.body.nodeName ); // BODY
alert( document.body.tagName ); // BODY
```

그럼 tagName 과 nodeName의 차이는 없는걸까요?

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
    alert( document.body.firstChild.tagName ); // undefined (no element)
    alert( document.body.firstChild.nodeName ); // #comment

    // for document
    alert( document.tagName ); // undefined (not element)
    alert( document.nodeName ); // #document
  </script>
</body>
```

요소만 다루고 있는 상황이라면 `tagName`만 사용하면 됩니다.

```smart header="태그 이름은 XHTML을 제외하고 항상 대문자입니다"
브라우저는 HTML과 XML유형의 문서(document)를 다른 방법으로 처리합니다. 웹페이지는 대게 HTML 모드로 처리됩니다. 헤더가 `Content-Type: application/xml+xhtml`인 XML-문서의 경우는 XML 모드로 처리됩니다.

HTML 모드에선 `tagName/nodeName`이 모두 대문자를 리턴합니다. `<body>` 이든 `<BoDy>` 상관없이 `BODY`를 리턴합니다.

XML 모드에선 문자가 그대로 유지됩니다. XML 모드는 최근엔 거의 사용되지 않습니다.
```


## innerHTML: 안의 내용(the contents) 들여다보기

[innerHTML](https://w3c.github.io/DOM-Parsing/#widl-Element-innerHTML) 프로퍼티를 사용하면 요소 안의 HTML을 문자열로 받아올 수 있습니다.

요소안의 HTML을 수정하는 것도 가능합니다. innerHTML은 페이지를 수정하는데 쓰이는 강력한 방법 중 하나입니다.

아래는 `document.body`안의 내용(contents)을 출력하고 완전히 바꾸는 예시입니다:

```html run
<body>
  <p>A paragraph</p>
  <div>A div</div>

  <script>
    alert( document.body.innerHTML ); // 현재 내용 읽기
    document.body.innerHTML = 'The new BODY!'; // 내용 교체하기
  </script>

</body>
```

문법이 틀린 HTML을 넣게 되면 브라우저가 자동으로 이를 고쳐 줄 떄도 있습니다:

```html run
<body>

  <script>
    document.body.innerHTML = '<b>test'; // 닫는 태그를 넣지 않음
    alert( document.body.innerHTML ); // <b>test</b> (수정됨)
  </script>

</body>
```

```smart header="Scripts는 실행되지 않습니다"
`innerHTML`로 삽입된 `<script>` 태그는 대부분의 브라우저에서 실행되지 않습니다.

삽입된 <script>태그는 HTML의 일부분이 되어서 이미 실행된 것처럼 인식되기 때문입니다.
```

### 주의하기: "innerHTML+=" 은 내용을 완전히 덮어씁니다

`elem.innerHTML+="something"`을 사용해서 "추가 HTML"을 더해줄 수도 있습니다.

이렇게 말이죠:

```js
chatDiv.innerHTML += "<div>Hello<img src='smile.gif'/> !</div>";
chatDiv.innerHTML += "How goes?";
```

하지만 매우 주의해서 써야 합니다. 실제 내부에선 단순히 추가사항을 더해주는 게 *아니라* 내용을 완전히 덮어쓰기 때문입니다. 

각 라인의 코드는 같은 일을 합니다:

```js
elem.innerHTML += "...";
// 간단한 쓰기 방법:
*!*
elem.innerHTML = elem.innerHTML + "..."
*/!*
```

정리하자면 `innerHTML+=` 은 다음과 같은 기능을 수행합니다:

1. 이전의 내용은 지워집니다.
2. 이전의 내용과 `innerHTML`로 추가된 내용이 합쳐지고 이 내용이 새롭게 다시 쓰여집니다.

**내용이 싹 지워지고 처음부터 다시 쓰이기 때문에 모든 이미지와 기타 리소스들은 다시 로딩됩니다** 

위쪽의 `chatDiv` 예시에서 `chatDiv.innerHTML+="How goes?"`라인은 HTML 내용을 완전히 새롭게 덮어쓰고 `smile.gif`을 다시 로딩 합니다(이미지가 캐시되어있길 바랍니다). `chatDiv`안에 많은 텍스트와 이미지가 있다면 이런 재로딩 과정을 눈으로 확인할 수 있을겁니다.

또다른 부작용도 존재합니다. 예를들어 기존에 존재하던 텍스트를 마우스로 선택하고있던 상황이라면 대부분의 브라우저는 `innerHTML`을 적용하기 바로 직전에 선택한 글씨를 해제합니다. 그리고 `<input>`안에 작성해 놓았던 글씨 역시 지워집니다. 이 외에도 다양한 부작용이 있습니다.

다행히도 `innerHTML` 이외에 HTML을 추가하는 다른 방법이 존재합니다. 곧 그 내용을 배우겠습니다.

## outerHTML: full HTML of the element
## outerHTML: 요소의 전체 HTML

`outerHTML` 프로퍼티는 요소의 전체 HTML을 리턴해줍니다. `innerHTML`유사하고 차이는 요소 자신을 포함한다는 것입니다.

예시를 살펴보죠:

```html run
<div id="elem">Hello <b>World</b></div>

<script>
  alert(elem.outerHTML); // <div id="elem">Hello <b>World</b></div>
</script>
```

**주의하기: `innerHTML`와는 달리  `outerHTML`을 이용해 내용을 수정할 땐 내용이 기존 요소가 변경되지 않습니다. 대신에 새로운 요소를 만들고 그 요소를 기존요소와 바꿔치기 합니다.**

네, 조금 헷갈릴 수 있습니다. 그래서 이와 관련된 설명을 따로 하는 것 입니다.

아래 예시를 살펴보시죠:

```html run
<div>Hello, world!</div>

<script>
  let div = document.querySelector('div');

*!*
  // div.outerHTML를 사용해 <p>...</p>로 교체합니다
*/!*
  div.outerHTML = '<p>A new element!</p>'; // (*)

*!*
  // 보세요! div는 변경되지 않았습니다.
*/!*
  alert(div.outerHTML); // <div>Hello, world!</div>
</script>
```

`(*)`표시된 라인에서 우리는 `<div>...</div>`를 `<p>...</p>`로 교체하였습니다. 결과물을 보면 `<div>`대신 새로운 내용이 적용된걸 볼 수 있죠. 하지만 기존의 `<div>`변수는 여전히 남아있는걸 확인할 수 있습니다.

`outerHTML`로 값을 설정할 땐 기존 DOM 요소가 수정되지 않습니다. 대신 외부 컨텍스트 환경에서 기존 요소를 추출해 와 새로운 HTML조각을 삽입해줍니다.
The `outerHTML` assignment does not modify the DOM element, but extracts it from the outer context and inserts a new piece of HTML instead of it.

초보 개발자들은 여기서 흔히 실수를 합니다. `div.outerHTML`를 수정하고 난 다음 `div`가 새로운 내용으로 교체된 줄 착각하고 여기에 작업을 하죠.
Novice developers sometimes make an error here: they modify `div.outerHTML` and then continue to work with `div` as if it had the new content in it.

이런 실수는 `innerHTML`을 쓸때는 발생하지 않지만 `outerHTML`을 쓸 때 발생합니다.

We can write to `outerHTML`, but should keep in mind that it doesn't change the element we're writing to. It creates the new content on its place instead. We can get a reference to new elements by querying DOM.

## nodeValue/data: text node content

The `innerHTML` property is only valid for element nodes.

Other node types have their counterpart: `nodeValue` and `data` properties. These two are almost the same for practical use, there are only minor specification differences. So we'll use `data`, because it's shorter.

We can read it, like this:

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

For text nodes we can imagine a reason to read or modify them, but why comments? Usually, they are not interesting at all, but sometimes developers embed information into HTML in them, like this:

```html
<!-- if isAdmin -->
  <div>Welcome, Admin!</div>
<!-- /if -->
```

...Then JavaScript can read it and process embedded instructions.

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

DOM elements also have additional properties, many of them provided by the class:

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

If we want to know the full list of supported properties for a given class, we can find them in the specification. For instance, HTMLInputElement is documented at <https://html.spec.whatwg.org/#htmlinputelement>.

Or if we'd like to get them fast or are interested in a concrete browser specification -- we can always output the element using `console.dir(elem)` and read the properties. Or explore "DOM properties" in the Elements tab of the browser developer tools.

## Summary

Each DOM node belongs to a certain class. The classes form a hierarchy. The full set of properties and methods come as the result of inheritance.

Main DOM node properties are:

`nodeType`
: We can get `nodeType` from the DOM object class, but often we need just to see if it is a text or element node. The `nodeType` property is good for that. It has numeric values, most important are: `1` -- for elements,`3` -- for text nodes. Read-only.

`nodeName/tagName`
: For elements, tag name (uppercased unless XML-mode). For non-element nodes `nodeName` describes what it is. Read-only.

`innerHTML`
: The HTML content of the element. Can be modified.

`outerHTML`
: The full HTML of the element. A write operation into `elem.outerHTML` does not touch `elem` itself. Instead it gets replaced with the new HTML in the outer context.

`nodeValue/data`
: The content of a non-element node (text, comment). These two are almost the same, usually we use `data`. Can be modified.

`textContent`
: The text inside the element, basically HTML minus all `<tags>`. Writing into it puts the text inside the element, with all special characters and tags treated exactly as text. Can safely insert user-generated text and protect from unwanted HTML insertions.

`hidden`
: When set to `true`, does the same as CSS `display:none`.

DOM nodes also have other properties depending on their class. For instance, `<input>` elements (`HTMLInputElement`) support `value`, `type`, while `<a>` elements (`HTMLAnchorElement`) support `href` etc. Most standard HTML attributes have a corresponding DOM property.

But HTML attributes and DOM properties are not always the same, as we'll see in the next chapter.
