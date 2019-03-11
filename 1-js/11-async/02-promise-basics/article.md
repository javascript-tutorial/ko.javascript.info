# 프라미스(Promise)

당신이 탑 가수라고 상상해 보세요. 그리고 팬들이 밤 낮으로 다음 싱글 앨범이 언제 나오는지 물어보고 있다고 생각해 보세요. 

팬들로부터 벗어나 편히 쉬기 위해 당신은 앨범 출시일정을 팬들에게 알려주겠다고 약속을 합니다. 출시 일정 진행상황을 구독할 수 있는 리스트를 팬들에게 건네줍니다. 팬들은 구독 리스트에 이메일을 적고, 노래가 나오면 그 리스트에 있는 모든 구독자가 즉시 알림을 받을 수 있도록 합니다. 앨범 발매가 취소되는 등의 심각한 일이 발생해도 리스트에 있는 팬들은 여전히 알림을 받을 수 있을 것입니다.

이제 모두가 행복해졌습니다. 밤낮으로 질문을 하는 팬들도 없어졌고, 팬들은 앨범 출시를 놓치지 않을 수 있게 되었기 때문입니다.

위 비유는 우리가 코드를 짜면서 자주 만나게 되는 상황을 실제 상황으로 나타낸 것입니다:

1. "제작 코드(producing code)"는 무언가 시간이 걸리는 일입니다. 원격에서 스크립트를 불러오는 것 같이 말이죠. 위 비유에선 "가수"가 제작코드에 해당합니다.
2. "소비 코드(consuming code)"는 "제작 코드"가 준비되었을 때, 제작 코드의 결과를 사용하는 코드입니다. 여러 함수에서 결과물을 활용하고 싶어할 수 있습니다. 위 비유에선 결과물을 기다리는 함수들을 "팬들"로 비유했습니다.
3. *프라미스*는 특별한 자바스크립트 객체입니다. "제작 코드"와 "소비 코드"를 연결해 줍니다. 위 비유에서 "구독 리스트"가 프라미즈입니다. "제작 코드"는 얼마든 시간을 들여서 약속된 결과를 만들어 냅니다. 그리고 "프라미스"는 결과가 준비되었을 때, 모든 구독 코드에서 이 결과를 사용할 수 있도록 해줍니다.

이 비유가 완벽한건 아닙니다. 왜냐하면, 자바스크립트의 프라미스는 간단한 구독 리스트보다는 매우 복잡하기 때문입니다. 프라미스엔 추가적인 기능도 있고, 한계점도 있습니다. 하지만 일단 이 비유만으로 프라미스 학습을 시작하는건 나쁘지 않습니다.

프라미스 객체를 위한 생성자 문법은 다음과 같습니다:

```js
let promise = new Promise(function(resolve, reject) {
  // executor (the producing code, "singer")
});
```

`new Promise`에 전달되는 함수는 *실행자*(executor)라고 불립니다. 프라미스가 만들어질 때, 실행자 함수는 자동으로 동작합니다. 이 함수는 결과물을 최종적으로 만들어내는 제작 코드를 포함하고 있습니다. 위 비유에서 "가수"가 바로 실행자 입니다.

결과물로 `promise` 객체는 다음 내부 프로퍼티을 갖습니다:

- `state` - 처음엔 "pending"(보류 중)이며, 나중에 "fulfilled"(약속이 이행됨) 혹은 "rejected"(거절됨)으로 바뀝니다.
- `result` - 임의로 선택된 값이며, 처음에는 `undefined`입니다.

실행자가 일을 끝마치면 인자로 받은 함수 중 하나를 호출해야 합니다:

- `resolve(value)` - 일이 성공적으로 끝났을 때를 말함.
    - `state`를 `"fulfilled"`으로 설정,
    - `result`를 `value`으로 바꿈.
- `reject(error)` - 에러가 발생했을 때를 말함.
    - `state`를 `"rejected"`으로 설정,
    - `state`를 `error`로 설정.

![](promise-resolve-reject.png)

나중에 우리는 어떻게 이 변화들이 "팬"들에게 알려지는지 보게 될 것입니다.

간단한 실행자 함수와 "제작 코드"(`setTimeout` 함수)가 있는 Promise 생성자를 살펴보도록 합시다:

```js run
let promise = new Promise(function(resolve, reject) {
  // 이 함수는 프라미스가 생성될 때 자동으로 실행됩니다.

  // 1 초 뒤에 "done!"결과와 함께 일이 끝났다고 신호를 보냅니다.
  setTimeout(() =&amp;gt; *!*resolve("done!")*/!*, 1000);
});
```

위 코드를 통해 두 가지를 확인할 수 있습니다:

1. 실행자는 (`new Promise`에 의해서)자동으로 그리고 즉각적으로 호출 됩니다.
2. 실행자는 두 개의 인자, `resolve`와 `reject`를 받습니다. -- 이 함수들은 자바스크립트 엔진이 미리 정의한 함수이므로, 따로 만들 필요는 없습니다. 대신, 우리는 실행자를 만들어 함수가 준비되었을 때 호출할 수 있게 해야합니다.

"처리"가 시작된 지 1초 후에, 실행자는 결과를 만들기 위해 `resolve("done")`를 호출합니다.

![](promise-resolve-1.png)

성공적으로 일이 완수 된 경우는 위와 같이 처리됩니다. 이 경우를, "약속이 이행됨(fulfilled promise)"라고 합니다.

이번에는 실행자가 에러와 함께 프라미즈를 거절하는 경우를 살펴봅시다:

```js
let promise = new Promise(function(resolve, reject) {
  // 1초 후에 일이 에러와 함께 끝났다는 신호를 보냅니다.
  setTimeout(() =&amp;gt; *!*reject(new Error("Whoops!"))*/!*, 1000);
});
```

![](promise-reject-1.png)

위에서 살펴본 바와 같이, 실행자는 보통 시간이 걸리는 일을 수행합니다. 일을 마친다음, `resolve`나 `reject`를 호출합니다. 이 호출을 통해 Promise 객체의 상태가 바뀝니다.

이행(resolved)되거나 거절(rejected)된 상태의 Promise는 "settled"라고 불리며, 이에 반대되는 "pending" Promise도 있습니다.

````smart header="오직 하나의 결과나 에러만 있을 수 있습니다"
실행자는 `resolve`나 `reject` 하나만 호출할 수 있습니다. 프라미즈의 상태가 한번 결정되면, 이는 변하지 않습니다.

상태가 한번 결정된 이후의 모든 `resolve`와 `reject` 호출은 무시됩니다:

```js
let promise = new Promise(function(resolve, reject) {
  resolve("done");

  reject(new Error("…")); // 무시됨
  setTimeout(() =&amp;gt; resolve("…")); // 무시됨
});
```

이렇게, 실행자에 의해서 끝난 일은 하나의 결과 혹은 에러만 가질 수 있습니다.

여기에 더하여, `resolve`/`reject`는 단 하나의 인자(혹은 아무것도 받지 않음)만 받고 그 이외의 인자들은 무시할 것 입니다.
````

```smart header="`Error` 객체와 함께 거절하기"
무언가 잘 못 된 경우, 우리는 (`resolve`와 마찬가지로)`reject`를 호출할 수 있습니다. 이때 인자의 타입은 어떤 타입도 가능합니다. 하지만 인자로는 `Error` 객체(또는 `Error`로 부터 상속한 객체)를 사용할 것을 추천합니다. 이유는 뒤에서 설명드리겠습니다.
```

````smart header="`resolve`/`reject` 즉시 호출하기"
실행자는 대게 비동기적으로 일하고 `resolve`/`reject`를 약간의 시간이 흐른다음 호출합니다. 하지만 꼭 이렇게 할 필요는 없습니다. 다음 코드와 같이 `resolve`나 `reject`를 즉시 호출할 수도 있습니다:

```js
let promise = new Promise(function(resolve, reject) {
  // 일을 끝마치는데 시간이 들지 않음
  resolve(123); // 결과(123)를 즉시 resolve에 전달함
});
```

어떤 일을 시작했는데, 알고보니 이 일이 이미 끝마쳐져 있는 경우가 있을 수 있습니다.

이럴떄, 바로 resolved Promise를 가질 수 있습니다.
````

<<<<<<< HEAD:6-async/02-promise-basics/article.md
```smart header="`state` 와 `result`는 내부에 있다."
promise 객체의 `state`와 `result` 프로퍼티는 자바스크립트 엔진에서 정의합니다. 따라서, "소비 코드"에선 이 프로퍼티에 바로 접근할 수 없습니다. `.then`/`.catch`/`.finally` 메서드를 사용하면 접근이 가능합니다. 아래에서 이 메서드를 살펴보도록 하겠습니다.
```

## 소비자: then, catch, finally

promise 객체는 실행자("제작 코드" 또는 "가수")와 결과나 에러를 받을 소비 함수 ("팬")를 이어주는 일을 합니다. 소비 함수들은 `.then`, `.catch`, `.finally` 메서드를 통해 등록(구독)될 수 있습니다. 

### then

`.then`은 가장 중요하고 기초적인 메서드입니다.

문법은 다음과 같습니다:

```js
promise.then(
  function(result) { *!*/* handle a successful result */*/!* },
  function(error) { *!*/* handle an error */*/!* }
);
```

`.then`의 첫 번째 인자는 다음과 같은 일을 하는 함수입니다:

1. Promise가 이행되었을 때(resolved) 실행된다. 그리고
2. 결과를 받는다.

`.then`의 두 번째 인자는 다음과 같은 일을 하는 함수입니다:

1. promise가 거절되었을 때(rejected) 실행된다. 그리고
2. 에러를 받는다.

다음은 이행된 promise에 반응하는 예입니다.

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() =&amp;gt; resolve("done!"), 1000);
});

// resolve는 .then 안의 첫 번째 함수를 실행시킵니다.
promise.then(
*!*
  result =&amp;gt; alert(result), // 1초후 "done!"을 출력
*/!*
  error =&amp;gt; alert(error) // 실행되지 않음
);
```

첫 번째 함수가 실행되었습니다.

거절된 경우에는 두 번째가 실행됩니다.

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() =&amp;gt; reject(new Error("Whoops!")), 1000);
});

// reject는 .then안에 두 번째 함수를 실행시킵니다.
promise.then(
  result =&amp;gt; alert(result), // 실행되지 않음
*!*
  error =&amp;gt; alert(error) // 1초후 "Error: Whoops!"을 출력
*/!*
);
```

만약 이행 된 상태만 다루고 싶다면, `.then`에 함수 인자 한 개만 전달하면 됩니다:

```js run
let promise = new Promise(resolve =&amp;gt; {
  setTimeout(() =&amp;gt; resolve("done!"), 1000);
});

*!*
promise.then(alert); // 1초 뒤 "done!" 출력
*/!*
```

### catch

If we're interested only in errors, then we can use `null` as the first argument: `.then(null, errorHandlingFunction)`. Or we can use `.catch(errorHandlingFunction)`, which is exactly the same:
만약 에러에만 관심이 있다면, `.then(null, errorHandlingFunction)`같이 `null`을 첫 번째 인자로 전달해주면 됩니다. `.catch(errorHandlingFunction)`를 써도 `null`을 전달하는 것과 동일하게 작동합니다.


```js run
let promise = new Promise((resolve, reject) =&amp;gt; {
  setTimeout(() =&amp;gt; reject(new Error("Whoops!")), 1000);
});

*!*
// .catch(f) 는 promise.then(null, f)과 동일하게 작동함
promise.catch(alert); // 1초 뒤 "Error: Whoops!" 출력
*/!*
```

`.catch(f)` 호출은 `.then(null,f)`과 동일합니다. 짧다는 점만 다릅니다.

### finally

`.finally(f)`를 호출하는 건 `.then(f, f)`과 유사합니다. finally는 프라미즈가 settled되었을 때 실행됩니다: 이행(resolved)되거나 거절(rejected)된 상태의 프라미즈 상태 말이죠.

더이상 필요치 않은 로딩 인디케이터(loading indicators)를 멈추는경우 같이, 뭔가를 청소하는데 finally를 쓸 수 있습니다. 아래와 같이 말이죠

```js
new Promise((resolve, reject) => {
  /* 시간이 걸리는 어떤 일을 수행하고, 그 후 resolve/reject을 호출함 */
})
*!*
  // 성공 실패 여부와 상관없이, 프라미즈가 settled상태가 되면 실행함
  .finally(() => stop loading indicator)
*/!*
  .then(result => show result, err => show error)
```

`.then(f, f)`와 finally는 완전히 동일하진 않고, 아래와 같은 차이점이 있습니다:

1. `finally` 핸들러엔 인수가 없습니다. 프라미즈가 성공했는지 실패했는지 여부를 `finally`안에선 알 수 없습니다. finally안에선 절차를 마무리 하는 "보편적" 동작을 하기 때문에, 성공/실패 여부를 몰라도 됩니다.
2. Finally는 결과와 에러를 다음 핸들러에게 전달합니다.

    아래 예제는, result가 `finally`를 거쳐 `then`으로 전달됨을 보여줍니다:
    ```js run
    new Promise((resolve, reject) => {
      setTimeout(() => resolve("result"), 2000)
    })
      .finally(() => alert("Promise ready"))
      .then(result => alert(result)); // result
    ```

    이 예제는 error가 `finally`를 거쳐 `catch`로 전될담을 보여줍니다:

    ```js run
    new Promise((resolve, reject) => {
      throw new Error("error");
    })
      .finally(() => alert("Promise ready"))
      .catch(err => alert(err)); // error
    ```  

    이런 finally의 특징은 유용하게 사용될 수 있습니다. finally는 프라미즈의 결과를 처리하기 위해 만들어진 게 아니기 때문에, 결과를 그냥 전달해주기만 합니다.

    프라미즈 체이닝과 결과를 전달해주는 것에 대한 이야기는 다음 챕터에서 좀 더 해보도록 하겠습니다.

3. `.finally(f)`는 문법적으로 더 편리합니다. `.then(f, f)`과같이 함수 두개를 전달할 필요가 없기 때문입니다.

````smart header="On settled promises handlers runs immediately"
If a promise is pending, `.then/catch/finally` handlers wait for the result. Otherwise, if a promise has already settled, they execute immediately:

```js run
// 즉시 이행되는 프라미스
let promise = new Promise(resolve =&amp;gt; resolve("done!"));

promise.then(alert); // done! (바로 출력됨)
```

어떤 일들은 끝마치는데 시간이 필요할 수도 있고, 어떤 일은 즉시 끝날 수도 있습니다.`.then` 핸들러의 좋은 점은 두 경우에 모두 실행이 보장된다는 점입니다.

````

````smart header="Handlers of `.then`/`.catch`/`.finally` are always asynchronous"
Even when the Promise is immediately resolved, code which occurs on lines *below* your `.then`/`.catch`/`.finally` may still execute first.

The JavaScript engine has an internal execution queue which gets all `.then/catch/finally` handlers.

But it only looks into that queue when the current execution is finished. In other words, the handlers are pending execution until the engine is done with the current code.

For instance, here:

```js run
// an "immediately" resolved Promise
const executor = resolve => resolve("done!");
const promise = new Promise(executor);

promise.then(alert); // this alert shows last (*)

alert("code finished"); // this alert shows first
```

프라미스는 즉시 settled 상태가 됩니다. 하지만 엔진은 현재 코드를 먼저 끝내고, `alert("code finished")`를 실행합니다. 그리고 그 *이후에* `.then` 핸들러를 실행시키기 위해 큐를 들여다봅니다.

So the code *after* `.then` ends up always running *before* the Promise's subscribers, even in the case of an immediately-resolved Promise.

Sometimes that's unimportant, while in some scenarios the order may matter a great deal.
````

다음으로, 비동기 코드 작성시 프라미스 활용법을 실질적인 예를 통해 살펴보겠습니다.

## 예제 : loadScript

우리는 이전 주제에서 스크립트를 불러오기 위해 `loadScript` 함수를 사용했었습니다.

복습하는 의미에서 콜백 기반의 다른 방식을 봅시다:

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () =&amp;gt; callback(null, script);
  script.onerror = () =&amp;gt; callback(new Error(`Script load error ` + src));

  document.head.append(script);
}
```

이것을 promise를 사용해서 다시 작성해 봅시다.

새로운 `loadScript` 함수는 콜백이 필요 없습니다. 대신, 스크립트 불러오기가 완료되었을 때 결정되는 promise 객체를 만들고 반환할 것입니다. 그리고 promise 바깥에 `.then`을 사용해서 이것에 핸들러(구독 코드)를 더할 수 있습니다:

```js run
function loadScript(src) {  
  return new Promise(function(resolve, reject) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () =&amp;gt; resolve(script);
    script.onerror = () =&amp;gt; reject(new Error("Script load error: " + src));

    document.head.append(script);
  });
}
```

사용하기: 

```js run
let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");

promise.then(
  script =&amp;gt; alert(`${script.src} is loaded!`),
  error =&amp;gt; alert(`Error: ${error.message}`)
);

promise.then(script =&amp;gt; alert('One more handler to do something else!'));
```

우리는 콜백 기반 패턴의 몇 가지 장점을 바로 확인할 수 있습니다: 


| Promises | Callbacks |
|----------|-----------|
| Promises allow us to do things in the natural order. First, we run `loadScript(script)`, and `.then` we write what to do with the result. | We must have a `callback` function at our disposal when calling `loadScript(script, callback)`. In other words, we must know what to do with the result *before* `loadScript` is called. |
| We can call `.then` on a Promise as many times as we want. Each time, we're adding a new "fan", a new subscribing function, to the "subscription list". More about this in the next chapter: [](info:promise-chaining). | There can be only one callback. |

So Promises give us better code flow and flexibility. But there's more. We'll see that in the next chapters.