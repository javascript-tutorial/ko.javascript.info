# focus와 blur

<<<<<<< HEAD
사용자가 폼 요소를 클릭하거나 `key:Tab` 키를 눌러 요소로 이동하면 해당 요소가 포커스(focus)됩니다. `autofocus`라는 HTML 속성을 사용해도 요소를 포커스 할 수 있는데 이 속성이 있는 요소는 페이지가 로드된 후 자동으로 포커싱 됩니다. 이 외에도 요소를 포커싱(focusing)할 수 있는 방법은 다양합니다.
=======
An element receives the focus when the user either clicks on it or uses the `key:Tab` key on the keyboard. There's also an `autofocus` HTML attribute that puts the focus onto an element by default when a page loads and other means of getting the focus.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

요소를 포커싱한다는 것은 일반적으로 '여기에 데이터를 입력할 준비를 하라'는 것을 의미하기 때문에 요소 포커싱이 이뤄지는 순간엔 요구사항을 충족시키는 초기화 코드를 실행할 수 있습니다.

요소가 포커스를 잃는 순간(blur)은 요소가 포커스를 얻는 순간보다 더 중요할 수 있습니다. 사용자가 다른 곳을 클릭하거나 `key:Tab` 키를 눌러 다음 폼 필드로 이동하면 포커스 상태의 요소가 포커스를 잃게 됩니다. 이 외에도 다양한 방법을 사용해 포커스를 잃게 할 수 있습니다.

요소가 포커스를 잃는 것은 대개 '데이터 입력이 완료되었다'는 것을 의미하기 때문에 포커싱이 해제되는 순간엔 데이터를 체크하거나 입력된 데이터를 저장하기 위해 서버에 요청을 보내는 등의 코드를 실행할 수 있습니다.

포커스 이벤트를 다룰 땐 이상해 보이지만 중요한 기능이 있는데, 이번 챕터에선 이에 대해서 자세히 다뤄보도록 하겠습니다.

## focus, blur 이벤트

`focus` 이벤트는 요소가 포커스를 받을 때, `blur` 이벤트는 포커스를 잃을 때 발생합니다.

두 이벤트를 입력 필드 값 검증에 사용해 봅시다.

예시에서 각 핸들러는 다음과 같은 역할을 합니다.

<<<<<<< HEAD
- `blur` 핸들러에선 필드에 이메일이 잘 입력되었는지 확인하고 잘 입력되지 않은 경우엔 에러를 보여줍니다.
- `focus` 핸들러에선 에러 메시지를 숨깁니다(이메일 재확인은 `blur` 핸들러에서 합니다).
=======
- The `blur` handler checks if the field has an email entered, and if not -- shows an error.
- The `focus` handler hides the error message (on `blur` it will be checked again):
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```html run autorun height=60
<style>
  .invalid { border-color: red; }
  #error { color: red }
</style>

이메일: <input type="email" id="input">

<div id="error"></div>

<script>
*!*input.onblur*/!* = function() {
  if (!input.value.includes('@')) { // @ 유무를 이용해 유효한 이메일 주소가 아닌지 체크
    input.classList.add('invalid');
    error.innerHTML = '올바른 이메일 주소를 입력하세요.'
  }
};

*!*input.onfocus*/!* = function() {
  if (this.classList.contains('invalid')) {
    // 사용자가 새로운 값을 입력하려고 하므로 에러 메시지를 지움
    this.classList.remove('invalid');
    error.innerHTML = "";
  }
};
</script>
```

모던 HTML을 사용하면 `required`, `pattern` 등의 다양한 속성을 사용해 입력값을 검증 할 수 있습니다. HTML 속성만으로도 검증이 가능한거죠. 그럼에도 불구하고 자바스크립트를 사용하는 이유는 자바스크립트가 좀 더 유연하기 때문입니다. 여기에 더하여 자바스크립트를 사용하면 제대로 된 값이 입력되었을 때 자동으로 해당값을 서버에 보낼 수 있기 때문이기도 합니다.


## focus, blur 메서드

`elem.focus()`와 `elem.blur()` 메서드를 사용하면 요소에 포커스를 줄 수도 있고 제거할 수도 있습니다.

사이트 방문자가 유효하지 않은 값을 입력하면 사이트를 떠나지 못하도록 하는 예시를 살펴봅시다.

```html run autorun height=80
<style>
  .error {
    background: red;
  }
</style>

이메일: <input type="email" id="input">
<input type="text" style="width:220px" placeholder="이메일 형식이 아닌 값을 입력하고 여기에 포커스를 주세요.">

<script>
  input.onblur = function() {
    if (!this.value.includes('@')) { // 이메일이 아님
      // 에러 출력
      this.classList.add("error");
*!*
      // input 필드가 포커스 되도록 함
      input.focus();
*/!*
    } else {
      this.classList.remove("error");
    }
  };
</script>
```

이 예시는 Firefox([bug](https://bugzilla.mozilla.org/show_bug.cgi?id=53579))를 제외한 모든 브라우저에서 정상 동작합니다.

이메일이 아닌 값을 입력하고 `key:Tab` 키나 다른 곳을 클릭해 `<input>`을 벗어나려 하면 `onblur` 메서드가 동작해 포커스를 다시 입력 필드로 돌려놓습니다.

여기서 주의해야 할 점은 `onblur`는 요소가 포커스를 잃고 난 *후*에 발생하기 때문에 `onblur` 안에서 `event.preventDefault()`를 호출해 포커스를 잃게 하는걸 '막을 수 없다'라는 사실입니다. 

```warn header="JavaScript-initiated focus loss"
A focus loss can occur for many reasons.

One of them is when the visitor clicks somewhere else. But also JavaScript itself may cause it, for instance:

- An `alert` moves focus to itself, so it causes the focus loss at the element (`blur` event), and when the `alert` is dismissed, the focus comes back (`focus` event).
- If an element is removed from DOM, then it also causes the focus loss. If it is reinserted later, then the focus doesn't return.

These features sometimes cause `focus/blur` handlers to misbehave -- to trigger when they are not needed.

The best recipe is to be careful when using these events. If we want to track user-initiated focus-loss, then we should avoid causing it ourselves.
```
## tabindex를 사용해서 모든 요소 포커스 하기

<<<<<<< HEAD
대다수의 요소는 기본적으로 포커싱을 지원하지 않습니다.
=======
By default, many elements do not support focusing.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

포커싱을 지원하지 않는 요소 목록은 브라우저마다 다르긴 하지만 한 가지 확실한 것은 `<button>`, `<input>`, `<select>`, `<a>`와 같이 사용자가 웹 페이지와 상호작용 할 수 있게 도와주는 요소는 `focus`, `blur`를 지원한다는 사실입니다.

<<<<<<< HEAD
반면 `<div>`, `<span>`, `<table>`같이 무언가를 표시하는 용도로 사용하는 요소들은 포커싱을 지원하지 않습니다. 따라서 이런 요소엔 `elem.focus()` 메서드가 동작하지 않고 `focus`, `blur`이벤트도 트리거 되지 않습니다.
=======
On the other hand, elements that exist to format something, such as `<div>`, `<span>`, `<table>` -- are unfocusable by default. The method `elem.focus()` doesn't work on them, and `focus/blur` events are never triggered.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

그럼에도 불구하고 포커스를 하고 싶다면 `tabindex` HTML 속성을 사용하면 됩니다.

`tabindex` 속성이 있는 요소는 종류와 상관없이 포커스가 가능합니다. 속성값은 숫자인데, 이 숫자는 `key:Tab` 키를 눌러 요소 사이를 이동할 때 순서가 됩니다.

요소가 두 개 있다고 가정하고 첫 번째 요소의 `tabindex`엔 `1`을, 두 번째 요소의 `tabindex`엔 `2`를 할당하면 첫 번째 요소가 포커싱되어있는 상태에서 `key:Tab`을 눌렀을 때 두 번째 요소로 포커스가 이동합니다.

포커싱 되는 요소 순서는 다음과 같습니다. `tabindex`가 `1`인 요소부터 시작해 점점 큰 숫자가 매겨진 요소로 이동하고 그다음 `tabindex`가 없는 요소(평범한 `<input>` 요소 등)로 이동합니다.

<<<<<<< HEAD
`tabindex`가 없는 요소들은 문서 내 순서에 따라 포커스가 이동합니다(기본 순서).
=======
Elements without matching `tabindex` are switched in the document source order (the default order).
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

그런데 `tabindex`를 사용할 땐 주의해야 할 사항이 있습니다.

- `tabindex`가 `0`인 요소 -- 이 요소는 `tabindex` 속성이 없는것처럼 동작합니다. 따라서 포커스를 이동시킬 때 `tabindex`가 `0`인 요소는 `tabindex`가 1보다 크거나 같은 요소보다 나중에 포커스를 받습니다.

  `tabindex="0"`은 요소를 포커스 가능하게 만들지만 포커스 순서는 기본 순서 그대로 유지하고 싶을 때 사용합니다. 요소의 포커스 우선 순위를 일반 `<input>`과 같아지도록 하죠.

- `tabindex`가 `-1`인 요소 -- 스크립트로만 포커스 하고 싶은 요소에 사용합니다. `key:Tab`키를 사용하면 이 요소는 무시되지만 `elem.focus()` 메서드를 사용하면 잘 포커싱 됩니다.

예시를 살펴봅시다. 첫 번째 항목을 클릭하고 `key:Tab` 키를 눌러보세요.

```html autorun no-beautify
<<<<<<< HEAD
첫 번째 항목을 클릭하고 Tab 키를 눌러보면서 포커스 된 요소 순서를 눈여겨보세요. 참고로 탭을 많이 누르면 예시 밖으로 포커스가 이동하니, 주의하세요.
=======
Click the first item and press Tab. Keep track of the order. Please note that many subsequent Tabs can move the focus out of the iframe in the example.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
<ul>
  <li tabindex="1">일</li>
  <li tabindex="0">영</li>
  <li tabindex="2">이</li>
  <li tabindex="-1">음수 일</li>
</ul>

<style>
  li { cursor: pointer; }
  :focus { outline: 1px dashed green; }
</style>
```

보시다시피 포커스는 `tabindex`가 `1`, `2`, `0`인 요소로 차례로 이동합니다. `<li>`는 기본적으로 포커스 할 수 없는 요소이지만 예시에서 `tabindex`를 사용해서 실제 포커스를 해보았고 포커스 된 요소는 `:focus`를 사용해서 스타일을 바꿔보았습니다.

```smart header="`elem.tabIndex` 프로퍼티를 사용해도 됩니다."
자바스크립트를 사용해 `elem.tabIndex` 프로퍼티를 추가해주면 `tabindex` 속성을 사용한 것과 동일한 효과를 볼 수 있습니다.
```

## focusin과 focusout을 사용해 이벤트 위임하기

`focus`와 `blur` 이벤트는 버블링 되지 않습니다.

예시를 살펴봅시다. `<form>`에 `onfocus`를 추가해 강조 효과를 주려고 했는데, 의도한 대로 동작하지 않는 것을 확인할 수 있습니다.

```html autorun height=80
<!-- 폼 안에서 포커스가 된 경우 클래스를 추가함 -->
<form *!*onfocus="this.className='focused'"*/!*>
  <input type="text" name="surname" value="성">
  <input type="text" name="name" value="이름">
</form>

<style> .focused { outline: 1px solid red; } </style>
```

의도한 대로 예시가 동작하지 않는 이유는 사용자가 `<input>`을 포커스 해도 `focus` 이벤트는 해당 입력 필드에서만 트리거 되기 때문입니다. `focus` 이벤트는 버블링 되지 않습니다. 따라서 `form.onfocus`는 절대 트리거 되지 않습니다.

이런 기본동작을 피해 이벤트 위임 효과를 주는 방법은 두 가지가 있습니다.

첫 번째 방법은 `focus`와 `blur`는 버블링 되지 않지만 캡처링은 된다는 점을 이용하면 됩니다.

아래 예시를 직접 실행해봅시다.

```html autorun height=80
<form id="form">
  <input type="text" name="surname" value="성">
  <input type="text" name="name" value="이름">
</form>

<style> .focused { outline: 1px solid red; } </style>

<script>
*!*
  // 캡쳐링 단계에서 핸들러가 트리거되도록 합니다(마지막 인수가 true)
  form.addEventListener("focus", () => form.classList.add('focused'), true);
  form.addEventListener("blur", () => form.classList.remove('focused'), true);
*/!*
</script>
```

두 번째 방법은 `focusin`과 `focusout`을 이용하는 것입니다. 두 이벤트는 `focus`, `blur`와 동일하지만 버블링이 된다는 점에서 차이가 있습니다.

`focusin`과 `focusout`을 사용할 때 주의할 점은 `on<event>` 방식으로 핸들러를 추가하면 안 되고 `elem.addEventListener` 방식으로 핸들러를 추가해야 한다는 점입니다.

예시를 실행해 실제 이벤트가 버블링 되는지 확인해봅시다.
```html autorun height=80
<form id="form">
  <input type="text" name="surname" value="성">
  <input type="text" name="name" value="이름">
</form>

<style> .focused { outline: 1px solid red; } </style>

<script>
*!*
  form.addEventListener("focusin", () => form.classList.add('focused'));
  form.addEventListener("focusout", () => form.classList.remove('focused'));
*/!*
</script>
```

## 요약

<<<<<<< HEAD
`focus`와 `blur` 이벤트는 각각 요소가 포커스를 받을 때, 잃을 때 발생합니다.
=======
Events `focus` and `blur` trigger on an element focusing/losing focus.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

두 이벤트를 사용할 땐 다음을 유의해야 합니다.
- `focus`와 `blur` 이벤트는 버블링 되지 않습니다. 캡처링이나 `focusin`, `focusout`을 사용하면 이벤트 위임 효과를 볼 수 있습니다.
- 대부분의 요소는 기본적으로 포커스를 지원하지 않습니다. 그럼에도 불구하고 포커스 하고 싶은 요소가 있다면 `tabindex`를 사용하면 됩니다.

현재 포커스된 요소는 `document.activeElement`를 통해 확인할 수 있습니다.
