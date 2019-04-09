
# Closure

자바 스크립트는 매우 기능 지향적 인 언어입니다. 그것은 우리에게 많은 자유를줍니다. 한 순간에 함수를 생성 한 다음 다른 변수에 복사하거나 다른 함수에 인수로 전달할 수 있으며 나중에 완전히 다른 곳에서 호출 할 수 있습니다.

우리는 함수가 그것 외부의 변수에 접근 할 수 있다는 것을 압니다. 이 기능은 꽤 자주 사용됩니다.

그러나 외부 변수가 변경되면 어떻게됩니까? 함수가 가장 최근의 값이나 함수가 생성되었을 때 존재했던 값을 가져 옵니까?

또한 함수가 코드의 다른 위치로 이동하여 거기에서 호출되면 어떤 일이 발생합니다 - 새 장소의 외부 변수에 액세스 할 수 있습니까?

다른 언어는 여기에서 다르게 동작하며,이 장에서는 JavaScript의 동작을 다룹니다.

## 몇 가지 질문

두 가지 상황을 먼저 고려한 다음, 내부 역학을 한 조각 씩 공부하여 향후에 다음 질문과 더 복잡한 질문에 답할 수있게하십시오.

1. 함수`sayHi`는 외부 변수`name`을 사용합니다. 함수가 실행되면 어떤 값을 사용할 것입니까?

    ```js
    let name = "John";

    function sayHi() {
      alert("Hi, " + name);
    }

    name = "Pete";

    *!*
    sayHi(); // what will it show: "John" or "Pete"?
    */!*
    ```

   이러한 상황은 브라우저 및 서버 측 개발 모두에서 공통적입니다. 함수는 예를 들어 사용자 조치 또는 네트워크 요청 후 작성된 것보다 나중에 실행되도록 스케줄 될 수 있습니다.
   
   그래서 질문은 : 그것은 최신 변경 사항을 선택합니까?


2. 함수`makeWorker`는 다른 함수를 만들어서 그것을 반환합니다. 그 새로운 기능은 다른 곳에서 호출 할 수 있습니다. 외부 변수에 대한 액세스 권한을 생성 위치 또는 호출 위치에서 또는 둘 다 사용할 수 있습니까?

    ```js
    function makeWorker() {
      let name = "Pete";

      return function() {
        alert(name);
      };
    }

    let name = "John";

    // create a function
    let work = makeWorker();

    // call it
    *!*
    work(); // 무엇을보여 줄까요? "Pete" (생성된이름) or "John" (불려진이름)?
    */!*
    ```


## 어휘 환경

무슨 일이 벌어지고 있는지 이해하려면 먼저 "변수"가 실제로 무엇인지 논의 해 봅시다.

자바 스크립트에서 실행중인 모든 함수, 코드 블록 및 스크립트에는 *Lexical Environment* 라는 알려진 객체가 있습니다.

어휘 환경 객체는 두 부분으로 구성됩니다.

1. *환경 레코드* - 모든 로컬 변수를 속성으로 가진 객체 (그리고 `this` 값과 같은 다른 정보).
*외부 어휘 환경* 에 대한 참조. 일반적으로 바깥 쪽의 어휘 적으로 바뀐 코드와 연관되어 있습니다 (현재 중괄호 바깥 쪽).

**따라서 "변수"는 특별한 내부 개체 인 환경 레코드의 속성 일뿐입니다. "변수를 가져 오거나 변경하려면" "해당 객체의 속성을 가져 오거나 변경하려면"을 의미합니다.**

예를 들어,이 간단한 코드에는 하나의 어휘 환경 만 있습니다.

![lexical environment](lexical-environment-global.png)

This is a so-called global Lexical Environment, associated with the whole script. For browsers, all `<script>` tags share the same global environment.

On the picture above, the rectangle means Environment Record (variable store) and the arrow means the outer reference. The global Lexical Environment has no outer reference, so it points to `null`.

Here's the bigger picture of how `let` variables work:

![lexical environment](lexical-environment-global-2.png)

오른쪽에있는 사각형은 실행 중 전역 어휘 환경이 어떻게 변경되는지 보여줍니다.

1. 스크립트가 시작되면 어휘 환경이 비어 있습니다.
2. `let phrase` 정의가 나타납니다. 값이 할당되지 않았으므로`undefined`가 저장됩니다.
3. `phrase`에는 값이 할당됩니다.
4. `phrase`는 새로운 가치를 의미합니다.

이제는 모든 것이 단순 해 보입니다.

요약:

- 변수는 현재 실행중인 블록 / 함수 / 스크립트와 연관된 특수 내부 오브젝트의 특성입니다.
- 변수로 작업하는 것은 실제로 해당 객체의 속성을 사용하여 작업합니다.

### Function Declaration

지금까지는 변수 만 관찰했습니다. 이제 Function Declarations를 입력하십시오.

**`let` 변수와는 달리, 그것들은 실행이 끝날 때가 아니라 초기에 어휘 환경이 생성 될 때 완전히 초기화됩니다.**

최상위 함수의 경우 스크립트가 시작되는 순간을 의미합니다.

그래서 정의되기 전에 함수 선언을 호출 할 수 있습니다.

아래의 코드는 어휘 환경이 처음부터 비어 있지 않음을 보여줍니다. 그것이 기능 선언이기 때문에 `say` 를 가지고 있습니다. 그리고 나중에 `let`으로 선언 한 `phrase`를 얻습니다 :

![lexical environment](lexical-environment-global-3.png)


### Inner and outer Lexical Environment

이제 함수가 외부 변수에 액세스 할 때 어떤 일이 일어나는지 살펴 보겠습니다.

호출하는 동안 `say()`는 외부 변수인 `phrase`를 사용합니다. 무슨 일이 일어나고 있는지 자세히 보겠습니다.

첫째, 함수가 실행될 때 새로운 함수 어휘 환경이 자동으로 생성됩니다. 그것은 모든 기능에 대한 일반적인 규칙입니다. 해당 어휘 환경은 호출의 로컬 변수와 매개변수를 저장하는 데 사용됩니다.

예를 들어, `say ( "John")`의 경우, 다음과 같이 보입니다 (실행은 라인에 있고, 화살표로 표시되어 있습니다) :

<!--
    ```js
    let phrase = "Hello";

    function say(name) {
     alert( `${phrase}, ${name}` );
    }

    say("John"); // Hello, John
    ```-->

![lexical environment](lexical-environment-simple.png)

그래서, 함수 호출 중에 우리는 두개의 어휘 환경을 가지고 있습니다 : 내부 호출 (함수 호출 용)과 외부 호출 (전역 호출) :

- 내부 어휘 환경은 `say` 의 현재 실행에 해당합니다.

    그것은 하나의 변수를 가지고있다 : `name`, 함수 인자. 우리는 `say ( "John")`을 호출했기 때문에 `name`의 값은 `"John"` 입니다.
- 외부 어휘 환경은 글로벌 어휘 환경입니다.

    그것은`phrase`와 함수 자체를 가지고 있습니다.

내부 어휘 환경은 외부 어휘 환경에 대한 참조를가집니다.

**코드가 변수에 액세스하려고 할 때 - 내부 어휘 환경이 먼저 검색된 다음 바깥 쪽 어휘 환경이 검색되고 그런 다음 바깥 쪽 어휘 환경이 검색되고 체인의 끝까지 바깥 쪽 어휘 환경이 검색됩니다.**

변수가 어디에도없는 경우 엄격 모드에서 오류가 발생합니다. `use strict`가 없으면, 정의되지 않은 변수에 대입하면 하위 호환성을 위해 새로운 전역 변수가 생성됩니다.

예제에서 검색이 어떻게 진행되는지 살펴 보겠습니다.

-`say` 내부의`alert`가`name`에 접근하려고 할 때, 그것은 어휘 환경 함수에서 즉시 발견합니다.
-`phrase`에 접근하기를 원할 때,`phrase`는 지역적으로 없기 때문에, 둘러싼 어휘 환경에 대한 참조를 따라 그것을 발견합니다.

![lexical environment lookup](lexical-environment-simple-lookup.png)

이제 우리는이 장의 시작 부분에서 첫 번째 질문에 대한 답을 줄 수 있습니다.

**함수는 지금처럼 외부 변수를 얻습니다. 가장 최근 값을 사용합니다.**

이것은 설명 된 메커니즘 때문입니다. 이전 변수 값은 아무 곳에도 저장되지 않습니다. 함수가 그것들을 원할 때, 그것은 자신이나 바깥 어휘 환경으로부터 현재 값을 취한다.

첫 번째 질문에 대한 정답은 `Pete`입니다.

```js run
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete"; // (*)

*!*
sayHi(); // Pete
*/!*
```


위 코드의 실행 흐름 :

1. 글로벌 어휘 환경은`name : "John"을 가진다.`
2. `(*)`행에서 전역 변수가 변경되었습니다. 이제는 `name : "Pete"`가 있습니다.
3. 함수 `sayHi()`가 실행될 때 외부에서`name`을 취합니다. 이것은 이미 `"Pete"`인 글로벌 어휘 환경에서 온 것입니다.

```smart header="한개의 실행 -- 한개의 어휘 환경"
함수가 실행될 때마다 새 함수 어휘 환경이 만들어집니다.

그리고 함수가 여러 번 호출되면, 각 호출은 바로 실행을위한 로컬 변수와 매개변수가있는 자체 어휘 환경을 갖게됩니다.
```

```smart header="어휘 환경은 명세 객체이다."
"어휘 환경"은 명세 객체입니다. 코드에서이 객체를 가져 와서 직접 조작 할 수는 없습니다. 자바 스크립트 엔진은 메모리를 최적화하고 메모리를 저장하지 않고 다른 내부 트릭을 수행하는 변수를 무시할 수 있지만 보이는 동작은 설명 된대로 이루어져야합니다.
```


## Nested functions

함수가 다른 함수 내부에서 작성되면 "내포된" 함수라고합니다.

자바 스크립트로 이것을 쉽게 할 수 있습니다.

다음과 같이 코드를 구성하는 데 사용할 수 있습니다.

```js
function sayHiBye(firstName, lastName) {

  // helper nested function to use below
  function getFullName() {
    return firstName + " " + lastName;
  }

  alert( "Hello, " + getFullName() );
  alert( "Bye, " + getFullName() );

}
```

여기서 *중첩* 함수 인 `getFullName()`은 편의상 만들어졌습니다. 외부 변수에 액세스 할 수 있으므로 전체 이름을 반환 할 수 있습니다. 중첩 된 함수는 Javascript에서 매우 일반적입니다.

더 흥미로운 점은 중첩 된 함수가 반환 될 수 있다는 것입니다 : 외부 객체의 속성 (외부 함수가 메서드를 사용하여 객체를 만드는 경우) 또는 그 자체로 결과입니다. 그런 다음 다른 곳에서 사용할 수 있습니다. 어디에 있더라도, 그것은 여전히 동일한 외부 변수에 액세스 할 수 있습니다.

예를 들어, 여기에서 중첩된 함수는 [생성자 함수](info:constructor-new)로 부터 새 객체로 부여됩니다.  

```js run
// constructor function returns a new object
function User(name) {

  // the object method is created as a nested function
  this.sayHi = function() {
    alert(name);
  };
}

let user = new User("John");
user.sayHi(); // the method "sayHi" code has access to the outer "name"
```

그리고 여기에서는 "counting" 함수를 만들고 반환합니다.

```js run
function makeCounter() {
  let count = 0;

  return function() {
    return count++; // has access to the outer counter
  };
}

let counter = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1
alert( counter() ); // 2
```

`makeCounter` 예제를 보겠습니다. 각 호출에서 다음 x 호를 리턴하는 "카운터"기능을 작성합니다. 단순함에도 불구하고 약간 수정 된 코드의 변종은 실용적인 용도로 사용됩니다 (예 : [의사 난수 생성기](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) 등).

카운터는 내부적으로 어떻게 작동합니까?

내부 함수가 실행될 때 `count ++`에있는 변수가 내부에서 검색됩니다. 위의 예에서 순서는 다음과 같습니다.

![](lexical-search-order.png)

1. 중첩 된 함수의 지역 주민 ...
2. 외부 함수의 변수들 ...
3. 전역 변수에 도달 할 때까지 계속합니다.

이 예제에서`count`는 단계`2`에서 발견됩니다. 외부 변수가 수정되면 발견 된 위치가 변경됩니다. 따라서 `count ++` 는 외부 변수를 찾아 속해있는 어휘 환경에서 증가시킵니다. `let count = 1`을했을 때처럼.

고려해야 할 두 가지 질문은 다음과 같습니다.

1. makeCounter에 속하지 않는 코드에서 카운터 count를 리셋 할 수 있습니까? 예 : 위의 예제에서 `alert` 호출 후.
2. makeCounter()를 여러 번 호출하면 많은 카운터 함수를 반환합니다. 그들은 독립적입니까? 아니면 같은 '카운트'를 공유합니까?

계속 읽기 전에 대답 해보십시오.

...

완료했나요?

좋습니다. 답을 살펴 보겠습니다.

1. 방법은 없습니다 : `count`는 지역 함수 변수입니다. 외부에서 접근 할 수 없습니다.
2.`makeCounter()`를 호출 할 때마다 새로운 함수 인 Lexical Environment가 생성되고, 그것의 자신의 `count`가 사용됩니다. 결과적으로`counter '함수는 독립적입니다.

다음과 같습니다.

```js run
function makeCounter() {
  let count = 0;
  return function() {
    return count++;
  };
}

let counter1 = makeCounter();
let counter2 = makeCounter();

alert( counter1() ); // 0
alert( counter1() ); // 1

alert( counter2() ); // 0 (independent)
```


다행히, 외부 변수를 가진 상황은 이제 당신에게 분명합니다. 그러나보다 복잡한 상황에서는 내부에 대한 깊은 이해가 필요할 수 있습니다. 그럼 좀 더 깊이 들어가 봅시다.

## Environments in detail

클로저가 일반적으로 작동하는 방식을 이해 했으므로 이제는 매우 유용합니다.

`makeCounter` 예제에서 단계별로 진행되는 작업은 매우 자세하게 알 수 있도록 진행하십시오.

`[[Environment]]`속성에 대해서는 여기에서 다루고 있습니다. 전에 간단히 언급하지 않았습니다.

1. 스크립트가 막 시작하면 전역 어휘 환경 만 존재합니다.

    ![](lexenv-nested-makecounter-1.png)

   그 시작 순간에는 함수 선언이기 때문에 `makeCounter` 함수 만 있습니다. 그것은 아직 달리지 않았습니다.
   
   **"출생시"모든 함수는 생성물의 어휘 환경에 대한 참조로 숨겨진 속성을받습니다** 우리는 아직 그것에 대해 이야기하지는 않았지만, 그것이 함수의 위치를 알고있는 방법입니다 만든.
   
    여기서 `makeCounter`는 전역 어휘 환경에서 생성되므로 `[[Environment]]`는 그 어휘를 참조합니다.
   
    즉, 함수가 태어난 어휘 환경에 대한 참조로 "각인"됩니다. 그리고 `[[Environment]]`는 그 참조를 가진 숨겨진 함수 속성입니다.

2. 코드가 실행되면 새로운 전역 변수`counter`가 선언되고`makeCounter ()`가 호출됩니다. 다음은 실행이`makeCounter ()`의 첫 행에있는 순간의 스냅 샷입니다.:

    ![](lexenv-nested-makecounter-2.png)

    `makeCounter ()`호출의 순간에, 변수와 인수를 저장하기 위해 어휘 환경이 생성된다.
    
     모든 어휘 환경과 마찬가지로 두 가지를 저장합니다.
         
     1. 지역 변수가있는 환경 레코드. 이런 경우`count`만이 유일한 로컬 변수입니다 (`let count '가 실행될 때 나타납니다).
     2. 외부 어휘 참조. 함수의`[[Environment]]`로 설정됩니다. 여기`makeCounter`의 `[[Environment]]`는 전역 어휘 환경을 참조합니다.
    
     이제 우리는 두개의 어휘 환경을 가지고 있습니다 : 첫 번째 것은 글로벌이고, 두 번째는 현재의 makeCounter 호출을위한 것이며, 외부 참조는 global입니다.

3. During the execution of `makeCounter()`, a tiny nested function is created.

    It doesn't matter whether the function is created using Function Declaration or Function Expression. All functions get the `[[Environment]]` property that references the Lexical Environment in which they were made. So our new tiny nested function gets it as well.

    For our new nested function the value of `[[Environment]]` is the current Lexical Environment of `makeCounter()` (where it was born):

    ![](lexenv-nested-makecounter-3.png)

    이 단계에서 내부 함수가 생성되었지만 아직 호출되지 않았다는 점에 유의하십시오. `function () {return count ++; }`이 (가) 실행되고 있지 않습니다. 우리는 곧 그것을 돌려 보낼 것입니다.

4. As the execution goes on, the call to `makeCounter()` finishes, and the result (the tiny nested function) is assigned to the global variable `counter`:

    ![](lexenv-nested-makecounter-4.png)

    That function has only one line: `return count++`, that will be executed when we run it.

5. When the `counter()` is called, an "empty" Lexical Environment is created for it. It has no local variables by itself. But the `[[Environment]]` of `counter` is used as the outer reference for it, so it has access to the variables of the former `makeCounter()` call where it was created:

    ![](lexenv-nested-makecounter-5.png)

   이제 변수에 접근하면, 먼저 자신의 어휘 환경 (empty)을 찾은 다음, 이전의`makeCounter ()`호출 어휘 환경을 찾은 다음 글로벌 어휘 환경을 검색합니다.
   
    `count`를 찾을 때, 그것은 가장 가까운 외부 어휘 환경에서`makeCounter` 변수들 중에서 그것을 찾습니다.
   
    여기서 메모리 관리가 어떻게 작동하는지 확인하십시오. `makeCounter ()`호출은 얼마 전에 끝났지 만, 어휘 환경은 그것을 참조하는 `[[Environment]]`와 함께 중첩 된 함수가 있기 때문에 메모리에 남아있게됩니다.
   
    일반적으로, 어휘 환경 객체는 그것을 사용할 수있는 함수가있는 한 계속 존재합니다. 남은 것이 없을 때만 지워집니다.

6. The call to `counter()` not only returns the value of `count`, but also increases it. Note that the modification is done "in place". The value of `count` is modified exactly in the environment where it was found.

    ![](lexenv-nested-makecounter-6.png)

   그래서 우리는 유일한 변화, 즉`count`의 새로운 값으로 이전 단계로 돌아갑니다. 다음 호출은 모두 동일합니다.

7. Next `counter()` invocations do the same.

이 장의 처음부터 두 번째 질문에 대한 답은 이제 분명해진다.

아래 코드의`work ()`함수는 원래의 장소에서 외부 어휘 환경 참조를 통해`name`을 사용합니다 :

![](lexenv-nested-work.png)

결과는 ``Pete``입니다.

그러나 makeWorker()에 `let name` 이 없다면 위의 체인에서 볼 수 있듯이 전역 변수를 검색하고 외부 변수로 가져옵니다. 이 경우에는 `"John"` 이됩니다.

```smart header="클로져"
일반적으로 개발자가 알아야하는 일반적인 프로그래밍 용어 인 "클로져 (closure)"가 있습니다.

A [closure](https://en.wikipedia.org/wiki/Closure_(computer_programming)) 는 외부 변수를 기억하고 액세스 할 수있는 함수입니다. 일부 언어에서는 불가능하거나 기능을 특수하게 작성하여이를 가능하게해야합니다. 위에서 설명한 것처럼 JavaScript에서는 모든 함수가 자연스럽게 닫힙니다. 
(적용될 하나의 예외가있습니다 <info:new-function>).

그것은: 그들은 숨겨진`[[Environment]]`속성을 사용하여 그들이 생성 된 곳을 자동으로 기억하고, 모두가 외부 변수에 접근 할 수 있습니다.

인터뷰에서 프론트 엔드 개발자가 "클로저가 무엇입니까?"라는 질문을받는 경우, 유효한 대답은 클로저의 정의와 JavaScript의 모든 기능이 클로저이고 기술적 세부 사항에 대한 몇 가지 단어 일 수 있습니다. `[[Environment]]`속성과 어휘 환경이 작동하는 방법.
```

## Code blocks and loops, IIFE

위의 예는 기능에 집중되어 있습니다. 그러나 어휘 환경은 모든 코드 블록 `{...}`에 존재합니다.

어휘 환경은 코드 블록이 실행될 때 만들어지며 블록 로컬 변수를 포함합니다. 몇 가지 예가 있습니다.

### If

아래 예제에서 `user` 변수는 `if` 블록에만 존재합니다 :

<!--
    ```js run
    let phrase = "Hello";

    if (true) {
        let user = "John";

        alert(`${phrase}, ${user}`); // Hello, John
    }

    alert(user); // Error, can't see such variable!
    ```-->

![](lexenv-if.png)

실행이 `if` 블록에 도착하면 새로운 "if-only"어휘 환경이 생성됩니다.

바깥 쪽을 참조하기 때문에 `phrase` 를 찾을 수 있습니다. 그러나 `if` 안에 선언 된 모든 변수와 함수 표현식은 어휘 환경에 있으며 외부에서 볼 수 없습니다.

예를 들어 `if`가 끝나면 아래의 `alert`는`user`를 볼 수 없으므로 오류가 발생합니다.

### For, while

루프의 경우 모든 반복에는 별도의 어휘 환경이 있습니다. 변수가`for`에서 선언된다면, 또한 어휘 환경에 국한됩니다 :

```js run
for (let i = 0; i < 10; i++) {
  // Each loop has its own Lexical Environment
  // {i: value}
}

alert(i); // Error, no such variable
```

참고하자 : `let i`는 `{...}` 의 시각적 외부입니다. `for` 구조체는 다소 특별합니다 : 루프의 각 반복에는 현재의 `i`가있는 자체 어휘 환경이 있습니다.

다시,`if`와 유사하게, 루프 `i` 이후는 보이지 않습니다.

### Code blocks

우리는 또한 "bare"코드 블록 `{...}`을 사용하여 변수를 "로컬 범위"로 분리 할 수 있습니다.

예를 들어, 웹 브라우저에서 모든 스크립트는 동일한 전역 영역을 공유합니다. 따라서 한 스크립트에 전역 변수를 만들면 다른 변수에서도 사용할 수있게됩니다. 그러나 두 스크립트가 동일한 변수 이름을 사용하고 서로 겹쳐 쓰면 충돌 소스가됩니다.

변수 이름이 널리 퍼져 있고 스크립트 작성자가 서로를 알지 못하는 경우 이러한 일이 발생할 수 있습니다.

이를 피하려면 코드 블록을 사용하여 전체 스크립트 또는 스크립트의 일부를 격리 할 수 있습니다.

```js run
{
  // 바깥에서 보지 말아야 할 지역 변수를 가지고 일을해라

  let message = "Hello";

  alert(message); // Hello
}

alert(message); // Error: 메세지는 정의되지 않았음
```

블록 외부의 코드 (또는 다른 스크립트 내부)는 블록이 자체 어휘 환경을 가지고 있기 때문에 블록 내부의 변수를 보지 못합니다.

### IIFE

과거에는 자바 스크립트에 블록 수준의 어휘 환경이 없었습니다.

그래서 프로그래머들은 뭔가를 발명해야했습니다. 그리고 그들이 한 것은 "즉시 호출되는 함수 표현식"(줄여서 IIFE라고 함)입니다.

요즘 사용해야하는 것은 아니지만 오래된 스크립트에서 찾을 수 있으므로 이해하는 것이 좋습니다.

IIFE는 다음과 같습니다.

```js run
(function() {

  let message = "Hello";

  alert(message); // Hello

})();
```

함수 표현식이 생성되고 즉시 호출됩니다. 따라서 코드는 즉시 실행되고 고유 한 개인 변수가 있습니다.

함수 표현식은 괄호 `(function {...})`로 싸여 있습니다. 왜냐하면 자바 스크립트가 메인 코드 흐름에서 "함수" 를 만나면 함수 선언의 시작으로 이해하기 때문입니다. 그러나 Function 선언에는 이름이 있어야합니다. 따라서 이런 종류의 코드는 오류를 발생시킵니다.

```js run
// Try to declare and immediately call a function
function() { // <-- Error: Unexpected token (

  let message = "Hello";

  alert(message); // Hello

}();
```

자바 스크립트에서 함수 선언을 즉시 호출 할 수 없으므로 "괜찮습니다, 이름을 추가합시다"라고해도 효과가 없습니다.

```js run
// syntax error because of parentheses below
function go() {

}(); // <-- can't call Function Declaration immediately
```

따라서 함수 주위의 괄호는 JavaScript가 다른 표현식의 컨텍스트에서 만들어지기 때문에 트릭이며, 따라서 함수 식입니다. 이름이 없어도 즉시 호출 할 수 있습니다.

자바 스크립트에 함수 표현식을 의미하는 괄호 외에 다른 방법이 있습니다.

```js run
// Ways to create IIFE

(function() {
  alert("Parentheses around the function");
}*!*)*/!*();

(function() {
  alert("Parentheses around the whole thing");
}()*!*)*/!*;

*!*!*/!*function() {
  alert("Bitwise NOT operator starts the expression");
}();

*!*+*/!*function() {
  alert("Unary plus starts the expression");
}();
```

위의 모든 경우에 함수식을 선언하고 즉시 실행합니다.

## Garbage collection

일반적으로 어휘 환경은 기능 실행 후 정리되고 삭제됩니다. 예를 들면 :

```js
function f() {
  let value1 = 123;
  let value2 = 456;
}

f();
```

여기서 두 가지 값은 기술적으로 어휘 환경의 속성입니다. 그러나 `f()`가 끝나면 어휘 환경에 도달 할 수 없으므로 메모리에서 삭제됩니다.

...하지만 `f`가 끝난 후에도 여전히 도달 할 수있는 중첩 된 함수가 있다면, `[[Environment]]` 참조는 외부 어휘 환경도 살아있게합니다 :

```js
function f() {
  let value = 123;

  function g() { alert(value); }

*!*
  return g;
*/!*
}

let g = f(); // g is reachable, and keeps the outer lexical environment in memory
```

`f()`가 여러 번 호출되고 그 결과 함수가 저장되면 해당 어휘 환경 객체도 메모리에 유지된다는 점에 유의하십시오. 아래 코드에서 3 가지 모두 :

```js
function f() {
  let value = Math.random();

  return function() { alert(value); };
}

// 3 functions in array, every one of them links to Lexical Environment
// from the corresponding f() run
//         LE   LE   LE
let arr = [f(), f(), f()];
```

어휘 환경 객체는 (다른 객체와 마찬가지로) 도달 할 수 없을 때 죽습니다. 다른 말로하면 적어도 하나의 중첩 된 함수가 참조하는 동안에 만 존재합니다.

아래의 코드에서, `g`가 도달 할 수 없게 된 후, 어휘 환경 (그리고 그러므로 `value`)을 감싸는 것은 메모리에서 제거됩니다;

```js
function f() {
  let value = 123;

  function g() { alert(value); }

  return g;
}

let g = f(); // while g is alive
// there corresponding Lexical Environment lives

g = null; // ...and now the memory is cleaned up
```

### Real-life optimizations

앞에서 보았 듯이 함수가 살아있는 동안 이론에서는 모든 외부 변수도 유지됩니다.

그러나 실제로는 JavaScript 엔진이이를 최적화하려고합니다. 변수 사용을 분석하고 외부 변수가 사용되지 않는 것을 쉽게 알 수 있으면 제거됩니다.

**V8 (Chrome, Opera)의 중요한 부작용은 디버깅에서 이러한 변수를 사용할 수 없게된다는 것입니다.**

개발자 도구를 열고 Chrome에서 아래의 예를 실행 해보세요.

일시 중지되면 콘솔 유형에서 `alert(value)`.

```js run
function f() {
  let value = Math.random();

  function g() {
    debugger; // in console: type alert( value ); No such variable!
  }

  return g;
}

let g = f();
g();
```

보시다시피 - 그러한 변수는 없습니다! 이론 상으로는 접근 가능해야하지만, 엔진은 그것을 최적화했다.

이로 인해 재미있는 디버깅 문제가 발생할 수 있습니다. 그 중 하나 - 우리는 예상 된 것 대신에 동일한 이름의 외부 변수를 볼 수 있습니다 :

```js run global
let value = "Surprise!";

function f() {
  let value = "the closest value";

  function g() {
    debugger; // in console: type alert( value ); Surprise!
  }

  return g;
}

let g = f();
g();
```

```warn header="다시 만나요!"
V8의이 기능은 알아두면 좋습니다. Chrome / Opera로 디버깅하는 경우 조만간 만날 것입니다.

이것은 디버거의 버그가 아니라 V8의 특별한 기능입니다. 아마도 언젠가는 바뀔 것입니다.
이 페이지의 예제를 실행하여 항상 확인할 수 있습니다.
```
