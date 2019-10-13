# 클래스 확인: "instanceof"
`instanceof` 연산자는 객체가 특정 클래스에 속해 있는지 없는지를 검사합니다. 또한, 상속 관계에 있는지 확인합니다.
확인하는 기능은 많은 경우에서 필수 적인데, 여기에 우리는 매개변수의 타입에 의해 처리하는 법이 달라지는 다형적인 함수를 빌드하기 위해 사용할 것입니다.

## The instanceof operator [#ref-instanceof]
## instanceof 연산자 [#ref-instanceof]
문법은:
```js
obj instanceof Class
```
It returns `true` if `obj` belongs to the `Class` or a class inheriting from it.
만약 `obj`가 `Class`에 속해 있거나 상속하고 있다면, true를 반환합니다.

예를 들어:
```js run
class Rabbit {}
let rabbit = new Rabbit();

// rabbit이 Rabbit class에 속해있는지 물어봅니다.
*!*
alert( rabbit instanceof Rabbit ); // true
*/!*
```

instanceof는 생성자 함수에서도 동작합니다:
```js run
*!*
// 함수 Rabbit
function Rabbit() {}
*/!*

alert( new Rabbit() instanceof Rabbit ); // true
```

...또한, `Array` 같은 클래스의 내장함수로써의 기능도 있습니다:

```js run
let arr = [1, 2, 3];
alert( arr instanceof Array ); // true
alert( arr instanceof Object ); // true
```

`arr`은 또한, `Object` class에 속해있다는 것을 기억하세요. `Array`는 원래 `Object`를 상속하고 있습니다.

보통, `instanceof` 연산자는 프로토타입 체인의 확인을 검사해줍니다. 또한, 정적인 메소드`Symbol.hasInstance`로 커스텀 로직을 설정할수 있습니다.

`obj instanceof Class`의 알고리즘은 대략적으로 다음과 같이 동작합니다:

1. 만약 정적인 매소드 `Symbol.hasInstance`가 있다고 가정한다면, 그저 호출 하면 됩니다: `Class[Symbol.hasInstance](obj)`.
결과는 `true` 나 `false`값을 반환 할것입니다. 다음은 `instanceof`를 어떻게 커스텀마이즈하는 지에 대한 예시입니다.
예시:

    ```js run
    // instanceOf는 canEat 프로퍼티가 aniaml인지 확인하는 것입니다.
    class Animal {
      static [Symbol.hasInstance](obj) {
        if (obj.canEat) return true;
      }
    }

    let obj = { canEat: true };

    alert(obj instanceof Animal); // true: Animal에서 저희가 커스터마이즈한 Symbol.hasInstance가 호출 되었기 때문에 true를 리턴했습니다.
    ```
2. 대부분 클래스들은 `Symbol.hasInstance`를 가지고 있지않습니다. 이번의 경우, 일반적인 로직을 사용되어질 것입니다: `obj instanceOf Class` 는  `Class.prototype`이 `obj` 프로토 체인 내부의 프로토타입들 중 하나와 같은지 확인합니다. 


    다시 말해서 하나를 다른것들과 같은지 비교하는 것입니다
    ```js
    obj.__proto__ === Class.prototype?
    obj.__proto__.__proto__ === Class.prototype?
    obj.__proto__.__proto__.__proto__ === Class.prototype?
    ...
    // 이중 하나라도 true라면 true를 리턴합니다
    // 다시말하면, 위의 해당되는 것이 하나도 없다면 false 입니다. 그말은 프르토 체인의 끝에 도달한다는 것을 의미합니다
    ```

   위의 예제에서 `rabbit.__proto__ === Rabbit.prototype`에서 true이기 때문에 즉시 응답을 줍니다.

    상속의 경우는 두번째 단계에서 일치 됩니다:

    ```js run
    class Animal {}
    class Rabbit extends Animal {}

    let rabbit = new Rabbit();
    *!*
    alert(rabbit instanceof Animal); // true
    */!*

    // rabbit.__proto__ === Rabbit.prototype
    *!*
    // rabbit.__proto__.__proto__ === Animal.prototype (match!)
    */!*
    ```

여기에 `rabbit instanceof Animal`의 무엇과 `Animal.prototype`을 비교하는 지에 대한 그림이 있습니다: 
![](instanceof.svg)
그런데, `objA`가 `objB`의 프로토타입들의 체인 어딘가에 있다면, `true`를 리턴하는 [objA.isPrototypeOf(objB)](mdn:js/object/isPrototypeOf) 라는메소드가 있습니다.
`Class` 생성자 그 자체는 확인할 수 없지만!, 오직 프르토 타입 체인과 `Class.prototype`은 매우 중요하므로 확인 해야합니다.
언제 `prototype`프로퍼티가 오브젝트가 생성된 후에 변화되는지, 흥미로운 결과를 이끌어 낼수 있습니다.
여기 처럼요:

```js run
function Rabbit() {}
let rabbit = new Rabbit();

// changed the prototype
Rabbit.prototype = {};

// ...not a rabbit any more!
*!*
alert( rabbit instanceof Rabbit ); // false
*/!*
```

## 보너스: 타입을 위한 Object.prototype.toString
우리는 이미 `[object Object]`의 문자열로 변환되는 평편한 오브젝트에 대해 알고 있습니다.

```js run
let obj = {};

alert(obj); // [object Object]
alert(obj.toString()); // the same
```
그건은 바로 `toString`으로 구현되어 있습니다. 그러나 `toString`를 실질적으로 그것이 가진 기능보다 더 강력하게 만들어 줄수 있는 몇가지 숨겨진 특징들이 있습니다. 우리는 확장된 기능으로써 `typeof`을 사용하는데, 이것은 `instanceof`를 위한 대안이 됩니다.
이상하게 들리나요? 그럼 미스터리로 두죠.

By [specification](https://tc39.github.io/ecma262/#sec-object.prototype.tostring), the built-in `toString` can be extracted from the object and executed in the context of any other value. And its result depends on that value.

- For a number, it will be `[object Number]`
- For a boolean, it will be `[object Boolean]`
- For `null`: `[object Null]`
- For `undefined`: `[object Undefined]`
- For arrays: `[object Array]`
- ...etc (customizable).

Let's demonstrate:

```js run
// copy toString method into a variable for convenience
let objectToString = Object.prototype.toString;

// what type is this?
let arr = [];

alert( objectToString.call(arr) ); // [object *!*Array*/!*]
```

Here we used [call](mdn:js/function/call) as described in the chapter [](info:call-apply-decorators) to execute the function `objectToString` in the context `this=arr`.

Internally, the `toString` algorithm examines `this` and returns the corresponding result. More examples:

```js run
let s = Object.prototype.toString;

alert( s.call(123) ); // [object Number]
alert( s.call(null) ); // [object Null]
alert( s.call(alert) ); // [object Function]
```

### Symbol.toStringTag

The behavior of Object `toString` can be customized using a special object property `Symbol.toStringTag`.

For instance:

```js run
let user = {
  [Symbol.toStringTag]: "User"
};

alert( {}.toString.call(user) ); // [object User]
```

For most environment-specific objects, there is such a property. Here are few browser specific examples:

```js run
// toStringTag for the environment-specific object and class:
alert( window[Symbol.toStringTag]); // window
alert( XMLHttpRequest.prototype[Symbol.toStringTag] ); // XMLHttpRequest

alert( {}.toString.call(window) ); // [object Window]
alert( {}.toString.call(new XMLHttpRequest()) ); // [object XMLHttpRequest]
```

As you can see, the result is exactly `Symbol.toStringTag` (if exists), wrapped into `[object ...]`.

At the end we have "typeof on steroids" that not only works for primitive data types, but also for built-in objects and even can be customized.

We can use `{}.toString.call` instead of `instanceof` for built-in objects when we want to get the type as a string rather than just to check.

## Summary

Let's summarize the type-checking methods that we know:

|               | works for   |  returns      |
|---------------|-------------|---------------|
| `typeof`      | primitives  |  string       |
| `{}.toString` | primitives, built-in objects, objects with `Symbol.toStringTag`   |       string |
| `instanceof`  | objects     |  true/false   |

As we can see, `{}.toString` is technically a "more advanced" `typeof`.

And `instanceof` operator really shines when we are working with a class hierarchy and want to check for the class taking into account inheritance.
