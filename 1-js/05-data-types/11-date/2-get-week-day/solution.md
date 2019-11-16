`date.getDay()` 메서드는 요일을 나타내는 숫자를 반환합니다(일요일부터 시작).

요일이 담긴 배열을 만들고, `date.getDay()`를 호출해 반환받은 값을 인덱스로 사용하면 원하는 기능을 구현할 수 있습니다.

```js run demo
function getWeekDay(date) {
  let days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  return days[date.getDay()];
}

let date = new Date(2014, 0, 3); // 2014년 1월 3일
alert( getWeekDay(date) ); // FR
```
