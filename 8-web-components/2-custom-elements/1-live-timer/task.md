
# 라이브 타이머 요소

좋은 형식의 시각을 표시하는 `<time-formatted>` 요소가 이미 있습니다.

현재 시간을 표기하기 위해 `<live-timer>`요소를 작성하세요.
1. 내부 `<time-formatted>`를 사용해야 하며 그 기능을 똑같이 사용하지 않아야 합니다.
2. 매 초를 tick(업데이트) 하십시오.
3. 모든 tick에 대해 `event.detail`에 현재 날짜와 함께 `tick`이라는 이름을 가진 사용자 정의 이벤트가 생성되어야 합니다(챕터 <info:dispatch-events> 참조).

사용법입니다.

```html
<live-timer id="elem"></live-timer>

<script>
  elem.addEventListener('tick', event => console.log(event.detail));
</script>
```

참고 자료입니다.

[iframe src="solution" height=40]
