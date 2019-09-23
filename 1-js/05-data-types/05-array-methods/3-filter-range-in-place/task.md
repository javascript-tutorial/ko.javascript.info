# importance: 4

---

# Filter range "in place"
특정 범위에 속하는 요소 찾기(배열 변경하기)

# Write a function `filterRangeInPlace(arr, a, b)` that gets an array `arr` and removes from it all values except those that are between `a` and `b`. The test is: `a ≤ arr[i] ≤ b`.

배열 `arr`의 요소 중 `a`와 `b` 사이에 속하지 않는 요소는 삭제해주는 함수 `filterRangeInPlace(arr, a, b)`를 작성해보세요. 배열의 모든 요소(`i`)는 다음 조건을 만족해야 합니다. `a ≤ arr[i] ≤ b`

# The function should only modify the array. It should not return anything.
작성한 함수는 기존 배열을 변경하기만 하고 아무것도 반환하지 않아야 합니다.


# For instance:
예시:
```js
#let arr = [5, 3, 8, 1];

# filterRangeInPlace(arr, 1, 4); // removed the numbers except from 1 to 4

# alert( arr ); // [3, 1]
```
