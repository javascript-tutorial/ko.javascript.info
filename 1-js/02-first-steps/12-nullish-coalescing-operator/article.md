# null 병합 연산자 '??'

[recent browser="new"]

null 병합 연산자(nullish coalescing operator) `??`를 사용하면 짧은 문법으로 여러 피연산자 중 그 값이 '확정되어있는' 변수를 찾을 수 있습니다.

`a ?? b`의 평가 결과는 다음과 같습니다.
- `a`가 `null`도 아니고 `undefined`도 아니면 `a`
- 그 외의 경우는 `b`

null 병합 연산자 `??`없이 `x = a ?? b`와 동일한 동작을 하는 코드를 작성하면 다음과 같습니다.

```js
x = (a !== null && a !== undefined) ? a : b;
```

코드 길이가 길어지네요. 

또 다른 예시를 살펴봅시다. `firstName`, `lastName`, `nickName`이란 변수에 사용자 이름이나 별명을 저장하는데, 사용자가 아무런 정보도 입력하지 않는 케이스도 허용한다고 해보겠습니다.

화면엔 세 변수 중, 값이 정해진 변수의 값을 출력하는데, 세 변수 모두 값이 정해지지 않았다면 "Anonymous"가 출력되도록 해보죠.

이럴 때 null 병합 연산자 `??`를 사용하면 값이 정해진 변수를 간편하게 찾아낼 수 있습니다.

```js run
let firstName = null;
let lastName = null;
let nickName = "Supercoder";

// null이나 undefined가 아닌 첫 번째 피연산자
*!*
alert(firstName ?? lastName ?? nickName ?? "Anonymous"); // Supercoder
*/!*
```

## '??'와 '||'의 차이

null 병합 연산자는 OR 연산자 `||`와 상당히 유사해 보입니다. 실제로 위 예시에서 `??`를 `||`로 바꿔도 그 결과는 동일하기까지 하죠. [이전 챕터](info:logical-operators#or-finds-the-first-truthy-value)에서 관련 내용을 살펴본 바 있습니다.

그런데 두 연산자 사이에는 중요한 차이점이 있습니다.
- `||`는 첫 번째 *truthy* 값을 반환합니다.
- `??`는 첫 번째 *정의된(defined)* 값을 반환합니다.

`null`과 `undefined`, 숫자 `0`을 구분 지어 다뤄야 할 때 이 차이점은 매우 중요한 역할을 합니다.

예시를 살펴봅시다.

```js
height = height ?? 100;
```

`height`에 값이 정의되지 않았다면 `height`엔 `100`이 할당됩니다.

이제 `??`와 `||`을 비교해봅시다.

```js run
let height = 0;

alert(height || 100); // 100
alert(height ?? 100); // 0
```

`height || 100`은 `height`에 `0`을 할당했지만 `0`을 falsy 한 값으로 취급했기 때문에 `null`이나 `undefined`를 할당한 것과 동일하게 처리합니다. 따라서 `height || 100`의 평가 결과는 `100`입니다.

반면 `height ?? 100`의 평가 결과는 `height`가 정확하게 `null`이나 `undefined`일 경우에만 `100`이 됩니다. 예시에선 `height`에 `0`이라는 값을 할당했기 때문에 얼럿창엔 `0`이 출력됩니다.

이런 특징 때문에 높이처럼 `0`이 할당될 수 있는 변수를 사용해 기능을 개발할 땐 `||`보다 `??`가 적합합니다.

## 연산자 우선순위

[`??`의 연산자 우선순위](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table)는 `5`로 꽤 낮습니다.

따라서 `??`는 `=`와 `?` 보다는 먼저, 대부분의 연산자보다는 나중에 평가됩니다.

그렇기 때문에 복잡한 표현식 안에서 `??`를 사용해 값을 하나 선택할 땐 괄호를 추가하는 게 좋습니다.

```js run
let height = null;
let width = null;

// 괄호를 추가!
let area = (height ?? 100) * (width ?? 50);

alert(area); // 5000
```

그렇지 않으면 `*`가 `??`보다 우선순위가 높기 때문에 `*`가 먼저 실행됩니다.

결국엔 아래 예시처럼 동작하겠죠.

```js
// 원치 않는 결과
let area = height ?? (100 * width) ?? 50;
```

`??`엔 자바스크립트 언어에서 규정한 또 다른 제약사항이 있습니다.

**안정성 관련 이슈 때문에 `??`는 `&&`나 `||`와 함께 사용하지 못합니다.**

아래 예시를 실행하면 문법 에러가 발생합니다.

```js run
let x = 1 && 2 ?? 3; // SyntaxError: Unexpected token '??'
```

이 제약에 대해선 아직 논쟁이 많긴 하지만 사람들이 `||`를 `??`로 바꾸기 시작하면서 만드는 실수를 방지하고자 명세서에 제약이 추가된 상황입니다.

제약을 피하려면 괄호를 사용해주세요.

```js run
*!*
let x = (1 && 2) ?? 3; // 제대로 동작합니다.
*/!*

alert(x); // 2
```

## 요약

- null 병합 연산자 `??`를 사용하면 피연산자 중 '값이 할당된' 변수를 빠르게 찾을 수 있습니다.

    `??`는 변수에 기본값을 할당하는 용도로 사용할 수 있습니다.

    ```js
    // height가 null이나 undefined인 경우, 100을 할당 
    height = height ?? 100;
    ```

- `??`의 연산자 우선순위는 대다수의 연산자보다 낮고 `?`와 `=` 보다는 높습니다.
- 괄호 없이 `??`를 `||`나 `&&`와 함께 사용하는 것은 금지되어있습니다.
