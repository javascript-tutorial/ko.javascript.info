importance: 5

---

# Second bind
# 두번째 바인드

추가적인 바인딩으로 'this'를 바꿀 수 있을까요?

결과값은 무엇일까요?

```js no-beautify
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Ann" } );

f();
```

