
`async/await`가 내부에서 어떻게 동작하는지 알아야 문제를 풀 수 있습니다.

`async` 함수를 호출하면 프라미스가 반환되므로, `.then`을 붙이면 됩니다.
```js run
async function wait() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return 10;
}

function f() {
  // shows 10 after 1 second
*!*
  wait().then(result => alert(result));
*/!*
}

f();
```
