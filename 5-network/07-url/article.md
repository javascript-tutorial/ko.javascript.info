
# URL 객체

내장된 [URL](https://url.spec.whatwg.org/#api) 클래스는 URL을 생성하고 파싱하기 위한 편리한 인터페이스를 제공합니다.

네트워크 함수 중에서도 반드시 URL 객체가 필요한 것은 없으며, 문자열로도 충분히 사용할 수 있습니다. 그러므로 기술적으로 URL을 사용할 필요는 없습니다. 하지만 때로는 URL이 정말로 유용할 수 있습니다.

## URL 생성

아래와 같은 문법을 사용해 URL 객체를 만들 수 있습니다.

```js
new URL(url, [base])
```

- **`url`** -- 전체 URL 또는 경로 (base가 설정되어 있다면, 아래 참고),
- **`base`** -- 생략 가능한 base URL이 설정되어 있고, URL 인자가 경로라면, URL은 'base'를 기준으로 상대적인 URL로 생성됩니다.

예를 들어:

```js
let url = new URL('https://javascript.info/profile/admin');
```

다음 두 URL은 동일합니다:

```js run
let url1 = new URL('https://javascript.info/profile/admin');
let url2 = new URL('/profile/admin', 'https://javascript.info');

alert(url1); // https://javascript.info/profile/admin
alert(url2); // https://javascript.info/profile/admin
```


기존 URL을 기준으로 상대적인 경로에 따라 새 URL을 쉽게 생성할 수 있습니다:

```js run
let url = new URL('https://javascript.info/profile/admin');
let newUrl = new URL('tester', url);

alert(newUrl); // https://javascript.info/profile/tester
```

URL 객체를 사용하면 즉시 해당 구성 요소에 접근할 수 있으므로 URL을 파싱하는 좋은 방법입니다. 예를 들면 다음과 같습니다:

```js run
let url = new URL('https://javascript.info/url');

alert(url.protocol); // https:
alert(url.host);     // javascript.info
alert(url.pathname); // /url
```

URL 구성 요소에 대한 설명은 다음과 같습니다:

![](url-object.svg)

- `href`는 전체 URL을 나타내며, `url.toString()`과 동일한 결과를 반환합니다.
- `protocol`은 콜론 문자 `:`로 끝납니다.
- `search` - 물음표 `?`로 시작하는 형태인 매개변수 문자열입니다.
- `hash`는 해시 문자 `#`로 시작하는 형태입니다.
- HTTP 인증이 존재하는 경우 `user` 및 `password` 속성도 존재할 수 있습니다. 예를 들어 `http://login:password@site.com`와 같이 표현됩니다. (이는 위에서 언급한 부분은 아니지만, 드물게 사용되는 방식입니다.)


```smart header="우리는 네트워크 (및 대부분의 다른) 함수에 문자열 대신 `URL` 객체를 전달할 수 있습니다."
URL 문자열이 예상되는 거의 모든 곳에서 URL 객체를 사용할 수 있습니다. 예를 들어, `fetch`나 `XMLHttpRequest`와 같은 메소드에서 URL 문자열 대신 `URL` 객체를 사용할 수 있습니다.

일반적으로, `URL` 객체는 대부분의 메소드에서 문자열 대신 전달할 수 있습니다. 대부분의 메소드는 문자열 변환을 수행하며, 이는 `URL` 객체를 전체 URL을 포함한 문자열로 변환합니다.
```

## 검색 매개변수 "?..."

주어진 검색 매개변수로 `https://google.com/search?query=JavaScript`와 같은 URL을 만들고 싶다고 가정해 보겠습니다.

URL 문자열에서 검색 매개변수를 제공할 수 있습니다:

```js
new URL('https://google.com/search?query=JavaScript')
```

...하지만 매개변수에 공백, 비-라틴 문자 등이 포함되어 있는 경우에는 인코딩해야 합니다. (이는 아래에서 더 자세히 설명하겠습니다.)

따라서 해당 기능을 위해 `url.searchParams`라는 [URLSearchParams](https://url.spec.whatwg.org/#urlsearchparams) 타입의 객체가 제공됩니다. 

그것은 검색 파라미터를 위한 편리한 함수들을 제공합니다:

- **`append(name, value)`** -- `name`을 기준으로 파라미터 추가,
- **`delete(name)`** -- `name`을 기준으로 파라미터 삭제,
- **`get(name)`** -- `name`을 기준으로 파라미터 가져오기,
- **`getAll(name)`** -- 동일한 `name`을 가진 모든 매개변수를 가져오기 (예를 들어, `?user=John&user=Pete`와 같은 경우 가능),
- **`has(name)`** -- `name`을 기준으로 매개변수의 존재 여부를 확인,
- **`set(name, value)`** -- 매개변수를 설정/대체,
- **`sort()`** -- 매개변수를 `name` 기준으로 정렬(드문 작업),
- ...`Map`과 유사하게 반복 가능(iterable)합니다.

공백과 구두점을 포함하는 매개변수 예시입니다:

```js run
let url = new URL('https://google.com/search');

url.searchParams.set('q', 'test me!'); // 공백과 느낌표(!)를 포함한 파라미터 추가

alert(url); // https://google.com/search?q=test+me%21

url.searchParams.set('tbs', 'qdr:y'); // 콜론(:)을 포함한 파라미터 추가

// 파라미터는 자동으로 인코딩됩니다.
alert(url); // https://google.com/search?q=test+me%21&tbs=qdr%3Ay

// (디코딩된) 검색 매개변수를 반복
for(let [name, value] of url.searchParams) {
  alert(`${name}=${value}`); // q=test me!, then tbs=qdr:y
}
```


## 인코딩

URL에서 허용되는 문자와 그렇지 않은 문자를 정의한 표준인 [RFC3986](https://tools.ietf.org/html/rfc3986)이 있습니다.

URL에서 허용되지 않는 문자(예: 비-라틴 문자와 공백)는 해당 문자의 UTF-8 코드를 %로 접두사를 붙여 인코딩해야 합니다. 예를 들어 공백은 %20으로 인코딩될 수 있습니다. (역사적인 이유로 공백은 +로 인코딩될 수도 있지만, 이는 예외입니다.)

좋은 소식은 URL 객체가 이러한 모든 처리를 자동으로 해줍니다. 우리는 모든 매개변수를 인코딩되지 않은 상태로 제공하고, 그 후 URL을 문자열로 변환하기만 하면 됩니다:

```js run
// 이를 위한 예시로 일부 키릴 문자를 사용해 보겠습니다.

let url = new URL('https://ru.wikipedia.org/wiki/Тест');

url.searchParams.set('key', 'ъ');
alert(url); //https://ru.wikipedia.org/wiki/%D0%A2%D0%B5%D1%81%D1%82?key=%D1%8A
```

보시다시피 URL 경로에 있는 `Тест`와 매개변수에 있는 `ъ` 모두 인코딩되었습니다.

URL이 길어진 이유는 각각의 키릴 문자가 UTF-8에서 두 개의 바이트로 표현되기 때문입니다. 따라서 두 개의 `%..` 엔티티가 있는 것입니다.

### 문자열 인코딩

`URL` 객체가 등장하기 전에는 예전에는 사람들이 URL에 대해 문자열을 사용했습니다.

현재는 `URL` 객체가 대부분의 경우에 더 편리하지만, 문자열도 여전히 사용할 수 있습니다. 많은 경우 문자열을 사용하면 코드가 더 간결해집니다.

그러나 문자열을 사용하는 경우 특수 문자를 수동으로 인코딩/디코딩해야 합니다.

그러한 이유로 내장된 함수들이 있습니다:

- [encodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) - URL 전체를 인코딩합니다.
- [decodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI) - 다시 디코딩합니다.
- [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) - 검색 매개변수, 해시, 경로 이름과 같은 URL 구성 요소를 인코딩합니다.
- [decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) - 다시 디코딩합니다.

"`encodeURIComponent`와 `encodeURI`의 차이점은 무엇이며, 언제 각각을 사용해야 할까요?"라는 질문을 할 수 있습니다.

위의 그림에서 URL이 구성 요소로 분할되어 있는 것을 보면 이해하기 쉽습니다:

```
https://site.com:8080/path/page?p1=v1&p2=v2#hash
```

위에서 볼 수 있듯이, URL에서는 `:`, `?`, `=`, `&`, `#`와 같은 문자가 허용됩니다.

...반면에, 검색 매개변수와 같은 개별 URL 구성 요소를 살펴보면 이러한 문자들은 인코딩되어야 합니다. 이렇게 함으로써 서식이 깨지지 않습니다.

- `encodeURI`는 URL에서 완전히 금지된 문자만을 인코딩합니다.
- `encodeURIComponent`도 같은 문자를 인코딩하지만, 그 외에도 `#`, `$`, `&`, `+`, `,`, `/`, `:`, `;`, `=`, `?`, `@` 문자를 인코딩합니다.

따라서, 전체 URL에는 `encodeURI`를 사용할 수 있습니다.:

```js run
// URL 경로에 키릴 문자를 사용
let url = encodeURI('http://site.com/привет');

alert(url); // http://site.com/%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82
```

...반면에 URL 매개변수에는 `encodeURIComponent`를 사용해야 합니다:

```js run
let music = encodeURIComponent('Rock&Roll');

let url = `https://google.com/search?q=${music}`;
alert(url); // https://google.com/search?q=Rock%26Roll
```

`encodeURI`와 비교해보세요:

```js run
let music = encodeURI('Rock&Roll');

let url = `https://google.com/search?q=${music}`;
alert(url); // https://google.com/search?q=Rock&Roll
```

위에서 볼 수 있듯이, `encodeURI` 함수는 `&` 문자를 인코딩하지 않습니다. 왜냐하면 `&` 문자는 URL 전체에서 유효한 문자이기 때문입니다.

하지만 검색 매개변수 내부의 `&`를 인코딩해야 합니다. 그렇지 않으면 `q=Rock&Roll`이라는 결과가 나오는데, 이는 실제로 `q=Rock`에 이상한 `Roll` 매개변수가 포함된 것입니다. 의도한 대로 동작하지 않습니다.

따라서 URL 문자열에 올바르게 삽입하기 위해 각 검색 매개변수마다 `encodeURIComponent`만 사용해야 합니다. 허용된 문자만 있는 것을 확신하지 않는 한, 이름과 값 모두를 인코딩하는 것이 가장 안전합니다.

````smart header="`URL`과의 인코딩 차이점"
[URL](https://url.spec.whatwg.org/#url-class) 및 [URLSearchParams](https://url.spec.whatwg.org/#interface-urlsearchparams) 클래스는 최신 URI 명세인 [RFC3986](https://tools.ietf.org/html/rfc3986)을 기반으로 하는 반면, `encode*` 함수들은 더 오래된 버전인 [RFC2396](https://www.ietf.org/rfc/rfc2396.txt)을 기반으로 합니다.

일부 차이점이 있습니다. 예를 들어, IPv6 주소는 다른 방식으로 인코딩됩니다:

```js run
// IPv6 주소를 포함하는 유효한 URL 예시입니다:
let url = 'http://[2607:f8b0:4005:802::1007]/';

alert(encodeURI(url)); // http://%5B2607:f8b0:4005:802::1007%5D/
alert(new URL(url)); // http://[2607:f8b0:4005:802::1007]/
```

위에서 볼 수 있듯이, `encodeURI`는 대괄호 `[...]`를 대체했는데, 이는 올바르지 않은 동작입니다. 그 이유는 IPv6 URL은 RFC2396 (1998년 8월)의 시점에서는 존재하지 않았기 때문입니다.

이러한 경우는 드뭅니다. 대부분의 경우 `encode*` 함수들은 잘 작동합니다.
````
