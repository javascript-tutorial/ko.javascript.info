차이점은 함수 내부의 코드를 보면 분명해집니다.

`try..catch`의 "점프 아웃"이 있다면 행동이 달라지게 됩니다.

예를 들어, `try..catch` 내부에 `return`이 있을때. `finally` 절은 `리턴문`을 통해서 종료된 경우를 포함한 `try..catch`가 종료된 *어떤* 경우에도 호출 코드가 제어권을 얻기전에 작동합니다.

```js run
function f() {
  try {
    alert('start');
*!*
    return "result";
*/!*
  } catch (e) {
    /// ...
  } finally {
    alert('cleanup!');
  }
}

f(); // cleanup!
```

...또는 `throw`가 있다면, 아래처럼 됩니다.

```js run
function f() {
  try {
    alert('start');
    throw new Error("에러 발생!");
  } catch (e) {
    // ...
    if("can't handle the error") {
*!*
      throw e;
*/!*
    }

  } finally {
    alert('cleanup!')
  }
}

f(); // cleanup!
```

여기서 `finally`는 cleanup을 보장해줍니다. 만약 단순하게 코드를 `f`의 끝에 놓는다면, 코드가 실행되지 않습니다.
