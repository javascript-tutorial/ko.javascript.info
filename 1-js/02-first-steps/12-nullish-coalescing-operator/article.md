# null 병합 연산자 '??'

[recent browser="new"]

<<<<<<< HEAD
null 병합 연산자(nullish coalescing operator) `??`를 사용하면 짧은 문법으로 여러 피연산자 중 그 값이 '확정되어있는' 변수를 찾을 수 있습니다.

`a ?? b`의 평가 결과는 다음과 같습니다.
- `a`가 `null`도 아니고 `undefined`도 아니면 `a`
- 그 외의 경우는 `b`

null 병합 연산자 `??`없이 `x = a ?? b`와 동일한 동작을 하는 코드를 작성하면 다음과 같습니다.
=======
The nullish coalescing operator is written as two question marks `??`.

As it treats `null` and `undefined` similarly, we'll use a special term here, in this article. We'll say that an expression is "defined" when it's neither `null` nor `undefined`.

The result of `a ?? b` is:
- if `a` is defined, then `a`,
- if `a` isn't defined, then `b`.

In other words, `??` returns the first argument if it's not `null/undefined`. Otherwise, the second one.

The nullish coalescing operator isn't anything completely new. It's just a nice syntax to get the first "defined" value of the two.

We can rewrite `result = a ?? b` using the operators that we already know, like this:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```js
result = (a !== null && a !== undefined) ? a : b;
```

Now it should be absolutely clear what `??` does. Let's see where it helps.

The common use case for `??` is to provide a default value for a potentially undefined variable.

For example, here we show `user` if defined, otherwise `Anonymous`:

```js run
let user;

alert(user ?? "Anonymous"); // Anonymous (user not defined)
```

<<<<<<< HEAD
비교 연산자와 논리 연산자만으로 null 병합 연산자와 같은 기능을 하는 코드를 작성하니 코드 길이가 길어지네요. 

또 다른 예시를 살펴봅시다. `firstName`, `lastName`, `nickName`이란 변수에 사용자 이름이나 별명을 저장하는데, 사용자가 아무런 정보도 입력하지 않는 케이스도 허용한다고 해보겠습니다.

화면엔 세 변수 중 실제 값이 있는 변수의 값을 출력하는데, 세 변수 모두 값이 없다면 '익명의 사용자'가 출력되도록 해보죠.

이럴 때 null 병합 연산자 `??`를 사용하면 값이 정해진 변수를 간편하게 찾아낼 수 있습니다.
=======
Here's the example with `user` assigned to a name:

```js run
let user = "John";

alert(user ?? "Anonymous"); // John (user defined)
```

We can also use a sequence of `??` to select the first value from a list that isn't `null/undefined`.

Let's say we have a user's data in variables `firstName`, `lastName` or `nickName`. All of them may be not defined, if the user decided not to enter a value.

We'd like to display the user name using one of these variables, or show "Anonymous" if all of them aren't defined.

Let's use the `??` operator for that:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```js run
let firstName = null;
let lastName = null;
let nickName = "바이올렛";

<<<<<<< HEAD
// null이나 undefined가 아닌 첫 번째 피연산자
=======
// shows the first defined value:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
*!*
alert(firstName ?? lastName ?? nickName ?? "익명의 사용자"); // 바이올렛
*/!*
```

## '??'와 '||'의 차이

<<<<<<< HEAD
null 병합 연산자는 OR 연산자 `||`와 상당히 유사해 보입니다. 실제로 위 예시에서 `??`를 `||`로 바꿔도 그 결과는 동일하기까지 하죠. 관련 내용은 [이전 챕터](info:logical-operators#or-finds-the-first-truthy-value)에서 살펴본 바 있습니다.

그런데 두 연산자 사이에는 중요한 차이점이 있습니다.
- `||`는 첫 번째 *truthy* 값을 반환합니다.
- `??`는 첫 번째 *정의된(defined)* 값을 반환합니다.

`null`과 `undefined`, 숫자 `0`을 구분 지어 다뤄야 할 때 이 차이점은 매우 중요한 역할을 합니다.

예시를 살펴봅시다.
=======
The OR `||` operator can be used in the same way as `??`, as it was described in the [previous chapter](info:logical-operators#or-finds-the-first-truthy-value).

For example, in the code above we could replace `??` with `||` and still get the same result:

```js run
let firstName = null;
let lastName = null;
let nickName = "Supercoder";
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

// shows the first truthy value:
*!*
alert(firstName || lastName || nickName || "Anonymous"); // Supercoder
*/!*
```

<<<<<<< HEAD
`height`에 값이 정의되지 않은경우 `height`엔 `100`이 할당됩니다.

이제 `??`와 `||`을 비교해봅시다.
=======
Historically, the OR `||` operator was there first. It exists since the beginning of JavaScript, so developers were using it for such purposes for a long time.

On the other hand, the nullish coalescing operator `??` was added to JavaScript only recently, and the reason for that was that people weren't quite happy with `||`.

The important difference between them is that:
- `||` returns the first *truthy* value.
- `??` returns the first *defined* value.

In other words, `||` doesn't distinguish between `false`, `0`, an empty string `""` and `null/undefined`. They are all the same -- falsy values. If any of these is the first argument of `||`, then we'll get the second argument as the result.

In practice though, we may want to use default value only when the variable is `null/undefined`. That is, when the value is really unknown/not set.

For example, consider this:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```js run
let height = 0;

alert(height || 100); // 100
alert(height ?? 100); // 0
```

<<<<<<< HEAD
`height || 100`은 `height`에 `0`을 할당했지만 `0`을 falsy 한 값으로 취급했기 때문에 `null`이나 `undefined`를 할당한 것과 동일하게 처리합니다. 따라서 `height || 100`의 평가 결과는 `100`입니다.

반면 `height ?? 100`의 평가 결과는 `height`가 정확하게 `null`이나 `undefined`일 경우에만 `100`이 됩니다. 예시에선 `height`에 `0`이라는 값을 할당했기 때문에 얼럿창엔 `0`이 출력됩니다.

이런 특징 때문에 높이처럼 `0`이 할당될 수 있는 변수를 사용해 기능을 개발할 땐 `||`보다 `??`가 적합합니다.
=======
- The `height || 100` checks `height` for being a falsy value, and it's `0`, falsy indeed.
    - so the result of `||` is the second argument, `100`.
- The `height ?? 100` checks `height` for being `null/undefined`, and it's not,
    - so the result is `height` "as is", that is `0`.

In practice, the zero height is often a valid value, that shouldn't be replaced with the default. So `??` does just the right thing.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

## 연산자 우선순위

<<<<<<< HEAD
[`??`의 연산자 우선순위](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table)는 `5`로 꽤 낮습니다.

따라서 `??`는 `=`와 `?` 보다는 먼저, 대부분의 연산자보다는 나중에 평가됩니다.

그렇기 때문에 복잡한 표현식 안에서 `??`를 사용해 값을 하나 선택할 땐 괄호를 추가하는 게 좋습니다.
=======
The precedence of the `??` operator is about the same as `||`, just a bit lower. It equals `5` in the [MDN table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table), while `||` is `6`.

That means that, just like `||`, the nullish coalescing operator `??` is evaluated before `=` and `?`, but after most other operations, such as `+`, `*`.

So if we'd like to choose a value with `??` in an expression with other operators, consider adding parentheses:
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```js run
let height = null;
let width = null;

// 괄호를 추가!
let area = (height ?? 100) * (width ?? 50);

alert(area); // 5000
```

<<<<<<< HEAD
그렇지 않으면 `*`가 `??`보다 우선순위가 높기 때문에 `*`가 먼저 실행됩니다.

결국엔 아래 예시처럼 동작하겠죠.

```js
// 원치 않는 결과
let area = height ?? (100 * width) ?? 50;
```

`??`엔 자바스크립트 언어에서 규정한 또 다른 제약사항이 있습니다.

**안정성 관련 이슈 때문에 `??`는 `&&`나 `||`와 함께 사용하지 못합니다.**
=======
Otherwise, if we omit parentheses, then as `*` has the higher precedence than `??`, it would execute first, leading to incorrect results.

```js
// without parentheses
let area = height ?? 100 * width ?? 50;

// ...works the same as this (probably not what we want):
let area = height ?? (100 * width) ?? 50;
```

### Using ?? with && or ||

Due to safety reasons, JavaScript forbids using `??` together with `&&` and `||` operators, unless the precedence is explicitly specified with parentheses.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

아래 예시를 실행하면 문법 에러가 발생합니다.

```js run
let x = 1 && 2 ?? 3; // SyntaxError: Unexpected token '??'
```

<<<<<<< HEAD
이 제약에 대해선 아직 논쟁이 많긴 하지만 사람들이 `||`를 `??`로 바꾸기 시작하면서 만드는 실수를 방지하고자 명세서에 제약이 추가된 상황입니다.
=======
The limitation is surely debatable, it was added to the language specification with the purpose to avoid programming mistakes, when people start to switch from `||` to `??`.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

제약을 피하려면 괄호를 사용해주세요.

```js run
*!*
let x = (1 && 2) ?? 3; // 제대로 동작합니다.
*/!*

alert(x); // 2
```

## 요약

<<<<<<< HEAD
- null 병합 연산자 `??`를 사용하면 피연산자 중 '값이 할당된' 변수를 빠르게 찾을 수 있습니다.
=======
- The nullish coalescing operator `??` provides a short way to choose the first "defined" value from a list.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

    `??`는 변수에 기본값을 할당하는 용도로 사용할 수 있습니다.

    ```js
    // height가 null이나 undefined인 경우, 100을 할당 
    height = height ?? 100;
    ```

<<<<<<< HEAD
- `??`의 연산자 우선순위는 대다수의 연산자보다 낮고 `?`와 `=` 보다는 높습니다.
- 괄호 없이 `??`를 `||`나 `&&`와 함께 사용하는 것은 금지되어있습니다.
=======
- The operator `??` has a very low precedence, only a bit higher than `?` and `=`, so consider adding parentheses when using it in an expression.
- It's forbidden to use it with `||` or `&&` without explicit parentheses.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
