importance: 5

---

# Finally 아니면 코드만?

두 코드 조각을 비교해보세요.

1. 첫 번째 코드 조각은 `try..catch` 이후에 코드를 실행하기 위해 `finally`를 사용하였습니다.

    ```js
    try {
      work work
    } catch (e) {
      handle errors
    } finally {
    *!*
      작업 내역 삭제
    */!*
    }
    ```
2. 두 번째 코드 조각에선 `try..catch` 바로 아래에 작업 내역을 삭제하는 코드를 놓았습니다.

    ```js
    try {
      work work
    } catch (e) {
      handle errors
    }

    *!*
    작업 내역 삭제
    */!*
    ```

에러의 유무와 상관없이, 작업 후에는 초기화가 필요합니다.

`finally`를 사용하면 이점이 있을까요? 아니면 두 코드 조각은 동일하게 동작할까요? 만약 이점이 있다면, 이점이 드러나는 예시를 제시해 주세요.
