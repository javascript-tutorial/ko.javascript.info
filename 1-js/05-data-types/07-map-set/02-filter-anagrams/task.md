importance: 4

---

# 애너그램 걸러내기

[애너그램(어구전철)](https://ko.wikipedia.org/wiki/어구전철)은 단어나 문장을 구성하고 있는 문자의 순서를 바꾸어 다른 단어나 문장을 만드는 놀이입니다.

예시:

```
nap - pan
ear - are - era
cheaters - hectares - teachers
```

애너그램으로 만든 단어를 걸러내는 함수 `aclean(arr)`을 만들어보세요.

예시:

```js
let arr = ["nap", "teachers", "cheaters", "PAN", "ear", "era", "hectares"];

alert( aclean(arr) ); // "nap,teachers,ear"나 "PAN,cheaters,era"이 출력되어야 합니다.
```

애너그램 그룹에서 한 단어는 남아있어야 합니다.

