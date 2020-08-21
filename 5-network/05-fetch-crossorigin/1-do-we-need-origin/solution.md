간혹 `Referer`가 없는 경우가 있기 때문에 `Origin`이 필요합니다. HTTPS 프로토콜을 사용해 HTTP 페이지를 요청하는 경우같이 보안 수준이 높은 방법을 사용해 보안 수준이 낮은 페이지에 접근할 땐 `Referer`가 없습니다.

이 외에도 [콘텐츠 보안 정책](http://en.wikipedia.org/wiki/Content_Security_Policy)이 적용돼 `Referer` 정보가 누락되는 경우도 있습니다.

`fetch` 메서드에 대해 자세히 알아보면서 아시게 되겠지만, `fetch`에는 `Referer` 전송을 막는 옵션이 있습니다. 동일한 사이트 내에서 `Referer` 수정을 허용하는 옵션도 있죠.

명세서에 따르면, `Referer`는 HTTP 헤더에서 선택 사항입니다.

이렇게 `Referer`는 신뢰할 수 없는 정보를 담고 있을 확률이 높기 때문에 명세서에 `Origin`이 추가되었습니다. 크로스 오리진 요청 시 브라우저는 `Origin`이 제대로 전송되는 것을 보장합니다.
