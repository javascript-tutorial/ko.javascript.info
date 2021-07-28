<<<<<<< HEAD
# Chrome으로 디버깅하기
=======
# Debugging in the browser
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

좀 더 복잡한 코드를 작성하기 전에, 디버깅이란 것에 대해 이야기해봅시다.

[디버깅(debugging)](https://en.wikipedia.org/wiki/Debugging)은 스크립트 내 에러를 검출해 제거하는 일련의 과정을 의미합니다. 모던 브라우저와 호스트 환경 대부분은 개발자 도구 안에 UI 형태로 디버깅 툴을 구비해 놓습니다. 디버깅 툴을 사용하면 디버깅이 훨씬 쉬워지고, 실행 단계마다 어떤 일이 일어나는지를 코드 단위로 추적할 수 있습니다.

이 글에선 Chrome 브라우저에서 제공하는 디버깅 툴을 사용하도록 하겠습니다. 기능이 다양하고, Chrome에 익숙해지면 다른 브라우저에서 지원하는 디버깅 툴은 쉽게 익힐 수 있기 때문입니다.

## 'Sources' 패널

Chrome 버전에 따라 보이는 화면은 약간씩 다를 수 있습니다. 하지만 버전이 바뀌어도 구성은 크게 바뀌지 않기 때문에 화면 캡쳐본과 함께 설명을 이어나가겠습니다. 

- Chrome을 사용해 [예시 페이지](debugging/index.html)를 엽니다.
- `key:F12`(MacOS: `key:Cmd+Opt+I`)를 눌러 개발자 도구를 엽니다.
- `Sources` 탭을 클릭해 `Sources` 패널(panel)을 엽니다.

Sources 패널을 처음 열었다면 아래와 같은 화면이 보일 겁니다.

![](chrome-open-sources.svg)

토글 버튼 <span class="devtools" style="background-position:-172px -98px"></span>을 누르면 navigator가 열리면서 현재 사이트와 관련된 파일들이 나열됩니다.

파일 목록에서 `hello.js`를 클릭해 아래와 같이 화면을 바꿔봅시다.

![](chrome-tabs.svg)

Sources 패널은 크게 세 개의 영역으로 구성됩니다.

1. **파일 탐색 영역** --  페이지를 구성하는 데 쓰인 모든 리소스(HTML, JavaScript, CSS, 이미지 파일 등)를 트리 형태로 보여줍니다. Chrome 익스텐션이 여기 나타날 때도 있습니다.
2. **코드 에디터 영역** -- 리소스 영역에서 선택한 파일의 소스 코드를 보여줍니다. 여기서 소스 코드를 편집할 수도 있습니다.
3. **자바스크립트 디버깅 영역** -- 디버깅에 관련된 기능을 제공합니다. 곧 자세히 살펴보겠습니다.

토글 버튼 <span class="devtools" style="background-position:-172px -122px"></span>을 다시 누르면 리소스 영역이 사라지고, 소스 코드 영역이 더 넓어집니다.

## 콘솔

`key:Esc`를 누르면 개발자 도구 하단부에 콘솔 창이 열립니다. 여기에 명령어를 입력하고 `key:Enter`를 누르면 입력한 명령어가 실행됩니다.

콘솔 창에 구문(statement)을 입력하고 실행하면 아랫줄에 실행 결과가 출력됩니다.

`1+2`를 입력하면 `3`이 출력되고, `hello("debugger")`를 입력하면 `undefined`가 출력되죠. `undefined`가 출력되는 이유는 `hello("debugger")`가 아무것도 반환하지 않기 때문입니다.

![](chrome-sources-console.svg)

## 중단점

[예시 페이지](debugging/index.html) 내부에서 무슨 일이 일어나는지 자세히 살펴봅시다. `hello.js`를 소스 코드 영역에 띄우고 네 번째 줄 코드 좌측의 줄 번호, `4`를 클릭합시다. 코드가 아닌 줄 번호 `4`에 마우스 커서를 옮긴 후 클릭해야 합니다.

축하합니다! 중단점을 성공적으로 설정하셨습니다. 줄 번호 `8`도 클릭해 중단점을 하나 더 추가해봅시다.

지금까지 잘 따라오셨다면 아래와 같은 화면이 보여야 합니다. 줄 번호 `4`와 `8`이 파란색으로 바뀐 게 보이시죠?

![](chrome-sources-breakpoint.svg)

*중단점(breakpoint)* 은 말 그대로 자바스크립트의 실행이 중단되는 코드 내 지점을 의미합니다.

중단점을 이용하면 실행이 중지된 시점에 변수가 어떤 값을 담고 있는지 알 수 있습니다. 또한 실행이 중지된 시점을 기준으로 명령어를 실행할 수도 있습니다. 디버깅이 가능해지는 것이죠.

Sources 패널 우측의 디버깅 영역을 보면 중단점 목록을 확인할 수 있습니다. 파일 여러 개에 다수의 중단점을 설정해 놓은 경우, 디버깅 영역을 이용하면 아래와 같은 작업을 할 수도 있습니다.
- 항목을 클릭해 해당 중단점이 설정된 곳으로 바로 이동할 수 있습니다.
- 체크 박스 선택을 해제해 해당 중단점을 비활성화 할 수 있습니다.
- 마우스 오른쪽 버튼을 클릭했을 때 나오는 'Remove breakpoint' 옵션을 통해 중단점을 삭제할 수도 있습니다.
- 이 외에도 다양한 기능이 있습니다.

```smart header="조건부 중단점"
줄 번호에 커서를 옮긴 후 마우스 오른쪽 버튼을 클릭하면 *조건부 중단점(conditional breakpoint)* 을 설정할 수 있습니다. `Add conditional breakpoint`를 클릭했을 때 뜨는 작은 창에 표현식을 입력하면, 표현식이 참인 경우에만 실행을 중지시킬 수 있습니다.

조건부 중단점을 설정하면 변수에 특정 값이 할당될 때나 함수의 매개 변수에 특정 값이 들어올 때만 실행을 중단시킬 수 있어 디버깅 시 유용하게 활용할 수 있습니다. 
```

## debugger 명령어

아래 예시처럼 스크립트 내에 `debugger` 명령어를 적어주면 중단점을 설정한 것과 같은 효과를 봅니다.

```js
function hello(name) {
  let phrase = `Hello, ${name}!`;

*!*
  debugger;  // <-- 여기서 실행이 멈춥니다.
*/!*

  say(phrase);
}
```

debugger 명령어를 사용하면 브라우저를 켜 개발자 도구를 열고 소스 코드 영역을 띄워 중단점을 설정하는 수고를 하지 않아도 됩니다. 에디터를 떠나지 않고도 중단점을 설정할 수 있기 때문에 편리하죠.


## 멈추면 보이는 것들

예시 페이지를 열면 함수 `hello()`가 자동으로 호출됩니다. 중단점이 제대로 설정되어있는지 확인하고, 새로 고침 단축키 `key:F5`(Windows, Linux 사용자)나 `key:Cmd+R`키(MacOS 사용자)를 눌러 중단점을 작동시켜봅시다.

아래 그림과 같이 네 번째 줄에서 실행이 중단되는 것을 확인할 수 있습니다.

![](chrome-sources-debugger-pause.svg)

이 상태에서 디버깅 영역의 `▼`를 클릭해 하위 패널들을 하나씩 펼쳐봅시다. 각 패널은 아래와 같은 기능을 제공합니다.

1. **`Watch` -- 표현식을 평가하고 결과를 보여줍니다.**

    Add Expression 버튼 `+`를 클릭해 원하는 표현식을 입력한 후 `key:Enter`를 누르면 중단 시점의 값을 보여줍니다. 입력한 표현식은 실행 과정 중에 계속해서 재평가됩니다. 

2. **`Call Stack` -- 코드를 해당 중단점으로 안내한 실행 경로를 역순으로 표시합니다.**

    실행은 `index.html` 안에서 `hello()`를 호출하는 과정 중에 멈췄습니다. 함수 `hello` 내에 중단점을 설정했기 때문에, 콜 스택(Call Stack) 최상단엔 `hello`가 위치합니다. `index.html`에서 함수 `hello`를 정의하지 않았기 때문에 콜 스택 하단엔 'anonymous'가 출력됩니다.

    콜 스택 내의 항목을 클릭하면 디버거가 해당 코드로 휙 움직이고, 변수 역시 재평가됩니다. 'anonymous'를 클릭해 직접 확인해 봅시다.
3. **`Scope` -- 현재 정의된 모든 변수를 출력합니다.**

    `Local`은 함수의 지역변수를 보여줍니다. 지역 변수 정보는 소스 코드 영역에서도 확인(강조 표시)할 수 있습니다. 

    `Global`은 함수 바깥에 정의된 전역 변수를 보여줍니다.

    `Local` 하위 항목으로 `this`에 대한 정보도 출력되는데, 이에 대해선 추후에 학습하도록 하겠습니다.

## 실행 추적하기

이제 본격적으로 실행 단계마다 어떤 일이 일어나는지 *추적* 해보겠습니다.

먼저, 디버깅 영역 상단에 있는 버튼들이 무슨 역할을 하는지 알아봅시다.
<!-- https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/Images/src/largeIcons.svg -->
<span class="devtools" style="background-position:-146px -168px"></span> -- 'Resume': 스크립트 실행을 다시 시작함 (단축키 `key:F8`)
: 실행을 재개합니다. 추가 중단점이 없는 경우, 실행이 죽 이어지고 디버거는 동작하지 않습니다.

    버튼을 클릭해봅시다.
    
    ![](chrome-sources-debugger-trace-1.svg)
    
    실행이 다시 시작되다가 함수 `say()` 안에 설정한 중단점에서 실행이 멈춥니다. 이 시점에서 우측의 'Call Stack'을 살펴보면 스택 최상단에 콜(`say`)이 하나 더 추가된 것을 확인할 수 있습니다. 현재 실행은 `say()` 안에 멈춰있는 상황입니다.

<span class="devtools" style="background-position:-200px -190px"></span> -- 'Step': 다음 명령어를 실행함 (단축키 `key:F9`)
: 다음 문을 실행합니다. 클릭하면 `alert` 창이 뜨는 것을 확인할 수 있습니다.

    Step 버튼을 계속 누르면 스크립트 전체를 문 단위로 하나하나 실행할 수 있습니다.

<<<<<<< HEAD
<span class="devtools" style="background-position:-62px -192px"></span> -- 'Step over': 다음 명령어를 실행하되, *함수 안으로 들어가진 않음* (단축키 `key:F10`)
: 'Step'과 유사하지만, 다음 문이 함수 호출일 때 'Step'과는 다르게 동작합니다(`alert` 같은 내장함수에는 해당하지 않고, 직접 작성한 함수일 때만 동작이 다릅니다).
=======
<span class="devtools" style="background-position:-62px -192px"></span> -- "Step over": run the next command, but *don't go into a function*, hotkey `key:F10`.
: Similar to the previous "Step" command, but behaves differently if the next statement is a function call. That is: not a built-in, like `alert`, but a function of our own.
>>>>>>> ef8d576821ff28c69bfb7410dc79fd216b0a315b

    'Step'은 함수 내부로 들어가 함수 본문 첫 번째 줄에서 실행을 멈춥니다. 반면 'Step over'는 보이지 않는 곳에서 중첩 함수를 실행하긴 하지만 함수 내로 진입하지 않습니다.

    실행은 함수 실행이 끝난 후에 즉시 멈춥니다.

    'Step over'은 함수 호출 시 내부에서 어떤 일이 일어나는지 궁금하지 않을 때 유용합니다.

<span class="devtools" style="background-position:-4px -194px"></span> -- 'Step into' (단축키 `key:F11`)
: 'Step'과 유사한데, 비동기 함수 호출에서 'Step'과는 다르게 동작합니다. 이제 막 자바스크립트를 배우기 시작한 분이라면 비동기 호출에 대해 아직 배우지 않았기 때문에 'Step'과 'Step into'의 차이를 몰라도 괜찮습니다.

    'Step'은 `setTimeout`(함수 호출 스케줄링에 쓰이는 내장 메서드)같은 비동기 동작은 무시합니다. 반면 'Step into'는 비동기 동작을 담당하는 코드로 진입하고, 필요하다면 비동기 동작이 완료될 때까지 대기합니다. 자세한 내용은 [개발자 도구 매뉴얼](https://developers.google.com/web/updates/2018/01/devtools#async)에서 확인하시기 바랍니다.

<span class="devtools" style="background-position:-32px -194px"></span> -- 'Step out': 실행 중인 함수의 실행이 끝날 때 까지 실행을 계속함 (단축키 `key:Shift+F11`)
: 현재 실행 중인 함수의 실행을 계속 이어가다가 함수 본문 마지막 줄에서 실행을 멈춥니다. 실수로 <span class="devtools" style="background-position:-200px -190px"></span>을 눌러 내부 동작을 알고 싶지 않은 중첩 함수로 진입했거나 가능한 한 빨리 함수 실행을 끝내고 싶은 경우 유용합니다,

<span class="devtools" style="background-position:-61px -74px"></span> -- 모든 중단점을 활성화/비활성화
: 모든 중단점을 일시적으로 활성화/비활성화합니다(실행에는 영향이 없습니다). 

<span class="devtools" style="background-position:-90px -146px"></span> -- 예외 발생 시 코드를 자동 중지시켜주는 기능을 활성화/비활성화
: 활성화되어 있고, 개발자 도구가 열려있는 상태에서 스크립트 실행 중에 에러가 발생하면 실행이 자동으로 멈춥니다. 실행이 중단되었기 때문에 변수 등을 조사해 어디서 에러가 발생했는지 찾을 수 있게 됩니다. 개발하다가 에러와 함께 스크립트가 죽었다면 디버거를 열고 이 옵션을 활성화한 후, 페이지를 새로 고침하면 에러가 발생한 곳과 에러 발생 시점의 컨텍스트를 확인할 수 있습니다.

```smart header="Continue to here 옵션"
특정 줄에서 마우스 오른쪽 버튼을 클릭해 컨텍스트 메뉴를 열면 "Continue to here"라는 옵션을 볼 수 있습니다.

중단점을 설정하기는 귀찮은데 해당 줄에서 실행을 재개하고 싶을 때 아주 유용한 옵션입니다.
```

## console.log

`console.log` 함수를 이용하면 원하는 것을 콘솔에 출력할 수 있습니다.

아래 예시를 실행하면 콘솔창에 `0`부터 `4`까지 출력됩니다.

```js run
// 콘솔창을 열어 결과를 확인해 보세요.
for (let i = 0; i < 5; i++) {
  console.log("숫자", i);
}
```

결과는 콘솔창에만 있기 때문에 일반 사용자는 결과를 볼 수 없습니다. 결과를 보려면 개발자 도구의 콘솔 패널을 직접 열거나 다른 패널이 열린 상태에서 `key:Esc`를 눌러 화면 하단에 콘솔 패널을 띄우면 됩니다.

코드에 `console.log`를 적절히 넣어주었다면 디버거 없이도 무슨 일이 일어나고 있는지 충분히 파악할 수 있으므로, `console.log` 함수와 디버거를 적절히 활용하시기 바랍니다.

## 요약

스크립트 실행이 중단되는 경우는 다음과 같습니다.
1. 중단점을 만났을 때
2. `debugger`문 만났을 때
3. 에러가 발생했을 때(개발자 도구가 열려있고 <span class="devtools" style="background-position:-90px -146px"></span> 버튼이 '활성화'되어있는 경우)

스크립트 실행이 중지되면 중단 시점을 기준으로 변수에 어떤 값이 들어가 있는지 확인할 수 있습니다. 또한 단계별로 코드를 실행해 가며, 어디서 문제가 발생했는지 추적할 수도 있습니다. 이런 식으로 디버깅이 진행됩니다.

개발자 도구는 여기서 소개한 기능 이외의 다양한 기능을 지원합니다. Google에서 제공하는 개발자 도구 공식 매뉴얼은 <https://developers.google.com/web/tools/chrome-devtools>에서 확인할 수 있습니다.

이번 챕터에서 배운 내용만으로도 디버깅을 충분히 할 수 있습니다. 그런데 나중에 브라우저 고급 기능을 배운 후에는 개발자 도구 공식 매뉴얼에 들어가 더 많은 개발자 도구 기능에 대해 알아보시기 바랍니다.  

개발자 도구를 열어 이것저것 클릭하면서 어떤 것들이 나타나는지 살펴보는 방법도 좋습니다. 직접 부딪쳐 보는 게 가장 빠른 학습 방법일 수 있으니까요. 마우스 오른쪽 버튼을 클릭해 컨텍스트 메뉴를 띄워보는 것도 잊지 마세요!
