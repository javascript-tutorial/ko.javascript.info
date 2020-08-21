importance: 5

---

# 왜 오리진이 필요할까요

HTTP 헤더를 구성하는 `Referer`는 주로 네트워크 요청을 처음 시작한 페이지의 url 정보를 담고 있습니다.

`http://javascript.info/some/url`에서 `http://google.com`에 요청을 보냈다고 가정해봅시다. 이 때 헤더는 다음과 같습니다.

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

보다시피 헤더에 `Referer`와 `Origin` 정보가 모두 들어가 있습니다.

이때 이런 의문이 떠오를 수 있습니다.

1. `Referer`에 더 많은 정보가 있을 수 있는데 왜 `Origin`을 따로 두었을까?
2. 헤더에 `Referer`나 `Origin`이 없을 수도 있을 텐데 이런 경우엔 어떤 일이 발생할까?
