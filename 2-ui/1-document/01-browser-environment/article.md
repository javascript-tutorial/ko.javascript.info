# 브라우저 환경과 다양한 명세서

자바스크립트는 본래 웹 브라우저에서 사용하려고 만든 언어입니다. 이후 진화를 거쳐 다양한 사용처와 플랫폼을 지원하는 언어로 변모하였습니다.   

자바스크립트가 돌아가는 플랫폼은 *호스트(host)* 라고 불립니다. 호스트는 브라우저, 웹서버, 심지어는 커피 머신이 될 수도 있습니다. 각 플랫폼은 해당 플랫폼에 특정되는 기능을 제공하는데, 자바스크립트 명세서에선 이를 *호스트 환경(host environment)* 이라고 부릅니다.

호스트 환경은 랭귀지 코어(ECMAScript - 옮긴이)에 더하여 플랫폼에 특정되는 객체와 함수를 제공합니다. 웹브라우저는 웹페이지를 제어하기 위한 수단을 제공하고, Node.js는 서버 사이드 기능을 제공해주죠.

아래 그림은 호스트 환경이 웹 브라우저일 때 사용할 수 있는 기능을 개괄적으로 보여줍니다.

![](windowObjects.svg)

최상단엔 `window`라 불리는 '루트' 객체가 있습니다. `window` 객체는 2가지 역할을 합니다.

1. <info:global-object> 챕터에서 설명한 바와 같이, 자바스크립트 코드의 전역 객체입니다. 
2. '브라우저 창(browser window)'을 대변하고, 이를 제어할 수 있는 메서드를 제공합니다.

아래 예시에선 `window` 객체를 전역 객체로 사용하고 있습니다.

```js run
function sayHi() {
  alert("안녕하세요.");
}

// 전역 함수는 전역 객체(window)의 메서드임
window.sayHi();
```

아래 예시에선 `window` 객체가 브라우저 창을 대변하고 있으며, 이를 이용해 창의 높이를 출력합니다.

```js run
alert(window.innerHeight); // 창 내부(inner window) 높이
```

`window` 객체엔 다양한 메서드와 프로퍼티가 있는데, 추후 자세히 살펴보도록 하겠습니다.

## 문서 객체 모델(DOM)

문서 객체 모델(Document Object Model, DOM)은 웹 페이지 내의 모든 콘텐츠를 객체로 나타내줍니다. 이 객체는 수정 가능합니다.

`document` 객체는 페이지의 기본 '진입점' 역할을 합니다. `document` 객체를 이용해 페이지 내 그 무엇이든 변경할 수 있고, 원하는 것을 만들 수도 있습니다.

예시:
```js run
// 배경을 붉은색으로 변경하기
document.body.style.background = "red";

// 1초 후 원상태로 복구하기
setTimeout(() => document.body.style.background = "", 1000);
```

문서 객체 모델은 예시에서 소개한 `document.body.style` 외에도 수많은 기능을 제공합니다. 관련 프로퍼티와 메서드에 대한 정보는 관련 명세서에서 찾을 수 있습니다.

- WHATWG의 **DOM 살아있는 표준(Living Standard)** -- <https://dom.spec.whatwg.org>

```smart header="DOM은 브라우저만을 위한 모델이 아닙니다."
DOM 명세서엔 문서의 구조와 이를 조작할 수 있는 객체에 대한 설명이 담겨있습니다. 그런데 브라우저가 아닌 곳에서도 DOM을 사용하는 경우가 있습니다. 

HTML 페이지를 다운로드하고 이를 가공해주는 서버 사이드 스크립트에서도 DOM을 사용합니다. 이런 스크립트에선 명세서 일부만을 지원하겠지만요.
```

```smart header="스타일링을 위한 CSSOM"
CSS 규칙과 스타일시트(stylesheet)는 HTML과는 다른 구조를 띱니다. 따라서 CSS 규칙과 스타일시트를 객체로 나타내고 이 객체를 어떻게 읽고 쓸 수 있을지에 대한 설명을 담은 별도의 명세서, [CSS 객체 모델(CSS Object Model, CSSOM)](https://www.w3.org/TR/cssom-1/)이 존재합니다.

CSSOM은 문서에 쓰이는 스타일 규칙을 수정할 때 DOM과 함께 쓰입니다. 그런데 CSS 규칙은 대부분 정적이기 때문에 CSSOM을 실무에서 자주 접하지는 않을 겁니다. 자바스크립트를 이용해 CSS 규칙을 추가 혹은 제거해야 하는 경우는 극히 드물긴 하지만, 이때 CSSOM이 사용됩니다.
```

## 브라우저 객체 모델(BOM)

브라우저 객체 모델(Browser Object Model, BOM)은 문서 이외의 모든 것을 제어하기 위해 브라우저(호스트 환경)가 제공하는 추가 객체를 나타냅니다.

예시:

- [navigator](mdn:api/Window/navigator) 객체는 브라우저와 운영체제에 대한 정보를 제공합니다. 객체엔 다양한 프로퍼티가 있는데, 가장 잘 알려진 프로퍼티는 현재 사용 중인 브라우저 정보를 알려주는 `navigator.userAgent`와 브라우저가 실행 중인 운영체제(Windows, Linux, Mac 등) 정보를 알려주는 `navigator.platform`입니다.
- [location](mdn:api/Window/location) 객체는 현재 URL을 읽을 수 있게 해주고 새로운 URL로 변경(redirect)할 수 있게 해줍니다.

아래 예시는 `location` 객체를 어떻게 활용할 수 있을지 보여줍니다. 

```js run
alert(location.href); // 현재 URL을 보여줌
if (confirm("위키피디아 페이지로 가시겠습니까?")) {
  location.href = "https://wikipedia.org"; // 새로운 페이지로 넘어감
}
```

`alert/confirm/prompt` 역시 BOM의 일부입니다. 문서와 직접 연결되어 있지 않지만, 사용자와 브라우저 사이의 커뮤니케이션을 도와주는 순수 브라우저 메서드이죠.  

```smart header="다양한 명세"
BOM은 [HTML 명세서](https://html.spec.whatwg.org)의 일부입니다.

BOM에 관련된 명세가 따로 있지는 않습니다. <https://html.spec.whatwg.org>에서 볼 수 있는 HTML 명세서는 태그, HTML 속성(attribute) 같은 'HTML' 뿐만 아니라 다양한 객체와 메서드, 브라우저에서만 사용되는 DOM 확장을 다룹니다. 이 모든 것이 HTML 기술에 속하기 때문입니다. HTML 명세서엔 이 외에도 <https://spec.whatwg.org>에 있는 내용도 들어갑니다.
```

## 요약

표준에 대하여 이야기하면서 다음 명세서들을 알아보았습니다.

DOM 명세서
: 문서 구조, 조작, 이벤트에 관한 설명이 담겨있고, <https://dom.spec.whatwg.org>에서 볼 수 있습니다.

CSSOM 명세서
: 스타일시트와 스타일 규칙, 이 둘을 어떻게 조작할 수 있는지, 이 둘과 문서 사이의 관계를 어떻게 조작할 수 있는지에 대한 설명이 담겨있고, <https://www.w3.org/TR/cssom-1/>에서 볼 수 있습니다.

HTML 명세서
: 태그 등의 HTML 언어, `setTimeout`, `alert`, `location` 등의 다양한 브라우저 기능을 정의한 BOM에 대한 설명이 담겨있고, <https://html.spec.whatwg.org>에서 볼 수 있습니다. DOM 명세서에 다양한 프로퍼티와 메서드를 추가해 확장한 명세서입니다.

몇몇 클래스에 대한 설명은 <https://spec.whatwg.org/>에서 확인할 수 있습니다.

배울 게 많지만, 모든 걸 한꺼번에 다루고 기억하기엔 그 양이 너무 많기 때문에 지금까지 소개해 드린 링크를 잘 기록해 놓으시기 바랍니다.

프로퍼티나 메서드에 대한 설명을 읽고 싶을 때 Mozilla 재단의 매뉴얼 <https://developer.mozilla.org/en-US/search>을 찾아보는 것도 좋긴 하지만, 명세서에서 관련 설명을 찾는 게 더 나을 때도 있기 때문입니다. 명세서에 있는 설명은 복잡하고 내용도 더 많긴 하지만 명세서를 읽는 습관을 들이다 보면 기초 지식을 탄탄하게 쌓을 수 있습니다.

검색창에 'WHATWG [용어]' 혹은 'MDN [용어]'로 검색하면 명세서나 MDN문서에서 원하는 내용을 쉽게 찾을 수 있습니다. <https://google.com?q=whatwg+localstorage>, <https://google.com?q=mdn+localstorage> 처럼 말이죠.

자 이제 UI에서 핵심적인 역할을 하는 DOM에 대해 본격적으로 살펴보도록 합시다.
