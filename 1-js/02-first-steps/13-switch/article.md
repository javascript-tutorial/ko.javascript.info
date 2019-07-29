# switch 문

`if`로 조건들을 확인하는 여러 줄의 코드를 `switch` 문으로 바꿀 수 있습니다.
`switch` 문은 값을 여러 변수와 함께 비교를 위한 더 자세한 방법을 제공합니다.


## 문법

`switch` 문은 하나 이상의 `case` 블록 문과 선택적으로 `default` 문이 있습니다.

예시 :

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

- `x`의 값이 첫 번째 `case` 문(이것은 `'value1'`)의 값과 정확하게 일치하는지 확인하고, 그다음 두 번째 `case` 문의 값(`'value2'`)이 일치하는지 확인합니다.
- 일치하는 값을 찾으면 `switch` 문은 해당 `case` 문의 `break` 문으로 접근할 때까지 또는 `switch` 문이 끝날 때까지 코드를 실행하기 시작합니다.
- 값과 일치하는 `case` 문이 없다면, `default` 문이 존재할 경우 `default` 문을 실행합니다.

## 예시

`switch` 문의 예시 :

강조된 코드가 실행됩니다.

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

여기서 `switch` 문은 a와 첫 번째 `case 3` 문과 비교를 하기 시작합니다. a는 일치하지 않습니다. 그 다음 `case 4` 문 비교를 시작합니다. `case 4` 문은 a와 일치하게 됩니다. 그래서 `break` 문을 만날 때까지 `case 4` 문을 실행하기 시작합니다.

**만약 `break` 문이 없다면, 그 어떠한 확인도 하지 않고 `case` 문을 계속 실행합니다.**

`break` 문이 없이 실행되는 예시 :

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

위의 코드의 예시처럼 3번의 `alert`코드 가 실행되는 것을 볼 수 있습니다.

```js
alert( 'Exactly!' );
alert( 'Too big' );
alert( "I don't know such values" );
```

### 어느 표현식이든 `switch/case` 문의 인수로 가능합니다.

`switch` 문과 `case` 문은 표현식의 타입으로 가능합니다.
(*arbitrary expression* : some expression of your choice, types of expression)

예시 :

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

여기에서 `+a`는 1이고, `+a`는 `case b + 1` 문과 비교합니다. 그리고 해당 코드 블록을 실행합니다.

## "case" 문의 그룹화

`case` 문의 몇몇 코드들은 그룹화 된 같은 코드들을 공유합니다.

예를 들어, `case 3` 문과 `case 5` 문이 같은 코드로 실행되기 원하면 :

```js run no-beautify
let a = 2 + 2;

switch (a) {
  case 4:
    alert('Right!');
    break;

*!*
  case 3: // (*) grouped two cases
  case 5:
    alert('Wrong!');
    alert("Why don't you take a math class?");
    break;
*/!*

  default:
    alert('The result is strange. Really.');
}
```

`case 3` 문과 `case 5` 문은 같은 메시지를 출력합니다.
"group" 된 `case` 문은 `break` 문이 없기 때문에 `switch/case` 문에서 side-effect가 일어납니다. `break` 문이 없기 때문에 `case 3` 문을 실행하기 시작하여 `case 5` 문까지 실행합니다.

## 타입 문제

항상 정확히 일치하는지 체크해야 한다는 것을 강조하고 있습니다.
값은 항상 타입이 같아야 합니다.

예시 :

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

1. `case 0` 문, `case 1` 문은 `alert`코드가 실행이 됩니다.
2. 두번째 `case 2` 문도 `alert`코드가 실행이 됩니다.
3. 그러나 3은 , `prompt`의 결과값은 문자열 "3"이므로 숫자 타입 3과 정확히 일치 하지 않습니다. 그래서  `case 3` 문은 실행되지 않고 `default` 문이 실행됩니다.