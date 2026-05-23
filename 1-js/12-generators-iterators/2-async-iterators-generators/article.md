# async 이터레이터와 제너레이터

비동기 이터레이터(asynchronous iterator)를 사용하면 비동기적으로 들어오는 데이터를 필요에 따라 처리할 수 있습니다. 네트워크를 통해 데이터가 여러 번에 걸쳐 들어오는 상황을 처리할 수 있게 되죠. 비동기 이터레이터에 더하여 비동기 제너레이터(asynchronous generator)를 사용하면 이런 데이터를 좀 더 편리하게 처리할 수 있습니다.

먼저 간단한 예시를 살펴보며 문법을 익힌 후, 실무에서 벌어질 법한 사례를 가지고 async 이터레이터와 제너레이터가 어떻게 사용되는지 알아보겠습니다.

## 이터러블 복습

이터러블에 대해 상기해봅시다.

아래와 같은 `range` 객체가 있다고 해보죠.

```js
let range = {
  from: 1,
  to: 5
};
```

이제 이 객체에 `for(value of range)`와 같은 `for..of` 반복문을 적용해 `1`부터 `5`까지의 값을 차례로 얻으려고 합니다.

다시 말해, 객체에 *순회 기능*을 추가하고 싶은 것이죠.

`Symbol.iterator`라는 특수한 메서드를 사용하면 이 기능을 구현할 수 있습니다.

- `for..of` 반복문이 시작될 때, 자바스크립트 엔진은 이 메서드를 호출합니다. 이때 이 메서드는 `next`라는 메서드가 담긴 객체를 반환해야 합니다.
- 각 이터레이션마다 `next()` 메서드를 호출해 다음 값을 가져옵니다.
- `next()`는 `{done: true/false, value: <반복값>}` 형태의 객체를 반환해야 하며, `done: true`는 반복의 끝을 의미합니다.

이터러블 `range`를 직접 구현하면 다음과 같습니다.

```js run
let range = {
  from: 1,
  to: 5,

*!*
  [Symbol.iterator]() { // for..of 최초 실행 시, Symbol.iterator가 호출됩니다.
*/!*
    return {
      current: this.from,
      last: this.to,

*!*
      next() { // 매 이터레이션마다 호출되어 다음 값을 가져옵니다.
*/!*
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

for(let value of range) {
  alert(value); // 1, 2, 3, 4, 5
}
```

일반 이터레이터에 대한 설명은 <info:iterable>에서 자세히 다루고 있으니, 혹시 이해되지 않는 부분이 있다면 해당 챕터를 참고하시길 바랍니다.

## async 이터러블

비동기 이터레이션은 값이 비동기적으로 도착하는 경우에 필요합니다. 예를 들어 `setTimeout` 이후나 다른 종류의 지연이 발생하는 상황이 이에 해당합니다.

가장 흔한 사례는 다음 값을 받아오기 위해 네트워크 요청이 필요한 경우입니다. 이에 대한 실전 예시는 조금 뒤에서 다루겠습니다.

이제, 이터러블 객체를 비동기적으로 만들려면 어떤 작업이 필요한지 알아봅시다.

1. `Symbol.iterator` 대신, `Symbol.asyncIterator`를 사용해야 합니다.
2. `next()`는 다음 값을 담은 프라미스를 반환해야 합니다.
   - `async` 키워드를 사용하면 이 과정을 간단히 처리할 수 있으므로, `async next()` 형태로 작성하면 됩니다.
3. 비동기 이터러블 객체를 대상으로 하는 반복 작업은 `for await (let item of iterable)` 반복문을 사용해 처리해야 합니다.
   - 이때 `await` 키워드가 들어간다는 점에 유의하세요.

익숙한 예시인 이터러블 객체 `range`를 토대로, 일초마다 비동기적으로 값을 반환하는 이터러블 객체를 만들어보겠습니다.

앞서 작성한 코드 몇 군데를 수정하기만 하면 됩니다.

```js run
let range = {
  from: 1,
  to: 5,

*!*
  [Symbol.asyncIterator]() { // (1)
*/!*
    return {
      current: this.from,
      last: this.to,

*!*
      async next() { // (2)
*/!*

*!*
        // 주목할 점: async next() 내부에서는 "await"를 사용할 수 있습니다.
        await new Promise(resolve => setTimeout(resolve, 1000)); // (3)
*/!*

        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

(async () => {

*!*
  for await (let value of range) { // (4)
    alert(value); // 1,2,3,4,5
  }
*/!*

})()
```

위 예시에서 볼 수 있듯이, async 이터레이터는 일반 이터레이터와 구조가 유사합니다. 하지만 아래와 같은 차이가 있습니다.

1. 객체를 비동기적으로 반복 가능하도록 하려면, `Symbol.asyncIterator`메서드가 반드시 구현되어 있어야 합니다. -- `(1)`
2. `Symbol.asyncIterator`는 프라미스를 반환하는 메서드인 `next()`가 구현된 객체를 반환해야 합니다. -- `(2)`
3. `next()`는 `async` 메서드일 필요는 없습니다. 프라미스를 반환하는 메서드라면 일반 메서드도 괜찮습니다. 다만, `async`를 사용하면 `await`도 사용할 수 있기 때문에, 여기선 편의상 `async`메서드를 사용해 일 초의 딜레이가 생기도록 했습니다. -- `(3)`
4. 반복 작업을 하려면 'for' 뒤에 'await'를 붙인 `for await(let value of range)`를 사용하면 됩니다. `for await(let value of range)`가 실행될 때 `range[Symbol.asyncIterator]()`가 한 번 호출되는데, 그 이후엔 각 값을 대상으로 `next()`가 호출됩니다. -- `(4)`

일반 이터레이터와 async 이터레이터를 간략하게 비교하면 다음과 같습니다.

|                                  | 이터레이터        | async 이터레이터       |
| -------------------------------- | ----------------- | ---------------------- |
| 이터레이터를 제공해주는 메서드   | `Symbol.iterator` | `Symbol.asyncIterator` |
| `next()`가 반환하는 값           | 모든 값           | `Promise`              |
| 반복 작업을 위해 사용하는 반복문 | `for..of`         | `for await..of`        |

````warn header="전개 구문 `...`은 비동기적으로 동작하지 않습니다."
일반적인 동기 이터레이터가 필요한 기능은 비동기 이터레이터와 함께 사용할 수 없습니다.

전개 구문은 일반 이터레이터가 필요로 하므로 아래와 같은 코드는 동작하지 않습니다.

```js
alert( [...range] ); // Symbol.iterator가 없기 때문에 에러 발생
```

전개 구문은 `await`가 없는 `for..of`와 마찬가지로, `Symbol.asyncIterator`가 아닌 `Symbol.iterator`를 찾기 때문에 에러가 발생하는 것은 당연합니다.

````

## 제너레이터 복습

이번엔 제너레이터를 상기해봅시다. 제너레이터를 활용하면 반복 코드를 훨씬 간결하게 작성할 수 있으며, 실제로 이터러블을 만들 때는 대부분 제너레이터를 사용합니다.

핵심만 간단히 말하면, 제너레이터는 '값을 생성(yield)하는 함수'입니다. 자세한 설명은 [](info:generators) 챕터를 참고하세요.

제너레이터는 `function*`으로 선언하고(별표에 주목하세요), `yield`로 값을 생성하며, `for..of`로 반복할 수 있습니다.

다음 예시는 시작(`start`) 값부터 끝(`end`) 값까지 연속된 값을 생성하는 코드입니다.


```js run
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for(let value of generateSequence(1, 5)) {
  alert(value); // 1, 2, 3, 4, 5
}
```

이미 배웠듯이, 반복 가능한 객체를 만들려면 객체에 `Symbol.iterator`를 추가해야 합니다.

```js
let range = {
  from: 1,
  to: 5,
*!*
  [Symbol.iterator]() {
    return <range를 반복가능하게 만드는 next가 구현된 객체>
  }
*/!*
}
```

그런데 `Symbol.iterator`는 위 예시와 같이 `next`가 구현된 일반 객체를 반환하는 것 보다, 제너레이터를 반환하도록 구현하는 경우가 더 많습니다.

```js run
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() { // [Symbol.iterator]: function*()를 짧게 줄임
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

for(let value of range) {
  alert(value); // 1, 2, 3, 4, 5
}
```

자세한 내용은 [](info:generators) 챕터를 참고하세요.

일반 제너레이터에선 `await`를 사용할 수 없습니다. `for..of` 구문의 특성상 모든 값은 동기적으로 만들어집니다.

비동기적으로 값을 생성해야 할 때는 어떻게 해야 할까요? 예를 들어 네트워크 요청을 통해 값을 가져오는 경우처럼 말이죠.

이럴 때는 비동기 제너레이터를 사용하면 됩니다.

## async 제너레이터

비동기적으로 값의 시퀀스를 생성하는 객체가 필요한 대부분의 경우, 비동기 제너레이터를 사용하면 됩니다.

문법은 간단합니다. `function*` 앞에 `async`를 붙이기만 하면 됩니다. 이렇게 하면 제너레이터가 비동기적으로 동작합니다.

이후 `for await (...)`으로 반복할 수 있습니다. 아래처럼 말이죠.

```js run
*!*async*/!* function* generateSequence(start, end) {

  for (let i = start; i <= end; i++) {

*!*
    // await를 사용할 수 있습니다!
    await new Promise(resolve => setTimeout(resolve, 1000));
*/!*

    yield i;
  }

}

(async () => {

  let generator = generateSequence(1, 5);
  for *!*await*/!* (let value of generator) {
    alert(value); // 1, 2, 3, 4, 5
  }

})();
```

제너레이터가 비동기이므로 내부에서 `await`를 사용할 수 있고, 프라미스나 네트워크 요청 등도 자유롭게 활용할 수 있습니다.

````smart header="내부적인 구조"
제너레이터의 내부 동작을 잘 알고 있는 독자라면, async 제너레이터에는 내부적인 차이가 있다는 것을 눈치챘을 것입니다.

비동기 제너레이터는 `generator.next()` 메서드가 비동기로 동작하며 프라미스를 반환합니다.

일반 제너레이터에서는 `result = generator.next()`를 사용해 값을 얻습니다. 반면 async 제너레이터에서는 아래와 같이 `await`를 붙여줘야 합니다.

```js
result = await generator.next(); // result = {value: ..., done: true/false}
```

이것이 async 제너레이터가 `for await...of`와 함께 동작하는 이유입니다.
````

### async 이터러블 range

일반 제너레이터를 `Symbol.iterator`로 사용하면 반복 코드를 더욱 간결하게 만들 수 있습니다.

마찬가지로 async 제너레이터를 `Symbol.asyncIterator`로 사용하면 비동기 반복을 구현할 수 있습니다.

예를 들어 동기적인 `Symbol.iterator`를 비동기적인 `Symbol.asyncIterator`로 교체하면, `range` 객체가 1초 간격으로 비동기적으로 값을 생성합니다.

```js run
let range = {
  from: 1,
  to: 5,

*!*
  async *[Symbol.asyncIterator]() { // [Symbol.asyncIterator]: async function*()와 동일
*/!*
    for(let value = this.from; value <= this.to; value++) {

      // 값 사이 사이에 약간의 공백을 줌
      await new Promise(resolve => setTimeout(resolve, 1000));

      yield value;
    }
  }
};

(async () => {

  for *!*await*/!* (let value of range) {
    alert(value); // 1, 2, 3, 4, 5
  }

})();
```

이제 1초의 간격을 두고 값을 얻을 수 있습니다.

```smart
기술적으로는 하나의 객체에 `Symbol.iterator`와 `Symbol.asyncIterator`를 모두 추가해, 동기(`for..of`)와 비동기(`for await..of`) 반복을 모두 지원하도록 만들 수도 있습니다.

다만 실제로 그렇게 할 일은 거의 없습니다.
```

## 실제 사례: 페이지네이션된 데이터

지금까진 아주 간단한 예시들만 살펴보며, async 제너레이터에 대한 기초를 다졌습니다. 이제 실무에서 접할법한 유스 케이스를 살펴보겠습니다.

상당히 많은 온라인 서비스가 페이지네이션(pagination)을 구현해 데이터를 전송합니다. 사용자 목록이 필요해서 서버에 요청을 보내면, 서버는 일정 숫자(예를 들어 100명의 사용자) 단위로 사용자를 끊어 정보를 '한 페이지'로 구성한 후, 다음 페이지를 볼 수 있는 URL과 함께 응답합니다.

이런 패턴은 사용자 목록 전송뿐만 아니라, 다양한 서비스에서 찾아볼 수 있습니다.

GitHub에서 커밋 이력을 볼 때도 페이지네이션이 사용됩니다.

- 클라이언트는 `https://api.github.com/repos/<repo>/commits` 형태의 URL로 요청을 보냅니다.
- GitHub에선 커밋 30개의 정보가 담긴 JSON과 함께, 다음 페이지에 대한 정보를 `Link` 헤더에 담아 응답합니다.
- 더 많은 커밋 정보가 필요하면 헤더에 담긴 링크를 사용해 다음 요청을 보냅니다. 원하는 정보를 얻을 때까지 이런 과정을 반복합니다.

이제 코드로 커밋 정보를 더 간단히 가져오는 방법을 구현해봅시다.

필요할 때마다 요청을 보내 커밋 정보를 가져오는 함수 `fetchCommits(repo)`를 만들어 API를 구성해봅시다. `fetchCommits(repo)`에서 페이지네이션 관련 일들을 모두 처리하도록 하면 원하는 대로 비동기 이터레이션인 `for await..of`에서 각 커밋을 처리할 수 있을 겁니다.

사용 방법은 다음과 같습니다.

```js
for await (let commit of fetchCommits("username/repository")) {
  // 여기서 각 커밋을 처리함
}
```

아래는 async 제너레이터로 구현한 함수입니다.

```js
async function* fetchCommits(repo) {
  let url = `https://api.github.com/repos/${repo}/commits`;

  while (url) {
    const response = await fetch(url, {
      // (1)
      headers: { 'User-Agent': 'Our script' }, // GitHub는 모든 요청에 user-agent 헤더를 강제 합니다.
    });

    const body = await response.json(); // (2) 응답은 JSON 형태로 옵니다(커밋이 담긴 배열).

    // (3) 헤더에 담긴 다음 페이지를 나타내는 URL을 추출합니다.
    let nextPage = response.headers.get('Link').match(/<(.*?)>; rel="next"/);
    nextPage = nextPage?.[1];

    url = nextPage;

    for (let commit of body) { // (4) 페이지가 끝날 때까지 커밋을 하나씩 반환(yield)합니다.
      yield commit;
    }
  }
}
```

동작 방식을 좀 더 자세히 설명하면 다음과 같습니다.

1. 커밋을 내려받을 때는 브라우저의 [fetch](info:fetch) 메서드를 사용합니다.
   - 시작 URL은 `https://api.github.com/repos/<repo>/commits`이며, 다음 페이지 URL은 응답의 `Link` 헤더에 담겨 옵니다.
   - `fetch` 메서드를 사용하면 필요 시 인증 정보나 헤더를 함께 전송할 수 있습니다. GitHub는 `User-Agent` 헤더를 필수로 요구합니다.
2. 커밋은 JSON 형식으로 반환됩니다.
3. 응답의 `Link` 헤더에서 다음 페이지의 URL을 추출합니다. 헤더의 형식이 특수하여 정규표현식을 사용합니다([정규표현식](info:regular-expressions) 챕터에서 자세히 다룹니다). 다음 페이지 URL은 `https://api.github.com/repositories/93253246/commits?page=2`와 같은 형태로, GitHub가 자체적으로 생성합니다.
4. 이후 커밋을 하나씩 yield하며, 모두 반환된 뒤에는 다음 `while(url)` 반복이 실행되어 서버에 추가 요청을 보냅니다.

사용법은 다음과 같습니다(콘솔 창을 열어 각 커밋의 author를 확인해보세요).

```js run
(async () => {
  let count = 0;

  for await (const commit of fetchCommits(
    'javascript-tutorial/en.javascript.info',
  )) {
    console.log(commit.author.login);

    if (++count == 100) {
      // 100번째 커밋에서 멈춥니다.
      break;
    }
  }
})();

// 주의: 외부 샌드박스(외부 실행 환경)에서 테스트해 보실 분들은, 앞서 살펴본 fetchCommits 함수 코드를 여기에 복사·붙여넣기 해야 정상적으로 동작합니다.
```

처음에 구상했던 API가 구현되었습니다.

페이지네이션과 관련된 내부 메커니즘은 바깥에서 볼 수 없고, 우리는 단순히 async 제너레이터를 사용해 원하는 커밋을 반환받기만 하면 됩니다.

## 요약

일반적인 이터레이터와 제너레이터는 데이터를 가져오는 데 시간이 걸리지 않을 때에 적합합니다.

그런데 약간의 지연이 있어서 데이터가 비동기적으로 들어오는 경우 async 이터레이터와 async 제너레이터, `for..of`대신 `for await..of`를 사용하게 됩니다.

일반 이터레이터와 async 이터레이터의 문법 차이는 다음과 같습니다.

|       | iterable | async iterable |
|-------|-----------|-----------------|
| iterator를 반환하는 메서드 | `Symbol.iterator` | `Symbol.asyncIterator` |
| `next()`가 반환하는 값 | `{value:…, done: true/false}`         | `{value:…, done: true/false}`를 감싸는 `Promise` |

일반 제너레이터와 async 제너레이터의 문법 차이는 다음과 같습니다.

|       | generators | async generator |
|-------|-----------|-----------------|
| 선언 | `function*` | `async function*` |
| `next()`가 반환하는 값          | `{value:…, done: true/false}`         | `{value:…, done: true/false}`를 감싸는 `Promise`  |

웹 개발을 하다 보면 띄엄띄엄 들어오는 데이터 스트림을 다뤄야 하는 경우가 자주 생깁니다. 용량이 큰 파일을 다운로드하거나 업로드 할 때와 같이 말이죠.

이런 데이터를 처리할 때 async 제너레이터를 사용할 수 있습니다. 참고로 브라우저 등의 몇몇 호스트 환경은 데이터 스트림을 처리할 수 있게 해주는 API인 Streams을 제공하기도 합니다. Streams API에서 제공하는 특별한 인터페이스를 사용하면, 데이터를 변경하여 한 스트림에서 다른 스트림으로 데이터를 전달할 수 있습니다. 따라서 한쪽에서 받은 데이터를 다른 쪽에 즉각 전달하는 게 가능해집니다.
