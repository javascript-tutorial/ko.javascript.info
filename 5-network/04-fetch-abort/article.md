# Fetch: 중단

알다시피 `fetch`는 프라미스를 반환합니다. 그리고 자바스크립트에는 일반적으로 프라미스 "중단"이라는 개념이 없습니다. 그렇다면 사이트에서 `fetch`가 더는 필요하지 않음을 나타내는 사용자 액션이 일어날 경우, 진행 중인 `fetch`를 어떻게 중단할 수 있을까요?

이러한 경우를 위한 `AbortContoller`라고 하는 특별한 내장 객체가 있습니다. 이 객체는 `fetch`를 비롯한 다른 비동기 작업을 중단하는 데 사용할 수 있습니다.

사용법은 매우 직관적입니다.

## AbortController 객체

컨트롤러를 생성합니다.

```js
let controller = new AbortController();
```

컨트롤러는 매우 단순한 객체입니다.

- 단일 메서드인 `abort()`를 갖습니다.
- `abort`에 대한 이벤트 리스너를 설정할 수 있는 단일 속성 `signal`을 갖습니다.

`abort()`가 호출되면

- `controller.signal`은 `"abort"` 이벤트를 내보냅니다.
- `controller.signal.aborted` 속성은 `true`가 됩니다.

일반적으로 이 프로세스는 두 부분으로 나뉩니다.

1. `controller.signal`에 설정한 리스너에서 취소 가능한 연산을 수행하는 부분
2. 필요할 때 `controller.abort()`를 호출하여 취소하는 부분

다음은 전체 예시입니다. (아직 `fetch`는 사용하지 않음)

```js run
let controller = new AbortController();
let signal = controller.signal;

// "signal" 객체를 받아서
// controller.abort()가 호출되었을 때 실행할 리스너를 설정하는
// 취소 가능한 연산을 수행하는 부분
signal.addEventListener("abort", () => alert("abort!"));

// 취소하는 부분 (나중에 어떤 시점에라도)
controller.abort(); // abort!

// 이벤트가 트리거되고 signal.aborted는 true가 됩니다.
alert(signal.aborted); // true
```

보다시피 `AbortController`는 `abort()`가 호출될 때 `abort` 이벤트를 전달하는 수단일 뿐입니다.

`AbortController` 객체를 사용하지 않더라도 동일한 형태로 이벤트 수신을 구현할 수 있습니다.

그러나 `AbortController`가 가치있는 이유는 `fetch`가 `AbortController` 객체와 함께 작동하는 방법을 알고 있고, 통합되어 있기 때문입니다.

## fetch와 함께 사용하기

`fetch`를 취소하려면 `AbortController`의 `signal`속성을 `fetch` 옵션으로 전달합니다.

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal,
});
```

`fetch` 메서드는 `AbortController`와 함께 작동하는 방법을 알고 있습니다. `fetch`는 `signal`에 대한 `abort` 이벤트를 수신합니다.

중단하려면 `controller.abort()`를 호출합니다.

```js
controller.abort();
```

끝났습니다. `fetch`는 `signal`로부터 이벤트를 받고 요청을 중단합니다.

`fetch`가 중단되면 프라미스는 `AbortError`와 함께 reject되므로, `try..catch` 같은 방식으로 에러를 적절히 처리해야합니다.

다음은 1초 후에 `fetch`를 중단하는 전체 예시입니다.

```js run async
// abort in 1 second
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch("/article/fetch-abort/demo/hang", {
    signal: controller.signal,
  });
} catch (err) {
  if (err.name == "AbortError") {
    // abort() 처리
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

## AbortController는 확장 가능합니다

`AbortController`는 확장 가능하며 한 번에 fetch 여러 개를 동시에 취소할 수 있습니다.

다음은 많은 `urls`을 병렬로 fetch하고 단일 컨트롤러를 사용하여 모두 중단하는 코드입니다.

```js
let urls = [...]; // 병렬로 fetch할 url 목록

let controller = new AbortController();

// fetch 프라미스 배열
let fetchJobs = urls.map(url => fetch(url, {
  signal: controller.signal
}));

let results = await Promise.all(fetchJobs);

// 어딘가 다른 곳에서 controller.abort()가 호출되면
// 모든 fetch를 중단합니다
```

만약 `fetch`가 아닌 자체 비동기 태스크가 있을 경우에도 단일 `AbortController`를 사용하여 fetch와 함께 중지할 수 있습니다.

그저 작업 내에서 `abort` 이벤트를 수신하도록 하면 됩니다.

```js
let urls = [...];
let controller = new AbortController();

let ourJob = new Promise((resolve, reject) => { // 자체 태스크
  ...
  controller.signal.addEventListener('abort', reject);
});

let fetchJobs = urls.map(url => fetch(url, { // fetches
  signal: controller.signal
}));

// fetch와 자체 태스크를 병렬로 기다립니다
let results = await Promise.all([...fetchJobs, ourJob]);

// 어딘가 다른 곳에서 controller.abort()가 호출되면
// 모든 fetch와 자체 태스크를 중단합니다
```

## 요약

- `AbortController`는 `abort ()` 메서드가 호출될 때 자신의 `signal` 속성에 `abort` 이벤트를 발생시키는 단순한 객체입니다(또한 `signal.aborted`를 `true`로 설정).
- `fetch`와 통합: `signal` 속성을 옵션으로 전달하면 `fetch`가 `abort` 이벤트를 수신하므로 `fetch`를 중단할 수 있습니다.
- 코드에서 `AbortController`를 사용할 수 있습니다. "`abort()` 호출" -> "`abort` 이벤트 수신" 인터랙션은 단순하고 보편적입니다. 심지어 `fetch` 없이도 사용할 수 있습니다.
