이 아이디어는 단순 : "날짜"로부터 주어진 일수를 변경하는 것이다.
```js
function getDateAgo(date, days) {
  date.setDate(date.getDate() - days);
  return date.getDate();
}
```

...하지만 이 기능은 '날짜'를 바꾸어서는 안 됩니다. 중요한 건, 날짜를 알려주는 외부 코드가 바뀌기를 예측하지 않기 때문입니다.

이를 구현하기 위해 다음과 같이 날짜를 복제하세요.

```js run demo
function getDateAgo(date, days) {
  let dateCopy = new Date(date);

  dateCopy.setDate(date.getDate() - days);
  return dateCopy.getDate();
}

let date = new Date(2015, 0, 2);

alert( getDateAgo(date, 1) ); // 1, (1 Jan 2015)
alert( getDateAgo(date, 2) ); // 31, (31 Dec 2014)
alert( getDateAgo(date, 365) ); // 2, (2 Jan 2014)
```
