에러가 발생합니다.

실제 코드를 실행해 봅시다.

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

이 문제는 '존재하지 않는' 변수와 '초기화되지 않은' 변수의 미묘한 차이를 알아보기 위해 만들어졌습니다.

[](info:closure)에서 읽은 것처럼 코드 블록(또는 함수) 실행에 들어가는 순간에 그 안의 변수는 '초기화되지 않은' 상태가 됩니다. 그리고 `let`을 만날 때까지 해당 상태가 유지됩니다.

'초기화되지 않은' 상태의 변수는 기술적으론 존재하지만 `let` 문을 만나기 전엔 사용할 수 없습니다.

문제의 코드는 이런 초기화되기 전의 변수에 접근할 때 무슨 일이 일어나는지를 잘 보여줍니다.

```js
function func() {
*!*
  // 엔진은 함수가 시작될 때 로컬 변수 x의 존재를 알고 있지만
  // let 문이 실행될 때까지 x는 '초기화되지 않은' 상태(dead zone)이기 때문에
  // 에러가 발생합니다.
*/!*

  console.log(x); // ReferenceError: Cannot access 'x' before initialization

  let x = 2;
}
```

실제 초기화가 일어나기 전 변수를 일시적 사용하지 못하는 구간(코드 블록의 시작부터 `let`이 나올 때까지)을 '데드 존(dead zone)'이라 부릅니다.
