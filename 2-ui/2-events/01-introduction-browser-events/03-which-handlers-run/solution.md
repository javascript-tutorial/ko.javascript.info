정답: `1`과 `2`가 얼럿 창에 표시됩니다. 

`removeEventListener`가 있지만 첫 번째 핸들러는`removeEventListener`에 의해 지워지지 않았기 때문에 트리거됩니다. 핸들러를 삭제하려면 핸들러 할당 시 사용한 함수를 그대로 전달해주어야 합니다. `removeEventListener`에 첫 번째 핸들러의 함수와 똑같이 생긴 함수를 전달했지만, 엄연히 다른 함수이기 때문에 `removeEventListener`를 사용해도 첫 번째 이벤트 핸들러는 지워지지 않습니다.

이미 등록한 핸들러 함수를 삭제하려면 다음과 같이 함수에 대한 참조를 저장해야 합니다.

```js
function handler() {
  alert(1);
}

button.addEventListener("click", handler);
button.removeEventListener("click", handler);
```

핸들러 `button.onclick`은 독립적으로 동작합니다. 따라서 `addEventListener`와 함께 동작하였습니다.
