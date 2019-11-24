# async와 await

`async`와 `await`라는 특별한 문법을 사용하면 프라미스를 좀 더 편하게 사용할 수 있습니다. `async/await`는 놀라울 정도로 이해하기 쉽고, 사용법도 어렵지 않습니다.

## async 함수

`async` 키워드부터 알아봅시다. `async`는 function 앞에 위치합니다.

```js
async function f() {
  return 1;
}
```

function 앞에 `async`를 붙이면 해당 함수는 항상 프라미스를 반환합니다. 프라미스가 아닌 값을 반환하더라도 이행 상태의 프라미스(resolved promise)로 값을 감싸 이행된 프라미스가 반환되도록 합니다.

아래 예시의 함수를 호출하면 `result`가 `1`인 이행 프라미스가 반환됩니다. 직접 확인해 봅시다.

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

`await` 문법은 다음과 같습니다.

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
  let result = await promise; // 프라미스가 이행될 때까지 기다림 (*)
*/!*

  alert(result); // "완료!"
}

f();
```

함수를 호출하고, 함수 본문이 실행되는 도중에 `(*)`로 표시한 줄에서 실행이 잠시 '중단'되었다가 프라미스가 처리되면 실행이 재개됩니다. 이때 프라미스 객체의 `result` 값이 변수 result에 할당됩니다. 따라서 위 예시를 실행하면 1초 뒤에 '완료!'가 출력됩니다.

`await`('기다리다'라는 뜻을 가진 영단어 - 옮긴이)는 말 그대로 프라미스가 처리될 때까지 기다리게 만듭니다. 프라미스가 처리되면 그 결과와 함께 실행이 재개되죠. 프라미스가 처리되길 기다리는 동안엔 엔진이 다른 일(다른 스크립트를 실행, 이벤트 처리 등)을 할 수 있기 때문에, CPU 리소스가 낭비되지 않습니다.

`await`는 `promise.then`보다 좀 더 세련되게 프라미스의 `result` 값을 얻을 수 있도록 해주는 문법입니다. `promise.then`보다 가독성 좋고 쓰기도 쉽습니다.

````warn header="일반 함수엔 `await`을 사용할 수 없습니다."
`async` 함수가 아닌데 `await`을 사용하면 문법 에러가 발생합니다.

```js run
function f() {
  let promise = Promise.resolve(1);
*!*
  let result = await promise; // Syntax error
*/!*
}
```

function 앞에 `async`를 붙이지 않으면 이런 에러가 발생합니다. 앞서 설명해 드린 바와 같이 `await`는 `async function` 안에서만 동작합니다.
````

<info:promise-chaining> 챕터의 `showAvatar()` 예시를 `async/await`를 사용해 다시 작성해봅시다.

1. 먼저 `.then` 호출을 `await`로 바꿔야 합니다.
2. function 앞에 `async`를 붙여 `await`를 사용할 수 있도록 해야 합니다.

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

익명 async 함수로 코드를 감싸면 최상위 레벨 코드에도 `await`를 사용할 수 있습니다.

```js
(async () => {
  let response = await fetch('/article/promise-chaining/user.json');
  let user = await response.json();
  ...
})();
```


````
````smart header="`await`는 \'thenable\' 객체를 받습니다."
`promise.then`처럼 `await`에도 thenable 객체(`then` 메서드가 있는 호출 가능한 객체)를 사용할 수 있습니다. thenable 객체는 서드파티 객체가 프라미스가 아니지만 프라미스와 호환 가능한 객체를 제공할 수 있다는 점에서 생긴 기능입니다. 서드파티에서 받은 객체가 `.then`을 지원하면 이 객체를 `await`와 함께 사용할 수 있습니다.

`await`는 데모용 클래스 `Thenable`의 인스턴스를 받을 수 있습니다.

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

`await`는 `.then`이 구현되어있으면서 프라미스가 아닌 객체를 받으면, 네이티브 함수 `resolve`와 `reject`를 인수로 제공하는 메서드인 `.then`을 호출합니다(일반 `Promise` executor가 하는 일과 동일합니다). `await`는 둘 중 하나가 호출되길 기다렸다가(`(*)`로 표시한 줄) 호출 결과를 가지고 다음 일을 진행합니다.
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

프라미스가 정상적으로 이행되면 `await promise`는 프라미스 객체의 `result`에 저장된 값을 반환합니다. 반면 프라미스가 거부되면 마치 `throw`문을 작성한 것처럼 에러가 던져집니다.

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

실제 상황에선 프라미스가 거부 되기 전에 약간의 시간이 지체되는 경우가 있습니다. 이런 경우엔 `await`가 에러를 던지기 전에 지연이 발생합니다.

`await`가 던진 에러는 `throw`가 던진 에러를 잡을 때처럼 `try..catch`를 사용해 잡을 수 있습니다.

```js run
async function f() {

  try {
    let response = await fetch('http://유효하지-않은-주소');
  } catch(err) {
*!*
    alert(err); // TypeError: failed to fetch
*/!*
  }
}

f();
```

에러가 발생하면 제어 흐름이 `catch` 블록으로 넘어갑니다. 여러 줄의 코드를 `try`로 감싸는 것도 가능합니다.

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

`try..catch`가 없으면 아래 예시의 async 함수 `f()`를 호출해 만든 프라미스가 거부 상태가 됩니다. `f()`에 `.catch`를 추가하면 거부된 프라미스를 처리할 수 있습니다.

```js run
async function f() {
  let response = await fetch('http://유효하지-않은-url');
}

// f()는 거부 상태의 프라미스가 됩니다.
*!*
f().catch(alert); // TypeError: failed to fetch // (*)
*/!*
```

`.catch`를 추가하는 걸 잊으면, 처리되지 않은 프라미스 에러가 발생합니다(콘솔에서 확인). 이런 에러는 <info:promise-error-handling> 챕터에서 설명한 전역 이벤트 핸들러를 사용해 잡을 수 있습니다.


```smart header="`async/await`와 `promise.then/catch`"
`async/await`을 사용하면 `await`가 대기를 처리해주기 때문에 `.then`이 거의 필요하지 않습니다. 여기에 더하여 `.catch` 대신 일반 `try..catch`를 사용할 수 있다는 장점도 생깁니다. 항상 그러한 것은 아니지만, `promise.then`을 사용하는 것보다 `async/await`를 사용하는 것이 대게는 더 편리합니다.

그런데 문법 제약 때문에 `async`함수 바깥의 최상위 레벨 코드에선 `await`를 사용할 수 없으므로, 관행처럼 `.then/catch`를 추가해 최종 결과나 처리되지 못한 에러를 다룹니다.

위 예시의 `(*)`로 표시한 줄처럼 말이죠.
```

````smart header="`async/await` works well with `Promise.all`"
여러 개의 프라미스가 모두 처리되길 기다려야 하는 상황이라면 이 프라미스들을 `Promise.all`로 감싸고 여기에 `await`를 붙여 사용할 수 있습니다.

```js
// 프라미스 처리 결과가 담긴 배열을 기다립니다.
let results = await Promise.all([
  fetch(url1),
  fetch(url2),
  ...
]);
```

실패한 프라미스에서 발생한 에러는 보통 에러와 마찬가지로 `Promise.all`로 전파됩니다. 에러 때문에 생긴 예외는 `try..catch`로 감싸 잡을 수 있습니다.
````

## 요약

function 앞에 `async` 키워드를 추가하면 두 가지 효과가 있습니다.

1. 함수는 언제나 프라미스를 반환합니다.
2. 함수 안에서 `await`를 사용할 수 있습니다.

프라미스 앞에 `await` 키워드를 붙이면 자바스크립트는 프라미스가 처리될 때까지 대기합니다. 처리가 완료되면 조건에 따라 아래와 같은 동작이 이어집니다.

1. 에러 발생 --  예외가 생성됨(에러가 발생한 장소에서 `throw error`를 호출한 것과 동일함)
2. 에러 미발생 -- 프라미스 객체의 result 값을 반환

`async/await`를 함께 사용하면 읽고, 쓰기 쉬운 비동기 코드를 작성할 수 있습니다.

`async/await`를 사용하면 `promise.then/catch`가 거의 필요 없습니다. 하지만 가끔 `promise.then/catch`를 써야만 하는 경우가 생기기 때문에(예: 가장 바깥 스코프에서 비동기 처리가 필요할 때) `async/await`가 프라미스를 기반으로 한다는 사실을 알고 계셔야 합니다. 여러 작업이 있고, 이 작업들이 모두 완료될 때까지 기다리려면 `Promise.all`을 활용할 수 있다는 점도 알고 계시기 바랍니다.
