6개의 16진수가 뒤에 오는 `#`을 찾아야 합니다.

16진수 문자는 `pattern:[0-9a-fA-F]`와 같이 표현합니다. 또한 `pattern:i` 플래그를 사용한다면 `pattern:[0-9a-f]`와 같이 사용할 수 있습니다.

이후 수량자 `pattern:{6}`를 사용해 6개의 16진수를 찾을 수 있습니다.

그 결과, 이런 정규표현식을 갖게 됩니다. `pattern:/#[a-f0-9]{6}/gi`

```js run
let regexp = /#[a-f0-9]{6}/gi;

let str = "color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2";

alert( str.match(regexp) );  // #121212,#AA00ef
```

문제는 더 긴 시퀀스에서 색상을 찾는 것입니다.

```js run
alert( "#12345678".match( /#[a-f0-9]{6}/gi ) ) // #123456
```

이를 해결하기 위해 정규표현식 끝부분에 `pattern:\b`를 추가할 수 있습니다.

```js run
// color
alert( "#123456".match( /#[a-f0-9]{6}\b/gi ) ); // #123456

// not a color
alert( "#12345678".match( /#[a-f0-9]{6}\b/gi ) ); // null
```
