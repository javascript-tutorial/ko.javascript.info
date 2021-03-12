# 패턴과 플래그

정규 표현식(regular expression)은 문자 검색과 교체에 사용되는 패턴으로 강력한 기능을 제공합니다.

자바스크립트에선 [RegExp](mdn:js/RegExp) 객체와 문자열 메서드를 조합해 정규표현식을 사용할 수 있습니다. 

## 정규 표현식

정규 표현식('regexp' 또는 'reg'라고 줄여서 사용)은 *패턴(pattern)* 과 선택적으로 사용할 수 있는 *플래그(flag)* 로 구성됩니다.

정규식 객체를 만들 땐 두 가지 문법이 사용됩니다.

'긴' 문법은 다음과 같습니다.

```js
regexp = new RegExp("pattern", "flags");
```

'짧은' 문법은 슬래시(빗금) `"/"`를 사용합니다.

```js
regexp = /pattern/; // 플래그가 없음
regexp = /pattern/gmi; // 플래그 g, m, i가 있음(각 플래그에 대해선 곧 다룰 예정)
```

슬래시 `"/"`는 자바스크립트에게 정규 표현식을 생성하고 있다는 것을 알려줍니다. 문자열에 따옴표를 쓰는 것과 동일한 역할을 하죠.

짧은 문법을 사용하던 긴 문법을 사용하던 상관 없이 위 예시에서의 `regexp`는 내장 클래스 `RegExp`의 인스턴스가 됩니다.

두 문법의 중요한 차이점은 `/.../`를 사용하면 문자열 템플릿 리터럴에서 `${...}`를 사용했던 것처럼 중간에 표현식을 넣을 수 없다는 점입니다. 슬래시를 사용한 방법은 완전히 정적입니다.

슬래시를 사용한 짧은 문법은 코드를 작성하는 시점에 패턴을 알고 있을 때 사용합니다. 아마 대다수가 이런 경우에 속할 겁니다. 반면 `new RegExp`를 사용한 긴 문법은 '상황에 따라' 동적으로 생성된 문자열을 가지고 정규 표현식을 만들어야 할 때 주로 사용합니다. 관련 예시를 살펴봅시다.

```js
let tag = prompt("어떤 태그를 찾고 싶나요?", "h2");

let regexp = new RegExp(`<${tag}>`); // 프롬프트에서 "h2"라고 대답한 경우, /<h2>/와 동일한 역할을 합니다.
```

## 플래그

정규 표현식엔 검색에 영향을 주는 플래그를 선택적으로 붙일 수 있습니다.

자바스크립트는 6개의 플래그를 지원합니다.

`pattern:i`
: i 플래그가 붙으면 대·소문자 구분 없이 검색합니다. 따라서 `A`와 `a`에 차이가 없습니다(아래 예시 참조).

`pattern:g`
: g 플래그가 붙으면 패턴과 일치하는 모든 것들을 찾습니다. g 플래그가 없으면 패턴과 일치하는 첫 번째 결과만 반환됩니다.

`pattern:m`
: 다중 행 모드(multiline mode)를 활성화합니다. 자세한 내용은 <info:regexp-multiline-mode>에서 다룰 예정입니다.

`pattern:s`
: `pattern:.`이 개행 문자 `\n`도 포함하도록 'dotall' 모드를 활성화합니다. 자세한 내용은 <info:regexp-character-classes>에서 다룰 예정입니다.

`pattern:u`
: 유니코드 전체를 지원합니다. 이 플래그를 사용하면 서로게이트 쌍(surrogate pair)을 올바르게 처리할 수 있습니다. 자세한 내용은 <info:regexp-unicode>에서 다룰 예정입니다.

`pattern:y`
: 문자 내 특정 위치에서 검색을 진행하는 'sticky' 모드를 활성화 시킵니다. 자세한 내용은 <info:regexp-sticky>에서 다룰 예정입니다.

```smart header="색상"
정규 표현식을 설명할 때 사용되는 밑줄의 색상은 각각 다음과 같은 상징이 있습니다. 

- 정규표현식 -- `pattern:빨강`
- 검색할 문자열  -- `subject:파랑`
- 검색 결과 -- `match:초록`
```

## str.match로 검색하기

앞서 언급한 바와 같이 정규 표현식은 문자열 메서드와 조합하여 사용합니다.

`str.match(regexp)`를 호출하면 문자열 `str`에서 `regexp`와 일치하는 것들을 찾아내는 식으로 말이죠.

`str.match`엔 세 가지 모드가 있습니다.

1. 정규 표현식에 플래그 `pattern:g`가 붙으면 패턴과 일치하는 모든 것을 담은 배열을 반환합니다.
    ```js run
    let str = "We will, we will rock you";

    alert( str.match(/we/gi) ); // We,we (패턴과 일치하는 부분 문자열 두 개를 담은 배열)
    ```
    대·소문자 구분 없이 검색을 할 수 있도록 하는 플래그 `pattern:i`를 사용했기 때문에 `match:We`와 `match:we` 모두가 반환되었습니다.

2. 플래그 `pattern:g`가 붙지 않은 경우엔 패턴에 맞는 첫 번째 부분 문자열만 담은 배열을 반환합니다. 해당 문자열은 배열 인덱스 `0`에 저장되는데 이 문자열의 프로퍼티엔 상세한 추가 정보가 저장됩니다.
    ```js run
    let str = "We will, we will rock you";

    let result = str.match(/we/i); // 플래그 g 없음

    alert( result[0] );     // We (패턴에 일치하는 첫 번째 부분 문자열)
    alert( result.length ); // 1

    // Details:
    alert( result.index );  // 0 (부분 문자열의 위치)
    alert( result.input );  // We will, we will rock you (원본 문자열)
    ```
    그런데 정규 표현식을 괄호로 둘러싼 경우엔 메서드 호출 시 반환되는 배열에 `0` 이외에도 다른 인덱스가 있을 수 있습니다. 자세한 내용은 <info:regexp-groups>에서 다루겠습니다.

3. 플래그 `pattern:g`의 유무와 상관없이 패턴과 일치하는 부분 문자열을 찾지 못한 경우엔 `null`이 반환됩니다.

    일치하는 부분 문자열이 없는 경우엔 빈 배열이 아닌 `null`을 반환한다는 점은 아주 중요한 차이점입니다. 이런 점을 잊고 코딩 하다 보면 다음과 같이 에러가 발생할 수 있습니다.

    ```js run
    let matches = "JavaScript".match(/HTML/); // matches엔 null이 저장됨

    if (!matches.length) { // TypeError: Cannot read property 'length' of null
      alert("바로 윗줄에서 에러가 발생합니다.");
    }
    ```

    `str.match` 호출 결과가 항상 배열이 되게 하려면 아래와 같은 방법을 사용하면 됩니다.

    ```js run
    let matches = "JavaScript".match(/HTML/)*!* || []*/!*;

    if (!matches.length) {
      alert("정규 표현식과 일치하는 부분 문자열이 없습니다."); // 이제 에러없이 잘 동작하네요.
    }
    ```

## str.replace로 치환하기

메서드 `str.replace(regexp, replacement)`를 사용하면 `str` 내 부분 문자열 중 `regexp`에 일치하는 부분 문자열을 `replacement`로 교체할 수 있습니다. 이때 플래그 `pattern:g`가 있으면 모든 부분 문자열이 교체되고, 그렇지 않으면 첫 번째 부분 문자열만 교체됩니다.

예시:

```js run
// 플래그 g 없음
alert( "We will, we will".replace(/we/i, "I") ); // I will, we will

// 플래그 g 있음
alert( "We will, we will".replace(/we/ig, "I") ); // I will, I will
```

여기서 두 번째 인수 `replacement`는 문자열인데, 문자열 안에 다음과 같은 특수 문자를 넣어주면 독특한 방식으로 문자열을 교체할 수 있습니다.

| 특수 문자 | 교체 방식 |
|--------|--------|
|`$&`|패턴과 일치하는 부분 문자열|
|<code>$&#096;</code>|inserts a part of the string before the match|
|`$'`|inserts a part of the string after the match|
|`$n`|if `n` is a 1-2 digit number, then it inserts the contents of n-th parentheses, more about it in the chapter <info:regexp-groups>|
|`$<name>`|inserts the contents of the parentheses with the given `name`, more about it in the chapter <info:regexp-groups>|
|`$$`|inserts character `$` |

`pattern:$&`를 사용한 예시를 살펴봅시다.

```js run
alert( "I love HTML".replace(/HTML/, "$& and JavaScript") ); // I love HTML and JavaScript
```

## regexp.test로 일치 여부 확인하기

패턴과 일치하는 부분 문자열이 하나라도 있는 경우 메서드 `regexp.test(str)`을 호출하면 `true`가, 그렇지 않으면 `false`가 반환됩니다.

```js run
let str = "I love JavaScript";
let regexp = /LOVE/i;

alert( regexp.test(str) ); // true
```

지금까지 살펴본 내용은 기본에 불과합니다. 이제 이어지는 챕터들에선 더 많은 정규 표현식과 예시들, 메서드들을 살펴보도록 하겠습니다.

메서드들에 대한 정보는 <info:regexp-methods>에서 확인할 수 있으니 참고 바랍니다.

## 요약

- 정규 표현식은 패턴과 선택적으로 사용할 수 있는 플래그 `pattern:g`, `pattern:i`, `pattern:m`, `pattern:u`, `pattern:s`, `pattern:y`로 구성됩니다.
- 플래그와 특수 기호(추후 학습)가 없는 경우엔 일반적인 부분 문자열 검색과 동일한 방식으로 검색이 진행됩니다.
- 플래그 `pattern:g`가 있는 경우엔 `str.match(regexp)`는 패턴과 일치하는 모든 부분 문자열을 검색합니다. `pattern:g`가 없는 경우엔 첫 번째 부분 문자열만 찾습니다.
- `str.replace(regexp, replacement)`는 `regexp`과 일치하는 부분 문자열을 `replacement`로 교체합니다. `pattern:g` 플래그가 있으면 부분 문자열 전체를, 없으면 첫 번째 부분 문자열을 교체합니다.
- 패턴과 일치하는 부분 문자열이 하나라도 있는 경우 `regexp.test(str)`는 `true`를 반환합니다. 그렇지 않으면 `false`가 반환됩니다.
