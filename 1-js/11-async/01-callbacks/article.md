

# 콜백 입문

자바스크립트 내 동작은 상당수가 *비동기(asynchronous)적*으로 처리됩니다.

아래 `loadScript(src)` 함수를 살펴봅시다.

```js
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

이 함수는 새로운 스크립트를 불러오기 위해 만들어졌습니다. 함수가 `<script src="…">`로 스크립트를 문서에 추가하면, 브라우저는 스크립트를 불러오고 이를 실행합니다.

함수를 호출해 스크립트를 읽어봅시다.

```js
// 스크립트를 불러오고 실행함
loadScript('/my/script.js');
```

이 함수는 "비동기적으로" 호출됩니다, 왜냐하면 지금이 아니라 나중에 (스크립트를 읽는 게) 끝나기 때문입니다.

함수를 호출하면 스크립트 로딩이 시작되고, 실행 흐름은 죽 이어집니다. 외부 스크립트가 로딩되는 동안 함수 호출에 쓰인 코드의 아래쪽 코드는 이미 실행이 끝났을 수 있습니다. 외부 스크립트 로딩에 많은 시간이 소요되면, 그동안 다른 내부 코드도 실행될 수 있습니다.

```js
loadScript('/my/script.js');
// loadScript 아래의 코드는 스크립트 로딩이 끝날 때까지 기다리지 않고 실행됩니다.
// ...
```

새로 불러온 스크립트를 사용하여 뭔가를 하고 싶다 가정해 봅시다. 이 스크립트 안의 다양한 함수를 호출해 응용해 볼 겁니다.

그런데 `loadScript(...)` 호출 직후에 (스크립트 로딩이 끝나길 기다리지 않고) 내부 함수를 바로 호출하면, 우리가 원하는 대로 작동하지 않습니다.

```js
loadScript('/my/script.js'); // 스크립트 안엔 "function newFunction() {…}"이 있습니다

*!*
newFunction(); // 함수가 존재하지 않는다는 에러가 발생합니다!
*/!*
```

브라우저가 스크립트를 읽어올 수 있는 시간을 충분히 확보하지 못했기 때문에 스크립트 내의 함수를 호출에 실패했습니다. 지금으로선 `loadScript` 함수를 이용해 스크립트 로딩이 끝났는지 알 수 없습니다. 스크립트를 불러오고, 언젠가 이 스크립트가 실행되겠지만, 그게 다입니다. 하지만 스크립트 안의 함수나 변수를 사용하려면, 언제 스크립트 로딩이 끝났는지를 알아야 합니다.

`loadScript`의 두 번째 인수로 `콜백(callback)` 함수를 추가해 봅시다. 콜백은 나중에 호출할 함수입니다. 여기선 스크립트 로딩이 끝난 후 실행되어야 하는 함수가 되겠죠.

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

스크립트 안에 정의된 함수인 newFunction을 콜백 함수 안에서 호출하면, 에러 없이 newFunction을 호출할 수 있습니다.

```js
loadScript('/my/script.js', function() {
  // 스크립트 로드가 끝나면 콜백 함수가 실행됨
  newFunction(); // 이제 함수 호출이 제대로 작동함
  ...
});
```

이제 감이 오셨죠? 두 번째 인수로 함수(대게 익명 함수)가 전달되는데, 이 익명 함수는 동작이 완료되었을 때 실행됩니다.

아래는 실제 존재하는 외부 스크립트를 불러오는 코드입니다.

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

위에서 살펴본 방식을 "콜백 기반(callback-based)" 비동기 프로그래밍이라고 합니다. 비동기로 동작하는 함수는 함수 실행이 완료되고 나서 실행되는 `콜백` 인수가 꼭 있어야 합니다.

`loadScript`에서 콜백 인수를 명시해 주었던걸 기억하실 겁니다. 콜백을 사용한 방식은 비동기 프로그래밍의 일반적인 접근법입니다.

## 콜백 속 콜백

두 개의 스크립트가 있을 때, 어떻게 이 스크립트를 순차적으로 불러올 수 있을까요? 하나를 불러오는 게 끝나면, 다음 스크립트를 불러오는 것 같이 말이죠.

일반적인 해결책은 콜백 함수 안에서 두 번째 `loadScript` 함수를 호출하는 것입니다. 다음과 같이 말이죠.

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

바깥 `loadScript`가 완료된 후, 콜백 함수는 안쪽 `loadScript`를 실행합니다. 

만약 스크립트가 하나 더 필요하다면 어떻게 해야 할까요?

```js
loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

*!*
    loadScript('/my/script3.js', function(script) {
      // 모든 스크립트의 로딩이 끝난 후 실행됨
    });
*/!*

  })

});
```

이제 새로운 모든 동작이 콜백 안에서 실행되고 있네요. 동작이 단 몇 개만 있다면 이렇게 작성해도 괜찮겠지만, 동작이 많다면 이런 식으로 작성하는 게 좋지 않습니다. 다른 방법을 알아볼 때가 되었네요.

## 에러 핸들링

위 예제는 에러를 고려하지 않고 작성되었습니다. 스크립트 로딩이 실패하는 경우 등에 대응하지 못합니다. 하지만 콜백 함수는 에러를 핸들링할 수 있어야 합니다.

새롭게 작성한 `loadScript`에서는 로딩 에러를 추적할 수 있습니다.

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

스크립트 로딩이 성공적으로 끝난 경우는 `callback(null, script)`이 호출되고, 실패한 경우는 `callback(error)`이 호출됩니다.

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

`loadScript` 함수는 자주 쓰이는 방식들로 만들었습니다. 여기서 에러 처리는 "오류 우선 콜백(error-first callback)" 스타일이라 부르는 방식으로 작성되었습니다.

오류 우선 콜백은 다음 관례를 따릅니다.
1. `callback`의 첫 번째 인수는 에러를 위해 남겨둡니다. 에러가 발생하면 이 인수를 이용해 `callback(err)`이 호출됩니다.
2. 두 번째 인수(필요하면 또 다른 인수)는 에러가 발생하지 않았을 때를 위해 남겨둡니다. 원하는 동작이 성공한 경우엔 `callback(null, result1, result2...)`이 호출됩니다.

이처럼 "오류 우선 콜백" 스타일을 사용해 콜백 함수를 작성하면, 단일 `콜백` 함수는 실패와 성공 모두를 처리할 수 있게 됩니다.

## 멸망의 피라미드

위의 예제에서 쓰인 콜백 기반 비동기 처리는 나쁘지 않아 보입니다. 실제로 그렇죠. 한 개 혹은 두 개의 콜백이 있는 경우는 전혀 문제가 없어 보입니다. 

하지만 꼬리에 꼬리를 무는 비동기 동작이 많아지면, 아래와 같은 코드 작성이 불가피해집니다.

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
            // 모든 스크립트가 로딩되면 다른 동작을 수행합니다(*)
  */!*
          }
        });

      }
    })
  }
});
```

위 코드는 다음과 같이 동작합니다.
1. `1.js`를 로드합니다, 그 후 에러가 없다면,
2. `2.js`를 로드합니다, 그 후 에러가 없다면,
3. `3.js`를 로드합니다, 그 후 에러가 없다면 -- 다른 작업`(*)`을 합니다.

호출이 중첩됨에 따라, 코드는 더욱더 깊어지고 관리는 점점 더 힘들어집니다. `(*)`로 표시한 곳에 실제 코드가 들어가면, 코드 내의 반복문과 조건문 때문에 전체 코드는 더 복잡해 보일 겁니다. 

이런 경우를 "콜백 지옥(callback hell)" 또는 "멸망의 피라미드(pyramid of doom)"라고 부릅니다.

![](callback-hell.png)

비동기 동작이 하나씩 추가될 때마다 중첩 호출이 만들어내는 "피라미드"는 오른쪽으로 점점 커집니다. 곧 손쓸 수 없는 지경까지 커져 버리죠.

이런 코딩 방식은 좋지 않습니다.

비동기 동작 각각을 독립적인 함수로 만들면 위와 같은 문제를 완화할 수 있을 겁니다. 다음같이 말이죠. 

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
    // 모든 스크립트가 로딩되면 다른 동작을 수행합니다. (*)
  }
};
```

보이시죠? 새롭게 작성한 코드는 위에서 콜백 기반 스타일 코드와 동일하게 동작합니다. 다만, 깊은 중첩이 없죠. 각 동작을 분리된 상위 레벨의 함수로 만들었기 때문입니다.

이렇게 작성해도 문제는 없습니다. 하지만 코드가 찢어진 종잇조각 같아 보이네요. 읽기도 불편하고, 코드를 읽으려면 눈을 이리저리 왔다 갔다 해야 합니다. 이 코드에 익숙지 않아 눈을 어디로 옮겨야 할지 모르면 더욱더 그렇습니다. 

`step*`이라고 명명한 함수들도 단지 "멸망의 피라미드(pyramid of doom)"을 피하고자 만들어졌기 때문에 재사용 할 수 없습니다. 연쇄 동작이 끝나면 밖에서 더는 필요하지 않은 함수가 되어버립니다. 그래 좀 난잡하게 이름을 짓고 말아버렸죠.

더 나은 무언가가 필요한 상황입니다.

운 좋게도, 멸망의 피라미드를 피할 방법들이 있습니다. 가장 좋은 방법의 하나는 다음 주제에서 설명할 "프라미스(promise)"를 사용하는 것입니다.
