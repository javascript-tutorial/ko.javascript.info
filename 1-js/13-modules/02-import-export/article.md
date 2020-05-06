# 모듈 내보내고 가져오기

`export`와 `import` 지시자는 다양한 방식으로 활용됩니다.

이전 챕터에서는 `export`와 `import`의 기본적인 사용법을 알아보았는데, 이번 챕터에선 좀 더 다양한 사용법을 배워보겠습니다.

## 선언부 앞에 export 붙이기

변수나 함수, 클래스를 선언할 때 맨 앞에 `export`를 붙이면 내보내기가 가능합니다. 

아래 내보내기는 모두 유효합니다.

```js
// 배열 내보내기
*!*export*/!* let months = ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 상수 내보내기
*!*export*/!* const MODULES_BECAME_STANDARD_YEAR = 2015;

// 클래스 내보내기
*!*export*/!* class User {
  constructor(name) {
    this.name = name;
  }
}
```

````smart header="클래스나 함수를 내보낼 땐 세미콜론을 붙이지 마세요."
클래스나 함수 선언 시, 선언부 앞에 `export`를 붙인다고 해서 함수 선언 방식이 함수 선언문에서 [함수 표현식(function expression)](info:function-expressions) 으로 바뀌지 않습니다. 내보내 지긴 했지만 여전히 함수 선언문입니다.

대부분의 자바스크립트 스타일 가이드는 함수나 클래스 선언 끝에 세미콜론을 붙이지 말라고 권유합니다.

같은 이유로 `export class`나 `export function` 끝에 세미콜론을 붙이지 않습니다.

```js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
} *!* // 끝에 ;(세미콜론)을 붙이지 않습니다. */!*
```

````

## 선언부와 떨어진 곳에 export 붙이기

선언부와 `export`가 떨어져 있어도 내보내기가 가능합니다.

아래 예시에선 함수를 먼저 선언한 후, 마지막 줄에서 내보냅니다.

```js  
// 📁 say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

*!*
export {sayHi, sayBye}; // 두 함수를 내보냄
*/!*
```

참고로 `export`문을 함수 선언부 위에 적어주는 것도 동일하게 동작합니다.

## import *

무언갈 가져오고 싶다면 아래와 같이 이에 대한 목록을 만들어 `import {...}`안에 적어주면 됩니다.

```js
// 📁 main.js
*!*
import {sayHi, sayBye} from './say.js';
*/!*

sayHi('John'); // Hello, John!
sayBye('John'); // Bye, John!
```

가져올 것이 많으면 `import * as <obj>` 처럼 객체 형태로 원하는 것들을 가지고 올 수 있습니다. 예시를 살펴보겠습니다.

```js
// 📁 main.js
*!*
import * as say from './say.js';
*/!*

say.sayHi('John');
say.sayBye('John');
```

이렇게 '한꺼번에 모든 걸 가져오는 방식'을 사용하면 코드가 짧아집니다. 그런데도 어떤 걸 가져올 땐 그 대상을 구체적으로 명시하는 게 좋습니다.

이렇게 하는 데는 몇 가지 이유가 있습니다.

1. [웹팩(webpack)](http://webpack.github.io)과 같은 모던 빌드 툴은 로딩 속도를 높이기 위해 모듈들을 한데 모으는 번들링과 최적화를 수행합니다. 이 과정에서 사용하지 않는 리소스가 삭제되기도 합니다. 

    아래와 같이 프로젝트에 서드파티 라이브러리인 `say.js`를 도입하였다 가정합시다. 이 라이브러리엔 수 많은 함수가 있습니다.
    ```js
    // 📁 say.js
    export function sayHi() { ... }
    export function sayBye() { ... }
    export function becomeSilent() { ... }
    ```

    현재로선 `say.js`의 수 많은 함수 중 단 하나만 필요하기 때문에, 이 함수만 가져와 보겠습니다.
    ```js
    // 📁 main.js
    import {sayHi} from './say.js';
    ```
    빌드 툴은 실제 사용되는 함수가 무엇인지 파악해, 그렇지 않은 함수는 최종 번들링 결과물에 포함하지 않습니다. 이 과정에서 불필요한 코드가 제거되기 때문에 빌드 결과물의 크기가 작아집니다. 이런 최적화 과정은 '가지치기(tree-shaking)'라고 불립니다.

2. 어떤 걸 가지고 올지 명시하면 이름을 간결하게 써줄 수 있습니다. `say.sayHi()`보다 `sayHi()`가 더 간결하네요.
3. 어디서 어떤 게 쓰이는지 명확하기 때문에 코드 구조를 파악하기가 쉬워 리팩토링이나 유지보수에 도움이 됩니다.

## import 'as'

`as`를 사용하면 이름을 바꿔서 모듈을 가져올 수 있습니다.

`sayHi`를 `hi`로, `sayBye`를 `bye`로 이름을 바꿔서 가져와 봅시다. 

```js
// 📁 main.js
*!*
import {sayHi as hi, sayBye as bye} from './say.js';
*/!*

hi('John'); // Hello, John!
bye('John'); // Bye, John!
```

## Export 'as'

`export`에도 `as`를 사용할 수 있습니다.

`sayHi`와 `sayBye`를 각각 `hi`와 `bye`로 이름을 바꿔 내보내 봅시다.

```js
// 📁 say.js
...
export {sayHi as hi, sayBye as bye};
```

이제 다른 모듈에서 이 함수들을 가져올 때 이름은 `hi`와 `bye`가 됩니다.

```js
// 📁 main.js
import * as say from './say.js';

say.*!*hi*/!*('John'); // Hello, John!
say.*!*bye*/!*('John'); // Bye, John!
```

## export default

모듈은 크게 두 종류로 나뉩니다.

1. 복수의 함수가 있는 라이브러리 형태의 모듈(위 예시의 `say.js`)
2. 개체 하나만 선언되어있는 모듈(아래의 `user.js`. `class User` 하나만 내보내기 함)

대개는 두 번째 방식으로 모듈을 만드는 걸 선호하기 때문에 함수, 클래스, 변수 등의 개체는 전용 모듈 안에 구현됩니다.

그런데 이렇게 모듈을 만들다 보면 자연스레 파일 개수가 많아질 수밖에 없습니다. 그렇더라도 모듈 이름을 잘 지어주고, 폴더에 파일을 잘 나눠 프로젝트를 구성하면 코드 탐색이 어렵지 않으므로 이는 전혀 문제가 되지 않습니다.

모듈은 `export default`라는 특별한 문법을 지원합니다. `export default`를 사용하면 '해당 모듈엔 개체가 하나만 있다'는 사실을 명확히 나태낼 수 있습니다.

내보내고자 하는 개체 앞에 `export default`를 붙여봅시다.

```js
// 📁 user.js
export *!*default*/!* class User { // export 옆에 'default'를 추가해보았습니다.
  constructor(name) {
    this.name = name;
  }
}
```

파일 하나엔 대개 `export default`가 하나만 있습니다.

이렇게 `default`를 붙여서 모듈을 내보내면 중괄호 `{}` 없이 모듈을 가져올 수 있습니다.

```js
// 📁 main.js
import *!*User*/!* from './user.js'; // {User}가 아닌 User로 클래스를 가져왔습니다.

new User('John');
```

중괄호 없이 클래스를 가져오니 더 깔끔해 보이네요. 모듈을 막 배우기 시작한 사람은 중괄호를 빼먹는 실수를 자주 합니다. named export 한 모듈을 가져오려면 중괄호가 필요하고, default export 한 모듈을 가져오려면 중괄호가 필요하지 않다는 걸 기억해 실수를 방지합시다.

| named export | default export |
|--------------|----------------|
| `export class User {...}` | `export default class User {...}` |
| `import {User} from ...` | `import User from ...`|

사실 named export와 default export를 같은 모듈에서 동시에 사용해도 문제는 없습니다. 그런데 실무에선 이렇게 섞어 쓰는 사례가 흔치 않습니다. 한 파일엔 named export나 default export 둘 중 하나만 사용합니다.

파일당 최대 하나의 default export가 있을 수 있으므로 내보낼 개체엔 이름이 없어도 괜찮습니다.

아래 예시의 개체엔 이름이 없지만 모두 에러 없이 잘 동작합니다.

```js
export default class { // 클래스 이름이 없음
  constructor() { ... }
}
```

```js
export default function(user) { // 함수 이름이 없음
  alert(`Hello, ${user}!`);
}
```

```js
// 이름 없이 배열 형태의 값을 내보냄
export default ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
```

`export default`는 파일당 하나만 있으므로 이 개체를 가져오기 하려는 모듈에선 중괄호 없이도 어떤 개체를 가지고 올지 정확히 알 수 있으므로 이름이 없어도 괜찮습니다.

`default`를 붙이지 않았다면 개체에 이름이 없는 경우 에러가 발생합니다.

```js
export class { // 에러! (default export가 아닌 경우엔 이름이 꼭 필요합니다.)
  constructor() {}
}
```     

### 'default' name

`default` 키워드는 기본 내보내기를 참조하는 용도로 종종 사용됩니다.

함수를 내보낼 때 아래와 같이 함수 선언부와 떨어진 곳에서 `default` 키워드를 사용하면, 해당 함수를 기본 내보내기 할 수 있습니다.

```js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// 함수 선언부 앞에 'export default'를 붙여준 것과 동일합니다.
export {sayHi as default};
```

흔치 않지만 `user.js`라는 모듈에 'default' export 하나와 다수의 named export가 있다고 해봅시다.

```js
// 📁 user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
```

아래와 같은 방식을 사용하면 default export와 named export를 동시에 가져올 수 있습니다.

```js
// 📁 main.js
import {*!*default as User*/!*, sayHi} from './user.js';

new User('John');
```

`*` 를 사용해 모든 것을 객체 형태로 가져오는 방법도 있는데, 이 경우엔 `default` 프로퍼티는 정확히 default export를 가리킵니다.

```js
// 📁 main.js
import * as user from './user.js';

let User = user.default; // default export
new User('John');
```

### default export의 이름에 관한 규칙

named export는 내보냈을 때 사용한 이름 그대로 가져오므로 관련 정보를 파악하기 쉽습니다.

그런데 아래와 같이 내보내기 할 때 쓴 이름과 가져오기 할 때 쓸 이름이 동일해야 한다는 제약이 있죠.

```js
import {User} from './user.js';
// import {MyUser}은 사용할 수 없습니다. 반드시 {User}이어야 합니다.
```

named export와는 다르게 default export는 가져오기 할 때 개발자가 원하는 대로 이름을 지정해 줄 수 있습니다.

```js
import User from './user.js'; // 동작
import MyUser from './user.js'; // 동작
// 어떤 이름이든 에러 없이 동작합니다.
```

그런데 이렇게 자유롭게 이름을 짓다 보면 같은 걸 가져오는데도 이름이 달라 혼란의 여지가 생길 수 있습니다.

이런 문제를 예방하고 코드의 일관성을 유지하기 위해 default export 한 것을 가져올 땐 아래와 같이 파일 이름과 동일한 이름을 사용하도록 팀원끼리 내부 규칙을 정할 수 있습니다.

```js
import User from './user.js';
import LoginForm from './loginForm.js';
import func from '/path/to/func.js';
...
```

그런데 규칙이 있어도 이를 지키지 않는 사람이 있을 수 있기 때문에 어떤 팀은 named export만 사용할 것을 강제하는 경우도 있습니다. 모듈 하나에서 단 하나의 개체만 내보내는 경우에도 `default` 없이 이름을 붙여 내보내면 혼란을 방지할 수 있기 때문이죠.

이런 규칙은 아래에서 배울 모듈 다시 내보내기를 쉽게 해준다는 장점도 있습니다.

## 모듈 다시 내보내기

`export ... from ...` 문법을 사용하면 가져온 개체를 즉시 '다시 내보내기(re-export)' 할 수 있습니다. 이름을 바꿔서 다시 내보낼 수 있는 것이죠. 예시를 살펴봅시다. 

```js
export {sayHi} from './say.js'; // sayHi를 다시 내보내기 함

export {default as User} from './user.js'; // default export를 다시 내보내기 함
```

다시 내보내기가 왜 필요한건지 의문이 드실 겁니다. 유스 케이스를 통해 다시 내보내기가 실무에서 언제 사용되는지 알아봅시다.

NPM을 통해 외부에 공개할 '패키지(package)'를 만들고 있다고 가정합시다. 이 패키지는 수많은 모듈로 구성되어있는데, 몇몇 모듈은 외부에 공개할 기능을, 몇몇 모듈은 이러한 모듈을 도와주는 '헬퍼' 역할을 담당하고 있다고 합시다.

패키지 구조는 아래와 같습니다.
```
auth/
    index.js  
    user.js
    helpers.js
    tests/
        login.js
    providers/
        github.js
        facebook.js
        ...
```

진입점 역할을 하는 '주요 파일'인 `auth/index.js`을 통해 기능을 외부에 노출시키면 이 패키지를 사용하는 개발자들은 아래와 같은 코드로 해당 기능을 사용할 겁니다.

```js
import {login, logout} from 'auth/index.js'
```

이때 우리가 만든 패키지를 사용하는 외부 개발자가 패키지 안의 파일들을 뒤져 내부 구조를 건드리게 하면 안 됩니다. 그러려면 공개할 것만 `auth/index.js`에 넣어 내보내기 하고 나머는 숨기는 게 좋겠죠. 

이때 내보낼 기능을 패키지 전반에 분산하여 구현한 후, `auth/index.js`에서 이 기능들을 가져오고 이를 다시 내보내면 원하는 바를 어느 정도 달성할 수 있습니다.

```js
// 📁 auth/index.js

// login과 logout을 가지고 온 후 바로 내보냅니다.
import {login, logout} from './helpers.js';
export {login, logout};

// User를 가져온 후 바로 내보냅니다.
import User from './user.js';
export {User};
...
```

이제 외부 개발자들은 `import {login} from "auth/index.js"`로 우리가 만든 패키지를 이용할 수 있습니다.

`export ... from ...`는 위와 같이 개체를 가지고 온 후 바로 내보낼 때 쓸 수 있는 문법입니다. 아래 예시는 위 예시와 동일하게 동작합니다.

```js
// 📁 auth/index.js
// login과 logout을 가지고 온 후 바로 내보냅니다.
export {login, logout} from './helpers.js';

// User 가져온 후 바로 내보냅니다.
export {default as User} from './user.js';
...
```

### default export 다시 내보내기

기본 내보내기를 다시 내보낼 때는 주의해야 할 점들이 있습니다.

`user.js` 내의 클래스 `User`를 다시 내보내기 한다고 가정해 봅시다.

```js
// 📁 user.js
export default class User {
  // ...
}
```

1. `User`를 `export User from './user.js'`로 다시 내보내기 할 때 문법 에러가 발생합니다. 어디가 잘못된 걸까요?

    default export를 다시 내보내려면 위 예시처럼 `export {default as User}`를 사용해야 합니다.

2. `export * from './user.js'`를 사용해 모든 걸 한 번에 다시 내보내면 default export는 무시되고, named export만 다시 내보내집니다.

    두 가지를 동시에 다시 내보내고 싶다면 두 문을 동시에 사용해야 합니다.
    ```js
    export * from './user.js'; // named export를 다시 내보내기
    export {default} from './user.js'; // default export를 다시 내보내기
    ```

default export를 다시 내보낼 땐 이런 특이한 상황도 인지하고 있다가 처리해줘야 하므로 몇몇 개발자들은 default export를 다시 내보내는것을 선호하지 않습니다.

## 요약

지금까지 배운 `export` 타입을 다시 한번 살펴봅시다.

아래 타입들을 쭉 보고 얼마나 기억하는지 체크해 보세요.

- 클래스, 함수 등의 선언부 앞에 export 붙여서 내보내기:
  - `export [default] class/function/variable ...`
- 이름 없는 개체 내보내기:
  - `export {x [as y], ...}`.
- 다시 내보내기:
  - `export {x [as y], ...} from "module"`
  - `export * from "module"` (default export는 다시 내보내 지지 않음)
  - `export {default [as y]} from "module"` (default export를 다시 내보냄)

가져오기 타입 역시 정리해 봅시다.

- named export 가져오기:
  - `import {x [as y], ...} from "mod"`
- default export 가져오기:
  - `import x from "mod"`
  - `import {default as x} from "mod"`
- 한 번에 가져오기:
  - `import * as obj from "mod"`
- 모듈을 가져오긴 하지만(코드는 실행됨), 변수에 할당하지 않기:
  - `import "mod"`

`import/export` 문은 스크립트의 맨 위나 맨 아래에 올 수 있는데 이 둘엔 차이가 없습니다.

따라서 아래 스크립트는 문제없이 잘 동작합니다.
```js
sayHi();

// ...

import {sayHi} from './say.js'; // import 문을 파일 맨 아래에 위치시킴
```

대개는 편의상 스크립트 맨 위에 import 문을 위치시킵니다.

**import/export 문은 블록 `{...}`안에선 동작하지 않는다는 점에 유의하시길 바랍니다.**

조건을 충족하면 모듈을 가져오려는 의도로 작성된 아래 코드는 동작하지 않습니다.
```js
if (something) {
  import {sayHi} from "./say.js"; // 에러: import 문은 최상위 레벨에 위치해야 합니다.
}
```

그런데 애플리케이션을 작성하다 보면 조건에 따라 모듈을 가져와야 하거나 어떤 특정 시점에 모듈을 불러와야 하는 경우가 생깁니다. 이럴 땐 어떤 방법을 사용해야 할까요? 요청이 있을 때만 모듈을 불러오는 게 가능할까요?

동적으로 모듈을 가져오는 방법(dynamic import)은 다음 챕터에서 알아보도록 하겠습니다.
