# HTML에서 쓰이는 색상 검출을 위한 정규표현식

`#ABCDEF`과 같이 HTML에서 사용하는 색상을 검출할 수 있는 정규표션식을 만들어보세요. 해당 색상은 첫 글자 `#`과 6개의 16진수로 구성됩니다.

예시:

```js
let regexp = /...your regexp.../

let str = "color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2 #12345678";

alert( str.match(regexp) )  // #121212,#AA00ef
```

참고: 이 과제에선 `#123` 또는 `rgb(1,2,3)`같은 다른 색상 포맷은 고려하지 않아도 됩니다.
