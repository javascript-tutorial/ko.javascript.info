
# 클래스 상속

클래스 상속을 사용하면 클래스를 다른 클래스로 확장할 수 있습니다.

기존에 존재하던 기능을 토대로 새로운 기능을 만들 수 있죠.

## 'extends' 키워드 

먼저, 클래스 `Animal`을 만들어보겠습니다.

```js
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  run(speed) {
    this.speed = speed;
    alert(`${this.name} 은/는 속도 ${this.speed}로 달립니다.`);
  }
  stop() {
    this.speed = 0;
    alert(`${this.name} 이/가 멈췄습니다.`);
  }
}

let animal = new Animal("동물");
```

객체 `animal`과 클래스 `Animal`의 관계를 그림으로 나타내면 다음과 같습니다.

![](rabbit-animal-independent-animal.svg)

또 다른 클래스 `Rabbit`을 만들어보겠습니다.

토끼는 동물이므로 `Rabbit`은 동물 관련 메서드가 담긴 `Animal`을 확장해서 만들어야 합니다. 이렇게 하면 토끼도 동물이 할 수 있는 '일반적인' 동작을 수행할 수 있습니다.

클래스 확장 문법 `class Child extends Parent`를 사용해 클래스를 확장해 봅시다.

`Animal`을 상속받는 `class Rabbit`를 만들어 보겠습니다.

```js
*!*
class Rabbit extends Animal {
*/!*
  hide() {
    alert(`${this.name} 이/가 숨었습니다!`);
  }
}

let rabbit = new Rabbit("흰 토끼");

rabbit.run(5); // 흰 토끼 은/는 속도 5로 달립니다.
rabbit.hide(); // 흰 토끼 이/가 숨었습니다!
```

클래스 `Rabbit`을 사용해 만든 객체는 `rabbit.hide()` 같은 `Rabbit`에 정의된 메서드에도 접근할 수 있고, `rabbit.run()` 같은 `Animal`에 정의된 메서드에도 접근할 수 있습니다.

키워드 `extends`는 프로토타입을 기반으로 동작합니다. `extends`는 `Rabbit.prototype.[[Prototype]]`을 `Animal.prototype`으로 설정합니다. 그렇기 때문에 `Rabbit.prototype`에서 메서드를 찾지 못하면 `Animal.prototype`에서 메서드를 가져옵니다.

![](animal-rabbit-extends.svg)

엔진은 다음 절차를 따라 메서드 `rabbit.run`의 존재를 확인합니다(그림을 아래부터 보세요).
1. 객체 `rabbit`에 `run`이 있나 확인합니다. `run`이 없네요.
2. `rabbit`의 프로토타입인 `Rabbit.prototype`에 메서드가 있나 확인합니다. `hide`는 있는데 `run`은 없습니다.
3. `extends`를 통해 관계가 만들어진 `Rabbit.prototype`의 프로토타입, `Animal.prototype`에 메서드가 있나 확인합니다. 드디어 메서드 `run`을 찾았습니다.

<info:native-prototypes>에서 알아본 것처럼 자바스크립트의 내장 객체는 프로토타입을 기반으로 상속 관계를 맺습니다. `Date.prototype.[[Prototype]]`이 `Object.prototype`인 것처럼 말이죠. `Date` 객체에서 일반 객체 메서드를 사용할 수 있는 이유가 바로 여기에 있습니다. 

````smart header="`extends` 뒤에 표현식이 올 수도 있습니다."
클래스 문법은 `extends` 뒤에 표현식이 와도 처리해줍니다.

아래 예시처럼 `extends` 뒤에서 부모 클래스를 만들어주는 함수를 호출할 수 있죠.

```js run
function f(phrase) {
  return class {
    sayHi() { alert(phrase) }
  }
}

*!*
class User extends f("Hello") {}
*/!*

new User().sayHi(); // Hello
```
여기서 `class User`는 `f("Hello")`의 반환 값을 상속받습니다.

이 방법은 조건에 따라 다른 클래스를 상속받고 싶을 때 유용합니다. 조건에 따라 다른 클래스를 반환하는 함수를 만들고, 함수 호출 결과를 상속받게 하면 됩니다.
````

## 메서드 오버라이딩

이제 한발 더 나아가 메서드를 오버라이딩 해봅시다. 특별한 사항이 없으면 `class Rabbit`은 `class Animal`에 있는 메서드를 '그대로' 상속받습니다. 

그런데 `Rabbit`에서 `stop()` 등의 메서드를 자체적으로 정의하면, 상속받은 메서드가 아닌 자체 메서드가 사용됩니다.

```js
class Rabbit extends Animal {
  stop() {
    // rabbit.stop()을 호출할 때 
    // Animal의 stop()이 아닌, 이 메서드가 사용됩니다.
  }
}
```

개발을 하다 보면 부모 메서드 전체를 교체하지 않고, 부모 메서드를 토대로 일부 기능만 변경하고 싶을 때가 생깁니다. 부모 메서드의 기능을 확장하고 싶을 때도 있죠. 이럴 때 커스텀 메서드를 만들어 작업하게 되는데, 이미 커스텀 메서드를 만들었더라도 이 과정 전·후에 부모 메서드를 호출하고 싶을 때가 있습니다. 

키워드 `super`는 이럴 때 사용합니다.

- `super.method(...)`는 부모 클래스에 정의된 메서드, `method`를 호출합니다.
- `super(...)`는 부모 생성자를 호출하는데, 자식 생성자 내부에서만 사용 할 수 있습니다.

이런 특징을 이용해 토끼가 멈추면 자동으로 숨도록 하는 코드를 만들어보겠습니다.

```js run
class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  run(speed) {
    this.speed = speed;
    alert(`${this.name}가 속도 ${this.speed}로 달립니다.`);
  }

  stop() {
    this.speed = 0;
    alert(`${this.name}가 멈췄습니다.`);
  }

}

class Rabbit extends Animal {
  hide() {
    alert(`${this.name}가 숨었습니다!`);
  }

*!*
  stop() {
    super.stop(); // 부모 클래스의 stop을 호출해 멈추고,
    this.hide(); // 숨습니다.
  }
*/!*
}

let rabbit = new Rabbit("흰 토끼");

rabbit.run(5); // 흰 토끼가 속도 5로 달립니다.
rabbit.stop(); // 흰 토끼가 멈췄습니다. 흰 토끼가 숨었습니다!
```

`Rabbit`은 이제 실행 중간에 부모 클래스에 정의된 메서드 `super.stop()`을 호출하는 `stop`을 가지게 되었네요.

````smart header="화살표 함수엔 `super`가 없습니다."
<info:arrow-functions>에서 살펴본 바와 같이, 화살표 함수는 `super`를 지원하지 않습니다.

`super`에 접근하면 아래 예시와 같이 `super`를 외부 함수에서 가져옵니다.
```js
class Rabbit extends Animal {
  stop() {
    setTimeout(() => super.stop(), 1000); // 1초 후에 부모 stop을 호출합니다.
  }
}
```

화살표 함수의 `super`는 `stop()`의 `super`와 같아서 위 예시는 의도한 대로 동작합니다. 그렇지만 `setTimeout`안에서 '일반' 함수를 사용했다면 에러가 발생했을 겁니다.

```js
// Unexpected super
setTimeout(function() { super.stop() }, 1000);
```
````


## 생성자 오버라이딩

생성자 오버라이딩은 좀 더 까다롭습니다.

지금까진 `Rabbit`에 자체 `constructor`가 없었습니다.

[명세서](https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation)에 따르면, 클래스가 다른 클래스를 상속받고 `constructor`가 없는 경우엔 아래처럼 '비어있는' `constructor`가 만들어집니다.

```js
class Rabbit extends Animal {
  // 자체 생성자가 없는 클래스를 상속받으면 자동으로 만들어짐
*!*
  constructor(...args) {
    super(...args);
  }
*/!*
}
```

보시다시피 생성자는 기본적으로 부모 `constructor`를 호출합니다. 이때 부모 `constructor`에도 인수를 모두 전달합니다. 클래스에 자체 생성자가 없는 경우엔 이런 일이 모두 자동으로 일어납니다.

이제 `Rabbit`에 커스텀 생성자를 추가해보겠습니다. 커스텀 생성자에서 `name`과  `earLength`를 지정해보겠습니다.

```js run
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  // ...
}

class Rabbit extends Animal {

*!*
  constructor(name, earLength) {
    this.speed = 0;
    this.name = name;
    this.earLength = earLength;
  }
*/!*

  // ...
}

*!*
// 동작하지 않습니다!
let rabbit = new Rabbit("흰 토끼", 10); // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
*/!*
```

아이코! 에러가 발생하네요. 토끼를 만들 수 없습니다. 무엇이 잘못된 걸까요?

이유는 다음과 같습니다.

- **상속 클래스의 생성자에선 반드시 `super(...)`를 호출해야 하는데, `super(...)`를 호출하지 않아 에러가 발생했습니다. `super(...)`는 `this`를 사용하기 전에 반드시 호출해야 합니다.**

그런데 왜 `super(...)`를 호출해야 하는 걸까요?

당연히 이유가 있습니다. 상속 클래스의 생성자가 호출될 때 어떤 일이 일어나는지 알아보며 이유를 찾아봅시다.

자바스크립트는 '상속 클래스의 생성자 함수(derived constructor)'와 그렇지 않은 생성자 함수를 구분합니다. 상속 클래스의 생성자 함수엔 특수 내부 프로퍼티인 `[[ConstructorKind]]:"derived"`가 이름표처럼 붙습니다.

일반 클래스의 생성자 함수와 상속 클래스의 생성자 함수 간 차이는 `new`와 함께 드러납니다.

- 일반 클래스가 `new`와 함께 실행되면, 빈 객체가 만들어지고 `this`에 이 객체를 할당합니다.
- 반면, 상속 클래스의 생성자 함수가 실행되면, 일반 클래스에서 일어난 일이 일어나지 않습니다. 상속 클래스의 생성자 함수는 빈 객체를 만들고 `this`에 이 객체를 할당하는 일을 부모 클래스의 생성자가 처리해주길 기대합니다.

이런 차이 때문에 상속 클래스의 생성자에선 `super`를 호출해 부모 생성자를 실행해 주어야 합니다. 그렇지 않으면 `this`가 될 객체가 만들어지지 않아 에러가 발생합니다.

아래 예시와 같이 `this`를 사용하기 전에 `super()`를 호출하면 `Rabbit`의 생성자가 제대로 동작합니다.

```js run
class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  // ...
}

class Rabbit extends Animal {

  constructor(name, earLength) {
*!*
    super(name);
*/!*
    this.earLength = earLength;
  }

  // ...
}

*!*
// 이제 에러 없이 동작합니다.
let rabbit = new Rabbit("흰 토끼", 10);
alert(rabbit.name); // 흰 토끼
alert(rabbit.earLength); // 10
*/!*
```



### 클래스 필드 오버라이딩: 까다로운 내용

```warn header="사전 공지"
이 내용은 자바스크립트 이외의 언어에서 클래스를 사용해 본 경험이 있다는 전제하에 진행됩니다.

여기서 다룰 내용을 잘 습득하면 프로그래밍 언어에 대한 통찰력이 높아지고 드물지만, 버그를 만드는 프로그래밍 습관에 대해 알 수 있습니다.

이해하기 어렵다면 이 부분을 건너뛰었다가 나중에 다시 읽어도 됩니다.
```

오버라이딩은 메서드뿐만 아니라 클래스 필드를 대상으로도 적용할 수 있습니다.

부모 클래스의 생성자 안에 있는 오바라이딩한 필드에 접근하려고 할 때 자바스크립트는 다른 프로그래밍 언어와는 다르게 조금 까다롭지만 말이죠.

예시를 살펴봅시다.

```js run
class Animal {
  name = 'animal'

  constructor() {
    alert(this.name); // (*)
  }
}

class Rabbit extends Animal {
  name = 'rabbit';
}

new Animal(); // animal
*!*
new Rabbit(); // animal
*/!*
```

`Animal`을 상속받는 `Rabbit`에서 `name` 필드를 오버라이딩 했습니다.

`Rabbit`에는 따로 생성자가 정의되어 있지 않기 때문에 `Rabbit`을 사용해 인스턴스를 만들면 `Animal`의 생성자가 호출됩니다.

흥미로운 점은 `new Animal()`과 `new Rabbit()`을 실행할 때 두 경우 모두 `(*)`로 표시한 줄에 있는 `alert` 함수가 실행되면서 얼럿 창에 `animal`이 출력된다는 점입니다.

이를 통해 우리는 **'부모 생성자는 자식 클래스에서 오버라이딩한 값이 아닌, 부모 클래스 안의 필드 값을 사용한다'** 는 사실을 알 수 있습니다.

상속을 받고 필드 값을 오버라이딩했는데 새로운 값 대신 부모 클래스 안에 있는 기존 필드 값을 사용하다니 이상하지 않나요?

이해를 돕기 위해 이 상황을 메서드와 비교해 생각해봅시다.

아래 예시에선 필드 `this.name` 대신에 메서드 `this.showName()`을 사용했습니다.

```js run
class Animal {
  showName() {  // this.name = 'animal' 대신 메서드 사용
    alert('animal');
  }

  constructor() {
    this.showName(); // alert(this.name); 대신 메서드 호출
  }
}

class Rabbit extends Animal {
  showName() {
    alert('rabbit');
  }
}

new Animal(); // animal
*!*
new Rabbit(); // rabbit
*/!*
```

필드를 오버라이딩한 위쪽 예시와 결과가 다르네요.

위와 같이 자식 클래스에서 부모 생성자를 호출하면 오버라이딩한 메서드가 실행되어야 합니다. 이게 우리가 원하던 결과죠.

그런데 클래스 필드는 자식 클래스에서 필드를 오버라이딩해도 부모 생성자가 오버라이딩한 필드 값을 사용하지 않습니다. 부모 생성자는 항상 부모 클래스에 있는 필드의 값을 사용합니다.

왜 이런 차이가 있을까요?

이유는 필드 초기화 순서 때문입니다. 클래스 필드는 다음과 같은 규칙에 따라 초기화 순서가 달라집니다.
- 아무것도 상속받지 않는 베이스 클래스는 생성자 실행 이전에 초기화됨
- 부모 클래스가 있는 경우엔 `super()` 실행 직후에 초기화됨

위 예시에서 `Rabbit`은 하위 클래스이고 `constructor()`가 정의되어 있지 않습니다. 이런 경우 앞서 설명한 바와 같이 생성자는 비어있는데 그 안에 `super(...args)`만 있다고 보면 됩니다.

따라서 `new Rabbit()`을 실행하면 `super()`가 호출되고 그 결과 부모 생성자가 실행됩니다. 그런데 이때 하위 클래스 필드 초기화 순서에 따라 하위 클래스 `Rabbit`의 필드는 `super()` 실행 후에 초기화됩니다. 부모 생성자가 실행되는 시점에 `Rabbit`의 필드는 아직 존재하지 않죠. 이런 이유로 필드를 오버라이딩 했을 때 `Animal`에 있는 필드가 사용된 것입니다.

이렇게 자바스크립트는 오버라이딩시 필드와 메서드의 동작 방식이 미묘하게 다릅니다.

다행히도 이런 문제는 오버라이딩한 필드를 부모 생성자에서 사용할 때만 발생합니다. 이런 차이가 왜 발생하는지 모르면 결과를 해석할 수 없는 상황이 발생하기 때문에 별도의 공간을 만들어 필드 오버라이딩시 내부에서 벌어지는 일에 대해 자세히 알아보았습니다.

개발하다가 필드 오버라이딩이 문제가 되는 상황이 발생하면 필드 대신 메서드를 사용하거나 getter나 setter를 사용해 해결하면 됩니다.


## super 키워드와 [[HomeObject]]

```warn header="어렵습니다."
튜토리얼을 처음 읽는 분이라면 이번 절은 넘어가서도 좋습니다.

이번 절에선 상속과 `super`의 내부 메커니즘에 대해 다룰 예정입니다. 
```

`super`에 대해서 좀 더 깊이 파봅시다. 중간중간 흥미로운 점을 발견할 수 있을 겁니다.

먼저 드려야 할 말은 지금까지 배운 내용만으론 `super`가 제대로 동작하지 않는다는 것입니다.

네 아쉽지만 그렇습니다. "내부에서 super는 '어떻게' 동작할까?"라는 질문을 자신에게 던져봅시다. "객체 메서드가 실행되면 현재 객체가 `this`가 된다. 이 상태에서 `super.method()`를 호출하면 엔진은 현재 객체의 프로토타입에서 `method`를 찾아야 한다."까진 떠올릴 수 있을 겁니다. 그런데 이런 과정은 '어떻게' 일어나는 걸까요?

쉬워 보이는 질문 같지만 실제론 그렇지 않습니다. 엔진은 현재 객체 `this`를 알기 때문에 `this.__proto__.method`를 통해 부모 객체의 `method`를 찾을 수 있을 것 같죠. 하지만 불행하게도 이런 '나이브한' 생각은 들어맞지 않습니다.

구체적인 코드와 함께 문제를 재현해 보겠습니다. 간결성을 위해 클래스가 아닌 일반 객체를 사용해 예시를 구성해 봅시다.

구체적인 내부 동작에 관심이 없으면 이 부분을 지나치고 `[[HomeObject]]`로 바로 넘어가셔도 좋습니다. 지금부터 다룰 내용을 모르고도 `[[HomeObject]]` 내용을 이해할 수 있기 때문입니다. 깊게 이해하려면 예시와 관련 내용을 살펴보면 됩니다.

아래 예시의 `rabbit.__proto__`은 `animal`입니다. `rabbit.eat()`에서 `this.__proto__`를 사용해 `animal.eat()`을 호출해보겠습니다.

```js run
let animal = {
  name: "동물",
  eat() {
    alert(`${this.name} 이/가 먹이를 먹습니다.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "토끼",
  eat() {
*!*
    // 예상대로라면 super.eat()이 동작해야 합니다.
    this.__proto__.eat.call(this); // (*)
*/!*
  }
};

rabbit.eat(); // 토끼 이/가 먹이를 먹습니다.
```

`(*)`로 표시한 줄에선 `eat`을 프로토타입(`animal`)에서 가져오고 현재 객체의 컨텍스트에 기반하여 `eat`을 호출합니다. 여기서 주의해서 봐야 할 부분은 `.call(this)`입니다. `this.__proto__.eat()`만 있으면 현재 객체가 아닌 프로토타입의 컨텍스트에서 부모 `eat`을 실행하기 때문에 `.call(this)`이 있어야 합니다.

예시를 실행하면 예상한 내용이 얼럿창에 출력되는 것을 확인할 수 있네요.

자 이제 체인에 객체를 하나 더 추가해보겠습니다. 이제 슬슬 문제가 발생하기 시작합니다.

```js run
let animal = {
  name: "동물",
  eat() {
    alert(`${this.name} 이/가 먹이를 먹습니다.`);
  }
};

let rabbit = {
  __proto__: animal,
  eat() {
    // call을 사용해 컨텍스트를 옮겨가며 부모(animal) 메서드를 호출합니다.
    this.__proto__.eat.call(this); // (*)
  }
};

let longEar = {
  __proto__: rabbit,
  eat() {
    // longEar를 가지고 무언가를 하면서 부모(rabbit) 메서드를 호출합니다.
    this.__proto__.eat.call(this); // (**)
  }
};

*!*
longEar.eat(); // RangeError: Maximum call stack size exceeded
*/!*
```

예상과 달리 `longEar.eat()`를 호출하니 에러가 발생하네요!

원인이 석연치 않아 보이지만 `longEar.eat()`이 호출될 때 어떤 일이 발생하는지 하나씩 추척하다보면 이유를 알 수 있습니다. 먼저 살펴봐야 할 것은 `(*)`과 `(**)`로 표시한 줄입니다. 이 두 줄에서 `this`는 현재 객체인 `longEar`가 됩니다. 여기에 핵심이 있습니다. 모든 객체 메서드는 프로토타입 등이 아닌 현재 객체를 `this`로 갖습니다. 

따라서 `(*)`과 `(**)`로 표시한 줄의 `this.__proto__`엔 정확히 같은 값, `rabbit`이 할당됩니다. 체인 위로 올라가지 않고 양쪽 모두에서 `rabbit.eat`을 호출하기 때문에 무한 루프에 빠지게 되죠.  

이를 그림으로 나타내면 다음과 같습니다.

![](this-super-loop.svg)

1. `longEar.eat()` 내부의 `(**)`로 표시한 줄에서 `rabbit.eat`을 호출하는데, 이때 `this`는 `longEar`입니다.
    ```js
    // longEar.eat()안의 this는 longEar입니다.
    this.__proto__.eat.call(this) // (**)
    // 따라서 윗줄은 아래와 같아집니다.
    longEar.__proto__.eat.call(this)
    // longEar의 프로토타입은 rabbit이므로 윗줄은 아래와 같아집니다.
    rabbit.eat.call(this);
    ```
2. `rabbit.eat` 내부의 `(*)`로 표시한 줄에서 체인 위쪽에 있는 호출을 전달하려 했으나 `this`가 `longEar` 이기 때문에 또다시 `rabbit.eat`이 호출됩니다.

    ```js
    // rabbit.eat()안의 this 역시 longEar입니다.
    this.__proto__.eat.call(this) // (*)
    // 따라서 윗줄은 아래와 같아집니다.
    longEar.__proto__.eat.call(this)
    // longEar의 프로토타입은 rabbit이므로 윗줄은 아래와 같아집니다.
    rabbit.eat.call(this);
    ```

3. 이런 내부 동작 때문에 `rabbit.eat`은 체인 위로 올라가지 못하고 자기 자신을 계속 호출해 무한 루프에 빠지게 됩니다.

이런 문제는 `this`만으론 해결할 수 없습니다.

### `[[HomeObject]]`

자바스크립트엔 이런 문제를 해결할 수 있는 함수 전용 특수 내부 프로퍼티가 있습니다. 바로 `[[HomeObject]]`입니다.

클래스이거나 객체 메서드인 함수의 `[[HomeObject]]` 프로퍼티는 해당 객체가 저장됩니다.

`super`는 `[[HomeObject]]`를 이용해 부모 프로토타입과 메서드를 찾습니다.

예시를 통해 `[[HomeObject]]`가 어떻게 동작하는지 살펴봅시다. 먼저 일반 객체를 이용해 보겠습니다.

```js run
let animal = {
  name: "동물",
  eat() {         // animal.eat.[[HomeObject]] == animal
    alert(`${this.name} 이/가 먹이를 먹습니다.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "토끼",
  eat() {         // rabbit.eat.[[HomeObject]] == rabbit
    super.eat();
  }
};

let longEar = {
  __proto__: rabbit,
  name: "귀가 긴 토끼",
  eat() {         // longEar.eat.[[HomeObject]] == longEar
    super.eat();
  }
};

*!*
// 이제 제대로 동작합니다
longEar.eat();  // 귀가 긴 토끼 이/가 먹이를 먹습니다.
*/!*
```

`[[HomeObject]]`의 메커니즘 덕분에 메서드가 의도한 대로 동작하는 것을 확인해 보았습니다. 이렇게 `longEar.eat`같은 객체 메서드는 `[[HomeObject]]`를 알고 있기 때문에 `this` 없이도 프로토타입으로부터 부모 메서드를 가져올 수 있습니다.

### 메서드는 자유롭지 않습니다

자바스크립트에서 함수는 대개 객체에 묶이지 않고 '자유롭습니다'. 이런 자유성 때문에 `this`가 달라도 객체 간 메서드를 복사하는 것이 가능하죠.

그런데 `[[HomeObject]]`는 그 존제만으로도 함수의 자유도를 파괴합니다. 메서드가 객체를 기억하기 때문입니다. 개발자가 `[[HomeObject]]`를 변경할 방법은 없기 때문에 한 번 바인 딩된 함수는 더이상 변경되지 않죠.

다행인 점은 `[[HomeObject]]`는 오직 `super` 내부에서만 유효하다는 것입니다. 그렇기 때문에 메서드에서 `super`를 사용하지 않는 경우엔 메서드의 자유성이 보장됩니다. 객체 간 복사 역시 가능하죠. 하지만 메서드에서 `super`를 사용하면 이야기가 달라집니다.

객체 간 메서드를 잘못 복사한 경우에 `super`가 제대로 동작하지 않는 경우를 살펴봅시다.

```js run
let animal = {
  sayHi() {
    console.log(`나는 동물입니다.`);
  }
};

// rabbit은 animal을 상속받습니다.
let rabbit = {
  __proto__: animal,
  sayHi() {
    super.sayHi();
  }
};

let plant = {
  sayHi() {
    console.log("나는 식물입니다.");
  }
};

// tree는 plant를 상속받습니다.
let tree = {
  __proto__: plant,
*!*
  sayHi: rabbit.sayHi // (*)
*/!*
};

*!*
tree.sayHi();  // 나는 동물입니다. (?!?)
*/!*
```

`tree.sayHi()`를 호출하니 "나는 동물입니다."가 출력됩니다. 뭔가 잘못된 것이 분명해 보이네요.

원인은 꽤 단순합니다.
- `(*)`로 표시한 줄에서 메서드 `tree.sayHi`는 중복 코드를 방지하기 위해 `rabbit`에서 메서드를 복사해왔습니다.
- 그런데 복사해온 메서드는 `rabbit`에서 생성했기 때문에 이 메서드의 `[[HomeObject]]`는 `rabbit`입니다, 개발자는 `[[HomeObject]]`를 변경할 수 없습니다.
- `tree.sayHi()`의 코드 내부엔 `super.sayHi()`가 있습니다. `rabbit`의 프로토타입은 `animal`이므로 `super`는 체인 위에있는 `animal`로 올라가 `sayHi`를 찾습니다.

일련의 과정을 그림으로 나타내면 다음과 같습니다.

![](super-homeobject-wrong.svg)

### 함수 프로퍼티가 아닌 메서드 사용하기

`[[HomeObject]]`는 클래스와 일반 객체의 메서드에서 정의됩니다. 그런데 객체 메서드의 경우 `[[HomeObject]]`가 제대로 동작하게 하려면 메서드를 반드시 `method()` 형태로 정의해야 합니다. `"method: function()"` 형태로 정의하면 안 됩니다.

개발자 입장에선 두 방법의 차이는 그리 중요하지 않을 수 있지만, 자바스크립트 입장에선 아주 중요합니다. 

메서드 문법이 아닌(non-method syntax) 함수 프로퍼티를 사용해 예시를 작성해 보면 다음과 같습니다. `[[HomeObject]]` 프로퍼티가 설정되지 않기 때문에 상속이 제대로 동작하지 않는 것을 확인할 수 있습니다. 

```js run
let animal = {
  eat: function() { // 'eat() {...' 대신 'eat: function() {...'을 사용해봅시다. 
    // ...
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() {
    super.eat();
  }
};

*!*
rabbit.eat();  // SyntaxError: 'super' keyword unexpected here ([[HomeObject]]가 없어서 에러가 발생함)
*/!*
```

## 요약

1. 클래스 확장하기: `class Child extends Parent`
    - `Child.prototype.__proto__`가 `Parent.prototype`이 되므로 메서드 전체가 상속됩니다.
2. 생성자 오버라이딩:
    - `this`를 사용하기 전에 `Child` 생성자 안에서 `super()`로 부모 생성자를 반드시 호출해야 합니다.
3. 메서드 오버라이딩:
    - `Child`에 정의된 메서드에서 `super.method()`를 사용해 `Parent`에 정의된 메서드를 사용할 수 있습니다.
4. super 키워드와 [[HomeObject]]
    - 메서드는 내부 프로퍼티 `[[HomeObject]]`에 자신이 정의된 클래스와 객체를 기억해놓습니다. `super`는 `[[HomeObject]]`를 사용해 부모 메서드를 찾습니다.
    - 따라서 `super`가 있는 메서드는 객체 간 복사 시 제대로 동작하지 않을 수 있습니다.

추가 사항:
- 화살표 함수는 `this`나 `super`를 갖지 않으므로 주변 컨텍스트에 잘 들어맞습니다.
