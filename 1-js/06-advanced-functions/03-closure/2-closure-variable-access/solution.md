정답은 **Pete**입니다.

`work()` 함수는 만들어진 곳을 기준으로 외부 렉시컬 변수 참조를 통해 `name`을 가져옵니다.

![](lexenv-nested-work.svg)

그래서 결과는 `"Pete"`입니다.

만약 `makeWorker()` 함수 내부에 `let name`가 없었다면 바로 전역 스코프에 해당하는 외부에서 변수를 검색해서 `"John"`이 출력되었을 겁니다.
