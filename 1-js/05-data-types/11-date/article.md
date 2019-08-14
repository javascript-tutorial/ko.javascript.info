# 날짜와 시각

새로운 내장 객체인 Date를 알아봅시다. Date는 날짜와 시각을 저장하고 관리하는 기능들을 제공합니다.

예를들어, 우리는 시각을 생성/수정한 후 저장하거나, 시각을 측정하거나, 현재 날짜를 출력하기 위해 Date 객체를 사용할 수 있습니다.

## 생성

새로운 `Date` 객체를 생성하는 것은 다음과 같은 인자 하나를 갖는 `new Date()`를 호출합니다.:

`new Date()`
: 인자가 없는 경우 현재 날짜와 시각에 대한 `Date`객체를 생성합니다.

    ```js run
    let now = new Date();
    alert( now ); // 현재 날짜/시각을 보여줍니다.
    ```

`new Date(milliseconds)`
: 1970년 1월 1일(UTC+0)을 기준으로 인자로 주어진 밀리초(1/1000초)만큼 지난 날짜에 대한 `Date`객체를 만듭니다.

    ```js run
    // 0 은 1970년 1월 1일(UTC+0)을 의미합니다.
    let Jan01_1970 = new Date(0);
    alert( Jan01_1970 );

    // 24시간을 더하자 1970년 1월 2일(UTC) 값을 얻었습니다.
    let Jan02_1970 = new Date(24 * 3600 * 1000);
    alert( Jan02_1970 );
    ```

    1970년의 시작 이후 지났던 밀리초의 수를 나타애는 정수 숫자를 *timestamp*라고 부릅니다.

    타임스탬프는 날짜를 나타내는 가벼운 숫자 표현입니다. 우리는 `new Date(timestamp)`를 사용해 타임스탬프로 date객체를 만들 수 있고, `date.getTime()`메소드를 이용해 이미 존재하는 `Date`객체를 타임스태프로 바꿀 수 있습니다. 

`new Date(datestring)`
: 만약 하나의 인자가 있고, 그 인자가 문자열이라면 자동으로 분석됩니다. 그 알고리즘은 `Date.parse`를 사용하는 것과 같은데, 이는 나중에 다룰 것 입니다.

    ```js run
    let date = new Date("2017-01-26");
    alert(date);
    // 시각이 설정되지 않아서 자정 GMT로 추정됩니다. 
    // 그리고 코드가 실행되는 곳의 표준시간대에 따라 조정됩니다.
    // 그 결과는 다음과 같을 수 있습니다.
    // Thu Jan 26 2017 11:00:00 GMT+1100 (Australian Eastern Daylight Time) (오스트레일리아 동부 일광 절약 시간)
    // 또는
    // Wed Jan 25 2017 16:00:00 GMT-0800 (Pacific Standard Time) (태평양 표준 시간)
    ```

`new Date(year, month, date, hours, minutes, seconds, ms)`
: 주어진 구성요소들의 지역 시간 대로 date 객체를 생성합니다. 맨 앞의 두 인자들은 의무입니다.

    - `year` 는 숫자 4개여야 합니다. `2013`은 괜찮지만 `98`은 그렇지 않습니다.
    - `month`를 세는 것은 `0`(1월) 부터 시작해서 `11`(12월)로 끝납니다.
    - `date` 매개변수는 "일"을 의미하며 공백으로 남긴다면 1로 추정됩니다.
    - 만약 `hours/minutes/seconds/ms`가 공백이라면 0과 같다고 추정됩니다.

    예를 들어:

    ```js
    new Date(2011, 0, 1, 0, 0, 0, 0); // // 1 Jan 2011, 00:00:00
    new Date(2011, 0, 1); // 시간 등의 기본값이 0으로 결과는 같습니다.
    ```

    최소 정밀도는 1ms (1/1000초 입니다.)

    ```js run
    let date = new Date(2011, 0, 1, 2, 3, 4, 567);
    alert( date ); // 1.01.2011, 02:03:04.567
    ```

## 날짜 구성요소에 접근

`Date` 객체의 년, 월 등에 접근하는 방법들이 있습니다.

[getFullYear()](mdn:js/Date/getFullYear)
: 연도를 가져옵니다. (숫자 4자리)

[getMonth()](mdn:js/Date/getMonth)
: 월을 가져옵니다., **0부터 11까지**.

[getDate()](mdn:js/Date/getDate)
: 메소드의 이름이 약간 이상할 수 있지만, 1부터 31까지의 월의 일을 가져옵니다. 

[getHours()](mdn:js/Date/getHours), [getMinutes()](mdn:js/Date/getMinutes), [getSeconds()](mdn:js/Date/getSeconds), [getMilliseconds()](mdn:js/Date/getMilliseconds)
: 해당하는 시간 구성요소를 가져옵니다.

`getYear()`가 아니라 `getFullYear()`
많은 자바스크립트 엔진들은 비표준 메소드인 `getYear()`을 실행합니다. 이 메소드는 2자리 숫자를 반환(return)하기 때문에 사용되지 않습니다. 절대 사용하지 말아주세요. 연도를 위해 `getFullYear()`메소드가 있습니다.


추가적으로, 우리는 요일을 얻을 수 있습니다.

[getDay()](mdn:js/Date/getDay)
: 0(일요일)부터 6(토요일)까지 요일을 가져옵니다. 첫번째 요일은 일요일부터 시작합니다. 몇몇 나라에서는 그렇지 않지만, 이는 바뀌지 않습니다.

**위의 모든 메소드는 지역 시간 대에 따라 상대적인 구성요소들을 반환합니다.**

표준 시간대 UTC+0에 대해 반환일, 월, 연도 등의 UTC-버전 메소드도 있습니다.: [getUTCFullYear()](mdn:js/Date/getUTCFullYear), [getUTCMonth()](mdn:js/Date/getUTCMonth), [getUTCDay()](mdn:js/Date/getUTCDay). `"get"`의 오른쪽 뒤에 `"UTC"`를 추가하십시오.

지역 시간 대가 UTC에 상대적으로 바뀌면 아래 코드는 다른 시간을 보여줍니다. 

```js run
// 현재 날짜
let date = new Date();

// 현재 시간 대에서 시간
alert( date.getHours() );

// UTC+0 시간대 에서 시간 (일광 절약이 없는 런던 시간)
alert( date.getUTCHours() );
```


주어진 메소드들 이외에도 UTC-버전이 없는 특별한 메소드 2개가 있습니다.

[getTime()](mdn:js/Date/getTime)
: 해당 날짜의 타임스탬프 (1970년 1월 1일 UTC+0 에서 지난 밀리초의 숫자) 를 반환합니다.

[getTimezoneOffset()](mdn:js/Date/getTimezoneOffset)
: 지역 시간 대와 UTC의 차이를 분으로 반환합니다.

    ```js run
    // UTC-1 시간대에 있으면 60을 반환합니다. 
    // UTC+3 시간대에 있으면 -180을 반환합니다.
    alert( new Date().getTimezoneOffset() );

    ```

## 날짜 구성요소 설정

다음 메소드들은 날짜/시각 구성요소를 설정하게 한다.:

- [`setFullYear(year, [month], [date])`](mdn:js/Date/setFullYear)
- [`setMonth(month, [date])`](mdn:js/Date/setMonth)
- [`setDate(date)`](mdn:js/Date/setDate)
- [`setHours(hour, [min], [sec], [ms])`](mdn:js/Date/setHours)
- [`setMinutes(min, [sec], [ms])`](mdn:js/Date/setMinutes)
- [`setSeconds(sec, [ms])`](mdn:js/Date/setSeconds)
- [`setMilliseconds(ms)`](mdn:js/Date/setMilliseconds)
- [`setTime(milliseconds)`](mdn:js/Date/setTime) (1970년 1월 1일(UTC) 이후 밀리초로 전체 날짜를 설정한다.)

위의 메소드 중 `setTime()`을 제외한 모든 것은 `setUTCHours()`와 같은 UTC-버전 메소드가 있습니다.

보다시피 `setHours`와 같은 메소드들은 한번에 여러 구성요소들을 설정할 수 있습니다. 언급되지 않은 구성요소들은 수정되지 않습니다. 

예를 들면:

```js run
let today = new Date();

today.setHours(0);
alert(today); // 여전히 오늘이지만 시간이 0으로 바뀌었습니다.

today.setHours(0, 0, 0, 0);
alert(today); // 여전히 오늘이지만 00시 정각입니다.
```

## 자동교정(Autocorrection)

*자동교정*은 `Date` 객체의 아주 유용한 특성입니다. 우리는 허용 범위 밖의 값을 설정할 수 있고, 그것은 스스로 교정될 것 입니다.

예를 들어:

```js run
let date = new Date(2013, 0, *!*32*/!*); // 2013년 1월 32일?!?
alert(date); // 2013년 2월 1일이 됩니다!
```

허용 범위 밖의 구성요소들은 자동으로 분배됩니다.

"2016년 2월 28일"에서 2일을 더해야 한다고 해봅시다. 그 결과는 윤년인지 여부에 따라 "3월 2일" 혹은 "3월 1일" 일 것입니다. 우리는 윤년의 여부에 대해 생각하지 않고 그냥 2일을 더하면 됩니다. `Date` 객체가 나머지 일들을 할 것입니다.

```js run
let date = new Date(2016, 1, 28);
*!*
date.setDate(date.getDate() + 2);
*/!*

alert( date ); // 2016년 3월 1일
```

이 특성은 주어진 시간의 기간 후 날짜를 얻고자 할 때 종종 사용됩니다. 예를 들어, "지금보다 70초 뒤"의 date 객체를 얻어봅시다:

```js run
let date = new Date();
date.setSeconds(date.getSeconds() + 70);

alert( date ); // 올바른 date 객체를 보여줍니다.
```

우리는 또한 0이나 음수 값을 설정할 수 있습니다. 예를 들어:

```js run
let date = new Date(2016, 0, 2); // 2016년 1월 2일

date.setDate(1); // 날짜를 1로 설정했습니다.
alert( date );

date.setDate(0); // 최소 날짜는 1이기 때문에 이전 달의 마지막 날로 추정됩니다.
alert( date ); // 2015년 12월 31일
```

## 날짜를 숫자로, 날짜 차이

`Date` 객체가 숫자로 바뀔 때, 타임스탬프가 `date.getTime()` 메소드와 같게 됩니다.:

```js run
let date = new Date();
alert(+date); // date.getTime()의 결과와 같은 밀리초의 숫자
```

중요한 부가 효과: 날짜를 뺄 수 있고 그 결과는 밀리초 형태의 두 날짜의 차이입니다.

이는 시간의 측정에 활용될 수 있습니다.

```js run
let start = new Date(); // 시간 측정 시작

// 작업하기
for (let i = 0; i < 100000; i++) {
  let doSomething = i * i * i;
}

let end = new Date(); // 시간 측정 종료

alert( `The loop took ${end - start} ms` );
```

## Date.now()

시간 측정만을 원한다면 `Date`객체는 필요가 없습니다.

현재 타임스탬프를 반환해주는 `Date.now()`라는 특별한 메소드가 있습니다.

의미적으로는 `new Date().getTime()`과 같지만 `Date.now()` 메소드는 중간 `Date` 객체를 만들지 않습니다. 그래서 더 빠르고 가비지컬렉션에 부담을 주지 않습니다.

그래서 자바스크립트 게임이나 다른 특별한 애플리케이션처럼 편의성이나 성능이 중요할 때 자주 사용합니다.

그래서 이게 더 좋을지도 모릅니다.

```js run
*!*
let start = Date.now(); // 1970년 1월 1일부터 밀리초를 셉니다.
*/!*

// 작업 시작
for (let i = 0; i < 100000; i++) {
  let doSomething = i * i * i;
}

*!*
let end = Date.now(); // done
*/!*

alert( `The loop took ${end - start} ms` ); // 날짜가 아닌 숫자를 뺍니다.
```

## 벤치마킹 (Benchmarking)

CPU를 많이 사용하는 함수의 신뢰할 수 있는 벤치마크를 원할 때 주의해야 합니다.

예를 들어, 두 함수의 date 객체의 차이를 계산해 어느 것이 더 빠른지 측정해 봅시다.

그러한 성능 측정을 "벤치마크(benchmarks)"라고 부릅니다.

```js
// 우리는 date1과 dqte를 가지고 있습니다. 어느 함수가 더 빠르게 밀리초로 그 차이를 반환할까요?
function diffSubtract(date1, date2) {
  return date2 - date1;
}

// 또는
function diffGetTime(date1, date2) {
  return date2.getTime() - date1.getTime();
}
```

이 두 함수는 정확하게 같은 일을 하지만, 하나는 밀리초를 얻기 위해 명시적으로 `date.getTime()`메소드를 사용하고 다른 하나는 date 객체를 숫자로 변환하는 것(date-to-number transform)에 의존합니다. 두 함수의 결과는 항상 같습니다.

그래서 어느 것이 더 빠를까요?

첫번째 아이디어는 그것들을 연속으로 여러번 실행하고 시간의 차이를 측정하는 것 일지도 모릅니다. 우리의 경우, 함수는 아주 간단하기 때문에 우리는 최소한 이 일을 10만번정도 해야합니다.

측정 해봅시다.:

```js run
function diffSubtract(date1, date2) {
  return date2 - date1;
}

function diffGetTime(date1, date2) {
  return date2.getTime() - date1.getTime();
}

function bench(f) {
  let date1 = new Date(0);
  let date2 = new Date();

  let start = Date.now();
  for (let i = 0; i < 100000; i++) f(date1, date2);
  return Date.now() - start;
}

alert( 'Time of diffSubtract: ' + bench(diffSubtract) + 'ms' );
alert( 'Time of diffGetTime: ' + bench(diffGetTime) + 'ms' );
```

`getTime()`메소드를 사용하는 것이 훨씬 더 빠릅니다! 그 이유는 형변환이 없고 이것은 엔진이 최적화하기 더 쉽게 해주기 때문입니다.

좋습니다. 뭔가 있지만 그것은 아직 좋은 벤치마크가 아닙니다.

`bench(diffSubtract)` 함수를 실행할 때 CPU가 자원을 사용하는 어떤 일을 병렬적으로 사용하고 있다고 상상해 봅시다. 그리고 `bench(diffGetTime)` 함수가 실행될 때 그 일이 끝납니다

현대의 멀티 프로세스 운영체제에서 아주 현실적인 시나리오입니다.

결과적으로 첫번째 벤치마크는 두번째 벤치마크보다 더 적은 CPU 자원을 가질 것 입니다. 이는 잘못된 결과를 가져올지도 모릅니다. 

**더 신뢰할 수 있는 벤치마킹을 위해 벤치마크 전체 패키지는 여러번 다시 실행되어야 합니다.**

예를 들면 이것처럼 말입니다.:

```js run
function diffSubtract(date1, date2) {
  return date2 - date1;
}

function diffGetTime(date1, date2) {
  return date2.getTime() - date1.getTime();
}

function bench(f) {
  let date1 = new Date(0);
  let date2 = new Date();

  let start = Date.now();
  for (let i = 0; i < 100000; i++) f(date1, date2);
  return Date.now() - start;
}

let time1 = 0;
let time2 = 0;

*!*
// bench(upperSlice)와 bench(upperLoop)를 각각 10번씩 교대로 실행합니다.
for (let i = 0; i < 10; i++) {
  time1 += bench(diffSubtract);
  time2 += bench(diffGetTime);
}
*/!*

alert( 'Total time for diffSubtract: ' + time1 );
alert( 'Total time for diffGetTime: ' + time2 );
```

현대의 자바스크립트 엔진은 여러번 실행되는 "핫 코드(hot code)"에만 고급 최적화를 적용하기 시작했습니다(거의 실행되지 않는 것들에는 최적화 할 필요가 없습니다.). 위의 예에서, 처음 실행은 잘 최적화되지 않았습니다. 우리는 열을 가하는 첫 실행 (heat-up run)을 더해야 할지도 모릅니다.

```js
// 반복문 전에 "첫 실행(heating up)"을 더합니다.
bench(diffSubtract);
bench(diffGetTime);

// 벤치마크를 합니다.
for (let i = 0; i < 10; i++) {
  time1 += bench(diffSubtract);
  time2 += bench(diffGetTime);
}
```

```
마이크로벤치마킹(microbenchmarking)을 할 때 주의하십시오.
현대의 자바스크립트 엔진은 많은 최적화들을 수행합니다. 그것들은 "일반적인 사용"과 비교하여 "인공 시험"의 결과를 바꿀 수 있는데, 특히 연산자나 내장함수의 작동 방식과 같은 아주 작은 것들을 벤치마킹 할 때 그렇습니다.

V8에 대한 중요한 기사 묶음들은 <http://mrale.ph>에서 확인할 수 있습니다.
```

## 문자열에서 Date.parse 

[Date.parse(str)](mdn:js/Date/parse)메소드는 문자열에서 date 객체를 읽을 수 있습니다.

The string format should be: `YYYY-MM-DDTHH:mm:ss.sssZ`, where:
문자열 형태는 `YYYY-MM-DDTHH:mm:ss.sssZ`와 같아야 합니다.

- `YYYY-MM-DD` -- 연-월-일
- 알파벳 `"T"`는 구분문자(delimiter - 문자열의 시작과 끝을 알려주는 문자로 문자열의 일부가 아닙니다.)로 사용됩니다.
- `HH:mm:ss.sss` -- 시간, 분, 초, 밀리초
- 선택 사항인 `'Z'` 부분은 시간대를 `+-hh:mm` 형식으로 나타낸다. `Z` 한 글자는 UTC+0을 의미합니다.

`YYYY-MM-DD`나 `YYYY-MM`, `YYYY`와 같은 더 짧은 형태도 가능합니다.

`Date.parse(str)`메소드 호출은 문자열을 주어진 형식으로 구문분석하고 타임스탬프(1970년 1월 1일 UTC+0부터의 밀리초)를 반환합니다. 만약 형식이 유효하지 않다면 `NaN`을 반환합니다.

예를 들어:

```js run
let ms = Date.parse('2012-01-26T13:51:50.417-07:00');

alert(ms); // 1327611110417  (타임스탬프)
```

We can instantly create a `new Date` object from the timestamp:

```js run
let date = new Date( Date.parse('2012-01-26T13:51:50.417-07:00') );

alert(date);  
```

## 요약

- 자바스크립트에서 날짜와 시각은 [Date](mdn:js/Date)객체로 나타납니다. `Date` 객체는 항상 둘이 함께 하기 때문에 우리는 "날짜만" 또는 "시각만" 만들 수 없습니다. 
- 달은 0부터 세집니다. (물론 1월은 0입니다.)
- `getDay()` 메소드에서 요일 역시 0부터 세집니다. (0은 일요일입니다.)
- `Date`객체는 구성요소가 허용 범위 밖일 때 스스로 자동교정(auto-corrects)되어 설정됩니다. 이는 날짜/달/시간을 덧셈/뺄셈 할 때 유용합니다.
- 날짜는 뺄셈이 가능하고 그 결과는 두 날짜의 차이가 밀리초로 나타납니다. 왜냐하면 `Date`객체가 숫자로 변할 때 타임스탬프가 되기 때문입니다.
- 현재 타임스탬프를 빠르게 얻기 위해서는 `Date.now()`메소드를 사용하십시오.

다른 많은 시스템과는 다르게 자바스크립트에서 타임스탬프는 초가 아닌 밀리초라는 것을 기억하십시오.

때때로 우리는 더 정교한 시각 측정이 필요합니다. 자바스크립트 그 자체는 시간을 마이크로초(백만분의 1초)로 측정하는 방법을 가지고 있지 않지만 대부분의 환경은 이를 제공합니다. 예를 들어, 브라우저는 페이지 로딩 시작 시점부터 마이크로초의 정밀도로 밀리초 단위까지 (소수점 3자리까지) 제공하는 [performance.now()](mdn:api/Performance/now)메소드를 가지고 있습니다.

```js run
alert(`Loading started ${performance.now()}ms ago`);
// 다음과 같이: "Loading started 34731.26000000001ms ago"
// .26 is microseconds (260 microseconds)
// 소수점 이하 3자리 이상이 정밀 오차지만 오로지 첫 세자리만 정확합니다.
```

Node.js에는 `microtime` 모듈과 다른 방법들이 있습니다. 거의 모든 기기와 환경이 정밀도를 더 얻게 할 수 있지만, `Date`객체에서는 아닙니다. 