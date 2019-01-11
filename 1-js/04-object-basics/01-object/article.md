
# 객체 (Objects)

우리가 <info:types> 챕터에서 배웠듯이, 자바스크립트에는 일곱 가지 데이터 타입이 존재합니다. 그 중 여섯 개의 타입은 오직 하나의 값(문자열, 숫자 등)만 담을 수 있기 때문에 "원시(primitive) 타입" 라고 불립니다.

이와 달리, 객체는 다양한 데이터와 더욱 복잡한 개체로 이루어진 이름을 가진 컬렉션(keyed collections)을 저장하기 위해 사용됩니다. 자바스크립트에서 객체는 penetrate almost every aspect of the language. 그러므로 우리는 다른 심도 깊은 내용으로 들어가기 전에 객체를 먼저 이해해야 합니다.(So we must understand them first before going in-depth anywhere else.)

객체는 중괄호 `{…}`를 통해 생성되는데, 부가적인 *프로퍼티(properties)* 리스트가 올 수도 있습니다. "키(key): 값(value)"의 쌍을 의미합니다. 여기서 `키`("프로퍼티 이름"으로도 불립니다.)는 문자열이며, `값`에는 무엇이든지 올 수 있습니다.

We can imagine an object as a cabinet with signed files. Every piece of data is stored in its file by the key. It's easy to find a file by its name or add/remove a file.

![](object.png)

빈 객체 ("empty cabinet") 는 두 구문 중 하나를 사용해 만들 수 있습니다.:

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

결과적으로 `user` 객체는 can be imagined as a cabinet with two signed files labeled "name" and "age".

![user object](object-user.png)

We can add, remove and read files from it any time.

dot notation 을 이용해 프로퍼티 값에 접근할 수 있습니다.:

```js
// get fields of the object:
alert( user.name ); // John
alert( user.age ); // 30
```

값은 어느 타입이나 될수 있습니다. 불리언 타입의 프로퍼티를 추가해봅시다.:

```js
user.isAdmin = true;
```

![user object 2](object-user-isadmin.png)

`delete` operator를 이용해 프로퍼티를 삭제할 수 있습니다.:

```js
delete user.age;
```

![user object 3](object-user-delete.png)

여러 단어로 이루어진 프로퍼티 이름을 사용할 수도 있지만, 반드시 따옴표 처리되어야 합니다.:

```js
let user = {
  name: "John",
  age: 30,
  "likes birds": true  // multiword property name must be quoted
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
이것을 "trailing" or "hanging" comma라고 부릅니다. 이 comma를 사용함으로써 모든 line이 동일한 모습을 갖게 되어 프로퍼티들을 추가/삭제/이동하는 것이 쉬워집니다.

## 대괄호

여러 단어를 프로퍼티 이름으로 부여하면, 마침표 표기법(점 표기법)을 사용할 수 없습니다.:

```js run
// 이 코드는 syntax 에러를 발생시킵니다.
user.likes birds = true
```

That's because the dot requires the key to be a valid variable identifier. That is: no spaces and other limitations.

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

Now everything is fine. Please note that the string inside the brackets is properly quoted (any type of quotes will do).

Square brackets also provide a way to obtain the property name as the result of any expression -- as opposed to a literal string -- like from a variable as follows:

```js
let key = "likes birds";

// same as user["likes birds"] = true;
user[key] = true;
```

Here, the variable `key` may be calculated at run-time or depend on the user input. And then we use it to access the property. That gives us a great deal of flexibility. The dot notation cannot be used in a similar way.

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

대괄호 표기법은 마침표 표기법보다 훨씬 더 강력합니다. 어떤 프로퍼티 이름이나 변수를 사용할 수 있게 해줍니다. 하지만 작성하기에 더 번거로운 면이 있습니다.

그래서 대부분의 경우, 프로퍼티 이름이 이미 정해져있고 간단할 때 마침표 표기법을 사용합니다. 만약 우리가 더 복잡한 무언가가 필요하게 되면 대괄호 표기법을 사용하면 됩니다.



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

Basically, any name is allowed, but there's a special one: `"__proto__"`은 역사적인 이유로 인해 특별 대우를 받습니다. 예를 들어, non-object value에 이 이름을 설정할 수 없습니다.:

```js run
let obj = {};
obj.__proto__ = 5;
alert(obj.__proto__); // [object Object], didn't work as intended
```

위 코드에서 보는 것처럼, 원시 값 `5`를 부여하는 것이 무시됩니다.

That can become a source of bugs and even vulnerabilies if we intend to store arbitrary key-value pairs in an object, and allow a visitor to specify the keys.

In that case the visitor may choose "__proto__" as the key, and the assignment logic will be ruined (as shown above).

There is a way to make objects treat `__proto__` as a regular property, which we'll cover later, but first we need to know more about objects.
There's also another data structure [Map](info:map-set-weakmap-weakset), that we'll learn in the chapter <info:map-set-weakmap-weakset>, which supports arbitrary keys.
````


## 프로퍼티 값 생략/축약/단축(Property value shorthand)

In real code we often use existing variables as values for property names.

예를 들어:

```js run
function makeUser(name, age) {
  return {
    name: name,
    age: age
    // ...other properties
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

A notable objects feature is that it's possible to access any property. There will be no error if the property doesn't exist! Accessing a non-existing property just returns `undefined`. It provides a very common way to test whether the property exists -- to get it and compare vs undefined:

```js run
let user = {};

alert( user.noSuchProperty === undefined ); // true는 "no such property"를 의미합니다.
```

There also exists a special operator `"in"` to check for the existence of a property.

The syntax is:
```js
"key" in object
```

For instance:

```js run
let user = { name: "John", age: 30 };

alert( "age" in user ); // true, user.age exists
alert( "blabla" in user ); // false, user.blabla doesn't exist
```

Please note that on the left side of `in` there must be a *property name*. That's usually a quoted string.

If we omit quotes, that would mean a variable containing the actual name will be tested. For instance:

```js run
let user = { age: 30 };

let key = "age";
alert( *!*key*/!* in user ); // true, takes the name from key and checks for such property
```

````smart header="Using \"in\" for properties that store `undefined`"
Usually, the strict comparison `"=== undefined"` check works fine. But there's a special case when it fails, but `"in"` works correctly.

It's when an object property exists, but stores `undefined`:

```js run
let obj = {
  test: undefined
};

alert( obj.test ); // it's undefined, so - no such property?

alert( "test" in obj ); // true, the property does exist!
```


In the code above, the property `obj.test` technically exists. So the `in` operator works right.

Situations like this happen very rarely, because `undefined` is usually not assigned. We mostly use `null` for "unknown" or "empty" values. So the `in` operator is an exotic guest in the code.
````


## The "for..in" loop

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

Are objects ordered? In other words, if we loop over an object, do we get all properties in the same order they were added? Can we rely on this?

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

...On the other hand, if the keys are non-integer, then they are listed in the creation order, for instance:

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

## Copying by reference

One of the fundamental differences of objects vs primitives is that they are stored and copied "by reference".

Primitive values: strings, numbers, booleans -- are assigned/copied "as a whole value".

For instance:

```js
let message = "Hello!";
let phrase = message;
```

As a result we have two independent variables, each one is storing the string `"Hello!"`.

![](variable-copy-value.png)

Objects are not like that.

**A variable stores not the object itself, but its "address in memory", in other words "a reference" to it.**

Here's the picture for the object:

```js
let user = {
  name: "John"
};
```

![](variable-contains-reference.png)

Here, the object is stored somewhere in memory. And the variable `user` has a "reference" to it.

**When an object variable is copied -- the reference is copied, the object is not duplicated.**

If we imagine an object as a cabinet, then a variable is a key to it. Copying a variable duplicates the key, but not the cabinet itself.

For instance:

```js no-beautify
let user = { name: "John" };

let admin = user; // copy the reference
```

Now we have two variables, each one with the reference to the same object:

![](variable-copy-reference.png)

We can use any variable to access the cabinet and modify its contents:

```js run
let user = { name: 'John' };

let admin = user;

*!*
admin.name = 'Pete'; // changed by the "admin" reference
*/!*

alert(*!*user.name*/!*); // 'Pete', changes are seen from the "user" reference
```

The example above demonstrates that there is only one object. As if we had a cabinet with two keys and used one of them (`admin`) to get into it. Then, if we later use the other key (`user`) we would see changes.

### Comparison by reference

The equality `==` and strict equality `===` operators for objects work exactly the same.

**Two objects are equal only if they are the same object.**

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

### Const object

An object declared as `const` *can* be changed.

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

It copies all properties of `user` into the empty object and returns it. Actually, the same as the loop, but shorter.

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



## Summary

Objects are associative arrays with several special features.

They store properties (key-value pairs), where:
- Property keys must be strings or symbols (usually strings).
- Values can be of any type.

To access a property, we can use:
- The dot notation: `obj.property`.
- Square brackets notation `obj["property"]`. Square brackets allow to take the key from a variable, like `obj[varWithKey]`.

Additional operators:
- To delete a property: `delete obj.prop`.
- To check if a property with the given key exists: `"key" in obj`.
- To iterate over an object: `for(let key in obj)` loop.

Objects are assigned and copied by reference. In other words, a variable stores not the "object value", but a "reference" (address in memory) for the value. So copying such a variable or passing it as a function argument copies that reference, not the object. All operations via copied references (like adding/removing properties) are performed on the same single object.

To make a "real copy" (a clone) we can use `Object.assign` or  [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep).

What we've studied in this chapter is called a "plain object", or just `Object`.

There are many other kinds of objects in JavaScript:

- `Array` to store ordered data collections,
- `Date` to store the information about the date and time,
- `Error` to store the information about an error.
- ...And so on.

They have their special features that we'll study later. Sometimes people say something like "Array type" or "Date type", but formally they are not types of their own, but belong to a single "object" data type. And they extend it in various ways.

Objects in JavaScript are very powerful. Here we've just scratched the surface of a topic that is really huge. We'll be closely working with objects and learning more about them in further parts of the tutorial.
