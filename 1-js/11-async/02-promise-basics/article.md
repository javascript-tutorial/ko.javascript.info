# 프라미스

탑 가수인 당신이 밤·낮으로 다음 싱글 앨범이 언제 나오는지 물어보는 팬들을 상대해야 한다고 가정해 봅시다. 

출시 일정 진행 상황을 구독할 수 있는 리스트를 팬들에게 건네주고, 앨범 출시 일정을 이 리스트를 통해 알려주겠다고 팬들과 약속을 합니다. 팬들은 구독 리스트에 이메일을 적습니다. 신곡이 나오면 그 리스트에 있는 모든 구독자가 즉시 알림을 받을 수 있게 되죠. 앨범 발매가 취소되는 등의 심각한 일이 발생해도 리스트에 있는 팬들은 여전히 알림을 받을 수 있을 것입니다. 이 모든 일을 통해 당신은 모든 팬을 상대하지 않아도 됩니다.

모두가 행복해졌네요. 밤낮으로 질문을 하는 팬들도 없어졌고, 팬들은 앨범 출시를 놓치지 않을 수 있게 되었습니다.

위 비유는 우리가 코드를 짜면서 자주 만나는 상황을 실제 상황으로 비유 한 것입니다. 이 실제 상황은 다음과 같습니다.

1. "제작 코드(producing code)"는 무언가 시간이 걸리는 일입니다. 원격에서 스크립트를 불러오는 것 같이 말이죠. 위 비유에선 "가수"가 제작 코드에 해당합니다.
2. "소비 코드(consuming code)"는 "제작 코드"가 준비되었을 때, 제작 코드의 결과를 사용하는 코드입니다. 여러 함수(소비 코드)에서 제작 코드의 결과를 활용하고 싶어 할 수 있습니다. 위 비유에선 결과물을 기다리는 함수들을 "팬들"로 비유했습니다.
3. *프라미스(promise)*는 "제작 코드"와 "소비 코드"를 연결해 주는 특별한 자바스크립트 객체입니다. 위 비유에서 "구독 리스트"가 프라미즈입니다. "제작 코드"는 시간을 들여 약속한 결과물을 만들어 냅니다. "프라미스"는 결과물이 준비되었을 때, 모든 구독 코드에서 이 결과를 사용할 수 있도록 해줍니다.

이 비유가 완벽한 건 아닙니다. 자바스크립트의 프라미스는 비유에 사용된 구독 리스트보다 훨씬 복잡합니다. 프라미스엔 추가적인 기능과 한계점도 있습니다. 하지만 일단 이 비유를 이용해 프라미스를 학습해보도록 합시다.

프라미스 객체를 위한 생성자 문법은 다음과 같습니다.

```js
let promise = new Promise(function(resolve, reject) {
  // 실행자 (제작 코드, "가수")
});
```

`new Promise`에 전달되는 콜백 함수는 *executor(실행자, 실행 함수)* 라고 불립니다. 프라미스가 만들어질 때 executor는 자동으로 실행됩니다. executor는 결과물을 최종적으로 만들어내는 제작 코드를 포함하고 있습니다. 위 비유에서 "가수"가 바로 executor 입니다.

결과물로 반환되는 프라미스 객체엔 다음 내부 프로퍼티가 있습니다.

- `state` - 처음엔 "pending(보류)" 상태이고, 나중에 "fulfilled(처리)" 혹은 "rejected(거부)"로 바뀝니다.
- `result` - 임의로 선택된 값이며, 처음에는 `undefined`입니다.

executor의 실행이 끝나면 인자로 받은 콜백인 resolve나 reject 중 하나를 호출해야 합니다.

- `resolve(value)` - 일이 성공적으로 끝났을 때 호출됨.
    - `state`의 값이 `"fulfilled"`이 되고,
    - `result`의 값이 `value`로 바뀜.
- `reject(error)` - 일이 실패했을 때 호출됨.
    - `state`의 값이 `"rejected"`이 되고,
    - `result`의 값이 `error`로 바뀜.

![](promise-resolve-reject.png)

이 변화가 어떻게 "팬"들에게 전달되는지는 잠시 후 살펴보도록 하겠습니다.

일단, 간단한 실행 함수를 이용해 만든 프라미스 생성자를 살펴보도록 합시다. 이 함수는 `setTimeout`을 이용해 만든 "제작 코드"로 구성하였습니다. 

```js run
let promise = new Promise(function(resolve, reject) {
  // 프라미스가 생성될 때 이 함수는 자동으로 실행됩니다.

  // 1초 뒤에 일이 성공적으로 끝나 resolve가 호출되고, result의 값은 "done"이 됩니다.
  setTimeout(() => *!*resolve("done")*/!*, 1000);
});
```

위 코드를 통해 두 가지를 확인할 수 있습니다.

1. executor는 `new Promise`에 의해 자동으로 그리고 즉각적으로 호출됩니다.
2. executor는 인자로 `resolve`와 `reject` 함수를 받습니다. 이 함수들은 자바스크립트 엔진이 미리 정의한 함수이므로, 따로 만들 필요는 없습니다. 대신, 우리는 executor를 만들어 `resolve`와 `reject` 함수를 호출할 수 있게 해야 합니다.

executor가 호출되고 1초 후에 `resolve("done")`이 호출되어, state와 result를 변경합니다.

![](promise-resolve-1.png)

위의 예시는 성공적으로 일이 완수된 경우의 처리 과정을 나타냅니다. 이 경우를, "fulfilled promise(약속이 이행된 프라미스)"라고 합니다.

이번에는 에러가 발생해 reject 함수가 호출되는 경우에 대해 살펴봅시다.

```js
let promise = new Promise(function(resolve, reject) {
  // 1초 뒤에 에러객체와 함께 실행이 종료되었다는 신호를 보냅니다.
  setTimeout(() =&amp;gt; *!*reject(new Error("Whoops!"))*/!*, 1000);
});
```

![](promise-reject-1.png)

지금까지 살펴본 프라미스에 대해 간단히 요약하면 다음과 같습니다. executor는 보통 시간이 걸리는 일을 수행합니다. 일이 끝나면 `resolve`나 `reject` 함수를 호출하는데, 이 때 프라미스 객체의 프로퍼티인 state가 변경됩니다.

이행된(resolved) 혹은 거부된(rejected) 프라미스는 "처리된(settled)" 프라미스라 부릅니다. 이에 반대되는 "대기 상태의(pending)" 프라미스도 있습니다.

````smart header="오직 하나의 결과나 에러만 있을 수 있습니다"
executor는 `resolve`나 `reject`함수 중 단 하나만 호출할 수 있습니다. 함수가 호출되어 프라미즈의 state가 변경되면, state는 더이상 변하지 않습니다.

이후의 모든 `resolve`, `reject` 함수 호출은 무시됩니다.

```js
let promise = new Promise(function(resolve, reject) {
  resolve("done");

  reject(new Error("…")); // 무시됨
  setTimeout(() =&amp;gt; resolve("…")); // 무시됨
});
```

이렇게, executor에 의해 끝난 일은 하나의 결과 혹은 에러만 가질 수 있습니다.

여기에 더하여, `resolve`/`reject`는 단 하나의 인자(혹은 아무것도 받지 않음)만 받고 그 이외의 인자들은 무시합니다.
````

```smart header="`Error` 객체와 함께 거절하기"
무언가 잘 못 된 경우, `reject`를 호출할 수 있습니다. 이때 인자는 어떤 타입도 가능합니다. 하지만 인자로 `Error` 객체(또는 `Error`객체를 상속한 객체)를 사용할 것을 추천합니다. 이유는 뒤에서 설명드리겠습니다.
```

````smart header="`resolve`, `reject` 함수 즉시 호출하기"
executor는 대게 무언가를 비동기적으로 수행합니다. 그리고 약간의 시간이 지난 후에 `resolve`/`reject`를 호출하죠. 하지만 꼭 이렇게 할 필요는 없습니다. 다음 코드와 같이 `resolve`나 `reject`를 바로 호출할 수 있습니다.

```js
let promise = new Promise(function(resolve, reject) {
  // 일을 끝마치는 데 시간이 들지 않음
  resolve(123); // 결과(123)를 즉시 resolve에 전달함
});
```

어떤 일을 시작했는데, 알고 보니 이 일이 이미 끝마쳐져 있는 경우가 있을 수 있습니다.

이 경우도 그냥 바로 이행된(resolved) 프라미스를 호출하면 됩니다. 아무 문제 없이 작동합니다.
````

```smart header="`state` 와 `result`는 내부에 있습니다."
프라미스 객체의 `state`, `result` 프로퍼티는 자바스크립트 엔진에서 정의합니다. 따라서, "소비 코드"에선 이 프로퍼티에 바로 접근할 수 없습니다. `.then`/`.catch`/`.finally` 메서드를 사용하면 이 프로퍼티에 접근할 수 있습니다. 아래에서 이 메서드에 대해 살펴보도록 하겠습니다.
```

## 소비자: then, catch, finally

프라미스 객체는 executor("제작 코드" 또는 "가수")와 결과나 에러를 받을 소비 함수 ("팬")를 이어주는 일을 합니다. 소비 함수들은 `.then`, `.catch`, `.finally` 메서드로 등록(구독)합니다.

### then

`.then`은 가장 중요하고 기초적인 메서드입니다.

문법은 다음과 같습니다.

```js
promise.then(
  function(result) { *!*/* 성공적인 결과(result)를 다룹니다 */*/!* },
  function(error) { *!*/* 에러(error)를 다룹니다 */*/!* }
);
```

`.then`의 첫 번째 인수는 다음과 같은 일을 하는 함수입니다.

1. 프라미스가 이행되었을 때(resolved) 실행됩니다. 그리고
2. 그 결과(result)를 받습니다.

`.then`의 두 번째 인수는 다음과 같은 일을 하는 함수입니다.

1. 프라미스가 거부되었을 때(rejected) 실행됩니다. 그리고
2. 에러(error)를 받습니다.

다음은 프라미스가 성공적으로 이행된 경우에 관한 예입니다.

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

then의 첫 번째 인수로 전달된 함수가 실행되었습니다.

프라미스가 거절된 경우에는 아래와 같이 두 번째 함수가 실행됩니다.

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

프라미스가 거절된 경우만 처리하고 싶다면, `.then(null, errorHandlingFunction)`같이 `null`을 첫 번째 인수로 전달하면 됩니다. 아니면, `.catch(errorHandlingFunction)`를 써도 됩니다. 이는 `null`을 전달하는 것과 동일하게 작동합니다.


```js run
let promise = new Promise((resolve, reject) =&amp;gt; {
  setTimeout(() =&amp;gt; reject(new Error("Whoops!")), 1000);
});

*!*
// .catch(f) 는 promise.then(null, f)과 동일하게 작동합니다
promise.catch(alert); // 1초 뒤 "Error: Whoops!" 출력
*/!*
```

`.catch(f)`는 `.then(null,f)`과 동일합니다. 짧다는 점만 다릅니다.

### finally

<<<<<<< HEAD
`try {...} catch {...}`에 finally 절이 있는 것처럼, 프라미스에도 `finally`가 있습니다.
=======
Just like there's a `finally` clause in a regular `try {...} catch {...}`, there's `finally` in promises.
>>>>>>> 273e47b70a14ae7a8b882b8d2543e581b000eefb

`.finally(f)`를 호출하는 건 `.then(f, f)`과 유사합니다. finally는 프라미즈가 처리되었을 때(settled) 실행됩니다. 프라미스가 이행(resolved)이나 거부(rejected)가 확정되었을 때 말이죠.

더는 필요치 않은 로딩 인디케이터(loading indicators)를 멈추는 경우같이, 끝마무리에 `finally`를 유용하게 쓸 수 있습니다. 결과가 어떻든 마무리가 필요한 경우 말이죠.

사용법은 아래와 같습니다.

```js
new Promise((resolve, reject) => {
  /* 시간이 걸리는 어떤 일을 수행하고, 그 후 resolve/reject을 호출함 */
})
*!*
  // 이행, 거절 여부와 상관없이, 프라미즈의 처리가 완료되면 실행함
  .finally(() => stop loading indicator)
*/!*
  .then(result => show result, err => show error)
```

`.then(f, f)`와 finally는 완전히 동일하진 않고, 다음과 같은 차이점이 있습니다.

1. `finally` 핸들러엔 인수가 없습니다. 프라미즈가 이행되었는지, 거부되었는지 여부를 `finally` 에선 알 수 없습니다. finally 에선 절차를 마무리 하는 "보편적" 동작을 하기 때문에, 성공/실패 여부를 몰라도 됩니다.
2. Finally는 결과(result)와 에러(error)를 다음 핸들러에게 전달합니다.

    아래 예제를 통해 result가 `finally`를 거쳐 `then`까지 전달되는 것을 확인할 수 있습니다.
    ```js run
    new Promise((resolve, reject) => {
      setTimeout(() => resolve("result"), 2000)
    })
      .finally(() => alert("Promise ready"))
      .then(result => alert(result)); // <-- .then에서 result를 다룸
    ```

    이 예제는 에러객체가 `finally`를 거쳐 `catch`까지 전될담을 보여줍니다.

    ```js run
    new Promise((resolve, reject) => {
      throw new Error("error");
    })
      .finally(() => alert("Promise ready"))
      .catch(err => alert(err)); // <-- .catch에서 에러 객체를 다룸
    ```  

    finally는 프라미즈의 결과를 처리하기 위해 만들어지지 않았습니다. 이행 여부에 상관없이 결과를 전달해주죠. 이런 특징은 유용하게 사용될 수 있습니다.

    프라미즈 체이닝과 핸들러간 결과 전달에 대한 이야기는 다음 챕터에서 이어나가도록 하겠습니다.

3. `.finally(f)`는 `.then(f, f)`보다 문법 측면에서 더 편리합니다. `.then(f, f)`과같이 함수를 중복해서 사용할 필요가 없습니다.

````smart header="프라미스가 처리되면, 핸들러는 즉각 실행됩니다."
프라미스가 보류상태(pending)일 때, `.then/catch/finally` 핸들러는 결과를 기다립니다. 만약 프라미스가 처리되었다면(settled), 핸들러는 바로 실행됩니다.

```js run
// 이행상태의 프라미스
let promise = new Promise(resolve =&amp;gt; resolve("done!"));

promise.then(alert); // done! (바로 출력됨)
```

`.then` 핸들러는 시간이 걸리는 프라미즈이든, 즉시 끝나는 프라미즈이든 상관없이 실행이 보장됩니다.
````

이제, 실질적인 예를 통해 프라미즈를 이용해 어떻게 비동기 코드를 작성하는지 알아봅시다.

## 예제 : loadScript

이전 챕터에서 스크립트를 불러오는 `loadScript` 함수를 작성한 바 있습니다.

복습 차원에서 콜백 기반의 비동기 처리 코드를 살펴봅시다.

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error ` + src));
  document.head.append(script);
}
```

위 코드를 프라미스를 이용해 다시 작성해 봅시다.

새로운 `loadScript` 함수엔 콜백 함수가 필요하지 않습니다. 대신, 스크립트를 완전히 불러왔을 때 이행되는 프라미스 객체를 만들고, 이 객체를 반환하도록 합시다. 그리고 함수 바깥 코드에서 `.then`을 이용해 반환된 프라미스에 핸들러(구독 함수)를 더합시다.

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

사용법: 

```js run
let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");

promise.then(
  script =&amp;gt; alert(`${script.src} is loaded!`),
  error =&amp;gt; alert(`Error: ${error.message}`)
);

promise.then(script =&amp;gt; alert('One more handler to do something else!'));
```

위 코드를 통해 프라미스를 사용한 코드가 콜백 기반 패턴을 구현한 코드에 비해 다음과 같은 이점이 있다는걸 알 수 있습니다.


| 프라미스 | 콜백 |
|----------|-----------|
| 프라미스를 사용하면 자연스러운 흐름이 가능합니다. 먼저 `loadScript(script)`로 스크립트를 읽습니다. 그 다음(`.then`) 결과에 따라 무엇을 할 지 정하게 됩니다. | `loadScript(script, callback)`를 호출하는 시점에 `callback` 함수로 무엇을 할지 알고 있어야 합니다. `loadScript`가 호출되기 *이전*에 호출 결과로 무엇을 할지 미리 알고 있어야 합니다. |
| 프라미스에 원하는 만큼 `.then`을 호출할 수 있습니다. `.then`을 호출하는 것은 새로운 "팬"(새로운 구독 함수)를 "구독 리스트"에 추가하는 것과 같습니다. 이와 관련된 자세한 내용은 [](info:promise-chaining)에서 다루도록 하겠습니다. | 콜백은 하나만 가능합니다. |

프라미스를 사용하면 흐름이 자연스럽고, 유연한 코드를 작성할 수 있습니다. 이 외에도 더 많은 장점이 있는데, 다음 챕터에서 더 살펴보도록 하겠습니다.