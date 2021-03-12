importance: 4

---

# "if"문을 "switch"문으로 변환하기

아래 코드를 `switch`문을 사용한 코드로 바꿔보세요. switch문은 하나만 사용해야 합니다.

```js run
let a = +prompt('a?', '');

if (a == 0) {
  alert( 0 );
}
if (a == 1) {
  alert( 1 );
}

if (a == 2 || a == 3) {
  alert( '2,3' );
}
```

