# BigInt

[recent caniuse="bigint"]

`BigInt`는 길이의 제약 없이 정수를 다룰 수 있게 해주는 숫자형입니다.

정수 리터럴 끝에 `n`을 붙이거나 함수 `BigInt`를 호출하면 문자열이나 숫자를 가지고 `BigInt` 타입의 값을 만들 수 있습니다. 

```js
const bigint = 1234567890123456789012345678901234567890n;

const sameBigint = BigInt("1234567890123456789012345678901234567890");

const bigintFromNumber = BigInt(10); // 10n과 동일합니다.
```

## 수학 연산자

`BigInt`는 대개 일반 숫자와 큰 차이 없이 사용할 수 있습니다.

```js run
alert(1n + 2n); // 3

alert(5n / 2n); // 2
```

위 예시에서 나눗셈 연산 `5/2`의 결과엔 소수부가 없다는 점에 주의하시기 바랍니다. `BigInt`형 값을 대상으로 한 연산은 `BigInt`형 값을 반환합니다.

`BigInt`형 값과 일반 숫자를 섞어서 사용할 순 없습니다.

```js run
alert(1n + 2); // Error: Cannot mix BigInt and other types
```

일반 숫자와 섞어서 써야 하는 상황이라면 `BigInt()`나 `Number()`를 사용해 명시적으로 형 변환을 해주면 됩니다.

```js run
let bigint = 1n;
let number = 2;

// 숫자를 bigint로
alert(bigint + BigInt(number)); // 3

// bigint를 숫자로
alert(Number(bigint) + number); // 3
```

형 변환과 관련된 연산은 항상 조용히 동작합니다. 절대 에러를 발생시키지 않죠. 그런데 bigint가 너무 커서 숫자형에서 허용하는 자릿수를 넘으면 나머지 비트는 자동으로 잘려 나갑니다. 이런 점을 염두하고 형 변환을 해야 합니다.

````smart header="단항 덧셈 연산자는 bigint에 사용할 수 없습니다."
단항 덧셈 연산자 `+value`를 사용하면 `value`를 손쉽게 숫자형으로 바꿀 수 있습니다.

그런데 혼란을 방지하기 위해 bigint를 대상으로 하는 연산에선 단항 덧셈 연산자를 지원하지 않습니다.
```js run
let bigint = 1n;

alert( +bigint ); // 에러
```
bigint를 숫자형으로 바꿀 때는 `Number()`를 사용해야 합니다.
````

## 비교 연산자

비교 연산자 `<`, `>`는 bigint와 일반 숫자 모두에 사용할 수 있습니다.

```js run
alert( 2n > 1n ); // true

alert( 2n > 1 ); // true
```

그런데 비교하려는 대상이 다른 타입에 속하면 `==`를 사용할 때는 같을지 모르지만 `===`를 사용할 때는 다르다고 판단됩니다.

```js run
alert( 1 == 1n ); // true

alert( 1 === 1n ); // false
```

## 논리 연산

bigint는 `if` 안이나 다른 논리 연산자와 함께 사용할 때 일반 숫자와 동일하게 행동합니다.

`if`안에서 `0n`은 falsy이고 다른 값들은 truthy로 평가되죠.

```js run
if (0n) {
  // 절대 실행되지 않습니다.
}
```

`||`, `&&` 등의 논리 연산자를 bigint에 적용할 때도 일반 숫자와 유사하게 동작합니다.

```js run
alert( 1n || 2 ); // 1 (1n은 truthy로 판단됩니다.)

alert( 0n || 2 ); // 2 (0n은 falsy로 판단됩니다.)
```

## 폴리필

bigint 폴리필을 만드는 것은 꽤 까다롭습니다. `+`, `-`를 비롯한 다양한 연산자들이 bigint와 일반 숫자에서 다른 결과를 보이기 때문입니다.

bigint끼리 나누면 항상 bigint를 반환한다는 것을 앞서 말씀드린 바 있습니다.

동일한 결과가 나오게 하려면 폴리필에서 기존 코드를 분석하고 내장 연산자 모두를 관련 함수로 대체해 줄 수 있어야 합니다. 그런데 이렇게 하려면 품이 많이 들고 성능 이슈도 생길 수 있습니다.

따라서 아직까진 제대로 된 bigint 폴리필이 나오지 않은 상황입니다. 

잘 알려진 폴리필은 없지만 [JSBI](https://github.com/GoogleChromeLabs/jsbi) 라이브러리의 개발자들이 대안을 제시하긴 했습니다.

이 라이브러리는 자체적으로 만든 방법을 사용해 큰 숫자를 구현합니다. 순수 bigint대신 라이브러리에서 만든 숫자를 사용하는 게 대안이 될 수 있습니다.

| 연산 | 네이티브 `BigInt` | JSBI |
|-----------|-----------------|------|
| 일반 숫자를 사용해 bigint만들기 | `a = BigInt(789)` | `a = JSBI.BigInt(789)` |
| 덧셈 | `c = a + b` | `c = JSBI.add(a, b)` |
| 뺄셈	| `c = a - b` | `c = JSBI.subtract(a, b)` |
| ... | ... | ... |

이렇게 JSBI를 사용해 숫자를 만든 다음 바벨 플러그인에 있는 폴리필을 사용해 JSBI 호출을 네이티브 bigint로 변환하면 원하는 브라우저에서 연산을 수행할 수 있습니다.

In other words, this approach suggests that we write code in JSBI instead of native bigints. But JSBI works with numbers as with bigints internally, emulates them closely following the specification, so the code will be "bigint-ready".

We can use such JSBI code "as is" for engines that don't support bigints and for those that do support - the polyfill will convert the calls to native bigints.

## 참고 자료

- [MDN docs on BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
- [Specification](https://tc39.es/ecma262/#sec-bigint-objects).
