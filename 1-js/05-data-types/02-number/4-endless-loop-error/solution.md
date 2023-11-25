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

Such things happen because of the precision losses when adding fractions like `0.2`.

Conclusion: evade equality checks when working with decimal fractions.