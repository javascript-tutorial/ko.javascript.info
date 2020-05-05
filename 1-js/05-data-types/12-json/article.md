# JSON과 메서드

복잡한 객체를 다루고 있다고 가정해 봅시다. 네트워크를 통해 객체를 어딘가에 보내거나 로깅 목적으로 객체를 출력해야 한다면 객체를 문자열로 전환해야 할겁니다.

이때 전환된 문자열엔 원하는 정보가 있는 객체 프로퍼티 모두가 포함되어야만 합니다.

아래와 같은 메서드를 구현해 객체를 문자열로 전환해봅시다.

```js run
let user = {
  name: "John",
  age: 30,

*!*
  toString() {
    return `{name: "${this.name}", age: ${this.age}}`;
  }
*/!*
};

alert(user); // {name: "John", age: 30}
```

그런데 개발 과정에서 프로퍼티가 추가되거나 삭제, 수정될 수 있습니다. 이렇게 되면 위에서 구현한 `toString`을 매번 수정해야 하는데 이는 아주 고통스러운 작업이 될 겁니다. 프로퍼티에 반복문을 돌리는 방법을 대안으로 사용할 수 있는데, 중첩 객체 등으로 인해 객체가 복잡한 경우 이를 문자열로 변경하는 건 까다로운 작업이라 이마저도 쉽지 않을 겁니다.

다행히 자바스크립트엔 이런 문제를 해결해주는 방법이 있습니다. 관련 기능이 이미 구현되어 있어서 우리가 직접 코드를 짤 필요가 없습니다.

## JSON.stringify

[JSON](http://en.wikipedia.org/wiki/JSON) (JavaScript Object Notation)은 값이나 객체를 나타내주는 범용 포맷으로, [RFC 4627](http://tools.ietf.org/html/rfc4627) 표준에 정의되어 있습니다. JSON은 본래 자바스크립트에서 사용할 목적으로 만들어진 포맷입니다. 그런데 라이브러리를 사용하면 자바스크립트가 아닌 언어에서도 JSON을 충분히 다룰 수 있어서, JSON을 데이터 교환 목적으로 사용하는 경우가 많습니다. 특히 클라이언트 측 언어가 자바스크립트일 때 말이죠. 서버 측 언어는 무엇이든 상관없습니다. 

자바스크립트가 제공하는 JSON 관련 메서드는 아래와 같습니다.

- `JSON.stringify` -- 객체를 JSON으로 바꿔줍니다.
- `JSON.parse` -- JSON을 객체로 바꿔줍니다.

객체 `student`에 `JSON.stringify`를 적용해봅시다.
```js run
let student = {
  name: 'John',
  age: 30,
  isAdmin: false,
  courses: ['html', 'css', 'js'],
  wife: null
};

*!*
let json = JSON.stringify(student);
*/!*

alert(typeof json); // 문자열이네요!

alert(json);
*!*
/* JSON으로 인코딩된 객체:
{
  "name": "John",
  "age": 30,
  "isAdmin": false,
  "courses": ["html", "css", "js"],
  "wife": null
}
*/
*/!*
```

`JSON.stringify(student)`를 호출하자 `student`가 문자열로 바뀌었습니다.

이렇게 변경된 문자열은 *JSON으로 인코딩된(JSON-encoded)*, *직렬화 처리된(serialized)*, *문자열로 변환된(stringified)*, *결집된(marshalled)* 객체라고 부릅니다. 객체는 이렇게 문자열로 변환된 후에야 비로소 네트워크를 통해 전송하거나 저장소에 저장할 수 있습니다. 


JSON으로 인코딩된 객체는 일반 객체와 다른 특징을 보입니다.

- 문자열은 큰따옴표로 감싸야 합니다. JSON에선 작은따옴표나 백틱을 사용할 수 없습니다(`'John'`이 `"John"`으로 변경된 것을 통해 이를 확인할 수 있습니다).
- 객체 프로퍼티 이름은 큰따옴표로 감싸야 합니다(`age:30`이 `"age":30`으로 변한 것을 통해 이를 확인할 수 있습니다).

`JSON.stringify`는 객체뿐만 아니라 원시값에도 적용할 수 있습니다.

적용할 수 있는 자료형은 아래와 같습니다.

- 객체 `{ ... }`
- 배열 `[ ... ]`
- 원시형:
    - 문자형
    - 숫자형
    - 불린형 값 `true`와 `false`
    - `null`

예시:

```js run
// 숫자를 JSON으로 인코딩하면 숫자입니다.
alert( JSON.stringify(1) ) // 1

// 문자열을 JSON으로 인코딩하면 문자열입니다(다만, 큰따옴표가 추가됩니다).
alert( JSON.stringify('test') ) // "test"

alert( JSON.stringify(true) ); // true

alert( JSON.stringify([1, 2, 3]) ); // [1,2,3]
```

JSON은 데이터 교환을 목적으로 만들어진 언어에 종속되지 않는 포맷입니다. 따라서 자바스크립트 특유의 객체 프로퍼티는 `JSON.stringify`가 처리할 수 없습니다.

`JSON.stringify` 호출 시 무시되는 프로퍼티는 아래와 같습니다.

- 함수 프로퍼티 (메서드)
- 심볼형 프로퍼티 (키가 심볼인 프로퍼티)
- 값이 `undefined`인 프로퍼티

```js run
let user = {
  sayHi() { // 무시
    alert("Hello");
  },
  [Symbol("id")]: 123, // 무시
  something: undefined // 무시
};

alert( JSON.stringify(user) ); // {} (빈 객체가 출력됨)
```

대개 이 프로퍼티들은 무시 되어도 괜찮습니다. 그런데 이들도 문자열에 포함시켜야 하는 경우가 생기곤 하는데 이에 대해선 아래에서 다루도록 하겠습니다. 

`JSON.stringify`의 장점 중 하나는 중첩 객체도 알아서 문자열로 바꿔준다는 점입니다.

예시:

```js run
let meetup = {
  title: "Conference",
*!*
  room: {
    number: 23,
    participants: ["john", "ann"]
  }
*/!*
};

alert( JSON.stringify(meetup) );
/* 객체 전체가 문자열로 변환되었습니다.
{
  "title":"Conference",
  "room":{"number":23,"participants":["john","ann"]},
}
*/
```

`JSON.stringify`를 사용할 때 주의하셔야 할 점이 하나 있습니다. 순환 참조가 있으면 원하는 대로 객체를 문자열로 바꾸는 게 불가능합니다.

예시:

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: ["john", "ann"]
};

meetup.place = room;       // meetup은 room을 참조합니다.
room.occupiedBy = meetup; // room은 meetup을 참조합니다.

*!*
JSON.stringify(meetup); // Error: Converting circular structure to JSON
*/!*
```

`room.occupiedBy`는 `meetup`을, `meetup.place`는 `room`을 참조하기 때문에 JSON으로의 변환이 실패했습니다.

![](json-meetup.svg)


## replacer로 원하는 프로퍼티만 직렬화하기

`JSON.stringify`의 전체 문법은 아래와 같습니다.

```js
let json = JSON.stringify(value[, replacer, space])
```

value
: 인코딩 하려는 값

replacer
: JSON으로 인코딩 하길 원하는 프로퍼티가 담긴 배열. 또는 매핑 함수 `function(key, value)`

space
: 서식 변경 목적으로 사용할 공백 문자 수

대다수의 경우 `JSON.stringify`엔 인수를 하나만 넘겨서 사용합니다. 그런데 순환 참조를 다뤄야 하는 경우같이 전환 프로세스를 정교하게 조정하려면 두 번째 인수를 사용해야 합니다. 

JSON으로 변환하길 원하는 프로퍼티가 담긴 배열을 두 번째 인수로 넘겨주면 이 프로퍼티들만 인코딩할 수 있습니다.

예시:

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room // meetup은 room을 참조합니다.
};

room.occupiedBy = meetup; // room references meetup

alert( JSON.stringify(meetup, *!*['title', 'participants']*/!*) );
// {"title":"Conference","participants":[{},{}]}
```

배열에 넣어준 프로퍼티가 잘 출력된 것을 확인할 수 있습니다. 그런데 배열에 `name`을 넣지 않아서 출력된 문자열의 `participants`가 텅 비어버렸네요. 규칙이 너무 까다로워서 발생한 문제입니다.

순환 참조를 발생시키는 프로퍼티 `room.occupiedBy`만 제외하고 모든 프로퍼티를 배열에 넣어봅시다.

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room // meetup references room
};

room.occupiedBy = meetup; // room references meetup

alert( JSON.stringify(meetup, *!*['title', 'participants', 'place', 'name', 'number']*/!*) );
/*
{
  "title":"Conference",
  "participants":[{"name":"John"},{"name":"Alice"}],
  "place":{"number":23}
}
*/
```

`occupiedBy`를 제외한 모든 프로퍼티가 직렬화되었습니다. 그런데 배열이 좀 길다는 느낌이 듭니다.

`replacer` 자리에 배열 `대신` 함수를 전달해 이 문제를 해결해 봅시다(매개변수 replacer는 '대신하다'라는 뜻을 가진 영단어 replace에서 그 이름이 왔습니다 - 옮긴이).

`replacer`에 전달되는 함수(`replacer` 함수)는 프로퍼티 `(키, 값)` 쌍 전체를 대상으로 호출되는데, 반드시 기존 프로퍼티 값을 대신하여 사용할 값을 반환해야 합니다. 특정 프로퍼티를 직렬화에서 누락시키려면 반환 값을 `undefined`로 만들면 됩니다.

아래 예시는 `occupiedBy`를 제외한 모든 프로퍼티의 값을 변경 없이 "그대로" 직렬화하고 있습니다. `occupiedBy`는 `undefined`를 반환하게 해 직렬화에 포함하지 않은 것도 확인해 보시길 바랍니다.

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room // meetup은 room을 참조합니다
};

room.occupiedBy = meetup; // room은 meetup을 참조합니다

alert( JSON.stringify(meetup, function replacer(key, value) {
  alert(`${key}: ${value}`);
  return (key == 'occupiedBy') ? undefined : value;
}));

/* replacer 함수에서 처리하는 키:값 쌍 목록
:             [object Object]
title:        Conference
participants: [object Object],[object Object]
0:            [object Object]
name:         John
1:            [object Object]
name:         Alice
place:        [object Object]
number:       23
*/
```

`replacer` 함수가 중첩 객체와 배열의 요소까지 포함한 모든 키-값 쌍을 처리하고 있다는 점에 주목해주시기 바랍니다. `replacer` 함수는 재귀적으로 키-값 쌍을 처리하는데, 함수 내에서 `this`는 현재 처리하고 있는 프로퍼티가 위치한 객체를 가리킵니다. 

첫 얼럿창에 예상치 못한 문자열(`":[object Object]"`)이 뜨는걸 볼 수 있는데, 이는 함수가 최초로 호출될 때 `{"": meetup}` 형태의 "래퍼 객체"가 만들어지기 때문입니다. `replacer`함수가 가장 처음으로 처리해야하는 `(key, value)` 쌍에서 키는 빈 문자열, 값은 변환하고자 하는 객체(meetup) 전체가 되는 것이죠.

이렇게 `replacer` 함수를 사용하면 중첩 객체 등을 포함한 객체 전체에서 원하는 프로퍼티만 선택해 직렬화 할 수 있습니다.


## space로 가독성 높이기

`JSON.stringify(value, replacer, space)`의 세 번째 인수 `space`는 가독성을 높이기 위해 중간에 삽입해 줄 공백 문자 수를 나타냅니다.

지금까진 `space` 없이 메서드를 호출했기 때문에 인코딩된 JSON에 들여쓰기나 여분의 공백문자가 하나도 없었습니다. `space`는 가독성을 높이기 위한 용도로 만들어졌기 때문에 단순 전달 목적이라면 `space` 없이 직렬화하는 편입니다.

아래 예시처럼 `space`에 `2`를 넘겨주면 자바스크립트는 중첩 객체를 별도의 줄에 출력해주고 공백 문자 두 개를 써 들여쓰기해 줍니다.
```js run
let user = {
  name: "John",
  age: 25,
  roles: {
    isAdmin: false,
    isEditor: true
  }
};

alert(JSON.stringify(user, null, 2));
/* 공백 문자 두 개를 사용하여 들여쓰기함:
{
  "name": "John",
  "age": 25,
  "roles": {
    "isAdmin": false,
    "isEditor": true
  }
}
*/

/* JSON.stringify(user, null, 4)라면 아래와 같이 좀 더 들여써집니다.
{
    "name": "John",
    "age": 25,
    "roles": {
        "isAdmin": false,
        "isEditor": true
    }
}
*/
```

이처럼 매개변수 `space`는 로깅이나 가독성을 높이는 목적으로 사용됩니다.

## 커스텀 "toJSON"

`toString`을 사용해 객체를 문자형으로 변환시키는 것처럼, 객체에 `toJSON`이라는 메서드가 구현되어 있으면 객체를 JSON으로 바꿀 수 있을 겁니다. `JSON.stringify`는 이런 경우를 감지하고 `toJSON`을 자동으로 호출해줍니다.

예시:

```js run
let room = {
  number: 23
};

let meetup = {
  title: "Conference",
  date: new Date(Date.UTC(2017, 0, 1)),
  room
};

alert( JSON.stringify(meetup) );
/*
  {
    "title":"Conference",
*!*
    "date":"2017-01-01T00:00:00.000Z",  // (1)
*/!*
    "room": {"number":23}               // (2)
  }
*/
```

Date 객체의 내장 메서드 `toJSON`이 호출되면서 `date`의 값이 문자열로 변환된 걸 확인할 수 있습니다(`(1)`).

이번엔 `room`에 직접 커스텀 메서드 `toJSON`을 추가해 봅시다. 그리고 `(2)`로 표시한 줄이 어떻게 변경되는지 확인해 봅시다.

```js run
let room = {
  number: 23,
*!*
  toJSON() {
    return this.number;
  }
*/!*
};

let meetup = {
  title: "Conference",
  room
};

*!*
alert( JSON.stringify(room) ); // 23
*/!*

alert( JSON.stringify(meetup) );
/*
  {
    "title":"Conference",
*!*
    "room": 23
*/!*
  }
*/
```

위와 같이 `toJSON`은 `JSON.stringify(room)`를 직접 호출할 때도 사용할 수 있고, `room`과 같은 중첩객체에도 구현하여 사용할 수 있습니다.


## JSON.parse

[JSON.parse](mdn:js/JSON/parse)를 사용하면 JSON으로 인코딩된 객체를 다시 객체로 디코딩 할 수 있습니다.

문법:
```js
let value = JSON.parse(str, [reviver]);
```

str
: JSON 형식의 문자열

reviver
: 모든 `(key, value)` 쌍을 대상으로 호출되는 function(key,value) 형태의 함수로 값을 변경시킬 수 있습니다. 

예시:

```js run
// 문자열로 변환된 배열
let numbers = "[0, 1, 2, 3]";

numbers = JSON.parse(numbers);

alert( numbers[1] ); // 1
```

`JSON.parse`는 아래와 같이 중첩 객체에도 사용할 수 있습니다.

```js run
let userData = '{ "name": "John", "age": 35, "isAdmin": false, "friends": [0,1,2,3] }';

let user = JSON.parse(userData);

alert( user.friends[1] ); // 1
```

중첩 객체나 중쳡 배열이 있다면 JSON도 복잡해지기 마련인데, 그렇더라도 결국엔 JSON 포맷 지켜야 합니다.

아래에서 디버깅 등의 목적으로 직접 JSON을 만들 때 흔히 저지르는 실수 몇 개를 간추려보았습니다. 참고하시어 이와 같은 실수를 저지르지 않으시길 바랍니다.

```js
let json = `{
  *!*name*/!*: "John",                     // 실수 1: 프로퍼티 이름을 큰따옴표로 감싸지 않았습니다.
  "surname": *!*'Smith'*/!*,               // 실수 2: 프로퍼티 값은 큰따옴표로 감싸야 하는데, 작은따옴표로 감쌌습니다.
  *!*'isAdmin'*/!*: false                  // 실수 3: 프로퍼티 키는 큰따옴표로 감싸야 하는데, 작은따옴표로 감쌌습니다.
  "birthday": *!*new Date(2000, 2, 3)*/!*, // 실수 4: "new"를 사용할 수 없습니다. 순수한 값(bare value)만 사용할 수 있습니다.
  "friends": [0,1,2,3]              // 이 프로퍼티는 괜찮습니다.
}`;
```

JSON은 주석을 지원하지 않는다는 점도 기억해 놓으시기 바랍니다. 주석을 추가하면 유효하지 않은 형식이 됩니다.

키를 큰따옴표로 감싸지 않아도 되고 주석도 지원해주는 [JSON5](http://json5.org/)라는 포맷도 있는데, 이 포맷은 자바스크립트 명세서에서 정의하지 않은 독자적인 라이브러리입니다.

JSON 포맷이 까다로운 규칙을 가지게 된 이유는 개발자의 귀차니즘 때문이 아니고, 쉽고 빠르며 신뢰할 수 있을 만한 파싱 알고리즘을 구현하기 위해서입니다.

## reviver 사용하기

서버로부터 문자열로 변환된 `meetup` 객체를 전송받았다고 가정해봅시다. 

전송받은 문자열은 아마 아래와 같이생겼을겁니다.

```js
// title: (meetup 제목), date: (meetup 일시)
let str = '{"title":"Conference","date":"2017-11-30T12:00:00.000Z"}';
```

이제 이 문자열을 *역 직렬화(deserialize)* 해서 자바스크립트 객체를 만들어봅시다.  

`JSON.parse`를 호출해보죠.

```js run
let str = '{"title":"Conference","date":"2017-11-30T12:00:00.000Z"}';

let meetup = JSON.parse(str);

*!*
alert( meetup.date.getDate() ); // 에러!
*/!*
```

엇! 에러가 발생하네요!

`meetup.date`의 값은 `Date` 객체가 아니고 문자열이기 때문에 발생한 에러입니다. 그렇다면 문자열을 `Date`로 전환해줘야 한다는 걸 어떻게 `JSON.parse`에게 알릴 수 있을까요?

이럴 때 `JSON.parse`의 두 번째 인수 `reviver`를 사용하면 됩니다. 모든 값은 "그대로", 하지만 `date`만큼은 `Date` 객체를 반환하도록 함수를 구현해 봅시다.   

```js run
let str = '{"title":"Conference","date":"2017-11-30T12:00:00.000Z"}';

*!*
let meetup = JSON.parse(str, function(key, value) {
  if (key == 'date') return new Date(value);
  return value;
});
*/!*

alert( meetup.date.getDate() ); // 이제 제대로 동작하네요!
```

참고로 이 방식은 중첩 객체에도 적용할 수 있습니다.

```js run
let schedule = `{
  "meetups": [
    {"title":"Conference","date":"2017-11-30T12:00:00.000Z"},
    {"title":"Birthday","date":"2017-04-18T12:00:00.000Z"}
  ]
}`;

schedule = JSON.parse(schedule, function(key, value) {
  if (key == 'date') return new Date(value);
  return value;
});

*!*
alert( schedule.meetups[1].date.getDate() ); // 잘 동작합니다!
*/!*
```



## 요약

- JSON은 독자적인 표준을 가진 데이터 형식으로, 대부분의 언어엔 JSON을 쉽게 다룰 수 있게 해주는 라이브러리가 있습니다. 
- JSON은 일반 객체, 배열, 문자열, 숫자, 불린값, `null`을 지원합니다.
- [JSON.stringify](mdn:js/JSON/stringify)를 사용하면 원하는 값을 JSON으로 직렬화 할 수 있고, [JSON.parse](mdn:js/JSON/parse)를 사용하면 JSON을 본래 값으로 역 직렬화 할 수 있습니다.
- 위 두 메서드에 함수를 인수로 넘겨주면 원하는 값만 읽거나 쓰는 게 가능합니다.
- `JSON.stringify`는 객체에 `toJSON` 메서드가 있으면 이를 자동으로 호출해줍니다.
