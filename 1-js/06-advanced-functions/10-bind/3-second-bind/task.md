importance: 5

---

# bind 두 번 적용하기

함수에 bind를 적용하고, 이어서 한 번 더 bind를 적용하면 `this`를 바꿀 수 있을까요?

아래 코드를 실행하면 어떤 결과가 나올까요?

```js no-beautify
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Ann" } );

f();
```

