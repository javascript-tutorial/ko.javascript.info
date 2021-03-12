importance: 5

---

# bind를 적용한 함수의 프로퍼티

함수 프로퍼티에 값을 하나 할당해봅시다. 이 함수에 `bind` 메서드를 적용하면 프로퍼티 값은 바뀔까요? 그렇다면 혹은 그렇지않다면 그 이유는 무엇일까요?

```js run
function sayHi() {
  alert( this.name );
}
sayHi.test = 5;

*!*
let bound = sayHi.bind({
  name: "John"
});

alert( bound.test ); // 얼럿 창엔 어떤 값이 출력될까요? 값이 나온 이유는 무엇일까요?
*/!*
```

