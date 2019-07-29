# 함수 표현식과 화살표 함수

자바스크립트에서 함수는 특별한 종류의 값입니다. 다른 언어에서처럼 "특별한 동작을 하는 구조"가 아닙니다.

이전 챕터에서 함수를 만들 때 썼던 문법은 *함수 선언문(Function Declaration)* 이라고 합니다.

```js
function sayHi() {
  alert( "Hello" );
}
```

함수 선언문 외에도 *함수 표현식(Function Expression)*을 사용하면 함수를 만들 수 있습니다.

함수 표현식으로 함수를 생성해보겠습니다.

```js
let sayHi = function() {
  alert( "Hello" );
};
```

위 코드에서 함수를 생성하고 변수에 값을 할당하는 것처럼 함수를 변수에 할당해보았습니다. 함수의 선언 방식과 관계없이 이렇게 함수를 변수에 할당할 수 있습니다. 위에서 생성한 함수는 이제 변수 `sayHi`에 저장된 값이 되었습니다.


위 코드 샘플을 간단히 말로 설명하면 다음과 같습니다: "함수를 만들고 그 함수를 변수 `sayHi`에 할당하기"

`alert`를 이용하면 함수를 출력할 수도 있습니다:

```js run
function sayHi() {
  alert( "Hello" );
}

*!*
alert( sayHi ); // 함수 코드가 보임
*/!*
```

마지막 줄에서 함수가 실행되지 않는다는 점에 주의하시기 바랍니다. `sayHi`옆에 괄호가 없기 때문입니다. 어떤 언어에선 괄호 없이 함수 이름만 언급해도 함수를 실행합니다. 하지만 자바스크립트에선 그렇지 않습니다.

자바스크립트에서 함수는 값입니다. 따라서 함수도 값처럼 다룹니다. 위의 코드에선 소스코드인 함수를 문자열 형태로 나타내었습니다.

<<<<<<< HEAD
함수는 `sayHi()`와 같이 호출해서 쓸 수 있다는 점에서 특별한 값입니다.
=======
Surely, a function is a special values, in the sense that we can call it like `sayHi()`.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

하지만 그 본질은 값이기 때문에 값을 다룰 때 하는 여러 가지를 함수에도 할 수 있습니다.

함수를 복사해 다른 변수에 할당할 수 있습니다:

```js run no-beautify
function sayHi() {   // (1) 함수 생성
  alert( "Hello" );
}

let func = sayHi;    // (2) 복사

func(); // Hello     // (3) 복사한 함수를 실행 (정상적으로 실행됨)!
sayHi(); // Hello    //     본래 함수도 역시 정상적으로 실행됨
```

위 코드에서 어떤 일이 일어났는지 자세히 알아보도록 합시다:

<<<<<<< HEAD
1. `(1)`의 함수 선언문을 통해 함수를 생성하고, 생성한 함수를 `sayHi`라는 변수에 저장됩니다.
2. `(2)` 에선  `sayHi`를 변수 `func`에 복사합니다.

    주의: `sayHi` 다음에 괄호가 없습니다. 만약 괄호가 있다면, `func = sayHi()` 가 되어 `sayHi()` *함수 호출의 결괏값*이 `func`에 저장될 것입니다. `sayHi` *함수* 그 자체는 저장되지 않습니다.
3. 이젠 `sayHi()` 와 `func()`를 통해 함수를 호출할 수 있게 되었습니다.
=======
1. The Function Declaration `(1)` creates the function and puts it into the variable named `sayHi`.
2. Line `(2)` copies it into the variable `func`. Please note again: there are no parentheses after `sayHi`. If there were, then `func = sayHi()` would write  *the result of the call* `sayHi()` into `func`, not *the function* `sayHi` itself.
3. Now the function can be called as both `sayHi()` and `func()`.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

아래 코드의 첫 번째 줄처럼 함수 표현식을 사용해 `sayHi`를 정의할 수도 있습니다:

```js
let sayHi = function() { ... };

let func = sayHi;
// ...
```

이렇게 함수 표현식으로 함수를 작성해도 동작하는 건 똑같습니다. 함수 표현식을 사용하니 함수가 값이라는 게 좀 더 명확히 보이네요. 그렇지 않나요?


````smart header="끝에 세미 콜론은 왜 있나요?"
함수 표현식의 끝에 왜 세미 콜론 `;`이 있는지 궁금해할 수도 있겠네요. 함수 선언문에는 없는데 말이죠:

```js
function sayHi() {
  // ...
}

let sayHi = function() {
  // ...
}*!*;*/!*
```

<<<<<<< HEAD
이유는 간단합니다:
- `if { ... }`, `for {  }`, `function f { }`같이 중괄호로 만들어지는 코드 블록의 끝엔 `;`이 없어도 됩니다.
- 함수 표현식은 `let sayHi = ...;`과 같은 문(statement)안에서 값으로 사용됩니다. 코드 블록이 아닙니다. 값이 무엇이든 상관없이 모든 문은 세미 콜론 `;`으로 끝내는 것을 권장합니다. 함수 표현식에 쓰인 세미 콜론은 함수 표현식 때문에 붙여진 게 아니라, 문의 끝이기 때문에 붙여진 것입니다. 
=======
The answer is simple:
- There's no need for `;` at the end of code blocks and syntax structures that use them like `if { ... }`, `for {  }`, `function f { }` etc.
- A Function Expression is used inside the statement: `let sayHi = ...;`, as a value. It's not a code block, but rather an assignment. The semicolon `;` is recommended at the end of statements, no matter what is the value. So the semicolon here is not related to the Function Expression itself, it just terminates the statement.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74
````

## 콜백 함수(Callback functions)

함수를 값처럼 전달하고, 함수 표현식을 사용하는 예제를 좀 더 살펴보겠습니다. 

아래와 같은 3개의 매개변수를 받는 함수 `ask(question, yes, no)`를 작성해보겠습니다:

`question`
: 문제를 담은 텍스트

`yes`
: 답이 "Yes" 일 경우 실행되는 함수

`no`
: 답이 "No" 일 경우 실행되는 함수

함수는 반드시 `question(질문)`을 해야 합니다. 그 후, 사용자의 답변에 따라 `yes()` 나 `no()`를 호출합니다:

```js run
*!*
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}
*/!*

function showOk() {
  alert( "You agreed." );
}

function showCancel() {
  alert( "You canceled the execution." );
}

// 사용법: 함수 showOk와 showCancel가 ask 함수의 인수로 전달됨
ask("Do you agree?", showOk, showCancel);
```

위 예제를 좀 더 짧게 줄여 쓰는 방법에 대해 알아보기 전에, 브라우저 환경(및 몇몇 서버 사이드 환경에서도)에선 이런 함수가 꽤 자주 쓰인다는 걸 알아두도록 합시다. 실 서비스에서 구현하는 방식과 위 예제의 차이는, 실 서비스에선 사용자와의 상호작용이 단순히 `confirm`만으로 이뤄지는 게 아니라, 좀 더 복잡한 방법식으로 이뤄진다는 점입니다. 브라우저환경에선 함수가 질문창을 잘 꾸미는 역할도 담당합니다. 이 튜토리얼의 범주에선 벗어난 이야기긴 합니다.

**함수 `ask`의 인수는 *콜백 함수* 또는 그냥 *콜백*을 통해 호출됩니다.**

함수를 함수의 인자로 전달하고, 필요하다면 인수로 전달한 그 함수를 "나중에 호출(called back)"하는것이 콜백 함수의 개념입니다. 위 예에선, 사용자의 대답이 "yes" 일 때, `showOk`가 콜백이 되고, "no" 일 경우 `showCancel`가 콜백이 됩니다.

함수 표현식을 사용하면 같은 함수를 좀 더 짧게 쓸 수 있습니다:

```js run no-beautify
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

*!*
ask(
  "Do you agree?",
  function() { alert("You agreed."); },
  function() { alert("You canceled the execution."); }
);
*/!*
```


위에선 함수를 `ask(...)` 호출 안에서 바로 선언하였습니다. 이렇게 이름이 없는 함수는 *익명*함수라고 부릅니다. 익명 함수는 (변수에 할당된 게 아니기 때문에)`ask` 외부에선 접근할 수 없습니다. 이 예제에선 이렇게 구현하길 원한 것이기 때문에 괜찮습니다.

이런 코드는 스크립트에서 매우 자연스레 만나볼 수 있으며, 자바스크립트의 정신을 대변하는 코드입니다.


```smart header="함수는 \"동작\"을 나타내는 값입니다"
문자열이나 숫자 등의 일반적인 값들은 *데이터*를 나타냅니다.

함수는 하나의 *동작(action)*을 나타냅니다.

변수를 통해 동작을 대변하는 함수를 전달하고, 원할 때 이 함수를 실행할 수 있습니다.
```


## 함수 표현식 vs 함수 선언문

함수 표현식과 선언문의 차이에 대해 알아봅시다.

First, the syntax: how to differentiate between them in the code.

- *함수 선언문:* 함수는 메인 코드 중간에 독립된 문의 형태로 선언됩니다

    ```js
    // 함수 선언문
    function sum(a, b) {
      return a + b;
    }
    ```
- *Function Expression:* a function, created inside an expression or inside another syntax construct. Here, the function is created at the right side of the "assignment expression" `=`:
    
    ```js
    // 함수 표현식
    let sum = function(a, b) {
      return a + b;
    };
    ```

자바스크립트 엔진이 *언제* 함수를 생성하는지를 보면 더 미세한 차이를 발견할 수 있습니다.

**함수 표현식에 의해 선언된 경우는 실행이 표현식에 도달할 때 함수가 생성됩니다. 그리고 이 시점부터만 함수를 사용할 수 있습니다.**

<<<<<<< HEAD
실행 흐름이 `let sum = function…`와 같은 코드의 우측(함수 표현식)에 도달 했을때 함수가 생성되고, 이때부터 할당이나 호출 등을 사용할 수 있죠.
=======
**A Function Expression is created when the execution reaches it and is usable only from that moment.**
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

하지만 함수 선언문은 조금 다릅니다.

**함수 선언문은 선언 전에 호출할 수 있습니다.**

<<<<<<< HEAD
예를 들어, 전역 함수 선언문은 스크립트 전체에서 볼 수 있습니다. 전역 스코프, 지역 스코프 상관없이 말이죠.

이게 가능한 이유는 자바스크립트 내부 알고리즘 때문입니다. 자바스크립트는 스크립트 실행을 준비할 때, 먼저 전역 함수 선언문이 있는지를 찾고, 전역 함수 선언문이 있는 경우 해당 함수를 생성합니다. 이 시기를 "초기화 단계(initialization stage)"라고 생각하시면 됩니다.

이렇게 모든 함수 선언문이 처리되고 나서야 코드가 실행됩니다. 따라서 스크립트 어디서든 이런 함수에 접근할 수 있습니다.

=======
**A Function Declaration can be called earlier than it is defined.**

For example, a global Function Declaration is visible in the whole script, no matter where it is.

That's due to internal algorithms. When JavaScript prepares to run the script, it first looks for global Function Declarations in it and creates the functions. We can think of it as an "initialization stage".

And after all Function Declarations are processed, the code is executed. So it has access to these functions.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

이런 과정 때문에 아래 코드는 에러 없이 동작합니다.

```js run refresh untrusted
*!*
sayHi("John"); // Hello, John
*/!*

function sayHi(name) {
  alert( `Hello, ${name}` );
}
```

`sayHi` 함수 선언문은 자바스크립트가 스크립트를 실행하려고 준비하는 과정에서 생성되기 때문에, 코드의 어디에서든 활용할 수 있습니다.

<<<<<<< HEAD
함수 표현식에선 이런 방식이 통하지 않습니다.
=======
...If it were a Function Expression, then it wouldn't work:
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

```js run refresh untrusted
*!*
sayHi("John"); // error!
*/!*

let sayHi = function(name) {  // (*) 마술은 일어나지 않습니다
  alert( `Hello, ${name}` );
};
```

<<<<<<< HEAD
함수 표현식은 실행 흐름이 표현식에 다다랐을 때 만들어집니다. 위 코드에서 `(*)`로 표시한 라인에서 말이죠. 함수 표현식으로 선언한 함수는 함수 표현식으로 생성한 함수보다 뒤늦게 만들어집니다.

**엄격 모드에서, 코드 블록 안에 함수 선언문을 작성한 경우 해당 함수는 블록 내 어디에서든 호출할 수 있습니다. 하지만 블록 밖에선 이 함수에 접근할 수 없습니다.**
=======
Function Expressions are created when the execution reaches them. That would happen only in the line `(*)`. Too late.

Another special feature of Function Declarations is their block scope.

**In strict mode, when a Function Declaration is within a code block, it's visible everywhere inside that block. But not outside of it.**
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

변수 `age`에 따라 함수 `welcome()`을 다르게 정의해야 한다고 가정해 봅시다. 이때 `age`는 런타임에 결정된다고 해보죠. 그리고 이 함수를 나중에 재사용한다고 해봅시다.

<<<<<<< HEAD
함수 선언 방식으로 함수 선언문을 사용하면 의도한 대로 코드가 동작하지 않습니다.
=======
If we use Function Declaration, it won't work as intended:
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

```js run
let age = prompt("What is your age?", 18);

// 조건에 따라 함수를 선언함
if (age < 18) {

  function welcome() {
    alert("Hello!");
  }

} else {

  function welcome() {
    alert("Greetings!");
  }

}

// ...use it later
*!*
welcome(); // Error: welcome is not defined
*/!*
```

함수 선언문은 함수가 선언된 코드 블록 안에서만 유효하기 때문에 이런 에러가 발생합니다.

또 다른 예를 살펴보죠:

```js run
let age = 16; // 16을 저장했다 가정합시다

if (age < 18) {
*!*
  welcome();               // \   (runs)
*/!*
                           //  |
  function welcome() {     //  |  
    alert("Hello!");       //  |  함수 선언문은 함수가 선언된 블록 내
  }                        //  |  어디에서든 유효합니다
                           //  |
*!*
  welcome();               // /   (runs)
*/!*

} else {

<<<<<<< HEAD
  function welcome() {     //  age = 16일 때, 이 "welcome" 함수는 절대 생성되지 않습니다
=======
  function welcome() {    
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74
    alert("Greetings!");
  }
}

// 여기는 중괄호 밖이기 때문에
// 중괄호 안에서 선언된 함수 선언문을 호출할 수 없습니다.

*!*
welcome(); // Error: welcome is not defined
*/!*
```

`if` 바깥에서 `welcome` 함수를 호출할 수 있는 방법은 없는 걸까요?

함수 표현식으로 `welcome` 함수를 정의하고, 이 함수를 `if` 바깥에서 선언한 변수에 할당하면 가능합니다. 

<<<<<<< HEAD
이제 의도한 대로 코드가 작동할 것입니다:
=======
This code works as intended:
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

```js run
let age = prompt("What is your age?", 18);

let welcome;

if (age < 18) {

  welcome = function() {
    alert("Hello!");
  };

} else {

  welcome = function() {
    alert("Greetings!");
  };

}

*!*
welcome(); // ok now
*/!*
```

물음표 연산자 `?`를 사용하면 위 코드를 좀 더 단순화할 수 있습니다:

```js run
let age = prompt("What is your age?", 18);

let welcome = (age < 18) ?
  function() { alert("Hello!"); } :
  function() { alert("Greetings!"); };

*!*
welcome(); // ok now
*/!*
```


<<<<<<< HEAD
```smart header="함수 선언문과 함수표현식 중 어느 걸 선택해야 하나요?"
제 오랜 경험에 따르면 함수 선언문을 먼저 고려하는 걸 추천합니다. 함수 선언문으로 함수를 정의하면, 함수를 선언하기 전에 호출할 수 있으므로 코드 구성을 좀 더 자유롭게 할 수 있습니다.

함수 선언문을 사용하면 가독성도 좋습니다. 코드에서 `let f = function(…) {…}`보다 `function f(…) {…}` 을 찾는 게 더 쉽죠. 함수 선언문 방식이 "눈길을 사로잡기" 좋습니다.

그러나 어떤 이유 때문에 함수 선언 방식이 적합하지 않거나, (위 예제와 같이) 조건에 따라 함수를 선언해야 한다면 함수 표현식을 사용해야 합니다.
=======
```smart header="When to choose Function Declaration versus Function Expression?"
As a rule of thumb, when we need to declare a function, the first to consider is Function Declaration syntax. It gives more freedom in how to organize our code, because we can call such functions before they are declared.

That's also better for readability, as it's easier to look up `function f(…) {…}` in the code than `let f = function(…) {…}`. Function Declarations are more "eye-catching".

...But if a Function Declaration does not suit us for some reason, or we need a conditional declaration (we've just seen an example), then Function Expression should be used.
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74
```


## 화살표 함수(Arrow functions) [#arrow-functions]

간단하고 간결한 구문으로 함수를 만들 수 있는 문법이 하나 더 있습니다. 이 문법이 함수 표현식보다 나을 때도 있습니다. 이 방법을 화살표 함수라고 부릅니다. 이름은 모양을 차용해 지어졌습니다:  


```js
let func = (arg1, arg2, ...argN) => expression
```

위 코드는 `func` 함수를 만들어줍니다. 함수의 인자로는 `arg1..argN`를 받습니다. 이 함수는 화살표 우측의 `표현식(expression)`을 평가하고 난 다음 그 결과를 반환합니다.

위 화살표 함수는 아래 코드와 같은 기능을 합니다:

```js
let func = function(arg1, arg2, ...argN) {
  return expression;
};
```

...하지만 좀 더 간결하죠.

화살표 함수의 예를 하나 더 살펴봅시다:

```js run
let sum = (a, b) => a + b;

/* 위 화살표 함수는 아래 함수의 축약 버전 입니다:

let sum = function(a, b) {
  return a + b;
};
*/

alert( sum(1, 2) ); // 3

```

<<<<<<< HEAD
인수가 하나밖에 없다면, 괄호를 생략할 수 있습니다. 더 짧게 함수를 작성할 수 있습니다.
=======
If we have only one argument, then parentheses around parameters can be omitted, making that even shorter:
>>>>>>> 34e9cdca3642882bd36c6733433a503a40c6da74

```js run
// 아래 두 함수는 같습니다
// let double = function(n) { return n * 2 }
*!*
let double = n => n * 2;
*/!*

alert( double(3) ); // 6
```

인수가 하나도 없다면, 괄호 안엔 아무것도 없어야 합니다(괄호는 생략하면 안 됩니다):

```js run
let sayHi = () => alert("Hello!");

sayHi();
```

화살표 함수는 함수 표현식과 같은 방법으로 사용할 수 있습니다.

아래는 위에서 작성한 `welcome()` 함수를 화살표 함수를 이용하여 재작성한 코드입니다:

```js run
let age = prompt("What is your age?", 18);

let welcome = (age < 18) ?
  () => alert('Hello') :
  () => alert("Greetings!");

welcome(); // ok now
```

처음엔 화살표 함수가 익숙지 않아 가독성이 떨어질 수 있습니다. 하지만 구조가 눈에 익기 시작하면 금방 적응할 수 있습니다.

화살표 함수는 한 줄짜리 간단한 동작을 함수로 작성할 때 아주 유용합니다. 많은 단어를 쓰지 않아도 되기 때문이죠.

```smart header="여러 줄의 본문으로 구성된 화살표 함수"

위에 예제로 쓰인 함수들은 `=>` 왼쪽의 인수를 받고, 이를 이용해 `=>` 우측의 표현식을 평가합니다.

가끔 함수 내에서 이보다 더 복잡한 일이 필요할 때가 있습니다. 여러 개의 표현식이나 문이 필요한 경우같이 말이죠. 화살표 함수 역시 당연히 이런 복잡한 경우를 지원합니다. 다만, 여러줄의 코드가 필요한 경우는 중괄호를 써서 그 안에 코드를 넣어주어야 합니다. 그리고 `return` 문을 사용해 결괏값을 반환하면 됩니다.

아래와 같이 말이죠:

```js run
let sum = (a, b) => {  // 중괄호는 여러줄의 본문이 시작됨을 알려줍니다
  let result = a + b;
*!*
  return result; // 중괄호를 사용했다면, return 키워드를 써 결괏값을 반환해줍니다
*/!*
};

alert( sum(1, 2) ); // 3
```

```smart header="더 남았습니다"
이 챕터에선 화살표 함수를 간단히 살펴보았습니다. 하지만 이게 끝이 아닙니다! 화살표 함수엔 여기서 소개한 기능 이외에도 다른 흥미로운 기능이 있습니다. 이에 대해선 <info:arrow-functions> 챕터에서 더 살펴보도록 하겠습니다.

여기선 한 줄짜리 동작과 콜백에 대해서만 알아보았습니다.
```

## 요약

- 함수는 값입니다. 그렇기 때문에 코드 어디서든 함수를 할당, 복사, 선언하는 게 가능합니다.
- 함수가 독립된 문 형태로 선언되면, "함수 선언문" 방식으로 함수를 생성했다고 합니다.
- 함수가 표현식의 일부로 선언되면, "함수 표현식" 방식으로 함수가 생성되었다고 합니다. 
- 함수 선언문은 코드 블록이 실행되기 전에 처리됩니다. 따라서 블록 어디서든 활용 가능합니다. 
- 함수 표현식은 실행 흐름이 표현식에 다다랐을 때 만들어집니다.


함수를 선언해야 한다면 대부분의 경우 함수 선언문 방식을 선호합니다. 함수 선언문 이전에도 함수를 활용할 수 있기 때문입니다. 이런 특징은 코드를 유연하게 구성할 수 있도록 해줍니다. 이 외에 읽기 쉽다는 장점도 있습니다.

그렇기 때문에 함수 선언문을 사용해 함수를 생성하는 게 부적합할 경우만, 함수 표현식을 사용해야 합니다. 이번 챕터에서 이런 경우를 몇 가지 알아보았는데, 다음 챕터에서 좀 더 살펴보도록 하겠습니다.

화살표 함수는 몸체가 한 줄인 함수를 작성할 때 편리합니다. 두 가지 방법으로 응용할 수 있습니다. 

1. 중괄호 없이: `(...args) => expression` -- 화살표 오른쪽에 표현식이 옵니다: 함수는 이 표현식을 평가하고, 결괏값을 반환해 줍니다.
2. 중괄호와 함께: `(...args) => { body }` -- 중괄호를 사용하면 함수 내에 복수 라인의 코드를 작성할 수 있습니다. 하지만 이 경우는 반드시 `return` 키워드와 함께 결괏값을 명기해 주어야 합니다.
