# 브라우저 환경과 다양한 명세

자바스크립트는 본래 웹 브라우저에서 사용하려고 만들어진 언어입니다. 이후 진화를 거쳐 다양한 사용처와 플랫폼을 지원하는 언어로 변모하였습니다.   

플랫폼은 브라우저, 웹서버, 심지어는 세탁기가 될 수도 있고 그 이외의 *호스트(host)*가 될 수도 있습니다. 각 플랫폼은 그 플랫폼에 특정되는 기능을 제공합니다. 자바스크립트 명세에선 이를 *호스트 환경(host environment)*이라 부릅니다.

호스트환경은 랭귀지 코어(역주: ECMAScript)에 더하여 플랫폼에 특정되는 객체와 함수를 제공합니다. 웹브라우저는 웹페이지를 제어하기 위한 수단을 제공하고, Node.js는 서버사이드 기능을 제공하는 것이 대표적인 예가 될 수 있습니다.

아래 그림은 자바스크립트가 웹브라우저에서 돌아갈 때 사용할 수 있는 기능을 보여줍니다.

![](windowObjects.png)

최상단엔 객체 `window`가 있습니다. 이 객체는 2가지 역할을 합니다:

1. <info:global-object>에서 설명한 바와 같이 자바스크립트 global 객체 구실을 합니다. 
2. "브라우저 창(browser window)"을 대변하는 인터페이스 구실을 하고 브라우저 창을 제어할 수 있는 메서드를 제공합니다.

global 객체로 쓰인 window 객체 예시:

```js run
function sayHi() {
  alert("안녕하세요");
}

// 전역 함수는 윈도우 객체에서 접근 가능
window.sayHi();
```

브라우저 창을 대변하는 window 객체를 사용해 창의 높이를 출력:

```js run
alert(window.innerHeight); // 창 내부 높이
```

window에 관련된 다양한 메서드와 프로퍼티는 추후 살펴보도록 하겠습니다.

## 문서 객체 모델 (Document Object Model, DOM)

`문서`객체는 페이지 콘텐츠에 접근할 수 있도록 해줍니다. 문서객체를 이용하면 페이지 상에 콘텐츠를 만들고 변경할 수도 있습니다.

예:
```js run
// 배경을 붉은색으로 변경하기
document.body.style.background = "red";

// 1초 후 원상태로 복구하기
setTimeout(() => document.body.style.background = "", 1000);
```

`document.body.style`외에도 아주 많은 기능이 있습니다. 이런 다양한 프로퍼티와 메서드는 다음 두 그룹이 정의하고 명세(specification)화하였습니다.

1. [W3C](https://en.wikipedia.org/wiki/World_Wide_Web_Consortium) -- <https://www.w3.org/TR/dom>.
2. [WhatWG](https://en.wikipedia.org/wiki/WHATWG) -- <https://dom.spec.whatwg.org>.

처음엔 두 그룹의 의견이 전혀 일치되지 않아 두 개의 표준이 양립하는 듯 보였습니다. 하지만 시간이 지남에 따라 두 표준이 거의 동일해 졌습니다. 알아차리지 못할 작은 차이를 제외하곤 두 명세는 99% 정도 일치합니다.

개인적으론 WhatWG의 표준<https://dom.spec.whatwg.org>을 선호합니다.

과거엔 표준이랄 것이 전혀 없었습니다. 브라우저(역주: 인터넷 익스플로러, 넷스케이프 네비게이터)개발자들이 각각의 브라우저에서 같은 기능에 대해 각자 다른 집합, 메서드, 프로퍼티를 정의하여 개발하였습니다. 웹 개발자들은 각 브라우저에 맞는 코드를 작성해야만 했습니다. 어둡고 혼란한 시간이었죠. 

지금도 종종 브라우저 호환성에 대응하면서 특정 브라우저에서만 쓰이는 프로퍼티를 쓰는 오래된 코드를 볼 수 있습니다. 이 튜토리얼에선 모던 자바스크립트를 학습할 예정이기 때문에 이런 오래된 것들을 알아야 할 필요가 없습니다. 진짜 알아야 할 경우가 생기기 전까진 말이죠(배워야 할 가능성은 매우 낮습니다).

모든 사람이 표준을 준수하길 바라는 시도하에 DOM 표준이 제안되었습니다. 처음으로 권고된 제안은 "DOM 레벨(Level) 1"이었고, 이어 DOM 레벨 2, DOM 레벨 3이 순차적으로 제안되었습니다. 현재는 DOM 레벨 4까지 제안된 상황입니다. WhatWG 그룹은 이런 버전 네이밍이 복잡하다고 느껴 레벨에 번호를 매기는 방식을 차용ㅎ아지 않고 그냥 "DOM"이라 부르기로 했습니다. 우리도 같은 방식을 따르겠습니다.

```smart header="DOM은 브라우저에서만 쓰이지 않습니다"
DOM 명세는 문서의 구조와 문서를 조작하는데 필요한 객체를 제공합니다. DOM 명세는 브라우저가 아닌 곳에서도 쓰입니다.

HTML 페이지를 다운로드하고 가공하는 서버 사이드 툴도 DOM을 사용합니다. 명세 일부만 지원하지만 말이죠.
```

```smart header="스타일을 위한 CSSOM"
CSS 규칙과 stylesheet은 HTML처럼 구조화되어있지 않습니다. [CSSOM](https://www.w3.org/TR/cssom-1/)은 이것들이 어떻게 객체로 표현되는지, 어떻게 읽고 쓰는지에 대한 별도의 명세입니다.

CSSOM은 문서 때문에 스타일 규칙을 수정해야 할 때 DOM과 함께 쓰입니다. 대개 CSS 규칙은 정적이기 때문에 실무에서 CSSOM은 아주 드물게 사용됩니다. 자바스크립트를 위해 CSS 규칙을 더하거나 빼는 경우는 흔치 않기 때문에 여기선 CSSOM을 다루지 않도록 하겠습니다. 
```

## BOM (part of HTML spec)

브라우저 객체 모델(Browser Object Model, BOM)은 문서 이외의 모든 것을 제어하기 위해 브라우저(호스트 환경)가 제공하는 추가적인 객체입니다.

예:

- [navigator](mdn:api/Window/navigator) 객체는 브라우저와 운영체제에 대한 정보를 얻는 데 사용됩니다. 많은 프로퍼티가 있지만 가장 많이 알려진 프로퍼티는 현재 사용 중인 브라우저를 판단하는 데 쓰이는 `navigator.userAgent`와 브라우저가 실행 중인 운영체제(WIndows/Linux/Mac etc.)를 알아내는 데 쓰이는 `navigator.platform`입니다.  
- [location](mdn:api/Window/location) 객체는 현재 창의 URL 정보를 가지고 올 수 있게 해주고 새로운 URL로 변경(redirect)할 수 있게도 해줍니다.

`location` 객체를 어떻게 사용하는지 알아봅시다:

```js run
alert(location.href); // shows current URL
if (confirm("위키피디아 페이지로 가시겠습니까?")) {
  location.href = "https://wikipedia.org"; // 브라우저가 새로운 페이지로 넘어감(redirect)
}
```

`alert/confirm/prompt`과 같은 함수들 역시 BOM의 기능입니다. 문서와 직접 연결되어 있지 않지만, 사용자와 브라우저 사이의 커뮤니케이션을 도와주는 순수 브라우저 메서드이죠.  


```smart header="HTML 명세"
[HTML 명세](https://html.spec.whatwg.org)의 일부에서 BOM을 다룹니다.

이상하게 들리겠지만, 맞습니다. <https://html.spec.whatwg.org>에서 볼 수 있는 HTML 명세는 태그 속성 등의 "HTML 언어"만 다루지 않습니다. 다양한 객체, 메서드도 다루고 특정 브라우저에 종속되는 DOM 확장도 다룹니다. 넓게 보면 이 모든 것이 HTML에 속합니다.  
```

## 요약

표준에 대하여 이야기하면서 다음 명세들을 알아보았습니다:

DOM 명세
: 문서 구조, 조작, 이벤트를 설명하고, 이곳<https://dom.spec.whatwg.org>에서 볼 수 있습니다.

CSSOM 명세
: 스타일시트와 스타일 규칙, 이것들의 조작, 문서와 함께 어떻게 쓰이는지에 관해 설명하고, 이곳<https://www.w3.org/TR/cssom-1/>에서 볼 수 있습니다.

HTML 명세
: 태그와 같은 HTML 언어,`setTimeout`, `alert`, `location`등의 다양한 브라우저 기능을 정의한 BOM(browser object model)에 대해 설명하고, 이곳<https://html.spec.whatwg.org>에서 볼 수 있습니다. DOM 명세에 추가적인 프로퍼티와 메서드더해 확장했습니다.

UI에서 문서가 가장 핵심역할을 하므로 DOM에 대해 배워보겠습니다.

위의 명세 링크에서 봤듯이 배워야 할 것이 너무 많기 때문에 모든 것을 다루고 외우는 것은 불가능합니다.

만약 어떤 프로퍼티나 메서드에 관한 문서를 읽고 싶다면 모질라(Mozilla)의 매뉴얼<https://developer.mozilla.org/en-US/search>이 좋습니다. 하지만 이것보다 관련 명세를 찾아보는걸 추천해 드립니다. 복길고 복잡하지만 기초 지식을 탄탄하게 다지도록 해 줄것입니다. 