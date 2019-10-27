importance: 5

---

# 검색 알고리즘

이번에 풀 과제는 두 부분으로 구성됩니다.

먼저, 아래 객체를 살펴봅시다.

```js
let head = {
  glasses: 1
};

let table = {
  pen: 3
};

let bed = {
  sheet: 1,
  pillow: 2
};

let pockets = {
  money: 2000
};
```

1. `__proto__`를 사용해서, 프로퍼티 조회가 `pockets` -> `bed` -> `table` -> `head`의 경로를 따르도록 프로토타입을 할당하세요. 예를 들면, `pockets.pen`은 `3`이어야만 합니다.(`table`에서 발견할 수 있습니다.) 그리고 `bed.glasses`는 `1`이어야만 합니다.(`head`에서 발견할 수 있습니다.)
2. `pockets.glasses`로 `glasses`를 얻는 것이 빠를까요? 아니면 `head.glasses`로 얻는 것이 빠를까요? 필요하다면 벤치마크를 사용해 성능을 측정해 보세요.
