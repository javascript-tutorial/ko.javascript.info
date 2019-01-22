
# 심볼 타입

명세에 따르면 객체의 프로퍼티 키는 문자열 타입이나 심볼 타입이 될 수 있습니다. 숫자나 불리언 타입은 불가능하며 오직 문자열과 심볼 두 타입만 가능합니다.

지금까지 우리는 오직 문자열만 봐왔습니다. 이제 심볼이 우리에게 가져다 줄 수 있는 이점들을 알아봅시다.

## 심볼(Symbols)

"심볼(Symbol)" 값은 유일한 식별자(unique identifier)를 나타냅니다.

A value of this type can be created using `Symbol()`:

```js
// id는 새로운 심볼입니다.
let id = Symbol();
```

우리는 심볼에 설명(심볼 이름이라고도 불립니다)을 붙일 수도 있습니다. 주로 디버깅을 할 때 유용하게 쓰입니다.:

```js
// id는 "id"라는 설명을 가진 심볼입니다.
let id = Symbol("id");
```

심볼은 유일하다는 것이 보장됩니다. 우리가 같은 설명을 가진 많은 심볼을 만들지라도, 그 심볼들은 다른 값을 가집니다. 설명은 어떤 것에도 영향을 주지 않는 단지 라벨일 뿐입니다.

예를 들어, 여기에 같은 설명을 가진 두 심볼이 있습니다. -- 이들은 같지 않습니다.:

```js run
let id1 = Symbol("id");
let id2 = Symbol("id");

*!*
alert(id1 == id2); // false
*/!*
```

당신이 루비(Ruby)나 "심볼"과 비슷한 것을 가진 다른 언어와 친숙하다면 -- 잘못 이해하면 안됩니다. 자바스크립트의 심볼은 다릅니다.

````warn header="심볼은 문자열로 자동 변환되지 않습니다."
자바스크립트의 대부분의 값은 문자열로의 암시적 형 변환을 지원합니다. 예를 들어, 우리는 어느 값에나 `alert`를 사용할 수 있으며 이것은 잘 실행될 것입니다. 심볼은 특별합니다. 심볼은 자동 변환되지 않습니다.

예를 들어, 이 코드의 `alert`는 에러를 일으킬 것입니다.:

```js run
let id = Symbol("id");
*!*
alert(id); // TypeError: Cannot convert a Symbol value to a string
*/!*
```

만약 우리가 정말로 심볼을 보여주고 싶다면, 다음과 같이 심볼에 `.toString()` 메서드를 호출해야 합니다.:
```js run
let id = Symbol("id");
*!*
alert(id.toString()); // Symbol(id), 이제 잘 실행됩니다.
*/!*
```

이것은 혼란을 막기 위한 "언어적 보호장치(language guard)"입니다. 문자열과 심볼은 근본적으로 다르며 서로의 타입으로 종종 변환돼서는 안되기 때문입니다.
````

## "Hidden" 프로퍼티

Symbols allow us to create "hidden" properties of an object, that no other part of code can occasionally access or overwrite.

For instance, if we want to store an "identifier" for the object `user`, we can use a symbol as a key for it:

```js run
let user = { name: "John" };
let id = Symbol("id");

user[id] = "ID Value";
alert( user[id] ); // we can access the data using the symbol as the key
```

What's the benefit of using `Symbol("id")` over a string `"id"`?

Let's make the example a bit deeper to see that.

Imagine that another script wants to have its own "id" property inside `user`, for its own purposes. That may be another JavaScript library, so the scripts are completely unaware of each other.

Then that script can create its own `Symbol("id")`, like this:

```js
// ...
let id = Symbol("id");

user[id] = "Their id value";
```

There will be no conflict, because symbols are always different, even if they have the same name.

Now note that if we used a string `"id"` instead of a symbol for the same purpose, then there *would* be a conflict:

```js run
let user = { name: "John" };

// our script uses "id" property
user.id = "ID Value";

// ...if later another script the uses "id" for its purposes...

user.id = "Their id value"
// boom! overwritten! it did not mean to harm the colleague, but did it!
```

### Symbols in a literal

If we want to use a symbol in an object literal, we need square brackets.

Like this:

```js
let id = Symbol("id");

let user = {
  name: "John",
*!*
  [id]: 123 // not just "id: 123"
*/!*
};
```
That's because we need the value from the variable `id` as the key, not the string "id".

### Symbols are skipped by for..in

Symbolic properties do not participate in `for..in` loop.

For instance:

```js run
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

*!*
for (let key in user) alert(key); // name, age (no symbols)
*/!*

// the direct access by the symbol works
alert( "Direct: " + user[id] );
```

That's a part of the general "hiding" concept. If another script or a library loops over our object, it won't unexpectedly access a symbolic property.

In contrast, [Object.assign](mdn:js/Object/assign) copies both string and symbol properties:

```js run
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```

There's no paradox here. That's by design. The idea is that when we clone an object or merge objects, we usually want *all* properties to be copied (including symbols like `id`).

````smart header="Property keys of other types are coerced to strings"
We can only use strings or symbols as keys in objects. Other types are converted to strings.

For instance, a number `0` becomes a string `"0"` when used as a property key:

```js run
let obj = {
  0: "test" // same as "0": "test"
};

// both alerts access the same property (the number 0 is converted to string "0")
alert( obj["0"] ); // test
alert( obj[0] ); // test (same property)
```
````

## Global symbols

As we've seen, usually all symbols are different, even if they have the same names. But sometimes we want same-named symbols to be same entities.

For instance, different parts of our application want to access symbol `"id"` meaning exactly the same property.

To achieve that, there exists a *global symbol registry*. We can create symbols in it and access them later, and it guarantees that repeated accesses by the same name return exactly the same symbol.

In order to create or read a symbol in the registry, use `Symbol.for(key)`.

That call checks the global registry, and if there's a symbol described as `key`, then returns it, otherwise creates a new symbol `Symbol(key)` and stores it in the registry by the given `key`.

For instance:

```js run
// read from the global registry
let id = Symbol.for("id"); // if the symbol did not exist, it is created

// read it again
let idAgain = Symbol.for("id");

// the same symbol
alert( id === idAgain ); // true
```

Symbols inside the registry are called *global symbols*. If we want an application-wide symbol, accessible everywhere in the code -- that's what they are for.

```smart header="That sounds like Ruby"
In some programming languages, like Ruby, there's a single symbol per name.

In JavaScript, as we can see, that's right for global symbols.
```

### Symbol.keyFor

For global symbols, not only `Symbol.for(key)` returns a symbol by name, but there's a reverse call: `Symbol.keyFor(sym)`, that does the reverse: returns a name by a global symbol.

For instance:

```js run
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// get name from symbol
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
```

The `Symbol.keyFor` internally uses the global symbol registry to look up the key for the symbol. So it doesn't work for non-global symbols. If the symbol is not global, it won't be able to find it and return `undefined`.

For instance:

```js run
alert( Symbol.keyFor(Symbol.for("name")) ); // name, global symbol

alert( Symbol.keyFor(Symbol("name2")) ); // undefined, the argument isn't a global symbol
```

## System symbols

There exist many "system" symbols that JavaScript uses internally, and we can use them to fine-tune various aspects of our objects.

They are listed in the specification in the [Well-known symbols](https://tc39.github.io/ecma262/#sec-well-known-symbols) table:

- `Symbol.hasInstance`
- `Symbol.isConcatSpreadable`
- `Symbol.iterator`
- `Symbol.toPrimitive`
- ...and so on.

For instance, `Symbol.toPrimitive` allows us to describe object to primitive conversion. We'll see its use very soon.

Other symbols will also become familiar when we study the corresponding language features.

## Summary

`Symbol` is a primitive type for unique identifiers.

Symbols are created with `Symbol()` call with an optional description.

Symbols are always different values, even if they have the same name. If we want same-named symbols to be equal, then we should use the global registry: `Symbol.for(key)` returns (creates if needed) a global symbol with `key` as the name. Multiple calls of `Symbol.for` return exactly the same symbol.

Symbols have two main use cases:

1. "Hidden" object properties.
    If we want to add a property into an object that "belongs" to another script or a library, we can create a symbol and use it as a property key. A symbolic property does not appear in `for..in`, so it won't be occasionally listed. Also it won't be accessed directly, because another script does not have our symbol, so it will not occasionally intervene into its actions.

    So we can "covertly" hide something into objects that we need, but others should not see, using symbolic properties.

2. There are many system symbols used by JavaScript which are accessible as `Symbol.*`. We can use them to alter some built-in behaviors. For instance, later in the tutorial we'll use `Symbol.iterator` for [iterables](info:iterable), `Symbol.toPrimitive` to setup [object-to-primitive conversion](info:object-toprimitive) and so on.

Technically, symbols are not 100% hidden. There is a built-in method [Object.getOwnPropertySymbols(obj)](mdn:js/Object/getOwnPropertySymbols) that allows us to get all symbols. Also there is a method named [Reflect.ownKeys(obj)](mdn:js/Reflect/ownKeys) that returns *all* keys of an object including symbolic ones. So they are not really hidden. But most libraries, built-in methods and syntax constructs adhere to a common agreement that they are. And the one who explicitly calls the aforementioned methods probably understands well what he's doing.
