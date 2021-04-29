importance: 5

---

# 출력되는 name 맞추기

함수 sayHi는 외부 변수인 name을 사용하고 있습니다. 함수가 되면 어떤 name을 사용될까요?

```js
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete";

sayHi(); // "John"과 "Pete" 중 무엇이 출력될까요?
```

함수가 생성되고, 사용자 작업 또는 네트워크 요청이 끝난 후 함수를 실행해야 하는 상황은 프론트엔드, 백엔드 개발 상관없이 자주 나타납니다.

그래서, 어떤 name이 출력될까요?
