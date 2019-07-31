# 스케줄링: setTimeout 과 setInterval

지금 당장이 아니라, 일정 시간 후에 함수를 실행해야 하는 경우가 있습니다. 이런 경우를 "호출 스케줄링(scheduling a call)"이라고 부릅니다.

호출 스케줄링을 구현하는 방법은 두 가지가 있습니다.

- `setTimeout`은 일정 시간이 지난 후에 함수를 실행합니다.
- `setInterval`은 일정 시간 간격으로 함수가 실행되도록 합니다.

These methods are not a part of JavaScript specification. But most environments have the internal scheduler and provide these methods. In particular, they are supported in all browsers and Node.js.

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
: 함수의 인수(사파리를 제외한 모든 데스크탑 브라우저와 IE10 이상에서 지원)

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

`setTimeout`의 첫 번째 인수가 문자열이면, 자바스크립트는 이 문자열을 이용해 함수를 만듭니다.

따라서, 다음과 같은 코드도 정상적으로 동작합니다.

```js run no-beautify
setTimeout("alert('Hello')", 1000);
```

그러나 문자열을 사용하는 건 추천하지 않습니다. 다음과 같이 함수 사용을 권합니다.

```js run no-beautify
setTimeout(() => alert('Hello'), 1000);
```

````smart header="함수를 넘기세요. 다만, 실행하면 안 됩니다."
초보 개발자는 함수 뒤에 `()` 을 붙이는 실수를 하곤 합니다.

```js
// 잘못된 코드
setTimeout(sayHi(), 1000);
```
That doesn't work, because `setTimeout` expects a reference to a function. And here `sayHi()` runs the function, and the *result of its execution* is passed to `setTimeout`. In our case the result of `sayHi()` is `undefined` (the function returns nothing), so nothing is scheduled.
````

### clearTimeout으로 스케줄링 취소하기

`setTimeout`을 호출하면 "타이머 식별자(timer identifier)"가 반환됩니다. 이 식별자(아래 예시에서 `timerId`)를 사용하면 스케줄링을 취소할 수 있습니다.

실행 취소하기:

```js
let timerId = setTimeout(...);
clearTimeout(timerId);
```

아래 코드는 함수를 스케줄링한 후 (마음이 바뀌어) 취소한 경우를 나타냅니다. 스케줄링을 취소했기 때문에 아무 일도 일어나지 않습니다.

```js run no-beautify
let timerId = setTimeout(() => alert("never happens"), 1000);
alert(timerId); // 타이머 식별자

clearTimeout(timerId);
alert(timerId); // 동일 식별자 (취소 후에도 식별자의 값은 null이 되지 않습니다.)
```

`alert` 창을 통해 살펴봤듯이, 브라우저 환경에선 타이머 식별자가 숫자형 입니다. 다른 환경에선 숫자형이 아닐 수도 있습니다. Node.js에서는 추가 메서드와 함께 타이머 객체가 반환됩니다.

다시 한번 강조하자면, 이러한 메서드들에 대한 명세는 없습니다. 따라서 이런 차이가 문제가 되지는 않습니다.

다만, 브라우저 환경의 경우 HTML5 표준의 [timers section](https://www.w3.org/TR/html5/webappapis.html#timers)에서 타이머와 관련 메서드에 대해 기술하고 있으니 참고하시기 바랍니다.

## setInterval

`setInterval` 메서드와 `setTimeout`의 문법은 같습니다.

```js
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```

인수의 의미 역시 같습니다. 다만, `setTimeout`을 사용하면 함수가 일회만 실행되는 게 아니라, 일정 시간을 간격으로 (주기적으로) 실행됩니다.

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

So if you run the code above and don't dismiss the `alert` window for some time, then in the next `alert` will be shown immediately as you do it. The actual interval between alerts will be shorter than 2 seconds.
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

  if (서버 과부하로 인한 요청 실패) {
    // 요청 간격을 늘립니다
    delay *= 2;
  }

  timerId = setTimeout(request, delay);

}, delay);
```


And if the functions that we're scheduling are CPU-hungry, then we can measure the time taken by the execution and plan the next call sooner or later.

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

![](setinterval-interval.svg)

알아차리셨나요?

**`setInterval`사용 시, `func`호출 이후에 실제 지연되는 시간은 코드에서 명시한 시간보다 짧습니다!**

이는 정상적인 동작입니다. `func`을 실행하는 데 소모되는 시간이 지연 시간에 포함되기 때문입니다.

그런데 `func` 실행에 걸리는 시간이 100ms보다 더 긴 경우도 있을 겁니다.

이때는, `func`이 끝날 때까지 엔진이 대기 상태에 있습니다. `func`이 끝나면 엔진은 스케줄러를 확인하고, 시간이 다 된 경우 다음 호출을 *바로* 진행합니다.

만약 호출해야 하는 모든 함수의 실행 시간이 명시한 `delay` 밀리초보다 길면, 쉼 없이 모든 함수가 연속적으로 호출되게 됩니다.

아래는 회귀적인 `setTimeout`을 묘사하는 그림입니다.

![](settimeout-interval.svg)

**회귀적인 `setTimeout`에선 명시한 지연(여기서는 100ms)을 보장합니다.**

다음 호출에 대한 계획은 현재 함수의 실행이 끝난 이후에 만들어지기 때문입니다.  

````smart header="가비지 컬렉션"
함수를 `setInterval/setTimeout`으로 넘길 때, 함수에 대한 내부 참조가 만들어지고, 이 정보는 스케줄러에 저장됩니다. 이는 함수가 가비지 켤렉션의 대상이 되는 걸 막아줍니다. 해당 함수를 참조하는 것들이 없는 경우에도 말이죠.

```js
// 다음 함수는 스케줄러에 의해 호출될 때까지 메모리에 유지됩니다.
setTimeout(function() {...}, 100);
```

`setInterval`에 넘겨주는 함수는 `clearInterval`이 호출되기 전까지 메모리에 머무릅니다.

이런 동작 방식에는 부작용이 있습니다. 함수가 외부 렉시컬 환경을 참조하면서 메모리에 남아있으면, 외부 변수도 역시 메모리에 남게됩니다. 이렇게 메모리에 남아있는 외부 변수는 함수가 차지하는 메모리 공간보다 더 많은 메모리를 차지할 가능성이 있습니다. 이런 부작용을 방지하기 위해, 더는 스케줄링할 필요가 없는 함수는 취소하는 게 좋습니다. 작은 함수라도 말이죠.
````

## 대기 시간이 0인 setTimeout

대기 시간이 0인 `setTimeout(func, 0)`(또는 `setTimeout(func)`)을 사용하는 특별한 유스 케이스가 있습니다.

대기 시간을 0으로 설정하면 `func`이 가능한 한 빨리 실행되도록 예약됩니다. 다만, 스케줄러는 현재 코드의 실행이 완료된 후에 예약된 함수를 실행합니다.

따라서 함수는 현재 코드가 종료된 직후에 실행되도록 예약됩니다. *비동기적으로* 실행되죠.

다음 코드는 "HelloWorld"를 먼저 출력하고, 그 후에 "World"를 출력합니다.

```js run
setTimeout(() => alert("World"));

alert("Hello");
```

첫 번째 줄은 "'0ms 후에 함수 호출하기'라는 할 일을 다이어리에 기록"하는 것과 같습니다. 그런데 스케줄러는 현재 코드의 실행이 완료된 이후에 "다이어리에 적힌 할일 목록을 확인"합니다. 따라서 `"Hello"` 가 먼저 출력되고, `"World"`은 그 다음에 출력됩니다.

이렇게 대기시간을 0으로 하는 것에 대한 다양한 브라우저 환경에서의 유스 케이스가 있습니다. 이에 대해선 <info:event-loop>에서 자세히 다루도록 하겠습니다. 

````smart header="브라우저 환경에서 실제 대기시간은 0이 아닙니다."
In the browser, there's a limitation of how often nested timers can run. The [HTML5 standard](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers) says: "after five nested timers, the interval is forced to be at least 4 milliseconds.".

Let's demonstrate what it means with the example below. The `setTimeout` call in it re-schedules itself with zero delay. Each call remembers the real time from the previous one in the `times` array. What do the real delays look like? Let's see:

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

First timers run immediately (just as written in the spec), and then we see `9, 15, 20, 24...`. The 4+ ms obligatory delay between invocations comes into play.

The similar thing happens if we use `setInterval` instead of `setTimeout`: `setInterval(f)` runs `f` few times with zero-delay, and afterwards with 4+ ms delay.

That limitation comes from ancient times and many scripts rely on it, so it exists for historical reasons.

다만, 서버 환경에선 이런 제약이 없습니다. Node.js에선 [process.nextTick](https://nodejs.org/api/process.html)과 [setImmediate](https://nodejs.org/api/timers.html)을 이용해 지연 없이 비동기 작업을 스케줄링할 수 있습니다. 위에서 언급된 제약은 브라우저에 한정됩니다.
````

## 요약

- `setInterval(func, delay, ...args)`과 `setTimeout(func, delay, ...args)` 메서드는 `delay` 밀리초 후에 `func`을 규칙적으로, 또는 한번 실행하도록 해줍니다.
- `setInterval/setTimeout`을 호출해 반환된 값을 `clearInterval/clearTimeout`에 넘겨주면 실행을 취소할 수 있습니다.
- 중첩 `setTimeout` 호출(재귀 호출)은 융통성 측면에서 `setInterval`보다 더 나은 대안입니다. 실행 *사이 간격*을 보장해 주는 것 또한 이점입니다.
- 중간 휴식이 없는 `setTimeout(func, 0)`(= `setTimeout(func)`)은 "현재 코드의 실행이 완료된 후 가능한 한 빠르게" 다음 호출을 실행하고자 할 때 사용됩니다.
- The browser limits the minimal delay for five or more nested call of `setTimeout` or for `setInterval` (after 5th call) to 4ms. That's for historical reasons.

Please note that all scheduling methods do not *guarantee* the exact delay. We should not rely on that in the scheduled code.

다양한 이유 때문에 브라우저 환경에서 타이머가 느려집니다. 몇 가지 예시를 살펴봅시다.
- CPU가 과부하 상태인 경우
- 브라우저 탭이 백그라운드 모드인 경우
- 노트북이 배터리에 의존해서 구동중인 경우

타이머는 최소 300ms, 심하면 1000ms까지 딜레이될 수 있습니다. 지연 시간은 브라우저와 사용 환경에 따라 달라집니다.
