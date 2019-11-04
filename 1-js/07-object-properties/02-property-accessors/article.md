
# 프로퍼티 획득자와 설정자

두 종류의 프로퍼티가 있습니다.

<<<<<<< HEAD
첫 번째는 *데이터 프로퍼티(data properties)* 입니다. 이미 데이터 프로퍼티가 어떻게 작동하는지 알고 있습니다. 지금까지 사용해온 모든 프로퍼티는 데이터 프로퍼티입니다.
=======
The first kind is *data properties*. We already know how to work with them. All properties that we've been using until now were data properties.
>>>>>>> ec21af8aef6930388c06ee4cd8f8f6769f9d305b

두 번째 프로퍼티는 새로운 것입니다. *접근자 프로퍼티(accessor properties)* 입니다. 접근자 프로퍼티는 기본적으로 값을 획득하고 설정하는 일을 하는 함수입니다. 하지만 외부 코드에서는 일반적인 프로퍼티처럼 보입니다.

## Getters와 setters

접근자 프로퍼티는 'getter'와 'setter' 메서드로 표현합니다. 객체 리터럴(object literal)에서 `get`과 `set`으로 표시합니다.

```js
let obj = {
  *!*get propName()*/!* {
    // getter, 해당 코드는 obj.propName을 획득할 때 실행됩니다.
  },

  *!*set propName(value)*/!* {
    // setter, 해당 코드는 obj.propNAme = value를 설정할 때 실행됩니다.
  }
};
```

getter는 `obj.propName`을 읽을 때 작동하고, setter는 읽은 값이 할당될 때 작동합니다.

예를 들면, `name`과 `surname` 프로퍼티를 가진 `user`라는 객체가 있습니다.

```js
let user = {
  name: "John",
  surname: "Smith"
};
```

지금 `fullName` 이라는 프로퍼티를 추가하길 원합니다. 그 'fullName'은 `'John Smith'`라고 하려고 합니다. 물론, 이미 존재하는 정보를 복사-붙여넣기 하기를 원하지는 않습니다. 그래서 접근자로 해당 정보를 구현하려고 합니다.

```js run
let user = {
  name: "John",
  surname: "Smith",

*!*
  get fullName() {
    return `${this.name} ${this.surname}`;
  }
*/!*
};

*!*
alert(user.fullName); // John Smith
*/!*
```

외부에서는 접근자 프로퍼티가 평범하게 보입니다. 이것이 접근자 프로퍼티의 아이디어입니다. `user.fullName`을 함수로 *호출* 하지 않고, 평범하게 *읽습니다*. 뒤에서 getter가 작동합니다.

지금 `fullName`은 getter만 가집니다. `user.fullName=`와 같이 할당하려고 시도하면, 에러가 일어날 것입니다.

```js run
let user = {
  get fullName() {
    return `...`;
  }
};

*!*
user.fullName = "Test"; // Error (property has only a getter)
*/!*
```

`user.fullName`에 setter를 추가해서 고쳐봅시다.

```js run
let user = {
  name: "John",
  surname: "Smith",

  get fullName() {
    return `${this.name} ${this.surname}`;
  },

*!*
  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  }
*/!*
};

// 주어진 값으로 실행된 fullName을 설정합니다.
user.fullName = "Alice Cooper";

alert(user.name); // Alice
alert(user.surname); // Cooper
```

결과적으로 `fullName`이라는 가상의 프로퍼티를 가집니다. 이 프로퍼티는 읽고 쓸 수 있습니다. 그러나 사실 존재하지 않습니다.

```smart header="`delete` 처리 방법 없음"
접근자 프로퍼티의 삭제를 처리하는 메서드가 없습니다. getter/setter 메서드만 존재합니다.
```

## 접근자 설명자(Accessor descriptors)

데이터 프로퍼티와 비교하면 접근자 프로퍼티를 위한 설명자는 다릅니다.

접근자 프로퍼티의 경우 `값`과 `쓰기 기능`은 없지만, 대신에 `get`과 `set` 이라는 함수가 있습니다.

그래서 접근자 설명자는 다음과 같은 것들을 가질 수 있습니다.

- **`get`** -- 인수가 없고 프로퍼티를 읽을 때 작동하는 함수
- **`set`** -- 하나의 인수를 가지고 프로퍼티를 설정할 때 호출되는 함수
- **`enumerable`** -- 데이터 프로퍼티와 동일
- **`configurable`** -- 데이터 프로퍼티와 동일

예를 들어 `defineProperty`를 사용하여 `fullName` 접근자를 생성하기 위해, `get`과 `set`으로 설명자를 전달할 수 있습니다.

```js run
let user = {
  name: "John",
  surname: "Smith"
};

*!*
Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.name} ${this.surname}`;
  },

  set(value) {
    [this.name, this.surname] = value.split(" ");
  }
*/!*
});

alert(user.fullName); // John Smith

for(let key in user) alert(key); // name, surname
```

프로퍼티는 접근자(`get/set` 메서드를 가짐) 또는 데이터 프로퍼티(`value`를 가짐) 중 하나여야 한다는 점을 기억해 주세요. 둘 다 일수는 없습니다.

같은 설명자에 `get`과 `value`를 동시에 제공하려 하면 에러가 일어납니다.

```js run
*!*
// Error: Invalid property descriptor.
*/!*
Object.defineProperty({}, 'prop', {
  get() {
    return 1
  },

  value: 2
});
```

## 더 똑똑한 getters/setters

Getters/setters는 '실제' 프로퍼티 값에 대한 래퍼(wrappers)로 사용해서 보다 많은 제어권을 얻을 수 있습니다.

예를 들어 `user`가 너무 짧은 이름을 가지는 것을 방지하기를 원한다면, setter `name`을 가질 수 있습니다. 그리고 별도의 프로퍼티 `_name` 안에 값을 보관할 수 있습니다.

```js run
let user = {
  get name() {
    return this._name;
  },

  set name(value) {
    if (value.length < 4) {
      alert("이름이 너무 짧습니다. 적어도 4글자 이상이 필요합니다.");
      return;
    }
    this._name = value;
  }
};

user.name = "Pete";
alert(user.name); // Pete

user.name = ""; // Name이 너무 짧습니다...
```

이름은 `_name` 프로퍼티에 저장되고, 접근은 getter와 setter를 통해 이루어집니다. 

기술적으로 외부 코드는 여전히 `user._name`을 사용해서 이름에 바로 접근할 수 있을지 모릅니다. 그러나 밑줄 `'_'` 로 시작하는 프로퍼티는 내부적인 것이고 외부에 있는 객체로부터 접근되지 않아야 한다는 잘 알려진 합의가 있습니다.


## 호환성을 위한 사용

<<<<<<< HEAD
접근자의 주요 용도중 하나는, '정규' 데이터 프로퍼티를 getter와 setter로 교체하고 행동을 수정하여 언제든지 제어할 수 있도록 한다는 것입니다.

데이터 프로퍼티 `name`과 `age`를 사용해서 유저 객체를 구현했다고 해봅시다.
=======
One of the great uses of accessors is that they allow to take control over a "regular" data property at any moment by replacing it with a getter and a setter and tweak its behavior.

Imagine we started implementing user objects using data properties `name` and `age`:
>>>>>>> ec21af8aef6930388c06ee4cd8f8f6769f9d305b

```js
function User(name, age) {
  this.name = name;
  this.age = age;
}

let john = new User("John", 25);

alert(john.age); // 25
```

하지만 이런 것은 바뀔지도 모릅니다. `age` 대신에 `birthday`를 저장하기로 할 수도 있습니다. 좀 더 정확하고 편리하기 때문입니다.

```js
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;
}

let john = new User("John", new Date(1992, 6, 1));
```

이제 `age` 프로퍼티를 그대로 사용하는 오래된 코드로 무엇을 해야 할까요?

이런 것들을 모두 찾아서 고쳐볼 수 있습니다. 그러나 시간이 걸리는 일이고, 그 코드가 다수의 다른 사람들이 사용한 코드라면 수정하기가 어려울 수 있습니다. 게다가 `age`는 `user` 안에 있는 것이 좋을까요?

그대로 둡시다.

`age`를 위한 getter를 추가해서 문제를 해결합니다.

```js run no-beautify
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;

*!*
  // age는 현재 날짜와 생일을 기준으로 계산됩니다.
  Object.defineProperty(this, "age", {
    get() {
      let todayYear = new Date().getFullYear();
      return todayYear - this.birthday.getFullYear();
    }
  });
*/!*
}

let john = new User("John", new Date(1992, 6, 1));

alert( john.birthday ); // birthday는 이용 가능합니다.
alert( john.age );      // age도 마찬가지입니다.
```

이제 오래된 코드도 작동하고, 추가로 멋진 프로퍼티도 가지게 되었습니다.
