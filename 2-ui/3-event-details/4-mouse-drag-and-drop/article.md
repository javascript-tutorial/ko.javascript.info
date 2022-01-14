# 드래그 앤 드롭과 마우스 이벤트

드래그(drag)와 드롭(drop)은 사용자와 컴퓨터 간 상호작용을 도와주는 훌륭한 도구입니다. 파일 관리 애플리케이션에서 문서를 복사해 이동하는 것부터 주문하려는 물건을 장바구니에 드롭하는 것까지, 드래그와 드롭을 사용하면 아주 단순하고 명쾌하게 원하는 동작을 수행할 수 있습니다.

모던 HTML 표준에서는 `dragstart`, `dragend` 등의 특수한 이벤트와 함께 [드래그 앤 드롭](https://html.spec.whatwg.org/multipage/interaction.html#dnd)에 대한 절이 있습니다.

`dragstart`나 `dragend` 이벤트는 운영체제의 파일 관리 애플리케이션으로부터 파일을 드래그하여 브라우저 화면에 드롭하는 특별한 드래그 앤 드롭 기능을 제공합니다. 그러면 자바스크립트로 파일 관리 애플리케이션에서 드래그하여 가져온 파일의 내용을 다룰 수 있습니다.

하지만 기본 드래그 이벤트에는 한계가 있습니다. 예를 들어, 특정 영역에서 드래그하는 것을 막을 수 없습니다. 수평이나 수직으로만 드래그하는 것도 만들 수 없습니다. 이외에도 드래그 앤 드롭 기능으로 할 수 없는 작업이 많습니다. 모바일 환경에서의 지원도 많이 부족합니다.

기본 드래그 이벤트의 한계를 극복하기 위해 이번 챕터에서 마우스 이벤트를 사용하여 드래그 앤 드롭을 구현하는 방법을 알아보겠습니다.

## 드래그 앤 드롭 알고리즘

드래그 앤 드롭의 기본 알고리즘은 다음과 같습니다.

1. `mousedown`에서는 움직임이 필요한 요소를 준비합니다. 이때 기존 요소의 복사본을 만들거나, 해당 요소에 클래스를 추가하는 등 원하는 형태로 작업할 수 있습니다.
2. 이후 `mousemove`에서 `position:absolute`의 `left∙top`을 변경합니다.
3. `mouseup`에서는 드래그 앤 드롭 완료와 관련된 모든 작업을 수행합니다.

여기까지가 기본 알고리즘입니다. 이후에는 이동 중인 요소 아래에 있는 다른 요소를 강조하는 기능을 알아보겠습니다.

공을 드래그하는 구현 방법은 다음과 같습니다.

```js
ball.onmousedown = function(event) { 
  // (1) absolute 속성과 zIndex 프로퍼티를 수정해 공이 제일 위에서 움직이기 위한 준비를 합니다.
  ball.style.position = 'absolute';
  ball.style.zIndex = 1000;

  // 현재 위치한 부모에서 body로 직접 이동하여
  // body를 기준으로 위치를 지정합니다.
  document.body.append(ball);  

  // 공을 pageX, pageY 좌표 중앙에 위치하게 합니다.
  function moveAt(pageX, pageY) {
    ball.style.left = pageX - ball.offsetWidth / 2 + 'px';
    ball.style.top = pageY - ball.offsetHeight / 2 + 'px';
  }

  // 포인터 아래로 공을 이동시킵니다.
  moveAt(event.pageX, event.pageY);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // (2) mousemove로 공을 움직입니다.
  document.addEventListener('mousemove', onMouseMove);

  // (3) 공을 드롭하고, 불필요한 핸들러를 제거합니다.
  ball.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    ball.onmouseup = null;
  };

};
```

코드를 실행시켜보면 무언가 이상한 점이 보일 겁니다. 드래그 앤 드롭을 시작할 때 공을 찍어 올리고, 복사된 공을 드래그하기 시작합니다.

```online
예시:

[iframe src="ball" height=230]

마우스로 드래그 앤 드롭을 시도하면 공을 찍어 올려 복사된 공을 드래그하는 동작을 볼 수 있습니다.
```

브라우저 자체적으로 이미지나 요소에 대한 드래그 앤 드롭을 지원하기 때문입니다. 브라우저에서 제공하는 기능이 자동 실행되어 작성한 코드와 충돌되기 때문입니다.

비활성화 방법:

```js
ball.ondragstart = function() {
  return false;
};
```

이제 잘 됩니다.

```online
예시:

[iframe src="ball2" height=230]
```

다른 중요한 점은 `ball`이 아닌 `document`에서 `mousemove`를 추적하는 것입니다. 처음 볼 때 마우스가 항상 공 위에 있으며, 여기에 `mousemove`를 넣을 수 있습니다.

하지만 `mousemove`는 모든 픽셀에 대해 자주 트리거 되지 않습니다. 빠르게 움직이면 포인터가 공에서 document의 중간이나 윈도우 어딘가로 점프 되는 현상을 볼 수 있습니다.

document의 중간이나 윈도우 어딘가로 점프 되는 현상을 잡기 위해 document를 다뤄야 합니다.

## 올바른 위치 지정

위 예제 코드에서 공은 항상 포인터 아래로 이동합니다.

```js
ball.style.left = pageX - ball.offsetWidth / 2 + 'px';
ball.style.top = pageY - ball.offsetHeight / 2 + 'px';
```

나쁘진 않습니다. 다만, 몇 가지 부작용이 있습니다. 드래그 앤 드롭을 시작하기 위해 공 위 어디에서든 `mousedown`을 할 수 있습니다. 공의 가장자리에서 `mousedown`을 하게 되면, 마우스 포인터 아래로 공이 갑자기 점프 되는 부작용이 발생합니다.

포인터를 기준으로 요소의 초기 이동을 유지하는 방법이 포인터 중앙으로 요소를 이동시키는 방법보다 더 좋습니다.

예를 들어, 공의 가장자리에서 드래그하기 시작했다면 공을 드래그하는 동안 포인터는 공의 가장자리에 유지돼야 합니다.

![](ball_shift.svg)

개선된 알고리즘:

1. 방문자가 버튼을 눌렀을 때(`mousedown` 이벤트가 발생했을 때) - `shiftX∙shiftY` 변수에 pointer에서 공의 왼쪽 위 모서리까지의 거리를 기억합니다. 공을 드래그하는 동안 이 거리를 유지합니다.

   거리를 유지하는 움직임은 포인터의 좌표에서 공의 왼쪽 위 좌표를 빼서 구할 수 있습니다.

    ```js
    // onmousedown
    let shiftX = event.clientX - ball.getBoundingClientRect().left;
    let shiftY = event.clientY - ball.getBoundingClientRect().top;
    ```

2. 공을 드래그하는 동안 포인터를 기준으로 같은 위치에 공이 이동됩니다.

    ```js
    // onmousemove
    // 공은 고정된 포지션을 갖습니다.
    ball.style.left = event.pageX - *!*shiftX*/!* + 'px';
    ball.style.top = event.pageY - *!*shiftY*/!* + 'px';
    ```

개선된 위치 선정 최종 코드:

```js
ball.onmousedown = function(event) {

*!*
  let shiftX = event.clientX - ball.getBoundingClientRect().left;
  let shiftY = event.clientY - ball.getBoundingClientRect().top;
*/!*

  ball.style.position = 'absolute';
  ball.style.zIndex = 1000;
  document.body.append(ball);

  moveAt(event.pageX, event.pageY);

  // 초기 이동을 고려한 좌표 (pageX, pageY)에서
  // 공을 이동합니다.
  function moveAt(pageX, pageY) {
    ball.style.left = pageX - *!*shiftX*/!* + 'px';
    ball.style.top = pageY - *!*shiftY*/!* + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // mousemove로 공을 움직입니다.
  document.addEventListener('mousemove', onMouseMove);

  // 공을 드롭하고, 불필요한 핸들러를 제거합니다.
  ball.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    ball.onmouseup = null;
  };

};

ball.ondragstart = function() {
  return false;
};
```

```online
예시 (inside `<iframe>`):

[iframe src="ball3" height=230]
```

공의 오른쪽 아래 모서리로 드래그하면 눈에 띄게 차이가 보입니다. 이전 예제에서는 공이 포인터 아래로 점프했습니다. 이제는 현재 위치에서 포인터를 부드럽게 따라갑니다.

## 잠재적 드롭 대상(드롭 가능)

지금까지 봐왔던 예제에서는 공을 '어디서나' 드롭할 수 있었습니다. '파일'을 '폴더'나 다른 곳에 놓듯 실생활에서는 보통 한 요소를 다른 요소에 드롭합니다.

요약하면, '드래그 가능한' 요소를 '드롭 가능한' 요소에 둡니다.

알아야 할 것:
- 해당 작업을 수행하기 위해 드래그 앤 드롭 끝에 요소가 드롭될 위치
- 드롭 가능한 위치에 끌고 와 올려뒀을 때 드롭 할 수 있는지 알 수 있게 강조 표시

요소를 드롭할 수 있는 곳을 강조하는 방법은 흥미롭지만 약간 까다롭습니다. 여기서 다뤄보도록 하겠습니다.

처음에 여러분이 생각한 방법은 무엇인가요? 잠재적으로 놓을 수 있는 요소에 `mouseover∙mouseup` 핸들러를 설정해야 할까요?

하지만 동작하지 않습니다.

드래그하는 동안 드래그 할 수 있는 요소가 항상 다른 요소 위에 있다는 것이 문제가 됩니다. 마우스 이벤트의 맨 위 요소에서만 이벤트가 발생하며, 맨 위 요소의 아래에는 이벤트가 발생하지 않습니다.

예를 들면, 아래 두 개의 `<div>` 요소가 있으며, 파란색 요소 전체를 덮는 빨간색 요소가 있습니다. 빨간색 요소가 제일 위에 있어서 파란색 요소의 이벤트를 잡을 방법이 없습니다.

```html run autorun height=60
<style>
  div {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 0;
  }
</style>
<div style="background:blue" onmouseover="alert('never works')"></div>
<div style="background:red" onmouseover="alert('over red!')"></div>
```

드래그할 수 있는 요소도 빨간색 요소가 파란색 요소를 덮은 예제와 같습니다. 공은 항상 다른 요소 위에 있어 이벤트가 발생합니다. 반면에 하위 요소에 설정한 어떠한 핸들러도 동작하지 않습니다.

그러므로 잠재적 드롭 가능한 요소에 핸들러를 넣는 처음에 생각했던 방법은 실제로 동작하지 않습니다. 실행되지 않을 것입니다.

그러면 무엇을 해야 할까요?

`document.elementFromPoint(clientX, clientY)`라는 메서드가 있습니다. 주어진 윈도우 기준 좌표에서 가장 많이 중첩된 요소를 반환합니다. (윈도우 밖의 좌표는 null)

다음과 같이 마우스 이벤트 핸들러에서 포인터 아래에 드롭 가능성을 감지할 수 있습니다.

```js
// 마우스 이벤트 핸들러에서
ball.hidden = true; // (*) 드래그하는 요소를 숨깁니다.

let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
// elemBelow는 드롭 할 수 있는 공의 아래 요소입니다.

ball.hidden = false;
```

참고: `(*)`을 호출하기 전에 공을 숨겨야 합니다. 그렇지 않으면 공은 보통 포인터 아래의 맨 위 요소로 `elemBelow=ball`의 좌표를 가집니다. 그래서 공을 숨겼다가 다시 보여줍니다.

이 코드를 사용하면 언제든지 어떤 요소가 날아가는지 확인할 수 있습니다. 드롭이 발생했을 때 처리합니다.

'드롭 가능한' 요소를 찾기 위한 `onMouseMove` 확장 코드:

```js
// 즉시 날아가는 잠재적 드롭 가능한 요소
let currentDroppable = null;

function onMouseMove(event) {
  moveAt(event.pageX, event.pageY);

  ball.hidden = true;
  let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
  ball.hidden = false;

  // 마우스 이벤트는 윈도우 밖으로 트리거 될 수 없습니다.(공을 윈도우 밖으로 드래그 했을 때)
  // clientX∙clientY가 윈도우 밖에 있으면, elementFromPoint는 null을 반환합니다.
  if (!elemBelow) return;

  // 잠재적으로 드롭 할 수 있는 요소를 'droppable' 클래스로 지정합니다.(다른 로직 가능)
  let droppableBelow = elemBelow.closest('.droppable');

  if (currentDroppable != droppableBelow) {
    // 들어오거나 날리거나...
    // 참고: 두 값 모두 null일 수 있습니다.
    //   currentDroppable=null 이벤트 전에 놓을 수 있는 요소 위에 있지 않다면(예: 빈 공간)
    //   droppableBelow=null 이벤트 동안 놓을 수 있는 요소 위에 있지 않다면

    if (currentDroppable) {
      // '날아가는 것'을 처리하는 로직(강조 제거)
      leaveDroppable(currentDroppable);
    }
    currentDroppable = droppableBelow;
    if (currentDroppable) {
      // '들어오는 것'을 처리하는 로직
      enterDroppable(currentDroppable);
    }
  }
}
```

아래 예시에서 공을 축구 골대 위로 드래그하면 골대가 강조 표시됩니다.

[codetabs height=250 src="ball4"]

이제 전체 프로세스가 진행되는 동안 `currentDroppable`변수에 날아가는 현재 드롭 대상이 있으며, 강조 혹은 다른 항목을 사용할 수 있습니다.

## Summary

드래그 앤 드롭 기본 알고리즘을 생각했습니다.

핵심요소:

1. 이벤트 흐름: `ball.mousedown` -> `document.mousemove` -> `ball.mouseup`(`ondragstart`를 취소하는 걸 잊지 마세요)
2. 드래그 시작 시 요소를 기준으로 포인터의 초기 이동을 기억하고 (`shiftX∙shiftY`) 드래그하는 동안 유지합니다.
3. `document.elementFromPoint`를 사용해 포인터 아래의 드롭할 수 있는 요소를 감지합니다.

이 기반으로 많은 것을 둘 수 있습니다.

- `mouseup`에서 데이터를 변경하고, 요소를 이동하는 등 지적으로 드롭을 마칠 수 있습니다.
- 날아가는 요소를 강조할 수 있습니다.
- 특정 영역이나 방향으로 드래그하는 것을 제한할 수 있습니다.
- `mousedown/up`에 이벤트 위임을 사용할 수 있습니다. `event.target`을 확인하는 넓은 영역의 이벤트 핸들러는 수백 개의 요소에 대한 드래그 앤 드롭을 관리할 수 있습니다.
- 등등

`DragZone`, `Droppable`, `Draggable` 및 기타 클래스 등 아키텍처를 구축하는 프레임워크가 있습니다. 대부분은 앞서 드래그와 드롭에 대한 설명과 유사한 작업을 하므로 이해하기 쉽습니다. 때로는 제3의 솔루션 적용보다 쉽게 수행할 수 있습니다.
