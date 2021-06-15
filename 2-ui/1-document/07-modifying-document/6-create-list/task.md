importance: 4

---

# 리스트 생성하기

사용자로부터 값을 입력받아 리스트를 생성하는 인터페이스를 만들어 보세요.

리스트의 모든 요소는 아래 방법으로 생성합니다.

<<<<<<< HEAD
1. `prompt`를 사용해 사용자로부터 리스트의 내용을 입력받습니다.
2. 1번에서 입력받은 내용을 갖는 `<li>` 를 생성한 후 `<ul>` 에 추가합니다.
3. 사용자가 입력을 취소할 때까지 계속합니다 (`ESC` 키나 프롬프트 창의 취소 버튼을 누를 때까지).
=======
1. Ask a user about its content using `prompt`.
2. Create the `<li>` with it and add it to `<ul>`.
3. Continue until the user cancels the input (by pressing `key:Esc` or via an empty entry).
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

모든 요소는 동적으로 생성되어야 합니다.

사용자가 HTML 태그를 입력하더라도 텍스트로 처리되어야 합니다.

[demo src="solution"]
