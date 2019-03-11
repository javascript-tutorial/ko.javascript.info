# 프로토타입 상속(Prototypal inheritance)

우리는 종종 프로그래밍을 하다 보면 확장을 하기를 원합니다. 

예를 들어, 메서드와 속성을 가지고 있는 `user`라는 객체를 가지고 있다고 해 봅시다. 그리고 우리는 이 객체에 살짝 변화를 주면서 `admin`과 `guest`를 추가하고 싶다고 해 봅시다. 우리는 메서드를 복사/구현하는 것이 아니라 `user`가 가지고 있는 것을 재사용하고 싶을 것입니다. 이 위에 새로운 객체를 만드는 것이죠. 

*원형 상속 Prototypal inheritance*은 바로 그것을 돕는 언어 특징입니다. 

## [[Prototype]]

자바스크립트에서, 객체는 `[[Prototype]]`이라는 숨겨진 속성을 가지고 있습니다(specification에 명명되어 있듯이). 이 속성은 `null`이거나 다른 객체를 참조하고 있습니다. 그 객체가 바로 "원형"이라 불리는 객체입니다. 

![prototype](object-prototype-empty.png)

`[[Prototype]]`은 "마법의" 의미를 가지고 있습니다. `객체`에서 속성을 읽을 때 만약 해당 속성이 없다면, 자바스크립트는 자동으로 해당 객체의 원형에서 그것을 읽어 옵니다. 프로그래밍에서 그런 것을 "원형 상속 Prototypal inheritance"이라고 부릅니다. 많은 간지나는 언어들과 프로그래밍 기술의 토대가 되는 언어 특징입니다.
`[[prototype]]`속성은 내부적으로 숨겨져 있습니다. 하지만 설정할 수 있는 많은 방법이 있죠.

그중 하나가 `__proto__`입니다, 이렇게 사용하죠:

```js run
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

*!*
rabbit.__proto__ = animal;
*/!*
```

```smart header="`__proto__` is a historical getter/setter for `[[Prototype]]`"
`__proto__`가 `[[Prototype]]`과 *같지 않다*는 것을 기억해 두세요. `__proto__` 그것의 getter/setter입니다.

It exists for historical reasons, in modern language it is replaced with functions `Object.getPrototypeOf/Object.setPrototypeOf` that also get/set the prototype. We'll study the reasons for that and these functions later.

By the specification, `__proto__` must only be supported by browsers, but in fact all environments including server-side support it. For now, as `__proto__` notation is a little bit more intuitively obvious, we'll use it in the examples.
```

만약 우리가 `rabbit` 속성을 찾는다면, 그리고 그게 없다면, 자바스크립트는 자동으로 `animal`에서 그것을 찾을 것입니다.

예를 들어:

```js run
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

*!*
rabbit.__proto__ = animal; // (*)
*/!*

// we can find both properties in rabbit now:
*!*
alert( rabbit.eats ); // true (**)
*/!*
alert( rabbit.jumps ); // true
```

여기`(*)`가 표시된 줄에서 `animal`을 `rabbit`의 원형으로 설정하고 있습니다.

이후, `alert`가 `(**)`에서 `rabbit.eats`속성을 읽으려 할 때, `rabbit`에서 읽지 않습니다. 즉, 자바스크립트는 `[[Prototype]]`을 따라가서 참조하고 `animal`에서 해당 속성을 찾아냅니다(이때 아래서부터 찾습니다).

![](proto-animal-rabbit.png)

이것을 "`animal`은 `rabbit`의 원형이다"라고 하거나 "`rabbit`은 `animal`으로 부터 원형 상속을 한다."라고 할 수 있습니다.

그래서 만약 `animal`이 많은 유용한 객체와 메서드를 가지고 있다면, `rabbit`에서 자동으로 사용할 수 있게 됩니다. 그런 속성들을 "상속됐다"라고 표현하죠.

만약 우리가 `animal`에 어떤 메서드를 가지고 있다면, `rabbit`에서도 호출할 수 있습니다.

```js run
let animal = {
  eats: true,
*!*
  walk() {
    alert("Animal walk");
  }
*/!*
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

// walk is taken from the prototype
*!*
rabbit.walk(); // Animal walk
*/!*
```

그 메서드는 자동으로 원형에서 가져옵니다. 다음을 보시죠.

![](proto-animal-rabbit-walk.png)

이러한 원형 체인은 더 길어질 수 있습니다:

```js run
let animal = {
  eats: true,
  walk() {
    alert("Animal walk");
  }
};

let rabbit = {
  jumps: true,
*!*
  __proto__: animal
*/!*
};

let longEar = {
  earLength: 10,
*!*
  __proto__: rabbit
*/!*
};

// walk는 원형 체인으로부터 얻어옵니다.
longEar.walk(); // Animal walk
alert(longEar.jumps); // true (from rabbit)
```

![](proto-animal-rabbit-chain.png)

단지 여기에는 2개의 제약이 있습니다.

1. 참조는 이 순환에 들어가지 않습니다. 만약 우리가 `__proto__`를 원형 체인 순환에 할당하려고 한다면 에러를 던집니다.
2. `__proto__`의 값은 `null`이거나 객체입니다. 모든 다른 값들(primitive)은 무시됩니다.
1. The references can't go in circles. JavaScript will throw an error if we try to assign `__proto__` in a circle.
2. The value of `__proto__` can be either an object or `null`, other types (like primitives) are ignored.

또한 당연할지 모르지만, 오직 하나의 `[[Portotype]]`만 있을 수 있습니다. 객체는 두 개의 다른 객체로부터 상속받지 않을 테니까요.

## Writing doesn't use prototype

원형은 오직 속성들을 읽는 데 사용합니다.

getter/setter가 아닌 데이터 속성들을 쓰고/지우는 명령들은 객체에 직접 적용할 수 있습니다.
Write/delete operations work directly with the object.

아래 예제에서는, `walk`메서드를 `rabbit`에 할당하고 있습니다:

```js run
let animal = {
  eats: true,
  walk() {
    /* this method won't be used by rabbit */  
  }
};

let rabbit = {
  __proto__: animal
};

*!*
rabbit.walk = function() {
  alert("Rabbit! Bounce-bounce!");
};
*/!*

rabbit.walk(); // Rabbit! Bounce-bounce!
```

이제 부터, `rabbit.walk()`을 호출하면 메서드를 사용하지 않고 즉시 객체에서 찾고 실행할 것입니다. 

![](proto-animal-rabbit-walk-2.png)

만약 우리가 속성을 읽고 쓴다면 getter/setter는 원형에서 찾아지고 호출됩니다.
That's for data properties only, not for accessors. If a property is a getter/setter, then it behaves like a function: getters/setters are looked up in the prototype.

예를 들어, 아래 코드에서 `admin.fullName`속성을 보시면:
For that reason `admin.fullName` works correctly in the code below:

```js run
let user = {
  name: "John",
  surname: "Smith",

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  },

  get fullName() {
    return `${this.name} ${this.surname}`;
  }
};

let admin = {
  __proto__: user,
  isAdmin: true
};

alert(admin.fullName); // John Smith (*)

// setter triggers!
admin.fullName = "Alice Cooper"; // (**)
```

여기 `(*)`라인의 `admin.fullName`속성은 `user`원형에서 getter를 가지고 있습니다, 그래서 호출된 것이죠. 그리고 `(**)`라인의 속성은 setter를 원형에 가지고 있습니다. 그렇기 때문에 호출된 것입니다.

## "this" 값

위의 예제에서 흥미로운 질문을 던질 수 있습니다: `set fullName(valuie)`에서 `this`는 어떤 값을 가지고 있는가? `this.name`과 `this.surname`은 어디에 코딩되어있는가? `user` 또는 `admin`?
답은 간단합니다. `this`는 원형에 의해 전혀 영향을 받지 않습니다.
An interesting question may arise in the example above: what's the value of `this` inside `set fullName(value)`? Where the properties `this.name` and `this.surname` are written: into `user` or `admin`?

**그 메서드가 어디서 호출되는지는 중요하지 않습니다. 객체에서 호출되든 이 객체의 원형에서 호출되든. 메서드 호출에서는, `this`는 언제나 `.`연산 앞에 있는 객체를 가리킵니다.**

그래서, setter는 `admin.fullName=`를 호출해서 `admin`을 `this`로 사용합니다. `user`가 아니고요.

That is actually a super-important thing, because we may have a big object with many methods and inherit from it. Then we can run its methods on inherited objects and they will modify the state of these objects, not the big one.
이건 사실 매우 매우 중요한 사실입니다, 왜냐하면 많은 메서드를 가진 객체를 가지고 있고 이 객체로부터 상속한 경우를 생각해 보죠. 그 후에 부모겍체의 메서드를 상속된 객체에서 실행시킬 수 있을 것입니다. 그러나 이것은 부모객체가 아니라 상속받은 객체들의 상태를 수정할 것입니다.
(업데이트)That is actually a super-important thing, because we may have a big object with many methods and inherit from it. Then inherited objects can run its methods, and they will modify the state of these objects, not the big one.

예를 들어, 여기 `animal`가 "메서드 저장소"라고 해보죠, 그리고 `rabbit`은 이것을 사용합니다.

`rabbit.sleep()`호출은 `this.isSleeping`을 `rabbit`객체에 설정할 것입니다.

```js run
// animal has methods
let animal = {
  walk() {
    if (!this.isSleeping) {
      alert(`I walk`);
    }
  },
  sleep() {
    this.isSleeping = true;
  }
};

let rabbit = {
  name: "White Rabbit",
  __proto__: animal
};

// modifies rabbit.isSleeping
rabbit.sleep();

alert(rabbit.isSleeping); // true
alert(animal.isSleeping); // undefined (no such property in the prototype)
```

결과입니다: 

![](proto-animal-rabbit-walk-3.png)

만약 우리가 `animal`로 부터 상속한 `bird`나 `snake` 등의 객체를 가지고 있다고 해 봅시다. 이것들도 역시 `animal`의 메서드들을 접근할 권한을 얻을 것입니다. 하지만 각 메서드의 `this`는 `animal`이 아니라 각 객체에 대응할 것입니다. 호출 시점에 정의가 되니까요(`.`이전에). 그래서 우리가 `this`에 데이터를 쓸 때는 이 객체들에 저장하는 것입니다.

결과적으로, 메서드는 공유되지만, 객체의 상태는 아닙니다.

## 요약

- 자바스크립트에서, 모든 객체는 숨겨진 `[[Prototype]]`속성을 갖는다. 그리고 이 속성은 객체이거나 `null`이다.
- `obj.__proto__`를 사용하여 이 속성에 접근할 수 있다(다른 방법도 있습니다. 나중에 다루도록 하죠).
- `[[Prototype]]`에 의해 참조되는 객체를 "원형"이라고 합니다.
- 만약 `obj`의 속성을 읽고 싶다면, 그리고 그게 존재하지 않는다면, 자바스크립트는 원형에서 그것을 찾으려 할 것입니다. 읽기/지우기 명령은 객체에 직접적으로 적용됩니다. 원형을 사용하지 않습니다(속성이 setter가 아닌 이상).
- 만약 `obj.method()`를 호출한다면, 그리고 `method`가 원형으로부터 가져온다면, `this`는 여전히 `obj`를 가리킵니다. 그래서 설사 상속되었다고 해도 메서드들을 언제나 현재 객체에 적용될 것입니다.
- In JavaScript, all objects have a hidden `[[Prototype]]` property that's either another object or `null`.
- We can use `obj.__proto__` to access it (a historical getter/setter, there are other ways, to be covered soon).
- The object referenced by `[[Prototype]]` is called a "prototype".
- If we want to read a property of `obj` or call a method, and it doesn't exist, then JavaScript tries to find it in the prototype. Write/delete operations work directly on the object, they don't use the prototype (unless the property is actually a setter).
- If we call `obj.method()`, and the `method` is taken from the prototype, `this` still references `obj`. So methods always work with the current object even if they are inherited.
