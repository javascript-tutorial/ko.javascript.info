importance: 4

---

# 상대 날짜 출력하기

`date`를 아래와 같은 형식으로 변경해주는 함수 `formatDate(date)`를 만들어보세요.

- `date`가 지금으로부터 1초 미만 전의 날짜를 나타내면 `"현재"`를 반환해야 합니다.
- 그렇지 않고, `date`가 지금으로부터 1분 이하 전의 날짜를 나타내면 `"n초 전"`을 반환해야 합니다.
- 그렇지 않고, `date`가 지금으로부터 1시간 미만 전의 날짜를 나타내면 `"n분 전"`을 반환해야 합니다.
- 이 외의 경우는 전체 날짜를 `"DD.MM.YY HH:mm"`형식(`"일.월.연 시:분"`)으로 반환해야 합니다(예시: `31.12.16 10:00`).

예시:

```js
alert( formatDate(new Date(new Date - 1)) ); // "현재"

alert( formatDate(new Date(new Date - 30 * 1000)) ); // "30초 전"

alert( formatDate(new Date(new Date - 5 * 60 * 1000)) ); // "5분 전"

// 어제를 나타내는 날짜를 "일.월.연 시:분" 포맷으로 출력
alert( formatDate(new Date(new Date - 86400 * 1000)) );
```
