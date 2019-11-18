차이점은 함수 내부의 코드를 보면 분명해집니다.

`try..catch`에서 '빠져나오게 하는' 코드가 있다면 함수의 행동이 달라집니다.

아래 예시와 같이 `try..catch` 내부에 `return`이 있을 때가 대표적인 예입니다. `finally` 절은 `return`문을 통해 `try..catch`를 빠져나가는 경우를 포함하여 `try..catch`가 종료되는 *모든* 상황에서 실행됩니다. `try..catch`가 종료되었지만, 함수 호출 코드가 제어권을 갖기 직전에 실행되죠.

```js run
function f() {
  try {
    alert('시작');
*!*
    return "결과";
*/!*
  } catch (e) {
    /// ...
  } finally {
    alert('초기화!');
  }
}

f(); // cleanup!
```

또는, 아래와 같이 `throw`가 있어도 함수의 행동이 달라집니다.

```js run
function f() {
  try {
    alert('시작');
    throw new Error("에러 발생!");
  } catch (e) {
    // ...
    if("can't handle the error") {
*!*
      throw e;
*/!*
    }

  } finally {
    alert('초기화!')
  }
}

f(); // cleanup!
```

이렇게 `finally` 절을 붙여주면 초기화가 보장됩니다. 작업 내역을 초기화해주는 코드를 단순히 `f`의 끝에 붙였다면, 위 예시와 같은 상황에선, 초기화 코드가 실행되지 않습니다.
