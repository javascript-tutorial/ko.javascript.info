
# 객체 (Objects)

우리가 <info:types> 챕터에서 배웠듯이, 자바스크립트에는 일곱 가지 데이터 타입이 존재합니다. 그 중 여섯 개의 타입은 오직 하나의 값(문자열, 숫자 등)만 담을 수 있기 때문에 "원시(primitive) 타입" 라고 불립니다.

이와 달리, 객체는 다양한 데이터와 더욱 복잡한 개체로 이루어졌으며 키가 있는 데이터 집합을 저장하기 위해 사용됩니다. 자바스크립트에서 객체는 거의 모든 면에 스며들어 있습니다. 그러므로 우리는 다른 심도 깊은 내용에 들어가기 전에 먼저 객체를 이해해야 합니다.

객체는 중괄호 `{…}`를 통해 생성되는데, 부가적인 *프로퍼티(properties)* 리스트가 올 수도 있습니다. "키(key): 값(value)"의 쌍을 의미합니다. 여기서 `키`("프로퍼티 이름"으로도 불립니다.)는 문자열이며, `값`에는 무엇이든지 올 수 있습니다.

우리는 각각 이름이 적힌 파일들이 보관된 서랍장을 객체라고 상상할 수 있습니다. 파일에 담긴 자료들은 그것의 키로 저장되어 있습니다. 이름으로 파일을 찾거나 파일을 추가/삭제하는 일은 쉽습니다.

![](object.png)

빈 객체("빈 서랍장")는 두 구문 중 하나를 사용해 만들 수 있습니다.:

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

프로퍼티는 `":"` 왼쪽에 ("이름" 또는 "identifier"라고도 불리는) 키를 갖고 있으며 오른쪽에는 값을 갖고 있습니다.

`user` 객체에는 두 프로퍼티가 존재합니다.:

1. 첫 번째 프로퍼티는 `"name"`이라는 이름과 `"John"`이라는 값을 갖고 있습니다.
2. 두 번째 프로퍼티는 `"age"`라는 이름과 `30`이라는 값을 갖고 있습니다.

결과적으로 `user` 객체를 "name"과 "age"라는 이름이 적힌 파일들이 담긴 서랍장으로 생각할 수 있습니다.

![user object](object-user.png)

우리는 이 객체로부터 어느 때나 파일을 추가하고, 삭제하거나 읽을 수 있습니다.

점 표기법을 이용해 프로퍼티 값에 접근할 수 있습니다.:

```js
// get fields of the object:
alert( user.name ); // John
alert( user.age ); // 30
```

프로퍼티 값으로는 모든 데이터 타입이 가능합니다. 불리언 타입의 프로퍼티를 추가해봅시다.:

```js
user.isAdmin = true;
```

![user object 2](object-user-isadmin.png)

`delete` 연산자를 이용해 프로퍼티를 삭제할 수 있습니다.:

```js
delete user.age;
```

![user object 3](object-user-delete.png)

여러 단어로 된 프로퍼티 이름을 사용할 수도 있지만, 반드시 따옴표 처리되어야 합니다.:

```js
let user = {
  name: "John",
  age: 30,
  "likes birds": true  // 여러 단어로 된 프로퍼티 이름은 따옴표 처리되어야 합니다.
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
이것을 "trailing" 또는 "hanging" comma라고 부릅니다. 이 comma를 사용함으로써 모든 줄이 동일한 모습을 갖게 되어 프로퍼티들을 추가/삭제/이동하는 것이 쉬워집니다.

## 대괄호

여러 단어로 된 프로퍼티 이름을 사용하면, 점 표기법을 사용할 수 없습니다.:

```js run
// 이 코드는 syntax 에러를 발생시킵니다.
user.likes birds = true
```

프로퍼티 키가 유효한 변수 식별자일 때만 점 표기법을 사용할 수 있기 때문입니다. 즉, 스페이스를 포함한 다른 제약들이 없어야 합니다.

어느 문자열에나 적용되는 "대괄호 표기법" 이라는 대안이 존재합니다.:


```js run
let user = {};

// set
user["likes birds"] = true;

// get
alert(user["likes birds"]); // true

// delete
delete user["likes birds"];
```

이제 모든 것이 제대로 작동합니다. 대괄호 안의 문자열이 따옴표로 묶인다는 사실에 주의하세요(따옴표 타입은 상관 없습니다).

대괄호 표기법은 표현식의 결과로 프로퍼티 이름을 사용할 수 있는 방법도 제공합니다. also provide a way to obtain the property name as the result of any expression -- as opposed to a literal string -- like from a variable as follows:

```js
let key = "likes birds";

// user["likes birds"] = true; 와 같습니다.
user[key] = true;
```

여기서, 변수 `key`는 실행중에 계산되 may be calculated at run-time or depend on the user input. And then we use it to access the property. That gives us a great deal of flexibility. The dot notation cannot be used in a similar way.

For instance:

```js run
let user = {
  name: "John",
  age: 30
};

let key = prompt("What do you want to know about the user?", "name");

// access by variable
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

따라서, 만약 한 방문객이 `"apple"`을 입력한다면, `bag`은 {apple: 5}`가 될 것입니다.

본질적으로, 다음 코드처럼 실행됩니다.:
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

대괄호 표기법은 점 표기법보다 훨씬 더 강력합니다. 어떤 프로퍼티 이름이나 변수를 사용할 수 있게 해줍니다. 하지만 작성하기에 더 번거로운 면이 있습니다.

그래서 대부분의 경우, 프로퍼티 이름이 이미 정해져있고 간단할 때 점 표기법을 사용합니다. 만약 우리가 더 복잡한 무언가가 필요하게 되면 대괄호 표기법을 사용하면 됩니다.



````smart header="예약어를 프로퍼티 이름으로 사용할 수 있습니다."
변수의 경우, "for", "let", "return" 등과 같은 자바스크립트의 예약어와 동일한 이름을 사용할 수 없습니다.

하지만 객체 프로퍼티에는 이러한 제약이 없습니다. 어떤 이름이나 사용할 수 있습니다.:

```js run
let obj = {
  for: 1,
  let: 2,
  return: 3
};

alert( obj.for + obj.let + obj.return );  // 6
```

기본적으로, 어느 이름이나 가능하지만 한 가지 예외사항이 존재합니다. `"__proto__"`은 역사적인 이유로 인해 특별 대우를 받습니다. 예를 들어, 객체가 아닌 값에 이 이름을 사용할 수 없습니다.:

```js run
let obj = {};
obj.__proto__ = 5;
alert(obj.__proto__); // [object Object], 의도한 대로 작동하지 않습니다.
```

위 코드에서 보는 것처럼, 원시 값 `5`를 부여하는 것이 무시됩니다.

That can become a source of bugs and even vulnerabilies if we intend to store arbitrary key-value pairs in an object, and allow a visitor to specify the keys.

In that case the visitor may choose "__proto__" as the key, and the assignment logic will be ruined (as shown above).

There is a way to make objects treat `__proto__` as a regular property, which we'll cover later, but first we need to know more about objects.
There's also another data structure [Map](info:map-set-weakmap-weakset), that we'll learn in the chapter <info:map-set-weakmap-weakset>, which supports arbitrary keys.
````


## 프로퍼티 값 생략/축약/단축(Property value shorthand)

실제 코드에서 프로퍼티 이름에 대한 값으로 이미 존재하는 변수를 자주 사용합니다.

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

위 예제에서, 프로퍼티는 변수와 같은 이름을 갖고 있습니다. The use-case of making a property from a variable is so common, that there's a special *property value shorthand* to make it shorter.

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

같은 객체 내에서 일반적인 표현과 단축 표현을 함께 사용할 수 있습니다.:

```js
let user = {
  name,  // name: name와 같습니다.
  age: 30
};
```

## 존재 확인

어느 프로퍼티에나 접근 가능하다는 것은 중요한 객체의 특징입니다. 만약 프로퍼티가 존재하지 않는다고 해도 에러가 발생하지 않습니다! 존재하지 않는 프로퍼티에 접근하면 `undefined`를 반환할 뿐이지요. 이것은 프로퍼티의 존재 여부를 테스트하는 매우 일반적인 방법을 제공해 줍니다. -- 우선 접근해보고 undefined 인지 확인해보면 되니까요.:

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

만약 따옴표를 생략하게 되면, 그 이름을 가진 변수의 존재를 확인해보라는 의미를 갖게 됩니다. 예를 들어:

```js run
let user = { age: 30 };

let key = "age";
alert( *!*key*/!* in user ); // true, key로부터 가져온 값을 통해 프로퍼티의 존재를 확인합니다.
```

````smart header="`undefined` 값을 가진 프로퍼티에 \"in\" 사용하기"
일반적으로 엄격한 비교 확인 `"=== undefined"` 는 잘 작동하지만 이것이 잘 작동하지 않는 특별한 경우도 존재합니다. 그러나 이때 `"in"` 는 올바르게 작동합니다.

이것은 객체 프로퍼티가 존재하지만 `undefined` 값을 갖고 있는 상황일 때 해당됩니다.:

```js run
let obj = {
  test: undefined
};

alert( obj.test ); // undefined, 그런 프로퍼티가 존재하지 않는걸까요?

alert( "test" in obj ); // true, 프로퍼티는 존재합니다!
```


위 코드에서, `obj.test` 프로퍼티는 형식적으로 존재합니다. 그래서 `in` 연산자가 올바르게 작동합니다.

보통 `undefined` 값은 잘 할당되지 않기 때문에 이런 상황은 거의 일어나지 않습니다. 우리는 "알려져 있지 않거나" "비어 있는" 값에 주로 `null`을 사용합니다. 그래서 위 코드 상의 `in` 연산자는 이국적인 손님과도 같습니다.
````


## "for..in" 반복문

To walk over all keys of an object, there exists a special form of the loop: `for..in`. This is a completely different thing from the `for(;;)` construct that we studied before.

The syntax:

```js
for(key in object) {
  // executes the body for each key among object properties
}
```

For instance, let's output all properties of `user`:

```js run
let user = {
  name: "John",
  age: 30,
  isAdmin: true
};

for(let key in user) {
  // keys
  alert( key );  // name, age, isAdmin
  // values for the keys
  alert( user[key] ); // John, 30, true
}
```

Note that all "for" constructs allow us to declare the looping variable inside the loop, like `let key` here.

Also, we could use another variable name here instead of `key`. For instance, `"for(let prop in obj)"` is also widely used.


### Ordered like an object

객체는 정렬되어 있나요? 다시 말해, 만약 우리가 객체에 대해 반복문을 돌면, 프로퍼티들을 객체에 추가된 순서대로 얻게 되나요? Can we rely on this?

The short answer is: "ordered in a special fashion": integer properties are sorted, others appear in creation order. The details follow.

As an example, let's consider an object with the phone codes:

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

The object may be used to suggest a list of options to the user. If we're making a site mainly for German audience then we probably want `49` to be the first.

But if we run the code, we see a totally different picture:

- USA (1) goes first
- then Switzerland (41) and so on.

The phone codes go in the ascending sorted order, because they are integers. So we see `1, 41, 44, 49`.

````smart header="Integer properties? What's that?"
The "integer property" term here means a string that can be converted to-and-from an integer without a change.

So, "49" is an integer property name, because when it's transformed to an integer number and back, it's still the same. But "+49" and "1.2" are not:

```js run
// Math.trunc is a built-in function that removes the decimal part
alert( String(Math.trunc(Number("49"))) ); // "49", same, integer property
alert( String(Math.trunc(Number("+49"))) ); // "49", not same "+49" ⇒ not integer property
alert( String(Math.trunc(Number("1.2"))) ); // "1", not same "1.2" ⇒ not integer property
```
````

...반면에, if the keys are non-integer, then they are listed in the creation order, for instance:

```js run
let user = {
  name: "John",
  surname: "Smith"
};
user.age = 25; // add one more

*!*
// non-integer properties are listed in the creation order
*/!*
for (let prop in user) {
  alert( prop ); // name, surname, age
}
```

So, to fix the issue with the phone codes, we can "cheat" by making the codes non-integer. Adding a plus `"+"` sign before each code is enough.

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

Now it works as intended.

## 참조에 의한 복사

객체와 원시 타입의 근본적인 차이 중 하나는 객체들이 "참조에 의해" 저장되고 복사된다는 것입니다.

원시 값: 문자열, 숫자, 불리언 -- 은 "온전한 값으로" 할당되고 복사됩니다.

예를 들어:

```js
let message = "Hello!";
let phrase = message;
```

코드의 실행 결과, 우리는 두 개의 서로 다른 변수를 갖고 있으며 각 변수는 `"Hello!"`라는 문자열을 저장하고 있습니다.

![](variable-copy-value.png)

객체는 이와 다릅니다.

**변수는 객체 자체를 저장하는 것이 아니라, 객체의 "메모리 상의 주소", 즉 객체에 대한 "참조"를 저장합니다.**

여기 객체를 표현하는 그림이 있습니다.:

```js
let user = {
  name: "John"
};
```

![](variable-contains-reference.png)

객체는 메모리의 어딘가에 저장되어 있습니다. 그리고 변수 `user`는 객체에 데한 참조를 갖고 있습니다.

**객체 변수가 복사될 때 -- 즉, 객체의 참조가 복사될 때, 그 객체는 복제되지 않습니다.**

우리가 객체를 서랍장으로 상상한다면, 변수는 서랍장을 열기 위한 열쇠입니다. 변수를 복사하는 것은 그 열쇠를 복제하는 것이지 서랍장 자체를 복제하진 않습니다.

예를 들어:

```js no-beautify
let user = { name: "John" };

let admin = user; // 참조를 복사합니다.
```

각 변수는 이제 동일한 객체에 대한 참조를 갖고 있습니다.:

![](variable-copy-reference.png)

서랍장에 접근하거나 서랍장의 내용물을 변경하기 위해 둘 중 아무 변수나 사용하면 됩니다.:

```js run
let user = { name: 'John' };

let admin = user;

*!*
admin.name = 'Pete'; // "admin" 참조에 의해 변경되고
*/!*

alert(*!*user.name*/!*); // 'Pete', 변경사항이 "user" 참조에서 확인됩니다.
```

위 예제는 오직 하나의 객체만 존재한다는 사실을 보여주고 있습니다. As if we had a cabinet with two keys and used one of them (`admin`) to get into it. Then, if we later use the other key (`user`) we would see changes.

### 참조에 의한 비교

객체에 있어서 동등 연산자 `==` 와 엄격한 동등 연산자 `===` 는 정확히 동일하게 작동합니다.

**두 객체는 그들이 동일한 객체일 때Two objects are equal only if they are the same object.**

For instance, two variables reference the same object, they are equal:

```js run
let a = {};
let b = a; // copy the reference

alert( a == b ); // true, both variables reference the same object
alert( a === b ); // true
```

And here two independent objects are not equal, even though both are empty:

```js run
let a = {};
let b = {}; // two independent objects

alert( a == b ); // false
```

For comparisons like `obj1 > obj2` or for a comparison against a primitive `obj == 5`, objects are converted to primitives. We'll study how object conversions work very soon, but to tell the truth, such comparisons are necessary very rarely and usually are a result of a coding mistake.

### Const 객체

`const`로 선언된 객체는 *변경될 수 있습니다.*

For instance:

```js run
const user = {
  name: "John"
};

*!*
user.age = 25; // (*)
*/!*

alert(user.age); // 25
```

It might seem that the line `(*)` would cause an error, but no, there's totally no problem. That's because `const` fixes the value of `user` itself. And here `user` stores the reference to the same object all the time. The line `(*)` goes *inside* the object, it doesn't reassign `user`.

The `const` would give an error if we try to set `user` to something else, for instance:

```js run
const user = {
  name: "John"
};

*!*
// Error (can't reassign user)
*/!*
user = {
  name: "Pete"
};
```

...But what if we want to make constant object properties? So that `user.age = 25` would give an error. That's possible too. We'll cover it in the chapter <info:property-descriptors>.

## Cloning and merging, Object.assign

So, copying an object variable creates one more reference to the same object.

But what if we need to duplicate an object? Create an independent copy, a clone?

That's also doable, but a little bit more difficult, because there's no built-in method for that in JavaScript. Actually, that's rarely needed. Copying by reference is good most of the time.

But if we really want that, then we need to create a new object and replicate the structure of the existing one by iterating over its properties and copying them on the primitive level.

Like this:

```js run
let user = {
  name: "John",
  age: 30
};

*!*
let clone = {}; // the new empty object

// let's copy all user properties into it
for (let key in user) {
  clone[key] = user[key];
}
*/!*

// now clone is a fully independent clone
clone.name = "Pete"; // changed the data in it

alert( user.name ); // still John in the original object
```

Also we can use the method [Object.assign](mdn:js/Object/assign) for that.

The syntax is:

```js
Object.assign(dest[, src1, src2, src3...])
```

- Arguments `dest`, and `src1, ..., srcN` (can be as many as needed) are objects.
- It copies the properties of all objects `src1, ..., srcN` into `dest`. In other words, properties of all arguments starting from the 2nd are copied into the 1st. Then it returns `dest`.

For instance, we can use it to merge several objects into one:
```js
let user = { name: "John" };

let permissions1 = { canView: true };
let permissions2 = { canEdit: true };

*!*
// copies all properties from permissions1 and permissions2 into user
Object.assign(user, permissions1, permissions2);
*/!*

// now user = { name: "John", canView: true, canEdit: true }
```

If the receiving object (`user`) already has the same named property, it will be overwritten:

```js
let user = { name: "John" };

// overwrite name, add isAdmin
Object.assign(user, { name: "Pete", isAdmin: true });

// now user = { name: "Pete", isAdmin: true }
```

We also can use `Object.assign` to replace the loop for simple cloning:

```js
let user = {
  name: "John",
  age: 30
};

*!*
let clone = Object.assign({}, user);
*/!*
```

이것은 `user`의 모든 프로퍼티를 빈 객체에 복사한 뒤 돌려줍니다. 사실, 반복문을 돌리는 것과 같은 작업이지만 코드가 더 짧아집니다.

Until now we assumed that all properties of `user` are primitive. But properties can be references to other objects. What to do with them?

Like this:
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

Now it's not enough to copy `clone.sizes = user.sizes`, because the `user.sizes` is an object, it will be copied by reference. So `clone` and `user` will share the same sizes:

Like this:
```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

let clone = Object.assign({}, user);

alert( user.sizes === clone.sizes ); // true, same object

// user and clone share sizes
user.sizes.width++;       // change a property from one place
alert(clone.sizes.width); // 51, see the result from the other one
```

To fix that, we should use the cloning loop that examines each value of `user[key]` and, if it's an object, then replicate its structure as well. That is called a "deep cloning".

There's a standard algorithm for deep cloning that handles the case above and more complex cases, called the [Structured cloning algorithm](http://w3c.github.io/html/infrastructure.html#safe-passing-of-structured-data). In order not to reinvent the wheel, we can use a working implementation of it from the JavaScript library [lodash](https://lodash.com), the method is called [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep).



## 요약

객체는 여러 특별한 특징을 가진 연관 배열입니다.

객체는 프로퍼티(키-값 묶음)을 저장합니다.:
- 키는 문자열이나 심볼이어야 합니다 (보통 문자열을 사용합니다).
- 값은 어느 타입이나 가능합니다.

프로퍼티에 접근하기 위해서는 다음 방법을 사용할 수 있습니다.:
- 점 표기법: `obj.property`.
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

이 객체들은 이후 우리가 배우게 될 각자만의 특별한 특징을 지니고 있습니다. 사람들은 종종 "Array 타입" 이나 "Data 타입" Sometimes people say something like "Array type" or "Date type", but formally they are not types of their own, but belong to a single "object" data type. And they extend it in various ways.

자바스크립트의 객체는 매우 강력합니다. Here we've just scratched the surface of a topic that is really huge. We'll be closely working with objects and learning more about them in further parts of the tutorial.
