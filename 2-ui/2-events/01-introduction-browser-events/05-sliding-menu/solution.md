
# HTML·CSS
먼저 HTML·CSS를 만들어 봅시다. 

메뉴는 페이지의 독립적으로 실행하는 그래픽 구성요소이므로 단일 DOM 요소에 놓는 것이 좋습니다.

메뉴 항목 목록은 목록 `ul/li`로 배치할 수 있습니다.

다음은 메뉴 구조 예시입니다. 

```html
<div class="menu">
  <span class="title">Sweeties (click me)!</span>
  <ul>
    <li>Cake</li>
    <li>Donut</li>
    <li>Honey</li>
  </ul>
</div>
```

`<div>`는 암시적으로 `display:block`을 가지고 있으며 가로 너비의 100%를 차지하기 때문에 제목에는 `<span>`을 사용합니다.

이렇게 말이죠.

```html autorun height=50
<div style="border: solid red 1px" onclick="alert(1)">Sweeties (click me)!</div>
```

그래서 `onclick`을 설정하면 텍스트 오른쪽에 클릭이 나타납니다.

`<span>`에는 암시적으로 `display: inline`이 있으므로 모든 텍스트에 정확히 맞도록 충분한 공간을 차지합니다.

```html autorun height=50
<span style="border: solid red 1px" onclick="alert(1)">Sweeties (click me)!</span>
```

# 메뉴 토글 하기 

메뉴를 토글 하면 화살표 방향이 바뀌고 메뉴 목록이 표시되거나 숨겨져야 합니다.

이 모든 변경 사항은 CSS로 처리할 수 있습니다. 자바스크립트에서 클래스 `.open`을 추가·제거하여 현재 메뉴 상태를 구분해야 합니다.

`.open`이 없으면 메뉴는 닫힙니다.

```css
.menu ul {
  margin: 0;
  list-style: none;
  padding-left: 20px;
  display: none;
}

.menu .title::before {
  content: '▶ ';
  font-size: 80%;
  color: green;
}
```

`.open`을 사용하면 화살표가 바뀌고 목록이 표시됩니다.

```css
.menu.open .title::before {
  content: '▼ ';
}

.menu.open ul {
  display: block;
}
```
