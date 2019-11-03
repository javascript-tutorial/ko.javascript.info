
# Observable 만들기

프락시를 반환해 '객체를 observable 하게 만들어주는' 함수 `makeObservable(target)`를 만들어보세요.

최종 결과는 아래 조건을 만족해야 합니다.

```js run
function makeObservable(target) {
  /* 여기에 코드를 작성하세요. */
}

let user = {};
user = makeObservable(user);

user.observe((key, value) => {
  alert(`SET ${key}=${value}`);
});

user.name = "John"; // alerts: SET name=John
```

`makeObservable`가 반환하는 객체는 기존 객체와 동일지만 프로퍼티가 변경될 때 호출되는 함수인 `handler`를 설정해주는 메서드 `observe(handler)`가 있어야 합니다.

프로퍼티가 변경될 때마다 프로퍼티 키와 값을 인수로 받는 메서드 `handler(key, value)`가 호출되어야 하죠.

참고: 이 문제에선 프로퍼티에 값을 쓰려는 경우만 고려해서 답을 작성해보세요. 읽기 등의 동작은 유사한 방법을 사용해 구현할 수 있습니다.
