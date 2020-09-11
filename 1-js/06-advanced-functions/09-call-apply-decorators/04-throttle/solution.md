```js demo
function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}
```

`throttle(func, ms)`에 대한 호출은 `wrapper`를 반환합니다.

1. 첫 번째 호출에서 `wrapper`는 `func`을 실행하고 대기 상태를 뜻하는 `isThrottled = true`를 설정합니다
2. 이 상태에서 모든 호출은 `savedArgs`와 `savedThis`에 저장됩니다. 콘텐츠와 인수 둘 다 똑같이 중요하며 기억돼야 한다는 점에 유의해주세요. 다시 호출하기 위해서는 콘텐츠와 인수가 동시에 필요하기 때문입니다.
3. `ms` 밀리초가 지난 후에 `setTimeout`이 실행됩니다. `isThrottled = false`가 되어 대기 상태가 끝나며, 호출을 무시했다면 `wrapper`는 마지막에 기억된 인수, 콘텐츠와 함께 실행됩니다.

3번째 단계는 `func`가 아닌 `wrapper`를 실행합니다. `func`을 실행해야 할 뿐만 아니라 다시 대기 상태에 들어가고 func을 초기화하기 위해 타임아웃을 설정해야 하기 때문입니다.
