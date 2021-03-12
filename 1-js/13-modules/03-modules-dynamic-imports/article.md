# 동적으로 모듈 가져오기

이전 챕터에서 다뤘던 export 문이나 import 문은 '정적인' 방식입니다. 문법이 단순하고 제약사항이 있죠.

첫 번째 제약은 `import`문에 동적 매개변수를 사용할 수 없다는 것이었습니다.

모듈 경로엔 원시 문자열만 들어갈 수 있기 때문에 함수 호출 결괏값을 경로로 쓰는 것이 불가능했습니다.

```js
import ... from *!*getModuleName()*/!*; // 모듈 경로는 문자열만 허용되기 때문에 에러가 발생합니다. 
```

두 번째 제약은 런타임이나 조건부로 모듈을 불러올 수 없다는 점이었습니다.

```js
if(...) {
  import ...; // 모듈을 조건부로 불러올 수 없으므로 에러 발생
}

{
  import ...; // import 문은 블록 안에 올 수 없으므로 에러 발생
}
```

이런 제약사항이 만들어진 이유는 `import`/`export`는 코드 구조의 중심을 잡아주는 역할을 하기 때문입니다. 코드 구조를 분석해 모듈을 한데 모아 번들링하고, 사용하지 않는 모듈은 제거(가지치기)해야 하는데, 코드 구조가 간단하고 고정되어있을 때만 이런 작업이 가능합니다.

그럼에도 불구하고 모듈을 동적으로 불러와야 한다면 어떻게 해야 할까요?

## import() 표현식

`import(module)` 표현식은 모듈을 읽고 이 모듈이 내보내는 것들을 모두 포함하는 객체를 담은 이행된 프라미스를 반환합니다. 호출은 어디서나 가능합니다.

코드 내 어디에서 동적으로 사용할 수도 있습니다.

```js
let modulePath = prompt("어떤 모듈을 불러오고 싶으세요?");

import(modulePath)
  .then(obj => <모듈 객체>)
  .catch(err => <로딩 에러, e.g. 해당하는 모듈이 없는 경우>)
```

async 함수 안에서 `let module = await import(modulePath)`와 같이 사용하는 것도 가능합니다.

모듈 `say.js`를 이용해 예시를 만들어보겠습니다.

```js
// 📁 say.js
export function hi() {
  alert(`안녕하세요.`);
}

export function bye() {
  alert(`안녕히 가세요.`);
}
```

아래와 같이 코드를 작성하면 모듈을 동적으로 불러올 수 있습니다.

```js
let {hi, bye} = await import('./say.js');

hi();
bye();
```

`say.js`에 default export를 추가해보겠습니다.

```js
// 📁 say.js
export default function() {
  alert("export default한 모듈을 불러왔습니다!");
}
```

default export 한 모듈을 사용하려면 아래와 같이 모듈 객체의 `default` 프로퍼티를 사용하면 됩니다.

```js
let obj = await import('./say.js');
let say = obj.default;
// 위 두 줄을 let {default: say} = await import('./say.js'); 같이 한 줄로 줄일 수 있습니다.

say();
```

아래는 실제 동작하는 예시입니다.

[codetabs src="say" current="index.html"]

```smart
동적 import는 일반 스크립트에서도 동작합니다. `script type="module"`가 없어도 됩니다. 
```

```smart
`import()`는 함수 호출과 문법이 유사해 보이긴 하지만 함수 호출은 아닙니다. `super()`처럼 괄호를 쓰는 특별한 문법 중 하나입니다.

따라서 `import`를 변수에 복사한다거나 `call/apply`를 사용하는 것이 불가능합니다. 함수가 아니기 때문이죠.
```
