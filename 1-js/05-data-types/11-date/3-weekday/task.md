importance: 5

---

# 유럽 기준 달력

유럽국가의 달력은 월요일부터 시작합니다(월요일-1, 화요일-2, ... 일요일-7). '유럽' 기준 숫자를 반환해주는 함수 `getLocalDay(date)`를 만들어보세요. 

```js no-beautify
let date = new Date(2012, 0, 3);  // 2019년 11월 5일
alert( getLocalDay(date) );       // 금요일이므로, 5가 출력되어야 함
```