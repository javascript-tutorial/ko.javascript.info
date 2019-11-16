importance: 4

---

# n일 전 '일' 출력하기

`date`를 기준으로 `days`일 전 '일'을 반환하는 함수 `getDateAgo(date, days)`를 만들어보세요, 

오늘이 20일이라면 `getDateAgo(new Date(), 1)`는 19를, `getDateAgo(new Date(), 2)`는 18을 반환해야 합니다.

`days`가 `365`일 때도 제대로 동작해야 합니다.

```js
let date = new Date(2015, 0, 2); // 2015년 1월 2일

alert( getDateAgo(date, 1) ); // 1, (2015년 1월 1일)
alert( getDateAgo(date, 2) ); // 31, (2014년 12월 31일)
alert( getDateAgo(date, 365) ); // 2, (2014년 1월 2일)
```

주의: 함수는 `date`를 변경하지 않아야 합니다. 
