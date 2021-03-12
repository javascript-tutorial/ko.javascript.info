오늘 하루가 끝날 때까지 남은 밀리초를 구하려면 '내일 00시 00분 00초'에서 현재 날짜를 빼면 됩니다.

내일을 나타내는 객체를 먼저 만들고, 이후 작업을 하면 됩니다.

```js run
function getSecondsToTomorrow() {
  let now = new Date();

  // 내일 날짜
  let tomorrow = new Date(now.getFullYear(), now.getMonth(), *!*now.getDate()+1*/!*);

  let diff = tomorrow - now; // 차이(ms)
  return Math.round(diff / 1000); // 초로 변환
}
```

또 다른 방법:

```js run
function getSecondsToTomorrow() {
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let totalSecondsToday = (hour * 60 + minutes) * 60 + seconds;
  let totalSecondsInADay = 86400;

  return totalSecondsInADay - totalSecondsToday;
}
```

일광 절약 시간제(Daylight Savings Time, DST)를 실시하는 나라에선 하루가 23시간 혹은 25시간으로 구성될 수 있습니다. 이런 경우는 따로 다뤄야 합니다.
