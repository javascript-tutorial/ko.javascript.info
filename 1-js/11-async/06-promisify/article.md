# 프라미스화

콜백을 받는 함수를 프라미스를 반환하는 함수로 바꾸는 것을 '프라미스화(promisification)'라고 합니다.

콜백보다는 프라미스가 더 편리하기 때문에, 구현을 하다 보면 콜백 기반 함수와 라이브러리를 프라미스를 반환하는 함수로 바꾸는 게 좋은 경우가 종종 생길 겁니다.

<info:callbacks> 챕터에서 사용했던 `loadScript(src, callback)` 예시를 사용해 프라미스화에 대해 좀 더 자세히 알아봅시다.

```js run
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src}를 불러오는 도중에 에러가 발생함`));

  document.head.append(script);
}

// usage:
// loadScript('path/script.js', (err, script) => {...})
```

`loadScript(src, callback)`를 이제 프라미스화해봅시다. 새로운 함수 `loadScriptPromise(src)`는 `loadScript`와 동일하게 동작하지만 `callback`을 제외한 `src`만 인수로 받아야 하고, 프라미스를 반환해야 합니다.

```js
let loadScriptPromise = function(src) {
  return new Promise((resolve, reject) => {
    loadScript(src, (err, script) => {
      if (err) reject(err)
      else resolve(script);
    });
  })
}

// 사용법:
// loadScriptPromise('path/script.js').then(...)
```

새롭게 구현한 `loadScriptPromise`는 프라미스 기반 코드와 잘 융화됩니다.

예시에서 볼 수 있듯이, `loadScriptPromise`는 기존 함수 `loadScript`에 모든 일을 위임합니다. `loadScript`의 콜백은 스크립트 로딩 상태에 따라 `이행` 혹은 `거부`상태의 프라미스를 반환합니다. 

그런데 실무에선 함수 하나가 아닌 여러 개의 함수를 프라미스화 해야 할 겁니다. 헬퍼 함수를 만드는 게 좋을 것 같네요.

프라미스화를 적용 할 함수 `f`를 받고 래퍼 함수를 반환하는 함수 `promisify(f)`를 만들어봅시다.

`promisify(f)`가 반환하는 래퍼 함수는 위 예시와 동일하게 동작할 겁니다. 프라미스를 반환하고 호출을 기존 함수 `f`에 전달하여 커스텀 콜백 내의 결과를 추적해야 하죠.

```js
function promisify(f) {
  return function (...args) { // 래퍼 함수를 반환함
    return new Promise((resolve, reject) => {
      function callback(err, result) { // f에 사용할 커스텀 콜백
        if (err) {
          return reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // 위에서 만든 커스텀 콜백을 함수 f의 인수 끝에 추가합니다.

      f.call(this, ...args); // 기존 함수를 호출합니다.
    });
  };
};

// 사용법:
let loadScriptPromise = promisify(loadScript);
loadScriptPromise(...).then(...);
```

위 예시는 프라미스화 할 함수가 인수가 두 개(`(err, result)`)인 콜백을 받을 것이라 가정하고 작성되었습니다. 십중팔구 이런 상황일 것이고, 커스텀 콜백은 이 상황에 딱 들어맞습니다. `promisify`가 잘 동작하는 것은 말할 것도 없겠죠.

그런데 함수 `f`가 두 개를 초과하는 인수를 가진 콜백, `callback(err, res1, res2, ...)`을 받는다면 어떤 일이 발생할까요?

이런 경우를 대비하여 좀 더 진화한 `promisify`를 만들어 봅시다. 새롭게 만든 함수를 `promisify(f, true)`형태로 호출하면, 프라미스 결과는 콜백의 성공 케이스(`results`)를 담은 배열, `[res1, res2, ...]`이 됩니다.

```js
// 콜백의 성공 결과를 담은 배열을 얻게 해주는 promisify(f, true)
function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function *!*callback(err, ...results*/!*) { // f에 사용할 커스텀 콜백
        if (err) {
          return reject(err);
        } else {
          // manyArgs가 구체적으로 명시되었다면, 콜백의 성공 케이스와 함께 이행 상태가 됩니다.
          *!*resolve(manyArgs ? results : results[0]);*/!*
        }
      }

      args.push(callback);

      f.call(this, ...args);
    });
  };
};

// 사용법:
f = promisify(f, true);
f(...).then(arrayOfResults => ..., err => ...)
```

`callback(result)`같이 `err`이 없는 형태나 지금까지 언급하지 않은 형태의 이색적인 콜백도 있을 수 있는데, 이런 경우엔 헬퍼 함수를 사용하지 않고 직접 프라미스화 하면 됩니다.

본 챕터에서 설명한 헬퍼 함수보다 더 유용한 형태의 프라미스화를 도와주는 함수를 제공하는 모둘도 많습니다. [es6-promisify](https://github.com/digitaldesignlabs/es6-promisify)가 대표적인 예입니다. Node.js에선 내장 함수 `util.promisify`를 사용해 프라미스화를 할 수 있습니다.

```smart
프라미스화는 곧 배우게 될 `async/await`와 함께 사용하면 더 좋습니다. 다만, 콜백을 완전히 대체하지는 못한다는 사실을 기억해 두시기 바랍니다.

프라미스는 하나의 결과만 가질 수 있지만, 콜백은 여러 번 호출할 수 있기 때문입니다.

따라서 프라미스화는 콜백을 단 한 번 호출하는 함수에만 적용하시기 바랍니다. 프라미스화한 함수의 콜백을 여러 번 호출해도, 두 번째부터는 무시됩니다.
```
