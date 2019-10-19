해답은 크게 두 부분으로 구성됩니다.

1. `.observe(handler)`이 호출될 때마다 핸들러를 어딘가에 보관해두고 나중에 호출될 수 있도록 해야 하는데, 심볼을 프로퍼티 키로 사용해 핸들러를 객체에 저장할 수 있게 해 보았습니다.
2. 변경이 있을 때마다 핸들러가 호출되도록 `set` 트랩이 있는 프락시를 만들어 보았습니다.

```js run
let handlers = Symbol('handlers');

function makeObservable(target) {
  // 1. 핸들러를 저장할 곳을 초기화합니다.
  target[handlers] = [];

  // 나중에 호출될 것을 대비하여 핸들러 함수를 배열에 저장합니다.
  target.observe = function(handler) {
    this[handlers].push(handler);
  };

  // 2. 변경을 처리할 프락시를 만듭니다.
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let success = Reflect.set(...arguments); // 동작을 객체에 전달합니다.
      if (success) { // 에러 없이 프로퍼티를 제대로 설정했으면
        // 모든 핸들러를 호출합니다.
        target[handlers].forEach(handler => handler(property, value));
      }
      return success;
    }
  });
}

let user = {};

user = makeObservable(user);

user.observe((key, value) => {
  alert(`SET ${key}=${value}`);
});

user.name = "John";
```
