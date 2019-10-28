# Async/await

'async/await'은 프라미스를 좀 더 편하게 사용할 수 있는 특수한 문법입니다. 놀라울 정도로 쉽게 이해하고 사용할 수 있습니다.

## 함수 Async

`async` 키워드부터 시작해봅시다. 이 키워드는 아래처럼 함수 앞에 놓일 수 있습니다.

```js
async function f() {
  return 1;
}
```

함수 앞에 있는 'async'의 뜻은 간단합니다. 함수가 항상 프라미스를 반환한다는 말입니다. 다른 값들은 처리된 프라미스 안에 자동으로 감싸집니다.

예를 들어 이 함수는 `1`이라는 결과와 함께 처리된 프라미스를 반환합니다. 한 번 해보도록 하죠.

```js run
async function f() {
  return 1;
}

f().then(alert); // 1
```

...직접적으로 명시해서 프라미스를 반환하는 방법도 있습니다. 위와 같은 의미입니다.

```js run
async function f() {
  return Promise.resolve(1);
}

f().then(alert); // 1
```

이렇게 `async`는 반드시 함수가 프라미스를 반환하도록 하며 프라미스가 아닌 것은 그 안에 감쌉니다. 굉장히 간단하죠? 이뿐만이 아니에요. 함수 `async` 안에서만 동작하는 `await`이라는 또 다른 키워드가 있는데, 아주 멋진 녀석입니다.

## Await

문법은 이렇습니다.

```js
// works only inside async functions
let value = await promise;
```

`await` 키워드는 프라미스를 처리하고 결과를 반환할 때까지 자바스크립트를 지연시킵니다.

1초 후에 처리되는 프라미스 예제를 보시죠.
```js run
async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

*!*
  let result = await promise; // 프라미스를 처리할 때까지 대기 (*)
*/!*

  alert(result); // "done!"
}

f();
```

`(*)` 표시가 있는 줄에서 함수 실행이 '잠시 중단'되고 `result`가 그 결괏값이 되어 프라미스를 처리했을 때 다시 시작됩니다. 그래서 위의 코드가 1초 뒤에 "done!"을 출력하는 것이죠.

다시 한번 강조할게요. `await`은 말 그대로 자바스크립트가 프라미스를 처리할 때까지 기다리게 하는 것입니다. 그리고 다시 결과를 이어나가죠. CPU 리소스는 전혀 사용하지 않습니다. 수행되는 동안 엔진이 다른 스크립트나 이벤트를 처리하는 등 남은 일을 할 수 있기 때문입니다.

프라미스 결과를 획득하는 데 있어서 `promise.then`보다 세련된 방법이며 읽고 쓰기도 쉽습니다.

````warn header="일반 함수에는 `await`을 사용할 수 없습니다"
async가 아닌 함수에 `await`을 사용하려고 한다면 문법 에러가 나타날 겁니다.

```js run
function f() {
  let promise = Promise.resolve(1);
*!*
  let result = await promise; // Syntax error
*/!*
}
```

함수 앞에 `async`를 넣지 않는다면 이런 에러가 발생할 겁니다. 말했던 것처럼 `await`은 `async function`에서만 동작합니다.
````

챕터 <info:promise-chaining>의 `showAvatar()` 예제를 가져와 `async/await`으로 다시 작성해보겠습니다.

1. `.then`을 `await`으로 바꿔야 합니다.
2. 그러기 위해서는 함수에 `async`를 붙여줘야 합니다.

```js run
async function showAvatar() {

  // JSON 파일 읽어오기
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();

  // github 사용자 읽어오기
  let githubResponse = await fetch(`https://api.github.com/users/${user.name}`);
  let githubUser = await githubResponse.json();

  // 아바타 출력하기
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

꽤 깔끔하고 읽기 쉬워졌죠? 이전보다 훨씬 나아졌어요.

````smart header="`await`는 최상위 코드에서 작동하지 않습니다"
`await`을 이제 막 사용하기 시작한 분들은 최상위 코드에 `await`을 사용하지 못한다는 걸 잊곤 합니다. 예를 들어 이런 코드는 작동하지 않습니다.

```js run
// 최상위 코드의 문법 에러
let response = await fetch('/article/promise-chaining/user.json');
let user = await response.json();
```

이렇게 익명 함수 async 안으로 감쌀 수 있어요.

```js run
(async () => {
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();
  ...
})();
```


````
````smart header="`await`은 \"thenables\"를 받을 수 있습니다"
`promise.then`처럼 `await`은 thenable 객체 사용을 허용합니다(호출할 수 있는 `then` 메서드가 있는 객체). 서드파티 객체는 프라미스가 아닐지라도 프라미스와 호환이 가능합니다. `.then`을 지원한다면 `await`도 충분히 사용할 수 있습니다.

여기 데모용 `Thenable` 클래스를 보면 아래의 `await`이 그 인스턴스를 받고 있습니다.

```js run
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve);
    // 1000ms 후에 this.num*2를 처리
    setTimeout(() => resolve(this.num * 2), 1000); // (*)
  }
};

async function f() {
  // 1초 대기 후 결괏값이 2가 됨
  let result = await new Thenable(1);
  alert(result);
}

f();
```

`await`이 프라미스가 아닌 객체를 `.then`과 함께 받는다면 `resolve`, `reject`를 네이티브 함수에 인수로 넘기면서 그 메서드를 호출합니다. 그러면 `await`은 그중 하나가 호출될 때까지 대기하고(예시에서 `(*)` 표시가 있는 줄 참고) 결괏값이 나올 때까지 이어서 진행합니다.
````

````smart header="Async 클래스 메서드"
async 클래스 메서드를 선언하고 싶다면 그냥 `async`를 앞에 추가하세요.

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
의미는 같습니다. 반환된 값이 프라미스이며 `await`을 사용할 수 있다는 것이죠.

````
## 에러 처리

일반적으로 프라미스가 처리되면 `await promise`가 결과를 반환합니다. 하지만 실패한다면 마치 그 줄에 `throw`문이 있었던 것처럼 에러가 발생합니다.

이 코드를 보세요.

```js
async function f() {
*!*
  await Promise.reject(new Error("Whoops!"));
*/!*
}
```

...이 코드는 아래와 동일합니다.

```js
async function f() {
*!*
  throw new Error("Whoops!");
*/!*
}
```

실제 상황에서 프라미스는 실패하기 전에 시간이 걸릴 수 있습니다. 이 경우엔 `await`이 에러를 발생시키기 전에 시간이 지연될 거예요.

이런 에러는 `try..catch`를 사용해 해결할 수 있습니다. 일반적인 `throw`와 같은 방법으로요.

```js run
async function f() {

  try {
    let response = await fetch('http://no-such-url');
  } catch(err) {
*!*
    alert(err); // TypeError: failed to fetch
*/!*
  }
}

f();
```

에러가 발생하면 제어부는 `catch` 블록으로 건너뜁니다. 이번에도 마찬가지로 여러 줄을 감쌀 수 있습니다.

```js run
async function f() {

  try {
    let response = await fetch('/no-user-here');
    let user = await response.json();
  } catch(err) {
    // fetch와 response.json에서 발생한 에러 처리
    alert(err);
  }
}

f();
```

`try..catch`가 없다면 함수 async `f()`를 호출하면서 만든 프라미스가 실패하게 됩니다. 이런 문제는 `.catch`를 추가해서 해결할 수 있습니다.

```js run
async function f() {
  let response = await fetch('http://no-such-url');
}

// f()는 실패한 프라미스가 됩니다.
*!*
f().catch(alert); // TypeError: failed to fetch // (*)
*/!*
```

`.catch` 추가를 잊어버렸을 경우 처리되지 않은 프라미스 에러를 받게 됩니다(콘솔에서 확인 가능). 챕터 <info:promise-error-handling>에 설명한 전역 이벤트 핸들러로 이러한 에러를 처리할 수 있습니다.


```smart header="`async/await`와 `promise.then/catch`"
`async/await`을 사용하면 `await`이 자바스크립트 지연을 담당하므로 `.then`이 거의 필요하지 않습니다. `.catch`를 대신해 일반적인 `try..catch`를 사용할 수도 있죠. 항상은 아니지만, 일반적으로는 이 방식이 더 편리합니다.

하지만 `async` 함수 바깥쪽 코드 최상단에서는 문법적으로 `await`을 사용할 수 없습니다. 그래서 최종 결과나 처리하지 못한 에러를 다루기 위해 `.then/catch`를 추가하는 것이 일반적인 관행입니다.

위 예제에서 `(*)`이 표시된 줄처럼요.
```

````smart header="`async/await`는 `Promise.all`과 잘 작동합니다"
여러 개의 프라미스를 기다려야 할 때 `Promise.all` 안에 그 코드를 감싸서 `await`을 사용할 수 있습니다.

```js
// 결괏값의 배열을 기다림
let results = await Promise.all([
  fetch(url1),
  fetch(url2),
  ...
]);
```

에러가 발생하면 평소처럼 실패한 프라미스에서 `Promise.all`로 전달됩니다. 그리고 호출된 곳 주변의 `try..catch`를 이용해 예외를 처리하게 되죠.

````

## 요약

함수 앞에 `async` 키워드를 추가하면 두 가지 현상이 나타납니다.

1. 언제나 프라미스를 반환하게 합니다.
2. 프라미스에 `await`을 사용할 수 있습니다.

프라미스 앞의 `await` 키워드는 프라미스를 처리할 때까지 자바스크립트를 지연시킵니다. 그러면 다음과 같이 되죠.

1. 에러가 난다면 바로 그 부분에서 `throw error`를 호출한 것처럼 예외가 발생합니다.
2. 그렇지 않다면 결과를 반환합니다.

이 모든 것은 읽고 쓰기 쉬운 비동기 코드를 작성하기 위한 강력한 프레임워크를 제공합니다.

`async/await`으로 `promise.then/catch`를 거의 사용할 필요가 없지만, 여전히 이것이 프라미스를 기반으로 한다는 사실을 잊지 말아야 합니다. 가끔은 이런 메서드를 사용해야 할 때가 있거든요(예컨대 가장 바깥쪽 스코프). 또한 동시에 많은 작업을 기다려야 할 때는 `Promise.all`가 좋습니다.