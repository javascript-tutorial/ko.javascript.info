대·소문자 관계없이 스팸 문자열을 확인하려면 인수로 받은 문자열을 구성하는 문자를 모두 소문자로 바꾼 후 작업해야 합니다.

```js run demo
function checkSpam(str) {
  let lowerStr = str.toLowerCase();

  return lowerStr.includes('viagra') || lowerStr.includes('xxx');
}

alert( checkSpam('buy ViAgRA now') );
alert( checkSpam('free xxxxx') );
alert( checkSpam("innocent rabbit") );
```

