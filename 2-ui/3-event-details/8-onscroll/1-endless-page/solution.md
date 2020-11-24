문제 해결의 핵심은 방문자가 문서 끝에 머무르는 동안에 더 많은 날짜들을 페이지에 추가하는 (혹은 실생활 속 물건들을 더 불러오는) 함수입니다.

이 함수를 바로 호출할 수도 있고, `window.onscroll` 핸들러로 추가할 수도 있습니다.

여기서 가장 중요한 것은 '페이지 끝까지 스크롤 되었을 때 어떻게 알아챌 것인가?'라는 궁금증입니다.

창-상대 좌표를 이용해보죠.

문서는 `<html>` 태그, 즉 `document.documentElement` 내에 표시됩니다(그리고 포함됩니다).

창-상대 좌표는 `document.documentElement.getBoundingClientRect()`로 전체 문서에 대해 얻을 수 있으며, `bottom` 프로퍼티는 문서 하단에 대한 창-상대 좌표를 의미하게 됩니다.

예를 들어 전체 HTML 문서 높이가 `2000px`이라면,

```js
// 페이지 상단에 위치할 때
// 창-상대 좌표 top = 0
document.documentElement.getBoundingClientRect().top = 0

// 창-상대 좌표 bottom = 2000
// 문서가 길기 때문에 아마 하단 영역과 거리가 꽤 멀 것입니다.
document.documentElement.getBoundingClientRect().bottom = 2000
```

아래로 `500px`만큼 스크롤 한다면,

```js
// 문서 상단이 창 500px 위에 위치합니다.
document.documentElement.getBoundingClientRect().top = -500
// 문서 하단과는 500px만큼 가까워집니다.
document.documentElement.getBoundingClientRect().bottom = 1500
```

창 높이가 `600px`이라고 가정하고 끝까지 스크롤 할 경우:


```js
// 문서 상단이 창 1400px 위에 위치합니다.
document.documentElement.getBoundingClientRect().top = -1400
// 문서 하단이 창 600px 아래에 위치합니다.
document.documentElement.getBoundingClientRect().bottom = 600
```

문서 `bottom` 영역은 창 상단에 도달할 수 없기에 `0`이 될 수 없음을 주의해야 합니다. `bottom` 좌표 최솟값은 창 높이(600 가정)이며 더 위로 스크롤 할 수 없습니다.

창 높이는 `document.documentElement.clientHeight`로 얻을 수 있습니다.

과제를 해결하기 위해 문서 하단이 `100px`이하 (높이가 `600`인 경우 `600-700px`) 떨어져 있는지 알아야 합니다.

아래 함수를 확인해보세요.

```js
function populate() {
  while(true) {
    // 문서 하단
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;

    // 유저가 충분히 멀리 스크롤 했을 경우 (끝으로부터 100px 미만)
    if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
      // 데이터를 추가합니다
      document.body.insertAdjacentHTML("beforeend", `<p>Date: ${new Date()}</p>`);
    }
  }
}
```