해답:

```js run demo
function delay(f, ms) {

  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };

}

let f1000 = delay(alert, 1000);

f1000("test"); // 'test'를 1,000ms 후에 보여줍니다.
```

여기서 화살표 함수가 어떻게 사용되었는지 유의해주세요. 알다시피 화살표 함수는 자기만의 `this`와 `arguments`를 가지지 않습니다. 따라서 `f.apply(this, arguments)`는 `this`와 `arguments`를 래퍼에서 가져옵니다.

ES5 형식을 따르는 함수를 보내준다면 `setTimeout`은 브라우저 안에 있다고 가정했을 때 인수와 `this=window` 없이 보내준 함수를 호출합니다.

원하는 스코프의 this를 해당 스코프에서 생성한 변수에 저장하는 방법을 통해 올바른 `this`를 넘겨줄 수도 있으나 이렇게 되면 코드가 좀 더 길고 복잡해집니다.

```js
function delay(f, ms) {

  return function(...args) {
    let savedThis = this; // this를 이 변수에 저장하세요.
    setTimeout(function() {
      f.apply(savedThis, args); // this를 저장한 변수를 여기에서 사용하세요.
    }, ms);
  };

}
```
