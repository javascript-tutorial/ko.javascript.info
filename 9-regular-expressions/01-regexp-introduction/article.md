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

그리고 짧게는, 슬래시 `"/"`를 사용합니다.

```js
regexp = /pattern/; // 플래그 없음
regexp = /pattern/gmi; // 플래그 g, m, i가 있는 경우 (곧 다룰 예정)
```

슬래시`"/"`는 자바스크립트에 정규 표현식을 생성하고 있다는 것을 알려줍니다. 문자열에 따옴표를 쓰는 것과 동일한 역할을 합니다.

In both cases `regexp` becomes an object of the built-in `RegExp` class.

The main difference between these two syntaxes is that slashes `pattern:/.../` do not allow to insert expressions (like strings with `${...}`). They are fully static.

Slashes are used when we know the regular expression at the code writing time -- and that's the most common situation. While `new RegExp` is used when we need to create a regexp "on the fly", from a dynamically generated string, for instance:

```js
let tag = prompt("What tag do you want to find?", "h2");

let regexp = new RegExp(`<${tag}>`); // same as /<h2>/ if answered "h2" in the prompt above
```

## 플래그

정규 표현식에는 검색에 영향을 주는 플래그가 있을 수 있습니다.

자바스크립트에는 딱 6개가 있습니다.

`pattern:i`
: 이 플래그를 사용하면 대소문자 구분 없이 검색합니다. `A`와 `a`는 차이가 없습니다(아래 예 참조).

`pattern:g`
: 이 플래그를 사용하면 일치하는 처음 항목 뿐만 아니라 일치하는 모든 항목을 검색합니다.

`pattern:m`
: 다중 행 모드(<info:regexp-multiline-mode> 챕터 참조)

`pattern:s`
: "dotall" 모드를 활성화 시켜 `pattern:.` 문자가 개행 문자 `\n`도 포함하도록 합니다(<info:regexp-character-classes> 챕터 참조).

`pattern:u`
: 유니코드를 완벽하게 지원합니다. 이 플래그를 사용하면 surrogate pair를 올바르게 처리할 수 있습니다. 자세한 내용은 <info:regexp-unicode> 챕터를 참조하세요.

`pattern:y`
: "Sticky" Mode: searching at the exact position in the text (<info:regexp-sticky> 챕터 참조)

```smart header="색상"
여기에서 색상 구성은 다음과 같습니다.

- 정규표현식 -- `pattern:빨강`
- (검색할) 문자열  -- `subject:파랑`
- 결과 -- `match:초록`
```

## Searching: str.match

As it was said previously, regular expressions are integrated with string methods.

The method `str.match(regexp)` finds all matches of `regexp` in the string `str`.

It has 3 working modes:

1. If the regular expression has flag `pattern:g`, it returns an array of all matches:
    ```js run
    let str = "We will, we will rock you";

    alert( str.match(/we/gi) ); // We,we (an array of 2 substrings that match)
    ```
    Please note that both `match:We` and `match:we` are found, because flag `pattern:i` makes the regular expression case-insensitive.

2. If there's no such flag it returns only the first match in the form of an array, with the full match at index `0` and some additional details in properties:
    ```js run
    let str = "We will, we will rock you";

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

```js run
// no flag g
alert( "We will, we will".replace(/we/i, "I") ); // I will, we will

// with flag g
alert( "We will, we will".replace(/we/ig, "I") ); // I will, I will
```

The second argument is the `replacement` string. We can use special character combinations in it to insert fragments of the match:

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

Full information about the methods is given in the article <info:regexp-methods>.

## Summary

- A regular expression consists of a pattern and optional flags: `pattern:g`, `pattern:i`, `pattern:m`, `pattern:u`, `pattern:s`, `pattern:y`.
- Without flags and special symbols that we'll study later, the search by a regexp is the same as a substring search.
- The method `str.match(regexp)` looks for matches: all of them if there's `pattern:g` flag, otherwise only the first one.
- The method `str.replace(regexp, replacement)` replaces matches with `regexp` by `replacement`: all of them if there's `pattern:g` flag, otherwise only the first one.
- The method `regexp.test(str)` returns `true` if there's at least one match, otherwise `false`.
