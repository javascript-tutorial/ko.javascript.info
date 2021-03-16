# HTML 색상을 찾는 정규 표현식

`#ABCDEF`와 같은 HTML 색상을 찾는 정규 표현식을 작성하세요. HTML 색상은 문자 `#`로 시작하여 연이은 6개의 16진수 문자들로 구성되어 있습니다.

사용 예시:

```js
let regexp = /정규 표현식을 작성할 곳/

let str = "color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2 #12345678";

alert( str.match(regexp) )  // #121212,#AA00ef
```

참고: 이 과제에서는 `#123` 또는 `rgb(1,2,3)` 등과 같은 HTML 색상의 다른 형식은 고려하지 않습니다.
