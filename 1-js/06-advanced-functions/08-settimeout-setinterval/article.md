# 스케줄링: setTimeout 과 setInterval

함수를 지금 당장 실행하는 것이 아니라 나중에 실행해야 될 때가 있습니다. 이것을 "호출 스케줄링" 라고 합니다.

이것을 구현하기 위한 두 가지 방법이 있습니다.

- `setTimeout` 일정 시간이 지난 후에 함수를 실행합니다.
- `setInterval` 실행되고 일정 시간 동안 함수를 계속 실행합니다.

이런 방법들은 자바스크립트의 규격은 아닙니다만 거의 모든 환경들이 내부 스케줄러와 지원하는 매서드들을 가지고 있습니다. 특별히, 대부분의 브라우저와 Node.JS 에서 지원됩니다.


## setTimeout

문법:

```js
let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...)
```

매개변수:

`func|code`
: 함수 또는 코드 문자열이 실행됩니다.
보통은 이건 함수입니다. 역사적인 이유로 코드의 문자열로 넘겨질 수도 있지만 추천되는 방법은 아닙니다. 

`delay`
: 실행하기 전에 밀리세컨드 단위로 딜레이를 줍니다. 기본값은 0 입니다.

`arg1`, `arg2`...
: 함수의 인수들(IE9 에서는 지원되지 않음).

예를 들면, 다음 코드는 1초후에 `sayHi()` 를 호출합니다.

```js run
function sayHi() {
  alert('Hello');
}

*!*
setTimeout(sayHi, 1000);
*/!*
```

인수들의 사용:

```js run
function sayHi(phrase, who) {
  alert( phrase + ', ' + who );
}

*!*
setTimeout(sayHi, 1000, "Hello", "John"); // Hello, John
*/!*
```

만약에 첫 번째 인수가 문자이면 자바스크립트는 함수를 생성합니다.

그래서 다음과 같이 해도 작동하게 됩니다:

```js run no-beautify
setTimeout("alert('Hello')", 1000);
```

그러나 문자열들을 사용하는 건 추천하지 않습니다. 다음과 같이 함수를 사용하는 것이 더 좋습니다.

```js run no-beautify
setTimeout(() => alert('Hello'), 1000);
```

````smart header="함수는 넘기지만 실행하면 안 됩니다"
초보 개발자들은 때때로 함수 뒤에 `()` 을 붙이는 실수를 합니다:

```js
// 잘못된 코드!
setTimeout(sayHi(), 1000);
```
`setTimeout` 가 함수를 참고하려고 하기 때문에 작동하지 않습니다. 그리고 여기서 `sayHi()`은 함수를 실행합니다.그런다음 *함수의 실행결과* 가 `setTimeout`으로 넘겨집니다. 이 경우에 `sayHi()`의 결과값은 `undefined` 입니다 (함수의 반환 값이 없기 때문에). 그래서 스케줄 되는 건 아무것도 없습니다.
````

### clearTimeout 로 취소하기

`setTimeout` 을 실행하면 "timer identifier" 를 반환합니다. 실행단계에서 `timeId`를 사용해서 취소할 수 있습니다.

취소하기 위한 문법:

```js
let timerId = setTimeout(...);
clearTimeout(timerId);
```

아래의 코드처럼 함수를 스케줄하고 취소할 수 있습니다(마음이 바뀌었을 때). 결과적으로 아무 일도 일어나지 않습니다.

```js run no-beautify
let timerId = setTimeout(() => alert("never happens"), 1000);
alert(timerId); // timer identifier

clearTimeout(timerId);
alert(timerId); // 똑같은 identifier (취소후에 null 값이 되지 않음)
```

`alert`결과로 the timer identifier는 숫자라는 것을 알 수 있습니다. 다른 환경에서는 조금 다를 수 있습니다. 예를 들면, Node.JS는 하나의 타이머 오브젝트를 추가적인 메서드들과 반환합니다.

그러나 다시 한번 얘기하자면 이러한 메서드들을 위한 보편적인 규격은 없습니다.

브라우저의 경우 타이머들은 [timers section](https://www.w3.org/TR/html5/webappapis.html#timers) 에서 HTML5 기본으로 기술되어 있습니다.

## setInterval

`setInterval` 메서드는 `setTimeout`과 똑같은 문법을 가지고 있습니다.

```js
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```

모든 변수는 똑같은 의미를 가지고 있습니다. 그라나 `setTimeout`은 함수를 단 한 번만 실행하지는 않는 대신, 주어진 일정 시간 동안 주기적으로 실행합니다.

호출된 것을 멈추려면 `clearInterval(timerId)`를 호출해야 합니다.

다음 예제는 메시지를 2초마다 보여줍니다. 5초 후에는 정지됩니다.

```js run
// 2초간격으로 반복
let timerId = setInterval(() => alert('tick'), 2000);

// 5초후에 정지
setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);
```

```smart header="크롬/오페라/사파리에서 모달 윈도는 시간을 정지시킵니다"
IE와 파이어폭스 브라우저의 내부 타이머는 `alert/confirm/prompt`를 보여주는 동안에도 틱 되고 있습니다. 그러나 크롬, 오페라, 사파리의 내부 타이머는 "정지" 됩니다.

그래서 위의 코드를 실행하고 `alert` 윈도를 바로 닫지 않으면 파이어폭스 / IE에서 경고가 즉시 표시됩니다.(이전 호출에서 2초가 경과 한) 크롬 / 오페라 / 사파리에서 - 2초 후에 (`alert` 중에는 타이머가 틱 되지 않음).
```

## 재귀적인 setTimeout

주기적으로 실행하게 하는 방법에는 크게 2가지가 있습니다.

하나는 `setInterval`이고 다른 하나는 `setTimeout`를 순회하는 것 입니다. 다음과 같습니다.

```js
/** instead of:
let timerId = setInterval(() => alert('tick'), 2000);
*/

let timerId = setTimeout(function tick() {
  alert('tick');
*!*
  timerId = setTimeout(tick, 2000); // (*)
*/!*
}, 2000);
```

위에 있는 `setTimeout` 스케줄러는 현재 마지막에 있는 `(*)` 후에 다음 호출을 실행합니다.

회귀적인 `setTimeout` 방법은 `setInterval`보다 유동적입니다. 이 방법은 다음 호출이 다르게 스케줄되었을때 사용됩니다. 현재 결과에 달린 것이죠.

예를 들면, 5초마다 데이터값을 얻기 위해 서버에 request를 보내는 서비스를 작성해야 한다고 할 때, 이때 서버는 오버로드 될 수 있고 이때는 시차를 10, 20, 40초로 증가시켜야 할 것입니다...

여기에 의사 코드가 있습니다:
```js
let delay = 5000;

let timerId = setTimeout(function request() {
  ...send request...

  if (request failed due to server overload) {
    // 다음 실행 간격을 늘립니다
    delay *= 2;
  }

  timerId = setTimeout(request, delay);

}, delay);
```


만약 CPU를 많이 소모하는 작업이라면, 실행단계에서 소모되는 시간을 측정할 수 있고 그것에 따라 호출을 먼저 할지 나중에 할지 계획을 세울 수 있을 것입니다.

**회귀적인 `setTimeout`은 다음 실행과의 사이에서 딜레이를 보장합니다. `setInterval`은 아닙니다.**

두 코드의 요소들을 비교해 보겠습니다. 첫 번째는 `setinterval`입니다:

```js
let i = 1;
setInterval(function() {
  func(i);
}, 100);
```

두 번째는 재귀적인 `setTimeout`입니다:

```js
let i = 1;
setTimeout(function run() {
  func(i);
  setTimeout(run, 100);
}, 100);
```

`setInterval` 은 내부적인 스케줄러가 `func(i)`를 100ms마다 실행합니다:

![](setinterval-interval.png)

알아차리셨나요?

**`setInterval`을 위한 `func`를 호출할 때 실제 딜레이는 코드에 있는 것보다 짧습니다!**

이건 정상입니다. 왜냐하면 `func`가 소모하는 시간은 내부적인 부분에서 실행단계가 "소모되는" 부분이기 때문입니다.

`func`의 실행이 예상하는 것보다 그리고 100ms보다 더 길어질 수도 있습니다.

이런 경우에는 엔진이 `func`이 끝날 때 까지 기다리고 스케줄러를 확인한 후에 시간이 다 되었으면 *바로* 다시 실행합니다.

이런 특수한 경우에는, 함수는 항상 `delay`ms 보다 늦게 실행됩니다, 그리고는 호출들이 모든 것을 멈추지 않고 계속될 것입니다.

회귀적인 `setTimeout`에 대한 그림이 있습니다:

![](settimeout-interval.png)

**회귀적인 `setTimeout`은 지정된 딜레이(여기서는 100ms)를 보장합니다**

왜냐하면 새로운 호출이 계획될 때는 이전 것이 끝나는 곳이기 때문입니다.

````smart header="Garbage collection"
함수가 `setInterval/setTimeout`으로 넘겨졌을 때, 내부참고가 생성되고 스케줄러에 저장됩니다.그것에 다른 참조가 없을지라도 함수가 가비지 컬렉션 되는 것으로 부터 막아줍니다. 

```js
// 다음 함수는 스케줄러가 호출할 때 까지 메모리에 상주합니다
setTimeout(function() {...}, 100);
```

`setInterval` 함수는 `clearInterval` 함수가 호출되기 전까지 메모리에 머무릅니다.

부작용은 있습니다. 함수가 외부 렉시컬 환경을 참조할 때, 그것이 살아있는 동안 외부 변수들도 살아있습니다.그것들은 함수 자신보다 많은 메모리를 잡아먹을 수 있습니다. 그래서 스케줄 된 함수가 더는 필요 없을 때는 그 함수가 아무리 작더라도 취소하는 게 좋습니다. 
````

## setTimeout(...,0)

`setTimeout(func, 0)` 라는 특별한 사용 예가 있습니다. 또는 간단히 `setTimeout(func)`.

이 스케줄러는 `func`를 가능한 빨리 실행합니다. 그러나 스케줄러는 현재 코드가 완료됬을 때만 그것을 부를 것입니다.

그래서 함수가 현재 코드가 "바로 끝나면" 실행되도록 스케줄 됩니다. 다른 말로 하면, *비동기적으로*.

예를 들면, 다음 코드는 "World" 다음에 "Hello"를 바로 출력합니다:

```js run
setTimeout(() => alert("World"));

alert("Hello");
```

첫 번째 줄이 "달력에 0ms가 지난 후에 호출을 하도록 넣습니다". 그러나 스케줄러는 "예약 확인" 을 오직 현재 코드가 완료되어야만 진행할 것입니다. `"Hello"` 가 먼저 출력되고 `"World"` 가 그 다음입니다.

### CPU 를 많이 잡아먹는 작업을 나누기

`setTimeout`을 이용해서 CPU를 많이 잡아먹는 작업을 나누는 편법이 있습니다.

예를 들면, (이 페이지의 코드 예제에 색을 입히는 데 사용되는) 구문 강조 스크립트는 상당히 CPU 소모가 많습니다. 코드를 강조하기 위해서는 특별한 분석이 실행되고, 색칠된 요소들을 많이 생성한 후 문서에 추가합니다. -- 큰 문서의 경우 엄청나게 큰 작업입니다. 아마도 브라우저가 "멈추는" 받아 들일 수 없는 경우가 생길 수도 있습니다.

그래서 긴 문장은 쪼개는 것이 좋습니다. 첫 번째 100줄까지, 그리고는 다음 100줄을 `setTimeout(..., 0)`를 사용해서 나눕니다. 그리고 반복합니다.

확실히 하기 위해, 간단한 예제를 보겠습니다. `1` 에서 `1000000000` 까지 세는 함수가 있습니다.

이것을 실행하면 CPU는 멈출것입니다. 서버쪽 JS는 확실히 이것을 알아차릴 수 있습니다. 그리고 만약에 브라우저에서 이것을 실행하고 다른화면의 버튼을 클릭하려고 하면 -- 전체 자바스크립트가 중지된 것을 볼수 있으, 완료 될 때가지 다른 행동들은 동작하지 않습니다.

```js run
let i = 0;

let start = Date.now();

function count() {

  // 무거운 작업을 진행
  for (let j = 0; j < 1e9; j++) {
    i++;
  }

  alert("Done in " + (Date.now() - start) + 'ms');
}

count();
```

브라우저는 아마도 "스크립트가 너무 오래 걸립니다"라는 경고를 보여줄지도 모릅니다. (그러나 숫자가 아주 크지는 않기 때문에, 아마도 아닐 것입니다).

중첩된 `setTimeout`을 이용해서 나누어 보겠습니다:

```js run
let i = 0;

let start = Date.now();

function count() {

  // 무거운 작업중의 일부를 진행 (*)
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

이제 브라우저 UI는 "숫자를 세는 동안에도" 완전히 작동합니다.

`(*)` 작업의 일부를 합니다:

1. 첫번째 실행: `i=1...1000000`.
2. 두번째 실행: `i=1000001..2000000`.
3. ...그리고 계속, `while`은 `i`가 `1000000` 으로 균등하게 나뉘어져 있는지 확인합니다.

그리고 끝나지 않았다면 다음 호출이 `(**)` 안에 스케줄 됩니다.

`count` 실행 사이의 일시 중지는 자바스크립트 엔진이 다른 작업을 수행하고 다른 사용자 작업에 반응할 수 있을 정도의 "숨실수" 있는 환경을 제공합니다.

중요한 것은 -- `setTimeout` 으로 작업을 나누든 나누지 않든 -- 속도 면에서 비슷하다는 것입니다. 전체 계산 시간에는 별다른 차이가 없습니다.

이것을 좀 더 알아보기 위해 개선해 보겠습니다.

`count()`의 초반에 스케줄 하는 부분을 옮기겠습니다:

```js run
let i = 0;

let start = Date.now();

function count() {

  // move the scheduling at the beginning
  if (i < 1e9 - 1e6) {
    setTimeout(count); // schedule the new call
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

이제 `count()`가 시작되고 `count()`가 더 필요하다는 걸 알게 됩니다, 작업을 하기 전에 그것을 바로 스케줄 합니다. 

만약에 실행하면, 훨씬 적은 시간이 걸리는 것을 쉽게 알 수 있습니다.

````smart header="브라우저에서 중첩된 타이머의 지연 최소화"
브라우저에는 중첩 타이머를 실행할 수 있는 빈도의 한계가 있습니다. [HTML5 standard](https://www.w3.org/TR/html5/webappapis.html#timers)에서 언급하길: "다섯 개의 중첩 된 타이머 이후에 간격은 적어도 4밀리 초가 되어야 합니다.".

아래 예를 통해 의미를 설명해 보겠습니다. `setTimeout` 호출은 `0ms` 후에 자신을 스케줄 합니다. 각 호출은 `times` 배열에 있는 이전 호출로부터 실시간을 기억합니다.  실제 지연은 어떠한가요? 살펴보겠습니다.

```js run
let start = Date.now();
let times = [];

setTimeout(function run() {
  times.push(Date.now() - start); // remember delay from the previous call

  if (start + 100 < Date.now()) alert(times); // show the delays after 100ms
  else setTimeout(run); // else re-schedule
});

// an example of the output:
// 1,1,1,1,9,15,20,24,30,35,40,45,50,55,59,64,70,75,80,85,90,95,100
```

첫 번째 타이머는 즉시 실행되고 (규격과 마찬가지로) 지연이 발생하고 '9, 15, 20, 24 ...'라고 표시됩니다. 이러한 제한은 오래전부터 전해왔으며 많은 스크립트가 사용하므로, 아직도 역사적인 이유로 남아있습니다.

서버 측 자바스크립트의 경우, 이러한 제한은 존재하지 않으며 즉시 비동기 작업을 스케줄 하는 다른 방법이 있습니다.

Node.JS 에는 [process.nextTick](https://nodejs.org/api/process.html) 와 [setImmediate](https://nodejs.org/api/timers.html) 가 있습니다. 그래서 위의 개념은 브라우저마다 다릅니다.
````

### 브라우저에서 렌더링 허용

브라우저 내 스크립트의 또 다른 이점은 진행률 표시처럼 사용자에게 무언가를 보여줄 수 있다는 것입니다. 스크립트가 완료된 후 브라우저가 일반적으로 "다시 그리기"를 실행하기 때문입니다.

따라서 하나의 커다란 기능을 수행하는 경우 무언가를 변경하더라도 변경 사항은 문서가 완료될 때까지 반영되지 않습니다.

여기 예제가 있습니다:
```html run
<div id="progress"></div>

<script>
  let i = 0;

  function count() {
    for (let j = 0; j < 1e6; j++) {
      i++;
      // put the current i into the <div>
      // (we'll talk more about innerHTML in the specific chapter, should be obvious here)
      progress.innerHTML = i;
    }
  }

  count();
</script>
```

실행하면 전체 카운트가 끝난 후 'i'의 변경 사항이 표시됩니다.

그리고 만약 `setTimeout`을 조각으로 나눠서 사용한다면, 변경이 실행 사이에 적용됩니다.

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

이제 `<div>` 는 `i` 의 값이 증가하는 것을 보여줍니다.

## 요약

- `setInterval(func, delay, ...args)` 와 `setTimeout(func, delay, ...args)` 메서드는 `delay` 밀리 세컨드만큼 후에 `func` 을 규칙적으로/ 또는 한번 실행되도록 허용한다.
- 실행을 취소하기 위해서는 `setInterval/setTimeout` 에서 반환된 값으로 `clearInterval/clearTimeout` 를 호출한다.
- 중첩된 `setTimeout` 은 `setInterval` 보다 더 나은 대안이 될 수 있습니다. 또한 실행단계들 *사이에서* 최소한의 시간을 보장한다.
- 시간 설정이 되지 않은 `setTimeout(...,0)` 은 "현재 코드가 완료된 후 가능한 한 빠르게" 호출하게 할 때 사용된다.

`setTimeout(...,0)`가 사용되는 경우:
- CPU를 많이 먹는 작업을 작게 나누어 스크립트가 "정지"하는 경우가 없게 할 때.
- 브라우저가 프로세스를 하는 동안(프로그레스 바를 칠하는 것 같은) 무언가 다른 것을 할 수 있게 하고 싶을 때.

모든 스케줄 하는 방법들은 정확한 딜레이를 *보장*하지 않습니다. 스케줄 된 코드에 그것을 의존해서는 안 됩니다.

예를 들면, 브라우저에 탑재된 타이머는 여러 가지 이유로 느려질 수 있습니다.
- CPU가 오버로드 되었다.
- 브라우저 탭이 백그라운드 모드가 되었다.
- 노트북이 배터리 모드 일 때.

최소한 브라우저 해상도와 설정에 따라 최소 타이머 해상도 (최소 지연 시간)를 300ms 또는 1000ms까지 늘릴 수 있습니다.
