해답에서 작지만 중요한 역할을 하는 부분에 주의를 기울여 주세요. `+value`로 입력받은 값을 숫자형으로 변경한 이후엔, 빈 문자열(정지 신호)을 0(유효한 숫자)과 구분할 수 없기 때문에, `prompt` 직후에 `value`를 숫자로 변환하지 않고 나중에 숫자로 변환하였습니다.


```js run demo
function sumInput() {
 
  let numbers = [];

  while (true) {

    let value = prompt("숫자를 입력해 주세요.", 0);

    // 입력받는 것을 정지해야 하는 경우
    if (value === "" || value === null || !isFinite(value)) break;

    numbers.push(+value);
  }

  let sum = 0;
  for (let number of numbers) {
    sum += number;
  }
  return sum;
}

alert( sumInput() ); 
```

