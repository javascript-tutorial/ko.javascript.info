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
 `123456..toString(36)`에 있는 두 개의 점들은 오타가 아니라는 점에 유의하자. 위에 있는 `toString`의 예시처럼 만약에 숫자를 메서드를 불러오고 싶으면 , 숫자 다음에 점 두 개인 `..`를 배치하면 된다.

`123456.toString(36)`처럼 한개의 점만 배치하면 이것은 에러일 수 있는데 그 이유는 자바스크립트 문법에서 첫 번째 점 이후 부분은 소수 부분으로 인식하기 때문이다. 그리고 하나 이상의 점들을 배치하면 자바스크립트는 소수 부분이 비어있다는 것을 알고 메서드로 이동한다.

또한 이와 같이 `(123456).toString(36)` 입력할 수 있다.
```

## 반올림

숫자들과 가장 많이 이용하는 연산자 중 하나는 바로 반올림이다.

반올림에 관한 내장 함수들이 존재한다.

`Math.floor`
: 버림: `3.1`은 `3`이 되고 `-1.1`은 `-2`이 된다.

`Math.ceil`
: 올림: `3.1`은 `4`이 되고 `-1.1`은 `-1`이 된다.

`Math.round`
: 반올림: `3.1`은 `3`이 되고 `3.6`은 `4`이 되며 `-1.1`은 `-1`이 된다.

`Math.trunc` (인터넷 익스플로러에서는 지원하지 않는다)
: 반올림을 하지 않고 소수 부분을 제거한다: `3.1`은 `3`이 되고 `-1.1`은 `-1`이 된다.

아래에는 각 함수들의 차이점을 요약해 놓은 테이블이다.

|   | `Math.floor` | `Math.ceil` | `Math.round` | `Math.trunc` |
|---|---------|--------|---------|---------|
|`3.1`|  `3`    |   `4`  |    `3`  |   `3`   |
|`3.6`|  `3`    |   `4`  |    `4`  |   `3`   |
|`-1.1`|  `-2`    |   `-1`  |    `-1`  |   `-1`   |
|`-1.6`|  `-2`    |   `-1`  |    `-2`  |   `-1`   |


이러한 함수들은 숫자의 소수 부분을 다루기 위한 가능한 모든 방법들이다. 하지만 만약에 소수 부분을 `n-th`의 숫자 형태로 반올림하고 싶은 경우에는 어떻게 해야 할까?

예를 들어 `1.2345`가 있고 `1.23`처럼 2개의 숫자 형태로 반올림하고 싶은 경우가 있다.

이런 방법에는 두가지의 경우가 존재한다.

1. 곱하고 나누기.

    예를 들어 소수 부분을 2개의 숫자로 반올림하고 싶은 경우 `100`으로 그 숫자를 곱한 후 반올림 함수를 호출 한 뒤 다시 나눈다.
    ```js run
    let num = 1.23456;

    alert( Math.floor(num * 100) / 100 ); // 1.23456 -> 123.456 -> 123 -> 1.23
    ```

2. [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)라는 메서드는 숫자를 `n`개의 숫자들로 반올림하고 그것의 결과값을 문자열 형태로 반환한다.

    ```js run
    let num = 12.34;
    alert( num.toFixed(1) ); // "12.3"
    ```

    이것은 `Math.round`와 비슷하게 가장 가까운 값으로 올림을 하거나 버림을 한다:

    ```js run
    let num = 12.36;
    alert( num.toFixed(1) ); // "12.4"
    ```

    `toFixed`의 결과값은 문자열의 형태라는 것을 유의하자. 만약 소수 부분이 필요한 것보다 짧은 경우 0들은 뒷 부분에 추가된다.

    ```js run
    let num = 12.34;
    alert( num.toFixed(5) ); // "12.34000", added zeroes to make exactly 5 digits
    ```

    이것을 덧셈을 이용하여 `+num.toFixed(5)`와 같이 표시하거나 `Number()`을 호출하여 숫자로 변경할 수 있다.

## 부정확한 계산들

내부적으로 숫자는 64 비트 형태인 [IEEE-754](https://en.wikipedia.org/wiki/IEEE_754-2008_revision)으로 표현되어 있어 숫자를 저장하기 위해서 정확히 64 비트가 존재한다. 그 중 52개는 숫자들을 저장하기 위해 존재하고, 11 비트는 소수 부분을 저장하기 위해 존재하고(정수 숫자들은 0이 있다) 1 비트는 기호를 위해 존재한다.

만약 숫자가 너무 커서 64-비트 저장소를 넘치는 경우 잠재적으로 무한의 값을 줄 수 있다.

```js run
alert( 1e500 ); // Infinity
```

분명하지는 않지만 가끔 일어나는 것은 정밀함의 손실이다.

아래에 있는 테스트(오류!)를 생각해보자.

```js run
alert( 0.1 + 0.2 == 0.3 ); // *!*false*/!*
```

`0.1` 과`0.2`의 합이 `0.3`이라는 것이 맞는지 체크하면 `false`라는 결과값을 얻고 그것은 참이다.

이상하게 결과값이 `0.3`이 아니면 무엇일까?

```js run
alert( 0.1 + 0.2 ); // 0.30000000000000004
```

Ouch! There are more consequences than an incorrect comparison here. Imagine you're making an e-shopping site and the visitor puts `$0.10` and `$0.20` goods into their chart. The order total will be `$0.30000000000000004`. That would surprise anyone.

But why does this happen?

A number is stored in memory in its binary form, a sequence of bits - ones and zeroes. But fractions like `0.1`, `0.2` that look simple in the decimal numeric system are actually unending fractions in their binary form.

In other words, what is `0.1`? It is one divided by ten `1/10`, one-tenth. In decimal numeral system such numbers are easily representable. Compare it to one-third: `1/3`. It becomes an endless fraction `0.33333(3)`.

So, division by powers `10` is guaranteed to work well in the decimal system, but division by `3` is not. For the same reason, in the binary numeral system, the division by powers of `2` is guaranteed to work, but `1/10` becomes an endless binary fraction.

There's just no way to store *exactly 0.1* or *exactly 0.2* using the binary system, just like there is no way to store one-third as a decimal fraction.

The numeric format IEEE-754 solves this by rounding to the nearest possible number. These rounding rules normally don't allow us to see that "tiny precision loss", so the number shows up as `0.3`. But beware, the loss still exists.

We can see this in action:
```js run
alert( 0.1.toFixed(20) ); // 0.10000000000000000555
```

And when we sum two numbers, their "precision losses" add up.

That's why `0.1 + 0.2` is not exactly `0.3`.

```smart header="Not only JavaScript"
The same issue exists in many other programming languages.

PHP, Java, C, Perl, Ruby give exactly the same result, because they are based on the same numeric format.
```

Can we work around the problem? Sure, the most reliable method is to round the result with the help of a method [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed):

```js run
let sum = 0.1 + 0.2;
alert( sum.toFixed(2) ); // 0.30
```

Please note that `toFixed` always returns a string. It ensures that it has 2 digits after the decimal point. That's actually convenient if we have an e-shopping and need to show `$0.30`. For other cases, we can use the unary plus to coerce it into a number:

```js run
let sum = 0.1 + 0.2;
alert( +sum.toFixed(2) ); // 0.3
```

We also can temporarily multiply the numbers by 100 (or a bigger number) to turn them into integers, do the maths, and then divide back. Then, as we're doing maths with integers, the error somewhat decreases, but we still get it on division:

```js run
alert( (0.1 * 10 + 0.2 * 10) / 10 ); // 0.3
alert( (0.28 * 100 + 0.14 * 100) / 100); // 0.4200000000000001
```

So, multiply/divide approach reduces the error, but doesn't remove it totally.

Sometimes we could try to evade fractions at all. Like if we're dealing with a shop, then we can store prices in cents instead of dollars. But what if we apply a discount of 30%? In practice, totally evading fractions is rarely possible. Just round them to cut "tails" when needed.

````smart header="The funny thing"
Try running this:

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
