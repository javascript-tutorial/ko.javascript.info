importance: 5

---

# 출력되는 name 맞추기

sayHi함수는 외부 변수 name을 사용하고 있습니다. 함수가 실행될 때 어떤 name을 사용될까요?

```js
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete";

sayHi(); // "John"과 "Pete" 중 무엇이 출력될까요?
```

위 상황은 프론트엔드와 백엔드 개발 시 공통적으로 나타납니다. 예를 들면 함수가 생성되고, 사용자 작업 또는 네트워크 요청 끝난 후 함수가 실행되도록 구현하는 경우입니다.

그래서, 어떤 name이 출력될까요?
