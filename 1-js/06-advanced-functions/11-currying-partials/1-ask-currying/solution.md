

1. 래퍼 (wrapper) 함수를 사용하거나 간결하게 화살표 함수를 사용할 수 있습니다.

    ```js 
    askPassword(() => user.login(true), () => user.login(false)); 
    ```

    이제 `user`를 외부 변수로 부터 받고 askPassword 함수는 정상적으로 작동할 것입니다.

2. 아니면 `user.login`으로 부터 partial 함수를 만들어서 `user`를 컨텍스트로 사용하고 변형된 함수가 올바른 첫 번째 인수를 갖도록 해도 됩니다.


    ```js 
    askPassword(user.login.bind(user, true), user.login.bind(user, false)); 
    ```
