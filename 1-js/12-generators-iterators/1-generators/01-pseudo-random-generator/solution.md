```js run demo
function* pseudoRandom(seed) {
  let value = seed;

  while(true) {
    value = value * 16807 % 2147483647
    yield value;
  }

};

let generator = pseudoRandom(1);

alert(generator.next().value); // 16807
alert(generator.next().value); // 282475249
alert(generator.next().value); // 1622650073
```

다음과 같이 일반 함수를 사용하여 동일한 작업을 수행 할 수 있음에 유의하세요.

```js run
function pseudoRandom(seed) {
  let value = seed;

  return function() {
    value = value * 16807 % 2147483647;
    return value;
  }
}

let generator = pseudoRandom(1);

alert(generator()); // 16807
alert(generator()); // 282475249
alert(generator()); // 1622650073
```

일반 함수 또한 제너레이터와 같은 기능을 수행합니다. 그러나 일반 함수는 `for..of`을 이용해 반복하여 다른 곳에서 유용할 수 있는 제너레이터 구성 사용 능력을 잃게 합니다.
