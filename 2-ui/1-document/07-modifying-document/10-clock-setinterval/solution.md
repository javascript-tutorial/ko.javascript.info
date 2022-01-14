먼저 HTML·CSS를 만들어 줍니다.

시간을 구성하는 시, 분, 초는 각각 `<span>` 을 사용해 꾸밀 수 있습니다.

```html
<div id="clock">
  <span class="hour">hh</span>:<span class="min">mm</span>:<span class="sec">ss</span>
</div>
```

색을 입히기 위해서는 CSS가 필요합니다.
 
`setInterval`에 의해 매 초 호출되는 `update` 함수는 시각을 갱신합니다.

```js
function update() {
  let clock = document.getElementById('clock');
*!*
  let date = new Date(); // (*)
*/!*
  let hours = date.getHours();
  if (hours < 10) hours = '0' + hours;
  clock.children[0].innerHTML = hours;

  let minutes = date.getMinutes();
  if (minutes < 10) minutes = '0' + minutes;
  clock.children[1].innerHTML = minutes;

  let seconds = date.getSeconds();
  if (seconds < 10) seconds = '0' + seconds;
  clock.children[2].innerHTML = seconds;
}
```

`(*)`로 표시한 줄에서는 현재 날짜를 확인합니다. `setInterval`을 사용해 호출하면 지연이 생길 수 있기 때문에 신뢰성이 떨어집니다.

시계를 관리하는 함수 코드:

```js
let timerId;

function clockStart() { // run the clock
  timerId = setInterval(update, 1000);
  update(); // (*)
}

function clockStop() {
  clearInterval(timerId);
  timerId = null;
}
```

`update()`는 `clockStart()` 에서뿐만 아니라 `(*)`로 표시한 줄에서도 호출됩니다. 양쪽 모두에서 `update()`를 호출하지 않으면 `setInterval`이 실행되기 전까지 사용자는 아무런 내용이 없는 시계를 봐야 하기 때문입니다.