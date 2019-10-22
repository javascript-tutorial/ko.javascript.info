
```js run
let array = [1, 2, 3];

array = new Proxy(array, {
  get(target, prop, receiver) {
    if (prop < 0) {
      // arr[1] 같은 형태로 배열 요소에 접근하는 경우에도
      // prop은 문자열이기 때문에 숫자로 바꿔줘야 합니다.
      prop = +prop + target.length;
    }
    return Reflect.get(target, prop, receiver);
  }
});


alert(array[-1]); // 3
alert(array[-2]); // 2
```
