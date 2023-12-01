We need to "map" all values from the interval 0..1 into values from `min` to `max`.

That can be done in two stages:

1. If we multiply a random number from 0..1 by `max-min`, then the interval of possible values increases `0..1` to `0..max-min`.
2. 이제 `min`을 더하면 `min`에서 `max`가 됩니다.

함수 :

```js run
function random(min, max) {
  return min + Math.random() * (max - min);
}

alert( random(1, 5) ); 
alert( random(1, 5) ); 
alert( random(1, 5) ); 
```

