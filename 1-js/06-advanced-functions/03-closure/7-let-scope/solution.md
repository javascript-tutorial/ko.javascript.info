결과는 에러입니다.

실행해 보세요:

```js run
let x = 1;

function func() {
*!*
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
*/!*
  let x = 2;
}

func();
```

이 예제에서는 "존재하지 않는" 변수와 "초기화되지 않은" 변수의 특이한 차이를 관찰할 수 있습니다.

[](info:closure)에서 읽은 것처럼 실행이 코드 블록(또는 함수)에 들어가는 순간부터 변수는 "초기화되지 않은' 상태에서 시작합니다. 그리고 해당 `let` 문이 실행될 때까지 초기화되지 않은 상태로 남아 있습니다.

즉, 기술적으로 변수는 존재하지만 `let` 전에 사용할 수 없습니다.

위의 코드는 이를 잘 보여줍니다.

```js
function func() {
*!*
  // 로컬 변수 x는 함수가 시작될 때부터 엔진이 알고 있지만
  // let 문이 실행될 때까지 "초기화되지 않은" 상태입니다 ("dead zone").
  // 따라서 에러가 발생합니다.
*/!*

  console.log(x); // ReferenceError: Cannot access 'x' before initialization

  let x = 2;
}
```

이 변수의 일시적 사용 불가능 구역 (코드 블록의 시작부터 `let`이 나올 때까지) "dead zone"이라 불리곤 합니다.
