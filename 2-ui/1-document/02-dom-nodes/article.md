libs:
  - d3
  - domtree

---

# DOM 트리

HTML의 근간은 태그(tag)입니다.

DOM(문서 객체 모델)에 따르면, 모든 HTML 태그가 객체입니다. 중첩 태그(nested tag)들은 그 태그를 감싸고 있는 태그의 "자식들(children)"이라 불립니다.

태그 내의 문자(text) 역시 객체입니다.

이런 모든 객체는 자바스크립트를 통해 접근할 수 있습니다.

## DOM 예제

아래 문서의 DOM을 탐색해 봅시다.

```html run no-beautify
<!DOCTYPE HTML>
<html>
<head>
  <title>사슴에 관하여</title>
</head>
<body>
  사슴에 관한 진실.
</body>
</html>
```

DOM은 태그의 트리구조로 HTML을 표현합니다. 아래 다이어그램을 통해 이를 확인해 봅시다.

<div class="domtree"></div>

<script>
let node1 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n    "},{"name":"TITLE","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"사슴에 관하여"}]},{"name":"#text","nodeType":3,"content":"\n  "}]},{"name":"#text","nodeType":3,"content":"\n  "},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n  사슴에 관한 진실."}]}]}

drawHtmlTree(node1, 'div.domtree', 690, 320);
</script>

```online
위에서 요소 노드를 클릭하면 그 자식들을 보거나 숨길 수 있습니다.
```

태그는 *요소 노드*(혹은 그냥 요소)라고 불립니다. 중첩 태그는 그 태그를 감싸는 상위 태그의 자식이 됩니다. 이런 규칙에 따라 우리는 요소를 트리 구조로 나타낼 수 있습니다. `<html>`은 요소 트리의 가장 꼭대기에 위치하고, `<head>`와 `<body>`등을 자식으로 갖습니다.

요소 안쪽의 문자는 *텍스트(text) 노드*가 됩니다. 위에서 `#text`로 표시하고 있죠. 텍스트 노드는 오로지 문자열만 담습니다. 자식을 가질 수 없고 트리의 끝에서 잎 노드(leaf node)로만 존재합니다.

위 다이어그램에서 `<title>` 태그는 `"사슴에 관하여"`라는 문자 노드를 자식으로 갖고 있습니다.

텍스트 노드에 있는 특수문자를 눈여겨보세요.

- 새 줄(newline): `↵` (자바스크립트에선 `\n`로 표시)
- 공백(space): `␣`

공백과 새 줄은 문자로 취급됩니다. 그래서 텍스트 노드가 되고, DOM의 일부가 됩니다. 위 HTML에서 `<head>`와 `<title>`사이의 공백은 문자이기 때문에 `#text` 노드가 됩니다(이 노드는 새 줄과 몇 개의 공백만을 포함합니다).

텍스트 노드 생성엔 두 가지 예외가 있습니다.
1. 역사적인 이유로, `<head>` 이전의 공백과 새 줄은 무시됩니다.
2. HTML 명세에서 모든 콘텐츠는 `body` 안쪽에 있어야 한다고 했으므로, `</body>` 뒤에 뭔가를 넣더라도 그 콘텐츠는 자동으로 `body` 안쪽으로 옮겨집니다. 따라서 `</body>` 뒤엔 공백이 있을 수 없습니다.

두 예외를 제외하곤 아주 간단합니다. 문서 내에 공백이 있다면 다른 문자와 마찬가지로 텍스트 노드가 됩니다. 그리고 공백을 지우면 그 노드는 사라집니다. 

공백이 없는 텍스트 노드만으로 문서를 구성하면 아래와 같은 HTML을 만들 수 있습니다.

```html no-beautify
<!DOCTYPE HTML>
<html><head><title>사슴에 관하여</title></head><body>사슴에 관한 진실.</body></html>
```

<div class="domtree"></div>

<script>
let node2 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[{"name":"TITLE","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"사슴에 관하여"}]}]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"사슴에 관한 진실."}]}]}

drawHtmlTree(node2, 'div.domtree', 690, 210);
</script>

```smart header="가장자리 공백이나 중간의 비어있는 텍스트는 개발자 도구에서 보이지 않습니다"
브라우저의 개발자 도구(곧 다룰 예정임)에선 문자 맨 앞이나 끝쪽의 공백과 태그 사이의 새 줄이 만들어내는 비어있는 텍스트 노드를 보여주지 않습니다.

이런 노드들은 주로 HTML의 가시성을 위해 사용되는 것이지, 실제 문서가 어떻게 보이는지엔 (대개) 영향을 끼치지 않기 때문입니다.

이 튜토리얼에서도 단순화를 위해 이런 빈 텍스트 노드를 생략하도록 하겠습니다.
```


## 자동 교정

브라우저는 규칙에 어긋나는 HTML을 DOM 생성과정에서 자동 교정합니다.

가장 최상위 태그는 항상 `<html>`이어야 하는데, 문서에 `<html>` 태그가 없는 경우 문서 최상위에 이를 자동으로 넣어주는 식으로 말이죠. `<body>`도 같은 방식이 적용됩니다.

만약 HTML 파일에 `"안녕하세요."`라는 문장 하나만 저장된 상황이라면, 브라우저가 자동으로 이 문장을 `<html>` 과 `<body>`로 감싸줍니다. 그리고 `<head>`도 더해줘서 아래와 같은 DOM이 만들어집니다.


<div class="domtree"></div>

<script>
let node3 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"안녕하세요"}]}]}

drawHtmlTree(node3, 'div.domtree', 690, 150);
</script>

DOM 생성과정에서 브라우저는 닫는 태그가 없는 경우와 같은 문서 에러도 자동으로 처리해줍니다.  

<<<<<<< HEAD
아래와 같이 닫는 태그가 없는 경우가 있다고 가정해 봅시다.   
=======
Such document with unclosed tags:
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

```html no-beautify
<p>안녕하세요
<li>엄마
<li>그리고
<li>아빠
```

브라우저는 태그를 읽고, 자동으로 빠진 부분을 채워 넣어 주기 때문에 최종 결과물은 정상적인 DOM이 됩니다. 

<div class="domtree"></div>

<script>
let node4 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"P","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"안녕하세요"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"엄마"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"그리고"}]},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"아빠"}]}]}]}

drawHtmlTree(node4, 'div.domtree', 690, 360);
</script>

````warn header="테이블엔 언제나 `<tbody>`가 있습니다."
테이블은 조금 흥미로운 케이스입니다. DOM 명세엔 테이블에 반드시 `<tbody>`가 있어야 한다고 언급되어 있지만, HTML에선 `<tbody>`를 생략하곤 합니다. 이때, 브라우저는 자동으로 DOM에 `<tbody>`를 만들어줍니다.  

아래와 같은 HTML이 있다고 가정해 봅시다.

```html no-beautify
<table id="table"><tr><td>1</td></tr></table>
```

브라우저가 만들어 낸 DOM 구조는 아래와 같습니다.
<div class="domtree"></div>

<script>
let node5 = {"name":"TABLE","nodeType":1,"children":[{"name":"TBODY","nodeType":1,"children":[{"name":"TR","nodeType":1,"children":[{"name":"TD","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"1"}]}]}]}]};

drawHtmlTree(node5,  'div.domtree', 600, 200);
</script>

보이시죠? `<tbody>`가 어디선가 나타났습니다. 테이블을 다룰 땐 위 내용을 상기해 갑자기 나타난 `<tbody>`때문에 놀라지 않도록 합시다.
````

## 기타 노드 타입

페이지에 태그 몇 개와 주석 하나를 추가해보겠습니다.

```html
<!DOCTYPE HTML>
<html>
<body>
  사슴에 관한 진실.
  <ol>
    <li>사슴은 똑똑합니다.</li>
*!*
    <!-- comment -->
*/!*
    <li>그리고 잔꾀를 잘 부리죠!</li>
  </ol>
</body>
</html>
```

<div class="domtree"></div>

<script>
let node6 = {"name":"HTML","nodeType":1,"children":[{"name":"HEAD","nodeType":1,"children":[]},{"name":"BODY","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n  사슴에 관한 진실.\n    "},{"name":"OL","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"\n      "},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"사슴은 똑똑합니다."}]},{"name":"#text","nodeType":3,"content":"\n      "},{"name":"#comment","nodeType":8,"content":"comment"},{"name":"#text","nodeType":3,"content":"\n      "},{"name":"LI","nodeType":1,"children":[{"name":"#text","nodeType":3,"content":"그리고 잔꾀를 잘 부리죠!"}]},{"name":"#text","nodeType":3,"content":"\n    "}]},{"name":"#text","nodeType":3,"content":"\n  \n"}]}]};

drawHtmlTree(node6, 'div.domtree', 690, 500);
</script>

`#comment`로 표시된 새로운 노드 타입, *주석 노드(comment node)*가 생긴 걸 확인할 수 있습니다. 

주석은 어떻게 화면이 출력될지에 대해 영향을 주지 않는데, 왜 DOM에 추가되었는지 의아해할 수도 있습니다. 주석 노드는 HTML에 뭔가 있다면 반드시 DOM 트리에 추가되어야 한다는 규칙 때문에 DOM에 추가된 것입니다.

**주석을 포함한 HTML 안의 모든 것들은 DOM을 구성합니다.**

HTML 문서 제일 처음에 등장하는 `<!DOCTYPE...>` 지시자 역시 DOM 노드를 만듭니다. 이 노드는 DOM 트리의 `<html>` 바로 앞에 위치합니다. 본 튜토리얼에선 이 노드를 다루지 않을 예정이라 다이어그램에도 표시는 하지 않을 것입니다. 하지만 존재하는 노드입니다.

문서 전체를 나타내는 `document` 객체 또한 DOM 노드입니다.

노드는 총 [열두 가지](https://dom.spec.whatwg.org/#node) 종류로 구성되고, 실무에선 주로 다음 4가지 노드를 다룹니다.

1. DOM의 "진입점(entry point)"이 되는 `문서(document)` 노드.
2. HTML 태그에서 만들어지며, DOM 트리를 구성하는 블럭인 요소 노드(element node).
3. 텍스트를 포함하는 텍스트 노드(text node).
4. 화면에 보이지는 않지만, 정보를 기록하고 자바스크립트를 사용해 이 정보를 DOM으로부터 읽을 수 있는 주석(comment) 노드.

## 눈으로 직접 보기

실시간으로 DOM 구조를 보려면 [Live DOM Viewer](http://software.hixie.ch/utilities/js/live-dom-viewer/)를 이용해 보세요. 문서가 바로 DOM으로 바뀌어 출력됩니다.

## 개발자 도구 이용하기

DOM 구조를 볼 수 있는 또 다른 방법으로 브라우저의 개발자 도구(developer tools)가 있습니다. 실제 개발할 때는 이 도구를 주로 사용합니다.

[elks.html](elks.html) 페이지를 열고, 브라우저에서 개발자 도구를 켠 다음 Elements 탭으로 이동해봅시다.

아래와 같은 화면이 보여야 합니다.

![](elks.png)

이제 개발자 도구에서 DOM을 볼 수 있게 되었네요. 요소를 클릭하면 자세한 내용을 볼 수도 있습니다.

개발자 도구를 이용해 DOM 구조를 볼 땐, 생략된 부분이 있다는 점에 유의하시길 바랍니다. 텍스트 노드는 그냥 텍스트로만 표시되고, 띄어쓰기만 있는 빈 텍스트 노드는 나타나지 않습니다. 개발 중엔 대부분 요소 노드만 다루기 때문에 이 점이 문제가 되지는 않지만 말이죠.

좌측 상단의 <span class="devtools" style="background-position:-328px -124px"></span> 버튼을 클릭한 후, 마우스 등의 장비로 웹페이지 상의 노드를 클릭하면, Elements 탭의 해당 노드로 이동하게 되어 노드를 자세히 살펴볼 수 있습니다. 방대한 크기의 HTML을 다룰 때 아주 유용한 기능입니다. 특정 요소가 어디에 있는지 바로 확인할 수 있기 때문입니다.

웹페이지에서 마우스 오른쪽 버튼 클릭 시 나타나는 컨텍스트 메뉴에서 "검사(Inspect)"를 클릭해도 같은 기능을 사용할 수 있습니다.

![](inspect.png)

Elements 탭엔 아래와 같은 하위 탭이 있습니다:
- **Styles** -- 내장 규칙(회색 배경)을 포함하여 현재 선택한 요소에 적용된 CSS 규칙 전체를 보여줍니다. 하단부 박스에 있는 크기(dimension), 마진(margin), 패딩(padding)에 더하여 대부분의 스타일을 이 탭에서 바로 수정해 볼 수 있습니다.
- **Computed** -- 현재 선택한 요소에 적용된 CSS규칙을 프로퍼티를 기준으로 보여줍니다. CSS 상속 등 해당 규칙의 원천을 볼 수 있습니다.
- **Event Listeners** -- DOM 요소에 적용된 이벤트 리스너를 볼 수 있습니다. 자세한 내용은 다음 파트에서 다룰 예정입니다. 
- 기타 등등

각 탭이 무슨 역할을 하는지 알아볼 수 있는 가장 좋은 방법은 직접 클릭해 보고 이리저리 살펴보는 것입니다. 대부분의 값은 바로 수정 가능하므로, 실습을 통해 학습해 보시길 권유 드립니다.

## 콘솔 다루기

개발자 도구를 이용해 DOM을 탐색하다 보면, DOM에 자바스크립트를 적용해 보고 싶어질 때가 생깁니다. 노드를 가져와서 코드로 해당 노드를 수정하고, 브라우저상에서 결과물을 바로 볼 수 있게 말이죠. 이럴 때 쓸 수 있는 몇 가지 팁을 알려드리도록 하겠습니다. 

- Elements 탭에서 첫 번째 `<li>`를 선택하세요.
- `Esc 키`를 누르세요. 그러면 Elements 탭 바로 아래에 콘솔이 뜹니다.

가장 마지막에 선택했던 요소는 `$0`으로, 그 이전에 선택했던 요소는 `$1`으로 접근할 수 있습니다.

예를 들어 `$0.style.background = 'red'`을 콘솔 창에 입력하면 아래와 같이 첫 번째 list 아이템이 붉은색으로 표시되는 걸 볼 수 있습니다.

![](domconsole0.png)

한편, DOM 노드를 참조하는 변수가 있는 경우, `inspect(node)` 명령어를 입력해 해당 노드가 Elements 탭에서 선택되도록 할 수 있습니다.

또는, 아래에서 `document.body`를 콘솔에 입력한 것처럼, 콘솔 창에 직접 요소를 입력하면, 해당 요소를 바로 선택할 수 있습니다.

![](domconsole1.png)

지금까지 소개해 드린 이 팁들은 디버깅 용도입니다. 다음 챕터부턴, 자바스크립트를 이용하여 DOM에 접근하고 수정하는 방법을 배우도록 하겠습니다.  

브라우저의 개발자 도구는 개발을 도와주는 훌륭한 도구입니다. DOM을 탐색하고 새로운 걸 적용한 다음 어떤 변화가 있는지 바로 확인할 수 있게 해주죠.

## 요약

HTML/XML 문서는 브라우저 안에서 DOM 트리로 표현됩니다.

- 태그는 요소 노드가 되고 트리 구조를 형성합니다.
- 텍스트는 텍스트 노드가 됩니다.
- 이 외에 HTML 내의 모든 것은 DOM의 일부분이 됩니다. 주석까지도 말이죠.

개발자 도구를 사용하면 DOM을 검사하고, 바로 수정해 볼 수 있습니다.

지금까진 가장 많이 사용되며, 중요한 기능을 위주로 개발자 도구 사용법에 대해 소개해 드렸습니다. 이 외에 다른 기능들은 크롬 개발자 도구 사용법 문서 사이트, <https://developers.google.com/web/tools/chrome-devtools> 에서 더 상세히 확인할 수 있습니다. 개발자 도구 사용법을 금방 익히려면 이리저리 클릭해보고 메뉴를 직접 열어보아야 합니다. 이런 과정을 통해 도구가 어느 정도 손에 익으면 문서를 정독해 부족한 나머지를 채우도록 합시다.

DOM 노드는 노드 간 이동, 수정 등을 가능하게 해주는 프로퍼티와 메서드를 지원합니다. 다음 챕터에서 이에 대해 다뤄보도록 하겠습니다.