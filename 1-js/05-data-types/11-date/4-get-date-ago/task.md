중요도 : 4

---

# n일 전에는 어떤 날짜 일까요?

`date` 에서 `days` 만큼 이전의 날짜를 리턴하는 `getDateAgo(date, days)` 함수를 작성하십시오.

예를 들어 오늘이 20 일인 경우 getDateAgo (new Date (), 1)는 19 일, getDateAgo (new Date (), 2)는 18 일이어야합니다.

`days = 365` 혹은 그 이상 일 때도 안정적으로 작동해야합니다.

```js
let date = new Date(2015, 0, 2);

alert( getDateAgo(date, 1) ); // 1, (1 Jan 2015)
alert( getDateAgo(date, 2) ); // 31, (31 Dec 2014)
alert( getDateAgo(date, 365) ); // 2, (2 Jan 2014)
```

참고로 함수는 주어진 `date`를 수정해서는 안됩니다.
 