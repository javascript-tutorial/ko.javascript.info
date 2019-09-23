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

`throttle (func, ms)`에 대한 호출은`wrapper`를 반환합니다.

1. 첫 번째 호출 중에 `wrapper` 는 `func` 를 실행하고 cooldown의 상태를 설정합니다. (`isThrottled = true`)
2. 상태가 설정되고 모든 호출은 `savedArgs / savedThis` 에 기억됩니다. 컨텍스트와 인수는 똑같이 중요하며 기억돼야 합니다. 호출을 재현하기 위해 컨텍스트와 인수가 동시에 필요합니다.
3. ...`ms` 밀리초가 지나면 `setTimeout` 이 트리거 되고 cooldown의 상태는 제거됩니다. (`isThrottled = false`) 그리고 호출이 무시된다면 `wrapper` 는 마지막에 기억된 컨텍스트와 인수와 함께 실행됩니다.

3번째 단계는 `func` 가 아니라 `wrapper` 로 실행됩니다. 왜냐하면 `func` 만을 실행하는 것이 아니라 cooldown 상태를 입력하고 timeout을 설정해서 cooldown을 리셋할 수 있게 해야 됩니다.
