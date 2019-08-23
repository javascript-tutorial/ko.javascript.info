# 모듈 내보내고 가져오기

Export and import directives have several syntax variants.

이전 챕터에서는 두 지시자의 기본적인 사용법을 알아보았는데, 이번 챕터에선 좀 더 다양한 용례를 살펴보도록 하겠습니다.

## 선언부 앞의 export

변수나 함수, 클래스를 선언할 때, 맨 앞에 `export`를 붙이면 내보내기가 가능합니다. 

아래는 모두 유효한 내보내기입니다.

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

````smart header="클래스나 함수를 내보낼 때, 세미콜론을 붙이지 않아도 됩니다."
클래스나 함수 선언 시, 앞에 `export`를 붙인다고 해서 선언 방식이 바뀌진 않습니다. `export`가 앞에 붙는다고 해서 함수 선언문이 [함수 표현식(function expression)](info:function-expressions-arrows) 으로 바뀌지 않죠.

대부분의 자바스크립트 스타일 가이드에선 함수 끝이나 클래스를 선언시 세미콜론을 붙이지 말라고 권유합니다.

같은 이유로 `export class`나 `export function` 끝에 세미콜론을 붙이지 않습니다.

```js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
} *!* // 끝에 ;(세미콜론)을 붙이지 않습니다. */!*
```

````

## 선언부와 떨어진 export

선언부와 `export`가 떨어져 있어도 내보내기가 가능합니다.

아래 예제에선 함수를 먼저 선언한 후, 마지막 줄에서 내보내기를 하고있습니다.

```js  
// 📁 say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

*!*
export {sayHi, sayBye}; // 내보내려는 변수들(두 함수)
*/!*
```

함수 선언부 바로 윗줄에 `export`를 적어주는 것 또한 기술적으론 가능합니다.

## Import *

무언갈 임포트할 땐, 가져올 것들에 대한 목록을 만들어 `import {...}`안에 적어줍니다. 아래와 같이 말이죠.

```js
// 📁 main.js
*!*
import {sayHi, sayBye} from './say.js';
*/!*

sayHi('John'); // Hello, John!
sayBye('John'); // Bye, John!
```

가져올 것이 많으면, `import * as <obj>`를 사용해 객체 형태로 원하는 것들을 가지고 올 수 있습니다. 예시를 살펴보겠습니다.

```js
// 📁 main.js
*!*
import * as say from './say.js';
*/!*

say.sayHi('John');
say.sayBye('John');
```

처음엔, "한꺼번에 모든 걸 가져오기"가 아주 끝내주는 기능같이 보일 수 있습니다. 코드가 짧아지니까 말이죠. 이런 좋은 기능이 있는데도, 왜 우리는 어떤 걸 임포트 할지 구체적으로 명시해야 하는 걸까요? 

몇 가지 이유가 있습니다.

1. [웹팩(webpack)](http://webpack.github.io) 등의 모던 빌드 툴들은 로딩 속도를 높이기 위해 모듈들을 한데 모으는 번들링과 최적화를 수행합니다. 사용하지 않는 것들도 삭제해 주죠. 

    아래와 같이 수많은 함수가 있는 서드파티 라이브러리인 `say.js`를 프로젝트에 도입하였다 가정합시다.
    ```js
    // 📁 say.js
    export function sayHi() { ... }
    export function sayBye() { ... }
    export function becomeSilent() { ... }
    ```

    현재로선 `say.js`의 함수 중 단 하나만 필요하기 때문에, 이 함수만 임포트 합니다.
    ```js
    // 📁 main.js
    import {sayHi} from './say.js';
    ```
    빌드 툴은 프로젝트에서 실제 사용하고 있는 함수가 무엇인지 알아내고, 사용하지 않는 함수는 최종 번들링 결과물에서 제거합니다. 사용하지 않는 코드가 제거되기 때문에 빌드 결과물의 크기가 작아지죠. 이런 최적화 과정을 "가지치기(tree-shaking)"라고 부릅니다.

2. 어떤걸 임포트 할지 명시하면, 코드가 짧아집니다. `say.sayHi()`보다 `sayHi()`가 더 간결하죠.
3. 어디서 어떤게 쓰이는지 명확하기 때문에, 코드 구조가 눈에 더 잘 들어옵니다. 따라서 리팩토링이나 유지보수가 좀 더 쉬워집니다.

## Import "as"

`as`를 사용하면 이름을 바꿔서 임포트 할 수 있습니다.

아래는 `sayHi`를 `hi`로, `sayBye`를 `bye`로 이름을 바꿔서 사용하고 있는 예제입니다. 

```js
// 📁 main.js
*!*
import {sayHi as hi, sayBye as bye} from './say.js';
*/!*

hi('John'); // Hello, John!
bye('John'); // Bye, John!
```

## Export "as"

`export`에도 `as`를 사용할 수 있습니다.

기존 함수를 `hi`와 `bye`로 이름을 바꾸어 내보내봅시다.

```js
// 📁 say.js
...
export {sayHi as hi, sayBye as bye};
```

이제 다른 모듈에서 이 함수들을 임포트할 때 이름은 `hi`와 `bye`가 됩니다.

```js
// 📁 main.js
import * as say from './say.js';

say.*!*hi*/!*('John'); // Hello, John!
say.*!*bye*/!*('John'); // Bye, John!
```

## export default

In practice, there are mainly two kinds of modules.

1. Module that contains a library, pack of functions, like `say.js` above.
2. Module that declares a single entity, e.g. a module `user.js` exports only `class User`.

대게는 두 번째 방법을 선호하기 때문에, 한 모듈 안에 개체의 "모든 것"이 들어가게 됩니다. 

이렇게 모듈을 구성하다 보면 무언 갈 하나 만들 때마다 모듈 하나를 만들어야 하므로, 프로젝트 내 파일이 많아질 수밖에 없습니다. 이름을 잘 지어주고, 폴더로 파일을 잘 나눠 프로젝트를 구성하면 되기 때문에, 이는 문제가 되지 않습니다.

Modules provide special `export default` ("the default export") syntax to make "one thing per module" way look better.

Put `export default` before the entity to export:

```js
// 📁 user.js
export *!*default*/!* class User { // export 옆에 "default"를 붙여주었습니다. 
  constructor(name) {
    this.name = name;
  }
}
```

There may be only one `export default` per file.

...And then import it without curly braces:

```js
// 📁 main.js
import *!*User*/!* from './user.js'; // 중괄호 없이, User 클래스를 가져왔습니다.

new User('John');
```

중괄호 없이 클래스를 가져오니 더 깔끔해 보이네요. 모듈을 처음 접한 사람은 중괄호를 빼먹는 실수를 자주 합니다. Named export를 `import`할 때는 에는 중괄호가 필요하고, default `import`할 때는 중괄호가 필요하지 않는다는 걸 기억해 실수를 방지합시다. 

| Named export | Default export |
|--------------|----------------|
| `export class User {...}` | `export default class User {...}` |
| `import {User} from ...` | `import User from ...`|

Technically, we may have both default and named exports in a single module, but in practice people usually don't mix them. A module has either named exports or the default one.

As there may be at most one default export per file, the exported entity may have no name.

아래의 내보내기들은 이름이 없지만 모두 에러 없이 잘 동작합니다.

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
// 이름 없이, 배열 형태의 값 하나를 내보냄
export default ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
```

Not giving a name is fine, because `export default` is only one per file, so `import` without curly braces knows what to import.

Without `default`, such export would give an error:

```js
export class { // 에러! (default export가 아닌경우엔 이름이 꼭 필요합니다.)
  constructor() {}
}
```     

### The "default" name

In some situations the `default` keyword is used to reference the default export.

For example, to export a function separately from its definition:

```js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// same as if we added "export default" before the function
export {sayHi as default};
```

Or, another situation, let's say a module `user.js` exports one main "default" thing and a few named ones (rarely the case, but happens):

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

이 경우, 어떻게 default export 한 것과 named export 한 것을 동시에 가져올 수 있는지 알아봅시다.

```js
// 📁 main.js
import {*!*default as User*/!*, sayHi} from './user.js';

new User('John');
```

And, finally, if importing everything `*` as an object, then the `default` property is exactly the default export:

```js
// 📁 main.js
import * as user from './user.js';

let User = user.default; // the default export
new User('John');
```

### A word agains default exports

named export는 내보냈을 때 이름을 그대로 사용해 가져와야 합니다. 변경의 여지가 없죠. 

이름이 바뀌지 않기 때문에, 어디서 어떤 것이 내보내 졌는지에 관한 정보를 한눈에 파악하기도 쉽습니다.

```js
import {User} from './user.js';
// import {MyUser}은 동작하지 않습니다. 이름은 반드시 {User}이어야 합니다.
```

반면 default export는 가져오기 할 때, 개발자가 이름을 선택해 주어야 합니다.

```js
import User from './user.js'; // 동작
import MyUser from './user.js'; // 동작
// 어떤 이름이든 에러 없이 동작합니다.
```

So team members may use different names to import the same thing, and that's not good.

이런 문제를 피하고 코드의 일관성을 유지하기 위해, default export 한 것을 가져올 땐 아래와 같이 파일 이름을 이용하여 이름을 부여합니다.

```js
import User from './user.js';
import LoginForm from './loginForm.js';
import func from '/path/to/func.js';
...
```

Still, some teams consider it a serous drawback of default exports. So they prefer to always use named exports. Even if only a single thing is exported, it's still exported under a name, without `default`.

이렇게 하면 다시 내보내기(re-export)가 수월해진다는 장점도 있습니다.

## 다시 내보내기

`export ... from ...` 문법을 사용해 "다시 내보내기(re-export)" 하면 무언가를 가져온 즉시 내보낼 수 있습니다. 이름을 바꿔서 즉시 내보내는 것도 가능하죠. 예시를 통해 알아봅시다. 

```js
export {sayHi} from './say.js'; // re-export sayHi

export {default as User} from './user.js'; // re-export default
```

이걸 어디에 활용할지 아직 감이 오지 않으셨을 겁니다. 유스 케이스를 통해 실무에서 다시 내보내기가 언제 사용되는지 알아봅시다.

Imagine, we're writing a "package": a folder with a lot of modules, with some of the functionality exported outside (tools like NPM allow to publish and distribute such packages), and many modules are just "helpers", for the internal use in other package modules.

The file structure could be like this:
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

We'd like to expose the package functionality via a single entry point, the "main file" `auth/index.js`, to be used like this:

```js
import {login, logout} from 'auth/index.js'
```

The idea is that outsiders, developers who use our package, should not meddle with its internal structure, search for files inside our package folder. We export only what's necessary in `auth/index.js` and keep the rest hidden from prying eyes.

As the actual exported functionality is scattered among the package, we can import it into `auth/index.js` and export from it:

```js
// 📁 auth/index.js

// import login/logout and immediately export them
import {login, logout} from './helpers.js';
export {login, logout};

// import default as User and export it
import User from './user.js';
export {User};
...
```

Now users of our package can `import {login} from "auth/index.js"`.

The syntax `export ... from ...` is just a shorter notation for such import-export:

```js
// 📁 auth/index.js
// import login/logout and immediately export them
export {login, logout} from './helpers.js';

// import default as User and export it
export {default as User} from './user.js';
...
```

### Re-exporting the default export

The default export needs separate handling when re-exporting.

Let's say we have `user.js`, and we'd like to re-export class `User` from it:

```js
// 📁 user.js
export default class User {
  // ...
}
```

1. `export User from './user.js'` won't work. What can go wrong?... But that's a syntax error!

    To re-export the default export, we should write `export {default as User}`, as in the example above.    

2. `export * from './user.js'` re-exports only named exports, ignores the default one.

    If we'd like to re-export both named and the default export, then two statements are needed:
    ```js
    export * from './user.js'; // to re-export named exports
    export {default} from './user.js'; // to re-export the default export
    ```

Such oddities of re-exporting the default export is one of the reasons, why some developers don't like them.

## 요약

Here are all types of `export` that we covered in this and previous chapters.

You can check yourself by reading them and recalling what they mean:

- Before declaration of a class/function/..:
  - `export [default] class/function/variable ...`
- Standalone export:
  - `export {x [as y], ...}`.
- Re-export:
  - `export {x [as y], ...} from "module"`
  - `export * from "module"` (doesn't re-export default).
  - `export {default [as y]} from "module"` (re-export default).

가져오기 역시 다양한 방법으로 가능합니다.

- named export 가져오기:
  - `import {x [as y], ...} from "mod"`
- default export 가져오기:
  - `import x from "mod"`
  - `import {default as x} from "mod"`
- 모든 export 한번에 가져오기:
  - `import * as obj from "mod"`
- 모듈을 가져오긴 하지만, 변수에 할당하지 않기:
  - `import "mod"`

`import/export` 문은 스크립트의 맨 위나 맨 아래에 올 수 있는데, 차이는 없습니다.

따라서 아래 스크립트는 문제없이 잘 동작합니다.
```js
sayHi();

// ...

import {sayHi} from './say.js'; // import 문을 파일 맨 아래에 위치시킴
```

대게는 편의상 스크립트 맨 위에 import 문을 위치시킵니다.

**import/export 문은 블록 `{...}`안에선 동작하지 않는다는 점에 유의하시길 바랍니다.**

조건에 따라 모듈을 가져오려는 의도로 작성한 아래 코드는 동작하지 않습니다.
```js
if (something) {
  import {sayHi} from "./say.js"; // 에러: import 문은 최상위 레벨에 위치해야 합니다.
}
```

그런데 애플리케이션을 작성하다 보면 조건에 따라 모듈을 가져와야 하거나 어떤 특정 시점에 모듈을 불러와야 하는 경우가 생깁니다. 이럴 땐 어떤 방법을 사용해야 할까요? 요청이 있을 때만 모듈을 불러오는 게 가능할까요?

동적으로 모듈을 가져오는 방법(dynamic import)은 다음 챕터에서 알아보도록 하겠습니다.
