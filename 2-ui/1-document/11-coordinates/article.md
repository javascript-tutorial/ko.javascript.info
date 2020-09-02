# 좌표

요소를 움직이려면 좌표에 익숙해져야 합니다.

대부분의 자바스크립트 메서드는 다음 두 좌표 체계 중 하나를 이용합니다.

1. **window 기준** - `position:fixed`와 유사하게 window 상단/왼쪽 모서리에서부터 계산합니다.
    - 앞으로는 이 좌표를 `clientX/clientY`로 표시하며 왜 이런 이름을 쓰는지는 나중에 event 프로퍼티를 공부할 때 명확히 알게 됩니다.
2. **document 기준** - document 최상단(root)에서 `position:absolute`를 사용하는 것과 비슷하게 document 상단/왼쪽 모서리에서부터 계산합니다.
    - 앞으로는 `pageX/pageY`로 표시합니다.

스크롤을 움직이기 바로 전에는 window 상단/왼쪽 모서리가 document 상단/왼쪽 모서리와 정확히 일치합니다. 그런데 스크롤이 움직이기 시작하면 document가 움직이기 때문에 document 기준 좌표는 그대로이지만 요소의 window 기준 좌표는 바뀝니다.

다음 그림은 document 내 한 지점을 잡고 나서 스크롤 전(왼쪽)과 후(오른쪽)의 좌표를 보여줍니다.

![](document-and-window-coordinates-scrolled.svg)

document가 스크롤 될 때
- `pageY` - document 기준 좌표는 document 상단(스크롤 되어 밀려남)에서부터 계산되어 동일합니다.
- `clientY` - window 기준 좌표는 해당 지점이 window 상단과 가까워지면서 변화(화살표가 짧아짐)되었습니다.

## getBoundingClientRect로 요소 좌표 얻기

`elem.getBoundingClientRect()` 메서드는 `elem`을 감쌀 수 있는 가장 작은 네모영역의 window 기준 좌표를 [DOMRect](https://www.w3.org/TR/geometry-1/#domrect) 클래스의 객체로 반환합니다.

`DOMRect` 주요 프로퍼티는 다음과 같습니다.

- `x/y` -- 네모영역의 window 기준 X/Y 좌표
- `width/height` -- 네모영역의 너비/높이(음수 가능)

`x/y`, `width/height` 말고 다음과 같은 프로퍼티도 있습니다.

- `top/bottom` -- 네모영역 상단/하단 모서리의 Y 좌표
- `left/right` -- 네모영역 왼쪽/오른쪽 모서리의 X 좌표

```online
이 버튼을 누르면 버튼의 window 기준 좌표를 예시로 보여줍니다.

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

페이지를 스크롤 하여 반복해보면 버튼의 위치가 달라지면서 window 기준 좌표(수직 스크롤 시 `y/top/bottom`)도 바뀌는 것을 알 수 있습니다.
```

다음 그림은 `elem.getBoundingClientRect()`의 결과입니다.

![](coordinates.svg)

보이는 것처럼 `x/y`와 `width/height` 만으로 네모 영역을 완전히 묘사할 수 있습니다. 파생된 프로퍼티는 이들로부터 쉽게 계산 가능한 값입니다.

- `left = x`
- `top = y`
- `right = x + width`
- `bottom = y + height`

다음을 주의하세요.

- 좌표는 `10.5`처럼 소수도 가능합니다. 소수는 정상적인 값이며 브라우저는 내부 계산에 소수를 사용합니다. 따라서 `style.left/top`를 설정할 때 반올림할 필요가 없습니다.
- 좌표는 음수일 수 있습니다. 가령 페이지가 스크롤 되어 `elem`이 window 위로 밀려났을 때 `elem.getBoundingClientRect().top`는 음수가 됩니다.

```smart header="왜 파생된 프로퍼티가 필요한가요? `x/y`가 있는데 `top/left`가 왜 존재하나요?"
수학적으로 사각형은 시작 지점인 `(x,y)`와 방향 벡터 `(width,height)`만으로도 정의됩니다. 즉 파생된 프로퍼티는 편의를 위한 목적으로 사용합니다.

이론적으로 `width/height`는 '방향이 있는' 사각형을 나타낼 때 음수가 될 수 있습니다. 예를 들어 마우스로 시작과 끝 지점을 지정하여 선택 영역을 표시할 때 사용할 수 있습니다.

사각형이 하단 오른쪽에서 시작하여 상단 왼쪽으로 '올라가면' `width/height`는 음수 값입니다.

다음은 `width`과 `height`가 음수 값인 사각형입니다(`width=-200`, `height=-100`).

![](coordinates-negative.svg)

보이는 것처럼 이런 예시에서는 `left/top`은 `x/y`와 같은 값이 아닙니다.

그러나 실제로는 `elem.getBoundingClientRect()`는 항상 양수의 width/height 값을 반환하며 여기에서는 같아 보이는 프로퍼티가 왜 중복이 아닌지를 설명하기 위해 `width/height` 음수 값을 언급했습니다.
```

```warn header="Internet Internet Explorer는 `x/y`를 지원하지 않습니다."
Internet Explorer는 예전부터 `x/y` 프로퍼티를 지원하지 않아 왔습니다.

그래서 `DomRect.prototype`에 getter를 추가해 폴리필을 만들거나 `elem.getBoundingClientRect()`를 호출하면 그 결괏값의 `width/height`가 양수라는 특징을 이용해 `x/y`대신 `top/left`을 이용합니다.
```

```warn header="right/bottom 좌표는 CSS position 프로퍼티와는 다릅니다."
window 기준 좌표와 CSS `position:fixed` 사이에는 명백한 유사점이 있습니다.

그러나 CSS position에서는 `right` 프로퍼티는 오른쪽 모서리로부터의 거리, `bottom` 프로퍼티는 하단 모서리로부터의 거리를 의미합니다.

위에 있는 그림만 보더라도 자바스크립트에서는 의미가 다름을 알 수 있습니다. `right`, `bottom` 프로퍼티를 포함한 모든 window 기준 좌표는 상단 왼쪽 시작점에서부터 계산됩니다.
```

## elementFromPoint(x, y) [#elementFromPoint]

`document.elementFromPoint(x, y)`을 호출하면 window 기준 좌표 `(x, y)`에 있는 요소를 중첩 최하위에 있는 요소로 반환합니다.

문법은 다음과 같습니다.

```js
let elem = document.elementFromPoint(x, y);
```

예를 들어 아래 코드는 지금 window 정중앙에 있는 요소의 태그를 강조해서 표시하고 태그 이름을 출력합니다.

```js run
let centerX = document.documentElement.clientWidth / 2;
let centerY = document.documentElement.clientHeight / 2;

let elem = document.elementFromPoint(centerX, centerY);

elem.style.background = "red";
alert(elem.tagName);
```

window 좌표를 사용하기 때문에 요소는 현재 스크롤하고 있는 위치에 따라 다를 수 있습니다. 

````warn header="window 밖으로 나간 좌표에서 `elementFromPoint`는 `null`을 반환합니다."
`document.elementFromPoint(x,y)` 메서드는 `(x,y)`가 보이는 영역 안에 있을 때에만 동작합니다.

좌표 중 하나라도 음수이거나 window의 너비/넓이를 벗어나면 `null`을 반환합니다.

다음은 확인하지 않았을 때 나타날 수 있는 전형적인 에러입니다.

```js
let elem = document.elementFromPoint(x, y);
// 좌표가 window 밖으로 나가면 elem = null
*!*
elem.style.background = ''; // 에러!
*/!*
```
````

## '고정(fixed)' 위치 지정에 사용하기

좌표는 대부분 무언가를 위치시키려는 목적으로 사용합니다.

요소 근처에 무언가를 표시할 때에는 `getBoundingClientRect`를 사용해 요소의 좌표를 얻고 CSS `position`을 `left/top`(또는 `right/bottom`)과 함께 사용해서 표시합니다.

예를 들어 아래 `createMessageUnder(elem, html)` 함수는 `elem` 아래쪽에 메시지를 표시합니다.

```js
let elem = document.getElementById("coords-show-mark");

function createMessageUnder(elem, html) {
  // 메시지 요소를 생성합니다.
  let message = document.createElement('div');
  // 여기에 스타일을 지정할 때에는 css 클래스를 사용하는 게 좋습니다.
  message.style.cssText = "position:fixed; color: red";

*!*
  // 좌표를 지정합니다. "px"를 잊지 마세요!
  let coords = elem.getBoundingClientRect();

  message.style.left = coords.left + "px";
  message.style.top = coords.bottom + "px";
*/!*

  message.innerHTML = html;

  return message;
}

// 쓰임새 : 
// document 안에 5초 동안만 추가합니다.
let message = createMessageUnder(elem, 'Hello, world!');
document.body.append(message);
setTimeout(() => message.remove(), 5000);
```

```online
실행하려면 버튼을 누르세요.

<button id="coords-show-mark">id="coords-show-mark"인 버튼이고 메시지는 그 아래에 나타납니다.</button>
```

코드를 수정하면 왼쪽, 오른쪽, 아래쪽에 메시지를 표시할 수 있고 CSS 애니메이션을 적용하여 '페이드 인' 등도 할 수 있습니다. 모든 좌푯값과 요소의 크기만 알면 쉽게 할 수 있습니다.

그러나 중요한 주의사항이 있습니다. 페이지를 스크롤 하면 메시지가 버튼에서 떨어지게 됩니다.

이유는 분명합니다. 메시지 요소가 `position:fixed`이기 때문에 페이지가 스크롤 되어도 window 기준으로 같은 지점에 남아 있게 됩니다.

이것을 바꾸고 싶으면 document 기반 좌표와 `position:absolute`를 사용해야 합니다.

## document 좌표 [#getCoords]

document 기준 좌표는 window가 아닌 document 상단 왼쪽 모서리에서부터 시작합니다.

CSS로 따지면 window 좌표는 `position:fixed`에 해당하고 document 좌표는 상단에서부터의 `position:absolute`와 비슷합니다.

document의 특정 지점에 무언가를 위치시킬 때 `position:absolute`와 `top/left`를 사용하면 페이지를 스크롤 해도 한자리에 있게 할 수 있습니다. 그러려면 우선 정확한 좌표가 있어야 합니다.

요소의 document 좌표를 얻는 표준 메서드는 없습니다. 하지만 쉽게 작성할 수 있습니다.

두 좌표 체계는 다음 수식에 의해 연관됩니다.
- `pageY` = `clientY` + document에서 스크롤 되어 수직으로 밀려난 부분의 높이
- `pageX` = `clientX` + document에서 스크롤 되어 수평으로 밀려난 부분의 너비

다음 `getCoords(elem)` 함수는 `elem.getBoundingClientRect()`에서 window 좌표를 얻고 여기에 현재 스크롤 된 위치를 더합니다.

```js
// 요소의 document 좌표를 얻습니다
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

위의 예제에서 `position:absolute`을 사용했다면 메시지는 스크롤을 해도 요소 근처에 머물게 됩니다.

다음은 수정된 `createMessageUnder` 함수입니다.

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

페이지의 어떤 지점이라도 다음 좌표를 갖습니다.

1. window 기준 -- `elem.getBoundingClientRect()`
2. document 기준 -- `elem.getBoundingClientRect()` + 현재 페이지 스크롤 위치

window 좌표는 `position:fixed`와 사용하기 좋고 document 좌표는 `position:absolute`와 사용하기 좋습니다.

두 좌표 체계 모두 장단점이 있습니다. CSS의 `position`, `absolute`, `fixed`처럼 이게 필요할 때도 있고 저게 필요할 때도 있습니다.