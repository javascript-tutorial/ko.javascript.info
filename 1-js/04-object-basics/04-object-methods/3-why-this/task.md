importance: 3

---

# "this" 값 알아내기

<<<<<<< HEAD
아래 예시에선 여러 방법을 이용해 `user.go()`를 호출하고 있습니다. 총 4번 호출하였네요.  
=======
In the code below we intend to call `obj.go()` method 4 times in a row.
>>>>>>> e92bb83e995dfea982dcdc5065036646bfca13f0

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

