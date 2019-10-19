팩토리얼은 그 정의에 따라 `n!`을 `n * (n-1)!`로 바꿔쓸 수 있습니다.

따라서 `factorial(n)`의 결과는 `n`과 `factorial(n-1)`의 결과를 곱한 값이 되겠죠. 함수의 인수는 `n-1`에서 `1`이 될 때까지 점점 줄어들 겁니다.  
 

```js run
function factorial(n) {
  return (n != 1) ? n * factorial(n - 1) : 1;
}

alert( factorial(5) ); // 120
```

재귀의 베이스는 `1`로 잡았는데, `0`이어도 상관은 없습니다. `0`일 경우 재귀 단계가 하나 더 늘어난다는 것만 다릅니다.  

```js run
function factorial(n) {
  return n ? n * factorial(n - 1) : 1;
}

alert( factorial(5) ); // 120
```
