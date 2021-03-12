
주석을 참고해 어떤 점이 좋지 않은지 살펴봅시다.

```js no-beautify
function pow(x,n)  // <- 인수 사이에 공백이 없음
{  // <- 별도의 줄에 있는 중괄호
  let result=1;   // <- 할당 연산자 = 앞/뒤에 공백이 없음
  for(let i=0;i<n;i++) {result*=x;}   // 비교 연산자 < 앞/뒤에 공백이 없음
  // { ... }안의 코드는 새로운 줄에 위치해야 함
  return result;
}

let x=prompt("x?",''), n=prompt("n?",'') // <-- 에러를 발생시키는 코드는 아니나,
// 두 줄로 나눠서 작성하는 게 좋고, 연산자 앞/뒤 공백과 문장 끝 ;를 넣어주는 게 좋음
if (n<=0)  // <- (n <= 0) 같이 공백을 넣는 게 좋고, 윗줄은 비워놓아야 함(세로 들여쓰기)
{   // <- 별도의 줄에 있는 중괄호
  // 아랫줄같이 가로 길이가 길어지면 가독성을 위해 코드를 여러 줄로 쪼개는 게 좋음  
  alert(`Power ${n} is not supported, please enter an integer number greater than zero`);
}
else // <- "} else {"같이 else와 중괄호는 한 줄에 작성하는 게 좋음
{
  alert(pow(x,n))  // 공백과 ; 가 없음
}
```

아래는 더 나은 스타일로 바꾼 코드입니다.

```js
function pow(x, n) {
  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}

let x = prompt("x?", "");
let n = prompt("n?", "");

if (n <= 0) {
  alert(`Power ${n} is not supported,
    please enter an integer number greater than zero`);
} else {
  alert( pow(x, n) );
}
```
