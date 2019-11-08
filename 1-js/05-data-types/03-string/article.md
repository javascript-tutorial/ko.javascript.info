# 문자열

자바스크립트엔 글자 하나만 저장할 수 있는 별도의 자료형이 없습니다. 텍스트 형식의 데이터는 길이에 상관없이 문자열에 저장합니다.

자바스크립트의 문자열은 페이지 인코딩 방식과 상관없이 항상 [UTF-16](https://en.wikipedia.org/wiki/UTF-16) 방식을 따릅니다.

## 따옴표

문자열을 만들 때 쓰는 따옴표가 무엇이 있었는지 상기해봅시다.

문자열은 작은따옴표나 큰따옴표, 백틱으로 감쌀 수 있습니다.

```js
let single = '작은따옴표';
let double = "큰따옴표";

let backticks = `백틱`;
```

작은따옴표와 큰따옴표는 기능상 차이가 없습니다. 그런데 백틱엔 특별한 기능이 있습니다. 표현식을 `${…}`로 감싸고 이를 백틱으로 감싼 문자열 중간에 넣어주면 해당 표현식을 문자열 중간에 쉽게 삽입할 수 있습니다. 

```js run
function sum(a, b) {
  return a + b;
}

alert(`1 + 2 = ${sum(1, 2)}.`); // 1 + 2 = 3.
```

백틱을 사용하면 문자열을 여러 줄에 걸쳐 작성하는 것도 가능합니다.

```js run
let guestList = `손님:
 * John
 * Pete
 * Mary
`;

alert(guestList); // 손님 리스트를 여러 줄에 걸쳐 작성함
```

자연스럽게 여러 줄의 문자열이 만들어졌네요. 작은따옴표나 큰따옴표를 사용하면 이렇게 여러 줄에 걸쳐 문자열을 작성할 수 었습니다.

아래 예시를 실행하면 에러가 발생합니다.

```js run
let guestList = "손님: // Error: Invalid or unexpected token
  * John";
```

작은따옴표나 큰따옴표로 문자열을 표현하는 방식은 자바스크립트가 만들어졌을 때부터 있었습니다. 이때는 문자열을 여러 줄에 걸쳐 작성할 생각조차 못 했던 시기였죠. 백틱은 그 이후에 등장한 문법이기 때문에 따옴표를 사용하는 것보다 다양한 기능을 제공합니다.

백틱은 "템플릿 함수(template function)"에도 사용할 수 있습니다. <code>func&#96;string&#96;</code> 같이 첫 번째 백틱 앞에 함수 이름(`func`)을 써주면 이 함수는 백틱안의 문자열 조각들, 표현식 평가 결과를 인수로 받아 자동으로 호출됩니다. 이런 기능을 "태그드 템플릿(tagged template)"이라 부르는데, 태그드 템플릿을 사용하면 사용자 지정 템플릿에 맞는 문자열을 쉽게 만들 수 있습니다. 태그드 템플릿과 템플릿 함수에 대한 자세한 내용은 MDN [문서](mdn:/JavaScript/Reference/Template_literals#Tagged_templates)에서 확인할 수 있습니다. 참고로 이 기능은 자주 사용되진 않습니다.

## 특수 기호

"줄 바꿈 문자(newline character)"라 불리는 특수기호 `\n`을 사용하면 작은따옴표나 큰따옴표를 사용해 여러 줄 문자열을 만들 수 있습니다.

```js run
let guestList = "손님:\n * John\n * Pete\n * Mary";

alert(guestList); // 손님 리스트를 여러 줄에 걸쳐 작성함
```

따옴표를 이용해 만든 여러 줄 문자열과 백틱을 이용해 만든 여러 줄 문자열은 차이가 없습니다. 문자열을 만들 때 쓴 표현 방식만 다릅니다.

```js run
let str1 = "Hello\nWorld"; // "줄 바꿈 기호"를 사용해 두 줄 문자열을 만듦

// 백틱과 새 줄 문자(엔터)를 사용해 두 줄 문자열을 만듦
let str2 = `Hello
World`;

alert(str1 == str2); // true
```

자바스크립트엔 줄 바꿈 문자를 비롯한 다양한 "특수" 문자들이 있습니다.

특수 문자 목록:

| 특수 문자 | 설명 |
|-----------|-------------|
|`\n`|줄 바꿈|
|`\r`|캐리지 리턴(carriage return). Windows에선 두 특수문자를 조합해(`\r\n`) 줄을 바꿉니다. 캐리지 리턴을 단독으론 사용하는 경우는 없습니다. |
|`\'`, `\"`|따옴표|
|`\\`|역슬래시|
|`\t`|탭|
|`\b`, `\f`, `\v`|각각 백스페이스, 폼 피드(Form Feed), 세로 탭(Vertical Tab)을 나타냅니다. 호환성을 유지하기 위해 남아있는 기호로 지금은 사용하지 않습니다. |
|`\xXX`|Unicode character with the given hexadecimal unicode `XX`(예시: 알파벳 `'z'`는 `'\x7A'`와 동일함) |
|`\uXXXX`|A unicode symbol with the hex code `XXXX` in UTF-16 encoding. It must be exactly 4 hex digits(예시: `\u00A9`는 저작권 기호 `©`의 유니코드임).
|`\u{X…XXXXXX}`(1 to 6 hex characters)|A unicode symbol with the given UTF-32 encoding. Some rare characters are encoded with two unicode symbols, taking 4 bytes. This way we can insert long codes.|

유니코드를 사용한 예시:

```js run
alert( "\u00A9" ); // ©
alert( "\u{20331}" ); // 佫, 중국어(긴 유니코드)
alert( "\u{1F60D}" ); // 😍, 웃는 얼굴 기호(긴 유니코드)
```

모든 특수문자는 이스케이프 문자(escape character)라 불리는 역슬래시 `\`로 시작합니다.

이스케이프 문자는 문자열 내에 따옴표를 넣을 때도 사용할 수 있습니다.

예시:

```js run
alert( 'I*!*\'*/!*m the Walrus!' ); // *!*I'm*/!* the Walrus!
```

문자열 내에서 따옴표를 사용하려면 따옴표 앞에 `\`를 꼭 붙여줘야 합니다. 이렇게 하지 않으면 자바스크립트는 해당 따옴표가 문자열을 닫기는 용도로 사용된 것이라 해석하기 때문입니다.

참고로, 문자열을 감쌀 때 사용한 따옴표와 동일한 따옴표만 이스케이프 해주면 됩니다. 작은따옴표 대신 큰따옴표나 백틱으로 문자열을 감싸면 위 예시와 동일하게 동작합니다.

```js run
alert( `I'm the Walrus!` ); // I'm the Walrus!
```

자바스크립트에서 역슬래시 `\`는 문자열을 정확하게 읽기 위한 용도로 만들어졌으므로 `\`는 제 역할이 끝나면 사라집니다. 위에서 소개한 다양한 예시를 실행했을 때 뜨는 `alert` 창을 통해 메모리상의 문자열엔 `\`가 없다는 것을 확인해 보셨을 겁니다.

그런데 문자열 중간에 역슬래시 `\`를 보여줘야 한다면 어떻게 해야 할까요?

`\\`같이 역슬래시를 두 개 붙이면 됩니다.

```js run
alert( `역슬래시: \\` ); // 역슬래시: \
```

## 문자열의 길이

`length` 프로퍼티엔 문자열의 길이가 저장됩니다.

```js run
alert( `My\n`.length()); // 3
```

`\n`은 "특수 문자" 하나로 취급되기 때문에 `My\n`의 길이는 `3`입니다.

```warn header="`length`는 프로퍼티입니다."
자바스크립트 이외의 언어를 사용했던 개발자들은 `str.length`이 아닌 `str.length()`로 문자열의 길이를 알아내려고 하는 경우가 있습니다.

`length`는 메서드가 아닌 프로퍼티이기 때문에 뒤에 괄호를 붙여 호출하면 에러가 발생합니다.
```

## 특정 위치에 있는 문자에 접근하기

문자열 내 특정 위치 `pos`에 있는 문자에 접근하려면 `[pos]`같이 대괄호를 이용하거나 [str.charAt(pos)](mdn:js/String/charAt)이라는 메서드를 호출해야 합니다. 문자열 내 문자의 위치는 0부터 시작합니다.

```js run
let str = `Hello`;

// 첫 번째 문자
alert( str[0] ); // H
alert( str.charAt(0) ); // H

// 마지막 문자
alert( str[str.length - 1] ); // o
```

근래에는 대괄호를 이용해 접근하는 방식이 많이 사용됩니다. `charAt`는 하위 호환성을 유지하기 위해 남아있는 메서드입니다.

두 방식의 차이는 반환할 문자가 없을 때 드러납니다. 접근하려는 위치에 문자가 없는 경우 `[]`는 `undefined`를, `charAt`는 빈 문자열을 반환합니다.

```js run
let str = `Hello`;

alert( str[1000] ); // undefined
alert( str.charAt(1000) ); // '' (빈 문자열)
```

`for..of`를 사용하면 문자열을 구성하는 문자를 대상으로 중복 작업을 할 수 있습니다.

```js run
for (let char of "Hello") {
  alert(char); // H,e,l,l,o (char에는 순차적으로 "H", "e", "l", "l", "o"가 저장됩니다.)
}
```

## 문자열의 불변성

문자열은 수정할 수 없습니다. 따라서 문자열의 중간 문자 하나를 바꾸려고 하면 에러가 발생합니다.

직접 실습해봅시다.

```js run
let str = 'Hi';

str[0] = 'h'; // Error: Cannot assign to read only property '0' of string 'Hi'
alert( str[0] ); // 동작하지 않습니다.
```

이런 에러를 피하려면 완전히 새로운 문자열을 하나 만든 다음, 이 문자열을 `str`에 할당하면 됩니다.

예시:

```js run
let str = 'Hi';

str = 'h' + str[1]; // 문자열을 교체함

alert( str ); // hi
```

유사한 예시는 이어지는 절에서 좀 더 자세하게 다루도록 하겠습니다.

## 대/소문자 변경하기

[toLowerCase()](mdn:js/String/toLowerCase)와 [toUpperCase()](mdn:js/String/toUpperCase)라는 메서드는 대/소문자를 변경(케이스(case) 변경)할 때 사용할 수 있습니다.

```js run
alert( 'Interface'.toUpperCase() ); // INTERFACE
alert( 'Interface'.toLowerCase() ); // interface
```

문자 하나만 소문자로 변경하는 것도 가능합니다.

```js
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
alert( str.indexOf('widget') ); // -1, indexOf는 대/소문자를 따지므로 원하는 문자열을 찾지 못함

alert( str.indexOf("id") ); // 1, "id"는 첫 번째 위치에서 발견됨 (Widget에서 id)
```

`str.indexOf(substr, pos)`의 두 번째 매개변수 `pos`는 해당 위치부터 부분 문자열을 검색할 수 있게 제한합니다.

부분 문자열 `"id"`의 위치는 `1`인데, 두 번째 인수에 `2`를 넘기면 위치 `2`부터 부분 문자열을 검색하므로 실행 결과가 달라집니다.

```js run
let str = 'Widget with id';

alert( str.indexOf('id', 2) ) // 12
```

반복문과 `indexOf`를 조합하면 부분 문자열 모두를 찾을 수 있습니다. 반복문이 하나씩 돌 때마다 검색 시작 위치를 새롭게 갱신해주면 되죠.

```js run
let str = 'As sly as a fox, as strong as an ox';

let target = 'as'; // as가 얼마나 등장하는지 알아봅시다. 

let pos = 0;
while (true) {
  let foundPos = str.indexOf(target, pos);
  if (foundPos == -1) break;

  alert( `위치: ${foundPos}` );
  pos = foundPos + 1; // 다음 위치를 기준으로 부분 문자열을 검색합니다.
}
```

아래는 동일한 알고리즘을 사용해 코드만 짧게 줄인 예시입니다.

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

반환되는 부분 문자열의 위치는 문자열 끝이 기준입니다.
```

`if`문의 조건식에 `indexOf`를 쓸 때 주의할 점이 하나 있습니다. 아래와 같이 코드들 작성하면 원하는 결과를 얻을 수 없습니다.

```js run
let str = "Widget with id";

if (str.indexOf("Widget")) {
    alert("찾았다!"); // 의도한 대로 동작하지 않습니다.
}
```

`str.indexOf("Widget")`는 `0`을 반환하므로 조건을 통과하지 못해 `alert` 창이 뜨지 않습니다.

부분 문자열인지 여부를 검사하려면 아래와 같이 조건식에 `-1`을 사용해야 합니다.

```js run
let str = "Widget with id";

*!*
if (str.indexOf("Widget") != -1) {
*/!*
    alert("찾았다!"); // 의도한 대로 동작합니다.
}
```

#### 비트 NOT 연산자를 사용한 기법

오래전부터 전해 오는 [비트(bitwise) NOT 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT) `~`를 사용한 기법 하나를 소개해드리겠습니다. 비트 NOT 연산자는 피연산자를 32비트 정수로 바꾼 후(소수부는 모두 버려짐) 모든 비트를 반전합니다. 

`n`이 32비트 정수일 때 `~n`은 `-(n+1)`이 되죠.

예시:

```js run
alert( ~2 ); // -3, -(2+1)과 같음
alert( ~1 ); // -2, -(1+1)과 같음
alert( ~0 ); // -1, -(0+1)과 같음
*!*
alert( ~-1 ); // 0, -(-1+1)과 같음
*/!*
```

`n`이 부호가 있는 32비트 정수이고 `n == -1`이라면 `~n`은 `0`이 됩니다.

이를 응용해서 `indexOf`가 `-1`을 반환하지 않는 경우를 `if ( ~str.indexOf("...") )`로 검사해 봅시다.

많은 개발자가 이런 속임수를 써서 부분 문자열 여부를 검사합니다.

```js run
let str = "Widget";

if (~str.indexOf("Widget")) {
  alert( '찾았다!' ); // 의도한 대로 동작합니다.
}
```

사실 이렇게 언어 특유의 기능을 사용해 직관적이지 않은 코드를 작성하는 건 추천할만한 방법은 아닙니다. 그렇지만 위와 같이 비트 NOT 연산자를 사용하는 것은 오래된 스크립트에서 전방위적으로 사용되고 있는 기법이므로 알아두어야 합니다.

`if (~str.indexOf(...))` 패턴의 코드를 만나면 "부분 문자열이 있는 경우"라고 기억하도록 합시다.

사실  `-1` 이외에도 `~` 연산자 적용 시 `0`을 반환하는 숫자는 다양합니다. 아주 큰 숫자에 `~` 연산자를 적용하면 32비트 정수로 바꾸는 과정에서 잘림 현상이 발생하기 때문이죠. 이런 숫자 중 가장 큰 숫자는 `4294967295`입니다. 문자열이 아주 길지 않은 경우에만 `~` 연산자가 의도한 대로 작동한다는 점을 알고 계시길 바랍니다.

모던 자바스크립트에선 `.includes` 메서드(아래에서 배움)를 사용해 부분 문자열 포함 여부를 확인하므로 이런 기법은 오래된 자바스크립트에서만 볼 수 있습니다.

### includes, startsWith, endsWith

비교적 근래에 나온 메서드인 [str.includes(substr, pos)](mdn:js/String/includes)는 `str`에 부분 문자열 `substr`이 있는지에 따라 `true`나 `false`를 반환합니다.

부분 문자열의 위치 정보는 필요하지 않고 포함 여부만 알고 싶을 때 적합한 메서드죠.

```js run
alert( "Widget with id".includes("Widget") ); // true

alert( "Hello".includes("Bye") ); // false
```

`str.includes`도 `str.indexOf`처럼 두 번째 인수를 넘기면 해당 위치부터 부분 문자열을 검색합니다.

```js run
alert( "Widget".includes("id") ); // true
alert( "Widget".includes("id", 3) ); // false, 세 번째 위치 이후엔 "id"가 없습니다.
```

메서드 [str.startsWith](mdn:js/String/startsWith)와 [str.endsWith](mdn:js/String/endsWith)는 문자열 `str`이 특정 문자열로 시작하는지 여부와 특정 문자열로 끝나는지 여부를 확인할 때 사용할 수 있습니다.

```js run
alert( "Widget".startsWith("Wid") ); // true, "Widget"은 "Wid"로 시작합니다.
alert( "Widget".endsWith("get") ); // true, "Widget"은 "get"으로 끝납니다.
```

## 부분 문자열 추출하기

자바스크립트엔 부분 문자열 추출과 관련된 메서드 세 가지 `substring`과 `substr`, `slice`가 있습니다. 

`str.slice(start [, end])`
: 문자열의 `start`부터 `end`까지(`end`는 미포함)를 반환합니다.

    예시:

    ```js run
    let str = "stringify";
    alert( str.slice(0, 5) ); // 'strin', 0번째부터 5번째 위치까지(5번째 위치의 문자는 포함하지 않음)
    alert( str.slice(0, 1) ); // 's', 0번째부터 1번째 위치까지(1번째 위치의 문자는 포함하지 않음)
    ```

    두 번째 인수가 생략된 경우엔 시작 위치부터 문자열 끝까지를 반환합니다.

    ```js run
    let str = "st*!*ringify*/!*";
    alert( str.slice(2) ); // ringify, 2번째부터 끝까지
    ```

    `start`와 `end`에 음수를 넘기면 문자열 끝에서부터 카운팅을 시작합니다.

    ```js run
    let str = "strin*!*gif*/!*y";

    // 끝에서부터 4번째부터 시작해 끝에서부터 1번째 위치까지
    alert( str.slice(-4, -1) ); // gif
    ```

`str.substring(start [, end])`
: `start`와 `end` *사이*에 있는 문자열을 반환합니다.

    `substring`은 `slice`와 아주 유사하지만 `start`가 `end`보다 커도 괜찮다는 데 차이가 있습니다.

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

    `substring`은 `slice`와는 달리 음수 인수를 허용하지 않고, 음수는 `0`으로 취급합니다.

`str.substr(start [, length])`
: `start`에서부터 시작해 `length`만큼의 문자를 반환합니다.

    `substr`은 끝 위치 대신에 길이를 기준으로 문자열을 추출한다는 점에서 `substring`과 `slice`와 차이가 있습니다.

    ```js run
    let str = "st*!*ring*/!*ify";
    alert( str.substr(2, 4) ); // ring, 두 번째부터 문자 네 개
    ```

    첫 번째 인수가 음수라면 뒤에서부터 개수를 셉니다.

    ```js run
    let str = "strin*!*gi*/!*fy";
    alert( str.substr(-4, 2) ); // gi, 끝에서 네 번째 문자부터 문자 두 개
    ```

부분 문자열 추출과 관련된 메서드 세 개를 요약해 보겠습니다.

| 메서드 | 추출할 부분 문자열 | 음수 허용 여부(인수)|
|--------|-----------|-----------|
| `slice(start, end)` | `start`부터 `end`까지(`end`는 미포함) | 음수 허용 |
| `substring(start, end)` | `start`와 `end` *사이* | 음수는 `0`으로 취급함 |
| `substr(start, length)` | `start`부터 `length`만큼의 문자 | 음수 허용 |

```smart header="어떤 메서드를 선택해야 하나요?"
모두 사용해도 괜찮습니다. 그런데 `substr`에는 단점이 하나 있습니다. `substr`는 코어 자바스크립트 명세서(ECMA-262)가 아닌, 부록 B(구식 스크립트에 대응하기 위해 남겨 둔 브라우저 전용 기능들을 명시해 놓음)에 정의되어있습니다. 거의 모든 곳에서 이 메서드가 동작하긴 하지만 브라우저 이외의 호스트 환경에서 제대로 동작하지 않을 확률도 있습니다. 

남은 두 개의 메서드 중 `slice`는 음수 인수를 허용한다는 측면에서 `substring`보다 좀 더 유연합니다. 메서드 이름도 더 짧죠. 따라서 문자열의 일부를 추출하고 싶을 땐 세 메서드 중 `slice`를 사용하시면 될 것 같습니다.
```

## 문자열 비교하기

<info:comparison> 챕터에서 알아보았듯이 문자열을 비교할 땐 알파벳 순서를 기준으로 문자끼리 비교가 이뤄집니다.

그런데 몇 가지 예외사항이 있습니다.

1. 소문자는 대문자보다 항상 큽니다.

    ```js run
    alert( 'a' > 'Z' ); // true
    ```

2. 발음 구별 기호가 붙은 문자는 알파벳 순서 기준을 따르지 않습니다.

    ```js run
    alert( 'Österreich' > 'Zealand' ); // true (Österreich는 오스트리아를 독일어로 표기한 것임)
    ```

    이런 예외사항 때문에 이름순으로 국가를 나열할 때 예상치 못한 결과가 나올 수 있습니다. 사람들은 `Österreich`가 `Zealand`보다 앞서 나올 것이라 예상하는데 그렇지 않죠.

자바스크립트 내부에서 문자열이 어떻게 표시되는지 상기하며 원인을 알아봅시다.

모든 문자열은 [UTF-16](https://en.wikipedia.org/wiki/UTF-16)으로 인코딩되는데, UTF-16은 모든 문자를 코드와 매칭시킵니다. 이런 특징을 이용하면 아래에서 소개해 드릴 메서드를 이용해 코드로 연관 문자를 얻거나 문자로 연관 코드를 알 수 있습니다.

`str.codePointAt(pos)`
: `pos`에 있는 문자의 코드를 반환합니다.

    ```js run
    // 문자는 같지만 케이스는 다르므로 반환되는 코드가 다릅니다.
    alert( "z".codePointAt(0) ); // 122
    alert( "Z".codePointAt(0) ); // 90
    ```

`String.fromCodePoint(code)`
: `code`에 대응하는 문자를 만들어줍니다.

    ```js run
    alert( String.fromCodePoint(90) ); // Z
    ```

    `\u`뒤에 특정 문자에 대응하는 16진수 코드(hex code)를 붙이는 방식으로도 원하는 문자를 만들 수 있습니다.

    ```js run
    // Z의 16진수 코드는 5a입니다.
    alert( '\u005a' ); // Z
    ```

이제 이 배경지식을 가지고 코드 `65`와 `220` 사이(라틴계열 알파벳과 기타 문자들이 여기에 포함됨)에 대응하는 문자가 무엇인지 알아봅시다.

```js run
let str = '';

for (let i = 65; i <= 220; i++) {
  str += String.fromCodePoint(i);
}
alert( str );
// ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
// ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜ
```

보이시나요? 대문자 알파벳이 가장 먼저 나오고 특수문자 몇 개가 나온 이후에 소문자 알파벳이 나오네요. `Ö`은거의 마지막에 출력되고 있습니다.

이제 왜 `a > Z`인지 아시겠죠?

문자는 유니코드를 기준으로 크기를 비교합니다. 코드가 클수록 대응하는 문자 역시 크다고 취급됩니다. 따라서 `a`(97)는 `Z`(90) 보다 큰 문자열이라는 결론이 도출됩니다.

- 알파벳 소문자의 코드는 대문자의 코드보다 크므로 소문자는 대문자 뒤에 옵니다.
- `Ö` 같은 문자는 일반 알파벳과 멀리 떨어져 있습니다. `Ö`의 코드는 알파벳 소문자 코드보다 훨씬 큽니다.

### 문자열 제대로 비교하기

언어마다 문자 체계가 다르기 때문에 문자열을 "제대로" 비교해주는 알고리즘을 만드는 건 생각보다 간단하지 않습니다.

문자열을 비교하려면 일단 페이지에서 어떤 언어를 사용하고 있는지 브라우저가 알아야 합니다.

다행히도 모던 브라우저 대부분이 국제화 관련 표준인 [ECMA-402](http://www.ecma-international.org/ecma-402/1.0/ECMA-402.pdf)를 준수하고 있습니다(IE10은 아쉽게도 [Intl.JS](https://github.com/andyearnshaw/Intl.js/) 라이브러리를 사용해야 합니다).

ECMA-402엔 언어가 다를 때 문자열 비교 규칙과 이와 관련된 메서드가 정의되어있습니다. 

[str.localeCompare(str2)](mdn:js/String/localeCompare)은 ECMA-402에서 정의한 규칙에 따라 `str`이 `str2`보다 작은지, 같은지, 큰지를 나타내주는 정수를 반환합니다. 

- `str`이 `str2`보다 작으면 음수를 반환합니다.
- `str`이 `str2`보다 크면 양수를 반환합니다.
- `str`과 `str2`이 같으면 `0`을 반환합니다.

예시:

```js run
alert( 'Österreich'.localeCompare('Zealand') ); // -1
```

사실 이 메서드엔 선택사항이긴 하지만 인수 두 개를 더 전달할 수 있습니다. 기준이 되는 언어를 지정(아무것도 지정하지 않았으면 호스트 환경의 언어가 기준 언어가 됨)해주는 인수 하나와 대/소문자를 구분할지나 `"a"`와 `"á"`를 다르게 취급할지에 대한 것을 설정해주는 인수 하나가 더 있죠. 자세한 사항은 관련 [페이지](mdn:js/String/localeCompare)에서 확인해 보시기 바랍니다.

## Internals, Unicode

```warn header="Advanced knowledge"
The section goes deeper into string internals. This knowledge will be useful for you if you plan to deal with emoji, rare mathematical or hieroglyphic characters or other rare symbols.

You can skip the section if you don't plan to support them.
```

### Surrogate pairs

All frequently used characters have 2-byte codes. Letters in most european languages, numbers, and even most hieroglyphs, have a 2-byte representation.

But 2 bytes only allow 65536 combinations and that's not enough for every possible symbol. So rare symbols are encoded with a pair of 2-byte characters called "a surrogate pair".

The length of such symbols is `2`:

```js run
alert( '𝒳'.length ); // 2, MATHEMATICAL SCRIPT CAPITAL X
alert( '😂'.length ); // 2, FACE WITH TEARS OF JOY
alert( '𩷶'.length ); // 2, a rare Chinese hieroglyph
```

Note that surrogate pairs did not exist at the time when JavaScript was created, and thus are not correctly processed by the language!

We actually have a single symbol in each of the strings above, but the `length` shows a length of `2`.

`String.fromCodePoint` and `str.codePointAt` are few rare methods that deal with surrogate pairs right. They recently appeared in the language. Before them, there were only [String.fromCharCode](mdn:js/String/fromCharCode) and [str.charCodeAt](mdn:js/String/charCodeAt). These methods are actually the same as `fromCodePoint/codePointAt`, but don't work with surrogate pairs.

Getting a symbol can be tricky, because surrogate pairs are treated as two characters:

```js run
alert( '𝒳'[0] ); // strange symbols...
alert( '𝒳'[1] ); // ...pieces of the surrogate pair
```

Note that pieces of the surrogate pair have no meaning without each other. So the alerts in the example above actually display garbage.

Technically, surrogate pairs are also detectable by their codes: if a character has the code in the interval of `0xd800..0xdbff`, then it is the first part of the surrogate pair. The next character (second part) must have the code in interval `0xdc00..0xdfff`. These intervals are reserved exclusively for surrogate pairs by the standard.

In the case above:

```js run
// charCodeAt is not surrogate-pair aware, so it gives codes for parts

alert( '𝒳'.charCodeAt(0).toString(16) ); // d835, between 0xd800 and 0xdbff
alert( '𝒳'.charCodeAt(1).toString(16) ); // dcb3, between 0xdc00 and 0xdfff
```

You will find more ways to deal with surrogate pairs later in the chapter <info:iterable>. There are probably special libraries for that too, but nothing famous enough to suggest here.

### Diacritical marks and normalization

In many languages there are symbols that are composed of the base character with a mark above/under it.

For instance, the letter `a` can be the base character for: `àáâäãåā`. Most common "composite" character have their own code in the UTF-16 table. But not all of them, because there are too many possible combinations.

To support arbitrary compositions, UTF-16 allows us to use several unicode characters: the base character followed by one or many "mark" characters that "decorate" it.

For instance, if we have `S` followed by the special "dot above" character (code `\u0307`), it is shown as Ṡ.

```js run
alert( 'S\u0307' ); // Ṡ
```

If we need an additional mark above the letter (or below it) -- no problem, just add the necessary mark character.

For instance, if we append a character "dot below" (code `\u0323`), then we'll have "S with dots above and below": `Ṩ`.

For example:

```js run
alert( 'S\u0307\u0323' ); // Ṩ
```

This provides great flexibility, but also an interesting problem: two characters may visually look the same, but be represented with different unicode compositions.

For instance:

```js run
let s1 = 'S\u0307\u0323'; // Ṩ, S + dot above + dot below
let s2 = 'S\u0323\u0307'; // Ṩ, S + dot below + dot above

alert( `s1: ${s1}, s2: ${s2}` );

alert( s1 == s2 ); // false though the characters look identical (?!)
```

To solve this, there exists a "unicode normalization" algorithm that brings each string to the single "normal" form.

It is implemented by [str.normalize()](mdn:js/String/normalize).

```js run
alert( "S\u0307\u0323".normalize() == "S\u0323\u0307".normalize() ); // true
```

It's funny that in our situation `normalize()` actually brings together a sequence of 3 characters to one: `\u1e68` (S with two dots).

```js run
alert( "S\u0307\u0323".normalize().length ); // 1

alert( "S\u0307\u0323".normalize() == "\u1e68" ); // true
```

In reality, this is not always the case. The reason being that the symbol `Ṩ` is "common enough", so UTF-16 creators included it in the main table and gave it the code.

If you want to learn more about normalization rules and variants -- they are described in the appendix of the Unicode standard: [Unicode Normalization Forms](http://www.unicode.org/reports/tr15/), but for most practical purposes the information from this section is enough.

## 요약

- 자바스크립트엔 세 종류의 따옴표가 있는데, 이 중 하나인 백틱은 문자열을 여러 줄에 걸쳐 쓸 수 있게 해주고 문자열 중간에 `${…}`을 사용해 표현식도 넣을 수 있다는 점이 특징입니다.
- 자바스크립트에선 문자열이 UTF-16을 사용해 인코딩됩니다.
- `\n`같이 특수문자를 사용할 수 있습니다. `\u...`와 해당 문자의 유니코드를 조합하면 원하는 문자를 출력할 수도 있습니다.
- 대괄호 `[]`를 사용하면 문자 하나를 얻을 수 있습니다.
- `slice`나 `substring`을 사용하면 부분 문자열을 얻을 수 있습니다.
- 소문자로 바꾸려면 `toLowerCase`, 대문자로 바꾸려면 `toUpperCase`를 사용하세요.
- `indexOf`를 사용하면 부분 문자열의 위치를 찾을 수 있습니다. 부분 문자열 여부만 알고 싶다면 `includes/startsWith/endsWith`를 사용하면 됩니다.
- 비교 기준을 언어에 적합하게 바꿔 비교하려면 `localeCompare`를 사용하세요. 이 메서드를 사용하지 않으면 문자열 코드를 기준으로 문자열을 비교합니다.

위에서 학습한 메서드 이외에도 문자열에 쓸 수 있는 유용한 메서드 몇 가지를 소개해드립니다.

- `str.trim()` -- 문자열 앞과 끝의 공백문자를 다듬어 줍니다(제거함).
- `str.repeat(n)` -- 문자열을 `n`번 반복합니다.
- 이 외의 다양한 문자열 메서드는 [MDN 문서](mdn:js/String)에서 확인해보시기 바랍니다.

정규 표현을 사용해 문자열을 찾거나 교체해주는 메서드도 여러 개 있는데 이는 아주 큰 주제이기 때문에 별도의 섹션 <info:regular-expressions>에서 다루도록 하겠습니다. 
