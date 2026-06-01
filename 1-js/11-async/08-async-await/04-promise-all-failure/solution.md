
문제의 원인은 `Promise.all`이 프라미스 중 하나라도 거부되면 즉시 거부되지만, 나머지 프라미스를 취소하지는 않는다는 데 있습니다.

위 예시에서는 두 번째 쿼리가 실패하므로 `Promise.all`이 거부되고, `try...catch` 블록이 이 에러를 잡습니다. 한편, 다른 프라미스는 *영향을 받지 않고 독립적으로 실행을 계속합니다*. 예시에서는 잠시 후 세 번째 쿼리가 자체적으로 에러를 던집니다. 이 에러는 어디에서도 잡히지 않으므로 콘솔에서 확인할 수 있습니다.

이 문제는 Node.js 같은 서버 측 환경에서 특히 위험합니다. 잡히지 않은 에러로 인해 프로세스가 중단될 수 있기 때문입니다.

어떻게 고칠 수 있을까요?

가장 이상적인 해결책은 쿼리 중 하나가 실패했을 때 아직 끝나지 않은 쿼리를 모두 취소하는 것입니다. 이렇게 하면 잠재적인 에러를 피할 수 있습니다.

하지만 안타깝게도 `database.query` 같은 서비스 호출은 취소 기능을 지원하지 않는 서드파티 라이브러리로 구현된 경우가 많습니다. 이런 경우 호출을 취소할 방법이 없습니다.

대안으로 `Promise.all`을 감싸는 래퍼 함수를 직접 작성할 수 있습니다. 이 함수는 각 프라미스에 커스텀 `then/catch` 핸들러를 붙여 상태를 추적합니다. 결과를 모으다가 에러가 발생하면 그 이후 프라미스는 모두 무시합니다.

```js
function customPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let resultsCount = 0;
    let hasError = false; // 첫 번째 에러가 발생하면 true로 바꿉니다.

    promises.forEach((promise, index) => {
      promise
        .then(result => {
          if (hasError) return; // 이미 에러가 발생했다면 이 프라미스를 무시합니다.
          results[index] = result;
          resultsCount++;
          if (resultsCount === promises.length) {
            resolve(results); // 모든 결과가 준비되면 성공입니다.
          }
        })
        .catch(error => {
          if (hasError) return; // 이미 에러가 발생했다면 이 프라미스를 무시합니다.
          hasError = true; // 에러가 발생했습니다.
          reject(error); // 거부 상태로 실패 처리합니다.
        });
    });
  });
}
```

이 방식에도 문제가 있습니다. 쿼리가 아직 처리 중일 때 `disconnect()`를 호출하는 것은 대개 바람직하지 않습니다.

특히 일부 쿼리가 중요한 업데이트를 처리한다면 모든 쿼리가 끝까지 완료되어야 할 수 있습니다.

따라서 실행을 계속 진행하고 마지막에 연결을 끊기 전에 모든 프라미스가 처리될 때까지 기다려야 합니다.

다른 구현을 살펴봅시다. 이 구현은 `Promise.all`과 비슷하게 동작합니다. 첫 번째 에러와 함께 거부되지만, 모든 프라미스가 처리될 때까지 기다립니다.

```js
function customPromiseAllWait(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let settledCount = 0;
    let firstError = null;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(result => {
          results[index] = result;
        })
        .catch(error => {
          if (firstError === null) {
            firstError = error;
          }
        })
        .finally(() => {
          settledCount++;
          if (settledCount === promises.length) {
            if (firstError !== null) {
              reject(firstError);
            } else {
              resolve(results);
            }
          }
        });
    });
  });
}
```

이제 `await customPromiseAllWait(...)`는 모든 쿼리가 처리될 때까지 실행을 멈춥니다.

실행 흐름을 예측할 수 있게 보장하므로 더 안정적인 방식입니다.

마지막으로 모든 에러를 처리하고 싶다면 `Promise.allSettled`를 사용하거나, 모든 에러를 하나의 [AggregateError](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 객체에 모아 그 객체로 거부하는 래퍼를 작성할 수 있습니다.

```js
// 모든 프라미스가 처리될 때까지 기다립니다.
// 에러가 없으면 결과를 반환합니다.
// 에러가 하나라도 있으면 모든 에러가 담긴 AggregateError를 던집니다.
function allOrAggregateError(promises) {
  return Promise.allSettled(promises).then(results => {
    const errors = [];
    const values = [];

    results.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        values[i] = res.value;
      } else {
        errors.push(res.reason);
      }
    });

    if (errors.length > 0) {
      throw new AggregateError(errors, 'One or more promises failed');
    }

    return values;
  });
}
```
