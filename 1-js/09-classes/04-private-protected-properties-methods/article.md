
# private, protected 프로퍼티와 메서드

객체 지향 프로그래밍에서 가장 중요한 원리 중 하나는 '내부 인터페이스와 외부 인터페이스를 구분 짓는 것'입니다.

단순히 'hello word'를 출력하는 것이 아닌 복잡한 애플리케이션을 구현하려면, 내부 인터페이스와 외부 인터페이스를 구분하는 방법을 '반드시' 알고 계셔야 합니다.

잠시 개발을 벗어나 현실 세계로 눈을 돌려, 내부 인터페이스와 외부 인터페이스 구분이 무엇을 의미하는지 알아봅시다.

일상생활에서 접하게 되는 기계들은 꽤 복잡한 구조로 되어 있습니다. 하지만 내부인터페이스와 외부 인터페이스가 구분되어있기 때문에 문제없이 기계를 사용할 수 있습니다.

## 실생활 예제

커피 머신을 예로 들어봅시다. 외형은 심플합니다. 버튼 하나, 화면 하나, 구멍 몇 개 등이 있죠. 훌륭한 커피가 결과물로 나온다는 것 또한 빼놓을 수 없겠네요! :)

![](coffee.jpg)

하지만 내부는 이렇게 생겼습니다(수리용 매뉴얼에서 가져온 사진).

![](coffee-inside.jpg)

뭔가 디테일한 것들이 아주 많네요. 하지만 이 모든 것을 알지 못해도 커피 머신을 사용하는 데 지장이 없습니다.

커피 머신은 꽤 믿음직한 기계입니다. 수년 간 사용할 수 있고, 중간에 고장이 나도 수리를 받으면 됩니다.

외형은 단순하지만 커피 머신을 신뢰할 수 있는 이유는 모든 세부 요소들이 기계 내부에 잘 정리되어 *숨겨져* 있기 때문입니다.

커피 머신에서 보호 커버를 제거하면 사용법이 훨씬 복잡해지고 위험한 상황이 생길 수 있습니다. 어디를 눌러야 할지 모르고 감전이 될 수도 있기 때문입니다.

앞으로 학습하겠지만, 프로그래밍에서 객체는 커피 머신과 같습니다.

프로그래밍에서는 보호 커버를 사용하는 대신 특별한 문법과 컨벤션을 사용해 안쪽 세부 사항을 숨긴다는 점이 다릅니다.

## 내부 인터페이스와 외부 인터페이스

객체 지향 프로그래밍에서 프로퍼티와 메서드는 두 그룹으로 분류됩니다.

- *내부 인터페이스(internal interface)* -- 동일한 클래스 내의 다른 메서드에선 접근할 수 있지만, 클래스 밖에선 접근할 수 없는 프로퍼티와 메서드
- *외부 인터페이스(external interface)* --  클래스 밖에서도 접근 가능한 프로퍼티와 메서드 

커피 머신으로 비유하자면 기계 안쪽에 숨어있는 뜨거운 물이 지나가는 관이나 발열 장치 등이 내부 인터페이스가 될 수 있습니다.

내부 인터페이스의 세부사항들은 서로의 정보를 이용하여 객체를 동작시킵니다. 발열 장치에 부착된 관을 통해 뜨거운 물이 이동하는 것처럼 말이죠.

그런데 커피 머신은 보호 커버에 둘러싸여 있기 때문에 보호 커버를 벗기지 않고는 커피머신 외부에서 내부로 접근할 수 없습니다. 밖에선 세부 요소를 알 수 없고, 접근도 불가능합니다. 내부 인터페이스의 기능은 외부 인터페이스를 통해야만 사용할 수 있습니다.

이런 특징 때문에 외부 인터페이스만 알아도 객체를 가지고 무언가를 할 수 있습니다. 객체 안이 어떻게 동작하는지 알지 못해도 괜찮다는 점은 큰 장점으로 작용합니다.

지금까진 내부 인터페이스와 외부 인터페이스의 개관에 대해 설명해 드렸습니다.

자바스크립트에는 아래와 같은 두 가지 타입의 객체 필드(프로퍼티와 메서드)가 있습니다. 

- public: 어디서든지 접근할 수 있으며 외부 인터페이스를 구성합니다. 지금까지 다룬 프로퍼티와 메서드는 모두 public입니다.
- private: 클래스 내부에서만 접근할 수 있으며 내부 인터페이스를 구성할 때 쓰입니다.

자바스크립트 이외의 다수 언어에서 클래스 자신과 자손 클래스에서만 접근을 허용하는 'protected' 필드를 지원합니다. protected 필드는 private과 비슷하지만, 자손 클래스에서도 접근이 가능하다는 점이 다릅니다. protected 필드도 내부 인터페이스를 만들 때 유용합니다. 자손 클래스의 필드에 접근해야 하는 경우가 많기 때문에, protected 필드는 private 필드보다 조금 더 광범위하게 사용됩니다.

자바스크립트는 protected 필드를 지원하지 않지만, protected를 사용하면 편리한 점이 많기 때문에 이를 모방해서 사용하는 경우가 많습니다.

이제 지금까지 배운 프로퍼티 타입을 사용해 커피머신을 만들어보겠습니다. 실제 커피 머신은 아주 복잡하지만, 여기선 간결성을 위해 간이 모델을 만들겠습니다(원한다면 구현은 가능합니다).

## 프로퍼티 보호하기

먼저, 간단한 커피 머신 클래스를 만들어보겠습니다.

```js run
class CoffeeMachine {
  waterAmount = 0; // 물통에 차 있는 물의 양

  constructor(power) {
    this.power = power;
    alert( `전력량이 ${power}인 커피머신을 만듭니다.` );
  }

}

// 커피 머신 생성
let coffeeMachine = new CoffeeMachine(100);

// 물 추가
coffeeMachine.waterAmount = 200;
```

현재 프로퍼티 `waterAmount`와 `power`는 public입니다. 손쉽게 `waterAmount`와 `power`를 읽고 원하는 값으로 변경하기 쉬운 상태이죠.

이제 `waterAmount`를 protected로 바꿔서 `waterAmount`를 통제해 보겠습니다. 예시로 `waterAmount`를 0 미만의 값으로는 설정하지 못하도록 만들어 볼 겁니다.

**protected 프로퍼티 명 앞엔 밑줄 `_`이 붙습니다.**

자바스크립트에서 강제한 사항은 아니지만, 밑줄은 프로그래머들 사이에서 외부 접근이 불가능한 프로퍼티나 메서드를 나타낼 때 씁니다.

`waterAmount`에 밑줄을 붙여 protected 프로퍼티로 만들어줍시다.

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

이제 물의 양을 0 미만으로 설정하면 실패합니다. 

## 읽기 전용 프로퍼티

`power` 프로퍼티를 읽기만 가능하도록 만들어봅시다. 프로퍼티를 생성할 때만 값을 할당할 수 있고, 그 이후에는 값을 절대 수정하지 말아야 하는 경우가 종종 있는데, 이럴 때 읽기 전용 프로퍼티를 활용할 수 있습니다.

커피 머신의 경우에는 전력이 이에 해당합니다.

읽기 전용 프로퍼티를 만들려면 setter(설정자)는 만들지 않고 getter(획득자)만 만들어야 합니다.

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

alert(``전력량이 ${power}인 커피머신을 만듭니다.W`); // 전력량이 100인 커피머신을 만듭니다.

coffeeMachine.power = 25; // TypeError (setter 없음)
```

````smart header="getter와 setter 함수"
위에서는 get, set 문법을 사용해서 getter와 setter 함수를 만들었습니다.

하지만 대부분은 아래와 같이 `get.../set...` 형식의 함수가 선호됩니다.

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

다소 길어보이긴 하지만, 이렇게 함수를 선언하면 다수의 인자를 받을 수 있기 때문에 좀 더 유연합니다(위 예시에선 인자가 하나뿐이긴 하지만요). 

반면 get, set 문법을 사용하면 코드가 짧아진다는 장점이 있습니다. 어떤걸 사용해야 한다는 규칙은 없으므로 원하는 방식을 선택해서 사용하세요.
````

```smart header="protected 필드는 상속됩니다."
`class MegaMachine extends CoffeeMachine`로 클래스를 상속받으면, 새로운 클래스의 메서드에서 `this._waterAmount`나 `this._power`를 사용해 프로퍼티에 접근할 수 있습니다.

이렇게 protected 필드는 아래에서 보게 될 private 필드와 달리, 자연스러운 상속이 가능합니다.
```

## private 프로퍼티

[recent browser=none]

private 프로퍼티와 메서드는 제안(proposal) 목록에 등재된 문법으로, 명세서에 등재되기 직전 상태입니다.

private 프로퍼티와 메서드는 `#`으로 시작합니다. `#`이 붙으면 클래스 안에서만 접근할 수 있습니다.

물 용량 한도를 나타내는 private 프로퍼티 `#waterLimit`과 남아있는 물의 양을 확인해주는 private 메서드 `#checkWater`를 구현해봅시다.

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

`#`은 자바스크립트에서 지원하는 문법으로, private 필드를 의미합니다. private 필드는 클래스 외부나 자손 클래스에서 접근할 수 없습니다.

private 필드는 public 필드와 상충하지 않습니다. private 프로퍼티 `#waterAmount`와 public 프로퍼티 `waterAmount`를 동시에 가질 수 있습니다.

`#waterAmount`의 접근자 `waterAmount`를 만들어봅시다.

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

protected 필드와 달리, private 필드는 언어 자체에 의해 강제된다는 점이 장점입니다.

그런데 `CoffeeMachine`을 상속받는 클래스에선 `#waterAmount`에 직접 접근할 수 없습니다. `#waterAmount`에 접근하려면 `waterAmount`의 getter와 setter를 통해야 합니다.

```js
class MegaCoffeeMachine extends CoffeeMachine {
  method() {
*!*
    alert( this.#waterAmount ); // Error: CoffeeMachine을 통해서만 접근할 수 있습니다.
*/!*
  }
}
```

다양한 시나리오에서 이런 제약사항은 너무 엄격합니다. `CoffeeMachine`을 상속받는 클래스에선 `CoffeeMachine`의 내부에 접근해야 하는 정당한 사유가 있을 수 있기 때문이죠. 언어 차원에서 protected 필드를 지원하지 않아도 더 자주 쓰이는 이유가 바로 여기에 있습니다.

````warn header="private 필드는 this[name]로 사용할 수 없습니다."
private 필드는 특별합니다.

알다시피, 보통은 `this[name]`을 사용해 필드에 접근할 수 있습니다.

```js
class User {
  ...
  sayHi() {
    let fieldName = "name";
    alert(`Hello, ${*!*this[fieldName]*/!*}`);
  }
}
```

하지만 private 필드는 `this[name]`으로 접근할 수 없습니다. 이런 문법적 제약은 필드의 보안을 강화하기 위해 만들어졌습니다.
````

## 요약

객체 지향 프로그래밍에선 내부 인터페이스와 외부 인터페이스를 구분하는 것을 [캡슐화(encapsulation)]라는 용어를 사용해 설명합니다.

캡슐화는 이점은 다음과 같습니다.

사용자가 자신의 발등을 찍지 않도록 보호
: 커피 머신를 함께 사용하는 개발팀이 있다고 상상해봅시다. "Best CoffeeMachine"이라는 회사에서 만든 이 커피 머신은 현재 잘 작동하고 있지만, 보호 커버가 없어서 내부 인터페이스가 노출되어있는 상황입니다.

    교양있는 팀원들은 모두 설계 의도에 맞게 커피 머신을 사용합니다. 그런데 어느 날 John이라는 개발자가 자신의 능력을 과신하며 커피 머신 내부를 살짝 만지게 됩니다. 이틀 후, 커피 머신은 고장이 나버렸죠.

    커피 머신이 고장 난 건 John의 잘못이라기보다는, 보호 커버를 없애고 John이 마음대로 조작하도록 내버려 둔 사람의 잘못입니다.

    프로그래밍에서도 마찬가지입니다. 외부에서 의도치 않게 클래스를 조작하게 되면 그 결과는 예측할 수 없게 됩니다.

지원 가능
: 실제 개발 과정에서 일어나는 상황은 커피 머신 사례보다 훨씬 복잡합니다. 커피 머신은 한번 구매하면 끝이지만 실제 코드는 유지보수가 끊임없이 일어나기 때문입니다.

    **내부 인터페이스를 엄격하게 구분하면, 클래스 개발자들은 사용자에게 알리지 않고도 자유롭게 내부 프로퍼티와 메서드들을 수정할 수 있습니다.**

    내부 인터페이스가 엄격히 구분된 클래스를 만지고 있다면, 그 어떤 외부 코드도 내부 private 메서드에 의존하고 있지 않기 때문에 private 메서드의 이름을 안전하게 바꿀 수 있고, 매개변수를 변경하거나 없앨 수도 있다는 것을 알아 두면 됩니다.

    사용자 입장에선 새로운 버전이 출시되면서 내부 정비가 전면적으로 이뤄졌더라도 외부 인터페이스만 똑같다면 업그레이드가 용이하다는 장점이 있습니다.

복잡성 은닉
: 사람들은 간단한 것을 좋아합니다. 내부는 간단치 않더라도 최소한 외형은 간단해야 하죠.

    프로그래머들도 예외는 아닙니다.

    **구현 세부 사항이 숨겨져 있으면 간단하고 편리해집니다. 외부 인터페이스에 대한 설명도 문서화하기 쉬워지죠.**

내부 인터페이스를 숨기려면 protected나 private 프로퍼티를 사용하면 됩니다.

- protected 필드는 `_`로 시작합니다. `_`은 자바스크립트에서 지원하는 문법은 아니지만, protected 필드를 나타낼 때 관습처럼 사용됩니다. 개발자는 protected 프로퍼티가 정의된 클래스와 해당 클래스를 상속받는 클래스에서만 `_`가 붙은 필드에 접근해야 합니다.
- private 필드는 `#`로 시작하며, 자바스크립트에서 지원하는 문법입니다. `#`로 시작하는 필드는 해당 필드가 정의된 클래스 내부에서만 접근 가능합니다.

모든 브라우저에서 private 필드를 지원하진 않지만 폴리필을 구현하여 사용할 수 있습니다.
