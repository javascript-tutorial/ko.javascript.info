
버튼을 추가하려면 `position:absolute` (그리고 패널 `position:relative` 만들기) 과 `float:right` 중 하나를 사용할 수 있습니다. `float:right`는 버튼이 텍스트와 겹치지 않는다는 장점이 있지만 `position:absolute` 은 조금 더 자유롭게 배치할 수 있습니다. 어떤 것을 사용할지 선택해 주세요.

각 패널의 코드는 다음과 같을 수 있습니다.
```js
pane.insertAdjacentHTML("afterbegin", '<button class="remove-button">[x]</button>');
```

그러면 `<button>` 이 `pane.firstChild`가 되므로 다음과 같이 핸들러를 추가할 수 있습니다.

```js
pane.firstChild.onclick = () => pane.remove();
```
