`speedy.eat("apple")`을 호출하면 무슨 일이 일어나는지 주의 깊게 알아보아야 원인을 파악할 수 있습니다.

1. 메서드 `speedy.eat`은 프로토타입 `hamster`에서 발견되는데, 점 앞엔 객체 `speedy`가 있으므로 `this`엔 `speedy`가 할당되어 메서드가 실행됩니다.

2. `this.stomach.push()`를 실행하려면 프로퍼티 `stomach`을 찾아서 여기에 `push`를 호출해야 합니다. 그런데 `this`인 `speedy`엔 프로퍼티 `stomach`이 없습니다.

3. `stomach`을 찾기위해 프로토타입 체인을 거슬러 올라가보니 `hamster`에 `stomach`이 있는것을 발견합니다.

4. `push` 메서드는 *프로토타입 `hamster`에 있는 stomach* 을 대상으로 동작하여 프로토타입에 food가 추가됩니다.

모든 햄스터가 하나의 stomach를 공유하는 이유는 바로 이런 동작방식 때문입니다.

`lazy.stomach.push(...)`, `speedy.stomach.push()`를 호출했을 때 모두 프로퍼티 `stomach`은 프로토타입에서 발견됩니다. 따라서 새로운 데이터는 `stomach`에 추가됩니다.

문제를 해결하려면 `push` 메서드가 아닌 `this.stomach=`을 사용해 데이터를 할당하면 됩니다.

```js run
let hamster = {
  stomach: [],

  eat(food) {
*!*
    // this.stomach.push(food) 대신에 food를 this.stomach에 할당
    this.stomach = [food];
*/!*
  }
};

let speedy = {
   __proto__: hamster
};

let lazy = {
  __proto__: hamster
};

// 햄스터 speedy가 음식을 먹습니다.
speedy.eat("apple");
alert( speedy.stomach ); // apple

// lazy는 음식을 먹지 않았기 때문에 배가 비어있습니다.
alert( lazy.stomach ); // (아무것도 출력 안됨)
```

`this.stomach=`은 객체 자체에 해당 프로퍼티를 추가하지 프로토타입 체인에서 `stomach`을 찾지 않기 때문에 의도한 대로 잘 작동합니다.

이 방법 말고도 햄스터가 각자의 stomach를 가지게 하면 문제를 사전에 차단할 수 있습니다.

```js run
let hamster = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  }
};

let speedy = {
  __proto__: hamster,
*!*
  stomach: []
*/!*
};

let lazy = {
  __proto__: hamster,
*!*
  stomach: []
*/!*
};

// 햄스터 speedy가 음식을 먹습니다.
speedy.eat("apple");
alert( speedy.stomach ); // apple

// lazy는 음식을 먹지 않았기 때문에 배가 비어있습니다.
alert( lazy.stomach ); // (아무것도 출력 안됨)
```

문제의 `stomach`처럼 특정 객체의 상태를 설명하는 프로퍼티는 조상 객체가 아닌 객체 자체에 정의하는 것이 이런 문제를 차단할 수 있는 일반적인 방법입니다.
