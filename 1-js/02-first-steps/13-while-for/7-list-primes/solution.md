소수를 판단하는 알고리즘은 다양합니다.

먼저 중첩 반복문을 사용한 알고리즘을 살펴봅시다.

```js
범위 내 모든 숫자 i에 대해서 {
  1과 i 사이에 제수가 있는지를 확인
  있으면 => 소수가 아님
  없으면 => 소수이므로 출력해줌
}
```

레이블을 사용해 위 알고리즘을 구현한 코드는 다음과 같습니다.

```js run
let n = 10;

nextPrime:
for (let i = 2; i <= n; i++) { // 각 i에 대하여 반복문을 돌림

  for (let j = 2; j < i; j++) { // 제수(나눗수)를 찾음
    if (i % j == 0) continue nextPrime; // 소수가 아니므로 다음 i로 넘어감
  }

  alert( i ); // 소수
}
```

위에서 사용한 알고리즘은 최적화할 부분이 많습니다. 제수를 `2`와 `i`의 제곱근 사이에서 찾으면 좀 더 나아지겠죠. 아주 큰 `n`에 대해서 [이차 체(Quadratic sieve)](https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%B0%A8_%EC%B2%B4)나 [수 체(General number field sieve)](https://en.wikipedia.org/wiki/General_number_field_sieve)와 같이 좀 더 어려운 수학과 복잡한 알고리즘을 이용해 소수 검색 알고리즘을 개선할 수 있을 겁니다.
