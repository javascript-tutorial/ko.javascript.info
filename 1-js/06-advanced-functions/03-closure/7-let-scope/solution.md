**error**가 발생합니다.

코드를 실행해보세요.

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

이 과제에서 "non-existing"변수와 "uninitialized"변수 사이의 독특한 차이를 확인할 수 있습니다.

[](info:closure)에서 읽었듯이, 변수는 코드블록(또는 함수)에 들어가는 순간부터 "uninitialized"상태로 시작됩니다. 그리고 해당 'let'문이 나타날때까지 "uninitialized"상태로 유지됩니다.

즉, 변수는 기술적으로 존재하지만 `let`전에 사용할 수 없습니다.

위 코드가 이를 보여주는 예입니다.
```js
function func() {
*!*
  // 지역변수 x는 함수 시작될 때 엔진에 알려집니다
  // 그러나 let을 만나기 전("dead zone")까지 "unitialized"(unusable)됩니다. 
  // 따라서 에러가 발생합니다.
*/!*

  console.log(x); // ReferenceError: Cannot access 'x' before initialization

  let x = 2;
}
```

변수를 일시적으로 사용할 수 없는 영역(코드 블록의 시작부터 `let`을 만나기 전까지)를 "dead zone"이라 부릅니다.
