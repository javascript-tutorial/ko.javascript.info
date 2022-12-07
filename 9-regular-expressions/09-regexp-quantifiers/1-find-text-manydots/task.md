importance: 5

---

#  생략 부호 '...'를 어떻게 찾을 수 있을까요?

연속된 점 3개 혹은 그 이상으로 구성되는 생략 부호를 찾기 위한 정규표현식을 만들어보세요.

정답 작성 시, 다음 코드가 정상 동작하게 됩니다.

```js
let regexp = /your regexp/g;
alert( "Hello!... How goes?.....".match(regexp) ); // ..., .....
```
