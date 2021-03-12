importance: 3

---

# 'this' 값 알아내기

아래 코드에선 다양한 방법으로 `user.go()`를 4번 연속 호출합니다.

그런데 첫 번째(`(1)`)와 두 번째 호출(`(2)`) 결과는 세 번째(`(3)`)와 네 번째(`(4)`) 호출 결과와 다릅니다. 이유가 뭘까요? 

```js run no-beautify
let obj, method;

obj = {
  go: function() { alert(this); }
};

obj.go();               // (1) [object Object]

(obj.go)();             // (2) [object Object]

(method = obj.go)();    // (3) undefined

(obj.go || obj.stop)(); // (4) undefined
```

