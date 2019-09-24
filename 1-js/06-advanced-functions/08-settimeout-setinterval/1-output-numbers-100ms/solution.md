
`setInterval`을 이용한 방법:

```js run
function printNumbers(from, to) {
  let current = from;

  let timerId = setInterval(function() {
    alert(current);
    if (current == to) {
      clearInterval(timerId);
    }
    current++;
  }, 1000);
}

// usage:
printNumbers(5, 10);
```

중첩 `setTimeout`을 이용한 방법:


```js run
function printNumbers(from, to) {
  let current = from;

  setTimeout(function go() {
    alert(current);
    if (current < to) {
      setTimeout(go, 1000);
    }
    current++;
  }, 1000);
}

// usage:
printNumbers(5, 10);
```

두 방법 모두에서 최초 호출 이전에(첫 번째 얼럿 창이 뜨기 전에) `1000ms`의 지연 간격을 두었다는 점에 주목해주시기 바랍니다. 

초기 지연시간 없이 함수를 바로 실행하려면 아래와 같이 별도의 줄에서 함수를 호출해줘야 합니다. 

```js run
function printNumbers(from, to) {
  let current = from;

  function go() {
    alert(current);
    if (current == to) {
      clearInterval(timerId);
    }
    current++;
  }

*!*
  go();
*/!*
  let timerId = setInterval(go, 1000);
}

printNumbers(5, 10);
```
