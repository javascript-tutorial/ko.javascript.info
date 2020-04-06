얼럿 창엔 `1`, `2`가 차례대로 출력됩니다.

```js run
alert( alert(1) || 2 || alert(3) );
```

`alert` 메서드는 값을 반환하지 않습니다. 즉, `undefined`를 반환하죠. 

<<<<<<< HEAD
1. 첫 번째 OR `||` 은 왼쪽 피연산자인 `alert(1)`를 평가합니다. 이때 첫 번째 얼럿 창에 `1`이 출력되죠.
2. `alert`메서드는 `undefined`를 반환하기 때문에, OR 연산자는 다음 피연산자를 평가하게 됩니다. truthy를 찾기 위해 말이죠.
3. 두 번째 피연산자(오른쪽 피연산자)인 `2`는 truthy이기 때문에 실행이 멈추고 `2`가 반환됩니다. 반환된 값 `2`는 제일 바깥 `alert`의 피연산자가 되어 두 번째 얼럿창에 출력됩니다.
=======
1. The first OR `||` evaluates its left operand `alert(1)`. That shows the first message with `1`.
2. The `alert` returns `undefined`, so OR goes on to the second operand searching for a truthy value.
3. The second operand `2` is truthy, so the execution is halted, `2` is returned and then shown by the outer alert.
>>>>>>> c89ddc5d92195e08e2c32e30526fdb755fec4622

평가가 `alert(3)`까지 진행되지 않기 때문에 `3`은 출력되지 않습니다.