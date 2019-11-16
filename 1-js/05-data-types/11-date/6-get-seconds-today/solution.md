경과 초를 알려면 오늘 00시 00분 00초를 나타내는 `Date` 객체를 만들고, '지금'을 나타내는 객체에서 이 객체를 빼야 합니다. 

차이는 밀리초 기준이기 때문에 1000을 나눠 초로 변경해야 합니다.

```js run
function getSecondsToday() {
  let now = new Date();

  // 현재 년, 월, 일을 나타내는 객체를 생성
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let diff = now - today; // 차이(ms)
  return Math.round(diff / 1000); // 초로 변환
}

alert( getSecondsToday() );
```

경과 시간, 분, 초를 초로 변환하는 것도 방법이 될 수 있습니다.

```js run
function getSecondsToday() {
  let d = new Date();
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}
```
