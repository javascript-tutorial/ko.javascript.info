다음 달을 나타내는 객체를 만들고 `day`에는 `0`을 넘겨주면 됩니다.
```js run demo
function getLastDayOfMonth(year, month) {
  let date = new Date(year, month + 1, 0);
  return date.getDate();
}

alert( getLastDayOfMonth(2012, 0) ); // 31
alert( getLastDayOfMonth(2012, 1) ); // 29
alert( getLastDayOfMonth(2013, 1) ); // 28
```

`new Date`의 세 번째 매개변수의 기본값은 `1`입니다. 그런데 어떤 숫자를 넘겨줘도 자바스크립트는 이를 자동 조정해줍니다. `0`을 넘기면 '첫 번째 일의 1일 전'을 의미하게 됩니다. 이는 '이전 달의 마지막 일'과 동일합니다.
