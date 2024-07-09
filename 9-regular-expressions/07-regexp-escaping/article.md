
# 이스케이핑(Escaping), 특수 문자들

우리가 보았듯이, 역슬래시 `\` 는 문자 클래스들을 표시하기 위해 사용됩니다, 예시. `\d`. 따라서 이것은 정규식에서 특수 문자입니다 (정규 문자열에서와 같이)

정규식에서 특수한 의미를 갖는 다른 특수 문자들도 있습니다. 이 특수 문자들은 강력한 검색을 합니다. 특수 문자들의 총목록: `[ \ ^ $ . | ? * + ( )`.

이 목록을 모두 암기하려 하지 마세요. -- 우리는 이것들을 하나씩 다룰 것이기 때문에 자연스럽게 습득할 수 있을 것 입니다. 

## 이스케이핑(Escaping)

우리가 문자 그대로 .(dot)을 찾고 싶다고 가정합시다. "아무 문자"가 아니라, 오직 .(dot)을 찾고 싶다고 가정합시다.

특수 문자를 정규 문자로 사용하기 위해, 앞에 역스래시를 붙이세요: `\.`.

이것은 "문자를 이스케이핑(Escaping)하는 것"이라고도 부릅니다.

예를 들어:
```js run
alert( "Chapter 5.1".match(/\d\.\d/) ); // 5.1 (match!)
alert( "Chapter 511".match(/\d\.\d/) ); // null (looking for a real dot \.)
```

괄호 역시 특수 문자이다. 따라서 우리가 괄호를 사용하려면 우리는 `\(`을 사용해야 한다. 아래 예제는 문자열`"g()"`:을 찾는다

```js run
alert( "function g()".match(/g\(\)/) ); // "g()"
```

만약 우리가 역슬래시 `\`를 찾고 있다면, 이것은 정규 문자열과 정규식에서 모두 특수 문자이기 때문에 우리는 역슬래시를 두 번 써야 합니다. 

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
