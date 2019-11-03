# 프라미스 API

'프라미스' 클래스에는 5가지의 정적 메서드가 있습니다. 프라미스의 유스 케이스에 대해서 빠르게 알아보겠습니다.

## Promise.all

5개의 프라미스를 동시에 실행시키고 모두 준비가 될 때까지 기다린다는 가정을 해봅시다.

예를 들면 여러 URL을 동시에 다운로드하고 다운로드가 모두 끝나면 내용을 처리하는 것입니다.

그것이 `Promise.all`이 하는 일입니다.

문법은 다음과 같습니다.

```js
let promise = Promise.all([...promises...]);
```

`Promise.all`은 프라미스 배열(엄밀히 따지면 반복 가능한(iterable, 이터러블) 객체나 보통 배열을 말합니다.)을 가져가고 새로운 프라미스를 반환합니다.

나열된 프라미스가 모두 처리되면 새로운 프라미스가 resolve 되고 나열된 프라미스의 결괏값 배열이 반환됩니다.

예를 들어 아래 `Promise.all`이 3초 후에 처리된다면 결과는 `[1, 2, 3]` 입니다.

```js run
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000))  // 3
]).then(alert); // 프라미스가 준비되었을 때 1, 2, 3을 반환합니다. 프라미스 하나는 배열 구성원 하나가 됩니다.
```

배열 구성원의 순서는 원천 프라미스의 순서와 같다는 것을 유의하세요. 첫 번째 프라미스가 resolve 되는 시간이 길어도 결괏값 배열의 첫 번째 배열 요소입니다.

주로 쓰는 수법은 작업 데이터를 프라미스 배열로 매핑하고 다시 전체를 `Promise.all`로 감싸는 것입니다.

예를 들어 URL 배열은 다음과 같이 불러옵니다.

```js run
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// fetch 되는 프라미스에 모든 url을 매핑합니다.
let requests = urls.map(url => fetch(url));

// Promise.all은 모든 작업이 resolve 될 때까지 기다립니다.
Promise.all(requests)
  .then(responses => responses.forEach(
    response => alert(`${response.url}: ${response.status}`)
  ));
```

깃허브 사용자들의 이름 배열하고 사용자 정보를 가져오는 더 큰 예제입니다.(사용자 아이디로 상품 배열을 가져올 수 있습니다. 로직은 같습니다.)

```js run
let names = ['iliakan', 'remy', 'jeresig'];

let requests = names.map(name => fetch(`https://api.github.com/users/${name}`));

Promise.all(requests)
  .then(responses => {
    // 모든 응답은 성공적으로 resolve 되었습니다.
    for(let response of responses) {
      alert(`${response.url}: ${response.status}`); // url 200개를 모두 보여줍니다.
    }

    return responses;
  })
  // 응답 배열을 response.json()로 매핑하여 응답 내용을 읽습니다.
  .then(responses => Promise.all(responses.map(r => r.json())))
  // 모든 JSON 응답은 구문 분석됩니다. "users"는 배열로 응답됩니다.
  .then(users => users.forEach(user => alert(user.name)));
```

**프라미스가 하나라도 거부된다면 `Promise.all`가 반환한 프라미스는 즉시 에러를 발생합니다.**

예시:

```js run
Promise.all([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
*!*
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("에러 발생!")), 2000)),
*/!*
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).catch(alert); // Whoops! 에러입니다!
```

두 번째 프라미스가 2초 안에 reject 되었습니다. 이것은 즉시 `Promise.all` 전체의 실패로 이어지고 `.catch`가 발생합니다. 이 실패 에러는 `Promise.all` 전체의 결과가 됩니다.

```warn header="에러가 날 때 다른 프라미스는 무시됩니다"
프라미스 하나가 실패하면 `Promise.all` 은 즉시 실패하고 전체 목록에서 다른 프라미스는 완전히 잊어버립니다. 다른 프라미스의 결과는 무시됩니다.

예를 들어, 위의 예제처럼 `fetch` 요청이 여러 번 있다면 하나가 실패해도 다른 요청은 계속 실행됩니다. 그러나 `Promise.all`은 다른 요청을 신경 쓰지 않습니다. 다른 요청이 처리되나 결괏값은 무시됩니다.

프라미스에 취소라는 개념이 없어서 `Promise.all` 가 프라미스를 취소하지는 않습니다. [다음 챕터](info:fetch-abort)에서 이와 관련된 `AbortController`에 대해서 다룰 것입니다.
```

````smart header="`Promise.all(iterable)`는 `반복 가능한 객체`에서 프라미스가 아닌 \"일반\" 값을 허용합니다."
보통, `Promise.all(...)`은 프라미스의 이러터블 객체(대부분 배열)를 받아들입니다. 그러나 그 객체 중 하나라도 프라미스가 아니면, 배열 결과 "그대로" 보냅니다.

결괏값이 `[1, 2, 3]`인 예제를 봅시다.

```js run
Promise.all([
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(1), 1000)
  }),
  2,
  3
]).then(alert); // 1, 2, 3
```

그래서 준비된 값들을 간편하게 `Promise.all`로 보낼 수 있습니다.
````

## Promise.allSettled

[recent browser="new"]

`Promise.all`는 프라미스가 하나라도 거절되면 전체가 다 거절됩니다. *모든* 결괏값이 필요한 "전부냐 아니냐"의 경우에 좋습니다.

```js
Promise.all([
  fetch('/template.html'),
  fetch('/style.css'),
  fetch('/data.json')
]).then(render); // render 메서드는 모든 fetch 메서드의 결괏값이 필요합니다.
```

`Promise.allSettled`는 모든 프라미스가 처리될 때까지 기다립니다. 결과는 다음과 같습니다.

- 응답이 성공일 경우는 `{status:"fulfilled", value:result}`.
- 응답이 에러일 경우는 `{status:"rejected", reason:error}`.

예를 들어 다음과 같이 가정해봅시다. 여러 사용자의 정보를 가져올 때 요청 하나가 실패했지만 다른 요청에 여전히 관심이 있습니다.

`Promise.allSettled`를 이용해봅시다.

```js run
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://no-such-url'
];

Promise.allSettled(urls.map(url => fetch(url)))
  .then(results => { // (*)
    results.forEach((result, num) => {
      if (result.status == "fulfilled") {
        alert(`${urls[num]}: ${result.value.status}`);
      }
      if (result.status == "rejected") {
        alert(`${urls[num]}: ${result.reason}`);
      }
    });
  });
```

`(*)`라고 표시된 줄에서 `results`는 다음과 같이 나올 것입니다.
```js
[
  {status: 'fulfilled', value: ...response...},
  {status: 'fulfilled', value: ...response...},
  {status: 'rejected', reason: ...error object...}
]
```

각각의 프라미스는 자신의 상태와 `값 또는 에러`를 가지게 됩니다.

### 폴리필

브라우저가 `Promise.allSettled`를 지원하지 않는다면 폴리필을 이용하면 됩니다.

```js
if(!Promise.allSettled) {
  Promise.allSettled = function(promises) {
    return Promise.all(promises.map(p => Promise.resolve(p).then(value => ({
      state: 'fulfilled',
      value
    }), reason => ({
      state: 'rejected',
      reason
    }))));
  };
}
```

코드에서 `promises.map`는 입력값을 가지고 (프라미스가 아닌 값만) `p => Promise.resolve(p)`을 포함한 프라미스가 됩니다. 그리고 `.then` 핸들러를 모든 프라미스에 덧붙입니다.

핸들러는 성공적인 결괏값 `v`을 `{state:'fulfilled', value:v}`로 만들고 에러 `r`을 `{state:'rejected', reason:r}`로 만듭니다. 이것이 바로 `Promise.allSettled`의 구성방식입니다.

그러면 프라미스 몇 개가 reject된다 하더라도 `Promise.allSettled`를 통해서 결괏값이나 주어진 *모든* 프라미스를 얻을 수 있습니다.

## Promise.race

`Promise.all`와 비슷하나 첫 번째 프라미스가 처리되고 나서 결과(또는 에러)를 가져올 때까지 기다려야 합니다.

문법은 다음과 같습니다.

```js
let promise = Promise.race(iterable);
```

결과가 `1`이 되는 예시를 들겠습니다.

```js run
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("에러 발생!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
```

첫 번째 프라미스는 여기서 가장 빨라서 결과가 됩니다. 첫 번째 처리된 프라미스가 "경주에서 이기고" 나면 다음 결과 또는 에러는 무시됩니다.


## Promise.resolve/reject

`Promise.resolve` 와 `Promise.reject`는 모던한 코드에서는 거의 필요하지 않습니다. `async/await` 문법([조금 뒤에서](info:async-await) 다루겠습니다.)이 있어서 쓸모없어졌기 때문입니다.

여기서는 완성도와 `async/await`를 사용하지 못하는 이유에 관해서만 이야기하겠습니다.

- `Promise.resolve(value)`는 `value`가 있는 resolve된 프라미스를 생성합니다.

다음과 같습니다.

```js
let promise = new Promise(resolve => resolve(value));
```

메서드는 함수가 프라미스를 반환할 예정일 때 호환성을 위해서 사용됩니다.

예를 들어 아래에 있는 `loadCached` 함수는 URL로 내용을 가져와서 기억하는 것(캐시)입니다. 나중에 같은 URL 호출이 생기면 즉시 캐시에서 이전 내용을 가져옵니다. 그러나 `Promise.resolve`를 이용해 프라미스를 만들면 반환 값이 항상 프라미스입니다.

```js
let cache = new Map();

function loadCached(url) {
  if (cache.has(url)) {
*!*
    return Promise.resolve(cache.get(url)); // (*)
*/!*
  }

  return fetch(url)
    .then(response => response.text())
    .then(text => {
      cache.set(url,text);
      return text;
    });
}
```

함수 반환 값이 프라미스로 보장되었기 때문에 `loadCached(url).then(…)`을 사용할 수 있습니다. `loadCached` 뒤에는 항상 `.then`을 씁니다. 이것이 `(*)` 줄에 있는 `Promise.resolve`의 목적입니다.

### Promise.reject

- `Promise.reject(error)`는 `error`를 가진 거부된 프라미스를 생성합니다.

다음과 같습니다.

```js
let promise = new Promise((resolve, reject) => reject(error));
```

실제로 이 메서드는 거의 쓰이지 않습니다.

## 요약

`Promise` 클래스에는 5가지 정적 메서드가 있습니다.

1. `Promise.all(promises)` -- 모든 프라미스가 이행되고 결괏값 배열을 반환합니다. 주어진 프라미스 중에 하나라도 실패한다면 `Promise.all`의 에러가 되며 다른 결과도 무시됩니다.
2. `Promise.allSettled(promises)` (최근에 추가된 메서드) -- 모든 프라미스가 처리되고 개체 배열로 결괏값을 반환합니다.
    - `state`: `"fulfilled"` 또는 `"rejected"`
    - `value` (성공했을 때) 또는 `reason` (실패했을 때).
3. `Promise.race(promises)` -- 첫 번째 프라미스가 처리되고 나서 이것의 결과 또는 에러가 결괏값이 됩니다.
4. `Promise.resolve(value)` -- 주어진 값으로 해결된 프라미스를 만듭니다.
5. `Promise.reject(error)` -- 주어진 에러로 거부된 프라미스를 만듭니다.

다섯가지 메서드 중에서 `Promise.all`이 실제로 가장 흔히 사용됩니다.