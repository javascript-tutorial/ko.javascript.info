문자 `#`과 16진수 문자 6개로 이루어진 문자열을 찾아야 합니다.

16진수 문자는 `pattern:[0-9a-fA-F]`로 나타낼 수 있습니다. 또는 표현식에 `pattern:i` 플래그를 추가하여, `pattern:[0-9a-f]`로만 16진수 문자를 표현하는 것도 가능합니다.

그다음으로는 해당 문자 6개가 필요하므로 수량자 `pattern:{6}`을 추가합니다.

완성된 정규 표현식은 다음과 같습니다. `pattern:/#[a-f0-9]{6}/gi`

```js run
let regexp = /#[a-f0-9]{6}/gi;

let str = "color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2"

alert( str.match(regexp) );  // #121212,#AA00ef
```

이 정규 표현식은 더 긴 형태의 색상 문자열도 결과에 포함되는 문제가 있습니다.

```js run
alert( "#12345678".match( /#[a-f0-9]{6}/gi ) ) // #123456
```

이 문제의 해결을 위해, 표현식의 마지막에 `pattern:\b`를 추가합니다.

```js run
// color
alert( "#123456".match( /#[a-f0-9]{6}\b/gi ) ); // #123456

// not a color
alert( "#12345678".match( /#[a-f0-9]{6}\b/gi ) ); // null
```
