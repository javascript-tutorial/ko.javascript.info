# 화살표 함수(arrow function)들에 대한 재고

화살표 함수에 대해 다시 논의해봅시다.

화살표 함수들은 단지 "짧게 쓰기 위한" 것이 아닙니다.

자바스크립트는 다른 곳에서 실행되는 작은 함수를 써야 하는 상황이 잦습니다. 

예를 들면,

- `arr.forEach(func)` -- `func`은 `forEach`를 쓰는 `arr`의 배열 아이템을 순회할 때마다 실행됩니다.
- `setTimeout(func)` -- `func` 은 `setTimeout`에 내장된 시간이 되면 실행됩니다.
- 그 외에도 다양한 사례가 많습니다.

자바스크립트의 특징 중 하나는 함수를 만들어 어딘가로 전달하는 것입니다.

이런 화살표 함수들은 해당 맥락과 이어집니다.

## 화살표 함수에는 "this" 기능이 없다

[info:object-methods]() 챕터를 기억하신다면, 화살표 함수는 `this`를 가지고 있지 않음을 아실 것입니다. 만약 `this`에 접근하면, 이것은 외부를 가리킵니다.

예를 들면, 화살표 함수는 객체를 반복하는데 쓸 수 있습니다.

```js run
let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],

  showList() {
*!*
    this.students.forEach(
      student => alert(this.title + ': ' + student)
    );
*/!*
  }
};

group.showList();
```

여기의 `forEach`에서 화살표 함수가 사용되었습니다.  `this.title`은 바깥 메서드 `showList`가 가리키는 대상과 똑같습니다. 즉 `this.title`은 `group.title`을 가리킵니다.

만약 우리가 "고정적인" , `function` 키워드를 사용한 함수로 쓴다면 해당 구문은 오류가 납니다.

```js run
let group = {
  title: "Our Group",
  students: ["John", "Pete", "Alice"],

  showList() {
*!*
    this.students.forEach(function(student) {
      // Error: Cannot read property 'title' of undefined
      alert(this.title + ': ' + student)
    });
*/!*
  }
};

group.showList();
```

이 에러가 나는 이유는 `forEach`의 함수에서 사용하는 `this`가 기본적으로는  `undefined`이기 때문입니다. 이것을 풀어 써보면, `undefinde.title`이므로, `undefinde`에 접근을 시도합니다.

화살표 함수는 `this` 키워드를 가지지 못할 뿐더러, `this`로 화살표 함수 기능에 영향을 줄 수도 없습니다.

> #### 화살표 함수는 `new` 키워드로 실행될 수 없습니다
> `this`가 없다는 것은 자연스럽게 또 다른 한계를 의미합니다. 화살표 함수는 생성자를 사용할 수 없습니다.  즉, 화살표 함수는 `new` 키워드로 호출할 수 없습니다.


> #### 화살표 함수 VS bind
> 화살표 함수의  `=>`와 정규 함수인 `.bind(this)` 사이에는 미묘한 차이가 있습니다.
>
> - `.bind(this)`는 함수 안의 "한정된 버전"을 만듭니다.
> - 화살표 함수의 `=>`는 어떤 구속력도 만들어지지 않습니다. 이 함수는 단순히 `this`가 없는 것입니다. `this`의 검색은 외부 환경에서 변수를 찾는 것과 같이 일반적인 변수 검색과 같은 방식으로 이루어집니다.


## 화살표들은 "인수들(arguments)"이 없습니다

또한 화살표 함수들은 `인수들(arguments)`이 없습니다.

현재의 `this`와 `arguments`를 호출해야 할 때, 인수가 없다는 것은 좋은 일입니다.

아래의 예제에서 `defer(f, ms)` 함수는 다른 함수를 인자로 받으며, 2초 뒤에 실행되는 래퍼 함수를 반환합니다.

```js run
function defer(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms)
  };
}

function sayHi(who) {
  alert('Hello, ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("John"); // 2초 뒤 Hello, John가 알럿으로 뜹니다.
```

아래는 이것은 화살표 함수가 없는 것입니다.

```js
function defer(f, ms) {
  return function(...args) {
    let ctx = this;
    setTimeout(function() {
      return f.apply(ctx, args);
    }, ms);
  };
}
```

이 함수는 `setTimeout` 내부에서 `this`와 전달받은 인수를 사용할 수 있도록, `args`와 `ctx`라는 변수를 추가 생성해 할당해야 합니다.

## 요약

화살표 함수들은

- `this`를 가지지 않습니다.
- 인수들을 가지지 않습니다.
- `new` 키워드로 호출할 수 없습니다.
- (화살표 함수들은 물론 `super`를 가지지 않습니다만, 아직 해당 부분은 다루지 않았습니다. 해당 내용은 [info:class-inheritance]() 챕터에서 다룰 것입니다.)

화살표 함수들은 자신의 "컨텍스트"가 없고, 현재 속한 코드에서 작동하는 짧은 코드 조각을 위한 것입니다. 그리고 이 목적에 매우 합치합니다.
