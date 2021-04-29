
답을 명확히 하기 위해서 함수 `makeArmy` 내부 동작을 확인해봅시다.

1. `shooters`라는 빈 배열을 생성합니다.

    ```js
    let shooters = [];
    ```
2. `shooters.push(function...)`를 통해 배열을 채웁니다.

   모든 요소는 함수이기 때문에 최종 배열은 아래 같이 생겼을 겁니다.


    ```js no-beautify
    shooters = [
      function () { alert(i); },
      function () { alert(i); },
      function () { alert(i); },
      function () { alert(i); },
      function () { alert(i); },
      function () { alert(i); },
      function () { alert(i); },
      function () { alert(i); },
      function () { alert(i); },
      function () { alert(i); }
    ];
    ```

3. 함수는 배열을 반환합니다.

이후에 `army[5]()`의 호출은 배열로부터 `army[5]`요소(요소는 함수일 것이다.)를 가져와서 호출하는 것입니다.

그렇다면 왜 결과가 모두 같은 걸까요?

이유는 `shooter` 함수들 안에는 지역변수 `i`가 없기 때문입니다. 각 함수를 호출할 때 함수는 외부 렉시컬 환경에서 `i`를 가져옵니다.

`i`의 값은 무엇일까요?

소스를 봅시다.

```js
function makeArmy() {
  ...
  let i = 0;
  while (i < 10) {
    let shooter = function() { // 함수 shooter
      alert( i ); // 수를 출력하는 부분
    };
    ...
  }
  ...
}
```

우리는 `makeArmy()`가 실행되는 시점에 연관된 렉시컬 환경이 존재하는 것을 확인할 수 있습니다. 그러나 `army[5]()`가 호출됐을 때 `makeArmy`는 이미 종료되었고 `i`는 마지막 값인 `10`(`while`이 종료된 시점의 값)을 갖습니다.

결과적으로 모든 `shooter`함수는 외부 렉시컬 환경에서 마지막 값인 `i=10`을 가져옵니다.

반복문안에서 변수를 정의하여 이 상황을 해결할 수 있습니다.

```js run demo
function makeArmy() {

  let shooters = [];

*!*
  for(let i = 0; i < 10; i++) {
*/!*
    let shooter = function() { // 함수 shooter
      alert( i ); // 수를 출력하는 부분
    };
    shooters.push(shooter);
  }

  return shooters;
}

let army = makeArmy();

army[0](); // 0
army[5](); // 5
```

이제 예상한 대로 동작합니다. `for (let i=0...) {...}`의 코드 블록이 실행될 때마다 새로운 렉시컬 환경과 이와 상응하는 `i`가 생성되기 때문입니다. 

`i`의 값은 조금 더 가까이 존재합니다. `i`는 `makeArmy()`의 렉시컬 환경이 아닌 현재 반복문에 해당하는 렉시컬 환경 안에 존재합니다. `i`의 존재 위치 차이가 함수 호출 결과가 바뀐 이유입니다.

![](lexenv-makearmy.svg)

여기서 우리는 `while`을 `for`로 다시 사용했습니다.

다른 트릭이 가능할 수 있습니다. 주제를 더 잘 이해하기 위해 살펴봅시다.

```js run
function makeArmy() {
  let shooters = [];

  let i = 0;
  while (i < 10) {
*!*
    let j = i;
*/!*
    let shooter = function() { // 함수 shooter
      alert( *!*j*/!* ); // 수를 출력하는 부분
    };
    shooters.push(shooter);
    i++;
  }

  return shooters;
}

let army = makeArmy();

army[0](); // 0
army[5](); // 5
```

`for`와 마찬가지로 `while`도 각 실행에 대해 새로운 렉시컬 환경을 생성합니다. 그렇기 때문에 여기서도 우리는 `shooter`가 올바른 값을 가지는 것을 확인할 수 있습니다.

`let j = i`는 루프 본문에서 로컬변수 `j`를 만들고 `i`의 값을 복사합니다. 원시값은 "값으로" 복사되므로 우리는 실제로 루프 반복에 속하는 완전히 독립된 복사본 `i`를 얻습니다.