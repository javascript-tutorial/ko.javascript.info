
1. 셀 클릭 시 셀의 `innerHTML`을 `<textarea>`로 교체합니다. 이때 기존 `<textarea>`는 기존 셀의 크기와 같고, 테두리(border)가 없습니다. 크기 지정엔 자바스크립트를 사용해도 되고, CSS를 사용해도 됩니다.
2. `textarea.value`를 `td.innerHTML`과 같게 설정합니다.
3. textarea에 포커스를 줍니다.
4. 셀 아래에 완료, 취소 버튼을 보여주고, 버튼에 적절한 핸들러를 달아줍니다.