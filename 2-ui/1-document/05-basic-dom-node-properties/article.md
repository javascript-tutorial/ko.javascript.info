# 주요 노드 프로퍼티

DOM 노드에 대해 좀 더 알아봅시다.

이번 챕터에선 DOM 노드란 무엇인지, DOM 노드의 주요 프로퍼티는 무엇이 있는지 학습하겠습니다.

## DOM 노드 클래스

DOM 노드는 종류에 따라 각각 다른 프로퍼티를 지원합니다. 태그 `<a>`에 대응하는 요소 노드엔 링크와 관련된 프로퍼티가 있고 `<input>`에 대응하는 요소 노드엔 입력과 관련된 프로퍼티가 있는 것처럼 말이죠. 텍스트 노드는 요소 노드와는 다른 프로퍼티를 지원하는 것은 말할 필요도 없겠죠. 그런데 모든 DOM 노드는 공통 조상으로부터 만들어지기 때문에 공통 프로퍼티와 메서드가 있습니다.

각 DOM 노드는 대응하는 내장 클래스에 속합니다.

계층구조의 꼭대기엔 [EventTarget](https://dom.spec.whatwg.org/#eventtarget)이 있고 [Node](http://dom.spec.whatwg.org/#interface-node)는 EventTarget을, 다른 DOM 노드들은 Node를 상속받습니다.

계층구조를 그림으로 나타내면 다음과 같습니다.

![](dom-class-hierarchy.svg)

각 노드에 대응하는 클래스는 다음과 같이 정의할 수 있습니다.

- [EventTarget](https://dom.spec.whatwg.org/#eventtarget) -- 루트에 있는 '추상(abstract)' 클래스로, 이 클래스에 대응하는 객체는 실제로 만들어지지 않습니다. 모든 DOM 노드의 베이스 역할을 하므로 DOM 노드에서 '이벤트'를 사용할 수 있습니다. 자세한 내용은 곧 다루겠습니다.
- [Node](http://dom.spec.whatwg.org/#interface-node) -- 이 역시 '추상' 클래스로 DOM 노드의 베이스 역할을 합니다. getter 역할을 하는 `parentNode`, `nextSibling`, `childNodes` 등의 주요 트리 탐색 기능을 제공합니다. `Node` 클래스의 객체는 절대 생성되지 않지만 이 클래스를 상속받는 클래스가 여럿 있습니다. 텍스트 노드를 위한 `Text` 클래스와 요소 노드를 위한 `Element` 클래스, 주석 노드를 위한 `Comment`클래스는 `Node`클래스를 상속받습니다.
- [Element](http://dom.spec.whatwg.org/#interface-element) -- DOM 요소를 위한 베이스 클래스입니다. `nextElementSibling`, `children` 같은 요소 전용 탐색 기능과 `getElementsByTagName`, `querySelector` 같은 요소 전용 검색 기능을 제공합니다. 브라우저는 HTML뿐만 아니라 XML, SVG도 지원하는데 `Element` 클래스는 이와 관련된 `SVGElement`, `XMLElement`, `HTMLElement` 클래스의 베이스 역할을 합니다.
- [HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement) -- HTML 요소 노드의 베이스 역할을 하는 클래스입니다. 아래 나열한 실제 HTML 요소에 대응하는 클래스들은 `HTMLElement`를 상속받습니다.
    - [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) -- `<input>` 요소를 위한 클래스
    - [HTMLBodyElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlbodyelement) -- `<body>` 요소를 위한 클래스
    - [HTMLAnchorElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlanchorelement) -- `<a>` 요소를 위한 클래스
    - 이외에도 다른 클래스가 많은데, 각 태그에 해당하는 클래스는 고유한 프로퍼티와 메서드를 지원합니다.

위와 같이 특정 노드에서 사용할 수 있는 프로퍼티와 메서드는 상속을 기반으로 결정됩니다.

`<input>` 요소에 대응하는 DOM 객체를 예로 들어봅시다. 이 객체는 [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) 클래스를 기반으로 만들어집니다.

객체엔 아래에 나열한 클래스에서 상속받은 프로퍼티와 메서드가 있을 겁니다.

- `HTMLInputElement` -- 입력 관련 프로퍼티를 제공하는 클래스
- `HTMLElement` -- HTML 요소 메서드와 getter, setter를 제공하는 클래스
- `Element` -- 요소 노드 메서드를 제공하는 클래스
- `Node` -- 공통 DOM 노드 프로퍼티를 제공하는 클래스
- `EventTarget` -- 이벤트 관련 기능을 제공하는 클래스
- `Object` -- `hasOwnProperty`같이 '일반 객체' 메서드를 제공하는 클래스

앞서 배운 객체는 `constructor` 프로퍼티를 가진다는 점을 이용하면 DOM 노드 클래스 이름을 확인할 수 있습니다. `constructor` 프로퍼티는 클래스 생성자를 참조하고 `constructor.name`에 이름이 저장되어있다는 점을 이용하면 되죠.

```js run
alert( document.body.constructor.name ); // HTMLBodyElement
```

`toString`을 사용해도 됩니다.

```js run
alert( document.body ); // [object HTMLBodyElement]
```

`instanceof`를 사용해 상속 여부를 확인할 수도 있습니다.

```js run
alert( document.body instanceof HTMLBodyElement ); // true
alert( document.body instanceof HTMLElement ); // true
alert( document.body instanceof Element ); // true
alert( document.body instanceof Node ); // true
alert( document.body instanceof EventTarget ); // true
```

지금까지 살펴본 바와 같이 DOM 노드는 일반 자바스크립트 객체입니다. 프로토타입 기반 상속 관계를 갖죠.

브라우저 콘솔에 `console.dir(elem)`를 입력하면 이런 관계를 쉽게 확인할 수 있습니다. `HTMLElement.prototype`, `Element.prototype`등이 콘솔에 출력될 겁니다.

```smart header="`console.dir(elem)`과 `console.log(elem)`의 차이"
브라우저 개발자 도구 대부분은 `console.log`와 `console.dir` 명령어를 지원합니다. 이 명령어들은 콘솔에 인수를 출력해줍니다. 인수가 자바스크립트 객체라면 두 명령어는 대개 같은 결과를 보여줍니다.

하지만 인수가 DOM 요소일 때는 결과가 다릅니다.

- `console.log(elem)`는 요소의 DOM 트리를 출력합니다.
- `console.dir(elem)`는 요소를 DOM 객체처럼 취급하여 출력합니다. 따라서 프로퍼티를 확인하기 쉽다는 장점이 있습니다.

`document.body`를 인수로 넘겨서 그 차이를 직접 확인해보세요.
```

````smart header="명세서에서 쓰이는 IDL"
명세서에선 DOM 클래스를 자바스크립트를 사용해 설명하지 않습니다. 대신 [Interface description language(IDL)](https://en.wikipedia.org/wiki/Interface_description_language)을 이용해 설명합니다.

IDL에선 모든 프로퍼티 앞에 타입을 붙입니다. `DOMString`과 `boolean` 같은 타입이 프로퍼티 앞에 붙죠.

명세서 일부에 주석을 달아놓았으니 함께 살펴봅시다. 

```js
// HTMLInputElement 정의 시작
*!*
// 콜론(:)은 HTMLInputElement가 HTMLElement로 부터 상속되었다는 것을 의미합니다.
*/!*
interface HTMLInputElement: HTMLElement {
  // <input> 요소와 관련된 프로퍼티와 메서드가 나열되기 시작합니다.

*!*
  // 'DOMString'은 프로퍼티 값이 문자열이라는 것을 의미합니다.
*/!*
  attribute DOMString accept;
  attribute DOMString alt;
  attribute DOMString autocomplete;
  attribute DOMString value;

*!*
  // 불린 값(true/false)을 가지는 프로퍼티
  attribute boolean autofocus;
*/!*
  ...
*!*
  // 'void'는 메서드의 리턴값이 없음을 의미합니다.
*/!*
  void select();
  ...
}
```
````

## 'nodeType' 프로퍼티

`nodeType` 프로퍼티는 DOM 노드의 '타입'을 알아내고자 할 때 쓰이는 구식 프로퍼티입니다.

각 노드 타입은 상숫값을 가집니다.
- `elem.nodeType == 1` -- 요소 노드
- `elem.nodeType == 3` -- 텍스트 노드
- `elem.nodeType == 9` -- 문서 객체
- 기타 노드 타입에 대한 값은 [명세서](https://dom.spec.whatwg.org/#node)에서 확인할 수 있습니다.

예시:

```html run
<body>
  <script>  
  let elem = document.body;

  // 타입을 알아봅시다.
  alert(elem.nodeType); // 1 => 요소 노드

  // 첫 번째 자식 노드
  alert(elem.firstChild.nodeType); // 3 => 텍스트 노드

  // 문서 객체의 타입 확인
  alert( document.nodeType ); // 9 => 문서 객체
  </script>
</body>
```

모던 자바스크립트에선 노드의 타입을 `instanceof`나 클래스 기반의 테스트를 이용해 확인하는데, 가끔은 `nodeType`를 쓰는 게 간단할 때도 있습니다. `nodeType`은 타입 확인 하는 데만 쓸 수 있고 바꾸지는 못합니다.

## nodeName과 tagName으로 태그 이름 확인하기

`nodeName`이나 `tagName` 프로퍼티를 사용하면 DOM 노드의 태그 이름을 알아낼 수 있습니다.

예시:

```js run
alert( document.body.nodeName ); // BODY
alert( document.body.tagName ); // BODY
```

그럼 `tagName`과 `nodeName`의 차이는 없는 걸까요?

물론 있습니다. 미묘하지만 이름에서 그 차이를 유추할 수 있죠.

- `tagName` 프로퍼티는 `요소` 노드에만 존재합니다.
- `nodeName`은 모든 `Node`에 있습니다.
    - 요소 노드를 대상으로 호출하면 `tagName`과 같은 역할을 합니다.
    - 텍스트 노드, 주석 노드 등에선 노드 타입을 나타내는 문자열을 반환합니다.

`nodeName`은 모든 노드에서 지원되지만, `tagName`은 `Element` 클래스로부터 유래되었기 때문에 요소 노드에서만 지원됩니다. 

`document`와 주석 노드를 사용해 `tagName`과 `nodeName`의 차이점을 확인해 봅시다.


```html run
<body><!-- 주석 -->

  <script>
    // 주석 노드를 대상으로 두 프로퍼티 비교
    alert( document.body.firstChild.tagName ); // undefined (요소가 아님)
    alert( document.body.firstChild.nodeName ); // #comment

    // 문서 노드를 대상으로 두 프로퍼티 비교
    alert( document.tagName ); // undefined (요소가 아님)
    alert( document.nodeName ); // #document
  </script>
</body>
```

요소 노드만 다루고 있다면 `tagName`과 `nodeName`에는 차이가 없으므로 둘 다 사용할 수 있습니다.

```smart header="태그 이름은 XML 모드를 제외하고 항상 대문자입니다."
브라우저에서 HTML과 XML을 처리하는 모드는 다릅니다. 웹페이지는 대게 HTML 모드로 처리됩니다. 헤더가 `Content-Type: application/xml+xhtml`인 XML 문서를 받으면 XML 모드로 문서를 처리합니다.

HTML 모드에선 `tagName`과 `nodeName`이 모두 대문자로 변경됩니다. `<body>` 이든 `<BoDy>`이든 `BODY`가 되죠.

XML 모드에선 케이스가 '그대로' 유지됩니다. XML 모드는 요즘엔 거의 사용되지 않습니다.
```


## innerHTML로 내용 조작하기

[innerHTML](https://w3c.github.io/DOM-Parsing/#widl-Element-innerHTML) 프로퍼티를 사용하면 요소 안의 HTML을 문자열 형태로 받아올 수 있습니다.

요소 안의 HTML을 수정하는 것도 가능합니다. innerHTML은 페이지를 수정하는 데 쓰이는 강력한 방법의 하나입니다.

`document.body` 안의 내용을 출력하고 완전히 바꾸는 예시를 살펴봅시다.

```html run
<body>
  <p>P 태그</p>
  <div>div 태그</div>

  <script>
    alert( document.body.innerHTML ); // 현재 내용을 읽음
    document.body.innerHTML = '새로운 BODY!'; // 교체
  </script>

</body>
```

문법이 틀린 HTML을 넣으면 브라우저가 자동으로 고쳐 줍니다.

```html run
<body>

  <script>
    document.body.innerHTML = '<b>test'; // 닫는 태그를 잊음
    alert( document.body.innerHTML ); // <b>test</b> (자동으로 수정됨)
  </script>

</body>
```

```smart header="스크립트는 실행되지 않습니다."
`innerHTML`을 사용해 문서에 `<script>` 태그를 삽입하면 HTML의 일부가 되긴 하지만 실행은 되지 않습니다.
```

### 'innerHTML+=' 사용 시 주의점

`elem.innerHTML+="추가 html"`을 사용하면 요소에 HTML을 추가할 수 있습니다.

아래와 같이 말이죠.

```js
chatDiv.innerHTML += "<div>안녕하세요<img src='smile.gif'/> !</div>";
chatDiv.innerHTML += "잘 지내죠?";
```

그런데 'innerHTML+='은 추가가 *아니라* 내용을 덮어쓰기 때문에 상당히 주의해서 사용해야 합니다.

기술적으로 아래 두 줄의 코드는 동일한 역할을 합니다.

```js
elem.innerHTML += "...";
// 위 코드는 아래 코드의 축약 버전입니다.
*!*
elem.innerHTML = elem.innerHTML + "..."
*/!*
```

즉, `innerHTML+=`는 아래와 같은 일을 합니다.

1. 기존 내용 삭제
2. 기존 내용과 새로운 내용을 합친 새로운 내용을 씀

**기존 내용을 '완전히 삭제'한 후 밑바닥부터 다시 쓰기 때문에 이미지나 리소스 전부가 다시 불러와 집니다**.

`chatDiv` 예시의 `chatDiv.innerHTML+="잘 지내죠?"` 윗줄의 HTML 내용은 다시 생성되고 `smile.gif` 역시 다시 로딩됩니다. 어딘가에 캐싱해 놓았길 바라는 순간이네요. `chatDiv`에 텍스트와 이미지가 많이 있으면 내용이 다시 불러와 지는 것을 눈으로 확인하실 수 있을 겁니다.

이 외에도 여러 부작용이 있습니다. 기존에 있던 텍스트를 마우스로 드래그한 상황이라면 내용을 다시 써야 하기 때문에 드래그가 해제될 겁니다. `<input>` 태그에서 사용자가 입력한 값이 사라지기도 하죠. 부작용은 많습니다.

다행히도 `innerHTML` 대신에 HTML을 추가하는 방법이 있는데, 곧 배우도록 하겠습니다.

## outerHTML로 요소의 전체 HTML 보기

`outerHTML` 프로퍼티엔 요소의 전체 HTML이 담겨있습니다. `outerHTML`은 `innerHTML`에 요소 자체를 더한 것이라고 생각하시면 됩니다.

예시를 살펴봅시다.

```html run
<div id="elem">Hello <b>World</b></div>

<script>
  alert(elem.outerHTML); // <div id="elem">Hello <b>World</b></div>
  alert(elem.innerHTML); // Hello <b>World</b>
</script>
```

**`innerHTML`과 달리 `outerHTML`은 요소 자체를 바꾸지 않습니다. 대신 `outerHTML`은 DOM 안의 요소를 교체합니다.**

네, 뭔가 이상하게 들리실 겁니다. 실제로도 이상하고요. 그럴 것을 예상하고 설명을 따로 만들어 놓았습니다.

예시를 보며 이해해 봅시다.

```html run
<div>Hello, world!</div>

<script>
  let div = document.querySelector('div');

*!*
  // div.outerHTML를 사용해 <p>...</p>로 교체
*/!*
  div.outerHTML = '<p>새로운 요소</p>'; // (*)

*!*
  // 어! div는 그대로네요!
*/!*
  alert(div.outerHTML); // <div>Hello, world!</div> (**)
</script>
```

뭔가 이상합니다.

`(*)`로 표시한 줄에서 `div`를 `<p>새로운 요소</p>`로 교체했기 때문에 예시를 실행하면 의도한 대로 문서(DOM)에 `<div>`가 아닌 새로운 내용이 보입니다. 그런데 `(**)`에서 기존의 `div`를 출력하네요!

이런 결과가 나타난 이유는 `outerHTML`에 하는 할당 연산이 DOM 요소(outerHTML 연산의 대상으로, 위 예시에선 변수 `div`)를 수정하지 않기 때문입니다. 할당 연산은 요소를 DOM에서 제거하고 새로운 HTML 조각을 넣습니다.

즉, `div.outerHTML=...`는 아래와 같은 일을 합니다.
- '문서'에서 `div`를 삭제
- 새로운 HTML 조각인 `<p>A new element</p>`을 삭제 후 생긴 공간에 삽입
- `div`엔 여전히 기존 값이 저장되어 있고 새로운 HTML 조각은 어디에도 저장되어있지 않음

`outerHTML`의 이런 동작 방식 때문에 실수 할 여지가 많습니다. `div.outerHTML`을 수정한 후 `div`에 새로운 내용이 들어갔다고 착각하며 작업하는 경우가 많죠. `innerHTML`은 `div`를 수정하지만 `outerHTML`은 `div`를 수정하지 않습니다.

`elem.outerHTML`에 무언가를 쓸 때는 `elem`이 수정되지 않는다는 점을 꼭 명심하셔야 합니다. 할당받은 HTML은 `elem`이 있던 공간에 들어갑니다. 새롭게 만들어진 요소를 참조하려면 DOM 쿼리 메서드를 사용합시다.

## nodeValue/data로 텍스트 노드 내용 조작하기

`innerHTML` 프로퍼티는 요소 노드에만 사용할 수 있습니다.

텍스트 노드 같은 다른 타입의 노드에는 유사한 프로퍼티, `nodeValue`와 `data`를 사용하면 됩니다. 이 두 프로퍼티는 아주 유사하고, 실무에서도 구분 없이 쓰긴 하지만 명세서상에 작은 차이가 있긴 합니다. `data`가 좀 더 짧기 때문에 여기선 `data`를 사용하겠습니다.  

텍스트 노드와 주석 노드의 내용을 읽는 예시를 살펴봅시다.

```html run height="50"
<body>
  안녕하세요.
  <!-- 주석 -->
  <script>
    let text = document.body.firstChild;
*!*
    alert(text.data); // 안녕하세요.
*/!*

    let comment = text.nextSibling;
*!*
    alert(comment.data); // 주석
*/!*
  </script>
</body>
```

텍스트 노드의 내용을 읽거나 수정하는 것은 그 용도를 짐작하기 쉽습니다. 그런데 주석 노드는 왜 이런 기능이 필요할까요?

개발자들은 종종 아래와 같이 정보나 지시사항을 HTML에 삽입합니다.

```html
<!-- if isAdmin -->
  <div>Welcome, Admin!</div>
<!-- /if -->
```

이럴 때 자바스크립트의 `data` 프로퍼티를 사용해 주석 노드의 내용을 읽고 삽입된 지시사항을 처리하면 됩니다. 

## textContent로 텍스트만 조작하기

`textContent`를 사용하면 요소 내의 *텍스트*에 접근할 수 있습니다. `<태그>`는 제외하고 오로지 텍스트만 추출할 수 있죠.

예시:

```html run
<div id="news">
  <h1>주요 뉴스!</h1>
  <p>화성인, 지구 침공!</p>
</div>

<script>
  // 주요 뉴스! 화성인, 지구 침공!
  alert(news.textContent);
</script>
```

예시를 실행하면 `<태그>`가 원래부터 없었던 것처럼 텍스트만 반환되는 것을 확인할 수 있습니다.

그런데 실무에선 텍스트 읽기는 단독으로 잘 쓰진 않습니다. 

**`textContent`를 사용하면 텍스트를 '안전한 방법'으로 쓸 수 있기 때문에 `textContent`는 다양한 곳에서 쓰기 용으로 아주 유용하게 사용됩니다.**

사용자가 입력한 임의의 문자열을 다시 출력해주는 경우를 생각해 봅시다.

- `innerHTML`을 사용하면 사용자가 입력한 문자열이 'HTML 형태로' 태그와 함께 저장됩니다.
- `textContent`를 사용하면 사용자가 입력한 문자열이 '텍스트 형태로' 저장되어 태그를 구성하는 특수문자들도 문자열로 처리됩니다.

두 프로퍼티를 비교해봅시다.

```html run
<div id="elem1"></div>
<div id="elem2"></div>

<script>
  let name = prompt("이름을 알려주세요.", "<b>곰돌이 푸!</b>");

  elem1.innerHTML = name;
  elem2.textContent = name;
</script>
```

1. 첫 번째 `<div>`엔 이름이 'HTML 형태'로 저장됩니다. 입력한 태그는 태그로 해석되어 굵은 글씨가 출력되네요.
2. 두 번째 `<div>`엔 이름이 '텍스트 형태'로 저장됩니다. 따라서 입력한 값 그대로 `<b>곰돌이 푸!</b>`가 출력되는 것을 확인할 수 있습니다.

사용자의 입력값을 받아 처리해야 하는 경우가 많습니다. 이때 사용자가 입력한 값은 텍스트로 처리되어야 합니다. 예상치 못한 HTML이 사이트에 침투하는 것을 막으려면 `textContent`를 사용합시다. 

## 'hidden' 프로퍼티

'hidden' 속성과 'hidden' DOM 프로퍼티는 요소를 보여줄지 말지 지정할 때 사용할 수 있습니다.

`hidden`은 HTML 안에서 쓸 수도 있고 자바스크립트에서도 쓸 수 있습니다.

```html run height="80"
<div>아래 두 div를 숨겨봅시다.</div>

<div hidden>HTML의 'hidden' 속성 사용하기</div>

<div id="elem">자바스크립트의 'hidden' 프로퍼티 사용하기</div>

<script>
  elem.hidden = true;
</script>
```

`hidden`은 기술적으로 `style="display:none"`와 동일합니다. 짧다는 점만 다르죠.

`hidden`을 사용해 요소를 깜빡이게 해봅시다.


```html run height=50
<div id="elem">깜빡이는 요소</div>

<script>
  setInterval(() => elem.hidden = !elem.hidden, 1000);
</script>
```

## 그 외의 프로퍼티

지금까지 소개한 프로퍼티 외에도 DOM 요소엔 다양한 프로퍼티가 있는데, 클래스마다 특징적인 프로퍼티 몇 가지를 소개해드리겠습니다.

- `value` -- `<input>`과 `<select>`, `<textarea>`의 값이 저장됩니다. 대응하는 클래스는 `HTMLInputElement`, `HTMLSelectElement` 등입니다.
- `href` -- `<a href="...">`의 'href' 값이 저장됩니다. 대응하는 클래스는 `HTMLAnchorElement`입니다.
- `id` -- 'id' 속성의 값이 저장됩니다. 모든 요소 노드에서 사용할 수 있으며, 대응하는 클래스는 `HTMLElement`입니다.
- 기타 등등

예시를 살펴봅시다.

```html run height="80"
<input type="text" id="elem" value="value">

<script>
  alert(elem.type); // "text"
  alert(elem.id); // "elem"
  alert(elem.value); // value
</script>
```

대부분의 표준 HTML 속성은 그에 대응하는 DOM 프로퍼티를 가지고 있는데, 위 예시와 같은 방식으로 접근할 수 있습니다.

특정 클래스에서 지원하는 프로퍼티 전체를 보고 싶다면 명세서를 읽어보면 됩니다. 예를 들어 `HTMLInputElement`에서 지원하는 프로퍼티 목록은 <https://html.spec.whatwg.org/#htmlinputelement>에서 찾아볼 수 있습니다.

명세서를 읽지 않고도 개발자 도구의 콘솔 창에 `console.dir(elem)`를 입력하면 해당 요소에서 지원하는 프로퍼티 목록을 빠르게 확인할 수 있습니다. 개발자 도구의 Elements 패널의 하위 패널 중 'Properties'를 선택해도 동일한 목록을 확인할 수 있습니다.  

## 요약

각 DOM 노드는 고유한 클래스에 속합니다. 클래스들은 계층 구조를 형성합니다. DOM 노드에서 지원하는 프로퍼티와 메서드는 계층구조에서 어떤 클래스를 상속받느냐에 따라 결정됩니다.

주요 DOM 노드 프로퍼티는 다음과 같습니다.

`nodeType`
: 요소 타입을 알고 싶을 때 사용합니다. 요소 노드라면 `1`을, 텍스트 노드라면 `3`을 반환합니다. 두 타입 외에도 각 노드 타입엔 대응하는 상숫값이 있습니다. 읽기 전용입니다.

`nodeName/tagName`
: 요소 노드의 태그 이름을 알아낼 때 사용합니다. XML 모드일 때를 제외하고 태그 이름은 항상 대문자로 변환됩니다. 요소 노드가 아닌 노드에는 `nodeName`을 사용하면 됩니다. 읽기 전용입니다.

`innerHTML`
: 요소 안의 HTML을 알아낼 수 있습니다. 이 프로퍼티를 사용하면 요소 안의 HTML을 수정할 수도 있습니다.

`outerHTML`
: 요소의 전체 HTML을 알아낼 수 있습니다. `elem.outerHTML`에 무언가를 할당해도 `elem` 자체는 바뀌지 않습니다. 대신 새로운 HTML이 외부 컨텍스트에서 만들어지고, `elem`이 삭제된 자리를 채웁니다.

`nodeValue/data`
: 요소가 아닌 노드(텍스트, 주석 노드 등)의 내용을 읽을 때 쓰입니다. 두 프로퍼티는 거의 동일하게 동작합니다. 주로 `data`를 많이 사용하는 편이며 내용을 수정할 때도 이 프로퍼티를 쓸 수 있습니다.

`textContent`
: HTML에서 모든 `<태그>`를 제외한 텍스트만 읽을 때 사용합니다. 할당 연산을 통해 무언가를 쓸 수도 있는데 이때 태그를 포함한 모든 특수문자는 문자열로 처리됩니다. 사용자가 입력한 문자를 안전한 방법으로 처리하기 때문에 원치 않는 HTML이 사이트에 삽입되는 것을 예방할 수 있습니다.

`hidden`
: `true`로 설정하면 CSS에서 `display:none`을 설정한 것과 동일하게 동작합니다.

DOM 노드는 클래스에 따라 이 외에도 다른 프로퍼티를 가집니다. `<input>` 요소(`HTMLInputElement`)는 `value`, `type` 프로퍼티를, `<a>` 요소(`HTMLAnchorElement`)는 `href` 프로퍼티를 지원하는 것 같이 말이죠. 대부분의 표준 HTML 속성은 대응하는 DOM 프로퍼티를 가집니다.

그런데 HTML 요소와 DOM 프로퍼티가 항상 같은 것은 아닙니다. 관련 내용은 다음 챕터에서 살펴보도록 하겠습니다.
