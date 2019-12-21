구현 아이디어는 간단합니다. `date`에서 주어진 숫자를 빼면 됩니다.

```js
function getDateAgo(date, days) {
  date.setDate(date.getDate() - days);
  return date.getDate();
}
```

그런데 주의사항에서 `date`를 변경하지 말라고 했기 때문에 위와 같이 작성하면 오답이 됩니다. 외부 코드에서 `date`를 사용하고 있는 경우, `date`를 수정하게 되면 원치 않는 일이 발생할 수 있습니다. 

아래와 같이 `date`를 복사하면 `date`를 변경시키지 않고 원하는 기능을 구현할 수 있습니다.

```js run demo
function getDateAgo(date, days) {
  let dateCopy = new Date(date);

  dateCopy.setDate(date.getDate() - days);
  return dateCopy.getDate();
}

let date = new Date(2015, 0, 2); // 2015년 1월 2일

alert( getDateAgo(date, 1) ); // 1, (2015년 1월 1일)
alert( getDateAgo(date, 2) ); // 31, (2014년 12월 31일)
alert( getDateAgo(date, 365) ); // 2, (2014년 1월 2일)
```
