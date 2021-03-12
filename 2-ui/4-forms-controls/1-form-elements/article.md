# 폼 프로퍼티와 메서드 

`<input>`과 같이 폼(form) 조작에 사용되는 요소에는 특별한 프로퍼티와 이벤트가 많습니다.

이 프로퍼티와 이벤트들을 익히고 나면 폼을 다루기가 훨씬 편리해질 겁니다.

## 폼과 요소 탐색하기

폼은 특수한 컬렉션인 `document.forms`의 구성원입니다.

`document.forms`는 이름과 순서가 있는 '기명 컬렉션(named collection)'입니다. 개발자는 이 이름이나 순서를 사용해 문서 내의 폼에 접근할 수 있습니다.

```js no-beautify
document.forms.my - 이름이 'my'인 폼
document.forms[0] - 문서 내의 첫 번째 폼
```

이름이나 순서를 사용해 원하는 폼을 가져온 다음에는 기명 컬렉션 `form.elements`를 사용해 폼의 요소를 얻을 수 있습니다.

예시:

```html run height=40
<form name="my">
  <input name="one" value="1">
  <input name="two" value="2">
</form>

<script>
  // 폼 얻기
  let form = document.forms.my; // <form name="my"> 요소

  // 요소 얻기
  let elem = form.elements.one; // <input name="one"> 요소

  alert(elem.value); // 1
</script>
```

그런데 개발을 하다 보면 이름이 같은 요소 여러 개를 다뤄야 하는 경우가 생기기도 합니다. 라디오 버튼을 다룰 때 이런 상황이 자주 발생하죠.

이때 `form.elements[name]`은 컬렉션이 된다는 사실을 이용할 수 있습니다. 예시를 살펴봅시다.

```html run height=40
<form>
  <input type="radio" *!*name="age"*/!* value="10">
  <input type="radio" *!*name="age"*/!* value="20">
</form>

<script>
let form = document.forms[0];

let ageElems = form.elements.age;

*!*
alert(ageElems[0]); // [object HTMLInputElement]
*/!*
</script>
```

폼 요소 탐색에 쓰이는 프로퍼티는 태그 구조에 의존하지 않습니다. 폼을 조작하는 데 쓰이는 요소들은 모두 태그 깊이에 상관없이 `form.elements`을 사용해 접근할 수 있습니다.


````smart header="\'하위 폼\'처럼 쓰이는 fieldset"
폼은 하나 이상의 `<fieldset>` 요소를 포함할 수 있습니다. 폼 내부에 있는 fieldset도 폼과 마찬가지로 자신의 내부에 있는 폼 조작 요소에 접근할 수 있도록 해주는 `elements` 프로퍼티를 지원합니다.

예시:

```html run height=80
<body>
  <form id="form">
    <fieldset name="userFields">
      <legend>info</legend>
      <input name="login" type="text">
    </fieldset>
  </form>

  <script>
    alert(form.elements.login); // <input name="login">

*!*
    let fieldset = form.elements.userFields;
    alert(fieldset); // HTMLFieldSetElement

    // 이름을 사용해 form과 fieldset 모두에서 input을 구할 수 있습니다.
    alert(fieldset.elements.login == form.elements.login); // true
*/!*
  </script>
</body>
```
````

````warn header="짧은 표기법: `form.name`"
짧은 표기법인 `form[index/name]`으로도 요소에 접근할 수 있습니다.

`form.elements.login` 대신 `form.login`처럼 쓸 수 있죠.

`form.name`을 사용한 표기법은 잘 작동하긴 하지만 요소에 접근해 `name` 속성을 변경해도 변경 전 이름을 계속 사용할 수 있다는 문제가 있습니다(물론 새로운 이름도 사용할 수 있습니다).

예시를 통해 확인해 봅시다.

```html run height=40
<form id="form">
  <input name="login">
</form>

<script>
  alert(form.elements.login == form.login); // true, 동일한 <input>입니다.

  form.login.name = "username"; //  input의 name 속성을 변경합니다.

  // form.elements에는 name 속성 변경이 반영되었습니다.
  alert(form.elements.login); // undefined
  alert(form.elements.username); // input

*!*
  // form은 새로운 이름과 이전 이름을 모두 인식합니다.
  alert(form.username == form.login); // true
*/!*
</script>
```

그런데 폼 요소의 이름을 변경하는 일은 드물기 때문에 보통은 이런 특징이 문제가 되지 않습니다.

````

## element.form으로 역참조 하기

모든 요소는 `element.form`으로 폼에 접근할 수 있습니다. 폼이 내부에 있는 요소 모두를 참조할 수 있듯이 각 요소 또한 역으로 폼을 참조할 수 있죠.

그림으로 나타내면 다음과 같습니다.

![](form-navigation.svg)

예시:

```html run height=40
<form id="form">
  <input type="text" name="login">
</form>

<script>
*!*
  // 폼 -> 요소
  let login = form.login;

  // 요소 -> 폼
  alert(login.form); // HTMLFormElement
*/!*
</script>
```

## 폼 요소

이제 폼 조작에 사용되는 요소들에 대해 살펴봅시다.

### input과 textarea

input과 textarea 요소의 값은 `input.value` (string) 또는 `input.checked`(boolean)을 사용해 얻을 수 있습니다.

이렇게 말이죠.

```js
input.value = "New value";
textarea.value = "New text";

input.checked = true; // 체크박스나 라디오 버튼에서 쓸 수 있습니다.
```

```warn header="`textarea.innerHTML` 말고 `textarea.value`를 사용하세요."
`<textarea>...</textarea>`안의 값이 HTML이더라도 값을 얻을 때  `textarea.innerHTML`을 사용하지 말아야 합니다.

`textarea.innerHTML`엔 페이지를 처음 열 당시의 HTML만 저장되어 최신 값을 구할 수 없기 때문입니다.
```

### select와 option

`<select>` 요소에는 세 가지 중요 프로퍼티가 있습니다.

1. `select.options` -- `<option>` 하위 요소를 담고 있는 컬렉션
2. `select.value` -- 현재 선택된 `<option>` 값
3. `select.selectedIndex` -- 현재 선택된 `<option>`의 번호(인덱스)

이 세 프로퍼티를 응용하면 아래와 같은 세 가지 방법으로 `<select>`의 값을 설정할 수 있습니다.

1. 조건에 맞는 `<option>` 하위 요소를 찾아 `option.selected`속성을 `true`로 설정합니다.
2. `select.value`를 원하는 값으로 설정합니다.
3. `select.selectedIndex`를 원하는 option 번호로 설정합니다.

세 방법 중 첫 번째 방법이 가장 확실하지만 두 번째나 세 번째 방법이 대체로 더 편리합니다.

예시:

```html run
<select id="select">
  <option value="apple">Apple</option>
  <option value="pear">Pear</option>
  <option value="banana">Banana</option>
</select>

<script>
  // 세 가지 코드의 실행 결과는 모두 같습니다.
  select.options[2].selected = true;
  select.selectedIndex = 2;
  select.value = 'banana';
</script>
```

대부분의 다른 폼 조작 요소와 달리 `<select>`는 `multiple` 속성이 있는 경우 option을 다중 선택할 수 있습니다. `multiple` 속성을 쓰는 경우는 아주 드물지만, 쓰게 되다면 첫 번째 방법을 사용해 `<option>` 하위 요소에 있는 `selected` 프로퍼티를 추가·제거해야 합니다. 

선택된 여러 개의 option이 담긴 컬렉션은 다음 예시처럼 `select.options`를 사용해 얻을 수 있습니다. 

```html run
<select id="select" *!*multiple*/!*>
  <option value="blues" selected>Blues</option>
  <option value="rock" selected>Rock</option>
  <option value="classic">Classic</option>
</select>

<script>
  // 선택한 값 전체
  let selected = Array.from(select.options)
    .filter(option => option.selected)
    .map(option => option.value);

  alert(selected); // blues,rock  
</script>
```

`<select>` 요소에 대한 명세는 아래 링크에서 볼 수 있습니다 <https://html.spec.whatwg.org/multipage/forms.html#the-select-element>.

### Option 생성자

Option 생성자는 잘 사용되지는 않지만 흥미로운 점이 있습니다.

[명세서](https://html.spec.whatwg.org/multipage/forms.html#the-option-element)를 보면 `<option>` 요소를 생성하는 간단하고 멋진 문법을 찾을 수 있죠.

```js
option = new Option(text, value, defaultSelected, selected);
```

매개변수:

- `text` -- option 내부의 텍스트
- `value` -- option의 값
- `defaultSelected` -- `true`이면 HTML 속성 `selected`가 생성됨
- `selected` -- `true`이면 해당 option이 선택됨

`defaultSelected`와 `selected`의 차이가 무엇인지 헷갈릴 수 있습니다. `defaultSelected`는 `option.getAttribute('selected')`를 사용해 얻을 수 있는 HTML 속성을 설정해 줍니다. 반면 `selected` 는 option의 선택 여부를 결정합니다. 그렇기 때문에 당연히 `selected`가 더 중요한 매개변수이죠. Option 생성자를 사용할 때는 대개 두 매개변수 모두를 `true`나 `false`로 설정합니다.

예시:

```js
let option = new Option("Text", "value");
// <option value="value">Text</option> 가 생성됩니다.
```

이번엔 같은 요소를 선택된 상태로 생성합니다.

```js
let option = new Option("Text", "value", true, true);
```

Option을 사용해 만든 요소에는 다음과 같은 프로퍼티가 있습니다.

`option.selected`
: option의 선택 여부

`option.index`
: option 중 몇 번째인지를 나타내는 번호

`option.text`
: 사용자가 보게 될 텍스트

## 참고 자료

- 명세서: <https://html.spec.whatwg.org/multipage/forms.html>.

## 요약

폼 탐색하기

`document.forms`
: `document.forms[name/index]`로 폼에 접근할 수 있습니다.

`form.elements`  
: 폼 요소는 `form.elements[name/index]` 또는 `form[name/index]`로 접근합니다. `elements` 프로퍼티는 `<fieldset>`에도 똑같이 작동합니다.

`element.form`
: 요소는 `form` 프로퍼티에서 자신이 속한 폼을 참조합니다.

각 요소의 값은 `input.value`, `textarea.value`, `select.value` 등으로 접근할 수 있습니다. 체크박스와 라디오 버튼에서는 `input.checked`를 사용할 수 있습니다.

`<select>`에서는 인덱스 `select.selectedIndex`나 option 컬렉션 `select.options`을 통해 값을 구할 수도 있습니다.

지금까지는 폼 관련 기본을 다뤘습니다. 이 튜토리얼에서 앞으로 더 많은 예시를 만날 것입니다.

다음 챕터에서는 어느 요소에서든 발생할 수 있지만 대부분 폼에서 처리되는 `focus`와 `blur` 이벤트를 다루겠습니다. 
