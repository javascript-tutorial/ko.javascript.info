# 함수의 prototype 프로퍼티

우리는 리터럴 뿐만 아니라 `new F()`와 같은 생성자 함수로도 새로운 객체를 만들 수 있다는 걸 배운 바 있습니다.

이번 글에선 생성자 '함수'를 사용해 객체를 만든 경우에 프로토타입이 어떻게 동작하는지에 대해 알아보겠습니다. 생성자 함수로 객체를 만들었을 때 리터럴 방식과 다른점은 생성자 함수의 프로토타입이 객체인 경우에 `new` 연산자를 사용해 만든 객체는 생성자 함수의 프로토타입 정보를 사용해 [[Prototype]]을 설정한다는 것입니다.

```smart
자바스크립트가 만들어졌을 당시엔 프로토타입 기반 상속이 자바스크립트의 주요 기능 중 하나였습니다.

그런데 과거엔 프로토타입에 직접 접근할 수 있는 방법이 없었습니다. 그나마 믿고 사용할 수 있었던 방법은 이번 챕터에서 설명할 생성자 함수의 `"prototype"` 프로퍼티를 이용하는 방법뿐이었죠. 많은 스크립트가 아직 이 방법을 사용하는 이유가 여기에 있습니다.
```

생성자 함수(`F`)의 프로토타입을 의미하는 `F.prototype`에서 `"prototype"`은 `F`에 정의된 일반 프로퍼티라는 점에 주의해 글을 읽어 주시기 바랍니다. `F.prototype`에서 `"prototype"`은 바로 앞에서 배운 '프로토타입'과 비슷하게 들리겠지만 이름만 같을 뿐 실제론 다른 우리가 익히 알고있는 일반적인 프로퍼티입니다.

예시:

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

let rabbit = new Rabbit("흰 토끼"); //  rabbit.__proto__ == animal

alert( rabbit.eats ); // true
```

`Rabbit.prototype = animal`은 "`new Rabbit`을 호출해 만든 새로운 객체의 `[[Prototype]]`을 `animal`로 설정하라."는 것을 의미합니다.

그림으로 나타내면 다음과 같습니다.

![](proto-constructor-animal-rabbit.svg)

여기서 가로 화살표는 일반 프로퍼티인 `"prototype"`을, 세로 화살표는 `[[Prototype]]`을 나타냅니다. 세로 화살표는 `rabbit`이 `animal`을 상속받았다는 것을 의미합니다.

```smart header="`F.prototype`은 `new F`를 호출할 때만 사용됩니다."
`F.prototype` 프로퍼티는 `new F`를 호출할 때만 사용됩니다. `new F`를 호출할 때 만들어지는 새로운 객체의 `[[Prototype]]`을 할당해 주죠.

새로운 객체가 만들어진 후에 `F.prototype` 프로퍼티가 바뀌면(`F.prototype = <another object>`) `new F`를 호출해 만드는 또 다른 새로운 객체는 another object를 `[[Prototype]]`으로 갖게 됩니다. 다만, 기존에 있던 객체의 `[[Prototype]]`은 그대로 유지됩니다.
```

## 함수의 디폴트 프로퍼티 prototype과 constructor 프로퍼티

개발자가 특별히 할당하지 않더라도 모든 함수는 기본적으로 `"prototype"` 프로퍼티를 갖습니다.

디폴트(지정하지 않아도 자동으로 선택되는 무언가 – 옮긴이) 프로퍼티 `"prototype"`은 `constructor` 프로퍼티 하나만 있는 객체를 가리키는데, 여기서 `constructor` 프로퍼티는 함수 자신을 가리킵니다.

이 관계를 코드와 그림으로 나타내면 다음과 같습니다.

```js
function Rabbit() {}

/* 디폴트 prototype
Rabbit.prototype = { constructor: Rabbit };
*/
```

![](function-prototype-constructor.svg)

예시를 실행해 직접 확인해봅시다.

```js run
function Rabbit() {}
// 함수를 만들기만 해도 디폴트 프로퍼티인 prototype이 설정됩니다.
// Rabbit.prototype = { constructor: Rabbit }

alert( Rabbit.prototype.constructor == Rabbit ); // true
```

특별한 조작을 가하지 않았다면 `new Rabbit`을 실행해 만든 토끼 객체 모두에서 `constructor` 프로퍼티를 사용할 수 있는데, 이때 `[[Prototype]]`을 거칩니다.

```js run
function Rabbit() {}
// 디폴트 prototype:
// Rabbit.prototype = { constructor: Rabbit }

let rabbit = new Rabbit(); // {constructor: Rabbit}을 상속받음

alert(rabbit.constructor == Rabbit); // true ([[Prototype]]을 거쳐 접근함)
```

![](rabbit-prototype-constructor.svg)

`constructor` 프로퍼티는 기존에 있던 객체의 `constructor`를 사용해 새로운 객체를 만들때 사용할 수 있습니다.    

아래와 같이 말이죠.

```js run
function Rabbit(name) {
  this.name = name;
  alert(name);
}

let rabbit = new Rabbit("흰 토끼");

*!*
let rabbit2 = new rabbit.constructor("검정 토끼");
*/!*
```

이 방법은 객체가 있는데 이 객체를 만들 때 어떤 생성자가 사용되었는지 알 수 없는 경우(객체가 서드 파티 라이브러리에서 온 경우 등) 유용하게 쓸 수 있습니다.

`"constructor"`를 이야기 할 때 가장 중요한 점은

**자바스크립트는 알맞은 `"constructor"` 값을 보장하지 않는다**는 점입니다.

함수엔 기본으로 `"prototype"`이 설정된다라는 사실 그게 전부입니다. `"constructor"`와 관련해서 벌어지는 모든 일은 전적으로 개발자에게 달려있습니다.

함수에 기본으로 설정되는 `"prototype"` 프로퍼티 값을 다른 객체로 바꿔 무슨일이 일어나는지 살펴봅시다. new를 사용해 객체를 만들었지만 이 객체에 `"constructor"`가 없는 것을 확인할 수 있습니다.

예시:

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

이런 상황을 방지하고 `constructor`의 기본 성질을 제대로 활용하려면 `"prototype"`에 뭔가를 하고 싶을 때 `"prototype"` 전체를 덮어쓰지 말고 디폴트 `"prototype"`에 원하는 프로퍼티를 추가, 제거해야 합니다.

```js
function Rabbit() {}

// Rabbit.prototype 전체를 덮어쓰지 말고
// 원하는 프로퍼티가 있으면 그냥 추가합니다.
Rabbit.prototype.jumps = true
// 이렇게 하면 디폴트 프로퍼티 Rabbit.prototype.constructor가 유지됩니다.
```

실수로 `"prototype"`을 덮어썼다 하더라도 `constructor` 프로퍼티를 수동으로 다시 만들어주면 `constructor`를 다시 사용할 수 있습니다. 

```js
Rabbit.prototype = {
  jumps: true,
*!*
  constructor: Rabbit
*/!*
};

// 수동으로 constructor를 추가해 주었기 때문에 우리가 알고 있던 constructor의 특징을 그대로 사용할 수 있습니다.
```


## 요약

이번 챕터에선 생성자 함수를 이용해 만든 객체의 `[[Prototype]]`이 어떻게 설정되는지 간략히 알아보았습니다. 이 방법을 기반으로 하는 고급 프로그래밍 패턴에 대해선 추후 학습할 예정입니다. 

몇 가지 사항만 명확하게 이해하고 있으면 지금까지 배운 것들은 복잡하지 않습니다.

- 생성자 함수에 기본으로 세팅되는 프로퍼티(`F.prototype`)는 `[[Prototype]]`과 다릅니다. `F.prototype`은 `new F()`를 호출할 때 만들어지는 새로운 객체의 `[[Prototype]]`을 설정합니다.
- `F.prototype`의 값은 객체나 null만 가능합니다. 다른 값은 무시됩니다.
- 지금까지 배운 내용은 생성자 함수를 `new`를 사용해 호출할 때만 적용됩니다.

참고로 일반 객체엔 `"prototype"` 프로퍼티를 추가해도 아무런 일이 일어나지 않습니다.
```js
let user = {
  name: "John",
  prototype: "Bla-bla" // 마술은 일어나지 않습니다.
};
```

모든 함수는 기본적으로 `F.prototype = { constructor : F }`를 가지고 있으므로 `"constructor"` 프로퍼티를 사용하면 객체의 생성자를 얻을 수 있습니다.
