# 웹소켓

[RFC 6455](http://tools.ietf.org/html/rfc6455) 명세서에 정의된 프로토콜인 `웹소켓(WebSocket)`을 사용하면 서버와 브라우저 간 연결을 유지한 상태로 데이터를 교환할 수 있습니다. 이때 데이터는 '패킷(packet)' 형태로 전달되며, 전송은 커넥션 중단과 추가 HTTP 요청 없이 양방향으로 이뤄집니다.

이런 특징 때문에 웹소켓은 온라인 게임이나 주식 트레이딩 시스템같이 데이터 교환이 지속적으로 이뤄져야 하는 서비스에 아주 적합합니다.

## A simple example

웹소켓 연결을 만들려면 `new WebSocket`을 호출하면 되는데, 이때 `ws`라는 특수 프로토콜을 사용합니다.

```js
let socket = new WebSocket("*!*ws*/!*://javascript.info");
```

`ws`말고 `wss://`라는 프로토콜도 있는데, 두 프로토콜의 관계는 HTTP와 HTTPS의 관계와 유사합니다.

```smart header="항상 `wss://`를 사용합시다."
`wss://`는 보안 이외에도 신뢰성(reliability) 측면에서 `ws`보다 좀 더 신뢰할만한 프로토콜입니다.

`ws://`를 사용해 데이터를 전송하면 데이터가 암호화되어있지 않은 채로 전송되기 때문에 데이터가 그대로 노출됩니다. 그런데 아주 오래된 프락시 서버는 웹소켓이 무엇인지 몰라서 '이상한' 헤더가 붙은 요청이 들어왔다고 판단하고 연결을 끊어버립니다.

반면 `wss://`는 TSL(전송 계층 보안(Transport Layer Security))이라는 보안 계층을 통과해 전달되므로 송신자 측에서 데이터가 암호화되고, 복호화는 수신자 측에서 이뤄지게 됩니다. 따라서 데이터가 담긴 패킷은 암호화된 상태로 프락시 서버를 통과하므로 프락시 서버는 패킷 내부를 볼 수 없게 됩니다. 
```

소켓이 정상적으로 만들어지면 아래 네 개의 이벤트를 사용할 수 있게 됩니다.
- **`open`** -- 커넥션이 제대로 만들어짐
- **`message`** -- data received,
- **`error`** -- 웹소켓 에러
- **`close`** -- 커넥션 종료

커넥션이 만들어진 상태에서 무언가를 보내고 싶으면 `socket.send(data)`를 사용하면 됩니다.

예시를 살펴봅시다.

```js run
let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

socket.onopen = function(e) {
  alert("[open] 커넥션이 만들어졌습니다.");
  alert("데이터를 서버에 전송해봅시다.");
  socket.send("My name is Bora.");
};

socket.onmessage = function(event) {
  alert(`[message] 서버로부터 전송받은 데이터: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {  
    alert(`[close] 커넥션이 정상적으로 종료되었습니다(code=${event.code} reason=${event.reason})`);
  } else {
    // 예시: 프로세스가 죽거나 네트워크에 장애가 있는 경우
    // event.code가 1006이 됩니다.
    alert('[close] 커넥션이 죽었습니다.');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};
```

위 예시는 데모 목적을 위해 만들어놓은 간이 Node.js 서버([server.js](demo/server.js))에서 돌아갑니다. 서버는 'Hello from server, Bora'라는 메시지가 담긴 응답을 클라이언트에 보내고, 5초 후 커넥션을 종료시킵니다.

서버 쪽 코드가 동작하면서 `open` -> `message` -> `close` 순의 이벤트를 볼 수 있었던 것이죠.

이제 여러분은 웹소켓 통신이 어떻게 이뤄지는지를 알게 되셨습니다. 생각보다 꽤 간단하죠?

그렇긴 하지만 실무 수준에서 웹소켓을 활용할 수 있도록 웹소켓에 대해 좀 더 자세히 알아봅시다.

## 웹소켓 핸드셰이크

`new WebSocket(url)`을 호출해 소켓을 생성하면 즉시 연결이 시작됩니다.

커넥션이 유지되는 동안, 브라우저는 (헤더를 사용해) 서버에 '웹소켓을 지원하나요?'라고 물어봅니다. 이에 서버가 '네'라는 응답을 하면 서버-브라우저간 통신은 HTTP가 아닌 웹소켓 프로토콜을 사용해 진행됩니다.

![](websocket-handshake.svg)

이번엔 `new WebSocket("wss://javascript.info/chat")`을 호출해 최초 요청이 전송되었다고 가정하고 이때의 요청 헤더를 살펴봅시다.

```
GET /chat
Host: javascript.info
Origin: https://javascript.info
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
```

<<<<<<< HEAD
- `Origin` -- 클라이언트 오리진(예시에선 `https://javascript.info`)을 나타냅니다. 서버는 `Origin` 헤더를 보고 어떤 웹사이트와 소켓통신을 할지 결정하기 때문에 Origin 헤더는 웹소켓 통신에 중요한 역할을 합니다. 참고로 웹소켓 객체는 기본적으로 크로스 오리진(cross-origin) 요청을 지원합니다. 웹소켓 통신만을 위한 전용 헤더나 제약도 없습니다. 오래된 서버는 웹소켓 통신을 지원하지 못하기 때문에 웹소켓 통신은 호환성 문제도 없습니다.
- `Connection: Upgrade` -- 클라이언트  측에서 프로토콜을 바꾸고 싶다는 신호를 보냈다는 것을 나타냅니다.
- `Upgrade: websocket` -- 클라이언트측에서 요청한 프로토콜은 'websocket'이라는걸 의미합니다.
- `Sec-WebSocket-Key` -- 보안을 위해 브라우저에서 생성한 키를 나타냅니다.
- `Sec-WebSocket-Version` -- 웹소켓 프로토콜 버전이 명시됩니다. 예시에서 버전은 13입니다.
=======
- `Origin` -- the origin of the client page, e.g. `https://javascript.info`. WebSocket objects are cross-origin by nature. There are no special headers or other limitations. Old servers are unable to handle WebSocket anyway, so there are no compatibility issues. But `Origin` header is important, as it allows the server to decide whether or not to talk WebSocket with this website.
- `Connection: Upgrade` -- signals that the client would like to change the protocol.
- `Upgrade: websocket` -- the requested protocol is "websocket".
- `Sec-WebSocket-Key` -- a random browser-generated key for security.
- `Sec-WebSocket-Version` -- WebSocket protocol version, 13 is the current one.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

```smart header="웹소켓 핸드셰이크는 모방이 불가능합니다."
바닐라 자바스크립트로 헤더를 설정하는 건 기본적으로 막혀있기 때문에 `XMLHttpRequest`나 `fetch`로 위 예시와 유사한 헤더를 가진 HTTP 요청을 만들 수 없습니다.
```

클라이언트 측에서 보낸 웹소켓 통신 요청을 최초로 받고 이에 동의하면, 서버는 상태 코드 101이 담긴 응답을 클라이언트에 전송합니다. 

```
101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=
```

여기서 `Sec-WebSocket-Accept`는 `Sec-WebSocket-Key`와 밀접한 관계를 갖습니다. 브라우저는 특별한 알고리즘을 사용해 만들어지는 `Sec-WebSocket-Accept` 값을 서버로부터 받아, 이 응답이 자신이 보낸 요청에 대응하는 응답인지를 확인합니다.

이렇게 핸드셰이크가 끝나면 HTTP 프로토콜이 아닌 웹소켓 프로토콜을 사용하여 데이터가 전송되기 시작합니다. 웹소켓 프로토콜을 사용한 데이터 전송은 조금 후에 자세히 살펴볼 예정입니다.

### extensions와 subprotocols 헤더

웹소켓 통신은 `Sec-WebSocket-Extensions`와 `Sec-WebSocket-Protocol` 헤더를 지원합니다. 두 헤더는 각각 웹소켓 프로토콜 기능을 확장(extension)할 때와 서브 프로토콜(subprotocal)을 사용해 데이터를 전송하려 할 때 사용합니다.

각 헤더에 대한 예시를 살펴봅시다.

<<<<<<< HEAD
- `Sec-WebSocket-Extensions: deflate-frame` -- 이 헤더는 브라우저에서 데이터 압축(deflate)을 지원한다는 것을 의미합니다. `Sec-WebSocket-Extensions`은 브라우저에 의해 자동 생성되는데, 그 값엔 데이터 전송과 관련된 무언가나 웹소켓 프로토콜 기능 확장과 관련된 무언가가 여러 개 나열됩니다.
=======
- `Sec-WebSocket-Extensions: deflate-frame` means that the browser supports data compression. An extension is something related to transferring the data, functionality that extends WebSocket protocol. The header `Sec-WebSocket-Extensions` is sent automatically by the browser, with the list of all extensions it supports.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

- `Sec-WebSocket-Protocol: soap, wamp` -- 이렇게 헤더가 설정되면 평범한 데이터가 아닌 [SOAP](http://en.wikipedia.org/wiki/SOAP)나 WAM (The WebSocket Application Messaging Protocol) 프로토콜을 준수하는 데이터를 전송하겠다는 것을 의미합니다. 웹소켓에서 지원하는 서브프로토콜 목록은 [IANA 카탈로그](http://www.iana.org/assignments/websocket/websocket.xml)에서 확인할 수 있습니다. 개발자는 이 헤더를 보고 앞으로 사용하게 될 데이터 포맷을 확인할 수 있습니다.

    이 헤더들은 두 번째 매개변수에 값을 넣어 `new WebSocket`을 호출하면 설정할 수 있습니다. 서브 프로토콜 SOAP나 WAMP를 사용하고 싶다고 가정해 봅시다. 두 번째 매개변수에 다음과 같이 배열을 넣으면 됩니다.

    ```js
    let socket = new WebSocket("wss://javascript.info/chat", ["soap", "wamp"]);
    ```

서버는 자신이 지원하는 익스텐션과 프로토콜을 응답 헤더에 담아 클라이언트에 전달해야 합니다.

예시를 살펴봅시다. 요청 헤더는 다음과 같습니다.

```
GET /chat
Host: javascript.info
Upgrade: websocket
Connection: Upgrade
Origin: https://javascript.info
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
*!*
Sec-WebSocket-Extensions: deflate-frame
Sec-WebSocket-Protocol: soap, wamp
*/!*
```

이때 다음과 같은 응답이 왔다고 가정해봅시다.

```
101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: hsBlbuDTkk24srzEOTBUlZAlC2g=
*!*
Sec-WebSocket-Extensions: deflate-frame
Sec-WebSocket-Protocol: soap
*/!*
```

이 경우, 우리는 서버에선 'deflate-frame'이라는 익스텐션과 요청 프로토콜 중 SOAP라는 서브 프로토콜만 지원한다는 사실을 알 수 있습니다.

## Data transfer

WebSocket communication consists of "frames" -- data fragments, that can be sent from either side, and can be of several kinds:

- "text frames" -- contain text data that parties send to each other.
- "binary data frames" -- contain binary data that parties send to each other.
- "ping/pong frames" are used to check the connection, sent from the server, the browser responds to these automatically.
- there's also "connection close frame" and a few other service frames.

In the browser, we directly work only with text or binary frames.

**WebSocket `.send()` method can send either text or binary data.**

A call `socket.send(body)` allows `body` in string or a binary format, including `Blob`, `ArrayBuffer`, etc. No settings required: just send it out in any format.

**When we receive the data, text always comes as string. And for binary data, we can choose between `Blob` and `ArrayBuffer` formats.**

That's set by `socket.binaryType` property, it's `"blob"` by default, so binary data comes as `Blob` objects.

[Blob](info:blob) is a high-level binary object, it directly integrates with `<a>`, `<img>` and other tags, so that's a sane default. But for binary processing, to access individual data bytes, we can change it to `"arraybuffer"`:

```js
socket.binaryType = "arraybuffer";
socket.onmessage = (event) => {
  // event.data is either a string (if text) or arraybuffer (if binary)
};
```

## Rate limiting

Imagine, our app is generating a lot of data to send. But the user has a slow network connection, maybe on a mobile internet, outside of a city.

We can call `socket.send(data)` again and again. But the data will be buffered (stored) in memory and sent out only as fast as network speed allows.

The `socket.bufferedAmount` property stores how many bytes remain buffered at this moment, waiting to be sent over the network.

We can examine it to see whether the socket is actually available for transmission.

```js
// every 100ms examine the socket and send more data  
// only if all the existing data was sent out
setInterval(() => {
  if (socket.bufferedAmount == 0) {
    socket.send(moreData());
  }
}, 100);
```


## Connection close

Normally, when a party wants to close the connection (both browser and server have equal rights), they send a "connection close frame" with a numeric code and a textual reason.

The method for that is:
```js
socket.close([code], [reason]);
```

- `code` is a special WebSocket closing code (optional)
- `reason` is a string that describes the reason of closing (optional)

Then the other party in `close` event handler gets the code and the reason, e.g.:

```js
// closing party:
socket.close(1000, "Work complete");

// the other party
socket.onclose = event => {
  // event.code === 1000
  // event.reason === "Work complete"
  // event.wasClean === true (clean close)
};
```

Most common code values:

- `1000` -- the default, normal closure (used if no `code` supplied),
- `1006` -- no way to set such code manually, indicates that the connection was lost (no close frame).

There are other codes like:

- `1001` -- the party is going away, e.g. server is shutting down, or a browser leaves the page,
- `1009` -- the message is too big to process,
- `1011` -- unexpected error on server,
- ...and so on.

The full list can be found in [RFC6455, §7.4.1](https://tools.ietf.org/html/rfc6455#section-7.4.1).

WebSocket codes are somewhat like HTTP codes, but different. In particular, any codes less than `1000` are reserved, there'll be an error if we try to set such a code.

```js
// in case connection is broken
socket.onclose = event => {
  // event.code === 1006
  // event.reason === ""
  // event.wasClean === false (no closing frame)
};
```


## Connection state

To get connection state, additionally there's `socket.readyState` property with values:

- **`0`** -- "CONNECTING": the connection has not yet been established,
- **`1`** -- "OPEN": communicating,
- **`2`** -- "CLOSING": the connection is closing,
- **`3`** -- "CLOSED": the connection is closed.


## Chat example

Let's review a chat example using browser WebSocket API and Node.js WebSocket module <https://github.com/websockets/ws>. We'll pay the main attention to the client side, but the server is also simple.

HTML: we need a `<form>` to send messages and a `<div>` for incoming messages:

```html
<!-- message form -->
<form name="publish">
  <input type="text" name="message">
  <input type="submit" value="Send">
</form>

<!-- div with messages -->
<div id="messages"></div>
```

From JavaScript we want three things:
1. Open the connection.
2. On form submission -- `socket.send(message)` for the message.
3. On incoming message -- append it to `div#messages`.

Here's the code:

```js
let socket = new WebSocket("wss://javascript.info/article/websocket/chat/ws");

// send message from the form
document.forms.publish.onsubmit = function() {
  let outgoingMessage = this.message.value;

  socket.send(outgoingMessage);
  return false;
};

// message received - show the message in div#messages
socket.onmessage = function(event) {
  let message = event.data;

  let messageElem = document.createElement('div');
  messageElem.textContent = message;
  document.getElementById('messages').prepend(messageElem);
}
```

Server-side code is a little bit beyond our scope. Here we'll use Node.js, but you don't have to. Other platforms also have their means to work with WebSocket.

The server-side algorithm will be:

1. Create `clients = new Set()` -- a set of sockets.
2. For each accepted websocket, add it to the set `clients.add(socket)` and setup `message` event listener to get its messages.
3. When a message received: iterate over clients and send it to everyone.
4. When a connection is closed: `clients.delete(socket)`.

```js
const ws = new require('ws');
const wss = new ws.Server({noServer: true});

const clients = new Set();

http.createServer((req, res) => {
  // here we only handle websocket connections
  // in real project we'd have some other code here to handle non-websocket requests
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

function onSocketConnect(ws) {
  clients.add(ws);

  ws.on('message', function(message) {
    message = message.slice(0, 50); // max message length will be 50

    for(let client of clients) {
      client.send(message);
    }
  });

  ws.on('close', function() {
    clients.delete(ws);
  });
}
```


Here's the working example:

[iframe src="chat" height="100" zip]

You can also download it (upper-right button in the iframe) and run locally. Just don't forget to install [Node.js](https://nodejs.org/en/) and `npm install ws` before running.

## Summary

WebSocket is a modern way to have persistent browser-server connections.

- WebSockets don't have cross-origin limitations.
- They are well-supported in browsers.
- Can send/receive strings and binary data.

The API is simple.

Methods:
- `socket.send(data)`,
- `socket.close([code], [reason])`.

Events:
- `open`,
- `message`,
- `error`,
- `close`.

WebSocket by itself does not include reconnection, authentication and many other high-level mechanisms. So there are client/server libraries for that, and it's also possible to implement these capabilities manually.

Sometimes, to integrate WebSocket into existing project, people run WebSocket server in parallel with the main HTTP-server, and they share a single database. Requests to WebSocket use `wss://ws.site.com`, a subdomain that leads to WebSocket server, while `https://site.com` goes to the main HTTP-server.

Surely, other ways of integration are also possible.
