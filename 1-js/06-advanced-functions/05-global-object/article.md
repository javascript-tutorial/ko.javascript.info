
# 전역 개체

전역 개체는 어디에서나 사용할 수 있는 변수 및 함수를 제공합니다. 대부분 언어나 호스트 환경에 내장되어 있습니다.

Node.js의 경우 브라우저에서는 "window" 라는 이름이고 다른 환경의 경우에는 다른 이름을 가질 수 있습니다.

예를 들면, `alert` 를 `window` 의 메서드로 부를 수 있다는 것입니다.

```js run
alert("Hello");

// the same as
window.alert("Hello");
```

`Array` 와 같은 다른 내장 함수를 `window.Array` 로 참조할 수 있고 속성을 생성할 수 있습니다.

## 브라우저 : "윈도우(window)"객체

역사적으로, 브라우저 안에서 `window` 객체는 다소 엉망입니다.

1. 글로벌 객체 역할을 수행하는 것 이외에도 "브라우저의 창" 기능을 제공하기 때문입니다.

     브라우저 창과 관련된 속성과 메서드에 액세스하기 위해 `window`를 사용할 수 있습니다.

    ```js run
    alert(window.innerHeight); // 브라우저 창 높이를 보여줍니다

    window.open('http://google.com'); // 새 브라우저 창을 엽니다
    ```

2. 최상위 `var` 변수와 함수 선언은 자동으로 `window`의 속성입니다.

    예를들면
    ```js untrusted run no-strict refresh
    var x = 5;

    alert(window.x); // 5 (var x 가 윈도우의 속성이다)

    window.x = 0;

    alert(x); // 0, 변수가 수정되었음
    ```

    현대적인 `let/const` 에서는 이런현상이 일어나지 않는것을 주의하세요.

    ```js untrusted run no-strict refresh
    let x = 5;

    alert(window.x); // undefined ("let" 은 윈도우의 속성으로 생성되지 않습니다)
    ```

3. 모든 스크립트는 동일한 전역 범위(global scope)를 공유하므로 하나의 변수가 다른 `<script>` 에서 볼 수 있게 됩니다 

    ```html run
    <script>
      var a = 1;
      let b = 2;
    </script>

    <script>
      alert(a); // 1
      alert(b); // 2
    </script>
    ```

4. `this` 는 전역 범위에서 볼때 `window` 입니다.

    ```js untrusted run no-strict refresh
    alert(this); // window
    ```

왜 이렇게 만들었을까요. 자바스크립트가 고안될때 여러 측면을 한가지 `window` 객체로 병합하는 아이디어는 "단순화 하기위한 작업" 이었습니다. 그런데 그 이후로 많은 것들이 변했습니다. 작은 스크립트는 적절한 아키텍처가 필요한 큰 응용 프로그램이 되어버렸죠.

서로 다른 스크립트(다른 출처에서 온 것)가 서로의 다른 변수를 보는 것이 좋을까요.

이름 충돌을 일으킬 수 있기 때문이 아닙니다. 두 개의 스크립트에서 동일한 변수 이름을 다른 목적으로 사용할 수 있으므로 서로 충돌합니다.

현재 다목적으로 제작된 `window` 객체는 언어의 디자인 실수로 간주하고 있습니다.

다행히, "자바스크립트 모듈" 이라는 해결방법이 있습니다.

`<script>` 태그에 `type = "module"` 속성을 설정하면, 그 스크립트는 `window` 객체와 간섭하지 않고 자체적으로 최상위 범위(렉시컬 환경)를 가진 별도의 "모듈"로 간주합니다.

- 모듈에서 `var x`는 `window`의 속성이되지 않습니다.

    ```html run
    <script type="module">
      var x = 5;

      alert(window.x); // undefined
    </script>
    ```

- 서로의 변수를 볼 수없는 두 개의 모듈.

    ```html run
    <script type="module">
      let x = 5;
    </script>

    <script type="module">
      alert(window.x); // undefined
      alert(x); // 에러: 선언되지않은 변수
    </script>
    ```

- 여기서 `this`의 최상위 값은 `undefined` 입니다 (어쨌든 `window`가 되어야 하는 이유는 없습니다).

    ```html run
    <script type="module">
      alert(this); // undefined
    </script>
    ```

**`<script type="module">`을 사용하는 것은 최상위 범위에서 분리하여 `window` 객체로 인한 자바스크립트의 디자인 결함을 수정할 수 있습니다.**

나중에 [모듈](info:modules) 챕터에서 더 많은 기능을 다루겠습니다.

# 전역 객체의 유효한 사용

1. 전역 변수를 사용하는 것은 일반적으로 권장하지 않습니다. 가능한 한 적은 전역 변수가 있는것이 좋지만, 전역적으로 무엇인가 필요하다면, 그것을 window (또는 Node.js 의 전역)에 넣는 것이 좋습니다.

     다음예제는 현재 사용자에 대한 정보를 다른 모든 스크립트에서 접근할 수 있는 전역 객체에 넣습니다.

    ```js run
    // `window` 에 명시적으로에 할당
    window.currentUser = {
      name: "John",
      age: 30
    };

    // 그러면, 다른스크립트에서 사용할 수 있습니다
    alert(window.currentUser.name); // John
    ```

2. 현대적인 자바스크립트 기능을 지원하기 위해 전역 객체를 테스트할 수 있습니다.

     예를 들면 build-in`Promise` 객체가 존재하는지 테스트해보세요. (정말로 오래된 브라우저에는 존재하지 않습니다)
    ```js run
    if (!window.Promise) {
      alert("Your browser is really old!");
    }
    ```

3. "폴리필"을 만들 수 있습니다. 사용자환경 (이전 브라우저)에서는 지원되지 않지만, 최신표준에는 존재하는 기능을 추가해보세요.

    ```js run
    if (!window.Promise) {
      window.Promise = ... // 최신 자바스크립트 기능의 맞춤 구현
    }
    ```

... 물론 브라우저에서 작업한다면, 브라우저 창 기능 (전역 개체가 아닌)에 접근하기 위해 `window` 를 사용하는건 괜찮은 방법입니다.
