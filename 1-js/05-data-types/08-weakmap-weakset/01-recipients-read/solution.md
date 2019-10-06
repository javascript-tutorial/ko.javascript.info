다음과 같이 `WeakSet`에 읽은 메시지들을 저장해봅시다.

```js
let messages = [
  {text: "Hello", from: "John"},
  {text: "How goes?", from: "John"},
  {text: "See you soon", from: "Alice"}
];

let readMessages = new WeakSet();

// 메시지 두 개가 읽혔습니다.
readMessages.add(messages[0]);
readMessages.add(messages[1]);
// readMessages가 요소 두 개를 갖습니다.

// ...첫 번째 메시지를 다시 읽어봅시다!
readMessages.add(messages[0]);
// readMessages는 여전히 유니크한 두 개의 요소를 갖습니다.

// 답변: 'message[0]'이 읽혔는가?
alert("message 0 이 읽혔는가?: " + readMessages.has(messages[0])); // true

messages.shift();
// 이제 readMessages는 한 개의 요소를 갖습니다. (기술적으로 메모리에서는 후에 삭제될 것입니다.)
```

`WeakSet`를 사용하면 메시지들을 저장하고 메시지의 존재 여부를 쉽게 확인할 수 있습니다. 

위크셋은 알아서 자동적으로 청소됩니다. 반면 단점은 반복 작업이 불가능해서 '모든 읽은 메시지'를 바로 가져올 수 없습니다. 모든 메시지를 반복하고 필터링 하고 싶다면 위크셋 대신 셋을 사용하면 됩니다.

또 다른 해결법은 메시지가 읽힌 후에 메세지에 `message.isRead=true`같은 프로퍼티를 추가하는 것입니다. messages 객체가 다른 코드에 의해 관리되기 때문에 일반적으로 권장되지는 않지만, 심볼 프로퍼티를 사용하여 충돌을 피할 수는 있습니다. 

예시:
```js
// 심볼 프로퍼티는 우리에게만 알려져 있습니다.
let isRead = Symbol("isRead");
messages[0][isRead] = true;
```

이렇게 하면 서드파티 코드에서는 우리의 추가적인 프로퍼티를 볼 수 없을 겁니다.

심볼이 문제 발생 확률을 낮출 수는 있지만, 보다 건설적인 관점에서 보자면 `WeakSet`을 쓰는 것이 더 좋습니다.
