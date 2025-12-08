
```js no-beautify
"" + 1 + 0 = "10" // (1)
"" - 1 + 0 = -1 // (2)
true + false = 1
6 / "3" = 2
"2" * "3" = 6
4 + 5 + "px" = "9px"
"$" + 4 + 5 = "$45"
"4" - 2 = 2
"4px" - 2 = NaN
"  -9  " + 5 = "  -9  5" // (3)
"  -9  " - 5 = -14 // (4)
null + 1 = 1 // (5)
undefined + 1 = NaN // (6)
" \t \n" - 2 = -2 // (7)
```

<<<<<<< HEAD
1. 피 연산자 중 하나가 문자열인 `"" + 1`에서 `1`은 문자형으로 변환됩니다. 따라서 공백과 문자열 1을 더한, `"" + 1 = "1"`과 같은 효과를 발휘하죠. 그다음 연산 `"1" + 0`에도 같은 규칙이 적용됩니다. 
2. 뺄셈 연산자 `-`는 기타 수학 연산자처럼 숫자형만을 인수로 받습니다. 빈 문자열 `""`는 숫자 `0`으로 변환되기 때문에 결과는 `-1`이 됩니다.
3. 피 연산자 중 하나가 문자열이므로 숫자 5가 문자열로 변환됩니다.
4. 뺄셈 연산자는 인수를 숫자형으로 변화시키므로 `"  -9  "`는 숫자 `-9`로 변합니다. 앞, 뒤 공백은 제거되죠.
5. 숫자형으로 변환 시 `null`은 `0`이 됩니다.
6. `undefined`는 숫자형으로 변환시 `NaN`이 됩니다.
7. 문자열이 숫자형으로 변할 땐 문자열 앞뒤의 공백이 삭제됩니다. 뺄셈 연산자 앞의 피연산자는 공백을 만드는 문자 `\t`와 `\n`, 그 사이의 "일반적인" 공백으로 구성됩니다. 따라서 `" \t \n"`는 숫자형으로 변환 시 길이가 `0`인 문자열로 취급되어 숫자 `0`이 됩니다. 
=======
1. The addition with a string `"" + 1` converts `1` to a string: `"" + 1 = "1"`, and then we have `"1" + 0`, the same rule is applied.
2. The subtraction `-` (like most math operations) only works with numbers, it converts an empty string `""` to `0`.
3. The addition with a string appends the number `5` to the string.
4. The subtraction always converts to numbers, so it makes `"  -9  "` a number `-9` (ignoring spaces around it).
5. `null` becomes `0` after the numeric conversion.
6. `undefined` becomes `NaN` after the numeric conversion.
7. Space characters are trimmed off string start and end when a string is converted to a number. Here the whole string consists of space characters, such as `\t`, `\n` and a "regular" space between them. So, similarly to an empty string, it becomes `0`.
>>>>>>> d78b01e9833009fab534462e05c03cffc51bf0e3
