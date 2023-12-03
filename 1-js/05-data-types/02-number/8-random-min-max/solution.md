우리는 0부터 1까지의 모든 값을 `min`부터 `max`까지의 범위로 '매핑' 해야합니다.

That can be done in two stages:

1. If we multiply a random number from 0..1 by `max-min`, then the interval of possible values increases `0..1` to `0..max-min`.
2. Now if we add `min`, the possible interval becomes from `min` to `max`.

The function:

```js run
function random(min, max) {
  return min + Math.random() * (max - min);
}

alert(random(1, 5));
alert(random(1, 5));
alert(random(1, 5));
```
