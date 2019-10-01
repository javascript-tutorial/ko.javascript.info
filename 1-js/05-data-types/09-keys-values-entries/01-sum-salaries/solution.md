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
`Object.values` 와 `reduce`를 이용해 합을 구할 수도 있습니다.

```js
// reduce는 급여 정보가 저장되어있는 배열을 순회해
// 급여의 총합을 만들고
// 그 결과를 반환합니다.
function sumSalaries(salaries) {
  return Object.values(salaries).reduce((a, b) => a + b, 0) // 650
}
```
