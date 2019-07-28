importance: 5

---

# "if"에 관한 고찰

아래 표현식에서 어떤 `alert`가 실행될까요?

`if(...)` 안에 표현식이 있으면 어떤 일이 일어날까요?

```js
if (-1 || 0) alert( 'first' );
if (-1 && 0) alert( 'second' );
if (null || -1 && 1) alert( 'third' );
```

