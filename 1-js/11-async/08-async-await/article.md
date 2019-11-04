# async와 await

'async'와 'await'라는 특별한 문법을 사용하면 프라미스를 좀 더 편하게 사용할 수 있습니다. 'async/await'는 놀라울 정도로 이해하기 쉽고, 사용법도 어렵지 않습니다.

## async 함수

`async` 키워드부터 알아봅시다. `async`는 function 앞에 위치합니다.

```js
async function f() {
  return 1;
}
```

function 앞의 단어, 'async'는 해당 함수가 항상 프라미스를 반환한다는 것을 의미합니다. 프라미스가 아닌 값은 이행 상태의 프라미스(resolved promise)가 자동으로 감싸게 됩니다.

아래 예시의 함수는 `result`가 `1`인 이행 상태의 프라미스를 반환합니다. 직접 확인해 봅시다.

```js run
async function f() {
  return 1;
}

f().then(alert); // 1
```

명시적으로 프라미스를 반환하는 것도 가능한데, 결과는 동일합니다.

```js run
async function f() {
  return Promise.resolve(1);
}

f().then(alert); // 1
```

`async`가 붙은 함수는 반드시 프라미스를 반환하고, 프라미스가 아닌 것은 프라미스로 감싸 반환합니다. 굉장히 간단하죠? 그런데 `async`가 제공하는 기능은 이뿐만이 아닙니다. 또 다른 키워드 `await`는 `async` 함수 안에서만 동작합니다. `await`는 아주 멋진 녀석이죠.

## await

await의 문법은 다음과 같습니다.

```js
// await는 async 함수 안에서만 동작합니다.
let value = await promise;
```

자바스크립트는 `await` 키워드를 만나면 프라미스가 처리(settled)될 때까지 기다립니다. 결과는 그 이후 반환됩니다.

1초 후 이행되는 프라미스를 예시로 사용하여 `await`가 어떻게 동작하는지 살펴봅시다.
```js run
async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("완료!"), 1000)
  });

*!*
<<<<<<< HEAD
  let result = await promise; // 프라미스가 이행될 때까지 기다림 (*)
=======
  let result = await promise; // wait until the promise resolves (*)
>>>>>>> ec21af8aef6930388c06ee4cd8f8f6769f9d305b
*/!*

  alert(result); // "완료!"
}

f();
```

함수 실행은 `(*)`로 표시한 줄에서 잠시 '중단'되었다가 프라미스가 처리되면 다시 시작됩니다. 이때 프라미스 객체의 `result` 값이 변수 result에 할당됩니다. 따라서 위 예시를 실행하면 1초 뒤에 '완료!'가 출력됩니다.

`await`('기다리다'라는 뜻을 가진 영단어 - 옮긴이)는 말 그대로 자바스크립트를 프라미스가 처리될 때까지 기다리게 만들고, 프라미스가 처리되면 그 결과와 함께 실행을 재개합니다. 대기 중에 엔진은 다른 일(다른 스크립트를 실행, 이벤트 처리 등)을 할 수 있기 때문에, CPU 리소스가 낭비되지 않습니다.

`await`는 `promise.then`보다 좀 더 세련되게 프라미스 결과를 얻을 수 있도록 해주는 문법입니다. `promise.then`보다 가독성도 좋고 쓰기도 쉽습니다.

````warn header="일반 함수에는 `await`을 사용할 수 없습니다."
`async` 함수가 아닌데 `await`을 사용하면 문법 에러가 발생합니다.

```js run
function f() {
  let promise = Promise.resolve(1);
*!*
  let result = await promise; // Syntax error
*/!*
}
```

function 앞에 `async`를 붙이지 않으면 이런 에러가 발생합니다. 앞서 설명해 드린 바와 같이 `await`은 `async function` 안에서만 동작합니다.
````

<info:promise-chaining> 챕터의 `showAvatar()` 예시를 `async/await`를 사용해 다시 작성해봅시다.

1. 먼저 `.then` 호출을 `await`로 바꿔야 합니다.
2. function 앞에 `async`를 붙여 `await`를 사용할 수 있도록 합니다.

```js run
async function showAvatar() {

  // JSON 읽기
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();

  // github 사용자 정보 읽기
  let githubResponse = await fetch(`https://api.github.com/users/${user.name}`);
  let githubUser = await githubResponse.json();

  // 아바타 보여주기
  let img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  // 3초 대기
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  img.remove();

  return githubUser;
}

showAvatar();
```

코드가 깔끔해지고 읽기도 쉬워졌습니다. 프라미스를 사용한 것보다 훨씬 낫네요.

````smart header="`await`는 최상위 레벨 코드에서 작동하지 않습니다."
`await`을 이제 막 사용하기 시작한 분들은 최상위 레벨 코드(top-level code)에 `await`을 사용할 수 없다는 사실을 잊곤 합니다. 아래와 같은 코드는 동작하지 않습니다.

```js run
// 최상위 레벨 코드에선 문법 에러가 발생함
let response = await fetch('/article/promise-chaining/user.json');
let user = await response.json();
```

이럴 땐 아래와 같이 익명 async 함수로 감싸면 `await`를 사용할 수 있습니다.

```js
(async () => {
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();
  ...
})();
```


````
````smart header="`await`는 \'thenables\'를 받습니다."
`promise.then`처럼 `await`도 thenable 객체(`then` 메서드가 있는 호출 가능한 객체)를 사용할 수 있게 해줍니다. 서드파티 객체는 프라미스가 아니지만 프라미스와 호환 가능한 객체일 수 있다는 점에서 이런 기능이 생겼습니다. 서드파티 객체가 `.then`을 지원하면 `await`를 충분히 사용할 수 있습니다.

아래 예시에 데모용 클래스 `Thenable`이 있는데, `await`는 이 클래스의 인스턴스를 받습니다.

```js run
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve);
    // 1000밀리초 후에 이행됨(result는 this.num*2)
    setTimeout(() => resolve(this.num * 2), 1000); // (*)
  }
};

async function f() {
  // 1초 후, 변수 result는 2가 됨
  let result = await new Thenable(1);
  alert(result);
}

f();
```

If `await` gets a non-promise object with `.then`, it calls that method providing built-in functions `resolve`, `reject` as arguments (just as it does for a regular `Promise` executor). Then `await` waits until one of them is called (in the example above it happens in the line `(*)`) and then proceeds with the result.
````

````smart header="async 클래스 메서드"
메서드 이름 앞에 `async`를 추가하면 async 클래스 메서드를 선언할 수 있습니다.

```js run
class Waiter {
*!*
  async wait() {
*/!*
    return await Promise.resolve(1);
  }
}

new Waiter()
  .wait()
  .then(alert); // 1
```
`async` 메서드와 `async` 함수는 프라미스를 반환하고 `await`를 사용할 수 있다는 점에서 동일합니다.

````
## 에러 핸들링

프라미스가 정상적으로 이행되면 `await promise`는 결과를 반환합니다. 그러나 프라미스가 거부되면 마치 `throw`문을 작성한 것처럼 에러가 던져집니다.

예시:

```js
async function f() {
*!*
  await Promise.reject(new Error("에러 발생!"));
*/!*
}
```

위 코드는 아래 코드와 동일합니다.

```js
async function f() {
*!*
  throw new Error("에러 발생!");
*/!*
}
```

실제 상황에선 일정 시간이 지난 후에 프라미스가 거부되곤 합니다. 이럴 땐 `await`가 에러를 던지기 전에 지연이 생깁니다.

`await`가 던진 에러는 `throw`가 던진 에러를 해결할 때와 동일하게 `try..catch`로 잡을 수 있습니다.

```js run
async function f() {

  try {
    let response = await fetch('http://유효하지-않은-url');
  } catch(err) {
*!*
    alert(err); // TypeError: failed to fetch
*/!*
  }
}

f();
```

에러가 발생하면 제어 흐름이 `catch` 블록으로 넘어갑니다. 여러 줄의 코드를 `try..catch`로 감싸는 것도 가능합니다.

```js run
async function f() {

  try {
    let response = await fetch('http://유효하지-않은-url');
    let user = await response.json();
  } catch(err) {
    // fetch와 response.json에서 발행한 에러 모두를 여기서 잡습니다.
    alert(err);
  }
}

f();
```

`try..catch`가 없으면 async 함수 `f()`를 호출해 만든 프라미스가 거부됩니다. `.catch`를 추가하면 거부된 프라미스를 처리할 수 있습니다.

```js run
async function f() {
  let response = await fetch('http://유효하지-않은-url');
}

// f() becomes a rejected promise
*!*
f().catch(alert); // TypeError: failed to fetch // (*)
*/!*
```

`.catch`를 추가하는 걸 잊으면, 처리되지 않은 프라미스 에러가 발생합니다(콘솔에서 확인). 이런 에러는 <info:promise-error-handling> 챕터에서 설명한 전역 이벤트 핸들러를 사용해 잡을 수 있습니다.


```smart header="`async/await`와 `promise.then/catch`"
`async/await`을 사용하면 `await`가 대기를 처리해주기 때문에 `.then`이 거의 필요하지 않습니다. 여기에 더하여 `.catch` 대신 일반 `try..catch`를 사용할 수도 있죠. 항상 그러한 것은 아니지만, `promise.then`을 사용하는 것보다 `async/await`를 사용하는 것이 대게는 더 편리합니다.

그런데 문법 제약 때문에 최상위 레벨 코드에선 `await`를 사용할 수 없으므로, `.then/catch`를 추가해 최종 결과나 처리하지 못한 에러를 다루는 것이 관행입니다.

위 예시의 `(*)`이 표시된 줄처럼 말이죠.
```

````smart header="`async/await` works well with `Promise.all`"
When we need to wait for multiple promises, we can wrap them in `Promise.all` and then `await`:

```js
// wait for the array of results
let results = await Promise.all([
  fetch(url1),
  fetch(url2),
  ...
]);
```

In case of an error, it propagates as usual: from the failed promise to `Promise.all`, and then becomes an exception that we can catch using `try..catch` around the call.

````

## 요약

function 앞에 `async` 키워드를 추가하면 두 가지 효과가 있습니다.

1. 함수는 언제나 프라미스를 반환합니다.
2. 함수 안에서 `await`를 사용할 수 있습니다.

프라미스 앞에 `await` 키워드가 붙으면, 자바스크립트는 프라미스가 처리될 때까지 기다립니다. 그 후엔 조건에 따라 아래와 같은 동작이 이어집니다.

1. 에러 발생 --  에러가 발생한 부분에서 예외가 생성됨(`throw error`를 호출한 것과 동일)
2. 에러 미발생 -- 프라미스 객체의 result를 반환

`async/await`를 함께 사용하면 읽고, 쓰기 쉬운 비동기 코드를 작성할 수 있습니다.

`async/await`를 사용하면 `promise.then/catch`가 거의 필요 없습니다. 하지만 가끔 `promise.then/catch`를 써야만 하는 경우가 생기기 때문에(예: 가장 바깥 스코프에서 비동기 처리가 필요할 때) `async/await`가 프라미스를 기반으로 한다는 사실을 알고 계셔야 합니다. Also `Promise.all` is a nice thing to wait for many tasks simultaneously.
