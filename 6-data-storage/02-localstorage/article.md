# localStorage와 sessionStorage

웹 저장소 객체인 `localStorage`와 `sessionStorage`는 브라우저 내에서 키-값 쌍을 저장하도록 합니다.

흥미로운 점은 페이지를 새로고침하고(`sessionStorage`의 경우) 심지어 브라우저를 다시 실행해도(`localStorage`의 경우) 데이터가 남아있다는 것입니다. 이 부분은 조만간 뒤에서 살펴보기로 합시다.

이미 쿠키가 있는데 왜 추가적인 객체를 사용할까요?

- 쿠키와 다르게 웹 저장소 객체는 요청할 때마다 서버로 전송되지 않습니다. 그래서 더 많이 보관할 수 있죠. 대부분의 브라우저가 최소 2메가바이트 혹은 그 이상의 웹 저장소 객체를 저장할 수 있도록 해주고, 웹 저장소 구성 방식을 설정할 수 있게 해줍니다.
- 쿠키와 또 다른 점은 서버가 HTTP 헤더를 통해 저장소 객체를 조작할 수 없다는 것입니다. 모든 것은 자바스크립트 내에서 수행됩니다.
- 저장소는 도메인/프로토콜/포트로 정의되는 오리진(origin)에 엮여있습니다. 즉 프로토콜과 서브 도메인이 다르면 나타내는 저장소도 달라서 서로의 데이터에 접근할 수 없습니다.

두 저장소 객체는 같은 메서드와 프로퍼티를 제공합니다.

- `setItem(key, value)` -- 키-값 쌍을 보관합니다.
- `getItem(key)` -- 키로 값을 받아옵니다.
- `removeItem(key)` -- 키와 해당 값을 삭제합니다.
- `clear()` -- 모든 항목을 삭제합니다.
- `key(index)` -- 주어진 위치의 키를 받아옵니다.
- `length` -- 저장된 항목의 개수를 나타냅니다.

이들은 마치 `Map` 컬렉션(`setItem/getItem/removeItem`) 같으면서도 순서를 가지고 있어서 `key(index)`를 이용해 인덱스로 접근할 수 있습니다.

이제 어떻게 동작하는지 살펴봅시다.

## localStorage 데모

`localStorage`의 주요 기능은 다음과 같습니다.

- 같은 오리진을 가진 모든 탭과 창끼리 공유됩니다.
- 데이터는 파기되지 않습니다. 브라우저나 OS가 재시작하더라도 여전히 남아있습니다.

아래의 코드를 실행해보세요.

```js run
localStorage.setItem('test', 1);
```

이제 브라우저를 닫고 열거나 그냥 다른 창에 같은 페이지를 열어보세요. 그럼 이런 결과가 나올 겁니다.

```js run
alert( localStorage.getItem('test') ); // 1
```

같은 오리진(domain/port/protocol)을 가진다면 url 경로는 달라도 됩니다.

`localStorage`는 동일한 오리진을 가진 모든 창끼리 공유됩니다. 따라서 한 창에 데이터를 설정하면 다른 창에도 변동 사항이 보일 것입니다.

## 유사 객체 접근

키를 받아오고 저장할 때 아래처럼 일반 객체를 사용할 수 있습니다.

```js run
// 키 설정하기
localStorage.test = 2;

// 키 받아오기
alert( localStorage.test ); // 2

// 키 삭제하기
delete localStorage.test;
```

이런 방법은 오래전부터 사용해왔고 대부분 작동하지만, 일반적으로는 추천하지 않습니다.

1. 사용자가 생성한 키는 `length`나 `toString` 혹은 `localStorage`의 또 다른 내장 메서드 등 어떤 것이든 될 수 있습니다. 이럴 경우 `getItem/setItem`이 정상적으로 작동해도 유사 객체 접근에는 실패할 수 있습니다.
    ```js run
    let key = 'length';
    localStorage[key] = 5; // 에러, length를 할당할 수 없습니다.
    ```

2. 데이터를 수정하면 `storage` 이벤트가 발생합니다. 이 이벤트는 유사 객체 접근에는 일어나지 않습니다. 이 부분은 챕터 후반부에 자세히 다루겠습니다.

## 키 순회하기

지금까지 살펴본 것처럼 메서드는 "키로 받아오고, 설정하고, 삭제하는" 기능을 제공합니다. 모든 값이나 키는 어떻게 받아올 수 있을까요?

공교롭게도 저장소 객체는 반복 가능(iterable, 이터러블)하지 않습니다.

배열처럼 반복하면서 순회하는 방법이 있습니다.

```js run
for(let i=0; i<localStorage.length; i++) {
  let key = localStorage.key(i);
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

또 다른 방법은 `for key in localStorage` 반복문을 사용하는 것입니다. 일반적인 객체를 다루듯이요.

하지만 이렇게 하면 키를 순회하면서 필요하지 않은 내장 필드 값까지 출력합니다.

```js run
// 올바르지 않은 시도
for(let key in localStorage) {
  alert(key); // getItem, setItem과 다른 내장된 항목까지 보여줍니다.
}
```

그래서 `hasOwnProperty`를 이용해 프로토타입에서 항목을 골라내야 합니다.

```js run
for(let key in localStorage) {
  if (!localStorage.hasOwnProperty(key)) {
    continue; // "setItem", "getItem" 등의 키를 건너뜁니다.
  }
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

아니면 `Object.keys`로 "자기 자신"의 키를 받아온 다음 순회합니다.

```js run
let keys = Object.keys(localStorage);
for(let key of keys) {
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

후자는 `Object.keys`가 해당 객체에 속한 키만 반환하고 프로토타입을 무시하는 방식으로 작동합니다.


## 문자열만 사용

키와 값은 반드시 문자열이어야 합니다.

숫자나 객체 등 다른 자료형이라면 문자열로 자동 변환됩니다. 

```js run
sessionStorage.user = {name: "John"};
alert(sessionStorage.user); // [object Object]
```

객체를 저장하고 싶다면 `JSON`을 사용할 수 있습니다.

```js run
sessionStorage.user = JSON.stringify({name: "John"});

// 잠시 후 
let user = JSON.parse( sessionStorage.user );
alert( user.name ); // John
```

저장소 객체 전체를 문자열로 변환하는 것도 가능합니다. 예를 들면 디버깅 목적으로요.

```js run
// 보기 좋도록 JSON.stringify에 서식 옵션을 추가했습니다.
alert( JSON.stringify(localStorage, null, 2) );
```


## sessionStorage

`sessionStorage` 객체는 `localStorage`에 비해 자주 사용하지 않습니다.

프로퍼티와 메서드는 같지만, 훨씬 제한적이기 때문입니다.

- `sessionStorage`는 현재 브라우저 탭 내에서만 존재합니다.
  - 같은 페이지에 접속한 또 다른 탭은 다른 저장소를 가지고 있습니다.
  - 하지만 동일한 탭에 있는 iframe은 같은 오리진에서 왔다고 가정하고 공유합니다.
- 데이터는 페이지를 새로고침하면 남아있지만, 탭을 닫고 새로 열 때는 사라집니다.

실전에 들어가 봅시다.

아래의 코드를 실행해보세요.

```js run
sessionStorage.setItem('test', 1);
```

그리고 페이지를 새로고침 해보세요. 데이터가 여전히 남아있을 겁니다.

```js run
alert( sessionStorage.getItem('test') ); // 새로고침 후: 1
```

하지만 다른 탭에서 같은 페이지를 열고 다시 해보면 위의 코드는 "아무것도 찾을 수 없다"는 뜻의 `null`을 반환할 것입니다.

`sessionStorage`는 오리진뿐만 아니라 브라우저 탭에도 엮여있기 때문입니다. 그래서 `sessionStorage`는 잘 쓰지 않습니다.

## 저장소 이벤트

데이터를 `localStorage`나 `sessionStorage`에서 갱신할 때 [저장소](https://www.w3.org/TR/webstorage/#the-storage-event) 이벤트가 아래의 프로퍼티와 함께 실행됩니다.

- `key` – 변경된 키 (`.clear()`를 호출했다면 `null`)
- `oldValue` – 예전 값 (키가 새롭게 추가되었다면 `null`)
- `newValue` – 새로운 값 (키가 삭제되었다면 `null`)
- `url` – 갱신한 문서의 url
- `storageArea` – 갱신한 곳의 `localStorage`나 `sessionStorage` 객체

중요한 점은 발생한 곳을 제외하고 저장소가 접근할 수 있는 모든 `window` 객체에서 이벤트가 발생한다는 것입니다.

자세히 알아볼게요.

같은 사이트를 두 개의 창에 각자 띄워놨다고 생각해봅시다. `localStorage`는 서로 공유되겠죠.

```online
다음의 코드를 실행하기 위해 이 페이지를 두 개의 브라우저 창에 띄우세요.
```

두 창이 `window.onstorage`를 수신하기 위해 대기 상태에 있다면, 각각의 창은 다른 하나에서 갱신한 내용을 반영할 것입니다.

```js run
// 다른 문서에서 갱신한 내용을 같은 저장소에 적용합니다.
window.onstorage = event => {
  if (event.key != 'now') return;
  alert(event.key + ':' + event.newValue + " at " + event.url);
};

localStorage.setItem('now', Date.now());
```

이벤트는 `event.url`를 가지고 있어서 데이터가 갱신된 문서의 url을 알 수 있습니다.

또한 `event.storageArea`는 저장소 객체를 포함하고 있어 수정된 부분을 참조하고 있습니다. 이는 `sessionStorage`와 `localStorage` 모두 동일합니다. 변경 사항에 "대응"하기 위해 이 안에 무언가를 설정할 수 있겠죠.

**이것은 같은 오리진을 가진 다른 창에서 메시지를 교환할 수 있게 합니다.**

모던한 브라우저는 [브로드캐스트 채널 API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)를 지원합니다. 같은 오리진을 가진 창끼리 통신하기 위한 특수한 API이며 기능은 풍부하지만, 호환성이 떨어집니다. `localStorage`를 기반으로 한 폴리필 라이브러리가 어디서든 사용할 수 있게 도와줍니다.

## 요약

웹 저장소 객체 `localStorage`와 `sessionStorage`는 브라우저에 키-값 쌍을 보관하게 해줍니다.
- `키`와 `값`은 반드시 문자열이어야 합니다.
- 제한 용량은 2mb 이상이며 브라우저에 따라 다를 수 있습니다.
- 파기되지 않습니다.
- 오리진(도메인/포트/프로토콜)에 엮여있습니다.

| `localStorage` | `sessionStorage` |
|--------------|--------------|
| 같은 오리진을 가진 모든 탭과 창에서 공유됩니다. | iframe을 포함해 같은 오리진을 가진 브라우저 탭 내에서 볼 수 있습니다. |
| 브라우저를 재시작해도 남아있습니다. | 페이지 새로고침 뒤에도 남아있습니다. 탭을 종료하면 사라집니다.|

API:

- `setItem(key, value)` -- 키-값 쌍을 보관합니다.
- `getItem(key)` -- 키로 값을 받아옵니다.
- `removeItem(key)` -- 키와 해당 값을 삭제합니다.
- `clear()` -- 모든 항목을 삭제합니다.
- `key(index)` -- `인덱스`에 해당하는 키를 받아옵니다.
- `length` -- 저장된 항목의 개수를 나타냅니다.
- 모든 키를 불러오려면 `Object.keys`를 사용합니다.
- 객체 프로퍼티처럼 키에 접근할 경우 `storage` 이벤트가 발생하지 않습니다.

저장소 이벤트:

- `setItem`, `removeItem`, `clear`를 호출할 때 발생합니다.
- 연산(`key/oldValue/newValue`)과 관련된 모든 데이터와 문서 `url`, 저장소 객체 `storageArea`를 가지고 있습니다.
- 생성된 곳을 제외한 저장소에 접근하는 모든 `window` 객체에서 일어납니다(`sessionStorage`는 탭 내에서, `localStorage`에서는 전역적으로).