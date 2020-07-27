# null 병합 연산자 '??'

[recent browser="new"]

null 병합 연산자(nullish coalescing operator) `??`를 사용하면 여러 피연산자 중 그 값이 '확정되어있는' 변수를 짧은 문법으로도 찾을 수 있습니다.

상황에 따른 `a ?? b`의 평가 결과를 살펴봅시다.
- `a`가 `null`이나 `undefined`가 아니면 `a`
- `a`가 `null`이나 `undefined`이면 `b`

null 병합 연산자 `??`를 사용하지 않고 만든 `x = a ?? b`와 동일하게 동작하는 코드는 다음과 같습니다.

```js
x = (a !== null && a !== undefined) ? a : b;
```

길이가 길어지네요. 

<<<<<<< HEAD
또 다른 예시를 살펴봅시다. `firstName`, `lastName`, `nickName`이란 변수가 있는데 이 값들은 모두 옵션 값이라고 해보겠습니다.

실제 값이 들어있는 변수를 찾고 그 값을 보여줘 보겠습니다(모든 변수에 값이 없다면 `익명`을 출력).
=======
Imagine, we have a user, and there are variables `firstName`, `lastName` or `nickName` for their first name, last name and the nick name. All of them may be undefined, if the user decided not to enter any value.

We'd like to display the user name: one of these three variables, or show "Anonymous" if nothing is set.

Let's use the `??` operator to select the first defined one:
>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2

```js run
let firstName = null;
let lastName = null;
let nickName = "바이올렛";

<<<<<<< HEAD
// null이나 undefined가 아닌 첫 번째 피연산자
alert(firstName ?? lastName ?? nickName ?? "익명"); // 바이올렛
=======
// show the first not-null/undefined value
*!*
alert(firstName ?? lastName ?? nickName ?? "Anonymous"); // Supercoder
*/!*
>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2
```

## '??'와 '||'의 차이

<<<<<<< HEAD
null 병합 연산자는 OR 연산자 `||`와 상당히 유사해 보입니다. 실제로 위 예시에서 `??`를 `||`로 바꿔도 그 결과는 동일하기까지 하죠.
=======
The OR `||` operator can be used in the same way as `??`. Actually, we can replace `??` with `||` in the code above and get the same result, as it was described in the [previous chapter](info:logical-operators#or-finds-the-first-truthy-value).
>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2

그런데 두 연산자 사이에는 중요한 차이점이 있습니다.
- `||`는 첫 번째 *truthy* 값을 반환합니다.
- `??`는 *값이 정의되어있는* 첫 번째 값을 반환합니다.

`null`과 `undefined`, 숫자 `0`을 구분 지어 다뤄야 할 때 이 차이점은 매우 중요한 역할을 합니다.

<<<<<<< HEAD
예시:
=======
For example, consider this:
>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2

```js
height = height ?? 100;
```

<<<<<<< HEAD
`height`에 값을 정의하지 않은 상태라면 `height`엔 `100`이 할당됩니다. 그런데 `height`에 `0`이 할당된 상태라면 값이 바뀌지 않고 그대로 남아있습니다.
=======
This sets `height` to `100` if it's not defined.
>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2

이제 `??`와 `||`을 비교해봅시다.

```js run
let height = 0;

alert(height || 100); // 100
alert(height ?? 100); // 0
```

<<<<<<< HEAD
`height || 100`은 `height`에 `0`을 할당했지만 `0`을 falsy 한 값으로 취급했기 때문에 `null`이나 `undefined`를 할당한 것과 동일하게 처리합니다. 높이에 `0`을 할당하는 것과 유사한 유스케이스에선 이처럼 `||`는 부정확한 결과를 일으킬 수 있습니다.

대신 `height ?? 100`은 `height`가 정확히 `null`이나 `undefined`일때만 `height`에 `100`을 할당합니다. 
=======
Here, `height || 100` treats zero height as unset, same as `null`, `undefined` or any other falsy value. So the result is `100`.

The `height ?? 100` returns `100` only if `height` is exactly `null` or `undefined`. So the `alert` shows the height value `0` "as is".

Which behavior is better depends on a particular use case. When zero height is a valid value, then `??` is preferrable.
>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2

## 연산자 우선순위

<<<<<<< HEAD
[`??`의 연산자 우선순위](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table)는 `7`로 꽤 낮습니다.

대부분의 연산자보다 우선순위가 낮고, `=`와 `?` 보다는 조금 높죠.

따라서 복잡한 표현식 안에서 `??`를 사용할 땐 괄호를 추가해주는 게 좋습니다.
=======
The precedence of the `??` operator is rather low: `5` in the [MDN table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table).

So `??` is evaluated after most other operations, but before `=` and `?`.

If we need to choose a value with `??` in a complex expression, then consider adding parentheses:
>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2

```js run
let height = null;
let width = null;

// 괄호를 추가!
let area = (height ?? 100) * (width ?? 50);

alert(area); // 5000
```

<<<<<<< HEAD
`*`가 `??`보다 우선순위가 높기 때문에 괄호를 생략하게 되면 `*`가 먼저 실행되어 아래 코드처럼 동작할 겁니다.

```js
// 원치 않는 결과
let area = height ?? (100 * width) ?? 50;
```

`??`엔 자바스크립트 언어에서 규정한 또 다른 제약사항이 있습니다. 안정성 관련 이슈 때문에 `??`는 `&&`나 `||`와 함께 사용하는 것이 금지되어 있습니다.
=======
Otherwise, if we omit parentheses, `*` has the higher precedence than `??` and would run first.

That would work be the same as:

```js
// probably not correct
let area = height ?? (100 * width) ?? 50;
```

There's also a related language-level limitation.

**Due to safety reasons, it's forbidden to use `??` together with `&&` and `||` operators.**
>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2

아래 예시를 실행해봅시다. 문법 에러가 발생합니다.

```js run
let x = 1 && 2 ?? 3; // SyntaxError: Unexpected token '??'
```

<<<<<<< HEAD
이 제약에 대해선 아직 논쟁이 많긴 하지만 어쨌든 이슈가 있어서 명세서에 제약이 추가된 상황입니다.

에러를 피하려면 괄호를 사용해주세요.

```js run
let x = (1 && 2) ?? 3; // 제대로 동작합니다.
=======
The limitation is surely debatable, but it was added to the language specification with the purpose to avoid programming mistakes, as people start to switch to `??` from `||`.

Use explicit parentheses to work around it:

```js run
*!*
let x = (1 && 2) ?? 3; // Works
*/!*

>>>>>>> b0464bb32c8efc2a98952e05f363f61eca1a99a2
alert(x); // 2
```

## 요약

- null 병합 연산자 `??`를 사용하면 피연산자 중 '값이 할당된' 변수를 빠르게 찾을 수 있습니다.

    `??`는 변수에 기본값을 할당하는 용도로 사용할 수 있습니다.

    ```js
    // height가 null이나 undefined인 경우, 100을 할당 
    height = height ?? 100;
    ```

- `??`의 연산자 우선순위는 대다수의 연산자보다 낮고 `?`와 `=` 보다는 높습니다.
- 괄호 없이 `??`를 `||`나 `&&`와 함께 사용하는 것은 금지되어있습니다.
