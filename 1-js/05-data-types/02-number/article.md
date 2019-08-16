# 숫자들

자바스크립트에 있는 모든 숫자들은 "배정도 부동 소수점 숫자들(double precision floating point numbers)"로 알려져 있는 64-비트 형식 [IEEE-754]에 저장 되어 있습니다.

현재 알고 있는 내용을 한번 요약해 보겠습니다.

## 숫자를 입력하는 다양한 방법들

10억을 입력해야 한다고 상상해 봅니다. 가장 분명한 방법은 이것 입니다.

```js
let billion = 1000000000;
```

하지만 현실 세계에서 긴 문자열의 0을 입력하는 것은 실수를 유발할 수도 있고 게으르기 때문에 주로 피합니다. 주로 10억 대신 `"1bn"`을 입력하거나 73억 대신에 `"7.3bn"`을 입력합니다. 대부분의 거대한 숫자들의 경우에도 마찬가지입니다.

자바스크립트에서는 숫자에 문자 `"e"`를 추가하여 줄이고 0의 숫자를 세어 표시합니다.

```js run
let billion = 1e9;  // 1 billion, literally: 1 and 9 zeroes

alert( 7.3e9 );  // 7.3 billions (7,300,000,000)
```

다르게 말하면 `"e"`는 세어진 0의 숫자에다가 `1`을 곱한 결과가 되는 것입니다. 

```js
1e3 = 1 * 1000
1.23e6 = 1.23 * 1000000
```


이제 매우 작은 숫자를 입력해보겠습니다. 1 마이크로초(백만 분의 1초)를 예로 들겠습니다.

```js
let ms = 0.000001;
```

이전처럼 `"e"`가 도와줄 수 있습니다. 0을 명박하게 입력하는 것이 싫은 경우 우리는 이렇게 말할 수 있습니다.

```js
let ms = 1e-6; // six zeroes to the left from 1
```

0을 다음과 같이 센다면 `0.000001`, 6개가 있습니다. 자연스럽게 이것은 `1e-6` 입니다.  

다르게 말하면 `"e"` 다음에 등장하는 음수는 주어진 0의 갯수에다가 1을 나눈 것입니다.

```js
// -3 divides by 1 with 3 zeroes
1e-3 = 1 / 1000 (=0.001)

// -6 divides by 1 with 6 zeroes
1.23e-6 = 1.23 / 1000000 (=0.00000123)
```

### 16진수, 2진수 그리고 8진수 숫자들

[16진수](https://en.wikipedia.org/wiki/Hexadecimal) 숫자들은 자바스크립트에서 색깔을 나타낼 때, character형을 인코드 할 때 그리고 그외 다양한 부분에서 쓰입니다. 자연스럽게 16진수를 `0x` 그리고 그 뒤에 숫자들로 짧게 입력하는 방법이 있습니다.

예시:

```js run
alert( 0xff ); // 255
alert( 0xFF ); // 255 (the same, case doesn't matter)
```

2진수와 8진수 시스템은 거의 쓰이지 않지만 `0b` 과 `0o` 접두사들을 통해 지원합니다.


```js run
let a = 0b11111111; // binary form of 255
let b = 0o377; // octal form of 255

alert( a == b ); // true, the same number 255 at both sides
```

이와 같이 3개의 숫자형 시스템만 지원합니다. 다른 숫자형 시스템에는 `parseInt`(이 챕터에서 나중에 보게 될) 라는 함수를 사용해야 합니다.

## toString(베이스)

`num.toString(base)` 메서드는 주어진 `base` 숫자형 시스템에서 `num`의 문자열 표현으로 반환합니다.

예시:
```js run
let num = 255;

alert( num.toString(16) );  // ff
alert( num.toString(2) );   // 11111111
```

`base`는 `2`에서 `36`까지 다양합니다. default 값은 `10` 입니다.

아래는 이 부분에 대해서 흔히 케이스들입니다.

- **base=16**는 16진수 색상, character형을 인코딩 등에 쓰이고  숫자들은 `0..9` 또는 `A..F`가 될 수 있습니다.
- **base=2**는 대부분 비트 단위의 연산들에 쓰이고 숫자들은 `0` 또는 `1`가 될 수 있습니다.
- **base=36**는 최대이고 숫자들은 `0..9` 또는 `A..Z`가 될 수 있습니다. 모든 라틴 알파벳이 숫자를 상징하기 위해 쓰입니다. 재미있지만 유용한 케이스로 `36`은 긴 숫자 식별자를 짧은 것으로 변경하고 싶을 때 쓰이며 예시로 짧은 url을 만들 때 이용됩니다. 베이스 `36`을 이용하여 숫자 시스템을 간단하게 표현할 수 있습니다.:

    ```js run
    alert( 123456..toString(36) ); // 2n9c
    ```

```warn header="메서드를 불러오기 위한 두 개의 점들"
 `123456..toString(36)`에 있는 두 개의 점들은 오타가 아니라는 점에 유의합니다. 위에 있는 `toString`의 예시처럼 만약에 숫자를 메서드를 불러오고 싶으면 , 숫자 다음에 점 두 개인 `..`를 배치하면 됩니다.

`123456.toString(36)`처럼 한개의 점만 배치하면 이것은 에러일 수 있는데 그 이유는 자바스크립트 문법에서 첫 번째 점 이후 부분은 소수 부분으로 인식하기 때문입니다. 그리고 하나 이상의 점들을 배치하면 자바스크립트는 소수 부분이 비어있다는 것을 알고 메서드로 이동합니다.

또한 이와 같이 `(123456).toString(36)` 입력할 수 있습니다.
```

## 반올림

숫자들과 가장 많이 이용하는 연산자 중 하나는 바로 반올림입니다.

반올림에 관한 내장 함수들이 존재합니다.

`Math.floor`
: 버림: `3.1`은 `3`이 되고 `-1.1`은 `-2`이 됩니다.

`Math.ceil`
: 올림: `3.1`은 `4`이 되고 `-1.1`은 `-1`이 됩니다.

`Math.round`
: 반올림: `3.1`은 `3`이 되고 `3.6`은 `4`이 되며 `-1.1`은 `-1`이 됩니다.

`Math.trunc` (인터넷 익스플로러에서는 지원하지 않는다)
: 반올림을 하지 않고 소수 부분을 제거한다: `3.1`은 `3`이 되고 `-1.1`은 `-1`이 됩니다.

아래에는 각 함수들의 차이점을 요약해 놓은 테이블입니다.

|   | `Math.floor` | `Math.ceil` | `Math.round` | `Math.trunc` |
|---|---------|--------|---------|---------|
|`3.1`|  `3`    |   `4`  |    `3`  |   `3`   |
|`3.6`|  `3`    |   `4`  |    `4`  |   `3`   |
|`-1.1`|  `-2`    |   `-1`  |    `-1`  |   `-1`   |
|`-1.6`|  `-2`    |   `-1`  |    `-2`  |   `-1`   |


이러한 함수들은 숫자의 소수 부분을 다루기 위한 가능한 모든 방법들입니다. 하지만 만약에 소수 부분을 `n-th`의 숫자 형태로 반올림하고 싶은 경우에는 어떻게 해야 할까요?

예를 들어 `1.2345`가 있고 `1.23`처럼 2개의 숫자 형태로 반올림하고 싶은 경우가 있습니다.

이런 방법에는 두가지의 경우가 존재합니다.

1. 곱하고 나누기.

    예를 들어 소수 부분을 2개의 숫자로 반올림하고 싶은 경우 `100`으로 그 숫자를 곱한 후 반올림 함수를 호출 한 뒤 다시 나눕니다.
    ```js run
    let num = 1.23456;

    alert( Math.floor(num * 100) / 100 ); // 1.23456 -> 123.456 -> 123 -> 1.23
    ```

2. [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)라는 메서드는 숫자를 `n`개의 숫자들로 반올림하고 그것의 결과값을 문자열 형태로 반환합니다.

    ```js run
    let num = 12.34;
    alert( num.toFixed(1) ); // "12.3"
    ```

    이것은 `Math.round`와 비슷하게 가장 가까운 값으로 올림을 하거나 버림을 합니다:

    ```js run
    let num = 12.36;
    alert( num.toFixed(1) ); // "12.4"
    ```

    `toFixed`의 결과값은 문자열의 형태라는 것을 유의합니다. 만약 소수 부분이 필요한 것보다 짧은 경우 0들은 뒷 부분에 추가됩니다.

    ```js run
    let num = 12.34;
    alert( num.toFixed(5) ); // "12.34000", added zeroes to make exactly 5 digits
    ```

    이것을 덧셈을 이용하여 `+num.toFixed(5)`와 같이 표시하거나 `Number()`을 호출하여 숫자로 변경할 수 있습니다.

## 부정확한 계산들

내부적으로 숫자는 64 비트 형태인 [IEEE-754](https://en.wikipedia.org/wiki/IEEE_754-2008_revision)으로 표현되어 있어 숫자를 저장하기 위해서 정확히 64 비트가 존재합니다. 그 중 52개는 숫자들을 저장하기 위해 존재하고, 11 비트는 소수 부분을 저장하기 위해 존재하고(정수 숫자들은 0이 있다) 1 비트는 기호를 위해 존재합니다.

만약 숫자가 너무 커서 64-비트 저장소를 넘치는 경우 잠재적으로 무한의 값을 줄 수 있습니다.

```js run
alert( 1e500 ); // Infinity
```

분명하지는 않지만 가끔 일어나는 것은 정밀함의 손실입니다.

아래에 있는 테스트(오류!)를 생각해봅시다.

```js run
alert( 0.1 + 0.2 == 0.3 ); // *!*false*/!*
```

`0.1` 과`0.2`의 합이 `0.3`이라는 것이 맞는지 체크하면 `false`라는 결과값을 얻고 그것은 참입니다.

이상하게 결과값이 `0.3`이 아니면 무엇일까요?

```js run
alert( 0.1 + 0.2 ); // 0.30000000000000004
```

여기에는 잘못된 비교보다 많은 결과가 있습니다. 만약에 온라인 쇼핑몰 사이트를 만든다고 할 때 방문객은 `$0.10` 과 `$0.20` 로 표기되어 있는 상품을 구매창에다가 넣을 것입니다. 총 주문은 `$0.30000000000000004` 로 표시될 것입니다. 이것은 모두를 놀라게 할 것입니다.

왜 이런 현상이 일어날까요?

숫자는 0과 1로 이루어진 비트인 2진수의 형태로 메모리에 저장되어 있습니다. 하지만 소수 숫자 형식에서 간단해 보이는 `0.1`, `0.2` 과 같은 분수는 실제로 이진 형태에서 무한대의 분수입니다.

다르게 말하면 `0.1`은 무엇일까요? `0.1`은 `1/10`와 같이 1을 10으로 나눈 십분의 일입니다. 소수 숫자 형식에서 이러한 숫자들은 쉽게 표현할 수 있습니다. 3분의 1인 `1/3`과 비교해봐라. 3분의 1은 `0.33333(3)`과 무한대의 분수가 됩니다.

그래서 `10`에 의한 나눔은 소수 형식에서 작동이 잘 되도록 보장이 되지만 `3`에 의한 나눔은 그렇지 않습니다. 같은 이유로 이진 숫자 형식에서 `2`에 의한 나눔은  is 작동되도록 보장이 되지만 `1/10`은 무한대의 이진 분수가 됩니다.

이진수 형식를 이용할 경우 *완벽한 0.1* 또는 *완벽한 0.2*를 저장하는 방법은 없으며 이것은 소수에서 3분의 1을 저장할 방법이 없는 것과 마찬가지 입니다.

숫자 형식인 IEEE-754은 가능한 가장 가까운 숫자로 반올림을 하며 이 문제를 해결합니다. 이러한 반올림  규칙은 일반적으로 "작고 정밀한 손실"를 보도록 허락하지 않지만 그것은 존재합니다.

실제로 이것을 볼 수 있습니다.
```js run
alert( 0.1.toFixed(20) ); // 0.10000000000000000555
```

두 숫자를 더하면 "정밀한 손실"이 더해집니다.

그래서 `0.1 + 0.2`은 완벽하게 `0.3`이 되지 않는 것입니다.

```smart header="자바스크립트 뿐만 아님"
다양한 프로그래밍 언어에도 이러한 문제가 발생합니다.

PHP, Java, C, Perl, Ruby는 완벽하게 똑같은 결과를 주는데 그것은 똑같은 숫자 형식를 기반으로 하기 떄문입니다.
```

문제를 해결 할 순 없을까요? 가장 믿을 수 있는 방법은[toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) 라는 메서드의 도움으로 결과를 반올림하는 것입니다. 

```js run
let sum = 0.1 + 0.2;
alert( sum.toFixed(2) ); // 0.30
```

`toFixed` 메서드는 항상 문자열을 반환한다는 것에 유의해야 합니다. `toFixed` 메서드는 항상 소수점 뒤에 2개의 숫자가 있다는 것을 확신합니다. 이것은 만약 온라인 쇼핑몰을 가지고 있고 `$0.30`을 보여줘야 하는 경우에 실제로 편리합니다. 다른 경우들에는 강제로 숫자를 만들어 줄 단항 덧셈을 이용 할 수 있습니다:

```js run
let sum = 0.1 + 0.2;
alert( +sum.toFixed(2) ); // 0.3
```

또한 정수로 만들기 위해 임시적으로 숫자에 100 (혹은 더 큰 숫자)을 곱해 준 다음 계산을 하고 다시 나눠 돌려주는 방법이 있습니다. 그러면 정수로 수학을 하고 있기 때문에 에러는 증가하지만 분수로 결과를 얻습니다. 

```js run
alert( (0.1 * 10 + 0.2 * 10) / 10 ); // 0.3
alert( (0.28 * 100 + 0.14 * 100) / 100); // 0.4200000000000001
```

그래서 곱셈/나눗셈 접근법은 에러를 줄여주지만 완벽하게 없애 주지는 않습니다.

때때로 분수를 피하려고 노력할 수 있습니다. 상점을 다룰 경우 달러 대신 센트로 가격을 책정할 수 있습니다. 하지만 30%의 할인을 적용하면 어떻게 될까요? 실제로는 완벽하게 분수를 피하는 것은 드물게 가능합니다. 필요한 경우에 "꼬리"를 자르는 내림을 하면 됩니다.

````smart header="재미있는 것"
이것을 반올림 해보세요.

```js run
// Hello! I'm a self-increasing number!
alert( 9999999999999999 ); // shows 10000000000000000
```

This suffers from the same issue: a loss of precision. There are 64 bits for the number, 52 of them can be used to store digits, but that's not enough. So the least significant digits disappear.

JavaScript doesn't trigger an error in such events. It does its best to fit the number into the desired format, but unfortunately, this format is not big enough.
````

```smart header="Two zeroes"
Another funny consequence of the internal representation of numbers is the existence of two zeroes: `0` and `-0`.

That's because a sign is represented by a single bit, so every number can be positive or negative, including a zero.

In most cases the distinction is unnoticeable, because operators are suited to treat them as the same.
```



## Tests: isFinite and isNaN

Remember these two special numeric values?

- `Infinity` (and `-Infinity`) is a special numeric value that is greater (less) than anything.
- `NaN` represents an error.

They belong to the type `number`, but are not "normal" numbers, so there are special functions to check for them:


- `isNaN(value)` converts its argument to a number and then tests it for being `NaN`:

    ```js run
    alert( isNaN(NaN) ); // true
    alert( isNaN("str") ); // true
    ```

    But do we need this function? Can't we just use the comparison `=== NaN`? Sorry, but the answer is no. The value `NaN` is unique in that it does not equal anything, including itself:

    ```js run
    alert( NaN === NaN ); // false
    ```

- `isFinite(value)` converts its argument to a number and returns `true` if it's a regular number, not `NaN/Infinity/-Infinity`:

    ```js run
    alert( isFinite("15") ); // true
    alert( isFinite("str") ); // false, because a special value: NaN
    alert( isFinite(Infinity) ); // false, because a special value: Infinity
    ```

Sometimes `isFinite` is used to validate whether a string value is a regular number:


```js run
let num = +prompt("Enter a number", '');

// will be true unless you enter Infinity, -Infinity or not a number
alert( isFinite(num) );
```

Please note that an empty or a space-only string is treated as `0` in all numeric functions including `isFinite`.  

```smart header="Compare with `Object.is`"

There is a special built-in method [Object.is](mdn:js/Object/is) that compares values like `===`, but is more reliable for two edge cases:

1. It works with `NaN`: `Object.is(NaN, NaN) === true`, that's a good thing.
2. Values `0` and `-0` are different: `Object.is(0, -0) === false`, technically that's true, because internally the number has a sign bit that may be different even if all other bits are zeroes.

In all other cases, `Object.is(a, b)` is the same as `a === b`.

This way of comparison is often used in JavaScript specification. When an internal algorithm needs to compare two values for being exactly the same, it uses `Object.is` (internally called [SameValue](https://tc39.github.io/ecma262/#sec-samevalue)).
```


## parseInt and parseFloat

Numeric conversion using a plus `+` or `Number()` is strict. If a value is not exactly a number, it fails:

```js run
alert( +"100px" ); // NaN
```

The sole exception is spaces at the beginning or at the end of the string, as they are ignored.

But in real life we often have values in units, like `"100px"` or `"12pt"` in CSS. Also in many countries the currency symbol goes after the amount, so we have `"19€"` and would like to extract a numeric value out of that.

That's what `parseInt` and `parseFloat` are for.

They "read" a number from a string until they can't. In case of an error, the gathered number is returned. The function `parseInt` returns an integer, whilst `parseFloat` will return a floating-point number:

```js run
alert( parseInt('100px') ); // 100
alert( parseFloat('12.5em') ); // 12.5

alert( parseInt('12.3') ); // 12, only the integer part is returned
alert( parseFloat('12.3.4') ); // 12.3, the second point stops the reading
```

There are situations when `parseInt/parseFloat` will return `NaN`. It happens when no digits could be read:

```js run
alert( parseInt('a123') ); // NaN, the first symbol stops the process
```

````smart header="The second argument of `parseInt(str, radix)`"
The `parseInt()` function has an optional second parameter. It specifies the base of the numeral system, so `parseInt` can also parse strings of hex numbers, binary numbers and so on:

```js run
alert( parseInt('0xff', 16) ); // 255
alert( parseInt('ff', 16) ); // 255, without 0x also works

alert( parseInt('2n9c', 36) ); // 123456
```
````

## Other math functions

JavaScript has a built-in [Math](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math) object which contains a small library of mathematical functions and constants.

A few examples:

`Math.random()`
: Returns a random number from 0 to 1 (not including 1)

    ```js run
    alert( Math.random() ); // 0.1234567894322
    alert( Math.random() ); // 0.5435252343232
    alert( Math.random() ); // ... (any random numbers)
    ```

`Math.max(a, b, c...)` / `Math.min(a, b, c...)`
: Returns the greatest/smallest from the arbitrary number of arguments.

    ```js run
    alert( Math.max(3, 5, -10, 0, 1) ); // 5
    alert( Math.min(1, 2) ); // 1
    ```

`Math.pow(n, power)`
: Returns `n` raised the given power

    ```js run
    alert( Math.pow(2, 10) ); // 2 in power 10 = 1024
    ```

There are more functions and constants in `Math` object, including trigonometry, which you can find in the [docs for the Math](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math) object.

## Summary

To write big numbers:

- Append `"e"` with the zeroes count to the number. Like: `123e6` is `123` with 6 zeroes.
- A negative number after `"e"` causes the number to be divided by 1 with given zeroes. That's for one-millionth or such.

For different numeral systems:

- Can write numbers directly in hex (`0x`), octal (`0o`) and binary (`0b`) systems
- `parseInt(str, base)` parses an integer from any numeral system with base: `2 ≤ base ≤ 36`.
- `num.toString(base)` converts a number to a string in the numeral system with the given `base`.

For converting values like `12pt` and `100px` to a number:

- Use `parseInt/parseFloat` for the "soft" conversion, which reads a number from a string and then returns the value they could read before the error.

For fractions:

- Round using `Math.floor`, `Math.ceil`, `Math.trunc`, `Math.round` or `num.toFixed(precision)`.
- Make sure to remember there's a loss of precision when working with fractions.

More mathematical functions:

- See the [Math](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math) object when you need them. The library is very small, but can cover basic needs.
