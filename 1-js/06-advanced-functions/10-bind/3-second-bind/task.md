importance: 5

---

# 두 번째 바인드(bind)

바인딩(binding)을 한 후 한 번 더 바인딩을 사용해서 `this`를 바꿀 수 있을까요?

아래 코드를 실행하면 어떤 결과가 나올까요?

```js no-beautify
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Ann" } );

f();
```

