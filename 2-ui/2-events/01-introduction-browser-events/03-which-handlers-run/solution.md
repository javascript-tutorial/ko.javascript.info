해답: `1` 과 `2`

첫 번째 핸들러는 `removeEventListener`에 의해 제거되지 않았기 때문에 트리거 됩니다. 핸들러를 제거하려면 할당된 함수를 정확히 전달해야 합니다. 그리고 코드에 새로운 함수가 전달되는데, 이 함수는 똑같아 보이지만 다른 함수입니다.

함수 객체를 제거하려면 다음과 같이 참조를 저장해야 합니다.

```js
function handler() {
  alert(1);
}

button.addEventListener("click", handler);
button.removeEventListener("click", handler);
```

`button.onclick`핸들러는 `addEventListener`와 함께 독립적으로 작동합니다.
