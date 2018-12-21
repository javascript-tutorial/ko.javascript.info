# 노드 프로퍼티(Node properties): 타입, 태그 그리고 내용(type, tag and contents)

DOM 노드에 대하여 좀 더 살펴보도록 합시다.

이번 주제에선 노드가 무엇인지 그리고 많이 쓰이는 프로퍼티에 대해서 알아보도록 하겠습니다.

## DOM 노드 클래스

DOM 노드는 클래스에 따라 각각 다른 프로퍼티를 가집니다. `<a>`태그에 대응하는 요소(element) 노드의 경우 링크와 관련된 프로퍼티를 가지고 `<input>`태그에 대응하는 요소 노드의 경우 입력과 관련된 프로퍼티를 가지는 것이 그 예입니다. 텍스트(text) 노드는 요소 노드와는 다릅니다. 하지만 모든 노드 클래스는 공통의 계층(Node)으로부터 상속되므로 같은 기본 프로퍼티와 메서드를 공유합니다.  

각각의 DOM 노드는 그에 대응하는 내장 클래스에 속하게 됩니다.

계층구조의 꼭대기엔 [EventTarget](https://dom.spec.whatwg.org/#eventtarget)이 있고, [Node](http://dom.spec.whatwg.org/#interface-node)는 이 EventTarget을 상속받습니다. 다른 DOM 노드들은 Node를 상속받습니다.

이런 계층구조를 설명해주는 그림이 아래에 있습니다:

![](dom-class-hierarchy.png)

노드 클래스:

- [EventTarget](https://dom.spec.whatwg.org/#eventtarget) -- 계층의 뿌리에 있는 "추상" 클래스입니다. 이 클래스를 구현한 객체는 절대 생성되지 않습니다. 모든 노드가 "events"라는 걸 지원하도록 하는 기반의 역할을 합니다. 이 부분에 대해선 추후 이야기할 예정입니다.
- [Node](http://dom.spec.whatwg.org/#interface-node) -- DOM 노드의 기초가 되는 "추상" 클래스입니다. `parentNode`, `nextSibling`, `childNodes`와 같은 노드사이 이동에 관련된 getter 메서드를 지원합니다. `Node` 클래스를 구현한 객체는 절대 생성되지 않습니다. 하지만 이 추상클래스를 상속받는 구체적인 클래스는 존재합니다. Text 노드를 위한 `Text`, 요소, 요소(Element) 노드를 위한 `Element`, Comment 노드를 위한 `Comment`가 그 예입니다.
- [Element](http://dom.spec.whatwg.org/#interface-element) -- DOM 요소의 기초가 되는 클래스입니다. `nextElementSibling`, `children`와 같은 요소 레벨 탐색 관련 프로퍼티와 `getElementsByTagName`, `querySelector`와 같은 검색 메서드를 제공합니다. 브라우저에는 HTML뿐만 아니라 XML, SVG가 있을 수 있습니다. `Element` 클래스는 `SVGElement`, `XMLElement`, `HTMLElement`의 기초가 됩니다.
- [HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement) -- 모든 HTML 요소의 기초가 되는 클래스입니다. 다양한 HTML 요소들은 이 클래스를 상속받습니다.
    - [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) -- `<input>` 요소를 위한 클래스
    - [HTMLBodyElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlbodyelement) -- `<body>` 요소를 위한 클래스
    - [HTMLAnchorElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlanchorelement) -- `<a>` 요소를 위한 클래스
    - 이 외에도 각각의 태그는 특정 프로퍼티와 메서드를 제공하는 자신만의 클래스를 가집니다.

각 노드의 프로퍼티와 메서드는 상속으로부터 만들어집니다.

예를 들어 `<input>` 요소에 대응하는 DOM 객체를 생각해 봅시다. 이 객체는 [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) 클래스에 속합니다. 
따라서 아래 상속 관계에 따라 프로퍼티와 메서드를 갖게 됩니다:

- `HTMLInputElement` -- 이 클래스는 입력과 관련된 프로퍼티를 제공합니다. 그리고 아래(`HTMLElement`)로부터 상속됩니다.
- `HTMLElement` -- HTML 요소 메서드(getter/setter)를 제공합니다. 그리고 아래로부터 상속됩니다.
- `Element` -- 전반적인 요소 메서드를 제공합니다. 그리고 아래로부터 상속됩니다.
- `Node` -- 전반적인 DOM 노드 프로퍼티를 제공합니다. 그리고 아래로부터 상속됩니다.
- `EventTarget` -- 이벤트와 관련된 일을 합니다(뒤에서 다룰 예정입니다).
- ... `EventTarget`은 `Object`를 상속받습니다 따라서 `hasOwnProperty`와 같은 순수 객체 관련 메서드를 사용할 수 있습니다.

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
스펙 문서에선 클래스를 JavaScript가 아닌 이해하기 쉬운 표기법인 [Interface description language](https://en.wikipedia.org/wiki/Interface_description_language) (IDL)을 이용하여 설명합니다. 

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

## nodeType 프로퍼티

`nodeType` 프로퍼티는 DOM 노드의 "타입"을 알아내고자 할 때 쓰이는 옛날식의 프로퍼티입니다.

노드 타입은 상숫값을 가집니다:
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

모던 자바스크립트에선 노드 타입을 `instanceof`나 다른 클래스 기반의 테스트를 이용해 확인합니다. 하지만 가끔은 `nodeType`를 쓰는 게 간단할 때도 있습니다. `nodeType`을 쓰면 오직 타입을 읽기만 하고 바꾸지는 못합니다.

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

요소를 다루고 있는 상황이라면 `tagName`를 사용하면 됩니다.

```smart header="태그 이름은 XHTML을 제외하고 항상 대문자입니다"
브라우저는 HTML과 XML유형의 문서(document)를 다른 방법으로 처리합니다. 웹페이지는 대게 HTML 모드로 처리됩니다. 헤더가 `Content-Type: application/xml+xhtml`인 XML-문서의 경우는 XML 모드로 처리됩니다.

HTML 모드에선 `tagName/nodeName`이 모두 대문자를 리턴합니다. `<body>` 이든 `<BoDy>` 상관없이 `BODY`를 리턴합니다.

XML 모드에선 문자가 그대로 유지됩니다. XML 모드는 최근엔 거의 사용되지 않습니다.
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
    alert( document.body.innerHTML ); // 현재 내용 읽기
    document.body.innerHTML = 'The new BODY!'; // 내용 교체하기
  </script>

</body>
```

문법이 틀린 HTML을 넣게 되면 브라우저가 자동으로 이를 고쳐 줄 때도 있습니다:

```html run
<body>

  <script>
    document.body.innerHTML = '<b>test'; // 닫는 태그를 넣지 않음
    alert( document.body.innerHTML ); // <b>test</b> (수정됨)
  </script>

</body>
```

```smart header="Scripts는 실행되지 않습니다"
`innerHTML`로 삽입된 `<script>` 태그는 대부분 브라우저에서 실행되지 않습니다.

삽입된 <script> 태그는 HTML의 일부분이 되어서 이미 실행된 것처럼 인식되기 때문입니다.
```# 노드 프로퍼티(Node properties): 타입, 태그 그리고 내용(type, tag and contents)
   
   DOM 노드에 대하여 좀 더 살펴보도록 합시다.
   
   이번 주제에선 노드가 무엇인지 그리고 많이 쓰이는 프로퍼티에 대해서 알아보도록 하겠습니다.
   
   ## DOM 노드 클래스
   
   DOM노드는 클래스에 따라 각각 다른 프로퍼티를 가집니다. `<a>`태그에 대응하는 요소(element)노드의 경우 링크와 관련된 프로퍼티를 가지고 `<input>`태그에 대응하는 요소노드의 경우 입력과 관련된 프로퍼티를 가지는 것이 그 예입니다. 텍스트(text) 노드는 요소 노드와는 다릅니다. 하지만 모든 노드 클래스는 공통의 계층(Node)으로부터 상속되므로 같은 기본 프로퍼티와 메서드를 공유합니다.  
   
   각각의 DOM 노드는 그에 대응하는 내장 클래스에 속하게 됩니다.
   
   계층구조의 꼭대기엔 [EventTarget](https://dom.spec.whatwg.org/#eventtarget)이 있고, [Node](http://dom.spec.whatwg.org/#interface-node)는 이 EventTarget을 상속받습니다. 다른 DOM 노드들은 Node를 상속 받습니다.
   
   이런 계층구조를 설명해주는 그림이 아래에 있습니다:
   
   ![](dom-class-hierarchy.png)
   
   노드 클래스:
   
   - [EventTarget](https://dom.spec.whatwg.org/#eventtarget) -- 계층의 뿌리에 있는 "추상" 클래스입니다. 이 클래스를 구현한 객체는 절대 생성되지 않습니다. 모든 노드가 "events"라는 걸 지원하도록 하는 기반의 역할을 합니다. 이부분에 대해선 추후 이야기 할 예정입니다.
   - [Node](http://dom.spec.whatwg.org/#interface-node) -- DOM 노드의 기초가 되는 "추상" 클래스 입니다. `parentNode`, `nextSibling`, `childNodes`와 같은 노드사이 이동에 관련된 getter 메서드를 지원합니다. `Node` 클래스를 구현한 객체는 절대 생성되지 않습니다. 하지만 이 추상클래스를 상속받는 구체적인 클래스는 존재합니다. Text 노드를 위한 `Text`, 요소, 요소(Element) 노드를 위한 `Element`, Comment 노드를 위한 `Comment`가 그 예입니다.
   - [Element](http://dom.spec.whatwg.org/#interface-element) -- DOM 요소의 기초가 되는 클래스입니다. `nextElementSibling`, `children`와 같은 요소레벨 탐색 관련 프로퍼티와 `getElementsByTagName`, `querySelector`와 같은 검색 메서드를 제공합니다. 브라우저에는 HTML뿐만 아니라 XML, SVG가 있을 수 있습니다. `Element` 클래스는 `SVGElement`, `XMLElement`, `HTMLElement`의 기초가 됩니다.
   - [HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement) -- 모든 HTML 요소의 기초가 되는 클래스입니다. 다양한 HTML요소들은 이 클래스를 상속받습니다.
       - [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) -- `<input>` 요소를 위한 클래스
       - [HTMLBodyElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlbodyelement) -- `<body>` 요소를 위한 클래스
       - [HTMLAnchorElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlanchorelement) -- `<a>` 요소를 위한 클래스
       - 이 외에도 각각의 태그는 특정 프로퍼티와 메서드를 제공하는 자신만의 클래스를 가집니다.
   
   각 노드의 프로퍼티와 메서드는 상속으로부터 만들어집니다.
   
   예를들어 `<input>` 요소에 대응하는 DOM 객체를 생각해 봅시다. 이 객체는 [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) 클래스에 속합니다. 
   따라서 아래 상속 관계에 따라 프로퍼티와 메서드를 갖게 됩니다:
   
   - `HTMLInputElement` -- 이 클래스는 입력과관련된 프로퍼티를 제공합니다. 그리고 아래(`HTMLElement`)로부터 상속됩니다.
   - `HTMLElement` -- HTML 요소 메서드(getter/setter)를 제공합니다. 그리고 아래로부터 상속됩니다.
   - `Element` -- 전반적인 요소 메서드를 제공합니다. 그리고 아래로부터 상속됩니다.
   - `Node` -- 전반적인 DOM 노드 프로퍼티를 제공합니다. 그리고 아래로부터 상속됩니다.
   - `EventTarget` -- 이벤트와 관련된 일을 합니다(뒤에서 다룰 예정입니다).
   - ... `EventTarget`은 `Object`를 상속받습니다 따라서 `hasOwnProperty`와 같은 순수 객체관련 메서드를 사용할 수 있습니다.
   
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
   
   위에서 확인한 바와 같이 DOM 노드도 자바스크립트 객체이므로, 프로토타입 기반의 상속관계를 가집니다.
   
   브라우저 콘솔에 `console.dir(elem)`를 입력하면 이런 관계를 눈으로 볼 수 있습니다. `HTMLElement.prototype`, `Element.prototype`등이 콘솔에 출력될 것입니다.
   
   ```smart header="`console.dir(elem)` 와 `console.log(elem)`"
   대부분의 브라우저는 개발자 도구에서 `console.log` 와 `console.dir` 명령어를 지원합니다. 이 명령어들은 콘솔에 인수(argument)를 출력해줍니다. 자바스크립트 객체에선 이 두 명령어가 각은 역할을 합니다.
   
   하지만 DOM 요소에선 다른 출력값을 보입니다:
   
   - `console.log(elem)` 는 요소(elem)의 DOM 트리를 출력하고,
   - `console.dir(elem)` 는 요소(elem)를 DOM 객체처럼 취급하여 출력합니다. 따라서 프로퍼티를 확인하기 쉽다는 장점이 있습니다.
   
   `document.body`를 통해 그 차이를 직접 확인해보세요.
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
   // TODO
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
   
   요소를 다루고 있는 상황이라면 `tagName`를 사용하면 됩니다.
   
   ```smart header="태그 이름은 XHTML을 제외하고 항상 대문자입니다"
   브라우저는 HTML과 XML유형의 문서(document)를 다른 방법으로 처리합니다. 웹페이지는 대게 HTML 모드로 처리됩니다. 헤더가 `Content-Type: application/xml+xhtml`인 XML-문서의 경우는 XML 모드로 처리됩니다.
   
   HTML 모드에선 `tagName/nodeName`이 모두 대문자를 리턴합니다. `<body>` 이든 `<BoDy>` 상관없이 `BODY`를 리턴합니다.
   
   XML 모드에선 문자가 그대로 유지됩니다. XML 모드는 최근엔 거의 사용되지 않습니다.
   ```
   
   
   ## innerHTML: 내용 들여다보기
   
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
   
   문법이 틀린 HTML을 넣게 되면 브라우저가 자동으로 이를 고쳐 줄 때도 있습니다:
   
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
   
   아래 예시에서 두 라인의 코드는 각각 같은 일을 합니다:
   
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
   
   위쪽의 `chatDiv` 예시에서 `chatDiv.innerHTML+="How goes?"`라인은 HTML 내용을 완전히 새롭게 덮어쓰고 `smile.gif`을 다시 로딩하게 합니다(이미지가 캐시 되어있길 바랍니다). `chatDiv`안에 많은 텍스트와 이미지가 있다면 이런 재 로딩 과정을 눈으로 확인할 수 있을 겁니다.
   
   또 다른 부작용도 존재합니다. 예를 들어 기존에 존재하던 텍스트를 마우스로 선택하고 있던 상황이라면 대부분 브라우저는 `innerHTML`을 적용하기 바로 직전에 선택한 글씨를 해제합니다. 그리고 `<input>`안에 작성해 놓았던 글씨 역시 지워집니다. 이 외에도 다양한 부작용이 있습니다.
   
   다행히도 `innerHTML` 이외에 HTML을 추가하는 다른 방법이 존재합니다. 곧 그 내용을 배우겠습니다.
   
   ## outerHTML: 요소의 전체 HTML
   
   `outerHTML` 프로퍼티는 요소의 전체 HTML을 리턴해줍니다. `innerHTML`과 유사한 기능을 하고, 차이는 요소 자신을 포함한다는 것입니다.
   
   예시를 살펴보죠:
   
   ```html run
   <div id="elem">Hello <b>World</b></div>
   
   <script>
     alert(elem.outerHTML); // <div id="elem">Hello <b>World</b></div>
   </script>
   ```
   
   **주의하기: `innerHTML`와는 달리  `outerHTML`을 이용해 내용을 수정할 땐 기존 요소가 변경되지 않습니다. 대신에 새로운 요소를 만들고 그 요소를 기존요소와 바꿔치기 합니다.**
   
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
   
   초보 개발자들은 여기서 흔히 실수합니다. `div.outerHTML`를 수정하고 난 다음 `div`가 새로운 내용으로 교체된 줄 착각하고 여기에 작업을 하죠.
   
   이런 실수는 `innerHTML`을 쓸 때는 발생하지 않지만 `outerHTML`을 쓸 때 발생합니다.
   
   `outerHTML`을 쓸때는 기존 요소가 변경되지 않는다는 걸 꼭 기억애햐 합니다. 기존 내용을 교체하는 대신 새로운 내용이 만들어지죠. 새로운 요소에 대한 참조는 DOM 쿼리로 얻을 수 있습니다. 
   
   ## nodeValue/data: 텍스트 노드의 내용 들여다보기
   
   `innerHTML` 프로퍼티는 요소노드에서만 작동합니다.
   
   다른 타입의 노드에도 유사한 기능을 하는 프로퍼티가 있습니다. `nodeValue` 와 `data` 입니다. 두 프로퍼티는 스펙상에 작은 차이가 있지만, 실질적으로 거의 유사하게 작동합니다. 그러므로 더 짧은 `data`를 사용하도록 하겠습니다.
   
   아래와 같이 값을 읽어올 수 있습니다:
   
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
   
   텍스트 노드의 내용을 읽거나 바꾸는 건 유용할 수 있겠지만 코멘트 노드는 수정할 일이 없을 것 같은데 이 기능을 어디다 쓰면 될까요? 특별한 기능을 하는 건 아니지만,
    개발자가 가끔 HTML 안에 정보를 넣어주는 데 사용합니다. 이렇게 말이죠:
   
   ```html
   <!-- if isAdmin -->
     <div>Welcome, Admin!</div>
   <!-- /if -->
   ```
   
   자바스크립트는 이걸 읽어서 처리해줍니다.
   
   ## textContent: 문자열만 뽑아내기
   
   `textContent`프로퍼티는 노드와 그 자손의 *문자(text)* 만 골라 표시해줍니다. `<tags>`는 다 제외합니다.
   
   예시:
   
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
   
   위에서 본 바와 같이 오직 텍스트 내용만 리턴됩니다. `<tags>`는 다 지워지고 문자만 남습니다.
   
   실무에서 텍스트를 읽어오는 기능은 그리 많이 사용되지 않습니다.
   
   **`textContent`를 이용한 쓰기는 매우 유용합니다.  "안전한 방법"으로 문자를 쓰게 해주기 때문입니다.**
   
   사용자로부터 입력된 임의의 문자열을 받아서 보여주는 기능을 구현한다고 생각 해 봅시다.
   
   - `innerHTML`을 사용하면 입력된 내용을 "HTML" 태그 그 자체로 받아옵니다.
   - `textContent`을 사용하면 모든 특수기호들은 문자로 다뤄지고 "문자"만 받아옵니다.
   
   예시를 통해 비교해 보겠습니다:
   
   ```html run
   <div id="elem1"></div>
   <div id="elem2"></div>
   
   <script>
     let name = prompt("What's your name?", "<b>Winnie-the-pooh!</b>");
   
     elem1.innerHTML = name;
     elem2.textContent = name;
   </script>
   ```
   
   1. 첫번째 `<div>`는 이름을 "HTML"로 받아옵니다. 모든 태그가 남아있어 이름이 굵게 처리된 것을 볼 수 있습니다
   2. 두번째 `<div>`는 이름을 "text"로 받아옵니다. `<b>Winnie-the-pooh!</b>`가 문자 그대로 출력되는 것을 확인할 수 있습니다.
   
   대부분의 경우에 우리는 사용자가 문자를 입력하길 기대하고 입력된 값을 문자로 처리하길 원합니다. 예상치 못한 HTML이 우리 사이트를 공격하길 원치 않기 떄문이죠. `textContent`는 이런 용도로 사용할 수 있습니다.
   
   ## "hidden" 프로퍼티
   
   "hidden" 속성과 프로퍼티는 요소를 감추거나 보여주는데 사용합니다
   
   hidden 속성은 HTML안에서 사용하고 프로퍼티는 자바스크립트 안에서 사용합니다:
   
   ```html run height="80"
   <div>Both divs below are hidden</div>
   
   <div hidden>With the attribute "hidden"</div>
   
   <div id="elem">JavaScript assigned the property "hidden"</div>
   
   <script>
     elem.hidden = true;
   </script>
   ```
   
   `hidden`은 `style="display:none"`과 완전히 동일합니다. 문법만 짧다는 차이가 있습니다.
   
   hidden을 사용하여 요소를 깜빡이게 하는 예제를 살펴보죠:
   
   
   ```html run height=50
   <div id="elem">A blinking element</div>
   
   <script>
     setInterval(() => elem.hidden = !elem.hidden, 1000);
   </script>
   ```
   
   ## 다양한 프로퍼티
   
   DOM 요소엔 위에서 언급한 프로퍼티 이외에도 다양한 프로퍼티가 있습니다. 다수의 프로퍼티들이 특정 클래스에 기반합니다:
   
   - `value` -- `<input>`, `<select>`, `<textarea>`의 값(value) (`HTMLInputElement`, `HTMLSelectElement`...).
   - `href` -- `<a href="...">`태그의 "href"(`HTMLAnchorElement`).
   - `id` -- 모든 요소에서 "id" 속성의 값 (`HTMLElement`).
   - ...기타 등등...
   
   예시:
   
   ```html run height="80"
   <input type="text" id="elem" value="value">
   
   <script>
     alert(elem.type); // "text"
     alert(elem.id); // "elem"
     alert(elem.value); // value
   </script>
   ```
   
   대부분의 표준 HTML 속성엔 대응하는 DOM 프로퍼티가 있습니다.
   
   특정 클래스에 대한 내장 프로퍼티를 확인하고 싶다면 스펙 문서를 찾아보면 됩니다. 예를들어 HTMLInputElement는 <https://html.spec.whatwg.org/#htmlinputelement>에서 찾을 수 있습니다.
   
   참고 자료를 빨리 찾고 싶거나 구체적인 브라우저 스펙을 알고 싶다면 `console.dir(elem)`을 사용해 요소에 대해 바로 알아보고 프로퍼티를 읽을 수 있습니다. 이 외에도 개발자 도구의 Elements 탭을 들어가 "DOM 프로퍼티"를 직접 탐색해 볼 수도 있습니다.
   
   ## 요약
   
   각각의 DOM 노드는 특정 클래스에 속합니다. 클래스는 계층 구조를 가지고 있습니다. 프로퍼티와 메서드는 이 계층구조로 부터 상속받습니다.
   Each DOM node belongs to a certain class. The classes form a hierarchy. The full set of properties and methods come as the result of inheritance.
   
   자주 쓰이는 DOM 노드 프로퍼티는 다음과 같습니다:
   
   `nodeType`
   : DOM 객체 클래스로부터 `nodeType`이 뭔지 알아낼 수 있지만 가끔은 특정 노드가 text 노드인지, 요소 노드인지만 판단하길 원하는 경우도 생깁니다. 이럴 때 `nodeType` 프로퍼티가 유용합니다. 이 프로퍼티는 숫자를 리턴해 주는데 리턴 값이 `1`의 경우는 요소 노드, `3`의 경우는 text 노드 입니다. 읽기 전용. 
   
   `nodeName/tagName`
   : 요소 노드에서 태그 이름을 대문자로 리턴해 줍니다(XML-모드 제외). 
   요소 노드가 아닌 경우에 `nodeName`을 쓰면 노드 타입을 알 수 있습니다. 읽기전용.
   
   `innerHTML`
   : 요소 내의 내용을 리턴해 줍니다. 요소 내의 내용을 수정하는데도 쓰입니다.
   
   `outerHTML`
   : 요소를 포함한 전체 HTML을 리턴해 줍니다. `elem.outerHTML`을 이용해 쓰기를 할 경우 `elem`(요소) 자체는 건드리지 않습니다. 대신에 외부 컨텍스트에서 작성 한 새로운 HTML로 기존 HTML을 바꿔치기 합니다.
   
   `nodeValue/data`
   : The content of a non-element node (text, comment). These two are almost the same, usually we use `data`. Can be modified.
   
   `textContent`
   : HTML에서 모든  `<tags>`를 제외하고 요소 내의 문자만 리턴해줍니다.
   요소 안쪽에 문자를 입력해주는데도 사용됩니다. 이 때 모든 특수문자와 태그는 문자로 다뤄집니다.
   
   `hidden`
   : `true`(참)으로 설정하면 CSS에서 `display:none` 한 것과 같은 효과를 발휘합니다.
   
   DOM 노드들은 클래스에 따라 위의 프로퍼티 이외의 다른 프로퍼티도 가집니다.
   예를들어 `<input>` 요소의 경우 (`HTMLInputElement`) `value`, `type` 프로퍼티를 가지고, `<a>`요소의 경우 (`HTMLAnchorElement`) `href`를 가집니다.
   대부분의 표준 HTML 속성은 대응하는 DOM 프로퍼티가 있습니다.
   
   하지만 HTML 속성대응하는 DOM 프로퍼티가 항상 있는건 아닙니다. 다음 주제에서 이에 대하여 살펴보도록 하겠습니다. 


### 주의하기: "innerHTML+=" 은 내용을 완전히 덮어씁니다

`elem.innerHTML+="something"`을 사용해서 "추가 HTML"을 더해줄 수도 있습니다.

이렇게 말이죠:

```js
chatDiv.innerHTML += "<div>Hello<img src='smile.gif'/> !</div>";
chatDiv.innerHTML += "How goes?";
```

하지만 매우 주의해서 써야 합니다. 실제 내부에선 단순히 추가사항을 더해주는 게 *아니라* 내용을 완전히 덮어쓰기 때문입니다. 

아래 예시에서 두 라인의 코드는 각각 같은 일을 합니다:

```js
elem.innerHTML += "...";
// 간단한 쓰기 방법:
*!*
elem.innerHTML = elem.innerHTML + "..."
*/!*
```

정리하자면 `innerHTML+=` 은 다음과 같은 기능을 수행합니다:

1. 이전의 내용은 지워집니다.
2. 이전의 내용과 `innerHTML`로 추가된 내용이 합쳐지고 이 내용이 새롭게 다시 쓰입니다.

**내용이 싹 지워지고 처음부터 다시 쓰이기 때문에 모든 이미지와 기타 리소스들은 다시 로딩됩니다** 

위쪽의 `chatDiv` 예시에서 `chatDiv.innerHTML+="How goes?"`라인은 HTML 내용을 완전히 새롭게 덮어쓰고 `smile.gif`을 다시 로딩하게 합니다(이미지가 캐시되어있길 바랍니다). `chatDiv`안에 많은 텍스트와 이미지가 있다면 이런 재로딩 과정을 눈으로 확인할 수 있을겁니다.

또다른 부작용도 존재합니다. 예를들어 기존에 존재하던 텍스트를 마우스로 선택하고있던 상황이라면 대부분의 브라우저는 `innerHTML`을 적용하기 바로 직전에 선택한 글씨를 해제합니다. 그리고 `<input>`안에 작성해 놓았던 글씨 역시 지워집니다. 이 외에도 다양한 부작용이 있습니다.

다행히도 `innerHTML` 이외에 HTML을 추가하는 다른 방법이 존재합니다. 곧 그 내용을 배우겠습니다.

## outerHTML: 요소의 전체 HTML

`outerHTML` 프로퍼티는 요소의 전체 HTML을 리턴해줍니다. `innerHTML`과 유사한 기능을 하고, 차이는 요소 자신을 포함한다는 것입니다.

예시를 살펴보죠:

```html run
<div id="elem">Hello <b>World</b></div>

<script>
  alert(elem.outerHTML); // <div id="elem">Hello <b>World</b></div>
</script>
```

**주의하기: `innerHTML`와는 달리  `outerHTML`을 이용해 내용을 수정할 땐 기존 요소가 변경되지 않습니다. 대신에 새로운 요소를 만들고 그 요소를 기존요소와 바꿔치기 합니다.**

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

초보 개발자들은 여기서 흔히 실수를 합니다. `div.outerHTML`를 수정하고 난 다음 `div`가 새로운 내용으로 교체된 줄 착각하고 여기에 작업을 하죠.

이런 실수는 `innerHTML`을 쓸때는 발생하지 않지만 `outerHTML`을 쓸 때 발생합니다.

`outerHTML`을 쓸때는 기존 요소가 변경되지 않는다는걸 꼭 기억애햐 합니다. 기존 내용을 교체하는 대신 새로운 내용이 만들어지죠. 새로운 요소에 대한 참조는 DOM 쿼리로 얻을 수 있습니다. 

## nodeValue/data: 텍스트 노드의 내용 들여다보기

`innerHTML` 프로퍼티는 요소노드에서만 작동합니다.

다른 타입의 노드에도 유사한 기능을 하는 프로퍼티가 있습니다. `nodeValue` 와 `data` 입니다. 두 프로퍼티는 스펙상에 작은 차이가 있지만 실질적으로 거의 유사하게 작동합니다. 그러므로 더 짧은 `data`를 사용하도록 하겠습니다.

아래와 같이 값을 읽어올 수 있습니다:

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

텍스트 노드의 내용을 읽거나 바꾸는건 유용할 수 있겠지만 코멘트 노드는 수정할 일이 없을 것 같은데 이 기능을 어디다 쓰면 될까요? 특별한 기능을 하는건 아니지만, 개발자가 가끔 HTML안에 정보를 넣어주는데 사용합니다. 이렇게 말이죠:

```html
<!-- if isAdmin -->
  <div>Welcome, Admin!</div>
<!-- /if -->
```

자바스크립트는 이걸 읽어서 처리해줍니다.

## textContent: 문자열만 뽑아내기

`textContent`프로퍼티는 노드와 그 자손의 *문자(text)* 만 골라 표시해줍니다. `<tags>`는 다 제외합니다.

예시:

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

위에서 본 바와 같이 오직 텍스트 내용만 리턴됩니다. `<tags>`는 다 지워지고 문자만 남습니다.

실무에서 텍스트를 읽어오는 기능은 그리 많이 사용되지 않습니다.

**`textContent`를 이용한 쓰기는 매우 유용합니다.  "안전한 방법"으로 문자를 쓰게 해주기 때문입니다.**

사용자로부터 입력된 임의의 문자열을 받아서 보여주는 기능을 구현한다고 생각 해 봅시다.

- `innerHTML`을 사용하면 입력된 내용을 "HTML" 태그 그 자체로 받아옵니다.
- `textContent`을 사용하면 모든 특수기호들은 문자로 다뤄지고 "문자"만 받아옵니다.

예시를 통해 비교해 보겠습니다:

```html run
<div id="elem1"></div>
<div id="elem2"></div>

<script>
  let name = prompt("What's your name?", "<b>Winnie-the-pooh!</b>");

  elem1.innerHTML = name;
  elem2.textContent = name;
</script>
```

1. 첫번째 `<div>`는 이름을 "HTML"로 받아옵니다. 모든 태그가 남아있어 이름이 굵게 처리된 것을 볼 수 있습니다
2. 두번째 `<div>`는 이름을 "text"로 받아옵니다. `<b>Winnie-the-pooh!</b>`가 문자 그대로 출력되는 것을 확인할 수 있습니다.

대부분의 경우에 우리는 사용자가 문자를 입력하길 기대하고 입력된 값을 문자로 처리하길 원합니다. 예상치 못한 HTML이 우리 사이트를 공격하길 원치 않기 떄문이죠. `textContent`는 이런 용도로 사용할 수 있습니다.

## "hidden" 프로퍼티

"hidden" 속성과 프로퍼티는 요소를 감추거나 보여주는데 사용합니다

hidden 속성은 HTML안에서 사용하고 프로퍼티는 자바스크립트 안에서 사용합니다:

```html run height="80"
<div>Both divs below are hidden</div>

<div hidden>With the attribute "hidden"</div>

<div id="elem">JavaScript assigned the property "hidden"</div>

<script>
  elem.hidden = true;
</script>
```

`hidden`은 `style="display:none"`과 완전히 동일합니다. 문법만 짧다는 차이가 있습니다.

hidden을 사용하여 요소를 깜빡이게 하는 예제를 살펴보죠:


```html run height=50
<div id="elem">A blinking element</div>

<script>
  setInterval(() => elem.hidden = !elem.hidden, 1000);
</script>
```

## 다양한 프로퍼티

DOM 요소엔 위에서 언급한 프로퍼티 이외에도 다양한 프로퍼티가 있습니다. 다수의 프로퍼티들이 특정 클래스에 기반합니다:

- `value` -- `<input>`, `<select>`, `<textarea>`의 값(value) (`HTMLInputElement`, `HTMLSelectElement`...).
- `href` -- `<a href="...">`태그의 "href"(`HTMLAnchorElement`).
- `id` -- 모든 요소에서 "id" 속성의 값 (`HTMLElement`).
- ...기타 등등...

예시:

```html run height="80"
<input type="text" id="elem" value="value">

<script>
  alert(elem.type); // "text"
  alert(elem.id); // "elem"
  alert(elem.value); // value
</script>
```

대부분의 표준 HTML 속성엔 대응하는 DOM 프로퍼티가 있습니다.

특정 클래스에 대한 내장 프로퍼티를 확인하고 싶다면 스펙 문서를 찾아보면 됩니다. 예를들어 HTMLInputElement는 <https://html.spec.whatwg.org/#htmlinputelement>에서 찾을 수 있습니다.

참고 자료를 빨리 찾고 싶거나 구체적인 브라우저 스펙을 알고 싶다면 `console.dir(elem)`을 사용해 요소에 대해 바로 알아보고 프로퍼티를 읽을 수 있습니다. 이 외에도 개발자 도구의 Elements 탭을 들어가 "DOM 프로퍼티"를 직접 탐색해 볼 수도 있습니다.

## 요약

각각의 DOM 노드는 특정 클래스에 속합니다. 클래스는 계층 구조를 가지고 있습니다. 프로퍼티와 메서드는 이 계층구조로 부터 상속받습니다.
Each DOM node belongs to a certain class. The classes form a hierarchy. The full set of properties and methods come as the result of inheritance.

자주 쓰이는 DOM 노드 프로퍼티는 다음과 같습니다:

`nodeType`
: DOM 객체 클래스로부터 `nodeType`이 뭔지 알아낼 수 있지만 가끔은 특정 노드가 text 노드인지, 요소 노드인지만 판단하길 원하는 경우도 생깁니다. 이럴 때 `nodeType` 프로퍼티가 유용합니다. 이 프로퍼티는 숫자를 리턴해 주는데 리턴 값이 `1`의 경우는 요소 노드, `3`의 경우는 text 노드 입니다. 읽기 전용. 

`nodeName/tagName`
: 요소 노드에서 태그 이름을 대문자로 리턴해 줍니다(XML-모드 제외). 
요소 노드가 아닌 경우에 `nodeName`을 쓰면 노드 타입을 알 수 있습니다. 읽기전용.

`innerHTML`
: 요소 내의 내용을 리턴해 줍니다. 요소 내의 내용을 수정하는데도 쓰입니다.

`outerHTML`
: 요소를 포함한 전체 HTML을 리턴해 줍니다. `elem.outerHTML`을 이용해 쓰기를 할 경우 `elem`(요소) 자체는 건드리지 않습니다. 대신에 외부 컨텍스트에서 작성 한 새로운 HTML로 기존 HTML을 바꿔치기 합니다.

`nodeValue/data`
: The content of a non-element node (text, comment). These two are almost the same, usually we use `data`. Can be modified.

`textContent`
: HTML에서 모든  `<tags>`를 제외하고 요소 내의 문자만 리턴해줍니다.
요소 안쪽에 문자를 입력해주는데도 사용됩니다. 이 때 모든 특수문자와 태그는 문자로 다뤄집니다.

`hidden`
: `true`(참)으로 설정하면 CSS에서 `display:none` 한 것과 같은 효과를 발휘합니다.

DOM 노드들은 클래스에 따라 위의 프로퍼티 이외의 다른 프로퍼티도 가집니다.
예를들어 `<input>` 요소의 경우 (`HTMLInputElement`) `value`, `type` 프로퍼티를 가지고, `<a>`요소의 경우 (`HTMLAnchorElement`) `href`를 가집니다.
대부분의 표준 HTML 속성은 대응하는 DOM 프로퍼티가 있습니다.

하지만 HTML 속성대응하는 DOM 프로퍼티가 항상 있는건 아닙니다. 다음 주제에서 이에 대하여 살펴보도록 하겠습니다. 
