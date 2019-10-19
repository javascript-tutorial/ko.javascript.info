산술 표현식을 계산하기 위해 `eval`을 사용해봅시다.

```js demo run
let expr = prompt("산술 표현식을 입력하시겠습니까?", '2*3+2');

alert( eval(expr) );
```

사용자는 텍스트 또는 코드를 입력할 수 있습니다.

문자열을 산술 표현식만 입력하도록 제한하여 안전하게 eval로 실행하기 위해, [정규 표현식](info:regular-expressions)을 사용하여 `expr`을 검사하면 숫자와 연산자만 포함하게 됩니다.
