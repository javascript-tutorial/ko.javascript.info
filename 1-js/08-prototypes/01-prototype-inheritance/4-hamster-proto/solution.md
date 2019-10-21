`speedy.eat("apple")` 호출에서 어떤 일이 일어나는지 주의 깊게 살펴봅시다.

1. 메서드 `speedy.eat`은 프로토타입 `=hamster`에서 발견되고, 점 앞의 객체인 `this=speedy`로 실행됩니다.

2. `this.stomach.push()`는 `stomach` 프로퍼티를 발견해야 하고 발견한 곳에서 `push`를 호출합니다. 해당 메서드의 `this`는 `=speedy`에서 `stomach`를 찾지만, 어떤 것도 발견할 수 없습니다.

3. 프로토타입 체인을 따라서 `hamster`에서 `stomach`를 발견합니다.

4. hamster에서 `push`를 호출하고 *해당 프로토타입의 stomach* 안에 food를 추가합니다.

그래서 모든 햄스터가 하나의 stomach를 공유합니다!

`lazy.stomach.push(...)`와 `speedy.stomach.push()` 둘 다, 프로퍼티 `stomach`는 프로토타입에서 발견되고(스스로 그 객체 안에 존재하지 않습니다), 새로운 데이터가 그 안으로 들어갑니다.

간단한 할당 `this.stomach`의 경우에 이러한 경우가 일어나지 않는다는 점에 유의하세요.

```js run
let hamster = {
  stomach: [],

  eat(food) {
*!*
    // this.stomach.push 대신에 this.stomach에 할당하세요.
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

이제 모든 작업이 잘 됩니다. `this.stomach=`는 `stomach` 찾기를 수행하지 않기 때문입니다. 해당 값은 `this` 객체에서 바로 작성됩니다.

또한 각각의 햄스터가 각자의 stomach를 가지는지 확인함으로써 이 문제를 완전히 피할 수 있습니다.

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

// Speedy는 음식을 발견합니다.
speedy.eat("apple");
alert( speedy.stomach ); // apple

// 레이지의 stomach는 비어있습니다.
alert( lazy.stomach ); // <nothing>
```

일반적인 해결 방법으로, 위에 있는 `stomach` 같은 특정한 객체의 상태를 묘사하는 모든 프로퍼티는 해당 객체 안에서 작성돼야 합니다. 그래야 이런 문제를 예방합니다.
