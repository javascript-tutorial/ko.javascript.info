importance: 5

---

# 객체 매핑하기

세 개의 프로퍼티 `name`과 `surname`, `id`를 가진 객체 `user`가 담긴 배열이 있습니다.

`name`과 `surname`을 조합해 `fullName`을 만들고, 이를 이용해 두 개의 프로퍼티 `id`와 `fullName`을 가진 객체를 담은 새로운 배열을 반환해주는 코드를 작성해보세요.  

예시:

```js no-beautify
let john = { name: "John", surname: "Smith", id: 1 };
let pete = { name: "Pete", surname: "Hunt", id: 2 };
let mary = { name: "Mary", surname: "Key", id: 3 };

let users = [ john, pete, mary ];

*!*
let usersMapped = /* 여기에 코드를 작성하세요. */
*/!*

/*
usersMapped = [
  { fullName: "John Smith", id: 1 },
  { fullName: "Pete Hunt", id: 2 },
  { fullName: "Mary Key", id: 3 }
]
*/

alert( usersMapped[0].id ) // 1
alert( usersMapped[0].fullName ) // John Smith
```

문제를 해결하려면 배열을 새로운 배열로 매핑해야 합니다. 힌트를 하나 드리자면 `=>`를 이용하는 것입니다.