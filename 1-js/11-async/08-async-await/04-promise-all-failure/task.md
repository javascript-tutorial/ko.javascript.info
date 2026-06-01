
# 위험한 Promise.all

`Promise.all`은 여러 작업을 병렬로 처리할 때 아주 유용합니다. 여러 서비스에 병렬로 요청을 보내야 할 때 특히 빛을 발합니다.

하지만 숨어 있는 위험이 있습니다. 이번 과제에서는 예시를 통해 어떤 위험이 있는지 살펴보고 이를 피하는 방법을 알아봅시다.

데이터베이스 같은 원격 서비스에 연결한다고 가정해 봅시다.

`connect()`와 `disconnect()`라는 두 함수가 있습니다.

연결된 상태에서는 `database.query(...)`를 사용해 요청을 보낼 수 있습니다. `database.query(...)`는 보통 결과를 반환하지만, 에러를 던질 수도 있는 비동기 함수입니다.

간단히 구현하면 다음과 같습니다.

```js
let database;

function connect() {
  database = {
    async query(isOk) {
      if (!isOk) throw new Error('Query failed');
    }
  };
}

function disconnect() {
  database = null;
}

// 사용법:
// connect()
// ...
// database.query(true)는 성공한 호출을 흉내 냅니다.
// database.query(false)는 실패한 호출을 흉내 냅니다.
// ...
// disconnect()
```

이제 문제가 되는 부분을 살펴봅시다.

연결한 뒤 쿼리 세 개를 병렬로 보내고, 이후 연결을 끊는 코드를 작성했습니다. 각 쿼리는 100ms, 200ms, 300ms처럼 서로 다른 시간이 걸립니다.

```js
// `ms` 밀리초 뒤에 비동기 함수 `fn`을 호출하는 헬퍼 함수
function delay(fn, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => fn().then(resolve, reject), ms);
  });
}

async function run() {
  connect();

  try {
    await Promise.all([
      // 병렬 작업 세 개는 각각 100ms, 200ms, 300ms로 서로 다른 시간이 걸립니다.
      // 이 효과를 내기 위해 `delay` 헬퍼를 사용합니다.
*!*
      delay(() => database.query(true), 100),
      delay(() => database.query(false), 200),
      delay(() => database.query(false), 300)
*/!*
    ]);
  } catch(error) {
    console.log('에러를 처리했습니다. 정말 그럴까요?');
  }

  disconnect();
}

run();
```

세 쿼리 중 두 개는 실패합니다. 그래도 `Promise.all` 호출을 `try..catch` 블록으로 감싸 두었으니 충분해 보입니다.

하지만 이 방법으로는 부족합니다! 실제로 이 스크립트는 콘솔에 잡히지 않은 에러를 남깁니다.

왜 이런 일이 생길까요? 어떻게 피할 수 있을까요?