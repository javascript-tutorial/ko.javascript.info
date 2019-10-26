importance: 5

---

# 'if..else'를 '?'로 교체하기

조건부 연산자 `'?'`를 사용해 `if..else`문이 사용된 아래 코드를 변형해보세요. 동작 결과는 동일해야 합니다. 

가독성을 위해 표현식을 여러 줄로 분할해 작성해 보시길 바랍니다.

```js
let message;

if (login == '직원') {
  message = '안녕하세요.';
} else if (login == '임원') {
  message = '환영합니다.';
} else if (login == '') {
  message = '로그인이 필요합니다.';
} else {
  message = '';
}
```
