# 여러 가지 변수

대부분의 경우 자바스크립트 애플리케이션은 정보를 갖고 작업해야 합니다. 여기 두 예제가 있습니다.:
1. 온라인 쇼핑몰 -- 판매 중인 상품이나 쇼핑 카트 등의 정보
2. 채팅 애플리케이션 -- 사용자, 메시지, 그 외의 더 많은 정보

변수는 이러한 정보를 저장하기 위해 사용됩니다.

## 변수(variable)

[변수(variable)](https://en.wikipedia.org/wiki/Variable_(computer_science)) 는 데이터를 저장하기 위해 "이름을 붙인 저장소" 입니다. 우리는 상품, 방문객, 그리고 또 다른 데이터를 저장하기 위해 변수를 사용할 수 있습니다.

자바스크립트에서 변수를 생성하기 위해서는 `let` 키워드를 사용해야 합니다.

아래 문은 "message"라는 이름을 가진 변수를 생성(즉, *선언* 또는 *정의*)합니다.

```js
let message;
```

이제 우리는 할당 연산자인 `=`를 통해 이 변수 안에 어떤 데이터를 저장할 수 있습니다.:

```js
let message;

*!*
message = 'Hello'; // 문자열을 저장합니다.
*/!*
```

이 문자열은 이제 변수로 연결되어 메모리 영역에 저장되었습니다. 우리는 변수명을 통해 이 문자열에 접근할 수 있습니다.:

```js run
let message;
message = 'Hello!';

*!*
alert(message); // 변수가 저장한 값을 보여줍니다.
*/!*
```

간결하게 변수 선언과 할당을 한 줄에 작성할 수 있습니다.:

```js run
let message = 'Hello!'; // 변수를 정의하고 값을 할당합니다.

alert(message); // Hello!
```

한 줄에 여러 변수를 선언할 수도 있습니다.:

```js no-beautify
let user = 'John', age = 25, message = 'Hello';
```

이렇게 작성하면 좀 더 코드가 짧아 보이지만, 권장하진 않습니다. 가독성을 위해, 한 변수는 한 줄에 작성해주세요.

여러 줄에 걸쳐 변수를 선언하면 좀 더 코드가 길어 보이지만, 읽기엔 편합니다.:

```js
let user = 'John';
let age = 25;
let message = 'Hello';
```

어떤 사람들은 이런 방식으로 많은 변수를 작성하기도 합니다.:
```js no-beautify
let user = 'John',
  age = 25,
  message = 'Hello';
```

...또는 심지어 "쉼표가 먼저 오는" 방식으로 작성하기도 합니다.:

```js no-beautify
let user = 'John'
  , age = 25
  , message = 'Hello';
```

기술적으로 보면, 이 모든 방식은 같은 작업을 하고 있습니다. 그러므로 이것은 개인의 취향과 미적 감각의 문제입니다.

````smart header="`let` 대신 `let`"
여러분은 오래전에 작성된 스크립트에서 `let` 대신 `var`라는 다른 키워드를 발견했을지도 모릅니다.:

```js
*!*var*/!* message = 'Hello';
```

`var` 키워드는 *거의* `let`과 같습니다. 동일하게 변수를 선언하지만, 약간 다른, "오래된" 방식을 사용합니다.

`let`과 `var` 사이에는 미묘한 차이점이 존재합니다. 하지만 우리에게는 아직 이런 차이점은 중요하지 않습니다. 이후 <info:var> 주제에서 이에 대해 자세히 다루겠습니다.

````

## 현실 속의 비유

자료를 보관하고 있고 그 위에는 이름 스티커가 붙여진 "상자"를 떠올리면 "변수"의 개념을 쉽게 이해할 수 있습니다.

예를 들어, `message` 변수는 `"message"`라는 라벨이 붙여져 있고 그 안엔 `"Hello!"` 라는 값을 담은 상자로 생각할 수 있습니다.:

![](variable.png)


우리는 상자 안에 어떤 값이나 넣을 수 있습니다.

원하는 만큼 값을 변경할 수도 있습니다.:


We can also change it as many times as we want:
```js run
let message;

message = 'Hello!';

message = 'World!'; // 값이 변경되었습니다.

alert(message);
```

값이 변경되면 이전 값은 변수로부터 제거됩니다.:

![](variable-change.png)

두 변수를 선언하고 한 변수의 데이터를 다른 변수에 복사할 수도 있습니다.

```js run
let hello = 'Hello world!';

let message;

*!*
// hello의 'Hello world' 값을 message에 복사합니다.
message = hello;
*/!*

// 이제 두 변수는 같은 데이터를 지니고 있습니다.
alert(hello); // Hello world!
alert(message); // Hello world!
```

```smart header="함수형 언어"
변수값 변경을 금지하는 [함수형(functional)](https://en.wikipedia.org/wiki/Functional_programming) 프로그래밍 언어가 존재한다는 사실이 흥미로울 수도 있습니다. 예를 들면 [스칼라(Scala)](http://www.scala-lang.org/) 와 [얼랭(Erlang)](http://www.erlang.org/) 이 있습니다.

이 언어들에서는, 한 번 값이 "상자 안에" 저장되면 그 값은 영원히 그곳에 유지됩니다. 또 다른 값을 저장하고 싶다면 새로운 상자를 만들어야(새 변수를 선언해야)만 합니다. 이전 변수를 재사용할 수 없습니다.

처음 봤을 땐 좀 이상해 보일 수 있지만, 이들은 중대한 개발에 상당히 적합한 언어입니다. 더 나아가, 이런 제약이 어떤 이점을 부여하는 병렬 계산과 같은 영역들이 있습니다. 이런 언어를 (곧 사용할 계획이 없을지라도) 공부하는 것은 시야를 넓히는 데 권장합니다.

## 변수 명명법 [#variable-naming]

자바스크립트에는 변수명에 두 가지 제약이 존재합니다.

1. 변수명에는 오직 문자, 숫자, `$`와 `_` 기호만 올 수 있습니다.
2. 첫 글자는 숫자가 될 수 없습니다.

유효한 변수명의 예시입니다.:

```js
let userName;
let test123;
```

변수명이 여러 단어를 포함할 땐, [카멜 케이스(camelCase)](https://en.wikipedia.org/wiki/CamelCase) 가 흔히 사용됩니다. 즉, 단어가 차례대로 놓이는데 각 단어는 대문자로 시작합니다.: `myVeryLongName`.

흥미로운 사실은 -- 달러 기호 `'$'` 와 언더스코어 `'_'` 는 변수명에 사용될 수 있습니다. 이들은 문자처럼 특별한 의미가 없는 일반적인 기호입니다.

이런 변수명도 가능합니다.:

```js run untrusted
let $ = 1; // "$"라는 이름의 변수를 선언합니다.
let _ = 2; // "_"라는 이름의 변수를 선언합니다.

alert($ + _); // 3
```

잘못된 변수명의 예시는 다음과 같습니다.:

```js no-beautify
let 1a; // 숫자로 시작해선 안됩니다.

let my-name; // 하이픈 '-'은 변수명에 올 수 없습니다.
```

```smart header="대소문자 구별"
`apple`와 `AppLE`라는 이름을 가진 변수는 -- 두 개의 다른 변수입니다.


````smart header="영어가 아닌 문자도 가능하지만 권장되지 않습니다."
다음과 같이 키릴 문자 또는 심지어 상형문자를 포함한 어떤 언어든지 사용 가능합니다:

```js
let имя = '...';
let 我 = '...';
```

기술적으로 이 코드에는 에러가 없으며 이 변수명들은 가능합니다. 그러나 변수명으로 영어를 사용하는 것이 국제적 관습입니다. 비록 우리가 짧은 스크립트를 작성하고 있지만, 앞으로 길게 봐야 합니다. 다른 나라의 사람들이 우리의 스크립트를 볼지도 모릅니다.
````

````warn header="예약어"
언어 자체에 의해 사용되어 변수명으로 사용할 수 없는 [예약어 목록](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords)이 있습니다. 

예를 들어 `let`, `class`, `return`, `function`과 같은 단어들이 예약어입니다.

아래 코드는 문법 에러를 발생시킵니다.:

```js run no-beautify
let let = 5; // "let"을 변수명으로 사용할 수 없으므로 에러!
let return = 5; // "return"을 변수명으로 사용할 수 없으므로 에러!
```
````

````warn header="`use strict` 없이 할당하기"

보통 우리는 변수를 사용하기 전에 먼저 변수를 정의해야 합니다. 그러나 예전에는 `let` 없이 단순한 값 할당에 의해 변수를 생성하는 것이 기술적으로 가능했습니다. `use strict`를 쓰지 않으면 지금도 가능한 일입니다. 과거 스크립트와의 호환성을 위해 이 방식이 사용됩니다.

```js run no-strict
// 주의: 이 예제에는 "use strict"가 없습니다.

num = 5; // 변수 "num"이 존재하지 않았다면 생성됩니다.

alert(num); // 5
```

이것은 나쁜 관습입니다. 엄격 모드에서는 에러를 일으킬 것이기 때문이죠.:

```js
"use strict";

*!*
num = 5; // 에러: num은 정의되지 않았습니다.
*/!*
```
````

## 상수

변함없는 (변화하지 않는) 변수를 선언하기 위해서는 `let` 대신 `const`를 사용할 수 있습니다.:

```js
const myBirthday = '18.04.1982';
```

`const`를 통해 선언된 변수를 "상수"라고 부릅니다. 상수는 변하지 않습니다. 상수를 변경하려고 하면 에러가 발생할 것입니다.:

```js run
const myBirthday = '18.04.1982';

myBirthday = '01.01.2001'; // 에러, 상수를 재할당할 수 없습니다!
```

프로그래머가 변수값이 절대 변경되지 않을 것이라고 확신했을 때, 그것을 보장하기 위해서 그리고 그 사실을 모두에게 명확히 보여주기 위해 `const`를 사용할 수 있습니다.


### 대문자로 된 상수

미리 기억하기 힘든 값들을 위해 별칭(alias)으로 상수를 사용하는 일반적인 관습이 존재합니다.

이런 상수들은 대문자와 언더스코어를 이용해 명명합니다.

이렇게요.:

```js run
const COLOR_RED = "#F00";
const COLOR_GREEN = "#0F0";
const COLOR_BLUE = "#00F";
const COLOR_ORANGE = "#FF7F00";

// ...색상을 고르고 싶을 땐
let color = COLOR_ORANGE;
alert(color); // #FF7F00
```

대문자로 된 상수를 사용하면 다음과 같은 이점이 있습니다.:

- `COLOR_ORANGE`는 `"#FF7F00"`보다 기억하기가 훨씬 쉽습니다.
- `COLOR_ORANGE`보다 `"#FF7F00"`에서 오타를 낼 확률이 높습니다.
- 코드를 읽을 때, `COLOR_ORANGE`가 `#FF7F00`보다 훨씬 유의미합니다.

그렇다면 언제 상수를 평범하게 명명하고 언제 대문자를 사용해야 할까요? 명확히 짚고 넘어갑시다.

Being a "constant" just means that a variable's value never changes. But there are constants that are known prior to execution (like a hexadecimal value for red) and there are constants that are *calculated* in run-time, during the execution, but do not change after their initial assignment.

예를 들어:
```js
const pageLoadTime = /* 웹페이지를 로드하는데 걸린 시간 */;
```

The value of `pageLoadTime` is not known prior to the page load, so it's named normally. But it's still a constant because it doesn't change after assignment.

In other words, capital-named constants are only used as aliases for "hard-coded" values.  

## Name things right

Talking about variables, there's one more extremely important thing.

Please name your variables sensibly. Take time to think about this.

Variable naming is one of the most important and complex skills in programming. A quick glance at variable names can reveal which code was written by a beginner versus an experienced developer.

In a real project, most of the time is spent modifying and extending an existing code base rather than writing something completely separate from scratch. When we return to some code after doing something else for a while, it's much easier to find information that is well-labeled. Or, in other words, when the variables have good names.

Please spend time thinking about the right name for a variable before declaring it. Doing so will repay you handsomely.

Some good-to-follow rules are:

- Use human-readable names like `userName` or `shoppingCart`.
- Stay away from abbreviations or short names like `a`, `b`, `c`, unless you really know what you're doing.
- Make names maximally descriptive and concise. Examples of bad names are `data` and `value`. Such names say nothing. It's only okay to use them if the context of the code makes it exceptionally obvious which data or value the variable is referencing.
- Agree on terms within your team and in your own mind. If a site visitor is called a "user" then we should name related variables `currentUser` or `newUser` instead of `currentVisitor` or `newManInTown`.

Sounds simple? Indeed it is, but creating descriptive and concise variable names in practice is not. Go for it.

```smart header="Reuse or create?"
And the last note. There are some lazy programmers who, instead of declaring new variables, tend to reuse existing ones.

As a result, their variables are like boxes into which people throw different things without changing their stickers. What's inside the box now? Who knows? We need to come closer and check.

Such programmers save a little bit on variable declaration but lose ten times more on debugging.

An extra variable is good, not evil.

Modern JavaScript minifiers and browsers optimize code well enough, so it won't create performance issues. Using different variables for different values can even help the engine optimize your code.
```

## 요약

데이터를 저장하기 위해 변수를 선언할 수 있습니다. `var`, `let`, `const`를 사용하면 됩니다.

- `let` -- 현대적인 변수 선언입니다. 크롬 (V8)에서 `let`을 사용하기 위해서는 엄격 모드에서 코드를 작성해야 합니다.
- `var` -- 오래된 변수 선언입니다. 보통 전혀 사용하지 않는 방식이지만, 이후 <info:var> 주제에서 `var`과 `let`의 미묘한 차이점에 대해 다룰 때 사용할 것입니다.
- `const` -- `let`과 비슷하지만 변수의 값을 변경할 수 없습니다.

변수명은 변수의 값이 무엇인지 쉽게 이해할 수 있는 방식으로 지어져야 합니다.
