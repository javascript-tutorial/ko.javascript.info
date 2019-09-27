# 네이티브 프로토 타입

프로토타입 프로퍼티는 자바스크립트 내에서 널리 이용됩니다. 모든 내장 생성자 함수에서 사용됩나다.

첫번째로 자세히 살펴본다음 어떻게 내장 객체에 새 기능을 추가하는 법을 알아 보겠습니다.

## Object.prototype

빈 객체를 표현한다고 생각해 봅시다.

```js run
let obj = {};
alert( obj ); // "[object Object]" ?
```

`"[object Object]"` 문자열을 생성하는 코드는 어디에 있나요? 이는 내장 `toString` 메서드 입니다. 하지만 어디에 있을까요? `obj`는 비어 있습니다!


<!-- ...But the short notation `obj = {}` is the same as `obj = new Object()`, where `Object` is a built-in object constructor function, with its own `prototype` referencing a huge object with `toString` and other methods.

review required
 `obj = {}`의 줄일법은  `obj = new Object()`와 같습니다. `Object` 내장 객체 생성자 함수에서  `prototype`을 가지고 참조하는 큰 객체와 `toString` 과 다른 메서드들 참조하는  -->


어떤 일이 벌어지는지 보겠습니다.

![](object-prototype.svg)

`new Object()`를 호출 하거나 실제 객체  `{...}`가 생성되었다고 할 때 객체의 `[Prototype]`은 이전 챕터에서 얘기한 룰에 따라서 `Object.prototype`으로 설정 됩니다. 

![](object-prototype-1.svg)

그래서 `obj.toString()`이 호출 되어 질때 메서드는 `Object.prototype`로 부터 가져옵니다.

예제를 확인 해 봅시다.

```js run
let obj = {};

alert(obj.__proto__ === Object.prototype); // true
// obj.toString === obj.__proto__.toString == Object.prototype.toString
```


`Object.prototype`위의 체인에는 더 이상`[[Prototype]]`이 없는 점을 알아두세요  
```js run
alert(Object.prototype.__proto__); // null
```

## 다른 내장 프로토타입

 `Array`, `Date`, `Function` 와 같은 다른 내장 객체들 와 다른 객체들 또한 메서드를 프로토 타입안에 유지합니다.

에를 들면 배열`[1,2,3]` 을 생성 할때 기본 `new Array()`생성자는 내부적으로 사용됩니다. 그래서 `Array.prototype`가  프로토 타입이 되고 메서드를 제공하게 됩니다. 이는 상당히 메모리 효율적입니다.

구체적으로 모든 내장 프로토 타입은  `Object.prototype`을 가장 위에 가집니다. 이 때문에 몇몇 사람들은 "모든것은 객체로부터 온다 "라고 말합니다.

여기 전체적인 사진이 있습니다(3 가지 built-ins에 맞는).
![](native-prototypes-classes.svg)

프로토타입을 각각 확인해 봅시다.
```js run
let arr = [1, 2, 3];

// it inherits from Array.prototype?
// Array.prototype으로 부터 상속되었나?
alert( arr.__proto__ === Array.prototype ); // true

// then from Object.prototype?
// 그럼 Object.prototype부터?
alert( arr.__proto__.__proto__ === Object.prototype ); // true

// and null on the top.
// 그리고 가장위의 null값 
alert( arr.__proto__.__proto__.__proto__ ); // null
```

<!-- 
Some methods in prototypes may overlap, for instance, `Array.prototype` has its own `toString` that lists comma-delimited elements:
몇몇 메서드의 프로토 타입이 중복 될 수 도 있습니다. 예를틀면 ,`Array.prototype`은 `toString` 쉼표제한적 요소의 항목에서는  -->

```js run
let arr = [1, 2, 3]
alert(arr); // 1,2,3 <-- the result of Array.prototype.toString
```

전에 보았던 대로, `Object.prototype`또한 `toString`을 가지고 있습니다. 그러나 `Array.prototype`가 체인에 더 가깝기 때문에 배열 variant 가 사용되었습니다. 

![](native-prototypes-array-tostring.svg)


크롬 개발자 콘솔과 같은 브라우져 툴 내에서는 상속을 보여줍니다.(`console.dir`은 아마 내장 객체를 사용하기 위해 필요합니다.)

![](console_dir_array.png)

다른 내장 객체들 또한 같은 방법으로 동작 합니다. 심지어 내장 `Function`의 객체 함수 생성자와 메서드(`call`/`apply`등등)들도  `Fuction.prototype`로 부터 가져옵니다. 함수 또한 자기자신의`toString`를 가지고 있습니다.
```js run
function f() {}

alert(f.__proto__ == Function.prototype); // true
alert(f.__proto__.__proto__ == Object.prototype); // true, inherit from objects
```

## 원시값
가장 복잡한 것은 문자열 숫자 그리고 불값과 함께 생깁니다.
기억하다시피 이것들은 객체가 아닙니다. 그러나 그들의 프로퍼티에 접근할려고 시도한다면 내장 생성자 `String`, `Number`, `Boolean`를 사용하는 임시래퍼 객체가 생성되며 메서드를 제공하고 사리집니다.
이러한 객체들은 눈에 보이지 않게생성되고 대부분의 엔진은 이를 최적화 합니다.명세서에도 이와 같이 묘사됩니다. 객체들의 메서드는 `String.prototype`, `Number.prototype`, `Boolean.prototype` 처럼 사용할 수 있는 프로토 타입안에 존재합니다.


```warn header="Values `null` and `undefined` have no object wrappers"
Special values `null` and `undefined` stand apart. They have no object wrappers, so methods and properties are not available for them. And there are no corresponding prototypes too.
```

## Changing native prototypes [#native-prototype-change]

Native prototypes can be modified. For instance, if we add a method to `String.prototype`,  it becomes available to all strings:

```js run
String.prototype.show = function() {
  alert(this);
};

"BOOM!".show(); // BOOM!
```

During the process of development, we may have ideas for new built-in methods we'd like to have, and we may be tempted to add them to native prototypes. But that is generally a bad idea.

```warn
Prototypes are global, so it's easy to get a conflict. If two libraries add a method `String.prototype.show`, then one of them will be overwriting the method of the other.

So, generally, modifying a native prototype is considered a bad idea.
```

**In modern programming, there is only one case where modifying native prototypes is approved. That's polyfilling.**

Polyfilling is a term for making a substitute for a method that exists in JavaScript specification, but is not yet supported by current JavaScript engine.

Then we may implement it manually and populate the built-in prototype with it.

For instance:

```js run
if (!String.prototype.repeat) { // if there's no such method
  // add it to the prototype

  String.prototype.repeat = function(n) {
    // repeat the string n times

    // actually, the code should be a little bit more complex than that
    // (the full algorithm is in the specification)
    // but even an imperfect polyfill is often considered good enough for use
    return new Array(n + 1).join(this);
  };
}

alert( "La".repeat(3) ); // LaLaLa
```


## Borrowing from prototypes

In the chapter <info:call-apply-decorators#method-borrowing> we talked about method borrowing.

That's when we take a method from one object and copy it into another.

Some methods of native prototypes are often borrowed.

For instance, if we're making an array-like object, we may want to copy some `Array` methods to it.

E.g.

```js run
let obj = {
  0: "Hello",
  1: "world!",
  length: 2,
};

*!*
obj.join = Array.prototype.join;
*/!*

alert( obj.join(',') ); // Hello,world!
```

It works, because the internal algorithm of the built-in `join` method only cares about the correct indexes and the `length` property, it doesn't check that the object is indeed the array. And many built-in methods are like that.

Another possibility is to inherit by setting `obj.__proto__` to `Array.prototype`, so all `Array` methods are automatically available in `obj`.

But that's impossible if `obj` already inherits from another object. Remember, we only can inherit from one object at a time.

Borrowing methods is flexible, it allows to mix functionality from different objects if needed.

## Summary

- All built-in objects follow the same pattern:
    - The methods are stored in the prototype (`Array.prototype`, `Object.prototype`, `Date.prototype` etc).
    - The object itself stores only the data (array items, object properties, the date).
- Primitives also store methods in prototypes of wrapper objects: `Number.prototype`, `String.prototype`, `Boolean.prototype`. Only `undefined` and `null` do not have wrapper objects.
- Built-in prototypes can be modified or populated with new methods. But it's not recommended to change them. Probably the only allowable cause is when we add-in a new standard, but not yet supported by the engine JavaScript method.
