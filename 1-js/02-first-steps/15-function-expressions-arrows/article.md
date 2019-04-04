# 함수 표현식과 화살표 함수(Function expressions and arrows)

자바스크립트에서 함수는 값으로 취급됩니다. 다른 언어에서처럼 특별한 동작을 하는 "언어 구조"로 취급되지 않습니다.

이전 챕터에서 함수를 만들 때 썼던 문법은 *함수 선언문(Function Declaration)* 이라고 합니다:

```js
function sayHi() {
  alert( "Hello" );
}
```

이 문법 이외에도 함수를 만들 수 있는 다른 방법이 있습니다. *함수 표현식(Function Expression)* 입니다.

함수 표현식으로 함수를 생성해보겠습니다:

```js
let sayHi = function() {
  alert( "Hello" );
};
```

함수가 생성되고, 생성된 함수를 변수에 할당하였습니다. 일반적인 변수 할당과 마찬가지로 말이죠. 함수가 어떻게 정의되었는지 상관없이, 생성된 함수는 `sayHi`에 저장된 변수가 되었습니다.


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

마지막 줄에서 함수가 실행되지 않는다는 점에 주의하시기 바랍니다. `sayHi`옆에 괄호가 없기 때문입니다. 어떤 언어는 괄호 없이 함수 이름만 언급되어도 함수를 호출합니다. 하지만 자바스크립트는 그렇지 않습니다.

자바스크립트에서 함수는 값입니다. 따라서 함수도 값처럼 취급할 수 있습니다. 위의 코드에선 소스코드인 함수를 문자열로 취급하였습니다. 

함수는 특별한 값입니다. 그렇기 때문에 `sayHi()`와 같이 호출해서 쓸 수 있습니다.

특별한 값이긴 하지만, 그 본질은 값이기 때문에 다른 값처럼 여러 가지를 할 수 있습니다.

다른 변수에 함수를 복사해 할당할 수 있죠:

```js run no-beautify
function sayHi() {   // (1) 함수 생성
  alert( "Hello" );
}

let func = sayHi;    // (2) 복사

func(); // Hello     // (3) 복사한 함수를 실행 (정상적으로 작동함)!
sayHi(); // Hello    //     본래 함수도 역시 정상적으로 작동함
```

위 코드에서 어떤 일이 일어났는지 자세히 알아보도록 합시다:

1. `(1)`의 함수 선언문을 통해 함수를 생성합니다. 함수 선언문을 통해 생성된 함수는 자동으로 `sayHi`라는 변수에 저장됩니다.
2. `(2)` 에선  `sayHi`를 변수 `func`에 복사합니다.

    주의: `sayHi` 다음에 괄호가 없습니다. 만약 괄호가 있다면, `func = sayHi()` 가 되어 `sayHi()` *함수 호출의 결괏값*이 `func`에 저장될 것입니다. 의도한 `sayHi` *함수* 그 자체는 저장되지 않습니다.
3. 이젠 `sayHi()` 와 `func()`를 통해 함수를 호출할 수 있게 되었습니다.

함수 표현식으로 `sayHi`를 정의했던 걸 기억하시나요? 아래 코드의 첫 번째 줄과 같이 말이죠:

```js
let sayHi = function() { ... };

let func = sayHi;
// ...
```

함수 표현식으로 작성해도 똑같습니다. 함수 표현식을 사용하니 함수가 값이라는 게 좀 더 명확히 보이네요. 그렇지 않나요?


````smart header="끝에 세미콜론은 왜 있나요?"
함수 표현식의 끝에 왜 세미콜론 `;`이 있는지 궁금해할 수도 있겠네요. 함수 선언문에는 없는데 말이죠:

```js
function sayHi() {
  // ...
}

let sayHi = function() {
  // ...
}*!*;*/!*
```

이유는 간단합니다:
- `if { ... }`, `for {  }`, `function f { }`같이 중괄호로 만들어지는 코드 블록의 끝엔 `;`이 없어도 됩니다.
- 함수 표현식은 `let sayHi = ...;`과 같이 문(statement)안에서 사용됩니다. 값처럼 말이죠. 이건 코드 블록이 아닙니다. 모든 문의 끝은 세미콜론 `;` 으로 끝내는 것을 권장합니다. 이게 값이든 아니든 말이죠. 함수 표현식에 쓰인 세미콜론은 함수 표현식 때문에 붙여진 게 아니라, 문의 끝이기 때문에 붙여진 것입니다. 
````

## 콜백 함수(Callback functions)

함수를 값처럼 전달하고, 함수 표현식을 사용하는 예제를 좀 더 살펴보겠습니다. 

3개의 매개변수가 있는 함수 `ask(question, yes, no)`를 작성해보겠습니다:

`question`
: 문제를 담은 텍스트

`yes`
: 답이 "Yes" 일 경우 실행되는 함수

`no`
: 답이 "No" 일 경우 실행되는 함수

함수는 반드시 `question`를 이용해 질문을 해야 합니다. 질문 후, 사용자의 답변에 따라 `yes()` 나 `no()`를 호출합니다:

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

위 예제를 좀 더 짧게 줄여 쓰는 방법에 대해 알아보기 전에, 브라우저 환경(및 몇몇 서버 사이드 경우도)에선 이런 함수가 꽤 자주 쓰인다는 걸 알아두도록 합시다. 실제 쓰이는 방식과 위 예제에서의 차이는, 실제 상황에선 사용자와 상호작용이 단순히 `confirm`만으로 이뤄지는 게 아니라, 좀 더 복잡한 방법이 사용된다는 점입니다. 브라우저에서는 잘 꾸민 질문 창을 이용해 질문을 띄워줄 것입니다. 여기서 이야기하고자 하는 바와는 좀 다른 이야기이긴 하지만요.

**함수 `ask`의 인수는 *콜백 함수* 또는 그냥 *콜백*을 통해 호출됩니다.**

함수를 함수의 인자로 전달하고, 필요하다면 인수로 전달한 그 함수를 "나중에 호출(called back)"하는것이 콜백 함수의 개념입니다. 위 예에선, 사용자의 대답이 "yes" 일 때, `showOk`가 콜백이 되고, "no" 일 경우 `showCancel`가 콜백이 됩니다.

함수 표현식을 사용하면 같은 함수를 좀 더 짧게 쓸 수 있습니다.

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


위에선 함수를 `ask(...)` 호출 바로 안에서 선언하였습니다. 이름이 없는 함수이기 때문에 이 함수들을 *익명*함수라고 부릅니다. 이 익명 함수들은 (변수에 할당된 게 아니기 때문에)`ask`함수 외부에선 접근할 수 없습니다. 하지만 필요한 그 자리에 함수가 자리 잡고 있기 때문에 외부에서 접근하지 못해도 괜찮습니다.

이런 코드는 아주 자연스럽습니다. 이런 코드는 자바스크립트의 정신을 대변하기 때문입니다.


```smart header="함수는 \"동작\"을 대변하는 값입니다"
문자열이나 숫자 같은 일반적인 값은 *데이터*를 대변합니다.

함수는 하나의 *동작(action)*을 나타냅니다.

동작을 대변하는 함수를 여러 변수에 저장하고, 원할 때 실행할 수 있습니다.
```


## 함수 표현식 vs 함수 선언문

함수 표현식과 선언문의 차이에 대해 알아봅시다.

첫 번째로 문법입니다: 코드에서 어떻게 보이냐가 다릅니다.

- *함수 선언문:* 함수 내용은 함수 본문 안에서 독립된 문으로 작성됩니다.

    ```js
    // 함수 선언문
    function sum(a, b) {
      return a + b;
    }
    ```
- *함수 표현식:* 함수는 표현식(expression) 안에 쓰이거나, 다른 문법의 생성자(another syntax construct) 안에 쓰입니다. 아래에선 함수가 "할당 표현식"인 `=`의 우측에 쓰였습니다.
    
    ```js
    // Function Expression
    let sum = function(a, b) {
      return a + b;
    };
    ```

좀 더 미세한 차이는 자바스크립트 엔진에서 *언제* 함수를 생성하느냐에 있습니다. 

**A Function Expression is created when the execution reaches it and is usable from then on.**

실행 흐름이 `let sum = function…`와 같이 할당 표현식 우측에 도달 했을때, 함수가 생성되고, 이때부터 할당이나 호출 등이 가능합니다. 

하지만 함수 선언문은 조금 다릅니다.

**A Function Declaration is usable in the whole script/code block.**

In other words, when JavaScript *prepares* to run the script or a code block, it first looks for Function Declarations in it and creates the functions. We can think of it as an "initialization stage".

And after all of the Function Declarations are processed, the execution goes on.

따라서, 함수 선언문 방식으로 선언된 함수는 함수가 정의되지 않아도 호출할 수 있습니다.

예를 들어, 아래 코드는 에러 없이 작동합니다:

```js run refresh untrusted
*!*
sayHi("John"); // Hello, John
*/!*

function sayHi(name) {
  alert( `Hello, ${name}` );
}
```

`sayHi` 함수 선언문은 자바스크립트가 스크립트를 시작하려고 준비하는 과정에서 생성되기 때문에, 코드의 어디에서든 활용할 수 있습니다. 

...똑같은 함수를 함수 표현식으로 작성했다면, 작동하지 않습니다:

```js run refresh untrusted
*!*
sayHi("John"); // error!
*/!*

let sayHi = function(name) {  // (*) 마술은 일어나지 않습니다
  alert( `Hello, ${name}` );
};
```

함수 표현식은 실제 함수가 실행될 때 만들어집니다. 위 코드에서 `(*)`로 표시한 시점에서 말이죠. 늦게 생성됩니다.

**함수 선언문이 코드 블록 안에 있다면, 이 함수는 블록 안 어디서든 응용할 수 있습니다. 블록 밖에서는 안 되지만 말이죠.**

때때로, 블록 안에서만 필요한 지역 함수를 선언하는 게 편리한 경우가 있습니다. 하지만 이렇게 하면 나중에 문제의 소재가 있습니다.
Sometimes that's handy to declare a local function only needed in that block alone. But that feature may also cause problems.

예를 들어, 아래와 같이 런타임에 받은 `age` 변숫값에 따라 `welcome()` 함수를 정의해야 한다고 가정해 봅시다. 그리고 이 함수를 나중에 재사용해야 한다고 해봅시다.
For instance, let's imagine that we need to declare a function `welcome()` depending on the `age` variable that we get during runtime. And then we plan to use it some time later.

아래 코드는 작동하지 않습니다:
The code below doesn't work:

```js run
let age = prompt("What is your age?", 18);

// conditionally declare a function
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

이는, 함수 선언문은 함수가 선언된 코드 블록 안에서만 유효하기 때문입니다.
That's because a Function Declaration is only visible inside the code block in which it resides.

또 다른 예를 살펴보죠:
Here's another example:

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

  function welcome() {     //  age = 16일 때, 이 "welcome" 함수는 절대 생성되지 않습니다
    alert("Greetings!");
  }
}

// 여기는 중괄호 밖이기 때문에
// 중괄호 안에서 선언된 함수 선언문을 호출할 수 없습니다

*!*
welcome(); // Error: welcome is not defined
*/!*
```

What can we do to make `welcome` visible outside of `if`?

The correct approach would be to use a Function Expression and assign `welcome` to the variable that is declared outside of `if` and has the proper visibility.

Now it works as intended:

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

Or we could simplify it even further using a question mark operator `?`:

```js run
let age = prompt("What is your age?", 18);

let welcome = (age < 18) ?
  function() { alert("Hello!"); } :
  function() { alert("Greetings!"); };

*!*
welcome(); // ok now
*/!*
```


```smart header="When should you choose Function Declaration versus Function Expression?"
As a rule of thumb, when we need to declare a function, the first to consider is Function Declaration syntax, the one we used before. It gives more freedom in how to organize our code, because we can call such functions before they are declared.

It's also a little bit easier to look up `function f(…) {…}` in the code than `let f = function(…) {…}`. Function Declarations are more "eye-catching".

...But if a Function Declaration does not suit us for some reason (we've seen an example above), then Function Expression should be used.
```


## 화살표 함수(Arrow functions) [#arrow-functions]

화살표 함수를 사용하면 함수 선언문보다 간결한 문법으로 함수를 생성할 수 있습니다. 화살표 함수는 그 모양 때문에 붙은 이름입니다. 아래와 같이 말이죠:  


```js
let func = (arg1, arg2, ...argN) => expression
```

...이렇게 작성하면 `func` 함수가 만들어지고, 이 함수의 인자는 `arg1..argN`가 됩니다. 그리고 이 함수는 화살표 우측의 `표현식(expression)`을 평가하고 난 다음 그 결과를 반환합니다.

위 화살표 함수는 아래와 같이 작성된 코드와 같은 기능을 합니다:

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

인수가 하나밖에 없다면, 괄호를 생략할 수 있습니다. 문법은 더 짧아지죠.

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

처음엔 화살표 함수가 익숙지 않고 가독성이 떨어지지만, 구조가 눈에 익기 시작하면 금방 적응할 수 있습니다.

화살표 함수는 한 줄짜리 간단한 동작을 함수로 작성할 때 많은 단어를 쓰지 않아도 되기 때문에 아주 유용합니다.
They are very convenient for simple one-line actions, when we're just too lazy to write many words.

```smart header="Multiline arrow functions"

위에 예제로 쓰인 함수들은 `=>` 왼쪽의 인수를 받고, 이를 이용해 `=>` 우측의 표현식을 평가합니다.

가끔 함수 내에서 이보다 더 복잡한 일이 필요할 때가 있습니다. 여러 개의 표현식이나 문이 필요한 경우같이 말이죠. 화살표 함수 역시 당연히 이런 복잡한 경우를 지원합니다. 다만, 복수 라인이 필요한 경우는 중괄호 안에 그 코드를 넣어주어야 합니다. 그리고 난 다음 중괄호 안에서 `return` 문을 사용해 결괏값을 반환하면 됩니다. 

아래와 같이 말이죠:

```js run
let sum = (a, b) => {  // 함수에 여러 줄의 코드가 필요한 경우 중괄호를 사용합니다
  let result = a + b;
*!*
  return result; // 중괄호를 사용했다면, return 키워드를 써 결괏값을 반환해줍니다
*/!*
};

alert( sum(1, 2) ); // 3
```

```smart header="더 남았습니다"
이 챕터에선 간결성에 집중하여 화살표 함수를 살펴보았습니다. 하지만 이게 끝이 아닙니다! 화살표 함수는 이 외에도 다른 흥미로운 기능을 제공합니다. 이에 대해선 <info:arrow-functions> 챕터에서 더 살펴보도록 하겠습니다.

우선은, 한 줄짜리 동작과 콜백에 대해서만 알아보았습니다.
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