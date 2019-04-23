# switch 구문

`switch` 구문은 여러 개의 `if`을 바꿀 수 있다. 
여러 개의 코드를 비교하는 좀 더 나은 방법을 제공한다.

## 문법

`switch`은 한 개 또는 한 개 이상의 `case` 블록 그리고 옵션으로 default으로 구성 되어 있다.

아래와 같은 코드에서:

```js no-beautify
switch(x) {
  case 'value1':  // if (x === 'value1')
    ...
    [break]

  case 'value2':  // if (x === 'value2')
    ...
    [break]

  default:
    ...
    [break]
}
```
- `x`의 값이 첫번째 `case` (이것은 `value1`)의 값과 정확하게 같은지 확인하고, 그 다음 두번째 case의 값 (`value2`) 이 같은지 확인한다. 
- 같은 값을 찾으면 `switch`는 해당하는 `case`의 `break`에 접근할 때까지 또는 `switch`의 끝에 접근할 때까지 코드를 실행하기 시작한다.
- 일치하는 case가 없다면 `default` 코드를 실행한다.(`default`가 존재한다면)

## 예
`switch`의 예 (강조된 코드가 실행이 된다.)

```js run
let a = 2 + 2;

switch (a) {
  case 3:
    alert( 'Too small' );
    break;
*!*
  case 4:
    alert( 'Exactly!' );
    break;
*/!*
  case 5:
    alert( 'Too large' );
    break;
  default:
    alert( "I don't know such values" );
}
```

여기서 `switch`는 a와 첫번째 `case` 코드 3과 비교를 하기 시작한다. 일치하지 않는다. 그 다음 `4`. 4는 일치한다. 그래서 `break`을 만날 때까지 `case 4`을 실행하기 시작한다.

**만약 `break`이 없다면, 그 어떠한 확인도 없이 `case`을 계속 실행한다.**

`break`가 없이 실행되는 예시 :

```js run
let a = 2 + 2;

switch (a) {
  case 3:
    alert( 'Too small' );
*!*
  case 4:
    alert( 'Exactly!' );
  case 5:
    alert( 'Too big' );
  default:
    alert( "I don't know such values" );
*/!*
}
```
위의 코드의 예처럼 3번의 `alert`가 실행되는 것을 볼 수 있다.

```js
alert( 'Exactly!' );
alert( 'Too big' );
alert( "I don't know such values" );
```

### 어느 expression이든 `switch/case`의 인자로 가능하다.
Both `switch` and `case` 표현식 타입이 가능하다.
(*arbitrary expression* : some expression of your choice, types of expression)

예를 들어:

```js run
let a = "1";
let b = 0;

switch (+a) {
*!*
  case b + 1:
    alert("this runs, because +a is 1, exactly equals b+1");
    break;
*/!*

  default:
    alert("this doesn't run");
}
```
여기에서 `+a`는 1이고, 이것은 `b + 1`케이스와 비교한다. 그리고 해당 코드를 실행한다.

## "case"의 그룹핑

`case`의 몇몇 코드들은 그룹되어진 같은 코드들을 공유한다. 

예를 들어,`case 3`와 `case 5`이 같은 코드로 실행되어지기 원하면 :

```js run no-beautify
let a = 2 + 2;

switch (a) {
  case 4:
    alert('Right!');
    break;

*!*
  case 3:                    // (*) grouped two cases
  case 5:
    alert('Wrong!');
    alert("Why don't you take a math class?");
    break;
*/!*

  default:
    alert('The result is strange. Really.');
}
```

`3` 과 `5` 는 같은 메시지가 출력이 된다.
"group" case는 `break`가 없기 때문에 `switch/case`에서 side-effect의 케이스이다. `break`가 없기 때문에 `case 3`을 실행하기 시작하여 `case 5`까지 실행한다. 

## 타입 문제

항상 정확히 같은지 체크해야한다는 것을 강조한다. 값은 항상 타입이 같아야 한다.

아래의 코드로 예를 든다면 :

```js run
let arg = prompt("Enter a value?");
switch (arg) {
  case '0':
  case '1':
    alert( 'One or zero' );
    break;

  case '2':
    alert( 'Two' );
    break;

  case 3:
    alert( 'Never executes!' );
    break;
  default:
    alert( 'An unknown value' );
}
```
1. `0`, `1`은 `alert`가 실행이 된다. 
2. 두번째 `2`도 `alert`가 실행이 된다.
3. 그러나 3은 , `prompt`의 결과값은 문자열 "3"이므로 숫자 타입 3과 정확히 일치 하지 않는다. 그래서  `case 3` 코드는 실행되지 않고 `default` 코드가 실행된다.