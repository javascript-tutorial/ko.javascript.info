importance: 5

---

# 스파이 데코레이터

데코레이터 `spy(func)`를 구현하세요. 이 데코레이터는 인자로 받은 함수에 대한 모든 호출을 래퍼 자신의 `calls` 프로퍼티에 저장하는 래퍼를 반환해야 합니다.

모든 호출은 인자의 배열로 저장됩니다.

예시:

```js
function work(a, b) {
  alert( a + b ); // work는 임의의 함수 혹은 메서드입니다.
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

P.S. 스파이 데코레이터는 때때로 단위 테스팅에 유용합니다. 이 데코레이터의 고급 형태는 [Sinon.JS](http://sinonjs.org/) 라이브러리에 있는 `sinon.spy`입니다.
