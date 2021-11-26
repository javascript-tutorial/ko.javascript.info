
# Escaping, special characters

본 바와 같이, 백슬래쉬 `pattern:\`는 글자 클래스를 나타내는데 사용됩니다, 예 : `pattern:\d`. 따라서 이는 정규 표현식의 특수문자 입니다. (일반 문자열도 해당).

정규 표현식에서 특별한 의미를 가지는 다른 특수 문자도 있습니다. 이는 보다 강력한 검색에 사용됩니다. 다음은 전체 리스트 입니다 : `pattern:[ \ ^ $ . | ? * + ( )`.

Don't try to remember the list -- soon we'll deal with each of them separately and you'll know them by heart automatically.

## Escaping

Let's say we want to find literally a dot. Not "any character", but just a dot.

To use a special character as a regular one, prepend it with a backslash: `pattern:\.`.

That's also called "escaping a character".

For example:
```js run
alert( "Chapter 5.1".match(/\d\.\d/) ); // 5.1 (match!)
alert( "Chapter 511".match(/\d\.\d/) ); // null (looking for a real dot \.)
```

Parentheses are also special characters, so if we want them, we should use `pattern:\(`. The example below looks for a string `"g()"`:

```js run
alert( "function g()".match(/g\(\)/) ); // "g()"
```

If we're looking for a backslash `\`, it's a special character in both regular strings and regexps, so we should double it.

```js run
alert( "1\\2".match(/\\/) ); // '\'
```

## A slash

A slash symbol `'/'` is not a special character, but in JavaScript it is used to open and close the regexp: `pattern:/...pattern.../`, so we should escape it too.

Here's what a search for a slash `'/'` looks like:

```js run
alert( "/".match(/\//) ); // '/'
```

On the other hand, if we're not using `pattern:/.../`, but create a regexp using `new RegExp`, then we don't need to escape it:

```js run
alert( "/".match(new RegExp("/")) ); // finds /
```

## new RegExp

If we are creating a regular expression with `new RegExp`, then we don't have to escape `/`, but need to do some other escaping.

For instance, consider this:

```js run
let regexp = new RegExp("\d\.\d");

alert( "Chapter 5.1".match(regexp) ); // null
```

The similar search in one of previous examples worked with `pattern:/\d\.\d/`, but `new RegExp("\d\.\d")` doesn't work, why?

The reason is that backslashes are "consumed" by a string. As we may recall, regular strings have their own special characters, such as `\n`, and a backslash is used for escaping.

Here's how "\d\.\d" is preceived:

```js run
alert("\d\.\d"); // d.d
```

String quotes "consume" backslashes and interpret them on their own, for instance:

- `\n` -- becomes a newline character,
- `\u1234` -- becomes the Unicode character with such code,
- ...And when there's no special meaning: like `pattern:\d` or `\z`, then the backslash is simply removed.

So `new RegExp` gets a string without backslashes. That's why the search doesn't work!

To fix it, we need to double backslashes, because string quotes turn `\\` into `\`:

```js run
*!*
let regStr = "\\d\\.\\d";
*/!*
alert(regStr); // \d\.\d (correct now)

let regexp = new RegExp(regStr);

alert( "Chapter 5.1".match(regexp) ); // 5.1
```

## Summary

- To search for special characters `pattern:[ \ ^ $ . | ? * + ( )` literally, we need to prepend them with a backslash `\` ("escape them").
- We also need to escape `/` if we're inside `pattern:/.../` (but not inside `new RegExp`).
- When passing a string `new RegExp`, we need to double backslashes `\\`, cause string quotes consume one of them.
