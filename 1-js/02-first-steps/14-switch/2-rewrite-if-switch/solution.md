첫 번째와 두 번째 `if`문은 각각 하나의 `case`문으로 대체할 수 있습니다. 세 번째 `if`문은 두 개의 `case`문으로 쪼개 작성할 수 있습니다.

```js run
let a = +prompt('a?', '');

switch (a) {
  case 0:
    alert( 0 );
    break;

  case 1:
    alert( 1 );
    break;

  case 2:
  case 3:
    alert( '2,3' );
*!*
    break;
*/!*
}
```

맨 아래 줄에 있는 `break`문은 없어도 괜찮습니다. 해답에선 추후에 `case`문이 추가될 경우를 대비하여 `break`문을 추가하였습니다.

미래에 조건을 하나 더 추가해야 하는 상황이 생길 수 있습니다. 이런 식으로 `break`문을 넣어주는 습관을 들이면 혹시라도 발생할 수 있는 에러를 방지할 수 있습니다. `case 4`를 위 `switch`문에 추가했는데 `case 3`에 `break`문이 없다면 에러가 발생하기 때문입니다. 
