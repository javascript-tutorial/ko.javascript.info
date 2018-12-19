# 개발자 콘솔

코드는 에러에 취약합니다. 당신은 에러를 만들 가능성이 높습니다. 아, 제가 무슨 소릴 하는거죠? 적어도 당신이 [로봇](https://en.wikipedia.org/wiki/Bender_(Futurama))이 아니라 사람이라면, 당신은 *틀림없이* 에러를 만들 것입니다. 

하지만 브라우저에서, 유저는 기본적으로 에러를 볼 수 없습니다. 그래서, 만약 스크립트에서 어떤 것이 잘못 작동한다면, 우리는 무엇이 잘못됐는지 보지 못하며 그것을 고칠 수 없을 것입니다.

에러를 확인하고 스크립트에 대한 다른 유용한 정보들을 얻기 위해서, 브라우저 내에 "개발자 도구"가 삽입되어 왔습니다.

개발자들은 대부분 개발을 위해 크롬이나 파이어폭스를 사용하는 경향이 있습니다. 이 브라우저들이 굉장히 좋은 개발자 도구를 갖추고 있기 때문이죠. 다른 브라우저들도 종종 특별한 기능을 갖추기도 한 개발자 도구를 제공합니다. 하지만 대부분이 크롬이나 파이어폭스를 따라잡으려고 애쓰고 있습니다. 그래서 대부분의 사람들은 "선호하는" 브라우저가 있고 만약 에러가 특정 브라우저에 의존하는 것이라면, 그제서야 다른 브라우저를 사용합니다. 

개발자 도구는 강력합니다. 많은 기능들을 갖고 있기 때문이죠. 우선, 우리는 개발자 도구 여는 법을 배운 뒤, 에러를 확인하고, 자바스크립트 명령을 실행해보겠습니다. 

## 구글 크롬

[bug.html](bug.html) 페이지를 열어보세요.

이 페이지의 자바스크립트 코드에는 에러가 존재합니다. 이 에러는 일반적인 방문객의 눈에는 보이지 않기 때문에, 이것을 확인하기 위해 개발자 도구를 열어봅시다.

`key:F12`를 누르거나, 맥 사용자라면 `key:Cmd+Opt+J`를 눌러보세요.

개발자 도구는 기본적으로 콘솔 탭에서 열립니다.

이렇게 보일 것입니다.:

![chrome](chrome.png)

개발자 도구의 정확한 모습은 크롬 버전에 따라 다릅니다. 개발자 도구의 모습은 가끔 변하지만 비슷한 모습이어야 합니다.

- 여기서 우리는 빨간색 에러 메시지를 확인할 수 있습니다. 이 경우, 스크립트는 unknown 타입의 "lalala" 명령을 포함하고 있습니다.
- 오른쪽에, there is a clickable link to the source `bug.html:12` with the line number where the error has occurred.

에러 메시지 아래에, 파란색 `>` 기호가 있습니다. It marks a "command line" where we can type JavaScript commands. Press `key:Enter` to run them (`key:Shift+Enter` to input multi-line commands).

Now we can see errors, and that's enough for a start. We'll be back to 개발자 도구 later and cover debugging more in-depth in the chapter <info:debugging-chrome>.


## 파이어폭스, 엣지, 그리고 다른 도구들

대부분의 다른 브라우저는 개발자 도구를 열기 위해 `key:F12`를 사용합니다.

The look & feel of them is quite similar. Once you know how to use one of those tools (you can start with Chrome), you can easily switch to another.

## 사파리

사파리 (윈도우/리눅스는 지원하지 않는 맥 브라우저)는 여기서 약간 특별합니다. We need to enable the "Develop menu" first.

Preferences를 열고 "Advanced"창으로 가세요. 아래에 체크박스가 있습니다.:

![safari](safari.png)

이제 `key:Cmd+Opt+C`를 누르면 콘솔을 열 수 있습니다. 그리고, note that the new top menu item named "Develop" has appeared. 이것은 많은 명령과 옵션을 갖고 있습니다..

## 요약

- 개발자 도구를 통해 에러를 확인하고, 명령을 실행하고, 변수를 살펴보는 등의 일을 할 수 있습니다.
- 윈도우 환경에서 대부분의 브라우저의 개발자 도구는 `key:F12` 를 통해 열 수 있습니다. 맥 환경에서의 크롬은 `key:Cmd+Opt+J`, 사파리는 `key:Cmd+Opt+C`를 누르면 됩니다(먼저 사용할 수 있게 설정을 해야합니다).

이제 우리는 환경 준비를 끝마쳤습니다. 다음 섹션에서는, 자바스크립트에 대한 본론으로 들어가겠습니다.