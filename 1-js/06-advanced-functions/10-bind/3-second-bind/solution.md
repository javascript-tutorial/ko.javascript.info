정답: **John**.

```js run no-beautify
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Pete"} );

f(); // John
```

`f.bind(...)`가 반환한 특수 객체인 [bound function](https://tc39.github.io/ecma262/#sec-bound-function-exotic-objects)은 함수가 생성된 시점에서만 컨텍스트를 기억합니다. 인수가 제공되었다면 그 인수 또한 기억합니다. 

함수는 다시 바인드될 수 없습니다.
