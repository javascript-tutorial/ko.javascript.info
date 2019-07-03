# 쿠키와 document.cookie

쿠키는 브라우저에 저장되는 작은 크기의 문자열입니다. 쿠키는 자바스크립트에서만 쓰이는 기술은 아닙니다. [RFC 6265](https://tools.ietf.org/html/rfc6265) 명세서에 정의된 HTTP 프로토콜의 일부입니다.

<<<<<<< HEAD
쿠키는 주로 웹 서버의 요청으로 생성됩니다. 동일한 도메인에 접속 시 이 쿠키에 저장된 정보가 해당 도메인의 서버에 함께 자동 전송됩니다.
=======
Cookies are usually set by a web-server using response `Set-Cookie` HTTP-header. Then the browser automatically adds them to (almost) every request to the same domain using `Cookie` HTTP-header.
>>>>>>> b300836f00536a5eb9a716ad2cbb6b8fe97c25af

인증은 쿠키의 주요 사용처 중 하나입니다:

<<<<<<< HEAD
1. 로그인 시, 서버는 응답에 "세션 ID(session identifier)" 정보가 들어있는 쿠키를 설정하도록 해주는 `Set-Cookie` HTTP 헤더(HTTP-header)를 전송합니다.
2. 동일 도메인에 접속 시, 브라우저는 `Cookie` HTTP 헤더를 함께 이용해 요청합니다.
4. 서버는 이를 이용해 요청을 식별합니다.
=======
1. Upon sign in, the server uses `Set-Cookie` HTTP-header in the response to set a cookie with a unique "session identifier".
2. Next time when the request is set to the same domain, the browser sends the over the net using `Cookie` HTTP-header.
3. So the server knows who made the request.
>>>>>>> b300836f00536a5eb9a716ad2cbb6b8fe97c25af

`document.cookie` 프로퍼티를 이용하면 브라우저에서도 쿠키에 접근할 수 있습니다.

쿠키와 쿠키의 옵션은 다루기 힘들 때가 많습니다. 이 챕터에선 이에 대해 자세히 알아보도록 하겠습니다.

## document.cookie 에서 정보 읽기

```online
<<<<<<< HEAD
지금 보고 있는 이 사이트에 쿠키가 있을까요? 알아봅시다:
```

```offline
현재 인터넷에 접속되어 있다면, 쿠키를 볼 수 있습니다. 이렇게요: 
=======
Does your browser store any cookies from this site? Let's see:
```

```offline
Assuming you're on a website, it's possible to see the cookies from it, like this:
>>>>>>> b300836f00536a5eb9a716ad2cbb6b8fe97c25af
```

```js run
// javascript.info에선 데이터 수집을 위해 Google Analytics를 사용하고 있습니다
// 이와 관련된 쿠키가 있는걸 확인할 수 있습니다.
alert( document.cookie ); // cookie1=value1; cookie2=value2;...
```


`document.cookie`의 값은 `name=value`의 짝으로 구성되어 있고, `; ` 로 구분됩니다. 하나의 짝은 하나의 독립된 쿠키입니다.
`document.cookie`의 값은 `name=value`의 짝으로 구성되어 있고, delimited by `; `. Each one is a separate cookie.

`; `을 기준으로 `document.cookie`를 분리하면 특정 쿠키를 찾을 수 있습니다. 분리엔 정규 표현식이나 배열 함수를 이용할 수 있습니다.

이에 관한 연습문제 몇 개를 아래에서 풀어보길 권유합니다. 챕터 끝에서 쿠키 조작에 쓰이는 몇 가지 헬퍼 함수를 찾아볼 수 있을 겁니다. 

## document.cookie 에 쓰기

<<<<<<< HEAD
`document.cookie`에 직접 값을 쓸수 있습니다. 이 때 쿠키는 접근자(accessor) 프로퍼티입니다. 데이터 프로퍼티가 아닙니다.
=======
We can write to `document.cookie`. But it's not a data property, it's an accessor. An assignment to it is treated specially.
>>>>>>> b300836f00536a5eb9a716ad2cbb6b8fe97c25af

**브라우저는 `document.cookie`에 넣은 값을 받아서 해당 쿠키를 갱신합니다. 이 때, 명시된 쿠키만 갱신하고, 다른 쿠키엔 영향을 주지 않습니다.**

아래와 같이 코드를 작성하면 이름이 `user`인 쿠키를 찾아 그 값을 `John`으로 갱신합니다:

```js run
document.cookie = "user=John"; // 이름이 'user'인 쿠키의 값만 갱신함 
alert(document.cookie); // 모든 쿠키 보여주기
```

위 코드를 실행하면 여러개의 쿠키가 출력되는걸 볼 수 있습니다. `document.cookie=` 연산은 코든 쿠키를 덮어쓰지 않고, 명시된 쿠키인 `user`의 값만 갱신합니다. 

기술적으로 쿠키의 이름과 값엔 모든 글자가 허용됩니만, 반드시 내장된 `encodeURIComponent` 함수를 사용하여 이스케이프 처리 해줘야 합니다. 형식의 유효성을 위해서 말이죠.

```js run
// 특수 값은 인코딩 처리해 줘야 함
let name = "my name";
let value = "John Smith"

// 인코딩 처리를 해 쿠키를 my%20name=John%20Smith 로 변경함
document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

alert(document.cookie); // ...; my%20name=John%20Smith
```


```warn header="제한 사항"
쿠키엔 몇 가지 제한 사항이 있습니다:
- `encodeURIComponent`로 인코딩한 이후에 `name=value` 쌍은 4kb를 넘을 수 없습니다. 이를 넘는 긴 문자열은 쿠키에 저장할 수 없습니다.
- 도메인 하나당 저장할 수 있는 쿠키의 개수는 20여개 정도로 한정되어 있습니다. 브라우저에 따라 개수는 조금씩 다릅니다.
```

쿠키엔 몇 가지 옵션이 있습니다. 대다수의 옵션은 아주 중요하고, 꼭 지정해 줘야 합니다.

옵션은 `key=value` 뒤에 나열 하고, `;`로 구분합니다. 아래와 같이 말이죠:

```js run
document.cookie = "user=John; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT"
```

## path

- **`path=/mypath`**

<<<<<<< HEAD
쿠키에 접근할 수 있는 url path(경로)를 지정합니다. 절대 경로여야 하고, 기본값은 현재 경로입니다.
=======
The url path prefix, the cookie will be accessible for pages under that path. Must be absolute. By default, it's the current path.
>>>>>>> b300836f00536a5eb9a716ad2cbb6b8fe97c25af

만약 `path=/admin`로 설정되었다면, `/admin` 과 `/admin/something`에선 쿠키를 볼 수 있지만, `/home` 이나 `/adminpage`에선 쿠키를 볼 수 없습니다.

<<<<<<< HEAD
보통은 모든 페이지에서 쿠키에 접근할 수 있도록 경로 옵션을 `path=/`로 지정합니다.
=======
Usually, we should set `path` to the root: `path=/` to make the cookie accessible from all website pages.
>>>>>>> b300836f00536a5eb9a716ad2cbb6b8fe97c25af

## domain

- **`domain=site.com`**

쿠키에 접근 가능한 domain(도메인)을 지정합니다. 다만, 몇 가지 제약이 있어서, 아무 도메인이나 지정할 수 없습니다. 

아무 값도 넣지 않았다면, 쿠키를 설정한 도메인에서만 쿠키에 접근할 수 있습니다. `site.com`에서 설정한 쿠키 정보는 `other.com`에서 얻을 수 없습니다.

서브 도메인(subdomain)인 `forum.site.com`에서도 쿠키 정보를 얻을 수 없습니다! 까다로운 제약사항입니다.

```js
// at site.com
document.cookie = "user=John"

// at forum.site.com
alert(document.cookie); // no user
```

**서브 도메인이나 다른 도메인에서 쿠키에 접속할 수 있는 방법은 없습니다. 그렇기 때문에 `site.com`을 통해 생성된 쿠키 정보를 `other.com`에선 절대 전송받을 수 없습니다.**

<<<<<<< HEAD
안전 때문에 이런 제약이 존재합니다. 이 제약은 민감한 데이터를 쿠키에 저장할 수 있도록 해줍니다.

하지만 루트 도메인(root domain)에서 `domain` 옵션을 `domain=site.com`으로 설정하면 `forum.site.com`과 같은 서브 도메인에서 쿠키 정보를 얻을 수 있습니다:

```js
// 모든 서브 도메인에서 쿠키에 접근할 수 있도록 domain 옵션값을 site.com으로 지정함
document.cookie = "user=John; domain=site.com"

// forum.site.com에서
alert(document.cookie); // 쿠키에 저장된 user 정보를 얻을 수 있음
```

`domain=.site.com` (값의 맨 처음에 .을 넣어줌)으로 옵션값을 설정하면 동일하게 동작합니다. 이는 역사적인 이유 때문에 남아있는 기능입니다. 낮은 버전의 브라우저에서도 동작할 수 있도록 점(.)을 넣어 옵션값을 지정하는걸 추천합니다.
=======
It's a safety restriction, to allow us to store sensitive data in cookies, that should be available only on one site.

...But if we'd like to allow subdomains like `forum.site.com` get a cookie, that's possible. When setting a cookie at `site.com`, we should explicitly set `domain` option to the root domain: `domain=site.com`:

```js
// at site.com
// make the cookie accessible on any subdomain *.site.com:
document.cookie = "user=John; domain=site.com"

// later

// at forum.site.com
alert(document.cookie); // has cookie user=John
```

For historical reasons, `domain=.site.com` (a dot before `site.com`) also works the same way, allowing access to the cookie from subdomains. That's an old notation, should be used if we need to support very old browsers.
>>>>>>> b300836f00536a5eb9a716ad2cbb6b8fe97c25af

이렇게 `domain` 옵션값을 적절히 사용하면 서브 도메인에서도 쿠키에 접근할 수 있도록 할 수 있습니다.

## expires, max-age

expires(유효 일자)와 max-age(만료 기간) 옵션이 지정되어있지 않으면, 쿠키는 브라우저가 닫힐 때 함께 삭제됩니다. 이런 쿠키를 "세션 쿠키(session cookies)"라고 부릅니다.

브라우저를 닫아도 쿠키가 사라지지 않게 하려면, `expires` 나 `max-age` 옵션을 설정하면 됩니다.

- **`expires=Tue, 19 Jan 2038 03:14:07 GMT`**

설정된 유효 일자에 도달하면, 브라우저는 쿠키를 자동으로 삭제합니다.

쿠키의 유효 일자는 반드시 GMT 포맷으로 설정해야 합니다. `date.toUTCString`을 사용하면 해당 포맷으로 쉽게 변경할 수 있습니다. 아래는 쿠키 유효 기간을 하루로 설정한 예시입니다:

```js
// 지금으로부터 하루 후
let date = new Date(Date.now() + 86400e3);
date = date.toUTCString();
document.cookie = "user=John; expires=" + date;
```

`expires` 옵션값을 과거로 지정하면 쿠키는 삭제됩니다.

-  **`max-age=3600`**

`expires` 옵션의 대안으로, 쿠키 만료 기간을 설정할 수 있습니다. 현재부터 만료 기간까지의 시간을 초로 환산한 값을 설정하면 됩니다.

0이나 음수값을 설정하면 쿠키는 바로 삭제됩니다: 

```js
// 쿠키는 1시간 뒤에 만료됨
document.cookie = "user=John; max-age=3600";

// 쿠키를 삭제함 (만료 기간을 현재로 지정)
document.cookie = "user=John; max-age=0";
```  

## secure

- **`secure`**

이 옵션은 오직 HTTPS 연결로만 쿠키가 전송될 수 있음을 의미합니다. 

**이 옵션이 없으면 `http://site.com`에서 설정(생성)한 쿠키는 `https://site.com`에서 읽을 수 있고, `https://site.com`에서 설정(생성)한 쿠키도 `http://site.com`에서 읽을 수 있습니다.**

쿠키는 기본적으로 도메인만 확인하지 프로토콜을 따지진 않기 때문입니다.

하지만 `secure` 옵션이 붙어있으면, `https://site.com`에서 설정한 쿠키는 `http://site.com`에서 액세스할 수 없습니다. HTTP 연결이기 때문입니다. 만약 쿠키에 민감한 콘텐츠가 저장되어 있고, 이 콘텐츠가 암호화되지 않은 HTTP 연결을 통해 전달되는걸 원치 않는다면, 이 옵션을 사용하면 됩니다.

```js
// https:// 를 통해 접근한 경우만 
// 쿠키를 설정할 수 있음(쿠키를 보호함)
document.cookie = "user=John; secure";
```  

## samesite

<<<<<<< HEAD
또 다른 보안 옵션도 있습니다. `samesite` 옵션은 크로스 사이트 요청 위조(cross-site request forgery, XSRF) 공격을 막을 때 사용합니다.

아래 공격 시나리오를 통해 이 옵션이 언제 유용한지 알아보도록 합시다.
=======
That's another security attribute `somesite`. It's designed to protect from so-called XSRF (cross-site request forgery) attacks.

To understand how it works and when it's useful, let's take a look at XSRF attacks.
>>>>>>> b300836f00536a5eb9a716ad2cbb6b8fe97c25af

### XSRF 공격

현재 `bank.com`에 로그인 중이라고 가정해 봅시다. 해당 사이트의 인증 쿠키가 브라우저에 저장되고, 브라우저는 `bank.com`에 요청을 보낼 때마다 인증 쿠키를 함께 전송할 것입니다. 서버는 전송받은 정보를 이용해 사용자를 인식하고, 보안이 필요한 재정 거래를 처리합니다.

이제, (로그아웃하지 않고) 다른 창을 띄워서 웹 서핑을 하던 도중에 우연히 `evil.com`에 접속했다 가정해 봅시다. 이 사이트엔 해커의 계정에 지급 요청을 하는 입력 필드가 있는 폼(form)인 `<form action="https://bank.com/pay">`가 있고, 이 폼은 자동으로 제출되도록 설정되어 있습니다. 

폼은 `evil.com`에서 은행 사이트로 바로 전송되고, 이 때 인증 쿠키도 함께 전송됩니다. `bank.com`에 접속할 때마다 쿠키에 저장된 정보도 같이 전송되기 때문입니다. 은행은 전송된 쿠키를 통해 당신이 접속한 것이라 생각하고 지급을 시행합니다.

![](cookie-xsrf.png)

이런 공격 형태를 크로스 사이트 요청 위조라고 부릅니다.

실제 은행은 당연히 이 공격을 막을 수 있습니다. `bank.com`이 생성한 모든 폼에는 악의적인 페이지에선 만들 수 없고, 원격 페이지에서도 추출 할 수 없는 특수 필드인 "XSRF 보호 토큰(protection token)"이 있기 때문입니다(원격 사이트는 폼을 전송할 순 있지만, 데이터를 돌려 받을 순 없을겁니다).

하지만 이런 절차는 모든 폼에 보호 토큰이 있는지 확인해야 하고, 요청 전부를 검수해야 하므로 구현에 시간이 걸린다는 단점이 있습니다.

### Enter cookie samesite option

쿠키의 `samesite` 옵션을 이용하면 "XSRF 보호 토큰" 없이도 (이론상으로) 크로스 사이트 요청 위조를 막을 수 있습니다.

이 옵션엔 두가지 값을 설정할 수 있습니다:

- **`samesite=strict`(값 없는 `samesite` 옵션과 동일함)**

사이트 외부에서 사용자가 요청을 보낼 때, `samesite=strict` 옵션이 있는 쿠키는 절대로 전송되지 않습니다. 

사용자가 수신한 메일에 있는 링크를 따라 접속했거나 `evil.com`과 같은 사이트에서 폼을 전송한 경우, 혹은 제3의 도메인에서 요청이 이루어진 경우, 쿠키가 전송되지 않습니다.

인증 쿠키에 `samesite` 옵션이 있는 경우, XSRF 공격은 절대로 성공하지 못합니다. `evil.com`에서 전송하는 요청엔 인증 쿠키가 없을 것이고, `bank.com`은 미인식 사용자에게 지급을 허용하지 않을 것이기 때문입니다.

이 보호장치는 꽤 믿을만 합니다. `bank.com`에서 오는 모든 응답은 samesite 쿠키를 설정할 것이기 때문입니다.

하지만, 약간의 불편함도 감수해야 합니다.

만약 사용자가 자신만의 노트에 유효한 `bank.com` 링크를 기록해 놓고, 이 링크를 클릭해 접속하려고 할 때 `bank.com`이 사용자를 인식하지 못하는 상황이 발생하기 때문입니다. 실제로 이런 경우, `samesite=strict` 옵션이 설정된 쿠키는 전송되지 않습니다.

두 종류의 쿠키를 사용해 이 문제를 해결할 수 있습니다. 단순히 "Hello, John"과 같은 메시지를 출력해주는 "일반 인증(general recognition)"을 위한 쿠키를 하나 만들고, 데이터 교환 시 사용하는 `samesite=strict` 옵션이 있는 쿠키를 따로 둬서 말이죠. 이렇게 쿠키 두 개를 사용하면 외부 사이트를 통해 접근한 사용자는 정상적으로 환영 메시지를 볼 수 있게 됩니다. 이후의 프로세스인 지급은 무조건 은행의 사이트를 통해서만 수행되도록 만들면 됩니다.

- **`samesite=lax`**

`samesite=lax` 사용자 경험을 해치지 않으면서 XSRF 공격을 막을 수 있는 느슨한(relaxed) 접근법입니다.

`strict` 방식과 마찬가지로 Lax 방식도 사이트 외부에서 접근할 때 브라우저가 쿠키를 보내는 걸 막아줍니다. 하지만 예외사항이 존재합니다. 

아래 두 조건이 참일 때 `samesite=lax` 쿠키가 전송합니다:
1. "안전한" HTTP 전송 방식일 때(e.g. GET 방식. POST 방식은 안됨). 

    안전한 HTTP 방식의 목록은 [RFC7231 specification](https://tools.ietf.org/html/rfc7231)에서 확인할 수 있습니다. 안전한 방식은 읽기에만 쓰이고, 데이터를 쓰는데는 사용되지 않습니다. 데이터 교환 작업도 하지 않습니다. 링크를 따라가는 행위는 항상 GET 방식이고, 안전한 방식입니다. 
    
2. 조작이 최상위 레벨 탐색에서 이루어 질 때(브라우저 주소 창에서 URL을 변경하는 경우).

    대다수는 이 조건을 충족합니다. 하지만 `<iframe>`안에서 탐색이 일어날 경우는 최상위 레벨이 아니기 때문에 이 조건을 충족하지 못합니다. AJAX 요청 또한 탐색 행위가 아니므로 이 조건에 맞지 않습니다.
    
`samesite=lax` 옵션은 대다수의 일반적인 "go to URL" 작업 시, 쿠키를 보낼 수 있도록 허용해 줍니다. 노트에 저장된 링크를 여는 것도 위 조건을 충족합니다.

하지만 외부 사이트에서 AJAX 요청을 보내거나 폼을 보내는 등의 복잡한 작업 시는 쿠키를 전송하지 못하게 합니다.

쿠키를 보내지 않아도 괜찮다면, `samesite=lax` 옵션은 사용자 경험을 해치지 않으면서 보안을 추가해주는 방법이 될 것입니다.

대개의 경우, `samesite`은 잘 작동하지만, 한가지 문제점이 있습니다:
- `samesite` 옵션은 오래된 브라우저(2017년 이전 버전)에선 지원하지 않습니다.

**따라서 오직 `samesite` 방식으로 보안 처리를 하고 있다면, 구식 브라우저는 보안 취약성의 원인이 될 것입니다.**

하지만 XSRF 토큰 같은 다른 보안 기법과 `samesite`를 함께 사용할 수 있으므로, 이 옵션은 보안을 더 강화해 줍니다. 미래에 구식 브라우저가 사라지는 때가 온다면 XSRF 토큰은 더는 필요하지 않을 것 입니다. 

## httpOnly

이 옵션은 자바스크립트와 전혀 관계가 없지만, 튜토리얼의 완성도를 높이기 위해 잠시 언급하고 언급하고 넘어가도록 하겠습니다.

웹서버에선 `Set-Cookie` 헤더를 이용해 쿠키를 설정할 수 있는데, 이때 `httpOnly` 옵션을 지정할 수 있습니다.

이 옵션은 자바스크립트 같은 클라이언트 측의 스크립트에선 쿠키를 사용할 수 없게 합니다. `document.cookie`를 통해 쿠키를 볼 수도 없고 조작할 수도 없습니다.

해커가 악의적인 자바스크립트 코드를 페이지에 삽입하고 사용자가 그 페이지에 접속하기를 기다리는 방식의 공격을 예방할 때 이 옵션을 사용합니다. 우리가 만든 사이트에 해커가 코드를 삽입하지 못하도록 막아야 하지만, 버그는 존재할 수 있기 때문에 해커가 코드를 삽입할 가능성이 있을 수 있습니다.


이런 상황이 만에 하나 발생하면, 사용자가 웹 페이지에 방문시, `document.cookie`을 볼 수 있고 조작도 할 수 있는 해커의 코드도 함께 실행 됩니다. 물론 쿠키엔 인증 정보가 있겠죠. 나쁜 상황입니다.

하지만 `httpOnly` 쿠키인 경우 `document.cookie`를 통해서 쿠키를 볼 수 없게됩니다. 쿠키를 보호할 수 있는 것이죠.

## 부록: 쿠키 함수

쿠키를 다룰 때 유용하게 사용할 수 있는 몇 가지 함수를 소개합니다. 이 함수들은 `document.cookie`를 수동으로 조작하는 것보다 좀 더 편리하게 쿠키를 다룰 수 있게 해줍니다.

유사한 기능을 하는 다양한 쿠키 라이브러리가 존재하므로, 이 코드는 데모 목적으로 봐주시면 될 것 같습니다. 데모이지만 실제 환경에서도 동작하는 코드입니다. 


### getCookie(name)

쿠키에 접근하는 가장 짧은 방법은 [정규 표현식(regular expression)](info:regular-expressions) 을 사용하는 것입니다.

`getCookie(name)` 함수는 주어진 `name`의 쿠키를 반환합니다:

```js
// 주어진 이름의 쿠키를 반환함
// 조건에 맞는 쿠키가 없다면 undefined를 반환함
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
```

위 코드에서 `new RegExp`는 `; name=<value>` 패턴을 찾기 위해 동적으로 생성됩니다.

쿠키 값은 인코딩되어있으므로, `getCookie`는 내장 함수인 `decodeURIComponent`를 이용해 쿠키 값을 디코딩 하고 있습니다.

### setCookie(name, value, options)

현재 경로를 기본으로 (`path=/`), 주어진 `name`과 `value`를 가진 쿠키를 설정합니다(다른 기본값을 추가할 수 있습니다).

```js run
function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // 다른 기본 형식을 설정할 수 있음
    ...options
  };

  if (options.expires.toUTCString) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

// Example of use:
setCookie('user', 'John', {secure: true, 'max-age': 3600});
```

### deleteCookie(name)

만료 기간을 음수로 설정하면, 쿠키를 삭제할 수 있습니다:

```js
function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}
```

```warn header="갱신이나 삭제는 동일한 도메인과 경로에서만 해야 합니다"
주의: 쿠키를 갱신하거나 삭제할 때는, 쿠키를 설정할 때 지정했던 도메인, 경로를 사용해야 합니다. 
```

함께 보면 좋은 자료: [cookie.js](cookie.js).


## 부록: 서드 파티 쿠키(third-party cookies)

사용자가 방문 중인 도메인이 아닌 다른 도메인에서 설정한 쿠키를 "서드 파티" 쿠키라고 부릅니다. 

예:
1. `site.com`의 한 페이지에서 배너(banner)를 불러옵니다. 배너는 다른 도메인 `<img src="https://ads.com/banner.png">` 에서 가져옵니다.
2. `ads.com`에 있는 원격 서버는 배너와 함께 `Set-Cookie` 헤더를 전송해 `id=1234`와 같은 쿠키를 설정하도록 합니다. 이 쿠키는 `ads.com` 도메인으로부터 기원한 것이기 때문에, `ads.com`에서만 볼 수 있습니다:

    ![](cookie-third-party.png)

3. `ads.com`에 다시 접속할 때, 원격 서버는 쿠키의 `id`로 해당 유저를 인식합니다: 

    ![](cookie-third-party-2.png)

4. 사용자가 `site.com`을 떠나 `other.com`에 접속하고, 이동한 사이트에도 배너가 있으면, `ads.com`은 쿠키를 전송받습니다. 이 쿠키는 `ads.com`에서 설정한 것이기 때문이죠. 이를 이용해 `ads.com`은 사용자를 인식하고, 이 사용자가 어떤 사이트로 이동했는지를 추적합니다:

    ![](cookie-third-party-3.png)


광고 서비스 업체에선 사용자를 추적하기 위해 서드 파티 쿠키를 오래전부터 사용하고 있습니다. 서비스의 본질 때문이죠. 이 쿠키는 쿠키를 설정한 도메인에 종속됩니다. 따라서 `ads.com`은 사용자가 어떤 사이트를 방문했는지 추적할 수 있습니다.

사람들은 추적당하는 걸 좋아하지 않습니다. 그래서 브라우저는 이런 쿠키를 비활성화 할 수 있도록 해줍니다.

여기에 더하여 몇몇 모던 브라우저는 서드 파티 쿠키를 위한 특별한 정책을 도입하였습니다:
- 사파리는 서드파티 쿠키를 전면적으로 허용하지 않습니다.
- 파이어폭스는 서드 파티 도메인 "블랙 리스트(black list)"를 만들어 리스트에 오른 도메인의 서드 파티 쿠키를 차단합니다. 


```smart
`<script src="https://google-analytics.com/analytics.js">`같은 태그로 서드 파티 도메인에서 스크립트를 읽어오고, 이 스크립트 안에 `document.cookie`로 쿠키를 설정하는 코드가 있다면, 이때 만들어진 쿠키는 서드파티 쿠키가 아닙니다.

스크립트에서 쿠키를 설정한 경우에 만들어지는 쿠키는 현재 페이지의 도메인에 속하게 됩니다. 스크립트의 유래와 상관없이 말이죠.
```

## 부록: GDPR

이 주제는 자바스크립트와 전혀 관계가 없지만, 쿠키를 설정할 때 명심해야 할 사항입니다.

EU(유럽연합)에는 사용자 개인 정보 보호를 강제하는 법령인 GDPR이 있습니다. 쿠키를 추적하는 경우 사용자로부터 명시적인 허가를 얻어야 한다는 것이 중요 요건 중 하나입니다. 

이 요건은 쿠키를 추적/식별에 관한 사항입니다.

그러므로 쿠키를 설정하고, 이 쿠키를 정보 저장의 용도로만 사용한다면 이 법령이 강제하는 사항을 지킬 필요가 없습니다. 사용자를 추적하거나 식별하지 않는다면 말이죠.

하지만, 인증 세션과 함께 쿠키를 설정하거나 id를 추적한다면 사용자의 동의를 반드시 얻어야 합니다.

웹 사이트는 다음과 같은 방법으로 GDPR에 대응합니다. 이 방법이 적용된 사이트를 분명 보았을 것이라 생각합니다:

1. 인증된 사용자에 대해서만 추적 쿠키를 설정하려는 경우

    가입 양식에 "개인 정보 취급 방침 동의" 같은 확인란을 만들고, 사용자가 이에 동의할 경우에 추적 쿠키를 설정합니다.

2. 모든 사용자를 대상으로 추적 쿠키를 설정하려는 경우

    최초 방문자에게 쿠키설정에 대한 동의를 요구하는 "작은 창"을 보여주고, 사용자가 이에 동의한 경우에만 콘텐츠를 표시하고, 추적 쿠키를 설정합니다. 새로운 방문자는 이런 절차가 번거롭다고 생각할 수 있습니다. 누구도 콘텐츠를 가리면서 "무조건 클릭해야 하는 창"을 달가워하지 않습니다. 하지만 GDPR을 준수하려면 이 창이 반드시 있어야 합니다.


GDPR은 쿠키에 대해서만 다루진 않고, 전반적인 보안 이슈에 관한 내용을 다룹니다. 자세한 사항은 이 튜토리얼의 범위를 벗어나기 때문에, 여기서 마치도록 하겠습니다.  


## 요약

`document.cookie`는 쿠키에 접근할 수 있도록 해줍니다.
- 쓰기와 관련된 조작은 접근한 쿠키에만 유효합니다.
- name과 value은 인코딩해야만 합니다.
- 쿠키 하나가 차지하는 용량은 최대 4kb까지 이고, 사이트 하나당 약 20여 개를 허용합니다(브라우저에 따라 다름).

쿠키 옵션:
- `path=/`의 기본값은 현재 경로이고, 설정한 경로에서만 쿠키를 볼 수 있도록 해줍니다. 
- `domain=site.com`의 기본 설정은 현재 도메인에서만 쿠키 정보를 얻을 수 있도록 허용합니다. 값에 명시적으로 도메인 주소가 있는 경우, 서브 도메인에서도 쿠키 정보를 얻을 수 있습니다.
- `expires/max-age` 는 쿠키의 만료 시간을 정해줍니다. 이 옵션이 없으면 브라우저가 닫힐 때 쿠키도 같이 삭제됩니다.
- `secure` 는 HTTPS 연결에서만 쿠키를 사용할 수 있게 합니다.
- `samesite` 는 요청이 외부 사이트에서 일어날 때, 브라우저가 쿠키를 보내지 못하도록 막아줍니다. XSRF 공격을 막는 데 도움을 줍니다.

추가 사항:
- 서드 파티 쿠키는 브라우저에 따라 허용되지 않을 수 있습니다. 사파리는 기본적으로 이 쿠키를 금지합니다.
- 사용자가 EU 국가 거주자인 경우, GDPR을 준수해야 합니다. 따라서, 사용자 추적 시 반드시 동의를 얻어야 합니다.