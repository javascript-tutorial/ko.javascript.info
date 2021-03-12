# 커스텀 이벤트 디스패치

자바스크립트를 사용하면 핸들러를 할당할 수 있을 뿐만 아니라 이벤트를 직접 만들 수도 있습니다.

이렇게 직접 만든 커스텀 이벤트(custom event)는 '그래픽 컴포넌트(graphical component)'를 만들 때 사용됩니다. 자바스크립트 기반 메뉴가 있다고 가정해 봅시다. 개발자는 메뉴의 루트 요소에 `open`(메뉴를 열었을 때 실행됨), `select`(항목을 선택했을 때 실행됨) 같은 이벤트를 달아 상황에 맞게 이벤트가 실행되게 할 수 있습니다. 이렇게 루트 요소에 이벤트 핸들러를 달아놓으면 바깥 코드에서도 이벤트 리스닝을 통해 메뉴에서 어떤 일이 일어났는지를 파악할 수 있습니다.

자바스크립트를 사용하면 새로운 커스텀 이벤트뿐만 아니라 목적에 따라 `click`, `mousedown` 같은 내장 이벤트를 직접 만들 수도 있습니다. 이렇게 만든 내장 이벤트들은 테스팅을 자동화할 때 유용합니다.

## Event의 생성자

내장 이벤트 클래스는 DOM 요소 클래스같이 계층 구조를 형성합니다. 내장 이벤트 클래스 계층의 꼭대기엔 [Event](http://www.w3.org/TR/dom/#event) 클래스가 있습니다.

`Event` 객체는 다음과 같이 생성할 수 있습니다.

```js
let event = new Event(type[, options]);
```

인수는 다음과 같습니다.

- *type* -- 이벤트 타입을 나타내는 문자열로 `"click"`같은 내장 이벤트, `"my-event"` 같은 커스텀 이벤트가 올 수도 있습니다.
- *options* -- 두 개의 선택 프로퍼티가 있는 객체가 옵니다.
  - `bubbles: true/false` -- `true`인 경우 이벤트가 버블링 됩니다.
  - `cancelable: true/false` -- `true`인 경우 브라우저 '기본 동작'이 실행되지 않습니다. 자세한 내용은 커스텀 이벤트 섹션에서 살펴보겠습니다.

  아무런 값도 지정하지 않으면 두 프로퍼티는 기본적으로 `{bubbles: false, cancelable: false}`처럼 `false`가 됩니다.

## dispatchEvent

이벤트 객체를 생성한 다음엔 `elem.dispatchEvent(event)`를 호출해 요소에 있는 이벤트를 반드시 '실행'시켜줘야 합니다(dispatch는 일을 '처리하다'라는 뜻을 가진 영어단어입니다 - 옮긴이).

이렇게 이벤트를 실행시켜줘야 핸들러가 일반 브라우저 이벤트처럼 이벤트에 반응할 수 있습니다. `bubbles` 플래그를 `true`로 해서 이벤트를 만든 경우 이벤트는 제대로 버블링 됩니다.

예시를 살펴봅시다. 자바스크립트를 사용해 `click` 이벤트를 만들고 실행 시켜 보았습니다. 버튼을 실제로 클릭하지 않았지만, 이벤트 핸들러가 동작하는 것을 확인할 수 있습니다.

```html run no-beautify
<button id="elem" onclick="alert('클릭!');">자동으로 클릭 되는 버튼</button>

<script>
  let event = new Event("click");
  elem.dispatchEvent(event);
</script>
```

```smart header="event.isTrusted"
`event.isTrusted`를 사용하면 이벤트가 스크립트를 통해 생성한 이벤트인지 '진짜' 사용자가 만든 이벤트인지 알 수 있습니다.

`event`의 `isTrusted` 프로퍼티가 `true`이면 사용자 액션을 통해 만든 이벤트라는 것을 의미합니다. `isTrusted`가 `false`이면 해당 이벤트가 스크립트를 통해 생성되었다는 걸 알 수 있습니다.
```

## 커스텀 이벤트 버블링 예시

`"hello"`라는 이름을 가진 이벤트를 만들고 버블링 시켜서 `document`에서 이벤트를 처리할 수 있게 해보겠습니다.

이벤트가 버블링되게 하려면 `bubbles`를 `true`로 설정해야 합니다.

```html run no-beautify
<h1 id="elem">Hello from the script!</h1>

<script>
  // 버블링이 일어나면서 document에서 이벤트가 처리됨
  document.addEventListener("hello", function(event) { // (1)
    alert("Hello from " + event.target.tagName); // Hello from H1
  });

  // 이벤트(hello)를 만들고 elem에서 이벤트 디스패치
  let event = new Event("hello", {bubbles: true}); // (2)
  elem.dispatchEvent(event);

  // document에 할당된 핸들러가 동작하고 메시지가 얼럿창에 출력됩니다.

</script>
```


위 예시에서 주의해서 볼 점은 다음과 같습니다.

1. `on<event>`은 내장 이벤트에만 해당하는 문법이기 때문에 `document.onhello`라고 하면 원하는 대로 동작하지 않습니다. 커스텀 이벤트는 반드시 `addEventListener`를 사용해 핸들링해야 합니다.
2. `bubbles:true`를 명시적으로 설정하지 않으면 이벤트가 버블링 되지 않습니다.

내장 이벤트(`click`)와 커스텀 이벤트(`hello`)의 버블링 메커니즘은 동일합니다. 이에 더하여 커스텀 이벤트에도 내장 이벤트와 마찬가지로 캡쳐링, 버블링 단계가 있습니다.

## MouseEvent, KeyboardEvent 등의 다양한 이벤트

명세서의 [UI 이벤트](https://www.w3.org/TR/uievents) 섹션엔 다양한 UI 이벤트 클래스가 명시되어 있습니다. 그중 일부를 추리면 다음과 같습니다.

- `UIEvent`
- `FocusEvent`
- `MouseEvent`
- `WheelEvent`
- `KeyboardEvent`
- 등등...

그런데 이 이벤트들은 `new Event`로 만들면 안 되고, 반드시 관련 내장 클래스를 사용해야 합니다. 마우스 클릭 이벤트라면 `new MouseEvent("click")`를 사용해야 하죠.

이렇게 제대로 된 생성자를 사용해야만 해당 이벤트 전용 표준 프로퍼티를 명시할 수 있습니다. 

`new MouseEvent("click")`를 사용해 마우스 이벤트의 `clientX`, `clientY` 프로퍼티를 설정해 보겠습니다.

```js run
let event = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  clientX: 100,
  clientY: 100
});

*!*
alert(event.clientX); // 100
*/!*
```

이제 일반 `Event` 생성자를 사용해 표준 프로퍼티를 설정해 보겠습니다.

제대로 동작하지 않는다는 것을 직접 확인할 수 있습니다.

```js run
let event = new Event("click", {
  bubbles: true, // Event 생성자에선 
  cancelable: true, // bubbles와 cancelable 프로퍼티만 동작합니다.
  clientX: 100,
  clientY: 100
});

*!*
alert(event.clientX); // undefined, 알 수 없는 프로퍼티이기 때문에 무시됩니다.
*/!*
```

`new Event`로 이벤트를 생성한 다음, `event.clientX=100`처럼 프로퍼티에 값을 직접 명시해주면 이런 제약을 피할 수 있긴 합니다. 위와 같은 제약을 따르는 건 개발자 마음이긴 하죠. 그렇지만 브라우저에서 만들어지는 UI 이벤트는 적확한 이벤트 타입이 있다는 것을 알아두는 게 좋습니다.

UI 이벤트별 표준 프로퍼티 목록은 명세서에서 확인할 수 있습니다. `MouseEvent`의 표준 프로퍼티는 [링크](https://www.w3.org/TR/uievents/#mouseevent)에 있으니 확인해 보시기 바랍니다.

## 커스텀 이벤트

지금까진 `new Event`로 커스텀 이벤트를 만들었습니다. 하지만 제대로 된 커스텀 이벤트를 만들려면 `new CustomEvent`를 사용해야 합니다. [CustomEvent](https://dom.spec.whatwg.org/#customevent)는 `Event`와 거의 유사하지만 한 가지 다른 점이 있습니다.

`CustomEvent`의 두 번째 인수엔 객체가 들어갈 수 있는데, 개발자는 이 객체에 `detail`이라는 프로퍼티를 추가해 커스텀 이벤트 관련 정보를 명시하고, 정보를 이벤트에 전달할 수 있습니다.   

예시:

```html run refresh
<h1 id="elem">이보라님, 환영합니다!</h1>

<script>
  // 추가 정보는 이벤트와 함께 핸들러에 전달됩니다.
  elem.addEventListener("hello", function(event) {
    alert(*!*event.detail.name*/!*);
  });

  elem.dispatchEvent(new CustomEvent("hello", {
*!*
    detail: { name: "보라" }
*/!*
  }));
</script>
```

`detail` 프로퍼티엔 어떤 데이터도 들어갈 수 있습니다. 사실 `new Event`로 일반 이벤트를 생성한 다음 추가 정보가 담긴 프로퍼티를 이벤트 객체에 추가해주면 되기 때문에 `detail` 프로퍼티 없이도 충분히 이벤트에 원하는 정보를 추가할 수 있긴 합니다. 그런데도 `detail`이라는 특별한 프로퍼티를 사용하는 이유는 다른 이벤트 프로퍼티와 충돌을 피하기 위해서입니다. 

이 외에도 `new CustomEvent`를 사용하면 코드 자체만으로 '커스텀 이벤트'라고 설명해주는 효과가 있습니다.

## event.preventDefault()

브라우저 이벤트 대다수는 '기본 동작'과 함께 실행됩니다. 링크 클릭 시 특정 URL로 이동하기, 전송 버튼 클릭 시 서버에 폼 전송하기 같은 동작은 이런 기본 동작의 대표적인 예입니다.

우리가 직접 만든 커스텀 이벤트에는 당연히 기본 동작이 없습니다. 하지만 커스텀 이벤트를 만들고 디스패칭 해 주는 코드에 원하는 동작을 넣으면, 커스텀 이벤트에도 기본 동작을 설정해줄 수 있습니다.

이벤트 기본 동작은 `event.preventDefault()`를 호출해 취소할 수 있습니다. `event.preventDefault()`를 호출하면 이벤트 핸들러는 기본 동작이 취소되어야 한다는 신호를 보내기 때문입니다.

이벤트 기본동작이 취소되면 `elem.dispatchEvent(event)` 호출 시 `false`가 반환됩니다. 해당 이벤트를 디스패치 하는 코드에선 이를 통해 기본동작이 취소되어야 한다는 것을 인지합니다.

토끼 숨기기 예시를 통해 지금까지 배운 내용을 직접 실습해봅시다. 참고로 이 예시는 메뉴 숨기기 등으로 응용 가능합니다.

예시엔 `id`가 `rabbit`인 요소, `"hide"` 이벤트를 실행시키는 함수 `hide()`가 있습니다. `hide()`는 다른 코드들이 이벤트 실행 여부를 알 수 있게 해줍니다.

`rabbit.addEventListener('hide',...)`를 사용하면 어떤 핸들러에서도 `"hide"`를 리스닝 할 수 있습니다. 그리고 필요하다면 `event.preventDefault()`를 사용해 `"hide"` 이벤트의 기본 동작을 취소할 수 있습니다. 이렇게 기본동작이 취소되면 토끼가 화면에서 사라지지 않습니다.

```html run refresh autorun
<pre id="rabbit">
  |\   /|
   \|_|/
   /. .\
  =\_Y_/=
   {>o<}
</pre>
<button onclick="hide()">hide()를 호출해 토끼 숨기기</button>

<script>
  // hide() will be called automatically in 2 seconds
  function hide() {
    let event = new CustomEvent("hide", {
      cancelable: true // cancelable를 true로 설정하지 않으면 preventDefault가 동작하지 않습니다.
    });
    if (!rabbit.dispatchEvent(event)) {
      alert('기본 동작이 핸들러에 의해 취소되었습니다.');
    } else {
      rabbit.hidden = true;
    }
  }

  rabbit.addEventListener('hide', function(event) {
    if (confirm("preventDefault를 호출하시겠습니까?")) {
      event.preventDefault();
    }
  });
</script>
```

예시에서 주의 깊게 봐야 할 점은 `cancelable: true`입니다. `event.preventDefault()`가 제대로 동작하게 하려면 이벤트 `hide`의 `cancelable`을 반드시 `true`로 지정해줘야 합니다. 그렇지 않으면 `event.preventDefault()`가 무시됩니다.

## 이벤트 안 이벤트

이벤트는 대게 큐에서 처리됩니다. 따라서 브라우저가 `onclick` 이벤트를 처리하고 있는데 마우스를 움직여서 새로운 이벤트를 발생시키면 이 이벤트에 상응하는 `mousemove` 핸들러는 `onclick` 이벤트 처리가 끝난 후에 호출됩니다. 

그런데 이벤트 안 `dispatchEvent` 처럼 이벤트 안에 다른 이벤트가 있는 경우엔 위와 같은 규칙이 적용되지 않습니다. 이벤트 안에 있는 이벤트는 즉시 처리됩니다. 새로운 이벤트 핸들러가 호출되고 난 후에 헌재 이벤트 핸들링이 재개됩니다.

예시를 살펴봅시다. `menu-open` 이벤트는 `onclick` 이벤트가 처리되는 도중에 트리거됩니다.

`menu-open` 이벤트 처리는 `onclick` 핸들러가 끝날 때까지 기다리지 않고 바로 처리됩니다.


```html run autorun
<button id="menu">메뉴(클릭해주세요)</button>

<script>
  menu.onclick = function() {
    alert(1);

    menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    }));

    alert(2);
  };

  // 1과 2 사이에 트리거됩니다
  document.addEventListener('menu-open', () => alert('중첩 이벤트'));
</script>
```

얼럿창에 '1', '중첩 이벤트', '2'가 차례대로 출력되는 것을 확인할 수 있습니다.

이 예시에서 주목해야 할 것은 중첩 이벤트 `menu-open`이 `document`에 할당된 핸들러에서 처리된다는 점입니다. 중첩 이벤트의 전파와 핸들링이 외부 코드(`onclick`)의 처리가 다시 시작되기 전에 끝났습니다.

이런 일은 중첩 이벤트가 `dispatchEvent`일 때뿐만 아니라 이벤트 핸들러 안에서 다른 이벤트를 트리거 하는 메서드를 호출할 때 발생합니다. 즉, 이벤트 안 이벤트는 동기적으로 처리되는 것이죠.

그런데 때에 따라 중첩 이벤트가 동기적으로 처리되는걸 원치 않는 경우도 있기 마련입니다. 위 예시에서 `menu-open`이벤트나 다른 이벤트의 처리 여부와 상관없이 `onclick` 이벤트를 먼저 처리하려면 어떻게 해야 할까요?

`onclick` 끝에 `dispatchEvent` 등의 이벤트 트리거 호출을 넣는 게 하나의 방법이 될 수 있습니다. 이에 더하여 중첩 이벤트를 지연시간이 0인 `setTimeout`으로 감싸는 것도 방법입니다.

```html run
<button id="menu">Menu (click me)</button>

<script>
  menu.onclick = function() {
    alert(1);

    setTimeout(() => menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    })));

    alert(2);
  };

  document.addEventListener('menu-open', () => alert('중첩 이벤트'));
</script>
```

이제 원하는 대로 `dispatchEvent`가 `mouse.onclick`을 포함한 현재 코드 실행이 종료된 이후에 실행됩니다. 이벤트 핸들러들이 완전히 독립적으로 되었네요.

출력 순서는 '1', '2', '중첩 이벤트'입니다.

## 요약

코드를 사용해 이벤트를 직접 생성하려면 먼저 이벤트 객체를 만들어야 합니다.

범용적으로 쓰이는 `Event(name, options)` 클래스의 생성자는 임의의 이벤트 이름과 두 개의 프로퍼티가 있는 `options`라는 객체를 받습니다.  
- `bubbles: true` 이면 이벤트는 버블링됩니다.
- `cancelable: true` 이면 `event.preventDefault()`가 동작합니다.

이 외에 `MouseEvent`, `KeyboardEvent` 같은 네이티브 이벤트 클래스의 생성자들은 이벤트 특유의 프로퍼티를 받습니다. 마우스 이벤트의 `clientX`가 대표적인 예입니다. 

이벤트를 직접 만드는 경우라면 `CustomEvent` 생성자를 써야 합니다. `CustomEvent` 생성자엔 `detail`이라는 추가 프로퍼티를 명시할 수 있는데, 여기에 이벤트 관련 정보를 저장해야 합니다. 이렇게 하면 모든 핸들러에서 `event.detail`을 통해 커스텀 이벤트의 정보를 알 수 있습니다. 

커스텀 이벤트의 이름을 `click`나 `keydown` 같이 브라우저 내장 이벤트처럼 지을 수 있긴 한데, 이런 경우엔 아주 조심해야 합니다.

되도록이면 내장 이벤트와 같은 이름을 가진 브라우저 이벤트를 만들지 말도록 합시다. 대부분의 경우 설계 관점에서 아주 좋지 않은 영항을 끼치기 때문입니다. 

그렇지만 이런 경우에는 브라우저 이벤트를 만드는게 불가피 하니, 사용해도 괜찮습니다.

- 서드파티 라이브러리가 제대로 동작하게 하려면 꼭 필요한 경우. 네이티브 이벤트를 만드는 것 이외에는 서드파티 라이브러리와 상호작용할 수 있는 수단이 없는 경우엔 괜찮습니다.
- 테스팅을 자동화 하려는 경우. '버튼 클릭'등의 이벤트를 사용자 동작 없이 코드만으로 유발시키고 제대로 동작하는지 그 결과를 확인하고자 할 때는 괜찮습니다.

네이티브 이벤트 이름과 겹치지 않게 커스텀 이벤트를 만드는 것은 설계 측면에서 자주 쓰이는 전략입니다. 커스텀 이벤트를 응용하면 메뉴나 사이드바, 캐러셀 등의 안에서 발생하는 일을 알려줄 수 있습니다.
