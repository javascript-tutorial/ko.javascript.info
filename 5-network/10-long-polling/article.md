# 롱 폴링

롱 폴링(long polling)을 사용하면 웹소켓이나 server-sent event 같은 특정한 프로토콜을 사용하지 않아도 아주 간단히 서버와 지속적인 커넥션을 유지할 수 있습니다.

롱 폴링은 구현이 매우 쉽고 다양한 경우에 사용할 수 있습니다.

## 폴링

폴링(regular polling)을 사용하면 서버에서 새로운 정보를 아주 간단히 받을 수 있습니다. 10초에 한 번씩 서버에 "안녕하세요. 저 클라이언트인데 새로운 정보 줄거 있나요?" 라고 요청을 보내는 식으로 말이죠.

In response, the server first takes a notice to itself that the client is online, and second - sends a packet of messages it got till that moment.

폴링은 지속적인 커넥션 유지라는 목적을 달성시켜 주지만 몇 가지 단점이 있습니다.
1. 메시지 전달이 지연(예: 요청 주기가 10초인 경우엔 10초)됩니다.
2. 전달할 메시지가 없는 경우에도 서버는 일정 주기마다(예: 10초마다) 요청 폭탄을 받습니다. 사용자가 다른 곳으로 전환했거나 중지 상태(sleep mode)라도 마찬가지입니다. 성능 면에서 불리합니다.

서비스 규모가 작은 경우 폴링은 꽤 괜찮은 방식입니다. 하지만 일반적인 경우엔 개선이 필요합니다.

## 롱 폴링

롱 폴링(long polling)은 일반 폴링보단 더 나은 방식입니다.

롱 폴링은 폴링과 마찬가지로 구현이 쉬운데, 지연 없이 메시지를 전달한다는 차이가 있습니다.

롱 폴링은 다음 절차로 이뤄집니다.

1. 서버에 요청이 전달됩니다.
2. 서버는 전송할 메시지를 확보하기 전까지(이벤트 발생 전까지) 커넥션을 끊지 않고 유지합니다.
3. 전송할 메시지를 확보하면(이벤트가 발생하면) 서버는 이 메시지를 가지고 요청에 대해 응답합니다.
4. 브라우저는 응답을 받자마자 또 다른 새 요청을 보냅니다.

롱 폴링은 브라우저가 요청을 보내고 서버와의 커넥션이 대기 중인 경우 표준으로 사용되는 방식입니다. 서버에서 클라이언트로 메시지가 전달된 후에만 커넥션이 다시 생성됩니다.

![](long-polling.svg)

롱 폴링 방식에선 네트워크 에러 등으로 커넥션이 유실되면 브라우저가 즉시 새로운 요청을 보냅니다.

다음과 같은 클라이언트 측 구독(`subscribe`) 함수는 롱 요청을 가능하게 해줍니다.

```js
async function subscribe() {
  let response = await fetch("/subscribe");

  if (response.status == 502) {
    // 502 상태코드는 커넥션 타임아웃 에러(connection timeout error)를 나타내는데,
    // 커넥션 대기 시간이 너무 길거나
    // 리모트 서버 혹은 프록시 서버가 커넥션을 종료한 경우 발생합니다.
    // 재연결을 시도합니다.
    await subscribe();
  } else if (response.status != 200) {
    // 에러가 발생하면 에러 관련한 메시지를 보여줍니다.
    showMessage(response.statusText);
    // 1초 후 재연결을 시도합니다.
    await new Promise(resolve => setTimeout(resolve, 1000));
    await subscribe();
  } else {
    // 응답받은 메시지를 보여줍니다.
    let message = await response.text();
    showMessage(message);
    // 다음 메시지를 받기 위해 다시 subscribe()를 호출합니다.
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
