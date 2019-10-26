importance: 5

---

# 잘못된 점 찾기

함수 `pow`의 테스트 코드를 보고 무엇이 잘못되었나 알아보세요.

```js
it("주어진 숫자의 n 제곱", function() {
  let x = 5;

  let result = x;
  assert.equal(pow(x, 1), result);

  result *= x;
  assert.equal(pow(x, 2), result);

  result *= x;
  assert.equal(pow(x, 3), result);
});
```

참고: 문법 오류는 없고, 모든 테스트가 문제없이 통과합니다.
