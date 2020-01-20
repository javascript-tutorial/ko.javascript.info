
# 화살표 함수로 변경하기

<<<<<<< HEAD:1-js/02-first-steps/15-function-expressions-arrows/1-rewrite-arrow/task.md
함수 표현식을 사용해 만들어진 함수를 화살표 함수로 바꿔보세요.
=======
Replace Function Expressions with arrow functions in the code below:
>>>>>>> db3b3f8e7a08c153ad8fa0ae50633cdf95fa8912:1-js/02-first-steps/16-arrow-functions-basics/1-rewrite-arrow/task.md

```js run
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

ask(
  "동의하십니까?",
  function() { alert("동의하셨습니다."); },
  function() { alert("취소 버튼을 누르셨습니다."); }
);
```
