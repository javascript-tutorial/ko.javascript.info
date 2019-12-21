`"constructor"` 프로퍼티에 제대로 된 값이 저장되어있다면 위와 같은 접근법이 가능합니다.

기본 `"prototype"`를 변경하지 않았다면 아래 예시는 의도한 대로 동작합니다.

```js run
function User(name) {
  this.name = name;
}

let user = new User('John');
let user2 = new user.constructor('Pete');

alert( user2.name ); // Pete (잘 동작하네요!)
```

`User.prototype.constructor == User`이기 때문에 위 예시는 제대로 동작합니다.

그런데 누군가가 `User.prototype`를 덮어쓰고 `User`를 참조하는 `constructor`를 다시 만들어주는 걸 잊었다면 문제의 접근법은 실패합니다.

예시:

```js run
function User(name) {
  this.name = name;
}
*!*
User.prototype = {}; // (*)
*/!*

let user = new User('John');
let user2 = new user.constructor('Pete');

alert( user2.name ); // undefined
```

왜 `user2.name`이 `undefined`가 될까요?

그 이유는 `new user.constructor('Pete')`가 아래와 같이 동작하기 때문입니다.

1. `new user.constructor('Pete')`는 `user`에서 `constructor`를 찾는데 아무것도 찾지 못합니다.
2. 객체에서 원하는 프로퍼티를 찾지 못했기 때문에 프로토타입에서 검색을 시작합니다. `user`의 프로토타입은 `User.prototype`인데, `User.prototype`은 빈 객체입니다.
3. `User.prototype`은 일반 객체 `{}`이고, 일반 객체의 프로토타입은 `Object.prototype`입니다. `Object.prototype.constructor == Object`이므로 `Object`가 사용됩니다.

결국에 `let user2 = new user.constructor('Pete');`는 `let user2 = new Object('Pete')`가 됩니다. 그런데 `Object`의 생성자는 인수를 무시하고 항상 빈 객체를 생성합니다. 따라서 `let user2 = new Object('Pete')`는 `let user2 = {}`와 같다고 생각할 수 있습니다. `user2.name`이 `undefined`인 이유가 여기에 있습니다.
