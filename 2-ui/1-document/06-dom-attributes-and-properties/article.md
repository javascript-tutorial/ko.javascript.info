# 속성과 프로퍼티

브라우저는 웹페이지를 만나면 HTML을 읽어(파싱(parsing)) DOM 객체를 생성합니다. 요소 노드(element node)에서 대부분의 표준 HTML 속성(attribute)은 DOM 객체의 프로퍼티(property)가 됩니다.

태그 `<body id="page">`가 있을 때, DOM 객체에서 `body.id="page"`를 사용할 수 있는 것 같이 말이죠.

그런데 속성-프로퍼티가 항상 일대일로 매핑되지는 않습니다! 이번 챕터에선 속성과 프로퍼티를 어떻게 다룰 수 있는지, 두 가지가 언제 일대일로 매핑되는지, 언제는 매핑되지 않는지에 주의하면서 두 개념을 알아보겠습니다.

## DOM 프로퍼티

앞서 내장 DOM 프로퍼티에 대해 살펴본 바 있습니다. DOM 프로퍼티의 종류는 엄청나게 많습니다. 하지만 이런 내장 프로퍼티만으로 충분하지 않은 경우 자신만의 프로퍼티를 만들 수도 있습니다.

DOM 노드(DOM node)는 자바스크립트 객체입니다. 객체를 바꿔보겠습니다.

`document.body`에 새로운 프로퍼티를 만들어봅시다.

```js run
document.body.myData = {
  name: 'Caesar',
  title: 'Imperator'
};

alert(document.body.myData.title); // Imperator
```

메서드도 하나 추가해 보겠습니다.

```js run
document.body.sayTagName = function() {
  alert(this.tagName);
};

document.body.sayTagName(); // BODY (sayTagName의 'this'엔 document.body가 저장됩니다.)
```

`Element.prototype` 같은 내장 프로토타입을 수정해 모든 요소 노드에서 이 메서드를 사용하게 할 수도 있습니다.

```js run
Element.prototype.sayHi = function() {
  alert(`Hello, I'm ${this.tagName}`);
};

document.documentElement.sayHi(); // Hello, I'm HTML
document.body.sayHi(); // Hello, I'm BODY
```

예시에서 살펴본 바와 같이 DOM 프로퍼티와 메서드는 일반 자바스크립트 객체처럼 행동하므로 아래와 같은 특징을 보입니다.

- 어떤 값이든 가질 수 있습니다.
- 대·소문자를 가립니다. `elem.nodeType`는 동작하지만 `elem.NoDeTyPe`는 동작하지 않습니다.

## HTML 속성

HTML에서 태그는 복수의 속성을 가질 수 있습니다. 브라우저는 HTML을 파싱해 DOM 객체를 만들 때 HTML *표준* 속성을 인식하고, 이 표준 속성을 사용해 DOM 프로퍼티를 만듭니다.

따라서 요소가 `id` 같은 *표준* 속성으로만 구성되어 있다면, 이에 해당하는 프로퍼티가 자연스레 만들어집니다. 하지만 표준이 아닌 속성일 때는 상황이 달라집니다.

예시:
```html run
<body id="test" something="non-standard">
  <script>
    alert(document.body.id); // test
*!*
    // 비표준 속성은 프로퍼티로 전환되지 않습니다.
    alert(document.body.something); // undefined
*/!*
  </script>
</body>
```

한 요소에선 표준인 속성이 다른 요소에선 표준이 아닐 수 있다는 점에도 주의해야 합니다. `"type"`은 `<input>` 요소([HTMLInputElement](https://html.spec.whatwg.org/#htmlinputelement))에선 표준이지만, `<body>`([HTMLBodyElement](https://html.spec.whatwg.org/#htmlbodyelement))에선 아닙니다. 요소에 어떤 표준 속성이 있는지 알아보려면 해당 요소의 명세서에 정보를 찾을 수 있습니다.

아래 예시를 실행해봅시다.
```html run
<body id="body" type="...">
  <input id="input" type="text">
  <script>
    alert(input.type); // text
*!*
    alert(body.type); // type은 body의 표준 속성이 아니므로 DOM 프로퍼티가 생성되지 않아 undefined가 출력됩니다.
*/!*
  </script>
</body>
```

이처럼 표준 속성이 아닌 경우, 이에 매핑하는 DOM 프로퍼티가 생성되지 않습니다. 그렇다면 비표준 속성은 접근할 수 없는 걸까요?

물론 방법이 있습니다. 모든 속성은 아래의 메서드를 사용해 접근할 수 있습니다.

- `elem.hasAttribute(name)` -- 속성 존재 여부 확인
- `elem.getAttribute(name)` -- 속성값을 가져옴
- `elem.setAttribute(name, value)` -- 속성값을 변경함
- `elem.removeAttribute(name)` -- 속성값을 지움

위 메서드들은 HTML에서 명시한 속성을 대상으로 동작합니다.

여기에 더하여 `elem.attributes`을 사용하면 모든 속성값을 읽을 수도 있습니다. `elem.attributes`을 호출하면 내장 클래스 [Attr](https://dom.spec.whatwg.org/#attr)를 구현한 객체들을 담은 컬렉션이 반환되는데, 객체엔 `name`과 `value` 프로퍼티가 존재합니다.

비표준 프로퍼티를 읽는 예시를 살펴봅시다.

```html run
<body something="non-standard">
  <script>
*!*
    alert(document.body.getAttribute('something')); // 비표준 속성에 접근
*/!*
  </script>
</body>
```

HTML 속성은 아래와 같은 특징을 보입니다.

- 대·소문자를 가리지 않습니다. `id`와 `ID`는 동일합니다.
- 값은 항상 문자열입니다.

HTML 속성을 어떻게 다루는지에 대한 예시를 살펴봅시다.

```html run
<body>
  <div id="elem" about="Elephant"></div>

  <script>
    alert( elem.getAttribute('About') ); // (1) 'Elephant', 속성 읽기

    elem.setAttribute('Test', 123); // (2) 속성 추가하기

    alert( elem.outerHTML ); // (3) 추가된 속성 확인하기

    for (let attr of elem.attributes) { // (4) 속성 전체 나열하기
      alert( `${attr.name} = ${attr.value}` );
    }
  </script>
</body>
```

주의해서 볼 점은 다음과 같습니다.

1. `getAttribute('About')` -- 첫 번째 글자가 대문자 A이지만, HTML 안에서는 모두 소문자가 됩니다. 속성은 대·소문자를 구분하지 않으므로 괜찮습니다.
2. 어떤 값이든 속성에 대입할 수 있지만, 최종적으론 문자열로 바뀝니다. 숫자 123이 문자열 `"123"` 으로 바뀌었습니다.
3. `outerHTML`을 사용하면 직접 추가한 속성을 비롯한 모든 속성을 볼 수 있습니다.
4. `attributes`가 반환하는 컬렉션은 열거 가능(iterable)합니다. 컬렉션에 담긴 각 객체의  `name`, `value` 프로퍼티를 사용하면 속성 전체에 접근할 수 있습니다. 

## 프로퍼티-속성 동기화

표준 속성이 변하면 대응하는 프로퍼티는 자동으로 갱신됩니다. 몇몇 경우를 제외하고 프로퍼티가 변하면 속성 역시 마찬가지로 갱신됩니다.

아래 예시에서 속성 `id`가 수정되면 이에 대응하는 프로퍼티가 갱신되는 것을 확인할 수 있습니다. 그 반대도 마찬가지입니다.

```html run
<input>

<script>
  let input = document.querySelector('input');

  // 속성 추가 => 프로퍼티 갱신
  input.setAttribute('id', 'id');
  alert(input.id); // id (갱신)

  // 프로퍼티 변경 => 속성 갱신
  input.id = 'newId';
  alert(input.getAttribute('id')); // newId (갱신)
</script>
```

그런데 아래 예시의 `input.value`처럼 동기화가 속성에서 프로퍼티 방향으로만 일어나는 예외상황도 존재합니다. 

```html run
<input>

<script>
  let input = document.querySelector('input');

  // 속성 추가 => 프로퍼티 갱신
  input.setAttribute('value', 'text');
  alert(input.value); // text (갱신)

*!*
  // 프로퍼티를 변경해도 속성이 갱신되지 않음 
  input.value = 'newValue';
  alert(input.getAttribute('value')); // text (갱신 안됨!)
*/!*
</script>
```

위 예시에선 다음을 확인할 수 있습니다.
- 속성 `value`를 수정하면 프로퍼티도 수정됩니다.
- 하지만 프로퍼티를 수정해도 속성은 수정되지 않습니다.

이런 '기능'은 유용하게 사용될 수도 있습니다. 유저의 어떤 행동 때문에 `value`가 수정되었는데 수정 전의 '원래' 값으로 복구하고 싶은 경우, 속성에 저장된 값을 가지고 오면 되기 때문입니다.

## DOM 프로퍼티 값의 타입

DOM 프로퍼티는 항상 문자열이 아닙니다. 체크 박스에 사용되는 `input.checked` 프로퍼티의 경우 불린 값을 가집니다.

```html run
<input id="input" type="checkbox" checked> checkbox

<script>
  alert(input.getAttribute('checked')); // 속성 값: 빈 문자열
  alert(input.checked); // 프로퍼티 값: true
</script>
```

몇 가지 다른 예를 살펴봅시다. `style` 속성의 경우 문자열이지만, `style` 프로퍼티는 객체입니다.

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

대부분의 프로퍼티의 값은 문자열입니다.

아주 드물긴 하지만, DOM 프로퍼티 값이 문자열이더라도 속성값과 다른 경우도 있습니다. `href` 속성이 상대 URL이나 `#hash`이더라도 `href` DOM 프로퍼티엔 항상 URL *전체* 가 저장되는 경우가 대표적인 예입니다.

예시:

```html height=30 run
<a id="a" href="#hello">link</a>
<script>
  // 속성
  alert(a.getAttribute('href')); // #hello

  // 프로퍼티
  alert(a.href ); // 실행되는 사이트 주소에 따라 http://site.com/page#hello 형태로 값이 저장됨
</script>
```

HTML에 내에 명시된 `href` 속성의 값을 정확하게 얻고 싶다면 `getAttribute`을 사용하면 됩니다.


## 비표준 속성, dataset

HTML을 작성할 때 우리는 대부분 표준 속성을 사용합니다. 하지만 표준이 아닌 속성도 존재합니다. 이런 비표준이 유용한 지 아닌지, 그리고 어떤 경우에 비표준 속성을 사용해야 하는지 알아봅시다.

비표준 속성은 사용자가 직접 지정한 데이터를 HTML에서 자바스크립트로 넘기고 싶은 경우나 자바스크립트를 사용해 조작할 HTML 요소를 표시하기 위해 사용할 수 있습니다. 

예시:

```html run
<!-- 이름(name) 정보를 보여주는 div라고 표시 -->
<div *!*show-info="name"*/!*></div>
<!-- 나이(age) 정보를 보여주는 div라고 표시 -->
<div *!*show-info="age"*/!*></div>

<script>
  // 표시한 요소를 찾고, 그 자리에 원하는 정보를 보여주는 코드
  let user = {
    name: "Pete",
    age: 25
  };

  for(let div of document.querySelectorAll('[show-info]')) {
    // 원하는 정보를 필드 값에 입력해 줌
    let field = div.getAttribute('show-info');
    div.innerHTML = user[field]; // Pete가 'name'에, 25가 'age'에 삽입됨
  }
</script>
```

비표준 속성은 요소에 스타일을 적용할 때 사용되기도 합니다.

아래 예시에선 주문 상태(order state)를 나타내는 커스텀 속성 `order-state`를 사용해 주문 상태에 따라 스타일을 변경합니다.

```html run
<style>
  /* 스타일이 커스텀 속성 'order-state'에 따라 변합니다. */
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

이렇게 커스텀 속성을 사용하는 게 `.order-state-new`, `.order-state-pending`, `order-state-canceled`같은 클래스를 사용하는 것보다 왜 선호될까요?

이유는 속성은 클래스보다 다루기 편리하다는 점 때문입니다. 속성의 상태는 아래와 같이 쉽게 변경할 수 있습니다.

```js
// 새 클래스를 추가하거나 지우는 것보다 더 쉽게 상태(state)를 바꿀 수 있습니다
div.setAttribute('order-state', 'canceled');
```

물론 커스텀 속성에도 문제가 발생할 수 있습니다. 비표준 속성을 사용해 코드를 작성했는데 나중에 그 속성이 표준으로 등록되게 되면 문제가 발생합니다. HTML은 살아있는 언어이기 때문에 개발자들의 요구를 반영하기 위해 지속해서 발전합니다. 따라서 이런 경우 예기치 못한 부작용이 발생할 수 있습니다.

이런 충돌 상황을 방지하기 위한 속성인 [data-*](https://html.spec.whatwg.org/#embedding-custom-non-visible-data-with-the-data-*-attributes) 가 있습니다.

**'data-'로 시작하는 속성 전체는 개발자가 용도에 맞게 사용하도록 별도로 예약됩니다. `dataset` 프로퍼티를 사용하면 이 속성에 접근할 수 있습니다.**

요소 `elem`에 이름이 `"data-about"`인 속성이 있다면 `elem.dataset.about`을 사용해 그 값을 얻을 수 있죠.

예시:

```html run
<body data-about="Elephants">
<script>
  alert(document.body.dataset.about); // Elephants
</script>
```

`data-order-state` 같이 여러 단어로 구성된 속성은 카멜 표기법(camel-cased)을 사용해 `dataset.orderState`으로 변환됩니다.

이런 특징을 사용해 주문 상태에 관한 예시를 다시 작성하면 다음과 같습니다.

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
  // 읽기
  alert(order.dataset.orderState); // new

  // 수정하기
  order.dataset.orderState = "pending"; // (*)
</script>
```

`data-*` 속성은 커스텀 데이터를 안전하고 유효하게 전달해줍니다.

`data-*` 속성을 사용하면 읽기 뿐만 아니라 수정도 가능하다는 점에 유의해주세요. 속성이 수정되면 CSS가 해당 뷰를 자동으로 업데이트해 줍니다. 위 예시에서 `(*)`로 표시한 줄에서 색이 파란색으로 바뀝니다.

## 요약

- 속성 -- HTML 안에 쓰임
- 프로퍼티 -- DOM 객체 안에 쓰임

비교표:

|            | 프로퍼티 | 속성 |
|------------|------------|------------|
|타입|모든 타입 가능, 각 표준 프로퍼티의 타입은 명세서에 설명되어 있음|문자열|
|이름|대·소문자 구분|대·소문자 구분하지 않음|

속성과 함께 쓰이는 메서드:

- `elem.hasAttribute(name)` -- 속성 존재 여부 확인
- `elem.getAttribute(name)` -- 속성값을 가져옴
- `elem.setAttribute(name, value)` -- 속성값을 변경함
- `elem.removeAttribute(name)` -- 속성값을 지움
- `elem.attributes` -- 속성의 컬렉션을 반환함

거의 모든 상황에서 속성보다는 프로퍼티를 사용하는 게 더 낫습니다. 다만 아래 사례같이 정확한 HTML 속성 값이 필요한 경우에는 프로퍼티가 적절치 않으므로 속성을 사용해야 합니다.

- 비표준 속성이 필요한 경우. 다만 속성이 `data-`로 시작하는 경우엔 `dataset`을 사용해야 합니다.
- HTML에 적힌 값 '그대로'를 읽고 싶은 경우. `href` 프로퍼티에 항상 전체 URL이 저장되는 것 같이 DOM 프로퍼티의 값과 속성 값이 다른데, '원본'값을 얻고 싶은 경우엔 속성을 사용해야 합니다.
