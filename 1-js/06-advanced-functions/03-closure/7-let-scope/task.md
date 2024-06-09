importance: 4

---

# 변수가 보일까요?

다음 코드의 결과는 무엇일까요?

```js
let x = 1;

function func() {
  console.log(x); // ?

  let x = 2;
}

func();
```

P.S. 이 문제에는 함정이 있습니다. 해결 방법이 명확하지 않습니다.
