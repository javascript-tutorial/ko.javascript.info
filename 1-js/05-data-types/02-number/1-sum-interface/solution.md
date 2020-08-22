

```js run demo
let a = +prompt("The first number?", "");
let b = +prompt("The second number?", "");

alert( a + b );
```

`prompt` 앞에 단항 연산자 `+`가 붙어 있습니다. 단항 연산자 `+`는 입력받은 값을 숫자형으로 바꾸어 줍니다.

단항 연산자 `+`를 사용하지 않는 경우, `a`와 `b` 는 문자열이기 때문에 `a`와 `b`의 합은 문자열의 연결이 됩니다. `"1" + "2" = "12"` 이런 식으로 말이죠.