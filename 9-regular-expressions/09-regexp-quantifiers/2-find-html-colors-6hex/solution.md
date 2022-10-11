6개의 16진수가 뒤에 오는 `#`을 찾아야 합니다.

16진수 문자는 `pattern:[0-9a-fA-F]`와 같이 표현할 수 있습니다. `pattern:i` 플래그를 사용하는 경우엔 `pattern:[0-9a-f]`로도 표현 가능합니다.

이후 수량자(quantifier) `pattern:{6}`를 사용해 6개의 16진수를 찾습니다.

그 결과 `pattern:/#[a-f0-9]{6}/gi`라는 정규표현식이 도출됩니다.

```js run
let regexp = /#[a-f0-9]{6}/gi;

let str = "color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2"

alert( str.match(regexp) );  // #121212,#AA00ef
```

그런데 이 정규표현식은 6자리보다 긴 16진수가 뒤에 오는 경우도 검출한다는 문제가 있습니다.

```js run
alert( "#12345678".match( /#[a-f0-9]{6}/gi ) ) // #123456
```

이를 해결하려면 정규표현식 끝부분에 `pattern:\b`를 추가하면 됩니다.

```js run
// color
alert( "#123456".match( /#[a-f0-9]{6}\b/gi ) ); // #123456

// not a color
alert( "#12345678".match( /#[a-f0-9]{6}\b/gi ) ); // null
```
