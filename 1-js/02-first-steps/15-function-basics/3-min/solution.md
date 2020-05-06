`if`문을 사용한 해답:

```js
function min(a, b) {
  if (a < b) {
    return a;
  } else {
    return b;
  }
}
```

물음표 연산자 `'?'`를 사용한 해답:

```js
function min(a, b) {
  return a < b ? a : b;
}
```

참고. `a == b`인 경우엔 `a`나 `b` 중 어떤 것을 반환해도 상관없습니다.