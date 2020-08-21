# 느린 해답

만들 수 있는 모든 부분 배열의 합을 계산하는 방법이 있을 수 있습니다.

이를 구현하는 가장 간단한 방법은 배열의 각 요소를 시작으로 하는 모든 부분 배열의 합을 계산하는 것입니다.

예를 들어 배열 `[-1, 2, 3, -9, 11]`이 있다고 합시다.

```js no-beautify
// -1부터 시작
-1
-1 + 2
-1 + 2 + 3
-1 + 2 + 3 + (-9)
-1 + 2 + 3 + (-9) + 11

// 2부터 시작
2
2 + 3
2 + 3 + (-9)
2 + 3 + (-9) + 11

// 3부터 시작
3
3 + (-9)
3 + (-9) + 11

// -9부터 시작
-9
-9 + 11

// 11부터 시작
11
```

위와 같은 알고리즘을 사용하려면 중첩 반복문이 필요합니다. 외부 반복문에선 배열의 각 요소를 순회하고, 내부 반복문에선 각 요소부터 시작하는 부분 배열의 합을 계산하게 됩니다.

```js run
function getMaxSubSum(arr) {
  let maxSum = 0; // 어떤 요소도 선택하지 않으면 0을 반환합니다.

  for (let i = 0; i < arr.length; i++) {
    let sumFixedStart = 0;
    for (let j = i; j < arr.length; j++) {
      sumFixedStart += arr[j];
      maxSum = Math.max(maxSum, sumFixedStart);
    }
  }

  return maxSum;
}

alert( getMaxSubSum([-1, 2, 3, -9]) ); // 5
alert( getMaxSubSum([-1, 2, 3, -9, 11]) ); // 11
alert( getMaxSubSum([-2, -1, 1, 2]) ); // 3
alert( getMaxSubSum([1, 2, 3]) ); // 6
alert( getMaxSubSum([100, -9, 2, -3, 5]) ); // 100
```

이렇게 구현하면 시간 복잡도가 [O(n<sup>2</sup>)](https://en.wikipedia.org/wiki/Big_O_notation)이 됩니다. 이는 배열의 크기를 2배 늘리면 알고리즘은 4배나 더 오래 걸린다는 의미입니다.

크기가 큰 배열(1000, 10000 또는 그 이상의 요소를 가진 배열)에 위와 같은 알고리즘을 적용하면 매우 느릴 수 있습니다.

# 빠른 해답

배열을 순회하면서 변수 `s`에 현재의 부분합을 저장하는 방법도 가능합니다. `s`가 음수가 된 경우는 `s`에 `0`을 할당하면 됩니다. `s`의 값 중 최댓값이 정답이 됩니다.

해설이 모호하다고 느껴지면 아래 코드를 참고해주세요.

```js run demo
function getMaxSubSum(arr) {
  let maxSum = 0;
  let partialSum = 0;

  for (let item of arr) { // 배열의 각 요소를
    partialSum += item; // partialSum에 더합니다.
    maxSum = Math.max(maxSum, partialSum); // 최대값을 기억해 놓습니다.
    if (partialSum < 0) partialSum = 0; // 음수가 되면 0을 대입합니다.
  }

  return maxSum;
}

alert( getMaxSubSum([-1, 2, 3, -9]) ); // 5
alert( getMaxSubSum([-1, 2, 3, -9, 11]) ); // 11
alert( getMaxSubSum([-2, -1, 1, 2]) ); // 3
alert( getMaxSubSum([100, -9, 2, -3, 5]) ); // 100
alert( getMaxSubSum([1, 2, 3]) ); // 6
alert( getMaxSubSum([-1, -2, -3]) ); // 0
```

이 알고리즘은 정확히 한번 배열을 순회하므로 시간 복잡도는 O(n)입니다.

알고리즘에 대한 상세한 정보는 [최대합 부분 배열 문제](http://en.wikipedia.org/wiki/Maximum_subarray_problem)에서 찾을 수 있습니다. 동작원리에 대해 확실히 이해가 되지 않았다면 위 예제의 알고리즘이 어떻게 동작하는지 찬찬히 살펴보세요. 글을 읽는 것보다 코드를 살펴보는게 훨씬 도움이 될 겁니다.
