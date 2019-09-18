importance: 5

---

# 스파이 데코레이터

`calls` 프로퍼티에 함수에 대한 모든 호출을 저장한 래퍼를 반환하는 데코레이터 `spy(func)`를 만들어 보세요.

모든 호출은 인수 배열로 저장되어야 합니다.

예를 들면

```js
function work(a, b) {
  alert( a + b ); // work 함수는 임의의 함수거나 메서드 입니다.
}

*!*
work = spy(work);
*/!*

work(1, 2); // 3
work(4, 5); // 9

for (let args of work.calls) {
  alert( 'call:' + args.join() ); // "call:1,2", "call:4,5"
}
```

P.S. 이러한 데코레이터는 때때로 단위 테스트에 유용합니다. 고급적인 형식은 [Sinon.JS](http://sinonjs.org/) 라이브러리에 있는 `sinon.spy`가 있습니다.
