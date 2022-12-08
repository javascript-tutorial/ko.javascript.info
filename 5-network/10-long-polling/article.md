# 롱 폴링

폴링(long polling)을 사용하면 웹소켓이나 server-sent event 같은 특정한 프로토콜을 사용하지 않아도 아주 간단히 서버와 지속적인 커넥션을 유지할 수 있습니다.

Being very easy to implement, it's also good enough in a lot of cases.

## Regular Polling

폴링(regular polling)을 사용하면 서버에서 새로운 정보를 아주 간단히 받을 수 있습니다. 10초에 한 번씩 서버에 "안녕하세요. 저 클라이언트인데 새로운 정보 줄거 있나요?" 라고 요청을 보내는 식으로 말이죠.

In response, the server first takes a notice to itself that the client is online, and second - sends a packet of messages it got till that moment.

That works, but there are downsides:
1. Messages are passed with a delay up to 10 seconds (between requests).
2. Even if there are no messages, the server is bombed with requests every 10 seconds, even if the user switched somewhere else or is asleep. That's quite a load to handle, speaking performance-wise.

So, if we're talking about a very small service, the approach may be viable, but generally, it needs an improvement.

## Long polling

롱 폴링(long polling)은 일반 폴링보단 더 나은 방식입니다.

It's also very easy to implement, and delivers messages without delays.

The flow:

1. A request is sent to the server.
2. The server doesn't close the connection until it has a message to send.
3. When a message appears - the server responds to the request with it.
4. The browser makes a new request immediately.

The situation when the browser sent a request and has a pending connection with the server, is standard for this method. Only when a message is delivered, the connection is reestablished.

![](long-polling.svg)

If the connection is lost, because of, say, a network error, the browser immediately sends a new request.

다음과 같은 클라이언트 측 구독(`subscribe`) 함수는 롱 요청을 가능하게 해줍니다.

```js
async function subscribe() {
  let response = await fetch("/subscribe");

  if (response.status == 502) {
    // Status 502 is a connection timeout error,
    // may happen when the connection was pending for too long,
    // and the remote server or a proxy closed it
    // let's reconnect
    await subscribe();
  } else if (response.status != 200) {
    // An error - let's show it
    showMessage(response.statusText);
    // Reconnect in one second
    await new Promise(resolve => setTimeout(resolve, 1000));
    await subscribe();
  } else {
    // Get and show the message
    let message = await response.text();
    showMessage(message);
    // Call subscribe() again to get the next message
    await subscribe();
  }
}

subscribe();
```

롱 폴링을 구현한 함수 `subscribe`는 보시다시피 fetch를 사용해 요청을 보내고 응답이 올 때까지 기다린다음 응답을 처리하고 스스로 다시 요청을 보냅니다.

```warn header="Server should be ok with many pending connections"
The server architecture must be able to work with many pending connections.

Certain server architectures run one process per connection, resulting in there being as many processes as there are connections, while each process consumes quite a bit of memory. So, too many connections will just consume it all.

That's often the case for backends written in languages like PHP and Ruby.

Servers written using Node.js usually don't have such problems.

That said, it isn't a programming language issue. Most modern languages, including PHP and Ruby allow to implement a proper backend. Just please make sure that your server architecture works fine with many simultaneous connections.
```

## Demo: a chat

Here's a demo chat, you can also download it and run locally (if you're familiar with Node.js and can install modules):

[codetabs src="longpoll" height=500]

Browser code is in `browser.js`.

## Area of usage

Long polling works great in situations when messages are rare.

If messages come very often, then the chart of requesting-receiving messages, painted above, becomes saw-like.

Every message is a separate request, supplied with headers, authentication overhead, and so on.

So, in this case, another method is preferred, such as [Websocket](info:websocket) or [Server Sent Events](info:server-sent-events).
