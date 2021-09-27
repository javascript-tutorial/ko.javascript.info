# 논리 연산자

<<<<<<< HEAD
자바스크립트엔 세 종류의 논리 연산자 `||`(OR), `&&`(AND), `!`(NOT)이 있습니다.
=======
There are four logical operators in JavaScript: `||` (OR), `&&` (AND), `!` (NOT), `??` (Nullish Coalescing). Here we cover the first three, the `??` operator is in the next article.
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115

연산자에 '논리'라는 수식어가 붙긴 하지만 논리 연산자는 피연산자로 불린형뿐만 아니라 모든 타입의 값을 받을 수 있습니다. 연산 결과 역시 모든 타입이 될 수 있습니다.

좀 더 자세히 알아보도록 합시다.

## || (OR)

'OR' 연산자는 두 개의 수직선 기호로 만들 수 있습니다.

```js
result = a || b;
```

전통적인 프로그래밍에서 OR 연산자는 불린값을 조작하는 데 쓰입니다. 인수 중 하나라도 `true`이면 `true`를 반환하고, 그렇지 않으면 `false`를 반환하죠.

자바스크립트의 OR 연산자는 다루긴 까다롭지만 강력한 기능을 제공합니다. OR을 어떻게 응용할 수 있는지 알아보기 전에 먼저, OR 연산자가 불린값을 어떻게 다루는지 알아보도록 합시다.

OR 연산자는 이항 연산자이므로 아래와 같이 네 가지 조합이 가능합니다.

```js run
alert( true || true );   // true
alert( false || true );  // true
alert( true || false );  // true
alert( false || false ); // false
```

피연산자가 모두 `false`인 경우를 제외하고 연산 결과는 항상 `true`입니다.

피연산자가 불린형이 아니면, 평가를 위해 불린형으로 변환됩니다.

예를 들어, 연산 과정에서 숫자 `1`은 `true`로, 숫자 `0`은 `false`로 바뀌죠.

```js run
if (1 || 0) { // if( true || false ) 와 동일하게 동작합니다.
  alert( 'truthy!' );
}
```

OR 연산자 `||`은 `if`문에서 자주 사용됩니다. 주어진 조건 중 *하나라도* `참`인지를 테스트하는 용도로 말이죠.

예시:

```js run
let hour = 9;

*!*
if (hour < 10 || hour > 18) {
*/!*
  alert( '영업시간이 아닙니다.' );
}
```

`if`문 안에 여러 가지 조건을 넣을 수 있습니다.

```js run
let hour = 12;
let isWeekend = true;

if (hour < 10 || hour > 18 || isWeekend) {
  alert( '영업시간이 아닙니다.' ); // 주말이기 때문임
}
```

<<<<<<< HEAD
## 첫 번째 truthy를 찾는 OR 연산자 '||'
=======
## OR "||" finds the first truthy value [#or-finds-the-first-truthy-value]
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115

지금까진 피연산자가 불린형인 경우만을 다뤘습니다. 전통적인 방식이죠. 이제 자바스크립트에서만 제공하는 논리연산자 OR의 '추가'기능에 대해 알아보겠습니다.

추가 기능은 아래와 같은 알고리즘으로 동작합니다.

OR 연산자와 피연산자가 여러 개인 경우:

```js
result = value1 || value2 || value3;
```

이때, OR `||`연산자는 다음 순서에 따라 연산을 수행합니다.

- 가장 왼쪽 피연산자부터 시작해 오른쪽으로 나아가며 피연산자를 평가합니다.
- 각 피연산자를 불린형으로 변환합니다. 변환 후 그 값이 `true`이면 연산을 멈추고 해당 피연산자의 **변환 전** 원래 값을 반환합니다.
- 피연산자 모두를 평가한 경우(모든 피연산자가 `false`로 평가되는 경우)엔 마지막 피연산자를 반환합니다.

여기서 핵심은 반환 값이 형 변환을 하지 않은 원래 값이라는 것입니다.

<<<<<<< HEAD
정리해 보자면 이렇습니다. OR `"||"` 연산자를 여러 개 체이닝(chaining) 하면 첫 번째 truthy를 반환합니다. 피연산자에 truthy가 하나도 없다면 마지막 피연산자를 반환합니다.
=======
In other words, a chain of OR `||` returns the first truthy value or the last one if no truthy value is found.
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115

예시:

```js run
alert( 1 || 0 ); // 1 (1은 truthy임)

alert( null || 1 ); // 1 (1은 truthy임)
alert( null || 0 || 1 ); // 1 (1은 truthy임)

alert( undefined || null || 0 ); // 0 (모두 falsy이므로, 마지막 값을 반환함)
```

이런 OR 연산자의 추가 기능을 이용하면 여러 용도로 OR 연산자를 활용할 수 있습니다.

1. **변수 또는 표현식으로 구성된 목록에서 첫 번째 truthy 얻기**

<<<<<<< HEAD
    `firstName`, `lastName`, `nickName`이란 변수가 있는데 이 값들은 모두 옵션 값이라고 해봅시다.

    OR `||`을 사용하면 실제 값이 들어있는 변수를 찾고, 그 값을 보여줄 수 있습니다. 변수 모두에 값이 없는 경우엔 `익명`를 보여줍시다.
=======
    For instance, we have `firstName`, `lastName` and `nickName` variables, all optional (i.e. can be undefined or have falsy values).

    Let's use OR `||` to choose the one that has the data and show it (or `"Anonymous"` if nothing set):
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115

    ```js run
    let firstName = "";
    let lastName = "";
    let nickName = "바이올렛";

    *!*
    alert( firstName || lastName || nickName || "익명"); // 바이올렛
    */!*
    ```

<<<<<<< HEAD
    모든 변수가 falsy이면 `"익명"`이 출력되었을 겁니다.
=======
    If all variables were falsy, `"Anonymous"` would show up.
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115

2. **단락 평가**

    OR 연산자 `||`가 제공하는 또 다른 기능은 '단락 평가(short circuit evaluation)'입니다.

    위에서 설명해 드린 바와 같이 OR`||`은 왼쪽부터 시작해서 오른쪽으로 평가를 진행하는데, truthy를 만나면 나머지 값들은 건드리지 않은 채 평가를 멈춥니다. 이런 프로세스를 '단락 평가'라고 합니다.

    단락 평가의 동작 방식은 두 번째 피연산자가 변수 할당과 같은 부수적인 효과(side effect)를 가지는 표현식 일 때 명확히 볼 수 있습니다.

    아래 예시를 실행하면 두 번째 메시지만 출력됩니다.

    ```js run no-beautify
    *!*true*/!* || alert("not printed");
    *!*false*/!* || alert("printed");
    ```

    첫 번째 줄의 `||` 연산자는 `true`를 만나자마자 평가를 멈추기 때문에 `alert`가 실행되지 않습니다.

    단락 평가는 연산자 왼쪽 조건이 falsy일 때만 명령어를 실행하고자 할 때 자주 쓰입니다.

## && (AND)

두 개의 앰퍼샌드를 연달아 쓰면 AND 연산자 `&&`를 만들 수 있습니다.

```js
result = a && b;
```

전통적인 프로그래밍에서 AND 연산자는 두 피연산자가 모두가 참일 때 `true`를 반환합니다. 그 외의 경우는 `false`를 반환하죠.

```js run
alert( true && true );   // true
alert( false && true );  // false
alert( true && false );  // false
alert( false && false ); // false
```

아래는 `if`문과 AND 연산자를 함께 활용한 예제입니다.

```js run
let hour = 12;
let minute = 30;

if (hour == 12 && minute == 30) {
  alert( '현재 시각은 12시 30분입니다.' );
}
```

OR 연산자와 마찬가지로 AND 연산자의 피연산자도 타입에 제약이 없습니다.

```js run
if (1 && 0) { // 피연산자가 숫자형이지만 논리형으로 바뀌어 true && false가 됩니다.
  alert( "if 문 안에 falsy가 들어가 있으므로 alert창은 실행되지 않습니다." );
}
```


## 첫 번째 falsy를 찾는 AND 연산자 '&&'

AND 연산자와 피연산자가 여러 개인 경우를 살펴봅시다.

```js
result = value1 && value2 && value3;
```

AND 연산자 `&&`는 아래와 같은 순서로 동작합니다.

- 가장 왼쪽 피연산자부터 시작해 오른쪽으로 나아가며 피연산자를 평가합니다.
- 각 피연산자는 불린형으로 변환됩니다. 변환 후 값이 `false`이면 평가를 멈추고 해당 피연산자의 **변환 전** 원래 값을 반환합니다.
- 피연산자 모두가 평가되는 경우(모든 피연산자가 `true`로 평가되는 경우)엔 마지막 피연산자가 반환됩니다.

정리해 보자면 이렇습니다. AND 연산자는 첫 번째 falsy를 반환합니다. 피연산자에 falsy가 없다면 마지막 값을 반환합니다.

위 알고리즘은 OR 연산자의 알고리즘과 유사합니다. 차이점은 AND 연산자가 첫 번째 *falsy*를 반환하는 반면, OR은 첫 번째 *truthy*를 반환한다는 것입니다.

예시:

```js run
// 첫 번째 피연산자가 truthy이면,
// AND는 두 번째 피연산자를 반환합니다.
alert( 1 && 0 ); // 0
alert( 1 && 5 ); // 5

// 첫 번째 피연산자가 falsy이면,
// AND는 첫 번째 피연산자를 반환하고, 두 번째 피연산자는 무시합니다.
alert( null && 5 ); // null
alert( 0 && "아무거나 와도 상관없습니다." ); // 0
```

AND 연산자에도 피연산자 여러 개를 연속해서 전달할 수 있습니다. 첫 번째 falsy가 어떻게 반환되는지 예시를 통해 살펴봅시다.

```js run
alert( 1 && 2 && null && 3 ); // null
```

아래 예시에선 AND 연산자의 피연산자가 모두 truthy이기 때문에 마지막 피연산자가 반환됩니다.

```js run
alert( 1 && 2 && 3 ); // 마지막 값, 3
```

````smart header="`&&`의 우선순위가 `||`보다 높습니다."
AND 연산자 `&&`의 우선순위는 OR 연산자 `||`보다 높습니다.

따라서 `a && b || c && d`는 `(a && b) || (c && d)`와 동일하게 동작합니다.
````

<<<<<<< HEAD
````warn header="`if`를 ||나 &&로 대체하지 마세요."
어떤 개발자들은 AND 연산자 `&&`를 `if`문을 '짧게' 줄이는 용도로 사용하곤 합니다.
=======
````warn header="Don't replace `if` with `||` or `&&`"
Sometimes, people use the AND `&&` operator as a "shorter way to write `if`".
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115

예시:

```js run
let x = 1;

(x > 0) && alert( '0보다 큽니다!' );
```

`&&`의 오른쪽 피연산자는 평가가 `&&` 우측까지 진행되어야 실행됩니다. 즉, `(x > 0)`이 참인 경우에만 `alert`문이 실행되죠.

위 코드를 if 문을 써서 바꾸면 다음과 같습니다.

```js run
let x = 1;

if (x > 0) alert( '0보다 큽니다!' );
```

<<<<<<< HEAD
 `&&`를 사용한 코드가 더 짧긴 하지만 `if`문을 사용한 예시가 코드에서 무엇을 구현하고자 하는지 더 명백히 드러내고, 가독성도 좋습니다. 그러니 if 조건문이 필요하면 `if`를 사용하고 AND 연산자는 연산자 목적에 맞게 사용합시다.
=======
Although, the variant with `&&` appears shorter, `if` is more obvious and tends to be a little bit more readable. So we recommend using every construct for its purpose: use `if` if we want `if` and use `&&` if we want AND.
>>>>>>> b09e38c5573346c401a9f9f7410b4ff9be5f4115
````


## ! (NOT)

논리 연산자 NOT은 느낌표 `!`를 써서 만들 수 있습니다.

NOT 연산자의 문법은 매우 간단합니다.

```js
result = !value;
```

NOT 연산자는 인수를 하나만 받고, 다음 순서대로 연산을 수행합니다.

1. 피연산자를 불린형(`true / false`)으로 변환합니다.
2. 1에서 변환된 값의 역을 반환합니다.

예시:

```js run
alert( !true ); // false
alert( !0 ); // true
```

NOT을 두 개 연달아 사용(`!!`)하면 값을 불린형으로 변환할 수 있습니다.

```js run
alert( !!"non-empty string" ); // true
alert( !!null ); // false
```

이때, 첫 번째 NOT 연산자는 피연산자로 받은 값을 불린형으로 변환한 후 이 값의 역을 반환하고, 두 번째 NOT 연산자는 첫 번째 NOT 연산자가 반환한 값의 역을 반환합니다. 이렇게 NOT을 연달아 사용하면 특정 값을 불린형으로 변환할 수 있습니다.

참고로, 내장 함수 `Boolean`을 사용하면 `!!`을 사용한 것과 같은 결과를 도출할 수 있습니다.

```js run
alert( Boolean("non-empty string") ); // true
alert( Boolean(null) ); // false
```

`NOT` 연산자의 우선순위는 모든 논리 연산자 중에서 가장 높기 때문에 항상 `&&`나 `||` 보다 먼저 실행됩니다.
