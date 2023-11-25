`i`는 절대 `10`이 될 수 없어서 무한 루프가 발생합니다.

코드를 실행해 실제 `i` 값을 확인해 봅시다.

```js run
let i = 0;
while (i < 11) {
  i += 0.2;
  if (i > 9.8 && i < 10.2) alert( i );
}
```

None of them is exactly `10`.

Such things happen because of the precision losses when adding fractions like `0.2`.

Conclusion: evade equality checks when working with decimal fractions.