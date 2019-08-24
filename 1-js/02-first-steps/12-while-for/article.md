# 반복문: while 과 for

개발을 할때 자주 반복된 행동을 할 필요가 있습니다.

예를 들어, 목록에서 상품을 차례대로 출력하거나 1에서 10까지 각 번호에 대해 동일한 코드를 실행합니다.

*반복문*은 동일한 코드를 여러 번 반복하는 방법입니다.

## 반복문 "while" 

`while` 반복문에는 다음과 같은 구문이 있습니다.

```js
while (condition) {
  // code
  // so-called "loop body"
}
```

`조건`이 참 같은 값이면 반복문 본문의 `코드`를 실행합니다.

예를 들어, 아래 반복문은 `i < 3`이 참인 동안 `i`를 출력합니다. 

```js run
let i = 0;
while (i < 3) { // shows 0, then 1, then 2
  alert( i );
  i++;
}
```

반복문 본문의 단일 실행을 *반복(iteration)*이라고합니다. 위 예제의 반복문은 3개의 반복을 만듭니다.

만약 위 예제에서 `i ++`가 없다면, 반복문은 (이론적으로) 영원히 반복될 것입니다. 실제로 브라우저는 이러한 반복문을 중지하는 방법을 제공하고, Server-side JavaScript에서는 프로세스를 종료할 수 있습니다.

비교식이 아니어도 어떠한 표현식이나 변수도 반복문의 조건이 될 수 있습니다. 조건은 `while`에 의해 평가되고 불린 값으로 변환됩니다.

예를 들면 `while (i! = 0)`을 더 간결하게 `while (i)`로 쓸 수 있습니다.

```js run
let i = 3;
*!*
while (i) { // when i becomes 0, the condition becomes falsy, and the loop stops
*/!*
  alert( i );
  i--;
}
```

````smart header="한 줄짜리 본문에는 중괄호가 필요하지 않습니다."
반복문 본문에 단일 명령문이 있으면 중괄호(`{…}`)를 생략할 수 있습니다.  

```js run
let i = 3;
*!*
while (i) alert(i--);
*/!*
```
````

## 반복문 "do..while" 

조건 검사는 `do..while` 구문을 사용하여 반복문의 본문 *아래로* 이동할 수 있습니다.

```js
do {
  // loop body
} while (condition);
```

반복문은 먼저 본문을 실행할 것이고, 그러고 나서 조건을 확인하고, 조건을 충족할 동안 이것을 반복적으로 실행합니다.

예제:

```js run
let i = 0;
do {
  alert( i );
  i++;
} while (i < 3);
```

이 구문 형식은 조건이 참 같은 값인지에 관계없이 반복문 본문을 **한 번 이상** 실행하려는 경우에만 사용해야합니다. 일반적으로 `while (…) {…}`과 같은 다른 형식이 선호됩니다.

## 반복문 "for"

`for` 반복문은 다른 반복문보다 더 복잡하지만 가장 일반적으로 사용되는 반복문 이기도합니다.

다음과 같이 보입니다.

```js
for (begin; condition; step) {
  // ... loop body ...
}
```

예시를 이용해 for 문을 분석해 봅시다. 아래 반복문은 `0`에서 `3`까지(`3`은 포함하지 않고) `i`에 대해 `alert(i)`를 실행합니다.

```js run
for (let i = 0; i < 3; i++) { // shows 0, then 1, then 2
  alert(i);
}
```

`for` 문을 부분별로 살펴봅시다.

| part  |          |                                                                            |
|-------|----------|----------------------------------------------------------------------------|
| begin | `i = 0`    | 반복이 실행되면 한번 실행합니다.                                     |
| condition | `i < 3`| 모든 반복문의 반복 전에 조건을 검사합니다. 거짓이면 반복문을 중지합니다.              |
| step| `i++`      | 각 반복에서 본문 이후, 조건 확인 전에 실행합니다. |
| body | `alert(i)`| 조건이 참 같은 값이면 반복해서 실행합니다.                         |

일반적인 반복문 알고리즘은 다음과 같이 작동합니다.

```
Run begin
→ (if condition → run body and run step)
→ (if condition → run body and run step)
→ (if condition → run body and run step)
→ ...
```

즉, `begin`은 한번만 실행하고 나서 다음 행위를 반복합니다. 각 `condition`을 테스트한 후 `body`와 `step`이 실행됩니다.

반복문을 처음 사용하는 경우, 예제로 돌아가서 종이에 단계별로 실행되는 방식을 재현해 보는게 도움이 될 수 있습니다.

위 예제의 경우에 정확히 무슨 일이 일어나는지 확인해봅시다.

```js
// for (let i = 0; i < 3; i++) alert(i)

// run begin
let i = 0
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// ...finish, because now i == 3
```

````smart header="인라인 변수 선언"
여기, "counter" 변수 `i`는 반목문 안에서 바로 선언됩니다. 이것을 "인라인(inline)" 변수 선언이라고 합니다. 이러한 변수는 반복문 내부에서만 볼 수 있습니다.

```js run
for (*!*let*/!* i = 0; i < 3; i++) {
  alert(i); // 0, 1, 2
}
alert(i); // error, no such variable
```

변수를 정의하는 대신 기존 변수를 사용할 수도 있습니다.

```js run
let i = 0;

for (i = 0; i < 3; i++) { // use an existing variable
  alert(i); // 0, 1, 2
}

alert(i); // 3, visible, because declared outside of the loop
```

````

### 건너뛰는 부분

`for`의 어떤 부분이라도 건너뛸 수 있습니다.

예를 들어, 반복문을 시작할 때 아무것도 하지 않아도 된다면 `begin`을 생략할 수 있습니다.

이것 처럼요:

```js run
let i = 0; // we have i already declared and assigned

for (; i < 3; i++) { // no need for "begin"
  alert( i ); // 0, 1, 2
}
```

`step` 부분을 제거할 수도 있습니다 :

```js run
let i = 0;

for (; i < 3;) {
  alert( i++ );
}
```

`for (; i < 3;)`은 반복문을 `while (i < 3)`과 동일하게 만듭니다.

실제로 `begin, condition, step`을 모두 제거하여`(;;)` 무한 루프를 만들 수 있습니다.

```js
for (;;) {
  // 무한 루프를 만듭니다.
}
```

두 개의 `for` 세미콜론 `;` 이 있어야합니다. 그렇지 않으면 구문 에러가 발생합니다.

## 반복문에서 빠져나오기

일반적으로 반복문의 조건이 거짓 같은 값이 되면 반복문은 종료됩니다.

그러나 특별한 `break` 지시문을 사용하여 언제든지 강제 종료할 수 있습니다.

예를 들어, 아래 반복문은 일련의 숫자를 사용자에게 묻고, 숫자를 입력하지 않으면 "breaking"(강제종료) 합니다.

```js
let sum = 0;

while (true) {

  let value = +prompt("Enter a number", '');

*!*
  if (!value) break; // (*)
*/!*

  sum += value;

}
alert( 'Sum: ' + sum );
```

`break` 지시문은 사용자가 빈 줄을 입력하거나 입력을 취소하면 `(*)` 라인에서 활성화됩니다. 이것은 반복문을 즉시 멈추고, 제어권를 반복문 이후 첫번째 라인에 넘깁니다. `alert`창을 보여줍니다.

"필요에 따른 무한 루프 + `break`" 조합은 다음 상황에 매우 적합합니다. 반복문의 조건을 시작부분이나 끝부분이 아니라 본문 중간 또는 여러 곳에서 체크해야 하는 상황에 적합합니다. 

## 다음 반복으로 진행 [#continue]

`continue` 지시어는 `break`의 "더 가벼운 버전"입니다. 전체 반복문을 멈추지 않습니다. 대신, 현재 반복을 중지하고 반복문이 새로운 반복을 시작하도록 합니다(조건이 허용하는 경우).

우리는 이것을 현재 반복을 마치고 다음 반복으로 넘어가고 싶을 때 사용할 수 있습니다.

아래 반복문은 `continue`를 사용하여 홀수 값만 출력합니다.

```js run no-beautify
for (let i = 0; i < 10; i++) {

  // if true, skip the remaining part of the body
  *!*if (i % 2 == 0) continue;*/!*

  alert(i); // 1, then 3, 5, 7, 9
}
```

`i`가 짝수 값인 경우, `continue` 지시어는 본문 실행을 중지하고 `for`문의 다음 반복(다음 숫자 포함하여)으로 제어권를 전달합니다. 따라서 `alert`는 홀수 값에 대해서만 호출됩니다.

````smart header="`continue` 지시어는 중첩을 줄이는데 도움이 됩니다."
홀수 값을 표시하는 루프는 다음과 같습니다.

```js
for (let i = 0; i < 10; i++) {

  if (i % 2) {
    alert( i );
  }

}
```

`continue`를 사용한 예시와 if 문만 사용한 예시가 동일한 홀수 값을 출력합니다. 확실히, 우리는 `continue`를 사용하는 대신 `if` 블록으로 코드를 감쌀 수 있습니다.

그러나 부작용으로 이것은 또 다른 레벨의 중첩 (중괄호 안의 `alert`호출)을 만들었습니다. `if` 내부의 코드가 너무 길어지면 전체 가독성이 떨어질 수 있습니다.
````

````warn header="No `break/continue` to the right side of '?'"
````warn header="'?'(삼항 연산자) 오른쪽에 `break/continue`은 안됩니다."
표현식이 아닌 문법(`break/continue`)는 삼항 연산자 `?`와 함께 사용할 수 없다는 것에 유의하세요. 특히 `break/continue`와 같은 지시어는 허용되지 않습니다.

예를 들어, 이 코드에 적용해 보겠습니다.

```js
if (i > 5) {
  alert(i);
} else {
  continue;
}
```

그리고 물음표를 사용해 다시 작성합니다.

```js no-beautify
(i > 5) ? alert(i) : *!*continue*/!*; // continue isn't allowed here
```

작동이 중지됩니다. 구문 에러가 있습니다.

이것은 `if`대신 물음표 연산자`?`를 사용하지 않는 또 다른 이유입니다.
````

## break/continue의 label

때때로 우리는 한 번에 여러 개의 중첩 반복문에서 벗어날 필요가 있습니다.

예를 들어, 아래 코드에서 `(0,0)`에서`(3,3)`까지 좌표`(i, j)`를 물으며 `i` 와 `j`를 반복합니다.

```js run no-beautify
for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // what if we want to exit from here to Done (below)?
  }
}

alert('Done!');
```

사용자가 입력을 취소하면 프로세스를 중지할 수 있는 방법이 필요합니다.

`input` 이후의 일반적인 `break`는 내부 루프 만 끊습니다. 이것으로 부족합니다. 레이블(label)로 특정 루프를 `break`할 수 있습니다.

*레이블(label)* 은 반복문 앞에 콜론이 있는 식별자입니다.
```js
labelName: for (...) {
  ...
}
```

아래 반복문의 `break <labelName>`구문은 바깥 for문의 레이블(label)로 탈출합니다.

```js run no-beautify
*!*outer:*/!* for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // if an empty string or canceled, then break out of both loops
    if (!input) *!*break outer*/!*; // (*)

    // do something with the value...
  }
}
alert('Done!');
```

In the code above, `break outer` looks upwards for the label named `outer` and breaks out of that loop.
위의 코드에서 `break outer`는`outer`라는 레이블을 위로보고 해당 루프에서 끊어집니다. 

So the control goes straight from `(*)` to `alert('Done!')`.

We can also move the label onto a separate line:

```js no-beautify
outer:
for (let i = 0; i < 3; i++) { ... }
```

The `continue` directive can also be used with a label. In this case, code execution jumps to the next iteration of the labeled loop.

````warn header="Labels do not allow to \"jump\" anywhere"
Labels do not allow us to jump into an arbitrary place in the code.

For example, it is impossible to do this:
```js
break label; // doesn't jumps to the label below

label: for (...)
```

A call to `break/continue` is only possible from inside a loop and the label must be somewhere above the directive.
````

## Summary

We covered 3 types of loops:

- `while` -- The condition is checked before each iteration.
- `do..while` -- The condition is checked after each iteration.
- `for (;;)` -- The condition is checked before each iteration, additional settings available.

To make an "infinite" loop, usually the `while(true)` construct is used. Such a loop, just like any other, can be stopped with the `break` directive.

If we don't want to do anything in the current iteration and would like to forward to the next one, we can use the `continue` directive.

`break/continue` support labels before the loop. A label is the only way for `break/continue` to escape a nested loop to go to an outer one.
