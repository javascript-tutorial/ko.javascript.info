우리는 0부터 1까지의 모든 값을 `min`부터 `max`까지의 범위로 '매핑' 해야합니다.

이 작업은 두 단계로 이루어집니다.

1. 0과 1 사이의 임의의 숫자에 `max-min`를 곱하면 가능한 값의 간격이 `0..1`에서 `0..max-min`으로 증가합니다.
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
