현재와 `date`의 차이를 알려면 빼야 합니다. 

```js run demo
function formatDate(date) {
  let diff = new Date() - date; // 차이(ms)

  if (diff < 1000) { // 차이가 1초 미만이라면
    return '현재';
  }

  let sec = Math.floor(diff / 1000); // 차이를 초로 변환

  if (sec < 60) {
    return sec + '초 전';
  }

  let min = Math.floor(diff / 60000); // 차이를 분으로 변환
  if (min < 60) {
    return min + '분 전';
  }

  // 날짜의 포맷을 변경
  // 일, 월, 시, 분이 숫자 하나로 구성되어있는 경우, 앞에 0을 추가해줌
  let d = date;
  d = [
    '0' + d.getDate(),
    '0' + (d.getMonth() + 1),
    '' + d.getFullYear(),
    '0' + d.getHours(),
    '0' + d.getMinutes()
  ].map(component => component.slice(-2)); // 모든 컴포넌트의 마지막 숫자 2개를 가져옴

  // 컴포넌트를 조합
  return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
}

alert( formatDate(new Date(new Date - 1)) ); // "현재"

alert( formatDate(new Date(new Date - 30 * 1000)) ); // "30초 전"

alert( formatDate(new Date(new Date - 5 * 60 * 1000)) ); // "5분 전"

// 어제의 날짜를 31.12.2016, 20:00 형태로 출력
alert( formatDate(new Date(new Date - 86400 * 1000)) );
```

다른 방법:

```js run
function formatDate(date) {
  let dayOfMonth = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let diffMs = new Date() - date;
  let diffSec = Math.round(diffMs / 1000);
  let diffMin = diffSec / 60;
  let diffHour = diffMin / 60;

  // formatting
  year = year.toString().slice(-2);
  month = month < 10 ? '0' + month : month;
  dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;

  if (diffSec < 1) {
    return 'right now';  
  } else if (diffMin < 1) {
    return `${diffSec} sec. ago`
  } else if (diffHour < 1) {
    return `${diffMin} min. ago`
  } else {
    return `${dayOfMonth}.${month}.${year} ${hour}:${minutes}`
  }
}
```
