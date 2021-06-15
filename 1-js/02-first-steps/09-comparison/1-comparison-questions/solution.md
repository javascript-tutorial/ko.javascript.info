

```js no-beautify
5 > 4 → true
"apple" > "pineapple" → false
"2" > "12" → true
undefined == null → true
undefined === null → false
null == "\n0\n" → false
null === +"\n0\n" → false
```

해설:

<<<<<<< HEAD
1. 명백히 true입니다.
2. 문자열의 비교는 사전순서가 기준이므로 false입니다.  `"a"`는 `"p"`보다 작습니다.
3. 두 피연산자는 문자열이므로, 사전순으로 비교가 이뤄집니다. 왼쪽 피연산자의 첫 번째 글자 `"2"`는 오른쪽 피연산자의 첫 번째 글자 `"1"`보다 큽니다.
4. `null`과 `undefined`는 같습니다.
5. 일치 연산자는 형도 체크합니다. 형이 다르면 false가 반환됩니다.
6. (4)와 유사한 문제입니다. `null`은 오직 `undefined`와 같습니다.
7. 형이 다르므로 false가 반환됩니다.
=======
1. Obviously, true.
2. Dictionary comparison, hence false. `"a"` is smaller than `"p"`.
3. Again, dictionary comparison, first char `"2"` is greater than the first char `"1"`.
4. Values `null` and `undefined` equal each other only.
5. Strict equality is strict. Different types from both sides lead to false.
6. Similar to `(4)`, `null` only equals `undefined`.
7. Strict equality of different types.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
