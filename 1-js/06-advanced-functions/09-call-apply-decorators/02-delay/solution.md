해답

```js run demo
function delay(f, ms) {

  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };

}

let f1000 = delay(alert, 1000);

f1000("test"); // 1000 밀리초 후에 "test"를 보여줌
```

위의 답안에서 어떻게 화살표 함수가 사용되었는지 주목하세요. 이미 살펴보았듯이 화살표 함수는 자체적으로 `this`와 `arguments`가 없습니다. 그래서 `f.apply(this, arguments)`는 `this`와 `arguments`를 래퍼로부터 가져올 수 있는 것이죠.

일반 함수로 전달했다면 `setTimeout`은 인수가 없고 `this=window`로 호출되었을 것입니다(브라우저 안이라고 가정해서).

일반 함수를 사용해도 여전히 중간 변수를 사용하여 올바른 `this`를 전달할 수 있지만 조금 더 신경써야할 부분이 많습니다.

```js
function delay(f, ms) {

  return function(...args) {
    let savedThis = this; // this를 중간 변수로 저장합니다.
    setTimeout(function() {
      f.apply(savedThis, args); // 여기서 중간 변수로 저장된 this를 사용합니다.
    }, ms);
  };

}
```
