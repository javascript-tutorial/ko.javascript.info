# getElement*, querySelector*로 요소 검색하기

요소들이 가까이 붙어있다면 앞서 학습한 DOM 탐색 프로퍼티를 사용해 목표 요소에 쉽게 접근할 수 있습니다. 그런데, 요소들이 가까이 붙어있지 않은 경우도 있기 마련입니다. 상대 위치를 이용하지 않으면서 웹 페이지 내에서 원하는 요소 노드에 접근하는 방법은 없는 걸까요?

이번 챕터에선 이를 가능하게 해주는 메서드에 대해 알아보겠습니다.

## document.getElementById 혹은 id를 사용해 요소 검색하기

요소에 `id` 속성이 있으면 위치에 상관없이 메서드 `document.getElementById(id)`를 이용해 접근할 수 있습니다.

예시:

```html run
<div id="elem">
  <div id="elem-content">Element</div>
</div>

<script>
  // 요소 얻기
*!*
  let elem = document.getElementById('elem');
*/!*

  // 배경색 변경하기
  elem.style.background = 'red';
</script>
```

이에 더하여 `id` 속성값을 그대로 딴 전역 변수를 이용해 접근할 수도 있습니다.

```html run
<div id="*!*elem*/!*">
  <div id="*!*elem-content*/!*">Element</div>
</div>

<script>
  // 변수 elem은 id가 'elem'인 요소를 참조합니다.
  elem.style.background = 'red';

  // id가 elem-content인 요소는 중간에 하이픈(-)이 있기 때문에 변수 이름으로 쓸 수 없습니다.
  // 이럴 땐 대괄호(`[...]`)를 사용해서 window['elem-content']로 접근하면 됩니다.
</script>
```

그런데 이렇게 요소 id를 따서 자동으로 선언된 전역변수는 동일한 이름을 가진 변수가 선언되면 무용지물이 됩니다.

```html run untrusted height=0
<div id="elem"></div>

<script>
  let elem = 5; // elem은 더이상 <div id="elem">를 참조하지 않고 5가 됩니다. 

  alert(elem); // 5
</script>
```

```warn header="id를 따서 만들어진 전역변수를 요소 접근 시 사용하지 마세요."
`id`에 대응하는 전역변수는 [명세서](http://www.whatwg.org/specs/web-apps/current-work/#dom-window-nameditem)의 내용을 구현해 만들어진 것으로 표준이긴 하지만 하위 호환성을 위해 남겨둔 동작입니다.

브라우저는 스크립트의 네임스페이스와 DOM의 네임스페이스를 함께 사용할 수 있도록 해서 개발자의 편의를 도모합니다. 그런데 이런 방식은 스크립트가 간단할 땐 괜찮지만, 이름이 충돌할 가능성이 있기 때문에 추천하는 방식은 아닙니다. HTML을 보지 않은 상황에서 코드만 보고 변수의 출처를 알기 힘들다는 단점도 있습니다.

본 튜토리얼에선 간결성을 위해 요소의 출처가 명확한 경우, `id`를 사용해 요소에 직접 접근하는 방법을 사용할 예정입니다.

실무에선 `document.getElementById`를 사용하시길 바랍니다.
```

```smart header="id는 중복되면 안 됩니다."
`id`는 유일무이해야 합니다. 문서 내 요소의 `id` 속성값은 중복되어선 안 됩니다. 

같은 `id`를 가진 요소가 여러 개 있으면 `document.getElementById`같이 `id`를 이용해 요소를 검색하는 메서드의 동작이 예측 불가능해집니다. 검색된 여러 요소 중 어떤 요소를 반환할지 판단하지 못해 임의의 요소가 반환되죠. 문서 내 동일 `id`가 없도록 해 이런 일을 방지하도록 합시다.
```

```warn header="`anyNode.getElementById`가 아닌 `document.getElementById`"
`getElementById`는 `document` 객체를 대상으로 해당 `id`를 가진 요소 노드를 찾아 줍니다. 문서 노드가 아닌 다른 노드엔 호출할 수 없습니다.
```

## querySelectorAll [#querySelectorAll]

`elem.querySelectorAll(css)`은 다재다능한 요소 검색 메서드입니다. 이 메서드는 `elem`의 자식 요소 중 주어진 CSS 선택자에 대응하는 요소 모두를 반환합니다.

아래 예시는 마지막 `<li>`요소 모두를 반환합니다.

```html run
<ul>
  <li>1-1</li>
  <li>1-2</li>
</ul>
<ul>
  <li>2-1</li>
  <li>2-2</li>
</ul>
<script>
*!*
  let elements = document.querySelectorAll('ul > li:last-child');
*/!*

  for (let elem of elements) {
    alert(elem.innerHTML); // "1-2", "2-2"
  }
</script>
```

`querySelectorAll`은 CSS 선택자를 활용할 수 있다는 점에서 아주 유용합니다.

```smart header="가상 클래스도 사용할 수 있습니다."
querySelectorAll에는 `:hover`나 `:active` 같은 CSS 선택자의 가상 클래스(pseudo-class)도 사용할 수 있습니다. `document.querySelectorAll(':hover')`을 사용하면 마우스 포인터가 위에 있는(hover 상태인) 요소 모두를 담은 컬렉션이 반환됩니다. 이때 컬렉션은 DOM 트리 최상단에 위치한 `<html>`부터 가장 하단의 요소 순으로 채워집니다.
```

## querySelector [#querySelector]

`elem.querySelector(css)`는 주어진 CSS 선택자에 대응하는 요소 중 첫 번째 요소를 반환합니다. 

`elem.querySelectorAll(css)[0]`과 동일하죠. `elem.querySelectorAll(css)[0]`은 선택자에 해당하는 *모든* 요소를 검색해 첫 번째 요소만을 반환하고, `elem.querySelector`는 해당하는 요소를 찾으면 검색을 멈춘다는 점에서 차이가 있습니다. `elem.querySelector`가 더 빠른 이유이죠. `querySelector`는 `querySelectorAll`에 비해 코드의 길이가 짧다는 장점도 있습니다.

## matches

지금까지 소개한 모든 메서드는 DOM 검색에 쓰입니다.

[elem.matches(css)](http://dom.spec.whatwg.org/#dom-element-matches)는 DOM을 검색하는 일이 아닌 조금 다른 일을 합니다. 이 메서드는 요소 `elem`이 주어진 CSS 선택자와 일치하는지 여부를 판단해줍니다. 일치한다면 `true`, 아니라면 `false`를 반환하죠.

요소가 담겨있는 배열 등에서 원하는 요소만 걸러내고자 할 때 유용합니다.

예시:

```html run
<a href="http://example.com/file.zip">...</a>
<a href="http://ya.ru">...</a>

<script>
  // document.body.children가 아니더라도 컬렉션이라면 이 메서드를 적용할 수 있습니다.
  for (let elem of document.body.children) {
*!*
    if (elem.matches('a[href$="zip"]')) {
*/!*
      alert("주어진 CSS 선택자와 일치하는 요소: " + elem.href );
    }
  }
</script>
```

## closest

부모 요소, 부모 요소의 부모 요소 등 DOM 트리에서 특정 요소의 상위에 있는 요소들은 *조상(ancestor)* 요소라고 합니다.

메서드 `elem.closest(css)`는 `elem` 자기 자신을 포함하여 CSS 선택자와 일치하는 가장 가까운 조상 요소를 찾을 수 있게 도와줍니다.

`closest`메서드는 해당 요소부터 시작해 DOM 트리를 한 단계씩 거슬러 올라가면서 원하는 요소를 찾습니다. CSS 선택자와 일치하는 요소를 찾으면, 검색을 중단하고 해당 요소를 반환합니다.

예시:

```html run
<h1>목차</h1>

<div class="contents">
  <ul class="book">
    <li class="chapter">1장</li>
    <li class="chapter">2장</li>
  </ul>
</div>

<script>
  let chapter = document.querySelector('.chapter'); // LI

  alert(chapter.closest('.book')); // UL
  alert(chapter.closest('.contents')); // DIV

  alert(chapter.closest('h1')); // null(h1은 li의 조상 요소가 아님)
</script>
```

## getElementsBy*

태그나 클래스 등을 이용해 원하는 노드를 찾아주는 메서드도 있습니다.

`querySelector`를 이용하는 게 더 편리하고 문법도 짧아서, 요즘은 이런 메서드들을 잘 쓰진 않습니다.

튜토리얼의 완성도를 높이고 오래된 스크립트에서 해당 메서드들을 만날 때 당황하지 않으시길 바라면서 이 메서드들을 잠시 언급하도록 하겠습니다.

- `elem.getElementsByTagName(tag)` --  주어진 태그에 해당하는 요소를 찾고, 대응하는 요소를 담은 컬렉션을 반환합니다. 매개변수 `tag`에 `"*"`이 들어가면, '모든 태그'가 검색됩니다.
- `elem.getElementsByClassName(className)` -- class 속성값을 기준으로 요소를 찾고, 대응하는 요소를 담은 컬렉션을 반환합니다.
- `document.getElementsByName(name)` --  아주 드물게 쓰이는 메서드로, 문서 전체를 대상으로 검색을 수행합니다. 검색 기준은 `name` 속성값이고, 이 메서드 역시 검색 결과를 담은 컬렉션을 반환합니다.

예시:
```js
// 문서 내 모든 div를 얻습니다.
let divs = document.getElementsByTagName('div');
```

다음 예시는 표 안의 모든 `input` 태그를 찾습니다.

```html run height=50
<table id="table">
  <tr>
    <td>나이:</td>

    <td>
      <label>
        <input type="radio" name="age" value="young" checked> 18세 미만
      </label>
      <label>
        <input type="radio" name="age" value="mature"> 18세 이상, 60세 미만
      </label>
      <label>
        <input type="radio" name="age" value="senior"> 60세 이상
      </label>
    </td>
  </tr>
</table>

<script>
*!*
  let inputs = table.getElementsByTagName('input');
*/!*

  for (let input of inputs) {
    alert( input.value + ': ' + input.checked );
  }
</script>
```

```warn header="`'s'`를 절대 빠트리지 마세요!"
초보 개발자들은 가끔 `'s'`를 빼먹는 실수를 하곤 합니다. <code>getElement<b>s</b>ByTagName</code>를 써야 하는데 `getElementByTagName`을 입력하곤 하죠.

`getElementById`는 요소 하나만을 반환하기 때문에 `s`가 없습니다. `getElementsByTagName` 등의 메서드는 대응하는 요소를 담은 컬렉션을 반환하기 때문에 메서드 중간에 `"s"`가 들어갑니다.
```

````warn header="요소 하나가 아닌, 컬렉션을 반환합니다!"
초보자들이 자주 저지르는 실수가 하나 더 있습니다.

```js
// 동작하지 않는 코드
document.getElementsByTagName('input').value = 5;
```

input 요소 전체를 담은 *컬렉션*에 5를 할당하는 위 코드는 동작하지 않습니다. 아마도 본래 의도는 컬렉션 내 요소에 값을 할당하는 것이었을 겁니다.

컬렉션을 순회하거나 인덱스를 사용해 요소를 얻고 그 요소에 값을 할당하면 기존 의도대로 동작합니다. 아래와 같이 말이죠.

```js
// (문서에 input 요소가 있다면) 아래 코드는 잘 동작합니다.
document.getElementsByTagName('input')[0].value = 5;
```
````

아래는 클래스 속성의 값이 `article`인 요소를 검색해주는 예시입니다.

```html run height=50
<form name="my-form">
  <div class="article">글</div>
  <div class="long article">내용이 긴 글</div>
</form>

<script>
  // name 속성을 이용해 검색
  let form = document.getElementsByName('my-form')[0];

  // fomr 내에서 클래스 이름을 이용해 검색
  let articles = form.getElementsByClassName('article');
  alert(articles.length); // 2. 클래스 속성값이 'article'인 요소는 2개입니다.
</script>
```

## 살아있는 컬렉션

`'getElementsBy'`로 시작하는 모든 메서드는 *살아있는* 컬렉션을 반환합니다. 문서에 변경이 있을 때마다 컬렉션이 '자동 갱신'되어 최신 상태를 유지합니다.

예시 내엔 스크립트 두 개가 있습니다.

1. 첫 번째 스크립트는 `<div>`에 상응하는 요소를 담은 컬렉션에 대한 참조를 만듭니다. 스크립트가 실행되는 시점에 이 컬렉션의 길이는 `1`입니다.
2. 두 번째 스크립트는 문서에 `<div>`가 하나 더 추가된 이후에 실행됩니다. 따라서 컬렉션의 길이는 `2`가 됩니다. 

```html run
<div>첫 번째 div</div>

<script>
  let divs = document.getElementsByTagName('div');
  alert(divs.length); // 1
</script>

<div>두 번째 div</div>

<script>
*!*
  alert(divs.length); // 2
*/!*
</script>
```

반면, `querySelectorAll`은 *정적인* 컬렉션을 반환합니다. 컬렉션이 한 번 확정되면 더는 늘어나지 않습니다.

`querySelectorAll`을 사용하면 두 스크립트가 동일하게 `1`을 출력합니다.


```html run
<div>첫 번째 div</div>

<script>
  let divs = document.querySelectorAll('div');
  alert(divs.length); // 1
</script>

<div>두 번째 div</div>

<script>
*!*
  alert(divs.length); // 1
*/!*
</script>
```

예시를 통해 두 방식의 차이를 살펴보았습니다. 문서에 새로운 `div`가 추가되어도 `querySelectorAll`이 반환한 컬렉션은 이를 반영하지 못합니다.

## 요약

DOM에서 원하는 노드를 검색하게 해주는 주요 메서드 6가지는 다음과 같습니다.

<table>
<thead>
<tr>
<td>메서드</td>
<td>검색 기준</td>
<td>호출 대상이 요소가 될 수 있는지에 대한 여부</td>
<td>컬렉션 갱신 여부</td>
</tr>
</thead>
<tbody>
<tr>
<td><code>querySelector</code></td>
<td>CSS 선택자</td>
<td>✔</td>
<td>-</td>
</tr>
<tr>
<td><code>querySelectorAll</code></td>
<td>CSS 선택자</td>
<td>✔</td>
<td>-</td>
</tr>
<tr>
<td><code>getElementById</code></td>
<td><code>id</code></td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td><code>getElementsByName</code></td>
<td><code>name</code></td>
<td>-</td>
<td>✔</td>
</tr>
<tr>
<td><code>getElementsByTagName</code></td>
<td>태그나 <code>'*'</code></td>
<td>✔</td>
<td>✔</td>
</tr>
<tr>
<td><code>getElementsByClassName</code></td>
<td>class</td>
<td>✔</td>
<td>✔</td>
</tr>
</tbody>
</table>

아마 실무에선 `querySelector`나 `querySelectorAll`을 가장 많이 사용하실 겁니다. `getElementBy`로 시작하는 메서드는 대게 오래된 스크립트에서 만날 수 있는데, 일부 이 메서드가 꼭 필요한 상황에서 쓰이는 경우도 있습니다.

이 외에 알아두면 좋을 만한 메서드는 아래와 같습니다.

- `elem.matches(css)`는 `elem`이 해당 CSS 선택자와 일치하는지 여부를 검사합니다.
- `elem.closest(css)`는 해당 CSS 선택자와 일치하는 가장 가까운 조상 요소를 탐색합니다. 이때, `elem` 자기 자신도 검색 대상에 포함됩니다.  

위에선 언급하지 않았지만, 노드의 부모-자식 관계를 확인할 수 있도록 도와주는 유용한 메서드 하나를 더 소개해 드리고 마무리하겠습니다.  
- `elemA.contains(elemB)`는 `elemB`가 `elemA`에 속하거나(`elemB`가 `elemA`의 후손인 경우) `elemA==elemB`일 때, 참을 반환합니다.
