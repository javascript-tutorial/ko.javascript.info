That's because `i` would never equal `10`.

Run it to see the *real* values of `i`:

```js run
let i = 0;
while (i < 11) {
  i += 0.2;
  if (i > 9.8 && i < 10.2) alert( i );
}
```

어떤 경우에도 `i`는 `10`이 될 수 없습니다.

이런 일이 발생하는 이유는 `0.2`와 같은 분수를 더할 때 정밀도 손실이 발생하기 때문입니다.

그러므로 소수나 분수를 대상으로 작업 할 땐 등호 비교를 피하세요.
