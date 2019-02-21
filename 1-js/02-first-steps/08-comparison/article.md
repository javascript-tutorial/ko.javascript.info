# 비교

우리는 수학에서 많은 비교 연산자를 배웁니다.

- 보다 큼/작음: <code>a &gt; b</code>, <code>a &lt; b</code>.
- 보다 크거나/작거나 같음: <code>a &gt;= b</code>, <code>a &lt;= b</code>.
- 같음: `a == b` (2개의 `=`기호에 유의합니다. 하나의 기호 `a ​​= b`는 할당을 의미합니다).
- 같지 않음. 수학에서 표기법은 다음과 같습니다. <code>&ne;</code>, 자바스크립트에서는 느낌표가 붙은 할당연산자로 작성됩니다. <code>a != b</code>.

## 불리언은 결과입니다.

다른 모든 연산자와 마찬가지로 비교는 값을 반환합니다. 이 경우 값은 불리언 값입니다.

- `true` -- "예", "올바른"또는 "진실"을 의미합니다.
- `false` -- "아니오", "잘못"또는 "진실이 아님"을 의미합니다.

예시:

```js run
alert( 2 > 1 );  // true (correct)
alert( 2 == 1 ); // false (wrong)
alert( 2 != 1 ); // true (correct)
```

비교 결과는 모든 값과 마찬가지로 변수에 할당 할 수 있습니다.

```js run
let result = 5 > 4; // assign the result of the comparison
alert( result ); // true
```

## 문자열 비교

문자열이 다른 문자열보다 큰지 확인하기 위해 자바스크립트는 소위 "사전"(dictionary)또는 "사전 식"(lexicographical)순서를 사용합니다.

즉, 문자열은 문자별로 비교됩니다.

예시:

```js run
alert( 'Z' > 'A' ); // true
alert( 'Glow' > 'Glee' ); // true
alert( 'Bee' > 'Be' ); // true
```

두 문자열을 비교하는 알고리즘은 간단합니다.

1. 두 문자열의 첫 문자를 비교하십시오.
2. 첫번재 문자열의 첫글자가 다른문자열의 첫글자보다 크면(작으면), 첫번째 문자열이 두번째 것보다 큽니다(작습니다.). 끝났습니다. 
3. 그렇지 않으면 두 문자열의 첫 번째 문자가 같은 경우 두 번째 문자를 같은 방식으로 비교합니다.
4. 각 문자열이 끝날 때까지 반복합니다.
5. 두 문자열이 같은 길이로 끝나면 두 문자열은 동일합니다. 그렇지 않으면 긴 문자열이 더 큽니다.

In the examples above, the comparison `'Z' > 'A'` gets to a result at the first step while the strings `"Glow"` and `"Glee"` are compared character-by-character:
위의 예제에서 문자열 `"Glow"` 와 `"Glee"`가 문자별로 비교되는 동안 비교-`'Z' > 'A'`는 첫 단계에서 결과에 도달합니다.

1. `G`는`G`와 같습니다.
2. `l`은 `l`과 동일합니다.
3. `o`는`e`보다 큽니다. 여기서 멈춥니다. 첫 번째 문자열이 더 큽니다.

```smart header="진짜 사전 순서는 아니지만 유니코드 순서입니다."
위에 주어진 비교 알고리즘은 사전이나 전화번호부에서 사용된 알고리즘과 거의 동일하지만 정확하게 동일하지는 않습니다.

예를 들어, 대소문자가 중요합니다. 대문자 `"A"`는 소문자 `"a"`와 같지 않습니다. 어느 것이 더 큽니까? 소문자 `"a"`입니다. 왜? 소문자는 "자바스크립트가 사용하는 내부 인코딩 테이블"(유니 코드)에서 더 큰 인덱스를 갖기 때문입니다. <info:string> 주제에서 이에 대한 자세한 내용과 결과를 살펴 보겠습니다.

```

## 다른 타입간의 비교

When comparing values of different types, JavaScript converts the values to numbers.
다른 유형의 값을 비교할 때 자바스크립트는 값을 숫자로 변환합니다.

예시:

```js run
alert( '2' > 1 ); // true, string '2' becomes a number 2
alert( '01' == 1 ); // true, string '01' becomes a number 1
```

불리언 값의 경우 `true`는 `1`이되고 `false`는 `0`이됩니다.

예시:

```js run
alert( true == 1 ); // true
alert( false == 0 ); // true
```

````smart header="재미있는 결과"
동시에 다음과 같은 일이 가능합니다:

- 두 값이 같습니다.
- 그 중 하나는 불리언으로 'true'이고 다른 하나는 불리언으로 'false'입니다.

예시:

```js run
let a = 0;
alert( Boolean(a) ); // false

let b = "0";
alert( Boolean(b) ); // true

alert(a == b); // true!
```

자바스크립트의 관점에서 보았을 때, 이 결과는 매우 정상입니다. 같음 비교`==`는 숫자 변환(`"0"`을 `0`으로)을 사용하여 값을 변환하고, 반면 명시적인 '불리언'변환은 그 밖의 규칙을 사용합니다.
````

## 엄격한 같음 비교

일반적인 같음 비교`==`는 문제가 있습니다. 그것은 `0`과 `false`를 구별 할 수 없습니다.

```js run
alert( 0 == false ); // true
```

빈 문자열에서도 같은 일이 발생합니다.

```js run
alert( '' == false ); // true
```

This happens because operands of different types are converted to numbers by the equality operator `==`. An empty string, just like `false`, becomes a zero.

What to do if we'd like to differentiate `0` from `false`?

**A strict equality operator `===` checks the equality without type conversion.**

In other words, if `a` and `b` are of different types, then `a === b` immediately returns `false` without an attempt to convert them.

Let's try it:

```js run
alert( 0 === false ); // false, because the types are different
```

There is also a "strict non-equality" operator `!==` analogous to `!=`.

The strict equality operator is a bit longer to write, but makes it obvious what's going on and leaves less room for errors.

## Comparison with null and undefined

Let's see more edge cases.

There's a non-intuitive behavior when `null` or `undefined` are compared to other values.


For a strict equality check `===`
: These values are different, because each of them is a different type.

    ```js run
    alert( null === undefined ); // false
    ```

For a non-strict check `==`
: There's a special rule. These two are a "sweet couple": they equal each other (in the sense of `==`), but not any other value.

    ```js run
    alert( null == undefined ); // true
    ```

For maths and other comparisons `< > <= >=`
: `null/undefined` are converted to numbers: `null` becomes `0`, while `undefined` becomes `NaN`.

Now let's see some funny things that happen when we apply these rules. And, what's more important, how to not fall into a trap with them.

### Strange result: null vs 0

Let's compare `null` with a zero:

```js run
alert( null > 0 );  // (1) false
alert( null == 0 ); // (2) false
alert( null >= 0 ); // (3) *!*true*/!*
```

Mathematically, that's strange. The last result states that "`null` is greater than or equal to zero", so one of the comparisons above it must be correct, but they are both false.

The reason is that an equality check `==` and comparisons `> < >= <=` work differently. Comparisons convert `null` to a number, treating it as `0`. That's why (3) `null >= 0` is true and (1) `null > 0` is false.

On the other hand, the equality check `==` for `undefined` and `null` is defined such that, without any conversions, they equal each other and don't equal anything else. That's why (2) `null == 0` is false.

### An incomparable undefined

The value `undefined` shouldn't be compared to other values:

```js run
alert( undefined > 0 ); // false (1)
alert( undefined < 0 ); // false (2)
alert( undefined == 0 ); // false (3)
```

Why does it dislike zero so much? Always false!

We get these results because:

- Comparisons `(1)` and `(2)` return `false` because `undefined` gets converted to `NaN` and `NaN` is a special numeric value which returns `false` for all comparisons.
- The equality check `(3)` returns `false` because `undefined` only equals `null` and no other value.

### Evade problems

Why did we go over these examples? Should we remember these peculiarities all the time? Well, not really. Actually, these tricky things will gradually become familiar over time, but there's a solid way to evade problems with them:

Just treat any comparison with `undefined/null` except the strict equality `===` with exceptional care.

Don't use comparisons `>= > < <=` with a variable which may be `null/undefined`, unless you're really sure of what you're doing. If a variable can have these values, check for them separately.

## Summary

- Comparison operators return a boolean value.
- Strings are compared letter-by-letter in the "dictionary" order.
- When values of different types are compared, they get converted to numbers (with the exclusion of a strict equality check).
- The values `null` and `undefined` equal `==` each other and do not equal any other value.
- Be careful when using comparisons like `>` or `<` with variables that can occasionally be `null/undefined`. Checking for `null/undefined` separately is a good idea.
