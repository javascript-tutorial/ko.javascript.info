importance: 5

---

# Finally 아니면 코드만?

두 코드 프래그먼츠를 비교해보세요.

1. 첫 번째 프래그먼츠는 `try..catch` 이후에 코드를 실행하기 위해 `finally`를 사용하였습니다.

    ```js
    try {
      work work
    } catch (e) {
      handle errors
    } finally {
    *!*
      cleanup the working space
    */!*
    }
    ```
2. 두 번째 프래그먼트는 cleaning을 `try..catch` 직후에 놓았습니다.

    ```js
    try {
      work work
    } catch (e) {
      handle errors
    }

    *!*
    cleanup the working space
    */!*
    ```

에러의 유무와 상관없이, 작업 후에는 cleanup이 필요합니다.

`finally`를 사용한 것이 이점이 있나요? 아니면 두 코드 프래그먼트가 동등한가요? 만약 이점이 있다면, 중요한
예를 들어보세요.
