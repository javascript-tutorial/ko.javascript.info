
# URL 객체

내장된 [URL](https://url.spec.whatwg.org/#api) 클래스는 URL을 만들고 파싱하는데 편리한 인터페이스를 제공합니다.

네트워크 함수에서 `URL` 객체는 문자열로 대체 가능해서 `URL` 객체가 꼭 필요하지는 않습니다. 하지만 가끔 `URL` 객체는 도움이 됩니다.

## URL 만들기

다음과 같이 `URL` 객체를 만들 수 있습니다.

```js
new URL(url, [base])
```

- **`url`** -- 전체 URL, 또는 베이스 URL을 설정할 시 경로만 주어져도 됩니다(아래의 base 항목 참조).
- **`base`** -- 선택 매개변수, 베이스 URL을 설정할 수 있습니다. 베이스 URL이 주어지고 `url`에 경로만 주어지면 `base`에 대한 상대주소로 만들어집니다.

예시:

```js
let url = new URL('https://javascript.info/profile/admin');
```

다음 두 URL은 같습니다.

```js run
let url1 = new URL('https://javascript.info/profile/admin');
let url2 = new URL('/profile/admin', 'https://javascript.info');

alert(url1); // https://javascript.info/profile/admin
alert(url2); // https://javascript.info/profile/admin
```

다음과 같이 이미 존재하는 URL에 대해 상대적인 경로를 쉽게 만들 수 있습니다.

```js run
let url = new URL('https://javascript.info/profile/admin');
let newUrl = new URL('tester', url);

alert(newUrl); // https://javascript.info/profile/tester
```

`URL` 객체를 통해 URL 구성요소에 바로 접근할 수 있어서 URL을 파싱하는데에도 편리합니다.

```js run
let url = new URL('https://javascript.info/url');

alert(url.protocol); // https:
alert(url.host);     // javascript.info
alert(url.pathname); // /url
```

URL의 구성 요소는 다음과 같습니다.

![](url-object.svg)

- `href`는 전체 url입니다. `url.toString()`와 같습니다.
- `protocol`은 콜론(`:`)으로 끝납니다.
- `search`은 물음표(`?`)로 시작하는 매개변수입니다.
- `hash`는 해쉬 문자(`#`)로 시작합니다.
- 위 그림에 나오지 않았지만 `http://login:password@site.com`처럼 HTTP 인증이 주어지면 `user`와 `password`도 있을 수 있습니다(거의 사용되지 않음).


```smart header="`URL` 객체를 네트워크 함수와 다른 대부분의 함수에 문자열 대신 넘길 수 있습니다."
`fetch`와 `XMLHttpRequest`, URL 문자열이 필요한 거의 대부분의 함수에 `URL` 객체를 대신 사용할 수 있습니다.

일반적으로 함수에서 문자열 대신 `URL` 객체로 대체할 수 있고 대부분 `URL` 객체를 전체 URL로 변경시키는 식으로 작동합니다.
```

## SearchParams "?..."

`https://google.com/search?query=JavaScript`와 같이 쿼리 파라미터가 있는 url을 만들고 싶다고 해봅시다.

다음과 같이 URL 문자열에 넣어서 만들 수 있습니다.

​```js
new URL('https://google.com/search?query=JavaScript')
```

하지만 공백이나 라틴 문자가 아닌 문자 등(아래 참조)이 포함되어 있으면 인코딩을 해야합니다.

그래서 [URLSearchParams](https://url.spec.whatwg.org/#urlsearchparams) 타입의 객체인 프로퍼티 `url.searchParams`가 있습니다.

`url.searchParams`는 쿼리 파라미터를 위한 편리한 메서드를 제공합니다.

- **`append(name, value)`** -- `name` 파라미터를 추가합니다,
- **`delete(name)`** -- `name` 파라미터를 제거합니다,
- **`get(name)`** -- `name` 파라미터의 값을 반환합니다,
- **`getAll(name)`** -- 모든 `name` 파라미터의 값을 리턴합니다(예를 들어 `?user=John&user=Pete`같은 경우),
- **`has(name)`** -- `name` 파라미터의 존재 여부를 반환합니다,
- **`set(name, value)`** -- `name` 파라미터를 설정/변경합니다,
- **`sort()`** -- name을 기준으로 정렬합니다,
- 또한 `Map`과 유사하게 이터러블합니다.

다음은 파라미터에 공백과 구두점이 있는 예시입니다.

```js run
let url = new URL('https://google.com/search');

url.searchParams.set('q', 'test me!'); // 공백과 !가 포함된 파라미터를 추가

alert(url); // https://google.com/search?q=test+me%21

url.searchParams.set('tbs', 'qdr:y'); // 콜론(:)이 포함된 파라미터를 추가

// 파라미터들은 자동으로 인코딩됩니다
alert(url); // https://google.com/search?q=test+me%21&tbs=qdr%3Ay

// 쿼리 파라미터는 디코드되어 이터레이트됩니다
for(let [name, value] of url.searchParams) {
  alert(`${name}=${value}`); // q=test me!, then tbs=qdr:y
}
```


## 인코딩

URL에 어떤 문자가 포함될수 있는지에 대한 표준 [RFC3986](https://tools.ietf.org/html/rfc3986)이 있습니다.

라틴문자가 아닌 문자와 공백같이 허용되지 않는 문자는 UTF-8 코드 앞에 `%`를 붙여 인코딩해야합니다. 예를들어 공백은 `%20`으로 인코딩됩니다(예외적으로 공백은 역사적인 이유로 `+`로도 인코딩이 가능합니다).

좋은 소식은 `URL` 객체는 이 모든 것을 자동으로 다룹니다. 우리는 그냥 인코딩되지 않은 파라미터를 넘겨주고 `URL`을 문자열로 변환하면 됩니다.

```js run
// 키릴 문자를 사용한 예시

let url = new URL('https://ru.wikipedia.org/wiki/Тест');

url.searchParams.set('key', 'ъ');
alert(url); //https://ru.wikipedia.org/wiki/%D0%A2%D0%B5%D1%81%D1%82?key=%D1%8A
```

위의 예시처럼 URL 경로의 `Тест`와 쿼리 파라미터의 `ъ`가 인코딩되었습니다.

각각의 키릴 문자는 UTF-8에서 2 바이트로 표현되기 때문에 두개의 `%..`로 인코딩되어 URL이 길어졌습니다.

### 문자열 인코딩하기

`URL` 객체가 있기 전에는 URL 대신 문자열을 사용했습니다.

이제 `URL` 객체가 좀 더 편리하지만 아직도 문자열은 자주 사용됩니다. 많은 경우 문자열을 사용하는 것이 코드를 좀 더 짧게 만들어줍니다.

문자열을 사용한다면 특수 문자들을 수동으로 인코딩/디코딩해주어야 합니다.

이를 위해 다음과 같은 내장 함수들이 있습니다.

- [encodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) - 전체 URL을 인코딩합니다.
- [decodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI) - 그리고 다시 디코딩합니다.
- [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) - 쿼리 파리미터와 해쉬, 경로같은 URL 구성 요소들을 인코딩합니다.
- [decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) - 그리고 다시 디코딩합니다.

"`encodeURIComponent`와 `encodeURI`의 차이점은 뭘까? 둘을 언제 사용해야할까?"라는 질문이 자연스럽게 생길 것입니다.

위의 그림처럼 다음 URL을 각각의 구성요소로 나누면 이해하기 쉬울 것입니다.

```
https://site.com:8080/path/page?p1=v1&p2=v2#hash
```

`:`, `?`, `=`, `&`, `#` 같은 문자들은 전체 URL에서는 허용됩니다.

하지만 쿼리 파라미터 같이 하나의 URL 요소에서 URL 형식을 깨지지 않도록 인코딩되어야합니다.

- `encodeURI`는 전체 URL에서 금지된 문자들만 인코딩합니다.
- `encodeURIComponent`는 추가로 `#`와 `$`, `&`, `+`, `,`, `/`, `:`, `;`, `=`, `?`, `@`도 인코딩합니다.

따라서 다음과 같이 전체 URL에서는 `encodeURI`를 사용할 수 있습니다.

```js run
// url 경로에 키릴 문자 사용
let url = encodeURI('http://site.com/привет');

alert(url); // http://site.com/%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82
```

반면 URL 파라미터에서는 `encodeURIComponent`를 사용해야합니다.

```js run
let music = encodeURIComponent('Rock&Roll');

let url = `https://google.com/search?q=${music}`;
alert(url); // https://google.com/search?q=Rock%26Roll
```

`encodeURI`와 비교해보세요.

```js run
let music = encodeURI('Rock&Roll');

let url = `https://google.com/search?q=${music}`;
alert(url); // https://google.com/search?q=Rock&Roll
```

위의 예시처럼 `&`는 URL에서 허용된 문자이기 때문에 `encodeURI`가 인코딩하지 않습니다.

그러나 쿼리 파라미터 안에 있는 `&`는 인코딩하지 않으면 `q=Rock&Roll`가 되고 이는 `q=Rock` 와 애매한 파라미터인 `Roll`를 뜻합니다.

따라서 각각의 쿼리 파라미터를 인코딩 할때는 반드시 `encodeURIComponent`를 사용해야합니다. 모두 허용된 문자열이라고 확신하지 않는 이상 이름과 값을 모두 인코딩하는 것이 가장 안전합니다.

````smart header="`URL`과의 인코딩 차이"
두 클래스 [URL](https://url.spec.whatwg.org/#url-class)과 [URLSearchParams](https://url.spec.whatwg.org/#interface-urlsearchparams)는 최신의 URI 명세 [RFC3986](https://tools.ietf.org/html/rfc3986)에 기반하는 반면, `encode*` 함수는 오래된 버전의 [RFC2396](https://www.ietf.org/rfc/rfc2396.txt)에 기반합니다.

둘은 완전히 같지는 않습니다. 예를들어 IPv6에서는 차이가 있습니다.

```js run
// 유효한 IPv6 url
let url = 'http://[2607:f8b0:4005:802::1007]/';

alert(encodeURI(url)); // http://%5B2607:f8b0:4005:802::1007%5D/
alert(new URL(url)); // http://[2607:f8b0:4005:802::1007]/
```

IPv6 URL이 RFC2396 당시(1998년 8월)에 없었기 때문에 위의 예시에서 `encodeURI`는 대괄호 `[...]`를 인코딩합니다.

하지만 이와 같은 상황은 드물기 때문에 대부분의 경우 `encode*` 함수는 잘 작동합니다.
````

````