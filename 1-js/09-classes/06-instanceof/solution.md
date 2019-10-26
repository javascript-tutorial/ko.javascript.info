Yeah, looks strange indeed.
당연히 정말 이상해 보입니다.
그러나 `instanceof`는 함수까지는 고려하지않지만, 프로토 타입 체인이 일치하는 그 함수의 `prototype`  대해서는 고려대상이 됩니다.

그리고 이 `a.__proto__ == B.prototype`에 `instanceof`는 `true`를 리턴합니다.

그리하여 `instanceof`의 로직에 과`prototype`은 실직적으로 생성자 함수가 아닌 타입을 정의합니다.

