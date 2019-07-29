# 문서 수정하기

"살아있는" 페이지를 만들기 위해선 DOM 조작이 필요합니다.

이번 주제에선 새롭게 요소를 생성하는 방법과 페이지 상에 이미 존재하는 콘텐츠를 어떻게 수정하는지 살펴보도록 하겠습니다.

간단한 예제를 먼저 살펴보고 관련 메서드를 공부해 보겠습니다.

## 예제: 메시지 보여주기

`alert` 창에 근사해 보이게 메시지를 출력해주는 예제를 만들어 봅시다.

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

이 예제는 스크립트 없이 HTML로만 작성되었습니다. 이제 위 예제와 같은 기능을 하는 자바스크립트 코드를 작성해 보도록 하겠습니다. 동적으로 `div`를 생성해서 말이죠(스타일은 HTML 안에 있거나 외부 CSS 파일을 이용한다고 가정하겠습니다).

## 요소 생성하기


DOM 노드를 만드는 데는 두가지 방법이 있습니다:

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

우리가 만들려는 예제는 특정 클래스(alert, alert-success)인 `div`를 만들고 그 안에 메시지를 넣는 것입니다:

```js
let div = document.createElement('div');
div.className = "alert alert-success";
div.innerHTML = "<strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.";
```

이로써 우리가 만들고자 하는 DOM 요소가 준비되었습니다. 지금은 변수선언과 할당만 상태이므로 눈으로 확인할 수는 없습니다. 아직 페이지에 이 변수가 출력되도록 한 건 아니기 때문입니다.

## 메서드 삽입하기

`div`가 브라우저에 나타나게 하려면 이걸 `document` 내 어딘가에 삽입해야 합니다. 예를 들어 `document.body`안에라던가 말이죠.

이럴 땐 `document.body.appendChild(div)`를 사용하면 됩니다.

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
  div.className = "alert alert-success";
  div.innerHTML = "<strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.";

*!*
  document.body.appendChild(div);
*/!*
</script>
```

부모 요소(`parentElem`로 줄여 씀)에 노드를 삽입하는 몇 가지 메서드를 소개하겠습니다.:

`parentElem.appendChild(node)`
: 이 메서드는 `parentElem`의 자식노드 끝에 `node`를 추가해줍니다.

    아래는 `<ol>`의 끝에 새로운 `<li>`를 추가해주는 예제입니다:

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
: 이 메서드는 `node`를 `nextSibling`의 이전 형제로 만들어주고, 이를 `parentElem`에 삽입해줍니다.

    아래는 새로운 list 아이템을 두 번째 `<li>`의 이전 형제로 만들어주는 예제입니다:

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
    `newLi`를 첫 번째 요소로 만들고 싶으면 아래와 같이 작성하면 됩니다.
    
    ```js
    list.insertBefore(newLi, list.firstChild);
    ```

`parentElem.replaceChild(node, oldChild)`
: 이 메서드는 `parentElem`의 자식노드 중 하나인 `oldChild`를 `node`로 교체합니다.

위의 세 메서드는 모두 새로 추가한 노드를 반환합니다. `parentElem.appendChild(node)`는 `node`를 반환하죠. 하지만 대개의 경우에 반환 값을 사용하진 않고 단순히 메서드의 기능만 사용합니다.

위 메서드들은 조금 "구식"입니다: 아주 옛날부터 존재해왔던 메서드여서 작성된 지 오래된 코드에서 만나볼 수 있죠. 유감스럽게도 위 메서드만으로 해결하기 어려운 문제들이 존재합니다.

문자열 형태인 *html*을 삽입하려고 하는 경우가 대표적인 예 중 하나입니다. 또는 어떤 노드가 있을 때 새로운 노드를 기존의 노드 바로 *이전*에 삽입하려고 하면 어떨까요? 어찌어찌하면 구현할 순 있겠지만 이 구식의 메서드들 만으로 구현하려면 코드가 복잡해집니다. 

이런 문제들을 쉽게 해결하기 위해 아래와 같은 삽입 전용 메서드를 사용할 수 있습니다.

### prepend/append/before/after

아래의 메서드들은 삽입을 좀 더 유연하게 할 수 있도록 도와줍니다:

- `node.append(...nodes or strings)` -- 노드나 문자열을 `node` 끝에 삽입해줍니다.
- `node.prepend(...nodes or strings)` -- 노드나 문자열을 `node` 맨 앞에 삽입해줍니다.
- `node.before(...nodes or strings)` –-  노드나 문자열을 `node` 이전에 삽입해줍니다.
- `node.after(...nodes or strings)` –- 노드나 문자열을 `node` 다음에 삽입해줍니다.
- `node.replaceWith(...nodes or strings)` –- `node`를 새로운 노드나 문자열로 대체합니다.

All of them accept a list of DOM nodes and/or text strings. If a string is given it's inserted as a text node.

아래는 위의 메서드를 이용하여 새로운 아이템이나 문자열을 기존 노드의 이전이나 다음에 추가해주는 예시입니다: 

```html autorun
<ol id="ol">
  <li>0</li>
  <li>1</li>
  <li>2</li>
</ol>

<script>
  ol.before('before');
  ol.after('after');

  let prepend = document.createElement('li');
  prepend.innerHTML = 'prepend';
  ol.prepend(prepend);  

  let append = document.createElement('li');
  append.innerHTML = 'append';
  ol.append(append);
</script>
```

위 코드를 간단히 도식화하면 다음과 같습니다:

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

### insertAdjacentHTML/Text/Element

다재다능한 메서드가 여기 있습니다. 바로 `elem.insertAdjacentHTML(where, html)` 입니다.

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
  document.body.insertAdjacentHTML("afterbegin", `<div class="alert alert-success">
    <strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.
  </div>`);
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


## 제거 메서드

노드를 제거할 땐 다음 메서드들을 사용합니다:


`parentElem.removeChild(node)`
: `parentElem`로부터 `node`을 제거(`node`은 자식 노드라고 가정)

`node.remove()`
: `node`를 제거

한눈에 봐도 두 번째 메서드가 더 간결하게 보이네요. 첫 번째 메서드는 역사적인 이유로 아직 남아있습니다.

````smart
요소를 다른 곳으로 *옮기고*싶다면 -- 기존 노드를 지울 필요가 없습니다

**삽입에 관련된 모든 메서드가 자동으로 기존 노드를 지워주기 때문입니다**

요소의 위치를 바꾸는 예를 살펴봅시다:

```html run height=50
<div id="first">First</div>
<div id="second">Second</div>
<script>
  // 요소를 지울 필요가 없습니다
  second.after(first); // #second를 뽑아내 그 다음에 - #first를 집어넣습니다
</script>
```
````

일초 뒤 메시지가 사라지게 해보도록 코드를 짜봅시다:

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
  div.className = "alert alert-success";
  div.innerHTML = "<strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.";

  document.body.append(div);
*!*
  setTimeout(() => div.remove(), 1000);
  // or setTimeout(() => document.body.removeChild(div), 1000);
*/!*
</script>
```

## "document.write"에 대한 조언

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

단점이죠.

<<<<<<< HEAD
로드중인 페이지에서 `document.write`을 호출하면, 뭔가가 페이지에 더해지고, 브라우저는 콘텐츠가 원래 그 자리에 있었던 것처럼 출력해줍니다.
=======
Technically, when `document.write` is called while the browser is reading ("parsing") incoming HTML, and it writes something, the browser consumes it just as if it were initially there, in the HTML text.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

이런 점이 장점으로 작용할 수도 있습니다 -- *DOM 조작이 필요 없기 때문에* 엄청나게 빠릅니다. DOM이 아직 만들어지기 전에 페이지에 직접 텍스트를 삽입하고, 브라우저는 이 텍스트를 DOM이 만들어지는 시점에 넣어주기 때문입니다. 

만약 엄청나게 많은 문자열을 HTML에 동적으로 더해줘야 하고, 아직 페이지가 로딩되기 전 시점이면서 속도가 중요한 상황이라면 이 메서드가 유용할 수 있습니다. 하지만 실제 이런 조건을 한 번에 충족해야 하는 상황이 흔치 않죠. 이런 스크립트가 눈에 띈다면 그건 그냥 오래된 스크립트라서 그런 겁니다.  

## 요약

새로운 노드를 만들어주는 메서드:

- `document.createElement(tag)` --  태그 이름을 가지고 새로운 요소 만들기,
- `document.createTextNode(value)` -- 원하는 텍스트를 가지고 새로운 텍스트 노드 만들기(거의 쓰이지 않음),
- `elem.cloneNode(deep)` -- 요소를 복제함. 매개변수가 true 이면 자손 노드 전체를 복제.

노드의 삽입과 삭제:

- 부모로부터:
  - `parent.appendChild(node)`
  - `parent.insertBefore(node, nextSibling)`
  - `parent.removeChild(node)`
  - `parent.replaceChild(newElem, node)`

  모든 메서드는 `node`를 반환함.

- 노드와 문자열이 주어졌을때 
  - `node.append(...노드 or 문자열)` -- 노드나 문자열을 `node` 끝에 삽입,
  - `node.prepend(...노드 or 문자열)` -- 노드나 문자열을 `node` 맨 앞에 삽입,
  - `node.before(...노드 or 문자열)` –- 노드나 문자열을 `node` 이전에 삽입,
  - `node.after(...노드 or 문자열)` –- 노드나 문자열을 `node` 다음에 삽입,
  - `node.replaceWith(...nodes or strings)` –- `node`를 새로운 노드나 문자열로 대체.
  - `node.remove()` –- remove the `node`.

  문자열은 "문자 그 자체"로 삽입됨.

- HTML이 주어졌을때: `elem.insertAdjacentHTML(where, html)`, where(첫번째 매개변수)에 따라 HTML을 삽입할 위치를 지정:
  - `"beforebegin"` -- `elem` 바로 앞에 `html`을 삽입,
  - `"afterbegin"` -- `elem`의 첫 번째 자식 요소 바로 앞에 `html`을 삽입,
  - `"beforeend"` -- `elem`의 마지막 자식 요소 바로 다음에 `html`을 삽입,
  - `"afterend"` -- `elem` 바로 다음에 `html`을 삽입.

  유사한 메서드인 `elem.insertAdjacentText`와 `elem.insertAdjacentElement`는 문자열과 요소를 삽입해주지만, 거의 쓰이지 않음

- 페이지가 로딩되기 이전에 HTML을 삽입하고 싶으면
  - `document.write(html)`

페이지가 로드되고 난 후에 호출하면 콘텐츠가 전체 페이지를 덮어쓰므로 유의. 오래된 스크립트에서 볼 수 있음.