중요도: 4

---

# 정렬 가능한 테이블

테이블을 정렬할 수 있게 해주세요: `<th>` 요소를 클릭하면 해당 열을 기준으로 정렬됩니다.

각 `<th>` 에는 다음과 같은 속성 유형이 있습니다 :

```html
<table id="grid">
  <thead>
    <tr>
*!*
      <th data-type="number">Age</th>
      <th data-type="string">Name</th>
*/!*
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>5</td>
      <td>John</td>
    </tr>
    <tr>
      <td>10</td>
      <td>Ann</td>
    </tr>
    ...
  </tbody>
</table>
```

위의 예에서 첫 번째 열에는 숫자가 있고, 두 번째 열에는 문자열이 있습니다. 정렬 함수는 타입에 따라 정렬을 처리해야 합니다.

`"string"` 과 `"number"` 타입만 지원해야 합니다.

작동 예:

[iframe border=1 src="solution" height=190]

참고: 테이블은 여러 행과 열을 사용하여 커질 수 있습니다.
