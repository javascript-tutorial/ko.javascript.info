# 논리 연산자

자바스크립트에는 세 가지 논리 연산자가 있습니다: `||`(OR), `&&`(AND), `!`(NOT).

"논리적"이라고 부르지만 모든 유형의 값에 적용 할 수 있습니다.(논리 타입뿐만 아니라) 그 결과는 어떤 타입이든 가능합니다.

세부 사항을 확인합시다.

## || (OR)

"OR"연산자는 두 개의 수직선 기호로 표시됩니다.

```js
result = a || b;
```

클래식 프로그래밍에서 "논리적 OR"은 불리언 값만 조작하기 위한 것이었습니다. 인수중 하나라도 `true`이면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

자바스크립트에서 연산자는 조금 더 까다롭고 강력합니다. 하지만 먼저 불리언 값에 어떤 일이 일어나는지 살펴 보겠습니다.

가능한 논리적 조합에는 네 가지가 있습니다.

```js run
alert( true || true );   // true
alert( false || true );  // true
alert( true || false );  // true
alert( false || false ); // false
```

보시다시피 결과는 두 피연산자가 모두 `false`인 경우를 제외하고 항상 `true`입니다.

피연산자가 논리타입이 아니면 평가를 위해 논리타입으로 변환됩니다.

예를 들어, 숫자 `1`은 `true`로 취급되고 숫자 `0`은 `false`로 취급됩니다. 
 
```js run
if (1 || 0) { // works just like if( true || false )
  alert( 'truthy!' );
}
```

대부분의 경우, OR `||`는 주어진 조건 중 어떠한 것이 `true`인지 테스트하기 위해 `if`문에서 사용합니다.

예:

```js run
let hour = 9;

*!*
if (hour < 10 || hour > 18) {
*/!*
  alert( 'The office is closed.' );
}
```

더 많은 조건을 넘길 수 있습니다.

```js run
let hour = 12;
let isWeekend = true;

if (hour < 10 || hour > 18 || isWeekend) {
  alert( 'The office is closed.' ); // it is the weekend
}
```

## OR은 첫 번째로 참인 값을 찾습니다.

위에서 설명한 로직(논리)은 다소 고전적입니다. 이제 자바스크립트의 "추가"기능을 소개하겠습니다.

확장 알고리즘은 다음과 같이 작동합니다.

OR 값이 여러 개있는 경우:

```js
result = value1 || value2 || value3;
```

OR`||`연산자는 다음을 수행합니다.

- 피연산자(operand)를 왼쪽에서 오른쪽으로 수치를 구합니다.
- 각 피연산자에 대해 논리 타입으로 변환합니다. 결과가 `true`이면 수치연산을 멈추고 해당 피연산자의 원래 값(변환 전)을 반환합니다.
- 모든 피연산자의 수치를 구한 경우(즉 모두 `거짓`인 경우) 마지막 피연산자를 반환합니다.

값은 변환없이 원래 형식으로 반환됩니다.

바꾸어 말하면, OR`"||"`의 연속은 첫 번째 참인 값을 반환하거나 참인 값이 없으면 마지막 값을 반환합니다. 

예:

```js run
alert( 1 || 0 ); // 1 (1 is truthy)
alert( true || 'no matter what' ); // (true is truthy)

alert( null || 1 ); // 1 (1 is the first truthy value)
alert( null || 0 || 1 ); // 1 (the first truthy value)
alert( undefined || null || 0 ); // 0 (all falsy, returns the last value)
```

위의 예시들은 "순수하고 전형적인 부울-전용 OR"과 비교되는 흥미로운 사용법을 유도합니다.

1. **변수 또는 표현식 목록에서 첫 번째 truthy 값 얻기.**

    데이터를 가졌거나 `null/undefined`일 수 있는 여러 변수가 있다고 상상해봅시다. 데이터를 가진 첫 번째 변수를 어떻게 찾을 수 있을까요?

    OR `||`을 사용할 수 있습니다:

    ```js run
    let currentUser = null;
    let defaultUser = "John";

    *!*
    let name = currentUser || defaultUser || "unnamed";
    */!*

    alert( name ); // selects "John" – the first truthy value
    ```

    `currentUser`와 `defaultUser` 둘 다 거짓 같은 값(falsy)이면, `"unnamed"`가 결과가 됩니다.

2. **단락 회로 평가.(Short-circuit evaluation)**

    피연산자는 값뿐만 아니라 임의의 표현식이 될 수 있습니다. OR`||`는 왼쪽에서 오른쪽으로 평가 및 테스트합니다. 참인 값에 도달하면 평가가 중지되고 그 값이 리턴됩니다. 이 프로세스는 가능한 한 짧게 왼쪽에서 오른쪽으로 진행되기 때문에 "단락 회로 평가"라고합니다.

    "단락 회로 평가"는 두 번째 인수로 주어진 표현식이 변수 할당과 같은 부수적인 효과를 가질 때 분명하게 나타납니다.

    아래 예제에서 `x`는 할당되지 않습니다.:

    ```js run no-beautify
    let x;

    *!*true*/!* || (x = 1);

    alert(x); // undefined, because (x = 1) not evaluated
    ```

    대신에 첫 번째 인수가 `false`인 경우, `||`는 두 번째 인수를 평가하여 할당을 수행합니다.

    ```js run no-beautify
    let x;

    *!*false*/!* || (x = 1);

    alert(x); // 1
    ```

    할당은 간단한 경우입니다. 다른 부수적인 효과도 발생할 수 있습니다.

    보시는 것과 같이, 이러한 사례들은 "`if`를 하는 더 짧은 방법"입니다. 첫 번째 피연산자는 부울로 변환됩니다. 거짓이면 두 번째 것이 평가됩니다.

    대부분의 경우, 코드를 이해하기 쉽도록 "보통" `if`를 사용하는 것이 더 좋지만, 때때로 편리할 수 ​​있습니다.

## && (AND)

AND 연산자는 두 개의 앰퍼샌드`&&`로 표현됩니다.

```js
result = a && b;
```

클래식 프로그래밍에서 AND는 두 피연산자가 모두 진실이면 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다.

```js run
alert( true && true );   // true
alert( false && true );  // false
alert( true && false );  // false
alert( false && false ); // false
```

`if` 예제 :

```js run
let hour = 12;
let minute = 30;

if (hour == 12 && minute == 30) {
  alert( 'The time is 12:30' );
}
```

OR과 마찬가지로 모든 값이 AND의 피연산자로 할당됩니다.

```js run
if (1 && 0) { // evaluated as true && false
  alert( "won't work, because the result is falsy" );
}
```


## AND는 첫 번째 거짓 같은 값(falsy) 값을 찾습니다.

AND 연산자의 피연산자가 여러 개있는 경우 :

```js
result = value1 && value2 && value3;
```

AND `&&`연산자는 다음을 수행합니다.

- 피연산자를 왼쪽에서 오른쪽으로 평가합니다.
- 각 피연산자를 논리 타입(boolean)으로 변환합니다. 결과가 `false`이면, 평가를 멈추고 그 피연산자의 원래 값을 반환합니다.
- 모든 피연산자가 평가 된 경우 (즉, 모든 값이 참) 마지막 피연산자를 반환합니다.

즉, AND는 첫 번째 거짓 값을 반환하거나 거짓 값을 찾지 못하면 마지막 값을 반환합니다.

위의 규칙은 OR과 유사합니다. 차이점은 AND가 첫 번째 *거짓* 값을 반환하는 반면 OR은 첫 번째 *참* 값을 반환한다는 것입니다.

예:

```js run
// if the first operand is truthy,
// AND returns the second operand:
alert( 1 && 0 ); // 0
alert( 1 && 5 ); // 5

// if the first operand is falsy,
// AND returns it. The second operand is ignored
alert( null && 5 ); // null
alert( 0 && "no matter what" ); // 0
```

또한 여러 값을 연속적으로 전달할 수 있습니다. 첫 번째 거짓 값이 어떻게 반환되는지 봅니다.

```js run
alert( 1 && 2 && null && 3 ); // null
```

모든 값이 참 이면 마지막 값이 반환됩니다.

```js run
alert( 1 && 2 && 3 ); // 3, the last one
```

````smart header="AND `&&`의 우선 순위가 OR `||`보다 높습니다."
AND `&&`연산자의 우선 순위는 OR`||`보다 높습니다.

그래서 코드`a && b || c && d`는 본질적으로 `&&`표현식이 괄호 안에있는 것과 같습니다.: `(a && b) || (c && d)`.
````

OR과 마찬가지로 AND `&&` 연산자가 때때로 if를 대체 할 수 있습니다.

예:

```js run
let x = 1;

(x > 0) && alert( 'Greater than zero!' );
```

`&&`의 오른쪽 부분에 있는 행위는 평가가 도달 한 경우에만 실행됩니다. 즉, `(x> 0)`이 참인 경우에만.

그래서 기본적으로 다음과 같은 유사점을 가지고 있습니다.

```js run
let x = 1;

if (x > 0) {
  alert( 'Greater than zero!' );
}
```

`&&`가 있는 변형된 코드가 더 짧게 나타납니다. 그러나 `if`는 더 명백하고 좀 더 읽기 쉽습니다.

그래서 모든 표현식을 그 것의 목적에 맞게 사용할 것을 권장합니다. if를 원하면`if`를 사용하고 AND를 원하면`&&`를 사용합시다.

## ! (NOT 연산자)

논리적 NOT 연산자는 느낌표 `!`로 표시됩니다.

구문(syntax)은 매우 간단합니다.

```js
result = !value;
```

연산자는 단일 인수를 받아들이고 다음을 수행합니다.

1. 피연산자를 논리 타입으로 변환합니다.:`true / false`.
2. 반대의 값을 반환합니다.

예:

```js run
alert( !true ); // false
alert( !0 ); // true
```

값을 논리 타입으로 변환하는데 double NOT`!!`이 종종 사용됩니다.:

```js run
alert( !!"non-empty string" ); // true
alert( !!null ); // false
```

즉, 첫 번째 NOT 연산자는 값을 논리 타입으로 변환하면서 반대되는 값을 반환하고, 두 번째 NOT 연산자는 다시 반대되는 값을 반환합니다. 결국 단순한 논리 타입 변환을 가집니다.

같은 일을 하는 좀 더 장황한 방법, 즉 내장 된 `Boolean` 함수가 있습니다.:

```js run
alert( Boolean("non-empty string") ); // true
alert( Boolean(null) ); // false
```

`NOT`의 우선 순위는 모든 논리 연산자 중에서 가장 높기 때문에 항상 `&&` 또는 `||` 앞에 먼저 실행됩니다.
