importance: 5

---

# 주어진 숫자까지의 모든 숫자 더하기

숫자 `1 + 2 + ... + n`을 계산하는 함수 `sumTo (n)`을 만들어보세요.

예시:

```js no-beautify
sumTo(1) = 1
sumTo(2) = 2 + 1 = 3
sumTo(3) = 3 + 2 + 1 = 6
sumTo(4) = 4 + 3 + 2 + 1 = 10
...
sumTo(100) = 100 + 99 + ... + 2 + 1 = 5050
```

아래 방법을 사용해 세 가지 답안을 만들어보세요.

1. for 반복문 사용하기
2. 재귀 사용하기(`n > 1`일 때 `sumTo(n) = n + sumTo(n-1)`)
3. [등차수열](https://en.wikipedia.org/wiki/Arithmetic_progression) 공식 사용하기

예시:

```js
function sumTo(n) { /*... 답안은 여기에 작성 ... */ }

alert( sumTo(100) ); // 5050
```

더 생각해보기 1: 세 가지 방법 중 어떤 방법이 가장 빠른가요? 어떤 방법이 가장 느린가요? 이유도 함께 제시해주세요.

더 생각해보기 2: 재귀를 사용해 `sumTo (100000)`를 계산할 수 있을까요?
