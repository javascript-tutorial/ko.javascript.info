# 화살표 함수 다시 살펴보기

화살표 함수(arrow function)에 대해 다시 논의해봅시다.

화살표 함수는 단순히 함수를 '짧게' 쓰기 위한 용도로 사용되지 않습니다. 화살표 함수는 몇 가지 독특하고 유용한 기능을 제공합니다.

자바스크립트를 사용하다 보면 저 멀리 동떨어진 곳에서 실행될 작은 함수를 작성해야 하는 상황을 자주 만나게 됩니다.

예시:

- `arr.forEach(func)` -- `func`는 `forEach`가 호출될 때 배열 `arr`의 요소 전체를 대상으로 실행됩니다.
- `setTimeout(func)` -- `func`는 내장 스케줄러에 의해 실행됩니다.
- 기타 등등...

이처럼 자바스크립트에선 함수를 생성하고 그 함수를 어딘가에 전달하는 것이 아주 자연스럽습니다.

그런데 어딘가에 함수를 전달하게 되면 함수의 컨텍스트를 잃을 수 있습니다. 이럴 때 화살표 함수를 사용하면 현재 컨텍스트를 잃지 않아 편리합니다.

## 화살표 함수에는 'this'가 없습니다

<info:object-methods> 챕터에서 화살표 함수엔 `this`가 없다는 것을 배운 바 있습니다. 화살표 함수 본문에서 `this`에 접근하면, 외부에서 값을 가져옵니다.

이런 특징은 객체의 메서드(`showList()`) 안에서 동일 객체의 프로퍼티(`students`)를 대상으로 순회를 하는 데 사용할 수 있습니다.

```js run
let group = {
  title: "1모둠",
  students: ["보라", "호진", "지민"],

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

예시의 `forEach`에서 화살표 함수를 사용했기 때문에 화살표 함수 본문에 있는 `this.title`은 화살표 함수 바깥에 있는 메서드인 `showList`가 가리키는 대상과 동일해집니다. 즉 `this.title`은 `group.title`과 같습니다.

위 예시에서 화살표 함수 대신 '일반' 함수를 사용했다면 에러가 발생했을 겁니다.

```js run
let group = {
  title: "1모둠",
  students: ["보라", "호진", "지민"],

  showList() {
*!*
    this.students.forEach(function(student) {
      // TypeError: Cannot read property 'title' of undefined
      alert(this.title + ': ' + student)
    });
*/!*
  }
};

group.showList();
```

에러는 `forEach`에 전달되는 함수의 `this`가 `undefined` 이어서 발생했습니다. `alert` 함수에서 `undefined.title`에 접근하려 했기 때문에 얼럿 창엔 에러가 출력됩니다.

그런데 화살표 함수는 `this` 자체가 없기 때문에 이런 에러가 발생하지 않습니다.

```warn header="화살표 함수는 `new`와 함께 실행할 수 없습니다."
`this`가 없기 때문에 화살표 함수는 생성자 함수로 사용할 수 없다는 제약이 있습니다. 화살표 함수는 `new`와 함께 호출할 수 없습니다.
```

```smart header="화살표 함수 vs. bind"
화살표 함수와 일반 함수를 `.bind(this)`를 사용해서 호출하는 것 사이에는 미묘한 차이가 있습니다.

- `.bind(this)`는 함수의 '한정된 버전(bound version)'을 만듭니다.
- 화살표 함수는 어떤 것도 바인딩시키지 않습니다. 화살표 함수엔 단지 `this`가 없을 뿐입니다. 화살표 함수에서 `this`를 사용하면 일반 변수 서칭과 마찬가지로 `this`의 값을 외부 렉시컬 환경에서 찾습니다.
```

## 화살표 함수엔 'arguments'가 없습니다

화살표 함수는 일반 함수와는 다르게 모든 인수에 접근할 수 있게 해주는 유사 배열 객체 `arguments`를 지원하지 않습니다.

이런 특징은 현재 `this` 값과 `arguments` 정보를 함께 실어 호출을 포워딩해 주는 데코레이터를 만들 때 유용하게 사용됩니다.

아래 예시에서 데코레이터 `defer(f, ms)`는 함수를 인자로 받고 이 함수를 래퍼로 감싸 반환하는데, 함수 `f`는 `ms` 밀리초 후에 호출됩니다.

```js run
function defer(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms)
  };
}

function sayHi(who) {
  alert('안녕, ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("철수"); // 2초 후 "안녕, 철수"가 출력됩니다.
```

화살표 함수를 사용하지 않고 동일한 기능을 하는 데코레이터 함수를 만들면 다음과 같습니다.

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

일반 함수에선 `setTimeout`에 넘겨주는 콜백 함수에서 사용할 변수 `ctx`와 `args`를 반드시 만들어줘야 합니다.

## 요약

화살표 함수가 일반 함수와 다른 점은 다음과 같습니다.

- `this`를 가지지 않습니다.
- `arguments`를 지원하지 않습니다.
- `new`와 함께 호출할 수 없습니다.
- 이 외에도 화살표 함수는 `super`가 없다는 특징도 있는데, 아직 `super`에 대해 배우지 않았기 때문에 이번 챕터에선 해당 내용을 다루지 않았습니다. 화살표 함수와 `super`의 관계는 <info:class-inheritance> 챕터에서 학습할 예정입니다.

화살표 함수는 컨텍스트가 있는 긴 코드보다는 자체 '컨텍스트'가 없는 짧은 코드를 담을 용도로 만들어졌습니다. 그리고 이 목적에 잘 들어맞는 특징을 보입니다.
