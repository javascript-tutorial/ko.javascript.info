# Promise

당신이 탑 가수라고 상상해 보세요, 그리고 곧 나올 싱글 앨범에 대해 밤낮으로 물어보는 팬들을 상상해 보세요. 

당신은 안식을 취하기 위해, 앨범이 출시될 때 그들에게 보내겠다고 약속을 합니다. 그리고 업데이트를 구독할 수 있는 리스트를 팬들에게 건넵니다. 그곳에는 팬들의 이메일을 적을 수 있어서 노래가 나오면 모든 구독자가 즉시로 알림을 받을 수 있도록 합니다. 그리고 뭔가 심하게 잘 못 되어도, 다시 말해, 노래 출시가 취소되더라도 여전히 팬들은 알림을 받을 수 있을 것입니다.

더 이상 당신에게 많은 인파가 몰리지도 않고 팬들은 앨범을 놓치지도 않을 것이기에 모두가 행복할 수 있을 겁니다.

이것은 우리가 프로그래밍하며 주로 갖게 되는 코드들에 대한 실생활 비유입니다:

1. "제작 코드"는 무언가 시간이 걸리는 일을 합니다. 예를 들어, 원격에서 스크립트를 불러온다고 해 봅시다. 이것이 비유에서 "가수" 입니다.
2. "소비 코드"는 "제작 코드"가 준비되었을 때 이 코드의 결과를 사용할 것입니다. 많은 소비 함수들이 그 결과를 원할 수도 있습니다. 이 함수들이 "팬들" 입니다.
3. *promise*는 특별한 JavaScript 객체입니다. "제작 코드"와 "소비 코드"를 연결해 줍니다. 우리 비유에서: "구독 리스트"와 같은 것입니다. "제작 코드"는 얼마든 시간을 들여서 약속된 결과를 만들어 냅니다. 그리고 "promise"는 그 결과가 준비되었을 때 모든 구독된 코드에서 사용할 수 있도록 만들어 줍니다.

이 비유가 그렇게 정확하지는 않습니다. 왜냐하면, JavaScript의 promise는 간단한 구독 리스트보다는 매우 복잡하기 때문입니다. promise는 추가적인 기능들과 한계점들을 가지고 있습니다. 하지만 시작하기에는 괜찮습니다.

promise 객체를 위한 생성자 문법은 다음과 같습니다:

```js
let promise = new Promise(function(resolve, reject) {
  // executor (the producing code, "singer")
});
```

`new Promise`로 전달되는 함수는 *실행자 executor*라고 불립니다. promise가 만들어졌을 때 실행자 함수는 자동으로 실행됩니다. 이 함수는 최종적으로 결과물을 만들어내는 제작 코드를 포함하고 있습니다. 위 비유에서 실행자는 "가수"입니다.

결과물로 `promise` 객체는 다음 내부 속성을 갖고 있습니다: 

- `상태 state` - 최초로는 "pending"(보류 중)이며, 그다음으로는 "fulfilled"(약속이 이행됨) 혹은 "rejected"(거절됨)으로 바뀝니다.
- `결과 result` - 임의로 선택된 값이며, 처음에는 `undefined`입니다.

실행자가 일을 끝마치면 인자로 받은 함수 중 하나를 호출해야 합니다:

- `resolve(value)` - 일이 성공적으로 끝났을 때를 말함.
    - `state`를 `"fulfilled"`으로 설정,
    - `result`를 `value`으로 바꿈.
- `reject(error)` - 에러가 발생했을 때를 말함.
    - `state`를 `"rejected"`으로 설정,
    - `state`를 `error`로 설정.

![](promise-resolve-reject.png)

나중에 우리는 어떻게 이 변화들이 "팬"들에게 알려지는지 보게 될 것입니다.

아래 코드는 promise 생성자와 간단한 실행자 함수와 "제작 코드"(`setTimeout` 함수) 예입니다:

```js run
let promise = new Promise(function(resolve, reject) {
  // 이 함수는 promise가 생성될 때 자동으로 실행됩니다.

  // 1 초 뒤에 "done!"결과와 함께 일이 끝났다고 신호를 보냅니다.
  setTimeout(() =&amp;gt; *!*resolve("done!")*/!*, 1000);
});
```

위의 코드에서 두 가지를 볼 수 있습니다:

1. 실행자는 자동으로 그리고 즉각적으로 호출 된다(`new Promise`에 의해서).
2. 실행자는 두 개의 인자 `resolve`와 `reject`를 받는다. - 이 함수들은 JavaScript 엔진에 미리 정의된 함수들이다. 그러니 그것들을 만들 필요는 없다. 대신, 우리는 그것들이 준비되었을 때 호출하기 위해서 실행자를 써야 한다.

"처리" 1초 후에, 실행자는 결과를 만들기 위해 `resolve("done")`를 호출합니다.

![](promise-resolve-1.png)

이것은 성공적으로 일 처리가 된, "약속이 이행됨"에 해당하는 예입니다.

이번에는 promise가 에러와 함께 거절당하는 실행자의 예입니다. 

```js
let promise = new Promise(function(resolve, reject) {
  // 1초 후에 일이 에러와 함께 끝났다는 신호를 보냅니다.
  setTimeout(() =&amp;gt; *!*reject(new Error("Whoops!"))*/!*, 1000);
});
```

![](promise-reject-1.png)

요약하면, 실행자는 보통 뭔가 시간이 걸리는 일을 해야 합니다. 그다음 대응하는 promise 객체의 상태로 바꾸기 위해 `resolve`나 `reject`를 호출합니다.

이행되거나 거절된 상태인 promise는 "settled"라고 불리며 "pending" promise 상태에 반대되는 개념입니다.

````smart header="오직 하나의 결과나 에러만 있을 수 있다"
실행자는 `resolve`나 `reject` 하나만을 호출해야 한다. promise의 상태변화는 최종적이다.

이 이상의 모든 `resolve`와 `reject`의 호출은 무시된다:

```js
let promise = new Promise(function(resolve, reject) {
  resolve("done");

  reject(new Error("…")); // ignored
  setTimeout(() =&amp;gt; resolve("…")); // ignored
});
```

즉, 실행자에 의해서 끝난 일은 결과 혹은 에러 둘 중 하나만 가질 수 있다는 것입니다.

게다가, `resolve`/`reject`는 단 하나의 인자만 받고 이외의 인자들은 무시할 것 입니다.
````

```smart header="`Error` 객체와 함께 거절하기"
무언가 잘 못 되는 경우, 우리는 `reject`를 어떤 타입의 인자와도 함께 호출할 수 있다(`resolve`처럼). 하지만 `Error` 객체(또는 `Error`로 부터 상속한 객체)를 사용할 것을 권한다. 이유는 곧 알게 될 것이다.
```

````smart header="즉시로  `resolve`/`reject` 호출하기"
관례로, 실행자는 대게 비동기적으로 일하고 `resolve`/`reject`를 다음번에 호출한다. 하지만 꼭 그럴 필요는 없다. 다음과 같이 `resolve`나 `reject`를 즉시 호출할 수도 있다:

```js
let promise = new Promise(function(resolve, reject) {
  // 뭔가 일을 하기 위해 시간을 들이지 않는다.
  resolve(123); // 즉시 결과를 준다: 123
});
```

예를 들어, 일을 시작했지만 이미 모든 것이 완료되었을 때 발생할 수 있는 경우이다.

그래도 괜찮다. 우리는 즉시로 promise를 해결했으니 아무런 문제 없다.
````

```smart header="`state` 와 `result`는 내부에 있다."
promise 객체의 `state`와 `result` 속성들은 내부적이다. "소비 코드"에서 바로 그것들에 접근할 수는 없다. 대신 이를 위해 우리는 `.then`/`.catch` 메소드를 사용할 수 있다. 이것들은 아래 설명되어 있다. 
```

## 소비자: "then"과 "catch"

promise 객체는 실행자("제작 코드"또는 "가수")와 결과나 에러를 받을 소비 함수 ("팬")를 이어주는 일을 합니다. 소비 함수들은 `.then`이나 `.catch` 메소드를 통해 등록(구독)될 수 있습니다. 

`.then`의 문법은:

```js
promise.then(
  function(result) { *!*/* handle a successful result */*/!* },
  function(error) { *!*/* handle an error */*/!* }
);
```

`.then`의 첫 번째 인자는 다음과 같은 일을 하는 함수입니다:

1. promise가 이행되었을 때 실행한다. 그리고
2. 결과를 받는다.

`.then`의 두 번째 인자는 다음과 같은 일을 하는 함수입니다:

1. promise가 거절되었을 때 실행된다. 그리고
2. 에러를 받는다.

다음은 이행된 promise에 반응하는 예입니다.

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() =&amp;gt; resolve("done!"), 1000);
});

// resolve는 .then 안에 첫 번째 함수를 실행시킨다.
promise.then(
*!*
  result =&amp;gt; alert(result), // shows "done!" after 1 second
*/!*
  error =&amp;gt; alert(error) // doesn't run
);
```

첫 번째 함수가 실행되었습니다.

그리고 거절된 경우에는 두 번째가 실행됩니다.

```js run
let promise = new Promise(function(resolve, reject) {
  setTimeout(() =&amp;gt; reject(new Error("Whoops!")), 1000);
});

// reject는 .then안에 두 번째 함수를 실행시킨다.
promise.then(
  result =&amp;gt; alert(result), // 실행이 안된다
*!*
  error =&amp;gt; alert(error) // 1초 뒤에 "Error: Whoops!" 출력
*/!*
);
```

만약 단지 성공적인 완료(이행됨)에만 관심이 있다면, `.then`에 한 개의 인자만 제공하면 됩니다:

```js run
let promise = new Promise(resolve =&amp;gt; {
  setTimeout(() =&amp;gt; resolve("done!"), 1000);
});

*!*
promise.then(alert); // 1초 뒤 "done!" 출력
*/!*
```

만약 우리가 에러 애만 관심이 있다면 `null`만 첫 번째 인자로 사용하면 됩니다: `then(null, errorHandlingFunction)`. 혹은 `.catch(errorHandlingFunction)`을 사용할 수 있습니다. 이는 다음과 완벽히 같습니다: 


```js run
let promise = new Promise((resolve, reject) =&amp;gt; {
  setTimeout(() =&amp;gt; reject(new Error("Whoops!")), 1000);
});

*!*
// .catch(f) is the same as promise.then(null, f)
promise.catch(alert); // shows "Error: Whoops!" after 1 second
*/!*
```

`.catch(f)` 호출은 `.then(null,f)`과 매우 유사합니다. 단지 좀 더 짧을 뿐입니다.

````smart header="이행된 promise에 `then`은 즉시로 실행된다"
만약 promise가 보류 중이라면, `.then/catch` 핸들러는 결과를 기다린다. 반대로 promise가 이미 정해졌다면 즉시로 실행된다:

```js run
// 즉시 이행되는 promise
let promise = new Promise(resolve =&amp;gt; resolve("done!"));

promise.then(alert); // done! (당장 출력한다)
```

어떤 일들은 시간이 필요할 수도 있고 즉시로 끝낼 수도 있다. 좋은 점은: `.then` 핸들러는 두 경우 모두에 실행이 보장되어있다는 것이다.

````

````smart header=" `.then`/`.catch`의 핸들러들은 항상 비동기이다 "
promise가 즉시로 이행되었을 때에도 `.then`/`.catch` *이후*나타나는 라인들은 여전히 먼저 실행될 수 있다.

JavaScript 엔진 내부에는 모든 `.then/catch` 핸들러를 가지는 실행 큐가 있다.

하지만 오직 현재의 실행이 끝났을 때에만 그 큐를 들여다본다.

다시 말해, `.then/catch` 핸들러는 엔진이 현재의 코드를 끝날 때까지는 실행을 보류한다.

예를 들어:

```js run
// "즉시로" 끝나는 promise
const executor = resolve =&amp;gt; resolve("done!");
const promise = new Promise(executor);

promise.then(alert); // 이 라인은 마지막으로 alert 실행 (*)

alert("code finished"); // 이 라인이 먼저 실행된다.
```

promise는 즉시로 결정된 상태가 된다. 하지만 엔진은 현재 코드를 먼저 끝낸다. `alert`를 먼저 실행시키고 *이후에* `.then` 핸들러를 실행시키기 위해 큐를 들여다본다.

그래서 `.then` *이후* 라인의 코드는 즉시 결정되는 promise도 언제나 promise의 구독자 코드가 실행되기 *이전*에 끝난다.

이것은 보통은 중요한 사항은 아니다. 하지만 어떤 시나리오에서는 순서가 매우 중요할 수 있다.
````

다음으로, 비동기 코드를 위해서 promise가 어떻게 우리를 도울 수 있는지 실질적인 예들을 살펴봅시다.

## 예제 : loadScript

우리는 이전 챕터에서 스크립트를 불러오기 위해 `loadScript` 함수를 사용했었습니다.

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
let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js");

promise.then(
  script =&amp;gt; alert(`${script.src} is loaded!`),
  error =&amp;gt; alert(`Error: ${error.message}`)
);

promise.then(script =&amp;gt; alert('One more handler to do something else!'));
```

우리는 콜백 기반 패턴의 몇 가지 장점을 바로 확인할 수 있습니다: 

```compare minus="Callbacks" plus="Promises"
- 반드시 `loadScript`를 호출할 때 준비된 `callback` 함수를 가지고 있어야 한다. 다시 말해, 우리는 `loadScript`가 호출되기 *전에* 결과로 무엇을 할 것인지 알고 있어야 한다. 
- 단 하나의 콜백만 가질 수 있다.
+ promise는 더 자연스러운 순서로 일할 수 있게 해 준다. 먼저 `loadScript`를 실행하고 `.then`(그 다음) 결과를 가지고 어떤 일을 할지 작성한다. 
+ promise에 `.then`을 원하는 만큼 호출할 수 있다. 호출할 때마다, 우리는 "구독 리스트"에 새로운 "팬", 새로운 구독 함수를 추가하는 것이다. 더 자세한 것은 다음 섹션에서: [Promise Chaining](/promise-chaining).
```

promise는 이렇게 벌써 우리 에계 더 나은 코드 흐름과 유연성을 제공합니다. 하지만 더 있습니다. 그것들은 다음 쳅터에서 보도록 하죠. 
