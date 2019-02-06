
# 객체 (Objects)

우리가 <info:types> 챕터에서 배웠듯이, 자바스크립트에는 일곱 가지 데이터 타입이 존재합니다. 그중 여섯 개의 타입은 오직 하나의 값(문자열, 숫자 등)만 담을 수 있으므로 "기본 타입(primitive type)"이라고 불립니다.

이와 달리, 객체는 다양한 데이터와 복잡한 개체들의 키 컬렉션을 저장하기 위해 사용됩니다. 객체는 자바스크립트의 거의 모든 면에 스며들어 있습니다. 그러므로 우리는 다른 깊은 내용으로 들어가기 전에 먼저 객체를 이해해야 합니다.

객체는 중괄호 `{…}`를 통해 생성되는데, 부가적으로 *프로퍼티(properties)* 리스트가 올 수도 있습니다. 프로퍼티는 "키(key): 값(value)"의 쌍을 의미합니다. 여기서 `키`("프로퍼티 이름"으로도 불립니다)는 문자열이며, `값`으로는 무엇이든지 올 수 있습니다.

우리는 각각 이름이 적힌 파일이 보관된 서랍장을 객체라고 생각할 수 있습니다. 모든 자료는 파일 안에 키로 저장되어 있습니다. 이름을 통해 파일을 찾거나 추가/삭제하는 일은 쉽습니다.

![](object.png)

빈 객체("빈 서랍장")는 두 방식 중 하나를 사용해 만들 수 있습니다.:

```js
let user = new Object(); // "객체 생성자" 구문
let user = {};  // "객체 리터럴" 구문
```

![](object-user-empty.png)

일반적으로, 중괄호 `{...}`가 사용됩니다. 이 선언 방식을 *객체 리터럴*이라고 합니다.

## 리터럴과 프로퍼티

우리는 `{...}` 안에 바로 "키: 값"의 형태로 프로퍼티를 넣을 수 있습니다.

```js
let user = {     // 객체
  name: "John",  // "name" 키에 "John" 값을 저장
  age: 30        // "age" 키에 30 값을 저장
};
```

프로퍼티는 `":"` 왼쪽에 ("이름" 또는 "식별자"라고도 불리는) 키를 갖고 있으며 오른쪽에는 값을 갖고 있습니다.

`user` 객체에는 두 프로퍼티가 존재합니다.:

1. 첫 번째 프로퍼티는 `"name"`이라는 이름과 `"John"`이라는 값을 갖고 있습니다.
2. 두 번째 프로퍼티는 `"age"`라는 이름과 `30`이라는 값을 갖고 있습니다.

결과적으로 `user` 객체를 "name"과 "age"라는 이름의 파일들이 담긴 서랍장으로 생각할 수 있습니다.

![user object](object-user.png)

우리는 이 서랍장으로부터 아무 때나 파일을 추가하고, 삭제하거나 읽을 수 있습니다.

프로퍼티 값은 마침표 표기법을 이용해 접근할 수 있습니다.:

```js
// 객체의 필드 값 얻기:
alert( user.name ); // John
alert( user.age ); // 30
```

프로퍼티 값으로는 모든 데이터 타입이 가능합니다. 불린 타입의 프로퍼티를 추가해봅시다.:

```js
user.isAdmin = true;
```

![user object 2](object-user-isadmin.png)

`delete` 연산자를 이용해 프로퍼티를 삭제할 수 있습니다.:

```js
delete user.age;
```

![user object 3](object-user-delete.png)

여러 단어로 된 프로퍼티 이름을 사용할 수도 있지만, 반드시 따옴표로 묶여야 합니다.:

```js
let user = {
  name: "John",
  age: 30,
  "likes birds": true  // 여러 단어로 된 프로퍼티 이름은 따옴표로 묶여야 합니다.
};
```

![](object-user-props.png)


마지막 프로퍼티는 쉼표로 끝날 수도 있습니다.:
```js
let user = {
  name: "John",
  age: 30*!*,*/!*
}
```
이것을 "trailing" 또는 "hanging" comma 라고 부릅니다. 이 comma를 통해 모든 줄이 비슷한 모습을 갖게 되어 프로퍼티를 쉽게 추가/삭제/이동할 수 있게 됩니다.

## 대괄호

여러 단어로 된 프로퍼티 이름을 사용하면, 마침표 표기법을 사용할 수 없습니다.:

```js run
// 이 코드는 신택스 에러를 발생시킵니다.
user.likes birds = true
```

프로퍼티 키가 유효한 변수 식별자일 때만 마침표 표기법을 사용할 수 있기 때문입니다. 즉, 스페이스를 포함한 다른 제약들이 없어야 합니다.

어느 문자열과도 가능한 "대괄호 표기법" 이라는 대안이 존재합니다.:


```js run
let user = {};

// set
user["likes birds"] = true;

// get
alert(user["likes birds"]); // true

// delete
delete user["likes birds"];
```

이제 모든 것이 제대로 작동합니다. 대괄호 안의 문자열이 따옴표로 묶인다는 사실에 주의하세요(따옴표 타입은 상관없습니다).

또한 대괄호 표기법은 -- 문자열 리터럴이 아니라 -- 아래 코드에서 변수를 사용하는 것처럼 어느 표현식의 결과든지 프로퍼티 이름으로 사용할 수 있게 해줍니다.:

```js
let key = "likes birds";

// user["likes birds"] = true; 와 같습니다.
user[key] = true;
```

여기서 변수 `key`는 런타임에 계산되거나 사용자 입력값에 따라 달라질 수 있습니다. 그다음 우리는 프로퍼티에 접근하기 위해 이 변수를 사용합니다. 이것은 우리에게 상당한 유연성을 줍니다. 마침표 표기법은 이와 비슷한 방식으로 사용될 수 없습니다.

예를 들어:

```js run
let user = {
  name: "John",
  age: 30
};

let key = prompt("What do you want to know about the user?", "name");

// 변수로 접근
alert( user[key] ); // John (if enter "name")
```


### 계산된 프로퍼티(Computed properties)

우리는 객체 리터럴 안에서 대괄호를 사용할 수 있습니다. 이것을 *계산된 프로퍼티(computed properties)* 라고 부릅니다.

예를 들어:

```js run
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
*!*
  [fruit]: 5, // fruit 변수로부터 프로퍼티 이름을 받아옵니다.
*/!*
};

alert( bag.apple ); // 만약 fruit="apple" 이라면 5를 보여줍니다.
```

계산된 프로퍼티의 의미는 단순합니다. `[fruit]`은 프로퍼티 이름을 `fruit`으로부터 가져와야 한다는 것을 의미합니다.

따라서, 만약 한 방문객이 `"apple"`을 입력한다면, `bag`은 `{apple: 5}`가 될 것입니다.

근본적으로 이와 같은 방식으로 실행됩니다.:
```js run
let fruit = prompt("Which fruit to buy?", "apple");
let bag = {};

// fruit 변수로부터 프로퍼티 이름을 가져옵니다.
bag[fruit] = 5;
```

...하지만 앞서 봤던 코드가 더 근사해 보이네요.

우리는 대괄호 안에 더욱 복잡한 문들을 사용할 수 있습니다.:

```js
let fruit = 'apple';
let bag = {
  [fruit + 'Computers']: 5 // bag.appleComputers = 5
};
```

대괄호 표기법은 마침표 표기법보다 훨씬 더 강력합니다. 어떤 프로퍼티 이름이나 변수들을 사용할 수 있게 해줍니다. 하지만 작성하기에 더 번거로운 면이 있습니다.

그래서 대부분의 경우 프로퍼티 이름이 이미 정해져 있고 간단할 때 마침표 표기법을 사용합니다. 만약 우리가 더 복잡한 무언가가 필요하게 되면 대괄호 표기법을 사용하면 됩니다.



````smart header="예약어를 프로퍼티 이름으로 사용할 수 있습니다."
변수의 경우, "for", "let", "return" 등과 같은 자바스크립트의 예약어와 같은 이름을 사용할 수 없습니다.

하지만 객체 프로퍼티에는 이러한 제약이 없습니다. 어느 이름이나 가능합니다.:

```js run
let obj = {
  for: 1,
  let: 2,
  return: 3
};

alert( obj.for + obj.let + obj.return );  // 6
```

기본적으로 어느 이름이나 가능하지만 한 가지 예외사항이 존재합니다. `"__proto__"`은 역사적인 이유로 인해 특별한 취급을 받습니다. 예를 들어, 객체가 아닌 값에 이 이름을 사용할 수 없습니다.:

```js run
let obj = {};
obj.__proto__ = 5;
alert(obj.__proto__); // [object Object], 의도한 대로 작동하지 않습니다.
```

위 코드에서 볼 수 있듯이 기본값 `5`를 할당하는 것이 무시됩니다.

만약 우리가 임의의 키-값 쌍들을 어떤 객체 안에 저장하려고 한다면 이것은 버그나 취약성의 원인이 될 수 있으며 방문객이 그 키들을 지정하게 할 수도 있습니다.

이 경우에 방문객은 키로 "__proto__"를 지정할 수도 있으며 이 할당 로직은 (위에서 봤듯이) 망가질 것입니다.

객체들이 `__proto__`를 일반적인 프로퍼티로 취급하게 만드는 방법이 존재하며, 우리는 이것을 추후 다룰 것입니다. 그러나 먼저 우리는 객체에 대해 더 알아야 할 필요가 있습니다.
[Map](info:map-set-weakmap-weakset)이라는 또 다른 자료구조도 존재합니다. 우리는 임의의 키를 지원하는 <info:map-set-weakmap-weakset>에 대한 챕터에서 이에 대해 배울 것입니다.

````


## 프로퍼티 값 축약(Property value shorthand)

실제 코드에서는 프로퍼티 이름에 대한 값으로 기존의 변수 이름을 자주 사용합니다.

예를 들어:

```js run
function makeUser(name, age) {
  return {
    name: name,
    age: age
    // ...등등
  };
}

let user = makeUser("John", 30);
alert(user.name); // John
```

위 예제에서, 프로퍼티들은 변수와 같은 이름을 갖고 있습니다. 변수로부터 프로퍼티를 만드는 사례는 매우 흔하며, 이를 더 쉽게 만들기 위해 특별히 *프로퍼티 값 축약(property value shorthand)*이 존재합니다.

다음과 같이 `name:name` 대신 `name`만 적을 수 있게 됩니다.:

```js
function makeUser(name, age) {
*!*
  return {
    name, // name: name 와 같습니다.
    age   // age: age 와 같습니다.
    // ...
  };
*/!*
}
```

같은 객체 내에서 일반적인 표현과 축약 표현을 함께 사용할 수 있습니다.:

```js
let user = {
  name,  // name: name와 같습니다.
  age: 30
};
```

## 존재 확인

어느 프로퍼티에나 접근 가능하다는 것은 객체의 중요한 특징입니다. 만약 프로퍼티가 존재하지 않는다고 해도 에러가 발생하지 않습니다! 존재하지 않는 프로퍼티에 접근하면 `undefined`를 반환할 뿐이지요. 이것은 프로퍼티의 존재 여부를 테스트하는 매우 일반적인 방법을 제공해 줍니다. -- 우선 접근해보고 undefined인지 확인해보면 되니까요.:

```js run
let user = {};

alert( user.noSuchProperty === undefined ); // true는 "no such property"를 의미합니다.
```

프로퍼티의 존재를 확인하기 위해서는 특별한 연산자인 `"in"`을 사용할 수도 있습니다.

문법은 다음과 같습니다.:
```js
"key" in object
```

예를 들어:

```js run
let user = { name: "John", age: 30 };

alert( "age" in user ); // true, user.age가 존재합니다.
alert( "blabla" in user ); // false, user.blabla가 존재하지 않습니다.
```

`in`의 왼쪽에는 *프로퍼티 이름*이 있어야 한다는 사실을 주의하세요. 이 이름은 보통 따옴표로 묶인 문자열입니다.

만약 따옴표를 생략하게 되면, 그 이름을 가진 변수의 존재를 확인해보라는 의미가 됩니다. 예를 들어:

```js run
let user = { age: 30 };

let key = "age";
alert( *!*key*/!* in user ); // true, key로부터 가져온 값을 통해 프로퍼티의 존재를 확인합니다.
```

````smart header="`undefined` 값을 가진 프로퍼티에 \"in\" 사용하기"
일반적으로 일치를 확인하는 `"=== undefined"` 는 잘 작동합니다. 그러나 이것이 잘 작동하지 않는 특별한 경우도 있는데 반해 `"in"` 는 올바르게 작동합니다.

바로 객체 프로퍼티가 존재하지만 `undefined` 값을 갖고 있는 상황일 때 해당됩니다.:

```js run
let obj = {
  test: undefined
};

alert( obj.test ); // undefined, 그런 프로퍼티가 존재하지 않는 걸까요?

alert( "test" in obj ); // true, 프로퍼티는 존재합니다!
```


위 코드에서, `obj.test` 프로퍼티는 형식적으로 존재합니다. 그래서 `in` 연산자가 올바르게 작동합니다.

보통 `undefined` 값은 잘 할당되지 않기 때문에 이런 상황은 거의 일어나지 않습니다. 우리는 "알려지지 않았거나(unknown)" "비어 있는(empty)" 값에 주로 `null`을 사용합니다. 그래서 위 코드상의 `in` 연산자는 이국적인 손님과도 같습니다.
````


## "for..in" 반복문

객체의 모든 키를 탐색할 수 있도록 반복문의 특별한 형태인 `for..in`이 존재합니다. 이것은 우리가 이전에 배웠던 `for(;;)` 와는 완전히 다릅니다.

구문은 아래와 같습니다.:

```js
for(key in object) {
  // 객체의 프로퍼티 중 각 키에 대해 바디(body)를 수행합니다.
}
```

예를 들어, `user`의 모든 프로퍼티를 출력해봅시다.:

```js run
let user = {
  name: "John",
  age: 30,
  isAdmin: true
};

for(let key in user) {
  // 키
  alert( key );  // name, age, isAdmin
  // 키에 대한 값
  alert( user[key] ); // John, 30, true
}
```

여기서 `let key`와 같이 모든 "for" 구문은 반복문 안에서 반복문 변수를 선언할 수 있게 해줍니다.

또한, 우리는 `key` 대신에 다른 변수명을 사용할 수 있습니다. 예를 들어, `"for(let prop in obj)"`도 널리 사용되고 있습니다.


### 객체의 정렬 방식

객체는 정렬되어 있나요? 다시 말해, 만약 우리가 객체에 대해 반복문을 돌면 객체에 추가된 순서대로 프로퍼티들을 얻게 되나요? 이걸 신뢰할 수 있을까요?

간단한 대답은 "특별한 방식으로 정렬되어 있다"는 것입니다. 다시 말해, 숫자형 프로퍼티들은 정렬되어 있으며 다른 프로퍼티들은 생성된 순서대로 나타납니다. 자세히 살펴보도록 하죠.

예를 들어, 전화번호 코드가 담긴 객체를 생각해봅시다.:

```js run
let codes = {
  "49": "Germany",
  "41": "Switzerland",
  "44": "Great Britain",
  // ..,
  "1": "USA"
};

*!*
for(let code in codes) {
  alert(code); // 1, 41, 44, 49
}
*/!*
```

이 객체는 사용자에게 선택 목록을 제안하기 위해 사용될 수 있습니다. 만약 우리가 주로 독일 사용자를 위한 사이트를 만들고 있다면 아마 `49`가 맨 앞에 오기를 원할 것입니다.

하지만 이 코드를 돌려보면 완전히 다른 모습을 보게 됩니다.:

- USA (1)가 첫 번째로 등장합니다.
- 그 뒤로 Switzerland (41)가 등장하고 나머지가 뒤따릅니다.

전화번호 코드는 숫자형이기 때문에 오름차순으로 정렬되어 나타납니다. 그래서 우리는 `1, 41, 44, 49`와 같은 결과를 보게 됩니다.

````smart header="숫자형 프로퍼티? 그게 무엇인가요?"
"숫자형 프로퍼티"는 변함없이 숫자로부터 변환되거나 숫자로 변환될 수 있는 문자열을 의미합니다.

그래서 "49"는 숫자형 프로퍼티 이름입니다. "49"가 정수로 변환되거나 정수에서 변환될 때 여전히 같은 모습을 갖고 있기 때문이죠. 하지만 "+49"와 "1.2"는 다릅니다.:

```js run
// Math.trunc 는 소수부를 제거하는 내장 함수입니다
alert( String(Math.trunc(Number("49"))) ); // "49", 같습니다, 숫자형 프로퍼티입니다.
alert( String(Math.trunc(Number("+49"))) ); // "49", "+49"와 다릅니다 ⇒ 숫자형 프로퍼티가 아닙니다.
alert( String(Math.trunc(Number("1.2"))) ); // "1", "1.2"와 다릅니다 ⇒ 숫자형 프로퍼티가 아닙니다.
```
````

...반면에 만약 프로퍼티 키가 숫자형이 아니라면 생성된 순서대로 나열됩니다. 예를 들어:

```js run
let user = {
  name: "John",
  surname: "Smith"
};
user.age = 25; // 프로퍼티를 하나 추가합니다.

*!*
// 숫자형 프로퍼티가 아닌 것들은 생성된 순서로 나열됩니다.
*/!*
for (let prop in user) {
  alert( prop ); // name, surname, age
}
```

따라서, 전화번호 코드와 관련된 문제를 해결하기 위해서는 코드가 숫자형이 안되게 만드는 속임수를 쓸 수 있습니다. 각 코드 앞에 `"+"`를 추가하는 것으로 충분합니다.

Like this:

```js run
let codes = {
  "+49": "Germany",
  "+41": "Switzerland",
  "+44": "Great Britain",
  // ..,
  "+1": "USA"
};

for(let code in codes) {
  alert( +code ); // 49, 41, 44, 1
}
```

이제 코드는 의도한 대로 작동합니다.

## 참조에 의한 복사

객체와 기본 타입의 근본적인 차이 중 하나는 객체는 "참조에 의해" 저장되고 복사된다는 것입니다.

기본값: 문자열, 숫자, 불린 -- 은 "온전한 값으로" 할당되고 복사됩니다.

예를 들어:

```js
let message = "Hello!";
let phrase = message;
```

코드 실행 결과, 우리는 두 개의 서로 다른 변수를 갖고 있으며 각 변수는 `"Hello!"`라는 문자열을 저장하고 있습니다.

![](variable-copy-value.png)

객체는 이와 다릅니다.

**변수는 객체 자체를 저장하는 것이 아니라, 객체의 "메모리상의 주소", 즉 객체에 대한 "참조값"을 저장합니다.**

여기 객체를 나타내는 그림이 있습니다.:

```js
let user = {
  name: "John"
};
```

![](variable-contains-reference.png)

객체는 메모리의 어딘가에 저장되어 있습니다. 그리고 변수 `user`는 객체에 대한 참조값을 갖고 있습니다.

**객체 변수가 복사될 때 -- 즉, 객체의 참조값이 복사될 때, 그 객체는 복제되지 않습니다.**

우리가 객체를 서랍장으로 생각한다면, 변수는 서랍장을 열기 위한 열쇠입니다. 변수를 복사하는 것은 그 열쇠를 복제하는 것이지 서랍장 자체를 복제하진 않습니다.

예를 들어:

```js no-beautify
let user = { name: "John" };

let admin = user; // 참조를 복사합니다.
```

각 변수는 이제 같은 객체에 대한 참조값을 갖고 있습니다.:

![](variable-copy-reference.png)

서랍장에 접근하거나 서랍장의 내용물을 변경하기 위해 둘 중 아무 변수나 사용하면 됩니다.:

```js run
let user = { name: 'John' };

let admin = user;

*!*
admin.name = 'Pete'; // "admin" 참조값에 의해 변경되고
*/!*

alert(*!*user.name*/!*); // 'Pete', 변경사항이 "user" 참조값에서 확인됩니다.
```

위 예제는 오직 하나의 객체만 존재한다는 사실을 보여주고 있습니다. 우리가 키가 두 개 있는 서랍장을 갖고 있으며 서랍장을 열기 위해 하나의 키(`admin`)를 사용한 것처럼 말이죠. 그러고 나서 나중에 우리가 다른 하나의 키(`user`)를 사용하면, 변경사항을 확인하게 될 것입니다.

### 참조에 의한 비교

객체에 있어서 동등 연산자 `==` 와 일치 연산자 `===` 는 완전히 같은 방식으로 작동합니다.

**두 객체가 같은 객체일 때만 그들은 동등합니다.**

예를 들어, 두 변수가 같은 객체를 참조하면 그들은 동등합니다.:

```js run
let a = {};
let b = a; // 참조에 의한 복사

alert( a == b ); // true, 두 변수는 같은 객체를 참조합니다.
alert( a === b ); // true
```

여기서 독립된 두 객체는 둘 다 빈 객체일지라도 동등하지 않습니다.:

```js run
let a = {};
let b = {}; // 독립된 두 객체

alert( a == b ); // false
```

`obj1 > obj2`와 같은 비교나 기본값에 대한 비교 `obj == 5`에서 객체는 기본값으로 변환됩니다. 우리는 머지않아 객체 변환이 어떻게 이뤄지는지 배우게 될 것입니다. 그러나 사실 이러한 비교는 거의 필요하지 않으며 보통 코딩 실수에 의한 결과라고 할 수 있습니다.

### Const 객체

`const`로 선언된 객체는 *변경될 수 있습니다.*

예를 들어:

```js run
const user = {
  name: "John"
};

*!*
user.age = 25; // (*)
*/!*

alert(user.age); // 25
```

`(*)` 행이 에러를 일으킬 것처럼 보이지만 사실 전혀 문제가 없습니다. 왜냐하면 `const`가 `user` 자체의 값을 고정하기 때문입니다. 그리고 여기서 `user`은 언제나 같은 객체에 대한 참조값을 저장하고 있습니다. `(*)` 행은 객체의 *내부로* 들어가며, `user`를 재할당하지 않습니다.

만약 우리가 `user`를 다른 어떤 것으로 설정하고자 한다면 `const`가 에러를 발생시킬 것입니다. 예를 들어:

```js run
const user = {
  name: "John"
};

*!*
// 에러 (user를 재할당할 수 없습니다.)
*/!*
user = {
  name: "Pete"
};
```

...그러나 만약 상수 객체 프로퍼티를 만들고 싶다면 어떻게 될까요? 그러면 `user.age = 25`가 에러를 일으킬 수도 있습니다. <info:property-descriptors> 챕터에서 이에 대한 내용을 다룰 예정입니다.

## 복사와 병합, Object.assign

따라서, 객체 변수를 복사하는 것은 같은 객체에 대한 참조값을 하나 더 만들어 냅니다. 

하지만 만약 우리가 객체를 복제해야 할 때는 어떻게 할까요? 독립적인 복사본, 복제를 만들고 싶다면요?

물론 할 수는 있습니다만, 조금 더 어렵습니다. 왜냐하면 자바스크립트에는 이를 위한 내장 함수가 없기 때문입니다. 사실, 필요할 일이 거의 없긴 합니다. 대부분의 경우 참조에 의한 복사가 좋습니다.

그러나 우리가 정말 복제를 하고 싶다면, 새로운 객체를 만든 다음 기존 객체의 프로퍼티들을 순회하고 그것들을 모두 복사하면서 기존 객체의 구조를 복제해야 합니다.

이렇게 말이죠.:

```js run
let user = {
  name: "John",
  age: 30
};

*!*
let clone = {}; // 새로운 빈 객체

// 빈 객체에 모든 user 프로퍼티를 복사해 넣어봅시다.
for (let key in user) {
  clone[key] = user[key];
}
*/!*

// 이제 clone은 완전히 독립적인 복사본입니다.
clone.name = "Pete"; // clone의 데이터를 변경했습니다.

alert( user.name ); // 원본 객체에는 여전히 John이 있습니다.
```

또한 [Object.assign](mdn:js/Object/assign)를 사용하는 방법도 있습니다.

문법은 다음과 같습니다.:

```js
Object.assign(dest[, src1, src2, src3...])
```

- 인자 `dest` 와 `src1, ..., srcN` (필요에 따라 얼마든지 올 수 있습니다)는 객체입니다.
- 모든 객체 `src1, ..., srcN` 의 프로퍼티를 `dest`에 복사합니다. 다시 말해, 두 번째 인자부터 모든 객체들의 프로퍼티가 첫 번째 인자 객체로 복사됩니다. 이후 `dest`를 반환합니다.

예를 들어, 우리는 여러 객체를 하나의 객체로 병합하기 위해 이것을 사용할 수 있습니다.:
```js
let user = { name: "John" };

let permissions1 = { canView: true };
let permissions2 = { canEdit: true };

*!*
// permissions1와 permissions2의 모든 프로퍼티를 user로 복사합니다.
Object.assign(user, permissions1, permissions2);
*/!*

// 그 결과, user = { name: "John", canView: true, canEdit: true } 가 됩니다.
```

만약 복사를 받는 객체 (`user`)가 이미 같은 이름의 프로퍼티를 갖고 있다면, 새로운 값으로 덮어쓰여집니다.:

```js
let user = { name: "John" };

// name을 덮어 쓰고 isAdmin을 추가합니다.
Object.assign(user, { name: "Pete", isAdmin: true });

// 그 결과, user = { name: "Pete", isAdmin: true }
```

간단한 복사를 위한 반복문 대신 `Object.assign`를 사용할 수도 있습니다.

```js
let user = {
  name: "John",
  age: 30
};

*!*
let clone = Object.assign({}, user);
*/!*
```

이 코드는 `user`의 모든 프로퍼티를 빈 객체에 복사한 뒤 돌려줍니다. 사실, 반복문을 돌리는 것과 같은 작업이지만 코드가 더 짧아집니다.

지금까지 우리는 `user`의 모든 프로퍼티가 기본값이라고 가정했습니다. 그러나 프로퍼티는 다른 객체에 대한 참조값이 될 수도 있습니다. 이 경우에 어떻게 하면 될까요?

예제가 있습니다.:
```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

alert( user.sizes.height ); // 182
```

이제 `clone.sizes = user.sizes` 로 복사하는 것만으로는 충분하지 않습니다. `user.sizes` 는 객체이기 때문에 참조로 복사가 될 것입니다. 그러므로 `clone`과 `user`는 같은 sizes를 공유하게 됩니다.:

이렇게요.:
```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

let clone = Object.assign({}, user);

alert( user.sizes === clone.sizes ); // true, 같은 객체입니다.

// user와 clone는 sizes를 공유합니다.
user.sizes.width++;       // 한 객체에서 프로퍼티를 변경합니다.
alert(clone.sizes.width); // 51, 다른 객체에서 프로퍼티 값이 달라졌습니다.
```

이 문제를 해결하기 위해, 우리는  we should use the cloning loop that examines each value of `user[key]` and, if it's an object, then replicate its structure as well. That is called a "deep cloning".

There's a standard algorithm for deep cloning that handles the case above and more complex cases, called the [Structured cloning algorithm](http://w3c.github.io/html/infrastructure.html#safe-passing-of-structured-data). In order not to reinvent the wheel, we can use a working implementation of it from the JavaScript library [lodash](https://lodash.com), the method is called [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep).



## 요약

객체는 여러 특별한 특징을 가진 연관 배열입니다.

객체는 프로퍼티(키-값 형태)을 저장합니다.:
- 키는 문자열이나 심볼이어야 합니다 (보통 문자열을 사용합니다).
- 값은 어느 타입이나 가능합니다.

프로퍼티에 접근하기 위해서는 다음 방법을 사용할 수 있습니다.:
- 마침표 표기법: `obj.property`.
- 대괄호 표기법 `obj["property"]`. 대괄호 표기법을 사용하면 `obj[varWithKey]`처럼 변수로부터 키 값을 가져올 수 있습니다.

추가적인 연산자:
- 프로퍼티 삭제: `delete obj.prop`.
- 주어진 키 값을 가진 프로퍼티의 존재 여부 확인: `"key" in obj`.
- 객체 순회: `for(let key in obj)` 반복문.

객체는 참조에 의해 할당되고 복사됩니다. 다시 말해, 변수는 "객체 값" 자체를 저장하지 않고 객체 값의 "참조" (메모리 상의 주소)를 저장합니다. 그래므로 
객체 변수를 복사하거나 함수의 인자로 넘겨주는 행위는 객체가 아닌 객체의 참조를 복사합니다. 복사된 참조를 통한 (프로퍼티 추가/삭제와 같은) 모든 작업들은 하나의 동일한 객체에 대해 수행됩니다.

"진정한 복사본" (복제) 을 만들기 위해서는 `Object.assign`나  [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep)를 사용할 수 있습니다.

우리가 이 챕터에서 배운 것은 "plain object" 또는 `Object`라고 불립니다.

이외에도 자바스크립트에는 많은 종류의 객체가 있습니다.:

- 정렬된 데이터 집합을 저장하기 위한 `Array`
- 날짜와 시간 정보를 저장하기 위한 `Date`
- 에러 정보를 저장하기 위한 `Error`
- ...기타 등등

이 객체들은 이후 우리가 배우게 될 각자만의 특별한 특징을 지니고 있습니다. 사람들은 종종 "Array 타입" 이나 "Data 타입" 이라고 할 때가 있습니다. 하지만 공식적으로 Array와 Data는 온전한 타입이 아니라 단일한 "객체" 데이터 타입에 속합니다. 또한 이들은 다양한 방식으로 객체를 확장합니다.

자바스크립트의 객체는 매우 강력합니다. Here we've just scratched the surface of a topic that is really huge. We'll be closely working with objects and learning more about them in further parts of the tutorial.
