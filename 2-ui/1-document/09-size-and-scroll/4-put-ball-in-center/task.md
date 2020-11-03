importance: 5

---

# 축구공을 필드 중앙에 놓기

주어진 HTML document는 이렇게 생겼습니다.

[iframe src="source" edit link height=180]

필드 중앙의 좌표는 무엇일까요?

좌표를 계산해 공을 필드의 중앙으로 옮기는 데 이용해봅시다.

[iframe src="solution" height=180]

- 공 요소는 CSS가 아닌 JavaScript를 이용해 움직여야 합니다.
- 코드는 공 크기(`10`, `20`, `30`픽셀 등)의 크기가 어떻든, 필드의 크기가 어떻든, 주어진 값 뿐만이 아닌 모든 값에서 적용되어야 합니다.

P.S. 물론 CSS를 이용해 공을 중앙으로 옮길 수 있겠지만 여기서는 JavaScript만을 사용합니다. 더 나아가 JavaScript를 필히 사용해야 하는 다른 문제들과 더 복잡한 상황을 마주할 겁니다. “준비운동”을 해봅시다.
