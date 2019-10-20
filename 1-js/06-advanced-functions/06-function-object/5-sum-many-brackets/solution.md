
1. `sum`은 함수를 반환해야만 이 모든 것이 *의도한 대로* 동작합니다.
2. `sum`이 반환하는 함수는 호출될 때마다 현재 값을 메모리에 저장하고 있어야 합니다.
3. 함수는 `==` 를 만났을 때 숫자가 되어야 합니다. 함수는 객체이므로 <info:object-toprimitive> 챕터에서 설명한 것처럼, 객체-원시형으로의 형 변환이 일어날 텐데, 이때 메서드를 직접 구현해 원하는 대로 객체-원시형으로의 형 변환이 일어나게 할 수 있습니다.

답안은 아래와 같습니다. 

```js run
function sum(a) {

  let currentSum = a;

  function f(b) {
    currentSum += b;
    return f;
  }

  f.toString = function() {
    return currentSum;
  };

  return f;
}

alert( sum(1)(2) ); // 3
alert( sum(5)(-1)(2) ); // 6
alert( sum(6)(-1)(-2)(-3) ); // 0
alert( sum(0)(1)(2)(3)(4)(5) ); // 15
```

함수 `sum`은 실제로 한 번만 동작한다는 사실에 주목하시기 바랍니다. 함수 `sum`은 함수 `f`를 반환합니다.

이어지는 호출에서 함수 `f`는 매개변수를 `currentSum`에 추가하고 자신을 반환합니다.

**`f`의 마지막 줄에는 재귀가 없습니다.**

재귀가 있었다면 아래와 같이 생겼을 겁니다.

```js
function f(b) {
  currentSum += b;
  return f(); // <-- 재귀 호출
}
```

위 함수 `f`는 호출 없이 자기 자신을 그대로 반환합니다.

```js
function f(b) {
  currentSum += b;
  return f; // <-- 자신을 호출하지 않고 반환만 합니다.
}
```

이렇게 자기 자신을 호출하지 않고 반환만 하면 다음 호출에서 함수 `f`를 사용할 수 있고, 자기 자신을 또다시 반환해 원하는 만큼 이 과정을 반복할 수 있습니다. `toString` 은 `currentSum` 을 반환해주므로 반환된 함수(객체)를 숫자 혹은 문자열로도 사용할 수 있죠. `Symbol.toPrimitive`나 `valueOf`를 사용해 객체를 숫자나 문자열로 변환할 수도 있습니다.
