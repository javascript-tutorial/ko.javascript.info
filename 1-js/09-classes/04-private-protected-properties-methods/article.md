
# private, protected 프로퍼티와 메서드

객체 지향 프로그래밍에서 가장 중요한 원리 중 하나는 '내부 인터페이스와 외부 인터페이스를 구분 짓는 것'입니다.

내부 인터페이스와 외부 인터페이스를 구분 짓는 것은 'hello word'앱보다 더 복잡한 것을 개발한다면 필수적으로 연습되어야 합니다.

쉽게 이해하기 위해, 잠시 개발에서 벗어나 현실 세계로 눈을 돌려봅시다.

보통 우리가 사용하는 장치들은 꽤 복잡하지만 내부 인터페이스가 외부 인터페이스와 구분 지어졌기 때문에 문제없이 사용할 수 있습니다. 

## 실생활 예제

커피 머신으로 예를 들어봅시다. 외형은 심플합니다: 버튼 하나, 화면 하나, 구멍 몇 개... 물론, 결과물인 훌륭한 커피도 있습니다! :)

![](coffee.jpg)

하지만 안쪽은... (수리 매뉴얼에 있는 사진)

![](coffee-inside.jpg)

세세한 것들이 아주 많습니다. 하지만 우리는 이 세세한 것들에 대해 아무것도 몰라도 커피 머신을 사용할 수 있습니다.

커피 머신은 상당히 믿을만하지 않나요? 하나를 수 년 동안 사용할 수 있고, 고장이 난다면 수리를 받으면 됩니다.

커피 머신의 신뢰성과 단순함의 비밀은 모든 디테일들이 잘 조정되어 안쪽에 *숨겨져* 있다는 것에 있습니다.

커피 머신에서 보호 커버를 없앤다면 커피머신을 사용하는 것이 훨씬 복잡해지고 위험해질 것입니다.(어디를 눌러야 하는지 헷갈릴 것이고, 감전이 될 수도 있습니다.)

이제부터 보게 될 것처럼, 프로그래밍에서 객체란 커피 머신 같은 것입니다.

다만, 안쪽의 세세한 것들을 숨기기 위해서 보호 커버가 아니라 언어와 관습의 특별한 문법을 사용할 것입니다.

## 내부 인터페이스와 외부 인터페이스

객체 지향 프로그래밍에서 프로퍼티와 메서드는 두 그룹으로 나누어집니다.

- *내부 인터페이스* -- 메서드와 프로퍼티에 해당 클래스의 다른 메서드로부터는 접근 가능하지만, 클래스의 밖에서는 접근할 수 없습니다.
- *외부 인터페이스* -- 메서드와 프로퍼티에 클래스의 외부에서도 접근할 수 있습니다.

커피 머신으로 분석을 이어가자면 가열된 물이 지나가는 튜브, 발열 장치 등 안쪽에 숨겨진 것이 바로 내부 인터페이스입니다.

내부 인터페이스는 객체를 작동시키기 위해 사용되고 그 세부 사항들은 서로 사용됩니다. 예를 들면 가열된 물이 지나가는 튜브는 발열 장치에 부착됩니다.

그러나 커피 머신은 보호 커버에 의해 닫혀 있어서 외부로부터 아무도 내부에 접근할 수 없습니다. 세부 사항들은 숨겨져있고 접근이 불가능합니다. 우리는 외부 인터페이스를 통해서 내부의 기능을 사용할 수 있습니다.

그렇기 때문에 우리가 객체를 사용하기 위해 알아야 할 것은 외부 인터페이스입니다. 우리는 객체의 안이 어떻게 작동하는지 완전히 알지 못해도 충분합니다.

지금까지 일반적인 소개였습니다.

자바스크립트에는 아래와 같이 두 가지 타입의 객체 필드(프로퍼티와 메서드)가 있습니다. 

- public: 어디서에서든지 접근할 수 있습니다. 외부 인터페이스를 구성합니다. 지금까지 우리는 public 프로퍼티와 메서드만 사용하고 있었습니다.
- private: 클래스의 내부에서만 접근할 수 있습니다. 내부 인터페이스를 위한 것입니다.

다른 많은 언어들에는 'protected' 필드도 존재합니다. protected는 클래스의 내부와 상속하는 클래스에서만 접근할 수 있습니다(private과 비슷하지만 상속 클래스로부터의 접근 권한이 추가된 개념). 내부 인터페이스로 사용되기에 유용합니다. 우리는 보통 상속 클래스가 부모 클래스에 접근할 수 있기를 원하기 때문에 protected는 어떤 의미에서는 private보다 널리 사용된다고 말할 수 있습니다.

protected 필드는 언어 수준에서 자바스크립트에 구현되어있지 않지만 실제로 protected는 굉장히 편리하기 때문에 에뮬레이트됩니다.

이제 우리는 프로퍼티의 이 모든 타입들을 이용해 자바스크립트로 커피 머신을 만들 수 있습니다. 커피 머신에는 아주 많은 디테일이 있지만 우리는 간단히 하기 위해 완전한 모델을 만들지는 않을 것입니다.

## protected 프로퍼티

첫 번째로, 간단한 커피 머신 클래스를 만들어봅시다.

```js run
class CoffeeMachine {
  waterAmount = 0; // 안에 들어있는 물의 양

  constructor(power) {
    this.power = power;
    alert( `Created a coffee-machine, power: ${power}` );
  }

}

// 커피 머신 생성
let coffeeMachine = new CoffeeMachine(100);

// 물 추가
coffeeMachine.waterAmount = 200;
```

현재 `waterAmount`프로퍼티와 `power`프로퍼티는 public입니다. 외부에서 쉽게 그 프로퍼티를 읽거나 어느 값으로든 바꿀 수도 있습니다.

`waterAmount`프로퍼티를 protected로 바꿔서 더 통제시켜 봅시다. 아무도 이것을 0 미만으로는 설정하지 못하도록 만들어 봅시다.

**protected 프로퍼티는 대게 프로퍼티명 앞에 밑줄 `_` 을 붙입니다.**

이것은 언어 수준에서 강제적인 것은 아니지만 프로그래머들 사이에서는 외부에서 접근하면 안 되는 프로퍼티나 메서드를 표현하는 잘 알려진 관습입니다.

그러니 이제 `waterAmount`도 `_waterAmount`로 바꿉니다. 

```js run
class CoffeeMachine {
  _waterAmount = 0;

  set waterAmount(value) {
    if (value < 0) throw new Error("물의 양은 음수가 될 수 없습니다.");
    this._waterAmount = value;
  }

  get waterAmount() {
    return this._waterAmount;
  }

  constructor(power) {
    this._power = power;
  }

}

// 커피 머신 생성
let coffeeMachine = new CoffeeMachine(100);

// 물 추가
coffeeMachine.waterAmount = -10; // Error: 물의 양은 음수가 될 수 없습니다.
```

이제 접근이 더 통제적이라서 물의 양을 0 미만으로 설정하는 것은 실패하게 됩니다. 

## 읽기 전용 프로퍼티

`power` 프로퍼티를 읽기만 가능하도록 만들어봅시다. 프로퍼티를 생성 할 때만 값을 할당할 수 있고, 그 이후에는 절대 값을 수정하지 말아야 하는 경우가 종종 있는데, 이때 읽기 전용 프로퍼티를 활용할 수 있습니다.

커피 머신의 경우에는 전력이 그러한 것에 해당합니다.

읽기 전용 프로퍼티를 만들기 위해서는 setter(설정자)는 만들지 않고 getter(획득자)만 만들어야 합니다.

```js run
class CoffeeMachine {
  // ...

  constructor(power) {
    this._power = power;
  }

  get power() {
    return this._power;
  }

}

// 커피 머신 생성
let coffeeMachine = new CoffeeMachine(100);

alert(`Power is: ${coffeeMachine.power}W`); // Power is: 100W

coffeeMachine.power = 25; // Error (setter 없음)
```

````smart header="getter/setter 함수"
여기서는 getter, setter 문법을 사용했습니다.

하지만 대부분은 아래 코드와 같은 `get.../set...`형식의 함수가 선호됩니다.

```js
class CoffeeMachine {
  _waterAmount = 0;

  *!*setWaterAmount(value)*/!* {
    if (value < 0) throw new Error("물의 양은 음수가 될 수 없습니다.");
    this._waterAmount = value;
  }

  *!*getWaterAmount()*/!* {
    return this._waterAmount;
  }
}

new CoffeeMachine().setWaterAmount(100);
```

다소 길더라도 위의 방식은 다수의 인자를 수용할 수 있기 때문에 좀 더 유연하게 사용할 수 있습니다.(위의 코드에서는 다수의 인자를 사용하고 있지 않습니다.) 

위의 방식과는 달리 get/set 문법은 더 짧다는 장점이 있습니다. 정해진 엄격한 규칙은 없으므로 원하는 방식을 선택해서 사용하면 됩니다.
````

```smart header="Protected 필드는 상속됩니다."
만약 `CoffeeMachine`클래스를 상속하는 `MegaMachine`클래스를 만든다면, 이 새로운 클래스의 메서드에서 `this._waterAmount`나 `this._power`에 접근하는 것에 아무런 문제가 없을 것입니다.

그래서 protected 필드는 자연스레 상속이 가능합니다. 아래에서 보게 될 private 과는 달리 말이죠.
```

## private 프로퍼티

[recent browser=none]

표준에 등재되기 직전인 자바스크립트 제안서에서 private 프로퍼티와 메서드에 대해 언어 수준의 지원을 제공합니다.

private 프로퍼티는 '#'으로 시작합니다. 이렇게 쓰인 프로퍼티나 메서드는 오직 클래스 안에서만 접근이 가능합니다.

private 프로퍼티인 `#waterLimit`과 물을 체크하는 private 메서드인 `#checkWater`를 살펴봅시다.

```js run
class CoffeeMachine {
*!*
  #waterLimit = 200;
*/!*

*!*
  #checkWater(value) {
    if (value < 0) throw new Error("물의 양은 음수가 될 수 없습니다.");
    if (value > this.#waterLimit) throw new Error("물이 용량을 초과합니다.");
  }
*/!*

}

let coffeeMachine = new CoffeeMachine();

*!*
// 클래스 외부에서 private에 접근할 수 없음
coffeeMachine.#checkWater(); // Error
coffeeMachine.#waterLimit = 1000; // Error
*/!*
```

언어 수준에서 `#`은 private 필드를 의미하는 특별한 표시입니다. 클래스의 외부에서나 상속된 클래스로부터 접근할 수 없습니다.

private 필드는 public 필드와 상충하지 않습니다. 따라서 private 프로퍼티인 `#waterAmount`와 public 프로퍼티인 `waterAmount`를 동시에 사용할 수 있습니다.

예시로 다음과 같이 `waterAmount`가 `#waterAmount`에 접근하도록 만들어봅시다.

```js run
class CoffeeMachine {

  #waterAmount = 0;

  get waterAmount() {
    return this.#waterAmount;
  }

  set waterAmount(value) {
    if (value < 0) throw new Error("물의 양은 음수가 될 수 없습니다.");
    this.#waterAmount = value;
  }
}

let machine = new CoffeeMachine();

machine.waterAmount = 100;
alert(machine.#waterAmount); // Error
```

protected와 달리 private 필드는 언어 자체에 의해 실행됩니다. 아주 좋은 일이죠.

하지만 `CoffeeMachine` 클래스를 상속받는 클래스에서 `#waterAmount`에 직접 접근할 수는 없을 것입니다. 그래서 `waterAmount`의 getter와 setter에 의존해야 합니다.

```js
class MegaCoffeeMachine extends CoffeeMachine {
  method() {
*!*
    alert( this.#waterAmount ); // Error: can only access from CoffeeMachine
*/!*
  }
}
```

많은 상황에서 이런 제한은 너무 엄격합니다. `CoffeeMachine`을 상속했다면 `CoffeeMachine`의 내부에 접근해야 하는 정당한 이유가 있을 것입니다. 이것이 바로 protected 필드가 언어적 문법의 지원을 받지 못함에도 불구하고 더 자주 쓰이는 이유입니다. 

````warn header="Private 필드는 this[name]로 사용할 수 없습니다."
private 필드는 특별합니다.

알다시피, 보통은 아래 코드처럼 `this[name]`을 이용해서 필드에 접근할 수 있습니다.

```js
class User {
  ...
  sayHi() {
    let fieldName = "name";
    alert(`Hello, ${*!*this[fieldName]*/!*}`);
  }
}
```

하지만 private 필드에는 불가능합니다. `this['#name']`는 작동되지 않습니다. 프라이버시를 보장하기 위한 문법적 제한입니다.
````

## 요약

OOP(Object Oriented Programming, 객체 지향 프로그래밍)의 관점에서, 내부 인터페이스와 외부 인터페이스를 구분하는 것을 [캡슐화(encapsulation)]라고 합니다.

캡슐화는 다음과 같은 이점이 있습니다.

사용자들이 스스로 자신의 발등을 찍지 않도록 보호
: 커피 머신을 사용하는 개발자 팀이 있다고 상상해봅시다. "Best CoffeeMachine"이라는 회사에서 만들었고 잘 작동하지만 보호 커버가 없어져서 내부 인터페이스가 노출되었습니다.

    모든 개발자들은 문명인이라서 의도대로 커피 머신을 사용할 수 있습니다. 어느 날, 한 개발자 John이 자신이 가장 똑똑한 사람이라고 생각하면서 커피 머신 내부를 살짝 수정했습니다. 이틀 후 커피 머신이 고장 났습니다.

    그건 분명히 John의 잘못이라기보다는 보호 커버를 없애고, John이 맘대로 조작하도록 내버려 둔 사람의 잘못입니다. 

    프로그래밍에서도 같습니다. 클래스의 사용자가 외부에서 바꾸려고 하지 않은 것을 바꾼다면 결과는 예측할 수 없습니다.

지원 가능한 것
: 프로그래밍에서 일어나는 상황들이 실생활에서의 커피 머신보다 더 복잡합니다. 그저 한 번 구매하고 마는 것이 아니라 코드는 거듭해서 개발되고 개선되기 때문입니다.

    **엄격히 내부 인터페이스를 구분한다면 클래스 개발자들은 사용자에게 알리지 않고도 자유롭게 내부 프로퍼티와 메서드들을 수정할 수 있습니다.**

    만약 여러분이 그러한 클래스의 개발자라면, 어떤 외부 코드도 private 메서드에 의존하지 않기 때문에 private 메서드의 이름을 안전하게 바꿀 수 있고 매개변수를 변경하거나 없앨 수도 있다는 것을 알아 두면 됩니다.

    사용자의 입장에서는, 새로운 버전이 출시되면 내부적으로는 전면적인 정비가 이루어지더라도 외부의 인터페이스만 똑같다면 업그레이드 하는 것은 간단합니다.

복잡함을 숨기는 것
: 사람들은 심플한 것을 사용하기를 좋아합니다. 내부는 심플하지 않을지라도 최소한 외형은 말입니다.

    프로그래머들도 예외는 아닙니다.

    **구현 세부 사항이 숨겨져 있는 것은 언제나 편리하고, 간단하고 잘 문서화된 외부 인터페이스가 가능합니다.**

내부 인터페이스를 숨기기 위해서는 protected나 private 프로퍼티를 사용하세요:

- protected 필드는 `_`로 시작합니다. 이것은 언어 수준에서 강제적인 것은 아니지만 널리 알려진 관습입니다. 프로그래머는 클래스와 해당 클래스를 상속하는 클래스로부터 `_`로 시작하는 필드에만 접근해야 합니다.
- private 필드는 `#`로 시작합니다. 자바스크립트 자체적으로 `#`로 시작하는 필드에는 클래스 내부에서만 접근 가능하도록 만듭니다.

현재 private 필드는 브라우저 간에 잘 지원되지는 않지만 폴리필(polyfill)됩니다.
