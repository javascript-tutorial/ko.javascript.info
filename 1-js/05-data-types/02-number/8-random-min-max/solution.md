0..1 구간의 모든 값을 `min`에서 `max`까지의 값으로 '매핑' 해야 합니다.

매핑은 두 단계로 수행할 수 있습니다.

1. 0..1 구간의 난수에 `max-min`을 곱하면, 가능한 값의 구간이 `0..1`에서 `0..max-min`으로 증가합니다.
2. 이제 `min`을 더하면, 가능한 값의 구간은 `min`에서 `max`까지가 됩니다.

예시:

```js run
function random(min, max) {
  return min + Math.random() * (max - min);
}

alert( random(1, 5) ); 
alert( random(1, 5) );
alert( random(1, 5) ); 
```

