

# 콜백

```warn header="브라우저 메서드를 사용합니다."
콜백, 프라미스 등을 어떻게 사용하는지 보여드리기 위해 본 챕터에선 브라우저 전용 메서드를 사용할 예정입니다. 스크립트를 불러오고 완성된 문서에 간단한 조작을 하는 예시에서 특히 브라우저 메서드가 사용될 예정입니다.

브라우저 메서드가 익숙하지 않아 예시가 잘 이해되지 않는다면 [문서 객체 모델](/document)의 챕터 몇 개를 읽어보시기 바랍니다.

독자를 위해 최대한 브라우저 메서드를 덜 쓰도록 하겠습니다.
```

자바스크립트 호스트 환경이 제공하는 여러 함수를 사용하면 *비동기(asynchronous)* 동작을 스케줄링 할 수 있습니다. 원하는 때에 동작이 시작하도록 할 수 있죠.

`setTimeout`은 스케줄링에 사용되는 가장 대표적인 함수입니다.

실무에서 맞닥뜨리는 비동기 동작은 아주 다양합니다. 스크립트나 모듈을 로딩하는 것 또한 비동기 동작입니다(이 예시는 뒤에서 구체적으로 다룰 예정입니다).

`src`에 있는 스크립트를 읽어오는 함수 `loadScript(src)`를 예시로 비동기 동작 처리가 어떻게 일어나는지 살펴봅시다.

```js
function loadScript(src) {
  // <script> 태그를 만들고 페이지에 태그를 추가합니다.
  // 태그가 페이지에 추가되면 src에 있는 스크립트를 로딩하고 실행합니다.
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

함수 `loadScript(src)`는 `<script src="…">`를 동적으로 만들고 이를 문서에 추가합니다. 브라우저는 자동으로 태그에 있는 스크립트를 불러오고, 로딩이 완료되면 스크립트를 실행합니다.

`loadScript(src)` 사용법은 다음과 같습니다.

```js
// 해당 경로에 위치한 스크립트를 불러오고 실행함
loadScript('/my/script.js');
```

그런데 이 때 스크립트는 '비동기적으로' 실행됩니다. 로딩은 지금 당장 시작되더라도 실행은 함수가 끝난 후에야 되기 때문입니다.

따라서 `loadScript(…)` 아래에 있는 코드들은 스크립트 로딩이 종료되는 걸 기다리지 않습니다.

```js
loadScript('/my/script.js');
// loadScript 아래의 코드는
// 스크립트 로딩이 끝날 때까지 기다리지 않습니다.
// ...
```

스크립트 로딩이 끝나자마자 이 스크립트를 사용해 무언가를 해야만 한다고 가정해 봅시다. 스크립트 안에 다양한 함수가 정의되어 있고, 우리는 이 함수를 실행하길 원하는 상황입니다.

그런데 `loadScript(...)`를 호출하자마자 내부 함수를 호출하면 원하는 대로 작동하지 않습니다.

```js
loadScript('/my/script.js'); // script.js엔 "function newFunction() {…}"이 있습니다.

*!*
newFunction(); // 함수가 존재하지 않는다는 에러가 발생합니다!
*/!*
```

에러는 브라우저가 스크립트를 읽어올 수 있는 시간을 충분히 확보하지 못했기 때문에 발생합니다. 그런데 현재로서는 함수 `loadScript`에서 스크립트 로딩이 완료되었는지 알 방법이 없네요. 언젠간 스크립트가 로드되고 실행도 되겠지만, 그게 다입니다. 원하는 대로 스크립트 안의 함수나 변수를 사용하려면 스크립트 로딩이 끝났는지 여부를 알 수 있어야 합니다.

`loadScript`의 두 번째 인수로 스크립트 로딩이 끝난 후 실행될 함수인 `콜백(callback)` 함수를 추가해 봅시다(콜백 함수는 나중에 호출할 함수를 의미합니다. - 옮긴이).

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

새롭게 불러온 스크립트에 있는 함수를 콜백 함수 안에서 호출하면 원하는 대로 외부 스크립트 안의 함수를 사용할 수 있습니다. 

```js
loadScript('/my/script.js', function() {
  // 콜백 함수는 스크립트 로드가 끝나면 실행됩니다.
  newFunction(); // 이제 함수 호출이 제대로 동작합니다.
  ...
});
```

이렇게 두 번째 인수로 전달된 함수(대개 익명 함수)는 원하는 동작(위 예제에선 외부 스크립트를 불러오는 것 - 옮긴이)이 완료되었을 때 실행됩니다.

아래는 실제 존재하는 스크립트를 이용해 만든 예시입니다. 직접 실행해 봅시다.

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
  alert( _ ); // 스크립트에 정의된 함수
});
*/!*
```

이런 방식을 '콜백 기반(callback-based)' 비동기 프로그래밍이라고 합니다. 무언가를 비동기적으로 수행하는 함수는 함수 내 동작이 모두 처리된 후 실행되어야 하는 함수가 들어갈 `콜백`을 인수로 반드시 제공해야 합니다.

위 예시에선 `loadScript`의 인수로 콜백을 제공해 주었는데, 이렇게 콜백을 사용한 방식은 비동기 프로그래밍의 일반적인 접근법입니다.

## 콜백 속 콜백

스크립트가 두 개 있는 경우, 어떻게 하면 두 스크립트를 순차적으로 불러올 수 있을까요? 두 번째 스크립트 로딩은 첫 번째 스크립트의 로딩이 끝난 이후가 되길 원한다면 말이죠.

가장 자연스러운 해결 방법은 아래와 같이 콜백 함수 안에서 두 번째 `loadScript`를 호출하는 것입니다.

```js
loadScript('/my/script.js', function(script) {

  alert(`${script.src}을 로딩했습니다. 이젠, 다음 스크립트를 로딩합시다.`);

*!*
  loadScript('/my/script2.js', function(script) {
    alert(`두 번째 스크립트를 성공적으로 로딩했습니다.`);
  });
*/!*

});
```

이렇게 중첩 콜백을 만들면 바깥에 위치한 `loadScript`가 완료된 후, 안쪽 `loadScript`가 실행됩니다. 

그런데 여기에 더하여 스크립트를 하나 더 불러오고 싶다면 어떻게 해야 할까요?

```js
loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

*!*
    loadScript('/my/script3.js', function(script) {
      // 세 스크립트 로딩이 끝난 후 실행됨
    });
*/!*

  })

});
```

위와 같이 모든 새로운 동작이 콜백 안에 위치하게 작성하면 됩니다. 그런데 이렇게 콜백 안에 콜백을 넣는 것은 수행하려는 동작이 단 몇 개뿐이라면 괜찮지만, 동작이 많은 경우엔 좋지 않습니다. 다른 방식으로 코드를 작성하는 방법은 곧 알아보도록 하겠습니다.

## 에러 핸들링

지금까지 살펴본 예시들은 스크립트 로딩이 실패하는 경우 등의 에러를 고려하지 않고 작성되었습니다. 그런데 스크립트 로딩이 실패할 가능성은 언제나 있습니다. 물론 콜백 함수는 이런 에러를 핸들링할 수 있어야 하죠.

`loadScript`에서 로딩 에러를 추적할 수 있게 기능을 개선해봅시다.

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

*!*
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`${src}를 불러오는 도중에 에러가 발생했습니다.`));
*/!*

  document.head.append(script);
}
```

이제 `loadScript`는 스크립트 로딩에 성공하면 `callback(null, script)`을, 실패하면 `callback(error)`을 호출합니다.

개선된 `loadScript`의 사용법은 다음과 같습니다. 
```js
loadScript('/my/script.js', function(error, script) {
  if (error) {
    // 에러 처리
  } else {
    // 스크립트 로딩이 성공적으로 끝남
  }
});
```

이렇게 에러를 처리하는 방식은 흔히 사용되는 패턴입니다. 이런 패턴은 '오류 우선 콜백(error-first callback)'이라고 불립니다.

오류 우선 콜백은 다음 관례를 따릅니다.
1. `callback`의 첫 번째 인수는 에러를 위해 남겨둡니다. 에러가 발생하면 이 인수를 이용해 `callback(err)`이 호출됩니다.
2. 두 번째 인수(필요하면 인수를 더 추가할 수 있음)는 에러가 발생하지 않았을 때를 위해 남겨둡니다. 원하는 동작이 성공한 경우엔 `callback(null, result1, result2...)`이 호출됩니다.

오류 우선 콜백 스타일을 사용하면, 단일 `콜백` 함수에서 에러 케이스와 성공 케이스 모두를 처리할 수 있습니다.

## 멸망의 피라미드

콜백 기반 비동기 처리는 언뜻 봤을 때 꽤 쓸만해 보이고, 실제로도 그렇습니다. 한 개 혹은 두 개의 중첩 호출이 있는 경우는 보기에도 나쁘지 않습니다. 

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
            // 모든 스크립트가 로딩된 후, 실행 흐름이 이어집니다. (*)
  */!*
          }
        });

      }
    })
  }
});
```

위 코드는 다음과 같이 동작합니다.
1. `1.js`를 로드합니다. 그 후 에러가 없으면,
2. `2.js`를 로드합니다. 그 후 에러가 없으면,
3. `3.js`를 로드합니다. 그 후 에러가 없으면 `(*)`로 표시한 줄에서 또 다른 작업을 수행합니다.

호출이 계속 중첩되면서 코드가 깊어지고 있네요. 본문 중간중간 `...`로 표시한 곳에 반복문과 조건문이 있는 코드가 들어가면 관리는 특히나 더 힘들어질 겁니다.

이렇게 깊은 중첩 코드가 만들어내는 패턴은 소위 '콜백 지옥(callback hell)' 혹은 '멸망의 피라미드(pyramid of doom)'라고 불립니다.

<!--
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
            // ...
          }
        });
      }
    })
  }
});
-->

![](callback-hell.svg)

비동기 동작이 하나씩 추가될 때마다 중첩 호출이 만들어내는 '피라미드'는 오른쪽으로 점점 커집니다. 곧 손쓸 수 없는 지경이 되어버리죠.

따라서 이런 코딩 방식은 좋지 않습니다.

각 동작을 독립적인 함수로 만들어 위와 같은 문제를 완화해 보도록 합시다. 아래와 같이 말이죠.

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

어떤가요? 새롭게 작성한 코드는 각 동작을 분리해 최상위 레벨의 함수로 만들었기 때문에 깊은 중첩이 없습니다. 그리고 콜백 기반 스타일 코드와 동일하게 동작하죠.

그런데 이렇게 작성하면 동작상의 문제는 없지만, 코드가 찢어진 종잇조각 같아 보인다는 문제가 생깁니다. 읽는 것도 어려워지죠. 눈을 이리저리 움직이며 코드를 읽어야 합니다. 코드에 익숙지 않아 눈을 어디로 옮겨야 할지 모르면 더욱더 불편할 것입니다.

게다가 `step*`이라고 명명한 함수들은 '멸망의 피라미드'를 피하려는 용도만으로 만들었기 때문에 재사용이 불가능합니다. 그 누구도 연쇄 동작이 이뤄지는 코드 밖에선 함수들을 재활용하지 않을 겁니다. 네임스페이스가 약간 복잡해졌네요(namespace cluttering).

지금쯤이면 더 나은 무언가가 필요하다는 생각이 강하게 들 겁니다.

운 좋게도, 멸망의 피라미드를 피할 방법이 몇 가지 있습니다. 가장 좋은 방법 중 하나는 다음 챕터에서 설명할 '프라미스(promise)'를 사용하는 것입니다.
