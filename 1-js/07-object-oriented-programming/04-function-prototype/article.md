# F.prototype

In modern JavaScript we can set a prototype using `__proto__`, as described in the previous article. But it wasn't like that all the time.
이전 글에서 말했듯이 모던 자바스크립트에서는 `__proto__`를 사용하여 원형을 설정 할 수 있습니다. 하지만 항상 그런것은 아니죠.

JavaScript has had prototypal inheritance from the beginning. It was one of the core features of the language.
자바스크립트는 처음부터 원형 상속을 할 수 있었습니다. 이 언어의 핵심적인 특징 중 하나였지요.

But in the old times, there was another (and the only) way to set it: to use a `"prototype"` property of the constructor function. And there are still many scripts that use it.
하지만 이 전에는, 설정할 수 있는 다른(또는 유일한) 방법이 있었습니다. 생성자 함수의 `"prototype"`속성을 이용하는 것이지요. 그리고 여전이 많은 스크립트에서 이것을 사용합니다. 

## The "prototype" property
## "prototype" 속성

As we know already, `new F()` creates a new object.
우리가 이미 알듯이, `new F()`는 새로운 객체를 만듭니다.

When a new object is created with `new F()`, the object's `[[Prototype]]` is set to `F.prototype`.
`new F()`로 새로운 객체를 만들때, 그 객체의 `[[Prototype]]`은 `F.prototype`으로 설정됩니다.

In other words, if `F` has a `prototype` property with a value of the object type, then `new` operator uses it to set `[[Prototype]]` for the new object.
다른 말로 해서 만약 `F`가 `prototype`속성을 객체타입의 값으로 가지고 있다면, `new` 명령은 그 `prototype`을 새로운 객체의 `[[Prototype]]`에 설정하기 위해서 사용할 것입니다. 

Please note that `F.prototype` here means a regular property named `"prototype"` on `F`. It sounds something similar to the term "prototype", but here we really mean a regular property with this name.
`F.prototype`은 여기서 `F`안에 `"prototype"`이라는 일반적인 속성임을 알아두세요. "원형"이라는 용어랑 비슷하게 들리겠지만, 여기서 진정으로 말하고자 하는 것은 이 이름으로 쓰이는 일반적인 속성입니다.

Here's the example:
예를 들어 보죠:

```js run
let animal = {
  eats: true
};

function Rabbit(name) {
  this.name = name;
}

*!*
Rabbit.prototype = animal;
*/!*

let rabbit = new Rabbit("White Rabbit"); //  rabbit.__proto__ == animal

alert( rabbit.eats ); // true
```

Setting `Rabbit.prototype = animal` literally states the following: "When a `new Rabbit` is created, assign its `[[Prototype]]` to `animal`".
`Rabbit.prototype = animal`을 설정하는 것은 말그대로 다음을 뜻합니다. "`new Rabbit`이 생성되었을때, 이것의 `[[Prototype]]`을 `animal`로 할당하라"

That's the resulting picture:
이게 결과 화면입니다.

![](proto-constructor-animal-rabbit.png)

On the picture, `"prototype"` is a horizontal arrow, it's a regular property, and `[[Prototype]]` is vertical, meaning the inheritance of `rabbit` from `animal`.
다이어그램에, `"prototype"`은 가로화살표입니다. 일반적인 속성이죠. 그리고 `[[Prototype]]`은 세로 화살표입니다. `animal`로 부터 상속받은 `rabbit`인스턴스를 뜻하죠.

## Default F.prototype, constructor property
## 기본 F.prototype, 생성자 속성

Every function has the `"prototype"` property even if we don't supply it.
우리가 제공하지 않더라도 모든 함수는 "prototype" 속성을 갖습니다.  

The default `"prototype"` is an object with the only property `constructor` that points back to the function itself.
기본 `"prototype"`은 단 하나의 속성 `constructor`을 갖습니다. 이 속성은 함수자기자신을 가리킵니다.  

Like this:
이렇게 말이죠:
```js
function Rabbit() {}

/* default prototype
Rabbit.prototype = { constructor: Rabbit };
*/
```

![](function-prototype-constructor.png)

We can check it:
다음과 같이 이것을 확인할 수 있습니다.
```js run
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

alert( Rabbit.prototype.constructor == Rabbit ); // true
```

Naturally, if we do nothing, the `constructor` property is available to all rabbits through  `[[Prototype]]`:
자연적으로, 만약 아무것도 하지않는다면, `constructor` 속성은 모든 rabbit에서 `[[Prototype]]`을 통해 접근가능합니다.

```js run
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

let rabbit = new Rabbit(); // inherits from {constructor: Rabbit}

alert(rabbit.constructor == Rabbit); // true (from prototype)
```

![](rabbit-prototype-constructor.png)

We can use `constructor` property to create a new object using the same constructor as the existing one.
우리는 이미 존재하는 것과 동일한 `constructor` 속성을 이용해서 새로운 객체를 만들 수 있습니다. 
Like here:
이렇게요:

```js run
function Rabbit(name) {
  this.name = name;
  alert(name);
}

let rabbit = new Rabbit("White Rabbit");

*!*
let rabbit2 = new rabbit.constructor("Black Rabbit");
*/!*
```

That's handy when we have an object, don't know which constructor was used for it (e.g. it comes from a 3rd party library), and we need to create another one of the same kind.
이것은 우리가 어떤 객체를 가지고 같은 종류의 객체를 만들고싶지만 어떤 생성자가 사용되었는지 모를때 유용합니다.(예를 들어, 제 3의 라이브러리에서 사용하는 경우)

But probably the most important thing about `"constructor"` is that...
하지만 무엇보다도 `"constructor"` 에관해 가장중요한 것은...

**...JavaScript itself does not ensure the right `"constructor"` value.**
**...자바스크립트 그자체는 `"constructor"` 값을 보장하지 않는다**는 것입니다.

Yes, it exists in the default `"prototype"` for functions, but that's all. What happens with it later -- is totally on us.
맞습니다, `"prototype"` 안에 기본값으로 존재합니다. 함수형태로요. 하지만 그게 다입니다. 나중에 어떤일이 `"constructor"`에 생길지는 전적으로 우리에게 달려있습니다.

In particular, if we replace the default prototype as a whole, then there will be no `"constructor"` in it.
특별한 경우, 만약 원형의 기본값을 전체로 대체한다면, `"constructor"` 값은 그 안에 없을 것입니다.

For instance:
예를 들어:

```js run
function Rabbit() {}
Rabbit.prototype = {
  jumps: true
};

let rabbit = new Rabbit();
*!*
alert(rabbit.constructor === Rabbit); // false
*/!*
```

So, to keep the right `"constructor"` we can choose to add/remove properties to the default `"prototype"` instead of overwriting it as a whole:
그래서, `constructor`를 유지하기 위해서는 전체를 덮어쓰기 보다는 기본값의 `"prototype"`에서 추가/제거할 속성들을 선택할 수 있습습니다. 

```js
function Rabbit() {}

// Not overwrite Rabbit.prototype totally
// just add to it
// 그냥 추가하세요.
Rabbit.prototype.jumps = true
// the default Rabbit.prototype.constructor is preserved
```

Or, alternatively, recreate the `constructor` property it manually:
혹은 다른 방법으로,  `constructor`속성을 일일이 재생성 시킬 수도 있겠죠.

```js
Rabbit.prototype = {
  jumps: true,
*!*
  constructor: Rabbit
*/!*
};

// now constructor is also correct, because we added it
```


## Summary
## 요약

In this chapter we briefly described the way of setting a `[[Prototype]]` for objects created via a constructor function. Later we'll see more advanced programming patterns that rely on it.
이번 장에서 간단하게 생정자 함수를 통해 생성된 객체의 `[[Prototype]]`을 설정하는 방법에 대하여 알아보았습니다. 나중에 이것을 바탕으로 더 고급 프로그래밍 패턴을 알아보도록하죠.

Everything is quite simple, just few notes to make things clear:
모든것이 꾀 간단하죠, 몇가지만 명확하게 알아두면됩니다.

- The `F.prototype` property is not the same as `[[Prototype]]`. The only thing `F.prototype` does: it sets `[[Prototype]]` of new objects when `new F()` is called.
- `F.prototype` 속성은 `[[prototype]]` 과 다릅니다. `F.prototype` 은 한가지만 합니다. `new F()` 가 호출됬을때 새로운 객체의 `[[Prototype]]`을 설정합니다.
- The value of `F.prototype` should be either an object or null: other values won't work.
- `F.prototype` 의 값은 객체이거나 null 입니다. 다른 값은 적용이 안됩니다..
-  The `"prototype"` property only has such a special effect when is set to a constructor function, and invoked with `new`.
- `"prototype"` 속성은 특별한 효과만 가지고있습니다. `new` 와 함께 호출 될때, 생성자 함수로 설정될때 그 효과가 일어나죠. 

On regular objects the `prototype` is nothing special:
일반적인 객체의 `prototype`은 전혀 특별하지 않죠.
```js
let user = {
  name: "John",
  prototype: "Bla-bla" // no magic at all
};
```

By default all functions have `F.prototype = { constructor: F }`, so we can get the constructor of an object by accessing its `"constructor"` property.
기본값으로 모든 함수는 `F.prototype = { constructor : F }`를 가지고 있습니다, 그래서 우리는 `"constructor"` 속성을 통해서 어떤 객체의 생성자를 얻을 수 있습니다.
