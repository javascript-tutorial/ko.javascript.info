# 간단하지만 틀린 답안

가장 간단하지만 잘못된 답안은 `min`부터 `max`까지 값을 생성하고 반올림하는 것입니다.

```js run
function randomInteger(min, max) {
  let rand = min + Math.random() * (max - min); 
  return Math.round(rand);
}

alert( randomInteger(1, 3) );
```

기능은 동작하나 부정확합니다. 모서릿값인 `min`과 `max`가 나올 확률이 다른 것보다 두 배 적습니다.

위 예제를 여러 번 실행한다면 `2`가 가장 많이 나타난다는 것을 알 수 있습니다.

이는 `Math.round()`가 `1..3` 구간의 무작위 숫자를 다음과 같이 반올림하기 때문입니다.

```js no-beautify
1 부터    ... 1.4999999999 까지의 값은 1 이 됩니다.
1.5 부터  ... 2.4999999999 까지의 값은 2 이 됩니다.
2.5 부터  ... 2.9999999999 까지의 값은 3 이 됩니다.
```

`1`이 `2`보다 두 배 적게 나오는 것을 볼 수 있죠. `3`도 마찬가지입니다.

# 올바른 답안

여러 답안이 있지만 그중 하나는 구간 경계를 조정하는 것입니다. 동일한 구간을 보장하기 위해 `0.5 에서 3.5` 구간의 값을 생성하여 모서릿값에 필요한 확률을 더할 수 있습니다.

```js run
*!*
function randomInteger(min, max) {
  // rand 는 (min-0.5) 부터 (max+0.5) 까지입니다.  
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
*/!*

alert( randomInteger(1, 3) );
```

다른 방법으로는 `Math.floor`를 이용하여 `min`부터 `max+1`까지의 무작위 숫자를 만드는 것입니다. 

```js run
*!*
function randomInteger(min, max) {
  // 여기서 rand 는 min 부터 (max+1) 까지입니다.
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
*/!*

alert( randomInteger(1, 3) );
```

모든 구간이 다음과 같이 매핑되었습니다:

```js no-beautify
1 부터  ... 1.9999999999 까지의 값은 1 이 됩니다.
2 부터  ... 2.9999999999 까지의 값은 2 가 됩니다.
3 부터  ... 3.9999999999 까지의 값은 3 이 됩니다.
```

모든 구간의 길이가 동일해졌고, 최종 분포도 균일해졌습니다.
