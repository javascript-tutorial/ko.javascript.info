
`setTimeout`은 현재 실행 중인 코드의 실행이 종료되었을 때 실행됩니다.

반복문 실행이 종료되고 난 후 `i`는 `100000000`이 되므로, 얼럿창엔 `100000000`이 출력됩니다.

```js run
let i = 0;

setTimeout(() => alert(i), 100); // 100000000이 출력됩니다.

// assume that the time to execute this function is >100ms
for(let j = 0; j < 100000000; j++) {
  i++; 
}
```
