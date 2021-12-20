물음표 연산자 `'?'`를 사용한 해답:

```js
function checkAge(age) {
  return (age > 18) ? true : confirm('보호자의 동의를 받으셨나요?');
}
```

OR 연산자 `||`를 사용한 해답(물음표 연산자를 사용한 해답보다 짧음):

```js
function checkAge(age) {
  return (age > 18) || confirm('보호자의 동의를 받으셨나요?');
}
```

<<<<<<< HEAD
`age > 18`을 감싸고 있는 괄호는 가독성을 높이기 위해 넣었습니다. 괄호가 없어도 동일하게 동작합니다.
=======
Note that the parentheses around `age > 18` are not required here. They exist for better readability.
>>>>>>> 8d04d0d2db97276dbb2b451c30a7bd3e05d65831
