`new Date` 생성자는 로컬 시간대를 사용하기 때문에 특별히 지정해주지 않아도 됩니다. 주의할 점은 월이 0부터 시작한다는 것입니다.

따라서 2월은 숫자 1을 사용해 만듭니다.

숫자로 날짜를 생성하는 예제는 다음과 같습니다.

```js run
//new Date(year, month, date, hour, minute, second, millisecond)
let d1 = new Date(2012, 1, 20, 3, 12);
alert( d1 );
```

문자열로도 다음과 같이 날짜를 만들 수 있습니다.

```js run
//new Date(datastring)
let d2 = new Date("2012-02-20T03:12");
alert( d2 );
```
