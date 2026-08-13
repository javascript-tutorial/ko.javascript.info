# 포인터 이벤트

포인터 이벤트(Pointer events)는 마우스, 펜·스타일러스, 터치스크린 같은 다양한 포인팅 기기의 입력을 처리하는 현대적인 방법입니다.

## 간략한 역사

포인터 이벤트가 다른 이벤트 유형 사이에서 어떤 위치에 있는지 이해할 수 있도록 간략히 살펴보겠습니다.

- 오래전에는 마우스 이벤트만 있었습니다.

    그러다 터치 기기, 특히 휴대 전화와 태블릿이 널리 보급되었습니다. 기존 스크립트가 동작하도록 터치 기기는 마우스 이벤트를 생성했고 지금도 생성합니다. 예를 들어 터치스크린을 탭 하면 `mousedown`이 발생합니다. 덕분에 터치 기기는 웹 페이지와 잘 동작했습니다.

    하지만 터치 기기는 마우스보다 더 많은 기능을 제공합니다. 예를 들어 여러 지점을 동시에 터치하는 '멀티 터치'가 가능합니다. 하지만 마우스 이벤트에는 이런 멀티 터치를 처리하는 데 필요한 프로퍼티가 없습니다.

- 그래서 `touchstart`, `touchend`, `touchmove`처럼 터치에 특화된 프로퍼티를 가진 터치 이벤트가 도입되었습니다. 포인터 이벤트가 더 나은 대안이므로 여기서는 자세히 다루지 않겠습니다.

    하지만 그것만으로는 부족했습니다. 펜처럼 저마다 고유 기능을 가진 다른 기기도 많았기 때문입니다. 터치 이벤트와 마우스 이벤트를 모두 수신하는 코드를 작성하는 일도 번거로웠습니다.

- 이런 문제를 해결하기 위해 새로운 표준인 포인터 이벤트가 도입되었습니다. 포인터 이벤트는 모든 종류의 포인팅 기기에 대해 하나의 이벤트 집합을 제공합니다.

현재 [Pointer Events Level 2](https://www.w3.org/TR/pointerevents2/) 명세는 모든 주요 브라우저에서 지원됩니다. 더 최신 버전인 [Pointer Events Level 3](https://w3c.github.io/pointerevents/)는 작업 중이며 Pointer Events Level 2와 대부분 호환됩니다.

Internet Explorer 10이나 Safari 12 이하 같은 구형 브라우저를 지원해야 하는 경우가 아니라면 이제 마우스 이벤트나 터치 이벤트를 사용할 이유가 없습니다. 포인터 이벤트로 전환하면 됩니다.

그러면 터치 기기와 마우스 기기 모두에서 코드가 잘 동작합니다.

다만 포인터 이벤트를 올바르게 사용하고 예상치 못한 동작을 피하려면 알아두어야 할 중요한 특징이 몇 가지 있습니다. 이 챕터에서 그 특징을 짚어보겠습니다.

## 포인터 이벤트 종류

포인터 이벤트의 이름은 마우스 이벤트와 유사하게 지어졌습니다.

| 포인터 이벤트 | 유사한 마우스 이벤트 |
|---------------|-------------|
| `pointerdown` | `mousedown` |
| `pointerup` | `mouseup` |
| `pointermove` | `mousemove` |
| `pointerover` | `mouseover` |
| `pointerout` | `mouseout` |
| `pointerenter` | `mouseenter` |
| `pointerleave` | `mouseleave` |
| `pointercancel` | - |
| `gotpointercapture` | - |
| `lostpointercapture` | - |

표에서 볼 수 있듯이 모든 `mouse<event>`에는 비슷한 역할을 하는 `pointer<event>`가 대응됩니다. 여기에 대응하는 `mouse...` 이벤트가 없는 포인터 이벤트도 세 가지 있는데, 곧 설명하겠습니다.

```smart header="코드에서 `mouse<event>`를 `pointer<event>`로 바꾸기"
코드에서 `mouse<event>` 이벤트를 `pointer<event>`로 바꿔도 마우스에서 계속 잘 동작합니다.

터치 기기 지원도 '마법처럼' 좋아집니다. 다만 CSS에서 몇 군데에 `touch-action: none`을 추가해야 할 수도 있습니다. 아래 `pointercancel`에서 다루겠습니다.
```

## 포인터 이벤트 프로퍼티

포인터 이벤트는 `clientX·clientY`, `target` 등 마우스 이벤트와 동일한 프로퍼티를 가지며, 여기에 몇 가지 프로퍼티가 더 있습니다.

- `pointerId` - 이벤트를 일으킨 포인터의 고유 식별자입니다.

    브라우저가 생성합니다. 스타일러스와 멀티 터치를 지원하는 터치스크린처럼 여러 포인터를 처리할 수 있게 해줍니다. 예시는 뒤에서 살펴보겠습니다.
- `pointerType` - 포인팅 기기의 유형입니다. 'mouse', 'pen', 'touch' 중 하나인 문자열이어야 합니다.

    이 프로퍼티를 사용하면 포인터 유형에 따라 다르게 반응할 수 있습니다.
- `isPrimary` - 주 포인터, 즉 멀티 터치에서 첫 번째 손가락이면 `true`입니다.

일부 포인터 기기는 접촉 면적과 압력을 측정합니다. 예를 들어 터치스크린에 닿은 손가락에 대해 다음과 같은 추가 프로퍼티가 있습니다.

- `width` - 포인터, 예를 들어 손가락이 기기에 닿은 영역의 너비입니다. 마우스처럼 지원되지 않을 때는 항상 `1`입니다.
- `height` - 포인터가 기기에 닿은 영역의 높이입니다. 지원되지 않을 때는 항상 `1`입니다.
- `pressure` - 포인터 끝의 압력으로, 범위는 0부터 1까지입니다. 압력을 지원하지 않는 기기에서는 값이 `0.5`(눌림) 또는 `0`입니다.
- `tangentialPressure` - 정규화된 접선 방향 압력입니다.
- `tiltX`, `tiltY`, `twist` - 펜이 표면을 기준으로 어떻게 놓였는지 설명하는 펜 전용 프로퍼티입니다.

이 프로퍼티들은 대부분의 기기에서 지원되지 않아 잘 사용되지 않습니다. 필요하다면 [명세](https://w3c.github.io/pointerevents/#pointerevent-interface)에서 자세한 내용을 확인할 수 있습니다.

## 멀티 터치

마우스 이벤트가 전혀 지원하지 않는 기능 중 하나가 멀티 터치입니다. 사용자는 휴대 전화나 태블릿에서 여러 곳을 동시에 터치하거나 특수 제스처를 수행할 수 있습니다.

포인터 이벤트는 `pointerId`와 `isPrimary` 프로퍼티를 활용해 멀티 터치를 처리할 수 있습니다.

사용자가 터치스크린의 한 지점을 터치한 뒤, 다른 손가락을 다른 지점에 올리면 다음과 같은 일이 발생합니다.

1. 첫 번째 손가락이 터치될 때
    - `isPrimary=true`와 어떤 `pointerId`를 가진 `pointerdown`이 발생합니다.
2. 첫 번째 손가락이 아직 닿아 있다고 가정하고 두 번째 손가락과 그 이후의 손가락이 터치된 경우
    - 손가락마다 `isPrimary=false`와 서로 다른 `pointerId`를 가진 `pointerdown`이 발생합니다.

주의할 점은 `pointerId`가 기기 전체가 아니라 터치 중인 각 손가락에 할당된다는 것입니다. 손가락 5개로 화면을 동시에 터치하면 `pointerdown` 이벤트가 5개 발생하고, 각 이벤트는 저마다의 좌표와 서로 다른 `pointerId`를 가집니다.

첫 번째 손가락과 관련된 이벤트는 항상 `isPrimary=true`를 가집니다.

`pointerId`를 사용하면 여러 손가락의 터치를 추적할 수 있습니다. 사용자가 손가락을 움직인 다음 떼면, `pointerdown`에서 받았던 것과 같은 `pointerId`를 가진 `pointermove`와 `pointerup` 이벤트가 발생합니다.

```online
`pointerdown`과 `pointerup` 이벤트를 기록하는 데모입니다.

[iframe src="multitouch" edit height=200]

참고로 `pointerId·isPrimary`의 차이를 실제로 확인하려면 휴대 전화나 태블릿 같은 터치스크린 기기를 사용해야 합니다. 마우스 같은 단일 터치 기기에서는 모든 포인터 이벤트에서 항상 같은 `pointerId`와 `isPrimary=true`가 사용됩니다.
```

## pointercancel 이벤트

`pointercancel` 이벤트는 포인터 상호작용이 진행 중일 때, 그 상호작용을 중단시키는 일이 발생해 더 이상 포인터 이벤트가 생성되지 않을 때 발생합니다.

원인은 다음과 같습니다.
- 포인터 기기 하드웨어가 물리적으로 비활성화된 경우
- 기기 방향이 바뀐 경우(태블릿 회전)
- 브라우저가 상호작용을 마우스 제스처나 확대축소 및 화면 이동 동작 등으로 보고 직접 처리하기로 한 경우

`pointercancel`이 어떤 영향을 주는지 실제 예시로 확인해 보겠습니다.

<info:mouse-drag-and-drop> 글의 초반부처럼 공을 드래그 앤 드롭하는 기능을 구현한다고 가정해 봅시다.

사용자 동작의 흐름과 그에 대응하는 이벤트는 다음과 같습니다.

1) 사용자가 이미지를 눌러 드래그를 시작합니다.
    - `pointerdown` 이벤트가 발생합니다.
2) 그런 다음 포인터를 움직이기 시작합니다. 따라서 이미지가 드래그됩니다.
    - `pointermove`가 발생합니다. 여러 번 발생할 수도 있습니다.
3) 그런데 여기서 예상치 못한 일이 벌어집니다! 브라우저에는 이미지를 위한 기본 드래그 앤 드롭 지원이 있는데, 이 기능이 드래그 앤 드롭 과정을 가로채면서 `pointercancel` 이벤트를 발생시킵니다.
    - 이제 브라우저가 이미지의 드래그 앤 드롭을 직접 처리합니다. 사용자는 공 이미지를 브라우저 밖으로 끌어내 메일 프로그램이나 파일 관리자에 놓을 수도 있습니다.
    - 더 이상 `pointermove` 이벤트는 발생하지 않습니다.

따라서 문제는 브라우저가 상호작용을 '가로챈다'라는 데 있습니다. '드래그 앤 드롭' 과정이 시작될 때 `pointercancel`이 발생하고, 이후에는 `pointermove` 이벤트가 더 이상 생성되지 않습니다.

```online
`textarea`에 포인터 이벤트(`up·down`, `move`, `cancel`만)를 기록하는 드래그 앤 드롭 데모입니다.

[iframe src="ball" height=240 edit]
```

직접 드래그 앤 드롭을 구현하려면 브라우저가 이를 가로채지 않도록 해야 합니다.

**`pointercancel`을 방지하려면 브라우저 기본 동작을 막으세요.**

두 가지 작업이 필요합니다.

1. 기본 드래그 앤 드롭이 발생하지 않도록 막습니다.
    - <info:mouse-drag-and-drop>에서 설명한 것처럼 `ball.ondragstart = () => false`를 설정하면 됩니다.
    - 마우스 이벤트에서는 이 방법이 잘 동작합니다.
2. 터치 기기에는 드래그 앤 드롭 외에도 터치와 관련된 다른 브라우저 동작이 있습니다. 이 동작 때문에 생기는 문제도 피하려면 다음과 같이 합니다.
    - CSS에서 `#ball { touch-action: none }`을 설정해 막습니다.
    - 그러면 코드가 터치 기기에서도 작동하기 시작합니다.

이렇게 하면 이벤트가 의도대로 동작하고, 브라우저가 상호작용을 가로채거나 `pointercancel`을 발생시키지 않습니다.

```online
이 데모는 위 코드를 추가한 버전입니다.

[iframe src="ball-2" height=240 edit]

보시다시피 더 이상 `pointercancel`은 발생하지 않습니다.
```

이제 실제로 공을 움직이는 코드를 추가할 수 있고, 드래그 앤 드롭이 마우스 기기와 터치 기기에서 모두 동작합니다.

## 포인터 캡처링

포인터 캡처링(Pointer capturing)은 포인터 이벤트의 특별한 기능입니다.

개념은 매우 단순하지만, 다른 이벤트 유형에는 이런 기능이 없어 처음에는 꽤 낯설어 보일 수 있습니다.

주요 메서드는 다음과 같습니다.
- `elem.setPointerCapture(pointerId)` -- 지정한 `pointerId`를 가진 이벤트를 `elem`에 바인딩합니다. 호출 이후에는 같은 `pointerId`를 가진 모든 포인터 이벤트가 실제로 문서 어디에서 발생했든 상관없이 `elem`을 타깃으로 갖습니다. 마치 `elem`에서 발생한 것처럼 처리됩니다.

다시 말해 `elem.setPointerCapture(pointerId)`는 이후에 발생하는, 지정한 `pointerId`를 가진 모든 이벤트의 타깃을 `elem`으로 재지정합니다.

바인딩은 다음과 같은 경우에 해제됩니다.
- `pointerup` 또는 `pointercancel` 이벤트가 발생하면 자동으로 해제됩니다.
- `elem`이 문서에서 제거되면 자동으로 해제됩니다.
- `elem.releasePointerCapture(pointerId)`가 호출되면 해제됩니다.

그렇다면 어디에 유용할까요? 실제 예시를 볼 차례입니다.

**포인터 캡처링은 드래그 앤 드롭 같은 상호작용을 단순화하는 데 사용할 수 있습니다.**

<info:mouse-drag-and-drop>에서 설명한 커스텀 슬라이더 구현 방법을 떠올려 봅시다.

막대를 나타내는 `slider` 요소와 그 안의 '러너'(`thumb`)를 만들 수 있습니다.

```html
<div class="slider">
  <div class="thumb"></div>
</div>
```

스타일을 적용하면 다음과 같습니다.

[iframe src="slider-html" height=40 edit]

<p></p>

마우스 이벤트를 유사한 포인터 이벤트로 바꾼 뒤의 동작 로직은 다음과 같습니다.

1. 사용자가 슬라이더 `thumb`을 누르면 `pointerdown`이 발생합니다.
2. 그런 다음 포인터를 움직이면 `pointermove`가 발생하고, 코드가 `thumb` 요소를 함께 움직입니다.
    - 포인터가 움직이다 보면 슬라이더 `thumb` 요소를 벗어나 위아래로 이동할 수 있습니다. 그래도 `thumb`은 포인터에 맞춰 정확히 수평 방향으로만 이동해야 합니다.

마우스 이벤트 기반 해결책에서는 포인터가 `thumb` 위아래로 이동하는 경우까지 포함해 모든 포인터 움직임을 추적하려고 전체 `document`에 `mousemove` 이벤트 핸들러를 할당해야 했습니다.

하지만 그다지 깔끔한 해결책은 아닙니다. 문제 중 하나는 사용자가 문서 여기저기로 포인터를 움직일 때 다른 요소의 이벤트 핸들러, 예를 들어 `mouseover`를 트리거 해 전혀 관련 없는 UI 기능을 실행할 수 있다는 점입니다. 이는 원하지 않는 동작입니다.

이럴 때 `setPointerCapture`가 등장합니다.

- `pointerdown` 핸들러에서 `thumb.setPointerCapture(event.pointerId)`를 호출합니다.
- 이후 `pointerup·pointercancel`까지의 포인터 이벤트는 `thumb`으로 재지정됩니다.
- `pointerup`이 발생하면, 즉 드래그가 완료되면 바인딩은 자동으로 해제되므로 신경 쓸 필요가 없습니다.

따라서 사용자가 문서 전체에서 포인터를 움직이더라도 이벤트 핸들러는 `thumb`에서 호출됩니다. 그럼에도 `clientX·clientY` 같은 이벤트 객체의 좌표 프로퍼티는 여전히 올바릅니다. 캡처링은 `target·currentTarget`에만 영향을 줍니다.

핵심 코드는 다음과 같습니다.

```js
thumb.onpointerdown = function(event) {
  // 모든 포인터 이벤트(pointerup까지)를 thumb으로 재지정합니다.
  thumb.setPointerCapture(event.pointerId);

  // 포인터 이동 추적을 시작합니다.
  thumb.onpointermove = function(event) {
    // 슬라이더 조작: 모든 포인터 이벤트가 thumb으로 재지정되므로 thumb에서 처리합니다.
    let newLeft = event.clientX - slider.getBoundingClientRect().left;
    thumb.style.left = newLeft + 'px';
  };

  // pointerup에서 포인터 이동 추적을 끝냅니다.
  thumb.onpointerup = function(event) {
    thumb.onpointermove = null;
    thumb.onpointerup = null;
    // 필요하다면 '드래그 종료'도 처리합니다.
  };
};

// thumb.releasePointerCapture를 호출할 필요는 없고,
// pointerup에서 자동으로 처리됩니다.
```

```online
전체 데모입니다.

[iframe src="slider" height=100 edit]

<p></p>

데모에는 현재 날짜를 보여주는 `onmouseover` 핸들러가 있는 추가 요소도 있습니다.

thumb을 드래그하는 동안 이 요소 위로 마우스를 올려도 핸들러가 *실행되지 않는다*는 점에 주목하세요.

`setPointerCapture` 덕분에 이제 드래그에 부작용이 없습니다.
```



결국 포인터 캡처링은 두 가지 이점을 줍니다.
1. 전체 `document`에 핸들러를 추가하거나 제거할 필요가 없어 코드가 더 깔끔해집니다. 바인딩은 자동으로 해제됩니다.
2. 문서에 다른 포인터 이벤트 핸들러가 있어도 사용자가 슬라이더를 드래그하는 동안 포인터 때문에 실수로 트리거 되지 않습니다.

### 포인터 캡처링 이벤트

빠짐없이 설명하기 위해 한 가지 더 언급하겠습니다.

포인터 캡처링과 관련된 이벤트는 두 가지입니다.

- `gotpointercapture`는 요소가 `setPointerCapture`를 사용해 캡처링을 활성화할 때 발생합니다.
- `lostpointercapture`는 캡처가 해제될 때 발생합니다. 해제는 `releasePointerCapture`를 직접 호출해서 이루어질 수도 있고, `pointerup`·`pointercancel` 시 자동으로 이루어질 수도 있습니다.

## 요약

포인터 이벤트를 사용하면 하나의 코드로 마우스, 터치, 펜 이벤트를 동시에 처리할 수 있습니다.

포인터 이벤트는 마우스 이벤트를 확장합니다. 이벤트 이름에서 `mouse`를 `pointer`로 바꾸어도 마우스에서 계속 동작하며, 다른 기기 유형에 대한 지원도 향상됩니다.

브라우저가 가로채서 직접 처리할 수 있는 드래그 앤 드롭과 복잡한 터치 상호작용에서는, 이벤트의 기본 동작을 취소하고 관련 요소에 CSS로 `touch-action: none`을 설정해야 한다는 점을 잊지 마세요.

포인터 이벤트의 추가 기능은 다음과 같습니다.

- `pointerId`와 `isPrimary`를 사용한 멀티 터치 지원
- `pressure`, `width·height` 등 기기별 프로퍼티
- 포인터 캡처링: `pointerup`·`pointercancel`까지 모든 포인터 이벤트를 특정 요소로 재지정할 수 있습니다.

현재 포인터 이벤트는 모든 주요 브라우저에서 지원되므로, 특히 Internet Explorer 10 이하와 Safari 12 이하를 지원할 필요가 없다면 안전하게 전환할 수 있습니다. 해당 브라우저에서도 포인터 이벤트 지원을 가능하게 해주는 폴리필이 있습니다.