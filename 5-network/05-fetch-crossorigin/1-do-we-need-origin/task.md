중요도: 5

---

# 왜 오리진이 필요할까요?

아시다시피 HTTP 헤더 `Referer`는 주로 네트워크 요청을 처음 시작한 페이지의 url을 담고 있습니다.

예를 들어 `http://javascript.info/some/url`에서 `http://google.com`에 요청을 보낼 때, 헤더의 모습은 다음과 같습니다.

```
Accept: */*
Accept-Charset: utf-8
Accept-Encoding: gzip,deflate,sdch
Connection: keep-alive
Host: google.com
*!*
Origin: http://javascript.info
Referer: http://javascript.info/some/url
*/!*
```

보다시피 `Referer` 와 `Origin`이 모두 존재합니다.

질문:

1. `Referer`가 더 많은 정보를 갖고 있을 때, `Origin`이 왜 필요할까요?
2. `Referer` 또는 `Origin`이 존재하지 않는 경우가 가능할까요, 가능하지 않을까요?
