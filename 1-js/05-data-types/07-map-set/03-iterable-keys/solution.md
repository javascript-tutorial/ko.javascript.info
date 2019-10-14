
`keys.push`가 동작하지 않은 이유는 `map.keys()`가 배열이 아니라 이터러블을 반환하기 때문입니다.

`Array.from`을 이용하면 맵을 배열로 변환할 수 있습니다.


```js run
let map = new Map();

map.set("name", "John");

*!*
let keys = Array.from(map.keys());
*/!*

keys.push("more");

alert(keys); // name, more
```
