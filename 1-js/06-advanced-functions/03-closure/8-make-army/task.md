importance: 5

---
# 기능의 군대들
다음 코드는 `shooters` 배열을 만듭니다.

모든 함수는 숫자를 출력합니다. 그러나 뭔가 잘못되었습니다 ...

```js run
function makeArmy() {
  let shooters = [];

  let i = 0;
  while (i < 10) {
    let shooter = function() { // shooter function
      alert( i ); // should show its number
    };
    shooters.push(shooter);
    i++;
  }

  return shooters;
}

let army = makeArmy();

army[0](); // the shooter number 0 shows 10
army[5](); // and number 5 also outputs 10...
// ... all shooters show 10 instead of their 0, 1, 2, 3...
```

왜 모든 shooters 는 똑같아 보일까요? 코드를 고쳐서 의도한대로 동작하게 해보세요.
