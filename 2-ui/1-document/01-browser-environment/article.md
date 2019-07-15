# 브라우저 환경과 다양한 명세

자바스크립트는 본래 웹 브라우저에서 사용하려고 만들어진 언어입니다. 이후 진화를 거쳐 다양한 사용처와 플랫폼을 지원하는 언어로 변모하였습니다.   

자바스크립트는 다양한 플랫폼에서 돌아갑니다. 브라우저, 웹서버, 심지어는 세탁기에서도 돌아가고, 그 이외의 *호스트(host)* 에서도 구동이 가능합니다. 각 플랫폼은 해당 플랫폼에 특정되는 기능을 제공합니다. 자바스크립트 명세에선 이를 *호스트 환경(host environment)* 이라 부릅니다.

호스트 환경은 랭귀지 코어(ECMAScript)에 더하여 플랫폼에 특정되는 객체와 함수를 제공합니다. 웹브라우저는 웹페이지를 제어하기 위한 수단을 제공하고, Node.js는 서버 사이드 기능을 제공해주죠.

아래는 호스트 환경이 웹 브라우저일 때 사용할 수 있는 기능을 개괄적으로 보여주는 그림입니다.

![](windowObjects.png)

최상단엔 `window` 객체가 있습니다. 이 객체는 2가지 역할을 합니다.

1. <info:global-object>에서 설명한 바와 같이, 자바스크립트 코드의 전역 객체입니다. 
2. "브라우저 창(browser window)"을 대변하고, 이를 제어할 수 있는 메서드를 제공합니다.

아래 예시는 `window` 객체를 전역 객체로 사용하고 있습니다.

```js run
function sayHi() {
  alert("안녕하세요");
}

// 전역 함수는 window 객체의 프로퍼티로 접근 가능
window.sayHi();
```

아래 예시에선 `window` 객체가 브라우저 창을 대변하고 있으며, 이를 이용해 창의 높이를 출력합니다.

```js run
alert(window.innerHeight); // 창 내부 높이
```

`window` 객체에 관련된 다양한 메서드와 프로퍼티는 추후 자세히 살펴보도록 하겠습니다.

<<<<<<< HEAD
## 문서 객체 모델
=======
## DOM (Document Object Model)
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

`문서` 객체(Document Object)를 이용하면 페이지의 콘텐츠에 접근할 수 있습니다. 페이지 상에 콘텐츠를 생성하고 변경하는 게 가능하죠.

예시:
```js run
// 배경을 붉은색으로 변경하기
document.body.style.background = "red";

// 1초 후 원상태로 복구하기
setTimeout(() => document.body.style.background = "", 1000);
```

<<<<<<< HEAD
문서 객체는 예시에서 소개한 `document.body.style` 외에도 수 많은 기능을 제공합니다. 문서 객체의 프로퍼티와 메서드에 대한 설명은 두 그룹이 만든 명세(specification)에서 찾을 수 있습니다.

1. [W3C](https://en.wikipedia.org/wiki/World_Wide_Web_Consortium) -- <https://www.w3.org/TR/dom>.
2. [WhatWG](https://en.wikipedia.org/wiki/WHATWG) -- <https://dom.spec.whatwg.org>.

처음엔 두 그룹의 의견이 일치하지 않아, 표준이 양립하곤 했습니다. 하지만 시간이 지나면서 합의가 진행되고, 두 표준이 거의 동일하게 바뀌었습니다. 알아차리지 못할 작은 차이를 제외하곤 두 명세는 99% 정도 일치합니다.

필자는 WhatWG의 표준<https://dom.spec.whatwg.org>을 선호합니다.

표준이라고 부를만한 것이 전혀 없던 시절은 암흑기였습니다. 브라우저 개발자들은 각 제품만의 집합, 메서드, 프로퍼티를 정의하여 브라우저를 개발했습니다. 같은 기능이더라도 제품마다 메서드 프로퍼티 등이 상이해서 웹 개발자들은 각 브라우저에 대응하는 코드를 따로 작성해야만 했습니다.

지금도 종종 오래된 코드에선 특정 브라우저에서만 쓰이는 프로퍼티가 사용되는 걸 발견할 수 있습니다. 브라우저 호환성 문제를 피하기 위해서죠. 이 튜토리얼에선 모던 자바스크립트를 학습할 예정이기 때문에 이런 오래된 것들을 알아야 할 필요는 없습니다. 진짜 알아야 할 경우가 생기기 전까진 말이죠.

문서 객체 모델(Document Object Model, DOM) 표준은 이런 암흑기를 타개하고 사람들을 한데로 모으기 위해 등장했습니다. W3C는 최초 표준인 "DOM 레벨(Level) 1"을 제안한 이후 DOM 레벨 2, DOM 레벨 3을 순차적으로 제안하였고, 현재는 DOM 레벨 4까지 표준이 나온 상황입니다. WhatWG 그룹은 이런 버저닝 방식에 피로를 느껴, 레벨마다 번호를 매기지 않고 그냥 "DOM" 표준이라 부르고 있습니다. 이 튜토리얼에서는 WhatWG 그룹의 방식을 따르겠습니다.
=======
Here we used `document.body.style`, but there's much, much more. Properties and methods are described in the specification:

- **DOM Living Standard** at <https://dom.spec.whatwg.org>
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

```smart header="DOM은 브라우저에서만 쓰이지 않습니다."
DOM 명세엔 문서의 구조와 문서를 조작하는데 필요한 객체가 명시되어 있습니다. 이것들은 브라우저 이외의 환경에서도 쓰입니다.

서버 사이드 툴이 DOM과 관련된 명세 기능을 전부 지원하진 않지만, HTML 페이지를 다운로드하고 가공할 때 DOM을 사용할 수 있습니다.
```

```smart header="스타일을 위한 CSSOM"
CSS와 스타일시트(stylesheet)에 관한 규칙은 HTML처럼 잘 정리된 편은 아닙니다. 이들은 별도의 명세인 [CSSOM(CSS 객체 모델)](https://www.w3.org/TR/cssom-1/) 에서 관리되고 있는데, 객체로의 표현 방법, 객체를 읽고 쓰는 방법 등에 대한 내용이 이 명세에 담겨 있습니다.

CSSOM은 자바스크립트로 문서의 스타일 규칙을 수정해야 할 때 사용합니다. CSS 규칙은 대개 잘 변하지 않기 때문에 실무에서 CSSOM를 자주 접하진 않을 겁니다. 자바스크립트를 위해 CSS 규칙을 추가하거나 빼는 경우도 흔치 않기 때문에 이 튜토리얼에선 CSSOM을 다루지 않고 넘어가도록 하겠습니다. 
```

<<<<<<< HEAD
## 브라우저 객체 모델
=======
## BOM (Browser object model)
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

브라우저 객체 모델(Browser Object Model, BOM)은 HTML 명세의 일부로, 문서 이외의 모든 것을 제어하기 위해 브라우저(호스트 환경)가 제공하는 추가적인 객체입니다.

예시:

- [navigator](mdn:api/Window/navigator) 객체를 이용하면 브라우저와 운영체제에 대한 정보를 얻을 수 있습니다. 이 객체엔 많은 프로퍼티가 있지만, 가장 많이 알려진 프로퍼티는 현재 사용 중인 브라우저를 판단하는 데 쓰이는 `navigator.userAgent`와 브라우저가 실행 중인 운영체제(Windows, Linux, Mac 등)를 알아내는 데 쓰이는 `navigator.platform`입니다.  
- [location](mdn:api/Window/location) 객체는 현재 창의 URL 정보를 제공합니다. 또한 새로운 URL로 변경(redirect)할 수 있는 기능을 제공합니다.

예제를 통해 `location` 객체의 용례를 살펴봅시다.

```js run
alert(location.href); // 현재 URL을 보여줌
if (confirm("위키피디아 페이지로 가시겠습니까?")) {
  location.href = "https://wikipedia.org"; // 새로운 페이지로 넘어감
}
```

메서드 `alert/confirm/prompt` 역시 BOM의 일부입니다. 문서와 직접 연결되어 있지 않지만, 사용자와 브라우저 사이의 커뮤니케이션을 도와주는 순수 브라우저 메서드이죠.  

<<<<<<< HEAD

```smart header="HTML 명세"
BOM은 [HTML 명세](https://html.spec.whatwg.org)에 속합니다.

이상하게 들리겠지만, 맞습니다. <https://html.spec.whatwg.org>에서 볼 수 있는 HTML 명세는 태그(tag)나 속성(attribute) 같은 "HTML 언어"만 다루지 않습니다. 다양한 객체와 메서드, 특정 브라우저에 종속되는 DOM 확장도 다룹니다. 넓게 보면 이 모든 것이 HTML에 속하기 때문입니다.
```
=======
BOM is the part of the general [HTML specification](https://html.spec.whatwg.org).

Yes, you heard that right. The HTML spec at <https://html.spec.whatwg.org> is not only about the "HTML language" (tags, attributes), but also covers a bunch of objects, methods and browser-specific DOM extensions. That's "HTML in broad terms". Also, some parts have additional specs listed at <https://spec.whatwg.org>.
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

## 요약

표준에 대하여 이야기하면서 다음 명세들을 알아보았습니다.

DOM 명세
: 문서 구조, 조작, 이벤트를 설명하고, <https://dom.spec.whatwg.org>에서 볼 수 있습니다.

CSSOM 명세
: CSS와 스타일시트에 대한 규칙, 자바스크립트로 문서 스타일을 조작하는 방법에 대해 설명하고, <https://www.w3.org/TR/cssom-1/>에서 볼 수 있습니다.

HTML 명세
: 태그와 같은 HTML 언어, `setTimeout`, `alert`, `location` 등의 다양한 브라우저 기능을 정의한 BOM(browser object model)에 관해 설명하고, <https://html.spec.whatwg.org>에서 볼 수 있습니다. DOM 명세에 추가적인 프로퍼티와 메서드를 더해 확장한 명세입니다.

<<<<<<< HEAD
문서는 UI(User Interface)에서 가장 핵심적인 역할을 합니다. 그러므로 지금부턴 DOM에 대해 배워보도록 하겠습니다.

위에 소개된 명세 링크를 들어가면, 배워야 할 것이 너무 많다는 걸 금방 알 수 있습니다. 모든 것을 배우고 외우는 것은 불가능합니다.

만약 특정 프로퍼티나 메서드에 관한 정보를 찾고 싶다면 모질라(Mozilla)에서 제공하는 매뉴얼<https://developer.mozilla.org/en-US/search>을 참고하는 게 좋습니다. 하지만 이 매뉴얼에 더해 관련 명세를 함께 읽는 걸 추천합니다. 길고 복잡하겠지만, 명세를 함께 찾는 습관을 들이면 기초 지식을 탄탄하게 다질 수 있습니다.
=======
Additionally, some classes are described separately at <https://spec.whatwg.org/>.

Please note these links, as there's so much stuff to learn it's impossible to cover and remember everything.

When you'd like to read about a property or a method, the Mozilla manual at <https://developer.mozilla.org/en-US/search> is also a nice resource, but the corresponding spec may be better: it's more complex and longer to read, but will make your fundamental knowledge sound and complete.

To find something, it's often convenient to use an internet search "WHATWG [term]" or "MDN [term]", e.g <https://google.com?q=whatwg+localstorage>, <https://google.com?q=mdn+localstorage>.

Now we'll get down to learning DOM, because the document plays the central role in the UI.
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7
