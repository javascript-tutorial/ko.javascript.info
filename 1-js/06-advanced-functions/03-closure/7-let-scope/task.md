importance: 4

---

# 변수가 보일까요?

다음 코드를 실행했을 때 어떤 값이 출력될까요?

```js
let x = 1;

function func() {
  console.log(x); // ?

  let x = 2;
}

func();
```

주의: 이 문제에는 함정이 있습니다. 뻔한 답을 떠올리지 마세요.
