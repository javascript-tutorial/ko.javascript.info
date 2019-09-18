importance: 5

---

# 디바운스 데코레이터

`debounce(f, ms)`데코레이터는 `ms`밀리초 마다 최대값에 한번 `f` 에 호출을 전달하는 래퍼이어야 합니다.

다르게 표현하면 "debounced" 함수를 호출하면 `ms` 밀리초 미만의 함수에 대한 다른 함수호출은 이전 함수 호출 후 무시되야 합니다.

예를 들면

```js no-beautify
let f = debounce(alert, 1000);

f(1); // 바로 실행됩니다
f(2); // 무시됨

setTimeout( () => f(3), 100); // 무시됨 ( 오직 100 만 전달됨 )
setTimeout( () => f(4), 1100); // 실행됨
setTimeout( () => f(5), 1500); // 무시됨 (마지막 실행 후에 1000ms 가 지나지 않았음)
```

In practice `debounce` is useful for functions that retrieve/update something when we know that nothing new can be done in such a short period of time, so it's better not to waste resources.
