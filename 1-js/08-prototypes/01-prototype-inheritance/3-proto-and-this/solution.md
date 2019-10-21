**답은 `rabbit` 입니다.**

`this`가 점 앞에 있는 객체이기 때문에, `rabbit.eat()`은 `rabbit`을 수식합니다.

프로퍼티 조회와 실행은 서로 다른 일입니다.

메서드 `rabbit.eat`은 프로토타입에서 처음 발견되고, `this=rabbit`으로 실행됩니다.
