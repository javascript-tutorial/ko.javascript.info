importance: 4

---

# Sortable table

열 제목을 나타내는 요소인 `<th>`를 클릭하면 열 전체가 정렬되는 표를 만들어보세요.

모든 `<th>` 속성엔 다음과 같이 데이터의 타입이 정의되어 있습니다.

```html
<table id="grid">
  <thead>
    <tr>
*!*
      <th data-type="number">나이</th>
      <th data-type="string">이름</th>
*/!*
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>5</td>
      <td>일리야</td>
    </tr>
    <tr>
      <td>10</td>
      <td>보라</td>
    </tr>
    ...
  </tbody>
</table>
```

In the example above the first column has numbers, and the second one -- strings. The sorting function should handle sort according to the type.

이 문제에선 `'숫자'`와 `'문자열'` 타입만 다룬다고 가정하겠습니다.

The working example:

[iframe border=1 src="solution" height=190]

P.S. The table can be big, with any number of rows and columns.
