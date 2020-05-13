이유는 바로 prompt 함수가 사용자의 입력을 문자열로 반환하기 때문입니다.

그래서 변수는 각각 `1` 과 `2` 값을 가지고 있습니다.

```js run
let a = "1"; // prompt("First number?", 1);
let b = "2"; // prompt("Second number?", 2);

alert(a + b); // 12
```

우리가 할 일은 `+` 연산을 하기 전에 문자열을 숫자형으로 변환해주는 것입니다. 예를 들어, `Number()` 함수나 앞에 `+` 연산자를 붙여 주는 것입니다.

예를 들면, `prompt`바로 앞에 붙입니다:
```js run
let a = +prompt("First number?", 1);
let b = +prompt("Second number?", 2);

alert(a + b); // 3
```

혹은 `alert` 안에 붙입니다:

```js run
let a = prompt("First number?", 1);
let b = prompt("Second number?", 2);

alert(+a + +b); // 3
```

방금 전의 코드는 단항연산자 와 이항연산자로서의 `+`를 둘 다 사용하였습니다. 재밌지 않나요?
