```js run demo
function sumSalaries(salaries) {

  let sum = 0;
  for (let salary of Object.values(salaries)) {
    sum += salary;
  }

  return sum; // 650
}

let salaries = {
  "John": 100,
  "Pete": 300,
  "Mary": 250
};

alert( sumSalaries(salaries) ); // 650
```
또는 선택적으로,`Object.values` 와 `reduce`를 이용하여, 합을 구할 수도 있습니다:

```js
// salaries 배열 반복문을 reduce 합니다,
// 값들을 합산합니다
// 그리고 결과를 반환합니다
function sumSalaries(salaries) {
  return Object.values(salaries).reduce((a, b) => a + b, 0) // 650
}
```
