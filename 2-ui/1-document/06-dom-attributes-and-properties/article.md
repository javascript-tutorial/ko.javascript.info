# 속성과 프로퍼티

브라우저는 웹페이지를 만나면 HTML을 읽어(이 과정을 파싱(parsing)이라고 부릅니다) DOM 객체를 생성합니다. 요소 노드(Element node)에서 표준 HTML 속성(HTML attribute)은 파싱을 거쳐 DOM 객체의 프로퍼티(property)가 됩니다.

예를 들어 `<body id="page">`태그가 있다면 id 속성은 DOM 객체 프로퍼티로 전환 돼 `body.id="page"`로 접근할 수 있습니다.

하지만 속성-프로퍼티는 일대일의 관계가 아닙니다. 이 장에선 속성과 프로퍼티가 어떻게 함께 작동하는지, 언제 같은지, 언제 다른지 주의하여 두 개념을 알아보겠습니다.

## DOM 프로퍼티

이미 내장(built-in) DOM 프로퍼티에 대해 살펴 본 바 있습니다. DOM 프로퍼티는 엄청나게 많습니다. 하지만 이런 내장 프로퍼티만으로 충분하지 않은 경우 자신만의 프로퍼티를 만들수도 있습니다.

DOM 노드(DOM node)는 자바스크립트 객체입니다. 이걸 한번 바꿔보도록 하겠습니다.

예를들어 새로운 프로퍼티를 `document.body`에 만들어보겠습니다:

```js run
document.body.myData = {
  name: 'Caesar',
  title: 'Imperator'
};

alert(document.body.myData.title); // Imperator
```

여기에 메서드도 하나 추가할 수 있습니다:

```js run
document.body.sayTagName = function() {
  alert(this.tagName);
};

document.body.sayTagName(); // BODY (메서드에서 사용된 "this" 가 기리키는건 document.body입니다)
```

`Element.prototype`와 같은 내장 프로토타입을 수정해 모든 요소가 이 메서드를 사용하게 할 수도 있습니다:

```js run
Element.prototype.sayHi = function() {
  alert(`Hello, I'm ${this.tagName}`);
};

document.documentElement.sayHi(); // Hello, I'm HTML
document.body.sayHi(); // Hello, I'm BODY
```

DOM 프로퍼티와 메서드는 일반적인 자바스크립트 객체처럼 행동합니다:

- 어떤 값이든 가질 수 있습니다.
- 대소문자를 가립니다(이렇게 써야 작동하고`elem.nodeType`, 이렇게 쓰면 작동하지 않습니다`elem.NoDeTyPe`).

## HTML 속성

HTML에서 태그(tag)는 복수개의 속성(attribute)를 가질 수도 있습니다. 브라우저는 HTML을 파싱해 DOM 객체를 만들때 HTML *표준* 속성을 인식하고 이 표준 속성을 가지고 DOM 프로퍼티를 만듭니다.

HTML 요소가 `id`와 같은 *표준* 속성으로만 구성되어 있다면, 이에 해당하는 프로퍼티가 자연스레 만들어집니다. 하지만 표준이 아닌 속성이 사용된 경우는 조금 다릅니다.

예를들어 다음과 같은 html이 있다고 합시다:
```html run
<body id="test" something="non-standard">
  <script>
    alert(document.body.id); // test
*!*
    // 표준이 아닌 속성은 프로퍼티로 파싱되지 않습니다
    alert(document.body.something); // undefined
*/!*
  </script>
</body>
```

특정 요소에서 표준인 속성이 다른 요소에선 표준이 아닐 수 있다는 점에 주의해야 합니다. 예를들어 `<input>`요소에서 `"type"`은 표준이지만([HTMLInputElement](https://html.spec.whatwg.org/#htmlinputelement)), `<body>`에선 아닙니다([HTMLBodyElement](https://html.spec.whatwg.org/#htmlbodyelement)). 표준 속성(standard attribute)은 해당 요소(HTML element)의 명세서에 가면 찾아볼 수 있습니다.


다음을 확인해 보세요:
```html run
<body id="body" type="...">
  <input id="input" type="text">
  <script>
    alert(input.type); // text
*!*
    alert(body.type); // undefined: type은 body의 표준 속성이 아니므로 DOM 프로퍼티가 생성되지 않습니다
*/!*
  </script>
</body>
```
위에서 확인한 바와 같이 표준속성이 아닌 경우 이에 연결되는 DOM-프로퍼티가 없습니다. 이런 비표준 속성에 접근할 수 있는 방법은 없는걸까요?

물론 있습니다. 모든 속성은 아래의 메서드로 접근가능합니다.

- `elem.hasAttribute(name)` -- 속성의 존재 확인.
- `elem.getAttribute(name)` -- 속성 값을 가져옴.
- `elem.setAttribute(name, value)` -- 속성 값을 변경함.
- `elem.removeAttribute(name)` -- 속성 값을 제거함.

위 메서드는 HTML에 명시된 속성을 변화시킵니다.
These methods operate exactly with what's written in HTML.

여기에 더하여 `elem.attributes`을 사용하면 모든 속성값을 읽을 수도 있습니다. 내장 클래스 [Attr](https://dom.spec.whatwg.org/#attr)를 구현한 `name` and `value` 프로퍼티를 가진 객체를 반환합니다.

비표준 프로퍼티를 읽는 방법:

```html run
<body something="non-standard">
  <script>
*!*
    alert(document.body.getAttribute('something')); // non-standard
*/!*
  </script>
</body>
```

HTML 속성은 다음과 같은 특징이 있습니다:

- 대/소문자를 구분하지 않습니다 (`id`와 `ID`가 같습니다).
- 값은 항상 문자열입니다.

HTML 속성에 관한 또다른 데모를 살펴보세요:

```html run
<body>
  <div id="elem" about="Elephant"></div>

  <script>
    alert( elem.getAttribute('About') ); // (1) 'Elephant', reading

    elem.setAttribute('Test', 123); // (2), writing

    alert( elem.outerHTML ); // (3), see it's there

    for (let attr of elem.attributes) { // (4) list all
      alert( `${attr.name} = ${attr.value}` );
    }
  </script>
</body>
```

주의해서 볼 점은 다음과 같습니다:

1. `getAttribute('About')` -- 첫 번째 글자가 대문자 A이지만, HTML 안에는 모두 소문자로 작성되어 있습니다. 이렇게 대/소문자가 다름에도 불구하고 정상적으로 값이 출력되었습니다. 속성은 대/소문자를 구분하지 않습니다.
2. 어떤 값이든 속성에 대입할 수 있습니다. 하지만 최종적으론 문자열로 바뀌어집니다. 숫자 123이 문자열 `"123"` 으로 바뀌었습니다.
3. `outerHTML`을 사용하면 모든 속성을 볼 수 있습니다.
4. `attributes` 컬렉션은 iterable합니다. 그리고 표준, 비표준 요소의 속성을 `name` 과 `value` 프로퍼티로 접근할 수 있게 해줍니다.


## 프로퍼티-속성 동기화(synchronization)

표준 속성이 변화하면 해당하는 프로퍼티는 자동으로 업데이트 되고, 몇몇 경우를 제외하고 그 반대도 마찬가지로 업데이트 됩니다.

아래 예시에서 속성으로써의 `id`가 수정되었고, 이에 대응하는 프로퍼티가 업데이트 되었음을 확인할 수 있습니다. 그 반대도 마찬가지 입니다.

```html run
<input>

<script>
  let input = document.querySelector('input');

  // attribute => property
  input.setAttribute('id', 'id');
  alert(input.id); // id (updated)

  // property => attribute
  input.id = 'newId';
  alert(input.getAttribute('id')); // newId (updated)
</script>
```

하지만  `input.value`와 같이 동기화가 속성에서 프로퍼티 방향으로만 일어나는 예외상황도 존재합니다: 

```html run
<input>

<script>
  let input = document.querySelector('input');

  // attribute => property
  input.setAttribute('value', 'text');
  alert(input.value); // text

*!*
  // NOT property => attribute
  input.value = 'newValue';
  alert(input.getAttribute('value')); // text (업데이트 안됨!)
*/!*
</script>
```

위의 예시에서 다음을 확인할 수 있습니다:
- 속성 `value`를 수정하면 프로퍼티도 수정된다.
- 하지만 프로퍼티를 수정해도 속성은 수정되지 않는다.

이런 특징은 유용하게 사용될 수도 있습니다. 만약 유저가 `value`를 수정하고 난다음 어떤 이유 때문에 수정 전의 value를 가지고 오고 싶어하는 경우, 기존 값을 속성에서 그대로 가지고 오면 되기 때문입니다.

## DOM properties are typed

DOM 프로퍼티는 항상 문자열이 아닙니다. 예를들어 `input.checked` 프로퍼티(체크박스에서 사용됨)의 경우 불린(boolean)값을 가집니다:

```html run
<input id="input" type="checkbox" checked> checkbox

<script>
  alert(input.getAttribute('checked')); // 속성 값: 빈 문자열
  alert(input.checked); // 프로퍼티 값: true
</script>
```

몇가지 다른 예를 보여드리겠습니다. `style` 속성의 경우 문자열 이지만, `style` 프로퍼티의 경우 객체입니다:

```html run
<div id="div" style="color:red;font-size:120%">Hello</div>

<script>
  // string
  alert(div.getAttribute('style')); // color:red;font-size:120%

  // object
  alert(div.style); // [object CSSStyleDeclaration]
  alert(div.style.color); // red
</script>
```

속성과 프로퍼티의 중요한 차이점이 바로 이것입니다. 한편, DOM 프로퍼티의 타입이 문자열임에도 불구하고 속성과는 전혀 다른 값을 가지는 경우도 있습니다.

a태그의 href 속성이 상대 URL이나 `#hash`와 같이 URL 조각이더라도, `href` DOM 프로퍼티의 경우 항상 *전체* URL 값을 가지는 경우가 대표적인 예시 입니다.

예제 코드를 살펴봅시다:

```html height=30 run
<a id="a" href="#hello">link</a>
<script>
  // attribute
  alert(a.getAttribute('href')); // #hello

  // property
  alert(a.href ); // form내의 전체 URL http://site.com/page#hello
</script>
```

HTML에 내에 사용된 `href`값과 같이 정확한 속성 값을 얻고 싶다면 `getAttribute`을 사용하면 됩니다.


## 비표준 속성, dataset

HTML을 작성할 때 우리는 대부분의 경우 표준 속성을 사용합니다. 하지만 표준이 아닌 속성도 있을 수 있습니다. 이런 비표준(non-standard) 속성을 언제 사용해야 유용하고 언제 사용하면 유용하지 않은지, 그리고 언제 이 비표준 속성을 사용하는지 알아봅시다.

When writing HTML, we use a lot of standard attributes. But what about non-standard, custom ones? First, let’s see whether they are useful or not? What for?

비표준 속성은 커스텀 데이터를 HTML에서 자바스크림트로 넘기고 싶은 경우나 HTML-요소를 "mark(표시)"하기 위해 사용될 수 있습니다. 
Sometimes non-standard attributes are used to pass custom data from HTML to JavaScript, or to "mark" HTML-elements for JavaScript.

예시:

```html run
<!-- "name"이 보여지는 div라고 mark함(show-info사용) -->
<div *!*show-info="name"*/!*></div>
<!-- age가 보여지는 자리 -->
<div *!*show-info="age"*/!*></div>

<script>
  // 마크된 요소를 찾아 그 자리에 해당하는 정보를 보여줌
  let user = {
    name: "Pete",
    age: 25
  };

  for(let div of document.querySelectorAll('[show-info]')) {
    // 해당하는 정보를 필드값에 입력해 줌
    let field = div.getAttribute('show-info');
    div.innerHTML = user[field]; // Pete, then age
  }
</script>
```

요소에 스타일을 적용할 때 사용될 수도 있습니다.Also they can be used to style an element.

주문(order) 상태(state)를 나타내는 커스텀 속성 `order-state`의 스타일을 꾸미는 예제:

```html run
<style>
  /* styles rely on the custom attribute "order-state" */
  .order[order-state="new"] {
    color: green;
  }

  .order[order-state="pending"] {
    color: blue;
  }

  .order[order-state="canceled"] {
    color: red;
  }
</style>

<div class="order" order-state="new">
  A new order.
</div>

<div class="order" order-state="pending">
  A pending order.
</div>

<div class="order" order-state="canceled">
  A canceled order.
</div>
```

Why the attribute may be preferable to classes like `.order-state-new`, `.order-state-pending`, `order-state-canceled`?

That's because an attribute is more convenient to manage. The state can be changed as easy as:

```js
// a bit simpler than removing old/adding a new class
div.setAttribute('order-state', 'canceled');
```

But there may be a possible problem with custom attributes. What if we use a non-standard attribute for our purposes and later the standard introduces it and makes it do something? The HTML language is alive, it grows, more attributes appear to suit the needs of developers. There may be unexpected effects in such case.

To avoid conflicts, there exist [data-*](https://html.spec.whatwg.org/#embedding-custom-non-visible-data-with-the-data-*-attributes) attributes.

**All attributes starting with "data-" are reserved for programmers' use. They are available in the `dataset` property.**

For instance, if an `elem` has an attribute named `"data-about"`, it's available as `elem.dataset.about`.

Like this:

```html run
<body data-about="Elephants">
<script>
  alert(document.body.dataset.about); // Elephants
</script>
```

Multiword attributes like `data-order-state` become camel-cased: `dataset.orderState`.

Here's a rewritten "order state" example:

```html run
<style>
  .order[data-order-state="new"] {
    color: green;
  }

  .order[data-order-state="pending"] {
    color: blue;
  }

  .order[data-order-state="canceled"] {
    color: red;
  }
</style>

<div id="order" class="order" data-order-state="new">
  A new order.
</div>

<script>
  // read
  alert(order.dataset.orderState); // new

  // modify
  order.dataset.orderState = "pending"; // (*)
</script>
```

Using `data-*` attributes is a valid, safe way to pass custom data.

Please note that we can not only read, but also modify data-attributes. Then CSS updates the view accordingly: in the example above the last line `(*)` changes the color to blue.

## Summary

- Attributes -- is what's written in HTML.
- Properties -- is what's in DOM objects.

A small comparison:

|            | Properties | Attributes |
|------------|------------|------------|
|Type|Any value, standard properties have types described in the spec|A string|
|Name|Name is case-sensitive|Name is not case-sensitive|

Methods to work with attributes are:

- `elem.hasAttribute(name)` -- to check for existence.
- `elem.getAttribute(name)` -- to get the value.
- `elem.setAttribute(name, value)` -- to set the value.
- `elem.removeAttribute(name)` -- to remove the attribute.
- `elem.attributes` is a collection of all attributes.

For most needs, DOM properties can serve us well. We should refer to attributes only when DOM properties do not suit us, when we need exactly attributes, for instance:

- We need a non-standard attribute. But if it starts with `data-`, then we should use `dataset`.
- We want to read the value "as written" in HTML. The value of the DOM property may be different, for instance the `href` property is always a full URL, and we may want to get the "original" value.
