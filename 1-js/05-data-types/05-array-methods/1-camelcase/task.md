importance: 5

---

# border-left-width를 borderLeftWidth로 변경하기

"my-short-string"같이 여러 단어를 대시(-)로 구분한 문자열을 카멜 표기법을 사용한 문자열 "myShortString"로 변경해주는 함수를 작성해보세요.

대시는 모두 지우고 각 단어의 첫 번째 글자는 대문자로 써주면 됩니다.

예시:

```js
camelize("background-color") == 'backgroundColor';
camelize("list-style-image") == 'listStyleImage';
camelize("-webkit-transition") == 'WebkitTransition';
```

힌트: `split`을 사용해 문자열을 배열로 바꾼 다음 `join`을 사용해 다시 합치면 됩니다.