`Referer`가 없는 경우가 있을 수 있기 때문에 `Origin`이 필요합니다. 예를 들어 HTTPS (높은 보안 수준에서 낮은 보안 수준에 접근)에서 HTTP 페이지를 요청하는 경우에는 `Referer`가 존재하지 않습니다. 

[콘텐츠 보안 정책](http://en.wikipedia.org/wiki/Content_Security_Policy)이 `Referer`를 전송하는 것을 금지할 수 있습니다.

`fetch`에는 `Referer` 전송을 방지할 수 있는 옵션이 있습니다. 심지어 같은 사이트 내에서 `Referer` 수정을 허용하는 옵션도 있습니다.

명세에 따르면, `Referer` 는 HTTP 헤더에서 선택 사항입니다.

`Referer`를 신뢰할 수 없기 때문에 `Origin`이 발명되었습니다. 브라우저는 크로스 오리진 요청 시 `Origin`이 제대로 전송되는 것을 보장합니다.
