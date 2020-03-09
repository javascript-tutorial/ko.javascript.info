**에러**가 발생합니다.

직접 실행해 봅시다.
```js run
function makeUser() {
  return {
    name: "John",
    ref: this
  };
};

let user = makeUser();

alert( user.ref.name ); // Error: Cannot read property 'name' of undefined
```

에러가 발생하는 이유는 `this` 값을 설정할 땐 객체 정의가 사용되지 않기 때문입니다. `this` 값은 호출 시점에 결정됩니다.

위 코드에서 `makeUser()` 내 `this`는 `undefined`가 됩니다. 메서드로써 호출된 게 아니라 함수로써 호출되었기 때문입니다.

`this` 값은 전체 함수가 됩니다. 코드 블록과 객체 리터럴은 여기에 영향을 주지 않습니다. 

따라서 `ref: this`는 함수의 현재 `this` 값을 가져옵니다.

`this`의 값이 `undefined`가 되게 함수를 다시 작성하면 다음과 같습니다.

```js run
function makeUser(){
  return this; // 이번엔 객체 리터럴을 사용하지 않았습니다.
}

alert( makeUser().name ); // Error: Cannot read property 'name' of undefined
```
보시다시피 `alert( makeUser().name )`와 위쪽에서 살펴본 `alert( user.ref.name )`의 결과가 같은 것을 확인할 수 있습니다.

에러가 발생하지 않게 하려면 코드를 다음과 같이 수정하면 됩니다.

```js run
function makeUser() {
  return {
    name: "John",
*!*
    ref() {
      return this;
    }
*/!*
  };
};

let user = makeUser();

alert( user.ref().name ); // John
```

이렇게 하면 `user.ref()`가 메서드가 되고 `this`는 `.` 앞의 객체가 되기 때문에 에러가 발생하지 않습니다.
