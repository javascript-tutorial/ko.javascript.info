자바스크립트에서 문자열은 수정할 수 없기 때문에 단순히 첫 글자만 바꾸는 것은 불가능합니다.

기존 문자열을 참고해 첫 글자만 대문자로 바꿔 새로운 문자열을 만들어야 우리가 원하는 작업을 할 수 있습니다. 아래와 같이 말이죠.

```js
let newStr = str[0].toUpperCase() + str.slice(1);
```

그런데 이렇게 코드를 작성하면 `str`이 비어있는 문자열인 경우 `str[0]`이 `undefined`가 되는 문제가 발생합니다. `undefined`는 `toUpperCase()`메서드를 지원하지 않으므로 에러가 발생하죠.

두 가지 방법을 사용해 이런 예외사항을 처리 할 수 있습니다.

1. `str.charAt(0)`은 `str`이 비어있는 문자열이더라도 항상 문자열을 반환하므로, 이 메서드를 사용합니다.
2. 빈 문자열인지를 확인하는 코드를 작성합니다.

두 번째 방법을 사용하여 작성한 답안은 아래와 같습니다.

```js run demo
function ucFirst(str) {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}

alert( ucFirst("john") ); // John
```

