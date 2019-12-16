<<<<<<< HEAD
답은 ** "같지 않다" **입니다.
=======
The short answer is: **no, they are not equal**:
>>>>>>> 524d59884650be539544c34f71d821432b7280fd

`f1`에서 에러가 발생하면 아래 코드에서는 `.catch`에서 에러가 처리됩니다.

```js run
promise
  .then(f1)
  .catch(f2);
```

하지만 아래 코드에선 `f1`에서 발생한 에러를 처리하지 못합니다.

```js run
promise
  .then(f1, f2);
```

`then` 핸들러에서 에러가 발생하면 체인 아래로 전달됩니다. 위 코드에는 `f1` 아래에 이어지는 체인이 없네요. 

<<<<<<< HEAD
`.then`은 결과나 에러를 다음 `.then`이나 `catch`에 전달합니다. 첫 번째 코드 조각엔 `catch`가 있지만 두 번째 코드 조각엔 이어지는 체인이 전혀 없기 때문에 에러가 발생한 경우 이 에러를 처리하지 못한다는 차이가 발생합니다.
=======
In other words, `.then` passes results/errors to the next `.then/catch`. So in the first example, there's a `catch` below, and in the second one there isn't, so the error is unhandled.
>>>>>>> 524d59884650be539544c34f71d821432b7280fd
