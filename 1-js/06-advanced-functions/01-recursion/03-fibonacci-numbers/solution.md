The first solution we could try here is the recursive one.
첫번째 해결방법은 재귀를 이용한 것입니다.

Fibonacci numbers are recursive by definition:
피보나치 수들은 정의에 따라 재귀적입니다.

```js run
function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

alert( fib(3) ); // 2
alert( fib(7) ); // 13
// fib(77); // 엄청나게 느릴것입니다!
```

...But for big values of `n` it's very slow. For instance, `fib(77)` may hang up the engine for some time eating all CPU resources.
...하지만 `n`의 값이 클경우 매우 느립니다. 예를 들어,`fib (77)`은 한동안 모든 CPU 리소스를 먹어서 자바스크립트 엔진을 정지시킬 수 있습니다.

That's because the function makes too many subcalls. The same values are re-evaluated again and again.
함수가 너무 많은 하위 호출을 하기 때문입니다. 동일한 값들이 반복해서 재평가 됩니다.

For instance, let's see a piece of calculations for `fib(5)`:
아래 예시를 통해 `fib(5)`의 계산을 살펴보겠습니다.

```js no-beautify
...
fib(5) = fib(4) + fib(3)
fib(4) = fib(3) + fib(2)
...
```

Here we can see that the value of `fib(3)` is needed for both `fib(5)` and `fib(4)`. So `fib(3)` will be called and evaluated two times completely independently.
예시에서 처럼 `fib (3)` 의 값이 `fib (5)` 와 `fib (4)` 모두에 필요하다는 것을 알 수 있습니다. 따라서 `fib(3)`은 두번이나 완전히 독립적으로 호출되고 평가됩니다.

Here's the full recursion tree:
전체 재귀 트리는 다음과 같습니다.

![fibonacci recursion tree](fibonacci-recursion-tree.svg)

We can clearly notice that `fib(3)` is evaluated two times and `fib(2)` is evaluated three times. The total amount of computations grows much faster than `n`, making it enormous even for `n=77`.
`fib (3)`는 두 번 평가되고`fib (2)`는 세 번 평가된다는 것을 분명히 알 수 있습니다. 총 계산량은 `n` 보다 훨씬 빠르게 증가하여 `n = 77` 에서도 엄청납니다.

We can optimize that by remembering already-evaluated values: if a value of say `fib(3)` is calculated once, then we can just reuse it in future computations.
이미 평가 된 값을 기억함으로써이를 최적화 할 수 있습니다. 만약`fib (3)`의 값이 한 번 계산된다면, 그것은 나중에 계산에서 재사용 할 수 있습니다.

Another variant would be to give up recursion and use a totally different loop-based algorithm.
또 다른 변형은 재귀를 포기하고 완전히 다른 루프 기반 알고리즘을 사용하는 것입니다.

Instead of going from `n` down to lower values, we can make a loop that starts from `1` and `2`, then gets `fib(3)` as their sum, then `fib(4)` as the sum of two previous values, then `fib(5)` and goes up and up, till it gets to the needed value. On each step we only need to remember two previous values.
`n`에서 더 낮은 값으로 이동하는 대신`1`과`2`에서 시작하여`fib (3)`을 합계로 가져온 다음`fib (4)`를 합계로 얻는 루프를 만들 수 있습니다 두 개의 이전 값 중 'fib (5)'를 입력 한 다음 필요한 값에 도달 할 때까지 위로 이동합니다. 각 단계에서 두 개의 이전 값만 기억하면됩니다.

Here are the steps of the new algorithm in details.
새로운 알고리즘의 단계는 다음과 같습니다.

The start:
시작은 이렇습니다

```js
// a = fib(1), b = fib(2), these values are by definition 1
let a = 1, b = 1;

// get c = fib(3) as their sum
let c = a + b;

/* we now have fib(1), fib(2), fib(3)
a  b  c
1, 1, 2
*/
```

Now we want to get `fib(4) = fib(2) + fib(3)`.
이제 `fib(4) = fib(2) + fib(3)`값을 얻고 싶습니다.

Let's shift the variables: `a,b` will get `fib(2),fib(3)`, and `c` will get their sum:
변수를 바꿔 봅시다 :`a, b`는`fib (2), fib (3)`을,`c`는 합을 얻습니다 :

```js no-beautify
a = b; // now a = fib(2)
b = c; // now b = fib(3)
c = a + b; // c = fib(4)

/* now we have the sequence:
   a  b  c
1, 1, 2, 3
*/
```

The next step gives another sequence number:
다음 단계는 다른 시퀀스 번호를 제공합니다.

```js no-beautify
a = b; // now a = fib(3)
b = c; // now b = fib(4)
c = a + b; // c = fib(5)

/* now the sequence is (one more number):
      a  b  c
1, 1, 2, 3, 5
*/
```

...And so on until we get the needed value. That's much faster than recursion and involves no duplicate computations.
... 필요한 가치를 얻을 때까지 계속됩니다. 재귀보다 훨씬 빠르며 중복 계산이 필요하지 않습니다.

The full code:
전체 코드 :


```js run
function fib(n) {
  let a = 1;
  let b = 1;
  for (let i = 3; i <= n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }
  return b;
}

alert( fib(3) ); // 2
alert( fib(7) ); // 13
alert( fib(77) ); // 5527939700884757
```

The loop starts with `i=3`, because the first and the second sequence values are hard-coded into variables `a=1`, `b=1`.
루프는 'i = 3'으로 시작하는데, 첫 번째와 두 번째 시퀀스 값은 변수 'a = 1',`b = 1`로 하드 코딩되기 때문입니다.

The approach is called [dynamic programming bottom-up](https://en.wikipedia.org/wiki/Dynamic_programming).
이러한 방법을 [dynamic programming bottom-up](https://en.wikipedia.org/wiki/Dynamic_programming).
