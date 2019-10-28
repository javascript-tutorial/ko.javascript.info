importance: 5

---

# 예금 계산기

예금 잔고와 이자율을 입력하면 주어진 기간 후에 잔고가 어떻게 될지 알려주는 인터페이스를 만들어보세요.

데모는 다음과 같습니다.

[iframe src="solution" height="350" border="1"]

입력값이 변경되면 출력값도 즉시 변경되어야 합니다.

공식은 아래와 같습니다.
```js
// initial: 계산 전의 잔고
// interest: 이자율. 0.05는 연 5%의 이자율을 의미합니다.
// years: 예금 유치 기간으로, 연 단위
let result = Math.round(initial * (1 + interest * years));
```
