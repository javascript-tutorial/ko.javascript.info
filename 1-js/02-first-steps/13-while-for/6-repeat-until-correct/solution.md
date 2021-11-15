
```js run demo
let num;

do {
  num = prompt("100을 초과하는 숫자를 입력해주세요.", 0);
} while (num <= 100 && num);
```

`do..while`반복문을 사용해 아래 두 조건이 모두 truthy인 경우 프롬프트 창이 뜨게 하면 됩니다.

<<<<<<< HEAD
1. `num <= 100`인지 확인하기. `100`보다 작거나 같은 값을 입력한 경우 프롬프트 창이 떠야 합니다.
2.  `num`이 `null`이나 빈 문자열인지 확인하기. `num`이 `null`이나 빈 문자열이면 `&& num`이 거짓이 되므로 `while` 반복문이 종료됩니다.
=======
1. The check for `num <= 100` -- that is, the entered value is still not greater than `100`.
2. The check `&& num` is false when `num` is `null` or an empty string. Then the `while` loop stops too.
>>>>>>> a82915575863d33db6b892087975f84dea6cb425

참고: `num`이 `null`인 경우 `num <= 100`은 `true`가 되므로 두 번째 조건이 없으면 취소 버튼을 눌러도 반복문이 계속해서 실행됩니다. 따라서 위 두 조건을 모두 확인해야 합니다.
