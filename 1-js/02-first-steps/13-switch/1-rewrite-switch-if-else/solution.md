`switch`와 동일한 동작을 하는 코드를 작성하려면 `if`문에서 일치 연산자 `'==='`를 써서 조건을 비교해야 합니다.

그런데 문제에선 비교하려는 값(browser) 자체가 문자열이기 때문에 동등 연산자 `'=='`를 사용해도 괜찮습니다.

```js no-beautify
if(browser == 'Edge') {
  alert("Edge를 사용하고 계시네요!");
} else if (browser == 'Chrome'
 || browser == 'Firefox'
 || browser == 'Safari'
 || browser == 'Opera') {
  alert( '저희 서비스가 지원하는 브라우저를 사용하고 계시네요.' );
} else {
  alert( '현재 페이지가 괜찮아 보이길 바랍니다!' );
}
```

해답에선 가독성을 위해 `browser == 'Chrome' || browser == 'Firefox' …`을 여러 줄에 나눠서 작성하였습니다.

가독성을 고려해 작성하였더라도 `switch`문을 이용한 코드가 더 깔끔하고 기술적(descriptive)이라는 것을 느끼셨을 겁니다.
