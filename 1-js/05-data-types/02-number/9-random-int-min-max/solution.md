# 간단하지만 틀린 해답

가장 간단하지만 틀린 해답은 `min`에서 `max`까지의 값을 생성하고 반올림하는 것입니다.

```js run
function randomInteger(min, max) {
  let rand = min + Math.random() * (max - min); 
  return Math.round(rand);
}

alert( randomInteger(1, 3) );
```

`randomInteger` 함수는 동작하지만, 올바르지 않습니다. 에지값 `min`과 `max`가 나올 확률이 두 배 적습니다.

위의 예시를 여러 번 실행하면, `2`가 가장 많이 나타나는 것을 알 수 있습니다.

`Math.round()`는 `1..3` 구간에서 난수를 가져와 다음과 같이 반올림하기 때문입니다.

```js no-beautify
1 에서    ... 1.4999999999 까지의 값은 1 이 됩니다.
1.5 에서  ... 2.4999999999 까지의 값은 2 가 됩니다.
2.5 에서  ... 2.9999999999 까지의 값은 3 이 됩니다.
```

이제 `1`이 `2`보다 두 배 적게 나오는 것을 알 수 있습니다. `3`도 마찬가지입니다.

# 올바른 해답

올바른 해답이 많이 있지만 그중 하나는 구간을 조정하는 것입니다. 동일한 간격을 보장하기 위해서, `0.5 에서 3.5` 사이의 값을 생성하여, 에지값에 필요한 확률을 추가할 수 있습니다.

```js run
*!*
function randomInteger(min, max) {
  // rand는 (min-0.5)에서 (max+0.5)까지 입니다.
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
*/!*

alert( randomInteger(1, 3) );
```

다른 방법은 `min`에서 `max+1`까지의 난수에 `Math.floor`를 사용하는 것입니다.

```js run
*!*
function randomInteger(min, max) {
  // rand는 min에서 (max+1)까지 입니다.
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
*/!*

alert( randomInteger(1, 3) );
```

모든 구간이 다음과 같이 매핑되었습니다.

```js no-beautify
1  ... 에서 1.9999999999  까지의 값은 1 이 됩니다.
2  ... 에서 2.9999999999  까지의 값은 2 가 됩니다.
3  ... 에서 3.9999999999  까지의 값은 3 이 됩니다.
```

모든 구간은 같은 길이를 가지고 있고, 최종 분포도 균일합니다.
