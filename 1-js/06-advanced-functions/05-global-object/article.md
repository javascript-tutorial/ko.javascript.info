
# 전역 개체

전역 개체는 어디에서나 사용할 수있는 변수 및 함수를 제공합니다. 대부분은 언어 나 호스트 환경에 내장되어 있습니다.

브라우저에서는 Node.JS의 경우 "window"로 이름이 지정되고 다른 환경의 경우에는 다른 이름을 가질 수 있습니다.

예를 들어`alert`를`window`의 메소드로 부를 수 있습니다 :

```js run
alert("Hello");

// the same as
window.alert("Hello");
```

우리는`Array.`와 같은 다른 내장 함수를`window.Array`로 참조 할 수 있고 그것에 우리 자신의 속성을 생성 할 수 있습니다.

## 브라우저 : "창"객체

역사적인 이유로, 브라우저 내`window` 객체는 다소 엉망입니다.

1. 글로벌 객체 역할을 수행하는 것 외에도 "브라우저 창"기능을 제공합니다.

     브라우저 창과 관련된 속성과 메서드에 액세스하기 위해`window`를 사용할 수 있습니다 :

    ```js run
    alert(window.innerHeight); // shows the browser window height

    window.open('http://google.com'); // opens a new browser window
    ```

2. 최상위`var` 변수와 함수 선언은 자동적으로`window`의 속성이됩니다.

    For instance:
    ```js untrusted run no-strict refresh
    var x = 5;

    alert(window.x); // 5 (var x becomes a property of window)

    window.x = 0;

    alert(x); // 0, variable modified
    ```

    현대의`let / const` 선언에서는 이런 일이 일어나지 않습니다.

    ```js untrusted run no-strict refresh
    let x = 5;

    alert(window.x); // undefined ("let" doesn't create a window property)
    ```

3. 또한 모든 스크립트는 동일한 전역 범위를 공유하므로 하나의`<script> '에 선언 된 변수는 다른 변수에서 볼 수있게됩니다 :

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

4. 그리고 사소한 일이지만 여전히 글로벌 범위에서`this`의 값은`window`입니다.

    ```js untrusted run no-strict refresh
    alert(this); // window
    ```

왜 이렇게 만들었습니까? 언어를 생성 할 때 여러 측면을 단일 '창'객체로 병합하는 아이디어는 "단순한 작업"이었습니다. 그러나 그 이후로 많은 것들이 변했습니다. 작은 스크립트는 적절한 아키텍처가 필요한 큰 응용 프로그램이되었습니다.

서로 다른 스크립트 (아마도 서로 다른 출처에서 온 것)가 서로의 변수를 보는 것이 좋습니까?

아니요, 이름 충돌을 일으킬 수 있기 때문에 아닙니다. 두 개의 스크립트에서 서로 다른 목적으로 동일한 변수 이름을 사용할 수 있으므로 서로 충돌합니다.

현재 다목적`윈도우 '는 언어의 디자인 실수로 간주됩니다.

다행히 "Javascript 모듈"이라는 "지옥의 길"이 있습니다.

`<script>`태그에`type = "module"속성을 설정하면, 그 스크립트는`window`와 간섭하지 않고 자체 최상위 범위 (어휘 환경)를 가진 별도의 "모듈"로 간주됩니다.

- 모듈에서`var x`는`window`의 속성이되지 않습니다 :

    ```html run
    <script type="module">
      var x = 5;

      alert(window.x); // undefined
    </script>
    ```

- 서로의 변수를 볼 수없는 두 개의 모듈 :

    ```html run
    <script type="module">
      let x = 5;
    </script>

    <script type="module">
      alert(window.x); // undefined
      alert(x); // Error: undeclared variable
    </script>
    ```

- 그리고 마지막으로 미성년자 인 모듈에서`this`의 최상위 값은`undefined '입니다 (어쨌든`window`가되어야하는 이유는 무엇입니까?) :

    ```html run
    <script type="module">
      alert(this); // undefined
    </script>
    ```

**Using `<script type="module">` fixes the design flaw of the language by separating top-level scope from `window`.**

We'll cover more features of modules later, in the chapter [](info:modules).

전역 객체의 유효 사용

1. 전역 변수를 사용하는 것은 일반적으로 권장되지 않습니다. 가능한 한 적은 전역 변수가 있어야하지만, 전역 적으로 무엇인가를 만들 필요가 있다면, 그것을 window (또는 Node.js의 global)에 넣을 수 있습니다.

     여기에서는 현재 사용자에 대한 정보를 다른 모든 스크립트에서 액세스 할 수있는 전역 객체에 넣습니다.

    ```js run
    // explicitly assign it to `window`
    window.currentUser = {
      name: "John",
      age: 30
    };

    // then, elsewhere, in another script
    alert(window.currentUser.name); // John
    ```

2. 현대적인 언어 기능을 지원하기 위해 전역 객체를 테스트 할 수 있습니다.

    For instance, test if a build-in `Promise` object exists (it doesn't in really old browsers):
    ```js run
    if (!window.Promise) {
      alert("Your browser is really old!");
    }
    ```

3. "polyfills"를 만들 수 있습니다 : 환경 (예 : 이전 브라우저)에서는 지원되지 않지만 현대 표준에는 존재하는 기능을 추가하십시오.

    ```js run
    if (!window.Promise) {
      window.Promise = ... // custom implementation of the modern language feature
    }
    ```

... 물론 우리가 브라우저에 있다면 브라우저 창 기능 (전역 개체가 아닌)에 액세스하기 위해`window '를 사용하면 완벽합니다.
