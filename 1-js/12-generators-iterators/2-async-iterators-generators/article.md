
# async 이터레이터와 제너레이터

비동기 이터레이터(asynchronous iterator)를 사용하면 비동기적으로 들어오는 데이터를 필요에 따라 처리할 수 있습니다. 네트워크를 통해 데이터가 여러 번에 걸쳐 들어오는 상황을 처리할 수 있게 되죠. 비동기 제너레이터(asynchronous generator)를 사용하면 이런 데이터를 좀 더 편리하게 처리할 수 있습니다.

먼저 간단한 예시를 살펴보며 문법을 익힌 후, 실무에서 벌어질 법한 사례를 가지고 async 이터레이터와 제너레이터가 어떻게 사용되는지 알아보겠습니다.

## async 이터레이터

비동기 이터레이터는 일반 이터레이터와 유사하며, 약간의 문법적인 차이가 있습니다.

<info:iterable> 챕터에서 살펴본 바와 같이 '일반' 이터러블은 객체입니다.

```js run
let range = {
  from: 1,
  to: 5,

  // for..of 최초 실행 시, Symbol.iterator가 호출됩니다.
*!*
  [Symbol.iterator]() {
*/!*
    // Symbol.iterator메서드는 이터레이터 객체를 반환합니다.
    // 이후 for..of는 반환된 이터레이터 객체만을 대상으로 동작하는데,
    // 다음 값은 next()에서 정해집니다.
    return {
      current: this.from,
      last: this.to,

      // for..of 반복문에 의해 각 이터레이션마다 next()가 호출됩니다.
*!*
      next() { // (2)
        //  next()는 객체 형태의 값, {done:.., value :...}를 반환합니다.
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

일반 이터레이터에 대한 설명은 <info:iterable>에서 자세히 다루고 있으니, 꼭 살펴보시기 바랍니다.

이제, 이터러블 객체를 비동기적으로 만들려면 어떤 작업이 필요한지 알아봅시다.
1. `Symbol.iterator` 대신, `Symbol.asyncIterator`를 사용해야 합니다. 
2. `next()`는 프라미스를 반환해야 합니다.
3. 비동기 이터러블 객체를 대상으로 하는 반복 작업은 `for await (let item of iterable)` 반복문을 사용해 처리해야 합니다.

익숙한 예시인 이터러블 객체 `range`를 토대로, 일초마다 비동기적으로 값을 반환하는 이터러블 객체를 만들어보겠습니다.

```js run
let range = {
  from: 1,
  to: 5,

  // for await..of 최초 실행 시, Symbol.asyncIterator가 호출됩니다.
*!*
  [Symbol.asyncIterator]() { // (1)
*/!*
    // Symbol.asyncIterator 메서드는 이터레이터 객체를 반환합니다.
    // 이후 for await..of는 반환된 이터레이터 객체만을 대상으로 동작하는데,
    // 다음 값은 next()에서 정해집니다.
    return {
      current: this.from,
      last: this.to,

      // for await..of 반복문에 의해 각 이터레이션마다 next()가 호출됩니다.
*!*
      async next() { // (2)
        //  next()는 객체 형태의 값, {done:.., value :...}를 반환합니다.
        // (객체는 async에 의해 자동으로 프라미스로 감싸집니다.)
*/!*

*!*
        // 비동기로 무언가를 하기 위해 await를 사용할 수 있습니다.
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
4. 반복 작업을 하려면 'for' 뒤에 'await'를 붙인 `for await(let value of range)`를 사용하면 됩니다. `for await(let value of range)`가 실행될 때 `range[Symbol.asyncIterator]()`가 일회 호출되는데, 그 이후엔 각 값을 대상으로 `next()`가 호출됩니다. --  `(4)`

일반 이터레이터와 async 이터레이터를 간략하게 비교하면 다음과 같습니다.

|       | 이터레이터 | async 이터레이터 |
|-------|-----------|-----------------|
| 이터레이터를 제공해주는 메서드 | `Symbol.iterator` | `Symbol.asyncIterator` |
| `next()`가 반환하는 값              | 모든 값         | `Promise`  |
| 반복 작업을 위해 사용하는 반복문                          | `for..of`         | `for await..of` |


````warn header="전개 연산자 `...`은 비동기적으로 동작하지 않습니다."
일반적인 동기 이터레이터가 필요한 기능은 비동기 이터레이터와 함께 사용할 수 없습니다.

전개 연산자는 일반 이터레이터가 필요로 하므로 아래와 같은 코드는 동작하지 않습니다.
```js
alert( [...range] ); // Symbol.iterator가 없기 때문에 에러 발생
```

전개 연산자는 `await`가 없는 `for..of`와 마찬가지로, `Symbol.asyncIterator`가 아닌 `Symbol.iterator`를 찾기 때문에 에러가 발생하는 것은 당연합니다.
````

## async 제너레이터

앞서 배운 바와 같이 자바스크립트에선 제너레이터를 사용할 수 있는데, 제너레이터는 이터러블 객체입니다.

[](info:generators) 챕터에서 살펴본 `start`부터 `end`까지의 연속된 숫자를 생성해주는 제너레이터를 떠올려 봅시다.

```js run
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for(let value of generateSequence(1, 5)) {
  alert(value); // 1, then 2, then 3, then 4, then 5
}
```

일반 제너레이터에선 `await`를 사용할 수 없습니다. 그리고 모든 값은 동기적으로 생산됩니다. `for..of` 어디에서도 딜레이를 줄 만한 곳이 없죠. 일반 제너레이터는 동기적 문법입니다.

그런데 제너레이터 본문에서 `await`를 사용해야만 하는 상황이 발생하면 어떻게 해야 할까요? 아래와 같이 네트워크 요청을 해야 하는 상황이 발생하면 말이죠.

물론 가능합니다. 아래 예시와 같이 `async`를 제너레이터 함수 앞에 붙여주면 됩니다.

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

이제 `for await...of`로 반복이 가능한 async 제너레이터를 사용할 수 있게 되었습니다.

async 제너레이터를 만드는 것은 실제로도 상당히 간단합니다. `async` 키워드를 붙이기만 하면 제너레이터 안에서 프라미스와 기타 async 함수를 기반으로 동작하는 `await`를 사용할 수 있습니다. 

async 제너레이터의 `generator.next()` 메서드는 비동기적이 되고, 프라미스를 반환한다는 점은 일반 제너레이터와 async 제너레이터엔 또 다른 차이입니다.

일반 제너레이터에서는 `result = generator.next()`를 사용해 값을 얻습니다. 반면 async 제너레이터에서는 아래와 같이 `await`를 붙여줘야 합니다.

```js
result = await generator.next(); // result = {value: ..., done: true/false}
```

## async 이터러블

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

[](info:generators) 챕터의 예시를 다시 상기해 봅시다.

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

위 예시에서 커스텀 객체 `range`는 반복 가능하고, 제너레이터 `*[Symbol.iterator]`엔 값을 나열해주는 로직이 구현되어 있습니다.

지금 상태에서 제너레이터에 비동기 동작을 추가하려면, `Symbol.iterator`를 async `Symbol.asyncIterator`로 바꿔야 합니다.

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

## 실제 사례

지금까진 아주 간단한 예시들만 살펴보며, async 제너레이터에 대한 기초를 다졌습니다. 이제 실무에서 접할법한 유스 케이스를 살펴보겠습니다.

상당히 많은 온라인 서비스가 페이지네이션(pagination)을 구현해 데이터를 전송합니다. 사용자 목록이 필요해서 서버에 요청을 보내면, 서버는 일정 숫자(예를 들어 100명의 사용자) 단위로 사용자를 끊어 정보를 '한 페이지'로 구성한 후, 다음 페이지를 볼 수 있는 URL과 함께 응답합니다.

이런 패턴은 사용자 목록 전송뿐만 아니라, 다양한 서비스에서 찾아볼 수 있습니다. GitHub에서 커밋 이력을 볼 때도 페이지네이션이 사용됩니다.

- 클라이언트는 `https://api.github.com/repos/<repo>/commits` 형태의 URL로 요청을 보냅니다.
- GitHub에선 커밋 30개의 정보가 담긴 JSON과 함께, 다음 페이지에 대한 정보를 `Link` 헤더에 담아 응답합니다.
- 더 많은 커밋 정보가 필요하면 헤더에 담긴 링크를 사용해 다음 요청을 보냅니다. 원하는 정보를 얻을 때까지 이런 과정을 반복합니다.

실제 GitHub API는 복잡하지만, 여기선 커밋 정보가 담긴 이터러블 객체를 만들어서 아래와 같이 객체를 대상으로 반복 작업을 할 수 있게 해주는 간단한 API를 만들어 보도록 하겠습니다.

```js
let repo = 'javascript-tutorial/en.javascript.info'; // 커밋 정보를 얻어올 GitHub 리포지토리

for await (let commit of fetchCommits(repo)) {
  // 여기서 각 커밋을 처리함
}
```

필요할 때마다 요청을 보내 커밋 정보를 가져오는 함수 `fetchCommits(repo)`를 만들어 API를 구성하도록 하겠습니다. `fetchCommits(repo)`에서 페이지네이션 관련 일들을 모두 처리하도록 하면 원하는 대로 `for await..of`에서 각 커밋을 처리할 수 있을 겁니다.

async 제너레이터를 이용하면 쉽게 함수를 구현할 수 있습니다.

```js
async function* fetchCommits(repo) {
  let url = `https://api.github.com/repos/${repo}/commits`;

  while (url) {
    const response = await fetch(url, { // (1)
      headers: {'User-Agent': 'Our script'}, // GitHub는 모든 요청에 user-agent헤더를 강제 합니다.
    });

    const body = await response.json(); // (2) 응답은 JSON 형태로 옵니다(커밋이 담긴 배열).

    // (3) 헤더에 담긴 다음 페이지를 나타내는 URL을 추출합니다.
    let nextPage = response.headers.get('Link').match(/<(.*?)>; rel="next"/);
    nextPage = nextPage && nextPage[1];

    url = nextPage;

    for(let commit of body) { // (4) 페이지가 끝날 때까지 커밋을 하나씩 반환(yield)합니다.
      yield commit;
    }
  }
}
```

1. 다운로드는 [fetch](info:fetch) 메서드로 하겠습니다. `fetch`를 사용하면 인증 정보나 헤더 등을 함께 실어 요청할 수 있습니다. GitHub에서 강제하는 `User-Agent`를 헤더에 실어 보내겠습니다.
2. `fetch` 전용 메서드인 `response.json()`을 사용해 요청 결과를 JSON으로 파싱합니다.
3. 응답의 `Link` 헤더에서 다음 페이지의 URL을 얻습니다. 헤더에서 `https://api.github.com/repositories/93253246/commits?page=2`형태의 URL만 추출하기 위해 정규표현식을 사용하였습니다.
4. 커밋을 하나씩 반환하는데, 전체 다 반환되면 다음 `while(url)` 반복문이 트리거 되어 서버에 다시 요청을 보냅니다.

사용법은 다음과 같습니다(콘솔 창을 열어 각 커밋의 author를 확인해보세요).

```js run
(async () => {

  let count = 0;

  for await (const commit of fetchCommits('javascript-tutorial/en.javascript.info')) {

    console.log(commit.author.login);

    if (++count == 100) { // 100번째 커밋에서 멈춥니다.
      break;
    }
  }

})();
```

처음에 구상했던 API가 구현되었습니다. 페이지네이션과 관련된 내부 메커니즘은 바깥에서 볼 수 없고, 우리는 단순히 async 제너레이터를 사용해 원하는 커밋을 반환받기만 하면 됩니다.

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
