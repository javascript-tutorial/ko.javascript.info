두 번째 괄호가 제대로 동작하려면 첫 번째 괄호는 반드시 함수를 반환해야 합니다.

아래와 같이 말이죠.

```js run
function sum(a) {

  return function(b) {
    return a + b; // 'a'는 외부 렉시컬 환경에서 가져옵니다.
  };

}

alert( sum(1)(2) ); // 3
alert( sum(5)(-1) ); // 4
```

