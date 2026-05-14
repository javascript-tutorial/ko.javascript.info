
# Fetch: Abort

우리가 알고 있듯이, `fetch`는 프로미스를 반환합니다. 보통 자바스크립트에는 프로미스를 “중단하는” 개념은 없습니다. 그렇다면 진행 중인 `fetch`를 어떻게 취소할 수 있을까요? E.g) 만약 사이트에서 사용자 액션이 `fetch`가 더 이상 필요하지 않다고 판단되는 경우

이러한 경우를 위해 만들어진 특별한 객체가  `AbortController` 입니다. `fetch`를 중단할 때 쓸 수 있을 뿐 아니라, 비동기 작업에도 쓸 수 있습니다. 

사용 방법은 간단합니다.

## AbortController 객체

컨트롤러를 생성합니다.

```js
let controller = new AbortController();
```

컨트롤러는 아주 단순한 객체입니다.

- `abort()` 라는 한가지 메소드를 가지고 있습니다.
- 그리고 `signal` 라는 한 가지 프로퍼티를 가지며, 이 프로퍼티로 이벤트 리스너를 설정할 수 있습니다.

 `abort()` 가 호출될 때: 
- `controller.signal` 이 `"abort"` 이벤트를 발생시킵니다. 
- `controller.signal.aborted` 프로퍼티가 `true`가 됩니다.

일반적으로 이 과정에는 2가지 그룹이 있습니다.
1. 취소 작업을 실행하는 그룹은 `controller.signal`에 리스너를 설정합니다. 
2. 취소되는 그룹은 필요시에 `controller.abort()` 를 호출합니다.

전체 예시는 다음과 같습니다 (`fetch` 적용 전).

```js run
let controller = new AbortController();
let signal = controller.signal;

// 취소 작업을 실행하는 그룹이
// "signal" 오브젝트를 받고
// controller.abort() 가 호출될 때 리스너가 실행되도록 설정합니다.
signal.addEventListener('abort', () => alert("abort!"));

// 취소되는 다른 그룹 (추후에):
controller.abort(); // abort!

// 이벤트가 발생하고 signal.aborted는 true가 됨
alert(signal.aborted); // true
```

여기서 확인할 수 있듯이, `AbortController` 는 `abort()`가 호출될 때 `abort` 를 전달하는 수단입니다. 

`AbortController` 객체를 전혀 쓰지 않고, 코드를 따로 작성해서 동일한 이벤트 리스너를 구현할 수도 있습니다. 

하지만 중요한 점은, `fetch`가  `AbortController`  객체와 어떻게 작동하는지 알고 있으며, 합칠 수 있다는 점입니다.

## fetch와 사용하기

`fetch`를 취소하려면, `fetch` 옵션으로 `AbortController`의 프로퍼티인  `signal`을 전달합니다.

```js
let controller = new AbortController();
fetch(url, {
  signal: controller.signal
});
```

`fetch` 메소드는  `AbortController`와 어떻게 작동하는지 알고 있습니다. `signal`에서 `abort` 이벤트를 듣습니다.

이제 중단하려면 `controller.abort()`를 호출합니다.

```js
controller.abort();
```

다 끝났습니다. `fetch` 는 `signal`에서 이벤트를 받고, fetch를 중단합니다.

fetch가 중단되면, 프로미스는 `AbortError`에러로 reject됩니다. 그래서 이를 처리해주어야 합니다. e.g)  `try..catch`.

1초 뒤에 `fetch` 가 중단되는 전체 예시는 다음과 같습니다.

```js run async
// 1초 뒤에 중단
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/article/fetch-abort/demo/hang', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') { // abort() 처리
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

## AbortController는 확장 가능합니다.

`AbortController` 는 확장이 가능하기 때문에 한 번에 여러 개의 요청을 취소할 수 있습니다.

다음 코드는 많은 `urls`을 병렬 작업으로 요청하고, 한꺼번에 중단하기 위해 하나의 컨트롤러를 사용하고 있습니다.

```js
let urls = [...]; // 병렬 작업으로 요청할 url 목록

let controller = new AbortController();

// fetch 프로미스 배열 
let fetchJobs = urls.map(url => fetch(url, {
  signal: controller.signal
}));

let results = await Promise.all(fetchJobs);

// 만일 controller.abort() 가 다른 곳에서 호출되면,
// 모든 fetch를 중단합니다.
```

만일 `fetch` 가 아닌 다른 비동기 작업이 있다면, 하나의 `AbortController` 를 사용해서 fetch와 함께 모두 중단할 수 있습니다.

작업시에 해당 `abort` 이벤트를 듣기만 하면 됩니다.

```js
let urls = [...];
let controller = new AbortController();

let ourJob = new Promise((resolve, reject) => { // 다른 작업
  ...
  controller.signal.addEventListener('abort', reject);
});

let fetchJobs = urls.map(url => fetch(url, { // fetches
  signal: controller.signal
}));

// fetch와 다른 작업을 병렬 작업으로 기다림
let results = await Promise.all([...fetchJobs, ourJob]);

// 만일 controller.abort() 가 다른 곳에서 호출되면,
// 모든 fetch와 작업이 중단됩니다.
```

## 요약

- `AbortController` 는 `abort()` 메소드가 호출될 때 `signal` 프로퍼티에 `abort`이벤트를 생성하는(또한 `signal.aborted` 를 `true` 바꾸는) 단순한 객체입니다.
- `fetch` 와 합칠 수 있습니다. 옵션으로 `signal` 프로퍼티를 전달하면 `fetch` 는 이를 듣고, `fetch`를 중단할 수 있게 됩니다.
- 코드에 `AbortController` 를 쓸 수 있습니다. "`abort()` 호출” -> " `abort` 이벤트 듣기" 상호작용은 단순하며 범용적입니다. `fetch` 없이도 쓸 수 있습니다.