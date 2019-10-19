```js run demo
function filterRangeInPlace(arr, a, b) {

  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];

    // 범위 밖의 요소를 제거함
    if (val < a || val > b) {
      arr.splice(i, 1);
      i--;
    }
  }

}

let arr = [5, 3, 8, 1];

filterRangeInPlace(arr, 1, 4); // 1과 4 사이에 있지 않은 요소는 모두 제거함

alert( arr ); // [3, 1]
```
