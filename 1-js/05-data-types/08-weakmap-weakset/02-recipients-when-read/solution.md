
다음과 같이, 날짜를 저장하기 위해 `위크맵`을 사용할 수 있습니다.

```js
let messages = [
  {text: "Hello", from: "John"},
  {text: "How goes?", from: "John"},
  {text: "See you soon", from: "Alice"}
];

let readMap = new WeakMap();

readMap.set(messages[0], new Date(2017, 1, 1));
// Date 객체는 추후에 배우게 될 것입니다.
```
