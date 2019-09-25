원하는 기능을 구현하려면 배열 요소 각각을 대상으로 아래와 같은 확인작업을 진행해야 합니다.
- 새로운 배열(결과 배열)을 만들고 해당 요소가 결과 배열에 들어가 있는지 확인합니다.
- 위 조건을 만족한다면 해당 요소는 무시하고, 그렇지 않다면 해당 요소를 결과 배열에 더해줍니다.

```js run demo
function unique(arr) {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
}

let strings = ["Hare", "Krishna", "Hare", "Krishna",
  "Krishna", "Krishna", "Hare", "Hare", ":-O"
];

alert( unique(strings) ); // Hare, Krishna, :-O
```

위와 같이 작성하면 원하는 답안을 만들 순 있지만, 성능상의 문제가 있습니다.

`result.includes(str)` 메서드는 `result`를 순회하면서 각 요소와 `str`을 비교하며 일치하는 값이 있는지 검색합니다. 

`result`의 요소가 `100`개인 상황에서 `str`과 일치하는 요소가 없다면 `result.includes(str)` 메서드는 `result` 전체를 순회하면서 정확히 `100`번의 비교를 진행할 겁니다. `result`의 길이가 `10,000`이라면 `만 번`의 비교가 일어나겠죠.

자바스크립트 엔진의 속도가 상당히 빠르기 때문에 `만 번` 정도는 문제가 되진 않습니다.  

그런데 `for`문을 사용해 `arr`의 요소마다 테스트를 실행할 경우는 이야기가 달라집니다.

`arr.length`가 `10000`이면 `10000*10000`, 1억 번의 비교가 일어나기 때문이죠. 정말 큰 숫자입니다. 

따라서 위 해답은 배열의 길이가 짧을 때만 사용하시기 바랍니다.

위 해답을 어떻게 하면 최적화 할 수 있는지에 대해서는 <info:map-set> 챕터에서 다뤄보도록 하겠습니다.
