그래요, 정말 이상해 보입니다.

그러나 `instanceof`는 함수가 아니라 프로토 체인에 대해 일치하는 `prototype`을 고려하지 않습니다.

그러면 여기는 `a.__proto__ == B.prototype`이 되므로, `instanceof`는 `true`를 반환합니다.

따라서, `instanceof`의 논리에 의해, `prototype`은 실제로 생성자 함수가 아니라 타입을 정의합니다.
