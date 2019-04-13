# 현대적인 모드, "use strict"

오랫동안 자바스크립트는 호환성 문제없이 발전해왔습니다. 자바스크립트에 새로운 기능이 추가되었으나, 오래된 기능은 변경되지 않았습니다.

이것은 기존의 코드를 절대 망가뜨리지 않는다는 장점을 갖고 있었습니다. 하지만 자바스크립트 창시자들이 했던 실수나 불완전한 결정이 자바스크립트 안에 영원히 존재하게 되었다는 단점이 있었습니다.

이것은 ECMAScript5(ES5)가 등장했던 2009년까지의 일이었습니다. ES5에서는 자바스크립트에 새로운 기능이 추가되었고 기존 기능 중 일부가 변경되었습니다. 이전의 오래된 코드가 계속 작동할 수 있도록, 대부분의 변경사항은 기본적으로 적용되지 않습니다. 변경사항을 적용하고 싶다면 `"use strict"`라는 특별한 지시어를 통해 명시적으로 활성화해야 합니다.

## "use strict"

지시어는 `"use strict"` 나 `'use strict'` 라는 문자열로 표현됩니다. 지시어를 스크립트 최상단에 작성하면, 스크립트 전체가 "현대적인" 방식으로 실행됩니다.

예를 들어

```js
"use strict";

// 이 코드는 현대적인 방식으로 실행됩니다.
...
```

우리는 함수(명령어들을 그룹화하는 방식)에 대해 곧 배울 것입니다.

`"use strict"`가 스크립트 대신 (대부분의) 함수의 시작 위치에 놓일 수 있다는 사실에 주목하세요. 그러면 엄격 모드(strict mode)가 오직 해당 함수에서만 활성화됩니다. 하지만 보통 사람들은 이 모드를 스크립트 전체를 위해 사용합니다.


````warn header="\"use strict\"는 반드시 상단에 위치시키세요."
`"use strict"`는 스크립트 최상단에 위치한다는 사실을 명심하세요. 그렇지 않으면, 엄격 모드는 활성화되지 않을 수도 있습니다.

다음 코드에서는 엄격 모드가 활성화되지 않습니다.:

```js no-strict
alert("some code");
// 하단에 위치한 "use strict"는 무시됩니다. 상단에 위치해야 합니다.

"use strict";

// 엄격 모드가 활성화되지 않습니다.
```

주석만 `"use strict"` 위에 위치할 수 있습니다.
````

```warn header="`use strict`를 취소할 방법은 존재하지 않습니다."
`"no use strict"`나 이와 비슷하게 생긴 지시어는 존재하지 않습니다. that would return the old behavior.

엄격 모드를 적용하면, 돌이킬 방법은 없습니다.
```

## Browser console

For the future, when you use a browser console to test features, please note that it doesn't `use strict` by default.

Sometimes, when `use strict` makes a difference, you'll get incorrect results.

Even if we press `key:Shift+Enter` to input multiple lines, and put `use strict` on top, it doesn't work. That's because of how the console executes the code internally.

The reliable way to ensure `use strict` would be to input the code into console like this:

```js
(function() {
  'use strict';

  // ...your code...
})()
```

## 항상 "use strict"를 사용하세요.

We have yet to cover the differences between strict mode and the "default" mode.

In the next chapters, as we learn language features, we'll note the differences between the strict and default modes. Luckily, there aren't many and they actually make our lives better.

For now, it's enough to know about it in general:

1. The `"use strict"` directive switches the engine to the "modern" mode, changing the behavior of some built-in features. We'll see the details later in the tutorial.
2. Strict mode is enabled by placing `"use strict"` at the top of a script or function. Several language features, like "classes" and "modules", enable strict mode automatically.
3. Strict mode is supported by all modern browsers.
4. We recommended always starting scripts with `"use strict"`. All examples in this tutorial assume strict mode unless (very rarely) specified otherwise.
