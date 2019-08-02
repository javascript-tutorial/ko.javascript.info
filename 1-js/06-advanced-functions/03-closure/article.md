
# 클로저

자바스크립트는 상당히 함수 지향적인 언어입니다. 이는 개발자에게 많은 자유도를 제공합니다. 함수를 동적으로 생성할 수 있고, 다른 변수에 함수를 복사할 수 있으며, 함수 자체가 다른 함수의 인수로도 전달될 수 있고, 전혀 다른 곳에서 함수를 호출할 수 도 있기 때문입니다.

함수 내부에서 외부의 변수에 접근할 수 있다는 점은 앞서 학습했기 때문에 아마 알고 계실겁니다. 이 기능은 꽤 자주 사용됩니다.

그런데 만약 함수가 접근하려는 외부 변수가 변경되는 경우엔 어떤일이 생길까요? 변경된 최신 값을 가져올까요, 아니면 함수 생성시점에 있었던 기존 값을 가져올까요?

그리고 만약 함수가 코드 내 다른 위치로 이동하여 그곳에서 호출되면 어떤 일이 발생할까요? 새로운 위치를 기준으로 외부 변수 값을 가져올까요?

외부 변수 접근에 대해선 각 언어마다 동작하는 방식이 다릅니다. 이 챕터에선 자바스크립트가 어떻게 동작하는지를 다루도록 하겠습니다.

## 몇 가지 질문

먼저 두 가지 상황을 가정하면서 시작하도록 하겠습니다. 이후 자바스크립트 내부 동작 원리를 하나씩 파헤치면서, 각 상황에서 어떤 일이 벌어질지에 대해 답을 찾아가도록 하겠습니다. 이 과정을 거치면 더 복잡한 상황에 대해 다룰 수 있게 됩니다.  

1. 함수 `sayHi`는 외부 변수 `name`을 사용합니다. 아래 코드에서 함수가 실행되면 외부 변수 중 어떤 값이 사용될까요?

    ```js
    let name = "John";

    function sayHi() {
      alert("Hi, " + name);
    }

    name = "Pete";

    *!*
    sayHi(); // "John"이 출력될까요, 아니면 "Pete"가 출력될까요?
    */!*
    ```

   개발을 하다보면 브라우저 및 서버 사이드 환경에서 이런 상황을 쉽게 만날 수 있습니다. 함수가 정의된 시점 이후에 함수가 실행되도록 스케줄링 할 수 있죠. 사용자 동작이나 네트워크 요청 이후에 함수를 실행하는 경우가 대표적인 예가 될 수 있을 것 입니다.
   
   자, 다시 질문해보도록 합시다. 함수는 최신 변경값을 가져올까요?


2. 함수 `makeWorker`는 또 다른 함수를 만들고, 만들어진 새 함수를 반환합니다. 새로 만든 이 함수는 다른 곳에서 호출될 수 있습니다. 이 함수를 호출할 때, 함수가 만들어진 곳을 기준으로 외부 변수를 가져올까요, 아니면 함수가 호출된 곳을 기준으로 외부 변수를 가져올까요? 두 경우 모두 가능할까요?

    ```js
    function makeWorker() {
      let name = "Pete";

      return function() {
        alert(name);
      };
    }

    let name = "John";

    // 새로운 함수를 만듭니다.
    let work = makeWorker();

    // call it
    *!*
    work(); // 함수가 만들어진 곳을 기준으로 외부 변수를 가져와 "Pete"를 출력해줄까요? 아니면 함수가 호출된 곳을 기준으로 외부 변수를 가져와 "John"을 출력할까요?
    */!*
    ```


## 렉시컬 환경

출력 결과가 무엇일지 알려면, 먼저 "변수"의 실체에 대해 알아야 합니다.

자바스크립트에서 실행 중인 모든 함수, 코드 블록 `{...}`, 스크립트 전체는 *렉시컬 환경(Lexical Environment)* 이라고 불리는 숨겨진 내부 연관 객체를 갖습니다.

렉시컬 환경 객체는 두 부분으로 구성됩니다.

1. 모든 지역 변수를 프로퍼티로 저장하고 있는 객체인 *환경 레코드(Environment Record)*. (`this`등의 다른 정보도 저장됨)
2. 외부 코드와 연관을 갖는 *외부 렉시컬 환경(Outer Lexical Environment)* 에 대한 참조

**"변수"의 실체는 특별한 내부 객체인 `환경 레코드`의 프로퍼티입니다. 따라서 "변수를 가져오거나 변경"하는 행위는 "환경 레코드의 프로퍼티를 가져오거나 변경"하는 것을 의미합니다.**

아래 간단한 코드엔 하나의 렉시컬 환경만 존재합니다.

![lexical environment](lexical-environment-global.svg)

이렇게 스크립트 전체와 연관된 렉시컬 환경을 전역 렉시컬 환경(global Lexical Environment)이라 부릅니다.

위 그림에서 사각형은 (변수가 저장되어있는) 환경 레코드를 나타내고, 화살표는 외부 렉시컬 환경에 대한 참조를 나타냅니다. 글로벌 렉시컬 환경은 외부 참조가 없기 때문에 화살표가 'null'을 가리키는 걸 확인하실 수 있을 겁니다.

And that's how it changes when a variable is defined and assigned:

![lexical environment](lexical-environment-global-2.svg)

우측의 사각형들은 실행이 진행됨에 따라 전역 렉시컬 환경이 어떻게 변경되는지를 보여줍니다(위에서부터 아래로).

1. 스크립트가 시작할 땐, 렉시컬 환경이 비어 있습니다(<empty>).
2. `let phrase` 정의가 나타납니다. 값이 할당되지 않았으므로 `undefined`가 저장됩니다.
3. `phrase`에 값이 할당됩니다.
4. `phrase`의 값이 변경됩니다.

아직까진 어려운게 없어보이네요.

지금까지 배운걸 요약해 보면 다음과 같습니다.

- 변수는 현재 실행 중인 코드 블록, 함수, 스크립트와 연관된 특수 내부 객체의 프로퍼티입니다.
- 변수에 가하는 작업은 특수 내부 객체의 프로퍼티를 변화시킵니다.

### 함수 선언문

지금까지는 변수가 변할 때 내부에 어떤 변화가 있는지에 대해서만 관찰했습니다. 이젠 함수 선언시 어떤 일이 발생하는지 알아봅시다.

**`let` 변수와는 달리, 함수 선언문으로 정의한 함수는 실행 흐름이 도달할 때가 아닌, 렉시컬 환경이 만들어질 때 완전히 초기화됩니다.**

최상위 함수의 경우, 스크립트가 시작되는 순간에 바로 함수가 초기화됩니다.

이런 내부 동작 때문에 함수를 정의하기 전에도 호출이 가능한 것입니다.

아래 그림을 보면, 실행이 시작된 시점에 렉시컬 환경이 비어 있지 않은 걸 확인할 수 있습니다. 환경 레코드 안에 `say`가 있죠. 그 이후, 실행 흐름이 `let`에 도달하면 환경 레코드에 `phrase` 프로퍼티가 추가됩니다.

![lexical environment](lexical-environment-global-3.svg)


### 내부와 외부 렉시컬 환경

이제 함수 내부에서 외부 변수를 참조하려 할 때, 어떤 일이 일어나는지 살펴봅시다.

함수가 호출되는 동안 `say()`는 외부 변수인 `phrase`를 사용하는데, 내부에서 구체적으로 무슨 일이 일어나는지 알아보겠습니다.

When a function runs, a new Lexical Environment is created automatically to store local variables and parameters of the call.

`say ("John")` 을 호출하는 예제의 경우, 아래 그림과 같은 내부 변화가 일어날 것입니다(현재 실행 흐름은 붉은색 화살표로 나타낸 라인에 있는 상황입니다).

<!--
    ```js
    let phrase = "Hello";

    function say(name) {
     alert( `${phrase}, ${name}` );
    }

    say("John"); // Hello, John
    ```-->

![lexical environment](lexical-environment-simple.svg)

보시는 바와 같이 함수가 호출 중일 때, 두 개의 렉시컬 환경, 호출된 함수를 위한 (내부) 렉시컬 환경과 스크립트 전체와 연관된 (전역) 렉시컬 환경이 만들어집니다.

- 내부 렉시컬 환경은 현재 실행중인 함수인 `say`에 상응합니다.

    이 렉시컬 환경은 프로퍼티 하나를 갖습니다. 함수 인자인 `name` 말이죠. `say("John")`을 호출했기 때문에 `name`의 값은 `"John"`이 됩니다.
- 외부 렉시컬 환경은 전역 렉시컬 환경입니다.

    It has `phrase` variable and the function itself.

The inner Lexical Environment has a reference to the `outer` one.

**코드가 변수에 접근하려고 하면, 접근하고자 하는 변수에 대응하는 프로퍼티를 내부 렉시컬 환경에서 먼저 찾습니다. 찾지 못하면 외부 렉시컬 환경에서 검색을 시작합니다. 이 과정은 전역 렉시컬 환경에 도달할 때까지 반복됩니다.**

If a variable is not found anywhere, that's an error in strict mode (without `use strict`, an assignment to a non-existing variable, like `user = "John"` creates a new global variable `user`, that's for backwards compatibility).

예제 코드와 그림을 보면서 검색이 어떻게 진행되는지 살펴봅시다.

-`say` 내부의 `alert`가 `name`에 접근하려고 하면, 함수 렉시컬 환경을 먼저 살피게 됩니다. `name`에 상응하는  프로퍼티를 바로 찾았네요!
-`say` 내부의 `alert`가 `phrase`에 접근하려고 했는데, `phrase`는 내부 렉시컬 환경에 없습니다. 따라서, 내부 렉시컬 환경이 참조하는 렉시컬 환경(외부 렉시컬 환경)에 변수 `phrase`에 대응하는 프로퍼티가 있는지 검색을 시작합니다. 해당 프로퍼티가 외부 렉시컬 환경엔 있네요!

![lexical environment lookup](lexical-environment-simple-lookup.svg)

이제 첫 번째 경우에 내부에서 어떤 일이 일어나는지, 답은 무엇인지 알게 되었습니다.

**A function gets outer variables as they are now, it uses the most recent values.**

Old variable values are not saved anywhere. When a function wants a variable, it takes the current value from its own Lexical Environment or the outer one.

따라서 이번 챕터 초반부에서 가정한 첫 번째 상황의 경우, `Pete`가 출력됩니다.

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


위 코드의 실행 흐름은 아래와 같습니다.

1. 전역 렉시컬 환경에 `name : "John"`이 저장됩니다.
2. `(*)`로 표시한 줄에서 전역 변수가 변경되면서, 전역 렉시컬 환경의 해당 부분이 `name : "Pete"`로 변합니다.
3. 함수 `sayHi()`가 실행될 때, 외부에서 `name` 값을 가져옵니다. 이 예제에선 외부 렉시컬 환경이 글로벌 렉시컬 환경이므로, 글로벌 렉시컬 환경에 저장된 값인 `"Pete"`가 출력됩니다.


```smart header="실행 하나에 렉시컬 환경 하나."
함수가 실행될 때마다 새로운 함수 렉시컬 환경이 만들어진다는 점을 꼭 기억하시길 바랍니다.

어떤 함수 하나를 여러 번 호출하는 경우에도, 이 규칙은 변하지 않습니다. 각 호출마다 새로운 함수 렉시컬 환경이 만들어지죠. 함수 렉시컬 환경엔 함수 실행 시 넘겨받은 매개변수와 지역변수에 대한 정보가 담겨 있습니다. 
```

```smart header="렉시컬 환경은 명세 객체입니다."
"렉시컬 환경"은 명세에서 정의한 객체(specification object)입니다. 코드를 이용해 이 객체를 직접 가져오거나 조작할 수 없습니다. 쓰지 않는 변수를 버려 메모리를 비우는 것과 같은 명세 객체 최적화 작업은 자바스크립트 엔진이 담당합니다. 최적화 작업에도 위에 언급한 내부 기제가 동일하게 적용됩니다.
```


## 중첩 함수

다른 함수 내부에 만들어진 함수를 "중첩(nested)" 함수라고 부릅니다.

자바스크립트에선 중첩 함수를 쉽게 만들고 사용할 수 있습니다.

중첩함수는 다음과 같이 코드를 정리하는 데 사용되곤 합니다. 

```js
function sayHiBye(firstName, lastName) {

  // 헬퍼(helper) 중첩 함수
  function getFullName() {
    return firstName + " " + lastName;
  }

  alert( "Hello, " + getFullName() );
  alert( "Bye, " + getFullName() );

}
```

위 코드에서  *중첩* 함수인 `getFullName()`은 편의상 만든 함수입니다. `getFullName()`은 외부 변수에 접근해 전체 이름을 반환해 줍니다. 중첩 함수는 자바스크립트에서 흔하게 접할 수 있습니다.

중첩 함수가 흥미로운 이유는 반환할 수 있다는 점 때문입니다. 중첩 함수를 반환할 때는, 함수 그 자체로 혹은 새로운 객체의 프로퍼티 형태로 반환됩니다. 외부 함수가 메서드가 있는 객체를 만드는 경우, 후자의 형태로 중첩 함수가 반환됩니다.

아래는 중첩 함수가 [생성자(constructor) 함수](info:constructor-new)에 의해 새로운 객체에 할당되는 예제입니다. 

```js run
// 생성자 함수가 새로운 객체를 반환함
function User(name) {

  // 중첩함수로 객체 메서드를 만듦
  this.sayHi = function() {
    alert(name);
  };
}

let user = new User("John");
user.sayHi(); // "sayHi" 메서드는 외부 "name"에 접근함
```

아래 코드는 "숫자를 세주는(counting)" 함수를 만들고, 반환합니다.

```js run
function makeCounter() {
  let count = 0;

  return function() {
    return count++; // 외부 변수 "count"에 접근함
  };
}

let counter = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1
alert( counter() ); // 2
```

`makeCounter` 예제를 좀 더 살펴보겠습니다. 이 예제에선 호출할 때마다 숫자를 1씩 증가시켜 출력해주는 함수, "counter"가 정의되어 있습니다. 이 예제 코드 자체는 상당히 단순하지만, 약간의 변형을 가미하면 [난수 생성기](https://en.wikipedia.org/wiki/Pseudorandom_number_generator)와 같은 실용성 있는 함수를 만들 수 있습니다.

그렇다면 counter는 어떤 방식으로 동작하는 걸까요?

내부 함수의 코드 `count++`가 실행될 때, 안쪽에서부터 시작해 바깥으로 나아가며 count를 찾습니다. 검색 영역이 아래 그림처럼 점차 확장되어, 검색 순서가 아래와 같이 됩니다.

![](lexical-search-order.svg)

1. 중첩 함수의 내부
2. 외부 함수의 내부
3. 전역 변수까지 영역이 확장될 때까지 검색이 계속됨

위 예제에선 `count`를 `두 번째` 단계에서 찾을 수 있습니다. 연산을 가할 변수가 있어야 변수의 값을 증가시킬 수 있기 때문에, `두 번째` 단계에 상응하는 렉시컬 환경에서 증가연산자 `++`에 의해 count 값이 `0`에서 `1`로 증가합니다. 이 시점에서 `let count = 1`을 실행한 것과 같이 됩니다.

여기서 두 가지 의문이 생길 수 있습니다.

1. 함수 makeCounter의 바디가 아닌 다른 곳에서 `count` 함수를 초기화할 수는 없을까요? `alert` 호출 아래와 같은 곳에서 말이죠.
2. `makeCounter()`를 여러 번 호출하면 `counter` 함수도 많아질 텐데, 이 함수들이 서로 독립적인가요? 아니면 같은 `count` 변수를 공유하나요?

질문에 대한 답을 얻기 전에, 잠시 혼자 생각해 볼 시간을 가지시길 바랍니다.

...

충분히 생각해 보셨나요?

좋습니다. 답을 살펴보겠습니다.

1. 초기화 할 수 없습니다. `count`는 함수의 지역 변수이기 때문에, 외부에서 접근할 수 없습니다.
2. `makeCounter()`를 호출할 때마다 새로운 함수 렉시컬 환경이 만들어지고, 각 함수 렉시컬 환경은 자신만의 `count`를 갖습니다. 따라서 각 `counter` 함수는 독립적입니다.

예제를 통해 이를 확인해 봅시다.

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

alert( counter2() ); // 0 (count2는 count1과 연관이 없습니다.)
```


Hopefully, the situation with outer variables is clear now. For most situations such understanding is enough. There are few details in the specification that we omitted for brevity. So in the next section we cover even more details.

## 렉시컬 환경 자세히 알아보기

지금부턴 `makeCounter` 함수를 한줄 한줄 따라가면서 내부에서 어떤 일이 일어나는지 살펴보도록 하겠습니다. 이 과정을 거치면 내부함수가 어떻게 처리되는지 자세히 알 수 있습니다.

간결한 설명을 위해 지금까진 언급하지 않았던 `[[Environment]]` 프로퍼티를 지금부턴 다루도록 하겠습니다. 

1. 스크립트가 시작할 땐, 전역 렉시컬 환경만 존재합니다.

    ![](lexenv-nested-makecounter-1.svg)

    At that starting moment there is only `makeCounter` function, because it's a Function Declaration. It did not run yet.

    **All functions "on birth" receive a hidden property `[[Environment]]` with a reference to the Lexical Environment of their creation.**

    We didn't talk about it yet, that's how the function knows where it was made.

    Here, `makeCounter` is created in the global Lexical Environment, so `[[Environment]]` keeps a reference to it.

    In other words, a function is "imprinted" with a reference to the Lexical Environment where it was born. And `[[Environment]]` is the hidden function property that has that reference.

2. The code runs on, the new global variable `counter` is declared and gets the result of `makeCounter()` call. Here's a snapshot of the moment when the execution is on the first line inside `makeCounter()`:

    ![](lexenv-nested-makecounter-2.svg)

    At the moment of the call of `makeCounter()`, the Lexical Environment is created, to hold its variables and arguments.

    As all Lexical Environments, it stores two things:
    1. An Environment Record with local variables. In our case `count` is the only local variable (appearing when the line with `let count` is executed).
    2. The outer lexical reference, which is set to the value of `[[Environment]]` of the function. Here `[[Environment]]` of `makeCounter` references the global Lexical Environment.

    So, now we have two Lexical Environments: the first one is global, the second one is for the current `makeCounter` call, with the outer reference to global.

3. `makeCounter()`를 실행하는 동안, 중첩 함수 하나가 만들어집니다.

    이때, 중첩함수가 함수 선언문 방식으로 만들어졌는지, 함수 표현식으로 만들어졌는지 여부는 중요하지 않습니다. 생성 방식에 상관없이 모든 함수는 생성되는 시점의 렉시컬 환경을 참조하는 `[[Environment]]` 프로퍼티를 가집니다. 예제의 익명 함수 역시 새로운 `[[Environment]]` 프로퍼티를 갖게 됩니다.
    
    새로운 중첩 익명 함수의 `[[Environment]]`는 `makeCounter()`를 위한 렉시컬 환경을 참조합니다. 이 익명함수는 `makeCounter()`의 렉시컬 환경에서 만들어졌기 때문입니다.

    ![](lexenv-nested-makecounter-3.svg)

    지금 단계에선 함수는 만들어졌지만, 아직 호출은 되지 않았다는 점에 유의하시기 바랍니다. `function() { return count++; }`이 아직 실행되기 전입니다.

4. 실행이 진행되면서, `makeCounter()`에 대한 호출이 종료되고, 반환값(익명 중첩 함수)이 전역 변수`counter`에 할당됩니다.

    ![](lexenv-nested-makecounter-4.svg)

    내부 중첩 함수의 바디는 `return count ++`라는 코드 한 줄로만 이루어져 있습니다.

5. When `counter()` is called, a new Lexical Environment is created for the call. It's empty, as `counter` has no local variables by itself. But the `[[Environment]]` of `counter` is used as the `outer` reference for it, that provides access to the variables of the former `makeCounter()` call where it was created:

    ![](lexenv-nested-makecounter-5.svg)

    Now when the call looks for `count` variable, it first searches its own Lexical Environment (empty), then the Lexical Environment of the outer `makeCounter()` call, where finds it.

    여기서 잠깐 메모리의 상태에 대해 알아봅시다. `makeCounter()` 호출은 이미 끝났지만, 호출 시 생성된 렉시컬 환경은 여전히 메모리에 남아있게 됩니다. 내부 중첩 함수의 `[[Environment]]`가 여전히 이 렉시컬 환경을 참조하고 있기 때문입니다.

    렉시컬 환경 객체는 자신을 참조하는 것이 하나라도 남아 있다면 메모리에서 제거되지 않습니다. 참조하는 것이 없을 때 메모리에서 지워집니다.

6. `counter()`를 호출하면 `count` 값이 반환될 뿐만 아니라, 값이 증가합니다. 값의 증가 같은 변수 업데이트는 "그 자리에서" 이뤄지므로, `count` 값의 증가는 `count`가 발견된 렉시컬 환경에서 이뤄집니다.

    ![](lexenv-nested-makecounter-6.svg)

7. Next `counter()` invocations do the same.

The answer to the second question from the beginning of the chapter should now be obvious.

The `work()` function in the code below gets `name` from the place of its origin through the outer lexical environment reference:

![](lexenv-nested-work.svg)

따라서 `Pete`가 출력됩니다.

`makeWorker()`에 `let name`이 없었다면, 전역 렉시컬 환경에서 변수를 가져와 `"John"`이 출력될 겁니다.

```smart header="클로저"
"클로저(closure)"는 개발자라면 필수로 알아야 하는 프로그래밍 용어입니다.

[클로저](https://en.wikipedia.org/wiki/Closure_(computer_programming))는 외부 변수를 기억하고 액세스할 수 있는 함수입니다. 몇몇 언어에서는 클로저를 구현하는 게 불가능하거나 특별한 방법으로 함수를 작성해야 클로저를 만들 수 있습니다. 하지만 자바스크립트에선 모든 함수가 자연스럽게 클로저가 됩니다(예외가 하나 있는데, 이에 대해선 <info:new-function>에서 다루도록 하겠습니다).

자바스크립트의 함수는 숨김 프로퍼티인 `[[Environment]]`를 이용해 자신이 어디서 만들어졌는지 기억하고, 외부 변수에도 접근할 수 있습니다.

채용 인터뷰에서 "클로저가 무엇입니까?"라는 질문을 받게 되면, 클로저에 대한 정의를 말하고 자바스크립트에선 모든 함수가 클로저라고 이야기하면 될 것 같습니다. 이때, `[[Environment]]` 프로퍼티와 렉시컬 환경이 어떤 방식으로 동작하는지에 대한 설명을 덧붙일 수 있겠죠.
```

## 코드블록과 반복 그리고 즉시실행함수

지금까진 함수를 예로 렉시컬 환경의 동작방식에 대해 알아보았습니다. 그러나 렉시컬 환경은 모든 코드 블록 `{...}`에 존재합니다.

렉시컬 환경은 코드 블록이 실행될 때 만들어지고, 블록 내 지역 변수를 포함합니다. 몇 가지 예를 통해 이를 살펴봅시다.

### If

아래 예제에서 변수 `user`는 `if` 블록 안에만 존재합니다.

<!--
    ```js run
    let phrase = "Hello";

    if (true) {
        let user = "John";

        alert(`${phrase}, ${user}`); // Hello, John
    }

    alert(user); // Error, can't see such variable!
    ```-->

![](lexenv-if.svg)

실행이 `if` 블록에 도달하면 "if 전용" 렉시컬 환경이 새롭게 만들어집니다.

이 렉시컬 환경은 외부 렉시컬 환경을 참조하기 때문에, 이를 통해 `phrase`를 찾을 수 있습니다. 그러나 `if` 블록 안에서 선언한 모든 변수와 함수 표현식은 해당 렉시컬 환경에 있어서 외부에서 볼 수 없습니다.

따라서 `if` 블록이 끝나면 그 아래의 코드 `alert`는 `user`를 볼 수 없으므로 오류가 발생합니다.

### For, while 반복문

For a loop, every iteration has a separate Lexical Environment. If a variable is declared in `for(let ...)`, then it's also in there:

```js run
for (let i = 0; i < 10; i++) {
  // 각 반복문은 독립된 렉시컬 환경을 갖습니다.
  // {i: value}
}

alert(i); // 에러
```

Please note: `let i` is visually outside of `{...}`. The `for` construct is special here: each iteration of the loop has its own Lexical Environment with the current `i` in it.

`if`문과 마찬가지로, 반복문이 끝난 후에는 `i`를 볼 수 없습니다.

### 코드 블록

코드를 블록 `{...}`으로 감싸면, 변수를 독립된 "지역 스코프"로 분리할 수 있습니다.

브라우저 환경에선 (`type="module"`인 스크립트를 제외하고) 모든 스크립트가 동일한 전역 공간을 공유하기 때문에, 한 스크립트에서 만든 전역 변수를 다른 스크립트가 공유하게 됩니다. 이 때문에 두 개의 스크립트가 동시에 같은 이름을 가진 전역 변수를 사용하면, 변수가 덮어써 지는 문제가 발생하죠.

사용 빈도가 높은 단어로 변수 이름을 지을 경우 이런 문제가 발생할 수 있습니다. 스크립트 작성자 간 합의가 되지 않았다면 말이죠. 

코드 블록을 사용하여 전체 스크립트 또는 스크립트의 일부를 격리하면 이런 충돌상황을 피할 수 있습니다.

```js run
{
  // 외부에서 접근이 불가능한 지역변수를 만듦

  let message = "Hello";

  alert(message); // Hello
}

alert(message); // Error: message is not defined
```

블록 바깥의 코드(혹은 다른 스크립트에 있는 코드)는 블록 내 변수에 접근할 수 없습니다. 블록이 자체 렉시컬 환경을 형성하기 때문입니다.

### 즉시 실행 함수 표현식

오래된 버전의 자바스크립트에선 블록 레벨 렉시컬 환경을 지원하지 않았습니다.

따라서 스코프 충돌을 방지하기 위해 개발자들은 무언가를 발명해야만 했습니다. 그때 만들어진 것이 "즉시 실행 함수 표현식(immediately-invoked function expressions)"입니다. 즉시 실행 함수 표현식은 줄여서 IIFE라고 부르기도 합니다.

근래에는 자주 사용하지 않지만, 오래된 스크립트에서 이 문법을 만날 수 있기 때문에, 즉시 실행 함수 표현식이 무엇인지 알아 둘 필요가 있습니다.

IIFE는 다음과 같이 생겼습니다.

```js run
(function() {

  let message = "Hello";

  alert(message); // Hello

})();
```

함수를 정의함과 동시에 이를 바로 호출한 것이 보이시나요? 이렇게 작성하면 코드가 즉시 실행되기 때문에, 같은 함수를 다시 호출할 수 없게 됩니다. 또한 함수 내부의 변수는 외부에서 접근이 불가능합니다.

즉시 실행 함수를 만들 땐, 함수 표현식을 괄호로 둘러쌓아 `(function {...})`와 같은 형태로 만듭니다. 이렇게 괄호로 둘러싸지 않으면 에러가 발생합니다. 자바스크립트는 `"function"`이라는 키워드를 만나면 함수 선언문이 시작될 것이라 이해하는데, 함수 선언문으로 함수를 만들 땐 반드시 함수의 이름이 있어야 하기 때문입니다. 

```js run
// 함수를 선언과 동시에 실행하려고 함
function() { // <-- Error: Unexpected token (

  let message = "Hello";

  alert(message); // Hello

}();
```

"그럼 이름을 넣으면 되는 거 아닌가?"라고 생각해 이름을 넣어도, 에러가 발생합니다. 자바스크립트는 함수 선언문으로 정의한 함수를 정의와 동시에 바로 호출할 수 없도록 하였기 때문입니다.

```js run
// 맨 아래의 괄호 때문에 문법 에러가 발생합니다.
function go() {

}(); // <-- 함수 선언문은 즉시 호출할 수 없습니다.
```

함수를 괄호로 둘러쌓으면 자바스크립트가 이를 함수 선언문이 아닌 표현식으로 인식하도록 속일 수 있습니다. 함수 표현식은 이름이 없어도 괜찮고, 즉시 호출할 수 있죠.

괄호를 사용하는 것 이외에도, 자바스크립트가 함수 표현식이라고 인식하게 해주는 다른 방법이 존재합니다.

```js run
// IIFE를 만드는 방법

(function() {
  alert("함수를 괄호로 둘러싸기");
}*!*)*/!*();

(function() {
  alert("전체를 괄호로 둘러싸기");
}()*!*)*/!*;

*!*!*/!*function() {
  alert("표현식 앞에 비트 NOT 연산자 붙이기");
}();

*!*+*/!*function() {
  alert("표현식 앞에 단항 덧셈 연산자 붙이기");
}();
```

In all the above cases we declare a Function Expression and run it immediately. Let's note again: nowadays there's no reason to write such code.

## 가비지 컬렉션

렉시컬 환경은 보통, 함수 실행 후 정리되고 삭제됩니다. 예를 들어 살펴보겠습니다.

```js
function f() {
  let value1 = 123;
  let value2 = 456;
}

f();
```

여기서 두 값은 렉시컬 환경의 프로퍼티입니다. `f()`가 종료되면 렉시컬 환경에 도달할 수 없는 상태가 되므로, 두 값은 해당 렉시컬 환경과 함께 메모리에서 삭제됩니다.

...But if there's a nested function that is still reachable after the end of `f`, then it has `[[Environment]]` property that references the outer lexical environment, so it's also reachable and alive:

```js
function f() {
  let value = 123;

  function g() { alert(value); }

*!*
  return g;
*/!*
}

let g = f(); // g는 도달할 수 있는 상태이기 때문에, g가 참조하는 외부 렉시컬 환경은 메모리에 유지됨
```

Please note that if `f()` is called many times, and resulting functions are saved, then all corresponding Lexical Environment objects will also be retained in memory. All 3 of them in the code below:

```js
function f() {
  let value = Math.random();

  return function() { alert(value); };
}

// 3 functions in array, every one of them links to Lexical Environment
// from the corresponding f() run
let arr = [f(), f(), f()];
```

렉시컬 환경 객체는 (다른 객체와 마찬가지로) 도달할 수 없을 때 메모리에서 삭제됩니다. 해당 렉시컬 환경 객체를 참조하는 중첩 함수가 있으면 사라지지 않죠.

아래 코드와 같이 `g`가 도달할 수 없는 상태가 되고 난 후에야, 중첩 함수를 감싸는 렉시컬 환경(그리고 그 안의 변수인 `value`)이 메모리에서 제거됩니다.

```js
function f() {
  let value = 123;

  function g() { alert(value); }

  return g;
}

let g = f(); // g가 살아있는 동안엔
// 연관되는 렉시컬 환경은 살아있습니다.

g = null; // 도달할 수 없는 상태가 되었으므로, 메모리에서 지워집니다.
```

### 실제 최적화 프로세스

앞에서 보았듯이, 함수가 살아있는 동안엔 이론상으론 모든 외부 변수가 함께 유지됩니다.

But in practice, JavaScript engines try to optimize that. They analyze variable usage and if it's obvious from the code that an outer variable is not used -- it is removed.

**디버깅 시, 최적화 과정에서 제거된 변수를 사용할 수 없다는 점이 V8 (Chrome, Opera) 엔진의 주요 부작용 중 하나입니다.**

크롬 브라우저에서 개발자 도구를 열고 아래의 코드를 실행해 이를 확인해 봅시다.

일시 중지된 곳에서 콘솔을 열고 `alert(value)`를 입력해 보죠.

```js run
function f() {
  let value = Math.random();

  function g() {
    debugger; // in console: type alert(value); No such variable!
  }

  return g;
}

let g = f();
g();
```

보다시피 정의되지 않은 변수라는 에러가 출력됩니다. 이론상으로는 이 변수에 접근할 수 있어야 하지만 최적화 과정에서 외부 변수도 함께 최적화의 대상이 되어버렸습니다.

이로 인해 재미있는 디버깅 문제가 발생할 수 있습니다. 이 문제로 인해 꽤 많은 시간을 허비하지 않았다면 말이죠. 발생할 수 있는 상황 중 하나를 여기서 소개해 드리도록 하겠습니다. 의도한 변수 대신 같은 이름을 가진 다른 외부 변수가 출력되는 걸 확인해 보시죠.

```js run global
let value = "Surprise!";

function f() {
  let value = "the closest value";

  function g() {
    debugger; // in console: type alert(value); Surprise!
  }

  return g;
}

let g = f();
g();
```

```warn header="다시 만나요!"
Chrome이나 Opera로 디버깅을 하고 계신다면, V8의 이 기능을 알아두는 게 좋습니다. 조만간 이런 상황을 만나게 될 확률이 아주 높으니까요.

이런 동작 방식은 디버거의 버그는 아닙니다. V8의 특별한 기능이죠. 언젠간 이 기능이 바뀔지도 모릅니다. 기능이 바뀌었는지 궁금하다면 언제라도 이 페이지로 돌아와 위의 예제를 실행해 봅시다.
```
