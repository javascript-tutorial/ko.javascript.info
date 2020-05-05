`arr[2]()`를 호출하는 것은 `obj`가 `arr`이고, `method`는 `2`인 메서드 `obj[method]()`를 호출하는 것과 문법적으로 동일합니다.

즉, `arr[2]`에 있는 함수가 객체 메서드처럼 호출되는 것이죠. 따라서 `arr[2]`는 `arr`을 참조하는 `this`를 받고, 배열을 출력합니다.

```js run
let arr = ["a", "b"];

arr.push(function() {
  alert( this );
})

arr[2](); // a,b,function(){...}
```

배열은 초기 2개의 값에 함수가 추가되어 총 3개의 값을 가집니다.
