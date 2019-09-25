
```js run no-beautify
let john = { name: "John", surname: "Smith", id: 1 };
let pete = { name: "Pete", surname: "Hunt", id: 2 };
let mary = { name: "Mary", surname: "Key", id: 3 };

let users = [ john, pete, mary ];

*!*
let usersMapped = users.map(user => ({
  fullName: `${user.name} ${user.surname}`,
  id: user.id
}));
*/!*

/*
usersMapped = [
  { fullName: "John Smith", id: 1 },
  { fullName: "Pete Hunt", id: 2 },
  { fullName: "Mary Key", id: 3 }
]
*/

alert( usersMapped[0].id ); // 1
alert( usersMapped[0].fullName ); // John Smith
```

화살표 함수 우측에 괄호를 썼다는 점에 주목해주시기 바랍니다.

아래와 같이 괄호 없이 코드를 작성할 수 없습니다.
```js
let usersMapped = users.map(user => *!*{*/!*
  fullName: `${user.name} ${user.surname}`,
  id: user.id
});
```

앞서 배웠듯이 화살표 함수는 본문이 없는 형태인 `value => expr`와 본문이 있는 형태인 `value => {...}` 두 방법으로 작성할 수 있습니다.

중괄호 `{`를 만나면 자바스크립트는 이를 객체의 시작이라 인식하지 않고 함수 본문이 시작되는 것이라 인식합니다. 소괄호를 사용하면 이를 피할 수 있습니다.  

```js
let usersMapped = users.map(user => *!*({*/!*
  fullName: `${user.name} ${user.surname}`,
  id: user.id
}));
```

이제 코드가 의도한 대로 동작합니다.


