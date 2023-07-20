# 간단하지만 잘못된 풀이

가장 간단하지만 잘못된 풀이는 `min`과 `max` 사이의 값을 생성하고 이를 반올림하는 방법입니다.

```js run
function randomInteger(min, max) {
  let rand = min + Math.random() * (max - min); 
  return Math.round(rand);
}

alert( randomInteger(1, 3) );
```

위의 함수는 작동하지만 제대로 된 풀이가 아닙니다. 이 함수는 구간의 양 끝값인 `min`과 `max`를 다른 값에 비해 절반의 확률로 반환합니다.

위에 주어진 코드를 여러 번 실행하면 `2`가 가장 많이 반환되는 것을 확인할 수 있습니다.

이는 함수 `Math.round()`가 `1..3` 구간의 난수를 생성하고 이를 아래와 같이 반올림하기 때문입니다.

```js no-beautify
values from 1    ... to 1.4999999999  become 1
values from 1.5  ... to 2.4999999999  become 2
values from 2.5  ... to 2.9999999999  become 3
```

따라서 `1`은 `2`에 비해 절반의 확률로 반환됩니다. `3`의 경우도 마찬가지입니다.

# 올바른 풀이

이 문제에는 다수의 해답이 존재합니다. 그중 하나는 경곗값을 조정하는 방법입니다. 같은 구간의 값을 얻기 위해 `0.5와 3.5` 사이의 난수를 생성하면, 구간의 양 끝값에 필요한 만큼의 확률을 더해줄 수 있습니다.

```js run
*!*
function randomInteger(min, max) {
  //여기에서 rand는 (min-0.5)와 (max+0.5) 사이의 값입니다
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
*/!*

alert( randomInteger(1, 3) );
```

또 다른 방법은 `min`과 `max+1` 사이의 난수에 함수 `Math.floor`를 실행하는 것입니다.

```js run
*!*
function randomInteger(min, max) {
  //여기에서 rand는 min과 (max+1) 사이의 값입니다
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
*/!*

alert( randomInteger(1, 3) );
```

이 방법을 이용하면 각각의 구간에 위치한 값은 다음과 같이 정수에 대응됩니다.

```js no-beautify
values from 1  ... to 1.9999999999  become 1
values from 2  ... to 2.9999999999  become 2
values from 3  ... to 3.9999999999  become 3
```

모든 구간의 길이가 같기 때문에 각각의 정수가 반환되는 확률이 모두 같습니다.
