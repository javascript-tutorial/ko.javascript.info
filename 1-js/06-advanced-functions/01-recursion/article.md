# 재귀와 스택

함수에 대해 좀 더 깊이 알아보도록 하겠습니다.

함수 심화학습, 첫 번째 주제는 *재귀(recursion)* 입니다.

프로그래밍을 새롭게 학습하는 초심자가 아니라 이 주제에 익숙하시다면, 본 챕터를 건너뛰어도 괜찮습니다.

재귀는 큰 목표 작업 하나를 동일하면서 간단한 작업 여러 개로 나눌 수 있을 때 유용한 프로그래밍 패턴입니다. 목표 작업을 간단한 동작 하나와 목표 작업을 변형한 작업으로 단순화시킬 수 있을 때도 재귀를 사용할 수 있습니다. 곧 살펴보겠지만, 특정 자료구조를 다뤄야 할 때도 재귀가 사용됩니다.

함수는 문제 해결을 위해 작업 수행 과정에서 다른 추가 함수를 호출할 때가 있습니다. 이때 함수가 *자기 자신*을 호출할 수도 있는데, 이를 *재귀* 라고 부릅니다.

## 두 가지 사고방식

간단한 예시를 시작으로 재귀에 대해 알아보겠습니다. `x`를 `n` 제곱해 주는 함수 `pow(x, n)`를 만들어봅시다. 함수는 `x`를 `n`번 곱해주기 때문에 아래 결과를 만족해야 합니다.

```js
pow(2, 2) = 4
pow(2, 3) = 8
pow(2, 4) = 16
```

구현하는 방법은 두 가지가 있습니다.

1. 반복적인 사고를 통한 방법: `for` 루프

    ```js run
    function pow(x, n) {
      let result = 1;

      // 반복문을 돌면서 x를 n번 곱함
      for (let i = 0; i < n; i++) {
        result *= x;
      }

      return result;
    }

    alert( pow(2, 3) ); // 8
    ```

2. 재귀적인 사고를 통한 방법: 작업을 단순화하고 자기 자신을 호출함

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

재귀를 이용한 예시가 반복문을 사용한 예시와 어떤 부분에서 근본적인 차이가 있는지 유심히 살펴보시기 바랍니다.

`pow (x, n)`을 호출하면 아래와 같이 두 갈래로 나뉘어 코드가 실행됩니다.

```js
              if n==1  = x
             /
pow(x, n) =
             \
              else     = x * pow(x, n - 1)
```

1. `n == 1`일 때: 모든 절차가 간단해집니다. 명확한 결괏값을 즉시 도출하므로 이를 *재귀의 베이스(base)* 라고 부릅니다. `pow(x, 1)`는 `x` 입니다.
2. `n == 1`이 아닐 때: `pow(x, n)`를 `x * pow(x, n - 1)`로 표현할 수 있습니다. 수학식으론 <code>x<sup>n</sup> = x * x<sup>n-1</sup></code>로 표현할 수 있겠죠. 이를 *재귀 단계(recursive step)* 라고 부릅니다. 여기선 목표 작업 `pow(x, n)`을 간단한 동작(`x`를 곱하기)과 목표 작업을 변형한 작업(`pow(x, n - 1)`)으로 분할하였습니다. 재귀 단계는 `n`이 `1`이 될 때까지 계속 이어집니다.

`pow`는 `n == 1`이 될 때까지 *재귀적으로 자신을 호출*하게 되죠.

![recursive diagram of pow](recursion-pow.svg)


`pow (2, 4)`를 계산하려면 아래와 같은 재귀 단계가 차례대로 이어집니다.

1. `pow(2, 4) = 2 * pow(2, 3)`
2. `pow(2, 3) = 2 * pow(2, 2)`
3. `pow(2, 2) = 2 * pow(2, 1)`
4. `pow(2, 1) = 2`

이렇게 재귀를 이용하면 함수 호출의 결과가 명확해질 때까지 함수 호출을 더 간단한 함수 호출로 계속 줄일 수 있습니다.

````smart header="재귀를 사용한 코드는 짧습니다."
재귀를 사용한 코드는 반복적 사고에 근거하여 작성한 코드보다 대개 짧습니다.

`if`를 사용하는 대신 조건부 연산자 `?`를 사용하면 `pow (x, n)`를 더 간결하고 읽기 쉽게 만들 수도 있습니다.

```js run
function pow(x, n) {
  return (n == 1) ? x : (x * pow(x, n - 1));
}
```
````

가장 처음 하는 호출을 포함한 중첩 호출의 최대 개수는 *재귀 깊이(recursion depth)* 라고 합니다. `pow(x, n)`을 구현한 예시의 재귀 깊이는 `n`입니다.

자바스크립트 엔진은 최대 재귀 깊이를 제한합니다. 만개 정도까진 확실히 허용되는데, 엔진에 따라 이보다 더 많은 깊이를 허용하는 경우도 있습니다. 하지만 대다수의 엔진이 십만까지는 다루지 못합니다. 이런 제한을 완화하려고 엔진 내부에서 자동으로 'tail calls optimization'라는 최적화를 수행하긴 하지만, 이 최적화가 모든 곳에 적용되는 것은 아니고 간단한 경우에만 적용됩니다. 

재귀 깊이 제한 때문에 재귀를 실제 적용하는데 제약이 있긴 하지만, 재귀는 여전히 광범위하게 사용되고 있습니다. 재귀적 방법을 사용하면, 간결하고 유지보수가 쉬운 코드를 만들 수 있기 때문입니다.

## 실행 컨텍스트와 스택

실제 재귀 호출이 어떻게 동작하는지 알아봅시다. 이를 위해서 함수의 내부 동작에 대해 살펴보도록 하겠습니다.

실행 중인 함수의 실행 절차에 대한 정보는 해당 함수의 *실행 컨텍스트(execution context)* 에 저장됩니다.

[실행 컨텍스트](https://tc39.github.io/ecma262/#sec-execution-contexts)는 함수 실행에 대한 세부 정보를 담고 있는 내부 데이터 구조입니다. 제어 흐름의 현재 위치, 변수의 현재 값, `this`의 값(여기선 다루지 않음) 등 상세 내부 정보가 실행 컨텍스트에 저장됩니다.

함수 호출 일 회당 정확히 하나의 실행 컨텍스트가 생성됩니다.

함수 내부에 중첩 호출이 있을 때는 아래와 같은 절차가 수행됩니다.

- 현재 함수의 실행이 일시 중지됩니다.
- 중지된 함수와 연관된 실행 컨텍스트는 *실행 컨텍스트 스택(execution context stack)* 이라는 특별한 자료 구조에 저장됩니다.
- 중첩 호출이 실행됩니다.
- 중첩 호출 실행이 끝난 이후 실행 컨텍스트 스택에서 일시 중단한 함수의 실행 컨텍스트를 꺼내오고, 중단한 함수의 실행을 다시 이어갑니다.

`pow (2, 3)`가 호출되면 무슨 일이 일어나는지 살펴봅시다.

### pow(2, 3)

`pow (2, 3)`를 호출하는 순간, 실행 컨텍스트엔 변수 `x = 2, n = 3`이 저장되고, 실행 흐름은 함수의 첫 번째 줄에 위치합니다.

이를 도식화하면 다음과 같습니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, 첫 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

위 그림은 함수 실행이 시작되는 순간을 나타낸 것입니다. 그런데 이때 조건 `n == 1`이 false이므로, 실행 흐름은 `if`의 두 번째 분기에서 이어집니다.

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


변수는 동일하지만, 실행 흐름의 위치가 변경되면서 실행 컨텍스트도 다음과 같이 변경됩니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, 다섯 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

 `x * pow (x, n - 1)`을 계산하려면 새로운 인수가 들어가는 `pow`의 서브 호출(subcall), `pow (2, 2)`을 만들어야 합니다.

### pow(2, 2)

중첩 호출을 하기 위해, 자바스크립트는 *실행 컨텍스트 스택(execution context stack)* 에 현재 실행 컨텍스트를 저장합니다.

예시에선 동일한 함수 `pow`를 호출하였는데, 이는 중요치 않습니다. 모든 함수에 대해 아래 프로세스가 동일하게 적용됩니다.

1. 스택 최상단에 현재 컨텍스트가 '기록'됩니다.
2. 서브 호출을 위한 새로운 컨텍스트가 만들어집니다.
3. 서브 호출이 완료되면. 기존 컨텍스트를 스택에서 꺼내(pop) 실행을 이어나갑니다.

다음은 서브 호출 `pow (2, 2)`이 시작될 때의 실행 컨텍스트 스택입니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 2, 첫 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 2)</span>
  </li>
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, 다섯 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

굵은 테두리로 표시한 새 실행 컨텍스트는 상단에, 기존 컨텍스트는 하단에 있습니다.

이전 컨텍스트에 변수와 코드가 일시 중단된 줄이 어디인지 저장되어있기 때문에 서브 호출이 끝났을 때 이전 컨텍스트를 다시 시작하기 쉽습니다. 

```smart
예시엔 한 줄에 서브 호출 하나만 있기 때문에, 그림에서 '줄'이라는 단어를 사용했습니다. 하지만 한 줄에는 `pow(…) + pow(…) + somethingElse(…)` 같이 복수의 서브 호출이 있을 수 있습니다.

따라서 좀 더 정확히는 실행이 '서브 호출 바로 직후'에 시작된다고 이야기 할 수 있습니다.
```

### pow(2, 1)

동일한 과정이 다시 반복됩니다. 다섯 번째 줄에서 인수 ` x = 2`, `n = 1`과 함께 새로운 서브 호출이 만들어집니다.

새로운 실행 컨텍스트가 만들어지고, 이전 실행 컨텍스트는 스택 최상단에 올라갑니다(push).

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 1, 첫 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 1)</span>
  </li>
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 2, 다섯 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 2)</span>
  </li>
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, 다섯 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

기존 컨텍스트 두 개와 `pow (2, 1)`에 상응하는 컨텍스트 하나가 있는 것을 확인할 수 있습니다.

### 실행 종료

`pow (2, 1)`가 실행되는 동안엔 이전과는 달리 조건 `n == 1`이 truthy이므로 `if`문의 첫 번째 분기가 동작합니다.

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

이제 중첩 호출이 더는 없으므로, 함수는 종료되고 `2`가 반환됩니다.

함수가 종료되었기 때문에 이에 상응하는 실행 컨텍스트는 더이상 필요하지 않습니다. 따라서 실행 컨텍스트는 메모리에서 삭제됩니다. 그리고 이전의 실행 컨텍스가 스택 맨 위로 복원됩니다.


<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 2, 다섯 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 2)</span>
  </li>
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, 다섯 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

`pow (2, 2)`의 실행이 다시 시작됩니다. 서브 호출 `pow (2, 1)`의 결과를 알고 있으므로, 쉽게 `x * pow (x, n - 1)`를 계산해 `4`를 반환합니다.

그리고 다시 이전 컨텍스트가 복원됩니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, 다섯 번째 줄 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

마지막 실행 컨텍스트까지 처리되면 `pow (2, 3) = 8`이라는 결과를 갖게 됩니다.

이 예시의 재귀 깊이는 **3** 입니다.

도식을 통해 살펴보았듯이, 재귀 깊이는 스택에 들어가는 실행 컨텍스트 수의 최댓값과 같습니다.

실행 컨텍스트는 메모리를 차지하므로 메모리 요구사항에 유의해야 합니다. 거듭제곱 횟수인 `n`을 늘리면 `n`이 줄어들 때마다 만들어지는 `n`개의 실행 컨텍스트를 저장할 메모리 공간이 필요합니다.

반복문 기반 알고리즘은 좀 더 메모리를 절약해줍니다.

```js
function pow(x, n) {
  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}
```

반복을 사용해 만든 함수 `pow`는 컨텍스트를 하나만 사용합니다. 이 컨텍스트에서 `i`와 `result`가 변경됩니다. 실행 컨텍스트가 하나이기 때문에 `n`에 의존적이지 않고, 필요한 메모리가 적고 사용 메모리 공간도 고정됩니다.  Its memory requirements are small, fixed and do not depend on n.

**재귀를 이용해 작성한 코드는 반복문을 사용한 코드로 다시 작성할 수 있습니다. 반복문을 사용하면 대게 함수 호출의 비용(메모리 사용)이 절약됩니다.**

하지만 코드를 다시 작성해도 큰 개선이 없는 경우가 있습니다. 조건에 따라 함수가 다른 재귀 서브 호출을 하고 그 결과를 합칠 때가 그렇습니다. 분기문이 복잡하게 얽혀있을 때도 그렇죠. 이런 경우엔 최적화기 필요하지 않을 수 있고 최적화에 드는 노력이 무용지물일 수 있습니다.

재귀를 사용하면 코드가 짧아지고 코드 이해도가 높아지며 유지보수에도 이점이 있습니다. 모든 곳에서 메모리 최적화를 신경 써서 코드를 작성해야 만 하는 것은 아닙니다. 우리가 필요한 것은 좋은 코드입니다. 이런 이유 때문에 재귀를 사용합니다.

## 재귀적 순회

재귀는 재귀적 순회(recursive traversal)를 구현할 때 사용하면 좋습니다.

한 회사가 있다고 가정해 봅시다. 임직원을 아래와 같이 객체로 표현해 보았습니다.

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

회사엔 부서가 있습니다.

- 부서에는 여러 명의 직원이 있는데, 이를 배열로 표현할 수 있습니다. `sales` 부서의 John과 Alice라는 2명의 직원을 배열 요소로 표현해 보았습니다.
- 부서는 하위 부서를 가질 수 있습니다. `development` 부서는 `sites`와 `internals`라는 두 개의 하위 부서를 갖습니다. 각 하위부서에도 직원이 있습니다.
- 하위 부서가 커지면 더 작은 단위의 하위 부서(또는 팀)로 나눌 수 있습니다.

    `sites` 부서는 미래에 `siteA`와 `siteB`로 나뉠 수 있습니다. 이렇게 나눠진 부서가 미래에 더 세분화될 수도 있죠. 미래에 벌어질 일까진 나타내지 않았지만, 이러한 가능성도 있다는걸 염두에 두어야 합니다.

자, 이제 모든 임직원의 급여를 더한 값을 구해야 한다고 해봅시다. 어떻게 할 수 있을까요?

구조가 단순하지 않기 때문에 반복문을 사용해선 구하기 쉽지 않아 보입니다. 가장 먼저 떠오르는 생각은 `company`를 대상으로 동작하는 `for` 반복문을 만들고 한 단계 아래의 부서에 중첩 반복문를 돌리는 것일 겁니다. 그런데 이렇게 하면 `sites` 같은 두 단계 아래의 부서에 속한 임직원의 급여를 뽑아낼 때 또 다른 중첩 반복문이 필요합니다. 세 단계 아래의 부서가 미래에 만들어진다고 가정하면 또 다른 중첩 반복문이 필요하겠죠. 얼마만큼의 깊이까지 중첩 반복문을 만들 수 있을까요? 객체를 순회하는 중첩 반복문의 깊이가 3~4개가 되는 순간 코드는 정말 지저분해질 겁니다.

재귀를 이용한 풀이법을 시도해 봅시다.

앞서 본 바와 같이 임직원 급여 합계를 구할 때 두 가지 경우가 존재합니다.

1. 임직원 *배열* 을 가진 '단순한' 부서 -- 간단한 반복문으로 급여 합계를 구할 수 있습니다.
2. `N`개의 하위 부서가 있는 *객체* -- 각 하위 부서에 속한 임직원의 급여 합계를 얻기 위해 `N`번의 재귀 호출을 하고, 최종적으로 모든 하위부서 임직원의 급여를 더합니다.

배열을 사용하는 첫 번째 경우는 간단한 경우로, 재귀의 베이스가 됩니다.

객체를 사용하는 두 번째 경우는 재귀 단계가 됩니다. 복잡한 작업이 작은 작업(하위 부서에 대한 반복문)으로 쪼개지죠. 부서의 깊이에 따라 더 작은 작업으로 쪼개 질 수 있는데, 결국 마지막엔 첫 번째 경우가 됩니다.

코드를 직접 읽어보면서 재귀 알고리즘을 이해해봅시다.


```js run
let company = { // 동일한 객체(간결성을 위해 약간 압축함)
  sales: [{name: 'John', salary: 1000}, {name: 'Alice', salary: 600 }],
  development: {
    sites: [{name: 'Peter', salary: 2000}, {name: 'Alex', salary: 1800 }],
    internals: [{name: 'Jack', salary: 1300}]
  }
};

// 급여 합계를 구해주는 함수
*!*
function sumSalaries(department) {
  if (Array.isArray(department)) { // 첫 번째 경우
    return department.reduce((prev, current) => prev + current.salary, 0); // 배열의 요소를 합함
  } else { // 두 번째 경우
    let sum = 0;
    for (let subdep of Object.values(department)) {
      sum += sumSalaries(subdep); // 재귀 호출로 각 하위 부서 임직원의 급여 총합을 구함
    }
    return sum;
  }
}
*/!*

alert(sumSalaries(company)); // 6700
```

짧고 이해하기 쉬운 코드로 원하는 기능을 구현하였습니다. 재귀의 강력함이 여기에 있죠. 하위 부서의 깊이와 상관없이 원하는 값을 구할 수 있습니다.

아래는 호출이 어떻게 일어나는지를 나타낸 그림입니다.

![recursive salaries](recursive-salaries.svg)

그림에서 규칙을 쉽게 확인할 수 있습니다. 객체 `{...}`를 만나면 서브 호출이 만들어지는 반면, 배열 `[...]`을 만나면 더 이상의 서브 호출이 만들어지지 않고 결과가 바로 계산됩니다.

함수 내부에선 이미 학습한 바 있는 기능 두 가지를 사용하고 있는 것도 눈여겨보시기 바랍니다.

- <info:array-methods> 챕터에서 학습한 메서드 `arr.reduce`는 배열의 합을 계산해 줍니다.
- `for(val of Object.values (obj))`에서 쓰인 `Object.values`는 프로퍼티의 값이 담긴 배열을 반환합니다.


## 재귀적 구조

재귀적으로 정의된 자료구조인 재귀적 자료 구조는 자기 자신의 일부를 복제하는 형태의 자료 구조입니다.

위에서 살펴본 회사 구조는 재귀적 자료 구조 형태입니다.

회사의 *부서* 객체는 두 가지 종류로 나뉩니다.
- 사람들로 구성된 배열
- 하위 부서로 이루어진 객체

웹 개발자에게 익숙한 HTML과 XML도 재귀적 자료 구조 형태를 띱니다.

HTML 문서에서 *HTML 태그*는 아래와 같은 항목으로 구성될 수 있습니다.
- 일반 텍스트
- HTML-주석
- 이 외의 *HTML 태그* (일반 텍스트, HTML-주석, 다른 HTML 태그가 하위 항목이 될 수 있음)

이렇게 다양한 곳에서 재귀적으로 정의된 자료구조가 쓰입니다.

다음은 '연결 리스트(linked list)'라는 재귀적 자료 구조를 살펴보면서 재귀적 구조에 대해 더 알아보도록 하겠습니다. 몇몇 상황에서 배열 대신 연결 리스트를 사용하면 더 좋은 경우가 있습니다.

### 연결 리스트

객체를 정렬하여 어딘가에 저장하고 싶다고 가정해 봅시다.

가장 먼저 떠오르는 자료 구조는 아마 배열일 겁니다.

```js
let arr = [obj1, obj2, obj3];
```

하지만 배열은 요소 '삭제'와 '삽입'에 들어가는 비용이 많이 든다는 문제가 있습니다. `arr.unshift(obj)` 연산을 수행하려면 새로운 `obj`를 위한 공간을 만들기 위해 모든 요소의 번호를 다시 매겨야 하죠. 배열이 커지면 연산 수행 시간이 더 걸리게 됩니다. `arr.shift()`를 사용할 때도 마찬가지입니다.

요소 전체의 번호를 다시 매기지 않아도 되는 조작은 배열 끝에 하는 연산인 `arr.push/pop` 뿐이죠. 앞쪽 요소에 무언가를 할 때 배열은 이처럼 꽤 느립니다.

   빠르게 삽입 혹은 삭제를 해야 할 때는 배열 대신 [연결 리스트(linked list)](https://en.wikipedia.org/wiki/Linked_list)라 불리는 자료 구조를 사용할 수 있습니다.

*연결 리스트 요소(linked list element)* 는 객체와 아래 프로퍼티들을 조합해 정의할 수 있습니다.
- `value`
- `next`: 다음 *연결 리스트 요소*를 참조하는 프로퍼티로 다음 요소가 없을 땐 `null`임

예시:

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

위 예시의 연결 리스트를 그림으로 표현하면 다음과 같습니다.

![linked list](linked-list.svg)

위 예시 대신 아래처럼 코드를 작성해도 동일한 연결 리스트를 만들 수 있습니다.

```js no-beautify
let list = { value: 1 };
list.next = { value: 2 };
list.next.next = { value: 3 };
list.next.next.next = { value: 4 };
```

이렇게 연결 리스트를 만드니 객체 가 여러개 있고, 각 객체엔 `value`와 이웃 객체를 가리키는 `next` 프로퍼티가 있는 게 명확히 보이네요. 변수 `list`는 체인의 시작 객체이기 때문에 `list`에선 이어지는 객체들의 `next` 프로퍼티를 이용해 원하는 객체 어디든 도달할 수 있습니다.

연결 리스트를 사용하면 전체 리스트를 여러 부분으로 쉽게 나눌 수 있고, 다시 합치는 것도 가능합니다.

```js
let secondList = list.next.next;
list.next.next = null;
```

![linked list split](linked-list-split.svg)

합치기:

```js
list.next.next = secondList;
```

그리고 당연히 요소를 추가하거나 삭제하기도 쉽습니다,

예를 들어 맨 앞에 새로운 값을 추가하려면 리스트의 처음 객체를 갱신하면 됩니다.

```js
let list = { value: 1 };
list.next = { value: 2 };
list.next.next = { value: 3 };
list.next.next.next = { value: 4 };

*!*
// list에 새로운 value를 추가합니다.
list = { value: "new item", next: list };
*/!*
```

![linked list](linked-list-0.svg)

중간 요소를 제거하려면 이전 요소의 `next`를 변경해주면 됩니다.

```js
list.next = list.next.next;
```

![linked list](linked-list-remove-1.svg)

`list.next`가 `1`이 아닌 `2`를 `value`로 갖는 객체를 가리키게 만들어보았습니다. 이제 `value` `1`은 체인에서 제외됩니다. 이 객체는 다른 곳에 따로 저장하지 않으면 자동으로 메모리에서 제거됩니다.

지금까지 살펴본 바와 같이 연결 리스트는 배열과는 달리 대량으로 요소 번호를 재할당하지 않으므로 요소를 쉽게 재배열할 수 있습니다.

물론 연결 리스트가 항상 배열보다 우월하지는 않습니다. 그렇지 않았다면 모든 사람들이 연결 리스트만 사용했겠죠.

연결 리스트의 가장 큰 단점은 번호(인덱스)만 사용해 요소에 쉽게 접근할 수 없다는 점입니다. 배열을 사용하면 `arr[n]`처럼 번호 `n`만으로도 원하는 요소에 바로 접근할 수 있습니다. 그러나 연결 리스트에선 N번째 값을 얻으려면 첫 번째 항목부터 시작해 `N`번 `next`로 이동해야 합니다.

그런데 중간에 요소를 삽입하거나 삭제하는 연산이 항상 필요한 것은 아닙니다. 이럴 땐 순서가 있는 자료형 중에 큐(queue)나 [데크(deque)](https://en.wikipedia.org/wiki/Double-ended_queue)를 사용할 수 있습니다. 데크를 사용하면 양 끝에서 삽입과 삭제를 빠르게 수행할 수 있습니다.

한편, 리스트는 아래와 같은 기능을 더해 개선할 수 있습니다.
- 이전 요소를 참조하는 프로퍼티 `prev`를 추가해 이전 요소로 쉽게 이동하게 할 수 있습니다.
- 리스트의 마지막 요소를 참조하는 변수 `tail`를 추가할 수 있습니다. 다만 이때 주의할 점은 리스트 마지막에 요소를 추가하거나 삭제할 때 `tail`도 갱신해 줘야 합니다.
- 이 외에도 요구사항에 따라 구조를 변경할 수 있습니다.

## 요약

용어 정리:
- *재귀(recursion)* -- 함수 내부에서 자기 자신을 호출하는 것을 나타내는 프로그래밍 용어입니다. 재귀 함수는 우아하게 원하는 문제를 해결할 때 자주 쓰이곤 합니다.

    함수가 자신을 호출하는 단계를 *재귀 단계(recursion step)* 라고 부릅니다. basis라고도 불리는 재귀의 *베이스(base)* 는 작업을 아주 간단하게 만들어서 함수가 더 이상은 서브 호출을 만들지 않게 해주는 인수입니다.

- [재귀적으로 정의된](https://en.wikipedia.org/wiki/Recursive_data_type) 자료 구조는 자기 자신을 이용해 자료 구조를 정의합니다.

    예를 들어 연결 리스트는 리스트(혹은 null)를 참조하는 객체로 이루어진 데이터 구조를 사용해 정의하게 됩니다.

    ```js
    list = {value, next -> list}
    ```

    HTML 문서의 HTML 요소 트리나 위에서 다룬 부서를 나타내는 트리 역시 재귀적인 자료 구조로 만들었습니다. 이렇게 재귀적인 자료 구조를 사용하면 가지가 여러 개인데 각 가지는 여러 가지로 뻗쳐 나가는 형식으로 자료 구조를 만들 수 있습니다.

    예시에서 구현한 `sumSalary`같은 재귀 함수를 사용하면 각 분기(가지)를 순회할 수 있습니다.

모든 재귀 함수는 반복문을 사용한 함수로 다시 작성할 수 있습니다. 최적화를 위해 이런 과정이 종종 필요할 때도 있죠. 그러나 상당수 작업은 재귀적 해결책을 사용해야 더 빠르고, 작성과 유지보수가 쉬워집니다.