# 프라미스

탑 가수인 당신이 밤·낮으로 다음 싱글 앨범이 언제 나오는지 물어보는 팬들을 상대해야 한다고 가정해 봅시다. 

당신은 일의 부하를 덜기 위해 앨범이 출시되면 팬들이 자동으로 소식을 받아볼 수 있도록 해줄 겁니다. 구독 리스트를 하나 만들어 팬들에게 이를 전달하며, 여기에 자신의 이메일 주소를 적게 만들겠죠. 앨범이 준비되면 약속한 대로 구독 리스트에 자신의 메일을 적은 팬들은 즉시 소식을 받아볼 수 있을 겁니다. 녹음 스튜디오에 화재가 발생해서 출시 예정인 앨범이 취소되는 불상사가 발생해도 팬들에게 소식을 전할 수 있죠.

이제 모두가 행복해졌습니다. 밤낮으로 질문을 하는 팬들이 사라졌고, 팬들은 앨범 출시를 놓치지 않을 수 있게 되었으니까요.

위 비유는 우리가 코드를 짜면서 자주 만나게 되는 상황을 실제 일어날 법한 일로 바꾼 것입니다. 바로 아래 같은 상황 말이죠.

1. "제작 코드(producing code)"에선 원격에서 스크립트를 불러오는 것 같은 시간이 걸리는 일을 합니다. 위 비유에선 "가수"가 제작 코드에 해당합니다.
2. "소비 코드(consuming code)"에선 "제작 코드"가 준비되었을 때, 제작 코드의 결과를 사용합니다. 복수의 함수(소비 코드)가 제작 코드의 결과를 활용하고 싶어 할 수 있습니다. 위 비유에선, 제작 코드의 결과물을 기다리는 함수가 "팬"으로 비유되었습니다.
3. *프라미스(promise)* 는 "제작 코드"와 "소비 코드"를 연결해 주는 특별한 자바스크립트 객체입니다. 위 비유에선 "구독 리스트"가 프라미스죠. "제작 코드"는 시간이 얼마나 걸리던 상관없이 약속한 결과물을 만들어 냅니다. "프라미스"는 결과물이 준비되었을 때, 모든 구독 코드에서 이 결과를 사용할 수 있도록 해줍니다.

자바스크립트 프라미스는 비유에 사용된 구독 리스트보다 훨씬 복잡하기 때문에, 위 비유가 완벽하게 들어맞지는 않습니다. 비유에서 설명하지 못한 추가적인 기능과 한계점도 있죠. 하지만 일단 이 비유를 이용해 프라미스를 학습해보도록 합시다.

프라미스는 아래와 같은 문법으로 만들 수 있습니다.

```js
let promise = new Promise(function(resolve, reject) {
  // executor (제작 코드, "가수")
});
```

`new Promise`에 전달되는 콜백 함수는 *executor(실행자, 실행 함수)* 라고 불립니다.  executor 함수는 새로운 `프라미스`가 만들어질 때 자동으로 실행되며, 결과물을 최종적으로 만들어내는 제작 코드를 포함하고 있습니다. 위 비유에서 "가수"가 바로 executor입니다.

Its arguments `resolve` and `reject` are callbacks provided by JavaScript itself. Our code is only inside the executor.

When the executor obtains the result, be it soon or late - doesn't matter, it should call one of these callbacks:

- `resolve(value)` — if the job finished successfully, with result `value`.
- `reject(error)` — if an error occurred, `error` is the error object.

So to summarize: the executor runs automatically, it should do a job and then call either `resolve` or `reject`.

The `promise` object returned by `new Promise` constructor has internal properties:

- `state` — initially `"pending"`, then changes to either `"fulfilled"` when `resolve` is called or `"rejected"` when `reject` is called.
- `result` — initially `undefined`, then changes to `value` when `resolve(value)` called or `error` when `reject(error)` is called.

So the executor eventually moves `promise` to one of these states:

![](promise-resolve-reject.svg)

Later we'll see how "fans" can subscribe to these changes.

Here's an example of a promise constructor and a simple executor function with  "producing code" that takes time (via `setTimeout`):

```js run
let promise = new Promise(function(resolve, reject) {
  // 프라미스가 생성될 때 이 함수는 자동으로 실행됩니다.

  // 1초 뒤에 일이 성공적으로 끝났다는 신호와 함께, result의 값이 "done"이 됩니다.
  setTimeout(() => *!*resolve("done")*/!*, 1000);
});
```

위 코드를 통해 두 가지를 확인할 수 있습니다.

1. executor는 `new Promise`에 의해 자동으로 그리고 즉각적으로 호출됩니다.
2. executor는 인자로 `resolve`와 `reject` 함수를 받습니다. 이 함수들은 자바스크립트 엔진이 미리 정의한 함수이므로, 따로 만들 필요는 없습니다. 다만, `resolve`나 `reject` 중 하나를 반드시 호출해야 합니다.

    After one second of "processing" the executor calls `resolve("done")` to produce the result. This changes the state of the `promise` object:

    ![](promise-resolve-1.svg)

지금까진 성공적으로 일이 처리된 경우인 "fulfilled promise(약속이 이행된 프라미스)"에 대해 알아보았습니다.

이번에는 executor가 에러와 함께 약속한 작업을 거부하는 경우에 대해 살펴봅시다.

```js
let promise = new Promise(function(resolve, reject) {
  // 1초 뒤에 에러객체와 함께 실행이 종료되었다는 신호를 보냅니다.
  setTimeout(() =&amp;gt; *!*reject(new Error("Whoops!"))*/!*, 1000);
});
```

The call to `reject(...)` moves the promise object to `"rejected"` state:

![](promise-reject-1.svg)

지금까지 배운 내용을 요약해 봅시다. executor는 보통 시간이 걸리는 일을 수행합니다. 일이 끝나면 `resolve`나 `reject` 함수를 호출하는데, 이 때 프라미스 객체의 프로퍼티인 state가 변경됩니다.

이행된(resolved) 혹은 거부된(rejected) 프라미스는 "처리된(settled)" 프라미스라 부릅니다. 반면, "대기 상태의(pending)" 프라미스도 있습니다.

````smart header="결과 혹은 에러"
executor는 `resolve`나 `reject` 함수 중 하나를 반드시 호출해야 합니다. 함수가 호출되어 프라미스의 state가 변경되면, state는 더는 변하지 않습니다.

이후의 모든 `resolve`, `reject` 함수 호출은 무시됩니다.

```js
let promise = new Promise(function(resolve, reject) {
*!*
  resolve("done");
*/!*

  reject(new Error("…")); // 무시됨
  setTimeout(() =&amp;gt; resolve("…")); // 무시됨
});
```

이렇게 executor에 의해 끝난 일은 하나의 결과 혹은 에러만 가질 수 있습니다.

여기에 더하여, `resolve`/`reject`는 인자를 하나(혹은 아무것도 받지 않음)만 받고 그 이외의 인자들은 무시한다는 것도 잊지 마세요.
````

```smart header="`Error` 객체와 함께 거절하기"
무언가 잘 못 된 경우, executor함수는 `reject`를 호출해야만 합니다. 이때 인자는 `resolve`와 마찬가지로 어떤 타입도 가능합니다. 다만, `Error` 객체(또는 `Error`객체를 상속한 객체)를 사용할 것을 추천합니다. 이유는 뒤에서 설명하겠습니다.
```

````smart header="`resolve`, `reject` 함수 즉시 호출하기"
executor는 대게 무언가를 비동기적으로 수행하고, 약간의 시간이 지난 후에 `resolve`/`reject`를 호출합니다. 하지만 꼭 이렇게 할 필요는 없습니다. 아래와 같이 `resolve`나 `reject`를 즉시 호출할 수 있습니다.

```js
let promise = new Promise(function(resolve, reject) {
  // 일을 끝마치는 데 시간이 들지 않음
  resolve(123); // 결과(123)를 즉시 resolve에 전달함
});
```

어떤 일을 시작했는데 알고 보니 일이 이미 끝나 저장까지 되어있는 경우에 이렇게 처리할 수 있겠죠.

이 경우, 이행된(resolved) 프라미스를 즉시 갖게 됩니다.
````

```smart header="`state`와 `result`는 내부에 있습니다."
프라미스 객체의 `state`, `result` 프로퍼티는 내부에 있어서, "소비 코드"에선 이 프로퍼티에 직접 접근할 수 없고, `.then`/`.catch`/`.finally` 메서드를 사용해야 접근 가능합니다. 아래에서 이 메서드에 대해 살펴보도록 하겠습니다.
```

## 소비자: then, catch, finally

프라미스 객체는 executor("제작 코드" 혹은 "가수")와 결과나 에러를 받을 소비 함수("팬")를 이어주는 일을 합니다. `.then`, `.catch`, `.finally` 메서드를 사용하면 소비 함수를 등록(구독)할 수 있습니다.

### then

`.then`은 가장 중요하고 기본적인 메서드입니다.

문법은 다음과 같습니다.

```js
promise.then(
  function(result) { *!*/* 결과(result)를 다룹니다 */*/!* },
  function(error) { *!*/* 에러(error)를 다룹니다 */*/!* }
);
```

`.then`의 첫 번째 인수는 프라미스가 이행되었을 때(resolved) 실행되고, 실행 결과(result)를 받는 함수입니다.

`.then`의 두 번째 인수는 프라미스가 거부되었을 때(rejected) 실행되고, 에러(error)를 받는 함수입니다.

다음은 프라미스가 성공적으로 이행(resolve)된 경우에 관한 예시입니다.

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!"), 1000);
});

// resolve 함수는 .then의 첫 번째 함수를 실행합니다.
promise.then(
*!*
  result =&amp;gt; alert(result), // 1초후 "done!"을 출력
*/!*
  error =&amp;gt; alert(error) // 실행되지 않음
);
```

첫 번째 함수가 실행된 것을 확인할 수 있습니다.

프라미스가 거절(reject)된 경우에는 아래와 같이 두 번째 함수가 실행됩니다.

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() =&amp;gt; reject(new Error("Whoops!")), 1000);
});

// reject 함수는 .then의 두 번째 함수를 실행시킵니다.
promise.then(
  result =&amp;gt; alert(result), // 실행되지 않음
*!*
  error =&amp;gt; alert(error) // 1초후 "Error: Whoops!"을 출력
*/!*
);
```

프라미스가 이행된 상태만 처리하고 싶다면, `.then`의 인수를 하나만 전달하면 됩니다.

```js run
let promise = new Promise(resolve =&amp;gt; {
  setTimeout(() =&amp;gt; resolve("done!"), 1000);
});

*!*
promise.then(alert); // 1초 뒤 "done!" 출력
*/!*
```

### catch

프라미스가 거절된 경우만 처리하고 싶다면, `.then(null, errorHandlingFunction)`같이 `null`을 첫 번째 인수로 전달하면 됩니다. 아니면 `.catch(errorHandlingFunction)`를 써도 됩니다. 이는 `null`을 전달하는 것과 동일하게 작동합니다.


```js run
let promise = new Promise((resolve, reject) =&amp;gt; {
  setTimeout(() =&amp;gt; reject(new Error("Whoops!")), 1000);
});

*!*
// .catch(f) 는 promise.then(null, f)과 동일하게 작동합니다
promise.catch(alert); // 1초 뒤 "Error: Whoops!" 출력
*/!*
```

`.catch(f)`는 문법이 간결하다는 점만 빼고 `.then(null,f)`과 동일합니다.

### finally

`try {...} catch {...}`에 finally 절이 있는 것처럼, 프라미스에도 `finally`가 있습니다.

프라미스가 처리되면(settled) `f`가 항상 실행된다는 점에서 `.finally(f)` 호출은 `.then(f, f)`과 유사합니다. 프라미스가 이행(resolved)이나 거부(rejected) 일 때 실행되죠.

더는 필요치 않은 로딩 인디케이터(loading indicators)를 멈추는 경우같이, 끝마무리에 `finally`를 유용하게 쓸 수 있습니다. 결과가 어떻든 마무리가 필요한 경우 말이죠.

사용법은 아래와 같습니다.

```js
new Promise((resolve, reject) => {
  /* 시간이 걸리는 어떤 일을 수행하고, 그 후 resolve/reject을 호출함 */
})
*!*
  // 이행, 거절 여부와 상관없이, 프라미스의 처리가 완료되면 실행함
  .finally(() => stop loading indicator)
*/!*
  .then(result => show result, err => show error)
```

`.then(f, f)`과 finally는 완전히 동일하진 않고, 다음과 같은 차이점이 있습니다.

1. `finally` 핸들러엔 인수가 없고, 프라미스가 이행되었는지, 거부되었는지 여부도 알 수 없습니다. finally에선 절차를 마무리하는 "보편적" 동작을 수행하기 때문에, 성공/실패 여부를 몰라도 됩니다.
2. `finally` 핸들러는 결과(result)와 에러(error)를 다음 핸들러에게 전달합니다.

    아래 예제를 통해 result가 `finally`를 거쳐 `then`까지 전달되는 것을 확인할 수 있습니다.
    ```js run
    new Promise((resolve, reject) => {
      setTimeout(() => resolve("result"), 2000)
    })
      .finally(() => alert("Promise ready"))
      .then(result => alert(result)); // <-- .then에서 result를 다룸
    ```

    아래는 에러객체가 `finally`를 거쳐 `catch`까지 전될담을 보여줍니다.

    ```js run
    new Promise((resolve, reject) => {
      throw new Error("error");
    })
      .finally(() => alert("Promise ready"))
      .catch(err => alert(err)); // <-- .catch에서 에러 객체를 다룸
    ```  

    finally는 프라미스의 결과를 처리하려는 목적으로 만들어지지 않았기 때문에, 이행 여부에 상관없이 프라미스의 처리 결과를 전달해줍니다. 이런 특징은 유용하게 사용될 수 있습니다.

    프라미스 체이닝과 핸들러 간 결과 전달에 대한 이야기는 다음 챕터에서 이어나가도록 하겠습니다.

3. `.finally(f)`는 `.then(f, f)`보다 문법 측면에서 더 편리합니다. 함수 `f`를 중복해서 쓸 필요가 없습니다.

````smart header="처리된 프라미스의 핸들러는 즉각 실행됩니다."
프라미스가 대기(pending)상태일 때, `.then/catch/finally` 핸들러는 결과를 기다립니다. 반면, 프라미스가 처리(settled)되었을 땐 핸들러가 즉각 실행됩니다.

```js run
<<<<<<< HEAD
// 이행상태의 프라미스(즉시 이행됨)
let promise = new Promise(resolve =&amp;gt; resolve("done!"));
=======
// the promise becomes resolved immediately upon creation
let promise = new Promise(resolve => resolve("done!"));
>>>>>>> 4d654318ccb6d37d6cefc9b859cf111ff3c96b27

promise.then(alert); // done! (바로 출력됨)
```
````

이제, 실질적인 예제와 함께 프라미스를 이용해 어떻게 비동기 코드를 작성하는지 알아봅시다.

## 예제 : loadScript [#loadscript]

이전 챕터에서 스크립트를 불러오는 `loadScript` 함수를 작성한 바 있습니다.

복습 차원에서 콜백 기반의 비동기 처리 코드를 다시 살펴봅시다.

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src}를 불러오는 도중에 에러가 발생함.`));

  document.head.append(script);
}
```

위 코드를 프라미스를 이용해 다시 작성해 봅시다.

새로운 `loadScript` 함수엔 콜백 함수가 필요하지 않습니다. 대신, `loadScript` 함수는 스크립트가 로딩이 완전히 끝났을 때 이행되는 프라미스 객체를 만들고, 이를 반환합니다. 이제 외부 코드에서 `.then`을 이용해 이 함수에서 반환된 프라미스에 핸들러(구독 함수)를 더할 수 있게 되었습니다.

```js run
function loadScript(src) {  
  return new Promise(function(resolve, reject) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));

    document.head.append(script);
  });
}
```

사용법: 

```js run
let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");

promise.then(
  script => alert(`${script.src}을 불러왔습니다!`),
  error => alert(`Error: ${error.message}`)
);

promise.then(script => alert('또 핸들러...'));
```

위 예시를 통해 프라미스를 사용한 코드가 콜백 기반 패턴을 구현한 코드에 비해 다음과 같은 이점이 있다는 걸 알 수 있습니다.


| 프라미스 | 콜백 |
|----------|-----------|
| 프라미스를 이용하면 흐름이 자연스럽습니다. `loadScript(script)`로 스크립트를 읽고, 결과에 따라 그다음(`.then`)에 무엇을 할지에 대한 코드를 작성하면 되죠. | `loadScript(script, callback)`를 호출할 때, 함께 호출할 `callback` 함수가 준비되어 있어야 합니다. `loadScript`를 호출하기 *이전*에 호출 결과로 무엇을 할지 미리 알고 있어야 하죠.|
| 프라미스에 원하는 만큼 `.then`을 호출할 수 있습니다. `.then`을 호출하는 것은 새로운 "팬"(새로운 구독 함수)을 "구독 리스트"에 추가하는 것과 같습니다. 이와 관련된 자세한 내용은 [](info:promise-chaining)에서 다루도록 하겠습니다. | 콜백은 하나만 가능합니다. |

프라미스는 흐름이 자연스럽고 유연한 코드를 작성할 수 있게 해줍니다. 이 외에도 더 많은 장점이 있는데, 다음 챕터에서 더 살펴보도록 하겠습니다.
