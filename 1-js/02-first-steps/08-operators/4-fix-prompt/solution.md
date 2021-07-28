의도한 대로 덧셈이 되지 않는 이유는 prompt 함수가 사용자 입력을 문자열로 반환하기 때문입니다.

그래서 프롬프트 창에서 입력한 변수들은 각각 문자열인 `"1"`과 `"2"`가 되죠.

```js run
let a = "1"; // prompt("덧셈할 첫 번째 숫자를 입력해주세요.", 1);
let b = "2"; // prompt("덧셈할 두 번째 숫자를 입력해주세요.", 2);

alert(a + b); // 12
```

<<<<<<< HEAD
예시가 제대로 동작하게 하려면 덧셈 연산 `+`가 수행되기 전에 문자열을 숫자로 변환해야 합니다. 이때 `Number()`를 사용하거나 변수 앞에 `+`를 붙여줄 수 있습니다.
=======
What we should do is to convert strings to numbers before `+`. For example, using `Number()` or prepending them with `+`.
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

아래 코드에선 `prompt` 함수 바로 앞에서 문자열을 숫자로 변환했습니다.

```js run
let a = +prompt("덧셈할 첫 번째 숫자를 입력해주세요.", 1);
let b = +prompt("덧셈할 두 번째 숫자를 입력해주세요.", 2);

alert(a + b); // 3
```

아래 코드에선 `alert` 함수 안에서 문자열을 숫자로 변환해 보았습니다.

```js run
let a = prompt("덧셈할 첫 번째 숫자를 입력해주세요.", 1);
let b = prompt("덧셈할 두 번째 숫자를 입력해주세요.", 2);

alert(+a + +b); // 3
```

코드 한 줄 안에서 단항, 이항 `+` 연산자를 한꺼번에 쓰니 조금 웃겨 보이네요.
