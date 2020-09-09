정답: **John**

```js run no-beautify
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Pete"} );

f(); // John
```

`f.bind(...)`가 반환한 특수 객체인 [묶인 함수(bound function)](https://tc39.github.io/ecma262/#sec-bound-function-exotic-objects)는 함수 생성 시점의 컨텍스트만 기억합니다. 인수가 제공되었다면 그 인수 또한 기억합니다.

한번 bind를 적용하면 bind를 사용해 컨텍스트를 다시 정의할 수 없습니다.
