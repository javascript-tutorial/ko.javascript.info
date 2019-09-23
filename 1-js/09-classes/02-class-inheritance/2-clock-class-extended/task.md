importance: 5

---

# 시계 확장하기

We've got a `Clock` class. As of now, it prints the time every second.
`Clock`이라는 매초 시간을 출력하는 클래스가 있습니다. 

[js src="source.view/clock.js"]

`Clock`을 상속하는 `ExtendedClock`을 생성해서 `precision`이라는 "ticks" 사이에 `ms` 단위로 된 매개변수를 추가해보세요. 1000 (1초)를 기본값으로 하는 것이 좋습니다.

- 코드는 `extended-clock.js`라는 독립적인 파일에 작성하는 것이 좋습니다.
- 오리지널 `clock.js`를 수정하지 마세요. 확장하세요.
