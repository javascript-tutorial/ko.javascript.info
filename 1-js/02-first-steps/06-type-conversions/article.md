# Type Conversions(형 변환)

대부분의 경우 연산자와 함수는 자동으로 주어진 값을 올바른 자료형으로 변환합니다. 이를 "형 변환"이라고합니다.

예를 들어, `alert`는 어떤 값을 문자열로 자동 변환하여 보여줍니다. 수학 연산은 값을 숫자로 변환합니다.

또한 값을 예상되는 형식으로 명시적으로 변환해야하는 경우도 있습니다.

```smart header="아직 objects(객체 자료형)에 대해 이야기하지 않습니다."
이 장에서는 objects 를 다루지 않겠습니다. 대신, 우리는 먼저 primitives(원시 자료형)를 공부 할 것입니다. 나중에 객체 자료형에 대해 공부한 이후에 <info:object-toprimitive> 챕터에서 객체의 형변환 작업을 어떻게 하는지 볼 것입니다.
```

## ToString (문자열로)

문자열 변환은 값의 문자열 형태가 필요할 때 발생합니다.

예를 들어, `alert(value)`는 값은 보여주기 위해 이 문자열 변환을 수행합니다.

우리는 또한 `String(value)`함수를 호출하여 값을 문자열로 변환 할 수 있습니다:

```js run
let value = true;
alert(typeof value); // boolean

*!*
value = String(value); // now value is a string "true"
alert(typeof value); // string
*/!*
```

문자열 변환은 대부분 명확합니다. `false`는``false``가되고 ``null``은``null``이됩니다.

## ToNumber(숫자로)

숫자 변환은 수학적 함수와 수식에서 자동으로 발생합니다.

예를 들어, 숫자가 아닌 것들에 나누기 `/`를 적용한 경우:

```js run
alert( "6" / "2" ); // 3, strings are converted to numbers
```

명시적으로 `value`를 숫자로 변환하기 위해 `Number(value)`함수를 사용할 수 있습니다:

```js run
let str = "123";
alert(typeof str); // string

let num = Number(str); // becomes a number 123

alert(typeof num); // number
```

명시적 변환은 일반적으로 텍스트 형식과 같은 문자열 기반 소스에서 값을 읽어서 숫자로 입력해야 할 때 필요합니다.

문자열이 유효한 숫자가 아닌 경우, 그러한 변환의 결과는 `NaN`입니다. 예를 들면:

```js run
let age = Number("an arbitrary string instead of a number");

alert(age); // NaN, conversion failed
```

숫자 변환 규칙:

| Value |  변환 후... |
|-------|-------------|
|`undefined`|`NaN`|
|`null`|`0`|
|<code>true&nbsp;and&nbsp;false</code> | `1` 과 `0` |
| `string` | 시작과 끝에서 공백이 제거됩니다. 나머지 문자열이 비어 있으면 결과는 `0`입니다. 그렇지 않으면 숫자가 문자열에서 읽혀집니다. 오류는 `NaN`을 제공합니다. |

예시:

```js run
alert( Number("   123   ") ); // 123
alert( Number("123z") );      // NaN (error reading a number at "z")
alert( Number(true) );        // 1
alert( Number(false) );       // 0
```

여기서 `null`과 `undefined`는 다르게 동작하는 것에 유의하시기 바랍니다.: `null`은 0이되고 `undefined`는 `NaN`이 됩니다.

````smart header="덧셈'+'은 문자열을 연결합니다."
거의 모든 수학 연산은 값을 숫자로 변환합니다. 주목할만한 예외는 덧셈`+`입니다. 더한 값 중 하나가 문자열이면 다른 값도 문자열로 변환됩니다.

그런 다음, 이를 연결(joins) 합니다.

```js run
alert( 1 + '2' ); // '12' (string to the right)
alert( '1' + 2 ); // '12' (string to the left)
```

이것은 arguments(인수) 중 적어도 하나가 문자열 일 때만 발생합니다. 그렇지 않으면 값이 숫자로 변환됩니다.
````

## ToBoolean(Boolean으로)

불리언 형변환은 가장 간단합니다.

이것은 논리적 연산에서 발생하고(나중에 우리는 조건 테스트와 그 밖의 유사한 것들을 만날 것입니다), `Boolean(value)`를 호출하여 명시적으로 수행할 수도 있습니다.

형변환 규칙:

- `0`, 빈 문자열(''), `null`, `undefined` 과 `NaN`과 같이 직관적으로 "비어있는" 값은 `false`가 됩니다.
- 그외에 값은 `true`가 됩니다.

예를 들면:

```js run
alert( Boolean(1) ); // true
alert( Boolean(0) ); // false

alert( Boolean("hello") ); // true
alert( Boolean("") ); // false
```

````warn header="주의 : `\"0\"`을 가진 문자열은 `true`입니다."
일부 언어 (다시 말하면, PHP)는 `"0"`을 `false`로 취급합니다. 그러나 JavaScript에서 비어 있지 않은 문자열은 항상 `true`입니다.

```js run
alert( Boolean("0") ); // true
alert( Boolean(" ") ); // spaces, also true (any non-empty string is true)
```
````


## 요약 

가장 널리 사용되는 세 가지 자료형 변환은 (to string), (to number)와 (to boolean)입니다.

**`ToString`** -- 우리가 뭔가를 출력할 때 발생합니다. `String(value)`으로 실행할 수 있습니다. 문자열 변환은 일반적으로 primitive 값에 대해 명확합니다.

**`ToNumber`** --  수학 연산에서 발생합니다. `Number(value)`로 실행할 수 있습니다.

변환은 다음 규칙을 따릅니다.

| Value |  변환 후... |
|-------|-------------|
|`undefined`|`NaN`|
|`null`|`0`|
|<code>true&nbsp;/&nbsp;false</code> | `1 / 0` |
| `string` | 시작과 끝에서 공백이 제거됩니다. 나머지 문자열이 비어 있으면 결과는 `0`입니다. 그렇지 않으면 숫자가 문자열에서 읽혀집니다. 오류는 `NaN`을 제공합니다. |

**`ToBoolean`** -- 논리적 연산에서 발생합니다. `Boolean(value)`으로 실행할 수 있습니다.

다음 규칙을 따릅니다.

| Value |  변환 후... |
|-------|-------------|
|`0`, `null`, `undefined`, `NaN`, `""` |`false`|
|any other value| `true` |


이 규칙의 대부분은 이해하고 기억하기 쉽습니다. 사람들이 일반적으로 실수를 저지르는 주목할만한 예외는 다음과 같습니다.

- `undefined`는 숫자 변환하면 `0`이 아니라 `NaN`입니다.
- `"0"`과 `"   "`같은 공백은 boolean 형 변환시 true 입니다.

Objects는 여기에서 다루지 않습니다. 나중에 <info:object-toprimitive> 챕터에서 Objects 로 되돌아 갈것입니다. JavaScript에 대한 기본적인 내용을 배우고 나면 객체에만 전념합니다.
