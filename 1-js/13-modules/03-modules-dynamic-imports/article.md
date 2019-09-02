# 동적으로 모듈 가져오기

Export and import statements that we covered in previous chapters are called "static". The syntax is very simple and strict.

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

That's because `import`/`export` aim to provide a backbone for the code structure. That's a good thing, as code structure can be analyzed, modules can be gathered and bundled into one file by special tools, unused exports can be removed ("tree-shaken"). That's possible only because the structure of imports/exports is simple and fixed.

그런데 만약 모듈을 동적으로 불러와야 할 필요가 생기면 어떻게 할까요?

## import() 표현식

The `import(module)` expression loads the module and returns a promise that resolves into a module object that contains all its exports. It can be called from any place in the code.

We can use it dynamically in any place of the code, for instance:

```js
let modulePath = prompt("Which module to load?");

import(modulePath)
  .then(obj => <module object>)
  .catch(err => <loading error, e.g. if no such module>)
```

비동기 함수 안에선 `let module = await import(modulePath)`와 같이 사용할 수도 있습니다.

For instance, if we have the following module `say.js`:

```js
// 📁 say.js
export function hi() {
  alert(`Hello`);
}

export function bye() {
  alert(`Bye`);
}
```

이 경우 아래와 같이 코드를 작성하면 모듈을 동적으로 불러올 수 있습니다.

```js
let {hi, bye} = await import('./say.js');

hi();
bye();
```

`say.js`에 default export가 있다면 아래와 같이도 가능합니다.

```js
// 📁 say.js
export default function() {
  alert("Module loaded (export default)!");
}
```

...Then, in order to access it, we can use `default` property of the module object:

```js
let obj = await import('./say.js');
let say = obj.default;
// or, in one line: let {default: say} = await import('./say.js');

say();
```

아래는 실제 동작하는 코드입니다.

[codetabs src="say" current="index.html"]

```smart
동적 import는 (모듈이 아닌) 일반적인 스크립트에서도 동작합니다. 모듈 속성 `script type="module"`이 필요하지 않죠.
```

```smart
`import()`는 함수 호출과 문법이 유사해 보이긴 하지만 함수 호출은 아닙니다. (`super()`처럼) 괄호를 쓰는 특별한 문법 중 하나입니다. 

So we can't copy `import` to a variable or use `.call/apply` with it. That's not a function.
```
