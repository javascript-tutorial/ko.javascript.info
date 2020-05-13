importance: 5

---

# Fix the addition

사용자에게 두 개의 숫자를 입력 받아서 그 숫자들의 합을 출력하는 코드가 있습니다.

의도한대로 동작하지 않습니다. 예제 아래의 출력 값은 `12` 입니다.

왜 이런 결과가 나오는 것일까요? 코드를 수정해보세요. 결과는 `3`이어야 합니다. 

```js run
let a = prompt("First number?", 1);
let b = prompt("Second number?", 2);

alert(a + b); // 12
```
