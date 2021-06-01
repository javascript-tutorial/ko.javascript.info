
# HTML·CSS
우선 HTML·CSS를 만들어 봅시다.

메뉴는 페이지의 독립 실행형 그래픽 구성요소이므로 단일 DOM 요소에 입력하는 것이 좋습니다.

메뉴 항목 목록은 `ul/li`으로 배치할 수 있습니다.

다음은 구조 예시입니다.

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

타이틀로 `<span>`을 사용합니다. 그 이유는 `<div>`에는 암묵적으로 `display:block`가 포함되어 있기 때문에 가로 너비의 100%를 차지하기 때문이죠.

이렇게요.

```html autorun height=50
<div style="border: solid red 1px" onclick="alert(1)">Sweeties (click me)!</div>
```

따라서 `onclick`을 설정하면 텍스트 오른쪽에 클릭이 나타납니다.

`<span>`에는 암묵적으로 `display: inline`이 있으므로 모든 텍스트에 정확히 맞도록 충분한 공간을 차지합니다.

```html autorun height=50
<span style="border: solid red 1px" onclick="alert(1)">Sweeties (click me)!</span>
```

# 메뉴 토글 하기

메뉴를 토글 하면 화살표가 변경되고 메뉴 목록이 표시되거나·숨겨집니다.

이러한 모든 변경 사항들은 CSS에 의해 완벽하게 처리됩니다. 자바 스크립트에서 `.open`클래스를 추가·제거하여 메뉴의 현재 상태에 레이블을 지정해야 합니다.

레이블 지정이 없으면 메뉴가 닫힙니다.

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

`.open`을 사용하면 화살표가 변경되고 목록이 표시됩니다.

```css
.menu.open .title::before {
  content: '▼ ';
}

.menu.open ul {
  display: block;
}
```
