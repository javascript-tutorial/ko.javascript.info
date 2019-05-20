importance: 5

---

# 바인드 후의 함수 프로퍼티

함수에는 속성값이 있습니다. `bind` 후에 그것이 변경 될까요? 왜, 그렇게 될까요?

```js run
function sayHi() {
  alert( this.name );
}
sayHi.test = 5;

*!*
let bound = sayHi.bind({
  name: "John"
});

alert( bound.test ); // 결과는 무엇인가요? 왜 그럴까요?
*/!*
```

