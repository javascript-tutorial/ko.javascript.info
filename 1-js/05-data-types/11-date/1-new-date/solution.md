`new Date` 생성자는 로컬 시간대를 사용하기 때문에 특별히 지정해주지 않아도 됩니다. 주의할 점은 월이 0부터 시작한다는 것입니다.

따라서 2월은 숫자 1을 사용해 만듭니다.

Here's an example with numbers as date components:

```js run
//new Date(year, month, date, hour, minute, second, millisecond)
let d1 = new Date(2012, 1, 20, 3, 12);
alert( d1 );
```
We could also create a date from a string, like this:

```js run
//new Date(datastring)
let d2 = new Date("February 20, 2012 03:12:00");
alert( d2 );
```
