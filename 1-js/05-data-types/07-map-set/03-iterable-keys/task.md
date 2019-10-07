importance: 5

---

# 반복 가능한 객체의 키

`map.keys()`를 사용해 배열을 반환받고, 이 배열을 변수에 저장해 `.push`와 같은 배열 메서드를 적용하고 싶다고 해봅시다.

작동하지 않네요.

```js run
let map = new Map();

map.set("name", "John");

let keys = map.keys();

*!*
// Error: keys.push is not a function
keys.push("more");
*/!*
```

이유가 무엇일까요? `keys.push`가 작동하게 하려면 어떻게 코드를 고쳐야 할까요?
