이 함수를 작성하기 위해서는 0..1 구간의 모든 값을 `min`과 `max` 사이의 값에 대응시켜야 합니다.

이는 다음 두 단계를 거쳐 해결할 수 있습니다.

1. 0과 1 사이의 난수에 `max-min`을 곱하면, 그 결괏값이 위치하는 구간은 `0..1`에서 `0..max-min`로 증가합니다.
2. 이 값에 `min`을 더하면, 결괏값은 `min`과 `max` 사이에 위치합니다.

다음과 같이 함수를 작성할 수 있습니다.

```js run
function random(min, max) {
  return min + Math.random() * (max - min);
}

alert( random(1, 5) ); 
alert( random(1, 5) ); 
alert( random(1, 5) ); 
```

