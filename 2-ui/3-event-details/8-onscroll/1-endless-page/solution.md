해결방법의 핵심은 페이지의 마지막 부분에 도달하기까지 페이지까지 더 많은 날짜(혹은 실제로 더 많은 상품을 불러오기)를 추가하는 함수입니다.

즉각적으로 호출할 수 있고 `window.onscroll` 핸들러로서 추가할 수 있습니다.

가장 중요한 질문은: "어떻게 페이지가 마지막 부분으로 스크롤이 되었는지 감지할 수 있는가?"

윈도우 기반의 좌표를 사용해봅시다.

이 문서는 `<html>` 태그 즉 `document.documentElement` 내부에 표시(포함)되었습니다.

우리는 전체 문서의 윈도우 기반의 상대 좌표를 `document.documentElement.getBoundingClientRect()`로 얻을 수 있고, `bottom` 프로퍼티 문서 아래로부터의 윈도우 기반 상대 좌표가 될 것입니다.

예를 들어, 전체 HTML 문서의 높이가 `2000px`이라고 한다면:

```js
// 페이지의 상단에 도달하게 되면
// 윈도우 기준 상단 = 0
document.documentElement.getBoundingClientRect().top = 0;

// 윈도우 기준 하단 = 2000
// 문서가 길면, 아마도 윈도우 아래보다도 멀리 나가게 됩니다
document.documentElement.getBoundingClientRect().bottom = 2000;
```

만약에 `500px` 스크롤하게 된다면:

```js
// 문서 상단이 윈도우보다 500px 더 위에 있습니다
document.documentElement.getBoundingClientRect().top = -500;
// 문서 하단이 윈도우보다 1500px 더 가깝습니다
document.documentElement.getBoundingClientRect().bottom = 1500;
```

맨 아래까지 스크롤하게 된다면, 윈도우의 높이가 `600px`로 추정하게 됩니다:

```js
// 문서 상단이 윈도우보다 1400px 위에 있습니다
document.documentElement.getBoundingClientRect().top = -1400;
// 문서 하단이 윈도우보다 600px 아래에 있습니다
document.documentElement.getBoundingClientRect().bottom = 600;
```

`bottom`은 `0`이 될 수 없음을 명심합시다, 왜냐하면 윈도우의 상단에 절대로 도달할 수 없습니다. `bottom` 좌표의 최소한의 한계는 윈도우의 높이입니다(`600`으로 예상하고 있습니다), 조금이라도 더 스크롤할 수 없습니다.

윈도우의 높이는 `document.documentElement.clientHeight`로 얻을 수 있습니다.

과제를 위해, 문서 하단이 `100px`보다 더 떨어져 있지 않음을 알고 있어야 합니다. (즉: `600-700px`, 만일 높이가 `600`이라면)

그래서 이것이 구현부입니다:

```js
function populate() {
  while (true) {
    // 문서의 아래 부분
    let windowRelativeBottom = document.documentElement.getBoundingClientRect()
      .bottom;

    // 만약 사용자가 충분히 멀리 스크롤했다면 (끝까지 100px 미만)
    if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
      // 더 많은 정보를 추가합시다
      document.body.insertAdjacentHTML(
        "beforeend",
        `<p>Date: ${new Date()}</p>`
      );
    }
  }
}
```
