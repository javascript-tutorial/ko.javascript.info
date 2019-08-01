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

이렇게 엄격한 문법을 따라야 하는 데는 이유가 있습니다. `import`/`export` 문은 코드 구조의 기본적인 골격을 만드는 데 사용되기 때문입니다. 코드 구조를 분석해 모듈을 한데 모아 번들링하고, 사용하지 않는 모듈은 제거(가지치기)해야 하는데, 구조가 고정되어있을 때만 이런 작업이 가능합니다.

그런데 만약 모듈을 동적으로 불러와야 할 필요가 생기면 어떻게 할까요?

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

아래 `say.js`가 있다고 가정해 봅시다.

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

이때, 해당 모듈을 가져오려면 모듈 객체의 `default` 프로퍼티를 사용하면 됩니다. [이전 챕터](info:import-export)에서 이에 대해서 설명해 드린 바 있습니다.

`default` 프로퍼티를 사용하면 아래와 같이 동적으로 모듈을 불러올 수 있습니다.

```js
let {default: say} = await import('./say.js'); // save .default property in say variable

say();
```

아래는 실제 동작하는 코드입니다.

[codetabs src="say" current="index.html"]

```smart
동적 import는 (모듈이 아닌) 일반적인 스크립트에서도 동작합니다. 모듈 속성 `script type="module"`이 필요하지 않죠.
```

```smart
`import()`는 함수 호출과 문법이 유사해 보이긴 하지만 함수 호출은 아닙니다. (`super()`처럼) 괄호를 쓰는 특별한 문법 중 하나입니다. 

따라서 `import`를 복사해 변수에 할당한다거나 `.call/apply`를 적용할 수 없습니다.
```
