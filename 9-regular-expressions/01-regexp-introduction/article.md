# 패턴과 플래그

Regular expressions is a powerful way to search and replace in text.

In JavaScript, they are available as [RegExp](mdn:js/RegExp) object, and also integrated in methods of strings.

## 정규 표현식

정규 표현식("regexp" 또는 그냥 "reg"라고도 합니다)은 *패턴*과 선택적인 *플래그*로 구성됩니다

정규식 객체를 만드는 데에는 두 가지 문법이 있습니다.

긴 문법입니다.

```js
regexp = new RegExp("pattern", "flags");
```

그리고 짧게는, 슬래시 ``/ "`를 사용합니다.

```js
regexp = /pattern/; // 플래그 없음
regexp = /pattern/gmi; // 플래그 g, m, i가 있는 경우 (곧 다룰 예정)
```

<<<<<<< HEAD
슬래시``/ "`는 자바스크립트에 정규 표현식을 생성하고 있다는 것을 알려줍니다. 문자열에 따옴표를 쓰는 것과 동일한 역할을 합니다.

## 사용법

문자열 안에서 검색하려면 [search](mdn:js/String/search) 메서드를 사용할 수 있습니다.

다음은 그 예입니다.

```js run
let str = "I love JavaScript!"; // 여기에서 검색할 것입니다.
=======
Slashes `pattern:/.../` tell JavaScript that we are creating a regular expression. They play the same role as quotes for strings.

In both cases `regexp` becomes an object of the built-in `RegExp` class.

The main difference between these two syntaxes is that slashes `pattern:/.../` do not allow to insert expressions (like strings with `${...}`). They are fully static.

Slashes are used when we know the regular expression at the code writing time -- and that's the most common situation. While `new RegExp` is used when we need to create a regexp "on the fly", from a dynamically generated string, for instance:

```js
let tag = prompt("What tag do you want to find?", "h2");
>>>>>>> 3dd8ca09c1a7ed7a7b04eefc69898559902478e1

let regexp = new RegExp(`<${tag}>`); // same as /<h2>/ if answered "h2" in the prompt above
```

<<<<<<< HEAD
`str.search` 메서드는 `pattern:/love/` 패턴을 찾고 문자열 안의 위치를 ​​돌려줍니다. 추측할 수 있듯이 `pattern:/love/` 는 가능한 패턴 중에 가장 단순한 것입니다. 이것이 하는 일은 간단한 부분 문자열 검색입니다.

위의 코드는 다음과 동일합니다.
=======
## Flags

Regular expressions may have flags that affect the search.
>>>>>>> 3dd8ca09c1a7ed7a7b04eefc69898559902478e1

There are only 6 of them in JavaScript:

`pattern:i`
: With this flag the search is case-insensitive: no difference between `A` and `a` (see the example below).

<<<<<<< HEAD
그러니까 `pattern:/love/` 를 찾는 건 `"love"` 를 찾는 것과 같습니다

하지만 단지 지금만 그렇습니다. 곧 더 많은 검색 파워를 가진 더 복잡한 정규 표현식을 만들어낼 것입니다.
=======
`pattern:g`
: With this flag the search looks for all matches, without it -- only the first one.

`pattern:m`
: Multiline mode (covered in the chapter <info:regexp-multiline-mode>).

`pattern:s`
: Enables "dotall" mode, that allows a dot `pattern:.` to match newline character `\n` (covered in the chapter <info:regexp-character-classes>).

`pattern:u`
: Enables full unicode support. The flag enables correct processing of surrogate pairs. More about that in the chapter <info:regexp-unicode>.

`pattern:y`
: "Sticky" mode: searching at the exact position in the text  (covered in the chapter <info:regexp-sticky>)
>>>>>>> 3dd8ca09c1a7ed7a7b04eefc69898559902478e1

```smart header="색상"
여기에서 색상 구성은 다음과 같습니다.

- 정규표현식 -- `pattern:빨강`
- (검색할) 문자열  -- `subject:파랑`
- 결과 -- `match:초록`
```

## Searching: str.match

<<<<<<< HEAD
````smart header="언제 `new RegExp`을 사용할까요?"
보통 우리는 짧은 구문 `/.../`을 사용합니다. 그러나 이것은 변수 삽입 `$ {...}`을 지원하지 않습니다.

반면에, `new RegExp` 는 문자열로부터 패턴을 동적으로 생성할 수 있게 해주므로, 보다 유연합니다

다음은 동적으로 생성 된 정규 표현식의 예입니다.

```js run
let tag = prompt("어떤 태그를 검색하고 싶습니까?", "h2");
let regexp = new RegExp(`<${tag}>`);

// <h2>를 기본적으로 찾습니다
alert( "<h1> <h2> <h3>".search(regexp));
```
````
=======
As it was said previously, regular expressions are integrated with string methods.

The method `str.match(regexp)` finds all matches of `regexp` in the string `str`.

It has 3 working modes:

1. If the regular expression has flag `pattern:g`, it returns an array of all matches:
    ```js run
    let str = "We will, we will rock you";

    alert( str.match(/we/gi) ); // We,we (an array of 2 substrings that match)
    ```
    Please note that both `match:We` and `match:we` are found, because flag `pattern:i` makes the regular expression case-insensitive.
>>>>>>> 3dd8ca09c1a7ed7a7b04eefc69898559902478e1

2. If there's no such flag it returns only the first match in the form of an array, with the full match at index `0` and some additional details in properties:
    ```js run
    let str = "We will, we will rock you";

<<<<<<< HEAD
## 플래그

정규 표현식에는 검색에 영향을 주는 플래그가 있을 수 있습니다.

자바스크립트에는 딱 6개가 있습니다.

`i`
: 이 플래그를 사용하면 대소문자 구분 없이 검색합니다. `A`와 `a`는 차이가 없습니다 (아래 예 참조).

`g`
: 이 플래그를 사용하면 일치하는 처음 항목 뿐만 아니라 일치하는 모든 항목을 검색합니다. (다음 챕터에 예시가 있습니다).

`m`
다중 행 모드 (<info:regexp-multiline-mode> 챕터 참조).

`s`
: "Dotall" 모드는 `.` 문자가 개행 문자도 포함하도록 합니다 (<info:regexp-character-classes> 챕터 참조).

`u`
: 유니코드를 완벽하게 지원합니다. 이 플래그를 사용하면 surrogate pair를 올바르게 처리할 수 있습니다. 자세한 내용은 <info:regexp-unicode> 챕터를 참조하세요.

`y`
: Sticky Mode (<info:regexp-sticky> 챕터 참조)

튜토리얼에서 이 모든 플래그를 더 자세히 다루겠습니다.

지금은, 가장 간단한 플래그 `i`의 예제를 살펴봅시다.
=======
    let result = str.match(/we/i); // without flag g

    alert( result[0] );     // We (1st match)
    alert( result.length ); // 1

    // Details:
    alert( result.index );  // 0 (position of the match)
    alert( result.input );  // We will, we will rock you (source string)
    ```
    The array may have other indexes, besides `0` if a part of the regular expression is enclosed in parentheses. We'll cover that in the chapter  <info:regexp-groups>.

3. And, finally, if there are no matches, `null` is returned (doesn't matter if there's flag `pattern:g` or not).

    That's a very important nuance. If there are no matches, we get not an empty array, but `null`. Forgetting about that may lead to errors, e.g.:

    ```js run
    let matches = "JavaScript".match(/HTML/); // = null

    if (!matches.length) { // Error: Cannot read property 'length' of null
      alert("Error in the line above");
    }
    ```

    If we'd like the result to be always an array, we can write it this way:

    ```js run
    let matches = "JavaScript".match(/HTML/)*!* || []*/!*;

    if (!matches.length) {
      alert("No matches"); // now it works
    }
    ```

## Replacing: str.replace

The method `str.replace(regexp, replacement)` replaces matches with `regexp` in string `str` with `replacement` (all matches, if there's flag `pattern:g`, otherwise only the first one).

For instance:
>>>>>>> 3dd8ca09c1a7ed7a7b04eefc69898559902478e1

```js run
// no flag g
alert( "We will, we will".replace(/we/i, "I") ); // I will, we will

// with flag g
alert( "We will, we will".replace(/we/ig, "I") ); // I will, I will
```

The second argument is the `replacement` string. We can use special character combinations in it to insert fragments of the match:

<<<<<<< HEAD
alert( str.search(/LOVE/i) ); // 2 (소문자를 찾았습니다)

alert( str.search(/LOVE/) ); // -1 ('i' 플래그 없이는 아무것도 찾지 못했습니다)
```

이미 `i` 플래그가 단순한 부분 문자열 검색보다는 정규 표현식을 더 강력한 것으로 만듭니다. 하지만 훨씬 더 많은 것이 있습니다. 다음 챕터들에서 다른 플래그와 기능에 대해 다룰 것입니다.
=======
| Symbols | Action in the replacement string |
|--------|--------|
|`$&`|inserts the whole match|
|<code>$&#096;</code>|inserts a part of the string before the match|
|`$'`|inserts a part of the string after the match|
|`$n`|if `n` is a 1-2 digit number, then it inserts the contents of n-th parentheses, more about it in the chapter <info:regexp-groups>|
|`$<name>`|inserts the contents of the parentheses with the given `name`, more about it in the chapter <info:regexp-groups>|
|`$$`|inserts character `$` |

An example with `pattern:$&`:

```js run
alert( "I love HTML".replace(/HTML/, "$& and JavaScript") ); // I love HTML and JavaScript
```

## Testing: regexp.test

The method `regexp.test(str)` looks for at least one match, if found, returns `true`, otherwise `false`.

```js run
let str = "I love JavaScript";
let regexp = /LOVE/i;

alert( regexp.test(str) ); // true
```

Further in this chapter we'll study more regular expressions, come across many other examples and also meet other methods.
>>>>>>> 3dd8ca09c1a7ed7a7b04eefc69898559902478e1

Full information about the methods is given in the article <info:regexp-methods>.

## 요약

<<<<<<< HEAD
- 정규 표현식은 패턴과 선택적인 플래그 `g`,`i`,`m`,`u`,`s`,`y` 로 구성됩니다.
- 플래그와 나중에 공부할 특수 기호가 없으면, 정규 표현식을 사용한 검색은 부분 문자열 검색과 동일합니다.
-`str.search(regexp` 메서드는 일치 항목의 인덱스를 반환하고, 만약 일치하는 것이 없다면 `-1`을 반환합니다. 다음 챕터에서는 다른 메서드를 살펴보겠습니다.
=======
- A regular expression consists of a pattern and optional flags: `pattern:g`, `pattern:i`, `pattern:m`, `pattern:u`, `pattern:s`, `pattern:y`.
- Without flags and special symbols that we'll study later, the search by a regexp is the same as a substring search.
- The method `str.match(regexp)` looks for matches: all of them if there's `pattern:g` flag, otherwise only the first one.
- The method `str.replace(regexp, replacement)` replaces matches with `regexp` by `replacement`: all of them if there's `pattern:g` flag, otherwise only the first one.
- The method `regexp.test(str)` returns `true` if there's at least one match, otherwise `false`.
>>>>>>> 3dd8ca09c1a7ed7a7b04eefc69898559902478e1
