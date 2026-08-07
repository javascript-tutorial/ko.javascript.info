
# 템플릿 요소

내장 요소인  `<template>` 은 HTML 마크업 템플릿의 저장소 역할을 합니다. 브라우저는 템플릿 요소(template element)의 콘텐츠를 무시하고 문법의 유효성만을 검사하지만, 자바스크립트에서 템플릿 요소에 접근하여 다른 요소를 생성하기 위해 사용할 수 있습니다.

이론적으로 어떤 보이지 않는 요소든 HTML 내부에 생성하여 HTML 마크업을 저장해 둘 수 있습니다. 그러면 `<template>`은 무엇이 특별한 걸까요?

우선, 템플릿 요소의 콘텐츠로는 유효한 HTML이라면 무엇이든 들어갈 수 있습니다. 일반적으로는 특정 태그가 감싸고 있어야 하더라도 말이죠.

예를 들어 템플릿 요소 안에는 테이블 행 태그인  `<tr>`을 넣을 수 있습니다.

```html
<template>
  <tr>
    <td>Contents</td>
  </tr>
</template>
```

보통  `<div>` 안에 `<tr>`를 삽입하려고 하면, 브라우저는 유효하지 않은 DOM 구조를 탐지하고 이를 감싸는 `<table>`을 추가하여 '고쳐'줍니다. 의도한 바와 달라지게 되죠. 반면 `<template>`은 내부에 작성한 내용을 그대로 유지해줍니다.

스타일과 스크립트 또한 `<template>` 안에 들어갈 수 있습니다.

```html
<template>
  <style>
    p { font-weight: bold; }
  </style>
  <script>
    alert("Hello");
  </script>
</template>
```

브라우저는 `<template>` 콘텐츠를 '문서에 포함되지 않는 것'으로 인식합니다. 스타일을 적용하지 않고, 스크립트를 실행하지 않으며  `<video autoplay>`도 작동시키지 않죠.

템플릿 요소의 콘텐츠는 문서 내부로 삽입될 때 스타일이 적용되고 스크립트가 실행되는 등 살아있게 됩니다.

## 템플릿 삽입하기

템플릿 요소의 콘텐츠는 `content` 프로퍼티를 통해 특별한 유형의 DOM 노드인 [DocumentFragment](info:modifying-document#document-fragment)로서 사용할 수 있습니다.

템플릿 요소는 한 가지 특별한 특징을 제외하고 다른 DOM 노드처럼 다룰 수 있습니다. 템플릿 요소를 문서 내에 삽입하면 자식이 대신 삽입된다는 특징 말이죠.

예시:

```html run
<template id="tmpl">
  <script>
    alert("Hello");
  </script>
  <div class="message">Hello, world!</div>
</template>

<script>
  let elem = document.createElement('div');

*!*
  // 여러 번 재사용할 수 있도록 템플릿 콘텐츠를 복제합니다.
  elem.append(tmpl.content.cloneNode(true));
*/!*

  document.body.append(elem);
  // 이제 <template>의 스크립트가 실행됩니다.
</script>
```

이전 챕터의 Shadow DOM 예시를 `<template>`을 이용하여 다시 작성해봅시다.

```html run untrusted autorun="no-epub" height=60
<template id="tmpl">
  <style> p { font-weight: bold; } </style>
  <p id="message"></p>
</template>

<div id="elem">Click me</div>

<script>
  elem.onclick = function() {
    elem.attachShadow({mode: 'open'});

*!*
    elem.shadowRoot.append(tmpl.content.cloneNode(true)); // (*)
*/!*

    elem.shadowRoot.getElementById('message').innerHTML = "Hello from the shadows!";
  };
</script>
```

`(*)` 로 표시한 줄에서 `tmpl.content`를 `DocumentFragment` 로서 복제하고 삽입하면, 자식인 `<style>`, `<p>`가 대신 삽입됩니다.

삽입된 템플릿 요소의 자식은 shadow DOM을 구성합니다.

```html
<div id="elem">
  #shadow-root
    <style> p { font-weight: bold; } </style>
    <p id="message"></p>
</div>
```

## 요약

템플릿 요소에 대한 내용을 요약하자면 다음과 같습니다.

- `<template>` 콘텐츠는 문법적으로 유효한 어떤 HTML도 될 수 있습니다.
- `<template>` 콘텐츠는 '문서에 포함되지 않는 것'으로 인식되므로, 문서에 어떠한 영향도 끼치지 않습니다.
- 자바스크립트에서 `template.content`에 접근하여, 콘텐츠를 복제하고 새로운 요소에 재사용할 수 있습니다.

 `<template>` 태그가 특별한 이유는 다음과 같습니다.

- 브라우저는 태그 내부의 HTML 문법을 검사합니다. 스크립트 내에서 템플릿 리터럴을 사용하는 경우와 대조적입니다.
- 하지만 어떤 최상위 HTML 태그도 사용할 수 있고, `<tr>`의 예시처럼 적절한 래퍼 태그가 없는 경우도 허용됩니다.
- 템플릿 요소의 콘텐츠는 문서에 삽입되어야 스크립트가 실행되고 `<video autoplay>`가 작동하는 등, 상호작용할 수 있게 됩니다.

`<template>` 요소는 반복 매커니즘(iteration mechanisms), 데이터 바인딩(data binding) 또는 변수 대체(variable substitutions) 등의 기능을 가지고 있지 않지만 구현하여 사용할 수 있습니다.

