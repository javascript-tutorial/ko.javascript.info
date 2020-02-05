# 스타일과 클래스

자바스크립트를 사용해 어떻게 스타일과 클래스를 다룰 수 있는지 알아보기 전에, 중요한 규칙을 하나 집고 넘어가야 할 것 같습니다. 핵심만 요약했기 때문에 충분할진 모르겠지만 꼭 언급하고 넘어가야 하기 때문입니다.

요소에 스타일을 적용할 수 있는 방법은 두 가지가 있습니다.

1. CSS에 클래스를 만들고, 요소에 `<div class="...">`처럼 클래스 추가하기
2. `<div style="...">`처럼 프로퍼티를 `style`에 바로 써주기

자바스크립트를 사용하면 클래스와 `style` 프로퍼티 둘 다를 수정할 수 있습니다.

두 방법 중 하나를 택하라면 `style` 보다 CSS 클래스를 수정하는 것을 더 우선시해야 합니다. `style`은 클래스를 '다룰 수 없을 때'만 사용해야 합니다.

`style`은 아래와 같이 자바스크립트를 사용해 요소의 좌표를 동적으로 계산하고, 계산한 좌표를 설정해주고자 할 때 사용하면 좋습니다.

```js
let top = /* 복잡한 계산식 */;
let left = /* 복잡한 계산식 */;

elem.style.left = left; // 예시: '123px', 런타임으로 좌표를 계산할 수 있습니다.
elem.style.top = top; // 예시: '456px'
```

텍스트를 빨간색으로 만든다거나 배경에 이미지를 추가하는 등의 작업은 CSS에 관련 스타일을 명시한 클래스를 만들고. 자바스크립트를 사용해 이 클래스를 요소에 추가해 주는 방식이 좋습니다. 이렇게 하면 더 유연성이 확보돼 유지보수가 쉬워집니다.

## className과 classList

스크립트를 사용해 클래스를 변경하는 것은 흔히 일어나는 동작 중 하나입니다.

아주 오래전 자바스크립트엔 `"class"`같은 예약어는 객체의 프로퍼티가 될 수 없다는 제약사항이 하나 있었습니다. 현재는 이런 제약사항이 없지만, 과거엔 `"class"` 프로퍼티를 사용할 수 없었기 때문에 `elem.class`를 사용하는 것 역시 불가능했습니다. 

따라서 클래스를 위한 프로퍼티인 `"className"`가 도입되게 되었습니다. `"class"` 속성에 대응하는 `elem.className`가 도입된 것이죠.

예시:

```html run
<body class="main page">
  <script>
    alert(document.body.className); // main page
  </script>
</body>
```

`elem.className`에 무언가를 대입하면 클래스 문자열 전체가 바뀝니다. 그런데 이렇게 속성값 전체를 바꾸는 게 아니고 클래스 하나만 추가하거나 제거해야 하는 경우가 있습니다.

이럴 때 `elem.classList`라는 프로퍼티를 사용할 수 있습니다.

`elem.classList`엔 클래스 하나를 조작하게 해주는 메서드인 `add/remove/toggle`가 구현되어 있습니다.

예시:

```html run
<body class="main page">
  <script>
*!*
    // 클래스 추가
    document.body.classList.add('article');
*/!*

    alert(document.body.className); // main page article
  </script>
</body>
```

이렇게 클래스 속성값 전체를 바꾸고 싶을 때는 `className`으로, 개별 클래스를 조작하고 싶을 때는 `classList`를 사용하면 됩니다. 필요에 따라 취사선택하면 되죠.

`classList`에 구현된 메서드는 다음과 같습니다.

- `elem.classList.add/remove("class")` -- `class`를 추가하거나 제거 
- `elem.classList.toggle("class")` -- `class`가 존재할 경우 `class`를 제거하고, 그렇지 않은 경우엔 추가
- `elem.classList.contains("class")` -- `class` 존재 여부에 따라 `true/false`를 반환

`classList`는 이터러블이기 때문에 아래 예시와 같이 `for..of`를 사용해 나열하는 것도 가능합니다.

```html run
<body class="main page">
  <script>
    for (let name of document.body.classList) {
      alert(name); // main과 page가 출력됨
    }
  </script>
</body>
```

## 요소의 스타일

`elem.style` 프로퍼티는 `"style"` 속성에 대응되는 객체입니다. `elem.style.width="100px"`는 `style` 속성값을 문자열 `width:100px`로 설정한 것과 같습니다.

여러 단어를 이어서 만든 프로퍼티는 아래와 같이 카멜 케이스로 이름 지을 수 있습니다.

```js no-beautify
background-color  => elem.style.backgroundColor
z-index           => elem.style.zIndex
border-left-width => elem.style.borderLeftWidth
```

예시:

```js run
document.body.style.backgroundColor = prompt('배경은 무슨 색인가요?', 'green');
```

````smart header="브라우저 지정 프로퍼티"
`-moz-border-radius`, `-webkit-border-radius`같이 브라우저에서 미리 지정한 프로퍼티 역시 카멜 케이스를 사용합니다. 대시(-)는 대문자로 해석하면 됩니다.

예시:

```js
button.style.MozBorderRadius = '5px';
button.style.WebkitBorderRadius = '5px';
```
````

## style 프로퍼티 재지정하기

style 프로퍼티에 값을 할당했다가 시간이 지나 이를 제거해야 할 때가 종종 있습니다.

요소를 숨기기 위해 `elem.style.display = "none"`를 적용했다고 가정해봅시다.

시간이 지나 원래 없었던 것처럼 `style.display`를 지우고 싶은 경우가 생길 수 있습니다. 이럴 때 `delete elem.style.display`를 사용해 프로퍼티를 삭제하는 대신 `elem.style.display = ""`같이 빈 문자열을 할당해주어야 합니다.

```js run
// 예시를 실행하면 페이지의 <body>가 깜빡입니다.
document.body.style.display = "none"; // hide

setTimeout(() => document.body.style.display = "", 1000); // 1초 후 다시 <body>의 내용이 복구됩니다.
```

`style.display`에 빈 문자열을 할당하면 브라우저는 마치 처음부터 `style.display` 프로퍼티가 없었던 것처럼 CSS 클래스와 내장 스타일을 페이지에 적용합니다.

````smart header="`style.cssText`로 완전히 다시 쓰기"
보통은 개별 스타일 프로퍼티를 적용할 때 `style.*`를 사용합니다. 그런데 `div.style` 은 객체이고 읽기 전용이기 때문에 `div.style="color: red; width: 100px"`같은 방식으론 전체 스타일을 설정할 수 없습니다.  

문자열을 사용해 전체 스타일을 설정하려면 특별한 프로퍼티인 `style.cssText`를 사용해야 합니다.

```html run
<div id="div">버튼</div>

<script>
  // cssText를 사용하면 'important' 같은 규칙도 설정할 수 있습니다.
  div.style.cssText=`color: red !important;
    background-color: yellow;
    width: 100px;
    text-align: center;
  `;

  alert(div.style.cssText);
</script>
```

`style.cssText`를 사용하면 기존 스타일에 스타일을 추가하는 게 아니라 전체를 교체해버립니다. 이런 단점 때문에 이 프로퍼티를 자주 쓰는 편은 아닙니다. 실수로 잘 사용하고 있는 스타일이 지워진다는 위험이 있기 때문입니다. 그렇지만 새로운 요소에 스타일을 적용할 때는 기존에 존재하는 스타일이 없기 때문에 `style.cssText`를 사용할 수 있습니다.

`style.cssText`말고 `div.setAttribute('style', 'color: red...')`를 사용해 속성을 설정하면 같은 작업을 수행할 수 있습니다.
````

## 단위에 주의하기

자바스크립트를 사용해 스타일의 값을 설정할 때 단위를 붙여주는 걸 잊지 마세요.

`elem.style.top`에 값을 설정할 때 `10px`이 아닌 `10`을 설정하면 제대로 동작하지 않습니다.

```html run height=100
<body>
  <script>
  *!*
    // 동작하지 않음
    document.body.style.margin = 20;
    alert(document.body.style.margin); // '' (값이 제대로 할당되지 않았기 때문에 빈 문자열이 출력됩니다.)
  */!*

    // CSS 단위(px)를 추가하면 제대로 동작합니다.
    document.body.style.margin = '20px';
    alert(document.body.style.margin); // 20px

    alert(document.body.style.marginTop); // 20px
    alert(document.body.style.marginLeft); // 20px
  </script>
</body>
```

참고로 끝부분의 `style.marginLeft`와 `style.marginTop`엔 브라우저가 프로퍼티 `style.margin`를 '분석' 및 추론한 결과가 할당됩니다. 

## getComputedStyle로 계산된 스타일 얻기

지금까지 배운 내용을 응용하면 스타일을 쉽게 수정할 수 있습니다. 그럼 스타일은 어떻게 *읽을 수* 있을까요?

요소의 사이즈(size)와 마진(margin), 색(color)을 알고 싶다면 어떻게 해야 할까요?

**`style` 프로퍼티는 `"style"` 속성의 값에만 유효합니다. CSS 종속(CSS cascade)은 다루지 못합니다.**

이런 특징 때문에 `elem.style`만으로는 CSS 클래스를 통해 받은 값들을 읽을 수 없습니다.

`style` 프로퍼티를 사용해도 마진값을 읽을 수 없다는 것을 직접 확인해봅시다.

```html run height=60 no-beautify
<head>
  <style> body { color: red; margin: 5px } </style>
</head>
<body>

  The red text
  <script>
*!*
    alert(document.body.style.color); // 빈 문자열
    alert(document.body.style.marginTop); // 빈 문자열
*/!*
  </script>
</body>
```

그렇다면 마진을 현재 크기보다 `20px` 더 크게 하려면 어떻게 해야 할까요? 먼저 현재 값을 읽어야 하는데 말이죠.

이를 가능하게 해주는 메서드 `getComputedStyle`이 있습니다.

문법은 다음과 같습니다.

```js
getComputedStyle(element, [pseudo])
```

element
: 값을 읽을 요소

pseudo
: `::before`같이 의사 요소(pseudo-element)가 필요한 경우 명시해줌. 빈 문자열을 넘겨주거나 아무런 값을 입력하지 않은 경우 요소 자체를 의미함

`getComputedStyle`를 호출하면 `elem.style`같이 스타일 정보가 들어 있는 객체가 반환되는데, `elem.style`과는 달리 CSS 클래스 정보도 함께 받을 수 있습니다.

예시:

```html run height=100
<head>
  <style> body { color: red; margin: 5px } </style>
</head>
<body>

  <script>
    let computedStyle = getComputedStyle(document.body);

    // 이제 마진과 색 정보를 얻을 수 있습니다.

    alert( computedStyle.marginTop ); // 5px
    alert( computedStyle.color ); // rgb(255, 0, 0)
  </script>

</body>
```

```smart header="계산 값과 결정 값"
[CSS](https://drafts.csswg.org/cssom/#resolved-values)에는 속성과 관련된 두 가지 개념이 있습니다.

1. *계산 값(computed style value)* -- CSS 규칙과 CSS 상속이 모두 적용된 후의 값을 의미합니다. 값의 형태는 `height:1em`나 `font-size:125%` 같이 생겼습니다.
2. *결정 값(resolved style value) -- 요소에 최종적으로 적용되는 값을 의미합니다. `1em`나 `125%`은 상대 단위를 사용하는 상댓값입니다. 브라우저는 계산 값을 받아 단위를 전환해 `height:20px`나 `font-size:16px`같이 고정 단위를 사용하는 값(절댓값)으로 값을 변환합니다. 기하 관련 프로퍼티의 결정 값에는 `width:50.5px`같이 소수점 단위가 있을 수 있습니다.

`getComputedStyle`은 계산 값을 얻기 위해서 아주 오래전에 만들어진 메서드입니다. 그런데 계산 값보다는 결정 값을 사용하는 게 훨씬 편리하기 때문에 표준이 개정되었습니다.

따라서 지금은 `getComputedStyle`을 호출하면 프로퍼티의 결정 값이 반환됩니다. 기하 프로퍼티의 경우 주로 `px`가 단위로 사용됩니다.
```

````warn header="`getComputedStyle`엔 프로퍼티 전체 이름이 필요합니다."
`getComputedStyle`을 사용할 때는 `paddingLeft`, `marginTop`, `borderTopWidth`같이 프로퍼티 전체 이름을 알고 있어야 합니다. 그렇지 않으면 원하는 값을 얻을 수 없는 경우도 생깁니다.

프로퍼티 `paddingLeft`나 `paddingTop`엔 값이 지정되어있는데 `getComputedStyle(elem).padding`을 사용하면 어떤 값을 얻을 수 있을까요? 아무것도 얻지 못할까요 아니면 값이 설정되어 있는 `paddingLeft`나 `paddingTop`에서 값을 가져올까요? 이런 상황에 적용할만한 표준은 아직 없습니다.

따라서 브라우저마다 동작 방식이 다릅니다. Chrome 같은 몇몇 브라우저는 아래 예시와 같이 `10px`을 출력해주는데 Firefox에서 빈 문자열이 출력됩니다. 

```html run
<style>
  body {
    margin: 10px;
  }
</style>
<script>
  let style = getComputedStyle(document.body);
  alert(style.margin); // Firefox에선 빈 문자열이 출력됩니다.
</script>
```
````

```smart header="Styles applied to `:visited` links are hidden!"
Visited links may be colored using `:visited` CSS pseudoclass.

But `getComputedStyle` does not give access to that color, because otherwise an arbitrary page could find out whether the user visited a link by creating it on the page and checking the styles.

JavaScript may not see the styles applied by `:visited`. And also, there's a limitation in CSS that forbids to apply geometry-changing styles in `:visited`. That's to guarantee that there's no sideway for an evil page to test if a link was visited and hence to break the privacy.
```

## 요약

클래스를 조작하게 해주는 DOM 프로퍼티:

- `className` -- 클래스 전체를 문자열 형태로 반환해주는 프로퍼티로 클래스 전체를 조작할 때 유용합니다.
- `classList` -- 클래스 하나를 조작하게 해주는 메서드입니다. `add/remove/toggle/contains`가 구현된 객체를 반환합니다. 개별 클래스를 조작할 때 유용합니다.

스타일 변경 방법:

- `style` 프로퍼티는 카멜 케이스를 이용해 변경한 스타일이 있는 객체로, 이 객체를 조작하는 것은 `"style"` 속성과 대응하는 개별 프로퍼티를 조작하는 것과 같습니다. `important` 등의 규칙을 어떻게 적용할 수 있는지 알아보려면 [MDN](mdn:api/CSSStyleDeclaration)에서 관련 메서드를 살펴보시기 바랍니다. 

- `style.cssText` 프로퍼티는 `"style"` 속성 전체에 대응하므로 스타일 전체에 대한 문자열이 저장됩니다.

요소에 최종적으로 적용되는 스타일인 스타일 결정 값을 읽는 방법:

- 스타일 정보가 들어 있는 객체를 반환하는 메서드인 `getComputedStyle(elem, [pseudo])`를 사용합니다. 읽기 전용입니다.
