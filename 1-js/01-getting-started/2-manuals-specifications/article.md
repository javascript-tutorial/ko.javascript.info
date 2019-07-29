
<<<<<<< HEAD
# 매뉴얼과 명세서

본 *튜토리얼*은 자바스크립트라는 언어를 기초부터 배울 수 있도록 만들어졌습니다. 그런데 어느 정도 자바스크립트가 익숙해지면 튜토리얼 이외의 자료가 필요한 시점이 옵니다.

## 명세서

**ECMA-262 명세서(specification)** 는 자바스크립트와 관련된 가장 심도 있고 상세한 정보를 담고 있는 공식 문서입니다. 이 명세서에서 자바스크립트라는 언어를 정의합니다.

ECMA-262는 그 형식 때문에 이를 처음 접하는 사람이 이해하기가 쉽지 않습니다. 명세서 자체는 자바스크립트에 관한 정보를 얻을 수 있는 가장 신뢰할만한 자료이긴 하지만 이런 점 때문에 일상적인 참고자료로는 적합하지 않죠. 

ECMA-262의 최신 초안은 <https://tc39.es/ecma262/>에서 확인할 수 있습니다.

갓 명세에 등록된 기능이나 "등록되기 바로 직전"의 ("스테이지(stage) 3") 단계에 있는 기능, 제안 목록은 <https://github.com/tc39/proposals>에서 확인할 수 있습니다.   

본 튜토리얼의 [두 번째 대 단원](info:browser-environment)에서 브라우저와 관련된 명세서를 다룰 예정이므로, 만약 브라우저에서 돌아가는 기능을 구현하는 개발자라면 해당 내용을 확인해 보시기 바랍니다. 

## 매뉴얼

- 모질라(Mozilla) 재단이 운영하는 **MDN JavaScript Reference**에선 자바스크립트와 관련된 다양한 예제와 정보를 제공해줍니다. 특정 함수나 메서드에 대한 심도있는 정보를 얻고 싶다면 이 사이트가 제격입니다.

    링크는 다음과 같습니다. <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference>

    위 사이트에 들어가서 원하는 내용을 직접 검색하는 것도 좋지만, 가끔은 검색 엔진을 이용해 내용을 찾는 게 더 나을 때도 있습니다. 구글과 같은 검색 엔진에 "MDN [원하는 용어]"를 검색어로 입력하면 되죠. `parseInt` 함수에 대한 정보를 얻고 싶다면 <https://google.com/search?q=MDN+parseInt> 같이 검색하는 식으로 말이죠.


- 마이크로소프트(Microsoft)가 운영하는 **MSDN**도 자바스크립트(해당 사이트에선 JScript라고 불립니다)와 관련된 광범위한 정보를 제공합니다. 인터넷 익스플로러(Internet Explorer)에 관련된 정보를 찾고 싶다면 <http://msdn.microsoft.com/>에 방문해 보는 것을 추천합니다.

    위에서 소개한 방법처럼 검색어 앞에 "MSDN"을 붙이면 원하는 정보를 쉽게 찾을 수 있습니다. "RegExp MSDN", "RegExp MSDN jscript" 처럼 말이죠.

## 호환성 표

자바스크립트는 끊임없이 발전하는 언어입니다. 새로운 기능이 정기적으로 추가되죠.

브라우저나 자바스크립트 엔진이 내가 사용하려는 기능을 지원하는지 여부를 확인하려면 아래 두 사이트에서 확인해 보는 것을 추천합니다.

- <http://caniuse.com> 에선 브라우저가 특정 기능을 지원하는지 (표 형태로) 확인할 수 있습니다. 암호화 관련 기능인 cryptography를 특정 브라우저에서 사용할 수 있는지 아닌지를 보려면 <http://caniuse.com/#feat=cryptography>를 확인하면 됩니다.
- <https://kangax.github.io/compat-table> 에선 자바스크립트 기능 목록이 있고, 해당 기능을 특정 엔진이 지원하는지 여부를 거대한 표를 통해 보여줍니다.

실제 개발을 하다 보면 위에 언급 드린 자료가 아주 유용할 겁니다. 자바스크립트 관련 정보나 사용하고자 하는 기능을 특정 브라우저가 지원하는지 여부는 아주 중요한 자료이기 때문입니다. 

말씀드린 사이트나 이 페이지를 기억해 놓았다가 특정 기능에 대한 상세한 정보가 필요할 때 방문해 보시길 바랍니다.  
=======
# Manuals and specifications

This book is a *tutorial*. It aims to help you gradually learn the language. But once you're familiar with the basics, you'll need other sources.

## Specification

**The ECMA-262 specification** contains the most in-depth, detailed and formalized information about JavaScript. It defines the language.

But being that formalized, it's difficult to understand at first. So if you need the most trustworthy source of information about the language details, the specification is the right place. But it's not for everyday use.

The latest draft is at <https://tc39.es/ecma262/>.

To read about new bleeding-edge features, including those that are "almost standard" (so-called "stage 3"), see proposals at <https://github.com/tc39/proposals>.

Also, if you're in developing for the browser, then there are other specs covered in the [second part](info:browser-environment) of the tutorial.

## Manuals

- **MDN (Mozilla) JavaScript Reference** is a manual with examples and other information. It's great to get in-depth information about individual language functions, methods etc.

    One can find it at <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference>.

    Although, it's often best to use an internet search instead. Just use "MDN [term]" in the query, e.g. <https://google.com/search?q=MDN+parseInt> to search for `parseInt` function.


- **MSDN** – Microsoft manual with a lot of information, including JavaScript (often referrerd to as JScript). If one needs something specific to Internet Explorer, better go there: <http://msdn.microsoft.com/>.

    Also, we can use an internet search with phrases such as "RegExp MSDN" or "RegExp MSDN jscript".

## Compatibility tables

JavaScript is a developing language, new features get added regularly.

To see their support among browser-based and other engines, see:

- <http://caniuse.com> - per-feature tables of support, e.g. to see which engines support modern cryptography functions: <http://caniuse.com/#feat=cryptography>.
- <https://kangax.github.io/compat-table> - a table with language features and engines that support those or don't support.

All these resources are useful in real-life development, as they contain valuable information about language details, their support etc.

Please remember them (or this page) for the cases when you need in-depth information about a particular feature.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74
