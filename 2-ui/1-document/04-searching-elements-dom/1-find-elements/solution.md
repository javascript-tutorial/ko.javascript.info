다양한 방법으로 문제를 풀 수 있습니다.

그 중 일부를 여기서 소개해드리겠습니다.

```js
// 1. `id="age-table"`인 테이블
let table = document.getElementById('age-table')

// 2. 테이블 내의 `label` 요소 모두
table.getElementsByTagName('label')
// 또는
document.querySelectorAll('#age-table label')

// 3. 테이블 내의 첫 번째 `td`(Age가 적힌 곳)
table.rows[0].cells[0]
// 또는
table.getElementsByTagName('td')[0]
// 또는
table.querySelector('td')

// 4. `name="search"`인 `form`
// name이 "search"인 요소는 문서에 단 하나뿐이라고 가정합시다.
let form = document.getElementsByName('search')[0]
// from을 정확히 지정해 줄 수도 있습니다.
document.querySelector('form[name="search"]')

// 5. 폼의 첫 번째 `input`
form.getElementsByTagName('input')[0]
// 또는
form.querySelector('input')

// 6. 폼의 마지막 `input`
let inputs = form.querySelectorAll('input') // 모든 input 요소를 찾교
inputs[inputs.length-1] // 마지막 요소를 얻어냅니다.
```
