먼저 0..1 구간의 모든 값을 `min`과 `max`의 사이가 될 수 있도록 매핑해야 합니다. 

두 단계로 수행할 수 있습니다.

1. 0..1 사이의 무작위 숫자를 `max-min`으로 곱한다면, 가능한 값의 구간은 `0..1`에서 `0..max-min`이 됩니다.
2. 이제 `min`을 더해주면, 가능한 구간은 `min` 이상 `max` 미만이 됩니다.

답안:

```js run
function random(min, max) {
  return min + Math.random() * (max - min);
}

alert( random(1, 5) ); 
alert( random(1, 5) ); 
alert( random(1, 5) ); 
```

