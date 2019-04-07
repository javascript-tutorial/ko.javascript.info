importance: 5

---

# 주어진 숫자까지 모든 숫자를 합친다.

숫자`1 + 2 + ... + n`의 합을 계산하는 함수`sumTo (n)`을 작성하십시오.

예를들면:

```js no-beautify
sumTo(1) = 1
sumTo(2) = 2 + 1 = 3
sumTo(3) = 3 + 2 + 1 = 6
sumTo(4) = 4 + 3 + 2 + 1 = 10
...
sumTo(100) = 100 + 99 + ... + 2 + 1 = 5050
```

3 가지 솔루션 변형 만들기 :

1. for 루프 사용.
2. 재귀를 사용하면`n> 1`에 대해`sumTo (n) = n + sumTo (n-1)`이 됩니다.
3. [산술 진행](https://en.wikipedia.org/wiki/Arithmetic_progression) 공식사용.

결과의 예 :

```js
function sumTo(n) { /*... your code ... */ }

alert( sumTo(100) ); // 5050
```

P.S. 추신 어떤 솔루션 변형이 가장 빠릅니까? 가장 느린? 왜?

P.P.S. 재귀를 사용하여`sumTo (100000)`을 계산할 수 있습니까?
