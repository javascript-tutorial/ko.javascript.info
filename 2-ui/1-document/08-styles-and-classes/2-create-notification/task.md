importance: 5

---

# 알림 만들기

샌드박스를 열었을 때 보이는 콘텐츠를 기반으로 `<div class="notification">` 알림을 만들어주는 함수 `showNotification(options)`를 작성해봅시다. 이 알림은 1.5초 후에 자동으로 사라집니다.

옵션은 다음과 같습니다.

```js
// 창의 오른쪽 상단에 "Hello"라는 텍스트가 담긴 요소를 보여줍니다.
showNotification({
  top: 10, // 창의 상단에서 10px 떨어진 위치에 표시합니다(기본값은 0px).
  right: 10, // 창의 오른쪽 가장자리에서 10px 떨어진 위치에 표시합니다(기본값은 0px).
  html: "Hello!", // 알림의 HTML입니다.
  className: "welcome" // div에 대한 추가 클래스입니다(선택 사항).
});
```

[demo src="solution"]


CSS 포지셔닝을 사용하여 주어진 좌표(오른쪽 상단)에 알림을 표시하세요. 필요한 스타일들은 링크를 열면 찾아볼 수 있습니다.
