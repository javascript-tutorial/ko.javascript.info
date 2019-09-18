```js demo
function debounce(f, ms) {

  let isCooldown = false;

  return function() {
    if (isCooldown) return;

    f.apply(this, arguments);

    isCooldown = true;

    setTimeout(() => isCooldown = false, ms);
  };

}
```

`debounce`를 호출하면 래퍼를 반환합니다. 여기에는 두가지 상태가 있습니다.

- `isCooldown = false` -- 실행시킬 준비가 되었습니다.
- `isCooldown = true` -- 시간이 지날동안 기다립니다.

첫번째 `isCoolDown`은 허위로 호출됩니다. 그래서 호출이 되면 상태는 `true`로 바뀌는 것이죠.

`isCooldown`이 true 일 동안은 다른 호출은 무시됩니다.

그리고 `setTimeout` 함수가 주어진 지연시간이 지난후에 상태를 `false`로 바꾸게 됩니다.