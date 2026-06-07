
# Fetch: 요청 중단하기

`fetch`는 프라미스를 반환합니다. 그런데 자바스크립트에는 일반적으로 프라미스를 '중단'한다는 개념이 없습니다. 그렇다면 진행 중인 `fetch`는 어떻게 취소할 수 있을까요? 예를 들어 사이트에서 사용자 행동을 보고 더 이상 `fetch`가 필요 없다고 판단한 경우처럼 말이죠.

이런 목적을 위해 만들어진 특별한 내장 객체가 있습니다. 바로 `AbortController`입니다. `AbortController`를 사용하면 `fetch`뿐만 아니라 다른 비동기 작업도 중단할 수 있습니다.

사용법은 아주 간단합니다.

## AbortController 객체

컨트롤러를 하나 만듭니다.

```js
let controller = new AbortController();
```

컨트롤러는 아주 단순한 객체입니다.

- 메서드는 `abort()` 하나뿐입니다.
- 이벤트 리스너를 설정할 수 있는 프로퍼티도 `signal` 하나뿐입니다.

`abort()`가 호출되면 다음 일이 일어납니다.
- `controller.signal`에서 `"abort"` 이벤트가 발생합니다.
- `controller.signal.aborted` 프로퍼티 값이 `true`가 됩니다.

보통 이 과정에는 두 주체가 있습니다.
1. 취소 가능한 작업을 수행하는 쪽은 `controller.signal`에 리스너를 설정합니다.
2. 취소하는 쪽은 필요할 때 `controller.abort()`를 호출합니다.

전체 예시를 살펴봅시다. 아직 `fetch`는 사용하지 않습니다.

```js run
let controller = new AbortController();
let signal = controller.signal;

// 취소 가능한 작업을 수행하는 쪽은
// "signal" 객체를 받고,
// controller.abort()가 호출되었을 때 실행될 리스너를 설정합니다.
signal.addEventListener('abort', () => alert("중단!"));

// 취소하는 쪽은 나중에 언제든 다음을 호출합니다.
controller.abort(); // 중단!

// 이벤트가 발생하고 signal.aborted가 true가 됩니다.
alert(signal.aborted); // true
```

예시에서 볼 수 있듯이 `AbortController`는 `abort()`가 호출되었을 때 `abort` 이벤트를 전달하는 수단입니다.

`AbortController` 객체 없이도 코드에서 이런 이벤트 리스닝 방식을 직접 구현할 수 있습니다.

하지만 중요한 점은 `fetch`가 `AbortController` 객체와 함께 동작하는 방법을 알고 있다는 것입니다. `fetch`와 `AbortController`는 통합되어 있습니다.

## fetch와 함께 사용하기

`fetch`를 취소할 수 있게 하려면 `AbortController`의 `signal` 프로퍼티를 `fetch` 옵션으로 넘기면 됩니다.

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal
});
```

`fetch` 메서드는 `AbortController`와 함께 동작하는 방법을 알고 있습니다. `fetch`는 `signal`의 `abort` 이벤트를 감지합니다.

이제 중단하려면 `controller.abort()`를 호출하면 됩니다.

```js
controller.abort();
```

이게 전부입니다. `fetch`가 `signal`로부터 이벤트를 받아 요청을 중단합니다.

`fetch`가 중단되면 해당 프라미스는 `AbortError` 에러와 함께 거부됩니다. 따라서 `try..catch` 등으로 이를 처리해야 합니다.

다음은 1초 후 `fetch`를 중단하는 전체 예시입니다.

```js run async
// 1초 후 중단
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/article/fetch-abort/demo/hang', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') { // abort() 처리
    alert("중단되었습니다!");
  } else {
    throw err;
  }
}
```

## AbortController는 확장성이 좋습니다

`AbortController`는 확장성이 좋습니다. 여러 `fetch`를 한꺼번에 취소할 수 있습니다.

다음은 여러 `url`을 병렬로 가져오고, 하나의 컨트롤러로 모든 요청을 중단하는 코드 예시입니다.

```js
let urls = [...]; // 병렬로 가져올 url 목록

let controller = new AbortController();

// fetch 프라미스 배열
let fetchJobs = urls.map(url => fetch(url, {
  signal: controller.signal
}));

let results = await Promise.all(fetchJobs);

// 어디서든 controller.abort()가 호출되면
// 모든 fetch가 중단됩니다.
```

`fetch`와는 다른 자체 비동기 작업이 있다면 하나의 `AbortController`를 사용해 해당 작업과 `fetch`를 함께 멈출 수 있습니다.

작업 안에서 `abort` 이벤트를 감지하기만 하면 됩니다.

```js
let urls = [...];
let controller = new AbortController();

let ourJob = new Promise((resolve, reject) => { // 자체 작업
  ...
  controller.signal.addEventListener('abort', reject);
});

let fetchJobs = urls.map(url => fetch(url, { // fetch 작업들
  signal: controller.signal
}));

// fetch 작업과 자체 작업을 병렬로 기다립니다.
let results = await Promise.all([...fetchJobs, ourJob]);

// 어디서든 controller.abort()가 호출되면
// 모든 fetch와 ourJob이 중단됩니다.
```

## 요약

- `AbortController`는 `abort()` 메서드가 호출되면 `signal` 프로퍼티에서 `abort` 이벤트를 발생시키는 단순한 객체입니다. 이때 `signal.aborted`도 `true`로 설정됩니다.
- `fetch`는 `AbortController`와 통합되어 있습니다. `signal` 프로퍼티를 옵션으로 넘기면 `fetch`가 이를 감지하므로 `fetch`를 중단할 수 있습니다.
- `AbortController`는 일반 코드에서도 사용할 수 있습니다. `abort()` 호출과 `abort` 이벤트 감지로 이어지는 상호작용은 단순하고 범용적입니다. `fetch` 없이도 사용할 수 있습니다.
