
# 뮤테이션 옵저버

`MutationObserver`는 DOM 요소를 관찰하다가 변경이 감지되면 콜백을 실행하는 내장 객체입니다.

먼저 문법을 알아본 다음 실제 사례를 보면서 뮤테이션 옵저버가 어디에 유용한지 살펴보겠습니다.

## 문법

`MutationObserver` 사용법은 간단합니다.

먼저 콜백 함수를 넘겨 옵저버를 만듭니다.

```js
let observer = new MutationObserver(callback);
```

그리고 만든 옵저버를 DOM 노드에 붙입니다.

```js
observer.observe(node, config);
```

`config`는 '어떤 종류의 변경에 반응할지'를 나타내는 불린값 옵션이 담긴 객체입니다.
- `childList` -- `node`의 직계 자식에서 일어나는 변경
- `subtree` -- `node`의 모든 자손에서 일어나는 변경
- `attributes` -- `node`의 속성 변경
- `attributeFilter` -- 선택한 속성만 관찰하도록 속성 이름을 담은 배열
- `characterData` -- `node.data`(텍스트 콘텐츠)를 관찰할지 여부

이 외에 다음 옵션도 있습니다.
- `attributeOldValue` -- `true`이면 속성의 이전 값과 새 값을 모두 콜백에 전달하고(아래 참고) 그렇지 않으면 새 값만 전달함(`attributes` 옵션 필요)
- `characterDataOldValue` -- `true`이면 `node.data`의 이전 값과 새 값을 모두 콜백에 전달하고(아래 참고) 그렇지 않으면 새 값만 전달함(`characterData` 옵션 필요)

실제 변경이 생길 때마다 `callback`이 실행됩니다. 이때 콜백 함수의 첫 번째 인수로 [MutationRecord](https://dom.spec.whatwg.org/#mutationrecord) 객체 목록이, 두 번째 인수로 옵저버 자신이 전달됩니다.

[MutationRecord](https://dom.spec.whatwg.org/#mutationrecord) 객체에는 다음과 같은 프로퍼티가 있습니다.

- `type` -- 뮤테이션 타입으로 다음 중 하나
    - `"attributes"`: 속성이 수정됨
    - `"characterData"`: 데이터가 수정됨. 텍스트 노드에 사용됨
    - `"childList"`: 자식 요소가 추가되거나 삭제됨
- `target` -- 변경이 일어난 곳. `"attributes"` 뮤테이션이면 요소, `"characterData"` 뮤테이션이면 텍스트 노드, `"childList"` 뮤테이션이면 요소
- `addedNodes/removedNodes`  -- 추가되거나 삭제된 노드
- `previousSibling/nextSibling` -- 추가되거나 삭제된 노드의 이전·다음 형제 노드
- `attributeName/attributeNamespace` -- 변경된 속성의 이름과 (XML의) 네임스페이스
- `oldValue` -- 이전 값. 속성이나 텍스트가 변경되었고 해당 옵션 `attributeOldValue`/`characterDataOldValue`가 설정된 경우에만 전달됨

예시를 살펴봅시다. 아래 `<div>`에는 `contentEditable` 속성이 있어서 포커스를 준 뒤 내용을 수정할 수 있습니다.

```html run
<div contentEditable id="elem">여기를 클릭해 <b>수정</b>해 보세요</div>

<script>
let observer = new MutationObserver(mutationRecords => {
  console.log(mutationRecords); // 변경 사항이 출력됩니다.
});

// 속성을 제외한 모든 변경을 관찰합니다.
observer.observe(elem, {
  childList: true, // 직계 자식을 관찰함
  subtree: true, // 하위 자손도 관찰함
  characterDataOldValue: true // 이전 데이터도 콜백에 전달함
});
</script>
```

우측 상단 재생 버튼을 눌러 코드를 브라우저에서 실행하고 `<div>`에 포커스를 준 다음 `<b>수정</b>` 안의 텍스트를 바꾸면 `console.log` 때문에 개발자 도구에 뮤테이션 하나가 출력됩니다.

```js
mutationRecords = [{
  type: "characterData",
  oldValue: "수정",
  target: <text node>,
  // 다른 프로퍼티는 비어 있음
}];
```

`<b>수정</b>`을 통째로 지우는 등 더 복잡한 방식으로 수정을 하면 뮤테이션 이벤트에 뮤테이션 레코드가 여러 개 담길 수 있습니다.

```js
mutationRecords = [{
  type: "childList",
  target: <div#elem>,
  removedNodes: [<b>],
  nextSibling: <text node>,
  previousSibling: <text node>,
  // 다른 프로퍼티는 비어 있음
}, {
  type: "characterData",
  target: <text node>,
  // ...뮤테이션의 세부 내용은 브라우저가 이런 삭제를 어떻게 처리하는지에 따라 다릅니다.
  // 인접한 두 텍스트 노드 '여기를 클릭해 '와 '해 보세요'를 하나로 합칠 수도 있고
  // 별개의 텍스트 노드로 남겨둘 수도 있습니다.
}];
```

이처럼 `MutationObserver`를 사용하면 DOM 서브트리에서 일어나는 모든 변경에 반응할 수 있습니다.

## 서드파티 스크립트 통합에 활용하기

뮤테이션 옵저버는 어떤 경우에 유용할까요?

유용한 기능이 들어 있지만 원치 않는 동작도 하는 서드파티 스크립트를 추가해야 하는 상황을 상상해 봅시다. 이 스크립트는 `<div class="ads">원치 않는 광고</div>`같이 광고를 노출합니다.

당연하게도 서드파티 스크립트는 광고를 제거할 수단을 제공하지 않습니다.

이럴 때 `MutationObserver`를 사용하면 원치 않는 요소가 DOM에 나타나는 순간을 감지해 제거할 수 있습니다.

이 외에도 서드파티 스크립트가 문서에 무언가를 추가하는 시점을 감지해서 페이지를 조정하거나 특정 영역의 크기를 동적으로 조절하고 싶은 경우도 있습니다.

이런 작업 역시 `MutationObserver`로 구현할 수 있습니다.

## 아키텍처 관점에서 활용하기

아키텍처 관점에서 `MutationObserver`가 좋은 선택이 되는 경우도 있습니다.

프로그래밍을 다루는 웹사이트를 만들고 있다고 가정해 봅시다. 이런 사이트의 글이나 자료엔 소스 코드 예시가 들어가기 마련입니다.

코드 예시는 HTML 마크업에서 다음과 같은 모습입니다.

```html
...
<pre class="language-javascript"><code>
  // 여기에 코드가 들어갑니다.
  let hello = "world";
</code></pre>
...
```

가독성을 높이는 동시에 보기 좋게 꾸미기 위해 [Prism.js](https://prismjs.com/) 같은 자바스크립트 구문 강조(syntax highlighting) 라이브러리를 사이트에 사용해 본다고 가정하겠습니다. Prism에서 위 예시에 구문 강조를 적용하려면 `Prism.highlightElement(pre)`를 호출합니다. 이 메서드는 `pre` 요소의 내용을 검사해서 색을 입히는 특별한 태그와 스타일을 해당 요소 안에 추가합니다. 지금 보고 있는 이 페이지의 예시 코드와 비슷한 결과물이 만들어지죠.

그렇다면 구문 강조 메서드는 정확히 언제 실행해야 할까요? `DOMContentLoaded` 이벤트에서 실행할 수도 있고 스크립트를 페이지 맨 아래에 넣을 수도 있습니다. DOM이 준비되면 `pre[class*="language"]`에 해당하는 요소를 찾아 `Prism.highlightElement`를 호출하면 됩니다.

```js
// 페이지에 있는 코드 예시를 전부 강조 표시합니다.
document.querySelectorAll('pre[class*="language"]').forEach(elem => Prism.highlightElement(elem));
```

여기까진 문제 될 게 없습니다. HTML에서 코드 예시를 찾아 강조 표시하면 끝이죠.

이제 한 걸음 더 나아가 봅시다. 서버에서 자료를 동적으로 가져와야 한다고 해봅시다. 자료를 가져오는 메서드는 [튜토리얼 뒷부분](info:fetch)에서 다룰 예정이라 지금은 웹 서버에서 HTML로 된 글을 받아와 요청이 있을 때 화면에 표시한다는 점만 알면 됩니다.

```js
let article = /* 서버에서 새 콘텐츠를 가져옴 */
articleElem.innerHTML = article;
```

새로 받아온 `article` HTML엔 코드 예시가 들어 있을 수 있습니다. `Prism.highlightElement`를 호출하지 않으면 이 코드는 강조 표시되지 않습니다.

**그럼 동적으로 불러온 글엔 `Prism.highlightElement`를 어디서, 언제 호출해야 할까요?**

다음처럼 글을 불러오는 코드 뒤에 호출을 덧붙일 수 있을 겁니다.

```js
let article = /* 서버에서 새 콘텐츠를 가져옴 */
articleElem.innerHTML = article;

*!*
let snippets = articleElem.querySelectorAll('pre[class*="language-"]');
snippets.forEach(elem => Prism.highlightElement(elem));
*/!*
```

그런데 글, 퀴즈, 게시판 글처럼 콘텐츠를 불러오는 곳이 코드 곳곳에 많다고 상상해 봅시다. 불러온 콘텐츠 속 코드를 강조 표시하려고 위와 같은 코드를 모든 곳에 붙여야 할까요? 그다지 편리한 방법이 아닙니다.

콘텐츠를 서드파티 모듈이 불러온다면 어떨까요? 예를 들어 다른 사람이 만든 게시판이 콘텐츠를 동적으로 불러오는데 여기에 구문 강조를 적용하고 싶을 수 있습니다. 서드파티 스크립트에 패치를 덧대는 일은 누구도 반기지 않습니다.

다행히 다른 방법이 있습니다.

`MutationObserver`를 사용하면 코드 예시가 페이지에 삽입되는 순간을 자동으로 감지해 강조 표시할 수 있습니다.

이렇게 하면 강조 기능을 한곳에서 처리할 수 있어 통합 작업을 일일이 할 필요가 없어집니다.

### 동적 구문 강조 데모

동작하는 예시를 봅시다.

아래 코드를 실행하면 하위 요소를 관찰하기 시작해서 그곳에 나타나는 코드 예시를 강조 표시합니다.

```js run
let observer = new MutationObserver(mutations => {

  for(let mutation of mutations) {
    // 강조 표시할 새 노드가 있는지 검사합니다.

    for(let node of mutation.addedNodes) {
      // 요소(노드)만 추적하고 다른 노드(예: 텍스트 노드)는 건너뜁니다.
      if (!(node instanceof HTMLElement)) continue;

      // 삽입된 요소가 코드 예시인지 확인합니다.
      if (node.matches('pre[class*="language-"]')) {
        Prism.highlightElement(node);
      }

      // 서브트리 어딘가에 코드 예시가 있을 수 있으니 확인합니다.
      for(let elem of node.querySelectorAll('pre[class*="language-"]')) {
        Prism.highlightElement(elem);
      }
    }
  }

});

let demoElem = document.getElementById('highlight-demo');

observer.observe(demoElem, {childList: true, subtree: true});
```

바로 아래에 HTML 요소가 하나 있고 `innerHTML`을 사용해 이 요소를 동적으로 채우는 자바스크립트가 있습니다.

먼저 위 코드(해당 요소를 관찰함)를 실행한 다음 아래쪽 코드를 실행해 보세요. `MutationObserver`가 코드만 찾아내 강조 표시하는 모습을 볼 수 있습니다.

<p id="highlight-demo" style="border: 1px solid #ddd"><code>id="highlight-demo"</code>가 붙은 데모 요소입니다. 위 코드를 실행해 이 요소를 관찰해 보세요.</p>

아래 코드가 `innerHTML`을 채우면 `MutationObserver`가 반응해 내용을 강조 표시합니다.

```js run
let demoElem = document.getElementById('highlight-demo');

// 코드 예시가 담긴 콘텐츠를 동적으로 삽입합니다.
demoElem.innerHTML = `아래는 코드 예시입니다.
  <pre class="language-javascript"><code> let hello = "world!"; </code></pre>
  <div>예시가 하나 더 있습니다.</div>
  <div>
    <pre class="language-css"><code>.class { margin: 5px; } </code></pre>
  </div>
`;
```

이제 관찰 대상 요소나 `document` 전체에서 일어나는 강조 표시를 `MutationObserver`가 전부 추적할 수 있게 되었습니다. 별다른 신경을 쓰지 않아도 HTML에 코드 예시가 추가되거나 삭제되어도 알아서 강조 표시가 됩니다.

## 기타 메서드

노드 관찰을 중단하는 메서드도 존재합니다.

- `observer.disconnect()` -- 관찰을 중단함

관찰을 중단하는 시점에 옵저버가 아직 처리하지 않은 변경이 남아 있을 수 있습니다. 이럴 땐 다음 메서드를 사용합니다.

- `observer.takeRecords()` -- 처리되지 않은 뮤테이션 레코드 목록을 가져옴. 변경은 일어났지만 콜백이 아직 처리하지 않은 레코드가 대상임

두 메서드는 다음처럼 함께 쓸 수 있습니다.

```js
// 처리되지 않은 뮤테이션 목록을 가져옵니다.
// 최근 일어난 변경 중 미처리분까지 챙기려면
// 관찰을 중단하기 전에 takeRecords를 호출해야 합니다.
let mutationRecords = observer.takeRecords();

// 변경 추적을 중단합니다.
observer.disconnect();
...
```


```smart header="`observer.takeRecords()`가 반환한 레코드는 처리 대기열에서 제거됩니다"
`observer.takeRecords()`가 반환한 레코드에 대해선 콜백이 호출되지 않습니다.
```

```smart header="가비지 컬렉션과의 상호작용"
옵저버는 내부적으로 노드에 대해 약한 참조(weak reference)를 사용합니다. 따라서 노드가 DOM에서 제거되어 도달할 수 없게 되면 가비지 컬렉션의 대상이 됩니다.

DOM 노드가 관찰되고 있다는 사실만으로는 가비지 컬렉션이 막히지 않습니다.
```

## 요약  

`MutationObserver`는 DOM에서 일어나는 변경(속성, 텍스트 콘텐츠, 요소 추가·삭제)에 반응할 수 있습니다.

코드의 다른 부분에서 일어난 변경을 추적할 때는 물론 서드파티 스크립트와 통합할 때도 사용할 수 있습니다.

`MutationObserver`는 어떤 변경이든 추적할 수 있습니다. '무엇을 관찰할지' 정하는 config 옵션은 최적화 용도로, 불필요한 콜백 호출에 자원을 낭비하지 않기 위해 사용합니다.
