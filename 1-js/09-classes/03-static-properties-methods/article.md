
# Static properties and methods
# 정적 프로퍼티들과 메서드

We can also assign a method to the class function, not to its `"prototype"`. Such methods are called *static*.
`"prototype"` 뿐만 아니라 클래스의 함수에 메서드를 지정할수 있습니다. 이러한 메서드를 *static* 이라고 부릅니다.

An example:
아래에 예시가 있습니다.

```js run
class User {
*!*
  static staticMegithod() {
*/!*
    alert(this === User);
  }
}

User.staticMethod(); // true
```

That actually does the same as assigning it as a function property:
사실 이것은 함수 프로퍼티에 정의하는것과 같습니다.

```js
function User() { }

User.staticMethod = function() {
  alert(this === User);
};
```

The value of `this` inside `User.staticMethod()` is the class constructor `User` itself (the "object before dot" rule).
`User.staticMethod()`안의 `this`값은 클래스의 생성자 `User`자신입니다 ("점을 찍기전의 객체" 규칙).

Usually, static methods are used to implement functions that belong to the class, but not to any particular object of it.
보통은 정적 메서드들은 해당 클래스에 달려있는 함수들을 구현하기 위해 사용합니다. 그러나, 특별한 객체를 위해서는 아닙니다.

For instance, we have `Article` objects and need a function to compare them. The natural choice would be `Article.compare`, like this:
예를 들면, `Article`이란 객체들이 있고 그것을 비교하기위한 함수가 필요하다고 한다면. 자연스러운 선택은 아래와 같이 `Article.compare`함수를 만드는 것입니다.

```js run
class Article {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }

*!*
  static compare(articleA, articleB) {
    return articleA.date - articleB.date;
  }
*/!*
}

// 사용
let articles = [
  new Article("HTML", new Date(2019, 1, 1)),
  new Article("CSS", new Date(2019, 0, 1)),
  new Article("JavaScript", new Date(2019, 11, 1))
];

*!*
articles.sort(Article.compare);
*/!*

alert( articles[0].title ); // CSS
```

Here `Article.compare` stands "over" the articles, as a means to compare them. It's not a method of an article, but rather of the whole class.
`Article.compare`는 articles "위에" 존재합니다. 이것은 서로를 비교할 수 있다는 뜻이죠. 그것은 article의 메서드는 아닙니고 전체 클래스의 것이죠.

Another example would be a so-called "factory" method. Imagine, we need few ways to create an article:
또 다른 예시는 "factory"메서드를 호출할때 일것입니다. 몇개의 article를 생성해야 한다고 가정해 보죠.

1. Create by given parameters (`title`, `date` etc).
1. 인수들을 넘겨주어 생성한다 (`title`, `date` 기타 등등).
2. Create an empty article with today's date.
2. 오늘 날짜로 비어있는 article을 생성한다.
3. ...

The first way can be implemented by the constructor. And for the second one we can make a static method of the class.
첫번째것은 생성자를 통해서 구현할 수 있습니다. 그리고 두번째것은 클래스의 정적 메서드를 사용해서 만들수 있습니다.

Like `Article.createTodays()` here:
아래 `Article.createTodays()`와 같이 말이죠

```js run
class Article {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }

*!*
  static createTodays() {
    // 기억하세요, this = Article
    return new this("Today's digest", new Date());
  }
*/!*
}

let article = Article.createTodays();

alert( article.title ); // Todays digest
```

Now every time we need to create a today's digest, we can call `Article.createTodays()`. Once again, that's not a method of an article, but a method of the whole class.
이제 매번 오늘의 글을 생성할때, `Article.createTodays()`를 호출할 수 있습니다. 다시 한번, 이것은 article의 메서드는 아닙니다만 전체 클래스의 메서드이죠.

Static methods are also used in database-related classes to search/save/remove entries from the database, like this:
또한 정적 메서드들은 데이터베이스에 연관된 클래스들이 데이터베이스에서 검색/저장/삭제할때 사용될 수 있습니다. 아래 예시가 있습니다.

```js
// assuming Article is a special class for managing articles
// Article이 articles을 합치는 특별한 클래스라고 가정합니다
// static method to remove the article:
// article을 삭제하기위한 정적 메서드
Article.remove({id: 12345});
```

## Static properties
## 정적 프로퍼티들

[recent browser=Chrome]

Static properties are also possible, just like regular class properties:
정적 프로퍼티들 또한 정규 클래스 프로퍼티들처럼 사용 가능합니다.

```js run
class Article {
  static publisher = "Ilya Kantor";
}

alert( Article.publisher ); // Ilya Kantor
```

That is the same as a direct assignment to `Article`:
이것은 `Article`에 바로 정의된것과 같습니다.

```js
Article.publisher = "Ilya Kantor";
```

## Statics and inheritance
## 정적과 상속

Statics are inherited, we can access `Parent.method` as `Child.method`.
정적된것들은 상속되어 집니다. `Parent.method`의 메서드를 `Child.method`로 접근할 수 있습니다.

For instance, `Animal.compare` in the code below is inherited and accessible as `Rabbit.compare`:
예를 들면, 아래의 `Animal.compare` 코드는 `Rabbit.compare`로 상속되어지고 접근할 수 있습니다.

```js run
class Animal {

  constructor(name, speed) {
    this.speed = speed;
    this.name = name;
  }

  run(speed = 0) {
    this.speed += speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }

*!*
  static compare(animalA, animalB) {
    return animalA.speed - animalB.speed;
  }
*/!*

}

// Animal로 부터 상속
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbits = [
  new Rabbit("White Rabbit", 10),
  new Rabbit("Black Rabbit", 5)
];

*!*
rabbits.sort(Rabbit.compare);
*/!*

rabbits[0].run(); // Black Rabbit runs with speed 5.
```

Now we can call `Rabbit.compare` assuming that the inherited `Animal.compare` will be called.
여기서 `Rabbit.compare`를 호출하면 상속받은 `Animal.compare`이 호출될 것이라고 예상됩니다.

How does it work? Again, using prototypes. As you might have already guessed, `extends` gives `Rabbit` the `[[Prototype]]` reference to `Animal`.
어떻게 작동할까요? 다시 한번 언급하면, 프로토타입을 사용하기 때문입니다. 이미 예상했듯이, `extends` 키워드가 `Rabbit` 의 `[[Prototype]]`이 `Animal`을 가리키도록 하고 있습니다.


![](animal-rabbit-static.png)

So, `Rabbit` function now inherits from `Animal` function. And `Animal` function normally has `[[Prototype]]` referencing `Function.prototype`, because it doesn't `extend` anything.
그래서, `Rabbit`함수는 이제 `Animal`함수로 부터 상속받습니다. 그리고 `Animal` 함수는 보통 `Function.prototype`를 참조하는 `[[Prototype]]` 을 가지고 있습니다. 왜냐하면, 함수는 전혀 `extend` 하지 않기 때문이죠.

Here, let's check that:
아래 예시를 통해 확인해 보겠습니다.

```js run
class Animal {}
class Rabbit extends Animal {}

// 정적 프로퍼티들과 메서드들을 위한것
alert(Rabbit.__proto__ === Animal); // true

// the next step up leads to Function.prototype
// Function.prototype으로 한단계 넘어가면
alert(Animal.__proto__ === Function.prototype); // true

// the "normal" prototype chain for object methods
// 객체 메서드를 위한 "보통" 프로토타입 체임
alert(Rabbit.prototype.__proto__ === Animal.prototype);
```

This way `Rabbit` has access to all static methods of `Animal`.
이렇게 해서 `Rabbit`은 `Animal`의 모든 정적 메서드에 접근이 가능합니다.

## Summary
## 요약

Static methods are used for the functionality that doesn't relate to a concrete class instance, doesn't require an instance to exist, but rather belongs to the class as a whole, like `Article.compare` -- a generic method to compare two articles.

Static properties are used when we'd like to store class-level data, also not bound to an instance.

정적 메서드는 구체적인 클래스 인스턴스와 관련이 없고, 인스턴스가 존재할 필요가 없으며 `Article.compare` -- articles을 비교하기 위한 일반적인 메서드와 같이 클래스 전체에 속하는 기능을 위해 사용됩니다.

정적 속성은 인스턴스에 바인딩되지 않은 클래스 수준 데이터를 저장하려는 경우에 사용됩니다.

The syntax is:
문법은 다음과 같습니다

```js
class MyClass {
  static property = ...;

  static method() {
    ...
  }
}
```

That's technically the same as assigning to the class itself:
이것은 기술적으로 클래스 자신에게 정의하는것과 같습니다. 

```js
MyClass.property = ...
MyClass.method = ...
```

Static properties are inherited.
정적 프로퍼티들은 상속되어 집니다.

Technically, for `class B extends A` the prototype of the class `B` itself points to `A`: `B.[[Prototype]] = A`. So if a field is not found in `B`, the search continues in `A`.
기술적으로, `class B extends A`를 구현하기 위해서는 클래스 `B`의 프로토타입이 자신을 `A`: `B.[[Prototype]] = A`로 가리킵니다. 따라서 필드가 `B`에 없으면 검색은 `A`로 계속됩니다.
