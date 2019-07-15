# 재귀와 스택

함수에 대해 좀 더 깊이 알아보도록 하겠습니다.

함수 심화학습, 첫 번째 주제는 *재귀(recursion)* 입니다.

프로그래밍을 새롭게 학습하는 초심자가 아니라 이 주제에 익숙하시다면, 본 챕터를 건너뛰어도 괜찮습니다.

재귀는 큰 목표 작업 하나를 동일하고 간단한 코드로 작성된 작업을 통해 수행할 수 있는 경우 유용하게 사용할 수 있는 프로그래밍 패턴입니다. 목표 작업을 간단한 동작 하나와 어떤 단순한 작업 하나를 조합해 수행할 수 있을 때도 재귀를 사용할 수 있습니다. 곧 살펴보겠지만, 어떤 특정한 자료구조를 다뤄야 할 때도 재귀가 사용됩니다.

함수를 이용해 어떤 작업을 수행할 때, 그 과정에서 다른 추가적인 함수를 호출할 때가 있습니다. 이때 함수가 *자기 자신*을 호출할 수도 있는데, 이를 *재귀* 라고 부릅니다.

## 두 가지 사고방식

간단한 예제로 재귀에 대해 알아보겠습니다. `x`를 `n` 제곱 해주는 함수 `pow` (x, n) 함수를 작성해 봅시다. 이 함수는 동일한 수 `x`를 `n` 회 만큼 곱합니다.

```js
pow(2, 2) = 4
pow(2, 3) = 8
pow(2, 4) = 16
```

두 가지 방법으로 이 함수를 구현할 수 있습니다.

1. 반복적인 방법: `for` 루프

    ```js run
    function pow(x, n) {
      let result = 1;

      // 루프를 돌면서 x를 n번 곱함
      for (let i = 0; i < n; i++) {
        result *= x;
      }

      return result;
    }

    alert( pow(2, 3) ); // 8
    ```

2. 재귀적인 방법: 작업을 단순화하고 자기 자신을 호출함

    ```js run
    function pow(x, n) {
      if (n == 1) {
        return x;
      } else {
        return x * pow(x, n - 1);
      }
    }

    alert( pow(2, 3) ); // 8
    ```

재귀적인 방법을 사용하면 어떤 근본적인 차이가 있는지 유심히 살펴보시기 바랍니다.

`pow (x, n)`을 호출하면 아래와 같이 두 경우로 나뉘어 코드가 실행됩니다.

```js
              if n==1  = x
             /
pow(x, n) =
             \
              else     = x * pow(x, n - 1)
```

1. `n == 1`인 경우, 모든 절차가 간단해집니다. 이런 경우를 재귀의 *베이스(base)* 케이스라고 부릅니다. 재귀 호출 없이 명백한 결괏값이 바로 도출되기 때문에, 이를 베이스 케이스라 부릅니다. `n == 1`일 때 `pow(x, 1)`가 되어 `x`라는 명백한 결괏값이 도출됩니다.
2. `n == 1`이 아니라면 `pow(x, n)`는 `x * pow(x, n - 1)`로 표현할 수 있습니다. 수학식으론 <code>x<sup>n</sup> = x * x<sup>n-1</sup></code>로 표현할 수 있겠죠. 이 경우를 *재귀 단계* 라고 부릅니다. 목표하는 작업(거듭제곱하기)을 간단한 동작(`x`를 곱하기)과 단순 작업(밑이 `n`보다 하나 작은 `pow`함수)을 조합해 수행할 수 있게 코드를 짰습니다. 재귀 단계는 `n`이 `1`이 될 때 까지 계속 수행됩니다.

`n == 1`이 될 때 까지 `pow` 함수 *자신을 재귀 호출* 한다고 아래 그램을 말로 표현할 수 있을 것입니다.

![recursive diagram of pow](recursion-pow.png)


`pow (2, 4)`를 계산하는 과정을 예로 재귀 단계를 구체적으로 살펴보겠습니다.

1. `pow(2, 4) = 2 * pow(2, 3)`
2. `pow(2, 3) = 2 * pow(2, 2)`
3. `pow(2, 2) = 2 * pow(2, 1)`
4. `pow(2, 1) = 2`

이렇게 재귀를 이용하면, 어떤 작업을 수행할 때 호출해야 하는 함수를 함수 호출의 결과가 명확해질 때까지 지속해서 단순화시킬 수 있습니다.

````smart header="재귀적 방법을 사용하면 코드가 짧아집니다"
재귀적 방법으로 작성한 코드는 대개 반복적 방법을 사용한 코드보다 짧습니다.

<<<<<<< HEAD
`if` 조건문을 `?` 연산자를 사용해 변형하면 `pow (x, n)`은 아래와 같이 더 간결하고 읽기 쉬운 코드가 됩니다.
=======
Here we can rewrite the same using the conditional operator `?` instead of `if` to make `pow(x, n)` more terse and still very readable:
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

```js run
function pow(x, n) {
  return (n == 1) ? x : (x * pow(x, n - 1));
}
```
````

중첩 호출(첫 번째 호출 포함)의 최대 개수는 *재귀 깊이(recursion depth)* 라고 합니다. 위 예제에서는 `n`이 재귀 깊이가 되겠네요. 

자바스크립트 엔진은 최대 재귀 깊이를 제한합니다. 만개 정도까진 확실히 허용되는데, 엔진에 따라 이보다 더 많은 깊이를 허용할 수도 있습니다. 다만 재귀 깊이가 십만 정도라면 대다수 엔진에선 이를 다루지 못합니다. 더 많은 재귀 깊이를 지원하기 위해 엔진 내부에서 "tail calls optimizations"라는 자동 최적화를 거치긴 합니다. 하지만 이 최적화 과정은 모든 경우를 지원하지 않고, 간단한 경우만 지원합니다. 

위와 같은 이유로 재귀를 실제 사용하는데 제약이 따르긴 하지만, 재귀는 여전히 광범위하게 사용되고 있습니다. 재귀적 방법을 사용해 코드를 작성하면, 간결하고 유지보수가 쉬운 작업이 많기 때문입니다.

<<<<<<< HEAD
## 실행 스택
=======
## The execution context and stack
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

실제 재귀 호출이 어떻게 동작하는지 알아봅시다. 이를 위해서 함수의 내부 동작에 대해 살펴보도록 하겠습니다.

<<<<<<< HEAD
함수 실행에 대한 정보는 해당 함수의 *실행 컨텍스트(execution context)* 에 저장됩니다.
=======
The information about the process of execution of a running function is stored in its *execution context*.
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

[실행 컨텍스트](https://tc39.github.io/ecma262/#sec-execution-contexts) 는 함수 실행에 대한 세부 정보를 담고 있는 내부 데이터 구조입니다. 현재 제어 흐름 위치, 변수의 현재 값, (여기선 다루지 않지만) `this`가 참조하는 값 등의 내부 정보가 실행 컨텍스트에 저장됩니다.

함수 호출 일 회당 정확히 하나의 실행 컨텍스트가 생성됩니다.

함수 내부에 중첩 호출이 있는 경우는 다음과 같은 과정이 진행됩니다.

- 현재 함수가 중지됩니다.
- 연관된 실행 컨텍스트는 *실행 컨텍스트 스택(execution context stack)* 이라는 특별한 자료 구조에 저장됩니다.
- 중첩 호출을 실행합니다.
- 중첩 호출이 끝나면, 기존의 실행 컨텍스트를 스택에서 꺼내옵니다. 중지된 함수 흐름이 다시 진행됩니다.

`pow (2, 3)`을 통해 실제 무슨일이 발생하는지 살펴보도록 하겠습니다.

### pow(2, 3)

`pow (2, 3)` 호출이 시작되면 실행 컨텍스트엔 변수 `x = 2, n = 3`이 저장됩니다. 이 때, 실행 흐름의 위치는 함수의 첫번째(`1`) 줄입니다.

이를 도식화 하면 아래와 같습니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 1 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

이 때, 함수의 실행이 본격적으로 시작됩니다. `n == 1` 조건을 통과하지 못하므로, 실행 흐름은 `if`의 두 번째 분기(`else`)에서 이어집니다.

```js run
function pow(x, n) {
  if (n == 1) {
    return x;
  } else {
*!*
    return x * pow(x, n - 1);
*/!*
  }
}

alert( pow(2, 3) );
```


변수는 동일하지만, 실행 흐름의 위치가 변경되었습니다. 따라서 실행 컨텍스트는 다음과 같이 변경됩니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

 `x * pow (x, n - 1)`을 계산하려면 새로운 인수 `pow (2, 2)`로 `pow`의 서브 호출을 만들어야 합니다.

### pow(2, 2)

중첩 호출을 수행하기 위해, 자바스크립트는 *실행 컨텍스트 스택*에 현재 실행 컨텍스트를 저장합니다.

이 예제에선 외부 함수와 동일한 함수 `pow`를 호출하였는데, 이는 크게 중요치 않습니다. 모든 함수에 대해 아래 프로세스가 동일하게 진행됩니다.

1. 스택의 최상단에 현재 컨텍스트가 "기록"됩니다.
2. 서브 호출을 위한 새로운 컨텍스트가 생성됩니다.
3. 서브 호출이 완료되면 기존 컨텍스트를 스택에서 꺼내(pop) 실행을 지속합니다.

다음은 서브 호출 `pow (2, 2)`이 시작될 때의 컨텍스트 스택입니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 2, at line 1 }</span>
    <span class="function-execution-context-call">pow(2, 2)</span>
  </li>
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

새롭게 만들어진 실행 컨텍스트(굵은 테두리로 표시)는 맨 위에, 기존 컨텍스트는 하단부에 있습니다.

서브 호출이 종료되면, 손쉽게 기존 컨텍스트를 다시 재개할 수 있습니다. 두 변수와 중지된 시점의 정확한 실행 흐름 위치를 모두 저장하고 있기 때문입니다. 여기선 박스 안에 "line"이라는 단어를 써 실행 흐름 위치를 표현했지만, 실제론 당연히 더 정밀한 정보가 저장됩니다.  

### pow(2, 1)

동일한 과정이 다시 반복됩니다. 새로운 서브 호출이 다섯번째(`5`) 줄에서 일어났고, 인수는 ` x = 2`,`n = 1`이 되었습니다.

새로운 실행 컨텍스트가 만들어지고, 이전 실행 컨텍스트는 스택 최상단에 올라갑니다(push).

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 1, at line 1 }</span>
    <span class="function-execution-context-call">pow(2, 1)</span>
  </li>
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 2, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 2)</span>
  </li>
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

기존에 생성되었던 컨텍스트가 두 개 있고, `pow (2, 1)`에 상응하는 컨텍스트 하나가 있습니다.

### 실행 종료

`pow (2, 1)`은 `n == 1`조건을 충족시키므로 이전 실행과는 달리 `if`문의 첫 번째 분기에서 흐름이 진행됩니다.

```js
function pow(x, n) {
  if (n == 1) {
*!*
    return x;
*/!*
  } else {
    return x * pow(x, n - 1);
  }
}
```

이제 더는 중첩 호출이 없으므로, 함수는 종료되고 `2`가 반환됩니다.

함수가 종료되었으므로, 이에 상응하는 실행 컨텍스트는 더이상 필요하지 않습니다. 따라서 이 실행 컨텍스트는 메모리에서 제거됩니다. 제거 이후, 그 이전의 실행 컨텍스가 스택 맨 위에서 복원됩니다.


<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 2, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 2)</span>
  </li>
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

`pow (2, 2)`의 실행이 재개됩니다. 서브 호출 `pow (2, 1)`의 결과(2)를 이미 알고 있으므로, 쉽게 `x * pow (x, n - 1)`를 계산할 수 있습니다. `4`가 반환됩니다.

이전 컨텍스트 복원이 다시 진행됩니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

호출이 마무리되고, `pow (2, 3) = 8`이라는 결과를 얻습니다.

이 예제의 경우 재귀 깊이는 **3** 입니다.

위 도식들을 통해 살펴보았듯이, 재귀 깊이는 스택의 최대 컨텍스트 수와 같습니다.

재귀 이용 시, 메모리 사용에 주의해야 합니다. 컨텍스트는 메모리를 사용합니다. `n`번 만큼 곱하려면 `n`이 줄어듦에 따라 만들어지는 `n`개의 컨텍스트를 위한 메모리가 필요합니다.

반복적인 방법에 기반한 알고리즘은 좀 더 메모리 절약해줍니다.

```js
function pow(x, n) {
  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}
```

반복적 알고리즘으로 작성한 함수, `pow`는 단일 컨텍스트 내에서 `i`와 `result`를 변경합니다. 따라서 필요로 하는 메모리 용량은 적으며, `n`과 상관없이 고정됩니다.

**재귀를 이용해 작성한 코드는 반복적인 방법을 사용한 코드로 다시 작성할 수 있습니다. 반복적인 방법으로 변형하면 대게 함수 호출의 비용(메모리 사용) 측면에서 좀 더 효과적입니다.**

하지만 함수 재작성 시 중대한 수정이 필요한 경우가 있습니다. 조건이 여러 개 있고, 이 조건에 따라 다른 재귀 서브 호출을 수행하고 그 결과를 합쳐야 하는 경우가 그렇습니다. 조건문의 분기가 복잡한 경우도 큰 변경이 필요합니다. 최적화와 변경에 들이는 노력이 가치가 있는 경우에만 함수를 재 작성하는 게 좋습니다. 

재귀를 사용하면 코드가 짧아지고 코드 이해도가 높아지며 유지보수에도 이점이 있습니다. 모든 곳에서 메모리 최적화가 필요하지 않고, 좋은 코드를 더 필요로 하기 때문에, 재귀는 자주 사용됩니다.

## 재귀적 순회

재귀적 순회(recursive traversal)를 구현할 때 재귀를 적용하면 좋습니다.

한 회사가 있다고 가정해 봅시다. 임직원을 아래와 같은 객체 구조로 표현할 수 있을 것입니다.

```js
let company = {
  sales: [{
    name: 'John',
    salary: 1000
  }, {
    name: 'Alice',
    salary: 600
  }],

  development: {
    sites: [{
      name: 'Peter',
      salary: 2000
    }, {
      name: 'Alex',
      salary: 1800
    }],

    internals: [{
      name: 'Jack',
      salary: 1300
    }]
  }
};
```

회사는 부서단위로 움직입니다.

- 부서에는 여러 명의 직원이 있을 수 있는데, 이 떄 직원을 배열로 표현합니다. `sales` 부서에 John과 Alice라는 2명의 직원이 있고, 이들을 배열로 표현하였습니다.
- 부서는 하위 부서를 가질 수 있습니다. `development` 부서는 `sites`와 `internals`라는 두 개의 하위 부서를 갖습니다. 각 하위부세어도 직원이 있습니다
- 하위 부서가 커지면 더 작은 단위의 하위 부서(또는 팀)로 나눌 수 있습니다.

    예를 `sites` 부서는 미래에 `siteA` 와 `siteB`로 나뉠 수 있습니다. 이렇게 나눠진 부서가 추후에 더 세분화될수도 있습니다. 위 그림에선 이런 부분까진 나타내지 않았지만, 이러한 가능성도 있다는걸 염두해두시기 바랍니다. 

자, 이제 이 상황에서 모든 임직원의 급여를 더한 값을 구해야 한다고 해봅시다. 어떻게 할 수 있을까요?

구조가 단순하지 않기 때문에 반복적인 방법으로 구하긴 쉽지 않아보입니다. `company`에 `for`루프를, 깊이가 한 단계인 부서에 서브루프를 돌리는걸 생각해 볼 수 있겠네요. 하지만 `sites`같은 깊이가 두 단계인 부서의 임직원에 대한 급여를 계산하려면 중첩 서브르푸가 또 필요합니다. 깊이가 3인 부서가 미래에 나타난다고 가정하면 또 다른 중첩 서브루프가 필요하겠죠. 얼마만큼의 깊이까지 루프문을 만들 수 있을까요? 객체를 순환하는 중첩 서브루프가 3-4개가 되는 순간 코드는 정말 지저분해질 겁니다.

재귀를 이용한 풀이법을 시도해 봅시다.

앞서 본 바와 같이 부서는 크게 두 부류로 나뉩니다

1. *임직원 배열* 을 가진 "단순한" 부서 -- 간단한 반복문으로 급여 합계를 구할 수 있습니다.
2. *N 개의 하위 부서가 있는 객체* -- 각 하위 부서에 속한 급여 합계를 얻기 위해 `N` 번의 회귀 호출을 하고, 최종적으로 모든 하위부서 급여 합계를 합산 합니다.

(1)은 재귀의 base 이며, 사소한 경우입니다.

(2)는 재귀 단계입니다. 복잡한 작업이 작은 작업(하위 부서에 대한 루프)으로 쪼개집니다. 깊이에 따라 더 작은 작업으로 쪼깨 질 수 있는데, 결국 작업은 (1)의 경우에 해당하게 됩니다.

재귀 알고리즘은 코드에서 쉽게 찾아낼 수 있습니다.


```js run
let company = { // 간결성을 위해 약간의 압축을 가미한 동일 객체
  sales: [{name: 'John', salary: 1000}, {name: 'Alice', salary: 600 }],
  development: {
    sites: [{name: 'Peter', salary: 2000}, {name: 'Alex', salary: 1800 }],
    internals: [{name: 'Jack', salary: 1300}]
  }
};

// 합계를 수행하는 함수
*!*
function sumSalaries(department) {
  if (Array.isArray(department)) { // case (1)
    return department.reduce((prev, current) => prev + current.salary, 0); // 배열의 요소를 합함
  } else { // case (2)
    let sum = 0;
    for (let subdep of Object.values(department)) {
      sum += sumSalaries(subdep); // 재귀 호출로 각 하위 부서의 급여 총합을 더함
    }
    return sum;
  }
}
*/!*

alert(sumSalaries(company)); // 6700
```

코드가 좀 더 짧아지고, 이해하기도 쉬워졌습니다. 이것이 재귀를 사용하는 이유입니다. 하위 부서의 깊이와 상관 없이 모든 경우에서 원하는 값을 구할 수 있죠.

다음은 호출에 관한 그림입니다.

![recursive salaries](recursive-salaries.png)

객체 `{...}`를 만나면 서브 호출이 일어나고, 배열 `[...]`이 재귀 트리의 "잎사귀"인 경우 결과값이 바로 계산되는 것을 그림을 통해 다시한번 확인할 수 있습니다.   

이 함수는 이미 학습한 바 있는 기능 두가지를 사용하고 있는 것도 눈여겨 보시기 바랍니다.

- <info:array-methods> 챕터에서 학습한 메서드 `arr.reduce`는 배열의 합을 계산해 줍니다.
- `for(val of Object.values (obj))`에서 쓰인 `Object.values`는 프로퍼티의 값이 담긴 배열을 반환합니다.


## 재귀적인 구조

재귀적으로 정의된 자료구조인 재귀적 자료 구조는 자기자신의 일부를 복제하는 형태의 구조를 가집니다.

예시로 살펴본 회사 조직 역시 재귀적 자료 구조의 형태를 가지고 있습니다.

회사의 *부서* 객체는
- 사람들로 구성된 배열이거나
- 하위 부서로 이뤄진 객체 입니다.

웹 개발자에게 익숙한 HTML과 XML도 재귀적 자료 구조의 형태를 띕니다.

HTML 문서에서 *HTML 태그*는 아래와 같은 항목을 담고있습니다.
- 일반 텍스트
- HTML-주석
- 다른 *HTML 태그* (일반 텍스트, HTML-주석, 다른 HTML 태그가 여기에 담길 수 있습니다).

재귀적으로 정의된 자료구조임이 눈에 보이시죠?

다음은 "연결 리스트(Linked list)"라는 재귀적 자료 구조를 살펴보면서 재귀적 구조에 대해 더 알아보도록 하겠습니다. 연결 리스트는 특정 경우에서 배열의 대안으로 쓰일 수 있는 자료구조입니다.

### 연결 리스트

객체를 정렬하여 어딘가에 저장하고 싶다고 가정해 봅시다.

선택할 수 있는 자료 구조로 아마 배열이 떠올랐을 겁니다.

```js
let arr = [obj1, obj2, obj3];
```

...하지만 배열에는 문제가 있습니다. "요소 삭제" 및 "요소 삽입" 작업이 어렵습니다. 특히 `arr.unshift(obj)` 연산은 새로운 `obj` 를 위한 공간을 만들기 위해 모든 원소의 번호를 다시 지정해야 하고 큰 배열에는 시간이 걸립니다. `arr.shift()` 도 동일합니다.

<<<<<<< HEAD
   큰 비용을 치루지 않고 모두 변경할 수 있는 유일한 방법은`arr.push/pop` 을 사용해 배열의 끝을 이용해 작업하는 것입니다. 여전히 배열은 크면 클수록 상당히 느릴 수 있습니다.
=======
The only structural modifications that do not require mass-renumbering are those that operate with the end of array: `arr.push/pop`. So an array can be quite slow for big queues, when we have to work with the beginning.
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

   빠른 삽입 / 삭제가 정말로 필요한 경우에는 [연결 리스트(Linked List)](https://en.wikipedia.org/wiki/Linked_list) 라는 다른 데이터 구조를 선택할 수 있습니다.

*연결 리스트의 요소* 는 다음과 같이 재귀적인 객체로 정의됩니다.
- `value`.
- `next` 다음 *연결 리스트의 요소*를 참조하는 프로퍼티 또는 끝인 경우 `null`.

예를 들면

```js
let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};
```

리스트를 시각적으로 표현하

![linked list](linked-list.png)

코드로는 다음과 같습니다.

```js no-beautify
let list = { value: 1 };
list.next = { value: 2 };
list.next.next = { value: 3 };
list.next.next.next = { value: 4 };
```

여러 객체가 있는것이 분명해 집니다. 각 객체는 이웃을 가리키는 `value`와 `next`를 가지고 있죠. `list` 변수는 체인의 첫 번째 객체이므로, `next` 포인터를 따라가면 모든 요소에 도달할 수 있습니다.

리스트를 여러 부분으로 쉽게 나눌 수 있으며 다시 합칠 수도 있습니다.

```js
let secondList = list.next.next;
list.next.next = null;
```

![linked list split](linked-list-split.png)

To join:

```js
list.next.next = secondList;
```

확실하게 어디에서나 아이템을 추가하거나 제거할 수 있습니다.

예를 들어 새 값을 앞에 붙이려면 리스트 헤드를 갱신해야 합니다.

```js
let list = { value: 1 };
list.next = { value: 2 };
list.next.next = { value: 3 };
list.next.next.next = { value: 4 };

*!*
// prepend the new value to the list
list = { value: "new item", next: list };
*/!*
```

![linked list](linked-list-0.png)

중간에서 값을 제거하려면 이전 값의 `next`를 변경해야 합니다.

```js
list.next = list.next.next;
```

![linked list](linked-list-remove-1.png)

`list.next`가 `1`을 뛰어넘어서`2` 값을 얻었습니다. 이제 값 `1`이 체인에서 제외됩니다. 다른 곳에 저장되지 않으면 자동으로 메모리에서 제거됩니다.

배열과는 달리, 대량으로 번호 할당하지 않았으므로 요소를 쉽게 재배열할 수 있습니다.

그러나 항상 리스트가 배열보다 낫지는 않습니다. 그렇다면 모두 리스트만 사용하겠죠.

리스트의 가장 큰 단점은 인덱스(번호)로 요소에 쉽게 액세스할 수 없다는 점입니다. 배열에서는 `arr[n]` 처럼 해당요소에 바로 접근할 수 있습니다. 그러나 리스트에서 첫 번째 항목부터 시작하여 N 번째 값을 얻기 위해서는 `next` 를 `N` 번 이동해야 합니다.

<<<<<<< HEAD
...  이렇게 하지않아도 대기열(queue) 또는 [양단 대기열(deque)](https://en.wikipedia.org/wiki/Double-ended_queue) 를 사용해 양 끝의 요소를 매우 빠르게 추가 / 제거할 수 있습니다만

가끔 리스트의 마지막에 `tail`이라는 다른 이름을 사용해서 마지막 요소를 추가하는게 효과적일 수 있습니다. (그리고 끝에서 요소를 추가하거나 제거할때 업데이트 합니다). 여전히 큰 요소들로 구성되었을때 배열과 리스트의 속도차이는 큽니다.
=======
...But we don't always need such operations. For instance, when we need a queue or even a [deque](https://en.wikipedia.org/wiki/Double-ended_queue) -- the ordered structure that must allow very fast adding/removing elements from both ends, but access to its middle is not needed.

Lists can be enhanced:
- We can add property `prev` in addition to `next` to reference the previous element, to move back easily.
- We can also add a variable named `tail` referencing the last element of the list (and update it when adding/removing elements from the end).
- ...The data structure may vary according to our needs.
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

## 요약

<<<<<<< HEAD
용어:
- *재귀* 는 "자체 호출" 을 의미하는 프로그래밍 용어다. 재귀를 사용하여 특정 작업을 더 멋진 방식으로 해결할 수 있다.
=======
Terms:
- *Recursion*  is a programming term that means calling a function from itself. Recursive functions can be used to solve tasks in elegant ways.
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

    함수가 자신을 호출할 때 *재귀 단계* 라고 한다. 재귀의 *base* 은 함수를 더 간단하게 만들어서 함수가 더 호출하지 못 하는 단계의 함수 인수이다.

- [재귀적으로 정의된](https://en.wikipedia.org/wiki/Recursive_data_type) 데이터 구조는 자체적으로 정의할 수 있는 데이터 구조이다.

    예를 들어 연결 리스트는 목록을 참조하는 객체 (또는 null)로 구성된 데이터 구조로 정의될 수 있다.

    ```js
    list = {value, next -> list}
    ```

    여기서 다룬 HTML 요소 또는 회사부서 와 같은 구조도 일반적인 재귀적인 구조이다. 가지고 있는 모든 분기마다 다른 분기를 가질 수 있기 때문이다.

    이 장에서는 재귀적인 함수 `sumSalary` 를 사용하여 그 분기를 순차적으로 진행하는 방법을 살펴보았습니다.

모든 재귀 함수는 반복적인 함수로 다시 작성할 수 있습니다. 재귀적인 함수는 최적화를 요구하지만 많은 작업에서 재귀적인 접근법은 더 빠르고 쉽게 작성할 수 있고 유지보수가 수월한 코드를 제공합니다. 