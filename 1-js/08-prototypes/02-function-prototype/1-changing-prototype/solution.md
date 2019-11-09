
정답:

1. `true`

    `Rabbit.prototype`에 무언가를 할당하면 그 값이 새로운 객체의 `[[Prototype]]`이 됩니다. 다만 이미 만들어진 객체엔 이 규칙이 적용되지 않습니다.

2. `false`

    객체는 참조에 의해 할당됩니다. `Rabbit.prototype`이 참조하는 객체는 단 하나뿐인데, 이 객체는 `Rabbit.prototype`과 `rabbit`의 `[[Prototype]]`을 사용해 참조할 수 있습니다.

    따라서 둘 중 하나의 참조를 사용해 객체의 내용을 변경하면 다른 참조를 통해서도 변경 내용을 볼 수 있습니다.

3. `true`

    `delete` 연산은 객체에 직접 적용됩니다. `delete rabbit.eats`는 `rabbit`에서 `eats` 프로퍼티를 제거하는데, `rabbit`엔 `eats`가 없습니다. 따라서 `delete`는 아무런 영향을 주지 않습니다.

4. `undefined`

    프로퍼티 `eats`가 프로토타입에서 삭제되었기 때문에 `eats`는 더이상 존재하지 않습니다.