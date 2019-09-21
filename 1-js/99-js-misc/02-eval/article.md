# Eval: 코드 문자열 실행하기

내장 함수 `eval`을 사용하면 코드 문자열을 실행 할 수 있습니다.

문법은 다음과 같습니다.

```js
let result = eval(code);
```

예시:

```js run
let code = 'alert("Hello")';
eval(code); // Hello
```

문자열 코드는 길거나 줄 바꿈, 함수 선언, 변수 등을 포함 할 수 있습니다.

`eval`은 마지막 구문의 결과를 반환합니다.

예시:
```js run
let value = eval('1+1');
alert(value); // 2
```

```js run
let value = eval('let i = 0; ++i');
alert(value); // 1
```

eval을 사용한 코드는 현재 렉시컬 환경에서 실행되므로 외부 변수를 읽을 수 있습니다.

```js run no-beautify
let a = 1;

function f() {
  let a = 2;

*!*
  eval('alert(a)'); // 2
*/!*
}

f();
```

외부 변수 변경도 가능합니다.

```js untrusted refresh run
let x = 5;
eval("x = 10");
alert(x); // 10, 변경된 값
```

엄격 모드에서 `eval`은 자체 렉시컬 환경을 갖고 있습니다. 따라서 eval 내부에서 선언된 함수와 변수는 외부에서 읽을 수 없습니다.

```js untrusted refresh run
// reminder: 'use strict'는 실행 예제에서 기본적으로 활성화 되어 있음

eval("let x = 5; function f() {}");

alert(typeof x); // 정의 되지 않음 (없는 변수)
// 함수도 읽을 수 없음
```

`use strict`을 사용하지 않으면 `eval`은 자체 렉시컬 환경을 갖지 않으므로 외부에 있는 `x`와 `f`를 읽을 수 있습니다.

## "eval"의 사용

모던 프로그래밍에서 `eval`은 거의 사용되지 않습니다. 흔히 "eval is evil"라고 합니다.

이유는 간단합니다. 오래 전, JavaScript는 훨씬 더 약한 언어였고 많은 것을 `eval`만 사용하여 실행했습니다. 하지만 그 때는 10년이 흘렀습니다.

지금은 `eval`을 사용할 이유가 거의 없습니다. 누군가가 사용한다면, 모던한 언어 문법이나 [JavaScript Module](info:modules)로 바꿀 가능성이 큽니다.

외부 변수에 접근하는 기능은 부작용이 있다는 것에 유의하세요.

코드 압축기(JS가 프로덕션 되기 전에 압축을 위해 사용되는 도구)는 최적화를 위해 지역 변수를 더 짧은 변수로 대체 합니다. 그것은 보통 안전하지만 `eval`을 사용하면 변수를 참조 할 수 없습니다. 따라서 압축기는 `eval`에서 보이는 모든 지역 변수를 대체하지 않습니다. 이는 코드 압축률에 부정적인 영향을 미칩니다.

`eval` 내부에서 외부 지역 변수를 사용하는 것은 코드의 유지 관리가 더 어렵기 때문에 좋지 않은 프로그래밍 방법입니다.

여러 문제로부터 완전히 안전해지는 방법은 두 가지가 있습니다.

**eval을 사용한 코드가 외부 변수를 쓰지 않는 경우 `eval`을 `window.eval(...)`로 호출하세요.**

전역 스코프에서 코드를 실행하는 방법:

```js untrusted refresh run
let x = 1;
{
  let x = 5;
  window.eval('alert(x)'); // 1 (전역 변수)
}
```

**eval을 사용한 코드가 지역 변수를 필요로 할 경우 `eval`을 `new Function`로 변경하고 인수로 전달하세요.**

```js run
let f = new Function('a', 'alert(a)');

f(5); // 5
```

The `new Function` 문법은 챕터 <info:new-function>에서 설명합니다. 이것은 전역 스코프에서도 문자열로 함수를 생성합니다. 따라서 지역 변수를 볼 수 없습니다. 하지만 위의 예시처럼 명시적으로 인수로 전달하는 것이 훨씬 더 명확합니다.

## 요약

- `eval(code)`을 호출하면 코드 문자열을 실행하고 마지막 구문의 결과를 반환합니다.
- 일반적으로 필요하지 않기 때문에 모던 JavaScript에서 거의 사용하지 않습니다.
- 외부 지역 변수에 접근할 수 있습니다. 그것은 좋지 않은 방법입니다.
- 대신 전역 스코프에서 코드에 `eval`을 사용하려면 `window.eval(code)`을 호출하세요.
- 또한 코드에 외부 스코프의 데이터가 필요하면 `new Function`을 사용하고 인수로 전달하세요.
