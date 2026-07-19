# 서버 전송 이벤트

[서버 전송 이벤트(Server-Sent Events)](https://html.spec.whatwg.org/multipage/comms.html#the-eventsource-interface) 명세는 내장 클래스 `EventSource`를 정의합니다. `EventSource`를 사용하면 서버와 커넥션을 유지하면서 서버가 보내는 이벤트를 받을 수 있습니다.

`WebSocket`과 마찬가지로 서버 전송 이벤트에서도 커넥션은 지속됩니다.

그런데 둘 사이엔 중요한 차이가 몇 가지 있습니다.

| `WebSocket` | `EventSource` |
|-------------|---------------|
| 양방향 통신. 클라이언트와 서버 모두 메시지를 주고받을 수 있음 | 단방향 통신. 서버만 데이터를 보냄 |
| 바이너리와 텍스트 데이터 전송 가능 | 텍스트만 전송 가능 |
| 웹소켓 프로토콜 사용 | 일반 HTTP 사용 |

이렇게 보면 `EventSource`는 `WebSocket`보다 서버와 통신하는 능력이 부족한 수단 같아 보입니다.

그런데도 `EventSource`를 써야 할 이유가 있을까요?

물론 있습니다. 단순하다는 점이죠. 상당수 애플리케이션엔 `WebSocket`에서 제공하는 능력까지는 필요하지 않습니다.

채팅 메시지나 주식 시세처럼 서버에서 흘러오는 데이터 스트림을 받기만 하면 되는 상황이라면 `EventSource`가 제격입니다. `EventSource`는 `WebSocket`에선 직접 구현해야 하는 자동 재연결도 지원합니다. 게다가 새로운 프로토콜이 아니라 익숙한 HTTP를 그대로 사용합니다.

## 메시지 받기

서버에서 보내는 메시지는 브라우저에서 실행 중인 클라이언트 측 자바스크립트에서 `new EventSource(url)`를 만들기만 하면 받을 수 있습니다.

그러면 브라우저가 알아서 `url`로 접속해 커넥션을 열어둔 채 이벤트를 기다립니다.

서버는 본문 전체를 보내는 대신 우선 상태 코드 200과 헤더 `Content-Type: text/event-stream`만 보내 응답한 뒤, 커넥션을 유지하면서 다음과 같은 특별한 형식의 메시지를 클라이언트로 흘려보냅니다.

```
data: 메시지 1

data: 메시지 2

data: 메시지 3
data: 두 번째 줄
```

- 메시지 본문은 `data:` 뒤에 붙이는데, 콜론 뒤 공백은 생략할 수 있습니다.
- 메시지끼리는 두 번의 줄바꿈 `\n\n`으로 구분합니다.
- 줄바꿈 `\n`을 보내고 싶으면 바로 다음 줄에 `data:`를 한 번 더 씁니다(위 예시의 세 번째 메시지).

실무에선 복잡한 메시지는 보통 JSON으로 인코딩해 보냅니다. JSON으로 인코딩하면 줄바꿈이 문자열 안에서 `\n`으로 처리되기 때문에 `data:`를 여러 줄로 나눠 쓸 일도 없습니다.

예시를 살펴봅시다.

```js
data: {"user":"보라","message":"첫 번째 줄*!*\n*/!* 두 번째 줄"}
```

이런 관례 덕분에 `data:` 하나가 곧 메시지 하나라고 생각해도 됩니다.

이렇게 메시지가 하나 도착할 때마다 `message` 이벤트가 만들어집니다.

```js
let eventSource = new EventSource("/events/subscribe");

eventSource.onmessage = function(event) {
  console.log("새 메시지", event.data);
  // 위 데이터 스트림이라면 세 번 출력됩니다.
};

// eventSource.addEventListener('message', ...)를 사용해도 됩니다.
```

### 크로스 오리진 요청

`EventSource`는 `fetch`를 비롯한 여타 네트워크 메서드처럼 크로스 오리진 요청을 지원합니다. 어떤 URL이든 사용할 수 있죠.

```js
let source = new EventSource("https://another-site.com/events");
```

`EventSource`로 접속한 크로스 오리진 원격 서버는 브라우저가 요청을 보낼 때 자동으로 붙인 `Origin` 헤더를 받습니다. 요청을 받은 서버는 응답에 `Access-Control-Allow-Origin` 헤더를 넣어 해당 오리진의 접근을 허용한다고 응답합니다.

자격 증명을 함께 보내려면 다음과 같이 옵션 `withCredentials`를 추가로 설정합니다.

```js
let source = new EventSource("https://another-site.com/events", {
  withCredentials: true
});
```

크로스 오리진 헤더에 대한 자세한 내용은 <info:fetch-crossorigin> 챕터를 참고하세요.


## 재연결

`new EventSource`로 객체를 만들면 브라우저가 알아서 서버에 커넥션을 엽니다. 이때 커넥션이 끊어져도 브라우저가 알아서 다시 접속합니다.

재연결을 직접 신경 쓰지 않아도 되니 아주 편리하죠.

다만, 재연결 사이엔 짧은 지연이 있는데 기본값(브라우저에서 지정)은 몇 초 정도입니다.

재연결 지연 시간은 서버가 원하는 값으로 바꿀 수 있습니다. 서버는 응답에 `retry:`를 실어 권장 지연 시간을 밀리초 단위로 설정할 수 있습니다.

```js
retry: 15000
data: 안녕하세요. 재연결 지연 시간을 15초로 설정했습니다.
```

`retry:`는 데이터와 함께 보낼 수도 있고 단독 메시지로 보낼 수도 있습니다.

브라우저는 재연결하기 전에 지정된 시간만큼 기다립니다. 더 오래 기다리기도 합니다. 운영체제로부터 현재 네트워크 연결이 없다는 정보를 받았다면 연결이 살아날 때까지 기다렸다가 다시 시도합니다.

- 서버 쪽에서 브라우저의 재연결 시도를 멈추고 싶다면 HTTP 상태 코드 204로 응답해야 합니다.
- 브라우저 쪽에서 커넥션을 닫고 싶다면 `eventSource.close()`를 호출해야 합니다.

```js
let eventSource = new EventSource(...);

eventSource.close();
```

이렇게 서버나 브라우저에서 명시적으로 재연결을 멈출 때 말고, 응답의 `Content-Type`이 올바르지 않거나 HTTP 상태 코드가 301, 307, 200, 204가 아닐 때도 재연결은 일어나지 않습니다. 이때는 `"error"` 이벤트가 발생하고 브라우저는 재연결을 시도하지 않습니다.

```smart
한 번 완전히 닫힌 커넥션은 다시 여는 방법이 없습니다. 다시 접속하고 싶다면 새로운 `EventSource`를 만드세요.
```

## 메시지 id

네트워크 문제로 커넥션이 끊어지면 어떤 메시지가 도착했고 어떤 메시지가 유실됐는지 어느 쪽도 확신할 수 없습니다.

커넥션을 정확히 이어가려면 다음과 같이 메시지마다 `id` 필드가 있어야 합니다.

```
data: 메시지 1
id: 1

data: 메시지 2
id: 2

data: 메시지 3
data: 두 번째 줄
id: 3
```

`id:`가 붙은 메시지를 받으면 브라우저는 다음 두 가지 일을 합니다.

- 프로퍼티 `eventSource.lastEventId`에 받은 값을 설정합니다.
- 재연결 시 헤더 `Last-Event-ID`에 이 `id`를 실어 보내, 서버가 그다음 메시지부터 다시 보낼 수 있게 합니다.

```smart header="`id:`는 `data:` 뒤에 넣어주세요"
주의하세요. 서버가 `id`를 메시지 `data` 아래에 붙이는 이유는 메시지를 다 받은 후에 `lastEventId`가 갱신되도록 보장하기 위해서입니다.
```

## readyState로 커넥션 상태 확인하기

`EventSource` 객체의 프로퍼티 `readyState`는 세 값 중 하나를 갖습니다.

```js no-beautify
EventSource.CONNECTING = 0; // 연결 중이거나 재연결 중
EventSource.OPEN = 1;       // 연결됨
EventSource.CLOSED = 2;     // 커넥션 닫힘
```

객체가 막 만들어졌을 때나 커넥션이 끊어져 있을 때 값은 항상 `EventSource.CONNECTING`(`0`)입니다.

이 프로퍼티를 조회하면 `EventSource`의 상태를 알 수 있습니다.

## 이벤트 타입

기본적으로 `EventSource` 객체는 세 가지 이벤트를 만들어냅니다.

- `message` -- 메시지가 도착함. 내용은 `event.data`로 접근
- `open` -- 커넥션이 열림
- `error` -- 커넥션을 맺지 못함. 서버가 HTTP 상태 코드 500을 반환한 경우 등

서버는 이벤트 시작 부분에 `event: ...`를 붙여 다른 타입의 이벤트를 지정할 수 있습니다.

예시를 살펴봅시다.

```
event: join
data: 보라

data: 안녕하세요.

event: leave
data: 보라
```

이런 커스텀 이벤트를 처리하려면 `onmessage`가 아니라 `addEventListener`를 사용해야 합니다.

```js
eventSource.addEventListener('join', event => {
  alert(`${event.data}님이 입장했습니다.`);
});

eventSource.addEventListener('message', event => {
  alert(`${event.data}`);
});

eventSource.addEventListener('leave', event => {
  alert(`${event.data}님이 퇴장했습니다.`);
});
```

## 전체 예시

아래 서버는 `1`, `2`, `3`을 차례로 보내고 마지막에 `bye`를 보낸 뒤 커넥션을 끊습니다.

커넥션이 끊어지면 브라우저가 자동으로 재연결하는 것을 확인해 보세요.

[codetabs src="eventsource"]

## 요약

`EventSource` 객체는 지속적인 커넥션을 자동으로 맺고, 서버가 이 커넥션을 통해 메시지를 보낼 수 있게 해줍니다.

`EventSource`는 다음 기능을 제공합니다.
- 자동 재연결. 재시도 간격은 `retry`로 조정 가능
- 이벤트를 이어받기 위한 메시지 id. 마지막으로 받은 식별자는 재연결 시 `Last-Event-ID` 헤더에 실려 전송됨
- 프로퍼티 `readyState`를 통한 현재 상태 확인

이런 내장 기능 덕분에 `EventSource`는 `WebSocket`의 훌륭한 대안이 됩니다. `WebSocket`은 더 저수준이라 이런 기능을 직접 구현해야 하기 때문입니다.

실제 애플리케이션 상당수엔 `EventSource`가 제공하는 능력만으로도 충분합니다.

`EventSource`는 IE를 제외한 모든 모던 브라우저에서 지원합니다.

문법은 다음과 같습니다.

```js
let source = new EventSource(url, [credentials]);
```

두 번째 인수에 쓸 수 있는 옵션은 `{ withCredentials: true }` 하나뿐입니다. 이 옵션을 켜면 크로스 오리진 자격 증명을 보낼 수 있습니다.

전반적인 크로스 오리진 보안 정책은 `fetch` 등 다른 네트워크 메서드와 같습니다.

### `EventSource` 객체의 프로퍼티

`readyState`
: 현재 커넥션 상태. `EventSource.CONNECTING (=0)`, `EventSource.OPEN (=1)`, `EventSource.CLOSED (=2)` 중 하나

`lastEventId`
: 마지막으로 받은 `id`. 재연결 시 브라우저는 이 값을 헤더 `Last-Event-ID`에 실어 보냄

### 메서드

`close()`
: 커넥션을 닫음

### 이벤트

`message`
: 메시지가 도착함. 데이터는 `event.data`에 저장됨

`open`
: 커넥션이 맺어짐

`error`
: 에러가 발생함. 자동 재연결이 이어지는 커넥션 유실과 치명적인 에러 모두 해당됨. 재연결 시도 중인지는 `readyState`로 확인 가능

서버는 `event:`에 커스텀 이벤트 이름을 지정할 수 있습니다. 이런 이벤트는 `on<event>`가 아니라 `addEventListener`로 처리해야 합니다.

### 서버 응답 형식

서버는 메시지를 `\n\n`으로 구분해 보냅니다.

메시지엔 다음 필드가 들어갈 수 있습니다.

- `data:` -- 메시지 본문. 연속된 `data`는 부분 사이에 `\n`이 있는 하나의 메시지로 해석됨
- `id:` -- `lastEventId`를 갱신함. 재연결 시 `Last-Event-ID`로 전송됨
- `retry:` -- 재연결 지연 시간(밀리초)을 권장함. 자바스크립트에서 설정하는 방법은 없음
- `event:` -- 이벤트 이름. `data:`보다 앞에 와야 함

필드는 어떤 순서로든 하나 이상 넣을 수 있는데 관례상 `id:`를 마지막에 둡니다.
