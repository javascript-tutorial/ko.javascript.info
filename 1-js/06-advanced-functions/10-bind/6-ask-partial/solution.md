

1. 래퍼 함수나 화살표 함수를 사용하면 간결하게 원하는 기능을 구현할 수 있습니다.

    ```js 
    askPassword(() => user.login(true), () => user.login(false)); 
    ```

    이 방법을 사용하면 askPassword는 외부 변수에서 `user`를 가져오기 때문에 원하는 결과를 얻을 수 있습니다.

2. 컨텍스트가 `user`이면서 올바른 첫 번째 인수가 있는 부분 적용 함수를 만들면 원하는 기능을 구현할 수 있습니다.


    ```js 
    askPassword(user.login.bind(user, true), user.login.bind(user, false)); 
    ```
