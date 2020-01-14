```js run
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(3000).then(() => alert('3초후 실행'));
```

답안에서 `resolve`가 인수 없이 호출되었다는 것에 주목해주시기 바랍니다. 함수 `delay`는 지연 확인 용이기 때문에 반환 값이 필요 없습니다.
