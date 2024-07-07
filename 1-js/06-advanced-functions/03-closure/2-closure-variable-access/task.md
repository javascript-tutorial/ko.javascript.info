importance: 5

---

# 어떤 변수가 사용될까요?

아래 `makeWorker` 함수는 내부에서 다른 함수를 만들고 해당 함수를 반환합니다. 반환된 새 함수는 다른 어딘가에서 호출할 수 있습니다.

새롭게 반환된 함수는 생성된 곳을 기억하고 그곳의 외부 변수에 접근할까요, 아니면 호출된 위치를 기준으로 외부 변수에 접근할까요? 아니면 둘 다일까요?

```js
function makeWorker() {
  let name = "Pete";

  return function () {
    alert(name);
  };
}

let name = "John";

// 함수를 만듭니다.
let work = makeWorker();

// 함수를 호출합니다.
work(); // 무엇이 나올까요?
```

"Pete", "John" 중 어떤 어떤 값이 출력될까요?
