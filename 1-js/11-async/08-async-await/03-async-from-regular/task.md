
# async가 아닌 함수에서 async 함수 호출하기

'일반' 함수가 하나 있는데, 여기서 `async` 함수를 어떻게 하면 호출하고, 그 결과를 사용할 수 있을까요?

```js
async function wait() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return 10;
}

function f() {
  // ...코드...
  // async wait()를 호출하고 그 결과인 10을 얻을 때까지 기다리려면 어떻게 해야 할까요?
  // f는 일반 함수이기 때문에 여기선 'await'를 사용할 수 없다는 점에 주의하세요!
}
```

참고: 문제 자체는 아주 간단하지만, async와 await를 학습한 지 얼마 안 된 개발자들이 쉽게 접하는 상황입니다.
