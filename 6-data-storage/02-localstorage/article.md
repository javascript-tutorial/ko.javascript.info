# localStorage와 sessionStorage

웹 스토리지 객체(web storage object)인 `localStorage`와 `sessionStorage`는 브라우저 내에 키-값 쌍을 저장할 수 있게 해줍니다.

이 둘을 사용하면 페이지를 새로 고침하고(`sessionStorage`의 경우) 심지어 브라우저를 다시 실행해도(`localStorage`의 경우) 데이터가 사라지지 않고 남아있습니다. 이 부분은 조만간 뒤에서 살펴보기로 합시다.

그런데 "쿠키를 사용하면 브라우저에 데이터를 저장할 수 있는데, 왜 또 다른 객체를 사용해 데이터를 저장하는 걸까요?"라는 의문이 들 수 있습니다. 쿠키 이외에도 다른 방식을 사용하는 이유는 다음과 같습니다.

- 쿠키와 다르게 웹 스토리지 객체는 네트워크 요청 시 서버로 전송되지 않습니다. 이런 특징 때문에 쿠키보다 더 많은 자료를 보관할 수 있습니다. 대부분의 브라우저가 최소 2MB 혹은 그 이상의 웹 스토리지 객체를 저장할 수 있도록 해줍니다. 또한 개발자는 브라우저 내 웹 스토리지 구성 방식을 설정할 수 있습니다.
- 쿠키와 또 다른 점은 서버가 HTTP 헤더를 통해 스토리지 객체를 조작할 수 없다는 것입니다. 웹 스토리지 객체 조작은 모두 자바스크립트 내에서 수행됩니다.
- 웹 스토리지 객체는 도메인·프로토콜·포트로 정의되는 오리진(origin)에 묶여있습니다. 따라서 프로토콜과 서브 도메인이 다르면 데이터에 접근할 수 없습니다.

두 스토리지 객체는 동일한 메서드와 프로퍼티를 제공합니다.

- `setItem(key, value)` -- 키-값 쌍을 보관합니다.
- `getItem(key)` -- 키에 해당하는 값을 받아옵니다.
- `removeItem(key)` -- 키와 해당 값을 삭제합니다.
- `clear()` -- 모든 것을 삭제합니다.
- `key(index)` -- 인덱스(`index`)에 해당하는 키를 받아옵니다.
- `length` -- 저장된 항목의 개수를 얻습니다.

두 스토리지 객체는 `Map`과 유사합니다. `setItem/getItem/removeItem`을 지원하죠. 하지만 인덱스를 사용해 키에 접근할 수 있다는 점(`key(index)`)에서 차이가 있습니다. 

이제 본격적으로 localStorage와 sessionStorage가 어떻게 동작하는지 살펴봅시다.

## localStorage 데모

`localStorage`의 주요 기능은 다음과 같습니다.

- 오리진이 같은 경우 데이터는 모든 탭과 창에서 공유됩니다.
- 브라우저나 OS가 재시작하더라도 데이터가 파기되지 않습니다.

아래 예시를 실행해봅시다.

```js run
localStorage.setItem('test', 1);
```

그리고 브라우저를 닫고 열어봅시다. 다른 창에서 본 페이지를 열어봐도 됩니다. 그럼 이런 결과가 나올 겁니다.

```js run
alert( localStorage.getItem('test') ); // 1
```

오리진(domain/port/protocol)만 같다면 url 경로는 달라도 동일한 결과를 볼 수 있습니다.

`localStorage`는 동일한 오리진을 가진 모든 창에서 공유되기 때문입니다. 따라서 한 창에 데이터를 설정하면 다른 창에서 변동 사항을 볼 수 있습니다.

## 일반 객체처럼 사용하기

`localStorage`의 키를 얻거나 설정할 때, 아래처럼 일반 객체와 유사한 방법을 사용할 수 있습니다.

```js run
// 키 설정하기
localStorage.test = 2;

// 키 얻기
alert( localStorage.test ); // 2

// 키 삭제하기
delete localStorage.test;
```

하위 호환성 때문에 아직 이런 방법이 지원되기는 하지만, 다음과 같은 이유로 추천하지 않습니다.

1. 사용자는 `length`나 `toString`, `localStorage`의 내장 메서드를 키로 설정할 수 있습니다. 이렇게 되면 `getItem`, `setItem`은 정상적으로 작동해도, 일반 객체처럼 다룰 때 에러가 발생할 수 있습니다.
    ```js run
    let key = 'length';
    localStorage[key] = 5; // TypeError: Cannot assign to read only property 'length'...
    ```

2. 데이터를 수정하면 `storage` 이벤트가 발생하는데, 이 이벤트는 `localStorage`를 객체처럼 접근할 땐 일어나지 않습니다. 자세한 내용은 챕터 후반부에 다루겠습니다.

## 키 순회하기

`localStorage`는 '키'를 사용해 값을 얻고, 설정하고, 삭제할 수 있게 해줍니다. 그렇다면 키나 값 전체는 어떻게 얻을 수 있을까요?

아쉽게도 스토리지 객체는 iterable 객체가 아닙니다.

대신 배열처럼 다루면 전체 키-값을 얻을 수 있습니다.

```js run
for(let i=0; i<localStorage.length; i++) {
  let key = localStorage.key(i);
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

일반 객체를 다룰 때처럼 `for key in localStorage` 반복문을 사용해도 전체 키-값을 얻을 수 있습니다.

하지만 이 방법을 사용하면 필요하지 않은 내장 필드까지 출력됩니다.

```js run
// 좋지 않은 방법
for(let key in localStorage) {
  alert(key); // getItem, setItem 같은 내장 필드까지 출력됩니다.
}
```

`for key in localStorage` 반복문을 사용하려면 `hasOwnProperty`를 이용해 프로토타입에서 상속받은 필드를 골라내야 합니다.

```js run
for(let key in localStorage) {
  if (!localStorage.hasOwnProperty(key)) {
    continue; // setItem, getItem 등의 키를 건너뜁니다.
  }
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

아니면 아래처럼 `Object.keys`로 '자기 자신'의 키를 받아온 다음 순회하는 방법을 사용할 수도 있습니다.

```js run
let keys = Object.keys(localStorage);
for(let key of keys) {
  alert(`${key}: ${localStorage.getItem(key)}`);
}
```

`Object.keys`는 해당 객체에서 정의한 키만 반환하고 프로토타입에서 상속받은 키는 무시하기 때문입니다. 


## 문자열만 사용

`localStorage`의 키와 값은 반드시 문자열이어야 합니다.

숫자나 객체 등 다른 자료형을 사용하게 되면 문자열로 자동 변환됩니다.

```js run
sessionStorage.user = {name: "John"};
alert(sessionStorage.user); // [object Object]
```

`JSON`을 사용하면 객체를 쓸 수 있긴 합니다.

```js run
sessionStorage.user = JSON.stringify({name: "John"});

// 잠시 후 
let user = JSON.parse( sessionStorage.user );
alert( user.name ); // John
```

디버깅 등의 목적으로 스토리지 객체 전체를 문자열로 변환하는 것도 가능합니다.

```js run
// 보기 좋도록 JSON.stringify에 서식 옵션을 추가했습니다.
alert( JSON.stringify(localStorage, null, 2) );
```


## sessionStorage

`sessionStorage` 객체는 `localStorage`에 비해 자주 사용되진 않습니다.

제공하는 프로퍼티와 메서드는 같지만, 훨씬 제한적이기 때문입니다.

- `sessionStorage`는 현재 떠 있는 탭 내에서만 유지됩니다.
  - 같은 페이지라도 다른 탭에 있으면 다른 곳에 저장되기 때문입니다.
  - 그런데 하나의 탭에 여러 개의 iframe이 있는 경우엔 동일한 오리진에서 왔다고 취급되기 때문에 `sessionStorage`가 공유됩니다.
- 페이지를 새로 고침할 때 `sessionStorage`에 저장된 데이터는 사라지지 않습니다. 하지만 탭을 닫고 새로 열 때는 사라집니다.

자 이제 `sessionStorage`를 직접 사용해 봅시다.

아래의 코드를 실행해보죠.

```js run
sessionStorage.setItem('test', 1);
```

이제 페이지를 새로 고침 해 봅시다. 데이터가 여전히 남아있는 것을 확인할 수 있습니다.

```js run
alert( sessionStorage.getItem('test') ); // 새로 고침 후: 1
```

하지만 다른 탭에서 본 페이지를 열고 바로 위 예시만 실행해보면 '아무것도 찾을 수 없다'는 뜻을 가진 `null`이 반환되는것을 확인할 수 있습니다.

이렇게 `sessionStorage`는 오리진뿐만 아니라 브라우저 탭에도 종속되어 있습니다. 이런 제약 때문에 `sessionStorage`는 잘 사용되지 않습니다.

## storage 이벤트

`localStorage`나 `sessionStorage`의 데이터가 갱신될 때, [storage](https://www.w3.org/TR/webstorage/#the-storage-event) 이벤트가 실행됩니다. storage 이벤트는 다음과 같은 프로퍼티를 지원합니다.

- `key` -- 변경된 데이터의 키(`.clear()`를 호출했다면 `null`)
- `oldValue` -- 이전 값(키가 새롭게 추가되었다면 `null`)
- `newValue` -- 새로운 값(키가 삭제되었다면 `null`)
- `url` -- 갱신이 일어난 문서의 url
- `storageArea` -- 갱신이 일어난 `localStorage`나 `sessionStorage` 객체

여기서 중요한 점은 storage 이벤트가 이벤트를 발생시킨 스토리지를 제외하고 스토리지에서 접근 가능한 `window` 객체 전부에서 일어난다는 사실입니다.

좀 더 구체적으로 설명을 이어나가 보겠습니다.

두 개의 창에 같은 사이트를 띄워놨다고 가정해봅시다. 창은 다르지만 `localStorage`는 서로 공유됩니다.

```online
실제 본 페이지를 두 개의 브라우저 창에 띄워 봅시다.
```

두 창에서 모두 `storage` 이벤트를 수신하고 있기 때문에 한 창에서 아래 예시를 실행해 데이터를 갱신하면 다른 창에 해당 사항이 반영되는 것을 확인할 수 있습니다.

```js run
// 문서는 다르지만, 갱신은 같은 스토리지에 반영됩니다.
window.onstorage = event => { // window.addEventListener('storage', () => {와 같습니다.
  if (event.key != 'now') return;
  alert(event.key + ':' + event.newValue + " at " + event.url);
};

localStorage.setItem('now', Date.now());
```

storage 이벤트의 또 다른 중요한 특징은 `event.url`이 있어 데이터가 갱신된 문서의 URL을 알 수 있다는 점입니다.

또한 `event.storageArea`에는 스토리지 객체가 포함되어 있는데, storage 이벤트는 `sessionStorage`나 `localStorage`가 변경될 때 모두 발생하기 때문에 `event.storageArea`는 스토리지 종류에 상관없이 실제 수정이 일어난 것을 참조한다는 것 역시 중요한 특징입니다. 변경이 일어났을 때 우리는 `event.storageArea`에 무언가를 설정해 '응답'이 가능하도록 할 수 있죠.

**이런 특징을 이용하면 오리진이 같은 창끼리 메시지를 교환하게 할 수 있습니다.**

모던 브라우저는 오리진이 같은 창끼리 통신할 수 있도록 해주는 [브로드캐스트 채널 API(broadcast channel API)](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)를 지원합니다. 그런데 이 API는 기능은 풍부하지만, 아직 많은 곳에서 지원하지 않는다는 단점이 있습니다. 단점을 극복하게 해주는 `localStorage` 기반한 폴리필들이 있는데, 이런 라이브러리들은 브라우저와 관계없이 어디서든 창 간 메시지를 교환할 수 있게 해준다는 장점이 있습니다.

## 요약

웹 스토리지 객체 `localStorage`와 `sessionStorage`를 사용하면 브라우저에 키-값 쌍을 저장할 수 있습니다. 이때,
- `키`와 `값`은 반드시 문자열이어야 합니다.
- 제한 용량은 5MB 이상인데, 브라우저에 따라 다를 수 있습니다.
- 파기되지 않습니다.
- 오리진(도메인·포트·프로토콜)에 묶여있습니다.

| `localStorage` | `sessionStorage` |
|--------------|--------------|
| 오리진이 같은 탭, 창 전체에서 공유됩니다. | 오리진이 같은 브라우저 탭, iframe에서 공유됩니다. |
| 브라우저를 껐다 켜도 남아있습니다. | 페이지를 새로 고침 해도 남아있습니다. 하지만 탭이나 브라우저를 종료하면 사라집니다. |

API:

- `setItem(key, value)` -- 키-값 쌍을 보관합니다.
- `getItem(key)` -- 키에 해당하는 값을 받아옵니다.
- `removeItem(key)` -- 키와 해당 값을 삭제합니다.
- `clear()` -- 모든 것을 삭제합니다.
- `key(index)` -- `인덱스`에 해당하는 키를 받아옵니다.
- `length` -- 저장된 항목의 개수를 얻습니다.
- `Object.keys`를 사용해 키 전체를 얻을 수 있습니다.
- 객체 프로퍼티처럼 키에 접근할 수 있는데, 이 경우 `storage` 이벤트가 발생하지 않습니다.

storage 이벤트:

- `setItem`, `removeItem`, `clear`를 호출할 때 발생합니다.
- 연산(`key/oldValue/newValue`)과 관련된 데이터 전체와 문서 `url`, 스토리지 객체 `storageArea`를 가지고 있습니다.
- 이벤트가 생성된 곳을 제외하고 스토리지에 접근하는 모든 `window` 객체에서 일어납니다(`sessionStorage`는 탭 내에서, `localStorage`에서는 전역에서).
