정답은 **Pete**입니다.

아래 코드의 `work()` 함수는 from 만들어진 곳의 외부 렉시컬 변수 참조를 통해 `name`을 가져옵니다.

![](lexenv-nested-work.svg)

그래서 결과는 `"Pete"`입니다.

그런데 만약 `makeWorker()`에 `let name`가 없으면 위의 연결에서 보이는 것처럼 외부를 검색하게 되고 전역 변수를 가져옵니다. 그러면 결과는 `"John"`이 됩니다.
