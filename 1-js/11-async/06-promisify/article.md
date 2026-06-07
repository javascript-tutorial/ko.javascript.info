# 프라미스화

콜백을 받는 함수를 프라미스를 반환하는 함수로 바꾸는 것을 '프라미스화(promisification)'라고 합니다.

기능을 구현 하다 보면 콜백보다는 프라미스가 더 편리하기 때문에 콜백 기반 함수와 라이브러리를 프라미스를 반환하는 함수로 바꾸는 게 좋은 경우가 종종 생길 겁니다.

이해를 돕기 위해 예시를 하나 살펴봅시다.

예를 들어 <info:callbacks> 챕터에서 사용했던 `loadScript(src, callback)`이 있다고 해봅시다.

```js run
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src}를 불러오는 도중에 에러가 발생함`));

  document.head.append(script);
}

// 사용법:
// loadScript('path/script.js', (err, script) => {...})
```

이 함수는 주어진 `src`의 스크립트를 불러온 뒤, 에러가 발생하면 `callback(err)`를 호출하고 로딩에 성공하면 `callback(null, script)`를 호출합니다. 앞서 살펴본 것처럼 콜백을 사용할 때 널리 쓰이는 방식입니다.

이제 이 함수를 프라미스화해봅시다.

새 함수 `loadScriptPromise(src)`를 만들겠습니다. 이 함수는 스크립트를 불러온다는 점에서 기존 함수와 동일하게 동작하지만, 콜백을 사용하는 대신 프라미스를 반환합니다.

다시 말해 `callback` 없이 `src`만 전달하면 프라미스를 반환받습니다. 로딩에 성공하면 이 프라미스는 `script`와 함께 이행되고, 실패하면 에러와 함께 거부됩니다.

구현은 다음과 같습니다.
```js
let loadScriptPromise = function(src) {
  return new Promise((resolve, reject) => {
    loadScript(src, (err, script) => {
      if (err) reject(err);
      else resolve(script);
    });
  });
};

// 사용법:
// loadScriptPromise('path/script.js').then(...)
```

예시에서 볼 수 있듯이 새 함수는 기존 함수 `loadScript`를 감싸는 래퍼입니다. 새 함수는 자체 콜백을 넘겨 `loadScript`를 호출하고, 이 콜백은 결과에 따라 프라미스의 `resolve`나 `reject`를 호출합니다.

이제 `loadScriptPromise`는 프라미스 기반 코드에 잘 어울립니다. 콜백보다 프라미스를 더 선호한다면, 그리고 곧 그럴 만한 이유를 더 살펴볼 예정인데, 이제 이 함수를 사용하면 됩니다.

실무에서는 함수 하나가 아니라 여러 함수를 프라미스화해야 할 수도 있으므로 헬퍼를 사용하는 편이 좋습니다.

이 헬퍼를 `promisify(f)`라고 부르겠습니다. `promisify(f)`는 프라미스화할 함수 `f`를 받고 래퍼 함수를 반환합니다.

```js
function promisify(f) {
  return function (...args) { // 래퍼 함수를 반환함 (*)
    return new Promise((resolve, reject) => {
      function callback(err, result) { // f에 사용할 커스텀 콜백 (**)
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // 위에서 만든 커스텀 콜백을 함수 f의 인수 끝에 추가합니다.

      f.call(this, ...args); // 기존 함수를 호출합니다.
    });
  };
}

// 사용법:
let loadScriptPromise = promisify(loadScript);
loadScriptPromise(...).then(...);
```

코드가 조금 복잡해 보일 수 있지만, 본질적으로는 위에서 `loadScript` 함수를 프라미스화할 때 작성한 코드와 같습니다.

`promisify(f)`를 호출하면 `f`를 감싸는 래퍼, 즉 `(*)`로 표시한 함수가 반환됩니다. 이 래퍼는 프라미스를 반환하고 원래 함수 `f`로 호출을 전달하며, 커스텀 콜백 `(**)`에서 결과를 추적합니다.

여기서 `promisify`는 원래 함수가 정확히 두 개의 인수 `(err, result)`를 받는 콜백을 기대한다고 가정합니다. 이런 경우가 가장 흔합니다. 그러면 커스텀 콜백이 바로 알맞은 형식이 되고, 이런 경우 `promisify`는 잘 동작합니다.

그런데 함수 `f`가 두 개를 초과하는 인수를 가진 콜백, `callback(err, res1, res2, ...)`을 받는다면 어떤 일이 발생할까요?

헬퍼를 개선해봅시다. 좀 더 발전된 버전의 `promisify`를 만들어 보겠습니다.

- `promisify(f)`로 호출하면 위 버전과 비슷하게 동작해야 합니다.
- `promisify(f, true)`로 호출하면 콜백 결과를 담은 배열로 이행되는 프라미스를 반환해야 합니다. 이는 인수가 많은 콜백을 위한 동작입니다.

```js
// 콜백의 성공 결과를 담은 배열을 얻게 해주는 promisify(f, true)
function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function *!*callback(err, ...results*/!*) { // f에 사용할 커스텀 콜백
        if (err) {
          reject(err);
        } else {
          // manyArgs가 구체적으로 명시되었다면, 콜백의 성공 케이스와 함께 이행 상태가 됩니다.
          *!*resolve(manyArgs ? results : results[0]);*/!*
        }
      }

      args.push(callback);

      f.call(this, ...args);
    });
  };
}

// 사용법:
f = promisify(f, true);
f(...).then(arrayOfResults => ..., err => ...);
```

위 코드와 본질적으로는 같습니다. 다만 `manyArgs`가 참 같은 값인지에 따라 `resolve`를 하나의 인수로 호출할지, 전체 인수로 호출할지만 달라집니다.

`callback(result)`처럼 `err`가 아예 없는 콜백 등 더 특이한 콜백 형식의 경우, 헬퍼를 사용하지 않고 해당 함수를 직접 프라미스화하면 됩니다.

본 챕터에서 설명한 헬퍼 함수보다 더 유용한 형태의 프라미스화를 도와주는 함수를 제공하는 모듈도 많습니다. [es6-promisify](https://github.com/digitaldesignlabs/es6-promisify)가 대표적인 예입니다. Node.js에선 내장 함수 `util.promisify`를 사용해 프라미스화를 할 수 있습니다.

```smart
프라미스화는 특히 이후 <info:async-await> 챕터에서 다룰 `async/await`와 함께 사용할 때 매우 유용한 접근법이지만, 콜백을 완전히 대체할 수는 없습니다.

프라미스는 하나의 결과만 가질 수 있지만, 콜백은 여러 번 호출할 수 있기 때문입니다.

따라서 프라미스화는 콜백을 단 한 번 호출하는 함수에만 적용하시기 바랍니다. 프라미스화한 함수의 콜백을 여러 번 호출해도, 두 번째부터는 무시됩니다.
```
