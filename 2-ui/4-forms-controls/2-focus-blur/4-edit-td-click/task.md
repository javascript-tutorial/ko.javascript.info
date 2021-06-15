importance: 5

---

# 클릭해서 TD 수정하기

셀을 클릭하면 해당 셀을 수정할 수 있게 해주는 테이블을 만들어보세요.

<<<<<<< HEAD
- 셀 클릭 시 셀 안에 textarea가 나타나면서 셀에 들어 있는 콘텐츠(HTML)를 '수정'할 수 있어야 합니다. 이때 textarea 크기는 기존 cell 크기와 같아야 합니다.
- 셀 수정 시 셀 아래쪽에 '완료'와 '취소' 버튼이 노출되도록 하고, 각 버튼을 누르면 수정이 종료, 취소될 수 있게 합니다.
- 한 번에 하나의 셀만 수정할 수 있어야 합니다. `<td>`가 '수정 중'일 때는 다른 셀을 눌러도 클릭 이벤트가 무시되어야 합니다.
- 테이블엔 더 많은 셀이 추가될 수 있으므로 이벤트 위임을 사용하세요.
=======
- On click -- the cell should become "editable" (textarea appears inside), we can change HTML. There should be no resize, all geometry should remain the same.
- Buttons OK and CANCEL appear below the cell to finish/cancel the editing.
- Only one cell may be editable at a moment. While a `<td>` is in "edit mode", clicks on other cells are ignored.
- The table may have many cells. Use event delegation.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

데모:

[iframe src="solution" height=400]
