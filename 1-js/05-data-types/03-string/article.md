# 문자열

자바스크립트엔 글자 하나만 저장할 수 있는 별도의 자료형이 없습니다. 텍스트 형식의 데이터는 길이에 상관없이 문자열 형태로 저장됩니다.

자바스크립트에서 문자열은 페이지 인코딩 방식과 상관없이 항상 [UTF-16](https://en.wikipedia.org/wiki/UTF-16) 형식을 따릅니다.

## 따옴표

따옴표의 종류가 무엇이 있었는지 상기해봅시다.

문자열은 작은따옴표나 큰따옴표, 백틱으로 감쌀 수 있습니다.

```js
let single = '작은따옴표';
let double = "큰따옴표";

let backticks = `백틱`;
```

작은따옴표와 큰따옴표는 기능상 차이가 없습니다. 그런데 백틱엔 특별한 기능이 있습니다. 표현식을 `${…}`로 감싸고 이를 백틱으로 감싼 문자열 중간에 넣어주면 해당 표현식을 문자열 중간에 쉽게 삽입할 수 있죠. 이런 방식을 템플릿 리터럴(template literal)이라고 부릅니다.

```js run
function sum(a, b) {
  return a + b;
}

alert(`1 + 2 = ${sum(1, 2)}.`); // 1 + 2 = 3.
```

백틱을 사용하면 문자열을 여러 줄에 걸쳐 작성할 수도 있습니다.

```js run
let guestList = `손님:
 * John
 * Pete
 * Mary
`;

alert(guestList); // 손님 리스트를 여러 줄에 걸쳐 작성함
```

자연스럽게 여러 줄의 문자열이 만들어졌네요. 작은따옴표나 큰따옴표를 사용하면 위와 같은 방식으로 여러 줄짜리 문자열을 만들 수 없습니다.

아래 예시를 실행해봅시다. 에러가 발생합니다.

```js run
let guestList = "손님: // Error: Invalid or unexpected token
  * John";
```

작은따옴표나 큰따옴표로 문자열을 표현하는 방식은 자바스크립트가 만들어졌을 때부터 있었습니다. 이때는 문자열을 여러 줄에 걸쳐 작성할 생각조차 못 했던 시기였죠. 백틱은 그 이후에 등장한 문법이기 때문에 따옴표보다 다양한 기능을 제공합니다.

백틱은 '템플릿 함수(template function)'에서도 사용됩니다. <code>func&#96;string&#96;</code> 같이 첫 번째 백틱 바로 앞에 함수 이름(`func`)을 써주면, 이 함수는 백틱 안의 문자열 조각이나 표현식 평가 결과를 인수로 받아 자동으로 호출됩니다. 이런 기능을 '태그드 템플릿(tagged template)'이라 부릅니다. 태그드 템플릿과 템플릿 함수에 대한 자세한 내용은 [템플릿 리터럴](mdn:/JavaScript/Reference/Template_literals#Tagged_templates)에서 확인해보세요. 참고로 이 기능은 자주 사용되진 않습니다.

## 특수 기호

'줄 바꿈 문자(newline character)'라 불리는 특수기호 `\n`을 사용하면 작은따옴표나 큰따옴표로도 여러 줄 문자열을 만들 수 있습니다.

```js run
let guestList = "손님:\n * John\n * Pete\n * Mary";

alert(guestList); // 손님 리스트를 여러 줄에 걸쳐 작성함
```

따옴표를 이용해 만든 여러 줄 문자열과 백틱을 이용해 만든 여러 줄 문자열은 표현 방식만 다를 뿐 차이가 없습니다.

```js run
let str1 = "Hello\nWorld"; // '줄 바꿈 기호'를 사용해 두 줄짜리 문자열을 만듦

// 백틱과 일반적인 줄 바꿈 방법(엔터)을 사용해 두 줄짜리 문자열을 만듦
let str2 = `Hello
World`;

alert(str1 == str2); // true
```

이 외에도 비교적 덜 사용되는 특수 문자가 있습니다.

| 특수 문자 | 설명 |
|-----------|-------------|
|`\n`|줄 바꿈|
|`\r`|캐리지 리턴(carriage return). Windows에선 캐리지 리턴과 줄 바꿈 특수 문자를 조합(`\r\n`)해 줄을 바꿉니다. 반면 Windows가 아닌 운영체제에서 단순히 줄바꿈(`\n`)만 사용합니다. 이는 역사적인 이유 때문이며, 대부분의 Windows 소프트웨어는 `\n`을 이해합니다. |
|`\'`,&nbsp;`\"`,&nbsp;<code>\\'</code>|따옴표|
|`\\`|역슬래시|
|`\t`|탭|
|`\b`, `\f`, `\v`|각각 백스페이스(Backspace), 폼 피드(Form Feed), 세로 탭(Vertical Tab)을 나타냅니다. 호환성 유지를 위해 남아있는 기호로 요즘엔 사용하지 않으므로 지금은 크게 신경 쓰지 않아도 됩니다. |

모든 특수 문자는 '이스케이프 문자(escape character)'라고도 불리는 역슬래시 (backslash character) `\`로 시작합니다.

역슬래시는 특별한 의미를 가지기 때문에, 문자열 안에 실제 역슬래시 `\`를 표시하려면 두 번 입력해야 합니다. 

```js run
alert( `The backslash: \\` ); // 역슬래시: \
```

따옴표를 '이스케이프'한 `\'`, `\"`, <code>\\`</code>는 문자열을 감싸는 따옴표와 동일한 종류의 따옴표를 문자열 안에 넣을 때 사용됩니다.

예시:

```js run
alert( 'I*!*\'*/!*m the Walrus!' ); // *!*I'm*/!* the Walrus!
```

위 예시에서 살펴본 바와 같이 문자열 내의 따옴표엔 `\`를 꼭 붙여줘야 합니다. 이렇게 하지 않으면 자바스크립트는 해당 따옴표가 문자열을 닫는 용도로 사용된 것이라 해석하기 때문입니다.

이스케이프 문자는 문자열을 감쌀 때 사용한 따옴표와 동일한 따옴표에만 붙여주면 됩니다. 문자열 내에서 좀 더 우아하게 따옴표를 사용하려면 아래와 같이 큰따옴표나 백틱으로 문자열을 감싸주면 됩니다.

```js run
alert( "I'm the Walrus!" ); // I'm the Walrus!
```

이러한 특수 문자 외에도 유니코드 코드를 나타내는 특별한 표기법 `\u…`가 있습니다. 자주 사용되지는 않으며, [유니코드](info:unicode) 선택 챕터에서 다루겠습니다. 

## 문자열의 길이

`length` 프로퍼티엔 문자열의 길이가 저장됩니다.

```js run
alert( `My\n`.length ); // 3
```

`\n`은 '특수 문자' 하나로 취급되기 때문에 `My\n`의 길이는 `3`입니다.

```warn header="`length`는 프로퍼티입니다."
자바스크립트 이외의 언어를 사용했던 개발자들은 `str.length`가 아닌 `str.length()`로 문자열의 길이를 알아내려고 하는 경우가 있습니다. 하지만 원하는 대로 동작하지 않습니다.

`length`는 함수가 아니고, 숫자가 저장되는 프로퍼티라는 점에 주의하시기 바랍니다. 뒤에 괄호를 붙일 필요가 없습니다. 따라서 `.length()`처럼 괄호를 붙이지 않고 `.length`로 사용합니다.
```

## 특정 글자에 접근하기

문자열 내 특정 위치인 `pos`에 있는 글자에 접근하려면 `[pos]`같이 대괄호를 이용하거나 [str.at(pos)](mdn:js/String/at)라는 메서드를 호출하면 됩니다. 첫 번째 문자의 위치는 0부터 시작합니다.

```js run
let str = `Hello`;

// 첫 번째 글자
alert( str[0] ); // H
alert( str.at(0) ); // H

// 마지막 글자
alert( str[str.length - 1] ); // o
alert( str.at(-1) );
```

보시다시피 `.at(pos)` 메서드는 `pos`에 음수를 전달해 사용할 수 있다는 장점이 있습니다. `pos`가 음수이면 문자열의 끝에서부터 위치를 계산합니다.

따라서 `.at(-1)`은 마지막 문자를 의미하고, `.at(-2)`는 마지막에서 두 번째 문자를 의미하는 식입니다.

반면 대괄호 표기법은 음수 인덱스에 대해 항상 `undefined`를 반환합니다. 예를 들면 다음과 같습니다.

```js run
let str = `Hello`;

alert( str[-2] ); // undefined
alert( str.at(-2) ); // l
```

`for..of`를 사용하면 문자열을 구성하는 글자를 대상으로 반복 작업을 할 수 있습니다.

```js run
for (let char of "Hello") {
  alert(char); // H,e,l,l,o (char는 순차적으로 H, e, l, l, o가 됩니다.)
}
```

## 문자열의 불변성

문자열은 수정할 수 없습니다. 따라서 문자열의 중간 글자 하나를 바꾸려고 하면 에러가 발생합니다.

직접 실습해봅시다.

```js run
let str = 'Hi';

str[0] = 'h'; // Error: Cannot assign to read only property '0' of string 'Hi'
alert( str[0] ); // 동작하지 않습니다.
```

이런 문제를 피하려면 완전히 새로운 문자열을 하나 만든 다음, 이 문자열을 `str`에 할당하면 됩니다.

예시:

```js run
let str = 'Hi';

str = 'h' + str[1]; // 문자열 전체를 교체함

alert( str ); // hi
```

유사한 예시는 이어지는 절에서 살펴보겠습니다.

## 대·소문자 변경하기

메서드 [toLowerCase()](mdn:js/String/toLowerCase)와 [toUpperCase()](mdn:js/String/toUpperCase)는 대문자를 소문자로, 소문자를 대문자로 변경(케이스 변경)시켜줍니다.

```js run
alert( 'Interface'.toUpperCase() ); // INTERFACE
alert( 'Interface'.toLowerCase() ); // interface
```

글자 하나의 케이스만 변경하는 것도 가능합니다.

```js run
alert( 'Interface'[0].toLowerCase() ); // 'i'
```

## 부분 문자열 찾기

문자열에서 부분 문자열(substring)을 찾는 방법은 여러 가지가 있습니다.

### str.indexOf

첫 번째 방법은 [str.indexOf(substr, pos)](mdn:js/String/indexOf) 메서드를 이용하는 것입니다.

이 메서드는 문자열 `str`의 `pos`에서부터 시작해, 부분 문자열 `substr`이 어디에 위치하는지를 찾아줍니다. 원하는 부분 문자열을 찾으면 위치를 반환하고 그렇지 않으면 `-1`을 반환합니다. 

예시:

```js run
let str = 'Widget with id';

alert( str.indexOf('Widget') ); // 0, str은 'Widget'으로 시작함
alert( str.indexOf('widget') ); // -1, indexOf는 대·소문자를 따지므로 원하는 문자열을 찾지 못함

alert( str.indexOf("id") ); // 1, "id"는 첫 번째 위치에서 발견됨 (Widget에서 id)
```

`str.indexOf(substr, pos)`의 두 번째 매개변수 `pos`는 선택적으로 사용할 수 있는데, 이를 명시하면 검색이 해당 위치부터 시작됩니다.

부분 문자열 `"id"`는 위치 `1`에서 처음 등장하는데, 두 번째 인수에 `2`를 넘겨 `"id"`가 두 번째로 등장하는 위치가 어디인지 알아봅시다.

```js run
let str = 'Widget with id';

alert( str.indexOf('id', 2) ) // 12
```

문자열 내 부분 문자열 전체를 대상으로 무언가를 하고 싶다면 반복문 안에 `indexOf`를 사용하면 됩니다. 반복문이 하나씩 돌 때마다 검색 시작 위치가 갱신되면서 `indexOf`가 새롭게 호출됩니다.

```js run
let str = 'As sly as a fox, as strong as an ox';

let target = 'as'; // as를 찾아봅시다. 

let pos = 0;
while (true) {
  let foundPos = str.indexOf(target, pos);
  if (foundPos == -1) break;

  alert( `위치: ${foundPos}` );
  pos = foundPos + 1; // 다음 위치를 기준으로 검색을 이어갑니다.
}
```

동일한 알고리즘을 사용해 코드만 짧게 줄이면 다음과 같습니다.

```js run
let str = "As sly as a fox, as strong as an ox";
let target = "as";

*!*
let pos = -1;
while ((pos = str.indexOf(target, pos + 1)) != -1) {
  alert( `위치: ${pos}` );
}
*/!*
```

```smart header="`str.lastIndexOf(substr, position)`"
[str.lastIndexOf(substr, position)](mdn:js/String/lastIndexOf)는 `indexOf`와 유사한 기능을 하는 메서드입니다. 문자열 끝에서부터 부분 문자열을 찾는다는 점만 다릅니다.

반환되는 부분 문자열 위치는 문자열 끝이 기준입니다.
```

`if`문의 조건식에 `indexOf`를 쓸 때 주의할 점이 하나 있습니다. 아래와 같이 코드를 작성하면 원하는 결과를 얻을 수 없습니다.

```js run
let str = "Widget with id";

if (str.indexOf("Widget")) {
    alert("찾았다!"); // 의도한 대로 동작하지 않습니다.
}
```

`str.indexOf("Widget")`은 `0`을 반환하는데, `if`문에선 `0`을 `false`로 간주하므로 `alert` 창이 뜨지 않습니다.

따라서 부분 문자열 여부를 검사하려면 아래와 같이 `-1`과 비교해야 합니다.

```js run
let str = "Widget with id";

*!*
if (str.indexOf("Widget") != -1) {
*/!*
    alert("찾았다!"); // 의도한 대로 동작합니다.
}
```

### includes, startsWith, endsWith

비교적 근래에 나온 메서드인 [str.includes(substr, pos)](mdn:js/String/includes)는 `str`에 부분 문자열 `substr`이 있는지에 따라 `true`나 `false`를 반환합니다.

부분 문자열의 위치 정보는 필요하지 않고 포함 여부만 알고 싶을 때 적합한 메서드입니다.

```js run
alert( "Widget with id".includes("Widget") ); // true

alert( "Hello".includes("Bye") ); // false
```

`str.includes`에도 `str.indexOf`처럼 두 번째 인수를 넘기면 해당 위치부터 부분 문자열을 검색합니다.

```js run
alert( "Widget".includes("id") ); // true
alert( "Widget".includes("id", 3) ); // false, 세 번째 위치 이후엔 "id"가 없습니다.
```

메서드 [str.startsWith](mdn:js/String/startsWith)와 [str.endsWith](mdn:js/String/endsWith)는 메서드 이름 그대로 문자열 `str`이 특정 문자열로 시작하는지(start with) 여부와 특정 문자열로 끝나는지(end with) 여부를 확인할 때 사용할 수 있습니다.

```js run
alert( "*!*Wid*/!*get".startsWith("Wid") ); // true, "Widget"은 "Wid"로 시작합니다.
alert( "Wid*!*get*/!*".endsWith("get") ); // true, "Widget"은 "get"으로 끝납니다.
```

## 부분 문자열 추출하기

자바스크립트엔 부분 문자열 추출과 관련된 메서드가 세 가지 있습니다. 세 가지 메서드 `substring`, `substr`, `slice`를 하나씩 알아봅시다.

`str.slice(start [, end])`
: 문자열의 `start`부터 `end`까지(`end`는 미포함)를 반환합니다.

    예시:

    ```js run
    let str = "stringify";
    alert( str.slice(0, 5) ); // 'strin', 0번째부터 5번째 위치까지(5번째 위치의 글자는 포함하지 않음)
    alert( str.slice(0, 1) ); // 's', 0번째부터 1번째 위치까지(1번째 위치의 자는 포함하지 않음)
    ```

    두 번째 인수가 생략된 경우엔, 명시한 위치부터 문자열 끝까지를 반환합니다.

    ```js run
    let str = "st*!*ringify*/!*";
    alert( str.slice(2) ); // ringify, 2번째부터 끝까지
    ```

    `start`와 `end`는 음수가 될 수도 있습니다. 음수를 넘기면 문자열 끝에서부터 카운팅을 시작합니다.

    ```js run
    let str = "strin*!*gif*/!*y";

    // 끝에서 4번째부터 시작해 끝에서 1번째 위치까지
    alert( str.slice(-4, -1) ); // gif
    ```

`str.substring(start [, end])`
: `start`와 `end` *사이*에 있는 문자열(`end`는 미포함)을 반환합니다.

    `substring`은 `slice`와 아주 유사하지만 `start`가 `end`보다 커도 괜찮다는 데 차이가 있습니다. 이런 경우 'start`와 `end`값을 서로 바꿔 처리합니다.

    예시:

    ```js run
    let str = "st*!*ring*/!*ify";

    // 동일한 부분 문자열을 반환합니다.
    alert( str.substring(2, 6) ); // "ring"
    alert( str.substring(6, 2) ); // "ring"

    // slice를 사용하면 결과가 다릅니다.
    alert( str.slice(2, 6) ); // "ring" (같음)
    alert( str.slice(6, 2) ); // "" (빈 문자열)

    ```

    `substring`은 음수 인수를 허용하지 않습니다. 음수는 `0`으로 처리됩니다.

`str.substr(start [, length])`
: `start`에서부터 시작해 `length` 개의 글자를 반환합니다.

    `substr`은 끝 위치 대신에 길이를 기준으로 문자열을 추출한다는 점에서 `substring`과 `slice`와 차이가 있습니다.

    ```js run
    let str = "st*!*ring*/!*ify";
    alert( str.substr(2, 4) ); // ring, 두 번째부터 글자 네 개
    ```

    첫 번째 인수가 음수면 뒤에서부터 개수를 셉니다.

    ```js run
    let str = "strin*!*gi*/!*fy";
    alert( str.substr(-4, 2) ); // gi, 끝에서 네 번째 위치부터 글자 두 개
    ```

이 메서드는 언어 명세의 [Annex B](https://tc39.es/ecma262/#sec-string.prototype.substr)에 포함되어 있습니다. 즉, 브라우저 환경의 자바스크립트 엔진만 이를 지원하면 되며, 사용은 권장되지 않습니다. 하지만 실제로는 거의 모든 환경에서 지원됩니다.

부분 문자열 추출과 관련된 메서드를 요약해 봅시다.

| 메서드 | 추출할 부분 문자열 | 음수 허용 여부(인수)|
|--------|-----------|-----------|
| `slice(start, end)` | `start`부터 `end`까지(`end`는 미포함) | 음수 허용 |
| `substring(start, end)` | `start`와 `end` 사이(`end`는 미포함) | 음수는 `0`으로 취급함 |
| `substr(start, length)` | `start`부터 `length`개의 글자 | 음수 `start` 허용 |

```smart header="어떤 메서드를 선택해야 하나요?"
모두 사용해도 괜찮습니다. 그런데 `substr`에는 단점이 하나 있습니다. `substr`는 코어 자바스크립트 명세서(ECMA-262 - 옮긴이)가 아닌, 구식 스크립트에 대응하기 위해 남겨 둔 브라우저 전용 기능들을 명시해 놓은 부록 B(Annex B)에 정의되어있습니다. 거의 모든 곳에서 이 메서드가 동작하긴 하지만 브라우저 이외의 호스트 환경에서는 제대로 동작하지 않을 수 있습니다. 

남은 두 메서드 중 `slice`는 음수 인수를 허용한다는 측면에서 `substring`보다 좀 더 유연합니다. 메서드 이름도 더 짧죠. 

따라서 세 메서드 중 `slice`만 외워놓고 사용해도 충분합니다.
```

## 문자열 비교하기

<info:comparison> 챕터에서 알아보았듯이 문자열을 비교할 땐 알파벳 순서를 기준으로 글자끼리 비교가 이뤄집니다.

그런데 아래와 같이 몇 가지 이상해 보이는 것들이 있습니다.

1. 소문자는 대문자보다 항상 큽니다.

    ```js run
    alert( 'a' > 'Z' ); // true
    ```

2. 발음 구별 기호(diacritical mark)가 붙은 문자는 알파벳 순서 기준을 따르지 않습니다.

    ```js run
    alert( 'Österreich' > 'Zealand' ); // true (Österreich는 오스트리아를 독일어로 표기한 것임 - 옮긴이)
    ```

    이런 예외사항 때문에 이름순으로 국가를 나열할 때 예상치 못한 결과가 나올 수 있습니다. 사람들은 `Österreich`가 `Zealand`보다 앞서 나올 것이라 예상하는데 그렇지 않죠.

자바스크립트 내부에서 문자열이 어떻게 표시되는지 상기하며 원인을 알아봅시다.모든 문자열은 [UTF-16](https://en.wikipedia.org/wiki/UTF-16)을 사용해 인코딩되는데, UTF-16에선 모든 글자가 숫자 형식의 코드와 매칭됩니다. 

코드로 글자를 얻거나 글자에서 연관 코드를 알아낼 수 있는 메서드는 다음과 같습니다.

`str.codePointAt(pos)`
: `pos`에 위치한 글자의 코드를 나타내는 10진수 값을 반환합니다.

    ```js run
    // 글자는 같지만 케이스는 다르므로 반환되는 코드가 다릅니다.
    alert( "Z".codePointAt(0) ); // 90
    alert( "z".codePointAt(0) ); // 122
    alert( "z".codePointAt(0).toString(16) ); // 7a (16진수 값이 필요한 경우)
    ```

`String.fromCodePoint(code)`
: 숫자 형식의 `code`에 대응하는 글자를 만들어줍니다.

    ```js run
    alert( String.fromCodePoint(90) ); // Z
    alert( String.fromCodePoint(0x5a) ); // Z (16진수 값을 인수로 사용할 수도 있음)
    ```

이제 이 배경지식을 가지고 코드 `65`와 `220` 사이(라틴계열 알파벳과 기타 글자들이 여기에 포함됨)에 대응하는 글자들을 출력해봅시다.

```js run
let str = '';

for (let i = 65; i <= 220; i++) {
  str += String.fromCodePoint(i);
}
alert( str );
// Output:
// ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
// ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜ
```

보이시나요? 대문자 알파벳이 가장 먼저 나오고 특수 문자 몇 개가 나온 다음에 소문자 알파벳이 나오네요. `Ö`은 거의 마지막에 출력됩니다.

이제 왜 `a > Z`인지 아시겠죠?

글자는 글자에 대응하는 숫자 형식의 코드를 기준으로 비교됩니다. 코드가 크면 대응하는 글자 역시 크다고 취급되죠. 따라서 `a`(코드:97)는 `Z`(코드:90) 보다 크다는 결론이 도출됩니다.

- 알파벳 소문자의 코드는 대문자의 코드보다 크므로 소문자는 대문자 뒤에 옵니다.
- `Ö` 같은 글자는 일반 알파벳과 멀리 떨어져 있습니다. `Ö`의 코드는 알파벳 소문자의 코드보다 훨씬 큽니다.

### 문자열 제대로 비교하기 [#correct-comparisons]

언어마다 문자 체계가 다르기 때문에 문자열을 '제대로' 비교하는 알고리즘을 만드는 건 생각보다 간단하지 않습니다.

문자열을 비교하려면 일단 페이지에서 어떤 언어를 사용하고 있는지 브라우저가 알아야 합니다.

다행히도 모던 브라우저 대부분이 국제화 관련 표준인 [ECMA-402](http://www.ecma-international.org/ecma-402/1.0/ECMA-402.pdf)를 지원합니다

ECMA-402엔 언어가 다를 때 적용할 수 있는 문자열 비교 규칙과 이를 준수하는 메서드가 정의되어있습니다.

[str.localeCompare(str2)](mdn:js/String/localeCompare)를 호출하면 ECMA-402에서 정의한 규칙에 따라 `str`이 `str2`보다 작은지, 같은지, 큰지를 나타내주는 정수가 반환됩니다. 

- `str`이 `str2`보다 작으면 음수를 반환합니다.
- `str`이 `str2`보다 크면 양수를 반환합니다.
- `str`과 `str2`이 같으면 `0`을 반환합니다.

예시:

```js run
alert( 'Österreich'.localeCompare('Zealand') ); // -1
```

`localeCompare`엔 선택 인수 두 개를 더 전달할 수 있습니다. 기준이 되는 언어를 지정(아무것도 지정하지 않았으면 호스트 환경의 언어가 기준 언어가 됨)해 주는 인수와 대·소문자를 구분할지나 `"a"`와 `"á"`를 다르게 취급할지에 대한 것을 설정해 주는 인수가 더 있죠. 자세한 사항은 관련 [문서](mdn:js/String/localeCompare)에서 확인해 보시기 바랍니다.

## 요약

- 자바스크립트엔 세 종류의 따옴표가 있는데, 이 중 하나인 백틱은 문자열을 여러 줄에 걸쳐 쓸 수 있게 해주고 문자열 중간에 `${…}`을 사용해 표현식도 넣을 수 있다는 점이 특징입니다.
- `\n` 같은 특수 문자를 사용할 수 있습니다.
- 문자열 내의 글자 하나를 얻으려면 대괄호 `[]`나 `at` 메서드를 사용하세요.
- 부분 문자열을 얻으려면 `slice`나 `substring`을 사용하세요.
- 소문자로 바꾸려면 `toLowerCase`, 대문자로 바꾸려면 `toUpperCase`를 사용하세요.
- `indexOf`를 사용하면 부분 문자열의 위치를 얻을 수 있습니다. 부분 문자열 여부만 알고 싶다면 `includes/startsWith/endsWith`를 사용하면 됩니다.
- 특정 언어에 적합한 비교 기준 사용해 문자열을 비교하려면 `localeCompare`를 사용하세요. 이 메서드를 사용하지 않으면 글자 코드를 기준으로 문자열이 비교됩니다.

이외에도 문자열에 쓸 수 있는 유용한 메서드 몇 가지가 있습니다.

- `str.trim()` -- 문자열 앞과 끝의 공백 문자를 다듬어 줍니다(제거함).
- `str.repeat(n)` -- 문자열을 `n`번 반복합니다.
- 이 외의 메서드는 [MDN 문서](mdn:js/String)에서 확인해보시기 바랍니다.

정규 표현식을 사용해 문자열을 찾거나 교체해주는 메서드도 여러 개 있는데 이는 아주 큰 주제이기 때문에 별도의 섹션 <info:regular-expressions>에서 다루겠습니다.

또한 문자열은 유니코드 인코딩을 기반으로 하기 때문에 문자열 비교 시 관련 문제가 발생할 수 있다는 점도 알아둬야 합니다. 유니코드에 대한 자세한 내용은 <info:unicode> 챕터에서 다루겠습니다. 