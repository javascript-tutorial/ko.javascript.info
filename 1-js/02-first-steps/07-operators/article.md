# 연산자(Operators)

우리는 학교에서 많은 연산자를 배웁니다. 그것들은 덧셈 `+`, 곱셈 `*`, 뺄셈 `-`과 같은 것들입니다.

이 장에서는 학교 수학에서 다루지 않는 연산자에 대해 집중적으로 다룹니다.

## 용어: "단항"(unary), "이항"(binary), "피연산자"(operand)

계속하기 전에 몇 가지 일반적인 용어를 알아 보겠습니다.

- *피연산자*(An operand)는 연산자가 적용되는 대상입니다. 예를 들어, `5 * 2` 의 곱셈에는 두 개의 피연산자가 있습니다: 왼쪽 피연산자는 `5`이고 오른쪽 피연산자는 `2`입니다. 때때로 사람들은 "피연산자"(operand)대신에 "인수"(arguments)라고도 부릅니다.
- 연산자가 하나의 피연산자를 가진 경우 이것은 *단항연산자*(unary)입니다. 예를 들어, "단항 부정 연산자"(unary negation) `-`는 숫자의 부호를 뒤집습니다:

    ```js run
    let x = 1; 

    *!*
    x = -x;
    */!*
    alert( x ); // -1, unary negation was applied
    ```
- 연산자가 2개의 피연산자를 가진 경우 *이항연산자*(binary)입니다. 같은 뺄셈이지만 이항 형식(binary form)으로도 존재합니다:

    ```js run no-beautify
    let x = 1, y = 3;
    alert( y - x ); // 2, binary minus subtracts values
    ```

    형식상, 여기서 우리는 두 가지 다른 연산자에 대해 말하고있습니다: "단항 부정 연산자"(단일 피연산자: 부호 반전)과 이항연산자 빼기(2개의 피연산자: 뺄셈)입니다. 

## 문자열 연결, 이항연산자(binary) +

이제 학교에서 배운 수학을 뛰어 넘는 자바스크립트 연산자의 특수 기능을 살펴 보겠습니다.

대개, 연산자 덧셈 `+`는 숫자를 합산합니다.

그러나 이항연산자 `+`가 문자열(strings)에 적용되면, 그 문자열들을 병합(연결)합니다 :

```js
let s = "my" + "string";
alert(s); // mystring
```

피연산자 중 하나가 문자열이면 다른 하나도 문자열으로 변환됩니다.

예를 들어:

```js run
alert( '1' + 2 ); // "12"
alert( 2 + '1' ); // "21"
```

첫 번째 피연산자가 문자열인지 또는 두 번째 피연산자가 문자열인지는 중요하지 않습니다. 규칙은 간단합니다. 피연사자중 어느 하나가 문자열이면 다른 하나도 문자열으로 변환됩니다.

그러나 연산은 왼쪽에서 오른쪽으로 실행됩니다. 두 개의 숫자 뒤에 문자열이 오면, 숫자들은 문자열로 변환되기 전에 덧셈 연산을 합니다.

```js run
alert(2 + 2 + '1' ); // "41" and not "221"
```

문자열 연결 및 변환은 이항연산자(binary) 덧셈`+`의 특별한 기능입니다. 다른 산술 연산자는 숫자로만 계산하며 항상 피연산자를 숫자로 변환합니다.

예를 들어, 뺄셈 `-`와 나누기 `/`:

```js run
alert( 2 - '1' ); // 1
alert( '6' / '2' ); // 3
```

## 숫자 변환(Numeric conversion), 단일연산자(unary) +

덧셈 `+`의 2가지 형식: 우리가 위에서 사용한 **이항 연산자 형식**과 **단항 연산자 형식**입니다.

단항 연산자 덧셈 (다른 말로하면 하나의 값에 적용된 덧셈 연산자 `+`)는 숫자에 아무 것도 하지 않습니다. 그러나 피연산자가 숫자가 아닌 경우 단항 기호는 피연산자를 숫자로 변환합니다.

예를 들어:

```js run
// No effect on numbers
let x = 1;
alert( +x ); // 1

let y = -2;
alert( +y ); // -2

*!*
// Converts non-numbers
alert( +true ); // 1
alert( +"" );   // 0
*/!*
```

실제로 `Number(...)`와 똑같은 일을 하지만 더 짧습니다.

문자열을 숫자로 변환하는 요구는 매우 자주 발생합니다. 예를 들어 HTML 양식(form) 필드에서 값을 가져 오는 경우에는 대개 문자열입니다.

그것들을 합산한다면?

이항연산자 덧셈은 그것들을 문자열로 더할겁니다:

```js run
let apples = "2";
let oranges = "3";

alert( apples + oranges ); // "23", the binary plus concatenates strings
```

그것들을 숫자로 처리하려면 변환한 다음 합산해야합니다.

```js run
let apples = "2";
let oranges = "3";

*!*
// both values converted to numbers before the binary plus
alert( +apples + +oranges ); // 5
*/!*

// the longer variant
// alert( Number(apples) + Number(oranges) ); // 5
```

수학자의 관점에서, 다수의 덧셈 기호(pluses)가 이상하게 보일지도 모릅니다. 그러나 프로그래머의 관점에서 보면 특별한 것은 없습니다. 단항연산자 `+`가 먼저 적용되면서 문자열을 숫자로 변환 합니다. 그러고 나서 이항연산자 plus가 그것들을 합산합니다. 

왜 이항연산자 `+`가 적용되기 전에 단항연산자 `+`가 적용됩니까? 곧 보게될 것 처럼, 그것들은 *더 높은 우선순위* 때문입니다.

## 연산자 우선순위(Operator precedence)

<<<<<<< HEAD
수식에서 둘 이상의 연산자가 있는 경우, 실행 순서는 *우선순위*(precedence), 다른말로 하자면 (연산자의 암묵적 우선순위-the implicit priority order of operators)에 의해 정의됩니다.
=======
If an expression has more than one operator, the execution order is defined by their *precedence*, or, in other words, the default priority order of operators.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

학교에서 우리는 `1 + 2 * 2` 수식에서 곱셈을 덧셈 전에 계산해야 하는 것을 배웠습니다. 그게 우선순위입니다. 곱셈은 ​​덧셈보다 *더 높은 우선 순위*를 가집니다. 

<<<<<<< HEAD
암묵적 순서에 만족하지 못한 경우, 괄호는 우선순위를 무시하므로 이를 사용하여 우선순위를 변경할 수 있습니다. 예: `(1 + 2) * 2`.
=======
Parentheses override any precedence, so if we're not satisfied with the default order, we can use them to change it. For example, write `(1 + 2) * 2`.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

자바스크립트에는 많은 연산자가 있습니다. 모든 연산자에는 해당 우선순위 번호가 있습니다. 숫자가 큰 번호가 먼저 실행됩니다. 우선 순위가 같으면 실행 순서는 왼쪽에서 오른쪽입니다.

다음은 [우선순위 테이블(precedence table)](https://developer.mozilla.org/en/JavaScript/Reference/operators/operator_precedence)에서 발췌한 것입니다 (이 것을 기억할 필요는 없지만 단항연산자는 동반하는 이진연산자보다 우선순위가 더 큽니다) :

| 우선선위 번호(Precedence) | 이름(Name) | 기호(Sign) |
|------------|------|------|
| ... | ... | ... |
| 16 | 단항연산자 더하기(unary plus) | `+` |
| 16 | 단항부정(unary negation) | `-` |
| 14 | 곱하기(multiplication) | `*` |
| 14 | 나누기(division) | `/` |
| 13 | 더하기(addition) | `+` |
| 13 | 빼기(subtraction) | `-` |
| ... | ... | ... |
| 3 | 대입 연산자(assignment) | `=` |
| ... | ... | ... |

보시다시피, "단항연산자 더하기"는 "더하기"(이항연산자)의 우선 순위 `13`보다 높은 `16`을 갖습니다. 그래서 `"+apples + +oranges"`라는 수식에서 "단항연산자 더하기"(unary plus)는 "더하기"(addition) 전에 계산합니다.

## Assignment(대입)

대입 연산자 `=`도 연산자라는 것에 주위합니다. 우선 순위 테이블에 `3`이라는 매우 낮은 우선 순위로 나열됩니다.

그래서 우리가 `x = 2 * 2 + 1`과 같이 변수를 대입할 때 계산이 먼저 수행 된 다음 `=`가 결과를 `x`에 저장합니다.

```js
let x = 2 * 2 + 1;

alert( x ); // 5
```

대입 연산자는 연결할 수도 있습니다.

```js run
let a, b, c;

*!*
a = b = c = 2 + 2;
*/!*

alert( a ); // 4
alert( b ); // 4
alert( c ); // 4
```

연결된 대입연산자는 오른쪽에서 왼쪽으로 수치가 구해집니다. 먼저 가장 오른쪽에있는 수식인 `2 + 2`의 수치를 구하여 왼쪽에 있는 변수인 `c`, `b`와 `a`에 대입됩니다. 결국 모든 변수는 단일 값을 공유합니다.

````smart header="대입 연산자 `\"=\"`는 값을 반환합니다."
연산자는 항상 값을 반환합니다. 그것들의 대부분은 덧셈`+` 또는 곱셈`*`과 같이 명백합니다. 그러나 대입연산자도 이 규칙을 따르고있습니다.

`x = value` 호출은 `value`를 `x`에 쓴 다음 그 `x`을 반환합니다. 

다음은 보다 복잡한 수식의 일부로 대입 연산자를 사용하는 데모입니다.

```js run
let a = 1;
let b = 2;

*!*
let c = 3 - (a = b + 1);
*/!*

alert( a ); // 3
alert( c ); // 0
```

<<<<<<< HEAD
위의 예제에서 `(a = b + 1)`의 결과는 `a`(즉`3`)에 할당 된 값입니다. 그런 다음 `3`에서 빼기 위해 사용됩니다.

재미 있은 코드입니다, 그렇죠? 때로는 (3rd-party)타사 라이브러리에서 볼 수 있기 때문에 어떻게 작동하는지 이해해야합니다. 하지만 직접 작성하지 않아야합니다. 이러한 트릭은 절대로 알아보기 쉽거나 가독성 좋은 코드를 만들수 없습니다.
=======
In the example above, the result of expression `(a = b + 1)` is the value which was assigned to `a` (that is `3`). It is then used for further evaluations.

Funny code, isn't it? We should understand how it works, because sometimes we see it in JavaScript libraries, but shouldn't write anything like that ourselves. Such tricks definitely don't make code clearer or readable.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd
````

## 나머지 연산자(Remainder) %

나머지 연산자`%`는 외형에도 불구하고 퍼센트와 관련이 없습니다.

`a % b`의 결과는 `a`의 `b`에 의한 정수 나누기의 나머지입니다.

예를 들어:

```js run
alert( 5 % 2 ); // 1 is a remainder of 5 divided by 2
alert( 8 % 3 ); // 2 is a remainder of 8 divided by 3
alert( 6 % 3 ); // 0 is a remainder of 6 divided by 3
```

## 지수 계산(Exponentiation) ** 

지수 계산 연산자 `**`는 최근에 언어에 추가되었습니다. 

자연수 `b`의 경우 `a ** b`의 결과는 `a`에 스스로를 `b`번를 곱한 값입니다.

예를 들어:

```js run
alert( 2 ** 2 ); // 4  (2 * 2)
alert( 2 ** 3 ); // 8  (2 * 2 * 2)
alert( 2 ** 4 ); // 16 (2 * 2 * 2 * 2)
```

연산자는 정수가 아닌 숫자에 대해서도 동작합니다.

예를 들어:

```js run
alert( 4 ** (1/2) ); // 2 (power of 1/2 is the same as a square root, that's maths)
alert( 8 ** (1/3) ); // 2 (power of 1/3 is the same as a cubic root)
```

## 증가/감소 연산자(Increment/decrement)

<!-- 내장 구문 분석기능이 -- 을 –로 전환하기 때문에 제목에 -- 사용할 수 없습니다. -->

숫자를 하나씩 늘리거나 줄이는 것은 가장 일반적인 수치 연산 중 하나입니다.

그래서, 이것을 위한 특별한 연산자가 있습니다:

- **증가 연산자**(Increment) `++`는 변수를 1씩 증가시킵니다.:

    ```js run no-beautify
    let counter = 2;
    counter++;      // works the same as counter = counter + 1, but is shorter
    alert( counter ); // 3
    ```
- **감소 연산자**(Decrement) `--`1씩 변수를 감소시킵니다. :

    ```js run no-beautify
    let counter = 2;
    counter--;      // works the same as counter = counter - 1, but is shorter
    alert( counter ); // 1
    ```

```warn
증가/감소 연산자는 변수에만 적용할 수 있습니다. `5++`과 같이 값에 사용하려고 하면 에러가 발생합니다.
```

`++`와`--` 연산자는 변수 앞이나 뒤에 놓을 수 있습니다.

- 연산자가 변수 뒤에 오는 경우, "후치 형식"(postfix form) 입니다.: `counter++`.
- "전치 형식"(prefix form)은 연산자가 변수 앞에 오면됩니다.: `++counter`.

이 두 문장은 똑같은 일을 합니다 : 'counter'를 '1'만큼 증가시킵니다.

어떤 차이가 있습니까? 네. 그러나 `++/--`의 반환 값을 사용하는 경우에만 볼 수 있습니다.

명확히합시다. 이미 알다시피 모든 연산자는 값을 반환합니다. 증가/감소 연산자는
 예외가 없습니다. 전치 형식은 새 값을 반환하지만 후치 형식은 이전 값(증가/감소) 이전 을 반환합니다.

차이점을 확인하려면 다음 예를 참조하십시오.

```js run
let counter = 1;
let a = ++counter; // (*)

alert(a); // *!*2*/!*
```

`(*)`줄에서 `++counter`형식의 *전치*는 `counter`를 증가시키고 새로운 값 `2`를 반환합니다. 따라서 'alert'는 '2'를 표시합니다.

자, 후치(postfix form)을 사용해봅시다

```js run
let counter = 1;
let a = counter++; // (*) changed ++counter to counter++

alert(a); // *!*1*/!*
```

`(*)`줄에서 *후치* 형식 인 `counter++`는 `counter`를 증가 시키지만 *이전* 값 (증가 이전)을 반환합니다. 따라서 `alert`는 `1`을 표시합니다.

요약:

- 증가/감소의 연산자의 결과가 사용되지 않으면 사용하는 형식에 차이는 없습니다.

    ```js run
    let counter = 0;
    counter++;
    ++counter;
    alert( counter ); // 2, the lines above did the same
    ```
- 값을 늘리고 연산자의 결과를 즉시 사용하려면 전치 형식이 필요합니다.

    ```js run
    let counter = 0;
    alert( ++counter ); // 1
    ```
- 값을 증가시키고 이전 값을 사용하려면 후치 형식이 필요합니다.

    ```js run
    let counter = 0;
    alert( counter++ ); // 0
    ```

````smart header="다른 연산자들 사이의 증가/감소 연산자"
`++/--` 연산자는 수식에도 사용할 수 있습니다. 우선 순위는 다른 대부분의 산술 연산보다 높습니다.

예를 들어:

```js run
let counter = 1;
alert( 2 * ++counter ); // 4
```

다음과 비교:

```js run
let counter = 1;
alert( 2 * counter++ ); // 2, because counter++ returns the "old" value
```

기술적으로는 괜찮지만 그러한 표기법은 일반적으로 코드의 가독성을 떨어트립니다. 한 줄은 여러 가지 일을 하는 것은 좋지 않습니다. 

코드를 읽는 동안, 빠른 "수직" 아이-스캔은 `counter++`와 같은 것을 쉽게 놓칠 수 있으며 변수가 증가했다는 것을 명확하게 알수 없습니다.

우리는 "한 줄에 하나의 행동"하는 스타일을 권고합니다.

```js run
let counter = 1;
alert( 2 * counter );
counter++;
```
````

## 비트 연산자(Bitwise operators)

비트 연산자는 인수(arguments)를 32-bit 정수로 처리하고 이진 표현 수준에서 연산합니다.

이러한 연산자는 자바스크립트에 특정되지 않습니다. 대부분의 프로그래밍 언어에서 지원됩니다.

비트 연산자 목록:

- AND ( `&` )
- OR ( `|` )
- XOR ( `^` )
- NOT ( `~` )
- LEFT SHIFT ( `<<` )
- RIGHT SHIFT ( `>>` )
- ZERO-FILL RIGHT SHIFT ( `>>>` )

이 연산자는 거의 사용되지 않습니다. 그것들을 이해하기 위해서, 우리는 저수준 숫자 표현을 탐구해야 하는데, 지금 당장 필요하지 않으므로 그렇게하는 것은 적절하지 않습니다. 호기심이 생기면 MDN에서 [비트 단위 연산자](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) 문서를 읽을 수 있습니다. 진짜로 필요할 때 그것을 사용하는 것이 더 실용적일 것입니다.

## 제자리에서 수정(Modify-in-place)

때때로 변수에 연산자를 적용하고 같은 변수에 새로운 결과를 저장해야합니다.

예를 들어:

```js
let n = 2;
n = n + 5;
n = n * 2;
```

이 표기법은 `+=` 및 `*=`연산자를 사용하여 단축할 수 있습니다.

```js run
let n = 2;
n += 5; // now n = 7 (same as n = n + 5)
n *= 2; // now n = 14 (same as n = n * 2)

alert( n ); // 14
```

짧은 "수정과 대입"(modify-and-assign) 연산자는 산술, 비트 연산자를 위해 존재합니다: `/=`, `-=`, 등.

이러한 연산자는 일반 대입과 동일한 우선순위를 가지므로 대부분 다른 계산 후에 실행됩니다.

```js run
let n = 2;

n *= 3 + 5;

alert( n ); // 16  (right part evaluated first, same as n *= 8)
```

## 쉼표(Comma)

쉼표 연산자`,`는 가장 희귀하고 가장 특이한 연산자 중 하나입니다. 때로는 더 짧은 코드를 작성하는데 사용되므로 상황을 이해하기 위해 알아야합니다.

쉼표 연산자를 사용하면 여러 수식을 쉼표`,`로 구분하여 수치를 구할수 있습니다. 각각은 수치를 구하지만 마지막 결과 만 리턴됩니다.

예를 들어:

```js run
*!*
let a = (1 + 2, 3 + 4);
*/!*

alert( a ); // 7 (the result of 3 + 4)
```

여기 첫 번째 수식 `1 + 2`은 수치를 구하고 그 결과가 버려집니다. 그런 다음`3 + 4`가 계산되어 결과로 반환됩니다.

```smart header="쉼표는 매우 낮은 우선 순위를 갖습니다."
쉼표 연산자는 매우 낮은 우선 순위(`=`보다 더 낮은)를 갖습니다. 그래서 괄호가 위의 예에서 중요합니다.

<<<<<<< HEAD
그것들이 없으면: `a = 1 + 2, 3 + 4`는 `+`를 먼저 계산하고 `a = 3, 7`로 합산합니다. 그러고나서 대입 연산자 `=`는 `a = 3`을 대입하고 마지막으로 '7'(쉼표 뒤에 숫자)은 처리되지 않으므로 무시됩니다.
```

마지막 부분을 제외한 모든 것을 버리는 연산자가 필요한 이유는 무엇입니까?
=======
Without them: `a = 1 + 2, 3 + 4` evaluates `+` first, summing the numbers into `a = 3, 7`, then the assignment operator `=` assigns `a = 3`, and the rest is ignored. It's like `(a = 1 + 2), 3 + 4`.
```

Why do we need an operator that throws away everything except the last expression?
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd

때로는 사람들이 더 복잡한 구조에서 여러 행동을 하나의 줄에 넣는 경우가 있습니다.

예를 들어:

```js
// three operations in one line
for (*!*a = 1, b = 3, c = a * b*/!*; a < 10; a++) {
 ...
}
```

<<<<<<< HEAD
이러한 트릭은 많은 자바스크립트 프레임워크에서 사용됩니다. 그것이 우리가 언급하는 이유입니다. 그러나 보통은 코드 가독성이 향상되지 않으므로 사용하기 전에 잘 생각해야합니다.
=======
Such tricks are used in many JavaScript frameworks. That's why we're mentioning them. But usually they don't improve code readability so we should think well before using them.
>>>>>>> 6bbe0b4313a7845303be835d632ef8e5bc7715cd
