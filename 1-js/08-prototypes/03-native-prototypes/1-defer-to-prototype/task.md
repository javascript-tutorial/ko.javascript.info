importance: 5

---

# 메서드"f.defer(ms)"를 함수에 추가하기

모든 함수의 포로토타입에 `ms`밀리초 후에 함수를 실행하는 `defer(ms)`함수를 추가하세요

함수를 프토로타입에 추가한 이후 아래 코드는 동작 해야합니다.
```js
function f() {
  alert("Hello!");
}

f.defer(1000); // 1 초후 "Hello!" 출력 
