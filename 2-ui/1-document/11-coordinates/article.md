# 좌표

요소를 움직이려면 좌표(coordinates)에 익숙해져야 합니다.

대부분의 자바스크립트 메서드는 다음 두 좌표 체계 중 하나를 이용합니다.

1. **창 기준** - `position:fixed`와 유사하게 창(window) 맨 위 왼쪽 모서리를 기준으로 좌표를 계산합니다.
    - 앞으로 우리는 이 좌표를 `clientX/clientY`로 표시할 예정인데, 왜 이런 이름을 쓰는지는 나중에 event 프로퍼티를 공부할 때 명확해집니다.
2. **문서 기준** - 문서(document) 최상단(root)에서 `position:absolute`를 사용하는 것과 비슷하게 문서 맨 위 왼쪽 모서리를 기준으로 좌표를 계산합니다.
    - 이 좌표는 `pageX/pageY`로 표시할 예정입니다.

스크롤을 움직이기 전에는 창의 맨 위 왼쪽 모서리가 문서의 맨 위 왼쪽 모서리와 정확히 일치합니다. 그런데 스크롤이 움직이면서 문서가 이동하면 문서 기준 좌표는 변경되지 않지만, 창 내 요소는 움직이기 때문에 창 기준 요소 좌표가 변경됩니다.

다음 그림은 문서 내 한 지점의 스크롤이 움직이기 전(왼쪽)과 후(오른쪽) 좌표를 보여줍니다.

![](document-and-window-coordinates-scrolled.svg)

문서가 스크롤 되었을 때:
- `pageY` - 문서 기준 좌표는 문서 맨 위(오른쪽 그림에선 스크롤 되어 보이지 않음)부터 계산되기 때문에 스크롤 후 값은 전과 동일합니다.
- `clientY` - 문서가 스크롤 되면서 해당 지점이 창 상단과 가까워졌기 때문에 창 기준 좌표가 변했습니다(화살표가 짧아짐).

## getBoundingClientRect로 요소 좌표 얻기

`elem.getBoundingClientRect()` 메서드는 `elem`을 감싸는 가장 작은 네모의 창 기준 좌표를 [DOMRect](https://www.w3.org/TR/geometry-1/#domrect) 클래스의 객체 형태로 반환합니다.

`DOMRect`의 주요 프로퍼티는 다음과 같습니다.

- `x`와 `y` -- 요소를 감싸는 네모의 창 기준 X, Y 좌표
- `width`와 `height` -- 요소를 감싸는 네모의 너비, 높이(음수도 가능)

`x`와 `y`, `width`와 `height` 이외에 다음과 같은 파생 프로퍼티도 있습니다.

- `top`과 `bottom` -- 요소를 감싸는 네모의 위쪽 모서리, 아래쪽 모서리의 Y 좌표
- `left`와 `right` -- 요소를 감싸는 네모의 왼쪽 모서리, 오른쪽 모서리의 X 좌표

```online
아래 버튼을 눌러 창 기준 버튼 좌표를 확인해봅시다.

<p><input id="brTest" type="button" value="button.getBoundingClientRect()로 버튼 좌표 얻기" onclick='showRect(this)'/></p>

<script>
function showRect(elem) {
  let r = elem.getBoundingClientRect();
  alert(`x:${r.x}
y:${r.y}
width:${r.width}
height:${r.height}
top:${r.top}
bottom:${r.bottom}
left:${r.left}
right:${r.right}
`);
}
</script>

페이지를 조금씩 스크롤 하면서 창 기준 버튼 위치를 변경하고 버튼을 누르면 좌푯값이 바뀌는 것을 확인할 수 있습니다(수직 스크롤 시 `y`, `top`, `bottom` 값이 변함).
```

`elem.getBoundingClientRect()`의 각 프로퍼티를 그림으로 표현하면 다음과 같습니다.

![](coordinates.svg)

그림을 통해 우리는 `x`, `y`와 `width`, `height` 만으로 네모 영역을 완전히 묘사할 수 있다는 사실을 알 수 있습니다. 아래 파생 프로퍼티들은 `x`, `y`, `width`, `height`를 사용해 쉽게 계산 가능합니다.

- `left = x`
- `top = y`
- `right = x + width`
- `bottom = y + height`

`elem.getBoundingClientRect()`를 사용할 때 주의사항은 다음과 같습니다.

- 좌표는 `10.5`처럼 소수일 수 있습니다. 브라우저는 좌표 계산에 소수를 사용하기 때문에 이는 정상입니다. 따라서 `style.left/top`을 사용할 때 값을 반올림할 필요가 없습니다.
- 좌표는 음수일 수 있습니다. 페이지가 스크롤 되어 `elem`이 window 위로 밀려났을 때 `elem.getBoundingClientRect().top`은 음수가 됩니다.

```smart header="왜 파생 프로퍼티가 필요한가요? `x`, `y`가 있는데 `top`, `left`는 왜 존재하나요?"
수학적으로 사각형은 시작 지점인 `(x,y)`와 방향 벡터 `(width,height)`만으로도 정의할 수 있는데, 파생 프로퍼티는 편의를 위해 존재합니다.

이론상 `width`와 `height`는 '방향이 있는' 사각형을 나타낼 때 음수가 될 수 있습니다(예시: 시작과 끝 지점을 지정하고 마우스로 드래그해 영역을 표시할 때).

사각형이 오른쪽 아래에서 시작해 왼쪽 위로 '올라가면' `width`와 `height`는 음수가 되죠.

`width`과 `height`가 음수인 사각형을 그림으로 나타내면 다음과 같습니다(`width=-200`, `height=-100`).

![](coordinates-negative.svg)

그림과 같은 사례에서 `left`와 `top`은 `x`나 `y`와 다릅니다.

이론상 차이가 있긴 하지만 실제 `elem.getBoundingClientRect()`의 `width`와 `height`는 항상 양수입니다. 여기선 파생 프로퍼티가 왜 따로 존재하는지를 설명하기 위해 `width`와 `height`가 음수인 사례를 살펴보았습니다.
```

```warn header="Internet Explorer는 `x`, `y`를 지원하지 않습니다."
Internet Explorer는 예전부터 `x`, `y` 프로퍼티를 지원하지 않았습니다.

Internet Explorer에선 `DomRect.prototype`에 getter를 추가해 폴리필을 만들거나 `elem.getBoundingClientRect()`의 `width`, `height`가 양수인 경우에 `top`, `left`는 `x`, `y`와 같다는 사실을 이용해 대신  `x`, `y` 대신 `top`, `left`를 사용합니다.
```

```warn header="right, bottom 좌표는 CSS position 프로퍼티와 다릅니다."
창 기준 좌표와 CSS `position:fixed` 사이에는 명백한 유사점이 있습니다.

그러나 CSS에서 `right` 프로퍼티는 오른쪽 모서리로부터의 거리, `bottom` 프로퍼티는 아래 모서리로부터의 거리를 의미합니다.

위 그림을 보면 그 차이를 한 번에 볼 수 있죠. 그러니 `right`, `bottom`을 포함한 창 기준 좌표를 사용할 땐 측정 기준이 왼쪽 위 모서리라는 사실에 주의해야 합니다.
```

## elementFromPoint(x, y) [#elementFromPoint]

`document.elementFromPoint(x, y)`을 호출하면 창 기준 좌표 `(x, y)`에서 가장 가까운 중첩 요소를 반환합니다.

문법은 다음과 같습니다.

```js
let elem = document.elementFromPoint(x, y);
```

아래 예시를 실행하면 창 정중앙에 있는 요소의 태그가 얼럿창에 출력되고, 해당 요소가 붉은색으로 강조됩니다.

```js run
let centerX = document.documentElement.clientWidth / 2;
let centerY = document.documentElement.clientHeight / 2;

let elem = document.elementFromPoint(centerX, centerY);

elem.style.background = "red";
alert(elem.tagName);
```

`document.elementFromPoint(x, y)`는 창 기준 좌표를 사용하기 때문에 현재 스크롤 위치에 강조되는 요소는 다를 수 있습니다. 

````warn header="창밖 좌표를 대상으로 `elementFromPoint`를 호출하면 `null`이 반환됩니다."
`document.elementFromPoint(x,y)` 메서드는 `(x,y)`가 보이는 영역 안(창 안)에 있을 때만 동작합니다.

좌표 중 하나라도 음수이거나 창의 너비, 높이를 벗어나면 `null`이 반환됩니다.

이런 특징을 모르고 코드를 짜면 다음과 같은 전형적인 실수를 하게 됩니다.

```js
let elem = document.elementFromPoint(x, y);
// 요소가 창 밖으로 나가면 lem = null
*!*
elem.style.background = ''; // 에러!
*/!*
```
````

## 요소를 창 내 특정 좌표에 고정하기

좌표는 대부분 무언가를 위치시키려는 목적으로 사용합니다.

요소 근처에 무언가를 표시할 때에는 `getBoundingClientRect`를 사용해 요소의 좌표를 얻고 CSS `position`을 `left/top`(또는 `right/bottom`)과 함께 사용해서 표시하죠.

예를 들어 아래 `createMessageUnder(elem, html)` 함수는 `elem` 아래쪽에 메시지를 표시합니다.

```js
let elem = document.getElementById("coords-show-mark");

function createMessageUnder(elem, html) {
  // 메시지가 담길 요소를 만듭니다.
  let message = document.createElement('div');
  // 요소를 스타일링 할 땐 css 클래스를 사용하는 게 좋습니다.
  message.style.cssText = "position:fixed; color: red";

*!*
  // 좌표를 지정합니다. 이때 "px"을 함께 써주는 걸 잊지 마세요!
  let coords = elem.getBoundingClientRect();

  message.style.left = coords.left + "px";
  message.style.top = coords.bottom + "px";
*/!*

  message.innerHTML = html;

  return message;
}

// 사용법: 
// 문서 안에 메시지를 띄우고, 5초 동안만 보여줍니다.
let message = createMessageUnder(elem, '독도는 우리땅!');
document.body.append(message);
setTimeout(() => message.remove(), 5000);
```

```online
직접 버튼을 눌러 위 예시를 실행해 봅시다.

<button id="coords-show-mark">id가 "coords-show-mark"인 버튼이 여기 있고, 메시지는 그 아래에 나타납니다.</button>
```

위 예시를 응용하면 메시지를 왼쪽 이나 오른쪽, 아래에 표시할 수도 있고 CSS 애니메이션을 적용하면 'fade-in' 등의 효과도 줄 수 있습니다. 좌푯값과 요소의 크기만 알면 손쉽게 원하는 것을 할 수 있죠.

그런데 예시에서 뭔가 부자연스러운 게 보입니다. 페이지를 스크롤 하면 메시지가 버튼에서 떨어지네요.

메시지가 버튼에서 떨어지는 이유는 아주 명확합니다. 메시지 요소가 `position:fixed`이기 때문에 페이지가 스크롤 되어도 창 기준 동일한 위치에 있기 때문입니다.

이런 부자연스러운 현상을 개선하려면 문서 기준 좌표와 `position:absolute`를 함께 사용해야 합니다.

## 문서 기준 좌표 [#getCoords]

문서 기준 좌표는 창이 아닌 문서 왼쪽 위 모서리부터 시작합니다.

CSS와 비교하자면 창 기준 좌표는 `position:fixed`에 해당하고 문서 기준 좌표는 맨 위 기준 `position:absolute`와 비슷합니다.

문서 내 특정 좌표에 무언가를 위치시키고 싶을 땐 `position:absolute`와 `top, `left`를 사용하면 스크롤 이동에 상관없이 해당 요소를 한 좌표에 머물게 할 수 있습니다. 그러려면 우선 정확한 좌표가 필요합니다.

그런데 요소의 문서 기준 좌표를 제공하는 표준 메서드가 아직 없습니다. 하지만 아주 쉽게 코드를 작성할 수 있습니다.

두 좌표 체계(창 기준 좌표와 문서 기준 좌표)는 다음 수식을 통해 연관시킬 수 있습니다.
- `pageY` = `clientY` + 문서에서 세로 방향 스크롤에 의해 밀려난 부분의 높이
- `pageX` = `clientX` + 문서에서 가로 방향 스크롤에 의해 밀려난 부분의 너비

다음 함수 `getCoords(elem)`는 `elem.getBoundingClientRect()`을 사용해 창 기준 좌표를 얻고 여기에 스크롤에 의해 가려진 영역의 너비나 높이를 더합니다.

```js
// 요소의 문서 기준 좌표를 얻습니다.
function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };
}
```

그런데 위 예시에서 `position:absolute`을 사용했다면 스크롤을 해도 메시지가 버튼 요소 근처에 머물렀을 겁니다.

이를 반영한 함수 `createMessageUnder`를 같이 살펴봅시다.

```js
function createMessageUnder(elem, html) {
  let message = document.createElement('div');
  message.style.cssText = "*!*position:absolute*/!*; color: red";

  let coords = *!*getCoords(elem);*/!*

  message.style.left = coords.left + "px";
  message.style.top = coords.bottom + "px";

  message.innerHTML = html;

  return message;
}
```

## 요약

페이지 내 모든 점은 다음과 같은 좌표를 갖습니다.

1. 창 기준 -- `elem.getBoundingClientRect()`
2. 문서 기준 -- `elem.getBoundingClientRect()`와 현재 스크롤 상태

창 기준 좌표는 `position:fixed`와 사용하면 좋고 문서 기준 좌표는 `position:absolute`와 사용하면 좋습니다.

두 좌표 체계 모두 장단점이 있습니다. CSS의 `position`, `absolute`, `fixed`처럼 이게 필요할 때도 있고 저게 필요할 때도 있습니다.