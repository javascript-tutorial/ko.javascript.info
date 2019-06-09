
The solution uses `count` in the local variable, but addition methods are written right into the `counter`. They share the same outer lexical environment and also can access the current `count`.
답안은 `count`를 지역변수로 사용합니다만, 추가적인 메서드가 `counter` 안에 사용되었습니다. 이것들은 외부 렉시컬 환경을 공유하고 현재 `count`에 접근할 수 있습니다.