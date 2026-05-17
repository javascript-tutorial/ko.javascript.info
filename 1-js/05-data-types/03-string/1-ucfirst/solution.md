자바스크립트에서 문자열은 수정할 수 없기 때문에 단순히 첫 글자만 바꾸는 것은 불가능합니다.

기존 문자열을 참고해 첫 글자만 대문자로 바꿔 새로운 문자열을 만들어야 우리가 원하는 작업을 할 수 있습니다. 아래와 같이 말이죠.

```js
let newStr = str[0].toUpperCase() + str.slice(1);
```

그런데 이렇게 코드를 작성하면 `str`이 비어있는 문자열인 경우 `str[0]`이 `undefined`가 되는 문제가 발생합니다. `undefined`는 `toUpperCase()`메서드를 지원하지 않으므로 에러가 발생하죠.

가장 간단한 해결 방법은 아래처럼 빈 문자열인지 확인하는 조건을 추가하는 것입니다.

```js run demo
function ucFirst(str) {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}

alert( ucFirst("john") ); // John
```