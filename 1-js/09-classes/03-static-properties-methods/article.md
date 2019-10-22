
# 정적 프로퍼티들과 메서드

`"prototype"` 뿐만 아니라 클래스의 함수에도 메서드를 지정할 수 있습니다. 이러한 메서드를 *정적(static) 메서드* 라고 부릅니다.

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

사실 이것은 함수 프로퍼티에 정의하는 것과 같은 의미입니다.

```js
class User() { }

User.staticMethod = function() {
  alert(this === User);
};
```

`User.staticMethod()`안의 `this` 값은 클래스의 생성자 `User` 자신입니다 ("점으로 구분되기 전의 객체" 규칙).

보통은 정적 메서드들은 해당 클래스에 달린 함수들을 구현하기 위해 사용합니다. 그러나, 특별한 객체를 위해서는 아닙니다.

예를 들어 `Article`이란 객체들이 있고 `Article`을 서로 비교하기 위한 함수가 필요하다면 자연스럽게 할 수 있는 방법은 아래와 같이 `Article.compare` 함수를 만드는 것입니다.

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

// 함수를 사용
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

`Article.compare`는 생성된 articles "윗단에" 존재합니다. 서로를 비교할 수 있다는 뜻이죠. 생성된 article만의 메서드는 아니고 전체 클래스의 일부입니다.

또 다른 예시는 "factory"메서드를 호출할 때일 것입니다. 몇 개의 article을 생성해야 한다고 가정해 본다면 아래와 같은 방법들을 고려해 볼 수 있습니다.

1. 주어진 인수 (`title`, `date` 기타 등등)으로 생성된다.
2. 오늘 날짜로 비어있는 article을 생성한다.
3. ... 또는 다른 방법으로 생성한다.

첫 번째 방법은 생성자를 통해서 구현할 수 있습니다. 그리고 두 번째 방법은 클래스의 정적 메서드를 사용하는 것입니다.

정적 메서드를 사용한다면 아래의 `Article.createTodays()`와 같이 작성할 수 있습니다.

```js run
class Article {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }

*!*
  static createTodays() {
    // 기억하세요, this = Article 클래스 입니다.
    return new this("Today's digest", new Date());
  }
*/!*
}

let article = Article.createTodays();

alert( article.title ); // "Today's digest"가 표시될 것입니다.
```

이제 매번 Today's digest를 생성할 때, `Article.createTodays()`메서드를 호출할 수 있습니다. 다시 한번 언급하자면, createTodays()는 article의 메서드는 아닙니다만 전체 클래스 Article의 메서드입니다.

또한 정적 메서드들은 데이터베이스에 연관된 클래스들이 데이터베이스에서 검색/저장/삭제할 때 사용될 수 있습니다. 아래 예시가 있습니다.

```js
// Article이 articles을 합치는 특별한 클래스라고 가정합니다
// article을 삭제하기위한 정적 메서드
Article.remove({id: 12345});
```

## 정적 프로퍼티들

[recent browser=Chrome]

정적 프로퍼티들 또한 정규 클래스 프로퍼티들처럼 사용 가능합니다.

```js run
class Article {
  static publisher = "Ilya Kantor";
}

alert( Article.publisher ); // Ilya Kantor
```

이러한 정적 프로퍼티는 `Article`에 바로 정의된것과 같습니다.

```js
Article.publisher = "Ilya Kantor";
```

## 정적 메서드의 상속

정적인 것들은 상속되어 집니다. `Parent.method`의 메서드를 `Child.method`로 접근할 수 있습니다.

예를 들면, 아래의 `Animal.compare` 코드는 `Rabbit.compare`로 상속되고 접근할 수 있습니다.

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

rabbits[0].run(); // 검은 토끼는 속도 5로 달립니다.
```

여기서 `Rabbit.compare`를 호출하면 상속받은 `Animal.compare`이 호출될 것입니다.

그렇다면 어떻게 작동되는 걸까요? 다시 한번 언급하면, 프로토타입을 사용하기 때문입니다. 이미 눈치를 채셨다면, `extends` 키워드가 `Rabbit` 의 `[[Prototype]]`이 `Animal`을 가리키도록 하고 있기 때문입니다.

![](animal-rabbit-static.png)

그래서 `Rabbit extends Animal` 클래스는 두개의 `[[Prototype]]`을 참조합니다.

1. `Rabbit` 함수는 `Animal` 함수를 프로토타입으로 상속합니다.
2. `Rabbit.prototype` 은 `Animal.prototype`을 프로토타입으로 상속합니다.

결과적으로 상속은 정규표현과 정적인 메서드 모두 이루어졌습니다.

아래 예시를 통해 확인해 보겠습니다.

```js run
class Animal {}
class Rabbit extends Animal {}

// 정적 프로퍼티들과 메서드들을 위한것
alert(Rabbit.__proto__ === Animal); // true

// 정규 메서드를 위한것
alert(Rabbit.prototype.__proto__ === Animal.prototype);

## 요약

정적 메서드는 "전체" 클래스에 속하는 기능에 사용되며 클래스가 구현된 객체와는 관련이 없습니다.

예를 들어, 비교에 사용되었던 `Article.compare(article1, article2)` 또는 팩토리 메서드 `Article.createTodays()`를 살펴보았습니다.

이러한 예시들은 클래스가 정의될 때 `static` 키워드가 사용되었습니다.

정적 속성은 인스턴스에 바인딩 되지 않은 클래스 수준 데이터를 저장하려는 경우에 사용됩니다.

문법은 다음과 같습니다.

```js
class MyClass {
  static property = ...;

  static method() {
    ...
  }
}
```

기술적으로 정적 메서드나 프로퍼티의 선언은 클래스 자신에게 정의하는 것과 같습니다. 

```js
MyClass.property = ...
MyClass.method = ...
```

정적 메서드와 프로퍼티들은 상속되어 집니다.

기술적으로, `class B extends A`를 구현하기 위해서는 클래스 `B`의 프로토타입이 자신을 `A`: `B.[[Prototype]] = A`로 가리키는 것과 같습니다. 따라서 필드가 `B`에서 찾을 수 없다면 검색은 `A`로 계속됩니다.
