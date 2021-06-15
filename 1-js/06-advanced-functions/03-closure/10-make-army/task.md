importance: 5

---

# 함수를 사용해 군대 만들기

아래 코드는 `shooters`가 요소인 배열을 만들어줍니다.

모든 함수는 몇 번째 shooter인지 출력해줘야 하는데 뭔가 잘못되었습니다.

```js run
function makeArmy() {
  let shooters = [];

  let i = 0;
  while (i < 10) {
<<<<<<< HEAD
    let shooter = function() { // shooter 함수
      alert( i ); // 몇 번째 shooter인지 출력해줘야 함
=======
    let shooter = function() { // create a shooter function,
      alert( i ); // that should show its number
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c
    };
    shooters.push(shooter); // and add it to the array
    i++;
  }

  // ...and return the array of shooters
  return shooters;
}

let army = makeArmy();

<<<<<<< HEAD
army[0](); // 0번째 shooter가 10을 출력함
army[5](); // 5번째 shooter 역시 10을 출력함
// 모든 shooter가 자신의 번호 대신 10을 출력하고 있음
```

왜 모든 shooter가 동일한 숫자를 출력하는 걸까요? 제대로 된 번호가 출력될 수 있게 코드를 수정해 보세요.
=======
*!*
// all shooters show 10 instead of their numbers 0, 1, 2, 3...
army[0](); // 10 from the shooter number 0
army[1](); // 10 from the shooter number 1
army[2](); // 10 ...and so on.
*/!*
```

Why do all of the shooters show the same value? 

Fix the code so that they work as intended.
>>>>>>> fb4fc33a2234445808100ddc9f5e4dcec8b3d24c

