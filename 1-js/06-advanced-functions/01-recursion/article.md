# 재귀와 스택

함수로 돌아가서 조금 더 깊이 공부해봅시다.

첫번째 주제는 *재귀* 입니다.

만약 프로그램에 새로 입문하지 않았고, 아마도 이것과 익숙하다면 이 챕터는 건너뛰어도 좋습니다.

재귀는 프로그래밍 패턴중에 하나이며 작업이 자연스럽게 여러가지 비슷한 과정으로 나누어질수 있을때 유용합니다, 그리고 더 간단하죠. 또는 과제가 쉬운행동과 동일한 작업으로 더 단순화될수있을때. 또는, 곧 볼 수 있듯이 특정 데이터 구조를 다룰 수 있습니다.
함수가 작업을 해결할 때 프로세스에서 다른 많은 함수를 호출 할 수 있습니다. 이것의 부분적인 경우는 함수가 *자체* 를 호출 할 때입니다. 그것을 *재귀* 라고 부릅니다.

## 두 가지 사고 방식

간단한 시작을 위해 -`pow` (x, n) 함수를 작성하여`x`를`n`의 제곱으로 올리십시오. 즉, 'x'자체를 'n'배 곱합니다.

```js
pow(2, 2) = 4
pow(2, 3) = 8
pow(2, 4) = 16
```

그것을 구현하는 두 가지 방법이 있습니다.

1. 반복적 사고: the `for` loop:

    ```js run
    function pow(x, n) {
      let result = 1;

      // multiply result by x n times in the loop
      for (let i = 0; i < n; i++) {
        result *= x;
      }

      return result;
    }

    alert( pow(2, 3) ); // 8
    ```

2. 재귀적 사고: 작업을 단순화하고 스스로를 부르기:

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

재귀 변형이 근본적으로 다른 점에 유의하십시오.

`pow (x, n)`이 호출되면, 실행은 두 개의 분기로 나누어집니다:

```js
              if n==1  = x
             /
pow(x, n) =
             \
              else     = x * pow(x, n - 1)
```

1. 만약 `n == 1` 이면, 모든 것이 무시된다. 이것을 *재귀의 바탕* 이라고 부릅니다, 왜냐하면 그것은 `pow(x, 1)` 가 `x` 와 같다는 결과를 즉시 생성하기 때문입니다.
2. 그렇지 않으면`pow(x, n)`을`x * pow(x, n - 1)`로 표현할 수 있습니다. 수학에서는, 이렇게 쓸 수 있습니다. <code>x<sup>n</sup> = x * x<sup>n-1</sup></code>.
이것을 *재귀적 단계* 라고 부릅니다: 우리는 작업을보다 단순한 동작 (`x`에 의한 곱셈)으로 바꾸고 동일한 작업을 더 간단히 호출합니다 (더 낮은 `n` 을 가진 `pow`).
다음 단계는 'n'이 '1'이 될 때까지 더 간소화합니다.

`pow` 가 `n == 1`까지 재귀적으로 호출되었다고 말할 수 있습니다.

![recursive diagram of pow](recursion-pow.png)


예를 들어, `pow (2, 4)`를 계산하기 위해서 재귀적 변수들은 다음 단계들을 수행합니다:

1. `pow(2, 4) = 2 * pow(2, 3)`
2. `pow(2, 3) = 2 * pow(2, 2)`
3. `pow(2, 2) = 2 * pow(2, 1)`
4. `pow(2, 1) = 2`

그래서, 재귀는 함수 호출을 단순한 함수 호출로 축소시킨다음 결과가 명백해질 때까지 더 간단하게 처리합니다.

````smart header="재귀는 보통 짧습니다"
재귀적 해결법은 대개 반복적 해결법보다 짧습니다.

여기서 `pow (x, n)` 을 `if` 대신에 `?` 연산자를 사용하여 같은 것을 더 간결하면서도 매우 읽기 쉽도록 다시 쓸 수 있습니다:

```js run
function pow(x, n) {
  return (n == 1) ? x : (x * pow(x, n - 1));
}
```
````

중첩 된 호출 (첫 번째 호출 포함)의 최대 개수는 *재귀 깊이* 라고합니다. 정확히 `n`.

최대 재귀 깊이는 JavaScript 엔진에 의해 제한됩니다. 우리는 약 10000 까지를 만들 수 있습니다. 일부 엔진은 더 많은 것을 허용하지만,
대다수 엔진의 경우 100000은 아마도 한계를 벗어날 것입니다. 이 문제를 완화하는 데 도움이되는 자동 최적화가 있지만 ( "tail calls optimizations"), 아직 모든 곳에서 지원되지 않고 단순한 경우에만 작동합니다.

이것은 재귀의 적용을 제한하지만 여전히 매우 광범위합니다. 많은 작업들은 재귀적 사고 방식이 단순한 코드를 제공하고 유지 보수하기 쉽게 만듭니다.

## 실행 스택

이제 재귀 호출이 어떻게 작동하는지 살펴 보겠습니다. 이를 위해 함수의 가려진 부분을 살펴볼 것입니다.

함수 실행에 대한 정보는 해당 *실행 컨텍스트* 에 저장됩니다.

The [execution contex](https://tc39.github.io/ecma262/#sec-execution-contexts) is 함수의 실행에 대한 세부 사항을 포함하는 내부 데이터 구조 : 제어 흐름이 현재의 변수, `this`의 값 (여기서는 사용하지 않음) 및 다른 몇 가지 내부 세부 사항.

하나의 함수 호출에는 정확히 하나의 실행 컨텍스트가 연결되어 있습니다.

함수가 중첩 호출을하면 다음과 같은 일이 발생합니다:

- 현재 Function 이 중지된다.
- 이와 관련된 실행 컨텍스트는 *실행 컨텍스트 스택* 이라는 특수 데이터 구조로 기억됩니다.
- 중첩 된 호출이 실행됩니다.
- 그것이 끝난 후 스택에서 이전 실행 컨텍스트를 검색하고 중지 된 위치에서 외부 함수를 다시 시작합니다.

`pow (2, 3)` 호출 중에 어떤 일이 일어나는지 살펴보겠습니다.

### pow(2, 3)

`pow (2, 3)` 호출의 시작 부분에서 실행 컨텍스트는 변수를 저장합니다 :`x = 2, n = 3`, 실행 흐름은 함수의 `1` 라인에 있습니다.

우리는 그것을 다음과 같이 스케치 할 수 있습니다 :

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 1 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

그 때 함수가 실행되기 시작합니다. `n == 1` 조건은 거짓이므로, 흐름은`if`의 두 번째 분기로 계속됩니다 :

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

변수는 동일하지만 행이 변경되므로 컨텍스트가 다음과 같습니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

`x * pow (x, n - 1)`을 계산하려면, 새로운 인수 `pow (2, 2) `로 `pow`의 서브 콜을 만들어야합니다.

### pow(2, 2)

중첩 호출을 수행하기 위해 JavaScript는 * 실행 컨텍스트 스택 *에서 현재 실행 컨텍스트를 기억합니다.

여기서 우리는 동일한 함수`pow`를 호출하지만 절대적으로 중요하지 않습니다. 프로세스는 모든 기능에 대해 동일합니다.

1. 현재 컨텍스트가 스택 맨 위에 "기억"됩니다.
2. 새 A 텍스트가 서브 콜용으로 작성됩니다.
3. 하위 호출이 완료되면 이전 컨텍스트가 스택에서 팝되고 실행이 계속됩니다.

하위 호출`pow (2, 2)`에 들어갔을 때 컨텍스트 스택이 있습니다 :

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

새로운 현재 실행 컨텍스트가 맨 위 (굵은 체)에 있으며 이전에 기억 된 컨텍스트가 아래에 있습니다.

subcall을 마치면 이전 컨텍스트를 다시 시작하는 것이 쉽습니다. 왜냐하면 변수와 중지 된 코드의 정확한 위치를 모두 유지하기 때문입니다. 여기 사진에서 우리는 "선"이라는 단어를 사용하지만, 물론 더 정확합니다.

### pow(2, 1)

프로세스는 다음과 같이 반복됩니다 : 새로운 서브 콜이 행`5`에서 만들어 졌는데, 이제는`x = 2`,`n = 1`을 인수로 사용합니다.

새 실행 컨텍스트가 만들어지고, 이전 실행 컨텍스트가 스택 맨 위에 푸시됩니다.

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

현재 2 개의 구 컨텍스트가 있고`pow (2, 1)`로 현재 실행중인 컨텍스트가 1 개 있습니다.

### The exit

`pow (2, 1)`을 실행하는 동안 이전과 달리`n == 1` 조건은 진실이므로 `if`의 첫 번째 분기가 작동합니다 :

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

더 이상 중첩 된 호출이 없으므로 함수가 완료되고`2`가 반환됩니다.

함수가 끝나면 실행 컨텍스트가 더 이상 필요하지 않으므로 메모리에서 제거됩니다. 이전 스택은 스택 맨 위에서 복원됩니다.


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

`pow (2, 2)`의 실행이 재개됩니다. 서브 콜`pow (2, 1)`의 결과를 가지므로,`x * pow (x, n - 1)`의 평가도 끝내고,`4`를 반환 할 수 있습니다.

그런 다음 이전 컨텍스트가 복원됩니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

끝나면`pow (2, 3) = 8`의 결과를 얻습니다.

이 경우 재귀 깊이는 **3** 입니다.

위의 그림에서 알 수 있듯이 재귀 깊이는 스택의 최대 컨텍스트 수와 같습니다.

메모리 요구 사항에 유의하십시오. 컨텍스트는 메모리를 사용합니다. 이 경우,`n`의 힘을 높이려면`n`의 모든 낮은 값에 대해 실제로`n` 상황을위한 메모리가 필요합니다.

루프 기반 알고리즘은 메모리를 많이 절약합니다.

```js
function pow(x, n) {
  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}
```

반복적 인`pow`는 단일 컨텍스트를 사용하여 프로세스에서`i`와`result`를 변경합니다. 메모리 요구 사항은 작고 고정되어 있으며 `n`에 의존하지 않습니다.

** 모든 재귀는 루프로 다시 작성할 수 있습니다. 루프 변형은 일반적으로보다 효과적 일 수 있습니다. **

...하지만 때로는 다시 쓰는이 중요하지 않습니다. 특히 함수가 조건에 따라 다른 재귀 하위 호출을 사용하고 결과를 병합하거나 분기가 더 복잡한 경우에는 특히 그렇습니다. 그리고 최적화는 불필요 할 수 있으며 노력을 기울일 가치가 없습니다.

재귀는 짧은 코드를 제공하고 이해하기 쉽고 지원하기 쉽습니다. 모든 장소에서 최적화가 필요하지는 않으며 대부분 좋은 코드가 필요하기 때문에 사용됩니다.

## 순회 트래버스

재귀의 다른 훌륭한 응용 프로그램은 재귀 적 탐색입니다.

우리 회사가 있다고 상상해보십시오. 직원 구조는 객체로 표현 될 수 있습니다.

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

즉, 한 회사에 부서가 있습니다.

- 부서에는 여러 명의 직원이있을 수 있습니다. 예를 들어, `sales` 부서에는 John과 Alice라는 2 명의 직원이 있습니다.
- 또는 부서는 하위 개발 부서로 나눌 수 있습니다. `development` 부서에는 `sites`와 `internals`가 두 개가 있습니다. 그들 각각에는 직원이 있습니다.
- 하위 구획이 커지면 하위 구획 (또는 팀)으로 나눌 수도 있습니다.

    예를 들어, 미래의`sites` 부서는`siteA`와`siteB`에 대해 팀으로 분리 될 수 있습니다. 그리고 그들은 잠재적으로 더 많은 것을 나눌 수 있습니다. 그것은 사진에 있지 않고 단지 염두에 두어야 할 것입니다.

이제 모든 급여의 합계를 구하는 함수가 필요하다고 가정 해 봅시다. 어떻게 할 수 있을까요?

구조가 단순하지 않기 때문에 반복 접근법은 쉽지 않습니다. 첫 번째 아이디어는 1 단계 부서 이상의 중첩 된 서브 루프로 '회사'에 대해 'for'루프를 만드는 것일 수 있습니다. 그러나 '사이트'와 같은 2 단계 부서의 직원을 반복하기 위해 더 많은 중첩 된 서브 루프가 필요합니다. ... 그리고 앞으로 나타날 수있는 3 단계 부서의 하위 루프가 있습니다. 우리는 레벨 3에서 멈추거나 4 레벨의 루프를 만들어야합니까? 코드에 3-4 중첩 된 서브 루핑을 사용하여 단일 객체를 탐색하면 오히려 추한 이미지가됩니다.

재귀를 사용해 봅시다.

기능이 총계를 얻을 때 볼 수 있듯이, 두 가지 가능한 경우가 있습니다 :

1. *사람들의 배열* 을 가진 "단순한"부서 - 그런 다음 간단한 회 돌이로 급여를 합산 할 수 있습니다.
2. 또는 *N 개의 서브 디벨먼트가있는 객체* - 그러면 각각의 서브 데프의 합계를 얻기 위해`N` 회귀 호출을하고 결과를 결합 할 수 있습니다.

(1)은 재귀의 기본이며 사소한 경우입니다.

(2)는 재귀 단계입니다. 복잡한 작업은 소규모 부서의 하위 작업으로 분할됩니다. 그들은 차례로 다시 나뉠 수 있지만 조만간 분할은 (1)로 끝납니다.

이 알고리즘은 코드에서 읽기가 더 쉽습니다.


```js run
let company = { // the same object, compressed for brevity
  sales: [{name: 'John', salary: 1000}, {name: 'Alice', salary: 600 }],
  development: {
    sites: [{name: 'Peter', salary: 2000}, {name: 'Alex', salary: 1800 }],
    internals: [{name: 'Jack', salary: 1300}]
  }
};

// The function to do the job
*!*
function sumSalaries(department) {
  if (Array.isArray(department)) { // case (1)
    return department.reduce((prev, current) => prev + current.salary, 0); // sum the array
  } else { // case (2)
    let sum = 0;
    for (let subdep of Object.values(department)) {
      sum += sumSalaries(subdep); // recursively call for subdepartments, sum the results
    }
    return sum;
  }
}
*/!*

alert(sumSalaries(company)); // 6700
```

코드는 짧고 이해하기 쉽습니다 (잘만되면?). 그것은 재귀의 힘입니다. 또한 하위 수준의 중첩 수준에서도 작동합니다.

다음은 호출 다이어그램입니다.

![recursive salaries](recursive-salaries.png)

객체`{...}`에 대해 서브 콜이 만들어지고, 배열 `[...]`은 재귀 트리의 "잎"이지만 즉시 결과가 나타납니다.

이 코드는 이전에 다뤘던 스마트 기능을 사용합니다.

배열의 합을 얻기 위해 <info:array-methods> 장에서 설명 된`arr.reduce` 메쏘드.
- 객체 값을 반복하기 위해`val of Object.values (obj) `를 반복하십시오 :`Object.values`는 그것들의 배열을 반환합니다.


## 재귀 구조

재귀 (재귀 적으로 정의 된) 데이터 구조는 자체적으로 복제하는 구조입니다.

우리는 방금 위의 회사 구조의 예에서이를 보았습니다.

회사 *department* 는 다음과 같습니다.
- 사람들의 배열.
- 또는 *department* 가있는 오브젝트.

웹 개발자에게는 HTML 및 XML 문서와 같이 훨씬 더 잘 알려진 예제가 있습니다.

HTML 문서에서 *HTML 태그*는 다음 목록을 포함 할 수 있습니다.
- 텍스트 조각.
- HTML 주석.
- 다른 *HTML 태그* (차례로 텍스트 조각 / 주석 또는 기타 태그 등을 포함 할 수 있음).

그것은 다시 한번 재귀적인 정의입니다.

더 나은 이해를 위해, 어떤 경우에는 배열에 대한 더 나은 대안이 될 수있는 "링크 된 목록"이라는 하나 이상의 재귀 구조를 다룰 것입니다.

### Linked list

상상해보십시오. 우리는 객체의 정렬 된 목록을 저장하려고합니다.

자연스러운 선택은 배열 일 것입니다 :

```js
let arr = [obj1, obj2, obj3];
```

...하지만 배열에 문제가 있습니다. "요소 삭제"및 "요소 삽입"작업은 비용이 많이 듭니다. 예를 들어,`arr.unshift (obj)`연산은 새로운`obj`를위한 공간을 만들기 위해 모든 원소의 번호를 다시 지정해야하고 배열이 큰 경우 시간이 걸립니다. `arr.shift ()` 와 동일합니다.

   대량 넘버링을 필요로하지 않는 유일한 구조적인 변경은`arr.push / pop` 배열의 끝으로 동작하는 것입니다. 따라서 배열은 큰 대기열에 대해서는 상당히 느릴 수 있습니다.

   또는 빠른 삽입 / 삭제가 정말로 필요한 경우에는 [linked list](https://en.wikipedia.org/wiki/Linked_list) 이라는 다른 데이터 구조를 선택할 수 있습니다.

* 연결된 목록 요소 *는 다음을 사용하여 재귀 적으로 객체로 정의됩니다.
- `value`.
- `next` 다음 *연결된 목록 요소*를 참조하는 속성 또는 끝인 경우 'null'.

예를 들어:

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

목록의 그래픽 표현 :

![linked list](linked-list.png)

생성을위한 대체 코드 :

```js no-beautify
let list = { value: 1 };
list.next = { value: 2 };
list.next.next = { value: 3 };
list.next.next.next = { value: 4 };
```

여기서 우리는 여러 객체가 있음을보다 분명하게 볼 수 있습니다. 각 객체는 이웃을 가리키는`value`와`next`를 가지고 있습니다. `list` 변수는 체인의 첫 번째 객체이므로,`next` 포인터를 따라 가면 모든 요소에 도달 할 수 있습니다.

목록을 여러 부분으로 쉽게 나눌 수 있으며 나중에 다시 가입 할 수 있습니다.

```js
let secondList = list.next.next;
list.next.next = null;
```

![linked list split](linked-list-split.png)

To join:

```js
list.next.next = secondList;
```

그리고 확실하게 우리는 어떤 장소에서나 아이템을 삽입하거나 제거 할 수 있습니다.

예를 들어, 새 값을 앞에 붙이려면 목록 헤드를 업데이트해야합니다.

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

중간에서 값을 제거하려면 이전 값의 'next'를 변경하십시오.

```js
list.next = list.next.next;
```

![linked list](linked-list-remove-1.png)

우리는`list.next`를`1`을 뛰어 넘어서`2` 값을 얻었습니다. 이제 값 `1`이 체인에서 제외됩니다. 다른 곳에 저장되지 않으면 자동으로 메모리에서 제거됩니다.

배열과는 달리, 대량 번호 매기기가 없으므로 요소를 쉽게 재 배열 할 수 있습니다.

당연히 목록은 항상 배열보다 낫지는 않습니다. 그렇지 않으면 모든 사람이 목록 만 사용합니다.

가장 큰 단점은 번호로 요소에 쉽게 액세스 할 수 없다는 것입니다. 쉬운 배열 :`arr [n]`은 직접적인 참조입니다. 그러나 목록에서 우리는 첫 번째 항목부터 시작하여 N 번째 요소를 얻기 위해`next` `N` 번 이동해야합니다.

... 그러나 우리는 항상 그러한 작업이 필요하지 않습니다. 예를 들어 대기열 또는 [deque](https://en.wikipedia.org/wiki/Double-ended_queue) 가 필요할 때 - 양끝에서 요소를 매우 빠르게 추가 / 제거 할 수있는 정렬 된 구조.

가끔 `tail`이라는 또 다른 변수를 추가하여 목록의 마지막 요소를 추적 할 수 있습니다 (끝에 요소를 추가 / 제거 할 때 업데이트합니다). 큰 요소 세트의 경우 속도 차이와 배열이 매우 큽니다.

## 요약

Terms:
- *재귀*는 "자체 호출"기능을 의미하는 프로그래밍 용어입니다. 이러한 기능을 사용하여 특정 작업을 우아한 방식으로 해결할 수 있습니다.

    함수가 자신을 호출 할 때 *재귀 단계*라고합니다. 재귀의 *basis* 는 함수를 더 간단하게 만들어서 함수가 더 이상 호출하지 못하게하는 함수 인수입니다.

- [재귀적으로 정의된](https://en.wikipedia.org/wiki/Recursive_data_type) 데이터 구조는 자체적으로 정의 할 수있는 데이터 구조입니다.

    예를 들어, 링크 된 목록은 목록을 참조하는 객체 (또는 null)로 구성된 데이터 구조로 정의 될 수 있습니다.

    ```js
    list = {value, next -> list}
    ```

    이 장의 HTML 요소 트리 또는 부서 트리와 같은 나무도 자연스럽게 재귀 적입니다. 분기를 가지며 모든 분기마다 다른 분기를 가질 수 있습니다.

    `sumSalary` 예제에서 보았 듯이 재귀 함수를 사용하여 그것들을 걸어 갈 수 있습니다.

모든 재귀 함수는 반복적 인 함수로 다시 작성할 수 있습니다. 그리고 때로는 물건을 최적화해야합니다. 그러나 많은 작업에서 재귀 적 솔루션은 빠르며 작성하고 지원하기 쉽습니다.