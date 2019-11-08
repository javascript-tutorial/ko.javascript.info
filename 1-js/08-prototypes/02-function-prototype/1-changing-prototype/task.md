importance: 5

---

# "prototype" 변경하기

아래 코드에선 `new Rabbit`를 만들고 `Rabbit`의 `"prototype"`을 변겅합니다.

시작 코드는 다음과 같습니다.

```js run
function Rabbit() {}
Rabbit.prototype = {
  eats: true
};

let rabbit = new Rabbit();

alert( rabbit.eats ); // true
```


1. 아래와 같은 코드를 추가(강조된 줄)하면 얼럿창엔 무엇이 출력될까요?

    ```js
    function Rabbit() {}
    Rabbit.prototype = {
      eats: true
    };

    let rabbit = new Rabbit();

    *!*
    Rabbit.prototype = {};
    */!*

    alert( rabbit.eats ); // ?
    ```

2. 아래와 같이 코드를 변경하면 얼럿창엔 무엇이 출력될까요?

    ```js
    function Rabbit() {}
    Rabbit.prototype = {
      eats: true
    };

    let rabbit = new Rabbit();

    *!*
    Rabbit.prototype.eats = false;
    */!*

    alert( rabbit.eats ); // ?
    ```

3. 아래와 같이 `delete`를 사용하면 얼럿창엔 무엇이 출력될까요?

    ```js
    function Rabbit() {}
    Rabbit.prototype = {
      eats: true
    };

    let rabbit = new Rabbit();

    *!*
    delete rabbit.eats;
    */!*

    alert( rabbit.eats ); // ?
    ```

4. 마지막 코드를 실행하면 얼럿창엔 무엇이 출력될까요?

    ```js
    function Rabbit() {}
    Rabbit.prototype = {
      eats: true
    };

    let rabbit = new Rabbit();

    *!*
    delete Rabbit.prototype.eats;
    */!*

    alert( rabbit.eats ); // ?
    ```
