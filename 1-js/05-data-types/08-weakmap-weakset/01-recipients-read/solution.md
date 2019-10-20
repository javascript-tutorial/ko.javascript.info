`위크셋`에 읽음 상태의 메시지를 저장해봅시다.

```js run
let messages = [
  {text: "Hello", from: "John"},
  {text: "How goes?", from: "John"},
  {text: "See you soon", from: "Alice"}
];

let readMessages = new WeakSet();

// 메시지 두 개가 읽음 상태로 변경되었습니다.
readMessages.add(messages[0]);
readMessages.add(messages[1]);
// readMessages엔 요소 두 개가 저장됩니다.

// 첫 번째 메시지를 다시 읽어봅시다!
readMessages.add(messages[0]);
// readMessages에는 요소 두 개가 여전히 저장되어 있습니다(중복 요소 없음).

// "'message[0]'은 읽음 상태인가요?"에 대한 답변
alert("message 0은 읽음 상태인가요?: " + readMessages.has(messages[0])); // true

messages.shift();
// 이제 readMessagesreadMessages에는 요소가 하나만 남게 되었습니다(실제 메모리에서 사라지는 건 나중이 되겠지만 말이죠).
```

`위크셋`을 사용하면 메시지를 저장하고 위크셋 내에 메시지가 있는지 여부를 쉽게 확인할 수 있습니다. 

위크셋은 자동으로 자신을 청소한다는 장점이 있습니다. 다만 이 장점 때문에 반복 작업이 불가능해서 읽음 상태의 메시지를 '한꺼번에' 가지고 오지 못한다는 단점도 생깁니다. 배열에 저장된 모든 메시지를 대상으로 반복 작업을 수행해 해당 메시지가 위크셋에 저장되어 있는지 확인하면 읽음 상태의 메시지를 '한 번에' 얻어올 수 있습니다.

위크셋을 사용하지 않고 메시지 객체에 `message.isRead=true`같은 프로퍼티를 추가해도 메시지가 읽음 상태인지 확인할 수 있습니다. 그런데 messages와 메시지 객체는 외부 코드에서 관리하고 있기 때문에 이 방법을 권장하는 편은 아닙니다. 심볼형 프로퍼티를 사용하면 충돌을 피할 수는 있습니다.

예시:
```js
// 우리 코드에서만 심볼형 프로퍼티의 정보를 얻을 수 있습니다.
let isRead = Symbol("isRead");
messages[0][isRead] = true;
```

이렇게 하면 서드파티 코드에서는 위에서 추가한 여분의 프로퍼티를 볼 수 없습니다.

심볼을 사용하면 문제 발생 확률을 낮출 순 있지만, `위크셋`을 쓰는 게 보다 건설적인 접근법입니다.
