# Server Sent Events

[Server-Sent Events](https://html.spec.whatwg.org/multipage/comms.html#the-eventsource-interface) 명세는 서버와의 연결을 유지하고, 서버로부터 이벤트를 받을 수 있도록 하는 내장 클래스 `EventSource` 에 대해 설명합니다.

`WebSocket` 과 비슷하게, 이 연결은 지속성이 있습니다.

하지만 몇 가지 중요한 차이점이 있습니다:

| `WebSocket` | `EventSource` |
|-------------|---------------|
| 양방향: 클라이언트와 서버 모두 메시지를 주고받을 수 있습니다. | 단방향: 서버만 데이터를 전송합니다. |
| 바이너리 및 텍스트 데이터 | 텍스트 |
| WebSocket 프로토콜 | 정규 HTTP |

`EventSource` 는 `WebSocket` 보다 덜 강력한 서버와의 통신 방법입니다.

그렇다면 이것을 왜 사용해야 할까요?

가장 중요한 이유는: 단순하기 때문입니다. 많은 적용 사례에서, `WebSocket` 의 능력은 때로는 과할 때가 있습니다.

우리는 서버로부터 데이터 스트림을 받아야 합니다: 이는 채팅 메시지일 수도 있고, 마켓 가격 등일 수도 있습니다. 이는 `EventSource` 가 잘하는 것입니다. 또한 `WebSocket` 이라면 직접 구현해줘야 하는 기능인 자동 재연결을 지원합니다. 이외에도, 이는 새로운 프로토콜이 아닌, 이미 존재하던 구형 HTTP입니다.

## 메시지 수신하기

메시지 수신을 시작하기 위해서는, `new EventSource(url)` 을 생성하기만 하면 됩니다.

브라우저는 `url` 에 연결을 시도하고, 연결을 계속 열어두며 이벤트를 기다릴 것입니다.

서버는 헤더 `Content-Type: text/event-stream` 에 대하여 상태 200을 반환해야 하고,  연결을 유지하며 아래와 같은 특수한 형식에 맞추어 메시지를 작성해야 합니다:

```
data: Message 1

data: Message 2

data: Message 3
data: of two lines
```

- `data:` 뒤에 메시지 문구가 들어가고, 콜론 뒤에 오는 띄어쓰기는 선택입니다.
- 메시지는 두 개의 연속된 줄 바꿈 `\n\n` 으로 구분됩니다.
- 즉시 `data:` 를 보냄으로써 줄 바꿈 `\n` 을 보낼 수 있습니다 (위의 세 번째 메시지에 해당).

실제 사례에서, 복잡한 메시지는 통상 JSON-인코딩되어 보내집니다. 줄바꿈은 `\n`으로 인코딩되어 들어가 있으므로, 여러 줄로 구성된 `data:` 메시지는 필요 없습니다.

예를 들어:

```js
data: {"user":"John","message":"First line*!*\n*/!* Second line"}
```

...따라서 우리는 하나의 `data:` 가 하나의 메시지만을 가지고 있다고 여길 수 있습니다.

각 메시지에 대해, `message` 이벤트가 생성됩니다:

```js
let eventSource = new EventSource("/events/subscribe");

eventSource.onmessage = function(event) {
  console.log("New message", event.data);
  // 위 데이터 스트림에 대해 세 번 로그를 남기게 됩니다.
};

// 또는 eventSource.addEventListener('message', ...)
```

### 크로스-오리진 요청

`EventSource` 는 `fetch` 또는 다른 네트워크 메서드와 같은 크로스-오리진 요청을 지원합니다. 어떤 URL이든 사용 가능합니다:

```js
let source = new EventSource("https://another-site.com/events");
```

더 진행하기 위하여, 원격 서버는 `Origin` 헤더를 받고 반드시 `Access-Control-Allow-Origin` 을 통해 응답해야 합니다.

자격 검사를 통과하기 위해서는, 아래와 같이 추가적인 `withCredentials` 옵션을 설정해야 합니다:

```js
let source = new EventSource("https://another-site.com/events", {
  withCredentials: true
});
```

크로스-오리진 헤더에 대한 더욱 자세한 정보는 <info:fetch-crossorigin> 장을 참고해주세요.


## 재연결

생성 단계에서, `new EventSource` 가 서버와 연결하고, 만약 연결이 끊어졌다면 -- 재연결합니다.

이는, 신경을 쓰지 않아도 되기 때문에 매우 편리합니다.

재연결과 재연결 사이에는 기본적으로 몇 초 정도의 짧은 지연이 있습니다.

서버는 응답에 `retry:` 를 사용함으로써 권장 지연시간을 설정할 수 있습니다.(밀리초 단위):

```js
retry: 15000
data: Hello, I set the reconnection delay to 15 seconds
```

`retry:` 는 데이터와 함께 도착하거나, 독립적인 메시지로 전달될 수 있습니다.

브라우저는 재연결 전에 설정한 만큼의 밀리초를 기다려야 합니다. 또는 그보다 오래, 예를 들어 브라우저가 그 순간에 네트워크 연결이 없다는 것을 (OS로부터) 알고 있을 때, 네트워크 연결이 생성될 때까지 기다렸다가 재시도해야 할 것입니다.

- 만약 서버 측에서 브라우저의 재연결 요청을 그만하기를 원한다면, 서버는 HTTP 상태 204를 반환해야 합니다.
- 만약 브라우저 측에서 연결을 닫고 싶다면, `eventSource.close()` 를 호출해야 합니다:

```js
let eventSource = new EventSource(...);

eventSource.close();
```

또한, 응답이 잘못된 `Content-Type` 을 가지고 있거나 HTTP 상태가 301, 307, 200 또는 204가 아닐 경우에는 재연결이 없을 것입니다. 이러한 경우 `"error"` 이벤트가 발생할 것이고, 브라우저는 재연결하지 않습니다.

```smart
연결이 최종적으로 닫히고 나면, 이를 "다시 여는" 방법은 없습니다. 만약 다시 연결을 원한다면, 그냥 새로운 `EventSource` 를 생성하면 됩니다.
```

## 메시지 id

네트워크 문제로 인해 연결이 끊기는 경우, 양쪽 중 어느 쪽도 어떤 메시지가 수신되었고 안 되었는지 확신할 수 없습니다.

올바르게 연결을 재개하기 위해서는, 각 메시지는 이처럼 `id` 필드를 가져야 합니다:

```
data: Message 1
id: 1

data: Message 2
id: 2

data: Message 3
data: of two lines
id: 3
```

`id:` 가 포함된 메시지를 받은 경우, 브라우저는:

- `eventSource.lastEventId` 를 그 값의 속성으로 설정합니다.
- 재연결 시에 헤더에 `Last-Event-ID` 를 해당 `id` 로 설정함으로써, 서버가 이후 이어지는 메시지를 재전송할 수 있도록 합니다.

```smart header="`data:` 뒤에 `id:` 를 붙이는 것"
주의: `lastEventId` 가 메시지 수신 후 업데이트된다는 것을 확실히 할 수 있도록, 서버가 보내는 메시지의 `data` 아래에 `id`가 붙어 있습니다. 
```

## 연결 상태: readyState

`EventSource` 객체는 `readyState` 속성을 가지고 있는데, 이는 아래의 세 가지의 값 중 하나입니다:

```js no-beautify
EventSource.CONNECTING = 0; // 연결 중 또는 재연결 중
EventSource.OPEN = 1;       // 연결되었음
EventSource.CLOSED = 2;     // 연결 닫힘
```

객체가 생성될 때 또는 연결이 끊어졌을 때, 항상 `EventSource.CONNECTNG` 입니다 (0과 같음).

`EventSource` 의 상태를 알기 위해 이 속성을 조회할 수 있습니다.

## 이벤트 타입

기본적으로 `EventSource` 객체는 세 가지 이벤트를 생성합니다:

- `message` -- 메시지가 수신되었고, `event.data` 로 사용 가능합니다.
- `open` -- 연결이 열려 있습니다.
- `error` -- 연결이 성립될 수 없습니다. 예를 들어 서버가 HTTP 500 상태를 반환했을 경우

서버는 이벤트가 시작될 때 `event: ...` 를 통해 다른 이벤트를 명시할 수 있습니다.

예를 들어:

```
event: join
data: Bob

data: Hello

event: leave
data: Bob
```

사용자 지정 이벤트를 다루기 위해서는 `onmessage` 가 아닌 `addEventListener` 를 사용해야 합니다:

```js
eventSource.addEventListener('join', event => {
  alert(`Joined ${event.data}`);
});

eventSource.addEventListener('message', event => {
  alert(`Said: ${event.data}`);
});

eventSource.addEventListener('leave', event => {
  alert(`Left ${event.data}`);
});
```

## 전체 예시

여기 서버가 `1`, `2`, `3`, 그리고 `bye` 를 보내고 연결을 끊는 서버가 있습니다.

그러면 브라우저는 자동으로 재연결합니다.

[codetabs src="eventsource"]

## 요약

`EventSource` 객체는 자동으로 지속성 있는 연결을 구성하고 서버가 이를 통해 보낼 수 있도록 합니다.

이 연결은 다음을 제공합니다:
- `retry` timeout을 설정할 수 있는 자동 재연결
- 이벤트를 재개하기 위한 메시지 id, 마지막으로 수신한 식별자는 재연결 시에 `Last-Event-ID` 헤더에 포함되어 보내집니다.
- 현재 상태는 `readyState` 속성에 있습니다.

이 특성은 보다 저수준이고 (구현될 수 있음에도) 내장 기능이 이를 제공하지 않기 때문에, `EventSource` 를 `WebSocket` 의 가용한 대안이 되도록 합니다.

실제 적용 사례에서, `EventSource` 의 능력으로 충분한 경우가 많습니다.

모든 모던 브라우저(IE 제외)에서 지원됩니다.

구문은 아래와 같습니다:

```js
let source = new EventSource(url, [credentials]);
```

두 번째 인자는 한 가지 옵션만이 가능합니다: `{ withCredentials: true }` , 이는 크로스-오리진 자격 증명을 보내는 것을 허용합니다.

전반적인 크로스-오리진 보안은 `fetch` 또는 다른 네트워크 메서드와 같습니다.

### `EventSource` 객체의 속성

`readyState`
: 현재 연결 상태: `EventSource.CONNECTING (=0)`, `EventSource.OPEN (=1)` 또는 `EventSource.CLOSED (=2)`중 하나입니다.

`lastEventId`
: 마지막으로 수신한 `id`. 재연결 시 브라우저는 헤더에 `Last-Event-ID` 에 포함해 전송합니다.

### 메서드

`close()`
: 연결을 닫습니다.

### 이벤트

`message`
: 메시지가 수신되었고, 데이터는 `event.data` 에 있습니다.

`open`
: 연결이 설정되었습니다.

`error`
: 연결 끊김 (이는 자동 재연결 될 것입니다) 치명적인 오류, 두 가지 모두를 포함한 오류가 발생한 경우입니다. 재연결이 시도되고 있는지 보기 위해 `readyState` 를 확인할 수 있습니다.

서버는 사용자 지정 이벤트 명을 `event:` 에 설정할 수 있습니다. 이러한 이벤트는 `on<event>` 가 아닌, `addEventListener` 를 사용하여 처리되어야 합니다.

### 서버 응답 형식

서버는 `\n\n` 으로 구분된 메시지를 전송합니다.

하나의 메시지는 아래의 필드를 가질 수 있습니다:

- `data:` -- 메시지 본문, 각 부분이 `\n` 으로 구성된 여러 개의 `data` 시퀀스는 하나의 메시지로 해석될 수 있습니다.
- `id:` -- 재연결 시 전송된 `Last-Event-ID` 를 `lastEventId` 를 갱신합니다.
- `retry:` -- 재연결을 위한 재시도 지연 시간을 밀리초 단위로 권장합니다. 이를 자바스크립트로 설정할 수 있는 방법은 존재하지 않습니다.
- `event:` -- 이벤트 명, 반드시 `data:` 보다 앞에 있어야 합니다.

하나의 메시지는 순서에 상관없이 하나 이상의 필드를 가질 수 있지만, 통상 `id:` 가 가장 마지막에 위치합니다.
