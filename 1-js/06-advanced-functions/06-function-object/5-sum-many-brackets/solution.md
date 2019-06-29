
1. 모든 것이 *어떻게든* 작동하려면`sum`의 결과가 함수여야 합니다.
2. 함수는 호출 간에 현재 값을 메모리에 유지해야 합니다.
3. 문제에 따르면, 함수는 `==` 에서 사용될 때 숫자가 되어야 합니다. 함수는 객체이므로 변환은 <info:object-toprimitive>, 챕터에서 설명한 대로 이루어지며 숫자를 반환하는 자체 메서드를 제공할 수 있습니다.

코드는 아래와 같습니다. 

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

`sum` 함수는 실제로 한 번만 작동합니다. 함수 `f`를 반환합니다.

그 다음 각 후속 호출에서 `f`는 매개변수를 `currentSum` 합계에 추가하고 자신을 반환합니다.

**`f`의 마지막 줄에는 재귀가 없습니다.**

재귀는 다음과 같습니다.

```js
function f(b) {
  currentSum += b;
  return f(); // <-- recursive call
}
```

그리고 이러한 경우에는 함수를 호출하지 않고 반환합니다.

```js
function f(b) {
  currentSum += b;
  return f; // <-- does not call itself, returns itself
}
```

여기서 f는 다음 호출에서 사용될 것이고, 다시 자신을 반환합니다. 그 다음 숫자 또는 문자열로 사용될 때 `toString` 은 `currentSum` 을 반환합니다. `Symbol.toPrimitive` 또는 `valueOf`를 변환에 사용할 수 있습니다.
