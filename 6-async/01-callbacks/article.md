

# 콜백 입문

자바스크립트에서 많은 동작은 *비동기*입니다.

예를 들어, `loadScript(src)` 함수를 봅시다.

```js
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

이 함수의 역할은 새로운 스크립트를 불러오는 것입니다. `<script src="…">`를 만들 때, 브라우저는 이것을 불러오고 실행합니다.

우리는 이것을 다음과 같이 사용할 수 있습니다:

```js
// loads and executes the script
loadScript('/my/script.js');
```

이 함수는 "비동기적으로" 호출됩니다, 왜냐하면 (스크립트를 불러오는)행동이 지금이 아니라, 나중에 끝나기 때문입니다.

이 호출은 스크립트 로딩을 시작하고, 그 후에 실행을 계속합니다. 스크립트가 로딩되는 동안 그 아래 코드는 실행을 끝냈을 수도 있습니다. 그리고 만약 로딩이 좀 오래 걸리면, 그동안 다른 스크립트들도 실행될 수 있습니다.

```js
loadScript('/my/script.js');
// the code below loadScript doesn't wait for the script loading to finish
// ...
```

이제 이 스크립트가 로드될 때, 로드되는 새로운 스크립트를 사용하고 싶다고 해 봅시다. 아마도 우리가 실행할 수 있도록 그 안에 새로운 함수를 선언했겠죠.

하지만 만약 `loadScript(...)` 호출 직후에 바로 실행한다면, 그건 작동하지 않을 것입니다.

```js
loadScript('/my/script.js'); // the script has "function newFunction() {…}"

*!*
newFunction(); // no such function!
*/!*
```

자연스럽게 브라우저는 스크립트를 불러올 시간이 없었을 것입니다. 그래서 즉각적인 함수 호출은 실패합니다. `loadScript` 함수는 로드 완료되는 것을 추적하는 방법을 제공하지 않습니다. 스크립트는 로드하고 결국 실행합니다. 그게 다입니다. 하지만 우리는 새로운 함수들과 변수들을 스크립트로부터 사용하기 위해서 로드 완료가 언제 일어나는지 알고 싶습니다. 

`loadScript`의 두 번째 인자로 `callback` 함수를 추가해 봅시다. 이것은 스크립트가 로드될 때 실행 해야 합니다:

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

이제 만약 새로운 함수를 스크립트로부터 호출하고 싶다면, 그것을 콜백 안에 써야 합니다:

```js
loadScript('/my/script.js', function() {
  // the callback runs after the script is loaded
  newFunction(); // so now it works
  ...
});
```

그런 것입니다: 두 번째 인수는 행위가 완료될 때 실행되는 함수(일반적으로 익명 함수)입니다. 

이것 실제로 실행 가능한 스크립트 예시입니다.

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

이것을 "콜백 기반" 스타일의 비동기 프로그래밍이라고 합니다. 비동기적으로 동작하는 함수에는 이 함수가 완료되고 실행할 `callback` 인자를 제공해 주어야 합니다. 

여기서 우리는 `loadScript`에 그렇게 했었죠. 이것이 일반적인 접근법입니다.

## 콜백 속 콜백

어떻게 두 개의 스크립트를 순차적으로 하나를 불러오고 이후에 그다음 스크립트를 불러올 수 있을까요?

일반적인 해결책은 두 번째 `loadScript` 호출을 콜백 안에 두는 것입니다. 이렇게요:

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

바깥 `loadScript`가 완료된 후 이 콜백은 안쪽 `loadScript`를 시작합니다. 

만약 스크립트가 하나 더 필요하다면 어떡할까요?

```js


loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

*!*
    loadScript('/my/script3.js', function(script) {
      // ...continue after all scripts are loaded
    });
*/!*

  })

});
```

네, 모든 새로운 동작은 이제 콜백 안에 있습니다. 단 몇 개의 동작들은 괜찮지만 많다면 좋지 않습니다. 그래서 우리는 곧 다른 방법을 알아보게 될 것입니다.

## 에러 다루기

위의 예제에서 우리는 에러를 고려하지 않았습니다. 만약 스크립트 로딩이 실패한다면? 우리의 콜백은 그것에 반응할 수 있어야 합니다.

여기 로딩 에러를 추적하는 향상된 버전의 `loadScript`가 있습니다:

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

이 코드는 성공적인 로드 시에는 `callback(null, script)`를 호출하고 다른 경우에는 `callback(error)`를 호출합니다.

사용법:
```js
loadScript('/my/script.js', function(error, script) {
  if (error) {
    // handle error
  } else {
    // script loaded successfully
  }
});
```

다시 한번 말하지만, `loadScript`에 쓰인 이 방식은 사실 매우 흔합니다. "선 에러 후 콜백(error-first callback)" 스타일이라고 부르죠.

관례로 다음과 같이 합니다:
1. 에러가 발생하면 `callback`의 첫 번째 인자로 발생한 에러를 받습니다. 그 후 `callback(err)`가 호출됩니다.
2. 두 번째 인자(그리고 필요하면 다음 인자)는 성공했을 때 결과를 위한 것입니다. 그 후 `callback(null, result1, result2...)`이 호출됩니다.

그래서 단일 `callback` 함수는 에러를 보고하거나 결과를 되돌려 주기 위해 사용됩니다.

## 멸망의 피라미드

처음 봤을 때는, 이것은 오래 갈 만한 비동기 코딩 방식입니다. 그리고 정말로 그렇습니다. 한 개 혹은 두 개의 중첩 된 호출에도 괜찮아 보입니다.

하지만 여러 개의 꼬리에 꼬리를 무는 비동기 동작들을 위해서 다음과 같은 코드를 갖게 될 것입니다.

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
            // ...continue after all scripts are loaded (*)
  */!*
          }
        });

      }
    })
  }
});
```

위에 코드에서:
1. 우리는 `1.js`를 로드합니다, 그 후 에러가 없다면,
2. `2.js`를 로드합니다, 그 후 에러가 없다면,
3. `3.js`를 로드합니다, 그 후 에러가 없다면 -- 다른 작업`(*)`을 합니다.

호출이 중첩됨에 따라, 코드는 더욱더 깊어지고 점차 다루기가 힘들어집니다. 특히 `...`대신에 실재 코드를 쓰면, 더 많은 루프와 조건문 등을 포함할 수도 있습니다.

"콜백 지옥collback hell" 또는 "멸망의 피라미드pyramid of doom"라고 불리곤 하는 것이죠.

![](callback-hell.png)

"pyramid" 중첩 호출은 비동기 동작마다 오른쪽으로 늘어납니다. 그러다가 곧 손쓸 수 없게 되죠.

그래서 이런 코딩 방식은 그렇게 좋지 않습니다.

우리는 모든 동작을 독립적인 함수로 만듦으로써 문제를 덜려고 할 수도 있습니다. 이렇게요:

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
    // ...continue after all scripts are loaded (*)
  }
};
```

보이죠? 똑같이 합니다. 그리고 깊은 중첩도 없죠. 이제는 모든 동작을 분리된 상위 레벨의 함수로 만들었기 때문입니다.

 작동은 합니다. 하지만 코드는 찢어진 종잇조각같이 보일 것입니다. 읽기도 불편하고 코드를 읽기 위해 눈을 이리저리 왔다 갔다 해야 한다는 것을 알아챘을 겁니다. 불편하죠. 특히 읽는 사람이 코드를 잘 모르거나 어디로 눈을 옮겨야 할지 모르면 더옥 그렇습니다. 

또한, `step*`이라고 명명한 함수들은 단일로 사용합니다, 이것들은 단지 "멸망의 피라미드pyramid of doom"을 피하고자 만들어졌습니다. 아무도 이것들을 이 연쇄 동작 밖에서 재사용하지는 않을 겁니다. 그래서 좀 난잡한 네임스페이스가 있는 것이죠.

우리는 더 나은 무언가를 원합니다.

운 좋게도, 이런 피라미드를 피할 방법들이 있습니다. 가장 좋은 방법 중 하나는 다음 주제에서 설명할 "promises"를 사용하는 것입니다.
