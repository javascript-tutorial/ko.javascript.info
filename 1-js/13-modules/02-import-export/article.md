# 모듈 내보내고 가져오기

지시자 export와 import는 다양한 기능을 가지고 있습니다.

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

대부분의 자바스크립트 스타일 가이드에선 문(statement)의 끝에 세미콜론을 붙이길 권유합니다. 하지만 함수나 클래스를 선언할 때는 세미콜론을 붙이라고 권유하지 않습니다.

이런 이유로 `export class`와 `export function` 뒤에 세미콜론을 붙이지 않습니다.

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

목록이 길어질 땐, `import * as <obj>`를 사용해 객체 형태로 모든걸 가지고 올 수 있습니다. 예시를 살펴보겠습니다.

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

    아래와 같이 수많은 함수가 있는 서드파티 라이브러리인 `lib.js`를 프로젝트에 도입하였다 가정합시다.
    ```js
    // 📁 lib.js
    export function sayHi() { ... }
    export function sayBye() { ... }
    export function becomeSilent() { ... }
    ```

    현재로선 `lib.js`의 함수 중 단 하나만 필요하기 때문에, 이 함수만 임포트 합니다.
    ```js
    // 📁 main.js
    import {sayHi} from './lib.js';
    ```
    빌드 툴은 프로젝트에서 사용되고 있는 함수가 무엇인지 감지하고, 사용되지 않는 함수는 최종 번들링 코드에서 제거합니다. 사용되지 않는 코드가 제거되기 때문에, 빌드 결과물의 크기가 작아집니다. 이런 최적화 과정을 "가지치기(tree-shaking)"라고 부릅니다. 

2. 어떤걸 임포트 할지 명시하면, 코드가 짧아집니다. `lib.sayHi()`보다 `sayHi()`가 더 간결하죠.
3. 어디서 어떤게 쓰이는지 명확하기 때문에, 코드 구조가 눈에 더 잘 들어옵니다. 리팩토링이나 유지보수가 좀 더 쉬워집니다.

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

say.hi('John'); // Hello, John!
say.bye('John'); // Bye, John!
```

## export default

지금까지 가져오거나 내보낼 것들이 여러 개 있는 경우에 대해 알아보았습니다. "as"를 사용하면 이름을 바꿀 수 있다는 것도 배웠죠.

그런데 실무에선, 아래와 같은 방식으로 모듈을 구성합니다.
- `lib.js`처럼 함수만으로 구성된 하나의 라이브러리
-`user.js`라는 모듈에 `class User` 하나만 있는 것처럼, 모듈 하나에 개체(entity) 하나만 있는 형태

대게는 두 번째 방법을 선호하기 때문에, 한 모듈 안에 개체의 "모든 것"이 들어가게 됩니다. 

이렇게 모듈을 구성하다 보면 무언 갈 하나 만들 때마다 모듈 하나를 만들어야 하므로, 프로젝트 내 파일이 많아질 수밖에 없습니다. 이름을 잘 지어주고, 폴더로 파일을 잘 나눠 프로젝트를 구성하면 되기 때문에, 이는 문제가 되지 않습니다.

자바스크립트는 `export default`라는 문법을 제공해, "모듈 하나에 무언가가 하나"만 들어가는 상황을 좀 더 깔끔하게 코드로 짤 수 있도록 해줍니다. 

사용법은 간단합니다.

1. "내보내고자 하는 것" 바로 앞에 `export default`를 써줍니다.
2. 임포트 할 때는 중괄호(curly brace) 없이 호출합니다.

`user.js`에서 `class User`를 내보내는 예제를 살펴봅시다.

```js
// 📁 user.js
export *!*default*/!* class User { // export 옆에 "default"를 붙여주었습니다. 
  constructor(name) {
    this.name = name;
  }
}
```

위에서 내보내기 한 클래스를 `main.js`에서 가져와 봅시다.

```js
// 📁 main.js
import *!*User*/!* from './user.js'; // 중괄호 없이, User 클래스를 가져왔습니다.

new User('John');
```

중괄호 없이 클래스를 가져오니 더 깔끔해 보이네요. 모듈을 처음 접한 사람은 중괄호를 빼놓고 무언갈 임포트 하는 실수를 자주 합니다. Named import 에는 중괄호가 필요하고, default import 에는 중괄호가 필요하지 않는다는 걸 기억해 이런 실수를 하지 않도록 합시다. 

| Named export | Default export |
|--------------|----------------|
| `export class User {...}` | `export default class User {...}` |
| `import {User} from ...` | `import User from ...`|

대게는 파일 하나당 하나의 "default" export가 있습니다.

모듈 하나에 named export와 default export를 동시에 가질 수도 있지만, 실무에선 동시에 이런 경우는 많지 않습니다. 모듈 하나엔 named export 여러 개나, default export 하나만 있습니다.

**named export엔 무조건 이름이 있어야 하지만, `export default`는 익명일 수 있다는 점을 기억하세요.**

아래의 내보내기들은 이름이 없지만 모두 에러 없이 잘 동작합니다.

```js
export default class { // 클래스 이름이 없음
  constructor() { ... }
}

export default function(user) { // 함수 이름이 없음
  alert(`Hello, ${user}!`);
}

// 이름 없이, 배열 형태의 값 하나를 내보냄
export default ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
```

이렇게 해도 괜찮은 이유는, 파일 하나에 `export default`가 하나만 있기 때문입니다. 다만, named export는 파일 하나에 여러 개 있을 수 있기 때문에, 이름을 생략하면 에러가 납니다.

```js
export class { // 에러! (default export가 아닌경우엔 이름이 꼭 필요합니다.)
  constructor() {}
}
```     

### "Default" alias

The "default" keyword is used as an "alias" for the default export, for standalone exports and other scenarios when we need to reference it.

For example, if we already have a function declared, that's how to `export default` it (separately from the definition):

```js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

export {sayHi as default}; // same as if we added "export default" before the function
```

Or, let's say a module `user.js` exports one main "default" thing and a few named ones (rarely the case, but happens):

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

Here's how to import the default export along with a named one:

```js
// 📁 main.js
import {*!*default as User*/!*, sayHi} from './user.js';

new User('John');
```

Or, if we consider importing `*` as an object, then the `default` property is exactly the default export:

```js
// 📁 main.js
import * as user from './user.js';

let User = user.default;
new User('John');
```


### Should I use default exports?

One should be careful about using default exports, because they are more difficult to maintain.

Named exports are explicit. They exactly name what they import, so we have that information from them, that's a good thing.

Also, named exports enforce us to use exactly the right name to import:

```js
import {User} from './user.js';
// import {MyUser} won't work, the name must be {User}
```

For default exports, we always choose the name when importing:

```js
import User from './user.js'; // works
import MyUser from './user.js'; // works too
// could be import Anything..., and it'll be work
```

So, there's a little bit more freedom that can be abused, so that team members may use different names for the same thing.

Usually, to avoid that and keep the code consistent, there's a rule that imported variables should correspond to file names, e.g:

```js
import User from './user.js';
import LoginForm from './loginForm.js';
import func from '/path/to/func.js';
...
```

Another solution would be to use named exports everywhere. Even if only a single thing is exported, it's still exported under a name, without `default`.

That also makes re-export (see below) a little bit easier.

## Re-export

"Re-export" syntax `export ... from ...` allows to import things and immediately export them (possibly under another name), like this:

```js
export {sayHi} from './say.js';
export {default as User} from './user.js';
```

What's the point, why that's needed? Let's see a practical use case.

Imagine, we're writing a "package": a folder with a lot of modules, mostly needed internally, with some of the functionality exported outside (tools like NPM allow to publish and distribute packages, but here it doesn't matter).

A directory structure could be like this:
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

The idea is that outsiders, developers who use our package, should not meddle with its internal structure. They should not search for files inside our package folder. We export only what's necessary in `auth/index.js` and keep the rest hidden from prying eyes.

Now, as the actual exported functionality is scattered among the package, we can gather and "re-export" it in `auth/index.js`:

```js
// 📁 auth/index.js
import {login, logout} from './helpers.js';
export {login, logout};

import User from './user.js';
export {User};

import Github from './providers/github.js';
export {Github};
...
```

"Re-exporting" is just a shorter notation for that:

```js
// 📁 auth/index.js
export {login, logout} from './helpers.js';
// or, to re-export all helpers, we could use:
// export * from './helpers.js';

export {default as User} from './user.js';

export {default as Github} from './providers/github.js';
...
```

````warn header="Re-exporting default is tricky"
Please note: `export User from './user.js'` won't work. It's actually a syntax error. To re-export the default export, we must mention it explicitly `{default as ...}`, like in the example above.

Also, there's another oddity: `export * from './user.js'` re-exports only named exports, excluding the default one. Once again, we need to mention it explicitly.

For instance, to re-export everything, two statements will be necessary:
```js
export * from './module.js'; // to re-export named exports
export {default} from './module.js'; // to re-export default
```

The default should be mentioned explicitly only when re-exporting: `import * as obj` works fine. It imports the default export as `obj.default`. So there's a slight asymmetry between import and export constructs here.
````

## Summary

There are following types of `export`:

- Before declaration:
  - `export [default] class/function/variable ...`
- Standalone:
  - `export {x [as y], ...}`.
- Re-export:
  - `export {x [as y], ...} from "mod"`
  - `export * from "mod"` (doesn't re-export default).
  - `export {default [as y]} from "mod"` (re-export default).

Import:

- Named exports from module:
  - `import {x [as y], ...} from "mod"`
- Default export:  
  - `import x from "mod"`
  - `import {default as x} from "mod"`
- Everything:
  - `import * as obj from "mod"`
- Import the module (it runs), but do not assign it to a variable:
  - `import "mod"`

We can put import/export statements at the top or at the bottom of a script, that doesn't matter.

So this is technically fine:
```js
sayHi();

// ...

import {sayHi} from './say.js'; // import at the end of the script
```

In practice imports are usually at the start of the file, but that's only for better convenience.

**Please note that import/export statements don't work if inside `{...}`.**

A conditional import, like this, won't work:
```js
if (something) {
  import {sayHi} from "./say.js"; // Error: import must be at top level
}
```

...But what if we really need to import something conditionally? Or at the right time? Like, load a module upon request, when it's really needed?

We'll see dynamic imports in the next chapter.
