# HTML 색상을 위한 정규표현식

첫 글자 `#`과 6개의 16진수로 이루어진 `#ABCDEF`와 같은 HTML 색상을 찾기 위해 정규표현식을 만들어보세요.

예시:

```js
let regexp = /...your regexp.../;

let str =
  "color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2 #12345678";

alert(str.match(regexp)); // #121212,#AA00ef
```

P.S. 이 과제에서 `#123` 또는 `rgb(1,2,3)`등의 다른 색상 형식은 필요하지 않습니다.
