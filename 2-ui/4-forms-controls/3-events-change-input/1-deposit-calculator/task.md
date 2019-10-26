중요도: 5

---

# 예금 계산기

은행 예금 합계와 이자율을 입력할 수 있고 주어진 시간 후에 얼마가 될지를 계산하는 인터페이스를 만들어봅시다.

예제:

[iframe src="solution" height="350" border="1"]

모든 출력값은 입력값을 넣는 즉시 변경되어야 합니다.

공식:
```js
// initial: the initial money sum
// interest: e.g. 0.05 means 5% per year
// years: how many years to wait
let result = Math.round(initial * (1 + interest * years));
```
