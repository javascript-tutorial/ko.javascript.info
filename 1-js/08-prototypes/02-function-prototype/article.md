# F.prototype

Remember, new objects can be created with a constructor function, like `new F()`.

If `F.prototype` is an object, then `new` operator uses it to set `[[Prototype]]` for the new object.

```smart
JavaScript had prototypal inheritance from the beginning. It was one of the core features of the language.

But in the old times, there was no direct access to it. The only thing that worked reliably was a `"prototype"` property of the constructor function, described in this chapter. So there are many scripts that still use it.
```

`F.prototype`은 여기서 `F`안에 `"prototype"`이라는 일반적인 프로퍼티임을 알아두세요. "원형"이라는 용어랑 비슷하게 들리겠지만, 여기서 진정으로 말하고자 하는 것은 이 이름으로 쓰이는 일반적인 프로퍼티입니다.

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

`Rabbit.prototype = animal`을 설정하는 것은 말 그대로 다음을 뜻합니다. "`new Rabbit`이 생성되었을 때, 이것의 `[[Prototype]]`을 `animal`로 할당하라"

이게 결과 화면입니다.

![](proto-constructor-animal-rabbit.svg)

위 그림에서 가로 화살표는 일반 프로퍼티인 `"prototype"`, 세로 화살표는 `[[Prototype]]`을 나타냅니다. 세로 화살표는 `rabbit`이 `animal`로 부터 상속받았다는 것을 의미합니다.

```smart header="`F.prototype` only used at `new F` time"
`F.prototype` property is only used when `new F` is called, it assigns `[[Prototype]]` of the new object. After that, there's no connection between `F.prototype` and the new object. Think of it as a "one-time gift".

If, after the creation, `F.prototype` property changes (`F.prototype = <another object>`), then new objects created by `new F` will have another object as `[[Prototype]]`, but already existing objects keep the old one.
```

## 기본 F.prototype, 생성자 프로퍼티

우리가 제공하지 않더라도 모든 함수는 "prototype" 프로퍼티를 갖습니다.  

기본 `"prototype"`은 단 하나의 프로퍼티 `constructor`을 갖습니다. 이 프로퍼티는 함수 자기 자신을 가리킵니다.  

이렇게 말이죠:

```js
function Rabbit() {}

/* default prototype
Rabbit.prototype = { constructor: Rabbit };
*/
```

![](function-prototype-constructor.svg)

다음과 같이 이것을 확인할 수 있습니다.

```js run
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

alert( Rabbit.prototype.constructor == Rabbit ); // true
```

자연적으로, 만약 아무것도 하지 않는다면, `constructor` 프로퍼티는 모든 rabbit에서 `[[Prototype]]`을 통해 접근 가능합니다.

```js run
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

let rabbit = new Rabbit(); // inherits from {constructor: Rabbit}

alert(rabbit.constructor == Rabbit); // true (from prototype)
```

![](rabbit-prototype-constructor.svg)

우리는 이미 존재하는 것과 동일한 `constructor` 프로퍼티를 이용해서 새로운 객체를 만들 수 있습니다. 

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

이것은 우리가 어떤 객체를 가지고 같은 종류의 객체를 만들고 싶지만 어떤 생성자가 사용되었는지 모를 때 유용합니다.(예를 들어, 제3의 라이브러리에서 사용하는 경우)

하지만 무엇보다도 `"constructor"`에 관해 가장 중요한 것은...

**...자바스크립트 자체는 `"constructor"` 값을 보장하지 않는다**는 것입니다.

맞습니다, `"prototype"` 안에 기본값으로 존재합니다. 함수 형태로요. 하지만 그게 다입니다. 나중에 어떤 일이 `"constructor"`에 생길지는 전적으로 우리에게 달려있습니다.

특별한 경우, 만약 원형의 기본값을 전체로 대체한다면, `"constructor"` 값은 그 안에 없을 것입니다.

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

그래서, `constructor`를 유지하기 위해서는 전체를 덮어쓰기보다는 기본값의 `"prototype"`에서 추가/제거할 프로퍼티를 선택할 수 있습니다. 

```js
function Rabbit() {}

// Not overwrite Rabbit.prototype totally
// 그냥 추가하세요.
Rabbit.prototype.jumps = true
// the default Rabbit.prototype.constructor is preserved
```

혹은 다른 방법으로,  `constructor`프로퍼티를 일일이 재생성시킬 수도 있겠죠.

```js
Rabbit.prototype = {
  jumps: true,
*!*
  constructor: Rabbit
*/!*
};

// now constructor is also correct, because we added it
```


## 요약

이번 주제에서 간단하게 생성자 함수를 통해 생성된 객체의 `[[Prototype]]`을 설정하는 방법에 대하여 알아보았습니다. 나중에 이것을 바탕으로 더 고급 프로그래밍 패턴을 알아보도록 하죠.

모든 것이 간단하죠, 몇 가지만 명확하게 알아두면 됩니다.

- `F.prototype` 프로퍼티는 `[[prototype]]`과 다릅니다. `F.prototype` 은 `new F()` 가 호출됐을 때 새로운 객체의 `[[Prototype]]`을 설정하는 일 한 가지만 합니다.
- `F.prototype` 의 값은 객체이거나 null입니다. 다른 값은 적용이 안 됩니다.
- `"prototype"` 프로퍼티는 특별한 효과만 가지고 있습니다. `new` 와 함께 호출될 때, 생성자 함수로 설정될 때 그 효과가 일어나죠. 

일반적인 객체의 `prototype`은 전혀 특별하지 않죠.
```js
let user = {
  name: "John",
  prototype: "Bla-bla" // no magic at all
};
```

기본값으로 모든 함수는 `F.prototype = { constructor : F }`를 가지고 있습니다, 그래서 우리는 `"constructor"` 프로퍼티를 통해서 어떤 객체의 생성자를 얻을 수 있습니다.
