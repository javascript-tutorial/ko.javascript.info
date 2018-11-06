# Prototypal inheritance

In programming, we often want to take something and extend it.

우리는 종종 프로그래밍을 하다보면 확장을 하기를 원하죠. 

For instance, we have a `user` object with its properties and methods, and want to make `admin` and `guest` as slightly modified variants of it. We'd like to reuse what we have in `user`, not copy/reimplement its methods, just build a new object on top of it.

예를 들어, 메소드와 속성을 가지고 있는 `user`라는 오브젝트를 가지고 있다고 해 봅시다. 그리고 우리는 이 객체에 살짝 변화를 주면서 `admin`과 `guest`를 추가하고 싶다고 해 봅시다. 우리는 메소드를 복사/구현 하는 것이 아니라 `user`가 가지고 있는 것을 재사용하고 싶을 것입니다. 이 위에 새로운 객체를 만드는 것이죠. 

*Prototypal inheritance** is a language feature that helps in that.

*원형 상속 Prototypal inheritance*은 바로 그것을 돕는 언어 특징입니다. 

## [[Prototype]]

In JavaScript, objects have a special hidden property `[[Prototype]]` (as named in the specification), that is either `null` or references another object. That object is called "a prototype":

자바스크립트에서, 객체는 `[[Prototype]]`이라는 숨겨진 속성을 가지고 있습니다(specification에 명명 되어 있듯이). 이 속성은 `null`이거나 다른 객체를 참조하고 있습니다. 그 객체가 바로 "원형"이라 불리는 객체입니다. 

![prototype](object-prototype-empty.png)

That `[[Prototype]]` has a "magical" meaning. When we want to read a property from `object`, and it's missing, JavaScript automatically takes it from the prototype. In programming, such thing is called "prototypal inheritance". Many cool language features and programming techniques are based on it.

`[[Prototype]]`은 "마법의" 의미을 가지고 있습니다. `객체`에서 속성을 읽을 때 만약 해당 속성이 없다면, 자바스크립트는 자동으로 해당 객체의 원형에서 그것을 읽어 옵니다. 프로그래밍에서 그런 것을 "원형 상속 Prototypal inheritance"이라고 부릅니다. 많은 간지나는 언어들과 프로그래밍 기술의 토대가 되는 언어 특징입니다.

The property `[[Prototype]]` is internal and hidden, but there are many ways to set it.
`[[prototype]]`속성은 내부적으로 숨겨져있습니다. 하지만 설정할 수 있는 많은 방법이 있죠.

One of them is to use `__proto__`, like this:
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

Please note that `__proto__` is *not the same* as `[[Prototype]]`. That's a getter/setter for it. We'll talk about other ways of setting it later, but for now `__proto__` will do just fine.
`__proto__`가 `[[Prototype]]`과 *같지 않다*는 것을 기억해 두세요. `__proto__` 그것의 getter/setter입니다. 다른 방법들은 다음에 이야기 하도록하죠. 지금은 일단 `__proto__`가 제역할을 할 것이라고만 알아두죠. 


If we look for a property in `rabbit`, and it's missing, JavaScript automatically takes it from `animal`.
만약 우리가 `rabbit` 속성을 찾는다면, 그리고 그게 없다면, 자바스크립트는 자동으로 `animal`에서 그것을 찾을 것 입니다.

For instance:
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

Here the line `(*)` sets `animal` to be a prototype of `rabbit`.

여기`(*)`가 표시된 줄에서 `animal`을 `rabbit`의 원형으로 설정하고 있습니다.

Then, when `alert` tries to read property `rabbit.eats` `(**)`, it's not in `rabbit`, so JavaScript follows the `[[Prototype]]` reference and finds it in `animal` (look from the bottom up):

그러고는, `alert`가 `(**)`에서 `rabbit.eats`속성을 읽어오려고 할 때, `rabbit`에서 읽어오지 않습니다. 그러니까, 자바스크립트는 `[[Prototype]]`을 따라가서 참조하고 `animal`에서 이것을 찾아냅니다(아래서부터 찾습니다) : 

![](proto-animal-rabbit.png)

Here we can say that "`animal` is the prototype of `rabbit`" or "`rabbit` prototypally inherits from `animal`".

여기서 우리는 "`animal`은 `rabbit`의 원형이다"라고 말하거나 "`rabbit`은 `animal`으로 부터 원형 상속을 한다." 라고 말할 수 있습니다.

So if `animal` has a lot of useful properties and methods, then they become automatically available in `rabbit`. Such properties are called "inherited".
그래서 만약 `animal`이 많은 유용한 객체와 메소드를 가지고 있다면, `rabbit`에서 자동으로 사용할 수 있게 됩니다. 그런 속성들을 "상속됬다"라고 표현하죠.

If we have a method in `animal`, it can be called on `rabbit`:
만약 우리가 `animal`에 어떤 메소드를 가지고 있다면, `rabbit`에서도 호촐할 수 있습니다: 

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

The method is automatically taken from the prototype, like this:
그 메소드는 자동으로 원형에서 가져옵니다. 다음을 보시죠:

![](proto-animal-rabbit-walk.png)

The prototype chain can be longer:
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
  __proto__: animal
};

let longEar = {
  earLength: 10,
  __proto__: rabbit
}

// walk is taken from the prototype chain
// walk는 원형 체인으로부터 얻어옯니다.
longEar.walk(); // Animal walk
alert(longEar.jumps); // true (from rabbit)
```

![](proto-animal-rabbit-chain.png)

There are actually only two limitations:
단지 여기에는 2개의 제약이 있습니다.

1. The references can't go in circles. JavaScript will throw an error if we try to assign `__proto__` in a circle.
2. The value of `__proto__` can be either an object or `null`. All other values (like primitives) are ignored.

1. 참조는 이 순환에 들어가지 않습니다. 만약 우리가 `__proto__`를 원형 체인 순환에 할당하려고 한다면 애러를 던집니다.
2. `__proto__`의 값은 `null`이거나 객체입니다. 모든 다른 값들(primitive)은 무시됩니다.

Also it may be obvious, but still: there can be only one `[[Prototype]]`. An object may not inherit from two others.
또한 당연할 지 모르지만, 오직 하나의 `[[Portotype]]`만 있을 수 있습니다. 객체는 두개의 다른 객체로부터 상속 받지 않을테니까요.


## Read/write rules
## 읽고 쓰기 규칙

The prototype is only used for reading properties.

원형은 오직 속성들을 읽는데 사용합니다.

For data properties (not getters/setters) write/delete operations work directly with the object.

getter/setter가 아닌 데이터 속성들을 쓰고/지우는 명령들은 객체에 직접적으로 적용할 수 있습니다.

In the example below, we assign its own `walk` method to `rabbit`:
아래 예제에서는, `walk`메소드를 `rabbit`에 할당하고 있습니다:

```js run
let animal = {
  eats: true,
  walk() {
    /* this method won't be used by rabbit */  
  }
};

let rabbit = {
  __proto__: animal
}

*!*
rabbit.walk = function() {
  alert("Rabbit! Bounce-bounce!");
};
*/!*

rabbit.walk(); // Rabbit! Bounce-bounce!
```

From now on, `rabbit.walk()` call finds the method immediately in the object and executes it, without using the prototype:
이제 부터, `rabbit.walk()`을 호출하면 메소드를 사용하지 않고 즉시 객체에서 찾고 실행할 것입니다. 


![](proto-animal-rabbit-walk-2.png)

For getters/setters -- if we read/write a property, they are looked up in the prototype and invoked.
만약 우리가 속성을 읽고 쓴다면 getter/setter는 원형에서 찾아지고 호출됩니다.

For instance, check out `admin.fullName` property in the code below:
예를 들어, 아래 코드에서 `admin.fullName`속성을 보시면:

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

Here in the line `(*)` the property `admin.fullName` has a getter in the prototype `user`, so it is called. And in the line `(**)` the property has a setter in the prototype, so it is called.

여기 `(*)`라인의 `admin.fullName`속성은 `user`원형에서 getter를 가지고 있습니다, 그래서 호출된것이죠. 그리고 `(**)`라인의 속성은 setter를 원형에 가지고 있습니다. 그렇기 때문에 호출된 것입니다.

## The value of "this"
## "this" 값

An interesting question may arise in the example above: what's the value of `this` inside `set fullName(value)`? Where the properties `this.name` and `this.surname` are written: `user` or `admin`?
위의 예제에서 흥미로운 질문을 던질 수 있습니다: `set fullName(valuie)`에서 `this`는 어떤 값을 가지고 있는가? `this.name`과 `this.surname`은 어디에 코딩되어있는가? `user` 또는 `admin`?

The answer is simple: `this` is not affected by prototypes at all.
답은 간단합니다. `this`는 원형에 의해 전혀 영향을 받지 않습니다.

**No matter where the method is found: in an object or its prototype. In a method call, `this` is always the object before the dot.**

**그 메소드가 어디서 호출되는 지는 중요하지않습니다. 객체에서 호출되든 이 객체의 원형에서 호출되든. 메소드 호출에서는, `this`는 언제나 `.`연산 앞에 있는 객체를  가르킵니다.**

So, the setter actually uses `admin` as `this`, not `user`.

그래서, setter는 사실 `admin`을 `this`로 사용합니다. `user`가 아니구요!

That is actually a super-important thing, because we may have a big object with many methods and inherit from it. Then we can run its methods on inherited objects and they will modify the state of these objects, not the big one.

이건 사실 매우 매우 중요한 사실입니다, 왜냐하면 많은 메소드를 가진 객체를 가지고 있고 이 객체로부터 상속한 경우가 있으니까요. 그 후에 그 객체의 메소드를 상속된 객체들에서 실행시킬수 있을 테고 이것은 부모객체가 아니라 상속 받은 객체들의 상태를 수정할 것 입니다.

For instance, here `animal` represents a "method storage", and `rabbit` makes use of it.
예를 들어, 여기 `animal`가 "메소드 저장소"라고 해보죠, 그리고 `rabbit`은 이것을 사용하구요.

The call `rabbit.sleep()` sets `this.isSleeping` on the `rabbit` object:
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

The resulting picture:
결과입니다: 

![](proto-animal-rabbit-walk-3.png)

If we had other objects like `bird`, `snake` etc inheriting from `animal`, they would also gain access to methods of `animal`. But `this` in each method would be the corresponding object, evaluated at the call-time (before dot), not `animal`. So when we write data into `this`, it is stored into these objects.

만약 우리가 `animal`로 부터 상속한 `bird`나 `snake` 등의 객체를 가지고 있다고 해 봅시다. 이 것들도 역시 `animal`의 메소드들을 접근할 권한을 얻을 것 입니다. 하지만 각 메소드의 `this`는 `animal`이 아니라 각 객체에 대응할 것입니다. 호출 시점에 정의가 되니까요(`.`이전에). 그래서 우리가 `this`에 데이터를 쓸때는 이 객체들에 저장하는 것입니다.

As a result, methods are shared, but the object state is not.
결과적으로, 메소드는 공유되지만 객체의 상태는 아닙니다.

## Summary
## 요약

- In JavaScript, all objects have a hidden `[[Prototype]]` property that's either another object or `null`.
- 자바 스크립트에서, 모든 객체는 숨겨진 `[[Prototype]]`속성을 갖는다. 그리고 이 속성은 객체이거나 `null`이다.

- We can use `obj.__proto__` to access it (there are other ways too, to be covered soon).
- `obj.__proto__`를 사용하여 이 속성에 접근할 수 있다(다른 방법도 있습니다. 나중에 다루도록 하죠).

- The object referenced by `[[Prototype]]` is called a "prototype".
- `[[Prototype]]`에 의해 참조되는 객체를 "원형"이라고 합니다.

- If we want to read a property of `obj` or call a method, and it doesn't exist, then JavaScript tries to find it in the prototype. Write/delete operations work directly on the object, they don't use the prototype (unless the property is actually a setter).
- 만약 `obj`의 속성을 읽고 싶다면, 그리고 그게 존재하지 않는다면, 자바스크립트는 원형에서 그것을 찾으려 할 것입니다. 읽기/지우기 명령은 객체에 직접적으로 적용됩니다. 원형을 사용하지 않습니다(속성이 setter가 아닌 이상).

- If we call `obj.method()`, and the `method` is taken from the prototype, `this` still references `obj`. So methods always work with the current object even if they are inherited.

- 만약 `obj.method()`를 호출한다면, 그리고 `method`가 원형으로 부터 가져온다면, `this`는 여전히 `obj`를 가르킵니다. 그래서 설사 상속되었다 하다러라도 메소드들을 언제나 현제 객체에 적용되어질 것입니다.
