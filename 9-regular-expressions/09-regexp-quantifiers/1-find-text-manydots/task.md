importance: 5

---

#  생략 부호를 어떻게 찾아야 할까요 "..." ?

연속된 점이 3개 또는 그 이상인 생략 부호를 찾기 위해 정규표현식을 만들어보세요.

코드를 참고해 보세요.

```js
let regexp = /your regexp/g;
alert( "Hello!... How goes?.....".match(regexp) ); // ..., .....
```
