importance: 5

---

# 스팸 문자열 걸러내기

`str`에 'viagra'나 'XXX'라는 문자열이 있으면 `true`를 반환해주는 함수 `checkSpam(str)`을 만들어보세요. 해당 문자열이 없으면 `false`를 반환하면 됩니다.

함수는 대·소문자 관계없이 해당 단어를 걸러주어야 합니다.

```js
checkSpam('buy ViAgRA now') == true
checkSpam('free xxxxx') == true
checkSpam("innocent rabbit") == false
```

