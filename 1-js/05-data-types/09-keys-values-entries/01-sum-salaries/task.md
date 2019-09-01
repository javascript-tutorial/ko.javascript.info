importance: 5

---

# 프로퍼티 값 더하기

임의의 급여 값을 가지는 `salaries` 객체가 있습니다. 

`Object.values` 와 `for..of` 반복문을 사용하여 모든 급여의 합을 반환하는 `sumSalaries(salaries)`함수를 작성하세요.

만약 `salaries` 가 빈 객체라면, `0`을 반환해야 합니다.

예시:

```js
let salaries = {
  "John": 100,
  "Pete": 300,
  "Mary": 250
};

alert( sumSalaries(salaries) ); // 650
```

