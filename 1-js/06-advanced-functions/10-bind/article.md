libs:
  - lodash

---

# 함수 바인딩

`setTimeout`에 메서드를 전달할 때처럼, 객체 메서드를 콜백으로 전달할 때 '`this` 정보가 사라지는' 문제가 생깁니다.

이번 챕터에선 이 문제를 어떻게 해결할지에 대해 알아보겠습니다.

## 사라진 'this'

앞서 다양한 예제를 통해 `this` 정보가 사라지는 문제를 경험해보았습니다. 객체 메서드가 객체 내부가 아닌 다른 곳에 전달되어 호출되면 `this`가 사라집니다.

`setTimeout`을 사용한 아래 예시에서 `this`가 어떻게 사라지는지 살펴봅시다.

```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
setTimeout(user.sayHi, 1000); // Hello, undefined!
*/!*
```

`this.firstName`이 "John"이 되어야 하는데, 얼럿창엔 `undefined`가 출력됩니다.

이렇게 된 이유는 `setTimeout`에 객체에서 분리된 함수인 `user.sayHi`가 전달되기 때문입니다. 위 예시의 마지막 줄은 다음 코드와 같습니다. 

```js
let f = user.sayHi;
setTimeout(f, 1000); // user 컨텍스트를 잃어버림
```

브라우저 환경에서 `setTimeout` 메서드는 조금 특별한 방식으로 동작합니다. 인수로 전달받은 함수를 호출할 때, `this`에 `window`를 할당합니다(Node.js 환경에선 `this`가 타이머 객체가 되는데, 여기선 중요하지 않으므로 넘어가겠습니다). 따라서 위 예시의 `this.firstName`은 `window.firstName`가 되는데, `window` 객체엔 `firstName`이 없으므로 `undefined`가 출력됩니다. 다른 유사한 사례에서도 대부분 `this`는 `undefined`가 됩니다.

객체 메서드를 실제 메서드가 호출되는 곳(예시에선 `setTimeout` 스케줄러)으로 전달하는 것은 아주 흔합니다. 이렇게 메서드를 전달할 때, 컨텍스트도 제대로 유지하려면 어떻게 해야 할까요?

## 방법 1: 래퍼

가장 간단한 해결책은 래퍼 함수를 사용하는 것입니다.

```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);
*/!*
```

위 예시가 의도한 대로 동작하는 이유는 외부 렉시컬 환경에서 `user`를 받아서 보통 때처럼 메서드를 호출했기 때문입니다.

강조 표시한 줄은 아래와 같이 변경할 수도 있습니다.

```js
setTimeout(() => user.sayHi(), 1000); // Hello, John!
```

이렇게 코드를 작성하면 간결해져서 보기는 좋지만, 약간의 취약성이 생깁니다.

`setTimeout`이 트리거 되기 전에(1초가 지나기 전에) `user`가 변경되면, 변경된 객체의 메서드를 호출하게 됩니다.


```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(() => user.sayHi(), 1000);

// 1초가 지나기 전에 user의 값이 바뀜
user = { sayHi() { alert("또 다른 사용자!"); } };

// 또 다른 사용자!
```

두 번째 방법을 사용하면 이런 일이 발생하지 않습니다.

## 방법 2: bind

모든 함수는 `this`를 수정하게 해주는 내장 메서드 [bind](mdn:js/Function/bind)를 제공합니다.

기본 문법은 다음과 같습니다.

```js
// 더 복잡한 문법은 뒤에 나옵니다.
let boundFunc = func.bind(context);
````

`func.bind(context)`는 함수처럼 호출 가능한 '특수 객체(exotic object)'를 반환합니다. 이 객체를 호출하면 `this`가 `context`로 고정된 함수 `func`가 반환됩니다.

따라서 `boundFunc`를 호출하면 `this`가 고정된 `func`를 호출하는 것과 동일한 효과를 봅니다. 

아래 `funcUser`에는 `this`가 `user`로 고정된 `func`이 할당됩니다.

```js run  
let user = {
  firstName: "John"
};

function func() {
  alert(this.firstName);
}

*!*
let funcUser = func.bind(user);
funcUser(); // John  
*/!*
```

여기서 `func.bind(user)`는 `func`의 `this`를 `user`로 '바인딩한 변형'이라고 생각하시면 됩니다.

인수는 원본 함수 `func`에 '그대로' 전달됩니다.

```js run  
let user = {
  firstName: "John"
};

function func(phrase) {
  alert(phrase + ', ' + this.firstName);
}

// this를 user로 바인딩합니다.
let funcUser = func.bind(user);

*!*
funcUser("Hello"); // Hello, John (인수 "Hello"가 넘겨지고 this는 user로 고정됩니다.)
*/!*
```

이제 객체 메서드에 `bind`를 적용해 봅시다.


```js run
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

*!*
let sayHi = user.sayHi.bind(user); // (*)
*/!*

// 이제 객체 없이도 객체 메서드를 호출할 수 있습니다.
sayHi(); // Hello, John!

setTimeout(sayHi, 1000); // Hello, John!

// 1초 이내에 user 값이 변화해도
// sayHi는 기존 값을 사용합니다.
user = {
  sayHi() { alert("또 다른 사용자!"); }
};
```

`(*)`로 표시한 줄에서 메서드 `user.sayHi`를 가져오고, 메서드에 `user`를 바인딩합니다. `sayHi`는 이제 '묶인(bound)' 함수가 되어 단독으로 호출할 수 있고 `setTimeout`에 전달하여 호출할 수도 있습니다. 어떤 방식이든 컨택스트는 원하는 대로 고정됩니다.

아래 예시를 실행하면 인수는 '그대로' 전달되고 `bind`에 의해 `this`만 고정된 것을 확인할 수 있습니다. 

```js run
let user = {
  firstName: "John",
  say(phrase) {
    alert(`${phrase}, ${this.firstName}!`);
  }
};

let say = user.say.bind(user);

say("Hello"); // Hello, John (인수 "Hello"가 say로 전달되었습니다.)
say("Bye"); // Bye, John ("Bye"가 say로 전달되었습니다.)
```

````smart header="`bindAll`로 메서드 전체 바인딩하기"
객체에 복수의 메서드가 있고 이 메서드 전체를 전달하려 할 땐, 반복문을 사용해 메서드를 바인딩할 수 있습니다.

```js
for (let key in user) {
  if (typeof user[key] == 'function') {
    user[key] = user[key].bind(user);
  }
}
```

자바스크립트 라이브러리를 사용해도 대규모 바인딩을 할 수 있습니다. lodash 라이브러리의 [_.bindAll(obj)](http://lodash.com/docs#bindAll)이 그 예입니다.
````

## 부분 적용

지금까진 `this` 바인딩에 대해서만 이야기해보았습니다. 한 단계 더 나아가 봅시다.

`this` 뿐만 아니라 인수도 바인딩이 가능합니다. 인수 바인딩은 잘 쓰이진 않지만 가끔 유용할 때가 있습니다. 

`bind`의 전체 문법은 다음과 같습니다.

```js
let bound = func.bind(context, [arg1], [arg2], ...);
```

`bind`는 컨텍스트를 `this`로 고정하는 것 뿐만 아니라 함수의 인수도 고정해줍니다.

곱셈을 해주는 함수 `mul(a, b)`를 예시로 들어보겠습니다.

```js
function mul(a, b) {
  return a * b;
}
```

`bind`를 사용해 새로운 함수 `double`을 만들겠습니다.

```js run
function mul(a, b) {
  return a * b;
}

*!*
let double = mul.bind(null, 2);
*/!*

alert( double(3) ); // = mul(2, 3) = 6
alert( double(4) ); // = mul(2, 4) = 8
alert( double(5) ); // = mul(2, 5) = 10
```

`mul.bind(null, 2)`를 호출하면 새로운 함수 `double`이 만들어집니다. `double`엔 컨텍스트가 `null`, 첫 번째 인수는 `2`인 `mul`의 호출 결과가 전달됩니다. 추가 인수는 '그대로' 전달됩니다.

이런 방식을 [부분 적용(partial application)](https://en.wikipedia.org/wiki/Partial_application)이라고 부릅니다. 부분 적용을 사용하면 기존 함수의 매개변수를 고정하여 새로운 함수를 만들 수 있습니다.

위 예시에선 `this`를 사용하지 않았다는 점에 주목하시기 바랍니다. `bind`엔 컨텍스트를 항상 넘겨줘야 하므로 `null`을 사용했습니다.

부분 적용을 사용해 3을 곱해주는 함수 `triple`을 만들어보겠습니다.

```js run
function mul(a, b) {
  return a * b;
}

*!*
let triple = mul.bind(null, 3);
*/!*

alert( triple(3) ); // = mul(3, 3) = 9
alert( triple(4) ); // = mul(3, 4) = 12
alert( triple(5) ); // = mul(3, 5) = 15
```

그런데 부분 함수는 왜 만드는 걸까요?

가독성이 좋은 이름(`double`, `triple`)을 가진 독립 함수를 만들 수 있다는 이점 때문입니다. 게다가 `bind`를 사용해 첫 번째 인수를 고정할 수 있기 때문에 매번 인수를 전달할 필요도 없어지죠.

이 외에도 부분 적용은 매우 포괄적인 함수를 기반으로 덜 포괄적인 변헝 함수를 만들수 있다는 점에서 유용합니다.

함수 `send(from, to, text)`가 있다고 가정해 봅시다. 객체 `user` 안에서 부분 적용을 활용하면, 전송 주체가 현재 사용자인 함수 `sendTo(to, text)`를 구현할 수 있습니다.

## 컨텍스트 없는 부분 적용

인수 일부는 고정하고 컨텍스트 `this`는 고정하고 싶지 않다면 어떻게 해야 할까요?

네이티브 `bind`만으로는 컨텍스트를 생략하고 인수로 바로 뛰어넘지 못합니다.

다행히도 인수만 바인딩해주는 헬퍼 함수 `partial`를 구현하는 건 쉽습니다. 

아래와 같이 말이죠.

```js run
*!*
function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}
*/!*

// 사용법:
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  }
};

// 시간을 고정한 부분 메서드를 추가함
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hello");
// 출력값 예시:
// [10:00] John: Hello!
```

`partial(func[, arg1, arg2...])`을 호출하면 래퍼(`(*)`)가 반환됩니다. 래퍼를 호출하면 `func`이 다음과 같은 방식으로 동작합니다.
- 동일한 `this`를 받습니다(`user.sayNow`는 `user`를 대상으로 호출됩니다).
- `partial`을 호출할 때 받은 인수(`"10:00"`)는 `...argsBound`에 전달됩니다.
- 래퍼에 전달된 인수(`"Hello"`)는 `...args`가 됩니다.

전개 연산자 덕분에 이 모든 과정이 쉬워졌습니다.

lodash 라이브러리의 [_.partial](https://lodash.com/docs#partial)을 사용하면 컨텍스트 없는 부분 적용을 직접 구현하지 않아도 됩니다.

## 요약

`func.bind(context, ...args)`는 `this`가 `context`로 고정되고 인수도 고정된 함수 `func`을 반환합니다.

`bind`는 보통 객체 메서드의 `this`를 고정해 어딘가에 넘기고자 할 때 사용합니다. `setTimeout`에 넘길 때 같이 말이죠. 

기존 함수의 인수 몇 개를 고정한 함수를 *부분 적용(partially applied)* 함수 또는 *부분(partial)* 함수라고 부릅니다.

부분 적용은 같은 인수를 여러 번 반복하고 싶지 않을 때 유용합니다. `send(from, to)`라는 함수가 있는데 `from`을 고정하고 싶다면 `send(from, to)`의 부분 함수를 구현해 사용하면 됩니다. 
