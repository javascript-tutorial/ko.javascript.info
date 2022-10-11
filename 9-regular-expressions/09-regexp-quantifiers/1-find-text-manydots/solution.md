
정답:

```js run
let regexp = /\.{3,}/g;
alert( "Hello!... How goes?.....".match(regexp) ); // ..., .....
```

점은 특수문자이므로 `\.`을 삽입해 이스케이프 해야 합니다.
