
이유는 다음과 같습니다.

1. 우리가 알고 있는 일반적인 메서드 호출 방법입니다.

2. 역시 일반적인 호출 방법에 속합니다. 괄호가 추가되었긴 하지만 연산 우선순위를 바꾸진 않으므로 점 연산자가 먼저 실행됩니다.

<<<<<<< HEAD
3. 좀 더 복잡한 패턴의 호출(`(expression).method()`)이 등장했네요. 세 번째 호출은 아래와 같은 코드로 쪼갤 수 있습니다.
=======
3. Here we have a more complex call `(expression)()`. The call works as if it were split into two lines:
>>>>>>> 4d01fc20d4d82358e61518a31efe80dec9bb2602

    ```js no-beautify
    f = obj.go; // 표현식 계산하기
    f();        // 저장된 것 호출하기
    ```

    위 코드에서 `f()`는 (메서드가 아닌) 함수로써 호출되었습니다. `this`에 대한 정보가 전혀 없는 상태에서 말이죠.

<<<<<<< HEAD
4. `(3)`과 동일한 패턴의 호출입니다. `expression`이 `obj.go || obj.stop`라는 차이점만 있습니다.
=======
4. The similar thing as `(3)`, to the left of the parentheses `()` we have an expression.
>>>>>>> 4d01fc20d4d82358e61518a31efe80dec9bb2602

`(3)`과 `(4)`에서 어떤 일이 일어나는지 알려면 참조 타입을 다시 상기해야 합니다. 점이나 대괄호를 통해 프로퍼티에 접근하려는 경우 참조 타입 값(`(base, name, strict)`)이 반환됩니다.

메서드 호출을 제외하고, 참조 타입 값에 행해지는 모든 연산은 참조 타입 값을 일반 값으로 변환시킵니다. 이 과정에서 `this`에 정보가 누락됩니다.

