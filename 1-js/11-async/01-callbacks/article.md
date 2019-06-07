

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

사용법은 아래와 같습니다.

```js
// 스크립트를 불러오고 실행함
loadScript('/my/script.js');
```

함수 호출은 "비동기적으로" 이뤄집니다. 스크립트를 읽는 동작이 지금이 아니라 나중에 종료되기 때문입니다.

함수를 호출하면 스크립트 로딩이 시작되고, 실행 흐름은 멈추지 않고 계속 진행됩니다. 외부 스크립트가 로딩되는 동안, 함수를 호출한 부분의 아래쪽 코드는 이미 실행이 끝났을 수 있습니다. 스크립트를 불러오는 데 오래 걸리는 경우엔 다른 내부 코드도 스크립트를 불러오기 전에 실행될 수 있습니다.

```js
loadScript('/my/script.js');
// loadScript 아래의 코드는 스크립트 로딩이 끝날 때까지 기다리지 않고 실행됩니다.
// ...
```

새로 불러온 스크립트를 사용하여 뭔가를 하고 싶다 가정해 봅시다. 스크립트 안에 다양한 함수가 정의되어 있을 텐데, 이 함수들을 실행해 무언갈 해보죠.

그런데 `loadScript(...)` 호출 직후에 (스크립트 로딩이 끝나길 기다리지 않고) 내부 함수를 바로 호출하면, 원하는 대로 작동하지 않습니다.

```js
loadScript('/my/script.js'); // 스크립트 안엔 "function newFunction() {…}"이 있습니다.

*!*
newFunction(); // 함수가 존재하지 않는다는 에러가 발생합니다!
*/!*
```

브라우저가 스크립트를 읽어올 수 있는 시간을 충분히 확보하지 못했기 때문에, 스크립트 내의 함수를 호출하려는 작업은 실패합니다. 지금 상황에선 스크립트 로딩이 끝났는지를 알려주는 기능을 `loadScript` 함수에선 지원하지 않습니다. 스크립트가 언젠간 로드되고 실행도 되겠지만, 그게 다입니다. 하지만 스크립트 안의 함수나 변수를 사용하려면, 스크립트 로딩이 언제 끝났는지를 알아야 합니다.

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

외부 스크립트 안에 정의된 함수를 호출하려면, 이에 관련된 코드를 콜백 안에 작성하면 됩니다.

```js
loadScript('/my/script.js', function() {
  // 스크립트 로드가 끝나면 콜백 함수가 실행됩니다.
  newFunction(); // 이제 함수 호출이 제대로 동작합니다.
  ...
});
```

위와같이 두 번째 인수로 함수(대게 익명 함수)가 전달되는데, 이 익명 함수는 동작이 완료되었을 때 실행됩니다.

아래는 실제 존재하는 외부 스크립트를 불러오는 코드입니다. 직접 실행해 봅시다.

```js run
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(script);
  document.head.append(script);
}

*!*
loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', script => {
  alert(`${script.src}가 로드되었습니다.`);
  alert( _ ); // 외부에서 불러온 스크립트 내에 정의된 함수
});
*/!*
```

이런 방식을 "콜백 기반(callback-based)" 비동기 프로그래밍이라고 합니다. 비동기로 동작시켜야 하는 함수엔 함수 실행이 종료되고 난 후 실행되는 `콜백` 인수가 꼭 있어야 합니다.

`loadScript`에서 콜백 인수를 명시해 주었던 걸 기억하실 겁니다. 이렇게 콜백을 사용한 방식은 비동기 프로그래밍의 일반적인 접근법입니다.

## 콜백 속 콜백

두 개의 스크립트가 있을 때, 어떻게 이 스크립트를 순차적으로 불러올 수 있을까요? 하나를 불러오는 게 끝나면, 다음 스크립트를 불러오는 것 같이 말이죠.

일반적인 해결책은 콜백 함수 안에서 두 번째 `loadScript` 함수를 호출하는 것입니다. 다음과 같이 말이죠.

```js
loadScript('/my/script.js', function(script) {

  alert(`${script.src}을 불러왔습니다. 이젠, 다음 스크립트를 불러봅시다.`);

*!*
  loadScript('/my/script2.js', function(script) {
    alert(`두 번째 스크립트를 성공적으로 불러왔습니다.`);
  });
*/!*

});
```

바깥의 `loadScript`가 완료된 후, 콜백 함수는 안쪽 `loadScript`를 실행합니다. 

만약 불러올 스크립트가 하나 더 있다면 어떻게 해야 할까요?

```js
loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

*!*
    loadScript('/my/script3.js', function(script) {
      // 모든 스크립트를 불러온 후 실행됨
    });
*/!*

  })

});
```

이제 새로운 모든 동작이 콜백 안에 위치하게 되었습니다. 그런데 수행하려는 동작이 단 몇 개뿐이라면 이렇게 작성해도 괜찮지만, 동작이 많다면 이런 식으로 작성하는 게 좋지 않습니다. 더 다른 방법에 대해선 곧 알아보도록 하겠습니다.

## 에러 핸들링

위 예제는 스크립트 로딩이 실패하는 경우 등의 에러를 고려하지 않고 작성되었습니다. 콜백 함수는 에러를 핸들링할 수 있어야 합니다.

새롭게 작성한 아래 `loadScript`에서는 로딩 에러를 추적할 수 있습니다.

```js run
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

*!*
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src}를 불러오는 도중에 에러가 발생함.`));
*/!*

  document.head.append(script);
}
```

스크립트 로딩이 성공적으로 끝난 경우엔 `callback(null, script)`이 호출되고, 실패한 경우엔 `callback(error)`이 호출됩니다.

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

`loadScript` 함수에서 발생하는 에러는 "오류 우선 콜백(error-first callback)" 스타일이라 부르는 방식으로 처리되었습니다.

오류 우선 콜백은 다음 관례를 따릅니다.
1. `callback`의 첫 번째 인수는 에러를 위해 남겨둡니다. 에러가 발생하면 이 인수를 이용해 `callback(err)`이 호출됩니다.
2. 두 번째 인수(필요하면 또 다른 인수)는 에러가 발생하지 않았을 때를 위해 남겨둡니다. 원하는 동작이 성공한 경우엔 `callback(null, result1, result2...)`이 호출됩니다.

이처럼 "오류 우선 콜백" 스타일을 사용해 콜백 함수를 작성하면, 단일 `콜백` 함수에서 실패 케이스와 성공 케이스 모두를 처리할 수 있게 됩니다.

## 멸망의 피라미드

위의 예제에서 쓰인 콜백 기반 비동기 처리는 쓸만해 보입니다. 한 개 혹은 두 개의 콜백이 있는 경우는 보기에도 나쁘지 않고, 문제도 없어 보이죠. 

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
            // 모든 스크립트가 로딩된 후, 실행 흐름이 이어집니다(*).
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
3. `3.js`를 로드합니다, 그 후 에러가 없다면 `(*)`로 표시한 줄에서 다른 작업을 수행합니다.

호출이 계속 중첩되면서 코드 역시 더욱더 깊어지고 있습니다. 이렇게 코드를 작성하면 관리가 힘들어집니다. `(*)`로 표시한 곳에 들어갈 코드 안에 반복문과 조건문이 있다면 전체 코드는 더 복잡해지겠네요. 

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

보이시죠? 새롭게 작성한 코드는 위에서 작성한 콜백 기반 스타일 코드와 동일하게 동작합니다. 다만, 각 동작을 분리된 상위 레벨의 함수로 만들었기 때문에 깊은 중첩이 없습니다.

이렇게 작성해도 문제는 없습니다만, 코드가 찢어진 종잇조각 같아 보이네요. 코드를 읽으려면 눈을 이리저리 왔다 갔다 해야 해서 불편합니다. 코드에 익숙지 않아 눈을 어디로 옮겨야 할지 모르면 더욱더 그렇습니다. 

`step*`이라고 명명한 함수들도 단지 "멸망의 피라미드(pyramid of doom)"을 피하고자 만들었기 때문에 재사용할 수 없습니다. 연쇄 동작이 밖에선 아무도 이 함수를 재활용하지 않을 겁니다. 약간의 네임스페이스가 형성된 것과 같은 효과네요.

더 나은 무언가가 필요한 상황입니다.

운 좋게도, 멸망의 피라미드를 피할 방법들이 몇 가지 있습니다. 가장 좋은 방법 중 하나는 다음 주제에서 설명할 "프라미스(promise)"를 사용하는 것입니다.
