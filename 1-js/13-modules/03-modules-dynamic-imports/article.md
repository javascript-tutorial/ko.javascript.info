
# 동적으로 모듈 가져오기

이전 챕터까진 "정적(static)" export와 import 문을 다뤘습니다. 

정적이라는 수식어가 붙은 이유는 실제로 두 구문이 정적이기 때문입니다. 아주 엄격한 문법을 지키면서 구문을 작성해야 했죠.

첫 번째 제약은 `import`문에 동적 매개변수를 사용할 수 없다는 것이었습니다.

모듈 경로는 문자열 원형이어야만 하고, 함수 호출 결과값을 경로로 쓰는 것도 불가능했죠.

```js
import ... from *!*getModuleName()*/!*; // 모듈 경로는 문자열만 허용되기 때문에 에러가 발생합니다. 
```

두 번째 제약은, 런타임이나 조건부로 모듈을 불러올 수 없다는 점이었습니다.

```js
if(...) {
  import ...; // 모듈을 조건부로 불러올 수 없으므로 에러 발생
}

{
  import ...; // import 문을 블록 안에 넣을 수 없으므로 에러 발생
}
```

<<<<<<< HEAD
이렇게 엄격한 문법을 따라야 하는 데는 이유가 있습니다. import/export 문은 코드 구조의 기본적인 골격을 만드는 데 사용되기 때문입니다. 코드 구조를 분석해 모듈을 한데 모아 번들링하고, 사용하지 않는 모듈은 제거(가지치기)해야 하는데, 구조가 고정되어있을 때만 이런 작업이 가능합니다.

그런데 만약 모듈을 동적으로 불러와야 할 필요가 생기면 어떻게 할까요?
=======
That's because `import`/`export` aim to provide a backbone for the code structure. That's a good thing, as code structure can be analyzed, modules can be gathered and bundled together, unused exports can be removed ("tree-shaken"). That's possible only because the structure of imports/exports is simple and fixed.

But how can we import a module dynamically, on-demand?
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7

## import() 함수

`import(module)` 함수는 제약 없이 어디서나 호출할 수 있습니다. 반환값은 모듈 객체로 해석되는 프라미스입니다.

사용 패턴은 아래와 같습니다.

```js run
let modulePath = prompt("모듈 경로?");

import(modulePath)
  .then(obj => <module object>)
  .catch(err => <loading error, no such module?>)
```

비동기 함수 안에선 `let module = await import(modulePath)`와 같이 사용할 수도 있습니다.

<<<<<<< HEAD
아래와 같이 말이죠.

[codetabs src="say" current="index.html"]

이를 이용하면 손쉽게 동적으로 모듈을 가져올 수 있습니다.

동적 import는 일반적인 스크립트 안에 넣을 수 있기 때문에, 모듈 속성 `script type="module"`이 필요하지 않습니다.
=======
For instance, if we have the following `say.js`:

```js
// 📁 say.js
export function hi() {
  alert(`Hello`);
}

export function bye() {
  alert(`Bye`);
}
```

...Then dynamic import can be like this:

```js
let {hi, bye} = await import('./say.js');

hi();
bye();

```

Or, for the default export:

```js
// 📁 say.js
export default function() {
  alert("Module loaded (export default)!");
}
```

To import it, we need to get `default` property of the module object, as explained in the [previous chapter](info:import-export).

So, the dynamic import will be like this:

```js
let {default: say} = await import('./say.js'); // map .default to say variable

say();
```

Here's the full example:

[codetabs src="say" current="index.html"]

So, dynamic imports are very simple to use, and they allow to import modules at run-time.

Also, dynamic imports work in regular scripts, they don't require `script type="module"`.

```smart
Although `import()` looks like a function call, it's a special syntax that just happens to use parentheses (similar to `super()`).

That means that import doesn't inherit from `Function.prototype` so we cannot call or apply it.
```
>>>>>>> be342e50e3a3140014b508437afd940cd0439ab7
