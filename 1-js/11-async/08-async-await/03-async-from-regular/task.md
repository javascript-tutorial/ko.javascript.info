
# async가 아닌 함수에서 async 함수 호출하기

<<<<<<< HEAD
'일반' 함수가 하나 있는데, 여기서 `async` 함수를 어떻게 하면 호출하고, 그 결과를 사용할 수 있을까요?
=======
We have a "regular" function called `f`. How can you call the `async` function `wait()` and use its result inside of `f`?
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```js
async function wait() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return 10;
}

function f() {
<<<<<<< HEAD
  // ...코드...
  // async wait()를 호출하고 그 결과인 10을 얻을 때까지 기다리려면 어떻게 해야 할까요?
  // f는 일반 함수이기 때문에 여기선 'await'를 사용할 수 없다는 점에 주의하세요!
=======
  // ...what should you write here?
  // we need to call async wait() and wait to get 10
  // remember, we can't use "await"
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
}
```

참고: 문제 자체는 아주 간단하지만, async와 await를 학습한 지 얼마 안 된 개발자들이 쉽게 접하는 상황입니다.
