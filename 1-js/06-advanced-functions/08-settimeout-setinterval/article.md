# 스케줄링: setTimeout 과 setInterval

지금 당장이 아니라, 일정 시간 후에 함수를 실행해야 하는 경우가 있습니다. 이런 경우를 "호출 스케줄링(scheduling a call)"이라고 부릅니다.

호출 스케줄링을 구현하는 방법은 두 가지가 있습니다.

- `setTimeout`은 일정 시간이 지난 후에 함수를 실행합니다.
- `setInterval`은 일정 시간 간격으로 함수가 실행되도록 합니다.

이들은 자바스크립트 명세에서 정의된 메서드는 아닙니다. 하지만 대부분의 자바스크립트 실행 환경이 이와 유사한 메서드와 내부 스케줄러를 지원합니다. 모든 종류의 브라우저와 Node.js에서는 당연히 이 기능이 지원됩니다.  


## setTimeout

문법:

```js
let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...)
```

매개변수:

`func|code`
: 함수 또는 문자열 형태의 실행하고자 하는 코드
대게는 함수가 이 자리에 들어갑니다. 역사적인 이유로 문자열 형태의 코드를 받을 순 있지만, 추천하지는 않습니다.

`delay`
: 실행할 때까지 기다리는 시간으로, 밀리초(millisecond, 1000밀리초 = 1초) 단위가 사용됩니다. 기본값은 0입니다.

`arg1`, `arg2`...
: 함수의 인수들(사파리를 제외한 모든 데스크탑 브라우저와 IE10 이상에서 지원)

예를 들면, 다음 코드는 1초 후에 `sayHi()` 를 호출합니다.

```js run
function sayHi() {
  alert('Hello');
}

*!*
setTimeout(sayHi, 1000);
*/!*
```

인수 사용 예시:

```js run
function sayHi(phrase, who) {
  alert( phrase + ', ' + who );
}

*!*
setTimeout(sayHi, 1000, "Hello", "John"); // Hello, John
*/!*
```

첫 번째 인수가 문자열이면, 자바스크립트는 이 문자열을 이용해 함수를 만듭니다.

따라서, 다음과 같은 코드도 정상적으로 동작합니다.

```js run no-beautify
setTimeout("alert('Hello')", 1000);
```

그러나 문자열을 사용하는 건 추천하지 않습니다. 다음과 같이 함수 사용을 권합니다.

```js run no-beautify
setTimeout(() => alert('Hello'), 1000);
```

````smart header="함수를 넘기세요. 실행하면 안 됩니다."
초보 개발자는 함수 뒤에 `()` 을 붙이는 실수를 하곤 합니다.

```js
// 잘못된 코드
setTimeout(sayHi(), 1000);
```
`setTimeout`은 함수에 대한 참조값을 인수로 받길 원하는데 `sayHi()`는 함수를 실행하기 때문에 이 코드는 동작하지 않습니다. *함수의 실행 결과*가 `setTimeout`에 전달되기 때문입니다. `sayHi()`는 실제 아무런 값도 반환하지 않기 때문에 실행 결과는 `undefined`가 됩니다. 코드는 스케줄링할 대상을 갖지 못하게 됩니다.
````

### clearTimeout 로 취소하기

`setTimeout`을 호출하면 "타이머 식별자(timer identifier)"가 반환됩니다. 이 식별자 `timeId`는 실행을 취소할 때 사용할 수 있습니다.

실행 취소하기:

```js
let timerId = setTimeout(...);
clearTimeout(timerId);
```

아래 코드는 함수를 스케줄링한 후 (마음이 바뀌어) 취소한 경우를 나타냅니다. 결과적으로 아무 일도 일어나지 않습니다.

```js run no-beautify
let timerId = setTimeout(() => alert("never happens"), 1000);
alert(timerId); // 타이머 식별자

clearTimeout(timerId);
alert(timerId); // 동일 식별자 (취소 후에도 null 값이 되지 않습니다.)
```

`alert` 창을 통해 살펴봤듯이, 브라우저 환경에선 타이머 식별자가 숫자형 입니다. 다른 환경에선 숫자형이 아닐 수도 있습니다. Node.js에서는 추가 메서드와 함께 타이머 객체가 반환됩니다.

다시 한번 강조하자면, 이러한 메서드들에 대한 명세는 없습니다. 따라서 이런 차이가 문제가 되지는 않습니다.

다만, 브라우저 환경의 경우 HTML5 표준의 [timers section](https://www.w3.org/TR/html5/webappapis.html#timers)에서 타이머와 관련 메서드에 대해 기술하고 있으니 참고하시기 바랍니다.

## setInterval

`setInterval` 메서드와 `setTimeout`의 문법은 같습니다.

```js
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```

인수의 의미 역시 같습니다. 다만, `setTimeout`을 사용하면 함수가 일회만 실행되는 게 아니라, 일정 시간을 간격으로 주기적으로 실행됩니다.

추가 호출을 멈추려면 `clearInterval(timerId)`을 호출해야 합니다.

다음 예제는 메시지를 2초마다 보여줍니다. 5초 후에는 더는 함수가 호출되지 않습니다.

```js run
// 2초간격으로 반복
let timerId = setInterval(() => alert('tick'), 2000);

// 5초후에 정지
setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);
```

```smart header="`alert`창이 떠있는 상태에선 타이머가 멈추지 않습니다."
크롬과 파이어폭스를 포함한 대부분의 브라우저에서는 `alert/confirm/prompt` 창이 떠 있는 동안에도 내부 타이머가 멈추지 않고 "째깍거리며" 돌아갑니다.

위의 코드를 실행 하고, 얼마간 `alert` 창을 닫지 않고 있다가 창을 닫으면, 다음 `alert` 창이 바로 나타나는것을 통해 이를 확인할 수 있습니다. `alert` 창이 간의 간격은 5초보다 짧아집니다.
```

## 재귀적인 setTimeout

무언갈 규칙적으로 실행시키는 방법에는 크게 2가지가 있습니다.

하나는 `setInterval`이고, 다른 하나는 `setTimeout`를 재귀 실행 하는 것입니다. 예시를 통해 알아보도록 하겠습니다.

```js
/** let timerId = setInterval(() => alert('tick'), 2000);
대신에 아래와 같이 재귀를 이용할 수 있습니다.
*/

let timerId = setTimeout(function tick() {
  alert('tick');
*!*
  timerId = setTimeout(tick, 2000); // (*)
*/!*
}, 2000);
```

위의 `setTimeout`은 `(*)`로 표시한 줄의 호출이 끝나면 다음 호출을 계획합니다.

이렇게 재귀와 `setTimeout`을 함께 사용한 방법은 `setInterval`을 사용하는 것보다 융통성이 있습니다. 현재 호출의 결과에 따라 다음 호출을 다르게 스케줄링할 수 있기 때문입니다. 

데이터를 얻기 위해 5초마다 서버에 요청을 보내야 하는 서비스를 구현하고 있다고 가정해 봅시다. 서버가 과부하 상태라면 요청 간격을 10초, 20초, 40초 등으로 계속 증가시켜줘야 합니다. 

이를 구현한 의사 코드를 살펴봅시다.
```js
let delay = 5000;

let timerId = setTimeout(function request() {
  ...요청 전송...

  if (서버 과부하로 인해 요청이 실패함) {
    // 요청 간격을 늘립니다
    delay *= 2;
  }

  timerId = setTimeout(request, delay);

}, delay);
```


CPU를 많이 소모하는 작업을 주기적으로 해줘야 하는 경우에도, 실행에 걸리는 시간을 측정해 다음 호출을 언제 실행할지 계획할 수 있을 것입니다.

**재귀적인 `setTimeout`은 실행 간 지연 시간 간격을 보장하지만, `setInterval`은 아닙니다.**

두 코드 조각을 비교해 보시죠. 첫 번째 코드 조각은 `setinterval`을 이용한 예제입니다.

```js
let i = 1;
setInterval(function() {
  func(i);
}, 100);
```

두 번째는 재귀적인 `setTimeout`을 이용한 코드입니다.

```js
let i = 1;
setTimeout(function run() {
  func(i);
  setTimeout(run, 100);
}, 100);
```

`setInterval`을 이용한 예제에선, 내부 스케줄러가 `func(i)`를 100ms마다 실행합니다.

![](setinterval-interval.png)

알아차리셨나요?

**`setInterval`사용 시, `func`호출 이후에 실제 지연되는 시간은 코드에서 명시한 시간보다 짧습니다!**

이는 정상적인 동작입니다. `func`을 실행하는 데 소모되는 시간이 지연 시간에 포함되기 때문입니다.

그런데 `func` 실행에 걸리는 시간이 100ms보다 더 긴 경우도 있을 겁니다.

이때는, `func`이 끝날 때까지 엔진이 대기 상태에 있습니다. `func`이 끝나면 엔진은 스케줄러를 확인하고, 시간이 다 된 경우 다음 호출을 *바로* 진행합니다.

만약 호출해야 하는 모든 함수의 실행 시간이 명시한 `delay` 밀리초보다 길면, 쉼 없이 모든 함수가 연속적으로 호출되게 됩니다.

아래는 회귀적인 `setTimeout`을 묘사하는 그림입니다.

![](settimeout-interval.png)

**회귀적인 `setTimeout`에선 명시한 지연(여기서는 100ms)을 보장합니다.**

다음 호출에 대한 계획은 현재 함수의 실행이 끝난 이후에 만들어지기 때문입니다.  

````smart header="가비지 컬렉션"
함수를 `setInterval/setTimeout`으로 넘길 때, 함수에 대한 내부 참조가 만들어지고, 이 정보는 스케줄러에 저장됩니다. 이는 함수가 가비지 켤렉션의 대상이 되는 걸 막아줍니다. 해당 함수를 참조하는 것들이 없는 경우에도 말이죠.

```js
// 다음 함수는 스케줄러에 의해 호출될 때까지 메모리에 유지됩니다.
setTimeout(function() {...}, 100);
```

`setInterval`에 넘겨주는 함수는 `clearInterval`이 호출되기 전까지 메모리에 머무릅니다.

이런 동작 방식에는 부작용이 있습니다. 함수가 외부 렉시컬 환경을 참조하면서 메모리에 남아있으면, 외부 변수도 역시 메모리에 남게됩니다. 이렇게 메모리에 남아있는 외부 변수는 함수가 차지하는 메모리 공간보다 더 많은 메모리를 차지할 가능성이 있습니다. 이런 부작용을 방지하기 위해 더는 스케줄링할 필요가 없는 함수는 취소하는 게 좋습니다. 작은 함수라도 말이죠.
````

## setTimeout(...,0)

대기시간을 0으로 설정하는 `setTimeout(func, 0)`(또는 `setTimeout(func)`)을 사용하는 특별한 유스 케이스가 있습니다.

이렇게 하면 가능한 한 빨리 `func`의 실행을 예약합니다. 그러나 스케줄러는 현재 코드의 실행이 완료된 후에 예약된 함수를 실행합니다.

따라서 함수는 현재 코드가 종료된 직후에 실행되도록 예약됩니다. *비동기적으로* 실행되죠.

다음 코드는 "World"를 먼저 출력하고, 그 후에 "Hello"를 출력합니다.

```js run
setTimeout(() => alert("World"));

alert("Hello");
```

첫 번째 줄은 "'0ms 후에 함수 호출하기'라는 할 일을 다이어리에 기록"하는 것과 같습니다. 그런데 스케줄러는 현재 코드의 실행이 완료된 이후에 "다이어리에 적힌 할일 목록을 확인"합니다. 따라서 `"Hello"` 가 먼저 출력되고, `"World"`은 그 다음에 출력됩니다.

### CPU 소비가 많은 작업 분할하기

`setTimeout`을 이용하면 CPU 소비가 많은 작업을 분할 실행할 수 있습니다.

예제에서 코드의 일부에 색을 입혀 강조해주는 역할을 해주는 구문 강조 스크립트는 CPU 소비가 많은 작업입니다. 코드를 강조하기 위해 분석이 필요하고, 색이 입혀진 요소를 만들어야 하며, 이 요소를 문서에 추가해야 하기 때문입니다. 큰 텍스트라면 CPU 소모는 더 많겠죠. 브라우저를 "멈추게"까지도 할 수 있는 큰 작업입니다. 

이런 예기치 않은 상황을 방지하려면 강조할 텍스트를 쪼개는 것이 좋습니다. `setTimeout(..., 0)`을 사용해서 처음은 100줄, 두 번째는 그 다음 100줄, 세 번째는 그다음 100줄을 처리하도록 분할하면 되죠.

아직 좀 헷갈리실 수 있으니, 간단한 예제를 통해 어떻게 작업을 분할할 있을지 알아보겠습니다. 아래에 `1`부터 `1000000000` 까지 세는 함수가 구현되어있습니다.

함수를 실행하면 CPU는 이 함수를 처리하는데 매달리게 됩니다. 서버 사이드 JS에선 이런 현상이 뚜렷하죠. 브라우저 환경에서 이 함수를 실행하고 화면 내 다른 버튼을 클릭하면 전체 스크립트가 멈춘 것을 확인할 수 있습니다. 함수 실행이 완료될 때까지 다른 동작은 처리되지 않기 때문입니다.

```js run
let i = 0;

let start = Date.now();

function count() {

  // 무거운 작업 수행하기
  for (let j = 0; j < 1e9; j++) {
    i++;
  }

  alert("Done in " + (Date.now() - start) + 'ms');
}

count();
```

브라우저 환경이라면 "the script takes too long(스크립트 처리에 많은 시간이 소요됩니다.)"이라는 경고가 뜰지도 모릅니다. 세려는 숫자가 아주 크지는 않아서, 아마도 이 경고가 뜨지는 않을 겁니다. 

중첩 `setTimeout`으로 작업을 분할해 이 문제를 해결해보도록 하겠습니다.

```js run
let i = 0;

let start = Date.now();

function count() {

  // 무거운 작업의 일부를 수행 (*)
  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms');
  } else {
    setTimeout(count); // 새로운 호출을 스케줄 (**)
  }

}

count();
```

이제 "숫자를 세는 동안에도" 브라우저 UI는 멈춤 없이 제 기능을 다 합니다.

`(*)`에선 작업의 일부를 수행합니다.

1. 첫 번째 실행: `i=1...1000000`.
2. 두 번째 실행: `i=1000001..2000000`.
3. 이후에도 `while`에서 `i`가 `1000000`으로 나뉘어 있는지 계속 확인합니다.

숫자를 세는 작업이 종료될 때까지 다음 호출이 `(**)`에서 계획됩니다.

`count` 함수 실행 중간의 일시 중지는 자바스크립트 엔진에게 "한숨 돌릴 수 있는" 여유를 줍니다. 사용자 작업에 반응하는 것과 같은 작업은 이때 수행됩니다.

중요한 것은 `setTimeout` 으로 무거운 작업을 나누든 나누지 않든, 속도 면에서 비슷하다는 것입니다. 전체 계산 시간에는 큰 차이가 없습니다.

속도 차이를 좀 더 좁히기 위해 코드를 개선해보도록 하겠습니다.

스케줄링 관련 코드를 `count()` 시작 부분으로 옮겨보죠.

```js run
let i = 0;

let start = Date.now();

function count() {

  // setTimeout을 앞부분으로 옮김
  if (i < 1e9 - 1e6) {
    setTimeout(count); // 새로운 호출을 계획
  }

  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms');
  }

}

count();
```

`count()`가 실행되자마자 더 많은 `count()`를 실행해야 한다는 걸 바로 알 수 있게 되었습니다. 작업을 시작하기 전에 실행에 대한 계획을 세울 수 있게 되었네요.

코드를 개선하기 전보다 훨씬 적은 시간이 소모된 것을 확인하실 수 있습니다.

````smart header="브라우저에서 중첩 타이머의 최소 지연시간"
브라우저환경에선 중첩 타이머 실행 빈도에 제약이 있습니다. [HTML5 표준](https://www.w3.org/TR/html5/webappapis.html#timers)엔 "중첩 타이머 5개 이후엔, 간격은 적어도 4밀리초가 되어야 한다."라는 제약이 명시되어 있습니다.

아래 예시를 통해 의미를 파악해 봅시다. 아래 코드에서 `setTimeout`을 호출하면 `0ms` 후에 자신을 재스케줄링 합니다. 재스케줄링 된 호출 각각은 이전 호출과 자신 사이에 지연이 얼마나 있었는지를 `times` 배열에 기록합니다. 각 호출 간 지연은 어떤 패턴을 보였을까요? 살펴보겠습니다.

```js run
let start = Date.now();
let times = [];

setTimeout(function run() {
  times.push(Date.now() - start); // 이전 호출부터 걸린 지연을 기록

  if (start + 100 < Date.now()) alert(times); // 100ms후 지연 정보를 띄워줌
  else setTimeout(run); // 재스케줄링
});

// 출력창의 예시:
// 1,1,1,1,9,15,20,24,30,35,40,45,50,55,59,64,70,75,80,85,90,95,100
```

처음엔 지연 없이 즉시 되지만, 중첩 타이머가 5개가 되는 시점부턴 지연이 발생하기 시작합니다. '9, 15, 20, 24 ...'는 이를 보여주죠.

이러한 제약은 오래전부터 있었습니다. 기존에 작성된 상당수의 스크립트가 이 제약을 사용하고 있기 때문에, 아직 남아있습니다.

다만, 서버 환경에선 이런 제약이 없습니다. Node.js에선 [process.nextTick](https://nodejs.org/api/process.html)과 [setImmediate](https://nodejs.org/api/timers.html)을 이용해 지연 없이 비동기 작업을 스케줄링할 수 있습니다. 위에서 언급된 제약은 브라우저에 한정됩니다.
````

### 브라우저 렌더링 시간 확보하기

무거운 작업을 수행하는 브라우저 내 스크립트를 분할하면 진행률을 표시해주는 프로그레스바 같은 걸 사용자에게 보여줄 수 있어서 좋습니다.

브라우저는 대게 스크립트의 실행이 완료된 이후에 DOM을 "다시 그립니다". 따라서 요소 변경이 많은 하나의 거대한 함수를 실행하는 경우에, 스크립트가 완료될 때까지 변경 사항이 화면에 그려지지 못하죠.

이와 관련된 데모를 하나 보여드리겠습니다.
```html run
<div id="progress"></div>

<script>
  let i = 0;

  function count() {
    for (let j = 0; j < 1e6; j++) {
      i++;
      // 현재 i 값을 <div> 에 넣습니다.
      // (innerHTML에 대해선 추후 관련 챕터에서 자세히 알아보도록 하겠습니다. 여기선 innerHTML가 해당 요소에 값을 그려준다고만 알고 계셔도 됩니다.)
      progress.innerHTML = i;
    }
  }

  count();
</script>
```

전체 카운트가 끝난 후 'i' 값이 화면에 표시되는 걸 확인할 수 있습니다.

다음과 같이 `setTimeout`을 사용해 작업을 분할하고, 변경사항을 중간 중간 표시해주면, 사용자 입장에선 변경 사항을 눈으로 확인할 수 있어 좋습니다.

```html run
<div id="progress"></div>

<script>
  let i = 0;

  function count() {

    // do a piece of the heavy job (*)
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e9) {
      setTimeout(count);
    }

  }

  count();
</script>
```

이제 `<div>`에 `i` 값의 변경 사항이 표시됩니다.

## 요약

- `setInterval(func, delay, ...args)`과 `setTimeout(func, delay, ...args)` 메서드는 `delay` 밀리초 후에 `func`을 규칙적으로, 또는 한번 실행하도록 해줍니다.
- `setInterval/setTimeout`을 호출해 반환된 값을 `clearInterval/clearTimeout`에 넘겨주면 실행을 취소할 수 있습니다.
- 중첩 `setTimeout` 호출은 융통성 측면에서 `setInterval`보다 더 나은 대안입니다. 실행 *사이 간격*을 보장해 주는 것 또한 이점입니다.
- 중간 휴식이 없는 `setTimeout(func, 0)`(`setTimeout(func)`와 같음)은 "현재 코드가 완료된 후 가능한 한 빠르게" 다음 호출을 실행하고자 할 때 사용됩니다.

`setTimeout(func)` 유스 케이스:
- CPU 자원을 많이 소모하는 작업을 작게 나누어 CPU가 스크립트 처리에만 "매달리지" 않게 해주고자 할 때.
- 스크립트 처리가 진행되는 동안에 브라우저가 다른 작업을 할 수 있게 하고 싶을 때(예: 화면에 프로그레스 바 보여주기)

스케줄링을 다루는 모든 방법은 정확한 지연 시간을 *보장*하지 않습니다. 따라서 관련 코드에 지연시간 처리를 의존해서는 안 됩니다.

다양한 이유 때문에 브라우저 환경에서 타이머가 느려집니다. 몇 가지 예시를 살펴봅시다.
- CPU가 과부하 상태인 경우
- 브라우저 탭이 백그라운드 모드인 경우
- 노트북이 배터리에 의존해서 구동중인 경우

타이머는 최소 300ms, 심하면 1000ms까지 딜레이될 수 있습니다. 지연 시간은 브라우저와 사용 환경에 따라 달라집니다.