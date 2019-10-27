`speedy.eat("apple")` 호출에서 어떤 일이 일어나는지 주의 깊게 살펴봅시다.

1. 메서드 `speedy.eat`은 프로토타입 `hamster`에서 발견됩니다. 이후 점 앞의 객체인 `speedy`가 `this`에 할당되어 실행됩니다.

2. `this.stomach.push()`를 실행하려면 프로퍼티 `stomach`을 찾아서 여기에 `push`를 호출해야 합니다. `this`(`=speedy`)에 `stomach`이 있는지 찾아보았지만, 아무것도 발견할 수 없습니다.

3. 프로토타입 체인을 거슬러 올라가 `hamster`에서 `stomach`를 발견합니다.

4. `stomach`을 대상으로 `push`를 호출하여 *프로토타입(`hamster`)의 stomach* 에 food를 추가합니다.

모든 햄스터가 하나의 stomach를 공유하는 이유가 바로 여기에 있습니다.

`lazy.stomach.push(...)`와 `speedy.stomach.push()`를 호출했을 때 모두, 프로퍼티 `stomach`을 프로토타입에서 발견합니다(`stomach`이 객체 자체에 있지 않기 때문입니다). 따라서 새로운 데이터는 `stomach`에 추가됩니다.

`this.stomach=`을 이용해 데이터를 할당하면 이런 일이 발생하지 않습니다.

```js run
let hamster = {
  stomach: [],

  eat(food) {
*!*
    // this.stomach.push 대신에 this.stomach에 할당
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

// Speedy는 음식을 발견합니다.
speedy.eat("apple");
alert( speedy.stomach ); // apple

// Lazy의 stomach는 비어있습니다.
alert( lazy.stomach ); // <nothing>
```

`this.stomach=`는 `stomach`을 찾지 않기 때문에 의도한 대로 잘 작동합니다. 새로운 데이터는 `this`가 가리키는 객체에 바로 쓰입니다.

이 외에도 햄스터가 각자의 stomach를 가지게 하면 이 문제를 완전히 피할 수 있습니다.

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

// speedy는 음식을 발견합니다.
speedy.eat("apple");
alert( speedy.stomach ); // apple

// lazy의 stomach은 비어있습니다.
alert( lazy.stomach ); // <nothing>
```

`stomach`과 같이 특정 객체의 상태를 나타내는 프로퍼티 전부를 해당 객체 안에서 작성하는 것은 이런 문제를 예방할 수 있는 일반적인 해결 방법입니다.
