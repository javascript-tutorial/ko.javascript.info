importance: 4

---

# Sortable table

Make the table sortable: clicks on `<th>` elements should sort it by corresponding column.

모든 `<th>` 속성엔 다음과 같이 데이터의 타입이 정의되어 있습니다.

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

In the example above the first column has numbers, and the second one -- strings. The sorting function should handle sort according to the type.

Only `"string"` and `"number"` types should be supported.

The working example:

[iframe border=1 src="solution" height=190]

P.S. The table can be big, with any number of rows and columns.
