# HTML 태그들을 찾아 보세요

HTML의 프로퍼티를 포함한 모든 태그(열리고 닫히는)를 찾기 위한 정규표현식을 작성하세요.

예제:

```js run
let regexp = /your regexp/g;

let str = '<> <a href="/"> <input type="radio" checked> <b>';

alert( str.match(regexp) ); // '<a href="/">', '<input type="radio" checked>', '<b>'
```

단순화하기 위해 태그의 프로퍼티들은 `<`와 `>`을 포함하지 않는다고 가정합니다. (프로퍼티의 값 내부에서도)
