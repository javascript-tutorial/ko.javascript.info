# 문서 수정하기

'생동감 있는' 웹페이지를 만들기 위한 핵심은 DOM 조작에 있습니다.

이번 챕터에선 적시에 요소를 새롭게 생성하는 방법과 페이지에 있는 기존 콘텐츠를 어떻게 수정할 수 있는지 알아보겠습니다.

## 예제: 메시지 보여주기

`alert` 창보다 보기 좋은 메시지 창을 출력해주는 예시를 살펴보겠습니다.

예시:

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

위 예시에선 HTML을 사용해 메시지 창을 만들었습니다. 이번엔 같은 창을 자바스크립트를 사용해 만들어봅시다. 스타일은 HTML이나 외부 CSS 파일에 저장되어 있다고 가정하겠습니다.

## 요소 생성하기

DOM 노드를 만들때 사용하는 메서드는 두 가지입니다.

`document.createElement(tag)`
: 태그 이름(`tag`)을 사용해 새로운 요소 노드를 만듦

    ```js
    let div = document.createElement('div');
    ```

`document.createTextNode(text)`
: 주어진 텍스트(`text`)를 사용해 새로운 *텍스트 노드*를 만듦

    ```js
    let textNode = document.createTextNode('안녕하세요.');
    ```

개발을 할 땐 위 예시(메시지가 들어가는 `div`)처럼 주로 요소 노드를 만들게 됩니다.

### 메시지 생성하기

메시지가 들어갈 `div`는 세 단계로 만들 수 있습니다.

```js
// 1. <div> 요소 만들기
let div = document.createElement('div');

// 2. 만든 요소의 클래스를 'alert'로 설정
div.className = "alert";

// 3. 내용 채워넣기
div.innerHTML = "<strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.";
```

이렇게 세 단계를 거치면 요소가 만들어집니다. 그런데 요소를 만들긴 했지만, 아직 이 요소는 `div`라는 이름을 가진 변수에 불과하기 때문에 페이지엔 나타나지 않습니다.

## 삽입 메서드

`div`가 페이지에 나타나게 하려면 `document` 내 어딘가에 `div`를 넣어줘야 합니다. `document.body`로 참조할 수 있는 `<body>`안 같은 곳에 말이죠.

요소 삽입 메서드 `append`를 사용한 코드 `document.body.append(div)`를 사용해 직접 새롭게 만든 요소 노드를 페이지에 나타나도록 해봅시다.  

전체 코드는 다음과 같습니다.

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
  div.innerHTML = "<strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.";

*!*
  document.body.append(div);
*/!*
</script>
```

여기서는 `document.body`에서 `append`를 호출했지만 다른 요소에도 `append` 메서드를 호출해 요소를 넣을 수 있습니다. `div.append(anotherElement)`를 호출해 `<div>`에 무언가를 추가하는 것처럼 말이죠.

자바스크립트에서 지원하는 노드 삽입 메서드는 다음과 같습니다. 적절한 메서드를 선택하면 직접 삽입 위치를 지정할 수 있습니다.

- `node.append(노드나 문자열)` -- 노드나 문자열을 `node` *끝*에 삽입합니다.
- `node.prepend(노드나 문자열)` -- 노드나 문자열을 `node` *맨 앞*에 삽입합니다.
- `node.before(노드나 문자열)` –-  노드나 문자열을 `node` *이전*에 삽입합니다.
- `node.after(노드나 문자열)` –- 노드나 문자열을 `node` *다음*에 삽입합니다.
- `node.replaceWith(노드나 문자열)` –- `node`를 새로운 노드나 문자열로 대체합니다.

삽입 메서드엔 임의의 노드 목록이나 문자열을 넘겨줄 수 있습니다. 문자열을 넘겨주면 자동으로 텍스트 노드가 만들어집니다.

예시를 살펴봅시다.

스크립트가 실행되면 0, 1, 2에 더하여 새로운 글자들이 화면에 추가됩니다.

```html autorun
<ol id="ol">
  <li>0</li>
  <li>1</li>
  <li>2</li>
</ol>

<script>
  ol.before('before'); // <ol> 앞에 문자열 'before'를 삽입함 
  ol.after('after'); // <ol> 뒤에 문자열 'after를 삽입함

  let liFirst = document.createElement('li');
  liFirst.innerHTML = 'prepend';
  ol.prepend(liFirst); // <ol>의 첫 항목으로 liFirst를 삽입함

  let liLast = document.createElement('li');
  liLast.innerHTML = 'append';
  ol.append(liLast); // <ol>의 마지막 항목으로 liLast를 삽입함
</script>
```

위 예시에서 사용된 각 메서드들의 역할을 그림으로 표현하면 다음과 같습니다.

![](before-prepend-append-after.svg)

최종 결과는 다음과 같아질 겁니다.

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

앞서 언급하긴 했지만, 이 메서드들을 사용하면 '복수'의 노드와 문자열을 한 번에 넣을 수도 있습니다.

문자열과 요소를 한 번에 삽입하는 예시를 살펴봅시다.

```html run
<div id="div"></div>
<script>
  div.before('<p>안녕하세요</p>', document.createElement('hr'));
</script>
```

삽입 메서드에 문자열을 넘겨 텍스트 노드를 만들 땐 인수로 넘긴 문자열이 'HTML'이 아닌 '문자열' 그 형태로 삽입된다는 점에 주의해야 합니다. `<`나 `>`같은 특수문자는 이스케이프 처리됩니다.

따라서 최종 HTML은 다음과 같습니다.

```html run
*!*
&lt;p&gt;안녕하세요&lt;/p&gt;
*/!*
<hr>
<div id="div"></div>
```

삽입 메서드를 사용하면 문자열은 `elem.textContent`를 사용한 것처럼 안전한 방법으로 삽입되는 것이죠.

따라서 노드 삽입 메서드는 DOM 노드나 문자열을 삽입할 때만 사용할 수 있습니다.

그런데 만약 `elem.innerHTML`을 사용한 것처럼 태그가 정상적으로 동작할 수 있게 문자열 형태의 'HTML 그 자체'를 삽입하고 싶다면 어떻게 해야 할까요?

## insertAdjacentHTML/Text/Element

또 다른 다재다능한 메서드 `elem.insertAdjacentHTML(where, html)`를 사용하면 가능합니다.

`elem.insertAdjacentHTML(where, html)`에서 첫 번째 매개변수는 `elem`을 기준으로 하는 상대 위치로, 다음 값 중 하나여야 합니다.

- `'beforebegin'` -- `elem` 바로 앞에 `html`을 삽입합니다.
- `'afterbegin'` -- `elem`의 첫 번째 자식 요소 바로 앞에 `html`을 삽입합니다.
- `'beforeend'` -- `elem`의 마지막 자식 요소 바로 다음에 `html`을 삽입합니다.
- `'afterend'` -- `elem` 바로 다음에 `html`을 삽입합니다.

두 번째 매개변수는 HTML 문자열로, 이 HTML은 이스케이프 처리되지 않고 '그대로' 삽입됩니다.

예시:

```html run
<div id="div"></div>
<script>
  div.insertAdjacentHTML('beforebegin', '<p>안녕하세요.</p>');
  div.insertAdjacentHTML('afterend', '<p>안녕히 가세요.</p>');
</script>
```

최종 HTML은 다음과 같습니다.

```html run
<p>안녕하세요.</p>
<div id="div"></div>
<p>안녕히 가세요.</p>
```

임의의 HTML을 페이지에 삽입할 땐 이 방법을 사용하면 됩니다.

아래는 매개변수에 따라 삽입 위치가 어떻게 변하는지를 표현한 그림입니다.

![](insert-adjacent.svg)

이 그림과 위쪽 그림이 꽤 유사하게 생겼네요. HTML을 삽입한다는 점만 다르고, 삽입 지점은 정확히 같다는 것을 관찰할 수 있습니다.

`elem.insertAdjacentHTML(where, html)`은 두 가지 형제 메서드가 있습니다.

- `elem.insertAdjacentText(where, text)` -- `insertAdjacentHTML`과 문법은 같은데, HTML 대신 `text`를 '문자 그대로' 삽입한다는 점이 다릅니다.
- `elem.insertAdjacentElement(where, elem)` -- 역시 같은 문법인데, 요소를 삽입한다는 점이 다릅니다.

`insertAdjacentText`과 `insertAdjacentElement`는 메서드 구색을 갖추려는 목적으로 만들어졌습니다. 요소나 문자 노드를 삽입할 땐 `append/prepend/before/after`메서드를 사용하면 되므로 실무에선 대부분 `insertAdjacentHTML`을 사용합니다.  요소 삽입 메서드를 사용하면 코드 길이가 줄어들고, 노드나 텍스트 조각을 쉽게 삽입할 수 있습니다.

새롭게 배운 메서드 `insertAdjacentHTML`를 사용해 메시지 창 예시를 다시 작성하면 다음과 같습니다.

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

## 노드 삭제하기

`node.remove()` 사용하면 노드를 삭제할 수 있습니다.

일 초 후 메시지가 사라지게 해봅시다.

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
  div.innerHTML = "<strong>안녕하세요!</strong> 중요 메시지를 확인하셨습니다.";

  document.body.append(div);
*!*
  setTimeout(() => div.remove(), 1000);
*/!*
</script>
```

참고로, 요소 노드를 다른 곳으로 *옮길 때* 기존에 있던 노드를 지울 필요가 없습니다.

**모든 노드 삽입 메서드는 자동으로 기존에 있던 노드를 삭제하고 새로운 곳으로 노드를 옮기기 때문입니다.**

요소 위치를 바꾸는 예시를 살펴봅시다.

```html run height=50
<div id="first">First</div>
<div id="second">Second</div>
<script>
  // remove 메서드를 호출할 필요가 없습니다.
  second.after(first); // id가 second인 노드를 가져오고, 해당 노드의 뒤에 id가 first인 노드를 삽입
</script>
```

## cloneNode로 노드 복제하기

위 예시에서 기존 메시지 창과 유사한 메시지 창을 하나 더 띄워달라는 요구사항이 추가되었다고 가정해봅시다.

'메시지 창을 만들어주는 함수를 하나 만들면 되지 않을까?'라는 생각이 떠오를 겁니다. 그런데 이 방법 말고도 기존에 만들어 놨던 `div`를 *복제*하고 (필요하다면) 안에 있는 텍스트를 수정하는 방법도 가능합니다.

복제하려는 요소가 클 때는 함수를 만드는 대신 복제를 사용하는 방법이 빠르고 간단할 수 있습니다.

- `elem.cloneNode(true)`을 호출하면 `elem`의 '깊은' 복제본이 만들어집니다. 속성 전부와 자손 요소 전부가 복사됩니다. `elem.cloneNode(false)`을 호출하면 후손 노드 복사 없이 `elem`만 복제됩니다.

`cloneNode`를 이용해 메시지 창을 하나 더 띄워봅시다.

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
  let div2 = div.cloneNode(true); // 메시지 창 복제
  div2.querySelector('strong').innerHTML = '안녕히 가세요!'; // 복제한 메시지 창 내용 수정

  div.after(div2); // 복제한 메시지 창을 기존 메시지 창 다음에 보여줌
*/!*
</script>
```

## DocumentFragment [#document-fragment]

`DocumentFragment`는 특별한 DOM 노드 타입으로, 여러 노드로 구성된 그룹을 감싸 다른 곳으로 전달하게 해주는 래퍼(wrapper)처럼 동작합니다.

문서에 있는 다른 노드를 `DocumentFragment`에 추가할 수 있는데, `DocumentFragment`를 문서 어딘가에 삽입하면 `DocumentFragment`는 사라지고 `DocumentFragment`에 추가한 노드만 남습니다.

예시를 살펴봅시다. 아래 함수 `getListContent`는  `<li>` 노드로 구성된 fragment를 만들어 줍니다. 이 fragment를 `<ul>`에 추가해 보겠습니다.

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

`(*)`로 표시한 줄에서 `<ul>`에 `DocumentFragment`를 추가했습니다. 추가한 fragment는 문서에 '녹아들었기' 때문에 최종 결과물은 아래와 같아집니다.

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

`DocumentFragment`를 직접 사용할 일은 흔지 않습니다. 아래 에시처럼 노드가 담긴 배열을 직접 만들어 반환할 수 있기 때문입니다.

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
ul.append(...getListContent()); // append 메서드와 ...(전개 문법)은 궁합이 잘 맞습니다.
*/!*
</script>
```

여기서 `DocumentFragment`를 언급한 이유는 [template](info:template-element) 요소같이 `DocumentFragment`를 기반으로하는 문법이 있기 때문입니다. template 요소는 추후 다루도록 하겠습니다.  

## 구식 삽입·삭제 메서드

[old]

하위 호환성을 유지하기 위해 남아있는 '구식(old school)' DOM 조작 메서드도 있습니다.

아주 오래전에 만들어진 이 메서드들은 요즘에는 잘 사용하지 않습니다. 앞서 배운 모던한 메서드 `append`, `prepend`, `before`, `after`, `remove`, `replaceWith`를 사용하는 것이 좀 더 유연하기 때문입니다.

그럼에도 불구하고 구식 메서드를 소개해드리는 이유는 작성된 지 오래된 스크립트에서 이런 메서드들을 발견할 수 있기 때문입니다.

`parentElem.appendChild(node)`
: `parentElem`의 마지막 자식으로 `node`를 추가함

    아래 예시를 실행하면 새로운 `<li>`가 `<ol>` 마지막에 추가됩니다.

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
: `node`를 `parentElem`안의 `nextSibling`앞에 추가함

    아래 예시를 실행하면 새로운 `<li>`가 두 번째 `<li>` 앞에 추가됩니다.

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
    `newLi`를 첫 번째 항목으로 추가하고 싶다면 아래와 같이 `firstChild`를 사용하면 됩니다.

    ```js
    list.insertBefore(newLi, list.firstChild);
    ```

`parentElem.replaceChild(node, oldChild)`
: `parentElem`의 자식 노드 중 `oldChild`를 `node`로 교체함

`parentElem.removeChild(node)`
: `node`가 `parentElem`의 자식 노드라는 가정하에 `parentElem`에서 `node`를 삭제함

    아래 예시를 실행하면 `<ol>`에서 첫 번째 `<li>`가 사라집니다.

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

이 메서드들은 모두 삽입하거나 삭제한 노드를 반환합니다. `parentElem.appendChild(node)`는 `node`를 반환하죠. 그런데 반환된 값을 사용할 일이 거의 없기 때문에 메서드를 그냥 실행만 하는 편입니다.

## 'document.write'에 대한 첨언

`document.write`는 웹페이지에 뭔가를 더할 때 쓰는 아주 오래된 메서드입니다.

사용법은 다음과 같습니다.

```html run
<p>페이지 어딘가...</p>
*!*
<script>
  document.write('<b>자바스크립트를 사용해 Hello 입력</b>');
</script>
*/!*
<p>끝</p>
```

`document.write(html)`를 호출하면 `html`이 페이지 '그 자리에 즉시' 추가됩니다. `html` 형식의 문자열을 동적으로 만들어 사용할 수 있기 때문에 `document.write(html)`는 꽤나 유연합니다. 날개를 단 새처럼 동적인 웹페이지를 만드는데 이 메서드를 사용할 수 있죠.

`document.write`는 DOM도 없고 그 어떤 표준도 존재하지 않았던 과거에 만들어졌습니다. 표준에 정의된 메서드는 아니지만 아직 다양한 곳에서 쓰이고 있어서 살아남은 것이죠.

근래에 작성된 스크립트에선 이 메서드를 찾기 힘듭니다.

왜냐하면 **`document.write`는 페이지를 불러오는 도중에만 작동하기 때문입니다.**

페이지가 다 로드되고 나서 `document.write`를 호출하면 기존에 있던 문서 내용이 사라집니다.

예시를 살펴봅시다.

```html run
<p>일 초 후, 이 페이지의 내용은 전부 교체됩니다.</p>
*!*
<script>
  // 일초 후 document.write 호출
  // 페이지 로드가 끝난 후이므로 기존 내용이 사라집니다.
  setTimeout(() => document.write('<b>...사라졌습니다.</b>'), 1000);
</script>
*/!*
```

이런 이유 때문에 `document.write`는 지금까지 배운 DOM 메서드와는 달리 '페이지 로드가 다 끝난 후'엔 사용할 수 없습니다.

아주 큰 단점이죠.

장점도 있습니다. 브라우저는 HTML을 '읽는(파싱하는)' 도중에 `document.write(HTML)`를 만나면 텍스트 형식의 HTML을 마치 원래 페이지에 있었던 것 마냥 해석합니다.

중간에 *DOM 조작을 하지 않기 때문에* 속도가 아주 빨라지죠. DOM 구조가 완성되기 전에 페이지에 내용이 삽입되기 때문입니다.

엄청나게 많은 글자를 HTML에 동적으로 추가해야 하는데 아직 페이지를 불러오는 중이고, 속도가 중요한 상황이라면 `document.write`가 유용할 수 있습니다. 하지만 실제 이런 요구 사항들이 한 번에 충족되어야 하는 상황은 흔치 않습니다. `document.write`가 눈에 띈다면 그건 그냥 오래된 스크립트라서 그럴 확률이 높습니다.

## 요약

- 노드 생성 메서드:
    - `document.createElement(tag)` -- 태그 이름을 사용해 새로운 요소를 만듦
    - `document.createTextNode(value)` -- 텍스트 노드를 만듦(잘 쓰이지 않음)
    - `elem.cloneNode(deep)` -- 요소를 복제함. `deep==true`일 경우 모든 자손 요소도 복제됨

- 노드 삽입, 삭제 메서드:
    - `node.append(노드나 문자열)` -- `node` 끝에 노드를 삽입
    - `node.prepend(노드나 문자열)` -- `node` 맨 앞에 노드를 삽입
    - `node.before(노드나 문자열)` –- `node` 이전에 노드를 삽입
    - `node.after(노드나 문자열)` –- `node` 다음에 노드를 삽입
    - `node.replaceWith(노드나 문자열)` –- `node`를 대체
    - `node.remove()` –- `node`를 제거

    문자열을 삽입, 삭제할 땐 문자열을 '그대로' 넣으면 됩니다.

- '구식' 메서드:
    - `parent.appendChild(node)`
    - `parent.insertBefore(node, nextSibling)`
    - `parent.removeChild(node)`
    - `parent.replaceChild(newElem, node)`

    이 메서드들은 전부 `node`를 반환합니다.

- `html`에 HTML을 넣으면 메서드 `elem.insertAdjacentHTML(where, html)`은 `where` 값에 따라 특정 위치에 HTML을 삽입함
    - `"beforebegin"` -- `elem` 바로 앞에 `html`을 삽입
    - `"afterbegin"` -- `elem`의 첫 번째 자식 요소 바로 앞에 `html`을 삽입
    - `"beforeend"` -- `elem`의 마지막 자식 요소 바로 다음에 `html`을 삽입
    - `"afterend"` -- `elem` 바로 다음에 `html`을 삽입

    문자열이나 요소 삽입에 쓰이는 유사 메서드 `elem.insertAdjacentText`와 `elem.insertAdjacentElement`도 있는데, 잘 쓰이지는 않음

- 페이지 로딩이 끝나기 전에 HTML을 삽입해주는 메서드:
    - `document.write(html)`

    문서 로딩이 끝난 상태에서 이 메서드를 호출하면 문서 내용이 지워짐. 오래된 스크립트에서 볼 수 있음
