

# 콜백 입문

자바스크립트에서 많은 동작은 *비동기*적으로 동작합니다

아래 `loadScript(src)` 함수를 살펴봅시다.

```js
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

이 함수의 역할은 새로운 스크립트를 불러오는 것입니다. 함수를 통해 `<script src="…">`가 문서에 더해지면, 브라우저는 스크립트를 불러오고 실행합니다.

다음과 같이 이 함수를 사용할 수 있을 겁니다:

```js
// 스크립트를 불러오고 실행함
loadScript('/my/script.js');
```

이 함수는 "비동기적으로" 호출됩니다, 왜냐하면 (스크립트를 불러오는)행동이 지금이 아니라, 나중에 끝나기 때문입니다.

함수를 호출하면 스크립트 로딩이 시작됩니다. 실행은 로딩이 끝난 후 진행됩니다. 스크립트가 로딩되는 동안 그 아래 코드는 이미 실행이 끝났을 수 있습니다. 스크립트를 로딩하는 시간이 오래 걸린다면, 그동안 다른 스크립트들도 실행될 수 있습니다.

```js
loadScript('/my/script.js');
// loadScript 아래에 있는 코드는 스크립트 로딩이 끝날 때까지 기다리지 않고, 실행됩니다.
// ...
```

로딩이 끝나면 이 안의 스크립트를 사용하고 싶을 겁니다. 스크립트 안에는 다양한 함수가 선언되어있어, 외부에서 호출할 수 있습니다.  

하지만 만약 `loadScript(...)` 호출 직후에 내부의 함수를 바로 호출한다면, 원하는 대로 작동하지 않을 겁니다.

```js
loadScript('/my/script.js'); // 스크립트 안엔 "function newFunction() {…}"이 있습니다

*!*
newFunction(); // 이런 함수가 존재하지 않는다는 에러가 발생할 것입니다!
*/!*
```

브라우저는 스크립트 로딩 시간을 충분히 확보하지 못했을 겁니다. 그렇기 때문에 즉각적으로 함수를 호출하는 건 실패합니다. 위에 작성된 코드만으론 `loadScript`를 통해 스크립트 로딩이 끝났는지를 추적할 수 없습니다. 스크립트는 로딩되고, 언젠가 실행되겠지만 그게 다입니다. 하지만 스크립트 안의 함수나 변수를 사용하려면, 언제 스크립트 로딩이 끝났는지 알아야 합니다.

`loadScript`의 두 번째 인수로 `callback` 함수를 추가해 봅시다. 이 콜백함수는 스크립트 로딩이 끝난 후 실행되어야 합니다:

```js
function loadScript(src, *!*callback*/!*) {
  let script = document.createElement('script');
  script.src = src;

*!*
  script.onload = () => callback(script);
*/!*

  document.head.append(script);
}
```

스크립트 안에 정의된 새로운 함수를 호출하고 싶다면, 그 함수를 콜백 함수 안에 써주면 됩니다:

```js
loadScript('/my/script.js', function() {
  // 스크립트 로드가 끝나면 콜백 함수가 실행됨
  newFunction(); // 이제 함수 호출이 제대로 작동함
  ...
});
```

두 번째 인수로 전달된 함수(대게 익명 함수임)는 동작이 완료되었을 때 실행되게 됩니다.

아래는 실제 제 기능을 갖춘 스크립트로 만든 예시입니다.

```js run
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(script);
  document.head.append(script);
}

*!*
loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', script => {
  alert(`Cool, the ${script.src} is loaded`);
  alert( _ ); // function declared in the loaded script
});
*/!*
```

위에서 살펴본 방식을 "콜백 기반" 스타일 비동기 프로그래밍이라고 합니다. 비동기적으로 동작하는 함수에는 이 함수 실행이 완료되고나서 실행되는 `callback` 인수를 반드시 써주어야 합니다. 

`loadScript`에서 역시 콜백 인수를 명시해 주었습니다. 콜백기반 스타일은 비동기 프로그래밍의 일반적인 접근법입니다.

## 콜백 속 콜백

어떻게 두 개의 스크립트를 순차적으로 불러올 수 있을까요? 하나를 먼저 불러오고, 그다음에 또 다른 스크립트를 불러오는 것 같이 말이죠.

일반적인 해결책은 콜백 안에서 두 번째 `loadScript` 호출을 하는 것입니다. 이렇게요:

```js
loadScript('/my/script.js', function(script) {

  alert(`Cool, the ${script.src} is loaded, let's load one more`);

*!*
  loadScript('/my/script2.js', function(script) {
    alert(`Cool, the second script is loaded`);
  });
*/!*

});
```

바깥 `loadScript`가 완료된 후 이 콜백은 안쪽 `loadScript`를 실행합니다. 

만약 스크립트가 하나 더 필요한 경우는 어떻게 해야 할까요?

```js
loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

*!*
    loadScript('/my/script3.js', function(script) {
      // ...모든 스크립트를 불러온 후 실행됨
    });
*/!*

  })

});
```

이제 모든 새로운 동작은 콜백 안에 있습니다. 동작이 단 몇 개만 있다면 이렇게 작성해도 괜찮겠지만, 많은 동작을 이런 식으로 작성하면 좋지 않습니다. 다른 방법을 통해 여러 동작을 다루는 방법을 알아보도록 하겠습니다.

## 에러 핸들링

위의 예제는 스크립트 로딩이 실패하는 경우 같은 에러를 고려하지 않고 작성되었습니다. 콜백은 에러를 핸들링할 수 있어야 합니다.

새롭게 작성한 `loadScript`는 로딩 에러를 추적할 수 있습니다:

```js run
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

*!*
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));
*/!*

  document.head.append(script);
}
```

스크립트 로딩이 성공적으로 끝난 경우는 `callback(null, script)`을 호출하고, 그렇지 않은 경우는 `callback(error)`을 호출합니다.

사용법:
```js
loadScript('/my/script.js', function(error, script) {
  if (error) {
    // 에러 핸들링
  } else {
    // 스크립트 로딩이 성공적으로 끝난 경우
  }
});
```

`loadScript`에 쓰인 이 방식은 사실 매우 흔히 쓰이는 패턴입니다. 이를 "error-first callback" 스타일이라고 부릅니다.

관례는 다음과 같습니다:
1. `callback`의 첫 번째 인수는 에러를 위해 남겨둡니다. 에러가 발생한 경우에 `callback(err)`이 호출됩니다.
2. 두 번째 인자(그리고 필요하면 다음 인자)는 성공했을 때 결과를 위한 것입니다. 원하는 동작이 성공한 경우 `callback(null, result1, result2...)`이 호출됩니다.

그래서 단일 `callback` 함수는 에러를 보고하거나 결과를 되돌려 주기 위해 사용됩니다.

## 멸망의 피라미드

한 개 혹은 두 개의 중첩 된 호출은 나쁘지 않아 보입니다. 비동기 처리를 위해 쓸만한 방법 같아 보이죠. 처음엔 말입니다. 실제로 많이 쓰이기도 하고요.

하지만 꼬리에 꼬리를 무는 비동기 동작이 많아지면 아래와 같은 코드 작성이 불가피해집니다.

```js
loadScript('1.js', function(error, script) {

  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', function(error, script) {
      if (error) {
        handleError(error);
      } else {
        // ...
        loadScript('3.js', function(error, script) {
          if (error) {
            handleError(error);
          } else {
  *!*
            // ...모든 스크립트가 로딩되면 다른 동작을 수행합니다(*)
  */!*
          }
        });

      }
    })
  }
});
```

위 코드는:
1. `1.js`를 로드합니다, 그 후 에러가 없다면,
2. `2.js`를 로드합니다, 그 후 에러가 없다면,
3. `3.js`를 로드합니다, 그 후 에러가 없다면 -- 다른 작업`(*)`을 합니다.

호출이 중첩됨에 따라, 코드는 더욱더 깊어지고 관리는 점점 더 힘들어집니다. `...`를 실제 코드인 반복문과 조건문으로 대체해서 보면, 복잡성은 더 심각해집니다. 

이런 경우를 "콜백 지옥(collback hell)" 또는 "멸망의 피라미드(pyramid of doom)"라고 부릅니다.

![](callback-hell.png)

비동기 동작이 하나씩 더해질 때마다 중첩호출이 만들어내는 "피라미드"는 오른쪽으로 점점 늘어납니다. 곧 손쓸 수 없는 지경까지 늘어나 버립니다.

이런 코딩 방식은 좋지 않습니다.

각 동작을 독립적인 함수로 만들면 문제를 완화할 수 있을 겁니다. 이렇게요:

```js
loadScript('1.js', step1);

function step1(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', step2);
  }
}

function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('3.js', step3);
  }
}

function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...모든 스크립트가 로딩되면 다른 동작을 수행합니다. (*)
  }
};
```

보이시죠? 새롭게 작성한 코드는 동일하게 동작합니다. 다만, 깊은 중첩이 없죠. 각 동작을 분리된 상위 레벨의 함수로 만들었기 때문입니다.

이렇게 작성해도 동작은 합니다. 하지만 코드가 찢어진 종잇조각같이 보이네요. 읽기도 불편하고, 코드를 읽기 위해 눈을 이리저리 왔다 갔다 해서 불편합니다. 코드에 익숙지 않아 눈을 어디로 옮겨야 할지 모르면 더욱 그렇습니다. 

`step*`이라고 명명한 함수들도 단지 "멸망의 피라미드(pyramid of doom)"을 피하고자 만들어졌기 때문에 한 번만 쓰고 버려집니다. 연쇄 동작이 끝나면 밖에서 더는 재사용되지 않을 함수가 되어버립니다. 그래서 좀 난잡하게 이름을 짓고 말아버린 것입니다.

더 나은 무언가가 필요합니다.

운 좋게도, 이런 피라미드를 피할 방법들이 있습니다. 가장 좋은 방법의 하나는 다음 주제에서 설명할 "프라미스(promise)"를 사용하는 것입니다.
