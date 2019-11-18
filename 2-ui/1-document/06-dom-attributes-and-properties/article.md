# 속성과 프로퍼티

브라우저는 웹페이지를 만나면 HTML을 읽어(이 과정을 파싱(parsing, 구문분석)이라고 부릅니다) DOM 객체를 생성합니다. 요소 노드(Element node)에서 표준 HTML 속성(HTML attribute)은 파싱을 거쳐 DOM 객체의 프로퍼티(property)가 됩니다.

예를 들어 `<body id="page">`태그가 있다면 id 속성은 DOM 객체 프로퍼티로 전환 돼 `body.id="page"`로 접근할 수 있습니다.

하지만 속성-프로퍼티는 일대일의 관계가 아닙니다. 이번 주제에선 속성과 프로퍼티가 어떻게 함께 작동하는지, 언제 같은지, 언제 다른지 주의하여 두 개념을 알아보겠습니다.

## DOM 프로퍼티

<<<<<<< HEAD
이미 내장(built-in) DOM 프로퍼티에 대해 살펴본 바 있습니다. DOM 프로퍼티는 엄청나게 많습니다. 하지만 이런 내장 프로퍼티만으로 충분하지 않은 경우 자신만의 프로퍼티를 만들 수도 있습니다.
=======
We've already seen built-in DOM properties. There are a lot. But technically no one limits us, and if there aren't enough, we can add our own.
>>>>>>> e515f80a9f076115a6e3fef8a30cd73e6db20054

DOM 노드(DOM node)는 자바스크립트 객체입니다. 이걸 한번 바꿔보도록 하겠습니다.

예를 들어 새로운 프로퍼티를 `document.body`에 만들어보겠습니다:

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

document.body.sayTagName(); // BODY (메서드에서 사용된 "this" 가 가리키는건 document.body입니다)
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
- 대소문자를 가립니다(이렇게 써야 작동하고 `elem.nodeType`, 이렇게 쓰면 작동하지 않습니다 `elem.NoDeTyPe`).

## HTML 속성

HTML에서 태그(tag)는 복수의 속성(attribute)를 가질 수 있습니다. 브라우저는 HTML을 파싱해 DOM 객체를 만들 때 HTML *표준* 속성을 인식하고, 이 표준 속성을 이용해 DOM 프로퍼티를 만듭니다.

HTML 요소가 `id`와 같은 *표준* 속성으로만 구성되어 있다면, 이에 해당하는 프로퍼티가 자연스레 만들어집니다. 하지만 표준이 아닌 속성이 사용된 경우는 조금 다릅니다.

예를 들어 다음과 같은 html이 있다고 합시다:
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

한 요소에선 표준인 속성이 다른 요소에선 표준이 아닐 수 있다는 점에 주의해야 합니다. 예를 들어 `<input>`요소에서 `"type"`은 표준이지만([HTMLInputElement](https://html.spec.whatwg.org/#htmlinputelement)), `<body>`에선 아닙니다([HTMLBodyElement](https://html.spec.whatwg.org/#htmlbodyelement)). 표준 속성(standard attribute)은 해당 요소(HTML element)의 명세서에 가면 찾아볼 수 있습니다.

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

위에서 확인한 바와 같이 표준속성이 아닌 경우 이에 연결되는 DOM-프로퍼티가 없습니다. 이런 비표준 속성에 접근할 수 있는 방법은 없는 걸까요?

물론 있습니다. 모든 속성은 아래의 메서드로 접근 가능합니다.

- `elem.hasAttribute(name)` -- 속성의 존재 확인.
- `elem.getAttribute(name)` -- 속성값을 가져옴.
- `elem.setAttribute(name, value)` -- 속성값을 변경함.
- `elem.removeAttribute(name)` -- 속성값을 제거함.

위 메서드는 HTML에 명시된 속성을 변화시킵니다.

여기에 더하여 `elem.attributes`을 사용하면 모든 속성값을 읽을 수도 있습니다. `elem.attributes`은 내장 클래스 [Attr](https://dom.spec.whatwg.org/#attr)를 구현한 `name` and `value` 프로퍼티를 가진 객체를 반환합니다.

아래는 비표준 프로퍼티를 읽는 데모 코드입니다:

```html run
<body something="non-standard">
  <script>
*!*
    alert(document.body.getAttribute('something')); // 비표준(non-standard) 속성에 접근
*/!*
  </script>
</body>
```

HTML 속성은 다음과 같은 특징이 있습니다:

- 대/소문자를 구분하지 않습니다(`id`와 `ID`가 같습니다).
- 값은 항상 문자열입니다.

HTML 속성에 관한 또 다른 데모 코드를 살펴보세요:

```html run
<body>
  <div id="elem" about="Elephant"></div>

  <script>
    alert( elem.getAttribute('About') ); // (1) 'Elephant', 속성 읽기

    elem.setAttribute('Test', 123); // (2) 속성 추가하기

    alert( elem.outerHTML ); // (3) 추가된 속성 확인하기

    for (let attr of elem.attributes) { // (4) 속성에 접근하기
      alert( `${attr.name} = ${attr.value}` );
    }
  </script>
</body>
```

주의해서 볼 점은 다음과 같습니다:

1. `getAttribute('About')` -- 첫 번째 글자가 대문자 A이지만, HTML 안에는 모두 소문자로 작성되어 있습니다. 이렇게 대/소문자가 다름에도 불구하고 정상적으로 값이 출력되었습니다. 속성은 대/소문자를 구분하지 않습니다.
2. 어떤 값이든 속성에 대입할 수 있습니다. 하지만 최종적으론 문자열로 바뀝니다. 숫자 123이 문자열 `"123"` 으로 바뀌었습니다.
3. `outerHTML`을 사용하면 모든 속성을 볼 수 있습니다.
4. `attributes` 컬렉션은 iterable 합니다. 그리고 표준, 비표준 요소의 속성을 `name` 과 `value` 프로퍼티로 접근할 수 있게 해줍니다.

## 프로퍼티-속성 동기화

표준 속성이 변화하면 해당하는 프로퍼티는 자동으로 업데이트되고, 몇몇 경우를 제외하고 프로퍼티가 업데이트되면 속성도 마찬가지로 업데이트됩니다.

아래 예시에서 속성으로써의 `id`가 수정되었고, 이에 대응하는 프로퍼티가 업데이트되었음을 확인할 수 있습니다. 그 반대도 마찬가지입니다.

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

이런 특징은 유용하게 사용될 수도 있습니다. 유저의 어떤 행동 때문에 `value`의 값이 변경되었는데, 수정 전의 "원래" 값을 가지고 오고 싶은 경우에 속성에서 이 값을 가지고 오면 되기 때문입니다.

## DOM 프로퍼티의 타입

DOM 프로퍼티는 항상 문자열이 아닙니다. 예를 들어 `input.checked` 프로퍼티(체크박스에서 사용됨)의 경우 불린(boolean) 값을 가집니다:

```html run
<input id="input" type="checkbox" checked> checkbox

<script>
  alert(input.getAttribute('checked')); // 속성 값: 빈 문자열
  alert(input.checked); // 프로퍼티 값: true
</script>
```

몇 가지 다른 예를 보여드리겠습니다. `style` 속성의 경우 문자열이지만, `style` 프로퍼티의 경우 객체입니다:

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

그런데, 대부분의 프로퍼티는 문자열입니다.

아주 드문 경우긴 하지만, DOM 프로퍼티 타입이 문자열일지라도 속성과 다를 수 있습니다. a 태그의 href 속성이 상대 URL이나 `#hash`이더라도, `href` DOM 프로퍼티의 경우 항상 *전체* URL 값을 가지는 경우가 대표적인 예시입니다.

예제 코드를 살펴봅시다:

```html height=30 run
<a id="a" href="#hello">link</a>
<script>
  // attribute
  alert(a.getAttribute('href')); // #hello

  // property
  alert(a.href ); // form 내의 전체 URL http://site.com/page#hello
</script>
```

HTML에 내에 사용된 `href` 값과 같이 정확한 속성값을 얻고 싶다면 `getAttribute`을 사용하면 됩니다.


## 비표준 속성, dataset

HTML을 작성할 때 우리는 대부분의 경우 표준 속성을 사용합니다. 하지만 표준이 아닌 속성도 있을 수 있습니다. 이런 비표준(non-standard) 속성을 언제 사용해야 유용하고 언제 사용하면 유용하지 않은 지, 그리고 언제 이 비표준 속성을 사용하는지 알아봅시다.

비표준 속성은 커스텀 데이터를 HTML에서 자바스크립트로 넘기고 싶은 경우나 HTML-요소를 "mark(표시)" 하기 위해 사용될 수 있습니다. 

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
    // 해당하는 정보를 필드 값에 입력해 줌
    let field = div.getAttribute('show-info');
    div.innerHTML = user[field]; // first Pete into "name", then 25 into "age"
  }
</script>
```

요소에 스타일을 적용할 때 사용될 수도 있습니다.

주문(order) 상태(state)를 나타내는 커스텀 속성 `order-state`의 스타일을 꾸미는 예제:

```html run
<style>
  /* 스타일이 커스텀 속성인 "order-state"에 따라 결정됩니다 */
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

<<<<<<< HEAD
이는 속성이 다루기 쉽다는 장점 때문입니다. 상태(state)를 이렇게 쉽게 바꿀 수 있습니다:
=======
Why would using an attribute be preferable to having classes like `.order-state-new`, `.order-state-pending`, `order-state-canceled`?

Because an attribute is more convenient to manage. The state can be changed as easy as:
>>>>>>> e515f80a9f076115a6e3fef8a30cd73e6db20054

```js
// 새 클래스를 추가하거나 지우는 것보다 더 쉽게 상태(state)를 바꿀 수 있습니다
div.setAttribute('order-state', 'canceled');
```

<<<<<<< HEAD
하지만 커스텀 속성을 사용하게 되면 몇 가지 문제가 발생할 수 있습니다. 비표준 속성을 사용해 코드를 작성했는데 나중에 그 속성이 표준으로 등록되게 되면 어떨까요? HTML은 살아있는 언어입니다. 개발자들의 요구를 반영하기 위해 지속해서 발전하고 있죠. 그래서 앞에서 언급한 경우에 예기치 못한 부작용이 생기기도 합니다.
=======
But there may be a possible problem with custom attributes. What if we use a non-standard attribute for our purposes and later the standard introduces it and makes it do something? The HTML language is alive, it grows, and more attributes appear to suit the needs of developers. There may be unexpected effects in such case.
>>>>>>> e515f80a9f076115a6e3fef8a30cd73e6db20054

이런 충돌상황을 방지하기 위해 [data-*](https://html.spec.whatwg.org/#embedding-custom-non-visible-data-with-the-data-*-attributes) 속성이 도입되었습니다.

**"data-"로 시작하는 모든 속성은 개발자가 등록한 속성입니다. 이 속성들은 `dataset` 프로퍼티를 통해 사용할 수 있습니다.**

예를 들어 `elem`이 `"data-about"`이라는 속성을 가지고 있다면, 우리는 `elem.dataset.about`이라는 문법을 쓸 수 있습니다

이렇게 말이죠:

```html run
<body data-about="Elephants">
<script>
  alert(document.body.dataset.about); // Elephants
</script>
```

`data-order-state`와 같이 여러 단어로 구성된 속성의 경우는 카멜 표기법(camel-cased)을 사용해 `dataset.orderState`으로 변환됩니다.

주문 상태(order state)에 관한 예제를 다시 살펴보죠:

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

`data-*` 속성은 커스텀 데이터를 전달하기 위해 안전하고 유효한 방법입니다.

data-속성을 읽을 수 있을 뿐만 아니라 수정할 수도 있다는 점을 기억하세요. 속성이 수정되면 CSS가 해당 뷰를 자동으로 업데이트해 줍니다. 위의 주문상태 예시에서 `(*)` 표시가 된 마지막 라인은 색을 파란색으로 바꿔줍니다.

## 요약

- 속성(Attributes) -- HTML 안에 쓰임.
- 프로퍼티(Properties) -- DOM 객체 안에 쓰임.

비교표:

|            | 프로퍼티 | 속성 |
|------------|------------|------------|
|타입|모든 타입 가능, 표준 프로퍼티의 경우 spec에 타입이 명시되어 있음|문자열|
|이름|대/소문자 구분|대/소문자 구분하지 않음|

속성과 함께 쓰이는 메서드:

- `elem.hasAttribute(name)` -- 속성의 존재 확인.
- `elem.getAttribute(name)` -- 속성값을 가져옴.
- `elem.setAttribute(name, value)` -- 속성값을 변경함.
- `elem.removeAttribute(name)` -- 속성값을 제거함.
- `elem.attributes` 은 속성의 모음(collection)을 반환함.

대부분의 상황에서 속성보다는 프로퍼티를 사용하는 게 더 낫습니다. 다만, HTML 속성의 정확한 값이 필요한 다음의 사례는 프로퍼티를 사용하기에 적절치 않은 경우이므로 속성을 사용해야 합니다:

- 비표준 속성이 필요한 경우. 다만 속성이 `data-`로 시작하는 경우, `dataset`을 사용합니다.
- HTML에 적힌 문자 그대로의 값을 읽고 싶은 경우. 원본값과 DOM 프로퍼티의 값이 다른데, 원본값이 필요한 경우에 사용합니다. `href` 프로퍼티의 경우 항상 전체 URL 값을 가지기 때문에 이런 경우 사용하면 유용합니다.
