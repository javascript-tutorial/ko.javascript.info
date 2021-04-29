importance: 5

---

# 어떤 값이 출력될까요?

함수 `makeWorker`는 생성 된 후 또 다른 함수를 만들고 반환합니다. 새로운 함수는 어디서든 호출될 수 있습니다.

생성 위치와 호출 위치 혹은 두 경우 모두에서 외부 변수에서 접근할 수 있을까요?

```js
function makeWorker() {
  let name = "Pete";

  return function() {
    alert(name);
  };
}

let name = "John";

// 함수 생성
let work = makeWorker();

// 함수 호출
work(); // 어떤 값이 출력될까요?
```

"Pete"와 "John" 중 어떤 값이 출력될까요?