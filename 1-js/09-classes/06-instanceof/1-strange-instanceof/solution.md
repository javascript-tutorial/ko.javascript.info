네, 실제로 이상해 보이긴 합니다.

그런데 `instanceof`는 평가 시, 함수는 고려하지 않고 평가 대상의 `prototype`을 고려합니다. 평가 대상의 `prototype`이 프로토타입 체인 상에 있는 프로토타입과 일치하는지 여부를 고려하죠. 

문제에서 `a.__proto__ == B.prototype`이므로, `instanceof`는 `true`를 반환합니다.

`instanceof`의 내부 알고리즘에 의해 `prototype`은 생성자 함수가 아닌 타입을 정의합니다.
