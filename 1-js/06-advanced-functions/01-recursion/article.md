# 재귀와 스택

함수에 대해 조금 더 깊이 공부해보죠.

첫 번째 주제는 *재귀* 입니다.

새롭게 프로그램을 배우는게 아니고, 재귀에 익숙하다면 이 챕터는 건너뛰어도 좋습니다.

재귀는 프로그래밍 패턴 중에 하나이며 작업이 여러 가지 비슷한 과정으로 나누어질 수 있을 떄 유용합니다.
더 간단하죠. 작업이 더 쉬운 방법과 동일한 작업이 단순화 시킬 수 있을 때. 또는, 특정 데이터 구조로 다룰 수 있을때 사용합니다.
함수가 진행될 때 프로세스에서 다른 많은 함수를 호출할 수 있습니다. 이때 함수가 *자기 자신* 을 호출할 때, 그것을 *재귀* 라고 부릅니다.

## 두 가지 사고 방식

`pow` (x, n) 함수를 작성하여 `x`를 `n`의 제곱을 하는 것부터 시작해 보겠습니다. `x` 를 `n` 배 곱합니다.

```js
pow(2, 2) = 4
pow(2, 3) = 8
pow(2, 4) = 16
```

이것을 구현하는데는 두 가지 방법이 있습니다.

1. 반복적인 방법: `for` 루프:

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

2. 재귀적인 방법: 작업을 단순화하고 스스로를 부르기:

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

재귀적 방법이 근본적으로 어떻게 다른지 유의하세요.

`pow (x, n)`이 호출되면, 실행은 두 개의 분기로 나누어집니다:

```js
              if n==1  = x
             /
pow(x, n) =
             \
              else     = x * pow(x, n - 1)
```

1. 만약 `n == 1` 이면, 모든 것이 무시된다. 이것을 *재귀의 base* 라고 부릅니다, 왜냐하면 `pow(x, 1)` 가 `x` 와 같다는 것을 즉시 보여주기 때문이죠.
2. 그렇지 않으면` pow(x, n)`를`x * pow(x, n - 1)`로 표현할 수 있습니다. 수학에서는, 이렇게 쓸 수 있습니다. <code>x<sup>n</sup> = x * x<sup>n-1</sup></code>.
이것은 *재귀적 단계* 라고 부릅니다:  작업을 보다 단순하게 (`x`에 의한 곱셈)으로 바꾸고 더 간단한 동일한 작업이 호출됩니다. (더 낮은 `n` 을 가진 `pow`).
다음 단계는 `n`이 `1`이 될 때까지 계속 간소화합니다.

이때 `pow` 가 `n == 1`까지 재귀적으로 호출되었다고 할 수 있습니다.

![recursive diagram of pow](recursion-pow.png)


예를 들어 `pow (2, 4)`를 계산하기 위해서 재귀적 변수들은 다음 단계들을 수행합니다:

1. `pow(2, 4) = 2 * pow(2, 3)`
2. `pow(2, 3) = 2 * pow(2, 2)`
3. `pow(2, 2) = 2 * pow(2, 1)`
4. `pow(2, 1) = 2`

재귀는 함수 호출을 단순한 함수 호출로 축소한 다음 결과가 끝날때까지 간단하게 처리됩니다.

````smart header="재귀는 보통 짧습니다"
재귀적 방법은 대개 반복적인 방법(loop) 보다 짧습니다.

여기서 `pow (x, n)` 을 `if` 대신에 `?` 연산자를 사용하면 같은 것을 더 간결하면서도 매우 읽기 쉽도록 다시 쓸 수 있습니다:

```js run
function pow(x, n) {
  return (n == 1) ? x : (x * pow(x, n - 1));
}
```
````

중첩된 호출 (첫 번째 호출 포함)의 최대 개수는 *재귀 깊이* 라고 합니다. 정확히는 `n`.

최대 재귀 깊이는 자바스크립트 엔진에 의해 제한됩니다. 약 10000까지를 만들 수 있습니다. 일부 엔진은 더 많은 것을 허용하지만,
대다수 엔진의 경우 100000 이상은 아마도 한계일 것입니다. 이 문제를 완화하는 데 도움이 되는 자동 최적화가 있지만 ( "tail calls optimizations"), 아직 모든 곳에서 지원되지 않고 일부의 경우에만 작동합니다.

재귀를 사용하는데 이러한 제약은 있지만, 재귀는 여전히 매우 광범위하게 사용됩니다. 재귀적 사고방식이 많은 작업에서 코드를 간결하게하고 유지 보수하기 쉽게 만듭니다.

## 실행 스택

어떻게 재귀적인 호출이 작동하는지 살펴보겠습니다. 함수의 보이지않는 부분을 살펴볼 필요가 있습니다.

함수 실행에 대한 정보는 해당하는 *실행 컨텍스트* 에 저장됩니다.

[실행 컨텍스트](https://tc39.github.io/ecma262/#sec-execution-contexts) 는 함수의 실행에 대한 세부 사항을 포함하는 내부 데이터 구조: 제어 흐름이 현재의 변수, `this`의 값 (여기서는 사용하지 않음) 및 다른 몇 가지 내부 세부 사항 입니다.

한개의 함수 호출에는 정확히 한개의 실행 컨텍스트가 연결되어 있습니다.

함수가 중첩 호출을 하면 다음과 같은 일이 발생합니다:

- 현재 함수가 중지된다.
- 이와 관련된 실행 컨텍스트는 *실행 컨텍스트 스택* 이라는 특수 데이터 구조로 기억된다.
- 중첩된 호출이 실행된다.
- 그것이 끝난 후 스택에서 이전 실행 컨텍스트를 검색하고 중지된 위치에서 외부 함수를 다시 시작한다.

이것이 `pow (2, 3)` 호출 중에 어떻게 진행되는지 살펴보죠.

### pow(2, 3)

`pow (2, 3)` 호출의 시작 부분에서 실행 컨텍스트는 변수를 저장합니다 :`x = 2, n = 3`, 실행 흐름은 함수의 `1` 라인에 있습니다.

다음과 같이 그려볼 수 있습니다 :

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 1 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

이때 함수가 실행되기 시작합니다. `n == 1` 조건은 거짓이므로, 흐름은 `if`의 두 번째 분기로 계속됩니다 :

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

변수는 동일하지만, 행이 변경되므로 컨텍스트는 다음과 같습니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

`x * pow (x, n - 1)`을 계산하려면, 새로운 인수 `pow (2, 2) `로 `pow`의 하위 호출을 만들어야 합니다.

### pow(2, 2)

중첩 호출을 수행하기 위해 자바스크립트는 *실행 컨텍스트 스택* 에서 현재 실행 컨텍스트를 기억합니다.

여기에서 동일한 함수` pow`를 호출하지만, 크게 중요하지 않습니다. 프로세스는 모든 기능에 대해 동일하게 작동합니다.

1. 현재 컨텍스트가 스택 제일 윗단계에 "기억" 된다.
2. 새로운 A 텍스트가 하위 호출용으로 작성된다.
3. 하위 호출이 완료되면 이전 컨텍스트가 스택에서 추출 되고 실행이 계속된다.

하위 호출 `pow (2, 2)`은 컨텍스트 스택에 들어있습니다

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

새로운 현재 실행 컨텍스트가 맨 위 (굵은 체)에 있으며 이전에 기억된 컨텍스트가 아래에 있습니다.

하위 호출을 마치면 이전 컨텍스트를 다시 시작하기 쉬워집니다. 변수와 중지된 코드의 정확한 위치를 모두 유지하기 때문이죠. 더 정확히는 해당 코드의 라인(line)으로 표기된 부분입니다.

### pow(2, 1)

프로세스는 다음과 같이 반복됩니다 : 새로운 하위 호출이 라인 `5`에서 만들어졌을때, ` x = 2`,`n = 1`을 인수로 사용합니다.

새로운 실행 컨텍스트가 만들어지고, 이전 실행 컨텍스트가 스택 제일 위에 올려지게 됩니다.

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

현재 2개의 이전 컨텍스트가 있고` pow (2, 1)`로 현재 실행 중인 컨텍스트가 1 개 있습니다.

### The exit

`pow (2, 1)`을 실행하는 동안 이전과 달리 `n == 1` 조건은 true 이므로 `if`의 첫 번째 분기가 작동합니다 :

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

더 중첩된 호출이 없으므로 함수가 완료되고 `2`가 반환됩니다.

함수가 끝나면 실행 컨텍스트가 더 필요하지 않으므로 메모리에서 제거됩니다. 이전 스택은 스택 맨 위에서 복원됩니다.


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

`pow (2, 2)`의 실행이 재개됩니다. 서브 콜 `pow (2, 1)`의 결과를 가지므로, `x * pow (x, n - 1)`를 끝내고, `4`를 반환합니다.

그 다음 이전 컨텍스트가 복원됩니다.

<ul class="function-execution-context-list">
  <li>
    <span class="function-execution-context">Context: { x: 2, n: 3, at line 5 }</span>
    <span class="function-execution-context-call">pow(2, 3)</span>
  </li>
</ul>

끝나면 `pow (2, 3) = 8`의 결과를 얻습니다.

이 경우 재귀 깊이는 **3** 입니다.

위의 그림에서 알 수 있듯이 재귀 깊이는 스택의 최대 컨텍스트 수와 같습니다.

이때 메모리를 요구한다는 것에 주의해야 합니다. 컨텍스트는 메모리를 사용합니다. `n`을 제곱하려면` n`의 모든 낮은 값에 대해 실제로 `n`개의 컨텍스트를 위한 메모리가 필요합니다.

반복 기반 알고리즘은 메모리를 많이 절약합니다.

```js
function pow(x, n) {
  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}
```

반복적인 `pow`는 단일 컨텍스트를 사용하여 프로세스에서` i`과`result`를 변경합니다. 메모리 요구 사항은 작고 고정되어 있으며 `n`과는 상관없습니다.

**모든 재귀적인 방법은 반복적인 방법(loop)으로 다시 작성할 수 있습니다. 반복적인 방법으로의 변형은 일반적으로 효과적일 수 있습니다.**

...하지만 때로는 다시 쓰는 것이 중요하지 않습니다. 특히 함수가 조건에 따라 다른 재귀적인 하위 호출을 사용하고 결과를 병합하거나 분기가 더 복잡한 경우에 그렇습니다. 이런 최적화는 불필요하므로 노력을 기울일 필요는 없습니다.

재귀는 더 적은 코드로 작성할 수 있고 이해하기 쉽지만 모든 곳에서 최적화가 필요하지는 않으며 대부분 좋은 코드가 필요할때 재귀를 사용합니다.

## 재귀적인 순회

재귀의 또 다른 훌륭한 점은 재귀적 순회입니다.

예를들면 회사가 있다고 할때, 직원 구조는 객체로 표현될 수 있습니다.

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

한 회사에 부서가 있습니다.

- A department may have an array of staff. For instance, `sales` department has 2 employees: John and Alice.
- Or a department may split into subdepartments, like `development` has two branches: `sites` and `internals`. Each of them has their own staff.
- It is also possible that when a subdepartment grows, it divides into subsubdepartments (or teams).

    예를 들어 미래의 `sites` 부서는 `sited부서는` `siteA` 와 `siteB` 에 대해 팀으로 분리될 수 있고, 잠재적으로 더 많이 나누어질 수 있습니다. 여기서는 일단 가능성만 생각해보죠.

이제 모든 급여의 합계를 구하는 함수가 필요하다고 한다면. 어떻게 할 수 있을까요?

구조가 단순하지 않기 때문에 반복 접근법은 쉽지 않습니다. 첫 번째 아이디어는 1단계 부서 이상의 중첩 된 하위 반복으로 `company`에 대해 `for` 반복문을 만드는 것일 수 있지만 
`sites`와 같은 2단계 부서의 직원을 반복하기 위해 더 많이 중첩 된 하위 반복문이 필요합니다. ... 그리고 다음 단계에서 3단계 부서의 하위 반복문이 필요할 것입니다.
3단계 에서 멈추거나 4단계의 반복문을 만들어야 할까요? 코드에 3-4 중첩 된 하위 반복문을 사용하여 단일 객체를 탐색하면 오히려 안 좋은 코드가 됩니다.

그럼, 재귀를 사용해 보죠.

함수가 합계를 계산할 때처럼, 두 가지를 생각해 볼 수 있습니다.

1. *사람들의 배열* 을 가진 "단순한" 부서 - 간단한 반복문으로 합계를 구할 수 있습니다.
2. *N 개의 작은 부서가 있는 객체* - 각각의 하위 부서의 합계를 얻기 위해 `N` 번의 회귀 호출을 하고 결과를 합산 합니다.

(1)은 재귀의 base 이며 일반적인 방법입니다.

(2)는 재귀적인 방법입니다. 복잡한 작업은 작은 부서 단위의 작은 작업으로 나누어집니다. 그 다음 차례로 다시 나뉘어 지지만 결국 (1) 로 끝납니다.

이 알고리즘은 코드에서 읽기 쉽습니다.


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

코드가 짧고 이해하기 쉽다면, 이것이 재귀의 강력함 입니다. 또한 중첩된 모든 하위구문에서도 작동합니다.

호출 단계를 보여주는 다이어그램은 다음과 같습니다.

![recursive salaries](recursive-salaries.png)

객체`{...}`에 대해 하위 호출이 만들어지고, 배열 `[...]`은 재귀 단계의 "작은 단계" 이지만 즉시 결과를 보여줍니다.

이 코드는 이전에 다뤘던 스마트 기능도 사용합니다.

- 배열의 합을 얻기 위해 사용된 `arr.reduce` 는 <info:array-methods> 장을 참고하세요.
- 반복적인 객체 값을 얻기 위해 `for(val of Object.values (obj))` 를 사용하였습니다: `Object.values`는 그것의 배열을 반환합니다.


## 재귀적인 구조들

재귀 (재귀적으로 정의된) 데이터 구조라는 것은 자체적으로 복제하는 구조입니다.

위의 회사 구조의 예를 통해서 살펴보았습니다.

회사 *department* 는 다음과 같이 구성되어 있었습니다.
- 사람들의 배열.
- 또는 *department* 가 있는 오브젝트.

웹 개발자에게는 HTML 및 XML 문서와 같이 훨씬 익숙한 예제가 있죠.

HTML 문서에서 *HTML-태그*는 다음 목록을 포함할 수 있습니다.
- 텍스트 조각.
- HTML-주석.
- 다른 *HTML-태그* (텍스트 / 주석 또는 기타 태그 등을 포함).

이러한 것이 재귀적인 정의입니다.

이해를 돕기위해, 배열에 대해 더 좋은 방법으로 접근할 수 있는 "연결 리스트"라는 재귀적인 구조를 살펴보죠.

### 연결 리스트 (Linked list)

객체에 정렬된 목록을 저장한다고 상상해 보세요.

일반적인 선택은 배열(Array)일 것입니다 :

```js
let arr = [obj1, obj2, obj3];
```

...하지만 배열에는 문제가 있습니다. "요소 삭제" 및 "요소 삽입" 작업이 어렵습니다. 특히 `arr.unshift(obj)` 연산은 새로운 `obj` 를 위한 공간을 만들기 위해 모든 원소의 번호를 다시 지정해야 하고 큰 배열에는 시간이 걸립니다. `arr.shift()` 도 동일합니다.

   큰 비용을 치루지 않고 모두 변경할 수 있는 유일한 방법은`arr.push/pop` 을 사용해 배열의 끝을 이용해 작업하는 것입니다. 여전히 배열은 크면 클수록 상당히 느릴 수 있습니다.

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

...  이렇게 하지않아도 대기열(queue) 또는 [양단 대기열(deque)](https://en.wikipedia.org/wiki/Double-ended_queue) 를 사용해 양 끝의 요소를 매우 빠르게 추가 / 제거할 수 있습니다만

가끔 리스트의 마지막에 `tail`이라는 다른 이름을 사용해서 마지막 요소를 추가하는게 효과적일 수 있습니다. (그리고 끝에서 요소를 추가하거나 제거할때 업데이트 합니다). 여전히 큰 요소들로 구성되었을때 배열과 리스트의 속도차이는 큽니다.

## 요약

용어:
- *재귀* 는 "자체 호출" 을 의미하는 프로그래밍 용어다. 재귀를 사용하여 특정 작업을 더 멋진 방식으로 해결할 수 있다.

    함수가 자신을 호출할 때 *재귀 단계* 라고 한다. 재귀의 *base* 은 함수를 더 간단하게 만들어서 함수가 더 호출하지 못 하는 단계의 함수 인수이다.

- [재귀적으로 정의된](https://en.wikipedia.org/wiki/Recursive_data_type) 데이터 구조는 자체적으로 정의할 수 있는 데이터 구조이다.

    예를 들어 연결 리스트는 목록을 참조하는 객체 (또는 null)로 구성된 데이터 구조로 정의될 수 있다.

    ```js
    list = {value, next -> list}
    ```

    여기서 다룬 HTML 요소 또는 회사부서 와 같은 구조도 일반적인 재귀적인 구조이다. 가지고 있는 모든 분기마다 다른 분기를 가질 수 있기 때문이다.

    이 장에서는 재귀적인 함수 `sumSalary` 를 사용하여 그 분기를 순차적으로 진행하는 방법을 살펴보았습니다.

모든 재귀 함수는 반복적인 함수로 다시 작성할 수 있습니다. 재귀적인 함수는 최적화를 요구하지만 많은 작업에서 재귀적인 접근법은 더 빠르고 쉽게 작성할 수 있고 유지보수가 수월한 코드를 제공합니다. 